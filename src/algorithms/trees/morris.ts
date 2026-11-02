import type { TraceState } from "@/engine/state";
import type { AlgorithmModule, InputSpec } from "../types";
import { traversalInput, type LevelOrder } from "./traversals";

export interface MorrisOutput {
  inorder: number[];
  /** Temporary threads created (one per node with a left child). */
  threads: number;
  /** Pointer moves of cur and pre. */
  moves: number;
}

interface P {
  id: string;
  v: number;
  left: P | null;
  right: P | null;
  /** The real right child; `right` may temporarily be a thread. */
  thread: boolean;
}

const input: InputSpec<LevelOrder> = {
  ...traversalInput,
  presets: [
    { id: "classic", label: "Six-node tree", value: [1, 2, 3, 4, 5, null, 6] },
    {
      id: "bst",
      label: "Search tree (in-order is sorted)",
      value: [8, 4, 12, 2, 6, 10, 14, 1, 3, 5, 7],
    },
    { id: "chain", label: "Left chain", value: [5, 4, null, 3, null, 2] },
  ],
};

/**
 * Morris in-order traversal: no stack and no recursion, O(1) extra memory. Before going
 * left from a node, it makes the node's in-order predecessor (the rightmost node of its
 * left subtree) point back at it through a temporary “thread” in its empty right
 * pointer. Arriving through that thread later shows the left subtree is done: the
 * thread is removed, the node is visited, and the walk goes right. The tree is left
 * exactly as it was.
 */
export const morrisTraversal: AlgorithmModule<LevelOrder, MorrisOutput> = {
  id: "morris-traversal",
  version: 1,
  pseudocode: [
    "cur ← root;  while cur ≠ nil:",
    "  if cur has no left child: visit cur;  cur ← cur.right",
    "  else: pre ← cur.left;  while pre.right ∉ {nil, cur}: pre ← pre.right",
    "    pre.right = nil: make the thread pre.right ← cur;  cur ← cur.left",
    "    pre.right = cur: remove the thread;  visit cur;  cur ← cur.right",
  ],
  input,

  run(levels, t) {
    const T = t.tree("T", { binary: true, label: "Binary tree (threads shown as → x)" });
    const n = levels.filter((v) => v !== null).length;
    const A = t.array(
      "out",
      Array.from({ length: n }, () => null),
      { label: "In-order", display: "cells" },
    );
    t.step({ note: "Build the tree from its level-order description." });
    const nodes: P[] = [];
    const make = (v: number, parent: P | null, slot?: 0 | 1): P => {
      const id = T.add(v, parent?.id ?? null, slot, undefined, { view: true });
      const p: P = { id, v, left: null, right: null, thread: false };
      if (parent && slot === 0) parent.left = p;
      else if (parent) parent.right = p;
      nodes.push(p);
      return p;
    };
    const root = make(levels[0] as number, null);
    const queue = [root];
    for (let i = 1, k = 0; i < levels.length; i++, k++) {
      const parent = queue[Math.floor(k / 2)]!;
      const v = levels[i];
      if (v !== null && v !== undefined) queue.push(make(v, parent, (k % 2) as 0 | 1));
    }

    const inorder: number[] = [];
    let threads = 0;
    let moves = 0;
    const visited = new Set<P>();
    const statusOf = (p: P) => (visited.has(p) ? "visited" : "unvisited");
    let shown: P | null = null;
    const show = (p: P | null, line: number) => {
      if (shown && shown !== p) T.status(shown.id, statusOf(shown), { line });
      if (p) T.status(p.id, "current", { line });
      shown = p;
    };
    const move = () => {
      moves++;
      t.tally("moves");
    };
    const visit = (p: P, line: number) => {
      visited.add(p);
      A.write(inorder.length, p.v, { line, note: `Visit ${p.v}.` });
      inorder.push(p.v);
    };

    let cur: P | null = root;
    show(cur, 1);
    while (cur) {
      const c: P = cur;
      if (!c.left) {
        visit(c, 2);
        cur = c.right;
        move();
        t.step({
          line: 2,
          note: cur
            ? `No left child: go right to ${cur.v}${c.thread ? " (along a thread)" : ""}.`
            : "No left child and nothing to the right: done.",
        });
        show(cur, 2);
        continue;
      }
      let pre: P = c.left;
      move();
      T.status(pre.id, "frontier", { line: 3 });
      while (pre.right && pre.right !== c) {
        T.status(pre.id, statusOf(pre), { line: 3 });
        pre = pre.right;
        move();
        T.status(pre.id, "frontier", { line: 3 });
      }
      const p = pre;
      if (!p.right) {
        p.right = c;
        p.thread = true;
        threads++;
        t.tally("threads");
        T.annotate(p.id, `→ ${c.v}`, {
          line: 4,
          note: `${p.v} is the in-order predecessor of ${c.v}: thread its empty right pointer back to ${c.v}, then go left.`,
        });
        T.status(p.id, statusOf(p), { line: 4 });
        cur = c.left;
        move();
        show(cur, 4);
      } else {
        p.right = null;
        p.thread = false;
        T.annotate(p.id, null, {
          line: 5,
          note: `Back at ${c.v} through the thread from ${p.v}: its left subtree is done. Remove the thread.`,
        });
        T.status(p.id, statusOf(p), { line: 5 });
        visit(c, 5);
        cur = c.right;
        move();
        show(cur, 5);
      }
    }
    const output: MorrisOutput = { inorder, threads, moves };
    t.finish(levels, output, {
      line: 1,
      note: `In-order ${inorder.join(", ")}, using ${threads} temporary thread${threads === 1 ? "" : "s"} and no stack; every thread has been removed.`,
    });
    return output;
  },

  check(levels, out) {
    // Independent oracle: recursive in-order on an index-based tree.
    const kids = new Map<number, [number | null, number | null]>();
    const order: number[] = [];
    const queue: number[] = [0];
    for (let i = 1, k = 0; i < levels.length; i++, k++) {
      const parent = queue[Math.floor(k / 2)]!;
      if (!kids.has(parent)) kids.set(parent, [null, null]);
      if (levels[i] !== null && levels[i] !== undefined) {
        kids.get(parent)![k % 2] = i;
        queue.push(i);
      }
    }
    const walk = (i: number | null) => {
      if (i === null) return;
      const [l, r] = kids.get(i) ?? [null, null];
      walk(l);
      order.push(levels[i] as number);
      walk(r);
    };
    walk(0);
    if (out.inorder.join() !== order.join()) return `in-order ${out.inorder}, expected ${order}`;
    const withLeft = [...kids.values()].filter(([l]) => l !== null).length;
    if (out.threads !== withLeft) return `${out.threads} threads, expected ${withLeft}`;
    const n = order.length;
    return out.moves <= 4 * n ? null : `${out.moves} pointer moves, more than 4n = ${4 * n}`;
  },

  fidelity(state: TraceState, out) {
    const T = state.structures.T;
    const A = state.structures.out;
    if (T?.kind !== "tree" || A?.kind !== "array") return "missing structures";
    if (Object.keys(T.annotations).length) return "a thread was left behind";
    return A.values.join() === out.inorder.join() ? null : `the output shows ${A.values}`;
  },

  describeOutput: (o) => `In-order: ${o.inorder.join(", ")} (${o.threads} threads)`,
};
