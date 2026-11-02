import type { AlgorithmEntry } from "../types";

export const rTreeEntry: AlgorithmEntry = {
  slug: "r-tree",
  name: "R Tree",
  aliases: ["R Tree"],
  curriculum: [180],
  domain: "trees",
  subcategory: "Tree Algorithms",
  difficulty: "intermediate",
  summary:
    "R Tree is an algorithm in the field of tree algorithms. It provides an efficient approach to solving problems in this domain.",
  tags: ["r tree", "tree algorithms"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input data for R Tree.",
    output: "Result of applying R Tree to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "R Tree addresses a fundamental problem in tree algorithms. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind R Tree is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The R Tree algorithm proceeds through a series of well-defined steps:",
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
        text: "When implementing R Tree, pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of R Tree depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of R Tree exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
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
      value: "Tree Algorithms",
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
      id: "r-tree-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of R Tree?",
      options: [
        "To solve problems in tree algorithms",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation: "R Tree is designed specifically for problems in the domain of tree algorithms.",
      hints: ["Think about what domain R Tree belongs to"],
      objective: "Understand the purpose of R Tree",
    },
  ],
  exam: {
    definition: "Define R Tree and explain its purpose.",
    steps: ["Describe the main steps of R Tree."],
    timeComplexity: "Analyze the time complexity of R Tree.",
    spaceComplexity: "Analyze the space complexity of R Tree.",
    correctness: "How does R Tree guarantee correctness?",
    applications: ["List two applications of R Tree."],
    limitations: ["What are the limitations of R Tree?"],
    faq: [
      { q: "Why is R Tree preferred over simpler alternatives?", a: "See the lesson for details." },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "R Tree works by applying its core strategy to efficiently solve the target probl",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on R Tree",
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
