import type { TraceState } from "@/engine/state";
import type { AlgorithmModule } from "../../types";
import { compareResults, type Op } from "../../ops";
import { setModel, type SetResult } from "../balanced/common";
import {
  allKeys,
  bHeight,
  bInput,
  bOps,
  checkMultiway,
  shapeFromTree,
  showShape,
  TracedMultiTree,
  type BInput,
  type BNode,
  type BShape,
} from "./common";

export interface BTreeOutput {
  results: SetResult[];
  tree: BShape | null;
  height: number;
  splits: number;
  merges: number;
}

const input = bInput({
  sizeField: {
    label: "Minimum degree t",
    min: 2,
    max: 3,
    help: "Every node except the root holds t − 1 to 2t − 1 keys; t = 2 gives a 2-3-4 tree.",
  },
  spec: {
    insert: { value: true, aliases: ["add", "i"] },
    delete: { value: true, aliases: ["remove", "del", "d"] },
    search: { value: true, aliases: ["find", "s"] },
  },
  presets: [
    {
      id: "grow",
      label: "Inserts split full nodes (t = 2)",
      value: { size: 2, ops: bOps("i10 i20 i30 i40 i50 i60 i70 i80 i90 s60") },
    },
    {
      id: "t3",
      label: "Wider nodes (t = 3)",
      value: { size: 3, ops: bOps("i5 i15 i25 i35 i45 i55 i65 i75 i85 i95 i3 i8 s45") },
    },
    {
      id: "internal",
      label: "Delete an internal key: its predecessor replaces it (t = 2)",
      value: { size: 2, ops: bOps("i10 i20 i30 i40 i5 d20 s10") },
    },
    {
      id: "delete",
      label: "Deletes: borrow, merge and shrink (t = 2)",
      value: { size: 2, ops: bOps("i10 i20 i30 i40 i50 i60 i70 i80 i90 d60 d70 d10 d50 d20 s90") },
    },
  ],
});

/** Independent model: the same CLRS rules on nested key lists, without tracing. */
export function bTreeModel(t: number, list: Op[]): BShape | null {
  type M = { keys: number[]; kids: M[] };
  let root: M | null = null;
  const full = (n: M) => n.keys.length === 2 * t - 1;
  const splitChild = (x: M, i: number) => {
    const y = x.kids[i]!;
    const z: M = { keys: y.keys.splice(t), kids: y.kids.length ? y.kids.splice(t) : [] };
    const mid = y.keys.pop()!;
    x.keys.splice(i, 0, mid);
    x.kids.splice(i + 1, 0, z);
  };
  const insertNonFull = (x: M, k: number): void => {
    let i = x.keys.findIndex((v) => v > k);
    if (i === -1) i = x.keys.length;
    if (!x.kids.length) return void x.keys.splice(i, 0, k);
    if (full(x.kids[i]!)) {
      splitChild(x, i);
      if (k > x.keys[i]!) i++;
    }
    insertNonFull(x.kids[i]!, k);
  };
  const merge = (x: M, i: number) => {
    const y = x.kids[i]!;
    const z = x.kids[i + 1]!;
    y.keys.push(x.keys[i]!, ...z.keys);
    y.kids.push(...z.kids);
    x.keys.splice(i, 1);
    x.kids.splice(i + 1, 1);
  };
  const del = (x: M, k: number): void => {
    let i = x.keys.findIndex((v) => v >= k);
    if (i === -1) i = x.keys.length;
    if (x.keys[i] === k) {
      if (!x.kids.length) return void x.keys.splice(i, 1);
      const y = x.kids[i]!;
      const z = x.kids[i + 1]!;
      if (y.keys.length >= t) {
        let p = y;
        while (p.kids.length) p = p.kids.at(-1)!;
        const pred = p.keys.at(-1)!;
        x.keys[i] = pred;
        return del(y, pred);
      }
      if (z.keys.length >= t) {
        let s = z;
        while (s.kids.length) s = s.kids[0]!;
        const succ = s.keys[0]!;
        x.keys[i] = succ;
        return del(z, succ);
      }
      merge(x, i);
      return del(y, k);
    }
    let c = x.kids[i]!;
    if (c.keys.length === t - 1) {
      const left = x.kids[i - 1];
      const right = x.kids[i + 1];
      if (left && left.keys.length >= t) {
        c.keys.unshift(x.keys[i - 1]!);
        x.keys[i - 1] = left.keys.pop()!;
        if (left.kids.length) c.kids.unshift(left.kids.pop()!);
      } else if (right && right.keys.length >= t) {
        c.keys.push(x.keys[i]!);
        x.keys[i] = right.keys.shift()!;
        if (right.kids.length) c.kids.push(right.kids.shift()!);
      } else if (right) merge(x, i);
      else {
        merge(x, i - 1);
        c = x.kids[i - 1]!;
      }
    }
    del(c, k);
  };
  const present = new Set<number>();
  for (const op of list) {
    const k = op.value!;
    if (op.name === "insert" && !present.has(k)) {
      present.add(k);
      if (!root) root = { keys: [k], kids: [] };
      else {
        if (full(root)) {
          root = { keys: [], kids: [root] };
          splitChild(root, 0);
        }
        insertNonFull(root, k);
      }
    } else if (op.name === "delete" && present.has(k)) {
      present.delete(k);
      del(root!, k);
      if (!root!.keys.length) root = root!.kids[0] ?? null;
    }
  }
  const shape = (n: M): BShape => ({ keys: n.keys, children: n.kids.map(shape) });
  return root ? shape(root) : null;
}

