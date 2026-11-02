import type { TreeStructure } from "@/engine/protocol";
import type { TraceState } from "@/engine/state";
import type { TracedTree } from "@/engine/tracer";
import { inorder, checkTreeShape } from "@/engine/tree";
import type { AlgorithmModule, InputSpec } from "../types";
import { clamp, parseNumberList, randomNumbers } from "../inputs";

export interface BstInput {
  insert: number[];
  search: number[];
  remove: number[];
}

export interface BstOutput {
  /** Keys in sorted (in-order) order after all operations. */
  inorder: number[];
  found: boolean[];
  removed: boolean[];
}

const LIMIT = { minLength: 0, maxLength: 15, min: -99, max: 99 };

const bstInput: InputSpec<BstInput> = {
  fields: [
    { name: "insert", label: "Insert, in order", placeholder: "e.g. 50, 30, 70, 20, 40, 60, 80" },
    { name: "search", label: "Then search for", placeholder: "e.g. 60, 35" },
    { name: "remove", label: "Then delete", placeholder: "e.g. 20, 30, 50" },
  ],
  constraints:
    "Up to 15 keys to insert and 5 each to search and delete; whole numbers from −99 to 99. Repeated keys are ignored.",
  parse(fields) {
    const ins = parseNumberList(fields.insert ?? "", { ...LIMIT, minLength: 1 }, "Insert");
    const sea = parseNumberList(fields.search ?? "", { ...LIMIT, maxLength: 5 }, "Search");
    const rem = parseNumberList(fields.remove ?? "", { ...LIMIT, maxLength: 5 }, "Delete");
    const errors = [ins, sea, rem].flatMap((r) => (r.ok ? [] : r.errors));
    if (!ins.ok || !sea.ok || !rem.ok) return { ok: false, errors };
    return { ok: true, value: { insert: ins.value, search: sea.value, remove: rem.value } };
  },
  format: (v) => ({
    insert: v.insert.join(", "),
    search: v.search.join(", "),
    remove: v.remove.join(", "),
  }),
  presets: [
    {
      id: "classic",
      label: "Balanced example",
      value: { insert: [50, 30, 70, 20, 40, 60, 80], search: [60, 35], remove: [20, 30, 50] },
    },
    {
      id: "sorted",
      label: "Sorted inserts (degenerate)",
      value: { insert: [1, 2, 3, 4, 5, 6], search: [6], remove: [1] },
    },
    {
      id: "successor",
      label: "Delete with two children",
      value: { insert: [8, 3, 10, 1, 6, 14, 4, 7, 13], search: [7], remove: [3, 8] },
    },
  ],
  random(rng, size) {
    const n = clamp(size ?? 8, 1, 15);
    const insert = randomNumbers(rng, n, 1, 60);
    const pick = () => (rng.next() < 0.6 ? insert[rng.int(0, n - 1)]! : rng.int(1, 60));
    return { insert, search: [pick(), pick()], remove: [pick(), pick()] };
  },
};

/** Reset the highlight of every node touched by the previous operation. */
function clearMarks(T: TracedTree, touched: Set<string>, line: number) {
  for (const id of touched) if (T.has(id)) T.status(id, "unvisited", { line });
  touched.clear();
}

