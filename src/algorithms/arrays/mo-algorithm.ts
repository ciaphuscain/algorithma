import type { TraceState } from "@/engine/state";
import type { AlgorithmModule } from "../types";
import { rangeQueryInput, type RangeQueryInput } from "./common";

export interface MoOutput {
  /** Number of distinct values in each query range, in input order. */
  answers: number[];
  /** Query indices in the order they were processed. */
  order: number[];
}

const LIMITS = { minLength: 1, maxLength: 16, min: 1, max: 9 };

/** Mo's order: by the block of the left end, then by the right end. */
export function moOrder(queries: [number, number][], b: number): number[] {
  return queries
    .map((q, i) => ({ blk: Math.floor(q[0] / b), r: q[1], i }))
    .sort((x, y) => x.blk - y.blk || x.r - y.r || x.i - y.i)
    .map((x) => x.i);
}

/**
 * Mo's algorithm: answer many range queries offline by reordering them so that a
 * sliding window [L, R] moves little between consecutive queries. Queries are sorted by
 * the block (of size about √n) holding their left end, then by their right end; the
 * window then moves O((n + q)√n) steps in total. Here each query asks how many
 * distinct values its range holds, which needs a count per value.
 */
export const moAlgorithm: AlgorithmModule<RangeQueryInput, MoOutput> = {
  id: "mo-algorithm",
  version: 1,
  pseudocode: [
    "b ← ⌈√n⌉;  sort the queries by (⌊l / b⌋, r)",
    "L ← 0;  R ← −1;  distinct ← 0   // the window A[L..R] is empty",
    "for each query (l, r) in that order",
    "  while R < r: R ← R + 1;  add(A[R])",
    "  while L > l: L ← L − 1;  add(A[L])",
    "  while R > r: remove(A[R]);  R ← R − 1",
    "  while L < l: remove(A[L]);  L ← L + 1",
    "  answer ← distinct",
    "add(x): count[x] ← count[x] + 1; if it became 1: distinct ← distinct + 1  (remove: the reverse)",
  ],
  input: rangeQueryInput({
    limits: LIMITS,
    maxQueries: 6,
    presets: [
      {
        id: "classic",
        label: "Five queries",
        value: {
          values: [1, 2, 1, 3, 2, 2, 4, 1, 3],
          queries: [
            [0, 4],
            [6, 8],
            [1, 3],
            [2, 7],
            [4, 5],
          ],
        },
      },
      {
        id: "nested",
        label: "Nested ranges",
        value: {
          values: [5, 5, 6, 7, 6, 5, 8, 8],
          queries: [
            [0, 7],
            [1, 6],
            [2, 5],
            [3, 4],
          ],
        },
      },
    ],
  }),

  run(inp, t) {
    const { values, queries } = inp;
    const n = values.length;
    const b = Math.max(1, Math.ceil(Math.sqrt(n)));
    const A = t.array("A", values, { label: `A (blocks of ${b})`, display: "cells" });
    const C = t.array("C", new Array(LIMITS.max + 1).fill(0), {
      label: "count[x] for x = 0..9",
      display: "cells",
    });
    const order = moOrder(queries, b);
    t.step({
      line: 1,
      vars: { b, order: order.map((i) => `q${i}`).join(" ") },
      note: `Sort the queries by (⌊l / ${b}⌋, r): ${order.map((i) => `q${i} [${queries[i]![0]},${queries[i]![1]}]`).join(", ")}.`,
    });
    let L = 0;
    let R = -1;
    let distinct = 0;
    const add = (i: number, line: number) => {
      const x = A.read(i, { line }) as number;
      C.write(x, C.num(x) + 1, { line: 9 });
      if (C.num(x) === 1) distinct++;
      A.mark([i], "active", { line, vars: { L, R, distinct } });
      t.tally("moves");
    };
    const remove = (i: number, line: number) => {
      const x = A.read(i, { line }) as number;
      C.write(x, C.num(x) - 1, { line: 9 });
      if (C.num(x) === 0) distinct--;
      A.mark([i], null, { line, vars: { L, R, distinct } });
      t.tally("moves");
    };
    const answers = new Array<number>(queries.length).fill(0);
    t.step({ line: 2, vars: { L, R, distinct } });
    for (const qi of order) {
      const [l, r] = queries[qi]!;
      t.step({ line: 3, vars: { query: `q${qi}`, l, r }, note: `Query q${qi}: A[${l}..${r}].` });
      while (R < r) add(++R, 4);
      while (L > l) add(--L, 5);
      while (R > r) remove(R--, 6);
      while (L < l) remove(L++, 7);
      A.pointer("L", L, { line: 8 });
      A.pointer("R", R, { line: 8 });
      answers[qi] = distinct;
      t.step({
        line: 8,
        vars: { L, R, distinct },
        note: `A[${l}..${r}] holds ${distinct} distinct value${distinct === 1 ? "" : "s"}.`,
      });
    }
    const output: MoOutput = { answers, order };
    t.finish(inp, output, { note: `Answers in input order: ${answers.join(", ")}.` });
    return output;
  },

  check(inp, out) {
    const want = inp.queries.map(([l, r]) => new Set(inp.values.slice(l, r + 1)).size);
    if (JSON.stringify(want) !== JSON.stringify(out.answers))
      return `answers ${out.answers}, expected ${want}`;
    // The processing order must be sorted by (block of l, r).
    const b = Math.max(1, Math.ceil(Math.sqrt(inp.values.length)));
    const key = (i: number) => [Math.floor(inp.queries[i]![0] / b), inp.queries[i]![1]] as const;
    if ([...out.order].sort((x, y) => x - y).join() !== inp.queries.map((_, i) => i).join())
      return "order is not a permutation of the queries";
    for (let k = 1; k < out.order.length; k++) {
      const [p, q] = [key(out.order[k - 1]!), key(out.order[k]!)];
      if (p[0] > q[0] || (p[0] === q[0] && p[1] > q[1]))
        return "queries processed out of Mo's order";
    }
    return null;
  },

  fidelity(state: TraceState, out) {
    const A = state.structures.A;
    const C = state.structures.C;
    if (A?.kind !== "array" || C?.kind !== "array") return "missing arrays";
    const win = A.marks.flatMap((m, i) => (m === "active" ? [i] : []));
    const distinct = C.values.filter((c) => (c as number) > 0).length;
    const last = out.order.at(-1);
    if (last === undefined) return win.length === 0 ? null : "window should be empty";
    if (win.length === 0 || win[0] !== A.pointers.L || win.at(-1) !== A.pointers.R)
      return "the marked window does not match L and R";
    for (let x = 0; x < C.values.length; x++) {
      const c = win.filter((i) => A.values[i] === x).length;
      if (C.values[x] !== c) return `count[${x}] = ${C.values[x]}, window holds ${c}`;
    }
    return distinct === out.answers[last] ? null : "the counts disagree with the last answer";
  },

  describeOutput: (o) => `Distinct values per query: ${o.answers.join(", ") || "—"}`,
};
