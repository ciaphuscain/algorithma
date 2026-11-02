import type { AlgorithmModule } from "../types";
import { numberArrayInput } from "../inputs";
import { arrayFidelity, checkSorted, describeSorted, SORT_LIMITS, sortPresets } from "./common";

/**
 * Double selection sort: each pass finds both the minimum and the maximum of the
 * unsorted middle and puts them at its two ends, so the unsorted part shrinks by two
 * per pass — about n/2 passes instead of n.
 */
export const doubleSelectionSort: AlgorithmModule<number[], number[]> = {
  id: "double-selection-sort",
  version: 1,
  pseudocode: [
    "procedure doubleSelectionSort(A)",
    "  lo ← 0;  hi ← n − 1",
    "  while lo < hi",
    "    find the positions min and max of the smallest and largest of A[lo..hi]",
    "    swap A[lo] and A[min]",
    "    if max = lo: max ← min   // the largest just moved to where the smallest was",
    "    swap A[hi] and A[max];  lo ← lo + 1;  hi ← hi − 1",
  ],
  input: numberArrayInput({
    limits: SORT_LIMITS,
    defaultRandomLength: 10,
    presets: sortPresets([
      { id: "max-first", label: "The largest value is first", value: [9, 3, 7, 1, 5] },
    ]),
  }),

  run(input, t) {
    const A = t.array("A", input, { label: "A" });
    let lo = 0;
    let hi = A.length - 1;
    while (lo < hi) {
      let min = lo;
      let max = lo;
      A.pointer("lo", lo, { line: 3, vars: { lo, hi } });
      A.pointer("hi", hi, { line: 3, note: `Find the smallest and largest of A[${lo}..${hi}].` });
      for (let i = lo + 1; i <= hi; i++) {
        if (
          A.compare(i, min, () => ({
            line: 4,
            vars: { i },
            note: `Is A[${i}] = ${A.get(i)} below the minimum so far, ${A.get(min)}?`,
          })) < 0
        ) {
          min = i;
          A.pointer("min", min, { line: 4 });
        }
        if (
          A.compare(i, max, () => ({
            line: 4,
            note: `Is A[${i}] = ${A.get(i)} above the maximum so far, ${A.get(max)}?`,
          })) > 0
        ) {
          max = i;
          A.pointer("max", max, { line: 4 });
        }
      }
      A.pointer("min", min, { line: 4 });
      A.pointer("max", max, { line: 4, vars: { min, max } });
      if (min !== lo)
        A.swap(lo, min, { line: 5, note: `Move the minimum ${A.get(min)} to position ${lo}.` });
      if (max === lo) {
        max = min;
        A.pointer("max", max, {
          line: 6,
          note: `The maximum was at ${lo}, which the swap moved to ${min}.`,
        });
      }
      if (max !== hi)
        A.swap(hi, max, { line: 7, note: `Move the maximum ${A.get(max)} to position ${hi}.` });
      A.mark([lo, hi], "sorted", { line: 7 });
      lo++;
      hi--;
    }
    for (const name of ["lo", "hi", "min", "max"]) A.pointer(name, null, { line: 3 });
    if (lo === hi) A.mark(lo, "sorted", { line: 3, note: "The middle element is in place." });
    const output = A.toArray() as number[];
    t.finish(input, output);
    return output;
  },

  check: checkSorted,
  fidelity: arrayFidelity("A"),
  describeOutput: describeSorted,
};
