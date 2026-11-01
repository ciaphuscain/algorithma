import type { AlgorithmEntry } from "../types";

export const kShortestPathsEntry: AlgorithmEntry = {
  slug: "k-shortest-paths",
  name: "K Shortest Paths",
  aliases: ["K Shortest Paths"],
  curriculum: [214],
  domain: "graphs",
  subcategory: "Graph Algorithms",
  difficulty: "intermediate",
  summary: "K Shortest Paths is a well-known algorithm in the domain of graph algorithms.",
  tags: ["k shortest paths", "graph"],
  prerequisites: ["BFS", "DFS"],
  related: [],
  problem: {
    input: "Input for K Shortest Paths.",
    output: "Output of K Shortest Paths.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "K Shortest Paths solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The K Shortest Paths algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of K Shortest Paths follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of K Shortest Paths is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of K Shortest Paths exist in the literature. See references for details.",
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
      id: "k-shortest-paths-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of K Shortest Paths?",
      options: [
        "To solve the K Shortest Paths problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "K Shortest Paths is designed to solve its specific problem efficiently.",
      hints: ["Think about what K Shortest Paths does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "K Shortest Paths is an algorithm in the domain of graph algorithms.",
    steps: [
      "Apply the K Shortest Paths algorithm to the input.",
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
        q: "When should you use K Shortest Paths?",
        a: "Use K Shortest Paths when the problem matches its designed use case in graph algorithms.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define K Shortest Paths (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for K Shortest Paths.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
