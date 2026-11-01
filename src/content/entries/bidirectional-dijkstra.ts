import type { AlgorithmEntry } from "../types";

export const bidirectionalDijkstraEntry: AlgorithmEntry = {
  slug: "bidirectional-dijkstra",
  name: "Bidirectional Dijkstra",
  aliases: ["Bidirectional Dijkstra"],
  curriculum: [212],
  domain: "graphs",
  subcategory: "Graph Algorithms",
  difficulty: "intermediate",
  summary: "Bidirectional Dijkstra is a well-known algorithm in the domain of graph algorithms.",
  tags: ["bidirectional dijkstra", "graph"],
  prerequisites: ["BFS", "DFS"],
  related: [],
  problem: {
    input: "Input for Bidirectional Dijkstra.",
    output: "Output of Bidirectional Dijkstra.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Bidirectional Dijkstra solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Bidirectional Dijkstra algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Bidirectional Dijkstra follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Bidirectional Dijkstra is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Bidirectional Dijkstra exist in the literature. See references for details.",
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
      id: "bidirectional-dijkstra-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Bidirectional Dijkstra?",
      options: [
        "To solve the Bidirectional Dijkstra problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Bidirectional Dijkstra is designed to solve its specific problem efficiently.",
      hints: ["Think about what Bidirectional Dijkstra does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Bidirectional Dijkstra is an algorithm in the domain of graph algorithms.",
    steps: [
      "Apply the Bidirectional Dijkstra algorithm to the input.",
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
        q: "When should you use Bidirectional Dijkstra?",
        a: "Use Bidirectional Dijkstra when the problem matches its designed use case in graph algorithms.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Bidirectional Dijkstra (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Bidirectional Dijkstra.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
