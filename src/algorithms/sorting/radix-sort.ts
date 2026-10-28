import type { AlgorithmModule } from "../types";
import { numberArrayInput } from "../inputs";
import { arrayFidelity, checkSorted } from "./common";

const digit = (x: number, p: number) => Math.floor(x / 10 ** p) % 10;

/**
 * LSD radix sort in base 10: one stable counting sort per digit, least significant
 * first. After the pass on digit p the array is sorted by its last p + 1 digits,
 * because each pass is stable. No two elements are ever compared.
 */
export const radixSort: AlgorithmModule<number[], number[]> = {
  id: "radix-sort",
  version: 1,
  pseudocode: [
    "procedure radixSort(A)               // base 10, d digits",
    "  for p ← 0 to d − 1                  // least significant digit first",
    "    C[0..9] ← 0",
    "    for j ← 0 to n − 1:  C[digit(A[j], p)] += 1",
    "    for v ← 1 to 9:  C[v] += C[v − 1]",
    "    for j ← n − 1 down to 0",
    "      C[digit(A[j], p)] −= 1;  B[C[digit(A[j], p)]] ← A[j]",
    "    A ← B",
    "  return A",
  ],
  input: numberArrayInput({
    limits: { minLength: 1, maxLength: 24, min: 0, max: 999 },
    defaultRandomLength: 10,
    presets: [
      {
        id: "classic",
        label: "Three-digit numbers",
        value: [329, 457, 657, 839, 436, 720, 355],
      },
      { id: "mixed", label: "Different lengths", value: [170, 45, 75, 90, 802, 24, 2, 66] },
      { id: "ties", label: "Equal digits", value: [31, 13, 33, 11, 23, 21, 32, 12] },
    ],
  }),

  run(input, t) {
    const n = input.length;
    const d = String(Math.max(...input)).length;
    const A = t.array("A", input, { label: "A", display: "cells" });
    const C = t.array(
      "C",
      Array.from({ length: 10 }, () => 0),
      { label: "C (digit counts 0..9)", display: "cells" },
    );
    const B = t.array(
      "B",
      Array.from({ length: n }, () => null),
      { label: "B (this pass's output)", display: "cells" },
    );
    const place = ["ones", "tens", "hundreds"];
    for (let p = 0; p < d; p++) {
      t.step({
        line: 2,
        vars: { p, j: null, v: null },
        note: `Pass ${p + 1} of ${d}: sort by the ${place[p]} digit.`,
      });
      for (let v = 0; v < 10; v++) C.write(v, 0, { line: 3 });
      for (let j = 0; j < n; j++) {
        const x = A.num(j);
        const v = digit(x, p);
        A.read(j, { line: 4, vars: { j, v }, note: `The ${place[p]} digit of ${x} is ${v}.` });
        C.write(v, C.num(v) + 1, { line: 4 });
      }
      for (let v = 1; v < 10; v++) C.write(v, C.num(v) + C.num(v - 1), { line: 5, vars: { v } });
      for (let j = n - 1; j >= 0; j--) {
        const x = A.num(j);
        const v = digit(x, p);
        A.read(j, { line: 6, vars: { j, v } });
        const slot = C.num(v) - 1;
        C.write(v, slot, { line: 7 });
        B.write(slot, x, {
          line: 7,
          note: `${x} (digit ${v}) goes to B[${slot}], the last free slot for digit ${v}.`,
        });
      }
      for (let j = 0; j < n; j++)
        A.write(j, B.num(j), {
          line: 8,
          vars: { j: null, v: null },
          note:
            j === n - 1
              ? `A is now sorted by its last ${p + 1} digit${p === 0 ? "" : "s"}.`
              : undefined,
        });
    }
    A.mark(
      Array.from({ length: n }, (_, i) => i),
      "sorted",
      { line: 9, vars: { p: null } },
    );
    const output = A.toArray() as number[];
    t.finish(input, output, { line: 9 });
    return output;
  },

  check: checkSorted,
  fidelity: arrayFidelity("A"),
  describeOutput: (out) => `Sorted: [${out.join(", ")}]`,
};
