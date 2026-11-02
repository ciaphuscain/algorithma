import type { TreeStructure } from "@/engine/protocol";
import type { TraceState } from "@/engine/state";
import type { AlgorithmModule, InputSpec } from "../types";
import { clamp, parseNumberList, randomNumbers } from "../inputs";

export type SegmentOp =
  { kind: "sum"; l: number; r: number } | { kind: "set"; i: number; value: number };

export interface SegmentTreeInput {
  values: number[];
  ops: SegmentOp[];
}

export interface SegmentTreeOutput {
  sums: number[];
  final: number[];
}

const MAX_N = 16;

export function parseOps(
  text: string,
  n: number,
): { ok: true; value: SegmentOp[] } | { ok: false; errors: string[] } {
  const parts = text
    .split(/[,;\n]+/)
    .map((p) => p.trim().toLowerCase())
    .filter(Boolean);
  const errors: string[] = [];
  const ops: SegmentOp[] = [];
  for (const p of parts) {
    const m = /^(sum|set)\s+(-?\d+)\s+(-?\d+)$/.exec(p);
    if (!m) {
      errors.push(`"${p}" should look like "sum 2 5" or "set 3 10"`);
      continue;
    }
    const [a, b] = [Number(m[2]), Number(m[3])];
    if (m[1] === "sum") {
      if (a < 0 || b >= n || a > b) errors.push(`"${p}": need 0 ≤ l ≤ r ≤ ${n - 1}`);
      else ops.push({ kind: "sum", l: a, r: b });
    } else {
      if (a < 0 || a >= n) errors.push(`"${p}": index must be 0–${n - 1}`);
      else if (Math.abs(b) > 99) errors.push(`"${p}": value must be −99 to 99`);
      else ops.push({ kind: "set", i: a, value: b });
    }
  }
  if (ops.length > 6) errors.push(`${ops.length} operations; the limit is 6`);
  return errors.length ? { ok: false, errors: errors.slice(0, 5) } : { ok: true, value: ops };
}

const formatOp = (o: SegmentOp) =>
  o.kind === "sum" ? `sum ${o.l} ${o.r}` : `set ${o.i} ${o.value}`;

const segmentInput: InputSpec<SegmentTreeInput> = {
  fields: [
    { name: "values", label: "Array", placeholder: "e.g. 5, 8, 6, 3, 2, 7, 2, 6" },
    {
      name: "ops",
      label: "Operations",
      placeholder: "e.g. sum 2 5, set 3 10, sum 0 7",
      help: "“sum l r” adds A[l..r]; “set i x” changes A[i] to x. Indices start at 0.",
    },
  ],
  constraints: `1–${MAX_N} whole numbers from −99 to 99; up to 6 operations.`,
  parse(fields) {
    const v = parseNumberList(fields.values ?? "", {
      minLength: 1,
      maxLength: MAX_N,
      min: -99,
      max: 99,
    });
    if (!v.ok) return v;
    const ops = parseOps(fields.ops ?? "", v.value.length);
    if (!ops.ok) return ops;
    return { ok: true, value: { values: v.value, ops: ops.value } };
  },
  format: (v) => ({ values: v.values.join(", "), ops: v.ops.map(formatOp).join(", ") }),
  presets: [
    {
      id: "classic",
      label: "Eight elements",
      value: {
        values: [5, 8, 6, 3, 2, 7, 2, 6],
        ops: [
          { kind: "sum", l: 2, r: 5 },
          { kind: "set", i: 3, value: 10 },
          { kind: "sum", l: 0, r: 7 },
        ],
      },
    },
    {
      id: "odd",
      label: "Six elements",
      value: {
        values: [1, 3, 5, 7, 9, 11],
        ops: [
          { kind: "sum", l: 1, r: 3 },
          { kind: "sum", l: 0, r: 5 },
        ],
      },
    },
  ],
  random(rng, size) {
    const n = clamp(size ?? 8, 1, MAX_N);
    const values = randomNumbers(rng, n, 0, 20);
    const ops: SegmentOp[] = [];
    for (let k = 0; k < 3; k++) {
      if (rng.next() < 0.6) {
        const l = rng.int(0, n - 1);
        ops.push({ kind: "sum", l, r: rng.int(l, n - 1) });
      } else ops.push({ kind: "set", i: rng.int(0, n - 1), value: rng.int(0, 20) });
    }
    return { values, ops };
  },
};

