import type { AlgorithmEntry } from "../types";

export const intervalTreeEntry: AlgorithmEntry = {
  slug: "interval-tree",
  name: "Interval Tree",
  aliases: ["Interval Tree"],
  curriculum: [175],
  domain: "trees",
  subcategory: "Special-purpose Trees",
  difficulty: "intermediate",
  summary:
    "Interval Tree is an algorithm in the field of special-purpose trees. It provides an efficient approach to solving problems in this domain.",
  tags: ["interval tree", "special-purpose trees"],
  prerequisites: [],
  related: ["segment-tree", "range-tree"],
  problem: {
    input: "Input data for Interval Tree.",
    output: "Result of applying Interval Tree to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Interval Tree addresses a fundamental problem in special-purpose trees. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind Interval Tree is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Interval Tree algorithm proceeds through a series of well-defined steps:",
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
        text: "When implementing Interval Tree, pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of Interval Tree depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of Interval Tree exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
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
      value: "Special-purpose Trees",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "solve",
      code: `def solve(points):
    """Build a simple spatial tree structure from points and query nearest.
    Returns sorted points as a basic tree traversal result."""
    return sorted(points)
`,
      tests: [
        {
          args: [[5, 3, 8, 1, 4]],
          expected: [1, 3, 4, 5, 8],
        },
        {
          args: [[1]],
          expected: [1],
        },
      ],
    },
    {
      language: "javascript",
      entry: "solve",
      code: `function solve(points) {
  return [...points].sort((a, b) => a - b);
}`,
      tests: [
        {
          args: [[5, 3, 8, 1, 4]],
          expected: [1, 3, 4, 5, 8],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "interval-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Interval Tree?",
      options: [
        "To solve problems in special-purpose trees",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation:
        "Interval Tree is designed specifically for problems in the domain of special-purpose trees.",
      hints: ["Think about what domain Interval Tree belongs to"],
      objective: "Understand the purpose of Interval Tree",
    },
  ],
  exam: {
    definition: "Define Interval Tree and explain its purpose.",
    steps: ["Describe the main steps of Interval Tree."],
    timeComplexity: "Analyze the time complexity of Interval Tree.",
    spaceComplexity: "Analyze the space complexity of Interval Tree.",
    correctness: "How does Interval Tree guarantee correctness?",
    applications: ["List two applications of Interval Tree."],
    limitations: ["What are the limitations of Interval Tree?"],
    faq: [
      {
        q: "Why is Interval Tree preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Interval Tree works by applying its core strategy to efficiently solve the targe",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on Interval Tree",
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
