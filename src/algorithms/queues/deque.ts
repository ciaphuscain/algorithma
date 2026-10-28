import type { TraceState } from "@/engine/state";
import type { TracedArray } from "@/engine/tracer";
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

export interface DequeOutput {
  results: OpResult[];
  /** The deque at the end, front first. */
  contents: number[];
  /** Final array capacity (it starts at 2 and doubles when full). */
  capacity: number;
  /** Index of the front slot at the end. */
  head: number;
  /** Items copied into larger arrays. */
  copies: number;
}

const MAX_OPS = 16;
export const INITIAL_CAPACITY = 2;

const SPEC: OpSpec = {
  pushFront: { value: true, aliases: ["addfirst", "push_front", "unshift"] },
  pushBack: { value: true, aliases: ["addlast", "push_back", "push"] },
  popFront: { value: false, aliases: ["removefirst", "pop_front", "shift"] },
  popBack: { value: false, aliases: ["removelast", "pop_back", "pop"] },
  front: { value: false, aliases: ["peekfirst"] },
  back: { value: false, aliases: ["peeklast"] },
};

const input: InputSpec<Op[]> = {
  fields: [
    {
      name: "ops",
      label: "Operations",
      placeholder: "e.g. pushBack 1, pushBack 2, pushFront 0, popBack, popFront",
      multiline: true,
    },
  ],
  constraints: `1–${MAX_OPS} operations: pushFront x, pushBack x (0–99), popFront, popBack, front, back. The array starts with capacity ${INITIAL_CAPACITY} and doubles when full.`,
  parse(f) {
    const ops = parseOps(f.ops ?? "", SPEC, MAX_OPS);
    if (typeof ops[0] === "string") return { ok: false, errors: ops as string[] };
    return { ok: true, value: ops as Op[] };
  },
  format: (ops) => ({ ops: showOps(ops) }),
  presets: [
    {
      id: "both-ends",
      label: "Both ends, with growth",
      value: [
        { name: "pushBack", value: 1 },
        { name: "pushBack", value: 2 },
        { name: "pushFront", value: 0 },
        { name: "pushFront", value: 9 },
        { name: "pushBack", value: 3 },
        { name: "popFront" },
        { name: "popBack" },
        { name: "front" },
        { name: "back" },
      ],
    },
    {
      id: "wrap",
      label: "Pushing at the front wraps around",
      value: [
        { name: "pushBack", value: 5 },
        { name: "pushFront", value: 4 },
        { name: "popBack" },
        { name: "pushFront", value: 3 },
        { name: "popBack" },
        { name: "pushFront", value: 2 },
        { name: "back" },
      ],
    },
  ],
  random(rng, size) {
    const n = Math.min(MAX_OPS, Math.max(3, size ?? 12));
    return randomOps(
      rng,
      n,
      ["pushFront", "pushBack"],
      ["popFront", "popBack", "popFront", "popBack", "front", "back"],
    );
  },
};

/**
 * A double-ended queue in a growable ring buffer: head is the front slot and the
 * items fill count slots from there, wrapping around. Pushing at the front steps head
 * back one slot (modulo the capacity). When the array is full, the items are copied,
 * front first, into an array twice the size, so a push costs O(1) amortised.
 */
