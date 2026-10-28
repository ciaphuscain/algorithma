import type { Scalar } from "@/engine/protocol";
import type { TraceState } from "@/engine/state";
import type { AlgorithmModule, InputSpec } from "../types";
import { clamp } from "../inputs";

export type UnionFindOp =
  | { kind: "union"; a: number; b: number }
  | { kind: "find"; a: number }
  | { kind: "connected"; a: number; b: number };

export interface UnionFindInput {
  n: number;
  ops: UnionFindOp[];
}

export interface UnionFindOutput {
  /** One answer per find (a root) or connected (a boolean) operation, in order. */
  answers: (number | boolean)[];
  parent: number[];
  rank: number[];
  sets: number;
}

const MAX_N = 12;
const MAX_OPS = 12;
const ROOT = "all";
const el = (i: number) => `e${i}`;

export function parseUnionFindOps(
  text: string,
  n: number,
): { ok: true; value: UnionFindOp[] } | { ok: false; errors: string[] } {
  const parts = text
    .split(/[,;\n]+/)
    .map((p) => p.trim().toLowerCase())
    .filter(Boolean);
  const errors: string[] = [];
  const ops: UnionFindOp[] = [];
  const inRange = (x: number) => Number.isInteger(x) && x >= 0 && x < n;
  for (const p of parts) {
    const m = /^(union|find|connected)\s+(\d+)(?:\s+(\d+))?$/.exec(p);
    if (!m) {
      errors.push(`"${p}" should look like "union 1 2", "find 3" or "connected 1 3"`);
      continue;
    }
    const a = Number(m[2]);
    const b = m[3] === undefined ? undefined : Number(m[3]);
    if (m[1] === "find" ? b !== undefined : b === undefined) {
      errors.push(`"${p}": ${m[1]} takes ${m[1] === "find" ? "one element" : "two elements"}`);
      continue;
    }
    if (!inRange(a) || (b !== undefined && !inRange(b))) {
      errors.push(`"${p}": elements are numbered 0–${n - 1}`);
      continue;
    }
    if (m[1] === "find") ops.push({ kind: "find", a });
    else ops.push({ kind: m[1] as "union" | "connected", a, b: b! });
  }
  if (ops.length === 0 && errors.length === 0) errors.push("Add at least one operation");
  if (ops.length > MAX_OPS) errors.push(`${ops.length} operations; the limit is ${MAX_OPS}`);
  return errors.length ? { ok: false, errors: errors.slice(0, 5) } : { ok: true, value: ops };
}

const formatOp = (o: UnionFindOp) =>
  o.kind === "find" ? `find ${o.a}` : `${o.kind} ${o.a} ${o.b}`;

const ufInput: InputSpec<UnionFindInput> = {
  fields: [
    { name: "n", label: "Number of elements", placeholder: "e.g. 8" },
    {
      name: "ops",
      label: "Operations",
      placeholder: "e.g. union 0 1, union 2 3, connected 1 3, find 3",
      help: "“union a b” merges two sets; “find a” returns a's representative; “connected a b” asks whether a and b share a set. Elements are numbered from 0.",
      multiline: true,
    },
  ],
  constraints: `2–${MAX_N} elements; up to ${MAX_OPS} operations.`,
  parse(fields) {
    const text = (fields.n ?? "").trim();
    if (!/^\d+$/.test(text))
      return { ok: false, errors: ["Number of elements must be a whole number"] };
    const n = Number(text);
    if (n < 2 || n > MAX_N) return { ok: false, errors: [`Use 2–${MAX_N} elements`] };
    const ops = parseUnionFindOps(fields.ops ?? "", n);
    if (!ops.ok) return ops;
    return { ok: true, value: { n, ops: ops.value } };
  },
  format: (v) => ({ n: String(v.n), ops: v.ops.map(formatOp).join(", ") }),
  presets: [
    {
      id: "rank",
      label: "Union by rank, then path compression",
      value: {
        n: 8,
        ops: [
          { kind: "union", a: 0, b: 1 },
          { kind: "union", a: 2, b: 3 },
          { kind: "union", a: 0, b: 2 },
          { kind: "union", a: 4, b: 5 },
          { kind: "union", a: 6, b: 7 },
          { kind: "union", a: 4, b: 6 },
          { kind: "union", a: 0, b: 4 },
          { kind: "find", a: 7 },
        ],
      },
    },
    {
      id: "connectivity",
      label: "Connectivity queries",
      value: {
        n: 6,
        ops: [
          { kind: "union", a: 1, b: 2 },
          { kind: "union", a: 3, b: 4 },
          { kind: "connected", a: 1, b: 4 },
          { kind: "union", a: 2, b: 3 },
          { kind: "connected", a: 1, b: 4 },
          { kind: "connected", a: 0, b: 5 },
        ],
      },
    },
    {
      id: "star",
      label: "Repeated unions stay flat",
      value: {
        n: 5,
        ops: [
          { kind: "union", a: 1, b: 0 },
          { kind: "union", a: 2, b: 0 },
          { kind: "union", a: 3, b: 0 },
          { kind: "union", a: 4, b: 0 },
          { kind: "find", a: 4 },
        ],
      },
    },
  ],
  random(rng, size) {
    const n = clamp(size ?? 8, 2, MAX_N);
    const count = clamp(n + 2, 1, MAX_OPS);
    const ops: UnionFindOp[] = [];
    const pick = () => rng.int(0, n - 1);
    for (let i = 0; i < count; i++) {
      const r = rng.next();
      if (r < 0.65) ops.push({ kind: "union", a: pick(), b: pick() });
      else if (r < 0.8) ops.push({ kind: "find", a: pick() });
      else ops.push({ kind: "connected", a: pick(), b: pick() });
    }
    return { n, ops };
  },
};

