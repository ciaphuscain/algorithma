import type { AlgorithmEntry } from "../types";

export const climbingStairsEntry: AlgorithmEntry = {
  slug: "climbing-stairs",
  name: "Climbing Stairs",
  aliases: ["Climbing Stairs"],
  curriculum: [257],
  domain: "dynamic-programming",
  subcategory: "Beginner DP",
  difficulty: "beginner",
  summary:
    "Count the number of ways to climb n stairs taking 1 or 2 steps at a time. Equivalent to Fibonacci numbers: dp[i] = dp[i-1] + dp[i-2]. A classic beginner DP problem.",
  tags: ["climbing stairs", "DP", "Fibonacci variant"],
  prerequisites: ["Fibonacci Numbers (DP)"],
  related: ["fibonacci-dp", "min-cost-climbing-stairs"],
  problem: {
    input: "Input for Climbing Stairs.",
    output: "Output of Climbing Stairs.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Count the number of ways to climb n stairs taking 1 or 2 steps at a time. Equivalent to Fibonacci numbers: dp[i] = dp[i-1] + dp[i-2]. A classic beginner DP problem.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Climbing Stairs algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Climbing Stairs follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Climbing Stairs is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Climbing Stairs exist in the literature. See references for details.",
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
      id: "climbing-stairs-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Climbing Stairs?",
      options: [
        "Count the number of ways to climb n stairs taking 1 or 2 ste...",
        "Sorting an array",
        "Finding shortest paths",
        "Compressing data",
      ],
      answer: 0,
      explanation:
        "Climbing Stairs: Count the number of ways to climb n stairs taking 1 or 2 steps at a time. Equivalent to Fibonacci numbers: dp[i] = dp[i-1] + dp[i-2]. A classic beginner DP problem.",
      hints: ["Think about what problem Climbing Stairs solves."],
      objective: "Climbing Stairs",
    },
  ],
  exam: {
    definition:
      "Count the number of ways to climb n stairs taking 1 or 2 steps at a time. Equivalent to Fibonacci numbers: dp[i] = dp[i-1] + dp[i-2]. A classic beginner DP problem.",
    steps: ["Apply the Climbing Stairs algorithm to the input."],
    timeComplexity: "See complexity section.",
    spaceComplexity: "See complexity section.",
    correctness:
      "The Climbing Stairs algorithm is correct because it systematically processes all cases.",
    applications: ["Beginner DP"],
    limitations: ["See advanced section for limitations."],
    faq: [
      {
        q: "When should you use Climbing Stairs?",
        a: "Use Climbing Stairs when the problem matches its design: Count the number of ways to climb n stairs taking 1 or 2 steps at a time. Equivalent to Fibonacci nu",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Climbing Stairs (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. Cormen et al., Introduction to Algorithms, 4th ed.",
      supports: "General reference for Climbing Stairs.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
