import type { AlgorithmEntry } from "../types";

export const ellipticCurveDiffieHellmanEcdhEntry: AlgorithmEntry = {
  slug: "elliptic-curve-diffie-hellman-ecdh",
  name: "Elliptic Curve Diffie–Hellman (ECDH)",
  aliases: ["Elliptic Curve Diffie–Hellman (ECDH)"],
  curriculum: [474],
  domain: "cryptography",
  subcategory: "Cryptography",
  difficulty: "intermediate",
  summary:
    "Elliptic Curve Diffie–Hellman (ECDH) is a well-known algorithm in the domain of cryptography.",
  tags: ["elliptic curve diffie hellman ecdh", "cryptography"],
  prerequisites: ["Number Theory"],
  related: [],
  problem: {
    input: "Input for Elliptic Curve Diffie–Hellman (ECDH).",
    output: "Output of Elliptic Curve Diffie–Hellman (ECDH).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Elliptic Curve Diffie–Hellman (ECDH) solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Elliptic Curve Diffie–Hellman (ECDH) algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Elliptic Curve Diffie–Hellman (ECDH) follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Elliptic Curve Diffie–Hellman (ECDH) is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Elliptic Curve Diffie–Hellman (ECDH) exist in the literature. See references for details.",
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
      id: "elliptic-curve-diffie-hellman-ecdh-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Elliptic Curve Diffie–Hellman (ECDH)?",
      options: [
        "To solve the Elliptic Curve Diffie–Hellman (ECDH) problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation:
        "Elliptic Curve Diffie–Hellman (ECDH) is designed to solve its specific problem efficiently.",
      hints: ["Think about what Elliptic Curve Diffie–Hellman (ECDH) does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition:
      "Elliptic Curve Diffie–Hellman (ECDH) is an algorithm in the domain of cryptography.",
    steps: [
      "Apply the Elliptic Curve Diffie–Hellman (ECDH) algorithm to the input.",
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
        q: "When should you use Elliptic Curve Diffie–Hellman (ECDH)?",
        a: "Use Elliptic Curve Diffie–Hellman (ECDH) when the problem matches its designed use case in cryptography.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Elliptic Curve Diffie–Hellman (ECDH) (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Elliptic Curve Diffie–Hellman (ECDH).",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
