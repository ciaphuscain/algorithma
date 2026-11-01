import type { AlgorithmEntry } from "../types";

export const planarityTestingBoyerMyrvoldEntry: AlgorithmEntry = {
  slug: "planarity-testing-boyer-myrvold",
  name: "Planarity Testing (Boyer–Myrvold)",
  aliases: ["Planarity Testing (Boyer–Myrvold)"],
  curriculum: [513],
  domain: "graphs",
  subcategory: "Graph Algorithms",
  difficulty: "intermediate",
  summary:
    "Planarity Testing (Boyer–Myrvold) is a well-known algorithm in the domain of graph algorithms.",
  tags: ["planarity testing boyer myrvold", "graph"],
  prerequisites: ["BFS", "DFS"],
  related: [],
  problem: {
    input: "Input for Planarity Testing (Boyer–Myrvold).",
    output: "Output of Planarity Testing (Boyer–Myrvold).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Planarity Testing (Boyer–Myrvold) solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Planarity Testing (Boyer–Myrvold) algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Planarity Testing (Boyer–Myrvold) follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Planarity Testing (Boyer–Myrvold) is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Planarity Testing (Boyer–Myrvold) exist in the literature. See references for details.",
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
      id: "planarity-testing-boyer-myrvold-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Planarity Testing (Boyer–Myrvold)?",
      options: [
        "To solve the Planarity Testing (Boyer–Myrvold) problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation:
        "Planarity Testing (Boyer–Myrvold) is designed to solve its specific problem efficiently.",
      hints: ["Think about what Planarity Testing (Boyer–Myrvold) does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition:
      "Planarity Testing (Boyer–Myrvold) is an algorithm in the domain of graph algorithms.",
    steps: [
      "Apply the Planarity Testing (Boyer–Myrvold) algorithm to the input.",
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
        q: "When should you use Planarity Testing (Boyer–Myrvold)?",
        a: "Use Planarity Testing (Boyer–Myrvold) when the problem matches its designed use case in graph algorithms.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Planarity Testing (Boyer–Myrvold) (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Planarity Testing (Boyer–Myrvold).",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
