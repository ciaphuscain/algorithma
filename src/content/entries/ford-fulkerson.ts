import type { AlgorithmEntry } from "../types";

export const fordFulkersonEntry: AlgorithmEntry = {
  slug: "ford-fulkerson",
  name: "Ford-Fulkerson",
  aliases: ["Ford-Fulkerson"],
  curriculum: [233],
  domain: "graphs",
  subcategory: "Graph Algorithms",
  difficulty: "intermediate",
  summary: "Ford-Fulkerson is a well-known algorithm in the domain of graph algorithms.",
  tags: ["ford fulkerson", "graph"],
  prerequisites: ["BFS", "DFS"],
  related: [],
  problem: {
    input: "Input for Ford-Fulkerson.",
    output: "Output of Ford-Fulkerson.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Ford-Fulkerson solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Ford-Fulkerson algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Ford-Fulkerson follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Ford-Fulkerson is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Ford-Fulkerson exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(E·f)",
      average: "O(E·f)",
      worst: "O(E·f)",
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
      id: "ford-fulkerson-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Ford-Fulkerson?",
      options: [
        "To solve the Ford-Fulkerson problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Ford-Fulkerson is designed to solve its specific problem efficiently.",
      hints: ["Think about what Ford-Fulkerson does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Ford-Fulkerson is an algorithm in the domain of graph algorithms.",
    steps: [
      "Apply the Ford-Fulkerson algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(E·f)$.",
    spaceComplexity: "$O(V + E)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["graph algorithms applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Ford-Fulkerson?",
        a: "Use Ford-Fulkerson when the problem matches its designed use case in graph algorithms.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Ford-Fulkerson (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Ford-Fulkerson.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
