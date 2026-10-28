import type { AlgorithmModule } from "../types";
import { numberArrayInput } from "../inputs";
import { arrayFidelity, checkSorted } from "./common";

/**
 * Heap sort with a max-heap stored in the array itself: children of index i are at
 * 2i + 1 and 2i + 2. Build the heap bottom-up, then repeatedly swap the maximum to
 * the end and restore the heap on the shrunken prefix.
 */
export const heapSort: AlgorithmModule<number[], number[]> = {
  id: "heap-sort",
  version: 2,
  pseudocode: [
    "procedure heapSort(A)",
    "  for i ← ⌊n/2⌋ − 1 down to 0: siftDown(A, i, n)",
    "  for end ← n − 1 down to 1",
    "    swap A[0] and A[end]   // the maximum is now final",
    "    siftDown(A, 0, end)",
    "procedure siftDown(A, i, size)",
    "  while c ← 2i + 1 < size   // c: left child",
    "    if c + 1 < size and A[c + 1] > A[c]: c ← c + 1",
    "    if A[i] ≥ A[c]: return",
    "    swap A[i] and A[c];  i ← c",
  ],
  input: numberArrayInput({
    limits: { minLength: 1, maxLength: 40, min: -999, max: 999 },
    defaultRandomLength: 10,
    presets: [
      { id: "classic", label: "Small example", value: [4, 10, 3, 5, 1] },
      { id: "nine", label: "Nine elements", value: [16, 4, 10, 14, 7, 9, 3, 2, 8] },
      { id: "sorted", label: "Already sorted", value: [1, 2, 3, 4, 5, 6, 7] },
      { id: "duplicates", label: "With duplicates", value: [3, 1, 3, 2, 3] },
    ],
  }),

  run(input, t) {
    const A = t.array("A", input, { label: "A (heap stored as an array)", display: "heap" });
    const n = A.length;

    const siftDown = (start: number, size: number, caller: number) => {
      let i = start;
      A.pointer("i", i, { line: 7, vars: { i, size } });
      while (2 * i + 1 < size) {
        let c = 2 * i + 1;
        A.pointer("c", c, {
          line: 7,
          vars: { c },
          note: `A[${i}] = ${A.get(i)} has a left child A[${c}] = ${A.get(c)}.`,
        });
        if (c + 1 < size) {
          const cc = c;
          if (
            A.compare(cc + 1, cc, () => ({
              line: 8,
              note: `Which child is larger: A[${cc}] = ${A.get(cc)} or A[${cc + 1}] = ${A.get(cc + 1)}?`,
            })) > 0
          ) {
            c = cc + 1;
            A.pointer("c", c, { line: 8, vars: { c } });
          }
        }
        const [ii, c2] = [i, c];
        if (
          A.compare(ii, c2, () => ({
            line: 9,
            note: `Is the parent A[${ii}] = ${A.get(ii)} at least its larger child A[${c2}] = ${A.get(c2)}?`,
          })) >= 0
        ) {
          t.step({ line: 9, note: `Yes: the heap property holds here, so stop sifting.` });
          break;
        }
        const [x, y] = [A.get(i), A.get(c)];
        A.swap(i, c, { line: 10, note: `No: swap ${x} down with its larger child ${y}.` });
        i = c;
        A.pointer("i", i, { line: 10, vars: { i } });
      }
      A.pointer("c", null, { line: caller, vars: { c: null } });
      A.pointer("i", null, { line: caller });
    };

    t.step({
      line: 2,
      note: "Phase 1: turn the array into a max-heap, fixing subtrees from the last parent upwards.",
    });
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) siftDown(i, n, 2);
    t.step({
      line: 3,
      vars: { i: null, size: null },
      note: `The array is now a max-heap: A[0] = ${n > 0 ? A.get(0) : "—"} is the maximum.`,
    });

    for (let end = n - 1; end >= 1; end--) {
      const [top, last] = [A.get(0), A.get(end)];
      A.swap(0, end, {
        line: 4,
        vars: { end },
        note: `Move the maximum ${top} to position ${end}; ${last} goes to the root.`,
      });
      A.mark(end, "sorted", { line: 4 });
      siftDown(0, end, 5);
    }
    if (n > 0)
      A.mark(0, "sorted", {
        line: 5,
        vars: { end: null, size: null },
        note: "Only the smallest element remains. Sorted.",
      });
    const output = A.toArray() as number[];
    t.finish(input, output);
    return output;
  },

  check: checkSorted,
  fidelity: arrayFidelity("A"),
  describeOutput: (out) => `Sorted: [${out.join(", ")}]`,
};
