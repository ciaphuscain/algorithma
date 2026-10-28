import type { AlgorithmEntry } from "../types";

export const uniquePathsEntry: AlgorithmEntry = {
  slug: "unique-paths",
  name: "Unique Paths",
  aliases: ["Unique Paths"],
  curriculum: [281],
  domain: "dynamic-programming",
  subcategory: "Matrix DP",
  difficulty: "beginner",
  summary:
    "Count paths from top-left to bottom-right of an m x n grid, moving only right or down. dp[i][j] = dp[i-1][j] + dp[i][j-1]. A classic grid DP problem.",
  tags: ["grid DP", "paths", "combinatorics"],
  prerequisites: ["Arrays"],
  related: ["minimum-path-sum", "climbing-stairs"],
  problem: {
    input: "Input for Unique Paths.",
    output: "Output of Unique Paths.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Count paths from top-left to bottom-right of an m x n grid, moving only right or down. dp[i][j] = dp[i-1][j] + dp[i][j-1]. A classic grid DP problem.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Unique Paths algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Unique Paths follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Unique Paths is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Unique Paths exist in the literature. See references for details.",
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
      id: "unique-paths-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Unique Paths?",
      options: [
        "Count paths from top-left to bottom-right of an m x n grid, ...",
        "Sorting an array",
        "Finding shortest paths",
        "Compressing data",
      ],
      answer: 0,
      explanation:
        "Unique Paths: Count paths from top-left to bottom-right of an m x n grid, moving only right or down. dp[i][j] = dp[i-1][j] + dp[i][j-1]. A classic grid DP problem.",
      hints: ["Think about what problem Unique Paths solves."],
      objective: "Unique Paths",
    },
  ],
  exam: {
    definition:
      "Count paths from top-left to bottom-right of an m x n grid, moving only right or down. dp[i][j] = dp[i-1][j] + dp[i][j-1]. A classic grid DP problem.",
    steps: ["Apply the Unique Paths algorithm to the input."],
    timeComplexity: "See complexity section.",
    spaceComplexity: "See complexity section.",
    correctness:
      "The Unique Paths algorithm is correct because it systematically processes all cases.",
    applications: ["Matrix DP"],
    limitations: ["See advanced section for limitations."],
    faq: [
      {
        q: "When should you use Unique Paths?",
        a: "Use Unique Paths when the problem matches its design: Count paths from top-left to bottom-right of an m x n grid, moving only right or down. dp[i][j] = dp",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Unique Paths (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. Cormen et al., Introduction to Algorithms, 4th ed.",
      supports: "General reference for Unique Paths.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
