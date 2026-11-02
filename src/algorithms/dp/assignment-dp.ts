import type { TraceState } from "@/engine/state";
import type { AlgorithmModule } from "../types";
import { permutations, squareMatrixInput } from "./matrix-input";

export interface AssignmentOutput {
  cost: number;
  /** job[i]: the job given to worker i. */
  job: number[];
}

const jobsName = (mask: number, n: number) =>
  `{${Array.from({ length: n }, (_, j) => j)
    .filter((j) => mask & (1 << j))
    .map((j) => j + 1)
    .join(",")}}`;

const popcount = (x: number) => x.toString(2).replace(/0/g, "").length;

/**
 * The assignment problem by bitmask DP: dp[S] is the cheapest way for workers
 * 0 … |S| − 1 to take exactly the jobs in S. Worker |S| then tries every free job.
 * O(2ⁿ · n) instead of n! assignments.
 */
export const assignmentDp: AlgorithmModule<number[][], AssignmentOutput> = {
  id: "assignment-dp",
  version: 1,
  pseudocode: [
    "procedure Assign(cost)   // n workers, n jobs; cost[i][j] = worker i doing job j",
    "  dp[∅] ← 0;  every other dp[S] ← ∞",
    "  for each set S of jobs, in order of size",
    "    i ← |S|   // the next worker to place",
    "    for each job j not in S: dp[S ∪ {j}] ← min(dp[S ∪ {j}], dp[S] + cost[i][j])",
    "  return dp[all jobs], following the choices back for the assignment",
  ],
  input: squareMatrixInput({
    label: "Costs (row = worker, column = job)",
    minSize: 1,
    maxSize: 5,
    maxValue: 99,
    zeroDiagonal: false,
    placeholder: "9 2 7 8\n6 4 3 7\n5 8 1 8\n7 6 9 4",
    presets: [
      {
        id: "classic",
        label: "Four workers, four jobs",
        value: [
          [9, 2, 7, 8],
          [6, 4, 3, 7],
          [5, 8, 1, 8],
          [7, 6, 9, 4],
        ],
      },
      {
        id: "greedy",
        label: "Where greedy choices fail",
        value: [
          [1, 2, 9],
          [2, 9, 9],
          [9, 9, 1],
        ],
      },
    ],
  }),

  run(cost, t) {
    const n = cost.length;
    const C = t.grid("C", n, n, null, {
      label: "cost[worker][job]",
      rowHeaders: cost.map((_, i) => `worker ${i + 1}`),
      colHeaders: cost.map((_, j) => `job ${j + 1}`),
    });
    cost.forEach((r, i) => r.forEach((x, j) => C.write(i, j, x, { line: 1 })));
    const masks = Array.from({ length: 1 << n }, (_, m) => m).sort(
      (a, b) => popcount(a) - popcount(b) || a - b,
    );
    const row = new Map(masks.map((m, r) => [m, r]));
    const D = t.grid("dp", masks.length, 2, null, {
      label: "dp[S]: cheapest way for the first |S| workers to take the jobs in S",
      rowHeaders: masks.map((m) => jobsName(m, n)),
      colHeaders: ["dp", "last job"],
    });
    const dp = new Array<number>(1 << n).fill(Infinity);
    const choice = new Array<number>(1 << n).fill(-1);
    dp[0] = 0;
    D.write(0, 0, 0, { line: 2 });
    for (const S of masks) {
      if (dp[S] === Infinity) continue;
      const i = popcount(S);
      if (i === n) continue;
      D.read([[row.get(S)!, 0]], { line: 4, vars: { S: jobsName(S, n), worker: i + 1 } });
      for (let j = 0; j < n; j++) {
        if (S & (1 << j)) continue;
        const T = S | (1 << j);
        const c = dp[S]! + cost[i]![j]!;
        t.tally("transitions");
        C.read([[i, j]], { line: 5 });
        if (c < dp[T]!) {
          dp[T] = c;
          choice[T] = j;
          D.write(row.get(T)!, 0, c, {
            line: 5,
            note: `Worker ${i + 1} takes job ${j + 1}: ${dp[S]} + ${cost[i]![j]} = ${c} is the best so far for ${jobsName(T, n)}.`,
          });
          D.write(row.get(T)!, 1, j + 1, { line: 5 });
        }
      }
    }
    const full = (1 << n) - 1;
    const job = new Array<number>(n).fill(-1);
    for (let S = full; S !== 0;) {
      const j = choice[S]!;
      job[popcount(S) - 1] = j;
      D.mark([[row.get(S)!, 0]], "path", { line: 6 });
      C.mark([[popcount(S) - 1, j]], "path", { line: 6 });
      S ^= 1 << j;
    }
    const output: AssignmentOutput = { cost: dp[full]!, job };
    t.finish(cost, output, {
      line: 6,
      vars: { S: null, worker: null },
      note: `Minimum total cost ${dp[full]}: ${job.map((j, i) => `worker ${i + 1} → job ${j + 1}`).join(", ")}.`,
    });
    return output;
  },

  check(cost, out) {
    // Independent oracle: try every assignment.
    const n = cost.length;
    let best = Infinity;
    for (const p of permutations(n))
      best = Math.min(
        best,
        p.reduce((s, j, i) => s + cost[i]![j]!, 0),
      );
    if (out.cost !== best) return `cost ${out.cost}, expected ${best}`;
    if (new Set(out.job).size !== n || out.job.some((j) => j < 0 || j >= n))
      return `assignment ${out.job} is not a permutation`;
    const total = out.job.reduce((s, j, i) => s + cost[i]![j]!, 0);
    return total === out.cost ? null : `assignment costs ${total}, not ${out.cost}`;
  },

  fidelity(state: TraceState, out) {
    const g = state.structures.dp;
    if (g?.kind !== "grid") return "no grid dp";
    return g.cells[g.rows - 1]![0] === out.cost ? null : `dp[all] shows ${g.cells[g.rows - 1]![0]}`;
  },

  describeOutput: (out) =>
    `Minimum cost ${out.cost}: ${out.job.map((j, i) => `${i + 1}→${j + 1}`).join(", ")}`,
};
