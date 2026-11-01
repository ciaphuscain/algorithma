import type { AlgorithmEntry } from "../types";

export const minCostClimbingStairsEntry: AlgorithmEntry = {
  slug: "min-cost-climbing-stairs",
  name: "Min Cost Climbing Stairs",
  aliases: [
    "Min Cost Climbing Stairs",
  ],
  curriculum: [
    258,
  ],
  domain: "dynamic-programming",
  subcategory: "Classic DP",
  difficulty: "beginner",
  summary: "Finds the minimum cost to reach the top of stairs where each step has a cost, and you can climb 1 or 2 steps at a time.",
  tags: [
    "climbing stairs",
    "dynamic programming",
    "minimum cost",
  ],
  prerequisites: [
    "Climbing Stairs",
  ],
  related: [
    "climbing-stairs",
    "minimum-path-sum",
  ],
  problem: {
    input: "An array cost where cost[i] is the cost of step i.",
    output: "Minimum cost to reach past the last step (you can start from step 0 or 1).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "At each step, you choose to arrive from one or two steps back — pick the cheaper option. Build the answer bottom-up.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "dp[0] = cost[0], dp[1] = cost[1].",
          "For i from 2 to n-1: dp[i] = cost[i] + min(dp[i-1], dp[i-2]).",
          "Return min(dp[n-1], dp[n-2]).",
        ],
      },
      {
        kind: "p",
        text: "**Example.** cost = [10, 15, 20]. dp = [10, 15, 30]. Answer = min(15, 30) = 15.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Only two previous values are needed, so O(1) space suffices.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Time $O(n)$, space $O(1)$. The recurrence is $dp[i] = cost[i] + \\min(dp[i-1], dp[i-2])$.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Generalize to k-step jumps with a sliding window minimum for O(n) time.",
          "Related to shortest path in a DAG.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n)",
      worst: "O(n)",
    },
    space: "O(1)",
    worstClass: "n",
  },
  properties: [
    {
      label: "Pattern",
      value: "Linear DP with min aggregation",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "min_cost_stairs",
      code: `def min_cost_stairs(cost):
    n = len(cost)
    if n <= 1:
        return 0
    a, b = cost[0], cost[1]
    for i in range(2, n):
        a, b = b, cost[i] + min(a, b)
    return min(a, b)
`,
      tests: [
        {
          args: [
            [
              10,
              15,
              20,
            ],
          ],
          expected: 15,
        },
        {
          args: [
            [
              1,
              100,
              1,
              1,
              1,
              100,
              1,
              1,
              100,
              1,
            ],
          ],
          expected: 6,
        },
      ],
    },
    {
      language: "javascript",
      entry: "minCostStairs",
      code: `function minCostStairs(cost) {
  const n = cost.length;
  if (n <= 1) return 0;
  let a = cost[0], b = cost[1];
  for (let i = 2; i < n; i++) { const t = cost[i] + Math.min(a, b); a = b; b = t; }
  return Math.min(a, b);
}
`,
      tests: [
        {
          args: [
            [
              10,
              15,
              20,
            ],
          ],
          expected: 15,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "min-cost-stairs-q1",
      kind: "mcq",
      prompt: "For cost = [10, 15, 20], what is the minimum cost?",
      options: [
        "15",
        "10",
        "25",
        "30",
      ],
      answer: 0,
      explanation: "Start at step 1 (cost 15), jump to the top.",
      hints: [
        "You can start from step 0 or 1.",
      ],
      objective: "Computation",
    },
  ],
  exam: {
    definition: "Find minimum cost to climb stairs where each step has a cost.",
    steps: [
      "dp[0]=cost[0], dp[1]=cost[1].",
      "dp[i] = cost[i] + min(dp[i-1], dp[i-2]).",
      "Answer = min(dp[n-1], dp[n-2]).",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(1)$.",
    correctness: "Optimal substructure: min cost to reach step i uses min cost to reach i-1 or i-2.",
    applications: [
      "resource optimization",
      "path planning",
    ],
    limitations: [
      "Only 1 or 2 step jumps",
    ],
    faq: [
      {
        q: "Why min of last two?",
        a: "You can jump past the last step from either of the last two steps.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define recurrence (1).",
          "Show iteration (2).",
          "Prove optimality (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "Dynamic programming.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
