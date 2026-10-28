import type { AlgorithmModule } from "../types";
import { numberArrayInput } from "../inputs";
import { arrayFidelity, checkSorted } from "./common";

/**
 * Counting sort (stable form, as in CLRS §8.2) for whole numbers 0..k: count each value,
 * turn the counts into prefix sums (C[v] becomes the number of elements ≤ v, which is
 * one past the last slot for v), then place elements from right to left into the output
 * B. It never compares two elements.
 */
export const countingSort: AlgorithmModule<number[], number[]> = {
  id: "counting-sort",
  version: 1,
  pseudocode: [
    "procedure countingSort(A, k)          // values in 0..k",
    "  C[0..k] ← 0",
    "  for j ← 0 to n − 1:  C[A[j]] ← C[A[j]] + 1",
    "  for v ← 1 to k:  C[v] ← C[v] + C[v − 1]   // C[v] = number of elements ≤ v",
    "  for j ← n − 1 down to 0",
    "    C[A[j]] ← C[A[j]] − 1",
    "    B[C[A[j]]] ← A[j]",
    "  return B",
  ],
  input: numberArrayInput({
    limits: { minLength: 1, maxLength: 30, min: 0, max: 20 },
    defaultRandomLength: 10,
    presets: [
      { id: "classic", label: "CLRS example", value: [2, 5, 3, 0, 2, 3, 0, 3] },
      { id: "repeats", label: "Many repeats", value: [1, 4, 1, 4, 2, 1, 4, 0, 2, 1] },
      { id: "spread", label: "Few values, wide range", value: [20, 0, 10, 20, 5] },
    ],
  }),

  run(input, t) {
    const n = input.length;
    const k = Math.max(...input);
    const A = t.array("A", input, { label: "A (input)", display: "cells" });
    const C = t.array(
      "C",
      Array.from({ length: k + 1 }, () => 0),
      { label: `C (counts for 0..${k})`, display: "cells" },
    );
    const B = t.array(
      "B",
      Array.from({ length: n }, () => null),
      { label: "B (output)", display: "cells" },
    );
    t.step({
      line: 2,
      vars: { k },
      note: `The largest value is k = ${k}, so C has ${k + 1} slots.`,
    });
    for (let j = 0; j < n; j++) {
      const v = A.num(j);
      A.read(j, { line: 3, vars: { j, v } });
      C.write(v, C.num(v) + 1, () => ({ line: 3, note: `One more ${v}: C[${v}] = ${C.get(v)}.` }));
    }
    for (let v = 1; v <= k; v++) {
      const sum = C.num(v) + C.num(v - 1);
      C.write(v, sum, {
        line: 4,
        vars: { v, j: null },
        note: `${sum} element${sum === 1 ? " is" : "s are"} ≤ ${v}.`,
      });
    }
    for (let j = n - 1; j >= 0; j--) {
      const v = A.num(j);
      A.read(j, { line: 5, vars: { j, v } });
      A.pointer("j", j, { line: 5 });
      const slot = C.num(v) - 1;
      C.write(v, slot, { line: 6, note: `The last free slot for ${v} is ${slot}.` });
      B.write(slot, v, {
        line: 7,
        note: `B[${slot}] ← ${v}. Going from right to left keeps equal values in their original order.`,
      });
    }
    A.pointer("j", null, { line: 8, vars: { j: null, v: null } });
    B.mark(
      Array.from({ length: n }, (_, i) => i),
      "sorted",
      { line: 8 },
    );
    const output = B.toArray() as number[];
    t.finish(input, output, { line: 8, note: "B holds the sorted elements." });
    return output;
  },

  check: checkSorted,
  fidelity: arrayFidelity("B"),
  describeOutput: (out) => `Sorted: [${out.join(", ")}]`,
};
