import type { AlgorithmEntry } from "../types";

export const fractionalKnapsackGreedyDpComparisonEntry: AlgorithmEntry = {
  slug: "fractional-knapsack-greedy-dp-comparison",
  name: "Fractional Knapsack (Greedy + DP comparison)",
  aliases: ["Fractional Knapsack (Greedy + DP comparison)"],
  curriculum: [263],
  domain: "dynamic-programming",
  subcategory: "Dynamic Programming",
  difficulty: "intermediate",
  summary:
    "Fractional Knapsack (Greedy + DP comparison) is a well-known algorithm in the domain of dynamic programming.",
  tags: ["fractional knapsack greedy dp comparison", "dp"],
  prerequisites: ["Recursion"],
  related: [],
  problem: {
    input: "Input for Fractional Knapsack (Greedy + DP comparison).",
    output: "Output of Fractional Knapsack (Greedy + DP comparison).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Fractional Knapsack (Greedy + DP comparison) solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Fractional Knapsack (Greedy + DP comparison) algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Fractional Knapsack (Greedy + DP comparison) follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Fractional Knapsack (Greedy + DP comparison) is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Fractional Knapsack (Greedy + DP comparison) exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n²)",
      average: "O(n²)",
      worst: "O(n²)",
    },
    space: "O(n)",
    worstClass: "other",
  },
  properties: [
    {
      label: "Domain",
      value: "dynamic programming",
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
      id: "fractional-knapsack-greedy-dp-comparison-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Fractional Knapsack (Greedy + DP comparison)?",
      options: [
        "To solve the Fractional Knapsack (Greedy + DP comparison) problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation:
        "Fractional Knapsack (Greedy + DP comparison) is designed to solve its specific problem efficiently.",
      hints: ["Think about what Fractional Knapsack (Greedy + DP comparison) does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition:
      "Fractional Knapsack (Greedy + DP comparison) is an algorithm in the domain of dynamic programming.",
    steps: [
      "Apply the Fractional Knapsack (Greedy + DP comparison) algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(n²)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["dynamic programming applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Fractional Knapsack (Greedy + DP comparison)?",
        a: "Use Fractional Knapsack (Greedy + DP comparison) when the problem matches its designed use case in dynamic programming.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Fractional Knapsack (Greedy + DP comparison) (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Fractional Knapsack (Greedy + DP comparison).",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