/**
 * Disjoint-set union with union by rank and full path compression. The forest is
 * drawn as one tree whose placeholder root ("all") holds every set's root, so each
 * pointer change in parent[] is also visible as a node moving.
 */
export const unionFind: AlgorithmModule<UnionFindInput, UnionFindOutput> = {
  id: "union-find",
  version: 1,
  pseudocode: [
    "make-sets(n): parent[i] ← i;  rank[i] ← 0 for every i",
    "procedure find(x)",
    "  r ← x;  while parent[r] ≠ r: r ← parent[r]   // walk up to the root",
    "  while parent[x] ≠ r: next ← parent[x];  parent[x] ← r;  x ← next   // compress",
    "  return r",
    "procedure union(a, b)",
    "  ra ← find(a);  rb ← find(b)",
    "  if ra = rb: return   // already in the same set",
    "  if rank[ra] < rank[rb]: swap ra and rb   // hang the shorter tree",
    "  parent[rb] ← ra",
    "  if rank[ra] = rank[rb]: rank[ra] ← rank[ra] + 1",
    "procedure connected(a, b): return find(a) = find(b)",
  ],
  input: ufInput,

  run(input, t) {
    const { n } = input;
    const ids = Array.from({ length: n }, (_, i) => i);
    const F = t.tree("F", { binary: false, label: "Forest (each set hangs from its root)" });
    const P = t.array("P", ids, { label: "parent[i]", display: "cells" });
    const R = t.array(
      "R",
      ids.map(() => 0),
      { label: "rank[i]", display: "cells" },
    );
    const parent = [...ids];
    const rank = ids.map(() => 0);
    F.add("·", null, undefined, { line: 1 }, { id: ROOT });
    for (const i of ids) F.add(i, ROOT, undefined, { line: 1 }, { id: el(i) });
    t.step({
      line: 1,
      note: `${n} singleton sets: every element is its own parent, with rank 0. The dot only joins the separate trees for drawing.`,
    });

    const reset = (touched: Iterable<number>) => {
      for (const i of touched) F.status(el(i), "unvisited");
    };

    const find = (x: number, line: number): number => {
      const path = [x];
      F.status(el(x), "current", {
        line: 3,
        vars: { x, r: x },
        note: `find(${x}): start at ${x}.`,
      });
      let r = x;
      for (;;) {
        P.read(r, { line: 3 });
        if (parent[r] === r) break;
        t.tally("pointer steps");
        r = parent[r]!;
        path.push(r);
        F.status(el(r), "path", {
          line: 3,
          vars: { r },
          note: `parent is ${r}; keep climbing.`,
        });
      }
      F.status(el(r), "current", {
        line: 3,
        vars: { r },
        note: `${r} is its own parent: the root.`,
      });
      let cur = x;
      while (parent[cur] !== r) {
        const next = parent[cur]!;
        parent[cur] = r;
        P.write(cur, r, {
          line: 4,
          vars: { x: cur },
          note: `Path compression: point ${cur} straight at the root ${r}.`,
        });
        F.move(el(cur), el(r), undefined, { line: 4 });
        cur = next;
      }
      reset(path);
      t.step({ line, vars: { r }, note: `find returns ${r}.` });
      return r;
    };

    const answers: (number | boolean)[] = [];
    for (const op of input.ops) {
      t.step({
        line: op.kind === "union" ? 6 : op.kind === "find" ? 2 : 12,
        vars: { op: formatOp(op), x: null, r: null, ra: null, rb: null },
        note: `Next operation: ${formatOp(op)}.`,
      });
      if (op.kind === "find") {
        answers.push(find(op.a, 5));
        continue;
      }
      if (op.kind === "connected") {
        const ra = find(op.a, 12);
        const rb = find(op.b, 12);
        answers.push(ra === rb);
        t.step({
          line: 12,
          vars: { ra, rb },
          note:
            ra === rb
              ? `Both have root ${ra}: ${op.a} and ${op.b} are connected.`
              : `Roots ${ra} and ${rb} differ: ${op.a} and ${op.b} are in different sets.`,
        });
        continue;
      }
      let ra = find(op.a, 7);
      let rb = find(op.b, 7);
      if (ra === rb) {
        t.step({
          line: 8,
          vars: { ra, rb },
          note: `${op.a} and ${op.b} already share root ${ra}; nothing to do.`,
        });
        continue;
      }
      R.compare(ra, rb, { line: 9, vars: { ra, rb } });
      if (rank[ra]! < rank[rb]!) {
        [ra, rb] = [rb, ra];
        t.step({
          line: 9,
          vars: { ra, rb },
          note: `rank[${rb}] < rank[${ra}]: hang the shorter tree (root ${rb}) under ${ra}.`,
        });
      }
      parent[rb] = ra;
      P.write(rb, ra, {
        line: 10,
        vars: { ra, rb },
        note: `Union: ${rb}'s tree now hangs from ${ra}.`,
      });
      F.move(el(rb), el(ra), undefined, { line: 10 });
      if (rank[ra] === rank[rb]) {
        rank[ra]! += 1;
        R.write(ra, rank[ra]!, {
          line: 11,
          note: `Equal ranks: the merged tree may be one level taller, so rank[${ra}] becomes ${rank[ra]}.`,
        });
      }
    }

    const sets = ids.filter((i) => parent[i] === i).length;
    const output: UnionFindOutput = { answers, parent, rank, sets };
    t.finish(input, output, {
      vars: { op: null, x: null, r: null, ra: null, rb: null },
      note: `Done: ${sets} set${sets === 1 ? " remains" : "s remain"}.`,
    });
    return output;
  },

  check(input, out) {
    // Independent oracle: explicit component labels, relabelled on every union.
    const label = Array.from({ length: input.n }, (_, i) => i);
    const relabel = (from: number, to: number) => {
      for (let i = 0; i < label.length; i++) if (label[i] === from) label[i] = to;
    };
    let k = 0;
    let lastFind = new Map<number, number>();
    for (const op of input.ops) {
      if (op.kind === "union") {
        if (label[op.a] !== label[op.b]) {
          relabel(label[op.b]!, label[op.a]!);
          lastFind = new Map();
        }
        continue;
      }
      const got = out.answers[k++];
      if (op.kind === "connected") {
        if (got !== (label[op.a] === label[op.b])) return `connected ${op.a} ${op.b} gave ${got}`;
        continue;
      }
      if (typeof got !== "number" || label[got] !== label[op.a])
        return `find ${op.a} returned ${got}, which is not in its set`;
      // Between unions, every find in one set must name the same representative.
      const prev = lastFind.get(label[op.a]!);
      if (prev !== undefined && prev !== got) return `find ${op.a} returned ${got}, before ${prev}`;
      lastFind.set(label[op.a]!, got);
    }
    if (k !== out.answers.length) return "wrong number of answers";
    // The final parent array is a forest whose trees are exactly the components.
    const rootOf = (x: number) => {
      for (let steps = 0; steps <= input.n; steps++) {
        if (out.parent[x] === x) return x;
        x = out.parent[x]!;
      }
      return -1;
    };
    const size = new Map<number, number>();
    for (let i = 0; i < input.n; i++) {
      const r = rootOf(i);
      if (r < 0) return `parent pointers from ${i} form a cycle`;
      size.set(r, (size.get(r) ?? 0) + 1);
      for (let j = 0; j < i; j++) {
        if ((label[i] === label[j]) !== (r === rootOf(j))) return `${i} and ${j} are misgrouped`;
      }
      // Union by rank: ranks strictly increase towards the root.
      const p = out.parent[i]!;
      if (p !== i && !(out.rank[p]! > out.rank[i]!)) return `rank[${p}] ≤ rank[${i}]`;
    }
    for (const [r, s] of size)
      if (s < 2 ** out.rank[r]!) return `root ${r} is too small for its rank`;
    if (out.sets !== size.size) return `reported ${out.sets} sets, found ${size.size}`;
    return null;
  },

  fidelity(state: TraceState, out) {
    const f = state.structures.F;
    const p = state.structures.P;
    const r = state.structures.R;
    if (f?.kind !== "tree" || p?.kind !== "array" || r?.kind !== "array")
      return "missing forest or arrays";
    for (let i = 0; i < out.parent.length; i++) {
      const want = out.parent[i] === i ? ROOT : el(out.parent[i]!);
      if (!f.nodes[want]?.children.includes(el(i))) return `forest: ${i} is not under ${want}`;
      if (p.values[i] !== out.parent[i]) return `parent[${i}] shows ${String(p.values[i])}`;
      if (r.values[i] !== out.rank[i]) return `rank[${i}] shows ${String(r.values[i])}`;
    }
    return null;
  },

  describeOutput: (out) =>
    `${out.sets} set${out.sets === 1 ? "" : "s"}; answers: ${out.answers.map((a: Scalar) => String(a)).join(", ") || "—"}`,
};
