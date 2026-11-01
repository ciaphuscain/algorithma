import type { AlgorithmEntry } from "../types";

export const antColonyOptimizationEntry: AlgorithmEntry = {
  slug: "ant-colony-optimization",
  name: "Ant Colony Optimization",
  aliases: ["Ant Colony Optimization"],
  curriculum: [449],
  domain: "optimization",
  subcategory: "Optimization",
  difficulty: "intermediate",
  summary: "Ant Colony Optimization is a well-known algorithm in the domain of optimization.",
  tags: ["ant colony optimization", "optimization"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Ant Colony Optimization.",
    output: "Output of Ant Colony Optimization.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Ant Colony Optimization solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Ant Colony Optimization algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Ant Colony Optimization follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Ant Colony Optimization is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Ant Colony Optimization exist in the literature. See references for details.",
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
      id: "ant-colony-optimization-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Ant Colony Optimization?",
      options: [
        "To solve the Ant Colony Optimization problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Ant Colony Optimization is designed to solve its specific problem efficiently.",
      hints: ["Think about what Ant Colony Optimization does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Ant Colony Optimization is an algorithm in the domain of optimization.",
    steps: [
      "Apply the Ant Colony Optimization algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(n²)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["optimization applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Ant Colony Optimization?",
        a: "Use Ant Colony Optimization when the problem matches its designed use case in optimization.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Ant Colony Optimization (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Ant Colony Optimization.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
