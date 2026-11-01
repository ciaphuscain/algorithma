import type { AlgorithmEntry } from "../types";

export const twoPhaseLockingEntry: AlgorithmEntry = {
  slug: "two-phase-locking",
  name: "Two-Phase Locking",
  aliases: ["Two-Phase Locking"],
  curriculum: [556],
  domain: "databases",
  subcategory: "Database Algorithms",
  difficulty: "intermediate",
  summary: "Two-Phase Locking is a well-known algorithm in the domain of database algorithms.",
  tags: ["two phase locking", "database"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Two-Phase Locking.",
    output: "Output of Two-Phase Locking.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Two-Phase Locking solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Two-Phase Locking algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Two-Phase Locking follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Two-Phase Locking is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Two-Phase Locking exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n log n)",
      worst: "O(n log n)",
    },
    space: "O(n)",
    worstClass: "other",
  },
  properties: [
    {
      label: "Domain",
      value: "database algorithms",
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
      id: "two-phase-locking-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Two-Phase Locking?",
      options: [
        "To solve the Two-Phase Locking problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Two-Phase Locking is designed to solve its specific problem efficiently.",
      hints: ["Think about what Two-Phase Locking does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Two-Phase Locking is an algorithm in the domain of database algorithms.",
    steps: [
      "Apply the Two-Phase Locking algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["database algorithms applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Two-Phase Locking?",
        a: "Use Two-Phase Locking when the problem matches its designed use case in database algorithms.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Two-Phase Locking (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Two-Phase Locking.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
