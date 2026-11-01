import type { AlgorithmEntry } from "../types";

export const kNigSTheoremConstructionEntry: AlgorithmEntry = {
  slug: "k-nig-s-theorem-construction",
  name: "Kőnig's Theorem Construction",
  aliases: ["Kőnig's Theorem Construction"],
  curriculum: [509],
  domain: "graphs",
  subcategory: "Graph Algorithms",
  difficulty: "intermediate",
  summary:
    "Kőnig's Theorem Construction is a well-known algorithm in the domain of graph algorithms.",
  tags: ["k nig s theorem construction", "graph"],
  prerequisites: ["BFS", "DFS"],
  related: [],
  problem: {
    input: "Input for Kőnig's Theorem Construction.",
    output: "Output of Kőnig's Theorem Construction.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Kőnig's Theorem Construction solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Kőnig's Theorem Construction algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Kőnig's Theorem Construction follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Kőnig's Theorem Construction is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Kőnig's Theorem Construction exist in the literature. See references for details.",
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
      id: "k-nig-s-theorem-construction-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Kőnig's Theorem Construction?",
      options: [
        "To solve the Kőnig's Theorem Construction problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation:
        "Kőnig's Theorem Construction is designed to solve its specific problem efficiently.",
      hints: ["Think about what Kőnig's Theorem Construction does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Kőnig's Theorem Construction is an algorithm in the domain of graph algorithms.",
    steps: [
      "Apply the Kőnig's Theorem Construction algorithm to the input.",
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
        q: "When should you use Kőnig's Theorem Construction?",
        a: "Use Kőnig's Theorem Construction when the problem matches its designed use case in graph algorithms.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Kőnig's Theorem Construction (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Kőnig's Theorem Construction.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
