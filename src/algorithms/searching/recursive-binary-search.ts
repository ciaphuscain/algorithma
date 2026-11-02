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
 * Binary search written recursively: each call searches A[lo..hi] and either answers or
 * calls itself on one half. The call stack is drawn beside the array; it never grows
 * beyond ⌊log₂ n⌋ + 2 frames. Every call is a tail call, so the loop version does the
 * same work without the stack.
 */
export const recursiveBinarySearch: AlgorithmModule<SearchInput, number> = {
  id: "recursive-binary-search",
  version: 1,
  pseudocode: [
    "function search(A, target, lo, hi)",
    "  if lo > hi: return −1   // empty range",
    "  mid ← ⌊(lo + hi) / 2⌋",
    "  if A[mid] = target: return mid",
    "  if A[mid] < target: return search(A, target, mid + 1, hi)",
    "  return search(A, target, lo, mid − 1)",
  ],
  input: sortedSearchInput({
    limits: SORTED_LIMITS,
    presets: sortedPresets([
      {
        id: "first",
        label: "Target is the first element",
        value: { values: [3, 6, 9, 12, 15, 18, 21], target: 3 },
      },
    ]),
  }),

  run(input, t) {
    const A = t.array("A", input.values, { label: "A", display: "cells" });
    const S = t.sequence("calls", "stack", { label: "Call stack" });
    const { target } = input;
    t.initVars({ target });
    let maxDepth = 0;
    const search = (lo: number, hi: number): number => {
      S.push(`search(${lo}, ${hi})`, {
        line: 1,
        vars: { lo, hi, depth: S.size + 1 },
        note: `Call search(lo = ${lo}, hi = ${hi}).`,
      });
      maxDepth = Math.max(maxDepth, S.size);
      t.tally("calls");
      let result: number;
      if (lo > hi) {
        t.step({ line: 2, note: `lo = ${lo} > hi = ${hi}: the range is empty, return −1.` });
        result = -1;
      } else {
        const mid = Math.floor((lo + hi) / 2);
        A.pointer("mid", mid, { line: 3, vars: { mid } });
        const order = A.compareWith(mid, target, () => ({
          line: 4,
          note: `Compare A[${mid}] = ${A.get(mid)} with ${target}.`,
        }));
        if (order === 0) {
          A.mark(mid, "found", { line: 4, note: `Found ${target} at index ${mid}.` });
          result = mid;
        } else if (order < 0) {
          A.mark(range(lo, mid), "discarded", {
            line: 5,
            note: `${A.get(mid)} < ${target}: recurse on the right half.`,
          });
          result = search(mid + 1, hi);
        } else {
          A.mark(range(mid, hi), "discarded", {
            line: 6,
            note: `${A.get(mid)} > ${target}: recurse on the left half.`,
          });
          result = search(lo, mid - 1);
        }
      }
      S.pop({ line: result === -1 ? 2 : 4, note: `search(${lo}, ${hi}) returns ${result}.` });
      return result;
    };
    const out = search(0, A.length - 1);
    A.pointer("mid", null, { line: 1, vars: { result: out, maxDepth } });
    t.finish(input, out, {
      note: `${out === -1 ? "Not found" : `Found at index ${out}`}; the stack was at most ${maxDepth} frames deep.`,
    });
    return out;
  },

  check: sortedSearchCheck,
  fidelity: (state, out) => foundFidelity(state, out),
  describeOutput: describeIndex,
};
