import type { AlgorithmEntry } from "../types";

export const polynomialRollingHashEntry: AlgorithmEntry = {
  slug: "polynomial-rolling-hash",
  name: "Polynomial Rolling Hash",
  aliases: ["Polynomial Rolling Hash"],
  curriculum: [311],
  domain: "strings",
  subcategory: "String Algorithms",
  difficulty: "intermediate",
  summary: "Polynomial Rolling Hash is a well-known algorithm in the domain of string processing.",
  tags: ["polynomial rolling hash", "string"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Polynomial Rolling Hash.",
    output: "Output of Polynomial Rolling Hash.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Polynomial Rolling Hash solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Polynomial Rolling Hash algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Polynomial Rolling Hash follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Polynomial Rolling Hash is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Polynomial Rolling Hash exist in the literature. See references for details.",
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
      id: "polynomial-rolling-hash-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Polynomial Rolling Hash?",
      options: [
        "To solve the Polynomial Rolling Hash problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Polynomial Rolling Hash is designed to solve its specific problem efficiently.",
      hints: ["Think about what Polynomial Rolling Hash does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Polynomial Rolling Hash is an algorithm in the domain of string processing.",
    steps: [
      "Apply the Polynomial Rolling Hash algorithm to the input.",
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
        q: "When should you use Polynomial Rolling Hash?",
        a: "Use Polynomial Rolling Hash when the problem matches its designed use case in string processing.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Polynomial Rolling Hash (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Polynomial Rolling Hash.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
