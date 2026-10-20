import type { AlgorithmModule } from "../types";
import { numberArrayInput } from "../inputs";
import { arrayFidelity, checkSorted } from "./common";

/** Selection sort: repeatedly select the minimum of the unsorted suffix and swap it into place. */
export const selectionSort: AlgorithmModule<number[], number[]> = {
  id: "selection-sort",
  version: 1,
  pseudocode: [
    "procedure selectionSort(A)",
    "  for i ← 0 to n − 2",
    "    min ← i",
    "    for j ← i + 1 to n − 1",
    "      if A[j] < A[min]: min ← j",
    "    swap A[i] and A[min]",
    "  return A",
  ],
  input: numberArrayInput({
    limits: { minLength: 1, maxLength: 40, min: -999, max: 999 },
    defaultRandomLength: 10,
    presets: [
      { id: "classic", label: "Small example", value: [64, 25, 12, 22, 11] },
      { id: "reversed", label: "Reversed", value: [8, 7, 6, 5, 4, 3, 2, 1] },
      { id: "sorted", label: "Already sorted", value: [1, 2, 3, 4, 5, 6] },
      { id: "unstable", label: "Shows instability", value: [4, 2, 4, 1] },
    ],
  }),

  run(input, t) {
    const A = t.array("A", input, { label: "A" });
    const n = A.length;
    for (let i = 0; i <= n - 2; i++) {
      let min = i;
      A.mark(i, "min", {
        line: 3,
        vars: { i, min, j: null },
        note: `Find the smallest element of A[${i}..${n - 1}]. Start with min = ${i}.`,
      });
      for (let j = i + 1; j < n; j++) {
        const [jj, mm] = [j, min];
        const order = A.compare(jj, mm, () => ({
          line: 5,
          vars: { j: jj },
          note: `Is A[${jj}] = ${A.get(jj)} smaller than the current minimum A[${mm}] = ${A.get(mm)}?`,
        }));
        if (order < 0) {
          A.mark(mm, null, { line: 5 });
          min = j;
          A.mark(min, "min", {
            line: 5,
            vars: { min },
            note: `Yes: the new minimum is A[${min}] = ${A.get(min)}.`,
          });
        }
      }
      A.mark(min, null, { line: 6 });
      if (min !== i) {
        const [x, y] = [A.get(i), A.get(min)];
        A.swap(i, min, {
          line: 6,
          note: `Swap the minimum ${y} into position ${i} (it trades places with ${x}).`,
        });
      } else {
        t.step({ line: 6, note: `A[${i}] is already the minimum; no swap needed.` });
      }
      A.mark(i, "sorted", { line: 6, note: `Position ${i} is final.` });
    }
    if (n > 0)
      A.mark(n - 1, "sorted", {
        line: 7,
        vars: { i: null, j: null, min: null },
        note: "The last element is the largest. Sorted.",
      });
    const output = A.toArray() as number[];
    t.finish(input, output, { line: 7 });
    return output;
  },

  check: checkSorted,
  fidelity: arrayFidelity("A"),
  describeOutput: (out) => `Sorted: [${out.join(", ")}]`,
};
