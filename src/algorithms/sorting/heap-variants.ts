import type { Scalar } from "@/engine/protocol";
import type { TraceState } from "@/engine/state";
import type { AlgorithmModule } from "../types";
import { numberArrayInput } from "../inputs";
import { arrayFidelity, checkSorted, describeSorted, SORT_LIMITS, sortPresets } from "./common";

const range = (a: number, b: number) =>
  b < a ? [] : Array.from({ length: b - a + 1 }, (_, i) => a + i);

/**
 * Weak-heap sort (Dutton, 1993): a weak heap is a binary tree in which every node is
 * at least as large as everything in its right subtree only; the root has no left
 * subtree. One reverse bit per node swaps a node's children in O(1), so a "join"
 * of two weak heaps is one comparison and at most one swap. Building takes n − 1
 * comparisons, and the whole sort at most n⌈log₂ n⌉ − 2^⌈log₂ n⌉ + n − 1 (Edelkamp and
 * Wegener, 2000).
 */
export const weakHeapSort: AlgorithmModule<number[], number[]> = {
  id: "weak-heap-sort",
  version: 1,
  pseudocode: [
    "join(i, j): if A[i] < A[j]: swap A[i], A[j];  flip R[j]   // one comparison",
    "ancestor(j): while (j is odd) = R[⌊j/2⌋]: j ← ⌊j/2⌋;  return ⌊j/2⌋",
    "build: for j ← n − 1 down to 1: join(ancestor(j), j)",
    "for m ← n − 1 down to 2",
    "  swap A[0] and A[m]   // the maximum goes to its place",
    "  x ← 1;  while 2x + R[x] < m: x ← 2x + R[x]   // follow left children down",
    "  while x > 0: join(0, x);  x ← ⌊x/2⌋",
    "swap A[0] and A[1]",
  ],
  input: numberArrayInput({
    limits: SORT_LIMITS,
    defaultRandomLength: 10,
    presets: sortPresets([{ id: "eight", label: "Eight values", value: [5, 9, 2, 7, 4, 8, 1, 6] }]),
  }),

  run(values, t) {
    const A = t.array("A", values, { label: "A" });
    const n = A.length;
    const R = t.array(
      "R",
      values.map((): Scalar => 0),
      { label: "R (reverse bits)", display: "cells" },
    );
    const bit = (i: number) => R.num(i);
    const join = (i: number, j: number, line: number) => {
      if (
        A.compare(i, j, () => ({
          line: 1,
          note: `Join: is A[${i}] = ${A.get(i)} < A[${j}] = ${A.get(j)}?`,
        })) < 0
      ) {
        A.swap(i, j, { line });
        R.write(j, 1 - bit(j), {
          line,
          note: `Swap them and flip R[${j}], exchanging ${j}'s children.`,
        });
      }
    };
    const ancestor = (j: number) => {
      while ((j & 1) === bit(j >> 1)) j >>= 1;
      return j >> 1;
    };
    for (let j = n - 1; j >= 1; j--) {
      const i = ancestor(j);
      A.pointer("j", j, { line: 3, vars: { j, ancestor: i } });
      join(i, j, 3);
    }
    A.pointer("j", null, { line: 3, note: "Built: A[0] is the maximum." });
    for (let m = n - 1; m >= 2; m--) {
      A.swap(0, m, {
        line: 5,
        vars: { m },
        note: `Move the maximum ${A.get(0)} to position ${m}.`,
      });
      A.mark(m, "sorted", { line: 5 });
      let x = 1;
      while (2 * x + bit(x) < m) x = 2 * x + bit(x);
      A.pointer("x", x, { line: 6, vars: { x } });
      while (x > 0) {
        join(0, x, 7);
        x >>= 1;
        A.pointer("x", x > 0 ? x : null, { line: 7 });
      }
    }
    if (n > 1) {
      A.swap(0, 1, { line: 8 });
    }
    A.mark(range(0, n - 1), "sorted", { line: 8 });
    const output = A.toArray() as number[];
    t.finish(values, output);
    return output;
  },
  check: checkSorted,
  fidelity: arrayFidelity("A"),
  describeOutput: describeSorted,
};

/** Leonardo numbers 1, 1, 3, 5, 9, 15, 25, … (L(k) = L(k−1) + L(k−2) + 1). */
export const LEONARDO = (() => {
  const l = [1, 1];
  while (l.length < 40) l.push(l.at(-1)! + l.at(-2)! + 1);
  return l;
})();

