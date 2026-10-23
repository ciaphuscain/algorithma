import type { TraceState } from "@/engine/state";
import type { AlgorithmModule, InputSpec } from "../types";

export interface Congruence {
  a: number;
  m: number;
}

export interface CrtOutput {
  /** The least non-negative solution, or null if the congruences contradict each other. */
  x: number | null;
  /** The modulus the merging ends with: the solutions are exactly x + k·M (null if none). */
  M: number | null;
}

const MAX_MODULUS = 10_000;
const MAX_CONGRUENCES = 5;

/** Extended Euclid: [g, p, q] with p·a + q·b = g = gcd(a, b). */
export function extendedGcd(a: bigint, b: bigint): [bigint, bigint, bigint] {
  if (b === 0n) return [a, 1n, 0n];
  const [g, p, q] = extendedGcd(b, a % b);
  return [g, q, p - (a / b) * q];
}

const mod = (a: bigint, m: bigint) => ((a % m) + m) % m;

const input: InputSpec<Congruence[]> = {
  fields: [
    {
      name: "system",
      label: "Congruences x ≡ a (mod m)",
      placeholder: "e.g. 2 mod 3, 3 mod 5, 2 mod 7",
    },
  ],
  constraints: `1–${MAX_CONGRUENCES} congruences "a mod m" with 2 ≤ m ≤ ${MAX_MODULUS}, 0 ≤ a < m and an lcm of at most 10^15. Moduli need not be coprime.`,
  parse(fields) {
    const errors: string[] = [];
    const system: Congruence[] = [];
    for (const token of (fields.system ?? "")
      .split(/[,;\n]+/)
      .map((x) => x.trim())
      .filter(Boolean)) {
      const m = /^(\d+)\s*(?:mod|%)\s*(\d+)$/i.exec(token);
      if (!m) {
        errors.push(`"${token}" is not like "2 mod 3"`);
        continue;
      }
      const [a, mm] = [Number(m[1]), Number(m[2])];
      if (mm < 2 || mm > MAX_MODULUS) errors.push(`modulus ${mm} must be from 2 to ${MAX_MODULUS}`);
      else if (a >= mm) errors.push(`in "${token}", a must be below m`);
      system.push({ a, m: mm });
    }
    if (system.length === 0) errors.push("Enter at least one congruence");
    if (system.length > MAX_CONGRUENCES)
      errors.push(`${system.length} congruences; the limit is ${MAX_CONGRUENCES}`);
    if (errors.length === 0) {
      const lcm = system.reduce(
        (acc, { m }) => (acc * BigInt(m)) / extendedGcd(acc, BigInt(m))[0],
        1n,
      );
      if (lcm > 10n ** 15n)
        errors.push("The lcm of the moduli exceeds 10^15; use fewer or smaller moduli");
    }
    return errors.length ? { ok: false, errors: errors.slice(0, 5) } : { ok: true, value: system };
  },
  format: (v) => ({ system: v.map(({ a, m }) => `${a} mod ${m}`).join(", ") }),
  presets: [
    {
      id: "classic",
      label: "Sunzi: 2 mod 3, 3 mod 5, 2 mod 7",
      value: [
        { a: 2, m: 3 },
        { a: 3, m: 5 },
        { a: 2, m: 7 },
      ],
    },
    {
      id: "shared",
      label: "Moduli sharing factors: 5 mod 6, 3 mod 10, 8 mod 15",
      value: [
        { a: 5, m: 6 },
        { a: 3, m: 10 },
        { a: 8, m: 15 },
      ],
    },
    {
      id: "none",
      label: "No solution: 1 mod 4, 2 mod 6",
      value: [
        { a: 1, m: 4 },
        { a: 2, m: 6 },
      ],
    },
  ],
  random(rng, size) {
    const k = Math.min(MAX_CONGRUENCES, Math.max(1, Math.ceil((size ?? 8) / 3)));
    return Array.from({ length: k }, () => {
      const m = rng.int(2, 30);
      return { a: rng.int(0, m - 1), m };
    });
  },
};

/**
 * The Chinese Remainder Theorem, constructively: merge the congruences one at a time.
 * x ≡ X (mod M) and x ≡ a (mod m) have a common solution exactly when gcd(M, m)
 * divides a − X; extended Euclid then gives the step t with X + M·t ≡ a (mod m), and
 * the merged congruence is modulo lcm(M, m).
 */
