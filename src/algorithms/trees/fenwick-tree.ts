import type { Scalar } from "@/engine/protocol";
import type { TraceState } from "@/engine/state";
import type { AlgorithmModule, InputSpec } from "../types";
import { clamp, parseNumberList, randomNumbers } from "../inputs";

export type FenwickOp =
  { kind: "add"; i: number; x: number } | { kind: "sum"; l: number; r: number };

export interface FenwickInput {
  values: number[];
  ops: FenwickOp[];
}

export interface FenwickOutput {
  /** One answer per sum operation, in order. */
  sums: number[];
  /** A[1..n] after every update. */
  final: number[];
}

const MAX_N = 16;
const MAX_OPS = 6;
const lowbit = (i: number) => i & -i;

export function parseFenwickOps(
  text: string,
  n: number,
): { ok: true; value: FenwickOp[] } | { ok: false; errors: string[] } {
  const parts = text
    .split(/[,;\n]+/)
    .map((p) => p.trim().toLowerCase())
    .filter(Boolean);
  const errors: string[] = [];
  const ops: FenwickOp[] = [];
  for (const p of parts) {
    const add = /^add\s+(\d+)\s+(-?\d+)$/.exec(p);
    const sum = /^sum\s+(\d+)(?:\s+(\d+))?$/.exec(p);
    if (add) {
      const [i, x] = [Number(add[1]), Number(add[2])];
      if (i < 1 || i > n) errors.push(`"${p}": positions run from 1 to ${n}`);
      else if (Math.abs(x) > 99) errors.push(`"${p}": the amount must be −99 to 99`);
      else ops.push({ kind: "add", i, x });
    } else if (sum) {
      const r = Number(sum[2] ?? sum[1]);
      const l = sum[2] === undefined ? 1 : Number(sum[1]);
      if (l < 1 || r > n || l > r) errors.push(`"${p}": need 1 ≤ l ≤ r ≤ ${n}`);
      else ops.push({ kind: "sum", l, r });
    } else {
      errors.push(`"${p}" should look like "sum 5", "sum 2 5" or "add 3 10"`);
    }
  }
  if (ops.length > MAX_OPS) errors.push(`${ops.length} operations; the limit is ${MAX_OPS}`);
  return errors.length ? { ok: false, errors: errors.slice(0, 5) } : { ok: true, value: ops };
}

const formatOp = (o: FenwickOp) =>
  o.kind === "add" ? `add ${o.i} ${o.x}` : o.l === 1 ? `sum ${o.r}` : `sum ${o.l} ${o.r}`;

