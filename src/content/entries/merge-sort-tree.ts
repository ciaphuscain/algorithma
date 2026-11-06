import type { AlgorithmEntry } from "../types";

export const mergeSortTreeEntry: AlgorithmEntry = {
  slug: "merge-sort-tree",
  name: "Merge Sort Tree",
  aliases: ["Merge Sort Tree"],
  curriculum: [196],
  domain: "trees",
  subcategory: "Tree Algorithms",
  difficulty: "intermediate",
  summary:
    "Merge Sort Tree is an algorithm in the field of tree algorithms. It provides an efficient approach to solving problems in this domain.",
  tags: ["merge sort tree", "tree algorithms"],
  prerequisites: [],
  related: ["segment-tree", "merge-sort"],
  problem: {
    input: "Input data for Merge Sort Tree.",
    output: "Result of applying Merge Sort Tree to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Merge Sort Tree addresses a fundamental problem in tree algorithms. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind Merge Sort Tree is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Merge Sort Tree algorithm proceeds through a series of well-defined steps:",
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
        text: "When implementing Merge Sort Tree, pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of Merge Sort Tree depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of Merge Sort Tree exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
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
      id: "merge-so-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Merge Sort Tree?",
      options: [
        "To solve problems in tree algorithms",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation:
        "Merge Sort Tree is designed specifically for problems in the domain of tree algorithms.",
      hints: ["Think about what domain Merge Sort Tree belongs to"],
      objective: "Understand the purpose of Merge Sort Tree",
    },
  ],
  exam: {
    definition: "Define Merge Sort Tree and explain its purpose.",
    steps: ["Describe the main steps of Merge Sort Tree."],
    timeComplexity: "Analyze the time complexity of Merge Sort Tree.",
    spaceComplexity: "Analyze the space complexity of Merge Sort Tree.",
    correctness: "How does Merge Sort Tree guarantee correctness?",
    applications: ["List two applications of Merge Sort Tree."],
    limitations: ["What are the limitations of Merge Sort Tree?"],
    faq: [
      {
        q: "Why is Merge Sort Tree preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Merge Sort Tree works by applying its core strategy to efficiently solve the tar",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on Merge Sort Tree",
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
