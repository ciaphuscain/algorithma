import type { Scalar } from "@/engine/protocol";
import type { TraceState } from "@/engine/state";
import type { AlgorithmModule } from "../types";
import { wordInput } from "./common";

export interface SuffixArrayOutput {
  /** Start positions of the suffixes in lexicographic order. */
  sa: number[];
  /** Doubling rounds after the first sort by one letter. */
  rounds: number;
}

const COLS = ["start i", "suffix", "key", "rank"] as const;
const [START, SUFFIX, KEY, RANK] = [0, 1, 2, 3];

/**
 * Prefix doubling (Manber–Myers style): sort the suffixes by their first letter, then
 * repeatedly by their first 2k letters, using the pair (rank of the first k letters,
 * rank of the next k). Ranks become distinct after at most ⌈log₂ n⌉ rounds.
 */
export const suffixArray: AlgorithmModule<string, SuffixArrayOutput> = {
  id: "suffix-array",
  version: 1,
  pseudocode: [
    "procedure SuffixArray(s)",
    "  sort the suffixes by their first letter;  rank[i] ← position of s[i] among the distinct letters",
    "  k ← 1",
    "  while two suffixes share a rank",
    "    key(i) ← (rank[i], rank[i + k]), or (rank[i], −1) when i + k ≥ n   // ranks the first 2k letters",
    "    sort the suffixes by key",
    "    rank[SA[0]] ← 0;  rank[SA[j]] ← rank[SA[j − 1]], plus 1 if their keys differ",
    "    k ← 2k",
    "  return SA",
  ],
  input: wordInput({
    label: "Text",
    minLength: 1,
    maxLength: 12,
    placeholder: "e.g. banana",
    randomAlphabet: "ab",
    presets: [
      { id: "classic", label: "banana", value: "banana" },
      { id: "mississippi", label: "mississippi", value: "mississippi" },
      { id: "repeat", label: "aaaaa (most rounds)", value: "aaaaa" },
    ],
  }),

  run(input, t) {
    const n = input.length;
    t.array("S", [...input] as Scalar[], { label: "Text s", display: "cells" });
    const RANK_ARRAY = t.array(
      "rank",
      [...input].map((): Scalar => null),
      { label: "rank[i] (by the first 2k letters of suffix i)", display: "cells" },
    );
    const G = t.grid("R", n, COLS.length, null, {
      label: "Suffixes in sorted order",
      rowHeaders: Array.from({ length: n }, (_, j) => `SA[${j}]`),
      colHeaders: [...COLS],
    });
    const letters = [...new Set(input)].sort();
    let rank = [...input].map((c) => letters.indexOf(c));
    let sa = Array.from({ length: n }, (_, i) => i);
    sa.sort((a, b) => rank[a]! - rank[b]! || a - b);

    const showRows = (keys: (i: number) => string, line: number) => {
      G.mark(
        sa.map((_, j) => [j, RANK] as [number, number]),
        null,
        { line },
      );
      sa.forEach((i, j) => {
        G.write(j, START, i, { line });
        G.write(j, SUFFIX, input.slice(i), { line });
        G.write(j, KEY, keys(i), { line });
        G.write(j, RANK, null, { line });
      });
    };
    const showRanks = (line: number) => {
      sa.forEach((i, j) => G.write(j, RANK, rank[i]!, { line }));
      rank.forEach((r, i) => RANK_ARRAY.write(i, r, { line }));
      const distinct = new Set(rank).size;
      G.mark(
        sa.flatMap((i, j) =>
          rank.filter((r) => r === rank[i]).length === 1 ? [[j, RANK] as [number, number]] : [],
        ),
        "filled",
        {
          line,
          note:
            distinct === n
              ? "Every suffix has its own rank: the order is final."
              : `${distinct} distinct rank${distinct === 1 ? "" : "s"} for ${n} suffixes: suffixes sharing a rank still tie.`,
        },
      );
    };

    showRows((i) => input[i]!, 2);
    showRanks(2);

    let k = 1;
    let rounds = 0;
    while (new Set(rank).size < n) {
      if (k >= n) throw new Error("ranks failed to separate the suffixes");
      rounds++;
      const r = rank;
      const second = (i: number) => (i + k < n ? r[i + k]! : -1);
      t.step({
        line: 4,
        vars: { k },
        note: `Round ${rounds}: compare the first ${2 * k} letters of each suffix, as the pair (rank of the first ${k}, rank of the next ${k}).`,
      });
      sa.forEach((i, j) => G.write(j, KEY, `(${r[i]}, ${second(i)})`, { line: 5 }));
      sa = [...sa].sort((a, b) => r[a]! - r[b]! || second(a) - second(b) || a - b);
      showRows((i) => `(${r[i]}, ${second(i)})`, 6);
      const next = new Array<number>(n).fill(0);
      for (let j = 1; j < n; j++) {
        const [a, b] = [sa[j - 1]!, sa[j]!];
        next[b] = next[a]! + (r[a] !== r[b] || second(a) !== second(b) ? 1 : 0);
      }
      rank = next;
      showRanks(7);
      k *= 2;
      t.step({ line: 8, vars: { k } });
    }
    G.mark(
      sa.map((_, j) => [j, START] as [number, number]),
      "path",
      { line: 9, vars: { k: null } },
    );
    const output: SuffixArrayOutput = { sa, rounds };
    t.finish(input, output, {
      line: 9,
      note: `SA = [${sa.join(", ")}] after ${rounds} doubling round${rounds === 1 ? "" : "s"}.`,
    });
    return output;
  },

  check(input, out) {
    // Independent oracle: sort the suffix strings directly.
    const want = Array.from({ length: input.length }, (_, i) => i).sort((a, b) =>
      input.slice(a) < input.slice(b) ? -1 : 1,
    );
    if (JSON.stringify(out.sa) !== JSON.stringify(want)) return `SA ${out.sa}, expected ${want}`;
    // Rounds: the first r with all prefixes of length 2^r distinct.
    let r = 0;
    const distinct = (len: number) =>
      new Set(want.map((i) => input.slice(i, i + len))).size === input.length;
    while (!distinct(2 ** r)) r++;
    if (out.rounds !== r) return `${out.rounds} rounds, expected ${r}`;
    return null;
  },

  fidelity(state: TraceState, out) {
    const g = state.structures.R;
    if (g?.kind !== "grid") return "no grid R";
    const shown = g.cells.map((row) => row[START]);
    return JSON.stringify(shown) === JSON.stringify(out.sa) ? null : `table shows ${shown}`;
  },

  describeOutput: (out) => `SA = [${out.sa.join(", ")}]`,
};
