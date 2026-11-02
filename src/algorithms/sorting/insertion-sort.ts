import type { AlgorithmModule } from "../types";
import { numberArrayInput } from "../inputs";
import { arrayFidelity, checkSorted } from "./common";

/**
 * Insertion sort as in most textbooks: hold A[i] in `key`, shift larger elements of
 * the sorted prefix one place right, then write the key into the gap. While shifting,
 * the array briefly holds two copies of a value — that is the real memory state, and
 * the key is visible in the variables panel.
 */
export const insertionSort: AlgorithmModule<number[], number[]> = {
  id: "insertion-sort",
  version: 1,
  pseudocode: [
    "procedure insertionSort(A)",
    "  for i ← 1 to n − 1",
    "    key ← A[i];  j ← i − 1",
    "    while j ≥ 0 and A[j] > key",
    "      A[j + 1] ← A[j]",
    "      j ← j − 1",
    "    A[j + 1] ← key",
    "  return A",
  ],
  input: numberArrayInput({
    limits: { minLength: 1, maxLength: 40, min: -999, max: 999 },
    defaultRandomLength: 10,
    presets: [
      { id: "classic", label: "Small example", value: [5, 2, 4, 6, 1, 3] },
      { id: "nearly", label: "Nearly sorted", value: [1, 2, 4, 3, 5, 6, 8, 7] },
      { id: "reversed", label: "Reversed (worst case)", value: [8, 7, 6, 5, 4, 3, 2, 1] },
      { id: "duplicates", label: "With duplicates", value: [3, 1, 3, 2, 1, 2] },
    ],
  }),

  run(input, t) {
    const A = t.array("A", input, { label: "A" });
    const n = A.length;
    for (let i = 1; i < n; i++) {
      const key = A.num(i);
      let j = i - 1;
      A.read(i, {
        line: 3,
        vars: { i, key, j },
        note: `Take key = A[${i}] = ${key}. A[0..${i - 1}] is already sorted.`,
      });
      A.pointer("i", i, { line: 3 });
      while (j >= 0) {
        const jj = j;
        const order = A.compareWith(jj, key, () => ({
          line: 4,
          vars: { j: jj },
          note: `Is A[${jj}] = ${A.get(jj)} greater than key ${key}?`,
        }));
        if (order <= 0) break;
        const moved = A.num(jj);
        A.write(jj + 1, moved, {
          line: 5,
          note: `Yes: shift ${moved} one place right, into A[${jj + 1}].`,
        });
        j--;
        t.step({ line: 6, vars: { j } });
      }
      A.write(j + 1, key, {
        line: 7,
        note:
          j >= 0
            ? `A[${j}] = ${A.get(j)} ≤ ${key}, so insert the key at A[${j + 1}].`
            : `Every element was larger, so insert the key at the front, A[0].`,
      });
    }
    A.pointer("i", null, { line: 8, vars: { i: null, j: null, key: null } });
    A.mark(
      Array.from({ length: n }, (_, k) => k),
      "sorted",
      { line: 8, note: "The whole array is sorted." },
    );
    const output = A.toArray() as number[];
    t.finish(input, output, { line: 8 });
    return output;
  },

  check: checkSorted,
  fidelity: arrayFidelity("A"),
  describeOutput: (out) => `Sorted: [${out.join(", ")}]`,
};
