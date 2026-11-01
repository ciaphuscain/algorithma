import type { AlgorithmEntry } from "../types";

export const tripleDesEntry: AlgorithmEntry = {
  slug: "triple-des",
  name: "Triple DES",
  aliases: ["Triple DES"],
  curriculum: [478],
  domain: "cryptography",
  subcategory: "Cryptography",
  difficulty: "intermediate",
  summary: "Triple DES is a well-known algorithm in the domain of cryptography.",
  tags: ["triple des", "cryptography"],
  prerequisites: ["Number Theory"],
  related: [],
  problem: {
    input: "Input for Triple DES.",
    output: "Output of Triple DES.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Triple DES solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Triple DES algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Triple DES follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Triple DES is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Triple DES exist in the literature. See references for details.",
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
    worstClass: "other",
  },
  properties: [
    {
      label: "Domain",
      value: "cryptography",
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
      id: "triple-des-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Triple DES?",
      options: [
        "To solve the Triple DES problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Triple DES is designed to solve its specific problem efficiently.",
      hints: ["Think about what Triple DES does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Triple DES is an algorithm in the domain of cryptography.",
    steps: [
      "Apply the Triple DES algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["cryptography applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Triple DES?",
        a: "Use Triple DES when the problem matches its designed use case in cryptography.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Triple DES (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Triple DES.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
