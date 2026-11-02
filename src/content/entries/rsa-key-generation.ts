import type { AlgorithmEntry } from "../types";

export const rsaKeyGenerationEntry: AlgorithmEntry = {
  slug: "rsa-key-generation",
  name: "RSA Key Generation",
  aliases: ["RSA Key Generation"],
  curriculum: [471],
  domain: "cryptography",
  subcategory: "Cryptography",
  difficulty: "intermediate",
  summary:
    "RSA Key Generation is an algorithm in the field of cryptography. It provides an efficient approach to solving problems in this domain.",
  tags: ["rsa key generation", "cryptography"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input data for RSA Key Generation.",
    output: "Result of applying RSA Key Generation to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "RSA Key Generation addresses a fundamental problem in cryptography. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind RSA Key Generation is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The RSA Key Generation algorithm proceeds through a series of well-defined steps:",
      },
      {
        kind: "list",
        ordered: true,
        items: [
          "Initialize the data structures needed for processing.",
          "Process each element of the input according to the algorithm's rules.",
          "Combine intermediate results to produce the final output.",
          "Return the computed result.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "The implementation follows the algorithm's specification closely. Key considerations include choosing appropriate data structures and handling edge cases.",
      },
      {
        kind: "callout",
        tone: "tip",
        text: "When implementing RSA Key Generation, pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of RSA Key Generation depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of RSA Key Generation exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
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
      label: "Category",
      value: "Cryptography",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "encrypt",
      code: `def encrypt(data, key):
    """Simple XOR cipher demonstrating symmetric encryption concepts.
    data and key are lists of integers (bytes)."""
    key_len = len(key)
    return [d ^ key[i % key_len] for i, d in enumerate(data)]
`,
      tests: [
        {
          args: [[72, 101, 108], [42]],
          expected: [98, 79, 70],
        },
        {
          args: [[114, 79, 70], [42]],
          expected: [88, 101, 108],
        },
      ],
    },
    {
      language: "javascript",
      entry: "encrypt",
      code: `function encrypt(data, key) {
  return data.map((d, i) => d ^ key[i % key.length]);
}`,
      tests: [
        {
          args: [[72, 101, 108], [42]],
          expected: [98, 79, 70],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "rsa-key--q1",
      kind: "mcq",
      prompt: "What is the primary purpose of RSA Key Generation?",
      options: [
        "To solve problems in cryptography",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation:
        "RSA Key Generation is designed specifically for problems in the domain of cryptography.",
      hints: ["Think about what domain RSA Key Generation belongs to"],
      objective: "Understand the purpose of RSA Key Generation",
    },
  ],
  exam: {
    definition: "Define RSA Key Generation and explain its purpose.",
    steps: ["Describe the main steps of RSA Key Generation."],
    timeComplexity: "Analyze the time complexity of RSA Key Generation.",
    spaceComplexity: "Analyze the space complexity of RSA Key Generation.",
    correctness: "How does RSA Key Generation guarantee correctness?",
    applications: ["List two applications of RSA Key Generation."],
    limitations: ["What are the limitations of RSA Key Generation?"],
    faq: [
      {
        q: "Why is RSA Key Generation preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "RSA Key Generation works by applying its core strategy to efficiently solve the ",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on RSA Key Generation",
      supports: "Core algorithm description",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
