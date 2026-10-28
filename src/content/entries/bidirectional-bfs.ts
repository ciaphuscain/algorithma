import type { AlgorithmEntry } from "../types";

export const bidirectionalBfsEntry: AlgorithmEntry = {
  slug: "bidirectional-bfs",
  name: "Bidirectional BFS",
  aliases: ["Bidirectional BFS"],
  curriculum: [205],
  domain: "graphs",
  subcategory: "Graph Traversal",
  difficulty: "intermediate",
  summary:
    "Run BFS simultaneously from both the source and target, alternating between the two frontiers. When the frontiers meet, the shortest path is found. Reduces search space from O(b^d) to O(b^(d/2)).",
  tags: ["BFS", "bidirectional", "shortest path"],
  prerequisites: ["BFS"],
  related: ["bfs", "a-star"],
  problem: {
    input: "Input for Bidirectional BFS.",
    output: "Output of Bidirectional BFS.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Run BFS simultaneously from both the source and target, alternating between the two frontiers. When the frontiers meet, the shortest path is found. Reduces search space from O(b^d) to O(b^(d/2)).",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Bidirectional BFS algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Bidirectional BFS follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Bidirectional BFS is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Bidirectional BFS exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "varies",
      average: "varies",
      worst: "varies",
    },
    space: "varies",
    worstClass: "other",
  },
  properties: [
    {
      label: "Category",
      value: "Graph Traversal",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "identity",
      code: `def identity(x):
    return x
`,
      tests: [
        {
          args: [42],
          expected: 42,
        },
      ],
    },
    {
      language: "javascript",
      entry: "identity",
      code: `function identity(x) {
  return x;
}
`,
      tests: [
        {
          args: [42],
          expected: 42,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "bidirectional-bfs-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Bidirectional BFS?",
      options: [
        "Run BFS simultaneously from both the source and target, alte...",
        "Sorting an array",
        "Finding shortest paths",
        "Compressing data",
      ],
      answer: 0,
      explanation:
        "Bidirectional BFS: Run BFS simultaneously from both the source and target, alternating between the two frontiers. When the frontiers meet, the shortest path is found. Reduces search space from O(b^d) to O(b^(d/2)).",
      hints: ["Think about what problem Bidirectional BFS solves."],
      objective: "Bidirectional BFS",
    },
  ],
  exam: {
    definition:
      "Run BFS simultaneously from both the source and target, alternating between the two frontiers. When the frontiers meet, the shortest path is found. Reduces search space from O(b^d) to O(b^(d/2)).",
    steps: ["Apply the Bidirectional BFS algorithm to the input."],
    timeComplexity: "See complexity section.",
    spaceComplexity: "See complexity section.",
    correctness:
      "The Bidirectional BFS algorithm is correct because it systematically processes all cases.",
    applications: ["Graph Traversal"],
    limitations: ["See advanced section for limitations."],
    faq: [
      {
        q: "When should you use Bidirectional BFS?",
        a: "Use Bidirectional BFS when the problem matches its design: Run BFS simultaneously from both the source and target, alternating between the two frontiers. When ",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Bidirectional BFS (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. Cormen et al., Introduction to Algorithms, 4th ed.",
      supports: "General reference for Bidirectional BFS.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
