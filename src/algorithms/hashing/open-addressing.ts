import type { TraceState } from "@/engine/state";
import type { AlgorithmModule, InputSpec } from "../types";
import {
  checkResults,
  finalKeys,
  hashInput,
  showOp,
  type HashInput,
  type OpResult,
} from "./common";

export type Probing = "linear" | "double";

export interface OpenInput extends HashInput {
  probing: Probing;
}

export interface OpenOutput {
  results: OpResult[];
  /** Final slots: a key, "DEL" for a tombstone, or null for never used. */
  slots: (number | "DEL" | null)[];
}

export const TOMBSTONE = "DEL";

/** Slot of the i-th probe for key k (i = 0, 1, …). Double hashing needs m prime. */
export function probe(probing: Probing, m: number, k: number, i: number): number {
  const h1 = k % m;
  const h2 = probing === "linear" ? 1 : 1 + (k % (m - 1));
  return (h1 + i * h2) % m;
}

const base = hashInput({
  sizes: { min: 5, max: 13, primeOnly: true },
  sizeHelp: "Prime, so that double hashing visits every slot.",
  presets: [],
});

const input: InputSpec<OpenInput> = {
  ...base,
  fields: [
    ...base.fields,
    { name: "probing", label: "Probing (linear or double)", placeholder: "linear" },
  ],
  constraints: `${base.constraints} Probing: "linear" (h(k) + i) or "double" (h₁(k) + i·h₂(k), h₂(k) = 1 + k mod (m − 1)).`,
  parse(f) {
    const r = base.parse(f);
    const p = (f.probing ?? "").trim().toLowerCase() || "linear";
    const probingOk = p === "linear" || p === "double";
    if (!r.ok)
      return probingOk
        ? r
        : { ok: false, errors: [...r.errors, 'Probing must be "linear" or "double"'] };
    if (!probingOk) return { ok: false, errors: ['Probing must be "linear" or "double"'] };
    return { ok: true, value: { ...r.value, probing: p } };
  },
  format: (v) => ({ ...base.format(v), probing: v.probing }),
  presets: [
    {
      id: "classic",
      label: "Linear probing: a cluster forms",
      value: {
        m: 11,
        probing: "linear",
        ops: [
          ...[22, 33, 44, 12, 23, 5, 16].map((key) => ({ kind: "insert" as const, key })),
          { kind: "find", key: 16 },
          { kind: "find", key: 27 },
        ],
      },
    },
    {
      id: "double",
      label: "The same keys with double hashing",
      value: {
        m: 11,
        probing: "double",
        ops: [
          ...[22, 33, 44, 12, 23, 5, 16].map((key) => ({ kind: "insert" as const, key })),
          { kind: "find", key: 16 },
          { kind: "find", key: 27 },
        ],
      },
    },
    {
      id: "tombstone",
      label: "Deletion leaves a tombstone",
      value: {
        m: 7,
        probing: "linear",
        ops: [
          { kind: "insert", key: 10 },
          { kind: "insert", key: 17 },
          { kind: "insert", key: 24 },
          { kind: "delete", key: 17 },
          { kind: "find", key: 24 },
          { kind: "insert", key: 31 },
          { kind: "find", key: 31 },
        ],
      },
    },
    {
      id: "full",
      label: "A full table refuses an insert",
      value: {
        m: 5,
        probing: "double",
        ops: [...[1, 2, 3, 4, 5, 6].map((key) => ({ kind: "insert" as const, key }))],
      },
    },
  ],
  random(rng, size) {
    return { ...base.random(rng, size), probing: rng.int(0, 1) ? "double" : "linear" };
  },
};

/**
 * Open addressing: every key lives in the table itself. A key k tries slots
 * probe(k, 0), probe(k, 1), … until it finds what it needs. Deleting a key leaves a
 * tombstone ("DEL"): a search must continue past it, because the key it is looking for
 * may have been placed beyond it; an insert may reuse it, but only after checking the
 * key is not further along.
 */
