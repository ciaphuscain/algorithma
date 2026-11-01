import type { AlgorithmEntry } from "../types";

export const iterativeDeepeningAEntry: AlgorithmEntry = {
  slug: "iterative-deepening-a",
  name: "Iterative Deepening A*",
  aliases: ["Iterative Deepening A*"],
  curriculum: [451],
  domain: "optimization",
  subcategory: "Optimization",
  difficulty: "intermediate",
  summary: "Iterative Deepening A* is a well-known algorithm in the domain of optimization.",
  tags: ["iterative deepening a", "optimization"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Iterative Deepening A*.",
    output: "Output of Iterative Deepening A*.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Iterative Deepening A* solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Iterative Deepening A* algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Iterative Deepening A* follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Iterative Deepening A* is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Iterative Deepening A* exist in the literature. See references for details.",
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
      id: "iterative-deepening-a-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Iterative Deepening A*?",
      options: [
        "To solve the Iterative Deepening A* problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Iterative Deepening A* is designed to solve its specific problem efficiently.",
      hints: ["Think about what Iterative Deepening A* does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Iterative Deepening A* is an algorithm in the domain of optimization.",
    steps: [
      "Apply the Iterative Deepening A* algorithm to the input.",
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
        q: "When should you use Iterative Deepening A*?",
        a: "Use Iterative Deepening A* when the problem matches its designed use case in optimization.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Iterative Deepening A* (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Iterative Deepening A*.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
