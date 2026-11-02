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

export interface RobinHoodOutput {
  results: OpResult[];
  slots: (number | null)[];
  /** Each occupied slot's distance from its key's home slot. */
  dist: (number | null)[];
}

/**
 * Robin Hood hashing: linear probing in which a key that has travelled further from its
 * home slot h(k) = k mod m takes the slot of a key that has travelled less, and the
 * displaced key moves on. Distances along the table then never jump by more than one,
 * so a search can stop as soon as it meets a key closer to home than the probe count.
 * Deletion shifts the following keys back instead of leaving a tombstone.
 */
export const robinHood: AlgorithmModule<HashInput, RobinHoodOutput> = {
  id: "robin-hood-hashing",
  version: 1,
  pseudocode: [
    "home(k) = k mod m;  D[s] = how far the key in slot s is from its home",
    "find(k): for i ← 0, 1, …: s ← (home(k) + i) mod m",
    "  if s is empty or D[s] < i: k is absent;  if K[s] = k: found",
    "insert(k): if k is present or the table is full: stop;  d ← i where the search stopped",
    "  while slot s is taken: if D[s] < d: swap (k, d) with (K[s], D[s]);  s ← s + 1;  d ← d + 1",
    "  place (k, d) in the empty slot s",
    "delete(k): empty its slot, then shift each following key with D > 0 back one slot",
  ],
  input: hashInput({
    sizes: { min: 5, max: 13 },
    presets: [
      {
        id: "classic",
        label: "Rich keys give way to poor ones",
        value: {
          m: 11,
          ops: [
            ...[13, 1, 12, 23, 34].map((key) => ({ kind: "insert" as const, key })),
            { kind: "find", key: 45 },
            { kind: "find", key: 13 },
          ],
        },
      },
      {
        id: "delete",
        label: "Deletion shifts keys back",
        value: {
          m: 7,
          ops: [
            ...[7, 14, 1, 21, 3].map((key) => ({ kind: "insert" as const, key })),
            { kind: "delete", key: 14 },
            { kind: "find", key: 21 },
            { kind: "find", key: 3 },
          ],
        },
      },
      {
        id: "full",
        label: "A full table",
        value: {
          m: 5,
          ops: [...[4, 9, 14, 19, 24, 29].map((key) => ({ kind: "insert" as const, key }))],
        },
      },
    ],
  }),

  run(input, t) {
    const { m, ops } = input;
    const K = t.array(
      "K",
      Array.from({ length: m }, () => null),
      { label: `Keys in slots 0..${m - 1}`, display: "cells" },
    );
    const D = t.array(
      "D",
      Array.from({ length: m }, () => null),
      { label: "Distance from home slot", display: "cells" },
    );
    const results: OpResult[] = [];
    let n = 0;
    // Robin Hood search: returns the slot holding key, or where the search stopped.
    const search = (key: number, line: number) => {
      const home = key % m;
      for (let i = 0; i < m; i++) {
        const s = (home + i) % m;
        K.pointer("s", s, { line, vars: { i, s } });
        t.tally("probes");
        if (K.get(s) === null) {
          K.read(s, { line: 3, note: `Slot ${s} is empty: ${key} is absent.` });
          return { at: -1, stop: s, i };
        }
        const d = D.num(s);
        D.read(s, { line: 3 });
        if (K.compareWith(s, key, { line: 3 }) === 0) {
          t.step({ line: 3, note: `Slot ${s} holds ${key}.` });
          return { at: s, stop: s, i };
        }
        if (d < i) {
          t.step({
            line: 3,
            note: `${K.get(s)} in slot ${s} is only ${d} from home, closer than ${i}: had ${key} been inserted, it would have taken this slot. ${key} is absent.`,
          });
          return { at: -1, stop: s, i };
        }
      }
      return { at: -1, stop: -1, i: m };
    };
    for (const op of ops) {
      const { key } = op;
      t.step({
        line: op.kind === "delete" ? 7 : op.kind === "insert" ? 4 : 2,
        vars: { op: showOp(op), home: key % m, i: null, s: null, d: null, n },
        note: `${showOp(op)}: home slot ${key} mod ${m} = ${key % m}.`,
      });
      const { at, stop, i } = search(key, op.kind === "insert" ? 4 : 2);
      if (op.kind === "find") {
        results.push(at >= 0 ? "found" : "missing");
        continue;
      }
      if (op.kind === "insert") {
        if (at >= 0) {
          results.push("present");
          continue;
        }
        if (n === m) {
          results.push("full");
          t.step({ line: 4, note: "Every slot is taken: the table is full." });
          continue;
        }
        let [cur, d, s] = [key, i, stop];
        while (K.get(s) !== null) {
          const [resident, rd] = [K.num(s), D.num(s)];
          if (rd < d) {
            K.write(s, cur, {
              line: 5,
              vars: { s, d },
              note: `${resident} is ${rd} from home, ${cur} is ${d}: ${cur} takes slot ${s} and ${resident} moves on.`,
            });
            D.write(s, d, { line: 5 });
            t.tally("swaps");
            [cur, d] = [resident, rd];
          }
          s = (s + 1) % m;
          d++;
          K.pointer("s", s, { line: 5, vars: { s, d } });
        }
        K.write(s, cur, { line: 6, note: `Place ${cur} in empty slot ${s}, ${d} from its home.` });
        D.write(s, d, { line: 6 });
        n++;
        results.push("inserted");
      } else {
        if (at < 0) {
          results.push("missing");
          continue;
        }
        let s = at;
        for (;;) {
          const next = (s + 1) % m;
          if (K.get(next) === null || D.num(next) === 0) break;
          const moved = K.num(next);
          K.write(s, moved, { line: 7, note: `Shift ${moved} back from slot ${next} to ${s}.` });
          D.write(s, D.num(next) - 1, { line: 7 });
          s = next;
        }
        K.write(s, null, { line: 7, note: `Empty slot ${s}.` });
        D.write(s, null, { line: 7 });
        n--;
        results.push("deleted");
      }
    }
    K.pointer("s", null, { line: 1 });
    const output: RobinHoodOutput = {
      results,
      slots: K.toArray() as (number | null)[],
      dist: D.toArray() as (number | null)[],
    };
    t.finish(input, output, {
      line: 1,
      vars: { op: null, home: null, i: null, s: null, d: null, n },
      note: `${n} key${n === 1 ? "" : "s"} in ${m} slots; the longest distance from home is ${Math.max(0, ...output.dist.map((x) => x ?? 0))}.`,
    });
    return output;
  },

  check(input, out) {
    const bad = checkResults(input.ops, out.results);
    if (bad) return bad;
    const { m, ops } = input;
    const live = new Set<number>();
    for (const [i, op] of ops.entries()) {
      const r = out.results[i];
      if (r === "full" && live.size < m) return `${showOp(op)} refused with only ${live.size} keys`;
      if (r === "failed") return "Robin Hood hashing never fails an insert";
      if (r === "inserted") live.add(op.key);
      if (r === "deleted") live.delete(op.key);
    }
    const want = [...finalKeys(ops, out.results)].sort((a, b) => a - b);
    const keys = out.slots.filter((v): v is number => v !== null);
    if ([...keys].sort((a, b) => a - b).join() !== want.join())
      return `table holds {${keys}}, expected {${want}}`;
    // Invariants, computed from the slots alone: the stored distance is right, every
    // slot between a key's home and its slot is occupied, and distances never rise by
    // more than one from one slot to the next.
    for (let s = 0; s < m; s++) {
      const k = out.slots[s];
      if (k === null) continue;
      const d = (s - (k! % m) + m) % m;
      if (out.dist[s] !== d) return `slot ${s}: distance ${out.dist[s]}, expected ${d}`;
      for (let j = 1; j <= d; j++)
        if (out.slots[(s - j + m) % m] === null) return `${k} is separated from its home by a gap`;
      const next = out.slots[(s + 1) % m];
      if (next !== null && next !== undefined) {
        const dn = (((s + 1) % m) - (next % m) + m) % m;
        if (dn > d + 1) return `distance jumps from ${d} to ${dn} after slot ${s}`;
      }
    }
    return null;
  },

  fidelity(state: TraceState, out) {
    const K = state.structures.K;
    const D = state.structures.D;
    if (K?.kind !== "array" || D?.kind !== "array") return "no arrays K and D";
    if (K.values.join() !== out.slots.join()) return `keys show [${K.values}]`;
    if (D.values.join() !== out.dist.join()) return `distances show [${D.values}]`;
    return null;
  },

  describeOutput: (out) =>
    `${out.results.join(", ")}; slots: [${out.slots.map((v) => (v === null ? "·" : v)).join(", ")}]`,
};
