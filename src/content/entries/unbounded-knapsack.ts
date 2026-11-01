import type { AlgorithmEntry } from "../types";

export const unboundedKnapsackEntry: AlgorithmEntry = {
  slug: "unbounded-knapsack",
  name: "Unbounded Knapsack",
  aliases: ["Complete Knapsack"],
  curriculum: [262],
  domain: "dynamic-programming",
  subcategory: "Knapsack Variants",
  difficulty: "intermediate",
  summary:
    "Maximize total value selecting items with unlimited copies, given a weight capacity. dp[w] = max(dp[w], dp[w-wt[i]] + val[i]).",
  tags: ["knapsack", "dynamic programming", "unbounded"],
  prerequisites: ["0-1-knapsack"],
  related: ["coin-change-min", "multiple-knapsack", "group-knapsack"],
  problem: {
    input: "Item weights and values, and a capacity W.",
    output: "Maximum total value achievable without exceeding capacity (items may be reused).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Unlike 0/1 knapsack, each item can be picked multiple times. We scan capacities left-to-right so picks accumulate.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Create dp[0..W] = 0.",
          "For each capacity w from 1 to W: for each item i, if wt[i] <= w, dp[w] = max(dp[w], dp[w-wt[i]]+val[i]).",
          "Return dp[W].",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Single 1-D array suffices because we read from smaller indices (already updated this round, allowing reuse).",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Time $O(n \\cdot W)$, space $O(W)$.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "The fractional relaxation (value/weight ratio) gives an upper bound for branch-and-bound approaches.",
      },
    ],
  },
  complexity: {
    time: {
      worst: "O(n·W)",
    },
    space: {
      worst: "O(W)",
    },
  },
  properties: {
    worstClass: "other",
  },
  implementations: [
    {
      language: "python",
      entry: "unboundedKnapsack",
      code: `def unboundedKnapsack(weights, values, capacity):
    dp = [0] * (capacity + 1)
    for w in range(1, capacity + 1):
        for i in range(len(weights)):
            if weights[i] <= w:
                dp[w] = max(dp[w], dp[w - weights[i]] + values[i])
    return dp[capacity]`,
      tests: [
        {
          input: {
            weights: [1, 3, 4, 5],
            values: [10, 40, 50, 70],
            capacity: 8,
          },
          expected: 110,
        },
        {
          input: {
            weights: [2, 3],
            values: [5, 8],
            capacity: 7,
          },
          expected: 21,
        },
      ],
    },
    {
      language: "javascript",
      entry: "unboundedKnapsack",
      code: `function unboundedKnapsack(weights, values, capacity) {
  const dp = new Array(capacity + 1).fill(0);
  for (let w = 1; w <= capacity; w++) {
    for (let i = 0; i < weights.length; i++) {
      if (weights[i] <= w) dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
    }
  }
  return dp[capacity];
}`,
      tests: [
        {
          input: {
            weights: [1, 3, 4, 5],
            values: [10, 40, 50, 70],
            capacity: 8,
          },
          expected: 110,
        },
        {
          input: {
            weights: [2, 3],
            values: [5, 8],
            capacity: 7,
          },
          expected: 21,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "uk-q1",
      kind: "mcq",
      prompt: "weights=[1,2], values=[5,8], capacity=4. Max value?",
      options: ["20", "21", "16", "18"],
      answer: 0,
      explanation: "4 copies of item 0: 4*5=20.",
      hints: ["Try all items at each capacity."],
      objective: "Computation",
    },
  ],
  exam: {
    definition: "Maximize value with unlimited item copies under a weight limit.",
    steps: ["dp[0]=0.", "For w=1..W, try every item.", "dp[w]=max(dp[w], dp[w-wt[i]]+val[i])."],
    timeComplexity: "$O(n \\cdot W)$.",
    spaceComplexity: "$O(W)$.",
    correctness: "Left-to-right scan allows reuse; optimal substructure holds.",
    applications: ["resource allocation", "cutting stock"],
    limitations: ["pseudo-polynomial"],
    faq: [
      {
        q: "Difference from 0/1 knapsack?",
        a: "0/1 uses reverse iteration to prevent reuse; unbounded uses forward iteration.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Define dp (1).", "Recurrence + loop direction (2).", "Correctness (2)."],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "Unbounded knapsack.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
