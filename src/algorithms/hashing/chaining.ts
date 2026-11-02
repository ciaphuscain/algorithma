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

export interface ChainingOutput {
  results: OpResult[];
  /** Each bucket's chain, front to back. */
  buckets: number[][];
}

/**
 * A hash table with separate chaining: bucket h(k) = k mod m holds a list of the keys
 * that hash there. Insert appends to the list (after checking the key is absent), find
 * walks it, delete removes the key and closes the gap. Each key compared counts as one
 * probe.
 */
export const hashChaining: AlgorithmModule<HashInput, ChainingOutput> = {
  id: "hash-chaining",
  version: 1,
  pseudocode: [
    "h(k) = k mod m;  each bucket holds a list",
    "insert(k): if k is in list[h(k)]: report present;  else append k to list[h(k)]",
    "find(k): walk list[h(k)], comparing each key with k",
    "delete(k): find k in list[h(k)] and remove it",
  ],
  input: hashInput({
    sizes: { min: 3, max: 13 },
    presets: [
      {
        id: "classic",
        label: "Collisions in a table of 7",
        value: {
          m: 7,
          ops: [
            ...[50, 700, 76, 85, 92, 73, 101].map((key) => ({ kind: "insert" as const, key })),
            { kind: "find", key: 92 },
            { kind: "find", key: 15 },
            { kind: "delete", key: 85 },
            { kind: "find", key: 92 },
          ],
        },
      },
      {
        id: "same-bucket",
        label: "Every key in one bucket (worst case)",
        value: {
          m: 5,
          ops: [
            ...[3, 8, 13, 18, 23, 28].map((key) => ({ kind: "insert" as const, key })),
            { kind: "find", key: 28 },
            { kind: "find", key: 33 },
          ],
        },
      },
      {
        id: "duplicates",
        label: "Duplicates and deletions",
        value: {
          m: 4,
          ops: [
            { kind: "insert", key: 9 },
            { kind: "insert", key: 13 },
            { kind: "insert", key: 9 },
            { kind: "delete", key: 9 },
            { kind: "delete", key: 9 },
            { kind: "insert", key: 9 },
            { kind: "find", key: 13 },
          ],
        },
      },
    ],
  }),

  run(input, t) {
    const { m, ops } = input;
    // The table is drawn as large as the longest chain will get, which a plain
    // simulation measures first; the traced code below does the real work.
    const sizes = new Array<Set<number>>(m).fill(new Set()).map(() => new Set<number>());
    let width = 1;
    for (const op of ops) {
      const b = sizes[op.key % m]!;
      if (op.kind === "insert") b.add(op.key);
      if (op.kind === "delete") b.delete(op.key);
      width = Math.max(width, b.size);
    }
    const G = t.grid("H", m, width, null, {
      label: `Buckets 0..${m - 1}: h(k) = k mod ${m}`,
      rowHeaders: Array.from({ length: m }, (_, b) => String(b)),
      colHeaders: Array.from({ length: width }, (_, c) => String(c + 1)),
    });
    const len = new Array<number>(m).fill(0);
    let n = 0;
    const results: OpResult[] = [];
    // Walk bucket b looking for k; returns the position or -1.
    const walk = (b: number, k: number, line: number) => {
      for (let c = 0; c < len[b]!; c++) {
        const here = G.num(b, c);
        G.read([[b, c]], {
          line,
          note: here === k ? `${here} = ${k}: found.` : `${here} ≠ ${k}.`,
        });
        t.tally("probes");
        if (here === k) return c;
      }
      return -1;
    };
    for (const op of ops) {
      const { key } = op;
      const b = key % m;
      t.step({
        line: op.kind === "insert" ? 2 : op.kind === "find" ? 3 : 4,
        vars: { op: showOp(op), bucket: b, n, load: Number((n / m).toFixed(2)) },
        note: `${showOp(op)}: h(${key}) = ${key} mod ${m} = ${b}${len[b] ? `; bucket ${b} holds ${len[b]} key${len[b] === 1 ? "" : "s"}` : "; bucket " + b + " is empty"}.`,
      });
      if (op.kind === "insert") {
        if (walk(b, key, 2) >= 0) {
          results.push("present");
          t.step({ line: 2, note: `${key} is already in the table; nothing to insert.` });
          continue;
        }
        G.write(b, len[b]!, key, {
          line: 2,
          note: `Append ${key} to bucket ${b}.`,
        });
        len[b]!++;
        n++;
        results.push("inserted");
      } else if (op.kind === "find") {
        const c = walk(b, key, 3);
        results.push(c >= 0 ? "found" : "missing");
        if (c >= 0) G.mark([[b, c]], "path", { line: 3 });
        else t.step({ line: 3, note: `${key} is not in bucket ${b}, so it is not in the table.` });
        if (c >= 0) G.mark([[b, c]], null, { line: 3 });
      } else {
        const c = walk(b, key, 4);
        if (c < 0) {
          results.push("missing");
          t.step({ line: 4, note: `${key} is not in the table; nothing to delete.` });
          continue;
        }
        for (let d = c; d + 1 < len[b]!; d++)
          G.write(b, d, G.num(b, d + 1), { line: 4, note: d === c ? `Close the gap.` : undefined });
        G.write(b, len[b]! - 1, null, { line: 4, note: `${key} is deleted from bucket ${b}.` });
        len[b]!--;
        n--;
        results.push("deleted");
      }
    }
    const buckets = Array.from({ length: m }, (_, b) =>
      Array.from({ length: len[b]! }, (_, c) => G.num(b, c)),
    );
    const output: ChainingOutput = { results, buckets };
    t.finish(input, output, {
      line: 1,
      vars: { op: null, bucket: null, n, load: Number((n / m).toFixed(2)) },
      note: `${n} key${n === 1 ? "" : "s"} in ${m} buckets; longest chain ${Math.max(...len)}.`,
    });
    return output;
  },

  check(input, out) {
    const bad = checkResults(input.ops, out.results);
    if (bad) return bad;
    if (out.results.some((r) => r === "full" || r === "failed"))
      return "chaining never refuses an insert";
    // Each bucket holds exactly the live keys with that hash, in insertion order.
    const live = [...finalKeys(input.ops, out.results)];
    for (let b = 0; b < input.m; b++) {
      const want = live.filter((k) => k % input.m === b);
      if (out.buckets[b]!.join() !== want.join())
        return `bucket ${b} holds [${out.buckets[b]}], expected [${want}]`;
    }
    return null;
  },

  fidelity(state: TraceState, out) {
    const G = state.structures.H;
    if (G?.kind !== "grid") return "no table H";
    for (let b = 0; b < out.buckets.length; b++) {
      const shown = G.cells[b]!.filter((v) => v !== null);
      if (shown.join() !== out.buckets[b]!.join()) return `bucket ${b} shows [${shown}]`;
    }
    return null;
  },

  describeOutput: (out) =>
    `${out.results.join(", ")}; buckets: ${out.buckets.map((b, i) => `${i}:[${b.join(" ")}]`).join(" ")}`,
};
