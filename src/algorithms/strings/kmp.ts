import type { Scalar } from "@/engine/protocol";
import type { TraceState } from "@/engine/state";
import type { AlgorithmModule } from "../types";
import { stringPairInput, type StringPair } from "../inputs";

export interface KmpOutput {
  /** 0-based start positions of every occurrence of the pattern in the text. */
  matches: number[];
  lps: number[];
}

/** Knuth–Morris–Pratt: build the prefix function of the pattern, then scan the text once. */
export const kmp: AlgorithmModule<StringPair, KmpOutput> = {
  id: "kmp",
  version: 1,
  pseudocode: [
    "procedure KMP(T, P)",
    "  lps[0] ← 0;  k ← 0;  q ← 1",
    "  while q < m",
    "    if P[q] = P[k]: k ← k + 1;  lps[q] ← k;  q ← q + 1",
    "    else if k > 0: k ← lps[k − 1]",
    "    else: lps[q] ← 0;  q ← q + 1",
    "  i ← 0;  j ← 0   // j = pattern characters matched",
    "  while i < n",
    "    if T[i] = P[j]: i ← i + 1;  j ← j + 1",
    "      if j = m: report a match at i − m;  j ← lps[j − 1]",
    "    else if j > 0: j ← lps[j − 1]",
    "    else: i ← i + 1",
  ],
  input: stringPairInput({
    labels: ["Text (T)", "Pattern (P)"],
    maxLength: [24, 8],
    minLength: [1, 1],
    alphabet: "ab",
    placeholders: ["e.g. ababcabcabababd", "e.g. ababd"],
    presets: [
      {
        id: "classic",
        label: "ababd in a longer text",
        value: { a: "ababcabcabababd", b: "ababd" },
      },
      { id: "overlap", label: "Overlapping matches", value: { a: "aaaaab", b: "aaa" } },
      { id: "periodic", label: "Periodic pattern", value: { a: "abababababab", b: "abab" } },
      { id: "none", label: "No match", value: { a: "abcabcabc", b: "abd" } },
    ],
  }),

  run(input, t) {
    const { a: text, b: pat } = input;
    const [n, m] = [text.length, pat.length];
    const T = t.array("T", [...text], { label: "Text T", display: "cells" });
    const P = t.array("P", [...pat], { label: "Pattern P", display: "cells" });
    const LPS = t.array(
      "lps",
      [...pat].map((): Scalar => null),
      { label: "lps (longest proper prefix that is also a suffix)", display: "cells" },
    );
    const lps = new Array<number>(m).fill(0);

    // Phase 1: prefix function. Every loop iteration makes exactly one comparison.
    LPS.write(0, 0, {
      line: 2,
      vars: { k: 0, q: 1 },
      note: "Phase 1: preprocess the pattern. lps[0] = 0 (a single character has no proper prefix).",
    });
    let k = 0;
    let q = 1;
    while (q < m) {
      const [qq, kk] = [q, k];
      P.pointer("q", qq, { line: 3, vars: { q: qq } });
      const equal =
        P.compare(qq, kk, () => ({
          line: 4,
          note: `P[${qq}] = '${pat[qq]}' vs P[${kk}] = '${pat[kk]}'.`,
        })) === 0;
      if (equal) {
        k++;
        lps[q] = k;
        LPS.write(q, k, {
          line: 4,
          vars: { k },
          note: `Equal: lps[${q}] = ${k}, because "${pat.slice(0, q + 1)}" starts and ends with "${pat.slice(0, k)}".`,
        });
        q++;
      } else if (k > 0) {
        k = lps[k - 1]!;
        t.step({
          line: 5,
          vars: { k },
          note: `Different: try the next shorter border, k = lps[${kk - 1}] = ${k}.`,
        });
      } else {
        lps[q] = 0;
        LPS.write(q, 0, {
          line: 6,
          note: `Different and k = 0: "${pat.slice(0, q + 1)}" has no border, so lps[${q}] = 0.`,
        });
        q++;
      }
    }
    P.pointer("q", null, { line: 7, vars: { q: null, k: null } });

    // Phase 2: scan the text; the text pointer never moves backwards.
    const matches: number[] = [];
    let i = 0;
    let j = 0;
    t.step({
      line: 7,
      vars: { i, j },
      note: "Phase 2: scan the text. j counts how many pattern characters currently match.",
    });
    while (i < n) {
      const [ii, jj] = [i, j];
      T.pointer("i", ii, { line: 8, vars: { i: ii } });
      P.pointer("j", jj, { line: 8, vars: { j: jj } });
      const equal =
        T.compareWith(ii, pat[jj]!, () => ({
          line: 9,
          note: `T[${ii}] = '${text[ii]}' vs P[${jj}] = '${pat[jj]}'.`,
        })) === 0;
      if (equal) {
        i++;
        j++;
        if (j === m) {
          const start = i - m;
          matches.push(start);
          T.mark(
            Array.from({ length: m }, (_, x) => start + x),
            "found",
            {
              line: 10,
              vars: { i, j },
              note: `All ${m} characters match: occurrence at position ${start}.`,
            },
          );
          j = lps[j - 1]!;
          t.step({
            line: 10,
            vars: { j },
            note: `Continue with j = lps[${m - 1}] = ${j}, so overlapping matches are found too.`,
          });
        } else {
          t.step({
            line: 9,
            vars: { i, j },
            note: `Match: ${j} character${j === 1 ? "" : "s"} of the pattern now match.`,
          });
        }
      } else if (j > 0) {
        j = lps[j - 1]!;
        t.step({
          line: 11,
          vars: { j },
          note: `Mismatch: keep the ${j} character${j === 1 ? "" : "s"} that still match (j = lps[${jj - 1}]); the text pointer stays.`,
        });
      } else {
        i++;
        t.step({
          line: 12,
          vars: { i },
          note: "Mismatch at the start of the pattern: move on in the text.",
        });
      }
    }
    T.pointer("i", null, { line: 12, vars: { i: null, j: null } });
    P.pointer("j", null, { line: 12 });
    const output: KmpOutput = { matches, lps };
    t.finish(input, output, {
      line: 11,
      note: matches.length
        ? `Found ${matches.length} match${matches.length === 1 ? "" : "es"} at ${matches.join(", ")}.`
        : "No occurrence of the pattern.",
    });
    return output;
  },

  check(input, out) {
    const { a: text, b: pat } = input;
    const want: number[] = [];
    for (let s = 0; s + pat.length <= text.length; s++)
      if (text.slice(s, s + pat.length) === pat) want.push(s);
    if (JSON.stringify(out.matches) !== JSON.stringify(want))
      return `matches [${out.matches}], expected [${want}]`;
    // lps[q] must be the longest proper border of P[0..q], checked by brute force.
    for (let q = 0; q < pat.length; q++) {
      const s = pat.slice(0, q + 1);
      let border = 0;
      for (let len = q; len > 0; len--)
        if (s.slice(0, len) === s.slice(s.length - len)) {
          border = len;
          break;
        }
      if (out.lps[q] !== border) return `lps[${q}] = ${out.lps[q]}, expected ${border}`;
    }
    return null;
  },

  fidelity(state: TraceState, out) {
    const L = state.structures.lps;
    if (!L || L.kind !== "array" || JSON.stringify(L.values) !== JSON.stringify(out.lps))
      return "lps array differs";
    return null;
  },

  describeOutput: (out) =>
    out.matches.length
      ? `Matches at ${out.matches.join(", ")}; lps = [${out.lps.join(", ")}]`
      : `No match; lps = [${out.lps.join(", ")}]`,
};
