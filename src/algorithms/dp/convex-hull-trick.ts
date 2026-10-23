import type { Scalar } from "@/engine/protocol";
import type { TraceState } from "@/engine/state";
import type { AlgorithmModule, InputSpec } from "../types";

export interface FrogInput {
  /** Strictly increasing stone heights. */
  h: number[];
  /** Fixed cost of every jump. */
  C: number;
}

export interface FrogOutput {
  dp: number[];
  /** Lines removed from the front (no longer best) and the back (never best). */
  popsFront: number;
  popsBack: number;
}

const MAX_STONES = 12;

const input: InputSpec<FrogInput> = {
  fields: [
    { name: "h", label: "Stone heights (strictly increasing)", placeholder: "e.g. 1, 2, 3, 4, 5" },
    { name: "C", label: "Cost per jump C", placeholder: "e.g. 6" },
  ],
  constraints: `2–${MAX_STONES} strictly increasing heights from 0 to 100; 0 ≤ C ≤ 1000.`,
  parse(fields) {
    const tokens = (fields.h ?? "").split(/[\s,;]+/).filter(Boolean);
    const h = tokens.map(Number);
    const ct = (fields.C ?? "").trim();
    const errors: string[] = [];
    if (tokens.length < 2 || tokens.length > MAX_STONES)
      errors.push(`Give 2–${MAX_STONES} heights`);
    for (const tk of tokens)
      if (!/^\d+$/.test(tk) || Number(tk) > 100)
        errors.push(`"${tk}" must be a whole number from 0 to 100`);
    if (errors.length === 0 && h.some((x, i) => i > 0 && x <= h[i - 1]!))
      errors.push("Heights must be strictly increasing");
    if (!/^\d+$/.test(ct) || Number(ct) > 1000)
      errors.push("C must be a whole number from 0 to 1000");
    return errors.length
      ? { ok: false, errors: errors.slice(0, 5) }
      : { ok: true, value: { h, C: Number(ct) } };
  },
  format: (v) => ({ h: v.h.join(", "), C: String(v.C) }),
  presets: [
    { id: "classic", label: "1, 2, 3, 4, 5 with C = 6", value: { h: [1, 2, 3, 4, 5], C: 6 } },
    {
      id: "spread",
      label: "Uneven heights, C = 20",
      value: { h: [0, 3, 4, 10, 11, 17, 25, 26], C: 20 },
    },
    { id: "cheap", label: "C = 0: hop to every stone", value: { h: [2, 5, 9, 14, 20], C: 0 } },
  ],
  random(rng, size) {
    const n = Math.max(2, Math.min(MAX_STONES, size ?? 8));
    const h: number[] = [];
    let x = rng.int(0, 5);
    for (let i = 0; i < n && x <= 100; i++, x += rng.int(1, 8)) h.push(x);
    return { h: h.length >= 2 ? h : [0, 1], C: rng.int(0, 60) };
  },
};

/**
 * Convex hull trick, on the frog problem: dp[i] = min over j < i of dp[j] + (h[i] − h[j])² + C.
 * Expanding the square, each j contributes a line y = −2h[j]·x + (dp[j] + h[j]²) evaluated
 * at x = h[i]. Slopes decrease and queries increase, so a deque of the lines on the
 * lower envelope answers every query in amortised O(1): O(n) instead of O(n²).
 */
