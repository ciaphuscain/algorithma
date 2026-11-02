import type { TraceState } from "@/engine/state";
import type { AlgorithmModule, InputSpec } from "../types";

export interface EuclidInput {
  a: number;
  b: number;
}

export interface EuclidOutput {
  gcd: number;
  /** Bézout coefficients: x·a + y·b = gcd. */
  x: number;
  y: number;
  /** Division steps (the number of remainders computed, including the final 0). */
  divisions: number;
}

const MAX = 1_000_000;

const input: InputSpec<EuclidInput> = {
  fields: [
    { name: "a", label: "a", placeholder: "e.g. 240" },
    { name: "b", label: "b", placeholder: "e.g. 46" },
  ],
  constraints: `Whole numbers 0 ≤ a, b ≤ ${MAX.toLocaleString("en")}, not both 0.`,
  parse(fields) {
    const errors: string[] = [];
    const read = (name: "a" | "b") => {
      const s = (fields[name] ?? "").trim();
      if (!/^\d+$/.test(s) || Number(s) > MAX) {
        errors.push(`${name} must be a whole number from 0 to ${MAX}`);
        return 0;
      }
      return Number(s);
    };
    const [a, b] = [read("a"), read("b")];
    if (errors.length === 0 && a === 0 && b === 0) errors.push("a and b cannot both be 0");
    return errors.length ? { ok: false, errors } : { ok: true, value: { a, b } };
  },
  format: (v) => ({ a: String(v.a), b: String(v.b) }),
  presets: [
    { id: "classic", label: "gcd(240, 46)", value: { a: 240, b: 46 } },
    {
      id: "fibonacci",
      label: "Consecutive Fibonacci numbers (worst case)",
      value: { a: 89, b: 55 },
    },
    { id: "coprime", label: "Coprime: an inverse of 17 mod 3120", value: { a: 3120, b: 17 } },
    { id: "smaller-first", label: "a < b: the first step swaps them", value: { a: 46, b: 240 } },
  ],
  random: (rng) => ({ a: rng.int(1, 5000), b: rng.int(1, 5000) }),
};

/**
 * The extended Euclidean algorithm as a table. Row i holds a remainder r_i with
 * r_i = s_i·a + t_i·b. The first two rows are a = 1·a + 0·b and b = 0·a + 1·b; each
 * next row subtracts q times the previous row from the one before, where q is the
 * quotient of their remainders. The last nonzero remainder is gcd(a, b), and its row
 * gives the coefficients.
 */
