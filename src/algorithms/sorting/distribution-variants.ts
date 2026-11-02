import type { Scalar } from "@/engine/protocol";
import type { TracedSequence } from "@/engine/tracer";
import type { AlgorithmModule } from "../types";
import { numberArrayInput } from "../inputs";
import { arrayFidelity, checkSorted, describeSorted, sortPresets } from "./common";

const digit = (x: number, p: number) => Math.floor(x / 10 ** p) % 10;
const range = (a: number, b: number) =>
  b < a ? [] : Array.from({ length: b - a + 1 }, (_, i) => a + i);

/**
 * MSD radix sort, base 10: distribute by the most significant digit into ten groups
 * (a counting sort), then sort each group recursively by the next digit. Groups of one
 * element stop early, so most of the work goes into long shared prefixes.
 */
export const msdRadixSort: AlgorithmModule<number[], number[]> = {
  id: "msd-radix-sort",
  version: 1,
  pseudocode: [
    "procedure msd(A, lo, hi, p)   // sort A[lo..hi] by digits p, p − 1, …, 0",
    "  if hi ≤ lo or p < 0: return",
    "  count the elements with each digit value at position p",
    "  place them into the buffer by digit (stable), and copy back",
    "  for each digit group A[s..e]: msd(A, s, e, p − 1)",
  ],
  input: numberArrayInput({
    limits: { minLength: 1, maxLength: 24, min: 0, max: 999 },
    defaultRandomLength: 10,
    presets: [
      { id: "three", label: "Three-digit numbers", value: [170, 45, 75, 90, 802, 24, 2, 66] },
      {
        id: "prefixes",
        label: "Shared leading digits",
        value: [512, 507, 519, 503, 98, 511, 534, 5],
      },
      { id: "sorted", label: "Already sorted", value: [1, 2, 3, 4, 5, 6, 7, 8] },
    ],
  }),

  run(values, t) {
    const A = t.array("A", values, { label: "A" });
    const B = t.array(
      "B",
      values.map((): Scalar => null),
      { label: "B (buffer)", display: "cells" },
    );
    const max = Math.max(...values);
    const d = Math.max(1, String(max).length);
    const sort = (lo: number, hi: number, p: number) => {
      if (hi <= lo || p < 0) {
        if (hi >= lo) A.mark(range(lo, hi), "sorted", { line: 2 });
        return;
      }
      t.tally("calls");
      const count = new Array(10).fill(0);
      for (let i = lo; i <= hi; i++) count[digit(A.read(i, { line: 3 }) as number, p)]++;
      const start: number[] = [];
      let s = lo;
      for (let k = 0; k < 10; k++) {
        start.push(s);
        s += count[k];
      }
      const next = [...start];
      t.step({
        line: 3,
        vars: { lo, hi, digit: p },
        note: `Group A[${lo}..${hi}] by digit ${p} (counting ${10 ** p}s).`,
      });
      for (let i = lo; i <= hi; i++) {
        const v = A.get(i) as number;
        B.write(next[digit(v, p)]!++, v, { line: 4 });
      }
      for (let i = lo; i <= hi; i++) {
        A.write(i, B.get(i), { line: 4 });
        B.write(i, null, { line: 4 });
      }
      for (let k = 0; k < 10; k++)
        if (count[k] > 0) sort(start[k]!, start[k]! + count[k] - 1, p - 1);
    };
    sort(0, A.length - 1, d - 1);
    A.mark(range(0, A.length - 1), "sorted", { line: 5 });
    const output = A.toArray() as number[];
    t.finish(values, output);
    return output;
  },
  check: checkSorted,
  fidelity: arrayFidelity("A"),
  describeOutput: describeSorted,
};

/**
 * Bucket sort for values in [0, 100): drop each value into one of n equal-width buckets,
 * sort each bucket (by insertion), and concatenate. With uniformly distributed input
 * each bucket holds O(1) values on average, so the expected time is O(n).
 */
