import type { TraceState } from "@/engine/state";
import type { AlgorithmModule } from "../types";
import {
  compareHeapResults,
  forestFromState,
  forestKeys,
  heapInput,
  heapModel,
  heapOps,
  heapOrder,
  showForest,
  TracedForest,
  type FNode,
  type FShape,
  type HeapOp,
  type HeapResult,
} from "./forest";

export interface PairingOutput {
  results: HeapResult[];
  forest: FShape[];
  melds: number;
}

const input = heapInput([
  {
    id: "two-pass",
    label: "Extract-min pairs the children, then melds right to left",
    value: heapOps("i5 i8 i3 i9 i7 i6 i4 i2 x x"),
  },
  {
    id: "decrease",
    label: "Decrease-key cuts a subtree and melds it with the root",
    value: heapOps("i5 i8 i3 i9 i7 i6 x d9:1 p x"),
  },
  { id: "drain", label: "Extract everything", value: heapOps("i4 i8 i2 i6 i1 i9 x x x x x x") },
]);

/** Independent model on nested objects. */
export function pairingModel(ops: HeapOp[]): FShape[] {
  type N = { key: number; kids: N[]; parent: N | null };
  let root: N | null = null;
  const all = new Map<number, N>();
  const meld = (a: N | null, b: N | null): N | null => {
    if (!a) return b;
    if (!b) return a;
    if (b.key < a.key) [a, b] = [b, a];
    a.kids.unshift(b);
    b.parent = a;
    return a;
  };
  for (const op of ops) {
    if (op.name === "insert") {
      if (all.has(op.value)) continue;
      const n: N = { key: op.value, kids: [], parent: null };
      all.set(op.value, n);
      root = meld(root, n);
    } else if (op.name === "extract") {
      if (!root) continue;
      all.delete(root.key);
      const kids = root.kids;
      kids.forEach((k) => (k.parent = null));
      const pairs: N[] = [];
      for (let i = 0; i < kids.length; i += 2) pairs.push(meld(kids[i]!, kids[i + 1] ?? null)!);
      let r: N | null = null;
      for (let i = pairs.length - 1; i >= 0; i--) r = meld(pairs[i]!, r);
      root = r;
    } else if (op.name === "decrease") {
      const x = all.get(op.value);
      if (!x || op.to >= op.value || all.has(op.to)) continue;
      all.delete(op.value);
      all.set(op.to, x);
      x.key = op.to;
      if (x !== root) {
        const p = x.parent!;
        p.kids.splice(p.kids.indexOf(x), 1);
        x.parent = null;
        root = meld(root, x);
      }
    }
  }
  const shape = (n: N): FShape => ({ key: n.key, children: n.kids.map(shape) });
  return root ? [shape(root)] : [];
}

/**
 * A pairing heap (Fredman, Sedgewick, Sleator and Tarjan): a single heap-ordered tree
 * with any number of children per node, and one primitive — meld, which hangs the root
 * with the larger key as the first child of the other. Insert and decrease-key are
 * melds; extract-min removes the root and melds its children back in two passes:
 * pairs left to right, then the results right to left. Simple, fast in practice, and
 * O(log n) amortised for extract-min.
 */
