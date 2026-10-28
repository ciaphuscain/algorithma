import type { TraceState } from "@/engine/state";
import type { AlgorithmModule } from "../types";
import { cityName, permutations, squareMatrixInput } from "./matrix-input";

export interface TspOutput {
  cost: number;
  /** City indices, starting and ending at city 0 (A). */
  tour: number[];
}

const setName = (mask: number, n: number) =>
  `{${Array.from({ length: n }, (_, i) => i)
    .filter((i) => mask & (1 << i))
    .map(cityName)
    .join(",")}}`;

const popcount = (x: number) => x.toString(2).replace(/0/g, "").length;

/**
 * Held–Karp: dp[S][j] is the cheapest path that starts at A, visits exactly the
 * cities in S and ends at j. Each entry extends the best path over S \ {j} by one
 * edge, so the whole table costs O(2ⁿ · n²) instead of the (n − 1)! tours.
 */
export const heldKarp: AlgorithmModule<number[][], TspOutput> = {
  id: "held-karp",
  version: 1,
  pseudocode: [
    "procedure HeldKarp(w)   // cities 0 … n − 1; tours start and end at city 0",
    "  dp[{0}][0] ← 0",
    "  for each set S containing 0, in order of size",
    "    for each city j in S other than 0",
    "      dp[S][j] ← min over k in S \\ {j} of dp[S \\ {j}][k] + w[k][j]",
    "  cost ← min over j of dp[all cities][j] + w[j][0]",
    "  follow the minimising choices back from that j to recover the tour",
  ],
  input: squareMatrixInput({
    label: "Distances (row = from, column = to)",
    minSize: 2,
    maxSize: 6,
    maxValue: 99,
    zeroDiagonal: true,
    placeholder: "0 2 9 10\n1 0 6 4\n15 7 0 8\n6 3 12 0",
    presets: [
      {
        id: "classic",
        label: "Four cities (asymmetric)",
        value: [
          [0, 2, 9, 10],
          [1, 0, 6, 4],
          [15, 7, 0, 8],
          [6, 3, 12, 0],
        ],
      },
      {
        id: "five",
        label: "Five cities on a ring",
        value: [
          [0, 3, 9, 9, 4],
          [3, 0, 2, 9, 9],
          [9, 2, 0, 5, 9],
          [9, 9, 5, 0, 1],
          [4, 9, 9, 1, 0],
        ],
      },
    ],
  }),

  run(w, t) {
    const n = w.length;
    const W = t.grid("W", n, n, null, {
      label: "Distances w[from][to]",
      rowHeaders: w.map((_, i) => cityName(i)),
      colHeaders: w.map((_, i) => cityName(i)),
    });
    w.forEach((r, i) => r.forEach((x, j) => W.write(i, j, x, { line: 1 })));
    // Rows: every set that contains city 0, smallest sets first.
    const masks = Array.from({ length: 1 << (n - 1) }, (_, k) => (k << 1) | 1).sort(
      (a, b) => popcount(a) - popcount(b) || a - b,
    );
    const row = new Map(masks.map((m, r) => [m, r]));
    const D = t.grid("dp", masks.length, n, null, {
      label: "dp[S][j]: cheapest path from A through exactly S, ending at j",
      rowHeaders: masks.map((m) => setName(m, n)),
      colHeaders: w.map((_, i) => `end ${cityName(i)}`),
    });
    const dp = new Map<number, number[]>(
      masks.map((m) => [m, new Array<number>(n).fill(Infinity)]),
    );
    const from = new Map<number, number[]>(masks.map((m) => [m, new Array<number>(n).fill(-1)]));
    dp.get(1)![0] = 0;
    D.write(0, 0, 0, { line: 2, note: "The path that has only visited A costs 0." });
    for (const S of masks) {
      if (S === 1) continue;
      t.step({ line: 3, vars: { S: setName(S, n) } });
      for (let j = 1; j < n; j++) {
        if (!(S & (1 << j))) continue;
        const prev = S ^ (1 << j);
        let best = Infinity;
        let arg = -1;
        for (let k = 0; k < n; k++) {
          if (!(prev & (1 << k)) || dp.get(prev)![k] === Infinity) continue;
          D.read([[row.get(prev)!, k]], { line: 5 });
          t.tally("transitions");
          const c = dp.get(prev)![k]! + w[k]![j]!;
          if (c < best) {
            best = c;
            arg = k;
          }
        }
        dp.get(S)![j] = best;
        from.get(S)![j] = arg;
        D.write(row.get(S)!, j, best, {
          line: 5,
          vars: { j: cityName(j) },
          note: `Best way to end at ${cityName(j)} after ${setName(S, n)}: come from ${cityName(arg)} (${dp.get(prev)![arg]} + ${w[arg]![j]} = ${best}).`,
        });
      }
    }
    const full = (1 << n) - 1;
    let cost = n === 1 ? 0 : Infinity;
    let last = 0;
    for (let j = 1; j < n; j++) {
      D.read([[row.get(full)!, j]], { line: 6 });
      const c = dp.get(full)![j]! + w[j]![0]!;
      if (c < cost) {
        cost = c;
        last = j;
      }
    }
    const tour = [0];
    for (let S = full, j = last; j !== 0;) {
      tour.push(j);
      const k = from.get(S)![j]!;
      D.mark([[row.get(S)!, j]], "path", { line: 7 });
      S ^= 1 << j;
      j = k;
    }
    D.mark([[0, 0]], "path", { line: 7 });
    tour.push(0);
    tour.reverse();
    const output: TspOutput = { cost, tour };
    t.finish(w, output, {
      line: 7,
      vars: { S: null, j: null },
      note: `Shortest tour ${tour.map(cityName).join(" → ")}, length ${cost}.`,
    });
    return output;
  },

  check(w, out) {
    // Independent oracle: try every tour.
    const n = w.length;
    let best = Infinity;
    for (const p of permutations(n - 1)) {
      const order = [0, ...p.map((x) => x + 1), 0];
      best = Math.min(
        best,
        order.slice(1).reduce((s, c, i) => s + w[order[i]!]![c]!, 0),
      );
    }
    if (out.cost !== best) return `cost ${out.cost}, expected ${best}`;
    const tour = out.tour;
    if (
      tour[0] !== 0 ||
      tour[tour.length - 1] !== 0 ||
      new Set(tour.slice(0, -1)).size !== n ||
      tour.length !== n + 1
    )
      return `tour ${tour} does not visit every city once`;
    const length = tour.slice(1).reduce((s, c, i) => s + w[tour[i]!]![c]!, 0);
    return length === out.cost ? null : `tour length ${length} ≠ cost ${out.cost}`;
  },

  fidelity(state: TraceState, out) {
    const g = state.structures.dp;
    if (g?.kind !== "grid") return "no grid dp";
    const marked = g.marks.flat().filter((m) => m === "path").length;
    return marked === out.tour.length - 1 ? null : `${marked} cells marked on the tour`;
  },

  describeOutput: (out) => `Tour ${out.tour.map(cityName).join(" → ")}, length ${out.cost}`,
};
