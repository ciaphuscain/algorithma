import type { AlgorithmModule } from "../types";
import { numberArrayInput } from "../inputs";
import { arrayFidelity, checkSorted, describeSorted, SORT_LIMITS, sortPresets } from "./common";

const range = (a: number, b: number) =>
  b < a ? [] : Array.from({ length: b - a + 1 }, (_, i) => a + i);

const input = numberArrayInput({
  limits: SORT_LIMITS,
  defaultRandomLength: 12,
  presets: sortPresets([
    { id: "duplicates", label: "Many duplicates", value: [4, 9, 4, 4, 1, 9, 4, 1, 4, 9] },
    { id: "mixed", label: "Mixed", value: [24, 8, 42, 75, 29, 77, 38, 57, 13, 3] },
  ]),
});

/**
 * Three-way quicksort (Dijkstra's "Dutch national flag" partition): partition around
 * the pivot into < pivot, = pivot and > pivot, then recurse only on the outer parts.
 * Keys equal to the pivot are finished in one pass, so arrays with few distinct values
 * sort in linear time.
 */
export const threeWayQuickSort: AlgorithmModule<number[], number[]> = {
  id: "three-way-quick-sort",
  version: 1,
  pseudocode: [
    "procedure quick3(A, lo, hi)",
    "  if lo ≥ hi: return",
    "  v ← A[lo];  lt ← lo;  i ← lo + 1;  gt ← hi",
    "  while i ≤ gt",
    "    if A[i] < v: swap A[lt], A[i];  lt ← lt + 1;  i ← i + 1",
    "    else if A[i] > v: swap A[i], A[gt];  gt ← gt − 1",
    "    else: i ← i + 1",
    "  // A[lo..lt−1] < v = A[lt..gt] < A[gt+1..hi]",
    "  quick3(A, lo, lt − 1);  quick3(A, gt + 1, hi)",
  ],
  input,
  run(values, t) {
    const A = t.array("A", values, { label: "A" });
    const sort = (lo: number, hi: number, depth: number) => {
      if (lo >= hi) {
        if (lo === hi) A.mark(lo, "sorted", { line: 2 });
        return;
      }
      const v = A.num(lo);
      let lt = lo;
      let i = lo + 1;
      let gt = hi;
      A.mark(lo, "pivot", {
        line: 3,
        vars: { lo, hi, v, depth },
        note: `Partition A[${lo}..${hi}] around v = ${v}.`,
      });
      A.pointer("lt", lt, { line: 3 });
      A.pointer("gt", gt, { line: 3 });
      while (i <= gt) {
        A.pointer("i", i, { line: 4, vars: { lt, i, gt } });
        const c = A.compareWith(i, v, () => ({
          line: 5,
          note: `Compare A[${i}] = ${A.get(i)} with v = ${v}.`,
        }));
        if (c < 0) {
          A.swap(lt, i, { line: 5, note: `Smaller: swap it into the < region.` });
          lt++;
          i++;
          A.pointer("lt", lt, { line: 5 });
        } else if (c > 0) {
          A.swap(i, gt, { line: 6, note: `Larger: swap it to the > region at the right.` });
          gt--;
          A.pointer("gt", gt, { line: 6 });
        } else {
          i++;
          t.step({ line: 7, note: `Equal to v: leave it in the middle.` });
        }
      }
      A.pointer("i", null, { line: 8 });
      A.mark(range(lt, gt), "sorted", {
        line: 8,
        vars: { lt, gt },
        note: `A[${lt}..${gt}] all equal ${v} and are final; recurse on A[${lo}..${lt - 1}] and A[${gt + 1}..${hi}].`,
      });
      t.tally("partitions");
      sort(lo, lt - 1, depth + 1);
      sort(gt + 1, hi, depth + 1);
    };
    sort(0, A.length - 1, 0);
    for (const p of ["lt", "gt", "i"]) A.pointer(p, null, { line: 9 });
    const output = A.toArray() as number[];
    t.finish(values, output, { note: "Every element is final: the array is sorted." });
    return output;
  },
  check: checkSorted,
  fidelity: arrayFidelity("A"),
  describeOutput: describeSorted,
};

