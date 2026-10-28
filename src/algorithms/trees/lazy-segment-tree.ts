import type { TreeStructure } from "@/engine/protocol";
import type { TraceState } from "@/engine/state";
import type { AlgorithmModule, InputSpec } from "../types";
import { clamp, parseNumberList, randomNumbers } from "../inputs";

export type LazyOp =
  { kind: "add"; l: number; r: number; d: number } | { kind: "sum"; l: number; r: number };

export interface LazySegmentInput {
  values: number[];
  ops: LazyOp[];
}

export interface LazySegmentOutput {
  sums: number[];
  /** The root's sum after all operations: the total of the updated array. */
  total: number;
}

const MAX_N = 16;
const MAX_OPS = 6;

export function parseLazyOps(
  text: string,
  n: number,
): { ok: true; value: LazyOp[] } | { ok: false; errors: string[] } {
  const parts = text
    .split(/[,;\n]+/)
    .map((p) => p.trim().toLowerCase())
    .filter(Boolean);
  const errors: string[] = [];
  const ops: LazyOp[] = [];
  for (const p of parts) {
    const m = /^(add|sum)\s+(\d+)\s+(\d+)(?:\s+([+-]?\d+))?$/.exec(p);
    if (!m || (m[1] === "add") !== (m[4] !== undefined)) {
      errors.push(`"${p}" should look like "add 2 5 3" or "sum 0 7"`);
      continue;
    }
    const [l, r] = [Number(m[2]), Number(m[3])];
    if (l > r || r >= n) errors.push(`"${p}": need 0 ≤ l ≤ r ≤ ${n - 1}`);
    else if (m[1] === "sum") ops.push({ kind: "sum", l, r });
    else if (Math.abs(Number(m[4])) > 99) errors.push(`"${p}": the amount must be −99 to 99`);
    else ops.push({ kind: "add", l, r, d: Number(m[4]) });
  }
  if (ops.length > MAX_OPS) errors.push(`${ops.length} operations; the limit is ${MAX_OPS}`);
  return errors.length ? { ok: false, errors: errors.slice(0, 5) } : { ok: true, value: ops };
}

const formatOp = (o: LazyOp) =>
  o.kind === "sum" ? `sum ${o.l} ${o.r}` : `add ${o.l} ${o.r} ${o.d}`;

const input: InputSpec<LazySegmentInput> = {
  fields: [
    { name: "values", label: "Array", placeholder: "e.g. 5, 8, 6, 3, 2, 7, 2, 6" },
    {
      name: "ops",
      label: "Operations",
      placeholder: "e.g. add 2 6 3, sum 0 3",
      help: "“add l r d” adds d to A[l..r]; “sum l r” asks for A[l] + … + A[r]. Indices start at 0.",
    },
  ],
  constraints: `1–${MAX_N} whole numbers from −99 to 99; up to ${MAX_OPS} operations.`,
  parse(fields) {
    const v = parseNumberList(fields.values ?? "", {
      minLength: 1,
      maxLength: MAX_N,
      min: -99,
      max: 99,
    });
    if (!v.ok) return v;
    const ops = parseLazyOps(fields.ops ?? "", v.value.length);
    if (!ops.ok) return ops;
    return { ok: true, value: { values: v.value, ops: ops.value } };
  },
  format: (v) => ({ values: v.values.join(", "), ops: v.ops.map(formatOp).join(", ") }),
  presets: [
    {
      id: "classic",
      label: "Range add, then sums",
      value: {
        values: [5, 8, 6, 3, 2, 7, 2, 6],
        ops: [
          { kind: "add", l: 2, r: 6, d: 3 },
          { kind: "sum", l: 0, r: 3 },
          { kind: "add", l: 0, r: 7, d: -1 },
          { kind: "sum", l: 4, r: 5 },
        ],
      },
    },
    {
      id: "whole",
      label: "Updating everything costs one node",
      value: {
        values: [1, 2, 3, 4, 5, 6],
        ops: [
          { kind: "add", l: 0, r: 5, d: 10 },
          { kind: "sum", l: 2, r: 2 },
        ],
      },
    },
  ],
  random(rng, size) {
    const n = clamp(size ?? 8, 1, MAX_N);
    const ops: LazyOp[] = [];
    for (let k = 0; k < 4; k++) {
      const l = rng.int(0, n - 1);
      const r = rng.int(l, n - 1);
      ops.push(rng.next() < 0.5 ? { kind: "add", l, r, d: rng.int(-5, 9) } : { kind: "sum", l, r });
    }
    return { values: randomNumbers(rng, n, 0, 20), ops };
  },
};

