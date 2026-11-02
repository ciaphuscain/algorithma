import type { AlgorithmModule } from "../types";
import { numberArrayInput } from "../inputs";
import { arrayFidelity, checkSorted, describeSorted, SORT_LIMITS, sortPresets } from "./common";

/**
 * Binary insertion sort: insertion sort that finds each element's place in the sorted
 * prefix by binary search — O(n log n) comparisons — though making room still shifts up
 * to i elements, so the moves (and the time) stay O(n²). Searching for the position after
 * any equal keys keeps it stable.
 */
export const binaryInsertionSort: AlgorithmModule<number[], number[]> = {
  id: "binary-insertion-sort",
  version: 1,
  pseudocode: [
    "procedure binaryInsertionSort(A)",
    "  for i ← 1 to n − 1",
    "    key ← A[i]",
    "    binary search A[0..i − 1] for the first position p with A[p] > key",
    "    shift A[p..i − 1] one place right",
    "    A[p] ← key",
  ],
  input: numberArrayInput({
    limits: SORT_LIMITS,
    defaultRandomLength: 10,
    presets: sortPresets([
      { id: "duplicates", label: "With duplicates", value: [3, 1, 3, 2, 1, 2] },
    ]),
  }),

  run(input, t) {
    const A = t.array("A", input, { label: "A" });
    const n = A.length;
    if (n > 0) A.mark(0, "sorted", { line: 2, note: "A one-element prefix is sorted." });
    for (let i = 1; i < n; i++) {
      const key = A.num(i);
      A.pointer("i", i, { line: 3, vars: { i, key } });
      let lo = 0;
      let hi = i;
      while (lo < hi) {
        const mid = Math.floor((lo + hi) / 2);
        A.pointer("mid", mid, { line: 4, vars: { lo, hi, mid } });
        if (
          A.compareWith(mid, key, () => ({
            line: 4,
            note: `Is A[${mid}] = ${A.get(mid)} > ${key}?`,
          })) > 0
        )
          hi = mid;
        else lo = mid + 1;
      }
      A.pointer("mid", null, {
        line: 4,
        vars: { p: lo },
        note: `${key} belongs at position ${lo}.`,
      });
      for (let j = i; j > lo; j--) {
        A.write(j, A.get(j - 1), {
          line: 5,
          note: `Shift ${A.get(j - 1)} right to position ${j}.`,
        });
        t.tally("shifts");
      }
      if (lo !== i) A.write(lo, key, { line: 6, note: `Insert ${key} at position ${lo}.` });
      A.mark(
        Array.from({ length: i + 1 }, (_, k) => k),
        "sorted",
        { line: 6 },
      );
    }
    A.pointer("i", null, { line: 2 });
    const output = A.toArray() as number[];
    t.finish(input, output);
    return output;
  },

  check: checkSorted,
  fidelity: arrayFidelity("A"),
  describeOutput: describeSorted,
};
