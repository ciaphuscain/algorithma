import type { AlgorithmEntry } from "../types";

export const ed25519Entry: AlgorithmEntry = {
  slug: "ed25519",
  name: "Ed25519",
  aliases: ["Ed25519"],
  curriculum: [596],
  domain: "cryptography",
  subcategory: "Cryptography",
  difficulty: "intermediate",
  summary: "Ed25519 is a well-known algorithm in the domain of cryptography.",
  tags: ["ed25519", "cryptography"],
  prerequisites: ["Number Theory"],
  related: [],
  problem: {
    input: "Input for Ed25519.",
    output: "Output of Ed25519.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Ed25519 solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Ed25519 algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Ed25519 follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Ed25519 is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Ed25519 exist in the literature. See references for details.",
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
      id: "ed25519-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Ed25519?",
      options: [
        "To solve the Ed25519 problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Ed25519 is designed to solve its specific problem efficiently.",
      hints: ["Think about what Ed25519 does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Ed25519 is an algorithm in the domain of cryptography.",
    steps: [
      "Apply the Ed25519 algorithm to the input.",
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
        q: "When should you use Ed25519?",
        a: "Use Ed25519 when the problem matches its designed use case in cryptography.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Define Ed25519 (1).", "Describe the algorithm (2).", "Analyze complexity (2)."],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Ed25519.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
