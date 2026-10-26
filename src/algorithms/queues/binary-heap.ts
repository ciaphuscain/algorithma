import type { TraceState } from "@/engine/state";
import type { AlgorithmModule, InputSpec } from "../types";
import {
  compareResults,
  parseOps,
  randomOps,
  showOps,
  type Op,
  type OpResult,
  type OpSpec,
} from "../ops";

export type HeapKind = "min" | "max";

export interface HeapInput {
  kind: HeapKind;
  ops: Op[];
}

export interface HeapOutput {
  results: OpResult[];
  /** The heap array at the end. */
  heap: number[];
  comparisons: number;
}

const MAX_OPS = 16;

const SPEC: OpSpec = {
  insert: { value: true, aliases: ["push", "add", "offer"] },
  extract: { value: false, aliases: ["pop", "poll", "extractmin", "extractmax"] },
  peek: { value: false, aliases: ["top", "min", "max"] },
};

const input: InputSpec<HeapInput> = {
  fields: [
    { name: "kind", label: "Min-heap or max-heap", placeholder: "min" },
    {
      name: "ops",
      label: "Operations",
      placeholder: "e.g. insert 5, insert 3, insert 8, extract, peek",
      multiline: true,
    },
  ],
  constraints: `kind is "min" or "max"; 1–${MAX_OPS} operations: insert x (0–99), extract, peek.`,
  parse(f) {
    const kind = ((f.kind ?? "").trim().toLowerCase() || "min") as HeapKind;
    if (kind !== "min" && kind !== "max")
      return { ok: false, errors: ['Kind must be "min" or "max"'] };
    const ops = parseOps(f.ops ?? "", SPEC, MAX_OPS);
    if (typeof ops[0] === "string") return { ok: false, errors: ops as string[] };
    return { ok: true, value: { kind, ops: ops as Op[] } };
  },
  format: (v) => ({ kind: v.kind, ops: showOps(v.ops) }),
  presets: [
    {
      id: "classic",
      label: "Min-heap: inserts, then extracts",
      value: {
        kind: "min",
        ops: [
          { name: "insert", value: 5 },
          { name: "insert", value: 3 },
          { name: "insert", value: 8 },
          { name: "insert", value: 1 },
          { name: "insert", value: 9 },
          { name: "insert", value: 2 },
          { name: "extract" },
          { name: "extract" },
          { name: "peek" },
          { name: "extract" },
        ],
      },
    },
    {
      id: "max",
      label: "Max-heap as a priority queue",
      value: {
        kind: "max",
        ops: [
          { name: "insert", value: 20 },
          { name: "insert", value: 50 },
          { name: "insert", value: 10 },
          { name: "extract" },
          { name: "insert", value: 40 },
          { name: "insert", value: 30 },
          { name: "extract" },
          { name: "extract" },
        ],
      },
    },
  ],
  random(rng, size) {
    const n = Math.min(MAX_OPS, Math.max(3, size ?? 12));
    return {
      kind: rng.int(0, 1) ? "min" : "max",
      ops: randomOps(rng, n, ["insert"], ["extract", "extract", "peek"]),
    };
  },
};

const parent = (i: number) => Math.floor((i - 1) / 2);

/**
 * A priority queue as a binary heap stored in an array: the children of slot i are
 * 2i + 1 and 2i + 2, and every parent is at most (min-heap) or at least (max-heap) its
 * children, so the root is the minimum (maximum). Insert appends and sifts the new item
 * up; extract moves the last item to the root and sifts it down. Both follow one path
 * of the complete tree: O(log n).
 */
