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
  shapeKeys,
  TracedBst,
  type Node,
  type SetResult,
  type Shape,
} from "./common";

interface RbNode extends Node {
  red: boolean;
}

export interface RbOutput {
  results: SetResult[];
  tree: Shape | null;
  height: number;
  /** Black nodes on every path from the root down to an empty child. */
  blackHeight: number;
}

const isRed = (n: Node | null) => n !== null && (n as RbNode).red;

const input = setInput({
  presets: [
    {
      id: "ascending",
      label: "Ascending inserts: recolouring and rotations",
      value: ops("i10 i20 i30 i40 i50 i60 i70 i80"),
    },
    { id: "zigzag", label: "Zig-zag inserts", value: ops("i41 i38 i31 i12 i19 i8 s19") },
    {
      id: "delete",
      label: "Deleting black nodes",
      value: ops("i41 i38 i31 i12 i19 i8 d8 d12 d19 d31 s38"),
    },
  ],
});

/** Independent check of the red-black properties on a shape; returns the black height. */
export function rbCheck(s: Shape | null): { blackHeight: number; error: string | null } {
  let error: string | null = null;
  const walk = (n: Shape | null, parentRed: boolean): number => {
    if (!n) return 1;
    const red = n.tag === "red";
    if (n.tag !== "red" && n.tag !== "black") error ??= `node ${n.key} has no colour`;
    if (red && parentRed) error ??= `red node ${n.key} has a red parent`;
    const a = walk(n.left, red);
    const b = walk(n.right, red);
    if (a !== b) error ??= `paths below ${n.key} have ${a - 1} and ${b - 1} black nodes`;
    return a + (red ? 0 : 1);
  };
  if (s && s.tag !== "black") error = "the root is not black";
  const bh = walk(s, false) - 1;
  return { blackHeight: bh, error };
}

/**
 * A red-black tree (Guibas and Sedgewick; operations as in Cormen et al.): every node
 * is red or black, the root is black, a red node has no red child, and every path from
 * a node down to an empty child passes the same number of black nodes. Inserts add a
 * red leaf and repair red-red conflicts by recolouring or by one or two rotations;
 * deleting a black node leaves a “double black” that is pushed up or resolved the same way.
 */
