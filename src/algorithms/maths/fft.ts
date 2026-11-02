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

export interface FftOutput {
  /** The product's coefficients, rounded to the nearest integer. */
  product: number[];
  /** Largest distance from an integer before rounding (real and imaginary parts). */
  maxError: number;
  N: number;
}

interface Complex {
  re: number;
  im: number;
}

const round2 = (x: number) => {
  const r = Math.round(x * 100) / 100;
  return Object.is(r, -0) ? 0 : r;
};

/** A complex number to two decimals, with a true minus sign: "6", "−2", "−2−2i", "4+5i". */
export const showComplex = ({ re, im }: Complex): string => {
  const [a, b] = [round2(re), round2(im)];
  const num = (v: number) => (v < 0 ? `−${Math.abs(v)}` : String(v));
  if (b === 0) return num(a);
  const imag = `${Math.abs(b) === 1 ? "" : Math.abs(b)}i`;
  if (a === 0) return `${b < 0 ? "−" : ""}${imag}`;
  return `${num(a)}${b < 0 ? "−" : "+"}${imag}`;
};

/** Read a value written by showComplex back as a real number (imaginary values give NaN). */
export const realOf = (shown: unknown) => Number(String(shown).replace("−", "-"));

const ring: Ring<Complex> = {
  zero: { re: 0, im: 0 },
  one: { re: 1, im: 0 },
  add: (x, y) => ({ re: x.re + y.re, im: x.im + y.im }),
  sub: (x, y) => ({ re: x.re - y.re, im: x.im - y.im }),
  mul: (x, y) => ({ re: x.re * y.re - x.im * y.im, im: x.re * y.im + x.im * y.re }),
  root(len, inverse) {
    const angle = ((inverse ? 2 : -2) * Math.PI) / len;
    return { re: Math.cos(angle), im: Math.sin(angle) };
  },
  divide: (x, n) => ({ re: x.re / n, im: x.im / n }),
  from: (v) => ({ re: v, im: 0 }),
  show: showComplex,
  rootName: (len, inverse) => `e^(${inverse ? "+" : "−"}2πi/${len})`,
};

/**
 * The fast Fourier transform (Cooley–Tukey, radix 2): evaluate both polynomials at
 * the N-th complex roots of unity in O(N log N) by splitting into even and odd
 * coefficients, multiply the values pointwise, and interpolate back with the inverse
 * transform. Floating-point arithmetic leaves small errors, removed by rounding.
 */
export const fft: AlgorithmModule<PolyInput, FftOutput> = {
  id: "fft",
  version: 1,
  pseudocode: TRANSFORM_PSEUDOCODE,
  input: polyInput({
    min: -9,
    max: 9,
    presets: [
      { id: "classic", label: "(1 + 2x + 3x²)(4 + 5x)", value: { a: [1, 2, 3], b: [4, 5] } },
      { id: "signs", label: "(1 − x)(1 + x + x² + x³)", value: { a: [1, -1], b: [1, 1, 1, 1] } },
      { id: "square", label: "(1 + x)⁴ as (1 + 2x + x²)²", value: { a: [1, 2, 1], b: [1, 2, 1] } },
    ],
  }),

  run(input, t) {
    const { values, N } = traceMultiply(ring, input, t);
    const product = values.map((z) => Math.round(z.re) || 0);
    const maxError = Math.max(
      ...values.map((z, i) => Math.max(Math.abs(z.re - product[i]!), Math.abs(z.im))),
    );
    const output: FftOutput = { product, maxError, N };
    t.finish(input, output, {
      line: 5,
      note: `A · B = [${product.join(", ")}]; the largest rounding correction was ${maxError.toExponential(1)}.`,
    });
    return output;
  },

  check(input, out) {
    const want = schoolbook(input.a, input.b);
    if (JSON.stringify(out.product) !== JSON.stringify(want))
      return `product ${out.product}, expected ${want}`;
    if (!(out.maxError < 1e-9)) return `rounding error ${out.maxError} is too large to trust`;
    return null;
  },

  fidelity(state: TraceState, out) {
    const c = state.structures.C;
    if (c?.kind !== "array") return "no array C";
    for (const [i, v] of out.product.entries())
      if (realOf(c.values[i]) !== v) return `C[${i}] shows ${c.values[i]}`;
    return null;
  },

  describeOutput: (out) => `A · B = [${out.product.join(", ")}]`,
};
