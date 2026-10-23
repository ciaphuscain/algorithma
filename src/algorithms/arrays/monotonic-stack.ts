import type { Scalar } from "@/engine/protocol";
import type { TraceState } from "@/engine/state";
import type { AlgorithmModule } from "../types";
import { numberArrayInput } from "../inputs";

/** next[i] = the first value to the right of A[i] that is larger, or null. */
export type NextGreaterOutput = (number | null)[];

const entry = (i: number, v: number) => `A[${i}]=${v}`;

/**
 * Next greater element with a monotonic stack. The stack holds indices still waiting
 * for a larger value; their values decrease from bottom to top, so a new value
 * answers a run of them at once. Each index is pushed and popped at most once.
 */
export const monotonicStack: AlgorithmModule<number[], NextGreaterOutput> = {
  id: "monotonic-stack",
  version: 1,
  pseudocode: [
    "procedure nextGreater(A)",
    "  S ← empty stack   // indices still waiting; values decrease upwards",
    "  for i ← 0 to n − 1",
    "    while S is not empty and A[top(S)] < A[i]",
    "      next[pop(S)] ← A[i]   // A[i] is the first larger value to its right",
    "    push i onto S",
    "  indices left on S have no larger value to their right",
  ],
  input: numberArrayInput({
    limits: { minLength: 1, maxLength: 16, min: -99, max: 99 },
    presets: [
      { id: "classic", label: "Temperatures", value: [73, 74, 75, 71, 69, 72, 76, 73] },
      { id: "decreasing", label: "Decreasing", value: [9, 7, 5, 3] },
      { id: "increasing", label: "Increasing", value: [1, 2, 3, 4] },
    ],
  }),

  run(input, t) {
    const A = t.array("A", input, { label: "A" });
    const N = t.array(
      "N",
      input.map((): Scalar => null),
      { label: "next greater value", display: "cells" },
    );
    const S = t.sequence("S", "stack", { label: "Stack (waiting indices)" });
    const stack: number[] = [];
    const next: NextGreaterOutput = input.map(() => null);
    t.step({ line: 2, note: "Nothing is waiting yet." });
    for (let i = 0; i < input.length; i++) {
      A.pointer("i", i, { line: 3, vars: { i } });
      while (stack.length > 0) {
        const top = stack[stack.length - 1]!;
        const c = A.compare(top, i, {
          line: 4,
          note: `Is A[${top}] = ${input[top]} smaller than A[${i}] = ${input[i]}?`,
        });
        if (c >= 0) break;
        stack.pop();
        S.pop({ line: 5 });
        next[top] = input[i]!;
        N.write(top, input[i]!, {
          line: 5,
          note: `Yes: ${input[i]} is the next greater value for index ${top}.`,
        });
      }
      stack.push(i);
      S.push(entry(i, input[i]!), {
        line: 6,
        note: `Index ${i} waits for a value larger than ${input[i]}.`,
      });
    }
    A.pointer("i", null, { line: 7, vars: { i: null } });
    t.finish(input, next, {
      line: 7,
      note:
        stack.length > 0
          ? `Still waiting: ${stack.map((i) => entry(i, input[i]!)).join(", ")}. Nothing larger comes after them.`
          : "Every index found a larger value.",
    });
    return next;
  },

  check(input, out) {
    for (let i = 0; i < input.length; i++) {
      let want: number | null = null;
      for (let j = i + 1; j < input.length; j++)
        if (input[j]! > input[i]!) {
          want = input[j]!;
          break;
        }
      if (out[i] !== want) return `next[${i}] = ${out[i]}, expected ${want}`;
    }
    return null;
  },

  fidelity(state: TraceState, out) {
    const n = state.structures.N;
    if (n?.kind !== "array") return "no array N";
    return JSON.stringify(n.values) === JSON.stringify(out) ? null : `N shows ${n.values}`;
  },

  describeOutput: (out) => out.map((v) => (v === null ? "none" : String(v))).join(", "),
};
