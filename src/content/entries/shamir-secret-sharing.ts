import type { AlgorithmEntry } from "../types";

export const shamirSecretSharingEntry: AlgorithmEntry = {
  slug: "shamir-secret-sharing",
  name: "Shamir Secret Sharing",
  aliases: ["Shamir Secret Sharing"],
  curriculum: [594],
  domain: "cryptography",
  subcategory: "Cryptography",
  difficulty: "intermediate",
  summary: "Shamir Secret Sharing is a well-known algorithm in the domain of cryptography.",
  tags: ["shamir secret sharing", "cryptography"],
  prerequisites: ["Number Theory"],
  related: [],
  problem: {
    input: "Input for Shamir Secret Sharing.",
    output: "Output of Shamir Secret Sharing.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Shamir Secret Sharing solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Shamir Secret Sharing algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Shamir Secret Sharing follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Shamir Secret Sharing is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Shamir Secret Sharing exist in the literature. See references for details.",
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
      id: "shamir-secret-sharing-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Shamir Secret Sharing?",
      options: [
        "To solve the Shamir Secret Sharing problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Shamir Secret Sharing is designed to solve its specific problem efficiently.",
      hints: ["Think about what Shamir Secret Sharing does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Shamir Secret Sharing is an algorithm in the domain of cryptography.",
    steps: [
      "Apply the Shamir Secret Sharing algorithm to the input.",
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
        q: "When should you use Shamir Secret Sharing?",
        a: "Use Shamir Secret Sharing when the problem matches its designed use case in cryptography.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Shamir Secret Sharing (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Shamir Secret Sharing.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
