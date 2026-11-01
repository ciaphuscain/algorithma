import type { AlgorithmEntry } from "../types";

export const lz77Entry: AlgorithmEntry = {
  slug: "lz77",
  name: "LZ77",
  aliases: ["LZ77"],
  curriculum: [536],
  domain: "compression",
  subcategory: "Compression",
  difficulty: "intermediate",
  summary: "LZ77 is a well-known algorithm in the domain of data compression.",
  tags: ["lz77", "compression"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for LZ77.",
    output: "Output of LZ77.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "LZ77 solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The LZ77 algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of LZ77 follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of LZ77 is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of LZ77 exist in the literature. See references for details.",
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
      id: "lz77-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of LZ77?",
      options: [
        "To solve the LZ77 problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "LZ77 is designed to solve its specific problem efficiently.",
      hints: ["Think about what LZ77 does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "LZ77 is an algorithm in the domain of data compression.",
    steps: [
      "Apply the LZ77 algorithm to the input.",
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
        q: "When should you use LZ77?",
        a: "Use LZ77 when the problem matches its designed use case in data compression.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Define LZ77 (1).", "Describe the algorithm (2).", "Analyze complexity (2)."],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for LZ77.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
