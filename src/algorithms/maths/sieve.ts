import type { TraceState } from "@/engine/state";
import type { AlgorithmModule, InputSpec } from "../types";

export interface SieveOutput {
  primes: number[];
  /** Times a number was crossed out, counting repeats (12 is crossed by 2 and by 3). */
  crossings: number;
}

const MAX_N = 200;
const COLS = 10;
const crossed = (m: number) => `×${m}`;

const input: InputSpec<number> = {
  fields: [{ name: "n", label: "Find the primes up to n", placeholder: "e.g. 50" }],
  constraints: `A whole number n from 2 to ${MAX_N}.`,
  parse(fields) {
    const s = (fields.n ?? "").trim();
    if (!/^\d+$/.test(s) || Number(s) < 2 || Number(s) > MAX_N)
      return { ok: false, errors: [`n must be a whole number from 2 to ${MAX_N}`] };
    return { ok: true, value: Number(s) };
  },
  format: (n) => ({ n: String(n) }),
  presets: [
    { id: "classic", label: "Up to 30", value: 30 },
    { id: "hundred", label: "Up to 100", value: 100 },
    { id: "square", label: "Up to 49 (stops at p = 7)", value: 49 },
  ],
  random: (rng, size) => rng.int(2, Math.min(MAX_N, Math.max(10, (size ?? 10) * 5))),
};

/**
 * The sieve of Eratosthenes: every number from 2 to n starts as a candidate. The
 * smallest candidate left is prime; cross out its multiples from p² (smaller multiples
 * have a smaller prime factor and are already crossed out). Once p² > n, every
 * candidate left is prime. Numbers sit in a table ten to a row; a crossed-out number
 * is written with a "×".
 */
export const sieve: AlgorithmModule<number, SieveOutput> = {
  id: "sieve",
  version: 1,
  pseudocode: [
    "procedure sieve(n)",
    "  mark 2..n as candidates",
    "  for p ← 2 while p · p ≤ n",
    "    if p is still a candidate:   // p is prime",
    "      for m ← p · p to n step p:  cross out m",
    "  return the candidates left",
  ],
  input,

  run(n, t) {
    const rows = Math.floor(n / COLS) + 1;
    const cellOf = (m: number): [number, number] => [Math.floor(m / COLS), m % COLS];
    const G = t.grid("N", rows, COLS, null, {
      label: `Numbers 0 to ${n}`,
      rowHeaders: Array.from({ length: rows }, (_, r) => String(r * COLS)),
      colHeaders: Array.from({ length: COLS }, (_, c) => `+${c}`),
    });
    const isCandidate = (m: number) => G.get(...cellOf(m)) === m;
    for (let m = 2; m <= n; m++) G.write(...cellOf(m), m, { line: 2 });
    let crossings = 0;
    for (let p = 2; p * p <= n; p++) {
      G.read([cellOf(p)], { line: 3, vars: { p, m: null } });
      if (!isCandidate(p)) {
        t.step({ line: 4, note: `${p} is crossed out, so it is not prime; skip it.` });
        continue;
      }
      G.mark([cellOf(p)], "path", {
        line: 4,
        note: `${p} is still a candidate, so it is prime. Cross out its multiples from ${p}² = ${p * p}.`,
      });
      for (let m = p * p; m <= n; m += p) {
        const again = !isCandidate(m);
        G.write(...cellOf(m), crossed(m), {
          line: 5,
          vars: { m },
          note: again ? `${m} was already crossed out; it is crossed again.` : undefined,
        });
        t.tally("crossings");
        crossings++;
      }
    }
    const primes: number[] = [];
    for (let m = 2; m <= n; m++) if (isCandidate(m)) primes.push(m);
    const rest = primes.filter((p) => p * p > n).map(cellOf);
    if (rest.length)
      G.mark(rest, "path", {
        line: 6,
        vars: { p: null, m: null },
        note: `Every number ≤ ${n} that is not prime has a prime factor ≤ √${n}, so the remaining candidates are prime.`,
      });
    const output: SieveOutput = { primes, crossings };
    t.finish(n, output, {
      line: 6,
      note: `${primes.length} primes up to ${n}, after ${crossings} crossings.`,
    });
    return output;
  },

  check(n, out) {
    // Independent oracle: trial division by every smaller number.
    const want: number[] = [];
    for (let m = 2; m <= n; m++) {
      let prime = true;
      for (let d = 2; d < m; d++) if (m % d === 0) prime = false;
      if (prime) want.push(m);
    }
    if (out.primes.join() !== want.join()) return `primes ${out.primes}, expected ${want}`;
    return null;
  },

  fidelity(state: TraceState, out) {
    const G = state.structures.N;
    if (G?.kind !== "grid") return "no table N";
    const primes = new Set(out.primes);
    for (let r = 0; r < G.rows; r++)
      for (let c = 0; c < G.cols; c++) {
        const m = r * COLS + c;
        const v = G.cells[r]![c];
        if (m < 2 || v === null) continue;
        const shown = primes.has(m) ? m : crossed(m);
        if (v !== shown) return `cell ${m} shows ${v}, expected ${shown}`;
        if ((G.marks[r]![c] === "path") !== primes.has(m))
          return `cell ${m} is ${primes.has(m) ? "not " : ""}marked prime`;
      }
    return null;
  },

  describeOutput: (out) => `${out.primes.length} primes: ${out.primes.join(", ")}`,
};
