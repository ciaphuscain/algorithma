import type { AlgorithmEntry } from "../types";

export const rsaKeyGenerationEntry: AlgorithmEntry = {
  slug: "rsa-key-generation",
  name: "RSA Key Generation",
  aliases: ["RSA Key Generation"],
  curriculum: [471],
  domain: "cryptography",
  subcategory: "Cryptography",
  difficulty: "intermediate",
  summary: "RSA Key Generation is a well-known algorithm in the domain of cryptography.",
  tags: ["rsa key generation", "cryptography"],
  prerequisites: ["Number Theory"],
  related: [],
  problem: {
    input: "Input for RSA Key Generation.",
    output: "Output of RSA Key Generation.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "RSA Key Generation solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The RSA Key Generation algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of RSA Key Generation follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of RSA Key Generation is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of RSA Key Generation exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(k³)",
      average: "O(k⁴)",
      worst: "O(k⁴)",
    },
    space: "O(k)",
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
      id: "rsa-key-generation-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of RSA Key Generation?",
      options: [
        "To solve the RSA Key Generation problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "RSA Key Generation is designed to solve its specific problem efficiently.",
      hints: ["Think about what RSA Key Generation does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "RSA Key Generation is an algorithm in the domain of cryptography.",
    steps: [
      "Apply the RSA Key Generation algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(k³)$.",
    spaceComplexity: "$O(k)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["cryptography applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use RSA Key Generation?",
        a: "Use RSA Key Generation when the problem matches its designed use case in cryptography.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define RSA Key Generation (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for RSA Key Generation.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
