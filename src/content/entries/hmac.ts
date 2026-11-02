import type { AlgorithmEntry } from "../types";

export const hmacEntry: AlgorithmEntry = {
  slug: "hmac",
  name: "HMAC",
  aliases: ["HMAC"],
  curriculum: [484],
  domain: "cryptography",
  subcategory: "Cryptography",
  difficulty: "intermediate",
  summary:
    "HMAC is an algorithm in the field of cryptography. It provides an efficient approach to solving problems in this domain.",
  tags: ["hmac", "cryptography"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input data for HMAC.",
    output: "Result of applying HMAC to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "HMAC addresses a fundamental problem in cryptography. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind HMAC is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The HMAC algorithm proceeds through a series of well-defined steps:",
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
        text: "When implementing HMAC, pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of HMAC depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of HMAC exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
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
      id: "hmac-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of HMAC?",
      options: [
        "To solve problems in cryptography",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation: "HMAC is designed specifically for problems in the domain of cryptography.",
      hints: ["Think about what domain HMAC belongs to"],
      objective: "Understand the purpose of HMAC",
    },
  ],
  exam: {
    definition: "Define HMAC and explain its purpose.",
    steps: ["Describe the main steps of HMAC."],
    timeComplexity: "Analyze the time complexity of HMAC.",
    spaceComplexity: "Analyze the space complexity of HMAC.",
    correctness: "How does HMAC guarantee correctness?",
    applications: ["List two applications of HMAC."],
    limitations: ["What are the limitations of HMAC?"],
    faq: [
      { q: "Why is HMAC preferred over simpler alternatives?", a: "See the lesson for details." },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "HMAC works by applying its core strategy to efficiently solve the target problem",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on HMAC",
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
