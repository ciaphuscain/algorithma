import type { TreeStructure } from "@/engine/protocol";
import type { TraceState } from "@/engine/state";
import type { AlgorithmModule } from "../types";
import { clamp, numberArrayInput } from "../inputs";

const LIMITS = { minLength: 1, maxLength: 14, min: -99, max: 99 };
const SENTINEL = "s";
const nid = (i: number) => `i${i}`;

/**
 * Cartesian tree construction in O(n) with a stack. The tree is a min-heap on the values
 * whose in-order traversal gives back the array. Scan left to right keeping the right
 * spine on a stack: pop every value larger than the new one; the last popped subtree
 * becomes the new node's left child, and the new node becomes the right child of what
 * is left on top. A sentinel −∞ at the bottom of the stack is the tree's fixed root.
 */
export const cartesianTree: AlgorithmModule<number[], number[]> = {
  id: "cartesian-tree",
  version: 1,
  pseudocode: [
    "stack ← [sentinel −∞]   // the right spine of the tree built so far",
    "for i ← 0 to n − 1",
    "  last ← none",
    "  while A[top] > A[i]: last ← pop()   // these are larger: they go below i",
    "  if last ≠ none: last becomes i's left child",
    "  i becomes the right child of top;  push i",
    "return parent[i] for every i   (the root's parent is −1)",
  ],
  input: {
    ...numberArrayInput({
      limits: LIMITS,
      presets: [
        { id: "classic", label: "Nine values", value: [9, 3, 7, 1, 8, 12, 10, 20, 15] },
        { id: "sorted", label: "Increasing: a right path", value: [1, 2, 3, 4, 5] },
        { id: "reversed", label: "Decreasing: a left path", value: [5, 4, 3, 2, 1] },
      ],
    }),
    random: (rng, size) =>
      Array.from({ length: clamp(size ?? 8, 1, LIMITS.maxLength) }, () => rng.int(1, 30)),
  },

  run(values, t) {
    const n = values.length;
    const A = t.array("A", values, { label: "A", display: "cells" });
    const T = t.tree("T", { binary: true, label: "Cartesian tree (min-heap, in-order = A)" });
    const S = t.sequence("S", "stack", { label: "Stack: the right spine" });
    T.add(
      "−∞",
      null,
      undefined,
      { line: 1, note: "A sentinel −∞ is the root and the bottom of the stack." },
      { id: SENTINEL, view: true },
    );
    const stack: number[] = [];
    const parent = new Array<number>(n).fill(-1);
    for (let i = 0; i < n; i++) {
      const x = A.read(i, { line: 2, vars: { i, x: values[i]! } }) as number;
      let last: number | null = null;
      while (stack.length && A.compare(stack.at(-1)!, i, { line: 4 }) > 0) {
        last = stack.pop()!;
        S.pop({ line: 4, note: `${values[last]} > ${x}: pop it; it will hang below ${x}.` });
      }
      const top = stack.at(-1);
      // Add the new node in the sentinel's free left slot, then put it in place.
      T.add(x, SENTINEL, 0, { line: 2 }, { id: nid(i) });
      if (last !== null) {
        T.swap(nid(i), nid(last), { line: 5 });
        T.move(nid(last), nid(i), 0, {
          line: 5,
          note: `${values[last]} and everything below it become ${x}'s left subtree.`,
        });
        parent[last] = i;
      } else {
        T.move(nid(i), top === undefined ? SENTINEL : nid(top), 1, { line: 6 });
      }
      parent[i] = top ?? -1;
      S.push(x, {
        line: 6,
        note:
          top === undefined
            ? `${x} is the smallest so far: it becomes the root (under the sentinel).`
            : `${x} becomes the right child of ${values[top]}.`,
      });
      stack.push(i);
    }
    t.finish(values, parent, {
      line: 7,
      vars: { i: null, x: null },
      note: `The root is ${values[parent.indexOf(-1)]}, the minimum.`,
    });
    return parent;
  },

  check(values, out) {
    // Recursive definition: the root is the leftmost minimum; recurse on both sides.
    const want = new Array<number>(values.length).fill(-1);
    const build = (l: number, r: number, p: number) => {
      if (l > r) return;
      let m = l;
      for (let i = l + 1; i <= r; i++) if (values[i]! < values[m]!) m = i;
      want[m] = p;
      build(l, m - 1, m);
      build(m + 1, r, m);
    };
    build(0, values.length - 1, -1);
    return JSON.stringify(want) === JSON.stringify(out)
      ? null
      : `parents [${out.join(", ")}], expected [${want.join(", ")}]`;
  },

  fidelity(state: TraceState, out) {
    const T = state.structures.T as TreeStructure | undefined;
    if (!T || T.kind !== "tree" || T.root !== SENTINEL) return "no tree under the sentinel";
    const [left, right] = T.nodes[SENTINEL]!.children;
    if (left) return "the sentinel's left slot should be empty";
    const parentOf = new Map<string, string>();
    for (const [id, node] of Object.entries(T.nodes))
      for (const c of node.children) if (c) parentOf.set(c, id);
    for (let i = 0; i < out.length; i++) {
      const p = parentOf.get(nid(i));
      const want = out[i] === -1 ? SENTINEL : nid(out[i]!);
      if (p !== want) return `node ${i} hangs under ${p}, expected ${want}`;
    }
    return right === (out.length ? nid(out.indexOf(-1)) : null) ? null : "wrong root";
  },

  describeOutput: (o) => `Parents: [${o.join(", ")}] (−1 marks the root)`,
};