/**
 * Segment tree with lazy propagation: range add and range sum, both O(log n). An
 * update that covers a node's whole range changes that node's sum and leaves a
 * pending "+d" tag instead of visiting its subtree; the tag is pushed one level down
 * only when a later operation needs to go below that node.
 */
export const lazySegmentTree: AlgorithmModule<LazySegmentInput, LazySegmentOutput> = {
  id: "lazy-segment-tree",
  version: 1,
  pseudocode: [
    "build: each node stores sum[v] for its range [l, r] and a pending tag lazy[v] ← 0",
    "procedure push(v)   // hand the pending tag to the children",
    "  for each child c: sum[c] ← sum[c] + lazy[v] · len(c);  lazy[c] ← lazy[c] + lazy[v]",
    "  lazy[v] ← 0",
    "procedure add(v, ql, qr, d)",
    "  if [l, r] and [ql, qr] do not overlap: return",
    "  if [l, r] lies inside [ql, qr]: sum[v] ← sum[v] + d · len(v);  lazy[v] ← lazy[v] + d;  return",
    "  push(v);  add to both children;  sum[v] ← sum[left] + sum[right]",
    "procedure query(v, ql, qr)",
    "  if no overlap: return 0;  if inside: return sum[v]",
    "  push(v);  return query(left) + query(right)",
  ],
  input,

  run(inp, t) {
    const A = t.array("A", inp.values, {
      label: "A (as built; updates live in the tree)",
      display: "cells",
    });
    const T = t.tree("T", { binary: true, label: "Segment tree: sum, and a pending +d tag" });
    const n = A.length;
    const span = new Map<string, [number, number]>();
    const lazy = new Map<string, number>();
    const len = (id: string) => span.get(id)![1] - span.get(id)![0] + 1;
    const label = (id: string, line: number) => {
      const [l, r] = span.get(id)!;
      const d = lazy.get(id) ?? 0;
      T.annotate(id, d === 0 ? `[${l},${r}]` : `[${l},${r}] ${d > 0 ? "+" : ""}${d}`, { line });
    };
    const isLeaf = (id: string) => T.child(id, 0) === null;

    const build = (
      parent: string | null,
      slot: 0 | 1 | undefined,
      l: number,
      r: number,
    ): string => {
      const id = T.add(0, parent, slot, { line: 1, vars: { l, r } });
      span.set(id, [l, r]);
      label(id, 1);
      if (l === r) {
        T.set(id, A.read(l, { line: 1 }), { line: 1 });
        return id;
      }
      const m = Math.floor((l + r) / 2);
      const a = build(id, 0, l, m);
      const b = build(id, 1, m + 1, r);
      T.set(id, T.num(a) + T.num(b), { line: 1 });
      return id;
    };
    t.step({ line: 1, note: "Build the tree: each node holds the sum of its range; no tags yet." });
    const root = build(null, undefined, 0, n - 1);

    const push = (id: string) => {
      const d = lazy.get(id) ?? 0;
      if (d === 0) return;
      t.tally("pushes");
      for (const slot of [0, 1] as const) {
        const c = T.child(id, slot)!;
        T.set(c, T.num(c) + d * len(c), { line: 3 });
        if (!isLeaf(c)) lazy.set(c, (lazy.get(c) ?? 0) + d);
        label(c, 3);
      }
      lazy.set(id, 0);
      label(id, 4);
      t.step({ line: 4, note: `Push the tag ${d > 0 ? "+" : ""}${d} down to both children.` });
    };

    const touched = new Set<string>();
    const reset = () => {
      for (const id of touched) T.status(id, "unvisited", { line: 5 });
      touched.clear();
    };
    const visit = (id: string) => {
      touched.add(id);
      t.tally("nodes visited");
    };

    const add = (id: string, ql: number, qr: number, d: number): void => {
      const [l, r] = span.get(id)!;
      visit(id);
      if (r < ql || l > qr) {
        T.status(id, "unreachable", { line: 6 });
        return;
      }
      if (ql <= l && r <= qr) {
        T.set(id, T.num(id) + d * len(id), { line: 7 });
        if (!isLeaf(id)) lazy.set(id, (lazy.get(id) ?? 0) + d);
        label(id, 7);
        T.status(id, "path", {
          line: 7,
          note: isLeaf(id)
            ? `Leaf [${l},${r}] gets ${d}.`
            : `[${l},${r}] lies inside: add ${d} × ${len(id)} to its sum and leave a tag; its subtree is not visited.`,
        });
        return;
      }
      T.status(id, "frontier", { line: 8, note: `[${l},${r}] partly overlaps: go down.` });
      push(id);
      add(T.child(id, 0)!, ql, qr, d);
      add(T.child(id, 1)!, ql, qr, d);
      const s = T.num(T.child(id, 0)!) + T.num(T.child(id, 1)!);
      T.set(id, s, { line: 8, note: `Recompute sum[${l}..${r}] = ${s}.` });
    };

    const query = (id: string, ql: number, qr: number): number => {
      const [l, r] = span.get(id)!;
      visit(id);
      if (r < ql || l > qr) {
        T.status(id, "unreachable", { line: 10 });
        return 0;
      }
      if (ql <= l && r <= qr) {
        T.status(id, "path", {
          line: 10,
          note: `[${l},${r}] lies inside: its sum ${T.value(id)} is already up to date.`,
        });
        return T.num(id);
      }
      T.status(id, "frontier", { line: 11, note: `[${l},${r}] partly overlaps: go down.` });
      push(id);
      return query(T.child(id, 0)!, ql, qr) + query(T.child(id, 1)!, ql, qr);
    };

    const sums: number[] = [];
    for (const op of inp.ops) {
      reset();
      if (op.kind === "add") {
        t.step({
          line: 5,
          vars: { op: formatOp(op), result: null },
          note: `Add ${op.d} to A[${op.l}..${op.r}].`,
        });
        add(root, op.l, op.r, op.d);
      } else {
        t.step({
          line: 9,
          vars: { op: formatOp(op), result: null },
          note: `Sum of A[${op.l}..${op.r}].`,
        });
        const s = query(root, op.l, op.r);
        sums.push(s);
        t.step({ line: 11, vars: { result: s }, note: `sum(A[${op.l}..${op.r}]) = ${s}.` });
      }
    }
    reset();
    const output: LazySegmentOutput = { sums, total: T.num(root) };
    t.finish(inp, output, {
      vars: { op: null },
      note: sums.length ? `Query results: ${sums.join(", ")}.` : "Done.",
    });
    return output;
  },

  check(inp, out) {
    const a = [...inp.values];
    const sums: number[] = [];
    for (const op of inp.ops) {
      if (op.kind === "sum") sums.push(a.slice(op.l, op.r + 1).reduce((x, y) => x + y, 0));
      else for (let i = op.l; i <= op.r; i++) a[i]! += op.d;
    }
    if (JSON.stringify(sums) !== JSON.stringify(out.sums))
      return `sums ${out.sums}, expected ${sums}`;
    const total = a.reduce((x, y) => x + y, 0);
    return out.total === total ? null : `total ${out.total}, expected ${total}`;
  },

  fidelity(state: TraceState, out) {
    const T = state.structures.T as TreeStructure | undefined;
    if (!T || T.kind !== "tree" || T.root === null) return "no tree";
    // sum[v] = sum[left] + sum[right] + lazy[v] · len(v), reading the tag and range from the label.
    for (const [id, node] of Object.entries(T.nodes)) {
      const [a, b] = node.children;
      if (!a || !b) continue;
      const m = /^\[(\d+),(\d+)\](?: \+?(-?\d+))?$/.exec(T.annotations[id] ?? "");
      if (!m) return `node ${id} has no range label`;
      const tag = Number(m[3] ?? 0) * (Number(m[2]) - Number(m[1]) + 1);
      if (node.value !== (T.nodes[a]!.value as number) + (T.nodes[b]!.value as number) + tag)
        return `node ${m[0]} is not its children's sum plus its tag`;
    }
    return T.nodes[T.root]!.value === out.total ? null : "root differs from the reported total";
  },

  describeOutput: (o) => `Sums: ${o.sums.join(", ") || "—"}; array total ${o.total}`,
};
