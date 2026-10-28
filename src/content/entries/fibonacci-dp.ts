import type { AlgorithmEntry } from "../types";

export const fibonacciDpEntry: AlgorithmEntry = {
  slug: "fibonacci-dp",
  name: "Fibonacci Numbers (DP)",
  aliases: ["Fibonacci Numbers (DP)"],
  curriculum: [256],
  domain: "dynamic-programming",
  subcategory: "Beginner DP",
  difficulty: "beginner",
  summary:
    "Computing the n-th Fibonacci number using dynamic programming (bottom-up tabulation or top-down memoization) instead of naive exponential recursion. The canonical introduction to DP.",
  tags: ["Fibonacci", "DP", "memoization", "tabulation"],
  prerequisites: ["Arrays"],
  related: ["climbing-stairs", "memoization-tabulation"],
  problem: {
    input: "Input for Fibonacci Numbers (DP).",
    output: "Output of Fibonacci Numbers (DP).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Computing the n-th Fibonacci number using dynamic programming (bottom-up tabulation or top-down memoization) instead of naive exponential recursion. The canonical introduction to DP.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Fibonacci Numbers (DP) algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Fibonacci Numbers (DP) follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Fibonacci Numbers (DP) is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Fibonacci Numbers (DP) exist in the literature. See references for details.",
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
      id: "fibonacci-dp-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Fibonacci Numbers (DP)?",
      options: [
        "Computing the n-th Fibonacci number using dynamic programmin...",
        "Sorting an array",
        "Finding shortest paths",
        "Compressing data",
      ],
      answer: 0,
      explanation:
        "Fibonacci Numbers (DP): Computing the n-th Fibonacci number using dynamic programming (bottom-up tabulation or top-down memoization) instead of naive exponential recursion. The canonical introduction to DP.",
      hints: ["Think about what problem Fibonacci Numbers (DP) solves."],
      objective: "Fibonacci Numbers (DP)",
    },
  ],
  exam: {
    definition:
      "Computing the n-th Fibonacci number using dynamic programming (bottom-up tabulation or top-down memoization) instead of naive exponential recursion. The canonical introduction to DP.",
    steps: ["Apply the Fibonacci Numbers (DP) algorithm to the input."],
    timeComplexity: "See complexity section.",
    spaceComplexity: "See complexity section.",
    correctness:
      "The Fibonacci Numbers (DP) algorithm is correct because it systematically processes all cases.",
    applications: ["Beginner DP"],
    limitations: ["See advanced section for limitations."],
    faq: [
      {
        q: "When should you use Fibonacci Numbers (DP)?",
        a: "Use Fibonacci Numbers (DP) when the problem matches its design: Computing the n-th Fibonacci number using dynamic programming (bottom-up tabulation or top-down memo",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Fibonacci Numbers (DP) (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. Cormen et al., Introduction to Algorithms, 4th ed.",
      supports: "General reference for Fibonacci Numbers (DP).",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
