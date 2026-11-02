import type { TraceState } from "@/engine/state";
import type { AlgorithmModule } from "../types";
import {
  polyInput,
  schoolbook,
  traceMultiply,
  TRANSFORM_PSEUDOCODE,
  type PolyInput,
  type Ring,
} from "./transform";

export interface NttOutput {
  product: number[];
  /** Transform size: a power of two. */
  N: number;
}

/** 998244353 = 119 · 2^23 + 1 is prime, and 3 generates its multiplicative group. */
export const P = 998_244_353n;
const G = 3n;

const powMod = (a: bigint, e: bigint) => {
  let r = 1n;
  let b = a % P;
  for (let k = e; k > 0n; k >>= 1n) {
    if (k & 1n) r = (r * b) % P;
    b = (b * b) % P;
  }
  return r;
};

const ring: Ring<bigint> = {
  zero: 0n,
  one: 1n,
  add: (x, y) => (x + y) % P,
  sub: (x, y) => (x - y + P) % P,
  mul: (x, y) => (x * y) % P,
  root(len, inverse) {
    const w = powMod(G, (P - 1n) / BigInt(len));
    return inverse ? powMod(w, P - 2n) : w;
  },
  divide: (x, n) => (x * powMod(BigInt(n), P - 2n)) % P,
  from: (v) => ((BigInt(v) % P) + P) % P,
  show: (x) => Number(x),
  rootName: (len, inverse) =>
    `${inverse ? "the inverse of " : ""}3^((p − 1)/${len}) mod p = ${Number(ring.root(len, inverse))}`,
};

/**
 * The number-theoretic transform: the FFT's butterfly structure over the integers
 * modulo the prime 998244353, where 3^((p − 1)/len) is a primitive len-th root of
 * unity for every power of two len ≤ 2^23. Arithmetic is exact, so the product's
 * coefficients come out exactly (here they are below p, so they are the true values).
 */
export const ntt: AlgorithmModule<PolyInput, NttOutput> = {
  id: "ntt",
  version: 1,
  pseudocode: TRANSFORM_PSEUDOCODE,
  input: polyInput({
    min: 0,
    max: 999,
    presets: [
      { id: "classic", label: "(1 + 2x + 3x²)(4 + 5x)", value: { a: [1, 2, 3], b: [4, 5] } },
      {
        id: "carry",
        label: "123 × 456 as polynomials in x = 10",
        value: { a: [3, 2, 1], b: [6, 5, 4] },
      },
      {
        id: "full",
        label: "Two degree-3 polynomials (N = 8)",
        value: { a: [1, 1, 1, 1], b: [1, 0, 2, 0] },
      },
    ],
  }),

  run(input, t) {
    const { values, N } = traceMultiply(ring, input, t);
    const output: NttOutput = { product: values.map(Number), N };
    t.finish(input, output, {
      line: 5,
      note: `A · B = [${output.product.join(", ")}] (constant term first).`,
    });
    return output;
  },

  check(input, out) {
    const want = schoolbook(input.a, input.b);
    if (JSON.stringify(out.product) !== JSON.stringify(want))
      return `product ${out.product}, expected ${want}`;
    let N = 1;
    while (N < want.length) N *= 2;
    return out.N === N ? null : `N = ${out.N}, expected ${N}`;
  },

  fidelity(state: TraceState, out) {
    const c = state.structures.C;
    if (c?.kind !== "array") return "no array C";
    return JSON.stringify(c.values.slice(0, out.product.length)) === JSON.stringify(out.product)
      ? null
      : "C differs";
  },

  describeOutput: (out) => `A · B = [${out.product.join(", ")}]`,
};
