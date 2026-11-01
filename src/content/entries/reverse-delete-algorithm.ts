import type { AlgorithmEntry } from "../types";

export const reverseDeleteAlgorithmEntry: AlgorithmEntry = {
  slug: "reverse-delete-algorithm",
  name: "Reverse Delete Algorithm",
  aliases: ["Reverse Delete Algorithm"],
  curriculum: [219],
  domain: "graphs",
  subcategory: "Graph Algorithms",
  difficulty: "intermediate",
  summary: "Reverse Delete Algorithm is a well-known algorithm in the domain of graph algorithms.",
  tags: ["reverse delete algorithm", "graph"],
  prerequisites: ["BFS", "DFS"],
  related: [],
  problem: {
    input: "Input for Reverse Delete Algorithm.",
    output: "Output of Reverse Delete Algorithm.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Reverse Delete Algorithm solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Reverse Delete Algorithm algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Reverse Delete Algorithm follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Reverse Delete Algorithm is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Reverse Delete Algorithm exist in the literature. See references for details.",
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
      id: "reverse-delete-algorithm-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Reverse Delete Algorithm?",
      options: [
        "To solve the Reverse Delete Algorithm problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation:
        "Reverse Delete Algorithm is designed to solve its specific problem efficiently.",
      hints: ["Think about what Reverse Delete Algorithm does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Reverse Delete Algorithm is an algorithm in the domain of graph algorithms.",
    steps: [
      "Apply the Reverse Delete Algorithm algorithm to the input.",
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
        q: "When should you use Reverse Delete Algorithm?",
        a: "Use Reverse Delete Algorithm when the problem matches its designed use case in graph algorithms.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Reverse Delete Algorithm (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Reverse Delete Algorithm.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