/**
 * Smoothsort (Dijkstra, 1981): heapsort over a row of Leonardo heaps, whose sizes are
 * Leonardo numbers and whose roots increase from left to right. Sorted input costs
 * O(n); the worst case is O(n log n), like heapsort, and it sorts in place. This
 * version restores the row of roots after every insertion and removal (it does not
 * use Dijkstra's lazier semi-heap rules), which keeps it short but still O(n log n).
 */
export const smoothSort: AlgorithmModule<number[], number[]> = {
  id: "smooth-sort",
  version: 1,
  pseudocode: [
    "Leonardo heap of order k: root at the right end, children of orders k − 1 and k − 2",
    "for i ← 0 to n − 1   // grow",
    "  if the last two heaps have orders k + 1 and k: merge them with A[i] as root (order k + 2)",
    "  else add A[i] as a heap of order 1 (or 0 after an order-1 heap)",
    "  trinkle: swap the new root left past larger roots of earlier heaps, then sift it down",
    "for i ← n − 1 down to 1   // shrink: A[i] is the largest root",
    "  remove the last heap's root; if it had children, they become two heaps",
    "  trinkle the left child heap, then the right one",
  ],
  input: numberArrayInput({
    limits: SORT_LIMITS,
    defaultRandomLength: 10,
    presets: sortPresets([{ id: "mixed", label: "Mixed", value: [6, 3, 9, 1, 8, 2, 7, 5, 4] }]),
  }),

  run(values, t) {
    const A = t.array("A", values, { label: "A" });
    const n = A.length;
    const heaps: { root: number; order: number }[] = [];
    const show = (line: number) =>
      t.step({ line, vars: { orders: heaps.map((h) => h.order).join(" ") || "—" } });
    const children = (root: number, order: number) => {
      const right = root - 1;
      const left = root - 1 - LEONARDO[order - 2]!;
      return { left, right };
    };
    const sift = (root: number, order: number) => {
      while (order >= 2) {
        const { left, right } = children(root, order);
        const big =
          A.compare(left, right, () => ({
            line: 5,
            note: `Compare the children A[${left}] and A[${right}].`,
          })) > 0
            ? left
            : right;
        if (
          A.compare(big, root, () => ({
            line: 5,
            note: `Is the larger child A[${big}] > A[${root}]?`,
          })) <= 0
        )
          break;
        A.swap(big, root, { line: 5 });
        order = big === left ? order - 1 : order - 2;
        root = big;
      }
    };
    const trinkle = (h: number) => {
      let pos = heaps[h]!.root;
      let i = h;
      while (i > 0) {
        const prev = heaps[i - 1]!.root;
        if (
          A.compare(prev, pos, () => ({
            line: 5,
            note: `Is the previous root A[${prev}] = ${A.get(prev)} > A[${pos}] = ${A.get(pos)}?`,
          })) <= 0
        )
          break;
        const order = heaps[i]!.order;
        if (order >= 2) {
          const { left, right } = children(pos, order);
          if (A.compare(prev, left, { line: 5 }) <= 0 || A.compare(prev, right, { line: 5 }) <= 0)
            break;
        }
        A.swap(prev, pos, { line: 5, note: `Swap the roots so they increase left to right.` });
        pos = prev;
        i--;
      }
      sift(pos, heaps[i]!.order);
    };
    for (let i = 0; i < n; i++) {
      const k = heaps.length;
      if (k >= 2 && heaps[k - 2]!.order === heaps[k - 1]!.order + 1) {
        const order = heaps[k - 2]!.order + 1;
        heaps.splice(k - 2, 2, { root: i, order });
        A.pointer("i", i, {
          line: 3,
          note: `Merge the last two heaps under A[${i}] into one of order ${order}.`,
        });
      } else {
        const order = k && heaps[k - 1]!.order === 1 ? 0 : 1;
        heaps.push({ root: i, order });
        A.pointer("i", i, { line: 4, note: `A[${i}] starts a heap of order ${order}.` });
      }
      show(4);
      trinkle(heaps.length - 1);
    }
    for (let i = n - 1; i >= 1; i--) {
      const last = heaps.pop()!;
      A.pointer("i", i, { line: 6 });
      A.mark(i, "sorted", {
        line: 7,
        note: `A[${i}] = ${A.get(i)} is the largest root: it is in place.`,
      });
      if (last.order >= 2) {
        const { left, right } = children(i, last.order);
        heaps.push({ root: left, order: last.order - 1 });
        heaps.push({ root: right, order: last.order - 2 });
        show(7);
        trinkle(heaps.length - 2);
        trinkle(heaps.length - 1);
      } else show(7);
    }
    A.pointer("i", null, { line: 6 });
    A.mark(range(0, n - 1), "sorted", { line: 6 });
    const output = A.toArray() as number[];
    t.finish(values, output);
    return output;
  },
  check: checkSorted,
  fidelity: arrayFidelity("A"),
  describeOutput: describeSorted,
};

