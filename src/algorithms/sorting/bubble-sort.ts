import type { AlgorithmModule } from "../types";
import { numberArrayInput } from "../inputs";
import { arrayFidelity, checkSorted } from "./common";

/**
 * Bubble sort, classic form: after pass i the largest i+1 elements are in their final
 * positions, so each pass scans one element fewer. (The early-exit variant is a
 * separate catalogue entry, "Optimized Bubble Sort".)
 */
export const bubbleSort: AlgorithmModule<number[], number[]> = {
  id: "bubble-sort",
  version: 1,
  pseudocode: [
    "procedure bubbleSort(A)",
    "  n ← length(A)",
    "  for i ← 0 to n − 2",
    "    for j ← 0 to n − 2 − i",
    "      if A[j] > A[j + 1]",
    "        swap A[j] and A[j + 1]",
    "    // A[n − 1 − i] is now in its final place",
    "  return A",
  ],
  input: numberArrayInput({
    limits: { minLength: 1, maxLength: 40, min: -999, max: 999 },
    defaultRandomLength: 10,
    presets: [
      { id: "classic", label: "Small example", value: [5, 1, 4, 2, 8] },
      { id: "reversed", label: "Reversed (worst case)", value: [9, 8, 7, 6, 5, 4, 3, 2] },
      { id: "sorted", label: "Already sorted", value: [1, 2, 3, 4, 5, 6, 7, 8] },
      { id: "duplicates", label: "With duplicates", value: [3, 1, 3, 2, 1, 2] },
    ],
  }),

  run(input, t) {
    const A = t.array("A", input, { label: "A" });
    const n = A.length;
    t.step({ line: 2, vars: { n }, note: `The array has n = ${n} element${n === 1 ? "" : "s"}.` });

    for (let i = 0; i <= n - 2; i++) {
      t.step({ line: 3, vars: { i, j: null }, note: `Pass ${i + 1}: bubble the largest remaining value to position ${n - 1 - i}.` });
      for (let j = 0; j <= n - 2 - i; j++) {
        const order = A.compare(j, j + 1, () => ({
          line: 5,
          vars: { j },
          note: `Compare A[${j}] = ${A.get(j)} with A[${j + 1}] = ${A.get(j + 1)}.`,
        }));
        if (order > 0) {
          const [x, y] = [A.get(j), A.get(j + 1)];
          A.swap(j, j + 1, () => ({ line: 6, note: `${x} > ${y}, so swap them.` }));
        }
      }
      A.mark(n - 1 - i, "sorted", () => ({
        line: 7,
        note: `${A.get(n - 1 - i)} has reached its final position ${n - 1 - i}.`,
      }));
    }
    if (n > 0) A.mark(0, "sorted", { line: 8, vars: { i: null, j: null }, note: "The remaining element is the smallest. The array is sorted." });
    const output = A.toArray() as number[];
    t.finish(input, output, { line: 8 });
    return output;
  },

  check: checkSorted,
  fidelity: arrayFidelity("A"),
  describeOutput: (out) => `Sorted: [${out.join(", ")}]`,
};