export const openAddressing: AlgorithmModule<OpenInput, OpenOutput> = {
  id: "open-addressing",
  version: 1,
  pseudocode: [
    "probe(k, i) = (h₁(k) + i·h₂(k)) mod m;  linear: h₂ = 1;  double: h₂(k) = 1 + k mod (m − 1)",
    "find(k): for i ← 0, 1, …: s ← probe(k, i)",
    "  if slot s is empty: k is absent;  if slot s holds k: found;  (skip tombstones)",
    "insert(k): if find(k) succeeds: present",
    "  else put k in the first tombstone or empty slot seen;  none at all: table full",
    "delete(k): if find(k) succeeds at slot s: put a tombstone in s",
  ],
  input,

  run(input, t) {
    const { m, ops, probing } = input;
    const T = t.array(
      "T",
      Array.from({ length: m }, () => null),
      { label: `Slots 0..${m - 1} (${probing} probing)`, display: "cells" },
    );
    const results: OpResult[] = [];
    let n = 0;
    // Probe for key; report where it is, or the first reusable slot on its sequence.
    const search = (key: number, line: number) => {
      let firstFree = -1;
      for (let i = 0; i < m; i++) {
        const s = probe(probing, m, key, i);
        const v = T.get(s);
        T.pointer("s", s, { line, vars: { i, s } });
        t.tally("probes");
        if (v === null) {
          T.read(s, { line: 3, note: `Slot ${s} is empty: ${key} is not in the table.` });
          return { at: -1, free: firstFree === -1 ? s : firstFree, exhausted: false };
        }
        if (v === TOMBSTONE) {
          T.read(s, {
            line: 3,
            note: `Slot ${s} holds a tombstone: keep probing${firstFree === -1 ? " (remember it as a free slot)" : ""}.`,
          });
          if (firstFree === -1) firstFree = s;
          continue;
        }
        if (
          T.compareWith(s, key, {
            line: 3,
            note: v === key ? `Slot ${s} holds ${key}.` : `Slot ${s} holds ${v} ≠ ${key}.`,
          }) === 0
        )
          return { at: s, free: -1, exhausted: false };
      }
      return { at: -1, free: firstFree, exhausted: true };
    };
    for (const op of ops) {
      const { key } = op;
      t.step({
        line: op.kind === "delete" ? 6 : op.kind === "insert" ? 4 : 2,
        vars: {
          op: showOp(op),
          h1: key % m,
          h2: probing === "linear" ? 1 : 1 + (key % (m - 1)),
          i: null,
          s: null,
          n,
          load: Number((n / m).toFixed(2)),
        },
        note: `${showOp(op)}: the probe sequence starts at ${key} mod ${m} = ${key % m}${probing === "double" ? ` and steps by 1 + ${key} mod ${m - 1} = ${1 + (key % (m - 1))}` : " and steps by 1"}.`,
      });
      const { at, free, exhausted } = search(key, op.kind === "insert" ? 4 : 2);
      if (op.kind === "find") {
        results.push(at >= 0 ? "found" : "missing");
        if (at >= 0) {
          T.mark(at, "found", { line: 3 });
          T.mark(at, null, { line: 3 });
        } else if (exhausted)
          t.step({ line: 3, note: `Every slot was probed: ${key} is not in the table.` });
      } else if (op.kind === "insert") {
        if (at >= 0) {
          results.push("present");
          continue;
        }
        if (free === -1) {
          results.push("full");
          t.step({
            line: 5,
            note: `No empty slot or tombstone on ${key}'s probe sequence: the table is full.`,
          });
          continue;
        }
        T.write(free, key, {
          line: 5,
          note: `Put ${key} in slot ${free}${T.get(free) === TOMBSTONE ? ", reusing the tombstone" : ""}.`,
        });
        n++;
        results.push("inserted");
      } else {
        if (at < 0) {
          results.push("missing");
          continue;
        }
        T.write(at, TOMBSTONE, {
          line: 6,
          note: `Replace ${key} with a tombstone, so searches for keys placed after it keep going.`,
        });
        n--;
        results.push("deleted");
      }
    }
    T.pointer("s", null, { line: 1 });
    const output: OpenOutput = { results, slots: T.toArray() as OpenOutput["slots"] };
    t.finish(input, output, {
      line: 1,
      vars: { op: null, i: null, s: null, h1: null, h2: null, n, load: Number((n / m).toFixed(2)) },
      note: `${n} key${n === 1 ? "" : "s"} in ${m} slots.`,
    });
    return output;
  },

  check(input, out) {
    const bad = checkResults(input.ops, out.results);
    if (bad) return bad;
    const { m, ops, probing } = input;
    // A refused insert is justified only when every slot holds a live key at that moment.
    const live = new Set<number>();
    for (const [i, op] of ops.entries()) {
      const r = out.results[i];
      if (r === "full" && live.size < m) return `${showOp(op)} refused with only ${live.size} keys`;
      if (r === "inserted") live.add(op.key);
      if (r === "deleted") live.delete(op.key);
    }
    const want = finalKeys(ops, out.results);
    const keys = out.slots.filter((v): v is number => typeof v === "number");
    if ([...keys].sort((a, b) => a - b).join() !== [...want].sort((a, b) => a - b).join())
      return `table holds {${keys}}, expected {${[...want]}}`;
    // Every key must be reachable: its probe sequence reaches it without an empty slot.
    for (const k of keys)
      for (let i = 0; ; i++) {
        const v = out.slots[probe(probing, m, k, i)];
        if (v === k) break;
        if (v === null || i >= m) return `${k} cannot be reached along its probe sequence`;
      }
    return null;
  },

  fidelity(state: TraceState, out) {
    const T = state.structures.T;
    if (T?.kind !== "array") return "no array T";
    if (T.values.join() !== out.slots.join()) return `slots show [${T.values}]`;
    return null;
  },

  describeOutput: (out) =>
    `${out.results.join(", ")}; slots: [${out.slots.map((v) => (v === null ? "·" : v)).join(", ")}]`,
};
