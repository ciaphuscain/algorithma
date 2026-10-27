import type { AlgorithmModule } from "../types";
import { sortedSearchInput, type SearchInput } from "../inputs";
import {
  describeIndex,
  foundFidelity,
  range,
  sortedPresets,
  sortedSearchCheck,
  SORTED_LIMITS,
} from "./common";

/**
 * Fibonacci search: like binary search, but the range is split at Fibonacci numbers
 * instead of halves, so each probe position is found with additions and subtractions
 * only. With F(k) ≥ n + 1, it needs at most about k ≈ log_φ n comparisons.
 */
export const fibonacciSearch: AlgorithmModule<SearchInput, number> = {
  id: "fibonacci-search",
  version: 1,
  pseudocode: [
    "procedure fibonacciSearch(A, target)",
    "  find the smallest Fibonacci number F(k) ≥ n;  a ← F(k − 2), b ← F(k − 1), f ← F(k)",
    "  offset ← −1",
    "  while f > 1",
    "    i ← min(offset + a, n − 1)",
    "    if A[i] < target: f ← b; b ← a; a ← f − b; offset ← i   // drop the front part",
    "    else if A[i] > target: f ← a; b ← b − a; a ← f − b   // drop the back part",
    "    else return i",
    "  if b = 1 and A[offset + 1] = target: return offset + 1",
    "  return −1",
  ],
  input: sortedSearchInput({
    limits: SORTED_LIMITS,
    presets: sortedPresets([
      {
        id: "eleven",
        label: "Eleven keys (F(7) = 13)",
        value: { values: [10, 22, 35, 40, 45, 50, 80, 82, 85, 90, 100], target: 85 },
      },
    ]),
  }),

  run(input, t) {
    const A = t.array("A", input.values, { label: "A", display: "cells" });
    const { target } = input;
    const n = A.length;
    let a = 0;
    let b = 1;
    let f = 1;
    while (f < n) {
      a = b;
      b = f;
      f = a + b;
    }
    let offset = -1;
    t.initVars({ target });
    t.step({
      line: 2,
      vars: { a, b, f },
      note: `The smallest Fibonacci number ≥ n = ${n} is ${f}; the one-below and two-below are ${b} and ${a}.`,
    });
    const found = (i: number, line: number) => {
      A.mark(i, "found", { line, vars: { result: i }, note: `Found ${target} at index ${i}.` });
      A.pointer("i", null, { line });
      t.finish(input, i, { line });
      return i;
    };
    while (f > 1) {
      const i = Math.min(offset + a, n - 1);
      A.pointer("i", i, { line: 5, vars: { i, offset } });
      const order = A.compareWith(i, target, () => ({
        line: 5,
        note: `Probe offset + ${a} = ${i}: compare A[${i}] = ${A.get(i)} with ${target}.`,
      }));
      if (order < 0) {
        A.mark(range(offset + 1, i), "discarded", { line: 6 });
        f = b;
        b = a;
        a = f - b;
        offset = i;
        t.step({
          line: 6,
          vars: { a, b, f, offset },
          note: `Too small: the target is after ${i}; step down one Fibonacci number.`,
        });
      } else if (order > 0) {
        A.mark(range(i, Math.min(offset + f, n - 1)), "discarded", { line: 7 });
        f = a;
        b = b - a;
        a = f - b;
        t.step({
          line: 7,
          vars: { a, b, f },
          note: `Too large: the target is before ${i}; step down two Fibonacci numbers.`,
        });
      } else return found(i, 8);
    }
    if (b === 1 && offset + 1 < n) {
      const order = A.compareWith(offset + 1, target, {
        line: 9,
        note: `One candidate is left: A[${offset + 1}].`,
      });
      if (order === 0) return found(offset + 1, 9);
    }
    A.pointer("i", null, {
      line: 10,
      vars: { result: -1 },
      note: `${target} is not in the array.`,
    });
    t.finish(input, -1, { line: 10 });
    return -1;
  },

  check: sortedSearchCheck,
  fidelity: (state, out) => foundFidelity(state, out),
  describeOutput: describeIndex,
};
