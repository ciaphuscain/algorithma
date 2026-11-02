import type { TraceState } from "@/engine/state";
import type { AlgorithmModule, InputSpec } from "../types";

export interface BinomialInput {
  n: number;
  k: number;
}

export interface MemoTabOutput {
  value: number;
  /** Calls made by the memoized recursion, including ones answered from the memo. */
  calls: number;
  /** Distinct subproblems the recursion touched (stored in the memo). */
  memoStates: number;
  /** Cells the bottom-up table fills. */
  tableCells: number;
  /** Calls plain recursion without a memo would make: 2·C(n, k) − 1. */
  naiveCalls: number;
}

const MAX_N = 12;

const binomialInput: InputSpec<BinomialInput> = {
  fields: [
    { name: "n", label: "n", placeholder: "e.g. 6" },
    { name: "k", label: "k", placeholder: "e.g. 3" },
  ],
  constraints: `0 ≤ k ≤ n ≤ ${MAX_N}.`,
  parse(fields) {
    const [nt, kt] = [(fields.n ?? "").trim(), (fields.k ?? "").trim()];
    const errors: string[] = [];
    if (!/^\d+$/.test(nt) || Number(nt) > MAX_N)
      errors.push(`n must be a whole number from 0 to ${MAX_N}`);
    if (!/^\d+$/.test(kt)) errors.push("k must be a whole number");
    else if (errors.length === 0 && Number(kt) > Number(nt)) errors.push("k cannot exceed n");
    return errors.length
      ? { ok: false, errors }
      : { ok: true, value: { n: Number(nt), k: Number(kt) } };
  },
  format: (v) => ({ n: String(v.n), k: String(v.k) }),
  presets: [
    { id: "classic", label: "C(6, 3)", value: { n: 6, k: 3 } },
    { id: "edge", label: "C(8, 2): a narrow band", value: { n: 8, k: 2 } },
    { id: "small", label: "C(4, 2)", value: { n: 4, k: 2 } },
  ],
  random(rng, size) {
    const n = Math.min(MAX_N, Math.max(0, size ?? 6));
    return { n, k: rng.int(0, n) };
  },
};

/**
 * The same recurrence, C(a, b) = C(a − 1, b − 1) + C(a − 1, b), solved two ways.
 * Top-down memoization recurses from C(n, k) and caches each answer, so it touches
 * only the subproblems it needs. Bottom-up tabulation fills a table in an order where
 * every dependency is ready, with no recursion, but fills cells it may never need.
 */
