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
  shapeKeys,
  TracedBst,
  type Node,
  type SetResult,
  type Shape,
} from "./common";

interface TreapNode extends Node {
  priority: number;
}

export interface TreapOutput {
  results: SetResult[];
  tree: Shape | null;
  height: number;
}

/**
 * Each key's priority. A real treap draws priorities at random; here they come from a
 * fixed permutation of 0–100 (k ↦ (37k + 23) mod 101), so runs are reproducible and no
 * two keys share a priority.
 */
export const priorityOf = (key: number) => (37 * key + 23) % 101;

const input = setInput({
  presets: [
    {
      id: "ascending",
      label: "Ascending inserts: priorities keep it shallow",
      value: ops("i1 i2 i3 i4 i5 i6 i7 i8 i9 i10"),
    },
    { id: "mixed", label: "Inserts and searches", value: ops("i40 i10 i70 i20 i90 i50 s20 s60") },
    {
      id: "delete",
      label: "Delete by rotating the key down",
      value: ops("i40 i10 i70 i20 i90 i50 d40 d10 s70"),
    },
  ],
});

/** The unique treap (Cartesian tree) for these keys: the smallest priority at the root. */
export function cartesian(keys: number[]): Shape | null {
  if (keys.length === 0) return null;
  let best = 0;
  keys.forEach((k, i) => {
    if (priorityOf(k) < priorityOf(keys[best]!)) best = i;
  });
  const k = keys[best]!;
  return {
    key: k,
    tag: `p=${priorityOf(k)}`,
    left: cartesian(keys.slice(0, best)),
    right: cartesian(keys.slice(best + 1)),
  };
}

/**
 * A treap (Seidel and Aragon): a binary search tree on the keys that is also a heap on
 * the priorities — every node's priority is smaller than its children's. Insert adds a
 * leaf and rotates it up while its priority beats its parent's; delete rotates the key
 * down, always lifting the child with the smaller priority, until it is a leaf. With
 * random priorities the expected height is O(log n).
 */
export const treap: AlgorithmModule<Op[], TreapOutput> = {
  id: "treap",
  version: 1,
  pseudocode: [
    "insert(k): add k as a leaf (BST insert) with priority p(k)",
    "  while k's priority is smaller than its parent's: rotate k above its parent",
    "delete(k): while k has two children: rotate up the child with the smaller priority",
    "  remove k (now with at most one child)",
    "search: walk down from the root",
  ],
  input,

  run(list, t) {
    const B = new TracedBst<TreapNode>(
      t,
      "Treap (p = priority, smallest at the root)",
      (n) => `p=${n.priority}`,
    );
    const results: SetResult[] = [];
    for (const op of list) {
      const k = op.value!;
      B.clear(1);
      const { node, last } = B.find(k, op.name === "search" ? 5 : op.name === "insert" ? 1 : 3);
      if (op.name === "search") {
        if (node) B.mark(node, "path");
        t.step({ line: 5, note: node ? `Found ${k}.` : `${k} is not in the treap.` });
        results.push(node ? "found" : "missing");
      } else if (op.name === "insert") {
        if (node) {
          t.step({ line: 1, note: `${k} is already in the treap.` });
          results.push("present");
          continue;
        }
        const x = B.attach({ key: k, priority: priorityOf(k) } as TreapNode, last, {
          line: 1,
          note: `Add ${k} with priority ${priorityOf(k)}${last ? ` as a leaf under ${last.key}` : " as the root"}.`,
        });
        B.mark(x, "path");
        while (x.parent) {
          const p = x.parent as TreapNode;
          t.tally("comparisons");
          if (p.priority < x.priority) {
            t.step({
              line: 2,
              note: `${p.key}'s priority ${p.priority} is smaller than ${x.priority}: stop.`,
            });
            break;
          }
          B.rotate(p, x === p.left ? "right" : "left", {
            line: 2,
            note: `Priority ${x.priority} < ${p.priority}: rotate ${k} above ${p.key}.`,
          });
        }
        results.push("inserted");
      } else {
        if (!node) {
          t.step({ line: 3, note: `${k} is not in the treap.` });
          results.push("missing");
          continue;
        }
        B.mark(node, "path");
        while (node.left && node.right) {
          const l = node.left as TreapNode;
          const r = node.right as TreapNode;
          t.tally("comparisons");
          const lift = l.priority < r.priority ? l : r;
          B.rotate(node, lift === l ? "right" : "left", {
            line: 3,
            note: `Children ${l.key} (p=${l.priority}) and ${r.key} (p=${r.priority}): rotate ${lift.key} up; ${k} moves down.`,
          });
        }
        B.splice(node, { line: 4, note: `${k} has at most one child now: remove it.` });
        results.push("deleted");
      }
    }
    B.clear(5);
    const tree = B.shape();
    const output: TreapOutput = { results, tree, height: shapeHeight(tree) };
    t.finish(list, output, { line: 5, note: `${B.T.size} keys, height ${output.height}.` });
    return output;
  },

  check(list, out) {
    const r = checkSet(list, out.results, out.tree);
    if (r) return r;
    // Distinct priorities make the treap unique: it must be the Cartesian tree of the keys,
    // built here directly from the sorted keys and their priorities.
    if (!sameShape(out.tree, cartesian(shapeKeys(out.tree))))
      return "the tree is not the treap of its keys and priorities";
    return out.height === shapeHeight(out.tree) ? null : "wrong height";
  },

  fidelity(state: TraceState, out) {
    const T = state.structures.T;
    if (T?.kind !== "tree") return "no tree";
    return sameShape(shapeFromState(T), out.tree) ? null : "the drawn tree differs from the result";
  },

  describeOutput: (o) => `${o.results.join(", ")}; height ${o.height}`,
};
