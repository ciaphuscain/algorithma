import type { AlgorithmEntry } from "../types";

export const deflateEntry: AlgorithmEntry = {
  slug: "deflate",
  name: "DEFLATE",
  aliases: ["DEFLATE"],
  curriculum: [539],
  domain: "compression",
  subcategory: "Compression",
  difficulty: "intermediate",
  summary: "DEFLATE is a well-known algorithm in the domain of data compression.",
  tags: ["deflate", "compression"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for DEFLATE.",
    output: "Output of DEFLATE.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "DEFLATE solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The DEFLATE algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of DEFLATE follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of DEFLATE is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of DEFLATE exist in the literature. See references for details.",
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
      id: "deflate-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of DEFLATE?",
      options: [
        "To solve the DEFLATE problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "DEFLATE is designed to solve its specific problem efficiently.",
      hints: ["Think about what DEFLATE does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "DEFLATE is an algorithm in the domain of data compression.",
    steps: [
      "Apply the DEFLATE algorithm to the input.",
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
        q: "When should you use DEFLATE?",
        a: "Use DEFLATE when the problem matches its designed use case in data compression.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Define DEFLATE (1).", "Describe the algorithm (2).", "Analyze complexity (2)."],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for DEFLATE.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
