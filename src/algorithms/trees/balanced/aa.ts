import type { TraceState } from "@/engine/state";
import type { Op } from "../../ops";
import type { AlgorithmModule } from "../../types";
import {
  checkSet,
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

interface AaNode extends Node {
  level: number;
}

export interface AaOutput {
  results: SetResult[];
  tree: Shape | null;
  height: number;
}

const lv = (n: Node | null) => (n ? (n as AaNode).level : 0);

const input = setInput({
  presets: [
    {
      id: "ascending",
      label: "Ascending inserts: skew and split",
      value: ops("i1 i2 i3 i4 i5 i6 i7"),
    },
    {
      id: "mixed",
      label: "Inserts in mixed order",
      value: ops("i40 i20 i60 i10 i30 i50 i70 i25 s25"),
    },
    {
      id: "delete",
      label: "Deletes that lower levels",
      value: ops("i1 i2 i3 i4 i5 i6 i7 d1 d2 s5"),
    },
  ],
});

/** Independent check of Andersson's level rules; returns an error or null. */
export function aaCheck(s: Shape | null): string | null {
  const level = (n: Shape | null) => (n ? Number(n.tag?.slice(1)) : 0);
  const walk = (n: Shape | null): string | null => {
    if (!n) return null;
    const l = level(n);
    if (!(l >= 1)) return `node ${n.key} has no level`;
    if (!n.left && !n.right && l !== 1) return `leaf ${n.key} is at level ${l}, not 1`;
    if (level(n.left) !== l - 1) return `left child of ${n.key} is not exactly one level below it`;
    const r = level(n.right);
    if (r !== l && r !== l - 1) return `right child of ${n.key} is not at its level or one below`;
    if (n.right && level(n.right.right) >= l) return `two horizontal links in a row at ${n.key}`;
    if (l > 1 && !(n.left && n.right)) return `${n.key} is above level 1 but lacks a child`;
    return walk(n.left) ?? walk(n.right);
  };
  return walk(s);
}

/**
 * An AA tree (Andersson): a red-black tree in which red nodes may only be right
 * children, written with levels instead of colours. A left child is one level below
 * its parent; a right child is at the same level (a horizontal link) or one below; no
 * two horizontal links follow each other. Two operations restore these rules: skew (a
 * right rotation that removes a left horizontal link) and split (a left rotation that
 * breaks two horizontal links in a row, promoting the middle node one level).
 */
export const aaTree: AlgorithmModule<Op[], AaOutput> = {
  id: "aa-tree",
  version: 1,
  pseudocode: [
    "insert: add the key as a leaf at level 1 (BST insert)",
    "on the way back up, at each node t: t ← skew(t); t ← split(t)",
    "skew(t): if t.left is at t's level: rotate right at t",
    "split(t): if t.right.right is at t's level: rotate left at t; the new top goes up one level",
    "delete: remove the key's leaf (copying a successor or predecessor key first if needed)",
    "on the way up: lower t's level if a child is two levels below; then skew t, t.right, t.right.right and split t, t.right",
    "search: walk down from the root",
  ],
  input,

  run(list, t) {
    const B = new TracedBst<AaNode>(t, "AA tree (L = level)", (n) => `L${n.level}`);
    const setLevel = (n: AaNode, level: number, line: number, note?: string) => {
      if (n.level === level) return;
      n.level = level;
      B.tag(n, { line, note });
    };
    const skew = (n: AaNode | null): AaNode | null => {
      if (!n || !n.left || lv(n.left) !== n.level) return n;
      return B.rotate(n, "right", {
        line: 3,
        note: `Skew: ${n.left.key} is a left child at ${n.key}'s level ${n.level}; rotate right at ${n.key}.`,
      }) as AaNode;
    };
    const split = (n: AaNode | null): AaNode | null => {
      if (!n || !n.right || !n.right.right || lv(n.right.right) !== n.level) return n;
      const r = B.rotate(n, "left", {
        line: 4,
        note: `Split: ${n.key}, ${n.right.key} and ${n.right.right.key} are all at level ${n.level}; rotate left at ${n.key}.`,
      }) as AaNode;
      setLevel(r, r.level + 1, 4, `${r.key} moves up to level ${r.level + 1}.`);
      return r;
    };
    const results: SetResult[] = [];
    for (const op of list) {
      const k = op.value!;
      B.clear(1);
      const { node, last } = B.find(k, op.name === "search" ? 7 : op.name === "insert" ? 1 : 5);
      if (op.name === "search") {
        if (node) B.mark(node, "path");
        t.step({ line: 7, note: node ? `Found ${k}.` : `${k} is not in the tree.` });
        results.push(node ? "found" : "missing");
        continue;
      }
      if (op.name === "insert") {
        if (node) {
          t.step({ line: 1, note: `${k} is already in the tree.` });
          results.push("present");
          continue;
        }
        const leaf = B.attach({ key: k, level: 1 } as AaNode, last, {
          line: 1,
          note: last
            ? `Add ${k} at level 1 under ${last.key}.`
            : `${k} becomes the root, at level 1.`,
        });
        B.mark(leaf, "path");
        for (let n: AaNode | null = leaf.parent as AaNode | null; n;) {
          t.step({ line: 2, note: `Back at ${n.key}: skew, then split.` });
          let top = skew(n)!;
          top = split(top)!;
          n = top.parent as AaNode | null;
        }
        results.push("inserted");
        continue;
      }
      if (!node) {
        t.step({ line: 5, note: `${k} is not in the tree.` });
        results.push("missing");
        continue;
      }
      // Every AA node above level 1 has two children, so the node to unlink is a leaf:
      // the key itself, its successor (a level-1 node with only a right child) or its predecessor.
      let leaf: AaNode = node;
      if (node.left) {
        leaf = node.left as AaNode;
        while (leaf.right) leaf = leaf.right as AaNode;
      } else if (node.right) leaf = node.right as AaNode;
      if (leaf !== node) {
        B.mark(leaf);
        B.setKey(node, leaf.key, {
          line: 5,
          note: `Copy ${leaf.key}, the nearest key in a leaf, into ${k}'s node and remove that leaf instead.`,
        });
      }
      let n = leaf.parent as AaNode | null;
      B.splice(leaf, {
        line: 5,
        note:
          leaf === node
            ? `${k} is a leaf: remove it, then fix levels on the way up.`
            : `Remove that leaf, then fix levels on the way up.`,
      });
      while (n) {
        const want = Math.min(lv(n.left), lv(n.right)) + 1;
        if (want < n.level) {
          setLevel(
            n,
            want,
            6,
            `A child of ${n.key} is two levels below it: lower ${n.key} to level ${want}.`,
          );
          if (n.right && lv(n.right) > want) setLevel(n.right as AaNode, want, 6);
        }
        let top = skew(n)!;
        if (top.right) skew(top.right as AaNode);
        if (top.right?.right) skew(top.right.right as AaNode);
        top = split(top)!;
        if (top.right) split(top.right as AaNode);
        n = top.parent as AaNode | null;
      }
      results.push("deleted");
    }
    B.clear(7);
    const tree = B.shape();
    const output: AaOutput = { results, tree, height: shapeHeight(tree) };
    t.finish(list, output, { line: 7, note: `${B.T.size} keys, height ${output.height}.` });
    return output;
  },

  check(list, out) {
    const r = checkSet(list, out.results, out.tree);
    if (r) return r;
    const e = aaCheck(out.tree);
    if (e) return e;
    return out.height === shapeHeight(out.tree) ? null : "wrong height";
  },

  fidelity(state: TraceState, out) {
    const T = state.structures.T;
    if (T?.kind !== "tree") return "no tree";
    return sameShape(shapeFromState(T), out.tree) ? null : "the drawn tree differs from the result";
  },

  describeOutput: (o) => `${o.results.join(", ")}; height ${o.height}`,
};
