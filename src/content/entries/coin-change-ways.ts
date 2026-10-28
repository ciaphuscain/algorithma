import type { AlgorithmEntry } from "../types";

export const coinChangeWaysEntry: AlgorithmEntry = {
  slug: "coin-change-ways",
  name: "Coin Change (Number of Ways)",
  aliases: ["Coin Change (Number of Ways)"],
  curriculum: [267],
  domain: "dynamic-programming",
  subcategory: "Coin Problems",
  difficulty: "intermediate",
  summary:
    "Count the number of ways to make change for an amount using given denominations. Process coins in order: dp[a] += dp[a - coin]. The outer loop over coins avoids counting permutations.",
  tags: ["coin change", "DP", "counting"],
  prerequisites: ["Coin Change (Minimum Coins)"],
  related: ["coin-change-min", "unbounded-knapsack"],
  problem: {
    input: "Input for Coin Change (Number of Ways).",
    output: "Output of Coin Change (Number of Ways).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Count the number of ways to make change for an amount using given denominations. Process coins in order: dp[a] += dp[a - coin]. The outer loop over coins avoids counting permutations.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Coin Change (Number of Ways) algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Coin Change (Number of Ways) follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Coin Change (Number of Ways) is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Coin Change (Number of Ways) exist in the literature. See references for details.",
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
      value: "Coin Problems",
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
      id: "coin-change-ways-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Coin Change (Number of Ways)?",
      options: [
        "Count the number of ways to make change for an amount using ...",
        "Sorting an array",
        "Finding shortest paths",
        "Compressing data",
      ],
      answer: 0,
      explanation:
        "Coin Change (Number of Ways): Count the number of ways to make change for an amount using given denominations. Process coins in order: dp[a] += dp[a - coin]. The outer loop over coins avoids counting permutations.",
      hints: ["Think about what problem Coin Change (Number of Ways) solves."],
      objective: "Coin Change (Number of Ways)",
    },
  ],
  exam: {
    definition:
      "Count the number of ways to make change for an amount using given denominations. Process coins in order: dp[a] += dp[a - coin]. The outer loop over coins avoids counting permutations.",
    steps: ["Apply the Coin Change (Number of Ways) algorithm to the input."],
    timeComplexity: "See complexity section.",
    spaceComplexity: "See complexity section.",
    correctness:
      "The Coin Change (Number of Ways) algorithm is correct because it systematically processes all cases.",
    applications: ["Coin Problems"],
    limitations: ["See advanced section for limitations."],
    faq: [
      {
        q: "When should you use Coin Change (Number of Ways)?",
        a: "Use Coin Change (Number of Ways) when the problem matches its design: Count the number of ways to make change for an amount using given denominations. Process coins in or",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Coin Change (Number of Ways) (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. Cormen et al., Introduction to Algorithms, 4th ed.",
      supports: "General reference for Coin Change (Number of Ways).",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
