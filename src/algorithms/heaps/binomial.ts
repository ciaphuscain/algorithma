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

export interface ForestHeapOutput {
  results: HeapResult[];
  forest: FShape[];
  /** Times one tree was linked under another. */
  links: number;
}

const input = heapInput([
  {
    id: "binary",
    label: "Inserts add like binary counting",
    value: heapOps("i8 i3 i12 i5 i9 i1 i7 i4"),
  },
  {
    id: "extract",
    label: "Extract-min splits a tree into its children",
    value: heapOps("i8 i3 i12 i5 i9 i1 i7 i4 x x p"),
  },
  {
    id: "decrease",
    label: "Decrease-key bubbles up",
    value: heapOps("i8 i3 i12 i5 i9 i1 i7 i4 d12:2 x x"),
  },
]);

/** Independent model of the same CLRS rules on nested lists. */
export function binomialModel(ops: HeapOp[]): FShape[] {
  type N = { key: number; kids: N[] };
  let roots: N[] = [];
  const deg = (n: N) => n.kids.length;
  const union = (incoming: N[]) => {
    // Stable merge by degree (existing roots first on ties), then link equal degrees.
    const merged: N[] = [];
    let a = 0;
    let b = 0;
    while (a < roots.length || b < incoming.length)
      if (b >= incoming.length || (a < roots.length && deg(roots[a]!) <= deg(incoming[b]!)))
        merged.push(roots[a++]!);
      else merged.push(incoming[b++]!);
    let i = 0;
    while (i + 1 < merged.length) {
      const x = merged[i]!;
      const next = merged[i + 1]!;
      const third = merged[i + 2];
      if (deg(x) !== deg(next) || (third && deg(third) === deg(x))) i++;
      else if (x.key <= next.key) {
        x.kids.unshift(next);
        merged.splice(i + 1, 1);
      } else {
        next.kids.unshift(x);
        merged.splice(i, 1);
      }
    }
    roots = merged;
  };
  const find = (ns: N[], k: number, parent: N | null): [N, N | null] | null => {
    for (const n of ns) {
      if (n.key === k) return [n, parent];
      const f = find(n.kids, k, n);
      if (f) return f;
    }
    return null;
  };
  const present = new Set<number>();
  for (const op of ops) {
    if (op.name === "insert") {
      if (present.has(op.value)) continue;
      present.add(op.value);
      union([{ key: op.value, kids: [] }]);
    } else if (op.name === "extract") {
      if (!roots.length) continue;
      let m = roots[0]!;
      for (const r of roots) if (r.key < m.key) m = r;
      present.delete(m.key);
      roots.splice(roots.indexOf(m), 1);
      union([...m.kids].reverse());
    } else if (op.name === "decrease") {
      if (!present.has(op.value) || op.to >= op.value || present.has(op.to)) continue;
      present.delete(op.value);
      present.add(op.to);
      // Walk the path from the node to its root, exchanging keys while out of order.
      const path: N[] = [];
      for (let k = op.value; ;) {
        const [n, p] = find(roots, k, null)!;
        path.push(n);
        if (!p) break;
        k = p.key;
      }
      path[0]!.key = op.to;
      for (let i = 0; i + 1 < path.length && path[i]!.key < path[i + 1]!.key; i++)
        [path[i]!.key, path[i + 1]!.key] = [path[i + 1]!.key, path[i]!.key];
    }
  }
  const shape = (n: N): FShape => ({ key: n.key, children: n.kids.map(shape) });
  return roots.map(shape);
}

/** Check that every tree is a binomial tree and root degrees strictly increase. */
export function binomialCheck(f: FShape[]): string | null {
  const isBinomial = (t: FShape): boolean =>
    t.children.every((c, i) => c.children.length === t.children.length - 1 - i && isBinomial(c));
  let last = -1;
  for (const t of f) {
    if (!isBinomial(t)) return `the tree rooted at ${t.key} is not a binomial tree`;
    if (t.children.length <= last) return "root degrees do not strictly increase";
    last = t.children.length;
  }
  return null;
}

/**
 * A binomial heap (Vuillemin; operations as in Cormen et al.): a list of heap-ordered
 * binomial trees, at most one of each order k (a tree of order k has 2^k nodes and
 * children of orders k − 1, …, 0). Its shape mirrors n in binary. Union merges two root
 * lists by order and links trees of equal order — the smaller root on top — exactly
 * like carrying in binary addition. Insert is a union with one node; extract-min
 * removes the smallest root and unions its children back in.
 */
