import type { AlgorithmModule } from "../types";
import { sortedSearchInput, type SearchInput } from "../inputs";
import {
  describeIndex,
  foundFidelity,
  sortedPresets,
  sortedSearchCheck,
  SORTED_LIMITS,
} from "./common";

/** Knuth's table of step sizes: DELTA[j] = ⌊(n + 2^(j−1)) / 2^j⌋, until it reaches 0. */
export function deltaTable(n: number): number[] {
  const d = [0];
  for (let j = 1; ; j++) {
    const v = Math.floor((n + 2 ** (j - 1)) / 2 ** j);
    d.push(v);
    if (v === 0) break;
  }
  return d;
}

/**
 * Uniform binary search (Knuth, TAOCP Vol. 3, §6.2.1, Algorithm C): instead of keeping
 * lo and hi, keep one position i and move it by a precomputed step — the j-th step is
 * the same for every search. Only one index changes per comparison, and the steps come
 * from a table built once per array length.
 */
export const uniformBinarySearch: AlgorithmModule<SearchInput, number> = {
  id: "uniform-binary-search",
  version: 1,
  pseudocode: [
    "precompute DELTA[j] ← ⌊(n + 2^(j−1)) / 2^j⌋ for j = 1, 2, … until it is 0",
    "i ← DELTA[1];  j ← 2   // positions count from 1",
    "loop: compare target with A[i]   // A[0] = −∞ and A[n + 1] = +∞ are virtual",
    "  if target < A[i]: if DELTA[j] = 0 return −1;  i ← i − DELTA[j];  j ← j + 1",
    "  if target > A[i]: if DELTA[j] = 0 return −1;  i ← i + DELTA[j];  j ← j + 1",
    "  if equal: return i",
  ],
  input: sortedSearchInput({
    limits: SORTED_LIMITS,
    presets: sortedPresets([
      {
        id: "seven",
        label: "Seven keys: steps 4, 2, 1",
        value: { values: [3, 6, 9, 12, 15, 18, 21], target: 18 },
      },
    ]),
  }),

  run(input, t) {
    const A = t.array("A", input.values, {
      label: "A (position i is index i − 1)",
      display: "cells",
    });
    const D = deltaTable(A.length);
    const T = t.array("DELTA", D.slice(1), { label: "DELTA[1], DELTA[2], …", display: "cells" });
    const { target } = input;
    t.initVars({ target });
    let i = D[1]!;
    let j = 2;
    T.pointer("j", 0, { line: 2, vars: { i, j }, note: `Start at position ${i}, the first step.` });
    for (;;) {
      const virtual = i < 1 || i > A.length;
      let order: number;
      if (virtual) {
        // Positions 0 and n + 1 hold the virtual keys −∞ and +∞: no comparison is needed.
        order = i < 1 ? -1 : 1;
        A.pointer("i", null, {
          line: 3,
          vars: { i, j },
          note: `Position ${i} is outside the array; it stands for ${i < 1 ? "−∞" : "+∞"}.`,
        });
      } else {
        A.pointer("i", i - 1, { line: 3, vars: { i, j } });
        order = A.compareWith(i - 1, target, () => ({
          line: 3,
          note: `Compare the target ${target} with A[${i}] = ${A.get(i - 1)} (position ${i}).`,
        }));
      }
      if (order === 0) {
        A.mark(i - 1, "found", {
          line: 6,
          vars: { result: i - 1 },
          note: `Found ${target} at position ${i}, index ${i - 1}.`,
        });
        t.finish(input, i - 1, { line: 6 });
        return i - 1;
      }
      const line = order > 0 ? 4 : 5;
      T.pointer("j", j - 1, { line });
      if (D[j] === 0) {
        A.pointer("i", null, {
          line,
          vars: { result: -1 },
          note: `DELTA[${j}] = 0: no step is left, so ${target} is not in the array.`,
        });
        t.finish(input, -1, { line });
        return -1;
      }
      if (!virtual) A.mark(i - 1, "discarded", { line });
      i = order > 0 ? i - D[j]! : i + D[j]!;
      t.step({
        line,
        vars: { i, j: j + 1 },
        note: `Move ${order > 0 ? "left" : "right"} by DELTA[${j}] = ${D[j]} to position ${i}.`,
      });
      j++;
    }
  },

  check: sortedSearchCheck,
  fidelity: (state, out) => foundFidelity(state, out),
  describeOutput: describeIndex,
};
