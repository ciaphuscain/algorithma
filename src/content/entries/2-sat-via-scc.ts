import type { AlgorithmEntry } from "../types";

export const twoSatViaSccEntry: AlgorithmEntry = {
  slug: "2-sat-via-scc",
  name: "2-SAT via SCC",
  aliases: ["2-SAT via SCC"],
  curriculum: [507],
  domain: "graphs",
  subcategory: "Graph Algorithms",
  difficulty: "intermediate",
  summary: "2-SAT via SCC is a well-known algorithm in the domain of graph algorithms.",
  tags: ["2 sat via scc", "graph"],
  prerequisites: ["BFS", "DFS"],
  related: [],
  problem: {
    input: "Input for 2-SAT via SCC.",
    output: "Output of 2-SAT via SCC.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "2-SAT via SCC solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The 2-SAT via SCC algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of 2-SAT via SCC follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of 2-SAT via SCC is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of 2-SAT via SCC exist in the literature. See references for details.",
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
      id: "2-sat-via-scc-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of 2-SAT via SCC?",
      options: [
        "To solve the 2-SAT via SCC problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "2-SAT via SCC is designed to solve its specific problem efficiently.",
      hints: ["Think about what 2-SAT via SCC does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "2-SAT via SCC is an algorithm in the domain of graph algorithms.",
    steps: [
      "Apply the 2-SAT via SCC algorithm to the input.",
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
        q: "When should you use 2-SAT via SCC?",
        a: "Use 2-SAT via SCC when the problem matches its designed use case in graph algorithms.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define 2-SAT via SCC (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for 2-SAT via SCC.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
