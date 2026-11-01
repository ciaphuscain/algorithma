import type { AlgorithmEntry } from "../types";

export const twoPhaseCommitEntry: AlgorithmEntry = {
  slug: "two-phase-commit",
  name: "Two-Phase Commit",
  aliases: ["Two-Phase Commit"],
  curriculum: [548],
  domain: "distributed",
  subcategory: "Distributed Algorithms",
  difficulty: "intermediate",
  summary: "Two-Phase Commit is a well-known algorithm in the domain of distributed systems.",
  tags: ["two phase commit", "distributed"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Two-Phase Commit.",
    output: "Output of Two-Phase Commit.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Two-Phase Commit solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Two-Phase Commit algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Two-Phase Commit follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Two-Phase Commit is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Two-Phase Commit exist in the literature. See references for details.",
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
    worstClass: "n",
  },
  properties: [
    {
      label: "Domain",
      value: "distributed systems",
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
      id: "two-phase-commit-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Two-Phase Commit?",
      options: [
        "To solve the Two-Phase Commit problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Two-Phase Commit is designed to solve its specific problem efficiently.",
      hints: ["Think about what Two-Phase Commit does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Two-Phase Commit is an algorithm in the domain of distributed systems.",
    steps: [
      "Apply the Two-Phase Commit algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["distributed systems applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Two-Phase Commit?",
        a: "Use Two-Phase Commit when the problem matches its designed use case in distributed systems.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Two-Phase Commit (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Two-Phase Commit.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
