import type { TraceState } from "@/engine/state";
import type { AlgorithmModule } from "../types";
import { stringPairInput, type StringPair } from "../inputs";

export interface LcsOutput {
  length: number;
  /** One longest common subsequence. */
  subsequence: string;
}

/** Longest common subsequence by bottom-up DP with traceback. */
export const lcs: AlgorithmModule<StringPair, LcsOutput> = {
  id: "lcs",
  version: 1,
  pseudocode: [
    "procedure LCS(a, b)",
    "  L[i][0] ← 0;  L[0][j] ← 0",
    "  for i ← 1 to m",
    "    for j ← 1 to n",
    "      if a[i] = b[j]: L[i][j] ← L[i−1][j−1] + 1",
    "      else L[i][j] ← max(L[i−1][j], L[i][j−1])",
    "  trace back from L[m][n] to read off the subsequence",
    "  return L[m][n]",
  ],
  input: stringPairInput({
    labels: ["First string (a)", "Second string (b)"],
    maxLength: 10,
    placeholders: ["e.g. ABCBDAB", "e.g. BDCABA"],
    alphabet: "ABCD",
    presets: [
      { id: "clrs", label: "ABCBDAB / BDCABA", value: { a: "ABCBDAB", b: "BDCABA" } },
      { id: "dna", label: "DNA fragments", value: { a: "GATTACA", b: "TAGACCA" } },
      { id: "none", label: "Nothing in common", value: { a: "abc", b: "xyz" } },
      { id: "same", label: "Identical", value: { a: "algo", b: "algo" } },
    ],
  }),

  run(input, t) {
    const { a, b } = input;
    const [m, n] = [a.length, b.length];
    const L = t.grid("L", m + 1, n + 1, null, {
      label: "L (LCS lengths)",
      rowHeaders: ["ε", ...a],
      colHeaders: ["ε", ...b],
    });
    t.initVars({ a, b });
    for (let i = 0; i <= m; i++) {
      L.write(i, 0, 0, { line: 2 });
      L.mark([[i, 0]], "base", { line: 2 });
    }
    for (let j = 1; j <= n; j++) {
      L.write(0, j, 0, { line: 2 });
      L.mark([[0, j]], "base", { line: 2 });
    }
    t.step({
      line: 2,
      note: "A common subsequence with an empty string is empty: the first row and column are 0.",
    });
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (a[i - 1] === b[j - 1]) {
          L.read([[i - 1, j - 1]], {
            line: 5,
            vars: { i, j },
            note: `a[${i}] = b[${j}] = '${a[i - 1]}': extend the diagonal.`,
          });
          L.write(i, j, L.num(i - 1, j - 1) + 1, {
            line: 5,
            note: `L[${i}][${j}] = ${L.num(i - 1, j - 1)} + 1 = ${L.num(i - 1, j - 1) + 1}.`,
          });
        } else {
          const [up, left] = [L.num(i - 1, j), L.num(i, j - 1)];
          L.read(
            [
              [i - 1, j],
              [i, j - 1],
            ],
            {
              line: 6,
              vars: { i, j },
              note: `'${a[i - 1]}' ≠ '${b[j - 1]}': keep the better of dropping a[${i}] (${up}) or b[${j}] (${left}).`,
            },
          );
          L.write(i, j, Math.max(up, left), { line: 6 });
        }
        L.mark([[i, j]], "filled", { line: 6 });
      }
    }
    // Traceback: diagonal on a match, otherwise move towards the larger neighbour (up on ties).
    let i = m;
    let j = n;
    const chars: string[] = [];
    L.mark([[i, j]], "path", {
      line: 7,
      vars: { i, j },
      note: `L[${m}][${n}] = ${L.num(m, n)}. Walk back to recover one LCS.`,
    });
    while (i > 0 && j > 0) {
      if (a[i - 1] === b[j - 1]) {
        chars.push(a[i - 1]!);
        i--;
        j--;
        L.mark([[i, j]], "path", {
          line: 7,
          vars: { i, j },
          note: `Match '${chars.at(-1)}': it belongs to the LCS.`,
        });
      } else if (L.num(i - 1, j) >= L.num(i, j - 1)) {
        i--;
        L.mark([[i, j]], "path", { line: 7, vars: { i, j } });
      } else {
        j--;
        L.mark([[i, j]], "path", { line: 7, vars: { i, j } });
      }
    }
    const output: LcsOutput = { length: L.num(m, n), subsequence: chars.reverse().join("") };
    t.finish(input, output, {
      line: 8,
      vars: { i: null, j: null },
      note: `LCS length ${output.length}: "${output.subsequence}".`,
    });
    return output;
  },

  check(input, out) {
    // Independent oracle: memoised recursion on suffixes.
    const { a, b } = input;
    const memo = new Map<string, number>();
    const best = (i: number, j: number): number => {
      if (i === a.length || j === b.length) return 0;
      const k = `${i},${j}`;
      if (!memo.has(k))
        memo.set(
          k,
          a[i] === b[j] ? 1 + best(i + 1, j + 1) : Math.max(best(i + 1, j), best(i, j + 1)),
        );
      return memo.get(k)!;
    };
    const isSubsequence = (s: string, of: string) => {
      let p = 0;
      for (const ch of of) if (p < s.length && s[p] === ch) p++;
      return p === s.length;
    };
    if (out.length !== best(0, 0)) return `length ${out.length}, expected ${best(0, 0)}`;
    if (out.subsequence.length !== out.length)
      return "subsequence length differs from the reported length";
    if (!isSubsequence(out.subsequence, a) || !isSubsequence(out.subsequence, b))
      return `"${out.subsequence}" is not common to both strings`;
    return null;
  },

  fidelity(state: TraceState, out) {
    const L = state.structures.L;
    if (!L || L.kind !== "grid") return "no grid L";
    return L.cells[L.rows - 1]![L.cols - 1] === out.length
      ? null
      : "L[m][n] differs from the length";
  },

  describeOutput: (out) => `Length ${out.length}: "${out.subsequence}"`,
};
