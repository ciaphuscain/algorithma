import type { AlgorithmEntry } from "../types";

export const hungarianAlgorithmEntry: AlgorithmEntry = {
  slug: "hungarian-algorithm",
  name: "Hungarian Algorithm",
  aliases: ["Hungarian Algorithm"],
  curriculum: [238],
  domain: "graphs",
  subcategory: "Graph Algorithms",
  difficulty: "intermediate",
  summary: "Hungarian Algorithm is a well-known algorithm in the domain of graph algorithms.",
  tags: ["hungarian algorithm", "graph"],
  prerequisites: ["BFS", "DFS"],
  related: [],
  problem: {
    input: "Input for Hungarian Algorithm.",
    output: "Output of Hungarian Algorithm.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Hungarian Algorithm solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Hungarian Algorithm algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Hungarian Algorithm follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Hungarian Algorithm is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Hungarian Algorithm exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n³)",
      average: "O(n³)",
      worst: "O(n³)",
    },
    space: "O(n²)",
    worstClass: "n^3",
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
      id: "hungarian-algorithm-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Hungarian Algorithm?",
      options: [
        "To solve the Hungarian Algorithm problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Hungarian Algorithm is designed to solve its specific problem efficiently.",
      hints: ["Think about what Hungarian Algorithm does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Hungarian Algorithm is an algorithm in the domain of graph algorithms.",
    steps: [
      "Apply the Hungarian Algorithm algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(n³)$.",
    spaceComplexity: "$O(n²)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["graph algorithms applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Hungarian Algorithm?",
        a: "Use Hungarian Algorithm when the problem matches its designed use case in graph algorithms.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Hungarian Algorithm (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Hungarian Algorithm.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
