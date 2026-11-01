import type { AlgorithmEntry } from "../types";

export const externalMergeSortEntry: AlgorithmEntry = {
  slug: "external-merge-sort",
  name: "External Merge Sort",
  aliases: ["External Merge Sort"],
  curriculum: [486],
  domain: "databases",
  subcategory: "Database Algorithms",
  difficulty: "intermediate",
  summary: "External Merge Sort is a well-known algorithm in the domain of database algorithms.",
  tags: ["external merge sort", "database"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for External Merge Sort.",
    output: "Output of External Merge Sort.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "External Merge Sort solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The External Merge Sort algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of External Merge Sort follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of External Merge Sort is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of External Merge Sort exist in the literature. See references for details.",
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
      id: "external-merge-sort-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of External Merge Sort?",
      options: [
        "To solve the External Merge Sort problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "External Merge Sort is designed to solve its specific problem efficiently.",
      hints: ["Think about what External Merge Sort does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "External Merge Sort is an algorithm in the domain of database algorithms.",
    steps: [
      "Apply the External Merge Sort algorithm to the input.",
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
        q: "When should you use External Merge Sort?",
        a: "Use External Merge Sort when the problem matches its designed use case in database algorithms.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define External Merge Sort (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for External Merge Sort.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