export const binomialHeap: AlgorithmModule<HeapOp[], ForestHeapOutput> = {
  id: "binomial-heap",
  version: 1,
  pseudocode: [
    "union(H1, H2): merge the root lists by tree order",
    "  scan the roots: two adjacent trees of equal order (and not three) are linked —",
    "    the larger root becomes the first child of the smaller (a carry)",
    "insert x: union with a one-node heap",
    "extract: find the smallest root; remove it; union its children (in increasing order) back in",
    "decrease k to v: set the key; swap it upwards with its parent while it is smaller",
    "peek: the smallest root",
  ],
  input,

  run(ops, t) {
    const F = new TracedForest(t, "Binomial heap (the roots are the trees, smallest order first)");
    let links = 0;
    const deg = (n: FNode) => n.kids.length;
    /** Merge `incoming` (already in the root list) into place by order, then link. */
    const consolidate = () => {
      let i = 0;
      while (i + 1 < F.roots.length) {
        const x = F.roots[i]!;
        const next = F.roots[i + 1]!;
        const third = F.roots[i + 2];
        if (deg(x) !== deg(next) || (third && deg(third) === deg(x))) {
          i++;
          continue;
        }
        t.tally("comparisons");
        const [top, under] = x.key <= next.key ? [x, next] : [next, x];
        F.place(under, top, 0, {
          line: 2,
          note: `Two trees of order ${deg(x)}: link them — ${under.key} goes under ${top.key}, making a tree of order ${deg(x) + 1}.`,
        });
        links++;
        t.tally("links");
      }
    };
    /** Position for a tree of order d in the root list (after equal orders). */
    const slotFor = (d: number) => {
      const i = F.roots.findIndex((r) => deg(r) > d);
      return i === -1 ? F.roots.length : i;
    };
    const minRoot = (line: number): FNode | null => {
      let m: FNode | null = null;
      for (const r of F.roots) {
        if (m) t.tally("comparisons");
        if (!m || r.key < m.key) m = r;
      }
      if (m) {
        F.T.status(m.id, "current", { line, note: `The smallest root is ${m.key}.` });
        F.T.status(m.id, "unvisited", { line });
      }
      return m;
    };
    const present = new Set<number>();
    const results: HeapResult[] = [];
    for (const op of ops) {
      if (op.name === "insert") {
        if (present.has(op.value)) {
          t.step({ line: 4, note: `${op.value} is already in the heap.` });
          results.push("present");
          continue;
        }
        present.add(op.value);
        F.addRoot(op.value, slotFor(0), {
          line: 4,
          note: `Insert ${op.value}: a one-node tree of order 0 joins the root list.`,
        });
        consolidate();
        results.push("ok");
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
        let n = F.find(op.value)!;
        F.setKey(n, op.to, { line: 6, note: `Decrease ${op.value} to ${op.to}.` });
        while (!F.isRoot(n)) {
          const p = n.parent!;
          t.tally("comparisons");
          if (p.key < n.key) break;
          const [a, b] = [n.key, p.key];
          F.setKey(p, a, { line: 6 });
          F.setKey(n, b, { line: 6, note: `${a} < its parent ${b}: exchange the keys.` });
          n = p;
        }
        results.push("ok");
        continue;
      }
      const m = minRoot(op.name === "peek" ? 7 : 5);
      if (!m) {
        t.step({ line: op.name === "peek" ? 7 : 5, note: "The heap is empty." });
        results.push("empty");
        continue;
      }
      if (op.name === "peek") {
        results.push(m.key);
        continue;
      }
      present.delete(m.key);
      // Its children, smallest order first, join the root list in order.
      const kids = [...m.kids].reverse();
      for (const c of kids) F.place(c, F.top, slotFor(deg(c)), { line: 5 });
      F.removeRoot(m, {
        line: 5,
        note:
          kids.length === 0
            ? `Extract ${m.key}.`
            : `Extract ${m.key}; its ${kids.length === 1 ? "subtree rejoins" : `${kids.length} subtrees rejoin`} the root list.`,
      });
      consolidate();
      results.push(m.key);
    }
    const forest = F.shape();
    const output: ForestHeapOutput = { results, forest, links };
    t.finish(ops, output, {
      line: 7,
      note: `${forestKeys(forest).length} keys in ${forest.length} tree${forest.length === 1 ? "" : "s"} of order${forest.length === 1 ? "" : "s"} ${forest.map((r) => r.children.length).join(", ") || "—"}; ${links} links.`,
    });
    return output;
  },

  check(ops, out) {
    const want = heapModel(ops);
    const r = compareHeapResults(ops, out.results, want.results);
    if (r) return r;
    if (forestKeys(out.forest).join() !== want.keys.join())
      return `keys ${forestKeys(out.forest)}, expected ${want.keys}`;
    const e = heapOrder(out.forest) ?? binomialCheck(out.forest);
    if (e) return e;
    // n in binary: one tree of order k for every 1 bit.
    const n = want.keys.length;
    const orders = out.forest.map((t) => t.children.length);
    const bits = [...n.toString(2)].reverse().flatMap((b, k) => (b === "1" ? [k] : []));
    if (orders.join() !== bits.join())
      return `tree orders ${orders}, but ${n} in binary needs ${bits}`;
    const model = binomialModel(ops);
    return showForest(out.forest) === showForest(model)
      ? null
      : `heap ${showForest(out.forest)}, the CLRS rules give ${showForest(model)}`;
  },

  fidelity(state: TraceState, out) {
    const T = state.structures.T;
    if (T?.kind !== "tree") return "no tree";
    return showForest(forestFromState(T)) === showForest(out.forest)
      ? null
      : "the drawn heap differs from the result";
  },

  describeOutput: (o) =>
    `${o.results.filter((r) => r !== "ok").join(", ") || "no removals"}; trees of orders ${o.forest.map((t) => t.children.length).join(", ") || "none"}`,
};
