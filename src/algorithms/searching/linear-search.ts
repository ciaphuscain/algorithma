import type { TraceState } from "@/engine/state";
import type { AlgorithmModule } from "../types";
import { searchInput, type SearchInput } from "../inputs";

/** Linear search: scan left to right; return the first index holding the target, or −1. */
export const linearSearch: AlgorithmModule<SearchInput, number> = {
  id: "linear-search",
  version: 1,
  pseudocode: [
    "procedure linearSearch(A, target)",
    "  for i ← 0 to n − 1",
    "    if A[i] = target: return i",
    "  return −1   // target is not in A",
  ],
  input: searchInput({
    sorted: false,
    limits: { minLength: 1, maxLength: 40, min: -999, max: 999 },
    presets: [
      { id: "found", label: "Target present", value: { values: [7, 3, 9, 1, 4, 8, 2], target: 4 } },
      {
        id: "missing",
        label: "Target absent (worst case)",
        value: { values: [7, 3, 9, 1, 4, 8, 2], target: 5 },
      },
      { id: "duplicates", label: "Repeated target", value: { values: [5, 2, 6, 2, 9], target: 2 } },
    ],
  }),

  run(input, t) {
    const A = t.array("A", input.values, { label: "A", display: "cells" });
    const { target } = input;
    t.initVars({ target });
    for (let i = 0; i < A.length; i++) {
      A.pointer("i", i, { line: 2, vars: { i } });
      const order = A.compareWith(i, target, () => ({
        line: 3,
        note: `Is A[${i}] = ${A.get(i)} equal to ${target}?`,
      }));
      if (order === 0) {
        A.mark(i, "found", {
          line: 3,
          note: `Yes: found ${target} at index ${i} after ${i + 1} comparison${i ? "s" : ""}.`,
        });
        t.finish(input, i, { line: 3, vars: { result: i } });
        return i;
      }
      A.mark(i, "discarded", { line: 3 });
    }
    A.pointer("i", null, {
      line: 4,
      vars: { i: null, result: -1 },
      note: `Checked all ${A.length} elements: ${target} is not present.`,
    });
    t.finish(input, -1, { line: 4 });
    return -1;
  },

  check(input, out) {
    const want = input.values.indexOf(input.target);
    return out === want ? null : `returned ${out}, expected the first occurrence ${want}`;
  },

  fidelity(state: TraceState, out) {
    const A = state.structures.A;
    if (!A || A.kind !== "array") return "no array A";
    const found = A.marks.findIndex((m) => m === "found");
    return found === out ? null : `found mark at ${found}, result ${out}`;
  },

  describeOutput: (out) => (out === -1 ? "Not found (−1)" : `Found at index ${out}`),
};
