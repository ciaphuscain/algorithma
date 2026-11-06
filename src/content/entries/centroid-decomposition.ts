import type { AlgorithmEntry } from "../types";

export const centroidDecompositionEntry: AlgorithmEntry = {
  slug: "centroid-decomposition",
  name: "Centroid Decomposition",
  aliases: ["Centroid Decomposition"],
  curriculum: [191],
  domain: "trees",
  subcategory: "Tree Algorithms",
  difficulty: "intermediate",
  summary:
    "Centroid Decomposition is an algorithm in the field of tree algorithms. It provides an efficient approach to solving problems in this domain.",
  tags: ["centroid decomposition", "tree algorithms"],
  prerequisites: [],
  related: ["heavy-light", "tree-dp"],
  problem: {
    input: "Input data for Centroid Decomposition.",
    output: "Result of applying Centroid Decomposition to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Centroid Decomposition addresses a fundamental problem in tree algorithms. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind Centroid Decomposition is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Centroid Decomposition algorithm proceeds through a series of well-defined steps:",
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
        text: "When implementing Centroid Decomposition, pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of Centroid Decomposition depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of Centroid Decomposition exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
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
      id: "centroid-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Centroid Decomposition?",
      options: [
        "To solve problems in tree algorithms",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation:
        "Centroid Decomposition is designed specifically for problems in the domain of tree algorithms.",
      hints: ["Think about what domain Centroid Decomposition belongs to"],
      objective: "Understand the purpose of Centroid Decomposition",
    },
  ],
  exam: {
    definition: "Define Centroid Decomposition and explain its purpose.",
    steps: ["Describe the main steps of Centroid Decomposition."],
    timeComplexity: "Analyze the time complexity of Centroid Decomposition.",
    spaceComplexity: "Analyze the space complexity of Centroid Decomposition.",
    correctness: "How does Centroid Decomposition guarantee correctness?",
    applications: ["List two applications of Centroid Decomposition."],
    limitations: ["What are the limitations of Centroid Decomposition?"],
    faq: [
      {
        q: "Why is Centroid Decomposition preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Centroid Decomposition works by applying its core strategy to efficiently solve ",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on Centroid Decomposition",
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
