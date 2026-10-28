import type { AlgorithmModule } from "../types";
import { numberArrayInput } from "../inputs";
import { arrayFidelity, checkSorted, describeSorted, SORT_LIMITS, sortPresets } from "./common";

/**
 * Bingo sort: selection sort for arrays with many repeated values. Each pass moves
 * every copy of the current largest value ("the bingo value") to the end at once, and
 * finds the next largest value on the way, so the number of passes is the number of
 * distinct values rather than n.
 */
export const bingoSort: AlgorithmModule<number[], number[]> = {
  id: "bingo-sort",
  version: 1,
  pseudocode: [
    "procedure bingoSort(A)",
    "  end ← n − 1;  next ← the largest value in A",
    "  while end > 0 and A[end] = next: end ← end − 1   // already at the end",
    "  while end > 0",
    "    bingo ← next;  next ← A[end]",
    "    for i ← end − 1 down to 0",
    "      if A[i] = bingo: swap A[i] and A[end];  end ← end − 1",
    "      else if A[i] > next: next ← A[i]",
    "    while end > 0 and A[end] = next: end ← end − 1",
  ],
  input: numberArrayInput({
    limits: SORT_LIMITS,
    defaultRandomLength: 12,
    presets: sortPresets([
      { id: "repeats", label: "Few distinct values", value: [3, 1, 3, 2, 1, 3, 2, 1, 2, 3] },
    ]),
  }),

  run(input, t) {
    const A = t.array("A", input, { label: "A" });
    const n = A.length;
    let end = n - 1;
    let passes = 0;
    if (n <= 1) {
      const output = A.toArray() as number[];
      t.finish(input, output, { line: 4, vars: { passes: 0 } });
      return output;
    }
    let next = A.get(end) as number;
    for (let i = end - 1; i >= 0; i--)
      if (
        A.compareWith(i, next, () => ({
          line: 2,
          note: `Is A[${i}] = ${A.get(i)} larger than ${next}?`,
        })) > 0
      )
        next = A.get(i) as number;
    t.step({ line: 2, vars: { next }, note: `The largest value is ${next}.` });
    const settle = (line: number) => {
      while (
        end > 0 &&
        A.compareWith(end, next, { line, note: `Is A[${end}] already ${next}?` }) === 0
      ) {
        A.mark(end, "sorted", { line });
        end--;
      }
      A.pointer("end", end, { line, vars: { end } });
    };
    settle(3);
    while (end > 0) {
      passes++;
      const bingo = next;
      next = A.get(end) as number;
      t.step({
        line: 5,
        vars: { bingo, next, pass: passes },
        note: `Pass ${passes}: move every ${bingo} to the end, and look for the next largest value.`,
      });
      for (let i = end - 1; i >= 0; i--) {
        A.pointer("i", i, { line: 6, vars: { i } });
        if (
          A.compareWith(i, bingo, () => ({
            line: 7,
            note: `Is A[${i}] = ${A.get(i)} the bingo value ${bingo}?`,
          })) === 0
        ) {
          A.swap(i, end, { line: 7, note: `Yes: swap it to position ${end}.` });
          A.mark(end, "sorted", { line: 7 });
          end--;
          A.pointer("end", end, { line: 7, vars: { end } });
        } else if (
          A.compareWith(i, next, () => ({
            line: 8,
            note: `Is ${A.get(i)} larger than the next candidate ${next}?`,
          })) > 0
        ) {
          next = A.get(i) as number;
          t.step({ line: 8, vars: { next } });
        }
      }
      A.pointer("i", null, { line: 9 });
      settle(9);
    }
    A.pointer("end", null, { line: 4 });
    A.mark(0, "sorted", { line: 4, note: `Sorted in ${passes} pass${passes === 1 ? "" : "es"}.` });
    const output = A.toArray() as number[];
    t.finish(input, output, { vars: { passes } });
    return output;
  },

  check: checkSorted,
  fidelity: arrayFidelity("A"),
  describeOutput: describeSorted,
};
