import type { TraceState } from "@/engine/state";
import type { Op } from "../../ops";
import type { AlgorithmModule } from "../../types";
import {
  checkSet,
  minNode,
  ops,
  sameShape,
  setInput,
  setModel,
  shapeFromState,
  shapeHeight,
  shapeKeys,
  TracedBst,
  type Node,
  type SetResult,
  type Shape,
} from "./common";

export interface ScapegoatOutput {
  results: SetResult[];
  tree: Shape | null;
  height: number;
  /** The size counter used for the delete rule: the largest size since the last full rebuild. */
  maxSize: number;
  rebuilds: number;
  /** Each rebuild's subtree size and the height it was rebuilt to. */
  rebuilt: { size: number; height: number }[];
}

/** Weight balance factor: each child holds at most ALPHA of its parent's subtree. */
export const ALPHA = 2 / 3;
/** The depth allowed for n keys: ⌊log_{1/α} n⌋. */
export const depthLimit = (n: number) => Math.floor(Math.log(n) / Math.log(1 / ALPHA) + 1e-9);

const input = setInput({
  presets: [
    {
      id: "ascending",
      label: "Ascending inserts trigger rebuilds",
      value: ops("i1 i2 i3 i4 i5 i6 i7 i8 i9 i10"),
    },
    {
      id: "mixed",
      label: "Deep inserts within the depth limit (no rebuild)",
      value: ops("i50 i30 i70 i20 i40 i60 i80 i10 i5 s5"),
    },
    {
      id: "delete",
      label: "Deleting many keys rebuilds the whole tree",
      value: ops("i50 i30 i70 i20 i40 i60 i80 d20 d30 d40 s70"),
    },
  ],
});

/**
 * A scapegoat tree (Galperin and Rivest): a binary search tree with no balance data in
 * its nodes. An insert that lands deeper than ⌊log_{3/2} n⌋ walks back up to the first
 * ancestor whose subtree is lopsided (a child holding more than 2/3 of it) — the
 * scapegoat — and rebuilds that subtree perfectly balanced. Deletes rebuild the whole
 * tree once the size falls below 2/3 of its recent maximum. Here a rebuild uses only
 * rotations (the Day–Stout–Warren method): straighten the subtree into a right-leaning
 * vine, then fold the vine into a balanced tree.
 */
