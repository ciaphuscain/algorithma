import type { Scalar } from "@/engine/protocol";
import type { TraceState } from "@/engine/state";
import type { AlgorithmModule } from "../types";
import { rangeQueryInput, type RangeQueryInput } from "./common";
import { moAlgorithm } from "./mo-algorithm";

export interface OfflineOutput {
  answers: number[];
  /** Query indices in the order they were answered (by right end). */
  order: number[];
}

/**
 * Offline query processing: when all queries are known in advance, answer them in an
 * order that suits the algorithm rather than the order asked. Here: the number of
 * distinct values in A[l..r]. Sweep r from left to right and keep a mark at the last
 * occurrence of each value seen so far; then the distinct count of A[l..r] is the number
 * of marks in [l, r], a range sum kept in a Fenwick tree. Queries are sorted by r and
 * answered when the sweep reaches their right end: O((n + q) log n) in all.
 */
export const offlineQueries: AlgorithmModule<RangeQueryInput, OfflineOutput> = {
  id: "offline-distinct-queries",
  version: 1,
  pseudocode: [
    "sort the queries by r",
    "for r ← 0 to n − 1",
    "  if A[r] was seen before at position p: M[p] ← 0   // only the last occurrence counts",
    "  M[r] ← 1;  last[A[r]] ← r   (each change of M updates the Fenwick tree F)",
    "  for each query (l, r) ending here: answer ← M[l] + … + M[r]   // two prefix sums in F",
  ],
  input: rangeQueryInput({
    limits: { minLength: 1, maxLength: 16, min: 1, max: 9 },
    maxQueries: 6,
    presets: moAlgorithm.input.presets,
  }),

  run(inp, t) {
    const { values, queries } = inp;
    const n = values.length;
    const A = t.array("A", values, { label: "A", display: "cells" });
    const M = t.array("M", new Array(n).fill(0), {
      label: "M[i] = 1 if A[i] is the last occurrence so far",
      display: "cells",
    });
    const F = t.array(
      "F",
      Array.from({ length: n + 1 }, (_, i): Scalar => (i === 0 ? null : 0)),
      { label: "F (Fenwick tree over M, 1-based)", display: "cells" },
    );
    const fenAdd = (i: number, d: number) => {
      for (let k = i + 1; k <= n; k += k & -k) F.write(k, F.num(k) + d, { line: 4 });
    };
    const prefix = (i: number) => {
      // M[0] + … + M[i − 1]
      let s = 0;
      for (let k = i; k > 0; k -= k & -k) s += F.read(k, { line: 5 }) as number;
      return s;
    };
    const order = queries
      .map((q, i) => ({ r: q[1], i }))
      .sort((a, b) => a.r - b.r || a.i - b.i)
      .map((x) => x.i);
    t.step({
      line: 1,
      vars: { order: order.map((i) => `q${i}`).join(" ") },
      note: `Answer the queries by right end: ${order.map((i) => `q${i} [${queries[i]![0]},${queries[i]![1]}]`).join(", ")}.`,
    });
    const last = new Map<number, number>();
    const answers = new Array<number>(queries.length).fill(0);
    let next = 0;
    for (let r = 0; r < n; r++) {
      if (next >= order.length) break;
      A.pointer("r", r, { line: 2, vars: { r } });
      const x = A.read(r, { line: 2 }) as number;
      const p = last.get(x);
      if (p !== undefined) {
        M.write(p, 0, {
          line: 3,
          note: `${x} appeared at ${p}; only its newest copy, at ${r}, keeps a mark.`,
        });
        fenAdd(p, -1);
      }
      M.write(r, 1, { line: 4 });
      fenAdd(r, 1);
      last.set(x, r);
      while (next < order.length && queries[order[next]!]![1] === r) {
        const qi = order[next++]!;
        const l = queries[qi]![0];
        A.mark(
          Array.from({ length: r - l + 1 }, (_, k) => l + k),
          "active",
          { line: 5, vars: { query: `q${qi}`, l } },
        );
        const ans = prefix(r + 1) - prefix(l);
        answers[qi] = ans;
        t.step({
          line: 5,
          vars: { answer: ans },
          note: `q${qi}: marks in M[${l}..${r}] = ${ans} distinct value${ans === 1 ? "" : "s"}.`,
        });
        A.mark(
          Array.from({ length: r - l + 1 }, (_, k) => l + k),
          null,
          { line: 5 },
        );
      }
    }
    A.pointer("r", null, { line: 5 });
    const output: OfflineOutput = { answers, order };
    t.finish(inp, output, { note: `Answers in input order: ${answers.join(", ")}.` });
    return output;
  },

  check(inp, out) {
    const want = inp.queries.map(([l, r]) => new Set(inp.values.slice(l, r + 1)).size);
    if (JSON.stringify(want) !== JSON.stringify(out.answers))
      return `answers ${out.answers}, expected ${want}`;
    const rs = out.order.map((i) => inp.queries[i]![1]);
    if ([...out.order].sort((a, b) => a - b).join() !== inp.queries.map((_, i) => i).join())
      return "order is not a permutation of the queries";
    return rs.every((r, k) => k === 0 || rs[k - 1]! <= r)
      ? null
      : "queries not answered by right end";
  },

  fidelity(state: TraceState) {
    // F must be the Fenwick tree of M: F[k] = M[k − lowbit(k) .. k − 1].
    const M = state.structures.M;
    const F = state.structures.F;
    if (M?.kind !== "array" || F?.kind !== "array") return "missing arrays";
    for (let k = 1; k < F.values.length; k++) {
      let s = 0;
      for (let i = k - (k & -k); i < k; i++) s += M.values[i] as number;
      if (F.values[k] !== s) return `F[${k}] = ${F.values[k]}, expected ${s}`;
    }
    // Each value seen keeps at most one mark.
    const A = state.structures.A;
    if (A?.kind !== "array") return "no array A";
    const marked = A.values.filter((_, i) => M.values[i] === 1);
    return new Set(marked).size === marked.length ? null : "a value has two marks";
  },

  describeOutput: (o) => `Distinct values per query: ${o.answers.join(", ") || "—"}`,
};
