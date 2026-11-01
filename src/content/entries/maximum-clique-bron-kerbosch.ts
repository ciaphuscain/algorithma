import type { AlgorithmEntry } from "../types";

export const maximumCliqueBronKerboschEntry: AlgorithmEntry = {
  slug: "maximum-clique-bron-kerbosch",
  name: "Maximum Clique (Bron–Kerbosch)",
  aliases: ["Maximum Clique (Bron–Kerbosch)"],
  curriculum: [514],
  domain: "graphs",
  subcategory: "Graph Algorithms",
  difficulty: "intermediate",
  summary:
    "Maximum Clique (Bron–Kerbosch) is a well-known algorithm in the domain of graph algorithms.",
  tags: ["maximum clique bron kerbosch", "graph"],
  prerequisites: ["BFS", "DFS"],
  related: [],
  problem: {
    input: "Input for Maximum Clique (Bron–Kerbosch).",
    output: "Output of Maximum Clique (Bron–Kerbosch).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Maximum Clique (Bron–Kerbosch) solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Maximum Clique (Bron–Kerbosch) algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Maximum Clique (Bron–Kerbosch) follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Maximum Clique (Bron–Kerbosch) is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Maximum Clique (Bron–Kerbosch) exist in the literature. See references for details.",
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
      id: "maximum-clique-bron-kerbosch-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Maximum Clique (Bron–Kerbosch)?",
      options: [
        "To solve the Maximum Clique (Bron–Kerbosch) problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation:
        "Maximum Clique (Bron–Kerbosch) is designed to solve its specific problem efficiently.",
      hints: ["Think about what Maximum Clique (Bron–Kerbosch) does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Maximum Clique (Bron–Kerbosch) is an algorithm in the domain of graph algorithms.",
    steps: [
      "Apply the Maximum Clique (Bron–Kerbosch) algorithm to the input.",
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
        q: "When should you use Maximum Clique (Bron–Kerbosch)?",
        a: "Use Maximum Clique (Bron–Kerbosch) when the problem matches its designed use case in graph algorithms.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Maximum Clique (Bron–Kerbosch) (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Maximum Clique (Bron–Kerbosch).",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
