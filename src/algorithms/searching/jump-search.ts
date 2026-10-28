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
 * Jump search: hop through the sorted array in blocks of ⌊√n⌋ until the end of a block
 * is at least the target, then scan that one block. At most about 2√n comparisons, and
 * the jumps only ever move forwards — useful when stepping back is expensive.
 */
export const jumpSearch: AlgorithmModule<SearchInput, number> = {
  id: "jump-search",
  version: 1,
  pseudocode: [
    "procedure jumpSearch(A, target)",
    "  m ← ⌊√n⌋;  prev ← 0;  next ← m",
    "  while A[min(next, n) − 1] < target",
    "    prev ← next;  next ← next + m",
    "    if prev ≥ n: return −1",
    "  for i ← prev to min(next, n) − 1: if A[i] = target: return i",
    "  return −1",
  ],
  input: sortedSearchInput({
    limits: SORTED_LIMITS,
    presets: sortedPresets([
      {
        id: "long",
        label: "Sixteen keys: blocks of four",
        value: {
          values: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610],
          target: 55,
        },
      },
    ]),
  }),

  run(input, t) {
    const A = t.array("A", input.values, { label: "A", display: "cells" });
    const { target } = input;
    const n = A.length;
    const m = Math.max(1, Math.floor(Math.sqrt(n)));
    let prev = 0;
    let next = m;
    t.initVars({ target, m });
    const fail = (line: number, note: string) => {
      A.pointer("i", null, { line, vars: { result: -1 }, note });
      t.finish(input, -1, { line });
      return -1;
    };
    for (;;) {
      const end = Math.min(next, n) - 1;
      A.pointer("i", end, { line: 3, vars: { prev, next } });
      const order = A.compareWith(end, target, () => ({
        line: 3,
        note: `Is the last key of the block, A[${end}] = ${A.get(end)}, < ${target}?`,
      }));
      if (order >= 0) break;
      A.mark(range(prev, end), "discarded", { line: 4 });
      prev = next;
      next += m;
      t.step({ line: 4, vars: { prev, next }, note: `Yes: jump ahead ${m} positions.` });
      if (prev >= n) return fail(5, `Jumped past the end: ${target} is larger than every key.`);
    }
    for (let i = prev; i < Math.min(next, n); i++) {
      A.pointer("i", i, { line: 6, vars: { i } });
      const order = A.compareWith(i, target, () => ({
        line: 6,
        note: `Scan the block: is A[${i}] = ${A.get(i)} the target?`,
      }));
      if (order === 0) {
        A.mark(i, "found", {
          line: 6,
          vars: { result: i },
          note: `Found ${target} at index ${i}.`,
        });
        t.finish(input, i, { line: 6 });
        return i;
      }
      A.mark(i, "discarded", { line: 6 });
      if (order > 0) break;
    }
    return fail(7, `${target} is not in its block, so it is not in the array.`);
  },

  check: sortedSearchCheck,
  fidelity: (state, out) => foundFidelity(state, out),
  describeOutput: describeIndex,
};
