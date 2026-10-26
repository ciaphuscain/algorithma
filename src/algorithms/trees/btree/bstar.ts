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

export interface BStarOutput {
  results: SetResult[];
  tree: BShape | null;
  height: number;
  /** Overflows resolved by passing a key to a sibling. */
  shifts: number;
  /** Two full nodes split into three. */
  splits: number;
}

/** Limits for most-keys-per-node M (Knuth's B* tree with m = M + 1 children). */
export const bStarLimits = (M: number) => ({
  /** Fewest keys in a non-root node: ⌈(2m − 1)/3⌉ − 1 children's worth. */
  min: Math.ceil((2 * M - 2) / 3),
  max: M,
  /** The root may grow larger, so that its split yields two nodes at least 2/3 full. */
  rootMax: 2 * Math.floor((2 * M) / 3),
});

const input = bInput({
  sizeField: {
    label: "Most keys per node M",
    min: 3,
    max: 5,
    help: "Non-root nodes stay at least about two-thirds full; the root may hold up to 2⌊2M/3⌋ keys.",
  },
  spec: {
    insert: { value: true, aliases: ["add", "i"] },
    search: { value: true, aliases: ["find", "s"] },
  },
  presets: [
    {
      id: "shift",
      label: "A full node passes a key to its sibling (M = 3)",
      value: { size: 3, ops: bOps("i10 i20 i30 i40 i50 i60 i70 i80 s70") },
    },
    {
      id: "three",
      label: "Two full nodes split into three (M = 3)",
      value: { size: 3, ops: bOps("i10 i20 i30 i40 i50 i60 i70 i80 i90 i95 i15 i25 s95") },
    },
    {
      id: "m5",
      label: "Wider nodes (M = 5)",
      value: {
        size: 5,
        ops: bOps("i5 i10 i15 i20 i25 i30 i35 i40 i45 i50 i55 i60 i65 i70 i75 i80 s45"),
      },
    },
  ],
});

/** Sizes of three nodes sharing 2M keys as evenly as possible (smallest first). */
const thirds = (M: number) => [
  Math.floor((2 * M) / 3),
  Math.floor((2 * M + 1) / 3),
  Math.floor((2 * M + 2) / 3),
];

/** Independent model of the same rules on nested key lists. */
export function bStarModel(M: number, list: Op[]): BShape | null {
  type N = { keys: number[]; kids: N[] };
  const { rootMax } = bStarLimits(M);
  let root: N | null = null;
  // Insert below x; returns true when x itself overflows (only the caller can fix it).
  const ins = (x: N, k: number): boolean => {
    let i = 0;
    while (i < x.keys.length && x.keys[i]! < k) i++;
    if (!x.kids.length) {
      x.keys.splice(i, 0, k);
    } else if (ins(x.kids[i]!, k)) fix(x, i);
    return x.keys.length > M;
  };
  const fix = (p: N, i: number) => {
    const x = p.kids[i]!;
    const left = p.kids[i - 1];
    const right = p.kids[i + 1];
    if (left && left.keys.length < M) {
      left.keys.push(p.keys[i - 1]!);
      p.keys[i - 1] = x.keys.shift()!;
      if (x.kids.length) left.kids.push(x.kids.shift()!);
      return;
    }
    if (right && right.keys.length < M) {
      right.keys.unshift(p.keys[i]!);
      p.keys[i] = x.keys.pop()!;
      if (x.kids.length) right.kids.unshift(x.kids.pop()!);
      return;
    }
    const j = right ? i : i - 1;
    const a = p.kids[j]!;
    const b = p.kids[j + 1]!;
    const K = [...a.keys, p.keys[j]!, ...b.keys];
    const C = [...a.kids, ...b.kids];
    const [n1, n2] = thirds(M) as [number, number, number];
    const c: N = { keys: K.slice(n1 + n2 + 2), kids: C.length ? C.slice(n1 + n2 + 2) : [] };
    a.keys = K.slice(0, n1);
    b.keys = K.slice(n1 + 1, n1 + 1 + n2);
    if (C.length) {
      a.kids = C.slice(0, n1 + 1);
      b.kids = C.slice(n1 + 1, n1 + n2 + 2);
    }
    p.keys.splice(j, 1, K[n1]!, K[n1 + n2 + 1]!);
    p.kids.splice(j + 2, 0, c);
  };
  const present = new Set<number>();
  for (const op of list) {
    const k = op.value!;
    if (op.name !== "insert" || present.has(k)) continue;
    present.add(k);
    if (!root) {
      root = { keys: [k], kids: [] };
      continue;
    }
    let i = 0;
    while (i < root.keys.length && root.keys[i]! < k) i++;
    if (!root.kids.length) root.keys.splice(i, 0, k);
    else if (ins(root.kids[i]!, k)) fix(root, i);
    if (root.keys.length > rootMax) {
      const h = Math.floor(root.keys.length / 2);
      const L: N = { keys: root.keys.slice(0, h), kids: root.kids.slice(0, h + 1) };
      const R: N = { keys: root.keys.slice(h + 1), kids: root.kids.slice(h + 1) };
      root = { keys: [root.keys[h]!], kids: [L, R] };
    }
  }
  const shape = (n: N): BShape => ({ keys: n.keys, children: n.kids.map(shape) });
  return root ? shape(root) : null;
}

