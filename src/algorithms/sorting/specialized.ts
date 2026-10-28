import type { Scalar } from "@/engine/protocol";
import type { TraceState } from "@/engine/state";
import type { TracedArray } from "@/engine/tracer";
import type { AlgorithmModule } from "../types";
import { numberArrayInput } from "../inputs";
import { arrayFidelity, checkSorted, describeSorted, SORT_LIMITS, sortPresets } from "./common";

const range = (a: number, b: number) =>
  b < a ? [] : Array.from({ length: b - a + 1 }, (_, i) => a + i);

/** Timsort's minimum run length: the top 6 bits of n, plus 1 if any lower bit is set (n ≥ 64). */
export function minRun(n: number): number {
  let r = 0;
  while (n >= 64) {
    r |= n & 1;
    n >>= 1;
  }
  return n + r;
}

/** Stable merge of A[lo..mid] and A[mid+1..hi] through buffer B. */
function mergeRuns(
  A: TracedArray,
  B: TracedArray,
  lo: number,
  mid: number,
  hi: number,
  line: number,
) {
  for (let k = lo; k <= mid; k++) B.write(k, A.get(k), { line });
  let i = lo;
  let j = mid + 1;
  for (let k = lo; k <= hi; k++) {
    // The left run is in the buffer; the right run is still in place in A.
    let takeLeft: boolean;
    if (i > mid) takeLeft = false;
    else if (j > hi) takeLeft = true;
    else takeLeft = B.compareWith(i, A.get(j), { line }) <= 0;
    A.write(k, takeLeft ? B.get(i) : A.get(j), { line });
    if (takeLeft) i++;
    else j++;
  }
  for (let k = lo; k <= mid; k++) B.write(k, null, { line });
}

export const MAX_TIMSORT = 40;

/**
 * Timsort (Peters, 2002; Python's and Java's object sort): find natural runs, extending
 * short ones to a minimum length with binary insertion sort, push them on a stack, and
 * merge so that run lengths on the stack shrink at least like Fibonacci numbers —
 * keeping merges balanced. Sorted or reversed input costs one pass. This visualizer uses
 * a minimum run of 4 so that runs and merges are visible on short arrays, and leaves out
 * galloping mode.
 */
