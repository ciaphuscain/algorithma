import type { AlgorithmModule } from "../types";
import { numberArrayInput } from "../inputs";
import { arrayFidelity, checkSorted, describeSorted, SORT_LIMITS, sortPresets } from "./common";

/**
 * Bubble sort with two improvements: stop as soon as a pass makes no swap, and end the
 * next pass where the last swap happened — everything after it is already in place.
 * Sorted input costs one pass of n − 1 comparisons.
 */
export const optimizedBubbleSort: AlgorithmModule<number[], number[]> = {
  id: "optimized-bubble-sort",
  version: 1,
  pseudocode: [
    "procedure optimizedBubbleSort(A)",
    "  end ← n − 1",
    "  while end > 0",
    "    last ← 0",
    "    for j ← 0 to end − 1",
    "      if A[j] > A[j + 1]: swap A[j] and A[j + 1];  last ← j",
    "    end ← last   // A[last + 1 .. n − 1] is in place; last = 0 means no swap",
  ],
  input: numberArrayInput({
    limits: SORT_LIMITS,
    defaultRandomLength: 10,
    presets: sortPresets([
      {
        id: "nearly",
        label: "Nearly sorted: one pass and a check",
        value: [1, 2, 3, 5, 4, 6, 7, 8],
      },
    ]),
  }),

  run(input, t) {
    const A = t.array("A", input, { label: "A" });
    const n = A.length;
    let end = n - 1;
    let passes = 0;
    t.step({ line: 2, vars: { end } });
    while (end > 0) {
      passes++;
      let last = 0;
      t.step({
        line: 4,
        vars: { end, last, pass: passes },
        note: `Pass ${passes}: scan A[0..${end}].`,
      });
      for (let j = 0; j < end; j++) {
        if (
          A.compare(j, j + 1, () => ({
            line: 6,
            vars: { j },
            note: `Compare A[${j}] = ${A.get(j)} with A[${j + 1}] = ${A.get(j + 1)}.`,
          })) > 0
        ) {
          A.swap(j, j + 1, { line: 6, note: `Out of order: swap.` });
          last = j;
        }
      }
      const fixed = Array.from({ length: end - last }, (_, k) => last + 1 + k);
      A.mark(fixed, "sorted", {
        line: 7,
        vars: { end: last },
        note:
          last === 0
            ? `No swap after position 0 in this pass: the array is sorted.`
            : `The last swap was at ${last}: positions ${last + 1}–${end} are in their final places.`,
      });
      end = last;
    }
    if (n > 0) A.mark(0, "sorted", { line: 7 });
    const output = A.toArray() as number[];
    t.finish(input, output, {
      vars: { passes },
      note: `Sorted in ${passes} pass${passes === 1 ? "" : "es"}.`,
    });
    return output;
  },

  check: checkSorted,
  fidelity: arrayFidelity("A"),
  describeOutput: describeSorted,
};
