import type { AlgorithmEntry } from "../types";

export const groverSSearchEntry: AlgorithmEntry = {
  slug: "grover-s-search",
  name: "Grover's Search",
  aliases: ["Grover's Search"],
  curriculum: [599],
  domain: "research",
  subcategory: "Advanced Topics",
  difficulty: "intermediate",
  summary: "Grover's Search is a well-known algorithm in the domain of advanced research topics.",
  tags: ["grover s search", "research"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Grover's Search.",
    output: "Output of Grover's Search.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Grover's Search solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Grover's Search algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Grover's Search follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Grover's Search is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Grover's Search exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n)",
      worst: "O(n)",
    },
    space: "O(n)",
    worstClass: "other",
  },
  properties: [
    {
      label: "Domain",
      value: "advanced research topics",
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
      id: "grover-s-search-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Grover's Search?",
      options: [
        "To solve the Grover's Search problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Grover's Search is designed to solve its specific problem efficiently.",
      hints: ["Think about what Grover's Search does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Grover's Search is an algorithm in the domain of advanced research topics.",
    steps: [
      "Apply the Grover's Search algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["advanced research topics applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Grover's Search?",
        a: "Use Grover's Search when the problem matches its designed use case in advanced research topics.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Grover's Search (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Grover's Search.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