export const deque: AlgorithmModule<Op[], DequeOutput> = {
  id: "deque",
  version: 1,
  pseudocode: [
    "grow(): copy the items, front first, into an array twice as large; head ← 0",
    "pushFront(x): if full: grow();  head ← (head − 1) mod capacity;  A[head] ← x",
    "pushBack(x): if full: grow();  A[(head + count) mod capacity] ← x",
    "popFront(): x ← A[head];  head ← (head + 1) mod capacity",
    "popBack(): x ← A[(head + count − 1) mod capacity]",
    "front(): A[head];   back(): A[(head + count − 1) mod capacity]",
  ],
  input,

  run(ops, t) {
    let cap = INITIAL_CAPACITY;
    let cells: (number | null)[] = Array<null>(cap).fill(null);
    let A: TracedArray = t.array(`A${cap}`, cells, {
      label: `Array (capacity ${cap})`,
      display: "cells",
    });
    let head = 0;
    let count = 0;
    let copies = 0;
    const results: OpResult[] = [];
    const showPointers = (line: number) => {
      A.pointer("head", count ? head : null, { line });
      A.pointer("back", count ? (head + count - 1) % cap : null, {
        line,
        vars: { head, count, capacity: cap },
      });
    };
    const grow = () => {
      const bigger = cap * 2;
      const next: (number | null)[] = Array<null>(bigger).fill(null);
      const B = t.array(`A${bigger}`, next, {
        label: `Array (capacity ${bigger})`,
        display: "cells",
      });
      t.step({
        line: 1,
        note: `The array is full: copy its ${count} items into an array of capacity ${bigger}.`,
      });
      for (let i = 0; i < count; i++) {
        const x = cells[(head + i) % cap]!;
        A.read((head + i) % cap, { line: 1 });
        next[i] = x;
        B.write(i, x, { line: 1 });
        t.tally("copies");
        copies++;
      }
      t.remove(`A${cap}`, { line: 1 });
      A = B;
      cells = next;
      cap = bigger;
      head = 0;
    };
    for (const op of ops) {
      const x = op.value;
      if (op.name === "pushFront" || op.name === "pushBack") {
        if (count === cap) grow();
        let at: number;
        if (op.name === "pushFront") {
          head = (head - 1 + cap) % cap;
          at = head;
        } else at = (head + count) % cap;
        cells[at] = x!;
        count++;
        A.write(at, x!, {
          line: op.name === "pushFront" ? 2 : 3,
          note: `${op.name === "pushFront" ? "Push" : "Append"} ${x} at slot ${at}${op.name === "pushFront" && at === cap - 1 && count > 1 ? ": head wraps around to the last slot" : ""}.`,
        });
        showPointers(op.name === "pushFront" ? 2 : 3);
        results.push("ok");
        continue;
      }
      const line = op.name === "popFront" ? 4 : op.name === "popBack" ? 5 : 6;
      if (count === 0) {
        t.step({ line, note: `${op.name}: the deque is empty.` });
        results.push("empty");
        continue;
      }
      const atBack = (head + count - 1) % cap;
      const at = op.name === "popFront" || op.name === "front" ? head : atBack;
      const v = cells[at]!;
      A.read(at, {
        line,
        note: op.name === "front" || op.name === "back" ? `The ${op.name} is ${v}.` : undefined,
      });
      if (op.name === "popFront" || op.name === "popBack") {
        cells[at] = null;
        A.write(at, null, { line, note: `Remove ${v} from slot ${at}.` });
        if (op.name === "popFront") head = (head + 1) % cap;
        count--;
        showPointers(line);
      }
      results.push(v);
    }
    const contents = Array.from({ length: count }, (_, i) => cells[(head + i) % cap]!);
    const output: DequeOutput = { results, contents, capacity: cap, head, copies };
    t.finish(ops, output, {
      line: 6,
      note: `${contents.length ? `Front to back: ${contents.join(", ")}` : "The deque is empty"}; ${copies} item${copies === 1 ? "" : "s"} copied while growing.`,
    });
    return output;
  },

  check(ops, out) {
    // Independent model: a plain array with unshift/shift/push/pop.
    const d: number[] = [];
    let peak = 0;
    const want = ops.map((op): OpResult => {
      if (op.name === "pushFront") d.unshift(op.value!);
      else if (op.name === "pushBack") d.push(op.value!);
      else if (d.length === 0) return "empty";
      else if (op.name === "popFront") return d.shift()!;
      else if (op.name === "popBack") return d.pop()!;
      else return op.name === "front" ? d[0]! : d.at(-1)!;
      peak = Math.max(peak, d.length);
      return "ok";
    });
    const r = compareResults(ops, out.results, want);
    if (r) return r;
    if (out.contents.join() !== d.join()) return `contents ${out.contents}, expected ${d}`;
    // Doubling from 2: the capacity is the least power of two ≥ the peak size (at least 2),
    // and the copies total capacity − 2 (2 + 4 + … + capacity/2), fewer than twice the peak.
    let cap = INITIAL_CAPACITY;
    while (cap < peak) cap *= 2;
    if (out.capacity !== cap) return `capacity ${out.capacity}, expected ${cap}`;
    if (out.copies !== cap - INITIAL_CAPACITY)
      return `${out.copies} copies, expected ${cap - INITIAL_CAPACITY}`;
    return null;
  },

  fidelity(state: TraceState, out) {
    const A = state.structures[`A${out.capacity}`];
    if (A?.kind !== "array") return `no array of capacity ${out.capacity}`;
    const others = Object.keys(state.structures).filter((k) => k !== `A${out.capacity}`);
    if (others.length) return `old arrays still shown: ${others}`;
    const shown = Array.from(
      { length: out.contents.length },
      (_, i) => A.values[(out.head + i) % out.capacity],
    );
    if (shown.join() !== out.contents.join()) return `the array holds ${shown}`;
    const filled = A.values.filter((v) => v !== null).length;
    return filled === out.contents.length ? null : `${filled} slots are filled`;
  },

  describeOutput: (o) =>
    `${o.results.filter((r) => r !== "ok").join(", ") || "no removals"}; left: ${o.contents.join(", ") || "nothing"} (capacity ${o.capacity})`,
};
