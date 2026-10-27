import type { AlgorithmModule } from "../types";
import { numberArrayInput } from "../inputs";
import { arrayFidelity, checkSorted, describeSorted, SORT_LIMITS, sortPresets } from "./common";

/**
 * Cocktail shaker sort (bidirectional bubble sort): alternate a left-to-right pass,
 * which carries the largest remaining value to the right end, with a right-to-left
 * pass, which carries the smallest to the left end. Small values near the end
 * ("turtles"), which plain bubble sort moves one step per pass, move all the way in one.
 */
export const cocktailShakerSort: AlgorithmModule<number[], number[]> = {
  id: "cocktail-shaker-sort",
  version: 1,
  pseudocode: [
    "procedure cocktailShakerSort(A)",
    "  lo ← 0;  hi ← n − 1",
    "  while lo < hi",
    "    forward: for j ← lo to hi − 1: if A[j] > A[j + 1]: swap;  last ← j",
    "    hi ← last   // everything after the last swap is in place",
    "    backward: for j ← hi − 1 down to lo: if A[j] > A[j + 1]: swap;  first ← j + 1",
    "    lo ← first   // everything before the last swap is in place",
  ],
  input: numberArrayInput({
    limits: SORT_LIMITS,
    defaultRandomLength: 10,
    presets: sortPresets([
      {
        id: "turtle",
        label: "A turtle: the smallest value is last",
        value: [2, 3, 4, 5, 6, 7, 8, 1],
      },
    ]),
  }),

  run(input, t) {
    const A = t.array("A", input, { label: "A" });
    let lo = 0;
    let hi = A.length - 1;
    let rounds = 0;
    const cmp = (j: number, line: number) =>
      A.compare(j, j + 1, () => ({
        line,
        vars: { j },
        note: `Compare A[${j}] = ${A.get(j)} with A[${j + 1}] = ${A.get(j + 1)}.`,
      })) > 0;
    while (lo < hi) {
      rounds++;
      let last = lo;
      t.step({
        line: 4,
        vars: { lo, hi, round: rounds },
        note: `Forward pass over A[${lo}..${hi}].`,
      });
      for (let j = lo; j < hi; j++)
        if (cmp(j, 4)) {
          A.swap(j, j + 1, { line: 4 });
          last = j;
        }
      const right = Array.from({ length: hi - last }, (_, k) => last + 1 + k);
      A.mark(right, "sorted", {
        line: 5,
        vars: { hi: last },
        note: `Positions ${last + 1}–${hi} are final.`,
      });
      hi = last;
      if (lo >= hi) break;
      let first = hi;
      t.step({ line: 6, note: `Backward pass over A[${lo}..${hi}].` });
      for (let j = hi - 1; j >= lo; j--)
        if (cmp(j, 6)) {
          A.swap(j, j + 1, { line: 6 });
          first = j + 1;
        }
      const left = Array.from({ length: first - lo }, (_, k) => lo + k);
      A.mark(left, "sorted", {
        line: 7,
        vars: { lo: first },
        note: `Positions ${lo}–${first - 1} are final.`,
      });
      lo = first;
    }
    A.mark(
      Array.from({ length: A.length }, (_, i) => i),
      "sorted",
      { line: 3 },
    );
    const output = A.toArray() as number[];
    t.finish(input, output, {
      vars: { rounds },
      note: `Sorted after ${rounds} round${rounds === 1 ? "" : "s"}.`,
    });
    return output;
  },

  check: checkSorted,
  fidelity: arrayFidelity("A"),
  describeOutput: describeSorted,
};
