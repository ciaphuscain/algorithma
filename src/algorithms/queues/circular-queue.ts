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

export type WhenFull = "reject" | "overwrite";

export interface CircularInput {
  capacity: number;
  whenFull: WhenFull;
  ops: Op[];
}

export interface CircularOutput {
  results: OpResult[];
  /** The queue at the end, front first. */
  contents: number[];
  /** Index of the front slot at the end. */
  head: number;
}

const MAX_OPS = 16;
const MIN_CAP = 2;
const MAX_CAP = 8;

const SPEC: OpSpec = {
  enqueue: { value: true, aliases: ["push", "add", "write"] },
  dequeue: { value: false, aliases: ["pop", "remove", "read"] },
  front: { value: false, aliases: ["peek"] },
};

const input: InputSpec<CircularInput> = {
  fields: [
    { name: "capacity", label: "Capacity", placeholder: `${MIN_CAP}–${MAX_CAP}` },
    {
      name: "whenFull",
      label: "When full (reject the new item, or overwrite the oldest)",
      placeholder: "reject",
    },
    {
      name: "ops",
      label: "Operations",
      placeholder: "e.g. enqueue 1, enqueue 2, dequeue, enqueue 3",
      multiline: true,
    },
  ],
  constraints: `Capacity ${MIN_CAP}–${MAX_CAP}; when full, "reject" (a bounded queue) or "overwrite" (a ring buffer that keeps the newest items); 1–${MAX_OPS} operations: enqueue x (0–99), dequeue, front.`,
  parse(f) {
    const errors: string[] = [];
    const cs = (f.capacity ?? "").trim();
    const capacity = /^\d+$/.test(cs) ? Number(cs) : NaN;
    if (!(capacity >= MIN_CAP && capacity <= MAX_CAP))
      errors.push(`Capacity must be a whole number from ${MIN_CAP} to ${MAX_CAP}`);
    const whenFull = ((f.whenFull ?? "").trim().toLowerCase() || "reject") as WhenFull;
    if (whenFull !== "reject" && whenFull !== "overwrite")
      errors.push('When full must be "reject" or "overwrite"');
    const ops = parseOps(f.ops ?? "", SPEC, MAX_OPS);
    if (typeof ops[0] === "string") errors.push(...(ops as string[]));
    return errors.length
      ? { ok: false, errors: errors.slice(0, 5) }
      : { ok: true, value: { capacity, whenFull, ops: ops as Op[] } };
  },
  format: (v) => ({ capacity: String(v.capacity), whenFull: v.whenFull, ops: showOps(v.ops) }),
  presets: [
    {
      id: "wrap",
      label: "Wrapping around",
      value: {
        capacity: 4,
        whenFull: "reject",
        ops: [
          { name: "enqueue", value: 1 },
          { name: "enqueue", value: 2 },
          { name: "enqueue", value: 3 },
          { name: "dequeue" },
          { name: "dequeue" },
          { name: "enqueue", value: 4 },
          { name: "enqueue", value: 5 },
          { name: "enqueue", value: 6 },
          { name: "enqueue", value: 7 },
          { name: "dequeue" },
          { name: "front" },
        ],
      },
    },
    {
      id: "overwrite",
      label: "Ring buffer keeping the newest",
      value: {
        capacity: 3,
        whenFull: "overwrite",
        ops: [
          { name: "enqueue", value: 10 },
          { name: "enqueue", value: 20 },
          { name: "enqueue", value: 30 },
          { name: "enqueue", value: 40 },
          { name: "enqueue", value: 50 },
          { name: "dequeue" },
          { name: "dequeue" },
          { name: "dequeue" },
          { name: "dequeue" },
        ],
      },
    },
  ],
  random(rng, size) {
    const n = Math.min(MAX_OPS, Math.max(3, size ?? 12));
    return {
      capacity: rng.int(MIN_CAP, 5),
      whenFull: rng.int(0, 1) ? "reject" : "overwrite",
      ops: randomOps(rng, n, ["enqueue"], ["dequeue", "dequeue", "front"]),
    };
  },
};

/**
 * A queue in a fixed array used as a ring: head is the front slot, and the next item
 * goes count slots after it, wrapping from the last slot to slot 0 (index arithmetic
 * modulo the capacity). Nothing ever shifts. When the array is full, a bounded queue
 * refuses the new item; a ring buffer overwrites the oldest one and moves head on.
 */
