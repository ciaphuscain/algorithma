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

export type Track = "min" | "max";

export interface MinStackInput {
  track: Track;
  ops: Op[];
}

export interface MinStackOutput {
  results: OpResult[];
  /** The stack at the end, bottom first. */
  contents: number[];
  /** The auxiliary stack of running minimums (or maximums) at the end, bottom first. */
  aux: number[];
  /** Largest size the auxiliary stack reached. */
  auxPeak: number;
}

const MAX_OPS = 16;

const spec = (track: Track): OpSpec => ({
  push: { value: true },
  pop: { value: false },
  top: { value: false, aliases: ["peek"] },
  [track]: { value: false, aliases: [track === "min" ? "getmin" : "getmax"] },
});

const input: InputSpec<MinStackInput> = {
  fields: [
    { name: "track", label: "Track the minimum or the maximum", placeholder: "min" },
    {
      name: "ops",
      label: "Operations",
      placeholder: "e.g. push 5, push 3, push 3, min, pop, min",
      multiline: true,
    },
  ],
  constraints: `track is "min" or "max"; 1–${MAX_OPS} operations: push x (0–99), pop, top, and min (or max).`,
  parse(f) {
    const track = ((f.track ?? "").trim().toLowerCase() || "min") as Track;
    if (track !== "min" && track !== "max")
      return { ok: false, errors: ['Track must be "min" or "max"'] };
    const ops = parseOps(f.ops ?? "", spec(track), MAX_OPS);
    if (typeof ops[0] === "string") return { ok: false, errors: ops as string[] };
    return { ok: true, value: { track, ops: ops as Op[] } };
  },
  format: (v) => ({ track: v.track, ops: showOps(v.ops) }),
  presets: [
    {
      id: "classic",
      label: "Minimum with a repeated value",
      value: {
        track: "min",
        ops: [
          { name: "push", value: 5 },
          { name: "push", value: 3 },
          { name: "push", value: 7 },
          { name: "push", value: 3 },
          { name: "min" },
          { name: "pop" },
          { name: "min" },
          { name: "pop" },
          { name: "pop" },
          { name: "min" },
        ],
      },
    },
    {
      id: "max",
      label: "Maximum",
      value: {
        track: "max",
        ops: [
          { name: "push", value: 2 },
          { name: "push", value: 9 },
          { name: "push", value: 4 },
          { name: "max" },
          { name: "pop" },
          { name: "pop" },
          { name: "max" },
          { name: "top" },
        ],
      },
    },
  ],
  random(rng, size) {
    const track: Track = rng.int(0, 1) ? "min" : "max";
    const n = Math.min(MAX_OPS, Math.max(3, size ?? 12));
    const ops = randomOps(rng, n, ["push"], ["pop", "top", track, track], 5);
    // Small values, so that repeats (the subtle case) are common.
    return {
      track,
      ops: ops.map((o) => (o.value === undefined ? o : { ...o, value: o.value % 6 })),
    };
  },
};

/**
 * A stack that also answers "what is the minimum?" in O(1): beside the main stack S,
 * an auxiliary stack M holds the minimums. A pushed value goes onto M too when it is
 * at most the current minimum (≤, so repeated minimums are kept); a popped value is
 * popped from M too when it equals M's top. The maximum works the same with ≥.
 */