export const timSort: AlgorithmModule<number[], number[]> = {
  id: "tim-sort",
  version: 1,
  pseudocode: [
    "while elements remain",
    "  find the next natural run; if strictly descending, reverse it",
    "  if shorter than minrun, extend it with binary insertion sort",
    "  push the run on the stack",
    "  while the top runs X, Y, Z (Z on top) break |X| > |Y| + |Z| or |Y| > |Z|:",
    "    merge Y with the smaller of X and Z",
    "finally merge the stack from the top down",
  ],
  input: numberArrayInput({
    limits: { ...SORT_LIMITS, maxLength: MAX_TIMSORT },
    defaultRandomLength: 16,
    presets: sortPresets([
      {
        id: "runs",
        label: "Natural runs, one descending",
        value: [1, 3, 5, 7, 9, 8, 6, 4, 2, 0, 10, 11, 12, 13],
      },
      {
        id: "random",
        label: "Sixteen values",
        value: [12, 3, 15, 7, 9, 1, 14, 5, 11, 2, 8, 16, 4, 13, 6, 10],
      },
    ]),
  }),

  run(values, t) {
    const A = t.array("A", values, { label: "A" });
    const B = t.array(
      "B",
      values.map((): Scalar => null),
      { label: "B (merge buffer)", display: "cells" },
    );
    const n = A.length;
    const MIN = Math.min(4, n);
    const stack: { lo: number; len: number }[] = [];
    const showStack = (line: number) =>
      t.step({ line, vars: { stack: stack.map((r) => r.len).join(" ") || "—" } });
    const mergeAt = (i: number) => {
      const a = stack[i]!;
      const b = stack[i + 1]!;
      A.mark(range(a.lo, b.lo + b.len - 1), "active", {
        line: 6,
        note: `Merge the runs of length ${a.len} and ${b.len}.`,
      });
      mergeRuns(A, B, a.lo, a.lo + a.len - 1, b.lo + b.len - 1, 6);
      t.tally("merges");
      A.mark(range(a.lo, b.lo + b.len - 1), null, { line: 6 });
      stack.splice(i, 2, { lo: a.lo, len: a.len + b.len });
    };
    let lo = 0;
    while (lo < n) {
      let hi = lo + 1;
      if (hi < n) {
        if (A.compare(hi, lo, { line: 2, note: `Is the run starting at ${lo} descending?` }) < 0) {
          while (hi + 1 < n && A.compare(hi + 1, hi, { line: 2 }) < 0) hi++;
          for (let a = lo, b = hi; a < b; a++, b--) A.swap(a, b, { line: 2 });
          t.step({
            line: 2,
            note: `A strictly descending run A[${lo}..${hi}]: reversed in place.`,
          });
        } else while (hi + 1 < n && A.compare(hi + 1, hi, { line: 2 }) >= 0) hi++;
        hi++;
      }
      let len = hi - lo;
      t.step({ line: 2, vars: { lo, len }, note: `Natural run of length ${len} at ${lo}.` });
      if (len < MIN) {
        const end = Math.min(n, lo + MIN);
        for (let i = lo + len; i < end; i++) {
          const key = A.num(i);
          let l = lo;
          let r = i;
          while (l < r) {
            const m = Math.floor((l + r) / 2);
            if (A.compareWith(m, key, { line: 3 }) > 0) r = m;
            else l = m + 1;
          }
          for (let j = i; j > l; j--) A.write(j, A.get(j - 1), { line: 3 });
          if (l !== i) A.write(l, key, { line: 3 });
        }
        t.step({ line: 3, note: `Extended to length ${end - lo} with binary insertion sort.` });
        len = end - lo;
      }
      stack.push({ lo, len });
      showStack(4);
      for (;;) {
        const k = stack.length;
        if (k >= 3 && stack[k - 3]!.len <= stack[k - 2]!.len + stack[k - 1]!.len) {
          mergeAt(stack[k - 3]!.len < stack[k - 1]!.len ? k - 3 : k - 2);
        } else if (k >= 2 && stack[k - 2]!.len <= stack[k - 1]!.len) {
          mergeAt(k - 2);
        } else break;
        showStack(5);
      }
      lo += len;
    }
    while (stack.length > 1) {
      mergeAt(stack.length - 2);
      showStack(7);
    }
    A.mark(range(0, n - 1), "sorted", { line: 7 });
    const output = A.toArray() as number[];
    t.finish(values, output);
    return output;
  },
  check: checkSorted,
  fidelity: arrayFidelity("A"),
  describeOutput: describeSorted,
};

/**
 * Introsort (Musser, 1997; the basis of C++ std::sort): quicksort, but give up on a
 * subarray once the recursion is deeper than 2⌊log₂ n⌋ and heapsort it instead; finish
 * small subarrays with insertion sort. It keeps quicksort's speed and guarantees
 * O(n log n). This visualizer uses the last element as pivot (so sorted input forces
 * the heapsort fallback) and a small-subarray cutoff of 4.
 */
