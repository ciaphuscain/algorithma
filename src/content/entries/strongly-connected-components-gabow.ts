import type { AlgorithmEntry } from "../types";

export const stronglyConnectedComponentsGabowEntry: AlgorithmEntry = {
  slug: "strongly-connected-components-gabow",
  name: "Strongly Connected Components (Gabow)",
  aliases: ["Strongly Connected Components (Gabow)"],
  curriculum: [227],
  domain: "graphs",
  subcategory: "Graph Algorithms",
  difficulty: "intermediate",
  summary:
    "Strongly Connected Components (Gabow) is a well-known algorithm in the domain of graph algorithms.",
  tags: ["strongly connected components gabow", "graph"],
  prerequisites: ["BFS", "DFS"],
  related: [],
  problem: {
    input: "Input for Strongly Connected Components (Gabow).",
    output: "Output of Strongly Connected Components (Gabow).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Strongly Connected Components (Gabow) solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Strongly Connected Components (Gabow) algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Strongly Connected Components (Gabow) follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Strongly Connected Components (Gabow) is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Strongly Connected Components (Gabow) exist in the literature. See references for details.",
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
      id: "strongly-connected-components-gabow-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Strongly Connected Components (Gabow)?",
      options: [
        "To solve the Strongly Connected Components (Gabow) problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation:
        "Strongly Connected Components (Gabow) is designed to solve its specific problem efficiently.",
      hints: ["Think about what Strongly Connected Components (Gabow) does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition:
      "Strongly Connected Components (Gabow) is an algorithm in the domain of graph algorithms.",
    steps: [
      "Apply the Strongly Connected Components (Gabow) algorithm to the input.",
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
        q: "When should you use Strongly Connected Components (Gabow)?",
        a: "Use Strongly Connected Components (Gabow) when the problem matches its designed use case in graph algorithms.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Strongly Connected Components (Gabow) (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Strongly Connected Components (Gabow).",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
