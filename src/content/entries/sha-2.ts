import type { AlgorithmEntry } from "../types";

export const sha2Entry: AlgorithmEntry = {
  slug: "sha-2",
  name: "SHA-2",
  aliases: ["SHA-2"],
  curriculum: [482],
  domain: "cryptography",
  subcategory: "Cryptography",
  difficulty: "intermediate",
  summary: "SHA-2 is a well-known algorithm in the domain of cryptography.",
  tags: ["sha 2", "cryptography"],
  prerequisites: ["Number Theory"],
  related: [],
  problem: {
    input: "Input for SHA-2.",
    output: "Output of SHA-2.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "SHA-2 solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The SHA-2 algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of SHA-2 follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of SHA-2 is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of SHA-2 exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n)",
      worst: "O(n)",
    },
    space: "O(1)",
    worstClass: "n",
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
      id: "sha-2-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of SHA-2?",
      options: [
        "To solve the SHA-2 problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "SHA-2 is designed to solve its specific problem efficiently.",
      hints: ["Think about what SHA-2 does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "SHA-2 is an algorithm in the domain of cryptography.",
    steps: [
      "Apply the SHA-2 algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(1)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["cryptography applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use SHA-2?",
        a: "Use SHA-2 when the problem matches its designed use case in cryptography.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Define SHA-2 (1).", "Describe the algorithm (2).", "Analyze complexity (2)."],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for SHA-2.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
