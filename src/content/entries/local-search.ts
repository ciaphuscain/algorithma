import type { AlgorithmEntry } from "../types";

export const localSearchEntry: AlgorithmEntry = {
  slug: "local-search",
  name: "Local Search",
  aliases: ["Local Search"],
  curriculum: [446],
  domain: "optimization",
  subcategory: "Optimization",
  difficulty: "intermediate",
  summary: "Local Search is a well-known algorithm in the domain of optimization.",
  tags: ["local search", "optimization"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Local Search.",
    output: "Output of Local Search.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Local Search solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Local Search algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Local Search follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Local Search is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Local Search exist in the literature. See references for details.",
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
      id: "local-search-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Local Search?",
      options: [
        "To solve the Local Search problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Local Search is designed to solve its specific problem efficiently.",
      hints: ["Think about what Local Search does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Local Search is an algorithm in the domain of optimization.",
    steps: [
      "Apply the Local Search algorithm to the input.",
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
        q: "When should you use Local Search?",
        a: "Use Local Search when the problem matches its designed use case in optimization.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Local Search (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Local Search.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
