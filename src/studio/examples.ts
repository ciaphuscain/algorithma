import type { Trace } from "@/engine/protocol";
import { Tracer } from "@/engine/tracer";

/**
 * Studio examples: algorithms that are NOT in the registry, written only against the
 * public tracer SDK — exactly what an outside contributor would do. They exist to
 * show (and, in tests, prove) that new algorithms reuse the existing renderers.
 */

export const SIEVE_PSEUDOCODE = [
  "procedure sieve(n)",
  "  mark every number 2..n as possibly prime",
  "  for p ← 2 while p² ≤ n",
  "    if p is still possibly prime",
  "      for m ← p², p² + p, … ≤ n",
  "        mark m composite",
  "  the unmarked numbers are prime",
];

/** Sieve of Eratosthenes (curriculum #362) on the numbers 2..n. */
export function sieveTrace(n = 30): Trace {
  const t = new Tracer({ id: "studio/sieve-of-eratosthenes", version: 1 });
  const numbers = Array.from({ length: n - 1 }, (_, i) => i + 2);
  const A = t.array("N", numbers, { label: "Numbers 2..n", display: "cells" });
  const composite = new Array<boolean>(n + 1).fill(false);
  const idx = (v: number) => v - 2;
  t.step({ line: 2, vars: { n }, note: `Start with every number from 2 to ${n} unmarked.` });
  for (let p = 2; p * p <= n; p++) {
    A.read(idx(p), { line: 4, vars: { p }, note: `Is ${p} still unmarked?` });
    if (composite[p]) {
      t.step({ line: 4, note: `${p} was already crossed out by a smaller prime; skip it.` });
      continue;
    }
    A.mark(idx(p), "found", {
      line: 4,
      note: `${p} is prime. Cross out its multiples from ${p * p}.`,
    });
    for (let m = p * p; m <= n; m += p) {
      if (!composite[m]) {
        composite[m] = true;
        A.mark(idx(m), "discarded", {
          line: 6,
          vars: { m },
          note: `${m} = ${p} × ${m / p} is composite.`,
        });
      }
    }
  }
  const primes = numbers.filter((v) => !composite[v]);
  A.mark(primes.map(idx), "found", {
    line: 7,
    vars: { p: null, m: null },
    note: `The primes up to ${n}: ${primes.join(", ")}.`,
  });
  return t.finish({ n }, primes);
}

export const PASCAL_PSEUDOCODE = [
  "procedure pascal(rows)",
  "  C[i][0] ← C[i][i] ← 1",
  "  C[i][j] ← C[i−1][j−1] + C[i−1][j]",
];

/** Pascal's triangle (curriculum #379): binomial coefficients in a table. */
export function pascalTrace(rows = 7): Trace {
  const t = new Tracer({ id: "studio/pascals-triangle", version: 1 });
  const C = t.grid("C", rows, rows, null, {
    label: "C(i, j)",
    rowHeaders: Array.from({ length: rows }, (_, i) => `i=${i}`),
    colHeaders: Array.from({ length: rows }, (_, j) => `j=${j}`),
  });
  for (let i = 0; i < rows; i++) {
    C.write(i, 0, 1, { line: 2, vars: { i }, note: `Row ${i} starts with 1.` });
    C.mark([[i, 0]], "base", { line: 2 });
    for (let j = 1; j < i; j++) {
      const v = C.num(i - 1, j - 1) + C.num(i - 1, j);
      C.read(
        [
          [i - 1, j - 1],
          [i - 1, j],
        ],
        {
          line: 3,
          vars: { j },
          note: `C(${i},${j}) = C(${i - 1},${j - 1}) + C(${i - 1},${j}) = ${C.num(i - 1, j - 1)} + ${C.num(i - 1, j)}.`,
        },
      );
      C.write(i, j, v, { line: 3 });
    }
    if (i > 0) {
      C.write(i, i, 1, { line: 2, vars: { j: i }, note: `Row ${i} ends with 1.` });
      C.mark([[i, i]], "base", { line: 2 });
    }
  }
  return t.finish({ rows }, null, {
    vars: { i: null, j: null },
    note: "Each entry is a binomial coefficient.",
  });
}

/** A deliberately broken trace, to show what validation reports. */
export function brokenTrace(): unknown {
  const trace = JSON.parse(JSON.stringify(sieveTrace(10))) as Trace;
  trace.events.splice(3, 0, { type: "array.swap", s: "N", i: 0, j: 42 });
  trace.meta.eventCount += 1;
  return trace;
}

export const STUDIO_EXAMPLES = [
  {
    id: "sieve",
    label: "Sieve of Eratosthenes (array)",
    build: () => sieveTrace(30),
    pseudocode: SIEVE_PSEUDOCODE,
  },
  {
    id: "pascal",
    label: "Pascal's triangle (grid)",
    build: () => pascalTrace(7),
    pseudocode: PASCAL_PSEUDOCODE,
  },
  {
    id: "broken",
    label: "A broken trace (shows validation)",
    build: brokenTrace,
    pseudocode: [] as string[],
  },
] as const;
