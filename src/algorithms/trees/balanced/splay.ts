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

export interface SplayOutput {
  results: SetResult[];
  tree: Shape | null;
  height: number;
}

const input = setInput({
  presets: [
    {
      id: "access",
      label: "Accessing a deep key brings it to the root",
      value: ops("i10 i20 i30 i40 i50 i60 i70 s10 s40"),
    },
    {
      id: "zigzag",
      label: "Zig-zig and zig-zag steps",
      value: ops("i50 i30 i70 i20 i40 i35 s35 s70"),
    },
    {
      id: "delete",
      label: "Delete by joining the two subtrees",
      value: ops("i5 i3 i8 i1 i4 i7 i9 d5 s2"),
    },
  ],
});

type M = { key: number; left: M | null; right: M | null };

/** Bottom-up splaying on nested nodes, written independently of the traced version. */
export function splayModel(list: Op[]): Shape | null {
  let root: M | null = null;
  const up = (p: M, x: M) => {
    if (p.left === x) {
      p.left = x.right;
      x.right = p;
    } else {
      p.right = x.left;
      x.left = p;
    }
  };
  // Splay the last node of `path` (a root-to-node list) to the top of path[0]'s subtree;
  // `link` re-attaches the new subtree top where path[0] hung.
  const splay = (path: M[], link: (n: M) => void) => {
    while (path.length > 1) {
      const x = path.at(-1)!;
      const p = path.at(-2)!;
      const g = path.length > 2 ? path.at(-3)! : null;
      const above = path.length > 3 ? path.at(-4)! : null;
      const top = g ?? p;
      if (!g) up(p, x);
      else if ((g.left === p) === (p.left === x)) {
        up(g, p);
        up(p, x);
      } else {
        up(p, x);
        if (g.left === p) g.left = x;
        else g.right = x;
        up(g, x);
      }
      if (above) {
        if (above.left === top) above.left = x;
        else above.right = x;
      } else link(x);
      path.splice(path.length - (g ? 3 : 2), g ? 3 : 2, x);
    }
  };
  const walk = (k: number) => {
    const path: M[] = [];
    for (let v = root; v; v = k < v.key ? v.left : v.right) {
      path.push(v);
      if (v.key === k) return { path, found: true };
    }
    return { path, found: false };
  };
  const toRoot = (n: M) => (root = n);
  for (const op of list) {
    const k = op.value!;
    const { path, found } = walk(k);
    if (op.name === "insert" && !found) {
      const leaf: M = { key: k, left: null, right: null };
      const last = path.at(-1);
      if (!last) root = leaf;
      else if (k < last.key) last.left = leaf;
      else last.right = leaf;
      path.push(leaf);
      splay(path, toRoot);
    } else if (op.name !== "delete" || !found) {
      if (path.length) splay(path, toRoot);
    } else {
      splay(path, toRoot);
      const x = root!;
      if (x.left && x.right) {
        const lp: M[] = [];
        for (let v: M | null = x.left; v; v = v.right) lp.push(v);
        splay(lp, (n) => (x.left = n));
        x.left!.right = x.right;
        root = x.left;
      } else root = x.left ?? x.right;
    }
  }
  const shape = (n: M | null): Shape | null =>
    n ? { key: n.key, left: shape(n.left), right: shape(n.right) } : null;
  return shape(root);
}

/**
 * A splay tree (Sleator and Tarjan): a binary search tree that moves every key it
 * touches to the root by a sequence of rotations — zig (the parent is the root),
 * zig-zig (node and parent are both left or both right children: rotate at the
 * grandparent first) and zig-zag (otherwise: rotate at the parent, then the
 * grandparent). No balance information is stored, yet any sequence of m operations
 * on n keys takes O((m + n) log n) time.
 */
