import type { TraceState } from "@/engine/state";
import type { AlgorithmModule } from "../types";
import {
  checkResults,
  finalKeys,
  hashInput,
  showOp,
  type HashInput,
  type OpResult,
} from "./common";

export interface CuckooOutput {
  results: OpResult[];
  t1: (number | null)[];
  t2: (number | null)[];
}

export const h1 = (k: number, m: number) => k % m;
export const h2 = (k: number, m: number) => Math.floor(k / m) % m;

/**
 * Whether keys can be placed with each key in T1[h1(k)] or T2[h2(k)]: view each key as
 * an edge between slot h1(k) of T1 and slot h2(k) of T2; a placement exists exactly when
 * no connected component has more edges than vertices. Independent of the insertion
 * procedure, so it serves as the oracle for refused inserts.
 */
export function cuckooFeasible(keys: number[], m: number): boolean {
  const parent = Array.from({ length: 2 * m }, (_, i) => i);
  const find = (x: number): number => (parent[x] === x ? x : (parent[x] = find(parent[x]!)));
  for (const k of keys) {
    const [a, b] = [find(h1(k, m)), find(m + h2(k, m))];
    if (a !== b) parent[a] = b;
  }
  const edges = new Map<number, number>();
  const vertices = new Map<number, number>();
  for (let v = 0; v < 2 * m; v++) vertices.set(find(v), (vertices.get(find(v)) ?? 0) + 1);
  for (const k of keys) {
    const r = find(h1(k, m));
    edges.set(r, (edges.get(r) ?? 0) + 1);
  }
  return [...edges].every(([r, e]) => e <= vertices.get(r)!);
}

/**
 * Cuckoo hashing with two tables: key k may live only in T1[h1(k)] or T2[h2(k)], so a
 * lookup probes at most two slots. Insertion puts k in T1; if that slot was taken, the
 * evicted key moves to its slot in the other table, possibly evicting another, and so
 * on. If the evictions go round in a cycle, no placement exists with these hash
 * functions: the insertion is undone and refused (a real table would rehash).
 */
