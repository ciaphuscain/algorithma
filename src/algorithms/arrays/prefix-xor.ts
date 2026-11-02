import type { Scalar } from "@/engine/protocol";
import type { TraceState } from "@/engine/state";
import type { AlgorithmModule } from "../types";
import { rangeQueryInput, type RangeQueryInput } from "./common";

export interface PrefixXorOutput {
  /** X[0..n], X[i] = A[0] ⊕ … ⊕ A[i − 1]. */
  prefix: number[];
  xors: number[];
}

const LIMITS = { minLength: 1, maxLength: 16, min: 0, max: 255 };
const bits = (v: number) => v.toString(2).padStart(8, "0");

/**
 * Prefix XOR: like prefix sums, with XOR in place of addition. X[i] is the XOR of the
 * first i elements; since x ⊕ x = 0, the XOR of A[l..r] is X[r + 1] ⊕ X[l] — the shared
 * prefix cancels itself out.
 */
export const prefixXor: AlgorithmModule<RangeQueryInput, PrefixXorOutput> = {
  id: "prefix-xor",
  version: 1,
  pseudocode: [
    "X[0] ← 0",
    "for i ← 0 to n − 1: X[i + 1] ← X[i] ⊕ A[i]",
    "procedure query(l, r)   // A[l] ⊕ … ⊕ A[r]",
    "  return X[r + 1] ⊕ X[l]   // the common prefix X[l] cancels",
  ],
  input: {
    ...rangeQueryInput({
      limits: LIMITS,
      maxQueries: 6,
      presets: [
        {
          id: "classic",
          label: "Eight bytes",
          value: {
            values: [5, 3, 12, 9, 6, 7, 1, 14],
            queries: [
              [1, 4],
              [0, 7],
              [2, 3],
            ],
          },
        },
        {
          id: "cancel",
          label: "Pairs cancel",
          value: {
            values: [7, 7, 9, 4, 9, 4],
            queries: [
              [0, 1],
              [2, 5],
              [1, 3],
            ],
          },
        },
      ],
    }),
  },

  run(inp, t) {
    const { values, queries } = inp;
    const n = values.length;
    const A = t.array("A", values, { label: "A", display: "cells" });
    const X = t.array(
      "X",
      Array.from({ length: n + 1 }, (): Scalar => null),
      { label: "X[i] = A[0] ⊕ … ⊕ A[i − 1]", display: "cells" },
    );
    const prefix = [0];
    X.write(0, 0, { line: 1, note: "The XOR of no elements is 0." });
    for (let i = 0; i < n; i++) {
      const a = A.read(i, { line: 2, vars: { i } }) as number;
      prefix.push(prefix[i]! ^ a);
      X.write(i + 1, prefix[i + 1]!, {
        line: 2,
        note: `X[${i + 1}] = ${prefix[i]} ⊕ ${a}: ${bits(prefix[i]!)} ⊕ ${bits(a)} = ${bits(prefix[i + 1]!)} = ${prefix[i + 1]}.`,
      });
    }
    const xors: number[] = [];
    for (const [l, r] of queries) {
      const cells = Array.from({ length: r - l + 1 }, (_, k) => l + k);
      A.mark(cells, "active", { line: 3, vars: { i: null, l, r }, note: `XOR of A[${l}..${r}].` });
      X.read(r + 1, { line: 4 });
      X.read(l, { line: 4 });
      const x = prefix[r + 1]! ^ prefix[l]!;
      xors.push(x);
      t.step({
        line: 4,
        vars: { xor: x },
        note: `X[${r + 1}] ⊕ X[${l}] = ${prefix[r + 1]} ⊕ ${prefix[l]} = ${x}: A[0..${l - 1}] appears in both and cancels.`,
      });
      A.mark(cells, null, { line: 4 });
    }
    const output: PrefixXorOutput = { prefix, xors };
    t.finish(inp, output, { vars: { l: null, r: null, xor: null }, note: "All ranges answered." });
    return output;
  },

  check(inp, out) {
    let running = 0;
    const want = [0, ...inp.values.map((v) => (running ^= v))];
    if (JSON.stringify(want) !== JSON.stringify(out.prefix)) return "prefix XOR array is wrong";
    const xors = inp.queries.map(([l, r]) => inp.values.slice(l, r + 1).reduce((a, b) => a ^ b, 0));
    return JSON.stringify(xors) === JSON.stringify(out.xors)
      ? null
      : `answers ${out.xors}, expected ${xors}`;
  },

  fidelity(state: TraceState, out) {
    const x = state.structures.X;
    if (x?.kind !== "array") return "no array X";
    return JSON.stringify(x.values) === JSON.stringify(out.prefix)
      ? null
      : `X shows ${x.values.join(",")}`;
  },

  describeOutput: (out) => `XORs: ${out.xors.join(", ") || "—"}`,
};
