import type { AlgorithmModule } from "../types";
import { numberArrayInput } from "../inputs";
import { arrayFidelity, checkSorted, describeSorted, SORT_LIMITS, sortPresets } from "./common";

export const SHRINK = 1.3;

/**
 * Comb sort (Dobosiewicz; Lacey and Box): bubble sort with a gap. Compare and swap
 * elements `gap` apart, shrinking the gap by a factor of 1.3 each pass; once the gap
 * reaches 1, keep making ordinary bubble passes until one makes no swap. Large gaps
 * move turtles — small values far to the right — a long way in one swap.
 */
export const combSort: AlgorithmModule<number[], number[]> = {
  id: "comb-sort",
  version: 1,
  pseudocode: [
    "procedure combSort(A)",
    "  gap ← n;  sorted ← false",
    "  while not sorted",
    "    gap ← max(1, ⌊gap / 1.3⌋)",
    "    sorted ← (gap = 1)",
    "    for i ← 0 to n − 1 − gap",
    "      if A[i] > A[i + gap]: swap them;  sorted ← false",
  ],
  input: numberArrayInput({
    limits: SORT_LIMITS,
    defaultRandomLength: 12,
    presets: sortPresets([
      { id: "turtles", label: "Turtles at the end", value: [5, 6, 7, 8, 9, 10, 4, 3, 2, 1] },
    ]),
  }),

  run(input, t) {
    const A = t.array("A", input, { label: "A" });
    const n = A.length;
    let gap = n;
    let sorted = false;
    let passes = 0;
    while (!sorted) {
      gap = Math.max(1, Math.floor(gap / SHRINK));
      sorted = gap === 1;
      passes++;
      t.step({ line: 4, vars: { gap, pass: passes }, note: `Pass ${passes} with gap ${gap}.` });
      for (let i = 0; i + gap < n; i++) {
        A.pointer("i", i, { line: 6, vars: { i } });
        if (
          A.compare(i, i + gap, () => ({
            line: 7,
            note: `Compare A[${i}] = ${A.get(i)} with A[${i + gap}] = ${A.get(i + gap)}, ${gap} apart.`,
          })) > 0
        ) {
          A.swap(i, i + gap, { line: 7 });
          sorted = false;
        }
      }
    }
    A.pointer("i", null, { line: 5 });
    A.mark(
      Array.from({ length: n }, (_, i) => i),
      "sorted",
      { line: 5, note: `A pass with gap 1 made no swap: sorted after ${passes} passes.` },
    );
    const output = A.toArray() as number[];
    t.finish(input, output, { vars: { passes } });
    return output;
  },

  check: checkSorted,
  fidelity: arrayFidelity("A"),
  describeOutput: describeSorted,
};
