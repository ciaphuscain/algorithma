import type { TraceState } from "@/engine/state";
import type { AlgorithmModule, InputSpec } from "../types";

export interface RhoInput {
  n: number;
  x0: number;
}

export interface RhoOutput {
  /** A factor d with 1 < d < n. */
  factor: number | null;
  /** The constant c of f(x) = x² + c in the attempt that succeeded (c = 1, 2, …). */
  c: number;
  /** Rounds of the tortoise-and-hare loop, over all attempts. */
  iterations: number;
}

const MAX_N = 1_000_000;
const MAX_ATTEMPTS = 20;

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
const isPrime = (n: number) => {
  if (n < 2) return false;
  for (let p = 2; p * p <= n; p++) if (n % p === 0) return false;
  return true;
};

/** Every round of every attempt, so the table can have a row for each. */
function rounds(n: number, x0: number) {
  const out: { c: number; x: number; y: number; d: number }[] = [];
  for (let c = 1; c <= MAX_ATTEMPTS; c++) {
    const f = (v: number) => (v * v + c) % n;
    let x = x0 % n;
    let y = x0 % n;
    let d = 1;
    while (d === 1) {
      x = f(x);
      y = f(f(y));
      d = gcd(Math.abs(x - y), n);
      out.push({ c, x, y, d });
    }
    if (d !== n) break;
  }
  return out;
}

const input: InputSpec<RhoInput> = {
  fields: [
    { name: "n", label: "n (composite, to factor)", placeholder: "e.g. 8051" },
    { name: "x0", label: "Start value x₀", placeholder: "e.g. 2" },
  ],
  constraints: `An odd composite n from 9 to 10^6 (even numbers have the factor 2); 0 ≤ x₀ < n.`,
  parse(fields) {
    const errors: string[] = [];
    const [nt, xt] = [(fields.n ?? "").trim(), (fields.x0 ?? "").trim()];
    const n = Number(nt);
    const x0 = Number(xt);
    if (!/^\d+$/.test(nt) || n < 9 || n > MAX_N || n % 2 === 0)
      errors.push("n must be an odd number from 9 to 10^6");
    else if (isPrime(n)) errors.push(`${n} is prime: there is no factor to find`);
    if (!/^\d+$/.test(xt) || (errors.length === 0 && x0 >= n))
      errors.push("x₀ must be a whole number below n");
    return errors.length ? { ok: false, errors } : { ok: true, value: { n, x0 } };
  },
  format: (v) => ({ n: String(v.n), x0: String(v.x0) }),
  presets: [
    { id: "classic", label: "8051 = 83 · 97", value: { n: 8051, x0: 2 } },
    { id: "retry", label: "25: the first attempt fails", value: { n: 25, x0: 2 } },
    { id: "larger", label: "455459 = 613 · 743", value: { n: 455_459, x0: 2 } },
  ],
  random(rng, size) {
    const limit = Math.min(MAX_N, 9 + (size ?? 8) * 2000);
    for (;;) {
      const n = 2 * rng.int(4, (limit - 1) / 2) + 1;
      if (!isPrime(n)) return { n, x0: rng.int(0, Math.min(n - 1, 10)) };
    }
  },
};

/**
 * Pollard's rho: the sequence x ← x² + c (mod n) is, modulo an unknown prime factor
 * p, eventually periodic after about √p steps (birthday paradox). Floyd's tortoise
 * and hare detect the cycle without knowing p: once x ≡ y (mod p), gcd(|x − y|, n)
 * reveals p (or a multiple of it). If the gcd is n itself, retry with another c.
 */
