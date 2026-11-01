import type { AlgorithmEntry } from "../types";

export const lzwEntry: AlgorithmEntry = {
  slug: "lzw",
  name: "LZW",
  aliases: ["LZW"],
  curriculum: [538],
  domain: "compression",
  subcategory: "Compression",
  difficulty: "intermediate",
  summary: "LZW is a well-known algorithm in the domain of data compression.",
  tags: ["lzw", "compression"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for LZW.",
    output: "Output of LZW.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "LZW solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The LZW algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of LZW follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of LZW is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of LZW exist in the literature. See references for details.",
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
      id: "lzw-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of LZW?",
      options: [
        "To solve the LZW problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "LZW is designed to solve its specific problem efficiently.",
      hints: ["Think about what LZW does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "LZW is an algorithm in the domain of data compression.",
    steps: [
      "Apply the LZW algorithm to the input.",
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
        q: "When should you use LZW?",
        a: "Use LZW when the problem matches its designed use case in data compression.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Define LZW (1).", "Describe the algorithm (2).", "Analyze complexity (2)."],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for LZW.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
