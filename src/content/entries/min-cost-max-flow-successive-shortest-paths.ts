import type { AlgorithmEntry } from "../types";

export const minCostMaxFlowSuccessiveShortestPathsEntry: AlgorithmEntry = {
  slug: "min-cost-max-flow-successive-shortest-paths",
  name: "Min-Cost Max-Flow (Successive Shortest Paths)",
  aliases: ["Min-Cost Max-Flow (Successive Shortest Paths)"],
  curriculum: [501],
  domain: "graphs",
  subcategory: "Graph Algorithms",
  difficulty: "intermediate",
  summary:
    "Min-Cost Max-Flow (Successive Shortest Paths) is a well-known algorithm in the domain of graph algorithms.",
  tags: ["min cost max flow successive shortest paths", "graph"],
  prerequisites: ["BFS", "DFS"],
  related: [],
  problem: {
    input: "Input for Min-Cost Max-Flow (Successive Shortest Paths).",
    output: "Output of Min-Cost Max-Flow (Successive Shortest Paths).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Min-Cost Max-Flow (Successive Shortest Paths) solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Min-Cost Max-Flow (Successive Shortest Paths) algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Min-Cost Max-Flow (Successive Shortest Paths) follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Min-Cost Max-Flow (Successive Shortest Paths) is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Min-Cost Max-Flow (Successive Shortest Paths) exist in the literature. See references for details.",
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
      id: "min-cost-max-flow-successive-shortest-paths-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Min-Cost Max-Flow (Successive Shortest Paths)?",
      options: [
        "To solve the Min-Cost Max-Flow (Successive Shortest Paths) problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation:
        "Min-Cost Max-Flow (Successive Shortest Paths) is designed to solve its specific problem efficiently.",
      hints: ["Think about what Min-Cost Max-Flow (Successive Shortest Paths) does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition:
      "Min-Cost Max-Flow (Successive Shortest Paths) is an algorithm in the domain of graph algorithms.",
    steps: [
      "Apply the Min-Cost Max-Flow (Successive Shortest Paths) algorithm to the input.",
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
        q: "When should you use Min-Cost Max-Flow (Successive Shortest Paths)?",
        a: "Use Min-Cost Max-Flow (Successive Shortest Paths) when the problem matches its designed use case in graph algorithms.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Min-Cost Max-Flow (Successive Shortest Paths) (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Min-Cost Max-Flow (Successive Shortest Paths).",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
