import type { Scalar } from "@/engine/protocol";
import type { AlgorithmModule } from "../types";
import { numberArrayInput } from "../inputs";
import { arrayFidelity, checkSorted } from "./common";

/**
 * Top-down merge sort with one auxiliary buffer B. Each merge copies A[lo..hi] into
 * B, then merges the two sorted halves of B back into A. The `<=` comparison keeps
 * equal elements in their original order (stability).
 */
export const mergeSort: AlgorithmModule<number[], number[]> = {
  id: "merge-sort",
  version: 1,
  pseudocode: [
    "procedure mergeSort(A, lo, hi)",
    "  if lo ≥ hi: return",
    "  mid ← ⌊(lo + hi) / 2⌋",
    "  mergeSort(A, lo, mid);  mergeSort(A, mid + 1, hi)",
    "  copy A[lo..hi] into B[lo..hi]",
    "  i ← lo;  j ← mid + 1",
    "  for k ← lo to hi",
    "    if j > hi or (i ≤ mid and B[i] ≤ B[j])",
    "      A[k] ← B[i];  i ← i + 1",
    "    else  A[k] ← B[j];  j ← j + 1",
  ],
  input: numberArrayInput({
    limits: { minLength: 1, maxLength: 32, min: -999, max: 999 },
    defaultRandomLength: 10,
    presets: [
      { id: "classic", label: "Small example", value: [38, 27, 43, 3, 9, 82, 10] },
      { id: "eight", label: "Eight elements", value: [5, 2, 4, 7, 1, 3, 2, 6] },
      { id: "sorted", label: "Already sorted", value: [1, 2, 3, 4, 5, 6, 7, 8] },
      { id: "duplicates", label: "With duplicates", value: [4, 1, 4, 2, 1, 4] },
    ],
  }),

  run(input, t) {
    const A = t.array("A", input, { label: "A" });
    const B = t.array(
      "B",
      input.map((): Scalar => null),
      { label: "B (merge buffer)", display: "cells" },
    );
    const n = A.length;

    const sort = (lo: number, hi: number, depth: number) => {
      if (lo >= hi) {
        t.step({
          line: 2,
          vars: { lo, hi, depth },
          note: `A[${lo}..${hi}] has ${hi - lo + 1} element: already sorted.`,
        });
        return;
      }
      const mid = Math.floor((lo + hi) / 2);
      A.mark(range(lo, hi), "active", {
        line: 3,
        vars: { lo, mid, hi, depth },
        note: `Split A[${lo}..${hi}] into A[${lo}..${mid}] and A[${mid + 1}..${hi}].`,
      });
      A.mark(range(lo, hi), null, { line: 4 });
      sort(lo, mid, depth + 1);
      sort(mid + 1, hi, depth + 1);

      t.step({
        line: 5,
        vars: { lo, mid, hi, depth, i: null, j: null, k: null },
        note: `Both halves of A[${lo}..${hi}] are sorted. Copy them into the buffer and merge.`,
      });
      for (let k = lo; k <= hi; k++) B.write(k, A.get(k), { line: 5 });
      A.mark(range(lo, hi), "active", { line: 5 });
      let i = lo;
      let j = mid + 1;
      for (let k = lo; k <= hi; k++) {
        let takeLeft: boolean;
        if (j > hi) takeLeft = true;
        else if (i > mid) takeLeft = false;
        else {
          const [ii, jj] = [i, j];
          takeLeft =
            B.compare(ii, jj, () => ({
              line: 8,
              vars: { i: ii, j: jj, k },
              note: `Compare B[${ii}] = ${B.get(ii)} (left half) with B[${jj}] = ${B.get(jj)} (right half).`,
            })) <= 0;
        }
        const from = takeLeft ? i : j;
        const value = B.get(from);
        A.write(k, value, {
          line: takeLeft ? 9 : 10,
          vars: { i, j, k },
          note:
            j > hi || i > mid
              ? `The ${takeLeft ? "right" : "left"} half is used up; copy ${value} from B[${from}] to A[${k}].`
              : `Take ${value} from the ${takeLeft ? "left" : "right"} half into A[${k}].`,
        });
        if (takeLeft) i++;
        else j++;
      }
      for (let k = lo; k <= hi; k++) B.write(k, null, { line: 10 });
      A.mark(range(lo, hi), null, {
        line: 10,
        vars: { i: null, j: null, k: null },
        note: `A[${lo}..${hi}] is now sorted.`,
      });
    };

    sort(0, n - 1, 0);
    A.mark(range(0, n - 1), "sorted", {
      vars: { lo: null, mid: null, hi: null, depth: null },
      note: "The array is sorted.",
    });
    const output = A.toArray() as number[];
    t.finish(input, output);
    return output;
  },

  check: checkSorted,
  fidelity: arrayFidelity("A"),
  describeOutput: (out) => `Sorted: [${out.join(", ")}]`,
};

function range(from: number, to: number): number[] {
  return Array.from({ length: to - from + 1 }, (_, i) => from + i);
}