export const circularQueue: AlgorithmModule<CircularInput, CircularOutput> = {
  id: "circular-queue",
  version: 1,
  pseudocode: [
    "enqueue(x): if count = capacity:",
    "    reject: report full      overwrite: A[head] ← x; head ← (head + 1) mod capacity",
    "  else: A[(head + count) mod capacity] ← x; count ← count + 1",
    "dequeue(): if count = 0: report empty",
    "  x ← A[head]; head ← (head + 1) mod capacity; count ← count − 1",
    "front(): A[head]",
  ],
  input,

  run(input, t) {
    const { capacity: cap, whenFull, ops } = input;
    const A = t.array("A", Array<null>(cap).fill(null), { label: "Ring buffer", display: "cells" });
    const cells: (number | null)[] = Array<null>(cap).fill(null);
    let head = 0;
    let count = 0;
    const results: OpResult[] = [];
    const showPointers = (line: number) => {
      A.pointer("head", head, { line });
      A.pointer("tail", (head + count) % cap, { line, vars: { head, count } });
    };
    showPointers(1);
    for (const op of ops) {
      if (op.name === "enqueue") {
        const x = op.value!;
        if (count === cap) {
          if (whenFull === "reject") {
            t.step({ line: 2, note: `The buffer is full: ${x} is rejected.` });
            results.push("full");
            continue;
          }
          const old = cells[head]!;
          cells[head] = x;
          A.write(head, x, {
            line: 2,
            note: `Full: overwrite the oldest item, ${old}, with ${x}.`,
          });
          head = (head + 1) % cap;
          showPointers(2);
          results.push("overwrote");
          continue;
        }
        const at = (head + count) % cap;
        cells[at] = x;
        count++;
        A.write(at, x, {
          line: 3,
          note:
            at < head
              ? `Write ${x} at slot ${at}: the end of the queue has wrapped around to the start of the array.`
              : `Write ${x} at slot ${at}.`,
        });
        showPointers(3);
        results.push("ok");
      } else if (count === 0) {
        t.step({ line: 4, note: `${op.name}: the queue is empty.` });
        results.push("empty");
      } else if (op.name === "front") {
        const x = A.read(head, { line: 6, note: `The front is ${cells[head]}, at slot ${head}.` });
        results.push(x as number);
      } else {
        const x = cells[head]!;
        A.read(head, { line: 5 });
        cells[head] = null;
        A.write(head, null, { line: 5, note: `Dequeue ${x} from slot ${head}.` });
        head = (head + 1) % cap;
        count--;
        showPointers(5);
        results.push(x);
      }
    }
    const contents = Array.from({ length: count }, (_, i) => cells[(head + i) % cap]!);
    const output: CircularOutput = { results, contents, head };
    t.finish(input, output, {
      line: 6,
      note: count
        ? `${count} item${count === 1 ? "" : "s"} left: ${contents.join(", ")}.`
        : "The queue is empty.",
    });
    return output;
  },

  check(input, out) {
    // Independent model: a plain array, shifting from the front.
    const q: number[] = [];
    const want = input.ops.map((op): OpResult => {
      if (op.name === "enqueue") {
        if (q.length < input.capacity) {
          q.push(op.value!);
          return "ok";
        }
        if (input.whenFull === "reject") return "full";
        q.shift();
        q.push(op.value!);
        return "overwrote";
      }
      if (q.length === 0) return "empty";
      return op.name === "front" ? q[0]! : q.shift()!;
    });
    const r = compareResults(input.ops, out.results, want);
    if (r) return r;
    return out.contents.join() === q.join() ? null : `contents ${out.contents}, expected ${q}`;
  },

  fidelity(state: TraceState, out) {
    const A = state.structures.A;
    if (A?.kind !== "array") return "no buffer";
    const cap = A.values.length;
    if (A.pointers.head !== out.head) return `head shows ${A.pointers.head}`;
    const shown = Array.from(
      { length: out.contents.length },
      (_, i) => A.values[(out.head + i) % cap],
    );
    if (shown.join() !== out.contents.join()) return `the buffer holds ${shown}`;
    const filled = A.values.filter((v) => v !== null).length;
    return filled === out.contents.length ? null : `${filled} slots are filled`;
  },

  describeOutput: (o) =>
    `${o.results.filter((r) => r !== "ok").join(", ") || "no removals"}; left: ${o.contents.join(", ") || "nothing"}`,
};
