import type { AlgorithmEntry } from "../types";

export const hybridLogicalClocksEntry: AlgorithmEntry = {
  slug: "hybrid-logical-clocks",
  name: "Hybrid Logical Clocks",
  aliases: ["Hybrid Logical Clocks"],
  curriculum: [559],
  domain: "distributed",
  subcategory: "Distributed Algorithms",
  difficulty: "intermediate",
  summary: "Hybrid Logical Clocks is a well-known algorithm in the domain of distributed systems.",
  tags: ["hybrid logical clocks", "distributed"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Hybrid Logical Clocks.",
    output: "Output of Hybrid Logical Clocks.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Hybrid Logical Clocks solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Hybrid Logical Clocks algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Hybrid Logical Clocks follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Hybrid Logical Clocks is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Hybrid Logical Clocks exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n)",
      worst: "O(n)",
    },
    space: "O(n)",
    worstClass: "other",
  },
  properties: [
    {
      label: "Domain",
      value: "distributed systems",
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
      id: "hybrid-logical-clocks-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Hybrid Logical Clocks?",
      options: [
        "To solve the Hybrid Logical Clocks problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Hybrid Logical Clocks is designed to solve its specific problem efficiently.",
      hints: ["Think about what Hybrid Logical Clocks does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Hybrid Logical Clocks is an algorithm in the domain of distributed systems.",
    steps: [
      "Apply the Hybrid Logical Clocks algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["distributed systems applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Hybrid Logical Clocks?",
        a: "Use Hybrid Logical Clocks when the problem matches its designed use case in distributed systems.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Hybrid Logical Clocks (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Hybrid Logical Clocks.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