export const crt: AlgorithmModule<Congruence[], CrtOutput> = {
  id: "crt",
  version: 1,
  pseudocode: [
    "procedure CRT(congruences)",
    "  X ← 0;  M ← 1   // every integer solves the empty system",
    "  for each congruence x ≡ a (mod m)",
    "    g ← gcd(M, m);  p ← a number with M·p ≡ g (mod m)   (extended Euclid)",
    "    if g does not divide a − X: no solution",
    "    t ← ((a − X) / g) · p  mod (m / g)",
    "    X ← X + M·t;  M ← M · m / g   (= lcm(M, m))",
    "  return X mod M",
  ],
  input,

  run(system, t) {
    const G = t.grid("S", system.length, 6, null, {
      label: "Merging the congruences one at a time",
      rowHeaders: system.map(({ a, m }) => `x ≡ ${a} (mod ${m})`),
      colHeaders: ["a", "m", "g = gcd(M, m)", "t", "X after", "M after"],
    });
    let X = 0n;
    let M = 1n;
    t.step({ line: 2, vars: { X: 0, M: 1 }, note: "Start from x ≡ 0 (mod 1): every integer." });
    let x: number | null = null;
    let ok = true;
    for (const [i, { a, m }] of system.entries()) {
      G.write(i, 0, a, { line: 3, vars: { a, m } });
      G.write(i, 1, m, { line: 3 });
      const [g, p] = extendedGcd(M, BigInt(m));
      G.write(i, 2, Number(g), {
        line: 4,
        vars: { g: Number(g), p: Number(p) },
        note: `gcd(${M}, ${m}) = ${g}, and ${M} · ${p} ≡ ${g} (mod ${m}).`,
      });
      const diff = BigInt(a) - X;
      if (diff % g !== 0n) {
        ok = false;
        G.mark([[i, 2]], "active", {
          line: 5,
          note: `${a} − ${X} = ${diff} is not divisible by ${g}: x ≡ ${X} (mod ${M}) and x ≡ ${a} (mod ${m}) contradict each other.`,
        });
        break;
      }
      const step = mod((diff / g) * p, BigInt(m) / g);
      G.write(i, 3, Number(step), { line: 6, vars: { t: Number(step) } });
      X = X + M * step;
      M = (M * BigInt(m)) / g;
      X = mod(X, M);
      G.write(i, 4, Number(X), { line: 7, vars: { X: Number(X), M: Number(M) } });
      G.write(i, 5, Number(M), {
        line: 7,
        note: `Now x ≡ ${X} (mod ${M}) satisfies the first ${i + 1} congruence${i === 0 ? "" : "s"}.`,
      });
    }
    if (ok) {
      x = Number(X);
      G.mark([[system.length - 1, 4]], "path", { line: 8 });
    }
    const output: CrtOutput = { x, M: ok ? Number(M) : null };
    t.finish(system, output, {
      line: 8,
      note:
        x === null
          ? "No integer satisfies every congruence."
          : `x = ${x} + ${output.M}·k for every integer k.`,
    });
    return output;
  },

  check(system, out) {
    // Independent oracles: M must be the lcm; a solution must satisfy every congruence;
    // "no solution" must match the pairwise criterion a_i ≡ a_j (mod gcd(m_i, m_j)).
    const g = (a: number, b: number): number => (b === 0 ? a : g(b, a % b));
    const lcm = system.reduce((acc, { m }) => (acc / g(acc, m)) * m, 1);
    const compatible = system.every((p, i) =>
      system.every((q, j) => i >= j || (p.a - q.a) % g(p.m, q.m) === 0),
    );
    if (out.x === null) return compatible ? "a solution exists but none was reported" : null;
    if (out.M !== lcm) return `M = ${out.M}, expected the lcm ${lcm}`;
    if (!compatible) return "the congruences are incompatible, yet a solution was reported";
    if (out.x < 0 || out.x >= lcm) return `x = ${out.x} is not in [0, ${lcm})`;
    for (const { a, m } of system) if (out.x % m !== a) return `${out.x} mod ${m} ≠ ${a}`;
    return null;
  },

  fidelity(state: TraceState, out) {
    const grid = state.structures.S;
    if (grid?.kind !== "grid") return "no grid S";
    if (out.x === null) return null;
    return grid.cells[grid.rows - 1]![4] === out.x ? null : "the last X differs";
  },

  describeOutput: (out) => (out.x === null ? "No solution" : `x ≡ ${out.x} (mod ${out.M})`),
};
