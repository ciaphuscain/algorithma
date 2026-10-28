import type { TraceState } from "@/engine/state";
import type { AlgorithmModule, InputSpec } from "../types";

export interface MillerRabinInput {
  n: number;
  bases: number[];
}

export interface MillerRabinOutput {
  composite: boolean;
  /** The bases actually used: reduced mod n, without repeats, skipping 0, 1 and n − 1. */
  bases: number[];
  /** The first base that proves n composite, if any. */
  witness: number | null;
  /** For each base tried: a^d, a^(2d), … mod n, up to where the test stopped. */
  rows: number[][];
  /** True when the bases used are known to give an exact answer for this n. */
  certain: boolean;
}

const MAX_N = 1e12;
/** With bases 2, 3, 5, 7, 11, 13 the test is exact below this bound (Jaeschke, 1993). */
const DETERMINISTIC_BOUND = 3_474_749_660_383;
const DETERMINISTIC_BASES = [2, 3, 5, 7, 11, 13];

const powMod = (a: bigint, e: bigint, m: bigint) => {
  let result = 1n;
  let base = a % m;
  for (let k = e; k > 0n; k >>= 1n) {
    if (k & 1n) result = (result * base) % m;
    base = (base * base) % m;
  }
  return result;
};

/** Bases reduced mod n, first occurrence only, without the uninformative 0, 1 and n − 1. */
export const usableBases = (n: number, bases: number[]) =>
  [...new Set(bases.map((a) => a % n))].filter((a) => a >= 2 && a <= n - 2);

const input: InputSpec<MillerRabinInput> = {
  fields: [
    { name: "n", label: "n (odd, to test)", placeholder: "e.g. 561" },
    { name: "bases", label: "Bases a", placeholder: "e.g. 2, 3, 5, 7, 11, 13" },
  ],
  constraints:
    "An odd n from 5 to 10^12; 1–8 bases from 2 to 100. Bases are taken mod n; 0, 1 and n − 1 prove nothing and are skipped.",
  parse(fields) {
    const errors: string[] = [];
    const nText = (fields.n ?? "").trim();
    const n = Number(nText);
    if (!/^\d+$/.test(nText) || n < 5 || n > MAX_N || n % 2 === 0)
      errors.push("n must be an odd whole number from 5 to 10^12");
    const tokens = (fields.bases ?? "").split(/[\s,;]+/).filter(Boolean);
    const bases = tokens.map(Number);
    if (tokens.length === 0 || tokens.length > 8) errors.push("Give 1–8 bases");
    for (const [i, a] of bases.entries())
      if (!/^\d+$/.test(tokens[i]!) || a < 2 || a > 100)
        errors.push(`Base "${tokens[i]}" must be from 2 to 100`);
    if (errors.length === 0 && usableBases(n, bases).length === 0)
      errors.push("Every base is 0, 1 or n − 1 mod n, which proves nothing; choose another");
    return errors.length
      ? { ok: false, errors: errors.slice(0, 5) }
      : { ok: true, value: { n, bases } };
  },
  format: (v) => ({ n: String(v.n), bases: v.bases.join(", ") }),
  presets: [
    { id: "carmichael", label: "561 (a Carmichael number)", value: { n: 561, bases: [2, 3, 5] } },
    { id: "liar", label: "2047 with base 2 only (a strong liar)", value: { n: 2047, bases: [2] } },
    {
      id: "prime",
      label: "1,000,003 with the exact bases",
      value: { n: 1_000_003, bases: DETERMINISTIC_BASES },
    },
    {
      id: "pseudoprime",
      label: "3,215,031,751 (fools bases 2, 3, 5, 7)",
      value: { n: 3_215_031_751, bases: DETERMINISTIC_BASES },
    },
  ],
  random(rng, size) {
    const n = 2 * rng.int(2, Math.max(3, (size ?? 8) * 500)) + 1;
    return { n, bases: [2, 3, 5, 7].slice(0, rng.int(1, 4)) };
  },
};

/**
 * Miller–Rabin: write n − 1 = d·2^s with d odd. For a prime n, the sequence a^d,
 * a^(2d), …, a^(2^s·d) mod n either starts at 1 or reaches −1 before it reaches 1. A
 * base whose sequence does neither is a witness that n is composite. For an odd
 * composite at most a quarter of bases fail to be witnesses, and for n below
 * 3,474,749,660,383 the bases 2, 3, 5, 7, 11, 13 decide primality exactly.
 */