/**
 * A B* tree (Knuth's variant of the B-tree): before splitting a full node, try to pass
 * a key to an adjacent sibling with room, rotating it through the parent; only when the
 * sibling is full too, split the two full nodes into three. Non-root nodes therefore
 * stay at least about two-thirds full instead of half full, which means fewer nodes and
 * a shallower tree. The root may hold up to 2⌊2M/3⌋ keys, so that its split produces two
 * nodes that already meet the two-thirds rule.
 */
export const bStarTree: AlgorithmModule<BInput, BStarOutput> = {
  id: "b-star-tree",
  version: 1,
  pseudocode: [
    "insert k: walk down to its leaf and put it there in sorted order",
    "while a non-root node x has M + 1 keys:",
    "  a neighbour has room: pass x's end key up through the parent, and the parent's separator down to the neighbour",
    "  else: split x and a full neighbour (2M + 2 keys with their separator) into three nodes; the parent gains a separator",
    "root over 2⌊2M/3⌋ keys: split it in two; the middle key forms the new root",
    "search: as in a B-tree",
  ],
  input,

  run(input, tr) {
    const M = input.size;
    const { rootMax } = bStarLimits(M);
    const B = new TracedMultiTree(tr, `B* tree (M = ${M}; root up to ${rootMax} keys)`);
    let shifts = 0;
    let splits = 0;
    const position = (x: BNode, k: number) => {
      let i = 0;
      while (i < x.keys.length) {
        tr.tally("comparisons");
        if (x.keys[i]! >= k) break;
        i++;
      }
      return i;
    };
    const fix = (p: BNode, i: number) => {
      const x = p.kids[i]!;
      const left = p.kids[i - 1];
      const right = p.kids[i + 1];
      const full = `[${x.keys.join(" ")}] has ${x.keys.length} keys, one too many`;
      if (left && left.keys.length < M) {
        left.keys.push(p.keys[i - 1]!);
        p.keys[i - 1] = x.keys.shift()!;
        if (x.kids.length) B.moveKids(x, 0, 1, left, left.kids.length, { line: 3 });
        B.show(left, { line: 3 });
        B.show(x, { line: 3 });
        B.show(p, {
          line: 3,
          note: `${full}; its left neighbour has room: shift a key across through the parent.`,
        });
        shifts++;
        tr.tally("shifts");
        return;
      }
      if (right && right.keys.length < M) {
        right.keys.unshift(p.keys[i]!);
        p.keys[i] = x.keys.pop()!;
        if (x.kids.length) B.moveKids(x, x.kids.length - 1, 1, right, 0, { line: 3 });
        B.show(right, { line: 3 });
        B.show(x, { line: 3 });
        B.show(p, {
          line: 3,
          note: `${full}; its right neighbour has room: shift a key across through the parent.`,
        });
        shifts++;
        tr.tally("shifts");
        return;
      }
      const j = right ? i : i - 1;
      const a = p.kids[j]!;
      const b = p.kids[j + 1]!;
      const K = [...a.keys, p.keys[j]!, ...b.keys];
      const C = [...a.kids, ...b.kids];
      const [n1, n2] = thirds(M) as [number, number, number];
      const c = B.addChild(p, j + 2, K.slice(n1 + n2 + 2), { line: 4 });
      a.keys = K.slice(0, n1);
      b.keys = K.slice(n1 + 1, n1 + 1 + n2);
      if (C.length)
        B.rehang(
          [a, b, c],
          [C.slice(0, n1 + 1), C.slice(n1 + 1, n1 + n2 + 2), C.slice(n1 + n2 + 2)],
          { line: 4 },
        );
      B.show(a, { line: 4 });
      B.show(b, { line: 4 });
      p.keys.splice(j, 1, K[n1]!, K[n1 + n2 + 1]!);
      B.show(p, {
        line: 4,
        note: `${full}, and its neighbour is full too: split the two into three nodes [${a.keys.join(" ")}], [${b.keys.join(" ")}], [${c.keys.join(" ")}].`,
      });
      splits++;
      tr.tally("splits");
    };

    const results: SetResult[] = [];
    for (const op of input.ops) {
      const k = op.value!;
      B.clear(1);
      // Walk down, remembering the path.
      const path: { node: BNode; i: number }[] = [];
      let found = false;
      for (let x = B.root; x;) {
        B.mark(x);
        const i = position(x, k);
        path.push({ node: x, i });
        if (x.keys[i] === k) {
          found = true;
          B.mark(x, "path");
          break;
        }
        x = x.kids[i] ?? null;
      }
      if (op.name === "search") {
        tr.step({ line: 6, note: found ? `Found ${k}.` : `${k} is not in the tree.` });
        results.push(found ? "found" : "missing");
        continue;
      }
      if (found) {
        tr.step({ line: 1, note: `${k} is already in the tree.` });
        results.push("present");
        continue;
      }
      if (!B.root) {
        B.makeRoot([k], { line: 1, note: `${k} starts the tree.` });
        results.push("inserted");
        continue;
      }
      const leaf = path.at(-1)!;
      leaf.node.keys.splice(leaf.i, 0, k);
      B.show(leaf.node, { line: 1, note: `Put ${k} into the leaf.` });
      for (let d = path.length - 1; d > 0 && path[d]!.node.keys.length > M; d--) {
        const p = path[d - 1]!;
        fix(p.node, p.node.kids.indexOf(path[d]!.node));
      }
      const r = B.root;
      if (r.keys.length > rootMax) {
        const h = Math.floor(r.keys.length / 2);
        const mid = r.keys[h]!;
        const all = r.keys;
        const L = B.addChild(r, 0, all.slice(0, h), { line: 5 });
        const R = B.addChild(r, r.kids.length, all.slice(h + 1), { line: 5 });
        if (r.kids.length > 2) {
          B.moveKids(r, 1, h + 1, L, 0, { line: 5 });
          B.moveKids(r, 1, all.length - h, R, 0, { line: 5 });
        }
        r.keys = [mid];
        B.show(r, {
          line: 5,
          note: `The root [${all.join(" ")}] is over ${rootMax} keys: split it; ${mid} becomes the new root and the tree grows a level.`,
        });
        splits++;
        tr.tally("splits");
      }
      results.push("inserted");
    }
    B.clear(1);
    const tree = B.shape();
    const output: BStarOutput = { results, tree, height: bHeight(tree), shifts, splits };
    tr.finish(input, output, {
      line: 6,
      note: `${allKeys(tree).length} keys, height ${output.height}; ${shifts} shift${shifts === 1 ? "" : "s"} to a neighbour, ${splits} split${splits === 1 ? "" : "s"}.`,
    });
    return output;
  },

  check(input, out) {
    const want = setModel(input.ops);
    const r = compareResults(input.ops, out.results, want.results);
    if (r) return r;
    const { min, max, rootMax } = bStarLimits(input.size);
    const e = checkMultiway(out.tree, min, max, false, rootMax);
    if (e) return e;
    if (allKeys(out.tree).join() !== want.keys.join())
      return `keys ${allKeys(out.tree)}, expected ${want.keys}`;
    const model = bStarModel(input.size, input.ops);
    if (showShape(out.tree) !== showShape(model))
      return `tree ${showShape(out.tree)}, the B* rules give ${showShape(model)}`;
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
    `${o.results.join(", ")}; height ${o.height}, ${o.shifts} shifts, ${o.splits} splits`,
};
