import type { TraceState } from "@/engine/state";
import type { AlgorithmModule } from "../types";
import { stringPairInput, type StringPair } from "../inputs";

export interface EditDistanceOutput {
  distance: number;
  /** One optimal edit script, e.g. ["substitute k→s", "keep i", "insert g"]. */
  operations: string[];
}

/**
 * Levenshtein distance by bottom-up dynamic programming. D[i][j] is the distance
 * between the first i characters of a and the first j characters of b. A traceback
 * from D[m][n] recovers one optimal sequence of edits.
 */
export const editDistance: AlgorithmModule<StringPair, EditDistanceOutput> = {
  id: "edit-distance",
  version: 1,
  pseudocode: [
    "procedure editDistance(a, b)",
    "  D[i][0] ← i for i = 0..m;  D[0][j] ← j for j = 0..n",
    "  for i ← 1 to m",
    "    for j ← 1 to n",
    "      cost ← 0 if a[i] = b[j] else 1",
    "      del ← D[i−1][j] + 1      // delete a[i]",
    "      ins ← D[i][j−1] + 1      // insert b[j]",
    "      sub ← D[i−1][j−1] + cost // keep/substitute",
    "      D[i][j] ← min(del, ins, sub)",
    "  trace back from D[m][n] to list the edits",
    "  return D[m][n]",
  ],
  input: stringPairInput({
    labels: ["From (a)", "To (b)"],
    maxLength: 10,
    presets: [
      { id: "kitten", label: "kitten → sitting", value: { a: "kitten", b: "sitting" } },
      { id: "sunday", label: "sunday → saturday", value: { a: "sunday", b: "saturday" } },
      { id: "same", label: "Identical strings", value: { a: "algo", b: "algo" } },
      { id: "empty", label: "From the empty string", value: { a: "", b: "abc" } },
    ],
  }),

  run(input, t) {
    const { a, b } = input;
    const m = a.length;
    const n = b.length;
    const D = t.grid("D", m + 1, n + 1, null, {
      label: "D (edit distances)",
      rowHeaders: ["ε", ...a],
      colHeaders: ["ε", ...b],
    });
    t.initVars({ a, b });

    for (let i = 0; i <= m; i++) {
      D.write(i, 0, i, {
        line: 2,
        vars: { i, j: 0 },
        note:
          i === 0
            ? "Transforming ε into ε costs 0."
            : `Turning "${a.slice(0, i)}" into ε takes ${i} deletion${i === 1 ? "" : "s"}.`,
      });
      D.mark([[i, 0]], "base", { line: 2 });
    }
    for (let j = 1; j <= n; j++) {
      D.write(0, j, j, {
        line: 2,
        vars: { i: 0, j },
        note: `Turning ε into "${b.slice(0, j)}" takes ${j} insertion${j === 1 ? "" : "s"}.`,
      });
      D.mark([[0, j]], "base", { line: 2 });
    }

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const same = a[i - 1] === b[j - 1];
        const cost = same ? 0 : 1;
        const del = D.num(i - 1, j) + 1;
        const ins = D.num(i, j - 1) + 1;
        const diag = D.num(i - 1, j - 1) + cost;
        const best = Math.min(del, ins, diag);
        D.read(
          [
            [i - 1, j],
            [i, j - 1],
            [i - 1, j - 1],
          ],
          {
            line: 5,
            vars: { i, j, cost, del, ins, sub: diag },
            note: `a[${i}] = '${a[i - 1]}' and b[${j}] = '${b[j - 1]}' ${same ? "match, so cost = 0" : "differ, so cost = 1"}. From the three neighbours: del = ${del}, ins = ${ins}, sub = ${diag}.`,
          },
        );
        const why =
          best === diag
            ? same
              ? `keep '${a[i - 1]}' (diagonal, ${diag})`
              : `substitute '${a[i - 1]}'→'${b[j - 1]}' (diagonal + 1 = ${diag})`
            : best === del
              ? `delete '${a[i - 1]}' (above + 1 = ${del})`
              : `insert '${b[j - 1]}' (left + 1 = ${ins})`;
        D.write(i, j, best, {
          line: 9,
          note: `D[${i}][${j}] = min(${del}, ${ins}, ${diag}) = ${best}: ${why}.`,
        });
        D.mark([[i, j]], "filled", { line: 9 });
      }
    }

    // Traceback, preferring the diagonal, then deletion, then insertion (deterministic).
    const operations: string[] = [];
    let i = m;
    let j = n;
    D.mark([[i, j]], "path", {
      line: 10,
      vars: { i, j, cost: null, del: null, ins: null, sub: null },
      note: `D[${m}][${n}] = ${D.num(m, n)} is the answer. Trace back how it was reached.`,
    });
    while (i > 0 || j > 0) {
      const here = D.num(i, j);
      if (i > 0 && j > 0 && here === D.num(i - 1, j - 1) + (a[i - 1] === b[j - 1] ? 0 : 1)) {
        operations.push(
          a[i - 1] === b[j - 1] ? `keep ${a[i - 1]}` : `substitute ${a[i - 1]}→${b[j - 1]}`,
        );
        i--;
        j--;
      } else if (i > 0 && here === D.num(i - 1, j) + 1) {
        operations.push(`delete ${a[i - 1]}`);
        i--;
      } else {
        operations.push(`insert ${b[j - 1]}`);
        j--;
      }
      D.mark([[i, j]], "path", {
        line: 10,
        vars: { i, j },
        note: `Step back: ${operations.at(-1)}.`,
      });
    }
    operations.reverse();
    const output: EditDistanceOutput = { distance: D.num(m, n), operations };
    t.finish(input, output, {
      line: 11,
      vars: { i: null, j: null },
      note: `Distance ${output.distance}. Edits: ${operations.filter((o) => !o.startsWith("keep")).join(", ") || "none"}.`,
    });
    return output;
  },

  check(input, out) {
    // Independent oracle: memoised recursion on suffixes (a different formulation).
    const { a, b } = input;
    const memo = new Map<string, number>();
    const lev = (i: number, j: number): number => {
      if (i === a.length) return b.length - j;
      if (j === b.length) return a.length - i;
      const key = `${i},${j}`;
      const hit = memo.get(key);
      if (hit !== undefined) return hit;
      const r =
        a[i] === b[j]
          ? lev(i + 1, j + 1)
          : 1 + Math.min(lev(i + 1, j), lev(i, j + 1), lev(i + 1, j + 1));
      memo.set(key, r);
      return r;
    };
    if (out.distance !== lev(0, 0)) return `distance ${out.distance}, expected ${lev(0, 0)}`;
    // The edit script must turn a into b using exactly `distance` non-keep operations.
    let pos = 0;
    let result = "";
    let edits = 0;
    for (const op of out.operations) {
      const [kind, arg] = op.split(" ") as [string, string];
      if (kind === "keep") {
        if (a[pos] !== arg) return `keep ${arg} but a[${pos}] = ${a[pos]}`;
        result += arg;
        pos++;
      } else if (kind === "substitute") {
        const [from, to] = arg.split("→") as [string, string];
        if (a[pos] !== from || from === to) return `bad substitution ${op}`;
        result += to;
        pos++;
        edits++;
      } else if (kind === "delete") {
        if (a[pos] !== arg) return `delete ${arg} but a[${pos}] = ${a[pos]}`;
        pos++;
        edits++;
      } else if (kind === "insert") {
        result += arg;
        edits++;
      } else return `unknown operation ${op}`;
    }
    if (pos !== a.length || result !== b) return `edit script produces "${result}", not "${b}"`;
    if (edits !== out.distance) return `script has ${edits} edits but distance is ${out.distance}`;
    return null;
  },

  fidelity(state: TraceState, out) {
    const D = state.structures.D;
    if (!D || D.kind !== "grid") return "no grid D";
    if (D.cells[D.rows - 1]![D.cols - 1] !== out.distance)
      return "D[m][n] differs from the distance";
    if (D.marks[0]![0] !== "path" || D.marks[D.rows - 1]![D.cols - 1] !== "path")
      return "traceback path incomplete";
    const pathCells = D.marks.flat().filter((m) => m === "path").length;
    return pathCells === out.operations.length + 1
      ? null
      : `path has ${pathCells} cells for ${out.operations.length} operations`;
  },

  describeOutput: (out) =>
    `Distance ${out.distance}: ${out.operations.join(", ") || "(both empty)"}`,
};