export const introSort: AlgorithmModule<number[], number[]> = {
  id: "intro-sort",
  version: 1,
  pseudocode: [
    "procedure introsort(A, lo, hi, depth)",
    "  if hi − lo + 1 ≤ 4: insertion sort A[lo..hi]; return",
    "  if depth = 0: heapsort A[lo..hi]; return   // quicksort is going badly",
    "  p ← partition(A, lo, hi)   // Lomuto, last element as pivot",
    "  introsort(A, lo, p − 1, depth − 1);  introsort(A, p + 1, hi, depth − 1)",
    "start with depth = 2⌊log₂ n⌋",
  ],
  input: numberArrayInput({
    limits: SORT_LIMITS,
    defaultRandomLength: 16,
    presets: [
      {
        id: "sorted",
        label: "Sorted: quicksort degrades, heapsort takes over",
        value: range(1, 16),
      },
      {
        id: "random",
        label: "Sixteen values",
        value: [12, 3, 15, 7, 9, 1, 14, 5, 11, 2, 8, 16, 4, 13, 6, 10],
      },
      { id: "small", label: "Small: insertion sort only", value: [5, 1, 4, 2] },
    ],
  }),

  run(values, t) {
    const A = t.array("A", values, { label: "A" });
    const n = A.length;
    const insertion = (lo: number, hi: number) => {
      for (let i = lo + 1; i <= hi; i++)
        for (let j = i; j > lo && A.compare(j - 1, j, { line: 2 }) > 0; j--)
          A.swap(j - 1, j, { line: 2 });
      A.mark(range(lo, hi), "sorted", {
        line: 2,
        note: `A[${lo}..${hi}] is small: insertion sort.`,
      });
      t.tally("insertion sorts");
    };
    const heapsort = (lo: number, hi: number) => {
      const size = hi - lo + 1;
      const sift = (i: number, m: number) => {
        for (;;) {
          let big = i;
          for (const c of [2 * i + 1, 2 * i + 2])
            if (c < m && A.compare(lo + c, lo + big, { line: 3 }) > 0) big = c;
          if (big === i) return;
          A.swap(lo + i, lo + big, { line: 3 });
          i = big;
        }
      };
      t.step({ line: 3, note: `Depth limit reached on A[${lo}..${hi}]: switch to heapsort.` });
      for (let i = Math.floor(size / 2) - 1; i >= 0; i--) sift(i, size);
      for (let m = size - 1; m > 0; m--) {
        A.swap(lo, lo + m, { line: 3 });
        sift(0, m);
      }
      A.mark(range(lo, hi), "sorted", { line: 3 });
      t.tally("heapsorts");
    };
    const sort = (lo: number, hi: number, depth: number) => {
      if (hi - lo + 1 <= 4) {
        if (hi >= lo) insertion(lo, hi);
        return;
      }
      if (depth === 0) return heapsort(lo, hi);
      const pivot = A.num(hi);
      A.mark(hi, "pivot", {
        line: 4,
        vars: { lo, hi, depth },
        note: `Partition A[${lo}..${hi}] around ${pivot}.`,
      });
      let i = lo;
      for (let j = lo; j < hi; j++)
        if (A.compareWith(j, pivot, { line: 4 }) < 0) {
          if (i !== j) A.swap(i, j, { line: 4 });
          i++;
        }
      if (i !== hi) A.swap(i, hi, { line: 4 });
      A.mark(hi, null, { line: 4 });
      A.mark(i, "sorted", { line: 4 });
      t.tally("partitions");
      sort(lo, i - 1, depth - 1);
      sort(i + 1, hi, depth - 1);
    };
    const depth = n > 1 ? 2 * Math.floor(Math.log2(n)) : 0;
    t.step({ line: 6, vars: { limit: depth }, note: `Depth limit 2⌊log₂ ${n}⌋ = ${depth}.` });
    sort(0, n - 1, depth);
    const output = A.toArray() as number[];
    t.finish(values, output);
    return output;
  },
  check: checkSorted,
  fidelity: arrayFidelity("A"),
  describeOutput: describeSorted,
};

export const MAX_TREE_SORT = 20;

/**
 * Tree sort: insert every value into a binary search tree (equal values go right, which
 * keeps it stable) and read the tree back in order. O(n log n) on random input, O(n²)
 * on sorted input, where the tree degenerates into a path; a balanced tree fixes that.
 */
export const treeSort: AlgorithmModule<number[], number[]> = {
  id: "tree-sort",
  version: 1,
  pseudocode: [
    "for each x in A: insert x into a binary search tree (equal keys go right)",
    "in-order traversal: left subtree, node, right subtree — writes the values in order",
  ],
  input: numberArrayInput({
    limits: { ...SORT_LIMITS, maxLength: MAX_TREE_SORT },
    defaultRandomLength: 10,
    presets: sortPresets([
      { id: "random", label: "Ten values", value: [50, 30, 70, 20, 40, 60, 80, 35, 65, 30] },
    ]),
  }),

  run(values, t) {
    const T = t.tree("T", { binary: true, label: "Binary search tree" });
    const key = new Map<string, number>();
    const kids = new Map<string, [string | null, string | null]>();
    let root: string | null = null;
    for (const [i, x] of values.entries()) {
      if (root === null) {
        root = T.add(
          x,
          null,
          undefined,
          { line: 1, vars: { x }, note: `${x} becomes the root.` },
          { id: `v${i}` },
        );
        key.set(root, x);
        kids.set(root, [null, null]);
        continue;
      }
      let at = root;
      for (;;) {
        const side =
          T.compare(at, x, { line: 1, note: `Compare ${x} with ${key.get(at)}.` }) > 0 ? 0 : 1;
        const next = kids.get(at)![side];
        if (next === null) {
          const id = T.add(
            x,
            at,
            side,
            {
              line: 1,
              vars: { x },
              note: `Insert ${x} as the ${side ? "right" : "left"} child of ${key.get(at)}.`,
            },
            { id: `v${i}` },
          );
          key.set(id, x);
          kids.set(id, [null, null]);
          kids.get(at)![side] = id;
          break;
        }
        at = next;
      }
    }
    const out = t.array(
      "A",
      values.map((): Scalar => null),
      { label: "Output", display: "cells" },
    );
    let k = 0;
    const walk = (id: string | null) => {
      if (id === null) return;
      walk(kids.get(id)![0]);
      T.status(id, "visited", { line: 2 });
      out.write(k++, key.get(id)!, { line: 2, note: `In order: ${key.get(id)}.` });
      walk(kids.get(id)![1]);
    };
    walk(root);
    out.mark(range(0, values.length - 1), "sorted", { line: 2 });
    const output = out.toArray() as number[];
    t.finish(values, output);
    return output;
  },
  check: checkSorted,
  fidelity: arrayFidelity("A"),
  describeOutput: describeSorted,
};