export const binaryHeap: AlgorithmModule<HeapInput, HeapOutput> = {
  id: "binary-heap",
  version: 1,
  pseudocode: [
    "insert(x): A[n] ← x;  i ← n;  n ← n + 1",
    "  while i > 0 and A[i] is better than A[parent(i)]: swap them;  i ← parent(i)",
    "extract(): top ← A[0];  n ← n − 1;  A[0] ← A[n]",
    "  i ← 0; while i has a child: c ← the better child of i",
    "    if A[c] is better than A[i]: swap them; i ← c   else stop",
    "peek(): A[0]",
  ],
  input,

  run(input, t) {
    const { kind, ops } = input;
    const capacity = Math.max(1, ops.filter((o) => o.name === "insert").length);
    const word = kind === "min" ? "smaller" : "larger";
    const H = t.array("H", Array<null>(capacity).fill(null), {
      label: `${kind === "min" ? "Min" : "Max"}-heap array`,
      display: "heap",
    });
    const a: number[] = [];
    let comparisons = 0;
    // True when a's value at i should sit above a's value at j.
    const better = (i: number, j: number, line: number) => {
      comparisons++;
      const c = H.compare(i, j, { line });
      return kind === "min" ? c < 0 : c > 0;
    };
    const swap = (i: number, j: number, line: number, note?: string) => {
      [a[i], a[j]] = [a[j]!, a[i]!];
      H.swap(i, j, { line, note });
    };
    const results: OpResult[] = [];
    for (const op of ops) {
      if (op.name === "insert") {
        const x = op.value!;
        let i = a.length;
        a.push(x);
        H.write(i, x, { line: 1, vars: { x }, note: `Append ${x} at slot ${i}.` });
        H.pointer("i", i, { line: 1 });
        while (i > 0) {
          const p = parent(i);
          if (!better(i, p, 2)) {
            t.step({ line: 2, note: `${a[i]} is not ${word} than its parent ${a[p]}: stop.` });
            break;
          }
          swap(i, p, 2, `${a[i]} is ${word} than its parent ${a[p]}: swap them.`);
          i = p;
          H.pointer("i", i, { line: 2 });
        }
        H.pointer("i", null, { line: 2 });
        results.push("ok");
        continue;
      }
      if (a.length === 0) {
        t.step({ line: op.name === "peek" ? 6 : 3, note: `${op.name}: the heap is empty.` });
        results.push("empty");
        continue;
      }
      if (op.name === "peek") {
        H.read(0, { line: 6, note: `The ${kind} is ${a[0]}, at the root.` });
        results.push(a[0]!);
        continue;
      }
      const top = a[0]!;
      H.read(0, { line: 3, vars: { top } });
      const last = a.pop()!;
      const n = a.length;
      if (n > 0) {
        a[0] = last;
        H.write(0, last, {
          line: 3,
          note: `Take ${top} from the root; move the last item, ${last}, there.`,
        });
      }
      H.write(n, null, {
        line: 3,
        note: n === 0 ? `Take ${top}; the heap is now empty.` : undefined,
      });
      let i = 0;
      H.pointer("i", n > 0 ? 0 : null, { line: 4 });
      while (2 * i + 1 < n) {
        let c = 2 * i + 1;
        if (c + 1 < n && better(c + 1, c, 4)) c = c + 1;
        if (!better(c, i, 5)) {
          t.step({ line: 5, note: `${a[i]} is no worse than its children: stop.` });
          break;
        }
        swap(i, c, 5, `Child ${a[i]} is ${word} than ${a[c]}: swap them.`);
        i = c;
        H.pointer("i", i, { line: 5 });
      }
      H.pointer("i", null, { line: 5, vars: { top: null } });
      results.push(top);
    }
    const output: HeapOutput = { results, heap: [...a], comparisons };
    t.finish(input, output, {
      line: 6,
      vars: { x: null },
      note: a.length
        ? `${a.length} item${a.length === 1 ? "" : "s"} left; the ${kind} is ${a[0]}.`
        : "The heap is empty.",
    });
    return output;
  },

  check(input, out) {
    // Independent model: a sorted list (no heap), and the O(log n) bound per operation.
    const items: number[] = [];
    let bound = 0;
    const want = input.ops.map((op): OpResult => {
      if (op.name === "insert") {
        items.push(op.value!);
        bound += Math.floor(Math.log2(items.length)); // at most one comparison per level
        return "ok";
      }
      if (items.length === 0) return "empty";
      items.sort((x, y) => (input.kind === "min" ? x - y : y - x));
      if (op.name === "peek") return items[0]!;
      const left = items.length - 1;
      if (left > 0) bound += 2 * Math.floor(Math.log2(left)); // two per level on the way down
      return items.shift()!;
    });
    const r = compareResults(input.ops, out.results, want);
    if (r) return r;
    const sorted = (xs: number[]) => [...xs].sort((x, y) => x - y).join();
    if (sorted(out.heap) !== sorted(items)) return `the heap holds ${out.heap}, expected ${items}`;
    for (let i = 1; i < out.heap.length; i++) {
      const p = out.heap[parent(i)]!;
      const c = out.heap[i]!;
      if (input.kind === "min" ? p > c : p < c) return `the heap property fails at slot ${i}`;
    }
    if (out.comparisons > bound) return `${out.comparisons} comparisons, above the bound ${bound}`;
    return null;
  },

  fidelity(state: TraceState, out) {
    const H = state.structures.H;
    if (H?.kind !== "array") return "no heap array";
    const shown = H.values.filter((v) => v !== null);
    if (shown.join() !== out.heap.join()) return `the array holds ${shown}`;
    return H.values.slice(0, out.heap.length).every((v) => v !== null) ? null : "a gap in the heap";
  },

  describeOutput: (o) =>
    `${o.results.filter((r) => r !== "ok").join(", ") || "no removals"}; heap: ${o.heap.join(" ") || "empty"}`,
};
