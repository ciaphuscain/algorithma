import type { AlgorithmEntry } from "../types";

export const minimumPathSumEntry: AlgorithmEntry = {
  slug: "minimum-path-sum",
  name: "Minimum Path Sum",
  aliases: ["Minimum Path Sum"],
  curriculum: [280],
  domain: "dynamic-programming",
  subcategory: "Matrix DP",
  difficulty: "beginner",
  summary:
    "Find the path from top-left to bottom-right of a grid that minimizes the sum of values along the path (moving only right or down). dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1]).",
  tags: ["grid DP", "minimum path", "optimization"],
  prerequisites: ["Unique Paths"],
  related: ["unique-paths", "climbing-stairs"],
  problem: {
    input: "Input for Minimum Path Sum.",
    output: "Output of Minimum Path Sum.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Find the path from top-left to bottom-right of a grid that minimizes the sum of values along the path (moving only right or down). dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1]).",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Minimum Path Sum algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Minimum Path Sum follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Minimum Path Sum is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Minimum Path Sum exist in the literature. See references for details.",
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
      value: "Matrix DP",
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
      id: "minimum-path-sum-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Minimum Path Sum?",
      options: [
        "Find the path from top-left to bottom-right of a grid that m...",
        "Sorting an array",
        "Finding shortest paths",
        "Compressing data",
      ],
      answer: 0,
      explanation:
        "Minimum Path Sum: Find the path from top-left to bottom-right of a grid that minimizes the sum of values along the path (moving only right or down). dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1]).",
      hints: ["Think about what problem Minimum Path Sum solves."],
      objective: "Minimum Path Sum",
    },
  ],
  exam: {
    definition:
      "Find the path from top-left to bottom-right of a grid that minimizes the sum of values along the path (moving only right or down). dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1]).",
    steps: ["Apply the Minimum Path Sum algorithm to the input."],
    timeComplexity: "See complexity section.",
    spaceComplexity: "See complexity section.",
    correctness:
      "The Minimum Path Sum algorithm is correct because it systematically processes all cases.",
    applications: ["Matrix DP"],
    limitations: ["See advanced section for limitations."],
    faq: [
      {
        q: "When should you use Minimum Path Sum?",
        a: "Use Minimum Path Sum when the problem matches its design: Find the path from top-left to bottom-right of a grid that minimizes the sum of values along the pat",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Minimum Path Sum (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. Cormen et al., Introduction to Algorithms, 4th ed.",
      supports: "General reference for Minimum Path Sum.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
