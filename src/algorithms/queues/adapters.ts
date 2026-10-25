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
} from "./ops";

export type Build = "queue" | "stack";

export interface AdapterInput {
  /** "queue": a queue built from two stacks; "stack": a stack built from one queue. */
  build: Build;
  ops: Op[];
}

export interface AdapterOutput {
  results: OpResult[];
  /** The container's contents at the end, in removal order (front or top first). */
  contents: number[];
  /** Elements moved between or within the underlying containers. */
  transfers: number;
}

const MAX_OPS = 16;

const SPECS: Record<Build, OpSpec> = {
  queue: {
    enqueue: { value: true, aliases: ["push", "add"] },
    dequeue: { value: false, aliases: ["pop", "remove"] },
    front: { value: false, aliases: ["peek"] },
  },
  stack: {
    push: { value: true, aliases: ["enqueue", "add"] },
    pop: { value: false, aliases: ["dequeue", "remove"] },
    top: { value: false, aliases: ["peek", "front"] },
  },
};

const INSERT: Record<Build, string> = { queue: "enqueue", stack: "push" };

const input: InputSpec<AdapterInput> = {
  fields: [
    {
      name: "build",
      label: "Build (queue from two stacks, or stack from one queue)",
      placeholder: "queue",
    },
    {
      name: "ops",
      label: "Operations",
      placeholder: "e.g. enqueue 1, enqueue 2, dequeue, enqueue 3, dequeue",
      multiline: true,
    },
  ],
  constraints: `build is "queue" (operations enqueue x, dequeue, front) or "stack" (push x, pop, top); 1–${MAX_OPS} operations on values 0–99.`,
  parse(f) {
    const build = ((f.build ?? "").trim().toLowerCase() || "queue") as Build;
    if (build !== "queue" && build !== "stack")
      return { ok: false, errors: ['Build must be "queue" or "stack"'] };
    const ops = parseOps(f.ops ?? "", SPECS[build], MAX_OPS);
    if (typeof ops[0] === "string") return { ok: false, errors: ops as string[] };
    return { ok: true, value: { build, ops: ops as Op[] } };
  },
  format: (v) => ({ build: v.build, ops: showOps(v.ops) }),
  presets: [
    {
      id: "queue",
      label: "Queue from two stacks",
      value: {
        build: "queue",
        ops: [
          { name: "enqueue", value: 1 },
          { name: "enqueue", value: 2 },
          { name: "enqueue", value: 3 },
          { name: "dequeue" },
          { name: "enqueue", value: 4 },
          { name: "dequeue" },
          { name: "dequeue" },
          { name: "front" },
          { name: "dequeue" },
          { name: "dequeue" },
        ],
      },
    },
    {
      id: "stack",
      label: "Stack from one queue",
      value: {
        build: "stack",
        ops: [
          { name: "push", value: 1 },
          { name: "push", value: 2 },
          { name: "push", value: 3 },
          { name: "pop" },
          { name: "push", value: 4 },
          { name: "top" },
          { name: "pop" },
          { name: "pop" },
        ],
      },
    },
  ],
  random(rng, size) {
    const build: Build = rng.int(0, 1) ? "queue" : "stack";
    const others = build === "queue" ? ["dequeue", "dequeue", "front"] : ["pop", "pop", "top"];
    return {
      build,
      ops: randomOps(rng, Math.min(MAX_OPS, Math.max(3, size ?? 12)), [INSERT[build]], others),
    };
  },
};

/** Reference behaviour with a plain array; contents in removal order. */
function model(build: Build, ops: Op[]) {
  const items: number[] = []; // removal order: front or top first
  let transfers = 0;
  const results = ops.map((op): OpResult => {
    if (op.value !== undefined) {
      if (build === "queue") items.push(op.value);
      else {
        transfers += items.length; // one rotation per element already in the queue
        items.unshift(op.value);
      }
      return "ok";
    }
    if (items.length === 0) return "empty";
    return op.name === "front" || op.name === "top" ? items[0]! : items.shift()!;
  });
  return { results, items, transfers };
}

/**
 * A queue from two stacks: enqueue pushes onto In; dequeue pops from Out, first
 * moving all of In onto Out (reversing it) when Out is empty. A stack from one queue:
 * push enqueues the new item, then rotates the older items behind it, so the front of
 * the queue is always the top of the stack.
 */
