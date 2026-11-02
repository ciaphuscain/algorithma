import type { TraceState } from "@/engine/state";
import type { AlgorithmModule, InputSpec } from "../types";
import { stringPairInput, type StringPair } from "../inputs";
import { isPrime } from "../hashing/common";

export interface RabinKarpInput extends StringPair {
  /** Base: 10 (digit strings, digit values) or 256 (character codes). */
  d: 10 | 256;
  /** Prime modulus. */
  q: number;
}

export interface RabinKarpOutput {
  matches: number[];
  /** Windows whose hash equalled the pattern's but whose text did not. */
  spurious: number[];
  /** The hash of every window, in order. */
  windowHashes: number[];
  patternHash: number;
}

/** Character value for base d. */
export const charValue = (c: string, d: 10 | 256) =>
  d === 10 ? c.charCodeAt(0) - 48 : c.charCodeAt(0);

/** Polynomial hash of s: s[0]·d^(m−1) + … + s[m−1] mod q, by Horner's rule. */
export function polyHash(s: string, d: 10 | 256, q: number): number {
  let h = 0;
  for (const c of s) h = (h * d + charValue(c, d)) % q;
  return h;
}

const MAX_Q = 997;

const base = stringPairInput({
  labels: ["Text (T)", "Pattern (P)"],
  maxLength: [24, 8],
  minLength: [1, 1],
  alphabet: "0123456789",
  placeholders: ["e.g. 2359023141526739921", "e.g. 31415"],
  presets: [],
});

const input: InputSpec<RabinKarpInput> = {
  ...base,
  fields: [
    ...base.fields,
    { name: "d", label: "Base d (10 for digit strings, or 256)", placeholder: "10" },
    { name: "q", label: "Prime modulus q", placeholder: `e.g. 13 (at most ${MAX_Q})` },
  ],
  constraints: `${base.constraints} Base 10 needs digit strings; q is a prime from 2 to ${MAX_Q}.`,
  parse(f) {
    const r = base.parse(f);
    const errors = r.ok ? [] : [...r.errors];
    const ds = (f.d ?? "").trim() || "10";
    const d = ds === "10" ? 10 : ds === "256" ? 256 : null;
    if (d === null) errors.push("The base must be 10 or 256");
    const qs = (f.q ?? "").trim();
    const q = /^\d+$/.test(qs) ? Number(qs) : NaN;
    if (!(q >= 2 && q <= MAX_Q) || !isPrime(q)) errors.push(`q must be a prime from 2 to ${MAX_Q}`);
    if (r.ok && d === 10 && !/^\d+$/.test(r.value.a + r.value.b))
      errors.push("With base 10, text and pattern must be digit strings");
    if (errors.length || !r.ok) return { ok: false, errors: errors.slice(0, 5) };
    return { ok: true, value: { ...r.value, d: d!, q } };
  },
  format: (v) => ({ ...base.format(v), d: String(v.d), q: String(v.q) }),
  presets: [
    {
      id: "classic",
      label: "CLRS example: one match, one spurious hit (q = 13)",
      value: { a: "2359023141526739921", b: "31415", d: 10, q: 13 },
    },
    {
      id: "small-q",
      label: "A tiny modulus: many spurious hits (q = 3)",
      value: { a: "1203691215", b: "30", d: 10, q: 3 },
    },
    {
      id: "letters",
      label: "Letters, base 256 (q = 101)",
      value: { a: "abracadabra", b: "abra", d: 256, q: 101 },
    },
  ],
  random(rng, size) {
    const v = base.random(rng, size);
    const primes = [3, 5, 7, 11, 13, 101];
    return { ...v, d: 10, q: primes[rng.int(0, primes.length - 1)]! };
  },
};

/**
 * Rabin–Karp: compare the pattern's hash with the hash of every window of the text,
 * and compare characters only when the hashes agree. The window hash is updated in
 * O(1) per shift: drop the leading character's term, multiply by d, add the new
 * character. Equal hashes with different text are "spurious hits".
 */
