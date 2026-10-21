import type { Scalar } from "@/engine/protocol";
import type { TraceState } from "@/engine/state";
import type { AlgorithmModule } from "../types";
import { numberArrayInput } from "../inputs";

export interface LisOutput {
  length: number;
  /** Indices into the input of one longest strictly increasing subsequence. */
  indices: number[];
  sequence: number[];
}

const LIMITS = { minLength: 1, maxLength: 16, min: -99, max: 99 };

/**
 * Longest strictly increasing subsequence in O(n log n) ("patience sorting"):
 * tails[k] is the smallest value that can end an increasing subsequence of length
 * k + 1. Each element binary-searches its place in tails and records its
 * predecessor, so one longest subsequence can be read back at the end.
 */
export const lis: AlgorithmModule<number[], LisOutput> = {
  id: "lis",
  version: 1,
  pseudocode: [
    "procedure LIS(A)",
    "  L ← 0   // tails[0..L−1] is strictly increasing",
    "  for i ← 0 to n − 1",
    "    k ← first position < L with tails[k] ≥ A[i] (binary search; k = L if none)",
    "    tails[k] ← A[i];  end[k] ← i",
    "    prev[i] ← end[k − 1] if k > 0, else none",
    "    if k = L: L ← L + 1",
    "  follow prev[] back from end[L − 1] to read off one LIS",
    "  return L",
  ],
  input: numberArrayInput({
    limits: LIMITS,
    presets: [
      { id: "classic", label: "Mixed values", value: [10, 9, 2, 5, 3, 7, 21, 18] },
      { id: "sorted", label: "Already increasing", value: [1, 2, 3, 4, 5, 6] },
      { id: "decreasing", label: "Decreasing", value: [9, 7, 5, 3, 1] },
      { id: "dups", label: "Repeated values", value: [3, 3, 1, 3, 2, 2, 4] },
    ],
  }),

  run(input, t) {
    const n = input.length;
    const A = t.array("A", input, { label: "A" });
    const T = t.array(
      "T",
      input.map((): Scalar => null),
      { label: "tails[k]", display: "cells" },
    );
    const P = t.array(
      "P",
      input.map((): Scalar => null),
      { label: "prev[i] (index of the previous element)", display: "cells" },
    );
    const end: number[] = [];
    const prev: (number | null)[] = input.map(() => null);
    let L = 0;
    t.step({ line: 2, vars: { L }, note: "No subsequences yet: tails is empty." });

    for (let i = 0; i < n; i++) {
      const x = input[i]!;
      A.pointer("i", i, { line: 3, vars: { i, x }, note: `Place A[${i}] = ${x}.` });
      let lo = 0;
      let hi = L;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        T.pointer("mid", mid, { line: 4, vars: { lo, hi, mid } });
        if (T.compareWith(mid, x, { line: 4 }) >= 0) hi = mid;
        else lo = mid + 1;
      }
      T.pointer("mid", null, { line: 4 });
      const k = lo;
      const grows = k === L;
      end[k] = i;
      T.write(k, x, {
        line: 5,
        vars: { k, lo: null, hi: null, mid: null },
        note: grows
          ? `${x} is larger than every tail, so it extends the longest subsequence to length ${k + 1}.`
          : `tails[${k}] becomes ${x}: a subsequence of length ${k + 1} can now end with a smaller value.`,
      });
      if (k > 0) {
        prev[i] = end[k - 1]!;
        P.write(i, end[k - 1]!, {
          line: 6,
          note: `Its predecessor is A[${end[k - 1]}] = ${input[end[k - 1]!]}, which ends a subsequence of length ${k}.`,
        });
      } else {
        t.step({ line: 6, note: `${x} starts a new subsequence of length 1; no predecessor.` });
      }
      if (grows) {
        L++;
        t.step({ line: 7, vars: { L }, note: `L = ${L}.` });
      }
    }
    A.pointer("i", null, { line: 8 });

    const indices: number[] = [];
    for (let i: number | null = L > 0 ? end[L - 1]! : null; i !== null; i = prev[i]!) {
      indices.unshift(i);
    }
    A.mark(indices, "found", {
      line: 8,
      vars: { i: null, x: null },
      note: `Follow prev[] back from index ${end[L - 1]}: ${indices.map((j) => input[j]).join(" < ")}.`,
    });
    const output: LisOutput = { length: L, indices, sequence: indices.map((j) => input[j]!) };
    t.finish(input, output, {
      line: 9,
      note: `The longest increasing subsequence has length ${L}. Other subsequences of the same length may exist.`,
    });
    return output;
  },

  check(input, out) {
    // Independent oracle: the O(n²) dynamic programme for the length.
    const best = input.map(() => 1);
    for (let i = 0; i < input.length; i++)
      for (let j = 0; j < i; j++)
        if (input[j]! < input[i]!) best[i] = Math.max(best[i]!, best[j]! + 1);
    const want = Math.max(...best);
    if (out.length !== want) return `length ${out.length}, expected ${want}`;
    if (out.indices.length !== want) return "the subsequence has the wrong length";
    for (let k = 0; k < out.indices.length; k++) {
      const i = out.indices[k]!;
      if (input[i] !== out.sequence[k]) return `sequence[${k}] is not A[${i}]`;
      if (k > 0 && !(out.indices[k - 1]! < i && input[out.indices[k - 1]!]! < input[i]!))
        return "the subsequence is not strictly increasing";
    }
    return null;
  },

  fidelity(state: TraceState, out) {
    const a = state.structures.A;
    if (!a || a.kind !== "array") return "no array A";
    const marked = a.marks.flatMap((m, i) => (m === "found" ? [i] : []));
    return JSON.stringify(marked) === JSON.stringify(out.indices)
      ? null
      : `marked ${marked.join(",")}, expected ${out.indices.join(",")}`;
  },

  describeOutput: (out) => `Length ${out.length}: ${out.sequence.join(", ")}`,
};
