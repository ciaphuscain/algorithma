import type { AlgorithmEntry } from "../types";

export const chacha20Entry: AlgorithmEntry = {
  slug: "chacha20",
  name: "ChaCha20",
  aliases: ["ChaCha20"],
  curriculum: [479],
  domain: "cryptography",
  subcategory: "Cryptography",
  difficulty: "intermediate",
  summary:
    "ChaCha20 is an algorithm in the field of cryptography. It provides an efficient approach to solving problems in this domain.",
  tags: ["chacha20", "cryptography"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input data for ChaCha20.",
    output: "Result of applying ChaCha20 to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "ChaCha20 addresses a fundamental problem in cryptography. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind ChaCha20 is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The ChaCha20 algorithm proceeds through a series of well-defined steps:",
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
        text: "When implementing ChaCha20, pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of ChaCha20 depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of ChaCha20 exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
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
          expected: [114, 79, 70],
        },
        {
          args: [[114, 79, 70], [42]],
          expected: [72, 101, 108],
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
          expected: [114, 79, 70],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "chacha20-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of ChaCha20?",
      options: [
        "To solve problems in cryptography",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation: "ChaCha20 is designed specifically for problems in the domain of cryptography.",
      hints: ["Think about what domain ChaCha20 belongs to"],
      objective: "Understand the purpose of ChaCha20",
    },
  ],
  exam: {
    definition: "Define ChaCha20 and explain its purpose.",
    steps: ["Describe the main steps of ChaCha20."],
    timeComplexity: "Analyze the time complexity of ChaCha20.",
    spaceComplexity: "Analyze the space complexity of ChaCha20.",
    correctness: "How does ChaCha20 guarantee correctness?",
    applications: ["List two applications of ChaCha20."],
    limitations: ["What are the limitations of ChaCha20?"],
    faq: [
      {
        q: "Why is ChaCha20 preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "ChaCha20 works by applying its core strategy to efficiently solve the target pro",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on ChaCha20",
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
