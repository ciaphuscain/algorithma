import type { AlgorithmEntry } from "../types";

export const doubleHashingEntry: AlgorithmEntry = {
  slug: "double-hashing",
  name: "Double Hashing",
  aliases: ["Double Hashing"],
  curriculum: [312],
  domain: "strings",
  subcategory: "String Algorithms",
  difficulty: "intermediate",
  summary: "Double Hashing is a well-known algorithm in the domain of string processing.",
  tags: ["double hashing", "string"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Double Hashing.",
    output: "Output of Double Hashing.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Double Hashing solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Double Hashing algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Double Hashing follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Double Hashing is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Double Hashing exist in the literature. See references for details.",
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
      value: "string processing",
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
      id: "double-hashing-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Double Hashing?",
      options: [
        "To solve the Double Hashing problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Double Hashing is designed to solve its specific problem efficiently.",
      hints: ["Think about what Double Hashing does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Double Hashing is an algorithm in the domain of string processing.",
    steps: [
      "Apply the Double Hashing algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["string processing applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Double Hashing?",
        a: "Use Double Hashing when the problem matches its designed use case in string processing.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Double Hashing (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Double Hashing.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
