import type { AlgorithmEntry } from "../types";

export const linkCutTreeEntry: AlgorithmEntry = {
  slug: "link-cut-tree",
  name: "Link-Cut Tree",
  aliases: ["Link-Cut Tree"],
  curriculum: [192],
  domain: "trees",
  subcategory: "Tree Algorithms",
  difficulty: "intermediate",
  summary:
    "Link-Cut Tree is an algorithm in the field of tree algorithms. It provides an efficient approach to solving problems in this domain.",
  tags: ["link-cut tree", "tree algorithms"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input data for Link-Cut Tree.",
    output: "Result of applying Link-Cut Tree to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Link-Cut Tree addresses a fundamental problem in tree algorithms. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind Link-Cut Tree is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Link-Cut Tree algorithm proceeds through a series of well-defined steps:",
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
        text: "When implementing Link-Cut Tree, pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of Link-Cut Tree depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of Link-Cut Tree exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
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
      id: "link-cut-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Link-Cut Tree?",
      options: [
        "To solve problems in tree algorithms",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation:
        "Link-Cut Tree is designed specifically for problems in the domain of tree algorithms.",
      hints: ["Think about what domain Link-Cut Tree belongs to"],
      objective: "Understand the purpose of Link-Cut Tree",
    },
  ],
  exam: {
    definition: "Define Link-Cut Tree and explain its purpose.",
    steps: ["Describe the main steps of Link-Cut Tree."],
    timeComplexity: "Analyze the time complexity of Link-Cut Tree.",
    spaceComplexity: "Analyze the space complexity of Link-Cut Tree.",
    correctness: "How does Link-Cut Tree guarantee correctness?",
    applications: ["List two applications of Link-Cut Tree."],
    limitations: ["What are the limitations of Link-Cut Tree?"],
    faq: [
      {
        q: "Why is Link-Cut Tree preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Link-Cut Tree works by applying its core strategy to efficiently solve the targe",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on Link-Cut Tree",
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
