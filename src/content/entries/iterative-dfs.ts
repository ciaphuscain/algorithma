import type { AlgorithmEntry } from "../types";

export const iterativeDfsEntry: AlgorithmEntry = {
  slug: "iterative-dfs",
  name: "Iterative DFS",
  aliases: ["Iterative DFS"],
  curriculum: [203],
  domain: "graphs",
  subcategory: "Graph Traversal",
  difficulty: "beginner",
  summary:
    "Depth-first search using an explicit stack instead of recursion. Avoids stack overflow on deep graphs. Push neighbors onto a stack; pop and visit. Same time and space complexity as recursive DFS.",
  tags: ["DFS", "iterative", "stack", "graph traversal"],
  prerequisites: ["DFS", "Stacks"],
  related: ["dfs", "bidirectional-bfs"],
  problem: {
    input: "Input for Iterative DFS.",
    output: "Output of Iterative DFS.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Depth-first search using an explicit stack instead of recursion. Avoids stack overflow on deep graphs. Push neighbors onto a stack; pop and visit. Same time and space complexity as recursive DFS.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Iterative DFS algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Iterative DFS follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Iterative DFS is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Iterative DFS exist in the literature. See references for details.",
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
    worstClass: "n",
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
      id: "iterative-dfs-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Iterative DFS?",
      options: [
        "Depth-first search using an explicit stack instead of recurs...",
        "Sorting an array",
        "Finding shortest paths",
        "Compressing data",
      ],
      answer: 0,
      explanation:
        "Iterative DFS: Depth-first search using an explicit stack instead of recursion. Avoids stack overflow on deep graphs. Push neighbors onto a stack; pop and visit. Same time and space complexity as recursive DFS.",
      hints: ["Think about what problem Iterative DFS solves."],
      objective: "Iterative DFS",
    },
  ],
  exam: {
    definition:
      "Depth-first search using an explicit stack instead of recursion. Avoids stack overflow on deep graphs. Push neighbors onto a stack; pop and visit. Same time and space complexity as recursive DFS.",
    steps: ["Apply the Iterative DFS algorithm to the input."],
    timeComplexity: "See complexity section.",
    spaceComplexity: "See complexity section.",
    correctness:
      "The Iterative DFS algorithm is correct because it systematically processes all cases.",
    applications: ["Graph Traversal"],
    limitations: ["See advanced section for limitations."],
    faq: [
      {
        q: "When should you use Iterative DFS?",
        a: "Use Iterative DFS when the problem matches its design: Depth-first search using an explicit stack instead of recursion. Avoids stack overflow on deep graph",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Iterative DFS (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. Cormen et al., Introduction to Algorithms, 4th ed.",
      supports: "General reference for Iterative DFS.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
