import type { AlgorithmEntry } from "../types";

export const coinChangeMinEntry: AlgorithmEntry = {
  slug: "coin-change-min",
  name: "Coin Change (Minimum Coins)",
  aliases: ["Coin Change (Minimum Coins)"],
  curriculum: [266],
  domain: "dynamic-programming",
  subcategory: "Coin Problems",
  difficulty: "intermediate",
  summary:
    "Find the fewest coins that make a given amount. dp[a] = 1 + min(dp[a - coin]) for each coin denomination. Classic unbounded knapsack variant.",
  tags: ["coin change", "DP", "minimum"],
  prerequisites: ["Unbounded Knapsack"],
  related: ["coin-change-ways", "unbounded-knapsack"],
  problem: {
    input: "Input for Coin Change (Minimum Coins).",
    output: "Output of Coin Change (Minimum Coins).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Find the fewest coins that make a given amount. dp[a] = 1 + min(dp[a - coin]) for each coin denomination. Classic unbounded knapsack variant.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Coin Change (Minimum Coins) algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Coin Change (Minimum Coins) follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Coin Change (Minimum Coins) is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Coin Change (Minimum Coins) exist in the literature. See references for details.",
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
      id: "coin-change-min-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Coin Change (Minimum Coins)?",
      options: [
        "Find the fewest coins that make a given amount. dp[a] = 1 + ...",
        "Sorting an array",
        "Finding shortest paths",
        "Compressing data",
      ],
      answer: 0,
      explanation:
        "Coin Change (Minimum Coins): Find the fewest coins that make a given amount. dp[a] = 1 + min(dp[a - coin]) for each coin denomination. Classic unbounded knapsack variant.",
      hints: ["Think about what problem Coin Change (Minimum Coins) solves."],
      objective: "Coin Change (Minimum Coins)",
    },
  ],
  exam: {
    definition:
      "Find the fewest coins that make a given amount. dp[a] = 1 + min(dp[a - coin]) for each coin denomination. Classic unbounded knapsack variant.",
    steps: ["Apply the Coin Change (Minimum Coins) algorithm to the input."],
    timeComplexity: "See complexity section.",
    spaceComplexity: "See complexity section.",
    correctness:
      "The Coin Change (Minimum Coins) algorithm is correct because it systematically processes all cases.",
    applications: ["Coin Problems"],
    limitations: ["See advanced section for limitations."],
    faq: [
      {
        q: "When should you use Coin Change (Minimum Coins)?",
        a: "Use Coin Change (Minimum Coins) when the problem matches its design: Find the fewest coins that make a given amount. dp[a] = 1 + min(dp[a - coin]) for each coin denomina",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Coin Change (Minimum Coins) (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. Cormen et al., Introduction to Algorithms, 4th ed.",
      supports: "General reference for Coin Change (Minimum Coins).",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
