import type { AlgorithmModule } from "../types";
import { numberArrayInput } from "../inputs";
import { arrayFidelity, checkSorted } from "./common";

/**
 * Quicksort with the Lomuto partition scheme and the last element as pivot — the
 * version most textbooks present first. Its worst case (already sorted input) is
 * quadratic, which the presets let learners observe directly.
 */
export const quickSort: AlgorithmModule<number[], number[]> = {
  id: "quick-sort",
  version: 2,
  pseudocode: [
    "procedure quickSort(A, lo, hi)",
    "  if lo ≥ hi: return",
    "  pivot ← A[hi];  i ← lo",
    "  for j ← lo to hi − 1",
    "    if A[j] < pivot",
    "      swap A[i] and A[j];  i ← i + 1",
    "  swap A[i] and A[hi]   // pivot reaches its final place",
    "  quickSort(A, lo, i − 1);  quickSort(A, i + 1, hi)",
  ],
  input: numberArrayInput({
    limits: { minLength: 1, maxLength: 40, min: -999, max: 999 },
    defaultRandomLength: 10,
    presets: [
      { id: "classic", label: "Small example", value: [2, 8, 7, 1, 3, 5, 6, 4] },
      { id: "sorted", label: "Already sorted (worst case)", value: [1, 2, 3, 4, 5, 6, 7, 8] },
      { id: "duplicates", label: "Many duplicates", value: [3, 3, 1, 3, 2, 3, 3] },
      { id: "random", label: "Ten values", value: [33, 10, 55, 71, 29, 3, 18, 42, 60, 25] },
    ],
  }),

  run(input, t) {
    const A = t.array("A", input, { label: "A" });
    const n = A.length;
    // The recursion tree is a drawing aid: its events change no operation counts.
    const R = t.tree("R", { binary: true, label: "Recursion tree: calls on A[lo..hi]" });
    const call = (lo: number, hi: number, parent: string | null, slot?: 0 | 1) => {
      const id = `c${lo}-${hi}`;
      R.add(lo === hi ? `${lo}` : `${lo}–${hi}`, parent, slot, { line: 1 }, { id, view: true });
      R.status(id, "current", { line: 1 });
      return id;
    };

    const sort = (lo: number, hi: number, depth: number, parent: string | null, slot?: 0 | 1) => {
      if (lo > hi) return;
      const node = call(lo, hi, parent, slot);
      if (lo === hi) {
        A.mark(lo, "sorted", {
          line: 2,
          vars: { lo, hi, depth },
          note: `A[${lo}..${hi}] has one element, so it is in its final place.`,
        });
        R.annotate(node, String(A.get(lo)));
        R.status(node, "visited");
        return;
      }
      const pivot = A.num(hi);
      let i = lo;
      A.mark(hi, "pivot", {
        line: 3,
        vars: { lo, hi, depth, pivot, i, j: null },
        note: `Partition A[${lo}..${hi}] around the pivot A[${hi}] = ${pivot}.`,
      });
      A.pointer("i", i, { line: 3 });
      for (let j = lo; j < hi; j++) {
        const jj = j;
        A.pointer("j", jj, { line: 4, vars: { j: jj } });
        const order = A.compare(jj, hi, () => ({
          line: 5,
          note: `Is A[${jj}] = ${A.get(jj)} less than the pivot ${pivot}?`,
        }));
        if (order < 0) {
          if (i !== jj) {
            const [x, y] = [A.get(i), A.get(jj)];
            A.swap(i, jj, () => ({
              line: 6,
              note: `Yes: swap A[${i}] = ${x} with A[${jj}] = ${y} to grow the “less than pivot” region.`,
            }));
          } else {
            t.step({
              line: 6,
              note: `Yes, and it is already at the boundary (i = j), so no swap is needed.`,
            });
          }
          i++;
          A.pointer("i", i, { line: 6, vars: { i } });
        }
      }
      A.pointer("j", null, { line: 7, vars: { j: null } });
      if (i !== hi) {
        A.swap(i, hi, {
          line: 7,
          note: `Move the pivot ${pivot} into position ${i}, between the two regions.`,
        });
        // Marks belong to positions, not values: the pivot mark must not stay behind at hi.
        A.mark(hi, null, { line: 7 });
      }
      A.mark(i, "sorted", {
        line: 7,
        note: `Everything left of position ${i} is < ${pivot}; everything right is ≥ ${pivot}. The pivot is final.`,
      });
      A.pointer("i", null, { line: 8 });
      const p = i;
      t.step({
        line: 8,
        vars: { i: null, pivot: null },
        note: `Recurse on A[${lo}..${p - 1}] and A[${p + 1}..${hi}].`,
      });
      R.annotate(node, `pivot ${pivot}`);
      R.status(node, "frontier", { line: 8 });
      sort(lo, p - 1, depth + 1, node, 0);
      sort(p + 1, hi, depth + 1, node, 1);
      R.status(node, "visited", { line: 8 });
    };

    sort(0, n - 1, 0, null);
    const output = A.toArray() as number[];
    t.finish(input, output, {
      vars: { lo: null, hi: null, depth: null, pivot: null },
      note: "Every element has been a pivot or a one-element range: the array is sorted.",
    });
    return output;
  },

  check: checkSorted,
  fidelity: arrayFidelity("A"),
  describeOutput: (out) => `Sorted: [${out.join(", ")}]`,
};