export const bst: AlgorithmModule<BstInput, BstOutput> = {
  id: "bst",
  version: 1,
  pseudocode: [
    "procedure insert(T, x)",
    "  if T is empty: make x the root",
    "  else walk from the root: if x = key, stop (already present)",
    "    go left if x < key, else right; attach x at the empty slot",
    "procedure search(T, x)",
    "  v ← root;  while v ≠ nil and v.key ≠ x",
    "    v ← v.left if x < v.key else v.right",
    "  return v ≠ nil",
    "procedure delete(T, x)",
    "  find the node v with key x (as in search)",
    "  if v has two children: copy its successor s (leftmost in v.right) into v; delete s instead",
    "  remove v, linking its only child (if any) to v's parent",
  ],
  input: bstInput,

  run(input, t) {
    const T = t.tree("T", { binary: true, label: "Binary search tree" });
    const touched = new Set<string>();

    // Walk from the root towards x. Returns the node holding x, or the last node and the empty slot.
    const walk = (
      x: number,
      line: number,
    ): { node: string | null; parent: string | null; slot: 0 | 1 } => {
      let v = T.root;
      let parent: string | null = null;
      let slot: 0 | 1 = 0;
      while (v !== null) {
        const vv = v;
        touched.add(vv);
        const c = T.compare(vv, x, () => ({ line, note: `Compare ${x} with ${T.value(vv)}.` }));
        if (c === 0) return { node: vv, parent, slot };
        T.status(vv, "frontier", { line: line + 1 });
        parent = vv;
        slot = c > 0 ? 0 : 1;
        v = T.child(vv, slot);
        if (v !== null)
          t.step({
            line: line + 1,
            note: `${x} ${c > 0 ? "<" : ">"} ${T.value(vv)}: go ${slot === 0 ? "left" : "right"}.`,
          });
      }
      return { node: null, parent, slot };
    };

    for (const x of input.insert) {
      clearMarks(T, touched, 1);
      t.step({ line: 1, vars: { op: "insert", x }, note: `Insert ${x}.` });
      if (T.root === null) {
        const id = T.add(x, null, undefined, {
          line: 2,
          note: `The tree is empty: ${x} becomes the root.`,
        });
        touched.add(id);
        continue;
      }
      const at = walk(x, 3);
      if (at.node !== null) {
        T.status(at.node, "path", {
          line: 3,
          note: `${x} is already in the tree; a set keeps one copy.`,
        });
        continue;
      }
      const id = T.add(x, at.parent, at.slot, {
        line: 4,
        note: `Empty slot found: attach ${x} as the ${at.slot === 0 ? "left" : "right"} child of ${T.value(at.parent!)}.`,
      });
      touched.add(id);
      T.status(id, "visited", { line: 4 });
    }

    const found: boolean[] = [];
    for (const x of input.search) {
      clearMarks(T, touched, 5);
      t.step({ line: 5, vars: { op: "search", x }, note: `Search for ${x}.` });
      const at = walk(x, 6);
      found.push(at.node !== null);
      if (at.node !== null) T.status(at.node, "path", { line: 8, note: `Found ${x}.` });
      else t.step({ line: 8, note: `Reached an empty slot: ${x} is not in the tree.` });
    }

    const removed: boolean[] = [];
    for (const x of input.remove) {
      clearMarks(T, touched, 9);
      t.step({ line: 9, vars: { op: "delete", x }, note: `Delete ${x}.` });
      const at = walk(x, 10);
      if (at.node === null) {
        removed.push(false);
        t.step({ line: 10, note: `${x} is not in the tree; nothing to delete.` });
        continue;
      }
      removed.push(true);
      let v = at.node;
      T.status(v, "path", { line: 10 });
      if (T.child(v, 0) !== null && T.child(v, 1) !== null) {
        let s = T.child(v, 1)!;
        touched.add(s);
        T.status(s, "frontier", {
          line: 11,
          note: `${x} has two children. Its successor is the smallest key in its right subtree.`,
        });
        while (T.child(s, 0) !== null) {
          s = T.child(s, 0)!;
          touched.add(s);
          T.status(s, "frontier", { line: 11 });
        }
        const succ = T.num(s);
        T.set(v, succ, {
          line: 11,
          note: `Copy the successor ${succ} into the node, then delete the successor's old node.`,
        });
        v = s;
      }
      const only = T.child(v, 0) ?? T.child(v, 1);
      const removedKey = T.value(v);
      touched.delete(v);
      if (only === null)
        T.remove(v, { line: 12, note: `The node with ${removedKey} is a leaf: remove it.` });
      else
        T.splice(v, {
          line: 12,
          note: `The node with ${removedKey} has one child: link that child to its parent.`,
        });
    }
    clearMarks(T, touched, 12);

    const final = inorderOf(T);
    const output: BstOutput = { inorder: final, found, removed };
    t.finish(input, output, {
      vars: { op: null, x: null },
      note: `In-order traversal: ${final.join(", ") || "(empty)"}.`,
    });
    return output;
  },

  check(input, out) {
    // Independent oracle: an ordinary set.
    const set = new Set<number>(input.insert);
    const found = input.search.map((x) => set.has(x));
    const removed = input.remove.map((x) => set.delete(x));
    const sorted = [...set].sort((a, b) => a - b);
    if (JSON.stringify(out.found) !== JSON.stringify(found))
      return `found ${out.found}, expected ${found}`;
    if (JSON.stringify(out.removed) !== JSON.stringify(removed))
      return `removed ${out.removed}, expected ${removed}`;
    if (JSON.stringify(out.inorder) !== JSON.stringify(sorted))
      return `in-order [${out.inorder}], expected [${sorted}]`;
    return null;
  },

  fidelity(state: TraceState, out) {
    const T = state.structures.T as TreeStructure | undefined;
    if (!T || T.kind !== "tree") return "no tree";
    const shape = checkTreeShape(T);
    if (shape) return shape;
    const keys = inorder(T);
    if (JSON.stringify(keys) !== JSON.stringify(out.inorder))
      return `tree shows [${keys}], output [${out.inorder}]`;
    // The BST property: every node's left subtree is smaller and right subtree larger.
    const ok = (id: string | null, lo: number, hi: number): boolean => {
      if (id === null) return true;
      const v = T.nodes[id]!.value as number;
      return (
        v > lo &&
        v < hi &&
        ok(T.nodes[id]!.children[0] ?? null, lo, v) &&
        ok(T.nodes[id]!.children[1] ?? null, v, hi)
      );
    };
    return ok(T.root, -Infinity, Infinity) ? null : "the BST property is violated";
  },

  describeOutput: (out) =>
    `In-order: ${out.inorder.join(", ") || "(empty)"}; found ${out.found.map(String).join(", ") || "—"}; deleted ${out.removed.map(String).join(", ") || "—"}`,
};

function inorderOf(T: TracedTree): number[] {
  const out: number[] = [];
  const walk = (id: string | null) => {
    if (id === null) return;
    walk(T.child(id, 0));
    out.push(T.num(id));
    walk(T.child(id, 1));
  };
  walk(T.root);
  return out;
}
