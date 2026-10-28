import type { AlgorithmModule } from "../types";
import { searchInput, type SearchInput } from "../inputs";
import { describeIndex, foundFidelity, SORTED_LIMITS } from "./common";

/**
 * Sentinel linear search: append the target after the last element, so the scan is
 * guaranteed to stop and needs no "is i still inside the array?" test — one comparison
 * per element instead of two. Whether the match was a real element or the sentinel is
 * decided once, at the end.
 */
export const sentinelSearch: AlgorithmModule<SearchInput, number> = {
  id: "sentinel-search",
  version: 1,
  pseudocode: [
    "procedure sentinelSearch(A, target)",
    "  A[n] ← target   // the sentinel, one past the end",
    "  i ← 0",
    "  while A[i] ≠ target: i ← i + 1   // no bounds test needed",
    "  if i < n: return i   // a real element",
    "  return −1   // only the sentinel matched",
  ],
  input: searchInput({
    sorted: false,
    limits: { ...SORTED_LIMITS, maxLength: 39 },
    presets: [
      { id: "found", label: "Target present", value: { values: [7, 3, 9, 1, 4, 8, 2], target: 4 } },
      {
        id: "missing",
        label: "Target absent: the sentinel stops the scan",
        value: { values: [7, 3, 9, 1, 4, 8, 2], target: 5 },
      },
      { id: "duplicates", label: "Repeated target", value: { values: [5, 2, 6, 2, 9], target: 2 } },
    ],
  }),

  run(input, t) {
    const n = input.values.length;
    const A = t.array("A", [...input.values, null], {
      label: "A, with a spare cell",
      display: "cells",
    });
    const { target } = input;
    t.initVars({ target, n });
    A.write(n, target, {
      line: 2,
      note: `Put the target ${target} in the spare cell at index ${n}.`,
    });
    let i = 0;
    A.pointer("i", i, { line: 3, vars: { i } });
    while (
      A.compareWith(i, target, () => ({
        line: 4,
        note: `Is A[${i}] = ${A.get(i)} equal to ${target}?`,
      })) !== 0
    ) {
      A.mark(i, "discarded", { line: 4 });
      i++;
      A.pointer("i", i, { line: 4, vars: { i } });
    }
    if (i < n) {
      A.mark(i, "found", {
        line: 5,
        vars: { result: i },
        note: `Matched at index ${i} < n = ${n}: a real element, found after ${i + 1} comparison${i ? "s" : ""}.`,
      });
      t.finish(input, i, { line: 5 });
      return i;
    }
    A.mark(n, "discarded", {
      line: 6,
      vars: { result: -1 },
      note: `Only the sentinel matched: ${target} is not in the array. ${n + 1} comparisons, and no bounds tests.`,
    });
    t.finish(input, -1, { line: 6 });
    return -1;
  },

  check(input, out) {
    const want = input.values.indexOf(input.target);
    return out === want ? null : `returned ${out}, expected the first occurrence ${want}`;
  },

  fidelity: (state, out) => foundFidelity(state, out),
  describeOutput: describeIndex,
};
