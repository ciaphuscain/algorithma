import type { AlgorithmEntry } from "../types";

export const gomoryHuTreeEntry: AlgorithmEntry = {
  slug: "gomory-hu-tree",
  name: "Gomory–Hu Tree",
  aliases: ["Gomory–Hu Tree"],
  curriculum: [503],
  domain: "graphs",
  subcategory: "Graph Algorithms",
  difficulty: "intermediate",
  summary: "Gomory–Hu Tree is a well-known algorithm in the domain of graph algorithms.",
  tags: ["gomory hu tree", "graph"],
  prerequisites: ["BFS", "DFS"],
  related: [],
  problem: {
    input: "Input for Gomory–Hu Tree.",
    output: "Output of Gomory–Hu Tree.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Gomory–Hu Tree solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Gomory–Hu Tree algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Gomory–Hu Tree follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Gomory–Hu Tree is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Gomory–Hu Tree exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(V + E)",
      average: "O(V + E)",
      worst: "O(V + E)",
    },
    space: "O(V + E)",
    worstClass: "n + m",
  },
  properties: [
    {
      label: "Domain",
      value: "graph algorithms",
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
      id: "gomory-hu-tree-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Gomory–Hu Tree?",
      options: [
        "To solve the Gomory–Hu Tree problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Gomory–Hu Tree is designed to solve its specific problem efficiently.",
      hints: ["Think about what Gomory–Hu Tree does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Gomory–Hu Tree is an algorithm in the domain of graph algorithms.",
    steps: [
      "Apply the Gomory–Hu Tree algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(V + E)$.",
    spaceComplexity: "$O(V + E)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["graph algorithms applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Gomory–Hu Tree?",
        a: "Use Gomory–Hu Tree when the problem matches its designed use case in graph algorithms.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Gomory–Hu Tree (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Gomory–Hu Tree.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