export const rabinKarp: AlgorithmModule<RabinKarpInput, RabinKarpOutput> = {
  id: "rabin-karp",
  version: 1,
  pseudocode: [
    "procedure RabinKarp(T, P, d, q)",
    "  h ← d^(m−1) mod q;  p ← hash(P);  t ← hash(T[0..m−1])   // Horner's rule",
    "  for s ← 0 to n − m",
    "    if p = t",
    "      compare P with T[s..s+m−1] character by character: a match, or a spurious hit",
    "    if s < n − m:  t ← (d·(t − T[s]·h) + T[s+m]) mod q   // roll the window",
  ],
  input,

  run(input, t) {
    const { a: text, b: pat, d, q } = input;
    const [n, m] = [text.length, pat.length];
    const T = t.array("T", [...text], { label: "Text T", display: "cells" });
    t.array("P", [...pat], { label: "Pattern P", display: "cells" });
    const v = (c: string) => charValue(c, d);
    let h = 1;
    for (let i = 1; i < m; i++) h = (h * d) % q;
    let p = 0;
    let w = 0;
    for (let i = 0; i < m; i++) {
      p = (p * d + v(pat[i]!)) % q;
      if (i < n) w = (w * d + v(text[i]!)) % q;
    }
    const matches: number[] = [];
    const spurious: number[] = [];
    const windowHashes: number[] = [];
    t.step({
      line: 2,
      vars: { d, q, h, p, t: m <= n ? w : null },
      note:
        m > n
          ? "The pattern is longer than the text: no window to check."
          : `hash(P) = ${p}, and the first window's hash is ${w} (all mod ${q}).`,
    });
    const window = (s: number) => Array.from({ length: m }, (_, j) => s + j);
    for (let s = 0; s + m <= n; s++) {
      windowHashes.push(w);
      T.mark(window(s), "active", { line: 3, vars: { s, t: w } });
      if (w === p) {
        let ok = true;
        for (let j = 0; j < m; j++) {
          const order = T.compareWith(s + j, pat[j]!, {
            line: 5,
            note: j === 0 ? `Hashes agree (${w}): check the characters.` : undefined,
          });
          if (order !== 0) {
            ok = false;
            break;
          }
        }
        if (ok) {
          matches.push(s);
          T.mark(window(s), "found", { line: 5, note: `Match at shift ${s}.` });
        } else {
          spurious.push(s);
          t.tally("spurious");
          T.mark(window(s), "discarded", {
            line: 5,
            note: `Spurious hit at shift ${s}: same hash ${w}, different text.`,
          });
        }
      } else {
        t.step({
          line: 4,
          note: `Shift ${s}: window hash ${w} ≠ ${p}; skip without comparing characters.`,
        });
      }
      if (s + m < n) {
        const [out, inn] = [text[s]!, text[s + m]!];
        const next = (((w - ((v(out) * h) % q) + q) % q) * d + v(inn)) % q;
        t.tally("rolls");
        T.mark(window(s), null, {
          line: 6,
          vars: { t: next },
          note: `Roll: drop '${out}', add '${inn}': (${d}·(${w} − ${v(out)}·${h}) + ${v(inn)}) mod ${q} = ${next}.`,
        });
        w = next;
      }
    }
    for (const s of matches) T.mark(window(s), "found", { line: 3 });
    const output: RabinKarpOutput = { matches, spurious, windowHashes, patternHash: p };
    t.finish(input, output, {
      line: 3,
      vars: { s: null },
      note: `${matches.length} match${matches.length === 1 ? "" : "es"}, ${spurious.length} spurious hit${spurious.length === 1 ? "" : "s"}.`,
    });
    return output;
  },

  check(input, out) {
    // Independent oracles: naive matching, and every window's hash computed from scratch.
    const { a: text, b: pat, d, q } = input;
    const want: number[] = [];
    for (let s = 0; s + pat.length <= text.length; s++)
      if (text.slice(s, s + pat.length) === pat) want.push(s);
    if (out.matches.join() !== want.join()) return `matches ${out.matches}, expected ${want}`;
    if (out.patternHash !== polyHash(pat, d, q)) return "wrong pattern hash";
    for (let s = 0; s + pat.length <= text.length; s++) {
      const hs = polyHash(text.slice(s, s + pat.length), d, q);
      if (out.windowHashes[s] !== hs)
        return `window ${s} has hash ${out.windowHashes[s]}, expected ${hs}`;
    }
    const spurious = out.windowHashes.flatMap((x, s) =>
      x === out.patternHash && !want.includes(s) ? [s] : [],
    );
    if (out.spurious.join() !== spurious.join())
      return `spurious hits ${out.spurious}, expected ${spurious}`;
    return null;
  },

  fidelity(state: TraceState, out) {
    const T = state.structures.T;
    if (T?.kind !== "array") return "no array T";
    const m = (state.structures.P as { values: unknown[] } | undefined)?.values.length ?? 0;
    for (const s of out.matches)
      for (let j = 0; j < m; j++) if (T.marks[s + j] !== "found") return `match at ${s} not marked`;
    return null;
  },

  describeOutput: (o) =>
    `Matches at ${o.matches.join(", ") || "none"}; spurious hits at ${o.spurious.join(", ") || "none"}`,
};