export const memoVsTab: AlgorithmModule<BinomialInput, MemoTabOutput> = {
  id: "memoization-tabulation",
  version: 1,
  pseudocode: [
    "function C(a, b)   // top-down, with a memo",
    "  if b = 0 or b = a: memo[a][b] ← 1;  return 1",
    "  if memo[a][b] is set: return memo[a][b]   // solved before: reuse",
    "  memo[a][b] ← C(a − 1, b − 1) + C(a − 1, b);  return memo[a][b]",
    "bottom-up: for a ← 0 to n",
    "  for b ← 0 to min(a, k)",
    "    table[a][b] ← 1 if b = 0 or b = a, else table[a − 1][b − 1] + table[a − 1][b]",
    "both give C(n, k)",
  ],
  input: binomialInput,

  run(input, t) {
    const { n, k } = input;
    const headers = {
      rowHeaders: Array.from({ length: n + 1 }, (_, a) => `a=${a}`),
      colHeaders: Array.from({ length: k + 1 }, (_, b) => `b=${b}`),
    };
    const MEMO = t.grid("memo", n + 1, k + 1, null, { label: "Top-down: memo[a][b]", ...headers });
    const STACK = t.sequence("stack", "stack", { label: "Call stack" });
    const memo = new Map<string, number>();
    let calls = 0;

    const C = (a: number, b: number): number => {
      calls++;
      t.tally("calls");
      STACK.push(`C(${a},${b})`, { line: 1, vars: { a, b } });
      let value: number;
      if (b === 0 || b === a) {
        value = 1;
        memo.set(`${a},${b}`, 1);
        MEMO.write(a, b, 1, { line: 2 });
        MEMO.mark([[a, b]], "base", { line: 2, note: `C(${a}, ${b}) = 1: a base case.` });
      } else if (memo.has(`${a},${b}`)) {
        value = memo.get(`${a},${b}`)!;
        t.tally("memo hits");
        MEMO.read([[a, b]], { line: 3, note: `C(${a}, ${b}) was solved before: reuse ${value}.` });
      } else {
        MEMO.mark([[a, b]], "active", { line: 4 });
        value = C(a - 1, b - 1) + C(a - 1, b);
        memo.set(`${a},${b}`, value);
        MEMO.write(a, b, value, { line: 4, vars: { a, b } });
        MEMO.mark([[a, b]], "filled", {
          line: 4,
          note: `C(${a}, ${b}) = C(${a - 1}, ${b - 1}) + C(${a - 1}, ${b}) = ${value}; store it.`,
        });
      }
      STACK.pop({ line: 4 });
      return value;
    };
    const value = C(n, k);
    t.step({
      line: 4,
      vars: { a: null, b: null },
      note: `Top-down: ${calls} calls, ${memo.size} distinct subproblems.`,
    });

    const TABLE = t.grid("table", n + 1, k + 1, null, {
      label: "Bottom-up: table[a][b]",
      ...headers,
    });
    const table: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(k + 1).fill(0));
    let cells = 0;
    for (let a = 0; a <= n; a++) {
      for (let b = 0; b <= Math.min(a, k); b++) {
        cells++;
        if (b === 0 || b === a) {
          table[a]![b] = 1;
          TABLE.write(a, b, 1, { line: 7, vars: { a, b } });
          TABLE.mark([[a, b]], "base", { line: 7 });
        } else {
          TABLE.read(
            [
              [a - 1, b - 1],
              [a - 1, b],
            ],
            { line: 7, vars: { a, b } },
          );
          table[a]![b] = table[a - 1]![b - 1]! + table[a - 1]![b]!;
          TABLE.write(a, b, table[a]![b]!, { line: 7 });
          TABLE.mark([[a, b]], "filled", { line: 7 });
        }
      }
    }
    TABLE.mark([[n, k]], "path", { line: 8 });
    MEMO.mark([[n, k]], "path", { line: 8 });
    const output: MemoTabOutput = {
      value,
      calls,
      memoStates: memo.size,
      tableCells: cells,
      naiveCalls: 2 * value - 1,
    };
    t.finish(input, output, {
      line: 8,
      vars: { a: null, b: null },
      note: `C(${n}, ${k}) = ${value}. Top-down solved ${memo.size} subproblems in ${calls} calls; bottom-up filled ${cells} cells; plain recursion would make ${output.naiveCalls} calls.`,
    });
    return output;
  },

  check(input, out) {
    // Independent oracles: the multiplicative formula and closed-form counts.
    const { n, k } = input;
    let c = 1;
    for (let i = 1; i <= k; i++) c = (c * (n - k + i)) / i;
    if (out.value !== c) return `C(${n}, ${k}) = ${out.value}, expected ${c}`;
    const inner = k > 0 && k < n ? k * (n - k) : 0;
    const states = inner > 0 ? inner + n : 1;
    if (out.memoStates !== states) return `${out.memoStates} memo states, expected ${states}`;
    if (out.calls !== 1 + 2 * inner) return `${out.calls} calls, expected ${1 + 2 * inner}`;
    let cells = 0;
    for (let a = 0; a <= n; a++) cells += Math.min(a, k) + 1;
    if (out.tableCells !== cells) return `${out.tableCells} table cells, expected ${cells}`;
    if (out.naiveCalls !== 2 * c - 1) return `naive calls ${out.naiveCalls}, expected ${2 * c - 1}`;
    return null;
  },

  fidelity(state: TraceState, out) {
    const memo = state.structures.memo;
    const table = state.structures.table;
    if (memo?.kind !== "grid" || table?.kind !== "grid") return "missing a table";
    const filled = memo.cells.flat().filter((x) => x !== null).length;
    if (filled !== out.memoStates) return `memo shows ${filled} cells`;
    if (table.cells.flat().filter((x) => x !== null).length !== out.tableCells)
      return "table cell count differs";
    const last = table.cells[table.rows - 1]![table.cols - 1];
    return last === out.value ? null : `table[n][k] shows ${last}`;
  },

  describeOutput: (out) =>
    `C(n, k) = ${out.value}; top-down: ${out.memoStates} subproblems, ${out.calls} calls; bottom-up: ${out.tableCells} cells`,
};