export const pollardRho: AlgorithmModule<RhoInput, RhoOutput> = {
  id: "pollard-rho",
  version: 1,
  pseudocode: [
    "procedure PollardRho(n, x₀)",
    "  for c ← 1, 2, …   // f(v) = v² + c mod n",
    "    x ← x₀;  y ← x₀;  d ← 1   // tortoise x, hare y",
    "    while d = 1",
    "      x ← f(x);  y ← f(f(y))   // the hare moves twice as fast",
    "      d ← gcd(|x − y|, n)",
    "    if d ≠ n: return d   // a factor",
    "    otherwise both met modulo n itself: try the next c",
  ],
  input,

  run(input, t) {
    const { n, x0 } = input;
    const all = rounds(n, x0);
    const G = t.grid("R", all.length, 4, null, {
      label: "One row per round (the table has a row for every round the run takes)",
      rowHeaders: all.map((r, i) => `c=${r.c}, #${i + 1}`),
      colHeaders: ["x (tortoise)", "y (hare)", "|x − y|", "gcd(|x − y|, n)"],
    });
    let row = 0;
    let factor: number | null = null;
    let c = 0;
    for (c = 1; c <= MAX_ATTEMPTS; c++) {
      const f = (v: number) => (v * v + c) % n;
      let x = x0 % n;
      let y = x0 % n;
      let d = 1;
      t.step({
        line: 3,
        vars: { c, x, y, d },
        note: `Attempt with f(v) = v² + ${c} mod ${n}, from x₀ = ${x0}.`,
      });
      while (d === 1) {
        x = f(x);
        y = f(f(y));
        t.tally("rounds");
        G.write(row, 0, x, { line: 5, vars: { x, y } });
        G.write(row, 1, y, { line: 5 });
        G.write(row, 2, Math.abs(x - y), { line: 6 });
        d = gcd(Math.abs(x - y), n);
        G.write(row, 3, d, {
          line: 6,
          vars: { d },
          note:
            d === 1
              ? `gcd(${Math.abs(x - y)}, ${n}) = 1: no common factor yet.`
              : d === n
                ? `gcd = ${n}: x and y met modulo n itself, which reveals nothing.`
                : `gcd(${Math.abs(x - y)}, ${n}) = ${d}: x ≡ y modulo ${d}.`,
        });
        row++;
      }
      if (d !== n) {
        factor = d;
        G.mark([[row - 1, 3]], "path", {
          line: 7,
          note: `${d} divides ${n}: ${n} = ${d} · ${n / d}.`,
        });
        break;
      }
      G.mark([[row - 1, 3]], "active", {
        line: 8,
        note: `Attempt with c = ${c} failed; try c = ${c + 1}.`,
      });
    }
    const output: RhoOutput = { factor, c, iterations: row };
    t.finish(input, output, {
      line: 7,
      vars: { x: null, y: null },
      note:
        factor === null
          ? `No factor after ${MAX_ATTEMPTS} attempts.`
          : `Found ${factor} after ${row} round${row === 1 ? "" : "s"}${c > 1 ? `, on attempt ${c}` : ""}.`,
    });
    return output;
  },

  check(input, out) {
    // Independent oracle: the factor must divide n properly, and the counts must match
    // the definition: round i compares x_i with x_2i of the sequence x_{k+1} = x_k² + c.
    const { n } = input;
    if (out.factor === null || n % out.factor !== 0 || out.factor <= 1 || out.factor >= n)
      return `${out.factor} is not a proper factor of ${n}`;
    let total = 0;
    for (let c = 1; c <= MAX_ATTEMPTS; c++) {
      const xs = [input.x0 % n];
      const at = (k: number) => {
        while (xs.length <= k) xs.push((xs[xs.length - 1]! ** 2 + c) % n);
        return xs[k]!;
      };
      let i = 1;
      let d = gcd(Math.abs(at(1) - at(2)), n);
      while (d === 1) {
        i++;
        d = gcd(Math.abs(at(i) - at(2 * i)), n);
      }
      total += i;
      if (d !== n) {
        if (out.c !== c || out.factor !== d || out.iterations !== total)
          return `got c ${out.c}, factor ${out.factor}, ${out.iterations} rounds; expected c ${c}, ${d}, ${total}`;
        return null;
      }
    }
    return "the definition finds no factor either";
  },

  fidelity(state: TraceState, out) {
    const g = state.structures.R;
    if (g?.kind !== "grid") return "no grid R";
    const last = g.cells[g.rows - 1]?.[3];
    return last === out.factor ? null : `last gcd shows ${last}`;
  },

  describeOutput: (out) =>
    out.factor === null
      ? "No factor found"
      : `Factor ${out.factor} (c = ${out.c}, ${out.iterations} rounds)`,
};
