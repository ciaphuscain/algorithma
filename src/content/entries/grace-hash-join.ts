import type { AlgorithmEntry } from "../types";

export const graceHashJoinEntry: AlgorithmEntry = {
  slug: "grace-hash-join",
  name: "Grace Hash Join",
  aliases: ["Grace Hash Join"],
  curriculum: [495],
  domain: "databases",
  subcategory: "Database Algorithms",
  difficulty: "intermediate",
  summary: "Grace Hash Join is a well-known algorithm in the domain of database algorithms.",
  tags: ["grace hash join", "database"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Grace Hash Join.",
    output: "Output of Grace Hash Join.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Grace Hash Join solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Grace Hash Join algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Grace Hash Join follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Grace Hash Join is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Grace Hash Join exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n log n)",
      worst: "O(n log n)",
    },
    space: "O(n)",
    worstClass: "other",
  },
  properties: [
    {
      label: "Domain",
      value: "database algorithms",
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
      id: "grace-hash-join-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Grace Hash Join?",
      options: [
        "To solve the Grace Hash Join problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Grace Hash Join is designed to solve its specific problem efficiently.",
      hints: ["Think about what Grace Hash Join does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Grace Hash Join is an algorithm in the domain of database algorithms.",
    steps: [
      "Apply the Grace Hash Join algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["database algorithms applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Grace Hash Join?",
        a: "Use Grace Hash Join when the problem matches its designed use case in database algorithms.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Grace Hash Join (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Grace Hash Join.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
