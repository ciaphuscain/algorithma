import type { AlgorithmModule } from "../types";
import { numberArrayInput } from "../inputs";
import { arrayFidelity, checkSorted } from "./common";

/** Knuth's gap sequence 1, 4, 13, 40, …: the largest gap is the last below n/3 (at least 1). */
export function knuthGaps(n: number): number[] {
  const gaps = [1];
  while (gaps[gaps.length - 1]! < Math.floor(n / 3)) gaps.push(3 * gaps[gaps.length - 1]! + 1);
  return gaps.reverse();
}

/**
 * Shell sort: insertion sort on elements h apart, for a decreasing sequence of gaps
 * ending in 1. Large gaps move far-out-of-place elements in a few long jumps; the final
 * pass with h = 1 is plain insertion sort on a nearly sorted array. Shifts are counted
 * separately ("shifts"): each one removes at least one inversion.
 */
export const shellSort: AlgorithmModule<number[], number[]> = {
  id: "shell-sort",
  version: 1,
  pseudocode: [
    "procedure shellSort(A)",
    "  h ← 1;  while h < ⌊n / 3⌋: h ← 3h + 1",
    "  while h ≥ 1",
    "    for i ← h to n − 1",
    "      key ← A[i];  j ← i",
    "      while j ≥ h and A[j − h] > key",
    "        A[j] ← A[j − h];  j ← j − h",
    "      A[j] ← key",
    "    h ← ⌊h / 3⌋",
    "  return A",
  ],
  input: numberArrayInput({
    limits: { minLength: 1, maxLength: 40, min: -999, max: 999 },
    defaultRandomLength: 16,
    presets: [
      {
        id: "classic",
        label: "Fourteen elements (gaps 4 and 1)",
        value: [62, 83, 18, 53, 7, 17, 95, 86, 47, 69, 25, 28, 30, 4],
      },
      {
        id: "reversed",
        label: "Reversed (gaps 13, 4, 1)",
        value: Array.from({ length: 40 }, (_, i) => 40 - i),
      },
      { id: "nearly", label: "Nearly sorted", value: [1, 2, 3, 5, 4, 6, 7, 9, 8, 10, 11, 12] },
      { id: "duplicates", label: "With duplicates", value: [3, 1, 3, 2, 1, 2, 3, 1, 2] },
    ],
  }),

  run(input, t) {
    const A = t.array("A", input, { label: "A" });
    const n = A.length;
    const gaps = knuthGaps(n);
    t.step({
      line: 2,
      vars: { h: gaps[0]! },
      note: `Gaps for n = ${n}: ${gaps.join(", ")}.`,
    });
    for (const h of gaps) {
      t.step({
        line: 3,
        vars: { h, i: null, j: null, key: null },
        note:
          h === 1
            ? "Gap 1: a plain insertion sort, now on a nearly sorted array."
            : `Gap ${h}: insertion-sort each of the ${Math.min(h, n)} chains of elements ${h} apart.`,
      });
      for (let i = h; i < n; i++) {
        const key = A.num(i);
        let j = i;
        A.read(i, { line: 5, vars: { i, key, j } });
        A.pointer("i", i, { line: 5 });
        while (j >= h) {
          const jj = j;
          const order = A.compareWith(jj - h, key, () => ({
            line: 6,
            vars: { j: jj },
            note: `Is A[${jj - h}] = ${A.get(jj - h)} greater than key ${key}?`,
          }));
          if (order <= 0) break;
          const moved = A.num(jj - h);
          A.write(jj, moved, {
            line: 7,
            note: `Yes: move ${moved} from A[${jj - h}] up ${h} place${h === 1 ? "" : "s"} to A[${jj}].`,
          });
          t.tally("shifts");
          j -= h;
          t.step({ line: 7, vars: { j } });
        }
        if (j !== i) A.write(j, key, { line: 8, note: `Put the key ${key} into A[${j}].` });
      }
      t.step({
        line: 9,
        note:
          h === 1
            ? "The gap-1 pass is done."
            : `The array is now ${h}-sorted: every chain of elements ${h} apart is in order.`,
      });
    }
    A.pointer("i", null, { line: 10, vars: { i: null, j: null, key: null, h: null } });
    A.mark(
      Array.from({ length: n }, (_, k) => k),
      "sorted",
      { line: 10, note: "The whole array is sorted." },
    );
    const output = A.toArray() as number[];
    t.finish(input, output, { line: 10 });
    return output;
  },

  check: checkSorted,
  fidelity: arrayFidelity("A"),
  describeOutput: (out) => `Sorted: [${out.join(", ")}]`,
};
