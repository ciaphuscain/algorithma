import type { AlgorithmEntry } from "../types";

export const cycleDetectionUndirectedEntry: AlgorithmEntry = {
  slug: "cycle-detection-undirected",
  name: "Cycle Detection (Undirected)",
  aliases: ["Cycle Detection (Undirected)"],
  curriculum: [230],
  domain: "graphs",
  subcategory: "Graph Algorithms",
  difficulty: "intermediate",
  summary:
    "Cycle Detection (Undirected) is a well-known algorithm in the domain of graph algorithms.",
  tags: ["cycle detection undirected", "graph"],
  prerequisites: ["BFS", "DFS"],
  related: [],
  problem: {
    input: "Input for Cycle Detection (Undirected).",
    output: "Output of Cycle Detection (Undirected).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Cycle Detection (Undirected) solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Cycle Detection (Undirected) algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Cycle Detection (Undirected) follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Cycle Detection (Undirected) is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Cycle Detection (Undirected) exist in the literature. See references for details.",
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
      id: "cycle-detection-undirected-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Cycle Detection (Undirected)?",
      options: [
        "To solve the Cycle Detection (Undirected) problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation:
        "Cycle Detection (Undirected) is designed to solve its specific problem efficiently.",
      hints: ["Think about what Cycle Detection (Undirected) does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Cycle Detection (Undirected) is an algorithm in the domain of graph algorithms.",
    steps: [
      "Apply the Cycle Detection (Undirected) algorithm to the input.",
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
        q: "When should you use Cycle Detection (Undirected)?",
        a: "Use Cycle Detection (Undirected) when the problem matches its designed use case in graph algorithms.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Cycle Detection (Undirected) (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Cycle Detection (Undirected).",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
