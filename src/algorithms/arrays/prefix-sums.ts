import type { Scalar } from "@/engine/protocol";
import type { TraceState } from "@/engine/state";
import type { AlgorithmModule } from "../types";
import { rangeQueryInput, type RangeQueryInput } from "./common";

export interface PrefixSumOutput {
  /** P[0..n], P[i] = A[0] + … + A[i − 1]. */
  prefix: number[];
  sums: number[];
}

const LIMITS = { minLength: 1, maxLength: 16, min: -99, max: 99 };

/**
 * Prefix sums: one pass builds P with P[i] = A[0] + … + A[i − 1]; afterwards every
 * range sum is a difference of two entries of P.
 */
export const prefixSums: AlgorithmModule<RangeQueryInput, PrefixSumOutput> = {
  id: "prefix-sums",
  version: 1,
  pseudocode: [
    "procedure build(A)",
    "  P[0] ← 0",
    "  for i ← 0 to n − 1: P[i + 1] ← P[i] + A[i]",
    "procedure sum(l, r)   // A[l] + … + A[r]",
    "  return P[r + 1] − P[l]",
  ],
  input: rangeQueryInput({
    limits: LIMITS,
    maxQueries: 6,
    presets: [
      {
        id: "classic",
        label: "Eight values",
        value: {
          values: [3, 1, 4, 1, 5, 9, 2, 6],
          queries: [
            [2, 5],
            [0, 7],
            [6, 6],
          ],
        },
      },
      {
        id: "negatives",
        label: "With negative values",
        value: {
          values: [5, -2, 7, -8, 4, -1],
          queries: [
            [0, 3],
            [1, 4],
          ],
        },
      },
    ],
  }),

  run(input, t) {
    const { values, queries } = input;
    const n = values.length;
    const A = t.array("A", values, { label: "A" });
    const P = t.array(
      "P",
      Array.from({ length: n + 1 }, (): Scalar => null),
      { label: "P[i] = A[0] + … + A[i − 1]", display: "cells" },
    );
    const prefix = [0];
    P.write(0, 0, { line: 2, note: "The sum of no elements is 0." });
    for (let i = 0; i < n; i++) {
      const a = A.read(i, { line: 3, vars: { i } }) as number;
      prefix.push(prefix[i]! + a);
      P.write(i + 1, prefix[i + 1]!, {
        line: 3,
        note: `P[${i + 1}] = P[${i}] + A[${i}] = ${prefix[i]} + ${a} = ${prefix[i + 1]}.`,
      });
    }
    const sums: number[] = [];
    for (const [l, r] of queries) {
      const cells = Array.from({ length: r - l + 1 }, (_, k) => l + k);
      A.mark(cells, "active", {
        line: 4,
        vars: { i: null, l, r },
        note: `Sum of A[${l}..${r}].`,
      });
      P.pointer("r+1", r + 1, { line: 5 });
      P.pointer("l", l, { line: 5 });
      P.read(r + 1, { line: 5 });
      P.read(l, { line: 5 });
      const s = prefix[r + 1]! - prefix[l]!;
      sums.push(s);
      t.step({
        line: 5,
        vars: { sum: s },
        note: `P[${r + 1}] − P[${l}] = ${prefix[r + 1]} − ${prefix[l]} = ${s}: two reads, however long the range.`,
      });
      A.mark(cells, null, { line: 5 });
      P.pointer("r+1", null, { line: 5 });
      P.pointer("l", null, { line: 5 });
    }
    const output: PrefixSumOutput = { prefix, sums };
    t.finish(input, output, {
      vars: { l: null, r: null, sum: null },
      note: "All ranges answered.",
    });
    return output;
  },

  check(input, out) {
    let running = 0;
    const want = [0, ...input.values.map((v) => (running += v))];
    if (JSON.stringify(want) !== JSON.stringify(out.prefix)) return "prefix array is wrong";
    const sums = input.queries.map(([l, r]) =>
      input.values.slice(l, r + 1).reduce((a, b) => a + b, 0),
    );
    return JSON.stringify(sums) === JSON.stringify(out.sums)
      ? null
      : `sums ${out.sums}, expected ${sums}`;
  },

  fidelity(state: TraceState, out) {
    const p = state.structures.P;
    if (p?.kind !== "array") return "no array P";
    return JSON.stringify(p.values) === JSON.stringify(out.prefix)
      ? null
      : `P shows ${p.values.join(",")}`;
  },

  describeOutput: (out) => `Sums: ${out.sums.join(", ") || "—"}`,
};