/**
 * A B-tree of minimum degree t (Bayer and McCreight; operations as in Cormen et al.):
 * every node but the root holds t − 1 to 2t − 1 sorted keys, an internal node with k
 * keys has k + 1 children, and all leaves are at the same depth. Inserts split every
 * full node on the way down, so the leaf always has room; deletes make sure every node
 * they descend into has at least t keys, by borrowing a key through the parent or by
 * merging two siblings. The tree only grows or shrinks at the root.
 */
export const bTree: AlgorithmModule<BInput, BTreeOutput> = {
  id: "b-tree",
  version: 1,
  pseudocode: [
    "search: in each node, find the first key ≥ k; stop if equal, else descend into that child",
    "insert: if the root is full, split it (the tree grows a level)",
    "  walk down; split any full child before entering it (its middle key moves up)",
    "  put k into the leaf in sorted order",
    "delete k from node x:",
    "  k in a leaf: remove it.  k in an internal node: replace it by its predecessor or successor",
    "    (from a child with ≥ t keys) and delete that; or merge the two children around k",
    "  k below x: before descending into a child with t − 1 keys, borrow a key from a sibling with ≥ t keys",
    "    through x, or merge the child with a sibling (pulling x's separator down)",
    "  if the root is left with no keys, its only child becomes the root",
  ],
  input,

  run(input, tr) {
    const t = input.size;
    const B = new TracedMultiTree(tr, `B-tree (t = ${t}: ${t - 1}–${2 * t - 1} keys per node)`);
    let splits = 0;
    let merges = 0;
    const firstAtLeast = (x: BNode, k: number) => {
      let i = 0;
      while (i < x.keys.length) {
        tr.tally("comparisons");
        if (x.keys[i]! >= k) break;
        i++;
      }
      return i;
    };
    const search = (k: number, line: number): boolean => {
      for (let x = B.root; x;) {
        B.mark(x);
        const i = firstAtLeast(x, k);
        if (x.keys[i] === k) {
          B.mark(x, "path");
          return true;
        }
        if (!x.kids.length) return false;
        tr.step({ line, note: `${k} is not in [${x.keys.join(" ")}]: go to child ${i + 1}.` });
        x = x.kids[i]!;
      }
      return false;
    };
    const splitChild = (x: BNode, i: number) => {
      const y = x.kids[i]!;
      const mid = y.keys[t - 1]!;
      const right = y.keys.slice(t);
      y.keys = y.keys.slice(0, t - 1);
      const z = B.addChild(x, i + 1, right, { line: 3 });
      if (y.kids.length) B.moveKids(y, t, t, z, 0, { line: 3 });
      B.show(y, { line: 3 });
      x.keys.splice(i, 0, mid);
      B.show(x, {
        line: 3,
        note: `[${[...y.keys, mid, ...right].join(" ")}] was full: split it; ${mid} moves up.`,
      });
      splits++;
      tr.tally("splits");
    };
    const growRoot = () => {
      // Split the full root in place: it keeps the middle key and gains two children.
      const r = B.root!;
      const mid = r.keys[t - 1]!;
      const L = B.addChild(r, 0, r.keys.slice(0, t - 1), { line: 2 });
      const R = B.addChild(r, r.kids.length, r.keys.slice(t), { line: 2 });
      if (r.kids.length > 2) {
        B.moveKids(r, 1, t, L, 0, { line: 2 });
        B.moveKids(r, 1, t, R, 0, { line: 2 });
      }
      const all = r.keys;
      r.keys = [mid];
      B.show(r, {
        line: 2,
        note: `The root [${all.join(" ")}] is full: split it; ${mid} stays as the new root and the tree grows a level.`,
      });
      splits++;
      tr.tally("splits");
    };
    const merge = (x: BNode, i: number, line: number) => {
      const y = x.kids[i]!;
      const z = x.kids[i + 1]!;
      const sep = x.keys[i]!;
      y.keys.push(sep, ...z.keys);
      B.moveKids(z, 0, z.kids.length, y, y.kids.length, { line });
      x.keys.splice(i, 1);
      B.removeLeaf(x, z, { line });
      B.show(y, { line });
      B.show(x, {
        line,
        note: `Merge: ${sep} comes down from [${[...x.keys.slice(0, i), sep, ...x.keys.slice(i)].join(" ")}] between its two children, which become [${y.keys.join(" ")}].`,
      });
      merges++;
      tr.tally("merges");
    };
    const del = (x: BNode, k: number): void => {
      B.mark(x);
      const i = firstAtLeast(x, k);
      if (x.keys[i] === k) {
        if (!x.kids.length) {
          x.keys.splice(i, 1);
          B.show(x, { line: 6, note: `${k} is in a leaf: remove it.` });
          return;
        }
        const y = x.kids[i]!;
        const z = x.kids[i + 1]!;
        if (y.keys.length >= t || z.keys.length >= t) {
          const usePred = y.keys.length >= t;
          let p = usePred ? y : z;
          while (p.kids.length) p = usePred ? p.kids.at(-1)! : p.kids[0]!;
          const rep = usePred ? p.keys.at(-1)! : p.keys[0]!;
          x.keys[i] = rep;
          B.show(x, {
            line: 6,
            note: `${k} is in an internal node: replace it by its ${usePred ? "predecessor" : "successor"} ${rep}, then delete ${rep} from below.`,
          });
          return del(usePred ? y : z, rep);
        }
        merge(x, i, 7);
        return del(y, k);
      }
      let c = x.kids[i]!;
      if (c.keys.length === t - 1) {
        const left = x.kids[i - 1];
        const right = x.kids[i + 1];
        if (left && left.keys.length >= t) {
          c.keys.unshift(x.keys[i - 1]!);
          x.keys[i - 1] = left.keys.pop()!;
          if (left.kids.length) B.moveKids(left, left.kids.length - 1, 1, c, 0, { line: 8 });
          B.show(left, { line: 8 });
          B.show(c, { line: 8 });
          B.show(x, {
            line: 8,
            note: `[${c.keys.slice(1).join(" ")}] has only t − 1 keys: borrow through the parent from its left sibling.`,
          });
        } else if (right && right.keys.length >= t) {
          c.keys.push(x.keys[i]!);
          x.keys[i] = right.keys.shift()!;
          if (right.kids.length) B.moveKids(right, 0, 1, c, c.kids.length, { line: 8 });
          B.show(right, { line: 8 });
          B.show(c, { line: 8 });
          B.show(x, {
            line: 8,
            note: `[${c.keys.slice(0, -1).join(" ")}] has only t − 1 keys: borrow through the parent from its right sibling.`,
          });
        } else if (right) merge(x, i, 9);
        else {
          merge(x, i - 1, 9);
          c = x.kids[i - 1]!;
        }
      }
      del(c, k);
    };

    const results: SetResult[] = [];
    for (const op of input.ops) {
      const k = op.value!;
      B.clear(1);
      const found = search(k, 1);
      if (op.name === "search") {
        tr.step({ line: 1, note: found ? `Found ${k}.` : `${k} is not in the tree.` });
        results.push(found ? "found" : "missing");
        continue;
      }
      if (op.name === "insert") {
        if (found) {
          tr.step({ line: 1, note: `${k} is already in the tree.` });
          results.push("present");
          continue;
        }
        B.clear(2);
        if (!B.root) {
          B.makeRoot([k], { line: 4, note: `${k} starts the tree.` });
          results.push("inserted");
          continue;
        }
        if (B.root.keys.length === 2 * t - 1) growRoot();
        for (let x = B.root; ;) {
          B.mark(x);
          let i = firstAtLeast(x, k);
          if (!x.kids.length) {
            x.keys.splice(i, 0, k);
            B.show(x, { line: 4, note: `Put ${k} into the leaf.` });
            break;
          }
          if (x.kids[i]!.keys.length === 2 * t - 1) {
            splitChild(x, i);
            if (k > x.keys[i]!) i++;
          }
          x = x.kids[i]!;
        }
        results.push("inserted");
        continue;
      }
      if (!found) {
        tr.step({ line: 5, note: `${k} is not in the tree.` });
        results.push("missing");
        continue;
      }
      B.clear(5);
      del(B.root!, k);
      if (B.root && B.root.keys.length === 0) {
        if (B.root.kids.length)
          B.shrinkRoot({
            line: 10,
            note: "The root has no keys left: its only child becomes the root; the tree shrinks a level.",
          });
        else B.removeLeaf(null, B.root, { line: 10, note: "The tree is empty." });
      }
      results.push("deleted");
    }
    B.clear(1);
    const tree = B.shape();
    const output: BTreeOutput = { results, tree, height: bHeight(tree), splits, merges };
    tr.finish(input, output, {
      line: 1,
      note: `${allKeys(tree).length} keys in a tree of height ${output.height}; ${splits} split${splits === 1 ? "" : "s"}, ${merges} merge${merges === 1 ? "" : "s"}.`,
    });
    return output;
  },

  check(input, out) {
    const want = setModel(input.ops);
    const r = compareResults(input.ops, out.results, want.results);
    if (r) return r;
    const t = input.size;
    const e = checkMultiway(out.tree, t - 1, 2 * t - 1);
    if (e) return e;
    if (allKeys(out.tree).join() !== want.keys.join())
      return `keys ${allKeys(out.tree)}, expected ${want.keys}`;
    const model = bTreeModel(t, input.ops);
    if (showShape(out.tree) !== showShape(model))
      return `tree ${showShape(out.tree)}, the CLRS rules give ${showShape(model)}`;
    return out.height === bHeight(out.tree) ? null : "wrong height";
  },

  fidelity(state: TraceState, out) {
    const T = state.structures.T;
    if (T?.kind !== "tree") return "no tree";
    return showShape(shapeFromTree(T)) === showShape(out.tree)
      ? null
      : "the drawn tree differs from the result";
  },

  describeOutput: (o) =>
    `${o.results.join(", ")}; height ${o.height}, ${o.splits} splits, ${o.merges} merges`,
};
