import type { Scalar } from "@/engine/protocol";
import type { TracedArray, Tracer } from "@/engine/tracer";
import type { AlgorithmModule } from "../types";
import { numberArrayInput } from "../inputs";
import { arrayFidelity, checkSorted, describeSorted, SORT_LIMITS, sortPresets } from "./common";

const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

/** Merge the sorted runs A[lo..mid] and A[mid+1..hi] through the buffer B (stable). */
function merge(
  t: Tracer,
  A: TracedArray,
  B: TracedArray,
  lo: number,
  mid: number,
  hi: number,
  line: number,
): void {
  for (let k = lo; k <= hi; k++) B.write(k, A.get(k), { line });
  A.mark(range(lo, hi), "active", {
    line,
    note: `Merge A[${lo}..${mid}] with A[${mid + 1}..${hi}] through the buffer.`,
  });
  let i = lo;
  let j = mid + 1;
  for (let k = lo; k <= hi; k++) {
    const left =
      j > hi ||
      (i <= mid &&
        B.compare(i, j, () => ({
          line,
          note: `Compare B[${i}] = ${B.get(i)} with B[${j}] = ${B.get(j)}.`,
        })) <= 0);
    A.write(k, B.get(left ? i : j), { line });
    if (left) i++;
    else j++;
  }
  for (let k = lo; k <= hi; k++) B.write(k, null, { line });
  A.mark(range(lo, hi), null, { line });
  t.tally("merges");
}

const input = numberArrayInput({
  limits: { ...SORT_LIMITS, maxLength: 32 },
  defaultRandomLength: 10,
  presets: sortPresets([
    { id: "runs", label: "Three natural runs", value: [3, 7, 9, 2, 5, 8, 1, 4, 6] },
    { id: "duplicates", label: "With duplicates", value: [4, 1, 4, 2, 1, 4] },
  ]),
});

/**
 * Bottom-up merge sort: no recursion. Merge pairs of runs of width 1, then 2, 4, 8, …
 * until one run covers the array. ⌈log₂ n⌉ passes, each O(n).
 */
export const bottomUpMergeSort: AlgorithmModule<number[], number[]> = {
  id: "bottom-up-merge-sort",
  version: 1,
  pseudocode: [
    "procedure bottomUpMergeSort(A)",
    "  for width ← 1, 2, 4, … while width < n",
    "    for lo ← 0, 2·width, 4·width, … while lo + width < n",
    "      merge A[lo .. lo + width − 1] with A[lo + width .. min(lo + 2·width, n) − 1]",
  ],
  input,
  run(values, t) {
    const A = t.array("A", values, { label: "A" });
    const B = t.array(
      "B",
      values.map((): Scalar => null),
      { label: "B (merge buffer)", display: "cells" },
    );
    const n = A.length;
    let passes = 0;
    for (let width = 1; width < n; width *= 2) {
      passes++;
      t.step({
        line: 2,
        vars: { width, pass: passes },
        note: `Pass ${passes}: merge pairs of sorted runs of width ${width}.`,
      });
      for (let lo = 0; lo + width < n; lo += 2 * width) {
        const mid = lo + width - 1;
        const hi = Math.min(lo + 2 * width, n) - 1;
        t.step({ line: 3, vars: { lo, mid, hi } });
        merge(t, A, B, lo, mid, hi, 4);
      }
    }
    A.mark(range(0, n - 1), "sorted", {
      line: 2,
      vars: { passes },
      note: `Sorted after ${passes} pass${passes === 1 ? "" : "es"}.`,
    });
    const output = A.toArray() as number[];
    t.finish(values, output, { vars: { passes } });
    return output;
  },
  check: checkSorted,
  fidelity: arrayFidelity("A"),
  describeOutput: describeSorted,
};

/** Maximal non-decreasing runs, as [start, end] pairs. */
export function naturalRuns(a: number[]): [number, number][] {
  const runs: [number, number][] = [];
  let start = 0;
  for (let i = 1; i <= a.length; i++)
    if (i === a.length || a[i]! < a[i - 1]!) {
      runs.push([start, i - 1]);
      start = i;
    }
  return runs;
}

/**
 * Natural merge sort: find the runs that are already in order, then merge neighbouring
 * runs pairwise, pass after pass, until one run is left. Sorted input is recognised in
 * one scan; r runs need ⌈log₂ r⌉ merge passes.
 */
export const naturalMergeSort: AlgorithmModule<number[], number[]> = {
  id: "natural-merge-sort",
  version: 1,
  pseudocode: [
    "procedure naturalMergeSort(A)",
    "  scan A and split it into maximal non-decreasing runs",
    "  while there is more than one run",
    "    merge runs 1 and 2, runs 3 and 4, … (an odd last run waits)",
    "    the merged runs are the runs of the next pass",
  ],
  input,
  run(values, t) {
    const A = t.array("A", values, { label: "A" });
    const B = t.array(
      "B",
      values.map((): Scalar => null),
      { label: "B (merge buffer)", display: "cells" },
    );
    const n = A.length;
    // Finding the runs compares each neighbouring pair once.
    let runs: [number, number][] = [];
    let start = 0;
    for (let i = 1; i <= n; i++) {
      if (
        i === n ||
        A.compare(i - 1, i, () => ({
          line: 2,
          note: `Does the run continue at ${i}? Compare A[${i - 1}] with A[${i}].`,
        })) > 0
      ) {
        runs.push([start, i - 1]);
        start = i;
      }
    }
    t.step({
      line: 2,
      vars: { runs: runs.length },
      note: `${runs.length} natural run${runs.length === 1 ? "" : "s"}: ${runs.map(([a, b]) => `${a}–${b}`).join(", ")}.`,
    });
    let passes = 0;
    while (runs.length > 1) {
      passes++;
      t.step({
        line: 3,
        vars: { runs: runs.length, pass: passes },
        note: `Pass ${passes}: merge the ${runs.length} runs in pairs.`,
      });
      const next: [number, number][] = [];
      for (let r = 0; r < runs.length; r += 2) {
        if (r + 1 === runs.length) {
          next.push(runs[r]!);
          t.step({ line: 4, note: `Run ${runs[r]![0]}–${runs[r]![1]} has no partner this pass.` });
          continue;
        }
        const [lo, mid] = runs[r]!;
        const hi = runs[r + 1]![1];
        merge(t, A, B, lo, mid, hi, 4);
        next.push([lo, hi]);
      }
      runs = next;
      t.step({ line: 5, vars: { runs: runs.length } });
    }
    A.mark(range(0, n - 1), "sorted", {
      line: 3,
      vars: { passes },
      note: `One run left: sorted after ${passes} merge pass${passes === 1 ? "" : "es"}.`,
    });
    const output = A.toArray() as number[];
    t.finish(values, output, { vars: { passes } });
    return output;
  },
  check: checkSorted,
  fidelity: arrayFidelity("A"),
  describeOutput: describeSorted,
};
