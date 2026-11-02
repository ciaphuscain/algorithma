import type { Scalar } from "@/engine/protocol";
import type { TraceState } from "@/engine/state";
import type { AlgorithmModule } from "../types";
import { windowInput, type WindowInput } from "./common";

const entry = (i: number, v: number) => `A[${i}]=${v}`;

/**
 * Sliding-window maximum with a monotonic deque of indices whose values decrease from
 * front to back. A new value evicts every smaller value at the back (they can never be
 * a maximum again); the front leaves when it falls out of the window. O(n) overall.
 */
export const monotonicQueue: AlgorithmModule<WindowInput, number[]> = {
  id: "monotonic-queue",
  version: 1,
  pseudocode: [
    "procedure windowMax(A, k)",
    "  D ← empty deque   // indices; values decrease from front to back",
    "  for i ← 0 to n − 1",
    "    while D is not empty and A[back(D)] ≤ A[i]: pop the back   // never a maximum again",
    "    push i at the back",
    "    if front(D) ≤ i − k: pop the front   // it has left the window",
    "    if i ≥ k − 1: M[i − k + 1] ← A[front(D)]",
  ],
  input: windowInput({
    limits: { minLength: 1, maxLength: 16, min: -99, max: 99 },
    presets: [
      { id: "classic", label: "Window of 3", value: { values: [1, 3, -1, -3, 5, 3, 6, 7], k: 3 } },
      { id: "decreasing", label: "Decreasing values", value: { values: [9, 8, 7, 6, 5], k: 2 } },
      { id: "whole", label: "Window = whole array", value: { values: [4, 2, 12, 3], k: 4 } },
    ],
  }),

  run(input, t) {
    const { values, k } = input;
    const n = values.length;
    const A = t.array("A", values, { label: "A" });
    const D = t.sequence("D", "deque", { label: "Deque (candidate maxima)" });
    const M = t.array(
      "M",
      Array.from({ length: n - k + 1 }, (): Scalar => null),
      { label: `M[s] = max of A[s..s + ${k - 1}]`, display: "cells" },
    );
    const dq: number[] = [];
    const out: number[] = [];
    t.step({ line: 2, vars: { k }, note: `Windows have ${k} element${k === 1 ? "" : "s"}.` });
    for (let i = 0; i < n; i++) {
      A.pointer("i", i, { line: 3, vars: { i } });
      if (i >= k) A.mark(i - k, null, { line: 3 });
      A.mark(i, "active", { line: 3 });
      while (dq.length > 0) {
        const back = dq[dq.length - 1]!;
        if (A.compare(back, i, { line: 4 }) > 0) break;
        dq.pop();
        D.popBack({
          line: 4,
          note: `A[${back}] = ${values[back]} ≤ ${values[i]}: A[${back}] can never be a window maximum again, because A[${i}] is at least as large and stays in the window longer.`,
        });
      }
      dq.push(i);
      D.push(entry(i, values[i]!), { line: 5 });
      if (dq[0]! <= i - k) {
        const gone = dq.shift()!;
        D.popFront({ line: 6, note: `Index ${gone} has left the window.` });
      }
      if (i >= k - 1) {
        const s = i - k + 1;
        out.push(values[dq[0]!]!);
        M.write(s, values[dq[0]!]!, {
          line: 7,
          note: `The front of the deque is the maximum of A[${s}..${i}]: ${values[dq[0]!]}.`,
        });
      }
    }
    A.pointer("i", null, { line: 7, vars: { i: null } });
    t.finish(input, out, { note: "Every window has its maximum." });
    return out;
  },

  check(input, out) {
    const want = [];
    for (let s = 0; s + input.k <= input.values.length; s++)
      want.push(Math.max(...input.values.slice(s, s + input.k)));
    return JSON.stringify(want) === JSON.stringify(out) ? null : `maxima ${out}, expected ${want}`;
  },

  fidelity(state: TraceState, out) {
    const m = state.structures.M;
    if (m?.kind !== "array") return "no array M";
    return JSON.stringify(m.values) === JSON.stringify(out) ? null : `M shows ${m.values}`;
  },

  describeOutput: (out) => `Window maxima: ${out.join(", ")}`,
};
