import type { TraceState } from "@/engine/state";
import type { AlgorithmModule } from "../types";
import { clamp, randomNumbers, searchInput, type SearchInput } from "../inputs";

export interface WindowOutput {
  /** Length of the shortest window with sum ≥ target; 0 when none exists. */
  length: number;
  /** Start index of the first shortest window found, or −1. */
  start: number;
}

const LIMITS = { minLength: 1, maxLength: 20, min: 1, max: 99 };

const spec = searchInput({
  limits: LIMITS,
  sorted: false,
  presets: [
    { id: "classic", label: "Target 7", value: { values: [2, 3, 1, 2, 4, 3], target: 7 } },
    { id: "single", label: "One element is enough", value: { values: [1, 4, 4], target: 4 } },
    { id: "none", label: "No window reaches it", value: { values: [1, 1, 1, 1], target: 11 } },
  ],
});

/**
 * Variable-size sliding window: the shortest contiguous subarray whose sum is at
 * least the target, for positive numbers. The right end grows the window; whenever
 * the sum is large enough, the left end shrinks it. Each index enters and leaves once.
 */
export const slidingWindow: AlgorithmModule<SearchInput, WindowOutput> = {
  id: "sliding-window",
  version: 1,
  pseudocode: [
    "procedure shortestWindow(A, target)   // all A[i] > 0",
    "  L ← 0;  sum ← 0;  best ← ∞",
    "  for R ← 0 to n − 1",
    "    sum ← sum + A[R]   // grow the window to the right",
    "    while sum ≥ target",
    "      best ← min(best, R − L + 1)",
    "      sum ← sum − A[L];  L ← L + 1   // shrink it from the left",
    "  return best (0 if it is still ∞)",
  ],
  input: {
    ...spec,
    constraints:
      "1–20 whole numbers from 1 to 99 (positive, so growing the window never lowers its sum); integer target.",
    random(rng, size) {
      const n = clamp(size ?? 8, 1, LIMITS.maxLength);
      const values = randomNumbers(rng, n, 1, 9);
      const total = values.reduce((a, b) => a + b, 0);
      return { values, target: rng.int(1, total + 3) };
    },
  },

  run(input, t) {
    const { values, target } = input;
    const n = values.length;
    const A = t.array("A", values, { label: "A" });
    let L = 0;
    let sum = 0;
    let best = Infinity;
    let start = -1;
    A.pointer("L", L, {
      line: 2,
      vars: { L, sum, best: "∞", target },
      note: "Start with an empty window at the left end.",
    });
    for (let R = 0; R < n; R++) {
      A.pointer("R", R, { line: 3, vars: { R } });
      sum += A.read(R, { line: 4 }) as number;
      A.mark(R, "active", {
        line: 4,
        vars: { sum },
        note: `Add A[${R}] = ${values[R]}: the window A[${L}..${R}] sums to ${sum}.`,
      });
      while (sum >= target) {
        t.tally("sum checks");
        const len = R - L + 1;
        if (len < best) {
          best = len;
          start = L;
          t.step({
            line: 6,
            vars: { best },
            note: `${sum} ≥ ${target}: a window of length ${len}, the shortest so far.`,
          });
        } else {
          t.step({
            line: 6,
            note: `${sum} ≥ ${target}, but length ${len} is not shorter than ${best}.`,
          });
        }
        sum -= A.read(L, { line: 7 }) as number;
        A.mark(L, null, { line: 7 });
        L++;
        A.pointer("L", L, {
          line: 7,
          vars: { L, sum },
          note: `Drop A[${L - 1}] from the left: the sum is now ${sum}.`,
        });
      }
      t.tally("sum checks");
    }
    A.pointer("R", null, { line: 8 });
    A.pointer("L", null, { line: 8 });
    const active = Array.from({ length: n - L }, (_, k) => L + k);
    if (active.length) A.mark(active, null, { line: 8 });
    const output: WindowOutput =
      best === Infinity ? { length: 0, start: -1 } : { length: best, start };
    if (output.start >= 0) {
      A.mark(
        Array.from({ length: output.length }, (_, k) => output.start + k),
        "found",
        { line: 8 },
      );
    }
    t.finish(input, output, {
      line: 8,
      vars: { best: output.length },
      note:
        output.length === 0
          ? `No window reaches ${target}.`
          : `Shortest window: A[${start}..${start + best - 1}], length ${best}.`,
    });
    return output;
  },

  check(input, out) {
    // Independent oracle: try every window.
    let best = 0;
    for (let i = 0; i < input.values.length; i++) {
      let s = 0;
      for (let j = i; j < input.values.length; j++) {
        s += input.values[j]!;
        if (s >= input.target) {
          if (best === 0 || j - i + 1 < best) best = j - i + 1;
          break;
        }
      }
    }
    if (out.length !== best) return `length ${out.length}, expected ${best}`;
    if (best === 0) return out.start === -1 ? null : "start should be −1";
    const s = input.values.slice(out.start, out.start + best).reduce((a, b) => a + b, 0);
    return s >= input.target ? null : `the reported window sums to ${s} < ${input.target}`;
  },

  fidelity(state: TraceState, out) {
    const a = state.structures.A;
    if (a?.kind !== "array") return "no array A";
    const found = a.marks.flatMap((m, i) => (m === "found" ? [i] : []));
    const want = Array.from({ length: out.length }, (_, k) => out.start + k);
    return JSON.stringify(found) === JSON.stringify(want) ? null : `marked ${found}`;
  },

  describeOutput: (out) =>
    out.length === 0
      ? "No window reaches the target."
      : `Shortest window: length ${out.length}, starting at index ${out.start}`,
};
