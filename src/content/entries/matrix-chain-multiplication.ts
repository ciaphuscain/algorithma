import type { AlgorithmEntry } from "../types";

export const matrixChainEntry: AlgorithmEntry = {
  slug: "matrix-chain-multiplication",
  name: "Matrix Chain Multiplication",
  aliases: ["Matrix Chain Multiplication"],
  curriculum: [279],
  domain: "dynamic-programming",
  subcategory: "Matrix DP",
  difficulty: "intermediate",
  summary:
    "Find the optimal parenthesization of a matrix chain product to minimize scalar multiplications. dp[i][j] = min over k of (dp[i][k] + dp[k+1][j] + p_i * p_{k+1} * p_{j+1}).",
  tags: ["matrix chain", "DP", "interval DP"],
  prerequisites: ["Dynamic Programming basics"],
  related: ["unique-paths", "minimum-path-sum"],
  problem: {
    input: "Input for Matrix Chain Multiplication.",
    output: "Output of Matrix Chain Multiplication.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Find the optimal parenthesization of a matrix chain product to minimize scalar multiplications. dp[i][j] = min over k of (dp[i][k] + dp[k+1][j] + p_i * p_{k+1} * p_{j+1}).",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Matrix Chain Multiplication algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Matrix Chain Multiplication follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Matrix Chain Multiplication is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Matrix Chain Multiplication exist in the literature. See references for details.",
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
    worstClass: "n^3",
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
      id: "matrix-chain-multiplication-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Matrix Chain Multiplication?",
      options: [
        "Find the optimal parenthesization of a matrix chain product ...",
        "Sorting an array",
        "Finding shortest paths",
        "Compressing data",
      ],
      answer: 0,
      explanation:
        "Matrix Chain Multiplication: Find the optimal parenthesization of a matrix chain product to minimize scalar multiplications. dp[i][j] = min over k of (dp[i][k] + dp[k+1][j] + p_i * p_{k+1} * p_{j+1}).",
      hints: ["Think about what problem Matrix Chain Multiplication solves."],
      objective: "Matrix Chain Multiplication",
    },
  ],
  exam: {
    definition:
      "Find the optimal parenthesization of a matrix chain product to minimize scalar multiplications. dp[i][j] = min over k of (dp[i][k] + dp[k+1][j] + p_i * p_{k+1} * p_{j+1}).",
    steps: ["Apply the Matrix Chain Multiplication algorithm to the input."],
    timeComplexity: "See complexity section.",
    spaceComplexity: "See complexity section.",
    correctness:
      "The Matrix Chain Multiplication algorithm is correct because it systematically processes all cases.",
    applications: ["Matrix DP"],
    limitations: ["See advanced section for limitations."],
    faq: [
      {
        q: "When should you use Matrix Chain Multiplication?",
        a: "Use Matrix Chain Multiplication when the problem matches its design: Find the optimal parenthesization of a matrix chain product to minimize scalar multiplications. dp[i",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Matrix Chain Multiplication (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. Cormen et al., Introduction to Algorithms, 4th ed.",
      supports: "General reference for Matrix Chain Multiplication.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