/**
 * Pancake sort: the only allowed operation is "flip the top k" (reverse a prefix). For
 * each size from n down to 2, flip the largest unsorted value to the top, then flip it
 * down into place: at most 2n − 3 flips.
 */
export const pancakeSort: AlgorithmModule<number[], number[]> = {
  id: "pancake-sort",
  version: 1,
  pseudocode: [
    "for size ← n down to 2",
    "  m ← position of the largest of A[0..size − 1]",
    "  if m = size − 1: continue   // already in place",
    "  if m > 0: flip(m)   // bring it to the top",
    "  flip(size − 1)   // and down to its place",
    "flip(k): reverse A[0..k]",
  ],
  input: numberArrayInput({
    limits: SORT_LIMITS,
    defaultRandomLength: 8,
    presets: sortPresets([
      { id: "stack", label: "A stack of pancakes", value: [3, 6, 1, 8, 2, 7, 4, 5] },
    ]),
  }),

  run(values, t) {
    const A = t.array("A", values, { label: "A (index 0 is the top of the stack)" });
    let flips = 0;
    const flip = (k: number, line: number) => {
      for (let a = 0, b = k; a < b; a++, b--) A.swap(a, b, { line });
      flips++;
      t.tally("flips");
      t.step({ line: 6, vars: { flips }, note: `Flip the top ${k + 1}.` });
    };
    for (let size = A.length; size >= 2; size--) {
      let m = 0;
      for (let i = 1; i < size; i++) if (A.compare(i, m, { line: 2 }) > 0) m = i;
      A.pointer("max", m, { line: 2, vars: { size, m } });
      if (m !== size - 1) {
        if (m > 0) flip(m, 4);
        flip(size - 1, 5);
      }
      A.mark(size - 1, "sorted", { line: 5 });
    }
    A.pointer("max", null, { line: 1 });
    if (A.length) A.mark(0, "sorted", { line: 1 });
    const output = A.toArray() as number[];
    t.finish(values, output, { vars: { flips } });
    return output;
  },
  check: checkSorted,
  fidelity: arrayFidelity("A"),
  describeOutput: describeSorted,
};

/**
 * Strand sort: repeatedly pull an increasing "strand" out of the input — the first
 * remaining value, then every later value at least as large as the strand's last — and
 * merge the strand into the output. Few long strands (nearly sorted input) make it fast;
 * reversed input makes n strands of one value: O(n²).
 */
