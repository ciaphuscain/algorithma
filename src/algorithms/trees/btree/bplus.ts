import type { TraceState } from "@/engine/state";
import type { AlgorithmModule } from "../../types";
import { compareResults, type Op } from "../../ops";
import {
  bHeight,
  bInput,
  checkMultiway,
  shapeFromTree,
  showShape,
  TracedMultiTree,
  type BInput,
  type BNode,
  type BShape,
} from "./common";

export interface BPlusOutput {
  /** "inserted" / "present" / "found" / "missing", or the keys a scan returned ("30 40 50"). */
  results: string[];
  tree: BShape | null;
  /** All keys, read along the leaf chain. */
  leaves: number[];
  height: number;
  splits: number;
}

const ops = (text: string): Op[] => {
  const names: Record<string, string> = { i: "insert", s: "search", r: "scan" };
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => ({ name: names[w[0]!]!, value: Number(w.slice(1)) }));
};

const input = bInput({
  sizeField: {
    label: "Order m (most keys per node)",
    min: 3,
    max: 4,
    help: "A node that would hold m + 1 keys is split in two.",
  },
  spec: {
    insert: { value: true, aliases: ["add", "i"] },
    search: { value: true, aliases: ["find", "s"] },
    scan: { value: true, aliases: ["range", "from", "r"] },
  },
  presets: [
    {
      id: "grow",
      label: "Leaf splits copy keys up (m = 3)",
      value: { size: 3, ops: ops("i10 i20 i30 i40 i50 i60 i70 i80 s50 r35") },
    },
    {
      id: "m4",
      label: "Order 4, mixed inserts",
      value: { size: 4, ops: ops("i50 i20 i80 i10 i30 i60 i90 i40 i70 i25 i35 r30") },
    },
    {
      id: "scan",
      label: "Range scans along the leaf chain",
      value: { size: 3, ops: ops("i5 i15 i25 i35 i45 i55 r0 r30 s45 s50") },
    },
  ],
});

/** Independent model: bottom-up B+ insertion on nested lists. */
export function bPlusModel(m: number, list: Op[]): { tree: BShape | null; results: string[] } {
  type M = { keys: number[]; kids: M[] };
  let root: M | null = null;
  const leafOf = (k: number) => {
    let x = root!;
    while (x.kids.length) {
      let i = 0;
      while (i < x.keys.length && k >= x.keys[i]!) i++;
      x = x.kids[i]!;
    }
    return x;
  };
  const ordered = (): number[] => {
    const out: number[] = [];
    const walk = (x: M) => (x.kids.length ? x.kids.forEach(walk) : out.push(...x.keys));
    if (root) walk(root);
    return out;
  };
  // Insert into subtree x; returns [separator, new right sibling] if x split.
  const ins = (x: M, k: number): [number, M] | null => {
    if (!x.kids.length) {
      let i = 0;
      while (i < x.keys.length && x.keys[i]! < k) i++;
      x.keys.splice(i, 0, k);
      if (x.keys.length <= m) return null;
      const mid = Math.ceil(x.keys.length / 2);
      const right: M = { keys: x.keys.splice(mid), kids: [] };
      return [right.keys[0]!, right];
    }
    let i = 0;
    while (i < x.keys.length && k >= x.keys[i]!) i++;
    const up = ins(x.kids[i]!, k);
    if (!up) return null;
    x.keys.splice(i, 0, up[0]);
    x.kids.splice(i + 1, 0, up[1]);
    if (x.keys.length <= m) return null;
    const mid = Math.floor(x.keys.length / 2);
    const sep = x.keys[mid]!;
    const right: M = { keys: x.keys.splice(mid + 1), kids: x.kids.splice(mid + 1) };
    x.keys.pop();
    return [sep, right];
  };
  const results = list.map((op): string => {
    const k = op.value!;
    const present = root !== null && leafOf(k).keys.includes(k);
    if (op.name === "search") return present ? "found" : "missing";
    if (op.name === "scan")
      return (
        ordered()
          .filter((v) => v >= k)
          .join(" ") || "none"
      );
    if (present) return "present";
    if (!root) root = { keys: [k], kids: [] };
    else {
      const up = ins(root, k);
      if (up) root = { keys: [up[0]], kids: [root, up[1]] };
    }
    return "inserted";
  });
  const shape = (n: M): BShape => ({ keys: n.keys, children: n.kids.map(shape) });
  return { tree: root ? shape(root) : null, results };
}