export const redBlackTree: AlgorithmModule<Op[], RbOutput> = {
  id: "red-black-tree",
  version: 1,
  pseudocode: [
    "insert: add the key as a red leaf (BST insert)",
    "  while the parent p is red (g = grandparent, u = uncle):",
    "    u red: colour p and u black, g red; continue from g",
    "    u black: if the node is an inner grandchild, rotate at p; then rotate at g and swap the colours of p and g",
    "  colour the root black",
    "delete: remove the node (or its successor) y; if y was black, fix the double black x:",
    "  sibling w red: recolour and rotate at the parent so that w is black",
    "  w's children both black: colour w red; move the double black up to the parent",
    "  otherwise: rotate so w's far child is red; then rotate at the parent, recolour, done",
    "search: walk down from the root",
  ],
  input,

  run(list, t) {
    const B = new TracedBst<RbNode>(t, "Red-black tree", (n) => (n.red ? "red" : "black"));
    const paint = (n: RbNode, red: boolean, line: number) => {
      if (n.red === red) return;
      n.red = red;
      B.tag(n, { line });
    };

    const insertFixup = (z: RbNode) => {
      while (isRed(z.parent)) {
        const p = z.parent as RbNode;
        const g = p.parent as RbNode;
        const left = p === g.left;
        const u = (left ? g.right : g.left) as RbNode | null;
        if (isRed(u)) {
          t.step({
            line: 3,
            note: `${z.key} and its parent ${p.key} are both red, and the uncle ${u!.key} is red: recolour.`,
          });
          paint(p, false, 3);
          paint(u!, false, 3);
          paint(g, true, 3);
          z = g;
          continue;
        }
        let top = p;
        if (z === (left ? p.right : p.left)) {
          t.step({
            line: 4,
            note: `${z.key} is an inner grandchild of ${g.key}: rotate ${left ? "left" : "right"} at ${p.key} first.`,
          });
          B.rotate(p, left ? "left" : "right", { line: 4 });
          top = z;
          z = p;
        }
        B.rotate(g, left ? "right" : "left", {
          line: 4,
          note: `The uncle is black: rotate ${left ? "right" : "left"} at ${g.key}; ${top.key} moves up.`,
        });
        paint(top, false, 4);
        paint(g, true, 4);
      }
      if (B.root) paint(B.root, false, 5);
    };

    const deleteFixup = (x: RbNode | null, xp: RbNode | null) => {
      while (x !== B.root && !isRed(x)) {
        const p = xp!;
        const left = x === p.left;
        let w = (left ? p.right : p.left) as RbNode;
        if (w.red) {
          t.step({
            line: 7,
            note: `The sibling ${w.key} is red: recolour and rotate at ${p.key}.`,
          });
          paint(w, false, 7);
          paint(p, true, 7);
          B.rotate(p, left ? "left" : "right", { line: 7 });
          w = (left ? p.right : p.left) as RbNode;
        }
        const near = (left ? w.left : w.right) as RbNode | null;
        const far = (left ? w.right : w.left) as RbNode | null;
        if (!isRed(near) && !isRed(far)) {
          t.step({
            line: 8,
            note: `The sibling ${w.key} and both its children are black: colour ${w.key} red and move the double black up to ${p.key}.`,
          });
          paint(w, true, 8);
          x = p;
          xp = p.parent as RbNode | null;
          continue;
        }
        if (!isRed(far)) {
          t.step({
            line: 9,
            note: `Only the near child ${near!.key} of the sibling is red: rotate it up first.`,
          });
          paint(near!, false, 9);
          paint(w, true, 9);
          B.rotate(w, left ? "right" : "left", { line: 9 });
          w = (left ? p.right : p.left) as RbNode;
        }
        const wFar = (left ? w.right : w.left) as RbNode;
        paint(w, p.red, 9);
        paint(p, false, 9);
        paint(wFar, false, 9);
        B.rotate(p, left ? "left" : "right", {
          line: 9,
          note: `The sibling's far child is red: rotate at ${p.key} and recolour; the double black is resolved.`,
        });
        x = B.root;
        xp = null;
      }
      if (x) paint(x, false, 6);
    };

    const results: SetResult[] = [];
    for (const op of list) {
      const k = op.value!;
      B.clear(1);
      const { node, last } = B.find(k, op.name === "search" ? 10 : op.name === "insert" ? 1 : 6);
      if (op.name === "search") {
        if (node) B.mark(node, "path");
        t.step({ line: 10, note: node ? `Found ${k}.` : `${k} is not in the tree.` });
        results.push(node ? "found" : "missing");
      } else if (op.name === "insert") {
        if (node) {
          t.step({ line: 1, note: `${k} is already in the tree.` });
          results.push("present");
          continue;
        }
        const z = B.attach({ key: k, red: true } as RbNode, last, {
          line: 1,
          note: last ? `Add ${k} as a red leaf under ${last.key}.` : `${k} becomes the root.`,
        });
        B.mark(z, "path");
        insertFixup(z);
        results.push("inserted");
      } else {
        if (!node) {
          t.step({ line: 6, note: `${k} is not in the tree.` });
          results.push("missing");
          continue;
        }
        let y = node;
        if (node.left && node.right) {
          y = minNode(node.right as RbNode);
          B.mark(y);
          B.setKey(node, y.key, {
            line: 6,
            note: `${k} has two children: copy its successor ${y.key} into it and delete the successor's node.`,
          });
        }
        const wasBlack = !y.red;
        const xp = y.parent as RbNode | null;
        const x = B.splice(y, {
          line: 6,
          note: wasBlack
            ? "Remove the black node: its place is now one black short."
            : "Remove the red node: no colours change.",
        });
        if (wasBlack) deleteFixup(x, x ? (x.parent as RbNode | null) : xp);
        results.push("deleted");
      }
    }
    B.clear(10);
    const tree = B.shape();
    const output: RbOutput = {
      results,
      tree,
      height: shapeHeight(tree),
      blackHeight: rbCheck(tree).blackHeight,
    };
    t.finish(list, output, {
      line: 10,
      note: `${B.T.size} keys, height ${output.height}, black height ${output.blackHeight}.`,
    });
    return output;
  },

  check(list, out) {
    const r = checkSet(list, out.results, out.tree);
    if (r) return r;
    const { blackHeight, error } = rbCheck(out.tree);
    if (error) return error;
    if (blackHeight !== out.blackHeight)
      return `black height ${out.blackHeight}, expected ${blackHeight}`;
    // Height bound that the colour rules guarantee: at most 2 log2(n + 1).
    const n = shapeKeys(out.tree).length;
    if (out.height > 2 * Math.log2(n + 1) + 1e-9)
      return `height ${out.height} exceeds 2 log2(n + 1) for n = ${n}`;
    return out.height === shapeHeight(out.tree) ? null : "wrong height";
  },

  fidelity(state: TraceState, out) {
    const T = state.structures.T;
    if (T?.kind !== "tree") return "no tree";
    return sameShape(shapeFromState(T), out.tree) ? null : "the drawn tree differs from the result";
  },

  describeOutput: (o) =>
    `${o.results.join(", ")}; height ${o.height}, black height ${o.blackHeight}`,
};
