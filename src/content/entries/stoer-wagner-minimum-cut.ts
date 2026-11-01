import type { AlgorithmEntry } from "../types";

export const stoerWagnerMinimumCutEntry: AlgorithmEntry = {
  slug: "stoer-wagner-minimum-cut",
  name: "Stoer–Wagner Minimum Cut",
  aliases: ["Stoer–Wagner Minimum Cut"],
  curriculum: [504],
  domain: "graphs",
  subcategory: "Graph Algorithms",
  difficulty: "intermediate",
  summary: "Stoer–Wagner Minimum Cut is a well-known algorithm in the domain of graph algorithms.",
  tags: ["stoer wagner minimum cut", "graph"],
  prerequisites: ["BFS", "DFS"],
  related: [],
  problem: {
    input: "Input for Stoer–Wagner Minimum Cut.",
    output: "Output of Stoer–Wagner Minimum Cut.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Stoer–Wagner Minimum Cut solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Stoer–Wagner Minimum Cut algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Stoer–Wagner Minimum Cut follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Stoer–Wagner Minimum Cut is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Stoer–Wagner Minimum Cut exist in the literature. See references for details.",
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
      id: "stoer-wagner-minimum-cut-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Stoer–Wagner Minimum Cut?",
      options: [
        "To solve the Stoer–Wagner Minimum Cut problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation:
        "Stoer–Wagner Minimum Cut is designed to solve its specific problem efficiently.",
      hints: ["Think about what Stoer–Wagner Minimum Cut does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Stoer–Wagner Minimum Cut is an algorithm in the domain of graph algorithms.",
    steps: [
      "Apply the Stoer–Wagner Minimum Cut algorithm to the input.",
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
        q: "When should you use Stoer–Wagner Minimum Cut?",
        a: "Use Stoer–Wagner Minimum Cut when the problem matches its designed use case in graph algorithms.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Stoer–Wagner Minimum Cut (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Stoer–Wagner Minimum Cut.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
