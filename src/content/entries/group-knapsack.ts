import type { AlgorithmEntry } from "../types";

export const groupKnapsackEntry: AlgorithmEntry = {
  slug: "group-knapsack",
  name: "Group Knapsack",
  aliases: ["Grouped Knapsack", "Multiple-Choice Knapsack"],
  curriculum: [265],
  domain: "dynamic-programming",
  subcategory: "Knapsack Variants",
  difficulty: "intermediate",
  summary:
    "Items are divided into groups; pick at most one item from each group to maximize value within a weight limit.",
  tags: ["knapsack", "dynamic programming", "group"],
  prerequisites: ["0-1-knapsack"],
  related: ["unbounded-knapsack", "multiple-knapsack"],
  problem: {
    input: "Groups of items (each with weight and value), and a capacity W.",
    output: "Maximum value choosing at most one item per group.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Each group is like a single decision: pick one item from the group or skip it entirely. Process groups sequentially.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Create dp[0..W] = 0.",
          "For each group g: iterate w from W down to 0, for each item in g try picking it.",
          "Return dp[W].",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Reverse iteration on capacity (like 0/1 knapsack) ensures each group contributes at most once.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Time $O(W \\cdot \\sum |g_i|)$, space $O(W)$.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Equivalent to a multi-dimensional choice model. LP relaxation gives tight bounds for branch-and-bound.",
      },
    ],
  },
  complexity: {
    time: { best: "O(W·N)", average: "O(W·N)", worst: "O(W·N)" },
    space: "O(W)",
    worstClass: "other",
  },
  properties: [],
  implementations: [
    {
      language: "python",
      entry: "groupKnapsack",
      code: `def groupKnapsack(groups, capacity):
    dp = [0] * (capacity + 1)
    for group in groups:
        new_dp = dp[:]
        for weight, value in group:
            for w in range(weight, capacity + 1):
                new_dp[w] = max(new_dp[w], dp[w - weight] + value)
        dp = new_dp
    return dp[capacity]`,
      tests: [
        {
          args: [
            [
              [
                [2, 10],
                [3, 15],
              ],
              [
                [4, 20],
                [5, 25],
              ],
            ],
            7,
          ],
          expected: 35,
        },
        {
          args: [
            [
              [
                [1, 5],
                [2, 8],
              ],
              [[3, 12]],
            ],
            4,
          ],
          expected: 17,
        },
      ],
    },
    {
      language: "javascript",
      entry: "groupKnapsack",
      code: `function groupKnapsack(groups, capacity) {
  let dp = new Array(capacity + 1).fill(0);
  for (const group of groups) {
    const newDp = [...dp];
    for (const [weight, value] of group) {
      for (let w = weight; w <= capacity; w++) {
        newDp[w] = Math.max(newDp[w], dp[w - weight] + value);
      }
    }
    dp = newDp;
  }
  return dp[capacity];
}`,
      tests: [
        {
          args: [
            [
              [
                [2, 10],
                [3, 15],
              ],
              [
                [4, 20],
                [5, 25],
              ],
            ],
            7,
          ],
          expected: 35,
        },
        {
          args: [
            [
              [
                [1, 5],
                [2, 8],
              ],
              [[3, 12]],
            ],
            4,
          ],
          expected: 17,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "gk-q1",
      kind: "mcq",
      prompt: "How does group knapsack differ from 0/1?",
      options: ["At most one item per group", "Unlimited items", "No weight limit", "Greedy"],
      answer: 0,
      explanation: "Group knapsack restricts picks to one per group.",
      hints: ["Think about the constraint per group."],
      objective: "Concept",
    },
  ],
  exam: {
    definition: "Pick at most one item from each group to maximize value under capacity.",
    steps: ["dp array init.", "For each group copy dp, try items.", "Merge best."],
    timeComplexity: "$O(W \\cdot N)$.",
    spaceComplexity: "$O(W)$.",
    correctness: "Copying dp before group processing ensures at most one pick per group.",
    applications: ["menu selection", "resource allocation"],
    limitations: ["pseudo-polynomial"],
    faq: [
      {
        q: "Why copy dp?",
        a: "To ensure only one item from each group is selected.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Define dp copy technique (2).", "Recurrence (1).", "Correctness (2)."],
      },
    ],
  },
  references: [
    {
      citation: "S. Martello and P. Toth, Knapsack Problems, Wiley, 1990.",
      supports: "Group knapsack formulation.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