export const cuckooHashing: AlgorithmModule<HashInput, CuckooOutput> = {
  id: "cuckoo-hashing",
  version: 1,
  pseudocode: [
    "h₁(k) = k mod m;  h₂(k) = ⌊k / m⌋ mod m;  k lives in T₁[h₁(k)] or T₂[h₂(k)]",
    "find(k): look in T₁[h₁(k)] and T₂[h₂(k)]",
    "insert(k): if find(k): present;  x ← k;  table ← 1",
    "  repeat up to 2(n + 1) times: swap x with T_table[h_table(x)]",
    "    if x is now empty: done;  else table ← the other table",
    "  too many evictions: undo them and refuse (rehash needed)",
    "delete(k): empty the slot where find(k) found it",
  ],
  input: hashInput({
    sizes: { min: 3, max: 13 },
    presets: [
      {
        id: "classic",
        label: "A chain of evictions",
        value: {
          m: 7,
          ops: [
            ...[3, 10, 17, 24, 52].map((key) => ({ kind: "insert" as const, key })),
            { kind: "find", key: 17 },
            { kind: "find", key: 31 },
            { kind: "delete", key: 10 },
            { kind: "find", key: 24 },
          ],
        },
      },
      {
        id: "cycle",
        label: "Three keys with the same two slots: a cycle",
        value: {
          m: 5,
          ops: [
            ...[7, 32, 57].map((key) => ({ kind: "insert" as const, key })),
            { kind: "find", key: 57 },
            { kind: "insert", key: 1 },
          ],
        },
      },
    ],
  }),

  run(input, t) {
    const { m, ops } = input;
    const T = [
      t.array(
        "T1",
        Array.from({ length: m }, () => null),
        {
          label: `T₁: slot h₁(k) = k mod ${m}`,
          display: "cells",
        },
      ),
      t.array(
        "T2",
        Array.from({ length: m }, () => null),
        {
          label: `T₂: slot h₂(k) = ⌊k / ${m}⌋ mod ${m}`,
          display: "cells",
        },
      ),
    ] as const;
    const h = (table: 0 | 1, k: number) => (table === 0 ? h1(k, m) : h2(k, m));
    const results: OpResult[] = [];
    let n = 0;
    const lookup = (key: number, line: number) => {
      for (const table of [0, 1] as const) {
        const s = h(table, key);
        t.tally("probes");
        if (T[table].get(s) !== null && T[table].compareWith(s, key, { line }) === 0)
          return { table, s };
        if (T[table].get(s) === null) T[table].read(s, { line });
      }
      return null;
    };
    for (const op of ops) {
      const { key } = op;
      t.step({
        line: op.kind === "insert" ? 3 : op.kind === "find" ? 2 : 7,
        vars: { op: showOp(op), "h₁": h1(key, m), "h₂": h2(key, m), x: null, n },
        note: `${showOp(op)}: h₁(${key}) = ${h1(key, m)}, h₂(${key}) = ${h2(key, m)}.`,
      });
      const at = lookup(key, op.kind === "insert" ? 3 : 2);
      if (op.kind === "find") {
        results.push(at ? "found" : "missing");
        t.step({
          line: 2,
          note: at
            ? `${key} is in T${at.table + 1}[${at.s}].`
            : `${key} is in neither slot, so it is absent.`,
        });
        continue;
      }
      if (op.kind === "delete") {
        if (!at) {
          results.push("missing");
          continue;
        }
        T[at.table].write(at.s, null, { line: 7, note: `Empty T${at.table + 1}[${at.s}].` });
        n--;
        results.push("deleted");
        continue;
      }
      if (at) {
        results.push("present");
        continue;
      }
      const limit = 2 * (n + 1);
      const moves: { table: 0 | 1; s: number; old: number | null }[] = [];
      let x: number | null = key;
      let table: 0 | 1 = 0;
      for (let step = 0; step < limit && x !== null; step++) {
        const s = h(table, x);
        const old = T[table].get(s) as number | null;
        T[table].write(s, x, {
          line: 4,
          vars: { x },
          note:
            old === null
              ? `Put ${x} in the empty slot T${table + 1}[${s}].`
              : `Put ${x} in T${table + 1}[${s}], evicting ${old}, which moves to T${2 - table}.`,
        });
        moves.push({ table, s, old });
        if (old !== null) t.tally("evictions");
        x = old;
        table = table === 0 ? 1 : 0;
      }
      if (x === null) {
        n++;
        results.push("inserted");
        continue;
      }
      t.step({
        line: 6,
        vars: { x },
        note: `${moves.length} evictions without finding a free slot: the keys go round a cycle. Undo the moves and refuse ${key}; a real table would pick new hash functions and rebuild.`,
      });
      for (const mv of moves.reverse()) T[mv.table].write(mv.s, mv.old, { line: 6 });
      results.push("failed");
    }
    const output: CuckooOutput = {
      results,
      t1: T[0].toArray() as (number | null)[],
      t2: T[1].toArray() as (number | null)[],
    };
    t.finish(input, output, {
      line: 1,
      vars: { op: null, x: null, n },
      note: `${n} key${n === 1 ? "" : "s"} in two tables of ${m} slots.`,
    });
    return output;
  },

  check(input, out) {
    const bad = checkResults(input.ops, out.results);
    if (bad) return bad;
    const { m, ops } = input;
    // An insert must be refused exactly when no placement of the keys exists.
    const live = new Set<number>();
    for (const [i, op] of ops.entries()) {
      const r = out.results[i];
      if (r === "inserted" || r === "failed") {
        const feasible = cuckooFeasible([...live, op.key], m);
        if (r === "failed" && feasible) return `${showOp(op)} was refused, but a placement exists`;
        if (r === "inserted" && !feasible)
          return `${showOp(op)} succeeded, but no placement exists`;
        if (r === "inserted") live.add(op.key);
      }
      if (r === "full") return "cuckoo hashing reports failures, not a full table";
      if (r === "deleted") live.delete(op.key);
    }
    const want = [...finalKeys(ops, out.results)].sort((a, b) => a - b);
    const keys = [...out.t1, ...out.t2].filter((v): v is number => v !== null);
    if ([...keys].sort((a, b) => a - b).join() !== want.join())
      return `tables hold {${keys}}, expected {${want}}`;
    for (let s = 0; s < m; s++) {
      const [a, b] = [out.t1[s], out.t2[s]];
      if (a !== null && h1(a!, m) !== s) return `${a} is in T1[${s}], not T1[${h1(a!, m)}]`;
      if (b !== null && h2(b!, m) !== s) return `${b} is in T2[${s}], not T2[${h2(b!, m)}]`;
    }
    return null;
  },

  fidelity(state: TraceState, out) {
    const [a, b] = [state.structures.T1, state.structures.T2];
    if (a?.kind !== "array" || b?.kind !== "array") return "no arrays T1 and T2";
    if (a.values.join() !== out.t1.join() || b.values.join() !== out.t2.join())
      return "tables differ from the output";
    return null;
  },

  describeOutput: (out) =>
    `${out.results.join(", ")}; T1: [${out.t1.map((v) => v ?? "·").join(", ")}]; T2: [${out.t2.map((v) => v ?? "·").join(", ")}]`,
};
