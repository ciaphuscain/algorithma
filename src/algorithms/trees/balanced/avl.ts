import type { TraceState } from "@/engine/state";
import type { Op } from "../../ops";
import type { AlgorithmModule } from "../../types";
import {
  checkSet,
  minNode,
  ops,
  sameShape,
  setInput,
  shapeFromState,
  shapeHeight,
  TracedBst,
  type Node,
  type SetResult,
  type Shape,
} from "./common";

interface AvlNode extends Node {
  height: number;
}

export interface BalancedOutput {
  results: SetResult[];
  tree: Shape | null;
  /** Height in levels (0 for an empty tree). */
  height: number;
}

const h = (n: Node | null) => (n ? (n as AvlNode).height : 0);
const tagOf = (n: AvlNode) => `h=${n.height}`;

const input = setInput({
  presets: [
    {
      id: "ascending",
      label: "Ascending inserts stay balanced",
      value: ops("i10 i20 i30 i40 i50 i60 i70"),
    },
    {
      id: "double",
      label: "Double rotations (left-right, right-left)",
      value: ops("i30 i10 i20 i40 i60 i50 s50"),
    },
    {
      id: "delete",
      label: "Deletes that rebalance",
      value: ops("i50 i30 i70 i20 i40 i60 i80 i10 d60 d70 d80 s20"),
    },
  ],
});

/**
 * An AVL tree: a binary search tree in which the two subtrees of every node differ in
 * height by at most one. After an insert or delete, the heights on the path back to
 * the root are recomputed; a node whose balance factor reaches ±2 is fixed by a single
 * rotation, or by a double rotation when its taller child leans the other way.
 */
export const avlTree: AlgorithmModule<Op[], BalancedOutput> = {
  id: "avl-tree",
  version: 1,
  pseudocode: [
    "insert / delete as in a binary search tree (delete with two children: copy the successor)",
    "for each node n on the path back to the root:",
    "  height(n) ← 1 + max(height(left), height(right));  bf ← height(left) − height(right)",
    "  bf = +2: if bf(left) < 0: rotate left at left (left-right case);  rotate right at n",
    "  bf = −2: if bf(right) > 0: rotate right at right (right-left case);  rotate left at n",
    "search: walk down from the root",
  ],
  input,

  run(list, t) {
    const B = new TracedBst<AvlNode>(t, "AVL tree (h = height)", tagOf);
    const bf = (n: Node) => h(n.left) - h(n.right);
    const update = (n: AvlNode) => {
      const next = 1 + Math.max(h(n.left), h(n.right));
      if (next !== n.height) {
        n.height = next;
        B.tag(n, { line: 3 });
      }
    };
    const rebalance = (start: AvlNode | null) => {
      for (let n = start; n;) {
        update(n);
        const b = bf(n);
        let top: AvlNode = n;
        if (b > 1 || b < -1) {
          const heavy = (b > 1 ? n.left : n.right) as AvlNode;
          const inner = b > 1 ? bf(heavy) < 0 : bf(heavy) > 0;
          const line = b > 1 ? 4 : 5;
          B.mark(n, "current");
          if (inner) {
            t.step({
              line,
              note: `${n.key} has balance factor ${b > 0 ? "+" : ""}${b}, and its ${b > 1 ? "left" : "right"} child ${heavy.key} leans the other way: a double rotation.`,
            });
            const mid = B.rotate(heavy, b > 1 ? "left" : "right", {
              line,
              note: `Rotate ${b > 1 ? "left" : "right"} at ${heavy.key}.`,
            });
            update(heavy);
            update(mid as AvlNode);
          }
          top = B.rotate(n, b > 1 ? "right" : "left", {
            line,
            note: `${n.key} has balance factor ${b > 0 ? "+" : ""}${b}: rotate ${b > 1 ? "right" : "left"} at ${n.key}.`,
          }) as AvlNode;
          update(n);
          update(top);
        }
        n = top.parent as AvlNode | null;
      }
    };
    const results: SetResult[] = [];
    for (const op of list) {
      const k = op.value!;
      B.clear(1);
      const { node, last } = B.find(k, op.name === "search" ? 6 : 1);
      if (op.name === "search") {
        if (node) B.mark(node, "path");
        t.step({ line: 6, note: node ? `Found ${k}.` : `${k} is not in the tree.` });
        results.push(node ? "found" : "missing");
      } else if (op.name === "insert") {
        if (node) {
          t.step({ line: 1, note: `${k} is already in the tree.` });
          results.push("present");
          continue;
        }
        const leaf = B.attach({ key: k, height: 1 } as AvlNode, last, {
          line: 1,
          note: last
            ? `Attach ${k} as the ${k < last.key ? "left" : "right"} child of ${last.key}.`
            : `${k} becomes the root.`,
        });
        B.mark(leaf, "path");
        rebalance(leaf.parent as AvlNode | null);
        results.push("inserted");
      } else {
        if (!node) {
          t.step({ line: 1, note: `${k} is not in the tree.` });
          results.push("missing");
          continue;
        }
        let target = node;
        if (node.left && node.right) {
          target = minNode(node.right as AvlNode);
          B.mark(target);
          B.setKey(node, target.key, {
            line: 1,
            note: `${k} has two children: copy its successor ${target.key} into it, then delete the successor's node.`,
          });
        }
        const p = target.parent as AvlNode | null;
        B.splice(target, {
          line: 1,
          note:
            target === node
              ? `Remove ${k}; check the balance on the way back up.`
              : `Remove the successor's old node; check the balance on the way back up.`,
        });
        rebalance(p);
        results.push("deleted");
      }
    }
    B.clear(6);
    const tree = B.shape();
    const output: BalancedOutput = { results, tree, height: shapeHeight(tree) };
    t.finish(list, output, {
      line: 6,
      note: `${B.T.size} keys, height ${output.height}.`,
    });
    return output;
  },

  check(list, out) {
    const r = checkSet(list, out.results, out.tree);
    if (r) return r;
    // Independent AVL check: recompute every height from the shape.
    let bad: string | null = null;
    const height = (s: Shape | null): number => {
      if (!s) return 0;
      const a = height(s.left);
      const b = height(s.right);
      if (Math.abs(a - b) > 1 && !bad) bad = `node ${s.key} has subtrees of heights ${a} and ${b}`;
      const hh = 1 + Math.max(a, b);
      if (s.tag !== `h=${hh}` && !bad) bad = `node ${s.key} is labelled ${s.tag}, height is ${hh}`;
      return hh;
    };
    const total = height(out.tree);
    if (bad) return bad;
    return total === out.height ? null : `height ${out.height}, expected ${total}`;
  },

  fidelity(state: TraceState, out) {
    const T = state.structures.T;
    if (T?.kind !== "tree") return "no tree";
    return sameShape(shapeFromState(T), out.tree) ? null : "the drawn tree differs from the result";
  },

  describeOutput: (o) => `${o.results.join(", ")}; height ${o.height}`,
};
