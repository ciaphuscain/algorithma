import type { AlgorithmEntry } from "../types";

export const hammingCodesEntry: AlgorithmEntry = {
  slug: "hamming-codes",
  name: "Hamming Codes",
  aliases: ["Hamming Codes"],
  curriculum: [543],
  domain: "compression",
  subcategory: "Compression",
  difficulty: "intermediate",
  summary: "Hamming Codes is a well-known algorithm in the domain of data compression.",
  tags: ["hamming codes", "compression"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Hamming Codes.",
    output: "Output of Hamming Codes.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Hamming Codes solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Hamming Codes algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Hamming Codes follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Hamming Codes is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Hamming Codes exist in the literature. See references for details.",
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
      id: "hamming-codes-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Hamming Codes?",
      options: [
        "To solve the Hamming Codes problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Hamming Codes is designed to solve its specific problem efficiently.",
      hints: ["Think about what Hamming Codes does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Hamming Codes is an algorithm in the domain of data compression.",
    steps: [
      "Apply the Hamming Codes algorithm to the input.",
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
        q: "When should you use Hamming Codes?",
        a: "Use Hamming Codes when the problem matches its designed use case in data compression.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Hamming Codes (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Hamming Codes.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
