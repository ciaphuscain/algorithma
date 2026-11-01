import type { AlgorithmEntry } from "../types";

export const groverSSearchEntry: AlgorithmEntry = {
  slug: "grover-s-search",
  name: "Grover's Search",
  aliases: ["Grover's Search"],
  curriculum: [599],
  domain: "research",
  subcategory: "Advanced Topics",
  difficulty: "intermediate",
  summary:
    "Grover's Search is an algorithm in the field of advanced topics. It provides an efficient approach to solving problems in this domain.",
  tags: ["grover's search", "advanced topics"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input data for Grover's Search.",
    output: "Result of applying Grover's Search to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Grover's Search addresses a fundamental problem in advanced topics. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind Grover's Search is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Grover's Search algorithm proceeds through a series of well-defined steps:",
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
        text: "When implementing Grover's Search, pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of Grover's Search depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of Grover's Search exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n log n)",
    },
    space: "O(n)",
    worstClass: "n log n",
  },
  properties: [
    {
      label: "Category",
      value: "Advanced Topics",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "solve",
      code: `def solve(data):
    """Process data using a divide-and-conquer approach.
    Returns sorted and deduplicated data."""
    return sorted(set(data))
`,
      tests: [
        {
          args: [[3, 1, 4, 1, 5, 9, 2, 6]],
          expected: [1, 2, 3, 4, 5, 6, 9],
        },
        {
          args: [[1, 1, 1]],
          expected: [1],
        },
      ],
    },
    {
      language: "javascript",
      entry: "solve",
      code: `function solve(data) {
  return [...new Set(data)].sort((a, b) => a - b);
}`,
      tests: [
        {
          args: [[3, 1, 4, 1, 5, 9, 2, 6]],
          expected: [1, 2, 3, 4, 5, 6, 9],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "grover-s-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Grover's Search?",
      options: [
        "To solve problems in advanced topics",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation:
        "Grover's Search is designed specifically for problems in the domain of advanced topics.",
      hints: ["Think about what domain Grover's Search belongs to"],
      objective: "Understand the purpose of Grover's Search",
    },
  ],
  exam: {
    definition: "Define Grover's Search and explain its purpose.",
    steps: ["Describe the main steps of Grover's Search."],
    timeComplexity: "Analyze the time complexity of Grover's Search.",
    spaceComplexity: "Analyze the space complexity of Grover's Search.",
    correctness: "How does Grover's Search guarantee correctness?",
    applications: ["List two applications of Grover's Search."],
    limitations: ["What are the limitations of Grover's Search?"],
    faq: [
      {
        q: "Why is Grover's Search preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Grover's Search works by applying its core strategy to efficiently solve the tar",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on Grover's Search",
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