export const MAX_TOURNAMENT = 16;

/**
 * Tournament sort: play a knockout tournament between the values (the smaller wins),
 * output the champion, replace its leaf by +∞ and replay only the matches on its path
 * to the root — ⌈log₂ n⌉ matches per output. The tree is a winner tree.
 */
export const tournamentSort: AlgorithmModule<number[], number[]> = {
  id: "tournament-sort",
  version: 1,
  pseudocode: [
    "put the values in the leaves of a complete binary tree (pad with +∞)",
    "each internal node holds the winner (the smaller) of its two children",
    "repeat n times",
    "  output the root (the overall winner)",
    "  set its leaf to +∞ and replay the matches from that leaf up to the root",
  ],
  input: numberArrayInput({
    limits: { ...SORT_LIMITS, maxLength: MAX_TOURNAMENT },
    defaultRandomLength: 8,
    presets: sortPresets([
      { id: "eight", label: "Eight players", value: [5, 9, 2, 7, 4, 8, 1, 6] },
    ]),
  }),

  run(values, t) {
    const n = values.length;
    let size = 1;
    while (size < n) size *= 2;
    const T = t.tree("T", { binary: true, label: "Winner tree (∞ marks a finished leaf)" });
    const val: number[] = [];
    const id: string[] = [];
    const label = (v: number) => (v === Infinity ? "∞" : v);
    // Heap layout: node k has children 2k and 2k + 1; leaves are size … 2·size − 1.
    const build = (k: number, parent: string | null, slot?: 0 | 1) => {
      id[k] = T.add("", parent, slot, { line: 1 }, { id: `t${k}` });
      if (k >= size) {
        val[k] = k - size < n ? values[k - size]! : Infinity;
        T.set(id[k]!, label(val[k]!), { line: 1 });
        return;
      }
      build(2 * k, id[k]!, 0);
      build(2 * k + 1, id[k]!, 1);
      const [a, b] = [val[2 * k]!, val[2 * k + 1]!];
      if (a !== Infinity && b !== Infinity) t.tally("comparisons");
      val[k] = Math.min(a, b);
      T.set(id[k]!, label(val[k]!), {
        line: 2,
        note: `Match: ${label(a)} vs ${label(b)} — ${label(val[k]!)} wins.`,
      });
    };
    build(1, null);
    const out = t.array(
      "A",
      values.map((): Scalar => null),
      { label: "Output", display: "cells" },
    );
    for (let r = 0; r < n; r++) {
      const w = val[1]!;
      out.write(r, w, {
        line: 4,
        vars: { round: r + 1 },
        note: `The winner ${w} is the next smallest value.`,
      });
      let k = 1;
      while (k < size) k = val[2 * k] === w ? 2 * k : 2 * k + 1;
      val[k] = Infinity;
      T.status(id[k]!, "visited", { line: 5 });
      T.set(id[k]!, "∞", { line: 5, note: `Retire ${w}'s leaf and replay its path.` });
      for (k >>= 1; k >= 1; k >>= 1) {
        const [a, b] = [val[2 * k]!, val[2 * k + 1]!];
        if (a !== Infinity && b !== Infinity) t.tally("comparisons");
        val[k] = Math.min(a, b);
        T.set(id[k]!, label(val[k]!), { line: 5 });
      }
    }
    out.mark(range(0, n - 1), "sorted", { line: 3 });
    const output = out.toArray() as number[];
    t.finish(values, output);
    return output;
  },
  check: checkSorted,
  fidelity: (state: TraceState, output: number[]) => arrayFidelity("A")(state, output),
  describeOutput: describeSorted,
};
