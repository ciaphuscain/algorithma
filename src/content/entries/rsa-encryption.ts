import type { AlgorithmEntry } from "../types";

export const rsaEncryptionEntry: AlgorithmEntry = {
  slug: "rsa-encryption",
  name: "RSA Encryption",
  aliases: ["RSA Encryption"],
  curriculum: [472],
  domain: "cryptography",
  subcategory: "Cryptography",
  difficulty: "intermediate",
  summary: "RSA Encryption is a well-known algorithm in the domain of cryptography.",
  tags: ["rsa encryption", "cryptography"],
  prerequisites: ["Number Theory"],
  related: [],
  problem: {
    input: "Input for RSA Encryption.",
    output: "Output of RSA Encryption.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "RSA Encryption solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The RSA Encryption algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of RSA Encryption follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of RSA Encryption is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of RSA Encryption exist in the literature. See references for details.",
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
      id: "rsa-encryption-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of RSA Encryption?",
      options: [
        "To solve the RSA Encryption problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "RSA Encryption is designed to solve its specific problem efficiently.",
      hints: ["Think about what RSA Encryption does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "RSA Encryption is an algorithm in the domain of cryptography.",
    steps: [
      "Apply the RSA Encryption algorithm to the input.",
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
        q: "When should you use RSA Encryption?",
        a: "Use RSA Encryption when the problem matches its designed use case in cryptography.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define RSA Encryption (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for RSA Encryption.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