export const convexHullTrick: AlgorithmModule<FrogInput, FrogOutput> = {
  id: "convex-hull-trick",
  version: 1,
  pseudocode: [
    "procedure Frog(h, C)   // dp[i] = min over j < i of dp[j] + (h[i] − h[j])² + C",
    "  dp[0] ← 0;  deque ← [line 0]   // line j: y = −2h[j]·x + dp[j] + h[j]²",
    "  for i ← 1 to n − 1",
    "    while the second line is at least as low as the first at x = h[i]: pop the front",
    "    dp[i] ← (the front line at x = h[i]) + h[i]² + C",
    "    while the last line is never strictly lowest once line i is added: pop the back",
    "    push line i at the back",
    "  return dp[n − 1]",
  ],
  input,

  run(input, t) {
    const { h, C } = input;
    const n = h.length;
    t.array("h", h as Scalar[], { label: "Heights h", display: "cells" });
    const DP = t.array(
      "dp",
      h.map((): Scalar => null),
      { label: "dp[i]: cheapest way to reach stone i", display: "cells" },
    );
    const Q = t.sequence("Q", "deque", { label: "Lines on the lower envelope (by stone index)" });
    const dp = new Array<number>(n).fill(0);
    const m = (j: number) => -2 * h[j]!;
    const b = (j: number) => dp[j]! + h[j]! ** 2;
    const at = (j: number, x: number) => m(j) * x + b(j);
    const lineName = (j: number) => `${j}: ${m(j)}x + ${b(j)}`;
    // Line q is useless between p and r (slopes m(p) > m(q) > m(r)) when p and r meet
    // at or left of where p and q meet; compared by cross-multiplying, exactly.
    const useless = (p: number, q: number, r: number) =>
      (b(r) - b(p)) * (m(p) - m(q)) <= (b(q) - b(p)) * (m(p) - m(r));

    DP.write(0, 0, { line: 2 });
    const deque = [0];
    Q.push(lineName(0), { line: 2, note: "Stone 0 costs nothing and contributes the first line." });
    let popsFront = 0;
    let popsBack = 0;
    for (let i = 1; i < n; i++) {
      const x = h[i]!;
      DP.pointer("i", i, { line: 3, vars: { i, x } });
      while (deque.length >= 2) {
        t.tally("line comparisons");
        if (at(deque[1]!, x) > at(deque[0]!, x)) break;
        Q.popFront({
          line: 4,
          note: `At x = ${x}, line ${deque[1]} (${at(deque[1]!, x)}) is at least as low as line ${deque[0]} (${at(deque[0]!, x)}); line ${deque[0]} will never be needed again.`,
        });
        deque.shift();
        popsFront++;
      }
      const j = deque[0]!;
      dp[i] = at(j, x) + x * x + C;
      DP.write(i, dp[i]!, {
        line: 5,
        vars: { j },
        note: `Jump from stone ${j}: ${at(j, x)} + ${x}² + ${C} = ${dp[i]} (= dp[${j}] + (${x} − ${h[j]})² + ${C}).`,
      });
      while (deque.length >= 2) {
        t.tally("line comparisons");
        if (!useless(deque[deque.length - 2]!, deque[deque.length - 1]!, i)) break;
        Q.popBack({
          line: 6,
          note: `Line ${deque[deque.length - 1]} lies above the envelope of lines ${deque[deque.length - 2]} and ${i} everywhere: drop it.`,
        });
        deque.pop();
        popsBack++;
      }
      deque.push(i);
      Q.push(lineName(i), { line: 7 });
    }
    DP.pointer("i", null, { line: 8 });
    DP.mark([n - 1], "found", { line: 8 });
    const output: FrogOutput = { dp, popsFront, popsBack };
    t.finish(input, output, {
      line: 8,
      vars: { i: null, x: null, j: null },
      note: `Minimum total cost ${dp[n - 1]}.`,
    });
    return output;
  },

  check(input, out) {
    // Independent oracle: the O(n²) dynamic programme.
    const { h, C } = input;
    const want = [0];
    for (let i = 1; i < h.length; i++) {
      let best = Infinity;
      for (let j = 0; j < i; j++) best = Math.min(best, want[j]! + (h[i]! - h[j]!) ** 2 + C);
      want.push(best);
    }
    if (JSON.stringify(out.dp) !== JSON.stringify(want)) return `dp ${out.dp}, expected ${want}`;
    // Every line enters once and leaves at most once.
    if (out.popsFront + out.popsBack > h.length - 1) return "more lines removed than were added";
    return null;
  },

  fidelity(state: TraceState, out) {
    const a = state.structures.dp;
    if (a?.kind !== "array") return "no array dp";
    return JSON.stringify(a.values) === JSON.stringify(out.dp) ? null : "dp differs";
  },

  describeOutput: (out) => `Minimum cost ${out.dp[out.dp.length - 1]}; dp = [${out.dp.join(", ")}]`,
};
