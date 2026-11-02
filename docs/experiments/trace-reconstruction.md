# Experiment: trace reconstruction strategy

**Hypothesis.** Storing only semantic events on the wire and keeping in-memory keyframes every ⌈√N⌉ events gives near-snapshot seek latency at a small fraction of snapshot memory.

**Setup.** `npm run bench:trace` ([`scripts/bench-trace.ts`](../../scripts/bench-trace.ts)). Bubble sort on reversed input (its worst case: every comparison swaps), the longest traces per element of the shipped algorithms. Node 22.22, Linux x64, container CPU; `--expose-gc` for heap deltas. 300 random seek targets from a fixed seed.

**Variables.** Keyframe interval K: 1 (A: snapshot every event), 16, 64, ⌈√N⌉ (C: default), ∞ (B: replay from start).

**Controls.** Same trace object for every strategy; warm-up run before timing generation; GC before and after heap measurement.

## Results (one run, 2026-10-20)

Trace size and generation:

| n   | events | generate (ms) | JSON       | gzip     | JSON without narration | validate + replay (ms) |
| --- | ------ | ------------- | ---------- | -------- | ---------------------- | ---------------------- |
| 10  | 111    | 0.23          | 11.1 KB    | 1.3 KB   | 6.0 KB                 | 3.22                   |
| 40  | 1,641  | 2.68          | 161.0 KB   | 11.9 KB  | 86.3 KB                | 15.64                  |
| 100 | 10,101 | 9.58          | 993.4 KB   | 70.7 KB  | 534.4 KB               | 61.96                  |
| 200 | 40,201 | 29.43         | 4,032.7 KB | 346.0 KB | 2,152.6 KB             | 143.84                 |
| 300 | 90,301 | 101.12        | 9,152.1 KB | 889.1 KB | 4,874.3 KB             | 270.71                 |

Reconstruction, n = 300 (N = 90,301 events):

| strategy                      | build (ms) | keyframes | retained heap | random seek p50 / p99 (ms) | step back p50 (ms) |
| ----------------------------- | ---------- | --------- | ------------- | -------------------------- | ------------------ |
| A. snapshot every event (K=1) | 12,433     | 90,302    | 711,213 KB    | 0.296 / 0.823              | 0.156              |
| C. K=16                       | 705        | 5,644     | 44,443 KB     | 0.168 / 0.684              | 0.164              |
| C. K=64                       | 270        | 1,411     | 11,105 KB     | 0.360 / 0.487              | 0.349              |
| **C. K=⌈√N⌉=301 (default)**   | **74**     | **301**   | **2,384 KB**  | **0.371 / 0.502**          | **0.370**          |
| B. replay from start (K=∞)    | 34         | 1         | 12 KB         | 12.205 / 38.037            | 19.744             |

Sequential forward playback with the default strategy: 90,301 steps in 21.7 s ≈ **240 µs per step**.

## Interpretation

- Full snapshots are not viable: 711 MB and 12 s to build for one large trace, for a seek improvement users cannot perceive (0.30 vs 0.37 ms).
- Pure replay is cheap to build but a 20 ms backward step at N = 90k is noticeable during scrubbing and grows linearly with N.
- The √N hybrid is within 0.1 ms of snapshots on seeks while using 0.3% of their memory. Seek cost and memory both grow as O(√N).
- Per-step cost (240 µs, dominated by two `structuredClone`s of a 300-element state) is ~130× below the 31 ms frame budget at the fastest playback speed (32 steps/s). **No optimisation is warranted**; the double clone is kept because it makes returned states safe to mutate.
- Narration (`note`, `vars`) is ~47% of uncompressed size. gzip reduces traces ~10×. Neither matters for in-browser traces (they are never transferred), but stored or shared traces should be compressed.

## Limitations

- Single run on a shared container; timings vary by roughly ±30% between runs (generation for n = 300 measured 101–102 ms and validation 270–403 ms across two runs). Ratios between strategies are stable; absolute numbers are indicative only.
- Heap deltas include allocator noise of a few hundred KB.
- One workload. Graph traces have larger states (more per-clone cost) but far fewer events for the visualizer's input limits (≤ 26 nodes).
- Browser memory and rendering time are not measured here; rendering cost is bounded by input limits (≤ 40 bars, ≤ 26 nodes).

## Decision

Keep the √N hybrid as the default ([ADR-0002](../decisions/0002-trace-protocol.md)). Revisit if traces beyond ~10⁶ events are allowed (then consider snapshot deltas or a worker-side player), or if stored traces are introduced (then add compression).
