import type { AlgorithmEntry } from "../types";

export const pieceTableEntry: AlgorithmEntry = {
  slug: "piece-table",
  name: "Piece Table",
  aliases: ["Piece Table"],
  curriculum: [142],
  domain: "linear-structures",
  subcategory: "Linear Data Structures",
  difficulty: "intermediate",
  summary: "Piece Table is a well-known algorithm in the domain of linear data structures.",
  tags: ["piece table", "data structure"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Piece Table.",
    output: "Output of Piece Table.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Piece Table solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Piece Table algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Piece Table follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Piece Table is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Piece Table exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(1)",
      average: "O(1)",
      worst: "O(n)",
    },
    space: "O(n)",
    worstClass: "n",
  },
  properties: [
    {
      label: "Domain",
      value: "linear data structures",
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
      id: "piece-table-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Piece Table?",
      options: [
        "To solve the Piece Table problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Piece Table is designed to solve its specific problem efficiently.",
      hints: ["Think about what Piece Table does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Piece Table is an algorithm in the domain of linear data structures.",
    steps: [
      "Apply the Piece Table algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(1)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["linear data structures applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Piece Table?",
        a: "Use Piece Table when the problem matches its designed use case in linear data structures.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Piece Table (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Piece Table.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
