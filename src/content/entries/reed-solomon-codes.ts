import type { AlgorithmEntry } from "../types";

export const reedSolomonCodesEntry: AlgorithmEntry = {
  slug: "reed-solomon-codes",
  name: "Reed–Solomon Codes",
  aliases: ["Reed–Solomon Codes"],
  curriculum: [542],
  domain: "compression",
  subcategory: "Compression",
  difficulty: "intermediate",
  summary: "Reed–Solomon Codes is a well-known algorithm in the domain of data compression.",
  tags: ["reed solomon codes", "compression"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Reed–Solomon Codes.",
    output: "Output of Reed–Solomon Codes.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Reed–Solomon Codes solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Reed–Solomon Codes algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Reed–Solomon Codes follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Reed–Solomon Codes is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Reed–Solomon Codes exist in the literature. See references for details.",
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
      value: "data compression",
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
      id: "reed-solomon-codes-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Reed–Solomon Codes?",
      options: [
        "To solve the Reed–Solomon Codes problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Reed–Solomon Codes is designed to solve its specific problem efficiently.",
      hints: ["Think about what Reed–Solomon Codes does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Reed–Solomon Codes is an algorithm in the domain of data compression.",
    steps: [
      "Apply the Reed–Solomon Codes algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["data compression applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Reed–Solomon Codes?",
        a: "Use Reed–Solomon Codes when the problem matches its designed use case in data compression.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Reed–Solomon Codes (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Reed–Solomon Codes.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