export const millerRabin: AlgorithmModule<MillerRabinInput, MillerRabinOutput> = {
  id: "miller-rabin",
  version: 1,
  pseudocode: [
    "procedure MillerRabin(n, bases)",
    "  write n − 1 = d · 2^s with d odd",
    "  for each base a",
    "    x ← a^d mod n   (repeated squaring)",
    "    if x = 1 or x = n − 1: a passes; continue with the next base",
    "    repeat s − 1 times: x ← x² mod n;  if x = n − 1: a passes",
    "    if a did not pass: return composite (a is a witness)",
    "  return probably prime   (prime, if the bases are known to suffice for n)",
  ],
  input,

  run(input, t) {
    const { n } = input;
    let d = n - 1;
    let s = 0;
    while (d % 2 === 0) {
      d /= 2;
      s++;
    }
    const bases = usableBases(n, input.bases);
    const G = t.grid("X", bases.length, s, null, {
      label: `x = a^(d·2^r) mod n, with n − 1 = ${d} · 2^${s}`,
      rowHeaders: bases.map((a) => `a = ${a}`),
      colHeaders: Array.from({ length: s }, (_, r) => (r === 0 ? "a^d" : `a^(d·2^${r})`)),
    });
    t.step({ line: 2, vars: { n, d, s }, note: `${n} − 1 = ${n - 1} = ${d} · 2^${s}.` });
    const N = BigInt(n);
    const rows: number[][] = [];
    let witness: number | null = null;
    for (const [i, a] of bases.entries()) {
      const row: number[] = [];
      rows.push(row);
      let x = powMod(BigInt(a), BigInt(d), N);
      row.push(Number(x));
      G.write(i, 0, Number(x), {
        line: 4,
        vars: { a, x: Number(x) },
        note: `${a}^${d} mod ${n} = ${x}.`,
      });
      let passes = x === 1n || x === N - 1n;
      if (passes) {
        G.mark([[i, 0]], "path", {
          line: 5,
          note: `${x === 1n ? "1" : "n − 1"} right away: base ${a} is consistent with n being prime.`,
        });
      } else {
        for (let r = 1; r < s && !passes; r++) {
          x = (x * x) % N;
          row.push(Number(x));
          G.write(i, r, Number(x), { line: 6, vars: { x: Number(x) } });
          if (x === N - 1n) {
            passes = true;
            G.mark([[i, r]], "path", {
              line: 6,
              note: `Reached n − 1 = ${n - 1}: base ${a} passes.`,
            });
          } else if (x === 1n) {
            // 1 without −1 just before it: a non-trivial square root of 1, so n is composite.
            t.step({
              line: 6,
              note: `Reached 1 without passing through n − 1: ${row[r - 1]} is a square root of 1 other than ±1.`,
            });
            break;
          }
        }
      }
      if (!passes) {
        witness = a;
        G.mark(
          row.map((_, r) => [i, r] as [number, number]),
          "active",
          {
            line: 7,
            note: `Base ${a} never gives 1 or n − 1 where a prime would: ${n} is composite.`,
          },
        );
        break;
      }
    }
    const certain =
      witness !== null ||
      (n < DETERMINISTIC_BOUND && DETERMINISTIC_BASES.every((b) => input.bases.includes(b)));
    const output: MillerRabinOutput = {
      composite: witness !== null,
      bases,
      witness,
      rows,
      certain,
    };
    t.finish(input, output, {
      line: witness === null ? 8 : 7,
      vars: { a: null, x: null },
      note:
        witness !== null
          ? `Composite: ${witness} is a witness.`
          : certain
            ? `Prime: the bases 2, 3, 5, 7, 11, 13 decide every n below 3,474,749,660,383.`
            : `Probably prime: no base among ${input.bases.join(", ")} is a witness. That is evidence, not proof.`,
    });
    return output;
  },

  check(input, out) {
    // Independent oracles: trial division for the truth; the definition for each row.
    const { n } = input;
    let prime = true;
    for (let p = 3; p * p <= n; p += 2)
      if (n % p === 0) {
        prime = false;
        break;
      }
    if (out.composite && prime) return `${n} is prime but was called composite`;
    if (out.certain && !out.composite && !prime) return `${n} is composite but was called prime`;
    let d = n - 1;
    let s = 0;
    while (d % 2 === 0) {
      d /= 2;
      s++;
    }
    const N = BigInt(n);
    if (JSON.stringify(out.bases) !== JSON.stringify(usableBases(n, input.bases)))
      return `bases ${out.bases}`;
    for (const [i, a] of out.bases.entries()) {
      const row = out.rows[i];
      if (!row) return out.witness === null ? `base ${a} was not tried` : null;
      for (const [r, x] of row.entries())
        if (BigInt(x) !== powMod(BigInt(a), BigInt(d) * 2n ** BigInt(r), N))
          return `a = ${a}: entry ${r} is ${x}`;
      const sequence = Array.from({ length: s }, (_, r) =>
        powMod(BigInt(a), BigInt(d) * 2n ** BigInt(r), N),
      );
      const liar = sequence[0] === 1n || sequence.some((x) => x === N - 1n);
      if (liar === (out.witness === a)) return `base ${a} misjudged`;
      if (!liar) return i === out.rows.length - 1 ? null : `stopped late after witness ${a}`;
    }
    return out.witness === null ? null : "a witness was reported without a failing base";
  },

  fidelity(state: TraceState, out) {
    const g = state.structures.X;
    if (g?.kind !== "grid") return "no grid X";
    for (const [i, row] of out.rows.entries())
      for (const [r, x] of row.entries())
        if (g.cells[i]![r] !== x) return `cell ${i},${r} shows ${g.cells[i]![r]}`;
    return null;
  },

  describeOutput: (out) =>
    out.composite ? `Composite (witness ${out.witness})` : out.certain ? "Prime" : "Probably prime",
};