export const pairingHeap: AlgorithmModule<HeapOp[], PairingOutput> = {
  id: "pairing-heap",
  version: 1,
  pseudocode: [
    "meld(a, b): the root with the larger key becomes the first child of the other",
    "insert x: meld the heap with the one-node heap x",
    "extract-min: remove the root; its children become separate heaps",
    "  pass 1: meld them in pairs, left to right",
    "  pass 2: meld the results from right to left into one heap",
    "decrease k to v: set the key; unless it is the root, cut its subtree off and meld it with the root",
    "peek: the root",
  ],
  input,

  run(ops, t) {
    const F = new TracedForest(t, "Pairing heap (separate trees appear only while melding)");
    let melds = 0;
    /** Meld two roots; returns the winner. */
    const meld = (a: FNode, b: FNode, line: number): FNode => {
      t.tally("comparisons");
      const [top, under] = b.key < a.key ? [b, a] : [a, b];
      F.place(under, top, 0, {
        line,
        note: `Meld: ${under.key} > ${top.key}, so ${under.key} becomes ${top.key}'s first child.`,
      });
      melds++;
      t.tally("melds");
      return top;
    };
    const present = new Set<number>();
    const results: HeapResult[] = [];
    for (const op of ops) {
      const root = F.roots[0] ?? null;
      if (op.name === "insert") {
        if (present.has(op.value)) {
          t.step({ line: 2, note: `${op.value} is already in the heap.` });
          results.push("present");
          continue;
        }
        present.add(op.value);
        const n = F.addRoot(op.value, F.roots.length, { line: 2, note: `Insert ${op.value}.` });
        if (root) meld(root, n, 2);
        results.push("ok");
        continue;
      }
      if (op.name === "peek") {
        if (root)
          F.T.status(root.id, "current", {
            line: 7,
            note: `The minimum is ${root.key}, at the root.`,
          });
        if (root) F.T.status(root.id, "unvisited", { line: 7 });
        else t.step({ line: 7, note: "The heap is empty." });
        results.push(root ? root.key : "empty");
        continue;
      }
      if (op.name === "decrease") {
        if (!present.has(op.value)) {
          t.step({ line: 6, note: `${op.value} is not in the heap.` });
          results.push("missing");
          continue;
        }
        if (op.to >= op.value || present.has(op.to)) {
          t.step({ line: 6, note: `${op.to} is not a valid new key for ${op.value}.` });
          results.push("invalid");
          continue;
        }
        present.delete(op.value);
        present.add(op.to);
        const x = F.find(op.value)!;
        F.setKey(x, op.to, { line: 6, note: `Decrease ${op.value} to ${op.to}.` });
        if (x !== root) {
          F.place(x, F.top, F.roots.length, {
            line: 6,
            note: `Cut ${op.to}'s subtree off; meld it with the root.`,
          });
          meld(root!, x, 6);
        }
        results.push("ok");
        continue;
      }
      if (!root) {
        t.step({ line: 3, note: "The heap is empty." });
        results.push("empty");
        continue;
      }
      present.delete(root.key);
      const kids = [...root.kids];
      kids.forEach((k, i) => F.place(k, F.top, i + 1, { line: 3 }));
      F.removeRoot(root, {
        line: 3,
        note:
          kids.length === 0
            ? `Extract ${root.key}; the heap is now empty.`
            : kids.length === 1
              ? `Extract ${root.key}; its only subtree becomes the heap.`
              : `Extract ${root.key}; its ${kids.length} subtrees become separate heaps.`,
      });
      if (kids.length > 1) {
        t.step({ line: 4, note: "Pass 1: meld the heaps in pairs, left to right." });
        const pairs: FNode[] = [];
        for (let i = 0; i < kids.length; i += 2)
          pairs.push(kids[i + 1] ? meld(kids[i]!, kids[i + 1]!, 4) : kids[i]!);
        t.step({ line: 5, note: "Pass 2: meld the results from right to left." });
        let r = pairs.at(-1)!;
        for (let i = pairs.length - 2; i >= 0; i--) r = meld(pairs[i]!, r, 5);
      }
      results.push(root.key);
    }
    const forest = F.shape();
    const output: PairingOutput = { results, forest, melds };
    t.finish(ops, output, {
      line: 7,
      note: forest.length
        ? `${forestKeys(forest).length} keys; the minimum is ${forest[0]!.key}; ${melds} melds.`
        : `The heap is empty; ${melds} melds.`,
    });
    return output;
  },

  check(ops, out) {
    const want = heapModel(ops);
    const r = compareHeapResults(ops, out.results, want.results);
    if (r) return r;
    if (forestKeys(out.forest).join() !== want.keys.join())
      return `keys ${forestKeys(out.forest)}, expected ${want.keys}`;
    if (out.forest.length > 1) return `${out.forest.length} separate trees left`;
    const e = heapOrder(out.forest);
    if (e) return e;
    const model = pairingModel(ops);
    return showForest(out.forest) === showForest(model)
      ? null
      : `heap ${showForest(out.forest)}, two-pass pairing gives ${showForest(model)}`;
  },

  fidelity(state: TraceState, out) {
    const T = state.structures.T;
    if (T?.kind !== "tree") return "no tree";
    return showForest(forestFromState(T)) === showForest(out.forest)
      ? null
      : "the drawn heap differs from the result";
  },

  describeOutput: (o) =>
    `${o.results.filter((r) => r !== "ok").join(", ") || "no removals"}; ${o.melds} melds`,
};