export const bucketSort: AlgorithmModule<number[], number[]> = {
  id: "bucket-sort",
  version: 1,
  pseudocode: [
    "procedure bucketSort(A)   // values in [0, 100)",
    "  make k empty buckets (k = n, at most 8 here)",
    "  for each x in A: append x to bucket ⌊x · k / 100⌋",
    "  for each bucket in order: copy its values back into A",
    "    and insertion-sort that stretch of A",
  ],
  input: numberArrayInput({
    limits: { minLength: 1, maxLength: 24, min: 0, max: 99 },
    defaultRandomLength: 10,
    presets: [
      {
        id: "uniform",
        label: "Spread out values",
        value: [78, 17, 39, 26, 72, 94, 21, 12, 23, 68],
      },
      {
        id: "clustered",
        label: "Clustered values: one busy bucket",
        value: [41, 44, 40, 47, 43, 42, 3, 95],
      },
      { id: "sorted", label: "Already sorted", value: [1, 2, 3, 4, 5, 6, 7, 8] },
    ],
  }),

  run(values, t) {
    const A = t.array("A", values, { label: "A" });
    const n = A.length;
    const k = Math.max(1, Math.min(8, n));
    const buckets: TracedSequence[] = [];
    for (let b = 0; b < k; b++)
      buckets.push(
        t.sequence(`B${b}`, "queue", {
          label: `Bucket ${b}: [${Math.ceil((b * 100) / k)}, ${Math.ceil(((b + 1) * 100) / k)})`,
        }),
      );
    for (let i = 0; i < n; i++) {
      const x = A.read(i, { line: 3 }) as number;
      const b = Math.floor((x * k) / 100);
      buckets[b]!.push(x, {
        line: 3,
        vars: { x, bucket: b },
        note: `${x} goes to bucket ⌊${x} · ${k} / 100⌋ = ${b}.`,
      });
      A.write(i, null, { line: 3 });
    }
    let pos = 0;
    for (let b = 0; b < k; b++) {
      const start = pos;
      while (buckets[b]!.size > 0) {
        const v = buckets[b]!.pop({ line: 4 }) as number;
        A.write(pos++, v, { line: 4, vars: { bucket: b } });
      }
      for (let i = start + 1; i < pos; i++) {
        let j = i;
        while (
          j > start &&
          A.compare(j - 1, j, () => ({ line: 5, note: `Insertion sort within bucket ${b}.` })) > 0
        ) {
          A.swap(j - 1, j, { line: 5 });
          j--;
        }
      }
      if (pos > start) A.mark(range(start, pos - 1), "sorted", { line: 5 });
    }
    const output = A.toArray() as number[];
    t.finish(values, output, { note: `${k} buckets.` });
    return output;
  },
  check: checkSorted,
  fidelity: arrayFidelity("A"),
  describeOutput: describeSorted,
};

/**
 * Flashsort (Neubert, 1998): estimate each value's class from its value by linear
 * interpolation between the minimum and maximum, count the classes, move every value
 * into its class's region in place by following cycles, and finish with insertion sort,
 * which has little left to do when the values are roughly uniform.
 */
export const flashSort: AlgorithmModule<number[], number[]> = {
  id: "flash-sort",
  version: 1,
  pseudocode: [
    "m ← max(1, ⌊0.43 n⌋) classes;  class(x) = ⌊(m − 1)(x − min) / (max − min)⌋",
    "L[c] ← number of values in classes 0..c   // the end of each class's region",
    "swap the maximum to A[0]",
    "permute in cycles: take a value not yet placed, and repeatedly",
    "  put it at the end of its class's region (L[c] ← L[c] − 1), picking up the value there",
    "insertion sort the whole array",
  ],
  input: numberArrayInput({
    limits: { minLength: 1, maxLength: 30, min: -999, max: 999 },
    defaultRandomLength: 12,
    presets: sortPresets([
      {
        id: "uniform",
        label: "Roughly uniform",
        value: [42, 7, 88, 15, 63, 29, 94, 51, 3, 76, 34, 60],
      },
    ]),
  }),

  run(values, t) {
    const A = t.array("A", values, { label: "A" });
    const n = A.length;
    const m = Math.max(1, Math.floor(0.43 * n));
    let minI = 0;
    let maxI = 0;
    for (let i = 1; i < n; i++) {
      if (A.compare(i, minI, { line: 1 }) < 0) minI = i;
      if (A.compare(i, maxI, { line: 1 }) > 0) maxI = i;
    }
    const lo = A.num(minI);
    const hi = A.num(maxI);
    if (lo === hi) {
      A.mark(range(0, n - 1), "sorted", { line: 1, note: "All values are equal." });
      const output = A.toArray() as number[];
      t.finish(values, output);
      return output;
    }
    const cls = (x: number) => Math.floor(((m - 1) * (x - lo)) / (hi - lo));
    const L = t.array("L", new Array(m).fill(0), { label: "L (class ends)", display: "cells" });
    for (let i = 0; i < n; i++) {
      const c = cls(A.get(i) as number);
      L.write(c, L.num(c) + 1, { line: 2 });
    }
    for (let c = 1; c < m; c++) L.write(c, L.num(c) + L.num(c - 1), { line: 2 });
    t.step({
      line: 2,
      vars: { m, min: lo, max: hi },
      note: `${m} classes; L holds where each class's region ends.`,
    });
    A.swap(maxI, 0, { line: 3 });
    let moves = 0;
    let j = 0;
    let k = m - 1;
    while (moves < n - 1) {
      while (j > L.num(k) - 1) {
        j++;
        k = cls(A.get(j) as number);
      }
      let flash = A.get(j) as number;
      A.pointer("j", j, { line: 4, vars: { j, flash } });
      while (j !== L.num(k)) {
        k = cls(flash);
        const at = L.num(k) - 1;
        const hold = A.get(at) as number;
        A.write(at, flash, {
          line: 5,
          note: `${flash} is in class ${k}: put it at ${at}; pick up ${hold}.`,
        });
        flash = hold;
        L.write(k, at, { line: 5 });
        moves++;
      }
    }
    A.pointer("j", null, { line: 6 });
    for (let i = 1; i < n; i++) {
      let p = i;
      while (p > 0 && A.compare(p - 1, p, { line: 6 }) > 0) {
        A.swap(p - 1, p, { line: 6 });
        p--;
      }
    }
    A.mark(range(0, n - 1), "sorted", { line: 6 });
    const output = A.toArray() as number[];
    t.finish(values, output, { vars: { classes: m } });
    return output;
  },
  check: checkSorted,
  fidelity: arrayFidelity("A"),
  describeOutput: describeSorted,
};
