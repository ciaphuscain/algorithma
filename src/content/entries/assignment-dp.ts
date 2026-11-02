import type { AlgorithmEntry } from "../types";

export const assignmentDpEntry: AlgorithmEntry = {
  slug: "assignment-dp",
  name: "Assignment Problem (Bitmask DP)",
  aliases: ["Bitmask DP", "Assignment problem", "Minimum-cost perfect matching", "DP over subsets"],
  curriculum: [297],
  domain: "dynamic-programming",
  subcategory: "Bitmask DP",
  difficulty: "intermediate",
  summary:
    "Gives n workers n jobs at minimum total cost. Workers are placed in order, so the state is just the set of jobs already taken: dp[S] = cheapest way for the first |S| workers to take exactly S. O(2ⁿ · n) instead of n! assignments.",
  tags: ["assignment", "bitmask", "subset dp", "matching", "optimisation"],
  prerequisites: ["Memoization vs Tabulation (Top-Down and Bottom-Up DP)", "Bit manipulation"],
  related: ["held-karp", "hopcroft-karp", "memoization-tabulation"],
  problem: {
    input: "An n × n matrix cost[i][j]: the cost of worker i doing job j.",
    output: "A one-to-one assignment of workers to jobs with the smallest total cost.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Hand out jobs worker by worker. When worker 3 chooses, all that matters is which jobs workers 1 and 2 already took, not who took which. So the state is a set of taken jobs, and the next worker is determined by its size. There are only $2^n$ sets.",
      },
      {
        kind: "p",
        text: "Greedy fails: in the second preset, worker 1's cheapest job (job 1, cost 1) is the only reasonable job for worker 2. The DP compares both options and gives worker 1 job 2 instead.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "dp[∅] = 0; every other dp[S] = ∞.",
          "Process sets S in order of size; worker i = |S| is next.",
          "For each job j not in S: $dp[S \\cup \\{j\\}] = \\min(dp[S \\cup \\{j\\}],\\ dp[S] + cost[i][j])$, remembering j.",
          "dp[all jobs] is the answer; follow the remembered jobs back for the assignment.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset, four workers and four jobs). Some states, as job sets:",
      },
      {
        kind: "table",
        head: ["S (jobs taken)", "dp[S]", "Last job given"],
        rows: [
          ["{2}", "2", "job 2 to worker 1"],
          ["{1, 2}", "8", "job 1 to worker 2 (2 + 6)"],
          ["{1, 2, 3}", "9", "job 3 to worker 3 (8 + 1)"],
          ["{1, 2, 3, 4}", "13", "job 4 to worker 4 (9 + 4)"],
        ],
      },
      {
        kind: "p",
        text: "Minimum total 13: worker 1 → job 2, worker 2 → job 1, worker 3 → job 3, worker 4 → job 4 (2 + 6 + 1 + 4).",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Iterating masks in increasing numeric order is enough: S ∪ {j} is always larger than S.",
          "popcount(S) gives the next worker; most languages have a fast builtin.",
          "Memory $O(2^n)$ limits n to about 20–25.",
          "For larger n, the Hungarian algorithm solves the same problem exactly in $O(n^3)$; min-cost flow also works.",
          "The same pattern (process items in a fixed order; the state is the set of resources used) solves many matching and covering problems.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Correctness.** Any assignment of the first k workers is described by the set S of jobs they took (|S| = k). The cheapest way to complete it depends only on S, so keeping the minimum per S loses nothing.",
      },
      {
        kind: "p",
        text: "**Cost.** Each set with k jobs tries n − k extensions:",
      },
      {
        kind: "math",
        tex: "\\sum_{k=0}^{n-1} \\binom{n}{k}(n - k) = n \\cdot 2^{n-1} \\text{ transitions}",
      },
      {
        kind: "p",
        text: "The property tests check this exact count and compare every result with brute force over all n! assignments.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "The Hungarian (Kuhn–Munkres) algorithm uses dual variables (potentials) to reach $O(n^3)$.",
          "Assignment is a linear program whose optimal solutions can be taken integral (the constraint matrix is totally unimodular).",
          "Bitmask DP also counts perfect matchings in general graphs in $O(2^n n)$ and solves set-cover-style problems for small universes.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(2^n n)", average: "O(2^n n)", worst: "O(2^n n)" },
    space: "O(2^n)",
    worstClass: "2^n",
    note: "The Hungarian algorithm solves the same problem in $O(n^3)$.",
  },
  properties: [
    { label: "State", value: "The set of jobs already taken" },
    { label: "Transitions", value: "n · 2ⁿ⁻¹" },
  ],
  implementations: [
    {
      language: "python",
      entry: "assign",
      code: `def assign(cost):
    n = len(cost)
    dp = [float("inf")] * (1 << n)
    dp[0] = 0
    for mask in range(1 << n):
        i = bin(mask).count("1")          # next worker
        if i == n:
            continue
        for j in range(n):
            if not mask & (1 << j):
                dp[mask | 1 << j] = min(dp[mask | 1 << j], dp[mask] + cost[i][j])
    return dp[(1 << n) - 1]
`,
      tests: [
        {
          args: [
            [
              [9, 2, 7, 8],
              [6, 4, 3, 7],
              [5, 8, 1, 8],
              [7, 6, 9, 4],
            ],
          ],
          expected: 13,
        },
        {
          args: [
            [
              [1, 2, 9],
              [2, 9, 9],
              [9, 9, 1],
            ],
          ],
          expected: 5,
        },
      ],
    },
    {
      language: "javascript",
      entry: "minAssignment",
      code: `// Bitmask DP recovering who does what: job[i] for worker i.
function minAssignment(cost) {
  const n = cost.length;
  const dp = new Array(1 << n).fill(Infinity), pick = new Array(1 << n).fill(-1);
  dp[0] = 0;
  for (let mask = 0; mask < 1 << n; mask++) {
    const i = mask.toString(2).split("1").length - 1;
    if (i === n || dp[mask] === Infinity) continue;
    for (let j = 0; j < n; j++)
      if (!(mask & (1 << j)) && dp[mask] + cost[i][j] < dp[mask | (1 << j)]) {
        dp[mask | (1 << j)] = dp[mask] + cost[i][j];
        pick[mask | (1 << j)] = j;
      }
  }
  const job = new Array(n);
  for (let mask = (1 << n) - 1, i = n - 1; i >= 0; i--) {
    job[i] = pick[mask];
    mask ^= 1 << pick[mask];
  }
  return job;
}
`,
      tests: [
        {
          args: [
            [
              [9, 2, 7, 8],
              [6, 4, 3, 7],
              [5, 8, 1, 8],
              [7, 6, 9, 4],
            ],
          ],
          expected: [1, 0, 2, 3],
        },
      ],
    },
  ],
  visualizer: "assignment-dp",
  practice: [
    {
      id: "assign-transitions",
      kind: "numeric",
      prompt: "How many transitions (worker tries a free job) does the bitmask DP make for n = 4?",
      answer: 32,
      explanation: "n · 2ⁿ⁻¹ = 4 · 8 = 32.",
      hints: ["Sum over set sizes k of (number of sets) × (free jobs)."],
      objective: "Count the work",
    },
    {
      id: "assign-greedy",
      kind: "numeric",
      prompt:
        "In the second preset (costs [[1,2,9],[2,9,9],[9,9,1]]), what is the minimum total cost?",
      answer: 5,
      explanation:
        "Worker 1 → job 2 (2), worker 2 → job 1 (2), worker 3 → job 3 (1). Greedy (worker 1 takes job 1) forces worker 2 into a cost-9 job.",
      hints: ["Try giving worker 1 their second-cheapest job."],
      objective: "See why greedy fails",
    },
  ],
  exam: {
    definition:
      "The assignment problem matches n workers to n jobs at minimum total cost; the bitmask DP solves it with dp[S] = the cheapest assignment of the first |S| workers to the jobs in S.",
    steps: [
      "dp[∅] = 0.",
      "For S by size, i = |S|: dp[S ∪ {j}] = min(…, dp[S] + cost[i][j]).",
      "Answer dp[all]; backtrack the choices.",
    ],
    timeComplexity: "$O(2^n n)$.",
    spaceComplexity: "$O(2^n)$.",
    correctness:
      "Assignments of the first k workers are characterised by the set of jobs used; the cheapest per set suffices.",
    applications: ["Task assignment", "Small matching problems", "A pattern for subset DP"],
    limitations: [
      "Exponential in n",
      "The Hungarian algorithm is polynomial and better for large n",
    ],
    faq: [
      {
        q: "Why process workers in a fixed order?",
        a: "So the next worker is implied by |S|, keeping the state to just the set.",
      },
    ],
    answers: [
      { marks: 2, outline: ["dp over subsets of jobs.", "$O(2^n n)$."] },
      {
        marks: 5,
        outline: ["State and recurrence (2).", "Example (2).", "Complexity (1)."],
      },
      {
        marks: 10,
        outline: [
          "Problem and brute force (1).",
          "State design and recurrence (3).",
          "Worked example (3).",
          "Complexity and comparison with the Hungarian algorithm (3).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "H. W. Kuhn, “The Hungarian method for the assignment problem,” Naval Research Logistics Quarterly, 2, 1955.",
      supports: "The assignment problem and its polynomial-time solution.",
    },
    {
      citation:
        "J. Munkres, “Algorithms for the assignment and transportation problems,” Journal of the Society for Industrial and Applied Mathematics, 5(1), 1957.",
      supports:
        "A polynomial-time Hungarian algorithm (O(n⁴) as published; later versions reach O(n³)).",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review. The bitmask formulation is folklore in competitive programming; no single original source is cited for it.",
  },
  version: 1,
  updated: "2026-10-23",
};