export const splayTree: AlgorithmModule<Op[], SplayOutput> = {
  id: "splay-tree",
  version: 1,
  pseudocode: [
    "splay(x): while x is not the root (p = parent, g = grandparent):",
    "  zig: p is the root — rotate at p",
    "  zig-zig: x and p are both left (or both right) children — rotate at g, then at p",
    "  zig-zag: otherwise — rotate at p, then at g",
    "search / insert: walk down (insert attaches a leaf); splay the key found, or the last node visited",
    "delete: splay the key to the root; splay the largest key of its left subtree up to just below it",
    "  hang the right subtree under that key, and remove the root",
  ],
  input,

  run(list, t) {
    const B = new TracedBst<Node>(t, "Splay tree");
    const up = (x: Node, line: number) => {
      const p = x.parent!;
      B.rotate(p, x === p.left ? "right" : "left", { line });
    };
    /** Splay x until its parent is `stop` (null: to the root). */
    const splay = (x: Node, stop: Node | null = null) => {
      while (x.parent !== stop) {
        const p = x.parent!;
        const g = p.parent;
        if (g === stop) {
          t.step({
            line: 2,
            note: `Zig: ${p.key} is ${stop ? `just below ${stop.key}` : "the root"}; rotate ${x.key} above it.`,
          });
          up(x, 2);
        } else if ((x === p.left) === (p === g!.left)) {
          t.step({
            line: 3,
            note: `Zig-zig: ${x.key} and ${p.key} are both ${x === p.left ? "left" : "right"} children; rotate at ${g!.key}, then at ${p.key}.`,
          });
          up(p, 3);
          up(x, 3);
        } else {
          t.step({
            line: 4,
            note: `Zig-zag: rotate ${x.key} above ${p.key}, then above ${g!.key}.`,
          });
          up(x, 4);
          up(x, 4);
        }
      }
    };
    const results: SetResult[] = [];
    for (const op of list) {
      const k = op.value!;
      B.clear(5);
      const { node, last } = B.find(k, 5);
      if (op.name === "insert" && !node) {
        const leaf = B.attach({ key: k }, last, {
          line: 5,
          note: last ? `Attach ${k} under ${last.key}, then splay it.` : `${k} becomes the root.`,
        });
        B.mark(leaf, "path");
        splay(leaf);
        results.push("inserted");
        continue;
      }
      if (op.name !== "delete" || !node) {
        const target = node ?? last;
        if (target) {
          t.step({
            line: 5,
            note: node
              ? `${op.name === "insert" ? `${k} is already present` : `Found ${k}`}: splay it to the root.`
              : `${k} is not in the tree: splay ${target.key}, the last node visited.`,
          });
          B.mark(target, "path");
          splay(target);
        } else t.step({ line: 5, note: `The tree is empty.` });
        results.push(node ? (op.name === "insert" ? "present" : "found") : "missing");
        continue;
      }
      t.step({ line: 6, note: `Delete ${k}: first splay it to the root.` });
      B.mark(node, "path");
      splay(node);
      if (node.left && node.right) {
        let m = node.left;
        while (m.right) m = m.right;
        B.mark(m, "current");
        t.step({
          line: 6,
          note: `The largest key below it on the left is ${m.key}: splay it up to just below the root.`,
        });
        splay(m, node);
        B.moveUnder(node.right, m, "right", {
          line: 7,
          note: `${m.key} has no right child now: hang the right subtree under it.`,
        });
      }
      B.splice(node, { line: 7, note: `Remove ${k}; its only child becomes the root.` });
      results.push("deleted");
    }
    B.clear(5);
    const tree = B.shape();
    const output: SplayOutput = { results, tree, height: shapeHeight(tree) };
    t.finish(list, output, {
      line: 5,
      note: `${B.T.size} keys, height ${output.height}${tree ? `; ${tree.key} was touched last and is at the root` : ""}.`,
    });
    return output;
  },

  check(list, out) {
    const r = checkSet(list, out.results, out.tree);
    if (r) return r;
    if (out.height !== shapeHeight(out.tree)) return "wrong height";
    // Independent model: replay every operation on plain nested nodes, splaying along a
    // recorded root-to-node path from the bottom up, and compare the final shapes.
    const want = splayModel(list);
    const strip = (s: Shape | null): string =>
      s ? `${s.key}(${strip(s.left)},${strip(s.right)})` : "·";
    return strip(out.tree) === strip(want)
      ? null
      : `tree ${strip(out.tree)}, bottom-up splaying gives ${strip(want)}`;
  },

  fidelity(state: TraceState, out) {
    const T = state.structures.T;
    if (T?.kind !== "tree") return "no tree";
    return sameShape(shapeFromState(T), out.tree) ? null : "the drawn tree differs from the result";
  },

  describeOutput: (o) =>
    `${o.results.join(", ")}; root ${o.tree?.key ?? "none"}, height ${o.height}`,
};
