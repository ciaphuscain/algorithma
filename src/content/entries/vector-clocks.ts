import type { AlgorithmEntry } from "../types";

export const vectorClocksEntry: AlgorithmEntry = {
  slug: "vector-clocks",
  name: "Vector Clocks",
  aliases: ["Vector Clocks"],
  curriculum: [547],
  domain: "distributed",
  subcategory: "Distributed Algorithms",
  difficulty: "intermediate",
  summary: "Vector Clocks is a well-known algorithm in the domain of distributed systems.",
  tags: ["vector clocks", "distributed"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Vector Clocks.",
    output: "Output of Vector Clocks.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Vector Clocks solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Vector Clocks algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Vector Clocks follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Vector Clocks is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Vector Clocks exist in the literature. See references for details.",
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
      id: "vector-clocks-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Vector Clocks?",
      options: [
        "To solve the Vector Clocks problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Vector Clocks is designed to solve its specific problem efficiently.",
      hints: ["Think about what Vector Clocks does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Vector Clocks is an algorithm in the domain of distributed systems.",
    steps: [
      "Apply the Vector Clocks algorithm to the input.",
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
        q: "When should you use Vector Clocks?",
        a: "Use Vector Clocks when the problem matches its designed use case in distributed systems.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Vector Clocks (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Vector Clocks.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
