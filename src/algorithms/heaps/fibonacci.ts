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

export interface FibOutput {
  results: HeapResult[];
  forest: FShape[];
  links: number;
  cuts: number;
}

const input = heapInput([
  {
    id: "lazy",
    label: "Inserts are lazy; extract-min consolidates",
    value: heapOps("i7 i3 i9 i5 i1 i8 i6 i4 x"),
  },
  {
    id: "cascade",
    label: "Decrease-key cuts, and a marked parent is cut too",
    value: heapOps("i70 i30 i90 i50 i10 i80 i60 i40 i20 x d70:5 d90:3 d50:1"),
  },
  { id: "drain", label: "Extract everything", value: heapOps("i4 i8 i2 i6 i1 i9 x x x x x x") },
]);

/** Fibonacci numbers F(0) = 0, F(1) = 1, … */
const fib = (k: number) => {
  let [a, b] = [0, 1];
  for (let i = 0; i < k; i++) [a, b] = [b, a + b];
  return a;
};

/** Independent model of the same rules on nested objects. */
export function fibModel(ops: HeapOp[]): FShape[] {
  type N = { key: number; kids: N[]; parent: N | null; marked: boolean };
  let roots: N[] = [];
  let min: N | null = null;
  const all = new Map<number, N>();
  const cut = (x: N) => {
    const p = x.parent!;
    p.kids.splice(p.kids.indexOf(x), 1);
    x.parent = null;
    x.marked = false;
    roots.push(x);
  };
  for (const op of ops) {
    if (op.name === "insert") {
      if (all.has(op.value)) continue;
      const n: N = { key: op.value, kids: [], parent: null, marked: false };
      all.set(op.value, n);
      roots.push(n);
      if (!min || n.key < min.key) min = n;
    } else if (op.name === "extract") {
      if (!min) continue;
      const z = min;
      all.delete(z.key);
      for (const c of [...z.kids]) {
        c.parent = null;
        c.marked = false;
        roots.push(c);
      }
      z.kids = [];
      roots.splice(roots.indexOf(z), 1);
      const A: (N | undefined)[] = [];
      for (const w of [...roots]) {
        let x = w;
        let d = x.kids.length;
        while (A[d]) {
          let y = A[d]!;
          if (x.key > y.key) [x, y] = [y, x];
          x.kids.push(y);
          y.parent = x;
          y.marked = false;
          A[d] = undefined;
          d++;
        }
        A[d] = x;
      }
      roots = A.filter((n): n is N => !!n);
      min = roots.length ? roots.reduce((a, b) => (b.key < a.key ? b : a)) : null;
    } else if (op.name === "decrease") {
      const x = all.get(op.value);
      if (!x || op.to >= op.value || all.has(op.to)) continue;
      all.delete(op.value);
      all.set(op.to, x);
      x.key = op.to;
      let y = x.parent;
      if (y && x.key < y.key) {
        cut(x);
        while (y && y.parent) {
          if (!y.marked) {
            y.marked = true;
            break;
          }
          const z: N = y.parent;
          cut(y);
          y = z;
        }
      }
      if (x.key < min!.key) min = x;
    }
  }
  const shape = (n: N): FShape => {
    const tag = n === min ? "min" : n.marked ? "marked" : null;
    return { key: n.key, ...(tag ? { tag } : {}), children: n.kids.map(shape) };
  };
  return roots.map(shape);
}

/**
 * A Fibonacci heap (Fredman and Tarjan; operations as in Cormen et al.): a lazy forest of
 * heap-ordered trees with a pointer to the minimum root. Insert just adds a root, and
 * decrease-key cuts a node loose — O(1) amortised each. All the tidying waits for
 * extract-min, which links trees of equal degree until every degree is distinct. Marks
 * record a node that has lost one child; losing a second gets it cut too (a cascading
 * cut), which keeps every tree of degree d at least F(d + 2) nodes big.
 */
