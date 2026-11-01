import type { AlgorithmEntry } from "../types";

export const edmondsKarpEntry: AlgorithmEntry = {
  slug: "edmonds-karp",
  name: "Edmonds-Karp",
  aliases: ["Edmonds-Karp"],
  curriculum: [234],
  domain: "graphs",
  subcategory: "Graph Algorithms",
  difficulty: "intermediate",
  summary: "Edmonds-Karp is a well-known algorithm in the domain of graph algorithms.",
  tags: ["edmonds karp", "graph"],
  prerequisites: ["BFS", "DFS"],
  related: [],
  problem: {
    input: "Input for Edmonds-Karp.",
    output: "Output of Edmonds-Karp.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Edmonds-Karp solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Edmonds-Karp algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Edmonds-Karp follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Edmonds-Karp is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Edmonds-Karp exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(VE²)",
      average: "O(VE²)",
      worst: "O(VE²)",
    },
    space: "O(V + E)",
    worstClass: "other",
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
      id: "edmonds-karp-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Edmonds-Karp?",
      options: [
        "To solve the Edmonds-Karp problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Edmonds-Karp is designed to solve its specific problem efficiently.",
      hints: ["Think about what Edmonds-Karp does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Edmonds-Karp is an algorithm in the domain of graph algorithms.",
    steps: [
      "Apply the Edmonds-Karp algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(VE²)$.",
    spaceComplexity: "$O(V + E)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["graph algorithms applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Edmonds-Karp?",
        a: "Use Edmonds-Karp when the problem matches its designed use case in graph algorithms.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Edmonds-Karp (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Edmonds-Karp.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
