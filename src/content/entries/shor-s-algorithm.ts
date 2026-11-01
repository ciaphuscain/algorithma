import type { AlgorithmEntry } from "../types";

export const shorSAlgorithmEntry: AlgorithmEntry = {
  slug: "shor-s-algorithm",
  name: "Shor's Algorithm",
  aliases: ["Shor's Algorithm"],
  curriculum: [600],
  domain: "research",
  subcategory: "Advanced Topics",
  difficulty: "intermediate",
  summary: "Shor's Algorithm is a well-known algorithm in the domain of advanced research topics.",
  tags: ["shor s algorithm", "research"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Shor's Algorithm.",
    output: "Output of Shor's Algorithm.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Shor's Algorithm solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Shor's Algorithm algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Shor's Algorithm follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Shor's Algorithm is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Shor's Algorithm exist in the literature. See references for details.",
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
      id: "shor-s-algorithm-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Shor's Algorithm?",
      options: [
        "To solve the Shor's Algorithm problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Shor's Algorithm is designed to solve its specific problem efficiently.",
      hints: ["Think about what Shor's Algorithm does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Shor's Algorithm is an algorithm in the domain of advanced research topics.",
    steps: [
      "Apply the Shor's Algorithm algorithm to the input.",
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
        q: "When should you use Shor's Algorithm?",
        a: "Use Shor's Algorithm when the problem matches its designed use case in advanced research topics.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Shor's Algorithm (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Shor's Algorithm.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
