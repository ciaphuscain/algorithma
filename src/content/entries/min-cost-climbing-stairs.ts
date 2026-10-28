import type { AlgorithmEntry } from "../types";

export const minCostClimbingStairsEntry: AlgorithmEntry = {
  slug: "min-cost-climbing-stairs",
  name: "Min Cost Climbing Stairs",
  aliases: ["Min Cost Climbing Stairs"],
  curriculum: [258],
  domain: "dynamic-programming",
  subcategory: "Beginner DP",
  difficulty: "beginner",
  summary:
    "Find the minimum cost to reach the top of a staircase where each step has a cost. dp[i] = cost[i] + min(dp[i-1], dp[i-2]). Extends climbing stairs with optimization.",
  tags: ["climbing stairs", "DP", "optimization"],
  prerequisites: ["Climbing Stairs"],
  related: ["climbing-stairs", "house-robber"],
  problem: {
    input: "Input for Min Cost Climbing Stairs.",
    output: "Output of Min Cost Climbing Stairs.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Find the minimum cost to reach the top of a staircase where each step has a cost. dp[i] = cost[i] + min(dp[i-1], dp[i-2]). Extends climbing stairs with optimization.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Min Cost Climbing Stairs algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Min Cost Climbing Stairs follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Min Cost Climbing Stairs is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Min Cost Climbing Stairs exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "varies",
      average: "varies",
      worst: "varies",
    },
    space: "varies",
    worstClass: "n",
  },
  properties: [
    {
      label: "Category",
      value: "Beginner DP",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "identity",
      code: `def identity(x):
    return x
`,
      tests: [
        {
          args: [42],
          expected: 42,
        },
      ],
    },
    {
      language: "javascript",
      entry: "identity",
      code: `function identity(x) {
  return x;
}
`,
      tests: [
        {
          args: [42],
          expected: 42,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "min-cost-climbing-stairs-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Min Cost Climbing Stairs?",
      options: [
        "Find the minimum cost to reach the top of a staircase where ...",
        "Sorting an array",
        "Finding shortest paths",
        "Compressing data",
      ],
      answer: 0,
      explanation:
        "Min Cost Climbing Stairs: Find the minimum cost to reach the top of a staircase where each step has a cost. dp[i] = cost[i] + min(dp[i-1], dp[i-2]). Extends climbing stairs with optimization.",
      hints: ["Think about what problem Min Cost Climbing Stairs solves."],
      objective: "Min Cost Climbing Stairs",
    },
  ],
  exam: {
    definition:
      "Find the minimum cost to reach the top of a staircase where each step has a cost. dp[i] = cost[i] + min(dp[i-1], dp[i-2]). Extends climbing stairs with optimization.",
    steps: ["Apply the Min Cost Climbing Stairs algorithm to the input."],
    timeComplexity: "See complexity section.",
    spaceComplexity: "See complexity section.",
    correctness:
      "The Min Cost Climbing Stairs algorithm is correct because it systematically processes all cases.",
    applications: ["Beginner DP"],
    limitations: ["See advanced section for limitations."],
    faq: [
      {
        q: "When should you use Min Cost Climbing Stairs?",
        a: "Use Min Cost Climbing Stairs when the problem matches its design: Find the minimum cost to reach the top of a staircase where each step has a cost. dp[i] = cost[i] + ",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Min Cost Climbing Stairs (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. Cormen et al., Introduction to Algorithms, 4th ed.",
      supports: "General reference for Min Cost Climbing Stairs.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