export const fibonacciHeap: AlgorithmModule<HeapOp[], FibOutput> = {
  id: "fibonacci-heap",
  version: 1,
  pseudocode: [
    "insert x: add x as a new root; update the min pointer",
    "extract-min: move the min root's children to the root list; remove it",
    "  consolidate: for each root, while another root has the same degree, link them",
    "    (the larger root becomes a child of the smaller); rebuild the root list; find the new min",
    "decrease k to v: set the key; if it is now smaller than its parent: cut it to the root list",
    "  cascading cut: an unmarked parent is marked; a marked parent is cut too, and so on upwards",
    "peek: the min root",
  ],
  input,

  run(ops, t) {
    const F = new TracedForest(t, "Fibonacci heap (min = minimum root; marked = has lost a child)");
    let min: FNode | null = null;
    let links = 0;
    let cuts = 0;
    const shown = new Map<string, string | null>();
    const tagOf = (n: FNode) => (n === min ? "min" : n.marked ? "marked" : null);
    const retag = (line: number) => {
      const walk = (ns: FNode[]) =>
        ns.forEach((n) => {
          const want = tagOf(n);
          if ((shown.get(n.id) ?? null) !== want) {
            F.T.annotate(n.id, want, { line });
            shown.set(n.id, want);
          }
          walk(n.kids);
        });
      walk(F.roots);
    };
    const cut = (x: FNode, line: number, note: string) => {
      x.marked = false;
      F.place(x, F.top, F.roots.length, { line, note });
      cuts++;
      t.tally("cuts");
    };
    const present = new Set<number>();
    const results: HeapResult[] = [];
    for (const op of ops) {
      if (op.name === "insert") {
        if (present.has(op.value)) {
          t.step({ line: 1, note: `${op.value} is already in the heap.` });
          results.push("present");
          continue;
        }
        present.add(op.value);
        const n = F.addRoot(op.value, F.roots.length, {
          line: 1,
          note: `Insert ${op.value} as a new root.`,
        });
        if (min) t.tally("comparisons");
        if (!min || n.key < min.key) min = n;
        retag(1);
        results.push("ok");
        continue;
      }
      if (op.name === "peek") {
        if (min) F.T.status(min.id, "current", { line: 7, note: `The minimum is ${min.key}.` });
        if (min) F.T.status(min.id, "unvisited", { line: 7 });
        else t.step({ line: 7, note: "The heap is empty." });
        results.push(min ? min.key : "empty");
        continue;
      }
      if (op.name === "decrease") {
        if (!present.has(op.value)) {
          t.step({ line: 5, note: `${op.value} is not in the heap.` });
          results.push("missing");
          continue;
        }
        if (op.to >= op.value || present.has(op.to)) {
          t.step({ line: 5, note: `${op.to} is not a valid new key for ${op.value}.` });
          results.push("invalid");
          continue;
        }
        present.delete(op.value);
        present.add(op.to);
        const x = F.find(op.value)!;
        F.setKey(x, op.to, { line: 5, note: `Decrease ${op.value} to ${op.to}.` });
        let y = F.isRoot(x) ? null : x.parent;
        if (y) t.tally("comparisons");
        if (y && x.key < y.key) {
          cut(x, 5, `${op.to} < its parent ${y.key}: cut it to the root list.`);
          while (y && !F.isRoot(y)) {
            if (!y.marked) {
              y.marked = true;
              retag(6);
              t.step({ line: 6, note: `${y.key} has lost its first child: mark it.` });
              break;
            }
            const z: FNode = y.parent!;
            cut(y, 6, `${y.key} was already marked and has lost a second child: cut it too.`);
            y = z;
          }
        }
        t.tally("comparisons");
        if (x.key < min!.key) min = x;
        retag(5);
        results.push("ok");
        continue;
      }
      if (!min) {
        t.step({ line: 2, note: "The heap is empty." });
        results.push("empty");
        continue;
      }
      const z = min;
      present.delete(z.key);
      for (const c of [...z.kids]) {
        c.marked = false;
        F.place(c, F.top, F.roots.length, { line: 2 });
      }
      min = null;
      F.removeRoot(z, { line: 2, note: `Extract ${z.key}; its children become roots.` });
      shown.delete(z.id);
      const A: (FNode | undefined)[] = [];
      for (const w of [...F.roots]) {
        let x = w;
        let d = x.kids.length;
        while (A[d]) {
          let y = A[d]!;
          t.tally("comparisons");
          if (x.key > y.key) [x, y] = [y, x];
          y.marked = false;
          F.place(y, x, x.kids.length, {
            line: 3,
            note: `Two roots of degree ${d}: ${y.key} goes under ${x.key}.`,
          });
          links++;
          t.tally("links");
          A[d] = undefined;
          d++;
        }
        A[d] = x;
      }
      const order = A.filter((n): n is FNode => !!n);
      order.forEach((r, i) => {
        if (F.roots[i] !== r) F.place(r, F.top, i, { line: 4 });
      });
      for (const r of F.roots) {
        if (min) t.tally("comparisons");
        if (!min || r.key < min.key) min = r;
      }
      retag(4);
      t.step({
        line: 4,
        note: min
          ? `Every root now has a different degree (${F.roots.map((r) => r.kids.length).join(", ")}); the new minimum is ${min.key}.`
          : "The heap is empty.",
      });
      results.push(z.key);
    }
    const forest = F.shape(tagOf);
    const output: FibOutput = { results, forest, links, cuts };
    t.finish(ops, output, {
      line: 7,
      note: `${forestKeys(forest).length} keys in ${forest.length} tree${forest.length === 1 ? "" : "s"}; ${links} links, ${cuts} cuts.`,
    });
    return output;
  },

  check(ops, out) {
    const want = heapModel(ops);
    const r = compareHeapResults(ops, out.results, want.results);
    if (r) return r;
    if (forestKeys(out.forest).join() !== want.keys.join())
      return `keys ${forestKeys(out.forest)}, expected ${want.keys}`;
    const e = heapOrder(out.forest);
    if (e) return e;
    // Roots are unmarked; exactly the minimum root is tagged min; degree d ⇒ size ≥ F(d + 2).
    const size = (s: FShape): number => 1 + s.children.reduce((a, c) => a + size(c), 0);
    const walk = (s: FShape): string | null => {
      if (size(s) < fib(s.children.length + 2))
        return `${s.key} has degree ${s.children.length} but only ${size(s)} nodes`;
      for (const c of s.children) {
        if (c.tag === "min") return "a non-root is tagged min";
        const e2 = walk(c);
        if (e2) return e2;
      }
      return null;
    };
    for (const s of out.forest) {
      if (s.tag === "marked") return `root ${s.key} is marked`;
      const e3 = walk(s);
      if (e3) return e3;
    }
    if (want.keys.length) {
      const mins = out.forest.filter((s) => s.tag === "min");
      if (mins.length !== 1 || mins[0]!.key !== want.keys[0]) return "the min pointer is wrong";
    }
    const model = fibModel(ops);
    return showForest(out.forest) === showForest(model)
      ? null
      : `heap ${showForest(out.forest)}, the rules give ${showForest(model)}`;
  },

  fidelity(state: TraceState, out) {
    const T = state.structures.T;
    if (T?.kind !== "tree") return "no tree";
    return showForest(forestFromState(T)) === showForest(out.forest)
      ? null
      : "the drawn heap differs from the result";
  },

  describeOutput: (o) =>
    `${o.results.filter((r) => r !== "ok").join(", ") || "no removals"}; ${o.forest.length} trees, ${o.links} links, ${o.cuts} cuts`,
};
