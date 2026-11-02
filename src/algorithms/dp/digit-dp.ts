import type { Scalar } from "@/engine/protocol";
import type { TraceState } from "@/engine/state";
import type { AlgorithmModule, InputSpec } from "../types";

export interface DigitInput {
  N: number;
  S: number;
}

export interface DigitOutput {
  count: number;
  /** Calls to f, and how many were answered from the memo. */
  calls: number;
  memoHits: number;
}

const MAX_N = 1_000_000;
const MAX_S = 27;

const input: InputSpec<DigitInput> = {
  fields: [
    { name: "N", label: "N (count numbers from 0 to N)", placeholder: "e.g. 345" },
    { name: "S", label: "Digit sum S", placeholder: "e.g. 10" },
  ],
  constraints: `0 ≤ N ≤ ${MAX_N.toLocaleString("en")}; 0 ≤ S ≤ ${MAX_S}.`,
  parse(fields) {
    const [nt, st] = [(fields.N ?? "").trim(), (fields.S ?? "").trim()];
    const errors: string[] = [];
    if (!/^\d+$/.test(nt) || Number(nt) > MAX_N)
      errors.push(`N must be a whole number from 0 to ${MAX_N}`);
    if (!/^\d+$/.test(st) || Number(st) > MAX_S)
      errors.push(`S must be a whole number from 0 to ${MAX_S}`);
    return errors.length
      ? { ok: false, errors }
      : { ok: true, value: { N: Number(nt), S: Number(st) } };
  },
  format: (v) => ({ N: String(v.N), S: String(v.S) }),
  presets: [
    { id: "classic", label: "0 … 345 with digit sum 10", value: { N: 345, S: 10 } },
    { id: "round", label: "0 … 1000 with digit sum 3", value: { N: 1000, S: 3 } },
    { id: "large", label: "0 … 999,999 with digit sum 27", value: { N: 999_999, S: 27 } },
  ],
  random(rng, size) {
    const N = rng.int(
      0,
      Math.min(MAX_N, 10 ** Math.max(1, Math.min(6, Math.ceil((size ?? 8) / 2)))),
    );
    return { N, S: rng.int(0, 18) };
  },
};

/**
 * Digit DP: count x in [0, N] with digit sum S by filling digits from the most
 * significant. While the prefix equals N's prefix ("tight"), the next digit is capped
 * by N's digit; once it is smaller, the rest is free, and the count depends only on
 * (position, remaining sum), so it is memoized. O(digits · S · 10) work.
 */
export const digitDp: AlgorithmModule<DigitInput, DigitOutput> = {
  id: "digit-dp",
  version: 1,
  pseudocode: [
    "procedure Count(N, S)   // how many x in [0, N] have digit sum S",
    "  d ← the digits of N, most significant first;  return f(0, S, tight = true)",
    "function f(pos, rem, tight)   // ways to choose digits pos … end with sum rem",
    "  if pos = |d|: return 1 if rem = 0 else 0",
    "  if not tight and memo[pos][rem] is known: return it",
    "  limit ← d[pos] if tight else 9",
    "  total ← Σ for x from 0 to min(limit, rem) of f(pos + 1, rem − x, tight and x = limit)",
    "  if not tight: memo[pos][rem] ← total",
    "  return total",
  ],
  input,

  run(input, t) {
    const { N, S } = input;
    const d = String(N).split("").map(Number);
    const L = d.length;
    const DIG = t.array("d", d as Scalar[], { label: "Digits of N", display: "cells" });
    const M = t.grid("memo", L + 1, S + 1, null, {
      label: "memo[pos][rem]: free fillings of positions pos … end with digit sum rem",
      rowHeaders: Array.from({ length: L + 1 }, (_, p) => (p === L ? "end" : `pos ${p}`)),
      colHeaders: Array.from({ length: S + 1 }, (_, r) => `rem ${r}`),
    });
    const memo: (number | null)[][] = Array.from({ length: L + 1 }, () =>
      new Array(S + 1).fill(null),
    );
    let calls = 0;
    let memoHits = 0;

    const f = (pos: number, rem: number, tight: boolean): number => {
      calls++;
      t.tally("calls");
      if (pos === L) return rem === 0 ? 1 : 0;
      if (!tight && memo[pos]![rem] !== null) {
        memoHits++;
        t.tally("memo hits");
        M.read([[pos, rem]], { line: 5 });
        return memo[pos]![rem]!;
      }
      if (tight) DIG.pointer("tight", pos, { line: 6, vars: { pos, rem, tight: true } });
      const limit = tight ? d[pos]! : 9;
      let total = 0;
      for (let x = 0; x <= Math.min(limit, rem); x++)
        total += f(pos + 1, rem - x, tight && x === limit);
      if (!tight) {
        memo[pos]![rem] = total;
        M.write(pos, rem, total, {
          line: 8,
          vars: { pos, rem, tight: false },
          note: `${total} way${total === 1 ? "" : "s"} to fill the last ${L - pos} digit${L - pos === 1 ? "" : "s"} freely with sum ${rem}.`,
        });
      } else {
        DIG.pointer("tight", pos, {
          line: 7,
          vars: { pos, rem, tight: true, total },
          note: `Tight at position ${pos} (digit ${d[pos]}): ${total} way${total === 1 ? "" : "s"} with sum ${rem} that stay ≤ N.`,
        });
      }
      return total;
    };
    const count = f(0, S, true);
    DIG.pointer("tight", null, { line: 2 });
    const output: DigitOutput = { count, calls, memoHits };
    t.finish(input, output, {
      line: 2,
      vars: { pos: null, rem: null, tight: null, total: null },
      note: `${count} number${count === 1 ? "" : "s"} from 0 to ${N} ha${count === 1 ? "s" : "ve"} digit sum ${S}.`,
    });
    return output;
  },

  check(input, out) {
    // Independent oracle: add up the digits of every number from 0 to N.
    let count = 0;
    for (let x = 0; x <= input.N; x++) {
      let s = 0;
      for (let y = x; y > 0; y = Math.floor(y / 10)) s += y % 10;
      if (s === input.S) count++;
    }
    if (out.count !== count) return `count ${out.count}, expected ${count}`;
    const L = String(input.N).length;
    // Each free state (pos, rem) and each tight position expands once, into ≤ 10 calls.
    if (out.calls > 1 + 10 * L * (input.S + 2)) return `${out.calls} calls exceed the state bound`;
    return null;
  },

  fidelity(state: TraceState) {
    // Every memo cell shown must count the free digit strings of that length and sum.
    const g = state.structures.memo;
    if (g?.kind !== "grid") return "no grid memo";
    const L = g.rows - 1;
    // ways[k][r]: strings of k digits (leading zeros allowed) with digit sum r.
    const ways = [[1, ...new Array<number>(g.cols - 1).fill(0)]];
    for (let k = 1; k <= L; k++)
      ways.push(
        Array.from({ length: g.cols }, (_, r) => {
          let w = 0;
          for (let x = 0; x <= Math.min(9, r); x++) w += ways[k - 1]![r - x]!;
          return w;
        }),
      );
    for (let pos = 0; pos < g.rows; pos++)
      for (let rem = 0; rem < g.cols; rem++) {
        const v = g.cells[pos]![rem];
        if (v !== null && v !== ways[L - pos]![rem]) return `memo[${pos}][${rem}] shows ${v}`;
      }
    return null;
  },

  describeOutput: (out) =>
    `${out.count} numbers (${out.calls} calls, ${out.memoHits} from the memo)`,
};