export const minStack: AlgorithmModule<MinStackInput, MinStackOutput> = {
  id: "min-stack",
  version: 1,
  pseudocode: [
    "push(x): push x onto S",
    "  if M is empty or x ≤ top(M): push x onto M        (max: x ≥ top(M))",
    "pop(): x ← pop S;  if x = top(M): pop M",
    "top(): top(S)",
    "min(): top(M)",
  ],
  input,

  run(input, t) {
    const { track, ops } = input;
    const better = (x: number, y: number) => (track === "min" ? x <= y : x >= y);
    const sym = track === "min" ? "≤" : "≥";
    const aux = track === "min" ? "minimums" : "maximums";
    const S = t.sequence("S", "stack", { label: "Stack" });
    const M = t.sequence("M", "stack", {
      label: track === "min" ? "Minimums" : "Maximums",
    });
    const s: number[] = [];
    const m: number[] = [];
    let auxPeak = 0;
    const results: OpResult[] = [];
    for (const op of ops) {
      if (op.name === "push") {
        const x = op.value!;
        s.push(x);
        S.push(x, { line: 1, vars: { x } });
        const top = m.at(-1);
        if (top !== undefined) t.tally("comparisons");
        if (top === undefined || better(x, top)) {
          m.push(x);
          M.push(x, {
            line: 2,
            note:
              top === undefined
                ? `${x} is the first value: it is the ${track}.`
                : `${x} ${sym} ${top}: push it onto the ${aux} too.`,
          });
        } else t.step({ line: 2, note: `${x} is not ${sym} ${top}: the ${track} stays ${top}.` });
        auxPeak = Math.max(auxPeak, m.length);
        results.push("ok");
      } else if (s.length === 0) {
        t.step({
          line: op.name === "pop" ? 3 : op.name === "top" ? 4 : 5,
          note: `${op.name}: the stack is empty.`,
        });
        results.push("empty");
      } else if (op.name === "pop") {
        const x = s.pop()!;
        S.pop({ line: 3, vars: { x } });
        t.tally("comparisons");
        if (x === m.at(-1)) {
          m.pop();
          M.pop({
            line: 3,
            note: `Popped ${x}, the current ${track}: pop it from the ${aux} too.`,
          });
        } else t.step({ line: 3, note: `Popped ${x}; the ${track} is unchanged.` });
        results.push(x);
      } else if (op.name === "top") {
        t.step({ line: 4, vars: { x: s.at(-1)! }, note: `The top is ${s.at(-1)}.` });
        results.push(s.at(-1)!);
      } else {
        t.step({
          line: 5,
          vars: { x: m.at(-1)! },
          note: `The ${track} is ${m.at(-1)}, on top of the ${aux}.`,
        });
        results.push(m.at(-1)!);
      }
    }
    const output: MinStackOutput = { results, contents: [...s], aux: [...m], auxPeak };
    t.finish(input, output, {
      line: 5,
      vars: { x: null },
      note: `The auxiliary stack never held more than ${auxPeak} value${auxPeak === 1 ? "" : "s"}.`,
    });
    return output;
  },

  check(input, out) {
    // Independent model: answer each query by scanning the whole stack.
    const s: number[] = [];
    const pick = input.track === "min" ? Math.min : Math.max;
    const want = input.ops.map((op): OpResult => {
      if (op.name === "push") {
        s.push(op.value!);
        return "ok";
      }
      if (s.length === 0) return "empty";
      if (op.name === "pop") return s.pop()!;
      if (op.name === "top") return s.at(-1)!;
      return pick(...s);
    });
    const r = compareResults(input.ops, out.results, want);
    if (r) return r;
    if (out.contents.join() !== s.join()) return `contents ${out.contents}, expected ${s}`;
    if (out.aux.length > s.length) return "the auxiliary stack is larger than the stack";
    if (s.length && out.aux.at(-1) !== pick(...s))
      return `the ${input.track} is not on top of the auxiliary stack`;
    return null;
  },

  fidelity(state: TraceState, out) {
    const S = state.structures.S;
    const M = state.structures.M;
    if (S?.kind !== "sequence" || M?.kind !== "sequence") return "missing stacks";
    if (S.items.join() !== out.contents.join()) return `the stack shows ${S.items}`;
    return M.items.join() === out.aux.join() ? null : `the auxiliary stack shows ${M.items}`;
  },

  describeOutput: (o) => `${o.results.filter((r) => r !== "ok").join(", ") || "no queries"}`,
};
