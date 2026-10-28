import type { TraceState } from "@/engine/state";
import type { AlgorithmModule } from "../types";
import { clamp, numberArrayInput, randomNumbers } from "../inputs";
import { range } from "../searching/common";

export interface MaxSubarray {
  sum: number;
  /** The best subarray is A[start..end], inclusive. */
  start: number;
  end: number;
}

const LIMITS = { minLength: 1, maxLength: 20, min: -99, max: 99 };

/**
 * Kadane's algorithm: scan once, keeping the best sum of a subarray that ends at the
 * current position. That sum either extends the previous one or, if the previous one
 * is negative, starts afresh. The best of these is the maximum subarray sum.
 */
export const kadane: AlgorithmModule<number[], MaxSubarray> = {
  id: "kadane",
  version: 1,
  pseudocode: [
    "cur ← A[0];  best ← A[0];  s ← 0   // cur: best sum of a subarray ending here",
    "for i ← 1 to n − 1",
    "  if cur < 0: cur ← A[i];  s ← i   // a negative prefix only hurts: start afresh",
    "  else: cur ← cur + A[i]",
    "  if cur > best: best ← cur;  remember A[s..i]",
    "return best",
  ],
  input: {
    ...numberArrayInput({
      limits: LIMITS,
      presets: [
        { id: "classic", label: "Mixed signs", value: [-2, 1, -3, 4, -1, 2, 1, -5, 4] },
        { id: "negative", label: "All negative", value: [-8, -3, -6, -2, -5, -4] },
        { id: "positive", label: "All positive: the whole array", value: [2, 3, 1, 4] },
      ],
    }),
    random: (rng, size) => randomNumbers(rng, clamp(size ?? 9, 1, LIMITS.maxLength), -9, 9),
  },

  run(values, t) {
    const A = t.array("A", values, { label: "A" });
    const n = A.length;
    let cur = A.read(0, { line: 1 }) as number;
    let best = cur;
    let s = 0;
    let [bl, br] = [0, 0];
    A.pointer("s", 0, { line: 1 });
    A.mark([0], "found", { line: 1, vars: { cur, best }, note: `Start with A[0] = ${cur}.` });
    for (let i = 1; i < n; i++) {
      A.pointer("i", i, { line: 2, vars: { i } });
      const a = A.read(i, { line: 2 }) as number;
      if (cur < 0) {
        cur = a;
        s = i;
        A.pointer("s", s, {
          line: 3,
          vars: { cur },
          note: `The running sum was negative, so drop it: start again at A[${i}] = ${a}.`,
        });
      } else {
        cur += a;
        t.step({ line: 4, vars: { cur }, note: `Extend A[${s}..${i}]: cur = ${cur}.` });
      }
      if (cur > best) {
        best = cur;
        A.mark(range(bl, br), null, { line: 5 });
        [bl, br] = [s, i];
        A.mark(range(bl, br), "found", {
          line: 5,
          vars: { best },
          note: `New best: A[${bl}..${br}] sums to ${best}.`,
        });
      }
    }
    A.pointer("i", null, { line: 6 });
    A.pointer("s", null, { line: 6 });
    const output: MaxSubarray = { sum: best, start: bl, end: br };
    t.finish(values, output, {
      vars: { best },
      note: `The maximum subarray is A[${bl}..${br}] with sum ${best}.`,
    });
    return output;
  },

  check(values, out) {
    // Brute force over all O(n²) subarrays.
    let best = -Infinity;
    for (let l = 0; l < values.length; l++) {
      let s = 0;
      for (let r = l; r < values.length; r++) best = Math.max(best, (s += values[r]!));
    }
    if (out.sum !== best) return `sum ${out.sum}, but the maximum is ${best}`;
    if (!(0 <= out.start && out.start <= out.end && out.end < values.length))
      return `bad range ${out.start}..${out.end}`;
    const s = values.slice(out.start, out.end + 1).reduce((a, b) => a + b, 0);
    return s === best ? null : `A[${out.start}..${out.end}] sums to ${s}, not ${best}`;
  },

  fidelity(state: TraceState, out) {
    const A = state.structures.A;
    if (A?.kind !== "array") return "no array A";
    const found = A.marks.flatMap((m, i) => (m === "found" ? [i] : []));
    return found.join() === range(out.start, out.end).join()
      ? null
      : `found marks [${found}] differ from ${out.start}..${out.end}`;
  },

  describeOutput: (o) => `Maximum sum ${o.sum}, from A[${o.start}..${o.end}]`,
};
