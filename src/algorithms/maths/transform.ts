import type { Scalar } from "@/engine/protocol";
import type { Tracer } from "@/engine/tracer";
import type { InputSpec } from "../types";

export interface PolyInput {
  a: number[];
  b: number[];
}

/** The number system a transform works in: exact residues (NTT) or complex doubles (FFT). */
export interface Ring<T> {
  zero: T;
  one: T;
  add(x: T, y: T): T;
  sub(x: T, y: T): T;
  mul(x: T, y: T): T;
  /** A primitive len-th root of unity, or its inverse. */
  root(len: number, inverse: boolean): T;
  /** x / n for the final scaling of the inverse transform. */
  divide(x: T, n: number): T;
  from(v: number): T;
  show(x: T): Scalar;
  /** Words for the narration, e.g. "ω₈ = 3^(…) mod p". */
  rootName(len: number, inverse: boolean): string;
}

export const TRANSFORM_PSEUDOCODE = [
  "procedure Multiply(A, B)",
  "  N ← the smallest power of two ≥ |A| + |B| − 1;  pad A and B with zeros to length N",
  "  transform(A);  transform(B)   // now the values at the N-th roots of unity",
  "  C[i] ← A[i] · B[i] for every i   // multiply the values pointwise",
  "  inverse transform(C);  divide every C[i] by N   // back to coefficients",
  "procedure transform(a)   // iterative Cooley–Tukey",
  "  reorder a by bit-reversed index",
  "  for len ← 2, 4, …, N:  w ← a primitive len-th root of unity (inverse: its inverse)",
  "    for each block start i and each j < len/2:  u ← a[i + j];  v ← a[i + j + len/2] · w^j",
  "      a[i + j] ← u + v;  a[i + j + len/2] ← u − v   // one butterfly",
];

export function polyInput(options: {
  min: number;
  max: number;
  presets: InputSpec<PolyInput>["presets"];
}): InputSpec<PolyInput> {
  const { min, max } = options;
  const parseList = (text: string, label: string, errors: string[]) => {
    const tokens = text.split(/[\s,;]+/).filter(Boolean);
    if (tokens.length === 0 || tokens.length > 8) errors.push(`${label} needs 1–8 coefficients`);
    for (const tk of tokens)
      if (!/^-?\d+$/.test(tk) || Number(tk) < min || Number(tk) > max)
        errors.push(`${label}: "${tk}" must be a whole number from ${min} to ${max}`);
    return tokens.map(Number);
  };
  return {
    fields: [
      { name: "a", label: "A (coefficients, constant term first)", placeholder: "e.g. 1, 2, 3" },
      { name: "b", label: "B (coefficients, constant term first)", placeholder: "e.g. 4, 5" },
    ],
    constraints: `1–8 whole-number coefficients each, from ${min} to ${max}, constant term first: "1, 2, 3" is 1 + 2x + 3x².`,
    parse(fields) {
      const errors: string[] = [];
      const a = parseList(fields.a ?? "", "A", errors);
      const b = parseList(fields.b ?? "", "B", errors);
      return errors.length
        ? { ok: false, errors: errors.slice(0, 5) }
        : { ok: true, value: { a, b } };
    },
    format: (v) => ({ a: v.a.join(", "), b: v.b.join(", ") }),
    presets: options.presets,
    random(rng, size) {
      const len = () => rng.int(1, Math.min(8, Math.max(1, size ?? 4)));
      const coef = () => rng.int(min, max);
      return { a: Array.from({ length: len() }, coef), b: Array.from({ length: len() }, coef) };
    },
  };
}

/** Schoolbook product, the oracle for both transforms. */
export function schoolbook(a: number[], b: number[]): number[] {
  const out = new Array<number>(a.length + b.length - 1).fill(0);
  for (const [i, x] of a.entries())
    for (const [j, y] of b.entries()) out[i + j] = out[i + j]! + x * y;
  return out;
}

const bitReverse = (i: number, bits: number) => {
  let r = 0;
  for (let k = 0; k < bits; k++) r |= ((i >> k) & 1) << (bits - 1 - k);
  return r;
};

/**
 * Trace one polynomial multiplication with the given ring. Returns the product's
 * coefficients in the ring (the caller converts them to integers).
 */
export function traceMultiply<T>(
  ring: Ring<T>,
  input: PolyInput,
  t: Tracer,
): { values: T[]; N: number } {
  const size = input.a.length + input.b.length - 1;
  let N = 1;
  while (N < size) N *= 2;
  const bits = Math.log2(N);
  const pad = (xs: number[]) => [
    ...xs.map(ring.from),
    ...new Array<T>(N - xs.length).fill(ring.zero),
  ];
  const A = pad(input.a);
  const B = pad(input.b);
  const TA = t.array("A", A.map(ring.show), {
    label: "A (coefficients, then values)",
    display: "cells",
  });
  const TB = t.array("B", B.map(ring.show), {
    label: "B (coefficients, then values)",
    display: "cells",
  });
  t.step({
    line: 2,
    vars: { N },
    note: `The product has ${size} coefficient${size === 1 ? "" : "s"}, so N = ${N}.`,
  });

  const transform = (a: T[], ta: typeof TA, inverse: boolean, name: string) => {
    for (let i = 0; i < N; i++) {
      const j = bitReverse(i, bits);
      if (i < j) {
        [a[i], a[j]] = [a[j]!, a[i]!];
        ta.swap(i, j, {
          line: 7,
          note: `Bit reversal: ${i} = ${i.toString(2).padStart(bits, "0")}₂ ↔ ${j} = ${j.toString(2).padStart(bits, "0")}₂.`,
        });
      }
    }
    for (let len = 2; len <= N; len *= 2) {
      const w = ring.root(len, inverse);
      t.step({
        line: 8,
        vars: { len, w: ring.show(w) },
        note: `${name}: blocks of ${len}, w = ${ring.rootName(len, inverse)}.`,
      });
      for (let i = 0; i < N; i += len) {
        let wj = ring.one;
        for (let j = 0; j < len / 2; j++) {
          const [p, q] = [i + j, i + j + len / 2];
          ta.read(p, { line: 9 });
          ta.read(q, { line: 9 });
          const u = a[p]!;
          const v = ring.mul(a[q]!, wj);
          a[p] = ring.add(u, v);
          a[q] = ring.sub(u, v);
          ta.write(p, ring.show(a[p]!), { line: 10 });
          ta.write(q, ring.show(a[q]!), { line: 10 });
          t.tally("butterflies");
          wj = ring.mul(wj, w);
        }
      }
    }
  };

  transform(A, TA, false, "Transform A");
  transform(B, TB, false, "Transform B");
  const C = A.map((x, i) => ring.mul(x, B[i]!));
  const TC = t.array("C", C.map(ring.show), {
    label: "C = A · B pointwise, then its inverse transform",
    display: "cells",
  });
  t.step({ line: 4, note: "Multiplying values pointwise multiplies the polynomials." });
  transform(C, TC, true, "Inverse transform of C");
  for (let i = 0; i < N; i++) {
    C[i] = ring.divide(C[i]!, N);
    TC.write(i, ring.show(C[i]!), { line: 5 });
  }
  TC.mark(
    Array.from({ length: size }, (_, i) => i),
    "found",
    {
      line: 5,
      vars: { len: null, w: null },
      note: `Divide by N = ${N}: these are the coefficients of A · B.`,
    },
  );
  return { values: C.slice(0, size), N };
}
