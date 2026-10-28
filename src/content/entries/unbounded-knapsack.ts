import type { AlgorithmEntry } from "../types";

export const unboundedKnapsackEntry: AlgorithmEntry = {
  slug: "unbounded-knapsack",
  name: "Unbounded Knapsack",
  aliases: ["Unbounded Knapsack"],
  curriculum: [262],
  domain: "dynamic-programming",
  subcategory: "Knapsack Family",
  difficulty: "intermediate",
  summary:
    "Like 0/1 knapsack but each item can be used unlimited times. dp[w] = max over items of (dp[w - weight_i] + value_i). A single 1D array suffices since items are reusable.",
  tags: ["knapsack", "DP", "unbounded"],
  prerequisites: ["0/1 Knapsack"],
  related: ["knapsack", "coin-change-min"],
  problem: {
    input: "Input for Unbounded Knapsack.",
    output: "Output of Unbounded Knapsack.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Like 0/1 knapsack but each item can be used unlimited times. dp[w] = max over items of (dp[w - weight_i] + value_i). A single 1D array suffices since items are reusable.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Unbounded Knapsack algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Unbounded Knapsack follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Unbounded Knapsack is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Unbounded Knapsack exist in the literature. See references for details.",
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
    worstClass: "other",
  },
  properties: [
    {
      label: "Category",
      value: "Knapsack Family",
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
      id: "unbounded-knapsack-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Unbounded Knapsack?",
      options: [
        "Like 0/1 knapsack but each item can be used unlimited times....",
        "Sorting an array",
        "Finding shortest paths",
        "Compressing data",
      ],
      answer: 0,
      explanation:
        "Unbounded Knapsack: Like 0/1 knapsack but each item can be used unlimited times. dp[w] = max over items of (dp[w - weight_i] + value_i). A single 1D array suffices since items are reusable.",
      hints: ["Think about what problem Unbounded Knapsack solves."],
      objective: "Unbounded Knapsack",
    },
  ],
  exam: {
    definition:
      "Like 0/1 knapsack but each item can be used unlimited times. dp[w] = max over items of (dp[w - weight_i] + value_i). A single 1D array suffices since items are reusable.",
    steps: ["Apply the Unbounded Knapsack algorithm to the input."],
    timeComplexity: "See complexity section.",
    spaceComplexity: "See complexity section.",
    correctness:
      "The Unbounded Knapsack algorithm is correct because it systematically processes all cases.",
    applications: ["Knapsack Family"],
    limitations: ["See advanced section for limitations."],
    faq: [
      {
        q: "When should you use Unbounded Knapsack?",
        a: "Use Unbounded Knapsack when the problem matches its design: Like 0/1 knapsack but each item can be used unlimited times. dp[w] = max over items of (dp[w - weigh",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Unbounded Knapsack (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. Cormen et al., Introduction to Algorithms, 4th ed.",
      supports: "General reference for Unbounded Knapsack.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
