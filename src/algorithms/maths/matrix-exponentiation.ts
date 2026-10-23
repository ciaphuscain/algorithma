import type { Scalar } from "@/engine/protocol";
import type { TraceState } from "@/engine/state";
import type { AlgorithmModule, InputSpec } from "../types";

export interface FibInput {
  n: number;
  m: number;
}

export interface MatrixPowerOutput {
  /** F(n) mod m. */
  value: number;
  /** The final result matrix [[F(n+1), F(n)], [F(n), F(n−1)]] mod m (identity for n = 0). */
  result: number[][];
  multiplications: number;
}

type Matrix = [[number, number], [number, number]];

const MAX_N = 1e12;
const MAX_M = 1e6;

const fibInput: InputSpec<FibInput> = {
  fields: [
    { name: "n", label: "n (which Fibonacci number)", placeholder: "e.g. 10" },
    { name: "m", label: "Modulus m", placeholder: "e.g. 1000" },
  ],
  constraints: `0 ≤ n ≤ 10^12; 2 ≤ m ≤ 10^6 (so every product fits exactly in a double).`,
  parse(fields) {
    const errors: string[] = [];
    const n = Number((fields.n ?? "").trim());
    const m = Number((fields.m ?? "").trim());
    if (!/^\d+$/.test((fields.n ?? "").trim()) || n > MAX_N)
      errors.push("n must be a whole number from 0 to 10^12");
    if (!/^\d+$/.test((fields.m ?? "").trim()) || m < 2 || m > MAX_M)
      errors.push("m must be a whole number from 2 to 10^6");
    return errors.length ? { ok: false, errors } : { ok: true, value: { n, m } };
  },
  format: (v) => ({ n: String(v.n), m: String(v.m) }),
  presets: [
    { id: "classic", label: "F(10) mod 1000", value: { n: 10, m: 1000 } },
    { id: "large", label: "F(1,000,000) mod 1,000,000", value: { n: 1_000_000, m: 1_000_000 } },
    { id: "power", label: "F(64) mod 997 (one bit set)", value: { n: 64, m: 997 } },
  ],
  random(rng, size) {
    return { n: rng.int(0, Math.max(1, (size ?? 8) * 8)), m: rng.int(2, 1000) };
  },
};

/**
 * Matrix exponentiation: [[1, 1], [1, 0]]^n = [[F(n+1), F(n)], [F(n), F(n−1)]], and
 * a power is computed by repeated squaring, multiplying the result by the squares
 * that correspond to the 1-bits of n: O(log n) matrix multiplications instead of n.
 */
export const matrixExponentiation: AlgorithmModule<FibInput, MatrixPowerOutput> = {
  id: "matrix-exponentiation",
  version: 1,
  pseudocode: [
    "procedure Fib(n, m)   // F(n) mod m",
    "  M ← [[1, 1], [1, 0]];  R ← identity",
    "  while n > 0",
    "    if n is odd: R ← R · M  (mod m)",
    "    n ← ⌊n / 2⌋;  if n > 0: M ← M · M  (mod m)",
    "  return R[0][1]   // R = [[F(n+1), F(n)], [F(n), F(n−1)]]",
  ],
  input: fibInput,

  run(input, t) {
    const { m } = input;
    const bits = input.n === 0 ? [0] : [...input.n.toString(2)].reverse().map(Number);
    const BITS = t.array("bits", bits as Scalar[], {
      label: "Bits of n, least significant first",
      display: "cells",
    });
    const headers = { rowHeaders: ["row 0", "row 1"], colHeaders: ["col 0", "col 1"] };
    const GM = t.grid("M", 2, 2, null, {
      label: "M = [[1, 1], [1, 0]] squared each round",
      ...headers,
    });
    const GR = t.grid("R", 2, 2, null, { label: "R (the result so far)", ...headers });
    let M: Matrix = [
      [1, 1],
      [1, 0],
    ];
    let R: Matrix = [
      [1, 0],
      [0, 1],
    ];
    const show = (G: typeof GM, X: Matrix, line: number, note?: string) => {
      for (let r = 0; r < 2; r++)
        for (let c = 0; c < 2; c++)
          G.write(r, c, X[r]![c]!, { line, ...(r === 1 && c === 1 && note ? { note } : {}) });
    };
    let multiplications = 0;
    const mul = (A: Matrix, B: Matrix): Matrix => {
      multiplications++;
      t.tally("matrix multiplications");
      const cell = (r: number, c: number) => (A[r]![0]! * B[0]![c]! + A[r]![1]! * B[1]![c]!) % m;
      return [
        [cell(0, 0), cell(0, 1)],
        [cell(1, 0), cell(1, 1)],
      ];
    };
    show(GM, M, 2);
    show(GR, R, 2, "R starts as the identity: M⁰.");

    let n = input.n;
    let power = 1;
    let k = 0;
    while (n > 0) {
      BITS.pointer("bit", k, { line: 3, vars: { n, power } });
      if (n % 2 === 1) {
        R = mul(R, M);
        BITS.mark(k, "found", { line: 4 });
        show(GR, R, 4, `Bit ${k} is 1: multiply R by M = M^${power}.`);
      } else {
        BITS.mark(k, "discarded", { line: 4, note: `Bit ${k} is 0: R stays.` });
      }
      n = Math.floor(n / 2);
      if (n > 0) {
        M = mul(M, M);
        power *= 2;
        show(GM, M, 5, `Square M: now M^${power}.`);
      }
      k++;
    }
    BITS.pointer("bit", null, { line: 6, vars: { n } });
    const output: MatrixPowerOutput = {
      value: R[0]![1]!,
      result: R.map((row) => [...row]),
      multiplications,
    };
    t.finish(input, output, {
      line: 6,
      note: `F(${input.n}) mod ${m} = ${output.value}, using ${output.multiplications} matrix multiplications.`,
    });
    return output;
  },

  check(input, out) {
    // Independent oracle: the fast-doubling identities in exact BigInt arithmetic.
    // F(2k) = F(k)(2F(k+1) − F(k)),  F(2k+1) = F(k)² + F(k+1)².
    const m = BigInt(input.m);
    const fib = (n: bigint): [bigint, bigint] => {
      if (n === 0n) return [0n, 1n];
      const [a, b] = fib(n / 2n);
      const c = (a * ((2n * b - a + m) % m)) % m;
      const d = (a * a + b * b) % m;
      return n % 2n === 0n ? [c, d] : [d, (c + d) % m];
    };
    const [f, f1] = fib(BigInt(input.n));
    if (BigInt(out.value) !== f)
      return `F(${input.n}) mod ${input.m} = ${out.value}, expected ${f}`;
    if (input.n > 0 && BigInt(out.result[0]![0]!) !== f1)
      return `R[0][0] = ${out.result[0]![0]}, expected F(n+1) = ${f1}`;
    const bits = input.n === 0 ? 0 : input.n.toString(2).length;
    const ones = [...input.n.toString(2)].filter((b) => b === "1").length;
    const want = input.n === 0 ? 0 : bits - 1 + ones;
    if (out.multiplications !== want)
      return `${out.multiplications} multiplications, expected ${want}`;
    return null;
  },

  fidelity(state: TraceState, out) {
    const g = state.structures.R;
    if (g?.kind !== "grid") return "no grid R";
    return JSON.stringify(g.cells) === JSON.stringify(out.result) ? null : "R differs";
  },

  describeOutput: (out) =>
    `F(n) mod m = ${out.value} (${out.multiplications} matrix multiplications)`,
};