export const euclid: AlgorithmModule<EuclidInput, EuclidOutput> = {
  id: "euclid",
  version: 1,
  pseudocode: [
    "procedure extendedEuclid(a, b)",
    "  (r₀, s₀, t₀) ← (a, 1, 0);  (r₁, s₁, t₁) ← (b, 0, 1)",
    "  i ← 1",
    "  while rᵢ ≠ 0",
    "    q ← ⌊rᵢ₋₁ / rᵢ⌋",
    "    (rᵢ₊₁, sᵢ₊₁, tᵢ₊₁) ← (rᵢ₋₁ − q·rᵢ, sᵢ₋₁ − q·sᵢ, tᵢ₋₁ − q·tᵢ);  i ← i + 1",
    "  return gcd = rᵢ₋₁, x = sᵢ₋₁, y = tᵢ₋₁     // rᵢ₋₁ = sᵢ₋₁·a + tᵢ₋₁·b",
  ],
  input,

  run({ a, b }, t) {
    // The table's height is the number of remainders, which a plain Euclid loop counts
    // first; the traced loop below does the real work.
    let rows = 2;
    for (let [u, v] = [a, b]; v !== 0; [u, v] = [v, u % v]) rows++;
    const G = t.grid("E", rows, 4, null, {
      label: "Each row: r = s·a + t·b",
      rowHeaders: Array.from({ length: rows }, (_, i) => String(i)),
      colHeaders: ["q", "r", "s", "t"],
    });
    G.write(0, 1, a, { line: 2 });
    G.write(0, 2, 1, { line: 2 });
    G.write(0, 3, 0, { line: 2, note: `Row 0: ${a} = 1·${a} + 0·${b}.` });
    G.write(1, 1, b, { line: 2 });
    G.write(1, 2, 0, { line: 2 });
    G.write(1, 3, 1, { line: 2, note: `Row 1: ${b} = 0·${a} + 1·${b}.` });
    let i = 1;
    let divisions = 0;
    t.step({ line: 3, vars: { i } });
    while (G.num(i, 1) !== 0) {
      G.read(
        [
          [i - 1, 1],
          [i, 1],
        ],
        { line: 4, vars: { i } },
      );
      const [prev, cur] = [G.num(i - 1, 1), G.num(i, 1)];
      const q = Math.floor(prev / cur);
      G.write(i + 1, 0, q, {
        line: 5,
        vars: { q },
        note: `${prev} = ${q}·${cur} + ${prev - q * cur}.`,
      });
      const r = prev - q * cur;
      const s = G.num(i - 1, 2) - q * G.num(i, 2);
      const tt = G.num(i - 1, 3) - q * G.num(i, 3);
      G.write(i + 1, 1, r, { line: 6 });
      G.write(i + 1, 2, s, { line: 6 });
      G.write(i + 1, 3, tt, {
        line: 6,
        note: `Row ${i + 1} = row ${i - 1} − ${q} × row ${i}: ${r} = ${s}·${a} + ${tt}·${b}.`,
      });
      divisions++;
      t.tally("divisions");
      i++;
      t.step({ line: 3, vars: { i } });
    }
    const output: EuclidOutput = {
      gcd: G.num(i - 1, 1),
      x: G.num(i - 1, 2),
      y: G.num(i - 1, 3),
      divisions,
    };
    G.mark([[i - 1, 1]], "path", { line: 7 });
    t.finish({ a, b }, output, {
      line: 7,
      vars: { q: null },
      note: `gcd(${a}, ${b}) = ${output.gcd} = ${output.x}·${a} + ${output.y}·${b}.`,
    });
    return output;
  },

  check({ a, b }, out) {
    // Independent oracle: the gcd by Stein's binary algorithm, and Bézout's identity
    // checked in exact integer arithmetic.
    const stein = (u: number, v: number): number => {
      if (u === 0) return v;
      if (v === 0) return u;
      let shift = 0;
      while (((u | v) & 1) === 0) {
        u >>= 1;
        v >>= 1;
        shift++;
      }
      while ((u & 1) === 0) u >>= 1;
      while (v !== 0) {
        while ((v & 1) === 0) v >>= 1;
        if (u > v) [u, v] = [v, u];
        v -= u;
      }
      return u << shift;
    };
    const g = stein(a, b);
    if (out.gcd !== g) return `gcd ${out.gcd}, expected ${g}`;
    if (BigInt(out.x) * BigInt(a) + BigInt(out.y) * BigInt(b) !== BigInt(g))
      return `${out.x}·${a} + ${out.y}·${b} ≠ ${g}`;
    return null;
  },

  fidelity(state: TraceState, out) {
    const G = state.structures.E;
    if (G?.kind !== "grid") return "no table E";
    const last = G.rows - 2;
    const row = G.cells[last]!;
    if (row[1] !== out.gcd || row[2] !== out.x || row[3] !== out.y)
      return `row ${last} shows ${row.join(", ")}`;
    if (G.cells[G.rows - 1]![1] !== 0) return "the last row's remainder is not 0";
    return null;
  },

  describeOutput: (o) =>
    `gcd = ${o.gcd} = ${o.x}·a + ${o.y}·b (${o.divisions} division${o.divisions === 1 ? "" : "s"})`,
};