export const strandSort: AlgorithmModule<number[], number[]> = {
  id: "strand-sort",
  version: 1,
  pseudocode: [
    "while the input is not empty",
    "  strand ← [first remaining value]",
    "  for each later remaining value x: if x ≥ last of strand: move x to the strand",
    "  merge the strand into the output",
  ],
  input: numberArrayInput({
    limits: { ...SORT_LIMITS, maxLength: 20 },
    defaultRandomLength: 10,
    presets: sortPresets([
      { id: "strands", label: "Three strands", value: [3, 1, 5, 4, 2, 6, 9, 7, 8] },
    ]),
  }),

  run(values, t) {
    const n = values.length;
    const I = t.array("I", values, {
      label: "Input (removed values become empty)",
      display: "cells",
    });
    const S = t.array(
      "S",
      values.map((): Scalar => null),
      { label: "Strand", display: "cells" },
    );
    const O = t.array(
      "A",
      values.map((): Scalar => null),
      { label: "Output", display: "cells" },
    );
    let outLen = 0;
    let strands = 0;
    let left = n;
    while (left > 0) {
      strands++;
      let len = 0;
      for (let i = 0; i < n; i++) {
        if (I.get(i) === null) continue;
        if (len === 0 || (I.get(i) as number) >= (S.get(len - 1) as number)) {
          if (len > 0) I.compareWith(i, S.get(len - 1), { line: 3 });
          S.write(len++, I.get(i), { line: len === 1 ? 2 : 3 });
          I.write(i, null, { line: 3 });
          left--;
        } else I.compareWith(i, S.get(len - 1), { line: 3 });
      }
      t.step({
        line: 4,
        vars: { strand: strands },
        note: `Strand ${strands} has ${len} value${len === 1 ? "" : "s"}: merge it into the output.`,
      });
      // Merge S[0..len) into O[0..outLen) from the back, in place.
      let i = outLen - 1;
      let j = len - 1;
      for (let k = outLen + len - 1; k >= 0 && j >= 0; k--) {
        if (i >= 0 && O.compareWith(i, S.get(j), { line: 4 }) > 0) {
          O.write(k, O.get(i), { line: 4 });
          i--;
        } else {
          O.write(k, S.get(j), { line: 4 });
          S.write(j, null, { line: 4 });
          j--;
        }
      }
      outLen += len;
    }
    O.mark(range(0, n - 1), "sorted", { line: 1 });
    const output = O.toArray() as number[];
    t.finish(values, output, { vars: { strands } });
    return output;
  },
  check: checkSorted,
  fidelity: arrayFidelity("A"),
  describeOutput: describeSorted,
};

/**
 * American flag sort (McIlroy, Bostic and McIlroy, 1993): an in-place MSD radix sort.
 * Count the digits, compute where each digit's region starts, then permute the values
 * into their regions in place by following cycles (no buffer), and recurse on each
 * region with the next digit.
 */
export const americanFlagSort: AlgorithmModule<number[], number[]> = {
  id: "american-flag-sort",
  version: 1,
  pseudocode: [
    "procedure flag(A, lo, hi, p)   // in place, digit p",
    "  count the digits; region k starts at start[k] = lo + (counts of smaller digits)",
    "  next[k] ← start[k]",
    "  for each region k, while next[k] < end of region k",
    "    d ← digit of A[next[k]];  if d = k: next[k]++ else swap A[next[k]] with A[next[d]], next[d]++",
    "  recurse on each region with digit p − 1",
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
    ],
  }),

  run(values, t) {
    const A = t.array("A", values, { label: "A" });
    const d = Math.max(1, String(Math.max(...values)).length);
    const digit = (x: number, p: number) => Math.floor(x / 10 ** p) % 10;
    const sort = (lo: number, hi: number, p: number) => {
      if (hi <= lo || p < 0) return;
      t.tally("calls");
      const count = new Array(10).fill(0);
      for (let i = lo; i <= hi; i++) count[digit(A.read(i, { line: 2 }) as number, p)]++;
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
        note: `Regions for digit ${p}: ${start
          .map((x, k) => (count[k] ? `${k}→${x}` : ""))
          .filter(Boolean)
          .join(", ")}.`,
      });
      for (let k = 0; k < 10; k++) {
        const end = start[k]! + count[k];
        while (next[k]! < end) {
          const v = A.get(next[k]!) as number;
          const dk = digit(v, p);
          if (dk === k) next[k]!++;
          else {
            A.swap(next[k]!, next[dk]!, {
              line: 5,
              note: `${v} belongs in region ${dk}: swap it there.`,
            });
            next[dk]!++;
          }
        }
      }
      for (let k = 0; k < 10; k++)
        if (count[k] > 1) sort(start[k]!, start[k]! + count[k] - 1, p - 1);
    };
    sort(0, A.length - 1, d - 1);
    A.mark(range(0, A.length - 1), "sorted", { line: 6 });
    const output = A.toArray() as number[];
    t.finish(values, output);
    return output;
  },
  check: checkSorted,
  fidelity: (state: TraceState, out: number[]) => arrayFidelity("A")(state, out),
  describeOutput: describeSorted,
};
