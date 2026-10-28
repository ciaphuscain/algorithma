import type { AlgorithmModule } from "../types";
import { sortedSearchInput, type SearchInput } from "../inputs";
import { describeIndex, foundFidelity, range, sortedSearchCheck, SORTED_LIMITS } from "./common";

/**
 * Interpolation search: like looking up a name in a phone book, guess where the target
 * should be from its value — the position a straight line through A[lo] and A[hi] would
 * put it at. On evenly spread keys it needs about log log n probes; on skewed keys it can
 * degrade to a linear scan.
 */
export const interpolationSearch: AlgorithmModule<SearchInput, number> = {
  id: "interpolation-search",
  version: 1,
  pseudocode: [
    "procedure interpolationSearch(A, target)",
    "  lo ← 0;  hi ← n − 1",
    "  while lo ≤ hi and A[lo] ≤ target ≤ A[hi]",
    "    if A[hi] = A[lo]: pos ← lo",
    "    else: pos ← lo + ⌊(target − A[lo]) · (hi − lo) / (A[hi] − A[lo])⌋",
    "    if A[pos] = target: return pos",
    "    if A[pos] < target: lo ← pos + 1  else: hi ← pos − 1",
    "  return −1",
  ],
  input: sortedSearchInput({
    limits: SORTED_LIMITS,
    presets: [
      {
        id: "uniform",
        label: "Evenly spread keys: one probe",
        value: { values: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100], target: 70 },
      },
      {
        id: "near-uniform",
        label: "Roughly even keys",
        value: { values: [3, 9, 14, 22, 27, 31, 40, 46, 52, 59, 63, 71], target: 46 },
      },
      {
        id: "skewed",
        label: "Skewed keys: probes creep one step at a time",
        value: { values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 999], target: 9 },
      },
      {
        id: "missing",
        label: "Target absent",
        value: { values: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100], target: 65 },
      },
    ],
  }),

  run(input, t) {
    const A = t.array("A", input.values, { label: "A", display: "cells" });
    const { target } = input;
    t.initVars({ target });
    let lo = 0;
    let hi = A.length - 1;
    A.pointer("lo", lo, { line: 2, vars: { lo, hi } });
    A.pointer("hi", hi, { line: 2 });
    let probes = 0;
    for (;;) {
      if (lo > hi) break;
      const a = A.read(lo, {
        line: 3,
        note: `Is ${target} between A[${lo}] and A[${hi}]?`,
      }) as number;
      const b = A.read(hi, { line: 3 }) as number;
      if (target < a || target > b) break;
      const pos = b === a ? lo : lo + Math.floor(((target - a) * (hi - lo)) / (b - a));
      probes++;
      A.pointer("pos", pos, {
        line: b === a ? 4 : 5,
        vars: { pos, probes },
        note:
          b === a
            ? `All keys in range are equal: probe lo.`
            : `Interpolate: ${lo} + ⌊(${target} − ${a}) · ${hi - lo} / (${b} − ${a})⌋ = ${pos}.`,
      });
      const order = A.compareWith(pos, target, () => ({
        line: 6,
        note: `Compare A[${pos}] = ${A.get(pos)} with ${target}.`,
      }));
      if (order === 0) {
        A.mark(pos, "found", {
          line: 6,
          note: `Found ${target} at index ${pos} after ${probes} probe${probes === 1 ? "" : "s"}.`,
        });
        t.finish(input, pos, { line: 6, vars: { result: pos } });
        return pos;
      }
      if (order < 0) {
        A.mark(range(lo, pos), "discarded", { line: 7 });
        lo = pos + 1;
        A.pointer("lo", lo, { line: 7, vars: { lo } });
      } else {
        A.mark(range(pos, hi), "discarded", { line: 7 });
        hi = pos - 1;
        A.pointer("hi", hi, { line: 7, vars: { hi } });
      }
    }
    A.pointer("pos", null, {
      line: 8,
      vars: { result: -1 },
      note: `${target} cannot be in the remaining range: not found after ${probes} probe${probes === 1 ? "" : "s"}.`,
    });
    t.finish(input, -1, { line: 8 });
    return -1;
  },

  check: sortedSearchCheck,
  fidelity: (state, out) => foundFidelity(state, out),
  describeOutput: describeIndex,
};
