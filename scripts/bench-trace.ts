/**
 * Trace architecture experiment (docs/experiments/trace-reconstruction.md).
 *
 * Question: how should the player reconstruct state at an arbitrary position?
 *   A. full snapshot at every event        (keyframeInterval = 1)
 *   B. pure event replay from the start    (keyframeInterval = ∞)
 *   C. hybrid: keyframe every K events     (K = 16, 64, and the default ⌈√N⌉)
 *
 * Workload: bubble sort on reversed input (its worst case: every comparison swaps),
 * which gives the longest traces per element of any shipped algorithm.
 *
 * Run: npm run bench:trace   (uses --expose-gc for heap measurements)
 */
import { gzipSync } from "node:zlib";
import { bubbleSort } from "@/algorithms/sorting/bubble-sort";
import { runAlgorithm } from "@/algorithms/run";
import { TracePlayer } from "@/engine/player";
import { validateTrace } from "@/engine/validate";
import { createRng } from "@/lib/random";

const gc = (globalThis as { gc?: () => void }).gc;

function heapUsed(): number {
  gc?.();
  gc?.();
  return process.memoryUsage().heapUsed;
}

function time<T>(fn: () => T): { value: T; ms: number } {
  const start = performance.now();
  const value = fn();
  return { value, ms: performance.now() - start };
}

function percentile(sorted: number[], p: number): number {
  return sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))]!;
}

const fmt = (v: number, digits = 2) => v.toFixed(digits);
const kb = (bytes: number) => `${fmt(bytes / 1024, 1)} KB`;

console.log(
  `Node ${process.version}, ${process.platform}/${process.arch}; gc exposed: ${Boolean(gc)}\n`,
);

console.log("## Trace size and generation (bubble sort, reversed input)\n");
console.log(
  "| n | events | generate (ms) | JSON | gzip | JSON without narration | validate+replay (ms) |",
);
console.log("|---|---|---|---|---|---|---|");
const sizes = [10, 40, 100, 200, 300];
const traces = new Map<number, ReturnType<typeof runAlgorithm>["trace"]>();
for (const n of sizes) {
  const input = Array.from({ length: n }, (_, i) => n - i);
  runAlgorithm(bubbleSort, input, { maxEvents: 200_000 }); // warm-up
  const gen = time(() => runAlgorithm(bubbleSort, input, { maxEvents: 200_000 }).trace);
  const trace = gen.value;
  traces.set(n, trace);
  const json = JSON.stringify(trace);
  // How much of the size is human narration rather than semantics?
  const bare = JSON.stringify({
    ...trace,
    events: trace.events.map(({ note: _n, vars: _v, ...e }) => e),
  });
  const val = time(() => validateTrace(JSON.parse(json)));
  if (!val.value.ok) throw new Error("validation failed");
  console.log(
    `| ${n} | ${trace.events.length} | ${fmt(gen.ms)} | ${kb(json.length)} | ${kb(gzipSync(json).length)} | ${kb(bare.length)} | ${fmt(val.ms)} |`,
  );
}

console.log("\n## Reconstruction strategies (n = 300, the largest trace)\n");
const trace = traces.get(300)!;
const N = trace.events.length;
const strategies: [string, number][] = [
  ["A. snapshot every event (K=1)", 1],
  ["C. hybrid K=16", 16],
  ["C. hybrid K=64", 64],
  [`C. hybrid K=⌈√N⌉=${Math.ceil(Math.sqrt(N))} (default)`, Math.ceil(Math.sqrt(N))],
  ["B. replay from start (K=∞)", N + 1],
];
const rng = createRng(42);
const seeks = Array.from({ length: 300 }, () => rng.int(0, N));

console.log(
  "| strategy | build (ms) | keyframes | retained heap | random seek p50 / p99 (ms) | step back p50 (ms) |",
);
console.log("|---|---|---|---|---|---|");
for (const [label, k] of strategies) {
  const before = heapUsed();
  const build = time(() => new TracePlayer(trace, { keyframeInterval: k }));
  const player = build.value;
  const retained = heapUsed() - before;

  const seekTimes: number[] = [];
  for (const p of seeks) seekTimes.push(time(() => player.stateAt(p)).ms);
  seekTimes.sort((a, b) => a - b);

  // Stepping backwards from random positions: each step is a fresh seek to p - 1.
  const backTimes: number[] = [];
  for (const p of seeks.slice(0, 100)) {
    player.stateAt(p);
    backTimes.push(time(() => player.stateAt(Math.max(0, p - 1))).ms);
  }
  backTimes.sort((a, b) => a - b);
  console.log(
    `| ${label} | ${fmt(build.ms)} | ${player.keyframeCount} | ${kb(retained)} | ${fmt(percentile(seekTimes, 0.5), 3)} / ${fmt(percentile(seekTimes, 0.99), 3)} | ${fmt(percentile(backTimes, 0.5), 3)} |`,
  );
}

console.log("\n## Sequential forward playback cost per step (default strategy)\n");
{
  const player = new TracePlayer(trace);
  const t = time(() => {
    for (let p = 0; p <= N; p++) player.stateAt(p);
  });
  console.log(`${N} steps in ${fmt(t.ms)} ms → ${fmt((t.ms / N) * 1000, 1)} µs per step`);
}
