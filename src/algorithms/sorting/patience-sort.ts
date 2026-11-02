import type { TracedSequence } from "@/engine/tracer";
import type { AlgorithmModule } from "../types";
import { numberArrayInput } from "../inputs";
import { arrayFidelity, checkSorted, describeSorted, sortPresets } from "./common";

export const MAX_PATIENCE = 16;

/** Pile tops after dealing, left to right (the number of piles is the length of a longest strictly increasing subsequence). */
export function dealPiles(a: number[]): number[][] {
  const piles: number[][] = [];
  for (const x of a) {
    const p = piles.find((pile) => pile.at(-1)! >= x);
    if (p) p.push(x);
    else piles.push([x]);
  }
  return piles;
}

/**
 * Patience sorting (named after the card game; Mallows): deal the values onto piles —
 * each onto the leftmost pile whose top is at least as large, or onto a new pile — then
 * repeatedly take the smallest top. The pile tops are always increasing from left to
 * right, so the deal uses binary search, and the number of piles equals the length of
 * the longest strictly increasing subsequence.
 */
export const patienceSort: AlgorithmModule<number[], number[]> = {
  id: "patience-sort",
  version: 1,
  pseudocode: [
    "procedure patienceSort(A)",
    "  for each x in A",
    "    binary search for the leftmost pile whose top ≥ x",
    "    put x on it, or start a new pile at the right",
    "  for k ← 0 to n − 1",
    "    A[k] ← the smallest pile top; remove it from its pile",
  ],
  input: numberArrayInput({
    limits: { minLength: 1, maxLength: MAX_PATIENCE, min: -999, max: 999 },
    defaultRandomLength: 10,
    presets: sortPresets([
      { id: "cards", label: "A hand of cards", value: [7, 2, 8, 1, 3, 4, 10, 6, 9, 5] },
    ]),
  }),

  run(values, t) {
    const A = t.array("A", values, { label: "A" });
    const piles: TracedSequence[] = [];
    const tops: number[] = [];
    const n = A.length;
    for (let i = 0; i < n; i++) {
      const x = A.num(i);
      A.pointer("i", i, { line: 2, vars: { x } });
      let lo = 0;
      let hi = piles.length;
      while (lo < hi) {
        const mid = Math.floor((lo + hi) / 2);
        t.tally("comparisons");
        t.step({
          line: 3,
          vars: { mid },
          note: `Is the top of pile ${mid + 1}, ${tops[mid]}, ≥ ${x}?`,
        });
        if (tops[mid]! >= x) hi = mid;
        else lo = mid + 1;
      }
      if (lo === piles.length) {
        piles.push(t.sequence(`P${lo + 1}`, "stack", { label: `Pile ${lo + 1}` }));
        tops.push(x);
        piles[lo]!.push(x, {
          line: 4,
          note: `Every top is smaller than ${x}: start pile ${lo + 1}.`,
        });
      } else {
        tops[lo] = x;
        piles[lo]!.push(x, { line: 4, note: `Put ${x} on pile ${lo + 1}.` });
      }
      A.write(i, null, { line: 4 });
    }
    A.pointer("i", null, {
      line: 5,
      vars: { piles: piles.length },
      note: `${piles.length} piles: a longest increasing subsequence has ${piles.length} elements.`,
    });
    for (let k = 0; k < n; k++) {
      let best = -1;
      for (let p = 0; p < piles.length; p++) {
        if (piles[p]!.size === 0) continue;
        if (best >= 0) t.tally("comparisons");
        if (
          best < 0 ||
          (piles[p]!.peekAll().at(-1) as number) < (piles[best]!.peekAll().at(-1) as number)
        )
          best = p;
      }
      const v = piles[best]!.pop({
        line: 6,
        note: `The smallest top is on pile ${best + 1}.`,
      }) as number;
      A.write(k, v, { line: 6, vars: { k } });
      A.mark(k, "sorted", { line: 6 });
    }
    const output = A.toArray() as number[];
    t.finish(values, output, { vars: { piles: piles.length } });
    return output;
  },

  check: checkSorted,
  fidelity: arrayFidelity("A"),
  describeOutput: describeSorted,
};