const fenwickInput: InputSpec<FenwickInput> = {
  fields: [
    { name: "values", label: "Array A[1..n]", placeholder: "e.g. 5, 2, 9, -3, 5, 20, 10, -7" },
    {
      name: "ops",
      label: "Operations",
      placeholder: "e.g. sum 6, add 3 4, sum 2 7",
      help: "“sum r” adds A[1..r]; “sum l r” adds A[l..r]; “add i x” adds x to A[i]. Positions start at 1.",
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
    const ops = parseFenwickOps(fields.ops ?? "", v.value.length);
    if (!ops.ok) return ops;
    return { ok: true, value: { values: v.value, ops: ops.value } };
  },
  format: (v) => ({ values: v.values.join(", "), ops: v.ops.map(formatOp).join(", ") }),
  presets: [
    {
      id: "classic",
      label: "Eight elements",
      value: {
        values: [5, 2, 9, -3, 5, 20, 10, -7],
        ops: [
          { kind: "sum", l: 1, r: 6 },
          { kind: "add", i: 3, x: 4 },
          { kind: "sum", l: 2, r: 7 },
        ],
      },
    },
    {
      id: "powers",
      label: "All ones (see the ranges)",
      value: {
        values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ops: [
          { kind: "sum", l: 1, r: 13 },
          { kind: "add", i: 1, x: 1 },
          { kind: "sum", l: 1, r: 16 },
        ],
      },
    },
  ],
  random(rng, size) {
    const n = clamp(size ?? 8, 1, MAX_N);
    const values = randomNumbers(rng, n, -9, 20);
    const ops: FenwickOp[] = [];
    for (let k = 0; k < 4; k++) {
      if (rng.next() < 0.5) ops.push({ kind: "add", i: rng.int(1, n), x: rng.int(-9, 9) });
      else {
        const l = rng.int(1, n);
        ops.push({ kind: "sum", l, r: rng.int(l, n) });
      }
    }
    return { values, ops };
  },
};

/**
 * Fenwick tree (binary indexed tree), 1-based: T[i] holds the sum of A over the
 * lowbit(i) positions ending at i. Built in O(n) by pushing each T[i] into its parent
 * i + lowbit(i); updates climb by adding lowbit, prefix sums descend by removing it.
 */
export const fenwickTree: AlgorithmModule<FenwickInput, FenwickOutput> = {
  id: "fenwick-tree",
  version: 1,
  pseudocode: [
    "build: T[i] ← A[i] for i = 1..n",
    "  for i ← 1 to n: j ← i + lowbit(i);  if j ≤ n: T[j] ← T[j] + T[i]",
    "procedure add(i, x)   // A[i] ← A[i] + x",
    "  while i ≤ n: T[i] ← T[i] + x;  i ← i + lowbit(i)",
    "procedure prefix(i)   // A[1] + … + A[i]",
    "  s ← 0;  while i > 0: s ← s + T[i];  i ← i − lowbit(i)",
    "  return s",
    "range-sum(l, r) = prefix(r) − prefix(l − 1)",
  ],
  input: fenwickInput,

  run(input, t) {
    const n = input.values.length;
    const a: Scalar[] = [null, ...input.values];
    const A = t.array("A", a, { label: "A (position 0 unused)", display: "cells" });
    const T = t.array(
      "T",
      a.map((v, i) => (i === 0 ? null : 0)),
      { label: "T: T[i] covers A[i − lowbit(i) + 1 .. i]", display: "cells" },
    );
    const tree = a.map(() => 0);
    const values = [0, ...input.values];

    for (let i = 1; i <= n; i++) {
      tree[i] = values[i]!;
      T.write(i, tree[i]!, { line: 1 });
    }
    t.step({ line: 1, note: "Copy A into T; each T[i] so far covers only position i." });
    for (let i = 1; i <= n; i++) {
      const j = i + lowbit(i);
      T.pointer("i", i, { line: 2, vars: { i, j } });
      if (j > n) continue;
      tree[j] = tree[j]! + tree[i]!;
      T.write(j, tree[j]!, {
        line: 2,
        note: `lowbit(${i}) = ${lowbit(i)}: T[${i}] is part of T[${j}]'s range, so add it there.`,
      });
    }
    T.pointer("i", null, { line: 2, vars: { i: null, j: null } });

    const prefix = (r: number, label: string): number => {
      let s = 0;
      for (let i = r; i > 0; i -= lowbit(i)) {
        T.pointer("i", i, { line: 6, vars: { i, s } });
        T.read(i, {
          line: 6,
          note: `${label}: add T[${i}] = ${tree[i]} (covers A[${i - lowbit(i) + 1}..${i}]), then i ← ${i} − ${lowbit(i)} = ${i - lowbit(i)}.`,
        });
        s += tree[i]!;
        t.tally("nodes visited");
      }
      T.pointer("i", null, { line: 7, vars: { i: null, s } });
      return s;
    };

    const sums: number[] = [];
    for (const op of input.ops) {
      if (op.kind === "add") {
        values[op.i] = values[op.i]! + op.x;
        A.write(op.i, values[op.i]!, {
          line: 3,
          vars: { op: formatOp(op), s: null },
          note: `add(${op.i}, ${op.x}): A[${op.i}] becomes ${values[op.i]}.`,
        });
        for (let i = op.i; i <= n; i += lowbit(i)) {
          tree[i] = tree[i]! + op.x;
          T.pointer("i", i, { line: 4, vars: { i } });
          T.write(i, tree[i]!, {
            line: 4,
            note: `T[${i}] covers position ${op.i}: add ${op.x}. Next i = ${i} + ${lowbit(i)} = ${i + lowbit(i)}.`,
          });
          t.tally("nodes visited");
        }
        T.pointer("i", null, { line: 4, vars: { i: null } });
        continue;
      }
      t.step({ line: 8, vars: { op: formatOp(op), s: null }, note: `Sum of A[${op.l}..${op.r}].` });
      const right = prefix(op.r, `prefix(${op.r})`);
      const left = op.l > 1 ? prefix(op.l - 1, `prefix(${op.l - 1})`) : 0;
      sums.push(right - left);
      t.step({
        line: 8,
        vars: { s: right - left },
        note:
          op.l > 1
            ? `prefix(${op.r}) − prefix(${op.l - 1}) = ${right} − ${left} = ${right - left}.`
            : `A[1..${op.r}] sums to ${right}.`,
      });
    }

    const output: FenwickOutput = { sums, final: values.slice(1) };
    t.finish(input, output, { vars: { op: null, i: null, s: null }, note: "All operations done." });
    return output;
  },

  check(input, out) {
    const a = [...input.values];
    const sums: number[] = [];
    for (const op of input.ops) {
      if (op.kind === "add") a[op.i - 1]! += op.x;
      else sums.push(a.slice(op.l - 1, op.r).reduce((x, y) => x + y, 0));
    }
    if (JSON.stringify(sums) !== JSON.stringify(out.sums))
      return `sums ${out.sums}, expected ${sums}`;
    if (JSON.stringify(a) !== JSON.stringify(out.final)) return "final array differs";
    return null;
  },

  fidelity(state: TraceState, out) {
    const A = state.structures.A;
    const T = state.structures.T;
    if (A?.kind !== "array" || T?.kind !== "array") return "missing arrays";
    for (let i = 1; i <= out.final.length; i++) {
      if (A.values[i] !== out.final[i - 1]) return `A[${i}] shows ${String(A.values[i])}`;
      // T[i] must equal the sum of A over its range, computed directly.
      const want = out.final.slice(i - lowbit(i), i).reduce((x, y) => x + y, 0);
      if (T.values[i] !== want) return `T[${i}] shows ${String(T.values[i])}, expected ${want}`;
    }
    return null;
  },

  describeOutput: (out) =>
    `Sums: ${out.sums.join(", ") || "—"}; final A = [${out.final.join(", ")}]`,
};
