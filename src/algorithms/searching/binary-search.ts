import type { TraceState } from "@/engine/state";
import type { AlgorithmModule } from "../types";
import { sortedSearchInput, type SearchInput } from "../inputs";

/** Index of the target, or −1 when absent. */
export type BinarySearchOutput = number;

export const binarySearch: AlgorithmModule<SearchInput, BinarySearchOutput> = {
  id: "binary-search",
  version: 1,
  pseudocode: [
    "procedure binarySearch(A, target)",
    "  lo ← 0;  hi ← n − 1",
    "  while lo ≤ hi",
    "    mid ← ⌊(lo + hi) / 2⌋",
    "    if A[mid] = target: return mid",
    "    else if A[mid] < target: lo ← mid + 1",
    "    else: hi ← mid − 1",
    "  return −1   // target is not in A",
  ],
  input: sortedSearchInput({
    limits: { minLength: 1, maxLength: 40, min: -999, max: 999 },
    presets: [
      {
        id: "found",
        label: "Target present",
        value: { values: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91], target: 23 },
      },
      {
        id: "missing",
        label: "Target absent",
        value: { values: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91], target: 40 },
      },
      {
        id: "first",
        label: "Target is the first element",
        value: { values: [3, 6, 9, 12, 15, 18, 21], target: 3 },
      },
      {
        id: "duplicates",
        label: "With duplicates",
        value: { values: [1, 4, 4, 4, 4, 7, 9], target: 4 },
      },
    ],
  }),

  run(input, t) {
    const A = t.array("A", input.values, { label: "A", display: "cells" });
    const { target } = input;
    const n = A.length;
    let lo = 0;
    let hi = n - 1;
    t.initVars({ target });
    A.pointer("lo", lo, {
      line: 2,
      vars: { lo, hi },
      note: `Search the whole array, positions 0 to ${hi}.`,
    });
    A.pointer("hi", hi, { line: 2 });

    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      A.pointer("mid", mid, {
        line: 4,
        vars: { mid },
        note: `The middle of [${lo}, ${hi}] is ${mid}.`,
      });
      const order = A.compareWith(mid, target, () => ({
        line: 5,
        note: `Compare A[${mid}] = ${A.get(mid)} with the target ${target}.`,
      }));
      if (order === 0) {
        A.mark(mid, "found", { line: 5, note: `Found ${target} at index ${mid}.` });
        t.finish(input, mid, { line: 5, vars: { result: mid } });
        return mid;
      }
      if (order < 0) {
        const discarded = range(lo, mid);
        lo = mid + 1;
        A.mark(discarded, "discarded", {
          line: 6,
          vars: { lo },
          note: `${A.get(mid)} < ${target}, so the target can only be to the right. Discard positions ${discarded[0]}–${mid}.`,
        });
        A.pointer("lo", lo, { line: 6 });
      } else {
        const discarded = range(mid, hi);
        hi = mid - 1;
        A.mark(discarded, "discarded", {
          line: 7,
          vars: { hi },
          note: `${A.get(mid)} > ${target}, so the target can only be to the left. Discard positions ${mid}–${discarded.at(-1)}.`,
        });
        A.pointer("hi", hi, { line: 7 });
      }
    }
    A.pointer("mid", null, {
      line: 8,
      vars: { mid: null, result: -1 },
      note: `lo = ${lo} > hi = ${hi}: the range is empty, so ${target} is not in the array.`,
    });
    t.finish(input, -1, { line: 8 });
    return -1;
  },

  check(input, out) {
    const present = input.values.includes(input.target);
    if (out === -1) return present ? `returned −1 but ${input.target} is present` : null;
    if (input.values[out] !== input.target)
      return `A[${out}] = ${input.values[out]}, not ${input.target}`;
    return null;
  },

  fidelity(state: TraceState, out) {
    const A = state.structures.A;
    if (!A || A.kind !== "array") return "no array A";
    const found = A.marks.flatMap((m, i) => (m === "found" ? [i] : []));
    const want = out === -1 ? [] : [out];
    return found.length === want.length && found.every((v, i) => v === want[i])
      ? null
      : `found marks [${found}] do not match result ${out}`;
  },

  describeOutput: (out) => (out === -1 ? "Not found (−1)" : `Found at index ${out}`),
};

function range(from: number, to: number): number[] {
  return Array.from({ length: to - from + 1 }, (_, i) => from + i);
}
