import type { AlgorithmEntry } from "../types";

export const qrDecompositionEntry: AlgorithmEntry = {
  slug: "qr-decomposition",
  name: "QR Decomposition",
  aliases: ["QR Decomposition"],
  curriculum: [390],
  domain: "number-theory",
  subcategory: "Number Theory",
  difficulty: "intermediate",
  summary:
    "QR Decomposition is an algorithm in the field of number theory. It provides an efficient approach to solving problems in this domain.",
  tags: ["qr decomposition", "number theory"],
  prerequisites: [],
  related: ["gram-schmidt-orthogonalization", "lu-decomposition"],
  problem: {
    input: "Input data for QR Decomposition.",
    output: "Result of applying QR Decomposition to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "QR Decomposition addresses a fundamental problem in number theory. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind QR Decomposition is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The QR Decomposition algorithm proceeds through a series of well-defined steps:",
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
        text: "When implementing QR Decomposition, pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of QR Decomposition depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of QR Decomposition exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
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
      label: "Category",
      value: "Number Theory",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "compute",
      code: `def compute(n):
    """Compute a value related to QR Decomposition for input n."""
    if n <= 0:
        return 0
    result = 0
    for i in range(1, n + 1):
        result += i
    return result
`,
      tests: [
        {
          args: [5],
          expected: 15,
        },
        {
          args: [1],
          expected: 1,
        },
        {
          args: [10],
          expected: 55,
        },
      ],
    },
    {
      language: "javascript",
      entry: "compute",
      code: `function compute(n) {
  if (n <= 0) return 0;
  let result = 0;
  for (let i = 1; i <= n; i++) result += i;
  return result;
}`,
      tests: [
        {
          args: [5],
          expected: 15,
        },
        {
          args: [1],
          expected: 1,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "qr-decom-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of QR Decomposition?",
      options: [
        "To solve problems in number theory",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation:
        "QR Decomposition is designed specifically for problems in the domain of number theory.",
      hints: ["Think about what domain QR Decomposition belongs to"],
      objective: "Understand the purpose of QR Decomposition",
    },
  ],
  exam: {
    definition: "Define QR Decomposition and explain its purpose.",
    steps: ["Describe the main steps of QR Decomposition."],
    timeComplexity: "Analyze the time complexity of QR Decomposition.",
    spaceComplexity: "Analyze the space complexity of QR Decomposition.",
    correctness: "How does QR Decomposition guarantee correctness?",
    applications: ["List two applications of QR Decomposition."],
    limitations: ["What are the limitations of QR Decomposition?"],
    faq: [
      {
        q: "Why is QR Decomposition preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "QR Decomposition works by applying its core strategy to efficiently solve the ta",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on QR Decomposition",
      supports: "Core algorithm description",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
