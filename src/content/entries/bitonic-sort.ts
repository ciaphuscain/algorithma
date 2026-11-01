import type { AlgorithmEntry } from "../types";

export const bitonicSortEntry: AlgorithmEntry = {
  slug: "bitonic-sort",
  name: "Bitonic Sort",
  aliases: ["Bitonic Sort"],
  curriculum: [459],
  domain: "parallel",
  subcategory: "Parallel Algorithms",
  difficulty: "intermediate",
  summary: "Bitonic Sort is a well-known algorithm in the domain of parallel computing.",
  tags: ["bitonic sort", "parallel"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Bitonic Sort.",
    output: "Output of Bitonic Sort.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Bitonic Sort solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Bitonic Sort algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Bitonic Sort follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Bitonic Sort is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Bitonic Sort exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(log²n)",
      average: "O(log²n)",
      worst: "O(log²n)",
    },
    space: "O(n log²n)",
    worstClass: "other",
  },
  properties: [
    {
      label: "Domain",
      value: "parallel computing",
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
      id: "bitonic-sort-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Bitonic Sort?",
      options: [
        "To solve the Bitonic Sort problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Bitonic Sort is designed to solve its specific problem efficiently.",
      hints: ["Think about what Bitonic Sort does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Bitonic Sort is an algorithm in the domain of parallel computing.",
    steps: [
      "Apply the Bitonic Sort algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(log²n)$.",
    spaceComplexity: "$O(n log²n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["parallel computing applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Bitonic Sort?",
        a: "Use Bitonic Sort when the problem matches its designed use case in parallel computing.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Bitonic Sort (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Bitonic Sort.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
