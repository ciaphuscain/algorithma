import type { TraceState } from "@/engine/state";
import type { AlgorithmModule } from "../types";
import { rangeQueryInput, type RangeQueryInput } from "./common";

export interface SparseTableOutput {
  /** table[j][i] = min of A[i .. i + 2^j − 1]; null where the block does not fit. */
  table: (number | null)[][];
  answers: number[];
}

const LIMITS = { minLength: 1, maxLength: 16, min: -99, max: 99 };
const levels = (n: number) => Math.floor(Math.log2(n)) + 1;

/**
 * Sparse table for range-minimum queries on a static array: row j stores the minimum
 * of every block of length 2^j, built from two blocks of row j − 1. A query covers its
 * range with two (possibly overlapping) blocks, which is fine for min: O(1) per query.
 */
export const sparseTable: AlgorithmModule<RangeQueryInput, SparseTableOutput> = {
  id: "sparse-table",
  version: 1,
  pseudocode: [
    "procedure build(A)",
    "  ST[0][i] ← A[i] for every i",
    "  for j ← 1 while 2^j ≤ n",
    "    for i ← 0 to n − 2^j",
    "      ST[j][i] ← min(ST[j−1][i], ST[j−1][i + 2^(j−1)])   // two halves",
    "procedure query(l, r)",
    "  j ← ⌊log₂(r − l + 1)⌋",
    "  return min(ST[j][l], ST[j][r − 2^j + 1])   // two blocks covering [l, r]",
  ],
  input: rangeQueryInput({
    limits: LIMITS,
    maxQueries: 6,
    presets: [
      {
        id: "classic",
        label: "Eight values",
        value: {
          values: [5, 2, 4, 7, 6, 3, 1, 2],
          queries: [
            [0, 4],
            [3, 6],
            [2, 3],
          ],
        },
      },
      {
        id: "single",
        label: "Single-element ranges",
        value: {
          values: [9, -4, 8],
          queries: [
            [1, 1],
            [0, 2],
          ],
        },
      },
    ],
  }),

  run(input, t) {
    const { values, queries } = input;
    const n = values.length;
    const K = levels(n);
    const A = t.array("A", values, { label: "A" });
    const ST = t.grid("ST", K, n, null, {
      label: "ST[j][i] = min of A[i .. i + 2^j − 1]",
      rowHeaders: Array.from({ length: K }, (_, j) => `j=${j} (len ${2 ** j})`),
      colHeaders: values.map((_, i) => String(i)),
    });
    const table: (number | null)[][] = Array.from({ length: K }, () => values.map(() => null));
    for (let i = 0; i < n; i++) {
      table[0]![i] = values[i]!;
      ST.write(0, i, values[i]!, { line: 2 });
    }
    t.step({
      line: 2,
      vars: { j: 0 },
      note: "Row 0: blocks of length 1 are the elements themselves.",
    });
    for (let j = 1; j < K; j++) {
      const half = 2 ** (j - 1);
      for (let i = 0; i + 2 ** j <= n; i++) {
        const [a, b] = [table[j - 1]![i]!, table[j - 1]![i + half]!];
        ST.read(
          [
            [j - 1, i],
            [j - 1, i + half],
          ],
          { line: 5, vars: { j, i } },
        );
        t.tally("comparisons");
        table[j]![i] = Math.min(a, b);
        ST.write(j, i, table[j]![i]!, {
          line: 5,
          note: `A[${i}..${i + 2 ** j - 1}] is A[${i}..${i + half - 1}] and A[${i + half}..${i + 2 ** j - 1}]: min(${a}, ${b}) = ${table[j]![i]}.`,
        });
      }
    }
    const answers: number[] = [];
    for (const [l, r] of queries) {
      const j = Math.floor(Math.log2(r - l + 1));
      const right = r - 2 ** j + 1;
      const cells = Array.from({ length: r - l + 1 }, (_, k) => l + k);
      A.mark(cells, "active", {
        line: 6,
        vars: { l, r, i: null },
        note: `Minimum of A[${l}..${r}].`,
      });
      ST.read(
        [
          [j, l],
          [j, right],
        ],
        {
          line: 8,
          vars: { j },
          note: `Length ${r - l + 1}: use the blocks of length ${2 ** j} starting at ${l} and at ${right}. Together they cover A[${l}..${r}]; where they overlap, counting an element twice does not change a minimum.`,
        },
      );
      t.tally("comparisons");
      const m = Math.min(table[j]![l]!, table[j]![right]!);
      answers.push(m);
      t.step({
        line: 8,
        vars: { min: m },
        note: `min(${table[j]![l]}, ${table[j]![right]}) = ${m}.`,
      });
      A.mark(cells, null, { line: 8 });
    }
    const output: SparseTableOutput = { table, answers };
    t.finish(input, output, {
      vars: { l: null, r: null, j: null, min: null },
      note: "All queries answered.",
    });
    return output;
  },

  check(input, out) {
    const want = input.queries.map(([l, r]) => Math.min(...input.values.slice(l, r + 1)));
    if (JSON.stringify(want) !== JSON.stringify(out.answers))
      return `answers ${out.answers}, expected ${want}`;
    const n = input.values.length;
    for (let j = 0; j < levels(n); j++)
      for (let i = 0; i < n; i++) {
        const len = 2 ** j;
        const expected = i + len <= n ? Math.min(...input.values.slice(i, i + len)) : null;
        if (out.table[j]![i] !== expected)
          return `ST[${j}][${i}] = ${out.table[j]![i]}, expected ${expected}`;
      }
    return null;
  },

  fidelity(state: TraceState, out) {
    const g = state.structures.ST;
    if (g?.kind !== "grid") return "no grid ST";
    return JSON.stringify(g.cells) === JSON.stringify(out.table) ? null : "table differs";
  },

  describeOutput: (out) => `Minima: ${out.answers.join(", ") || "—"}`,
};