export const stackQueueAdapters: AlgorithmModule<AdapterInput, AdapterOutput> = {
  id: "queue-using-stacks",
  version: 1,
  pseudocode: [
    "queue from stacks — enqueue(x): push x onto In",
    "dequeue: if Out is empty: move every item from In to Out (pop, push)",
    "  pop from Out (front: look at Out's top)",
    "stack from a queue — push(x): enqueue x",
    "  repeat size − 1 times: dequeue an item and enqueue it again",
    "pop: dequeue (top: look at the front)",
  ],
  input,

  run(input, t) {
    const results: OpResult[] = [];
    let transfers = 0;
    if (input.build === "queue") {
      const In = t.sequence("In", "stack", { label: "In (new items)" });
      const Out = t.sequence("Out", "stack", { label: "Out (front on top)" });
      const inItems: number[] = [];
      const outItems: number[] = [];
      for (const op of input.ops) {
        if (op.value !== undefined) {
          inItems.push(op.value);
          In.push(op.value, { line: 1, note: `Enqueue ${op.value}: push it onto In.` });
          results.push("ok");
          continue;
        }
        if (outItems.length === 0 && inItems.length > 0) {
          t.step({ line: 2, note: `Out is empty: move all ${inItems.length} of In onto Out.` });
          while (inItems.length) {
            const x = inItems.pop()!;
            In.pop({ line: 2 });
            outItems.push(x);
            Out.push(x, { line: 2 });
            t.tally("transfers");
            transfers++;
          }
        }
        if (outItems.length === 0) {
          t.step({ line: 3, note: `${op.name}: the queue is empty.` });
          results.push("empty");
        } else if (op.name === "front") {
          const x = outItems.at(-1)!;
          t.step({ line: 3, vars: { front: x }, note: `The front is ${x}, on top of Out.` });
          results.push(x);
        } else {
          const x = outItems.pop()!;
          Out.pop({ line: 3, vars: { front: x }, note: `Dequeue ${x} from the top of Out.` });
          results.push(x);
        }
      }
      const contents = [...outItems].reverse().concat(inItems);
      const output: AdapterOutput = { results, contents, transfers };
      t.finish(input, output, {
        line: 3,
        vars: { front: null },
        note: `${transfers} transfers for ${input.ops.filter((o) => o.value !== undefined).length} enqueues: each item moves from In to Out at most once.`,
      });
      return output;
    }
    const Q = t.sequence("Q", "queue", { label: "Queue (front = top of the stack)" });
    const items: number[] = [];
    for (const op of input.ops) {
      if (op.value !== undefined) {
        items.push(op.value);
        Q.push(op.value, { line: 4, note: `Push ${op.value}: enqueue it at the back.` });
        const k = items.length - 1;
        if (k > 0)
          t.step({ line: 5, note: `Rotate the ${k} older item${k === 1 ? "" : "s"} behind it.` });
        for (let i = 0; i < k; i++) {
          const x = items.shift()!;
          Q.pop({ line: 5 });
          items.push(x);
          Q.push(x, { line: 5 });
          t.tally("transfers");
          transfers++;
        }
        results.push("ok");
      } else if (items.length === 0) {
        t.step({ line: 6, note: `${op.name}: the stack is empty.` });
        results.push("empty");
      } else if (op.name === "top") {
        t.step({
          line: 6,
          vars: { top: items[0]! },
          note: `The top is ${items[0]}, at the front.`,
        });
        results.push(items[0]!);
      } else {
        const x = items.shift()!;
        Q.pop({ line: 6, vars: { top: x }, note: `Pop ${x} from the front.` });
        results.push(x);
      }
    }
    const output: AdapterOutput = { results, contents: [...items], transfers };
    t.finish(input, output, {
      line: 6,
      vars: { top: null },
      note: `${transfers} transfers: each push rotates every item already in the queue.`,
    });
    return output;
  },

  check(input, out) {
    const want = model(input.build, input.ops);
    const r = compareResults(input.ops, out.results, want.results);
    if (r) return r;
    if (out.contents.join() !== want.items.join())
      return `contents ${out.contents}, expected ${want.items}`;
    if (input.build === "stack") {
      if (out.transfers !== want.transfers)
        return `${out.transfers} transfers, expected ${want.transfers}`;
    } else {
      // Amortised bound: every item moves from In to Out at most once.
      const enqueued = input.ops.filter((o) => o.value !== undefined).length;
      if (out.transfers > enqueued) return `${out.transfers} transfers for ${enqueued} enqueues`;
    }
    return null;
  },

  fidelity(state: TraceState, out) {
    const Q = state.structures.Q;
    if (Q?.kind === "sequence")
      return Q.items.join() === out.contents.join() ? null : `the queue shows ${Q.items}`;
    const In = state.structures.In;
    const Out = state.structures.Out;
    if (In?.kind !== "sequence" || Out?.kind !== "sequence") return "missing stacks";
    const shown = [...Out.items].reverse().concat(In.items);
    return shown.join() === out.contents.join() ? null : `the stacks hold ${shown}`;
  },

  describeOutput: (o) =>
    `${o.results.filter((r) => r !== "ok").join(", ") || "no removals"}; ${o.transfers} transfers`,
};
