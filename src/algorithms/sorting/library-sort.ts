import type { Scalar } from "@/engine/protocol";
import type { TraceState } from "@/engine/state";
import type { AlgorithmModule } from "../types";
import { numberArrayInput } from "../inputs";
import { checkSorted, describeSorted, sortPresets } from "./common";

export const MAX_LIBRARY = 20;

/**
 * Library sort (gapped insertion sort; Bender, Farach-Colton and Mosteiro): like
 * shelving books with spaces left between them, keep the sorted elements spread out
 * with gaps, so an insertion usually shifts only a few elements before reaching a gap.
 * After 1, 2, 4, 8, … insertions, re-spread the elements with one gap after each.
 * Expected O(n log n) time with high probability for random insertion order.
 */
export const librarySort: AlgorithmModule<number[], number[]> = {
  id: "library-sort",
  version: 1,
  pseudocode: [
    "procedure librarySort(A)   // S has 2n cells; empty cells are gaps",
    "  for each x of A, in order",
    "    binary search the occupied cells of S for the last one ≤ x; p ← the cell after it",
    "    if S[p] is a gap: S[p] ← x",
    "    else: shift S[p..] right up to the next gap, then S[p] ← x",
    "    after 1, 2, 4, 8, … insertions: re-spread so each element is followed by a gap",
    "  read the occupied cells of S from left to right",
  ],
  input: numberArrayInput({
    limits: { minLength: 1, maxLength: MAX_LIBRARY, min: -999, max: 999 },
    defaultRandomLength: 10,
    presets: sortPresets([
      { id: "shelf", label: "Ten books", value: [47, 12, 85, 3, 61, 29, 74, 18, 90, 55] },
    ]),
  }),

  run(values, t) {
    const n = values.length;
    const size = 2 * n;
    const S = t.array(
      "S",
      Array.from({ length: size }, (): Scalar => null),
      {
        label: "S (shelf with gaps)",
        display: "cells",
      },
    );
    let count = 0;
    const occupied = () => {
      const o: number[] = [];
      for (let i = 0; i < size; i++) if (S.get(i) !== null) o.push(i);
      return o;
    };
    for (const [idx, x] of values.entries()) {
      const occ = occupied();
      // Binary search among occupied cells for the last value ≤ x.
      let lo = 0;
      let hi = occ.length;
      while (lo < hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (
          S.compareWith(occ[mid]!, x, () => ({
            line: 3,
            vars: { x },
            note: `Is S[${occ[mid]}] = ${S.get(occ[mid]!)} ≤ ${x}?`,
          })) <= 0
        )
          lo = mid + 1;
        else hi = mid;
      }
      let p = lo === 0 ? 0 : occ[lo - 1]! + 1;
      if (lo === 0 && occ.length && occ[0]! > 0) p = occ[0]! - 1;
      S.pointer("p", p, { line: 3, vars: { p } });
      if (S.get(p) === null) {
        S.write(p, x, { line: 4, note: `S[${p}] is a gap: shelve ${x} there.` });
      } else {
        let gap = p;
        while (S.get(gap) !== null) gap++;
        for (let j = gap; j > p; j--) {
          S.write(j, S.get(j - 1), { line: 5, note: `Shift ${S.get(j - 1)} right into the gap.` });
          t.tally("shifts");
        }
        S.write(p, x, { line: 5, note: `Shelve ${x} at ${p}.` });
      }
      count++;
      if ((count & (count - 1)) === 0 && idx < n - 1) {
        const items = occupied().map((i) => S.get(i));
        t.step({
          line: 6,
          vars: { inserted: count },
          note: `${count} elements shelved: re-spread them with a gap after each.`,
        });
        for (let i = 0; i < size; i++) if (S.get(i) !== null) S.write(i, null, { line: 6 });
        items.forEach((v, j) => S.write(2 * j, v, { line: 6 }));
        t.tally("rebalances");
      }
    }
    S.pointer("p", null, { line: 7 });
    const output = occupied().map((i) => S.get(i) as number);
    S.mark(occupied(), "sorted", {
      line: 7,
      note: "Reading the occupied cells from left to right gives the sorted order.",
    });
    t.finish(values, output);
    return output;
  },

  check: checkSorted,
  fidelity(state: TraceState, out) {
    const S = state.structures.S;
    if (S?.kind !== "array") return "no shelf S";
    const shelf = S.values.filter((v) => v !== null);
    return shelf.join() === out.join() ? null : "the shelf differs from the result";
  },
  describeOutput: describeSorted,
};