export const scapegoatTree: AlgorithmModule<Op[], ScapegoatOutput> = {
  id: "scapegoat-tree",
  version: 1,
  pseudocode: [
    "insert: BST insert; if the new node's depth > ⌊log_{3/2} n⌋:",
    "  walk up to the first ancestor s with size(child) > 2/3 · size(s) — the scapegoat",
    "  rebuild(s)",
    "delete: BST delete; if n < 2/3 · maxSize: rebuild(root); maxSize ← n",
    "rebuild(s): rotate right until s's subtree is a right-leaning vine",
    "  fold: rotate left at every other vine node, repeatedly, until it is balanced",
    "search: walk down from the root",
  ],
  input,

  run(list, t) {
    const B = new TracedBst<Node>(t, "Scapegoat tree");
    const size = (n: Node | null): number => (n ? 1 + size(n.left) + size(n.right) : 0);
    let count = 0;
    let maxSize = 0;
    let rebuilds = 0;
    const rebuilt: { size: number; height: number }[] = [];
    const heightOf = (n: Node | null): number =>
      n ? 1 + Math.max(heightOf(n.left), heightOf(n.right)) : 0;

    /** Day–Stout–Warren on the subtree rooted at s; returns its new root. */
    const rebuild = (s: Node) => {
      rebuilds++;
      t.tally("rebuilds");
      const n = size(s);
      t.step({
        line: 5,
        note: `Rebuild the ${n}-key subtree at ${s.key}: first straighten it into a vine.`,
      });
      // Tree to vine: rotate right wherever the walk down the right spine meets a left child.
      let top = s;
      for (let v: Node | null = s; v;) {
        if (v.left) {
          const up = B.rotate(v, "right", { line: 5 });
          if (v === top) top = up;
          v = up;
        } else v = v.right;
      }
      // Vine to tree: m nodes in the largest perfect tree that fits; fold the rest first.
      const m = 2 ** Math.floor(Math.log2(n + 1)) - 1;
      const compress = (times: number) => {
        let v: Node = top;
        for (let i = 0; i < times; i++) {
          const up = B.rotate(v, "left", { line: 6 });
          if (i === 0) top = up;
          if (!up.right) break;
          v = up.right;
        }
      };
      const done = () => rebuilt.push({ size: n, height: heightOf(top) });
      if (n > m) {
        t.step({
          line: 6,
          note: `Fold the ${n - m} extra node${n - m === 1 ? "" : "s"} into the bottom level first.`,
        });
        compress(n - m);
      }
      for (let k = Math.floor(m / 2); k >= 1; k = Math.floor(k / 2)) {
        t.step({
          line: 6,
          note: `Fold: rotate left at every other node of the vine (${k} rotation${k === 1 ? "" : "s"}).`,
        });
        compress(k);
      }
      done();
      return top;
    };

    const results: SetResult[] = [];
    for (const op of list) {
      const k = op.value!;
      B.clear(1);
      const { node, last } = B.find(k, op.name === "search" ? 7 : op.name === "insert" ? 1 : 4);
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
        const leaf = B.attach({ key: k }, last, {
          line: 1,
          note: last ? `Attach ${k} under ${last.key}.` : `${k} becomes the root.`,
        });
        B.mark(leaf, "path");
        count++;
        maxSize = Math.max(maxSize, count);
        let depth = 0;
        for (let v = leaf.parent; v; v = v.parent) depth++;
        const limit = depthLimit(count);
        if (depth > limit) {
          let child: Node = leaf;
          let s = leaf.parent!;
          for (;;) {
            const cs = size(child);
            const ss = size(s);
            if (cs > ALPHA * ss || !s.parent) break;
            child = s;
            s = s.parent!;
          }
          B.mark(s, "current");
          t.step({
            line: 2,
            note: `${k} is at depth ${depth}, more than ⌊log_{3/2} ${count}⌋ = ${limit}. ${s.key} is the scapegoat: its child ${child.key} holds ${size(child)} of its ${size(s)} keys, more than 2/3.`,
          });
          rebuild(s);
        }
        results.push("inserted");
        continue;
      }
      if (!node) {
        t.step({ line: 4, note: `${k} is not in the tree.` });
        results.push("missing");
        continue;
      }
      let target = node;
      if (node.left && node.right) {
        target = minNode(node.right);
        B.setKey(node, target.key, {
          line: 4,
          note: `Copy the successor ${target.key} into ${k}'s node.`,
        });
      }
      B.splice(target, {
        line: 4,
        note: target === node ? `Remove ${k}.` : `Remove the successor's old node.`,
      });
      count--;
      results.push("deleted");
      if (count > 0 && count < ALPHA * maxSize) {
        t.step({
          line: 4,
          note: `${count} keys left, fewer than 2/3 of the recent maximum ${maxSize}: rebuild the whole tree.`,
        });
        rebuild(B.root!);
        maxSize = count;
      } else if (count === 0) maxSize = 0;
    }
    B.clear(7);
    const tree = B.shape();
    const output: ScapegoatOutput = {
      results,
      tree,
      height: shapeHeight(tree),
      maxSize,
      rebuilds,
      rebuilt,
    };
    t.finish(list, output, {
      line: 7,
      note: `${count} keys, height ${output.height}, ${rebuilds} rebuild${rebuilds === 1 ? "" : "s"}.`,
    });
    return output;
  },

  check(list, out) {
    const r = checkSet(list, out.results, out.tree);
    if (r) return r;
    // Replay the size counters independently.
    let n = 0;
    let max = 0;
    const { results } = setModel(list);
    results.forEach((res) => {
      if (res === "inserted") max = Math.max(max, ++n);
      else if (res === "deleted") {
        n--;
        if (n === 0) max = 0;
        else if (n < ALPHA * max) max = n;
      }
    });
    if (out.maxSize !== max) return `maxSize ${out.maxSize}, expected ${max}`;
    // Every rebuilt subtree must come out as short as possible: ⌈log2(size + 1)⌉ levels.
    for (const { size, height } of out.rebuilt)
      if (height !== Math.ceil(Math.log2(size + 1)))
        return `a rebuilt ${size}-key subtree has height ${height}, not ${Math.ceil(Math.log2(size + 1))}`;
    if (out.rebuilt.length !== out.rebuilds) return "rebuild count mismatch";
    const keys = shapeKeys(out.tree).length;
    const h = shapeHeight(out.tree);
    if (h !== out.height) return "wrong height";
    // Height balance: every node at depth at most ⌊log_{3/2} maxSize⌋ (+1 counting levels).
    if (keys > 0 && h > depthLimit(Math.max(max, 1)) + 1)
      return `height ${h} exceeds ⌊log_{3/2} ${max}⌋ + 1`;
    return null;
  },

  fidelity(state: TraceState, out) {
    const T = state.structures.T;
    if (T?.kind !== "tree") return "no tree";
    return sameShape(shapeFromState(T), out.tree) ? null : "the drawn tree differs from the result";
  },

  describeOutput: (o) => `${o.results.join(", ")}; height ${o.height}, ${o.rebuilds} rebuilds`,
};
