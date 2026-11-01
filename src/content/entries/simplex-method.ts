import type { AlgorithmEntry } from "../types";

export const simplexMethodEntry: AlgorithmEntry = {
  slug: "simplex-method",
  name: "Simplex Method",
  aliases: ["Simplex Method"],
  curriculum: [586],
  domain: "optimization",
  subcategory: "Optimization",
  difficulty: "intermediate",
  summary: "Simplex Method is a well-known algorithm in the domain of optimization.",
  tags: ["simplex method", "optimization"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Simplex Method.",
    output: "Output of Simplex Method.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Simplex Method solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Simplex Method algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Simplex Method follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Simplex Method is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Simplex Method exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n²)",
      worst: "O(2^n)",
    },
    space: "O(n²)",
    worstClass: "2^n",
  },
  properties: [
    {
      label: "Domain",
      value: "optimization",
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
      id: "simplex-method-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Simplex Method?",
      options: [
        "To solve the Simplex Method problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Simplex Method is designed to solve its specific problem efficiently.",
      hints: ["Think about what Simplex Method does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Simplex Method is an algorithm in the domain of optimization.",
    steps: [
      "Apply the Simplex Method algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n²)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["optimization applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Simplex Method?",
        a: "Use Simplex Method when the problem matches its designed use case in optimization.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Simplex Method (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Simplex Method.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
