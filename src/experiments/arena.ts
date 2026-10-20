import { getModule } from "@/algorithms/registry";
import { runAlgorithm } from "@/algorithms/run";
import { createRng, type Rng } from "@/lib/random";

/**
 * Arena experiments: run several algorithms on identical, seeded inputs and record
 * operation counts (deterministic) and wall-clock time (noisy, environment-dependent).
 *
 * Counts come from the tracer in "count" mode, i.e. from the same instrumented code
 * the visualizer replays, so a comparison counted here is a comparison you can watch.
 */

export const DISTRIBUTIONS = [
  { id: "random", label: "Random", description: "Uniform random integers in [0, n)." },
  { id: "sorted", label: "Sorted", description: "0, 1, …, n − 1." },
  { id: "reversed", label: "Reversed", description: "n − 1, …, 1, 0." },
  {
    id: "nearly",
    label: "Nearly sorted",
    description: "Sorted, then ⌈n/20⌉ random adjacent swaps.",
  },
  { id: "few-unique", label: "Few unique values", description: "Random integers in [0, 4]." },
] as const;
export type DistributionId = (typeof DISTRIBUTIONS)[number]["id"];

export const SORTING_ALGORITHMS = [
  "bubble-sort",
  "insertion-sort",
  "merge-sort",
  "quick-sort",
] as const;
export type SortingAlgorithmId = (typeof SORTING_ALGORITHMS)[number];

export const SIZE_OPTIONS = [8, 16, 32, 64, 128, 256, 512, 1024, 2048] as const;

export interface ExperimentConfig {
  algorithms: SortingAlgorithmId[];
  distribution: DistributionId;
  /** Largest input size; sizes are powers of two from 8 up to this. */
  maxSize: number;
  seed: number;
  /** Timed repetitions per cell (after one warm-up run). */
  repetitions: number;
}

export interface ExperimentRow {
  algorithm: SortingAlgorithmId;
  n: number;
  comparisons: number;
  swaps: number;
  writes: number;
  /** Element moves: each swap writes two positions, each write one. */
  moves: number;
  /** Median wall-clock milliseconds of the instrumented run. */
  medianMs: number;
  correct: boolean;
}

export const DEFAULT_CONFIG: ExperimentConfig = {
  algorithms: [...SORTING_ALGORITHMS],
  distribution: "random",
  maxSize: 512,
  seed: 20261020,
  repetitions: 3,
};

export function sizesUpTo(maxSize: number): number[] {
  return SIZE_OPTIONS.filter((n) => n <= maxSize);
}

/** The input for (distribution, n, seed). Identical for every algorithm in a run. */
export function generateInput(distribution: DistributionId, n: number, seed: number): number[] {
  // Derive a per-size seed so adding a size does not change the others.
  const rng: Rng = createRng((seed ^ Math.imul(n, 0x9e3779b1)) >>> 0);
  switch (distribution) {
    case "random":
      return Array.from({ length: n }, () => rng.int(0, n - 1));
    case "sorted":
      return Array.from({ length: n }, (_, i) => i);
    case "reversed":
      return Array.from({ length: n }, (_, i) => n - 1 - i);
    case "nearly": {
      const a = Array.from({ length: n }, (_, i) => i);
      for (let k = 0; k < Math.ceil(n / 20); k++) {
        const i = rng.int(0, Math.max(0, n - 2));
        if (i + 1 < n) [a[i], a[i + 1]] = [a[i + 1]!, a[i]!];
      }
      return a;
    }
    case "few-unique":
      return Array.from({ length: n }, () => rng.int(0, 4));
  }
}

function median(values: number[]): number {
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid]! : (s[mid - 1]! + s[mid]!) / 2;
}

/** Run one (algorithm, n) cell. Pure apart from reading the clock. */
export function runCell(
  config: ExperimentConfig,
  algorithm: SortingAlgorithmId,
  n: number,
): ExperimentRow {
  const module = getModule(algorithm);
  if (!module) throw new Error(`unknown algorithm ${algorithm}`);
  const input = generateInput(config.distribution, n, config.seed);
  // Warm-up: lets the JIT compile the hot paths before timing.
  const first = runAlgorithm(module, [...input], { mode: "count" });
  const times: number[] = [];
  for (let r = 0; r < Math.max(1, config.repetitions); r++) {
    const copy = [...input];
    const start = performance.now();
    runAlgorithm(module, copy, { mode: "count" });
    times.push(performance.now() - start);
  }
  const c = first.trace.meta.counters;
  const swaps = c.swaps ?? 0;
  const writes = c.writes ?? 0;
  return {
    algorithm,
    n,
    comparisons: c.comparisons ?? 0,
    swaps,
    writes,
    moves: writes + 2 * swaps,
    medianMs: median(times),
    correct: module.check(input, first.output) === null,
  };
}

/** All cells of an experiment, in a stable order, as a list of thunks (for chunked execution). */
export function experimentCells(config: ExperimentConfig): (() => ExperimentRow)[] {
  return sizesUpTo(config.maxSize).flatMap((n) =>
    config.algorithms.map((a) => () => runCell(config, a, n)),
  );
}

/* ------------------------------------------------- shareable configuration */

export function encodeConfig(config: ExperimentConfig): string {
  const p = new URLSearchParams({
    alg: config.algorithms.join(","),
    dist: config.distribution,
    max: String(config.maxSize),
    seed: String(config.seed),
    reps: String(config.repetitions),
  });
  return p.toString();
}

/** Parse a configuration from URL parameters, falling back to defaults field by field. */
export function decodeConfig(params: Record<string, string | undefined>): ExperimentConfig {
  const algs = (params.alg ?? "")
    .split(",")
    .filter((a): a is SortingAlgorithmId => (SORTING_ALGORITHMS as readonly string[]).includes(a));
  const dist = DISTRIBUTIONS.find((d) => d.id === params.dist)?.id;
  const max = Number(params.max);
  const seed = Number(params.seed);
  const reps = Number(params.reps);
  return {
    algorithms: algs.length > 0 ? [...new Set(algs)] : DEFAULT_CONFIG.algorithms,
    distribution: dist ?? DEFAULT_CONFIG.distribution,
    maxSize: (SIZE_OPTIONS as readonly number[]).includes(max) ? max : DEFAULT_CONFIG.maxSize,
    seed: Number.isInteger(seed) && seed >= 0 && seed < 2 ** 32 ? seed : DEFAULT_CONFIG.seed,
    repetitions:
      Number.isInteger(reps) && reps >= 1 && reps <= 9 ? reps : DEFAULT_CONFIG.repetitions,
  };
}

export function toCsv(rows: ExperimentRow[]): string {
  const head = "algorithm,n,comparisons,swaps,writes,moves,median_ms,correct";
  return [
    head,
    ...rows.map((r) =>
      [
        r.algorithm,
        r.n,
        r.comparisons,
        r.swaps,
        r.writes,
        r.moves,
        r.medianMs.toFixed(3),
        r.correct,
      ].join(","),
    ),
  ].join("\n");
}