export const segmentTree: AlgorithmModule<SegmentTreeInput, SegmentTreeOutput> = {
  id: "segment-tree",
  version: 1,
  pseudocode: [
    "procedure build(v, l, r)",
    "  if l = r: sum[v] ← A[l]; return",
    "  build(left, l, m); build(right, m + 1, r);  sum[v] ← sum[left] + sum[right]",
    "procedure query(v, l, r, ql, qr)",
    "  if [l, r] and [ql, qr] do not overlap: return 0",
    "  if [l, r] lies inside [ql, qr]: return sum[v]",
    "  return query(left, l, m, ql, qr) + query(right, m + 1, r, ql, qr)",
    "procedure update(v, l, r, i, x)",
    "  if l = r: sum[v] ← x; return",
    "  update the half containing i;  sum[v] ← sum[left] + sum[right]",
  ],
  input: segmentInput,

  run(input, t) {
    const A = t.array("A", input.values, { label: "A", display: "cells" });
    const T = t.tree("T", { binary: true, label: "Segment tree (node = sum of its range)" });
    const n = A.length;
    const range = new Map<string, [number, number]>();

    const build = (
      parent: string | null,
      slot: 0 | 1 | undefined,
      l: number,
      r: number,
    ): string => {
      const id = T.add(0, parent, slot, {
        line: 1,
        vars: { l, r },
        note: `Node for A[${l}..${r}].`,
      });
      range.set(id, [l, r]);
      T.annotate(id, `[${l},${r}]`, { line: 1 });
      if (l === r) {
        T.set(id, A.num(l), { line: 2, note: `Leaf: sum = A[${l}] = ${A.get(l)}.` });
        return id;
      }
      const m = Math.floor((l + r) / 2);
      const left = build(id, 0, l, m);
      const right = build(id, 1, m + 1, r);
      T.set(id, T.num(left) + T.num(right), {
        line: 3,
        vars: { l, r },
        note: `sum[${l}..${r}] = ${T.num(left)} + ${T.num(right)} = ${T.num(left) + T.num(right)}.`,
      });
      return id;
    };
    t.step({
      line: 1,
      note: `Build a tree whose root covers A[0..${n - 1}]; each node stores the sum of its range.`,
    });
    const root = build(null, undefined, 0, n - 1);

    const touched = new Set<string>();
    const reset = (line: number) => {
      for (const id of touched) T.status(id, "unvisited", { line });
      touched.clear();
    };

    const query = (id: string, ql: number, qr: number): number => {
      const [l, r] = range.get(id)!;
      touched.add(id);
      t.tally("nodes visited");
      if (r < ql || l > qr) {
        T.status(id, "unreachable", {
          line: 5,
          note: `[${l},${r}] is outside [${ql},${qr}]: contributes 0.`,
        });
        return 0;
      }
      if (ql <= l && r <= qr) {
        T.status(id, "path", {
          line: 6,
          note: `[${l},${r}] lies inside [${ql},${qr}]: use its sum ${T.value(id)} without going deeper.`,
        });
        return T.num(id);
      }
      T.status(id, "frontier", {
        line: 7,
        note: `[${l},${r}] partly overlaps [${ql},${qr}]: ask both children.`,
      });
      return query(T.child(id, 0)!, ql, qr) + query(T.child(id, 1)!, ql, qr);
    };

    const update = (id: string, i: number, x: number): void => {
      const [l, r] = range.get(id)!;
      touched.add(id);
      t.tally("nodes visited");
      if (l === r) {
        A.write(i, x, { line: 9 });
        T.set(id, x, { line: 9, note: `Leaf for A[${i}] becomes ${x}.` });
        T.status(id, "path", { line: 9 });
        return;
      }
      const m = Math.floor((l + r) / 2);
      T.status(id, "frontier", {
        line: 10,
        note: `Index ${i} is in the ${i <= m ? "left" : "right"} half of [${l},${r}].`,
      });
      update(T.child(id, i <= m ? 0 : 1)!, i, x);
      const sum = T.num(T.child(id, 0)!) + T.num(T.child(id, 1)!);
      T.set(id, sum, { line: 10, note: `Recompute sum[${l}..${r}] = ${sum}.` });
    };

    const sums: number[] = [];
    for (const op of input.ops) {
      reset(4);
      if (op.kind === "sum") {
        t.step({
          line: 4,
          vars: { op: formatOp(op) },
          note: `Query the sum of A[${op.l}..${op.r}].`,
        });
        const s = query(root, op.l, op.r);
        sums.push(s);
        t.step({ line: 7, vars: { result: s }, note: `sum(A[${op.l}..${op.r}]) = ${s}.` });
      } else {
        t.step({
          line: 8,
          vars: { op: formatOp(op), result: null },
          note: `Set A[${op.i}] = ${op.value}.`,
        });
        update(root, op.i, op.value);
      }
    }
    reset(10);
    const output: SegmentTreeOutput = { sums, final: A.toArray() as number[] };
    t.finish(input, output, {
      vars: { op: null },
      note: sums.length ? `Query results: ${sums.join(", ")}.` : "Done.",
    });
    return output;
  },

  check(input, out) {
    const a = [...input.values];
    const sums: number[] = [];
    for (const op of input.ops) {
      if (op.kind === "sum") sums.push(a.slice(op.l, op.r + 1).reduce((x, y) => x + y, 0));
      else a[op.i] = op.value;
    }
    if (JSON.stringify(sums) !== JSON.stringify(out.sums))
      return `sums ${out.sums}, expected ${sums}`;
    return JSON.stringify(a) === JSON.stringify(out.final) ? null : "final array differs";
  },

  fidelity(state: TraceState, out) {
    const T = state.structures.T as TreeStructure | undefined;
    if (!T || T.kind !== "tree" || T.root === null) return "no tree";
    // Every internal node equals the sum of its children; the root equals the array total.
    for (const n of Object.values(T.nodes)) {
      const [l, r] = n.children;
      if (
        l &&
        r &&
        (n.value as number) !== (T.nodes[l]!.value as number) + (T.nodes[r]!.value as number)
      )
        return "a node is not the sum of its children";
    }
    const total = out.final.reduce((x, y) => x + y, 0);
    return T.nodes[T.root]!.value === total
      ? null
      : `root holds ${T.nodes[T.root]!.value}, array total is ${total}`;
  },

  describeOutput: (o) => `Sums: ${o.sums.join(", ") || "—"}; final A = [${o.final.join(", ")}]`,
};
