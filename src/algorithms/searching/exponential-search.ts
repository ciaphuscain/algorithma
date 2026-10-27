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
 * Exponential (galloping) search: probe positions 1, 2, 4, 8, … until one holds a key
 * at least the target, then binary-search the last doubling interval. It costs
 * O(log i) comparisons when the target is at position i, so it suits unbounded lists
 * and targets near the front.
 */
export const exponentialSearch: AlgorithmModule<SearchInput, number> = {
  id: "exponential-search",
  version: 1,
  pseudocode: [
    "procedure exponentialSearch(A, target)",
    "  if A[0] = target: return 0",
    "  bound ← 1",
    "  while bound < n and A[bound] < target: bound ← 2 · bound",
    "  lo ← ⌊bound / 2⌋;  hi ← min(bound, n − 1)",
    "  binary search for target in A[lo..hi]",
    "  return its index, or −1",
  ],
  input: sortedSearchInput({
    limits: SORTED_LIMITS,
    presets: sortedPresets([
      {
        id: "near-front",
        label: "Target near the front of a long array",
        value: {
          values: [1, 3, 4, 6, 9, 11, 14, 17, 20, 22, 25, 29, 31, 34, 38, 41, 45, 48, 52, 57],
          target: 6,
        },
      },
    ]),
  }),

  run(input, t) {
    const A = t.array("A", input.values, { label: "A", display: "cells" });
    const { target } = input;
    const n = A.length;
    t.initVars({ target });
    const done = (r: number, line: number, note: string) => {
      if (r !== -1) A.mark(r, "found", { line, note });
      else t.step({ line, note });
      A.pointer("mid", null, { line: 7, vars: { result: r } });
      t.finish(input, r, { line: 7 });
      return r;
    };
    if (A.compareWith(0, target, { line: 2, note: `Is A[0] = ${A.get(0)} the target?` }) === 0)
      return done(0, 2, `Found ${target} at index 0.`);
    let bound = 1;
    A.pointer("bound", Math.min(bound, n - 1), { line: 3, vars: { bound } });
    while (bound < n) {
      const order = A.compareWith(bound, target, () => ({
        line: 4,
        note: `Is A[${bound}] = ${A.get(bound)} < ${target}?`,
      }));
      if (order >= 0) break;
      bound *= 2;
      A.pointer("bound", Math.min(bound, n - 1), {
        line: 4,
        vars: { bound },
        note:
          bound < n
            ? `Yes: double the bound to ${bound}.`
            : `The bound ${bound} passes the end of the array.`,
      });
    }
    let lo = Math.floor(bound / 2);
    let hi = Math.min(bound, n - 1);
    A.mark(range(0, lo - 1), "discarded", {
      line: 5,
      vars: { lo, hi },
      note: `The target can only be in A[${lo}..${hi}].`,
    });
    if (hi + 1 < n) A.mark(range(hi + 1, n - 1), "discarded", { line: 5 });
    A.pointer("bound", null, { line: 5 });
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      A.pointer("mid", mid, { line: 6, vars: { mid } });
      const order = A.compareWith(mid, target, () => ({
        line: 6,
        note: `Binary search: compare A[${mid}] = ${A.get(mid)} with ${target}.`,
      }));
      if (order === 0) return done(mid, 6, `Found ${target} at index ${mid}.`);
      if (order < 0) {
        A.mark(range(lo, mid), "discarded", { line: 6 });
        lo = mid + 1;
      } else {
        A.mark(range(mid, hi), "discarded", { line: 6 });
        hi = mid - 1;
      }
    }
    return done(-1, 7, `${target} is not in the array.`);
  },

  check: sortedSearchCheck,
  fidelity: (state, out) => foundFidelity(state, out),
  describeOutput: describeIndex,
};