/**
 * Dual-pivot quicksort (Yaroslavskiy, 2009; Java's sort for primitive arrays since
 * Java 7): take two pivots p ≤ q from the ends and partition into < p, between p and q,
 * and > q in one scan, then recurse on the three parts.
 */
export const dualPivotQuickSort: AlgorithmModule<number[], number[]> = {
  id: "dual-pivot-quick-sort",
  version: 1,
  pseudocode: [
    "procedure dualPivot(A, lo, hi)",
    "  if lo ≥ hi: return",
    "  if A[lo] > A[hi]: swap them;  p ← A[lo];  q ← A[hi]",
    "  l ← lo + 1;  k ← lo + 1;  g ← hi − 1",
    "  while k ≤ g",
    "    if A[k] < p: swap A[k], A[l];  l ← l + 1",
    "    else if A[k] > q: while A[g] > q and k < g: g ← g − 1",
    "      swap A[k], A[g];  g ← g − 1;  if A[k] < p: swap A[k], A[l];  l ← l + 1",
    "    k ← k + 1",
    "  l ← l − 1;  g ← g + 1;  swap A[lo], A[l];  swap A[hi], A[g]   // pivots to their places",
    "  dualPivot(A, lo, l − 1);  dualPivot(A, l + 1, g − 1);  dualPivot(A, g + 1, hi)",
  ],
  input,
  run(values, t) {
    const A = t.array("A", values, { label: "A" });
    const sort = (lo: number, hi: number, depth: number) => {
      if (lo >= hi) {
        if (lo === hi) A.mark(lo, "sorted", { line: 2 });
        return;
      }
      if (A.compare(lo, hi, { line: 3, note: `Order the two pivots A[${lo}] and A[${hi}].` }) > 0)
        A.swap(lo, hi, { line: 3 });
      const p = A.num(lo);
      const q = A.num(hi);
      A.mark([lo, hi], "pivot", {
        line: 3,
        vars: { lo, hi, p, q, depth },
        note: `Pivots p = ${p} and q = ${q}.`,
      });
      let l = lo + 1;
      let k = lo + 1;
      let g = hi - 1;
      const less = (i: number) =>
        A.compareWith(i, p, () => ({ line: 6, note: `Is A[${i}] = ${A.get(i)} < p = ${p}?` })) < 0;
      const more = (i: number, line: number) =>
        A.compareWith(i, q, () => ({ line, note: `Is A[${i}] = ${A.get(i)} > q = ${q}?` })) > 0;
      while (k <= g) {
        A.pointer("k", k, { line: 5, vars: { l, k, g } });
        if (less(k)) {
          if (k !== l) A.swap(k, l, { line: 6, note: `Smaller than p: move it to the left part.` });
          l++;
        } else if (more(k, 7)) {
          while (k < g && more(g, 7)) g--;
          A.swap(k, g, { line: 8, note: `Larger than q: swap it with A[${g}] from the right.` });
          g--;
          if (less(k)) {
            if (k !== l) A.swap(k, l, { line: 8 });
            l++;
          }
        }
        k++;
      }
      A.pointer("k", null, { line: 10 });
      l--;
      g++;
      if (l !== lo) A.swap(lo, l, { line: 10, note: `Put p into position ${l}.` });
      if (g !== hi) A.swap(hi, g, { line: 10, note: `Put q into position ${g}.` });
      A.mark([l, g], "sorted", {
        line: 10,
        note: `p and q are final. Recurse on the three parts.`,
      });
      t.tally("partitions");
      sort(lo, l - 1, depth + 1);
      sort(l + 1, g - 1, depth + 1);
      sort(g + 1, hi, depth + 1);
    };
    sort(0, A.length - 1, 0);
    const output = A.toArray() as number[];
    t.finish(values, output, { note: "Every element is final: the array is sorted." });
    return output;
  },
  check: checkSorted,
  fidelity: arrayFidelity("A"),
  describeOutput: describeSorted,
};