interface PNode extends BNode {
  next: PNode | null;
}

/**
 * A B+ tree of order m: all keys live in the leaves, which are linked left to right;
 * internal nodes hold only separators (copies of the smallest key to their right) for
 * routing. Inserting into a full leaf splits it and copies the right half's first key
 * up; a full internal node splits and moves its middle separator up. Range scans find
 * the first leaf, then follow the leaf chain without going back up the tree.
 */
export const bPlusTree: AlgorithmModule<BInput, BPlusOutput> = {
  id: "b-plus-tree",
  version: 1,
  pseudocode: [
    "find leaf(k): from the root, follow the child after the last separator ≤ k",
    "insert k: put it into its leaf in sorted order",
    "  leaf over m keys: split it; copy the right leaf's first key up as a separator; link the leaves",
    "  internal node over m keys: split it; move its middle separator up",
    "  root split: the tree grows a level",
    "search k: find leaf(k); look for k there",
    "scan from k: find leaf(k); read keys ≥ k, following next-leaf links to the end",
  ],
  input,

  run(input, tr) {
    const m = input.size;
    const B = new TracedMultiTree(tr, `B+ tree (order ${m}; → links each leaf to the next)`);
    let splits = 0;
    const link = (leaf: PNode, line: number) =>
      B.T.annotate(leaf.id, leaf.next ? "→" : null, { line });
    const route = (x: BNode, k: number) => {
      let i = 0;
      while (i < x.keys.length) {
        tr.tally("comparisons");
        if (k < x.keys[i]!) break;
        i++;
      }
      return i;
    };
    const findLeaf = (k: number, line: number): { leaf: PNode; path: BNode[] } => {
      const path: BNode[] = [];
      let x = B.root!;
      while (x.kids.length) {
        B.mark(x);
        path.push(x);
        const i = route(x, k);
        x = x.kids[i]!;
      }
      B.mark(x, "path");
      tr.step({ line, note: `${k} belongs in the leaf [${x.keys.join(" ")}].` });
      return { leaf: x as PNode, path };
    };
    /** Split an overfull node x (child of `parent`, or the root when parent is null). */
    const split = (x: BNode, parent: BNode | null): void => {
      splits++;
      tr.tally("splits");
      const leaf = !x.kids.length;
      const all = [...x.keys];
      const mid = leaf ? Math.ceil(all.length / 2) : Math.floor(all.length / 2);
      const leftKeys = all.slice(0, mid);
      const rightKeys = leaf ? all.slice(mid) : all.slice(mid + 1);
      const sep = all[mid]!; // leaf: the right half's first key (copied); internal: the middle separator (moved)
      const how = leaf
        ? `The leaf [${all.join(" ")}] has ${all.length} keys: split it and copy ${sep} up.`
        : `The node [${all.join(" ")}] has ${all.length} separators: split it and move ${sep} up.`;
      if (!parent) {
        // Root split in place: the root keeps one separator and gains two children.
        const L = B.addChild(x, 0, leftKeys, { line: 5 }) as PNode;
        const R = B.addChild(x, x.kids.length, rightKeys, { line: 5 }) as PNode;
        if (leaf) {
          L.next = R;
          R.next = null;
          link(L, 5);
        } else {
          B.moveKids(x, 1, mid + 1, L, 0, { line: 5 });
          B.moveKids(x, 1, all.length - mid, R, 0, { line: 5 });
        }
        x.keys = [sep];
        B.show(x, { line: 5, note: `${how} The root splits: the tree grows a level.` });
        return;
      }
      const at = parent.kids.indexOf(x);
      x.keys = leftKeys;
      const z = B.addChild(parent, at + 1, rightKeys, { line: leaf ? 3 : 4 }) as PNode;
      if (leaf) {
        z.next = (x as PNode).next;
        (x as PNode).next = z;
        link(z, 3);
        link(x as PNode, 3);
      } else B.moveKids(x, mid + 1, all.length - mid, z, 0, { line: 4 });
      B.show(x, { line: leaf ? 3 : 4 });
      parent.keys.splice(at, 0, sep);
      B.show(parent, { line: leaf ? 3 : 4, note: how });
    };

    const results: string[] = [];
    for (const op of input.ops) {
      const k = op.value!;
      B.clear(1);
      if (!B.root) {
        if (op.name === "insert") {
          const r = B.makeRoot([k], {
            line: 2,
            note: `${k} starts the tree in a single leaf.`,
          }) as PNode;
          r.next = null;
          results.push("inserted");
        } else {
          tr.step({ line: op.name === "search" ? 6 : 7, note: "The tree is empty." });
          results.push(op.name === "search" ? "missing" : "none");
        }
        continue;
      }
      const { leaf, path } = findLeaf(k, op.name === "insert" ? 1 : op.name === "search" ? 6 : 7);
      if (op.name === "search") {
        let found = false;
        for (const v of leaf.keys) {
          tr.tally("comparisons");
          if (v === k) {
            found = true;
            break;
          }
        }
        tr.step({
          line: 6,
          note: found ? `Found ${k} in its leaf.` : `${k} is not in its leaf, so not in the tree.`,
        });
        results.push(found ? "found" : "missing");
        continue;
      }
      if (op.name === "scan") {
        const got: number[] = [];
        for (let l: PNode | null = leaf; l; l = l.next) {
          B.mark(l, "path");
          const before = got.length;
          for (const v of l.keys) if (v >= k) got.push(v);
          tr.step({
            line: 7,
            note: `Leaf [${l.keys.join(" ")}]: ${got.length - before ? `read ${got.slice(before).join(", ")}` : "nothing ≥ " + k}${l.next ? "; follow the link to the next leaf." : "; it is the last leaf."}`,
          });
        }
        results.push(got.join(" ") || "none");
        continue;
      }
      if (leaf.keys.includes(k)) {
        tr.step({ line: 2, note: `${k} is already in the tree.` });
        results.push("present");
        continue;
      }
      let i = 0;
      while (i < leaf.keys.length && leaf.keys[i]! < k) i++;
      leaf.keys.splice(i, 0, k);
      B.show(leaf, { line: 2, note: `Put ${k} into the leaf.` });
      // Split upwards while a node is over capacity.
      let x: BNode = leaf;
      for (let d = path.length; x.keys.length > m;) {
        const parent = d > 0 ? path[d - 1]! : null;
        split(x, parent);
        if (!parent) break;
        x = parent;
        d--;
      }
      results.push("inserted");
    }
    B.clear(1);
    const tree = B.shape();
    const leaves: number[] = [];
    let first: BNode | null = B.root;
    while (first && first.kids.length) first = first.kids[0]!;
    for (let l = first as PNode | null; l; l = l.next) leaves.push(...l.keys);
    const output: BPlusOutput = { results, tree, leaves, height: bHeight(tree), splits };
    tr.finish(input, output, {
      line: 7,
      note: `${leaves.length} keys in the leaves, tree height ${output.height}, ${splits} split${splits === 1 ? "" : "s"}.`,
    });
    return output;
  },

  check(input, out) {
    const model = bPlusModel(input.size, input.ops);
    const r = compareResults(input.ops, out.results, model.results);
    if (r) return r;
    const m = input.size;
    const e = checkMultiway(out.tree, Math.floor(m / 2), m, true);
    if (e) return e;
    // The leaf chain must list every key once, in order.
    const fromLeaves = (s: BShape | null): number[] =>
      !s ? [] : s.children.length ? s.children.flatMap(fromLeaves) : s.keys;
    if (out.leaves.join() !== fromLeaves(out.tree).join())
      return `the leaf chain reads ${out.leaves}, the leaves hold ${fromLeaves(out.tree)}`;
    if (showShape(out.tree) !== showShape(model.tree))
      return `tree ${showShape(out.tree)}, bottom-up B+ insertion gives ${showShape(model.tree)}`;
    return out.height === bHeight(out.tree) ? null : "wrong height";
  },

  fidelity(state: TraceState, out) {
    const T = state.structures.T;
    if (T?.kind !== "tree") return "no tree";
    if (showShape(shapeFromTree(T)) !== showShape(out.tree))
      return "the drawn tree differs from the result";
    // Every leaf but the last shows its link.
    const leafIds: string[] = [];
    const walk = (id: string) => {
      const kids = T.nodes[id]!.children.filter((c): c is string => c !== null);
      if (!kids.length) leafIds.push(id);
      kids.forEach(walk);
    };
    if (T.root) walk(T.root);
    return leafIds.every((id, i) => (T.annotations[id] === "→") === i < leafIds.length - 1)
      ? null
      : "the leaf links are drawn wrongly";
  },

  describeOutput: (o) => `${o.results.join("; ")} — height ${o.height}`,
};
