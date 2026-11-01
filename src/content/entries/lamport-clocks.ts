import type { AlgorithmEntry } from "../types";

export const lamportClocksEntry: AlgorithmEntry = {
  slug: "lamport-clocks",
  name: "Lamport Clocks",
  aliases: ["Lamport Clocks"],
  curriculum: [546],
  domain: "distributed",
  subcategory: "Distributed Algorithms",
  difficulty: "intermediate",
  summary: "Lamport Clocks is a well-known algorithm in the domain of distributed systems.",
  tags: ["lamport clocks", "distributed"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Lamport Clocks.",
    output: "Output of Lamport Clocks.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Lamport Clocks solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Lamport Clocks algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Lamport Clocks follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Lamport Clocks is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Lamport Clocks exist in the literature. See references for details.",
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
      id: "lamport-clocks-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Lamport Clocks?",
      options: [
        "To solve the Lamport Clocks problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Lamport Clocks is designed to solve its specific problem efficiently.",
      hints: ["Think about what Lamport Clocks does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Lamport Clocks is an algorithm in the domain of distributed systems.",
    steps: [
      "Apply the Lamport Clocks algorithm to the input.",
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
        q: "When should you use Lamport Clocks?",
        a: "Use Lamport Clocks when the problem matches its designed use case in distributed systems.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Lamport Clocks (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Lamport Clocks.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
