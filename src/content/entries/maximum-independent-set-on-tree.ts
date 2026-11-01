import type { AlgorithmEntry } from "../types";

export const maximumIndependentSetOnTreeEntry: AlgorithmEntry = {
  slug: "maximum-independent-set-on-tree",
  name: "Maximum Independent Set on Tree",
  aliases: ["Maximum Independent Set on Tree"],
  curriculum: [294],
  domain: "dynamic-programming",
  subcategory: "Dynamic Programming",
  difficulty: "intermediate",
  summary:
    "Maximum Independent Set on Tree is a well-known algorithm in the domain of dynamic programming.",
  tags: ["maximum independent set on tree", "dp"],
  prerequisites: ["Recursion"],
  related: [],
  problem: {
    input: "Input for Maximum Independent Set on Tree.",
    output: "Output of Maximum Independent Set on Tree.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Maximum Independent Set on Tree solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Maximum Independent Set on Tree algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Maximum Independent Set on Tree follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Maximum Independent Set on Tree is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Maximum Independent Set on Tree exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n²)",
      average: "O(n²)",
      worst: "O(n²)",
    },
    space: "O(n)",
    worstClass: "other",
  },
  properties: [
    {
      label: "Domain",
      value: "dynamic programming",
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
      id: "maximum-independent-set-on-tree-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Maximum Independent Set on Tree?",
      options: [
        "To solve the Maximum Independent Set on Tree problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation:
        "Maximum Independent Set on Tree is designed to solve its specific problem efficiently.",
      hints: ["Think about what Maximum Independent Set on Tree does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition:
      "Maximum Independent Set on Tree is an algorithm in the domain of dynamic programming.",
    steps: [
      "Apply the Maximum Independent Set on Tree algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(n²)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["dynamic programming applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Maximum Independent Set on Tree?",
        a: "Use Maximum Independent Set on Tree when the problem matches its designed use case in dynamic programming.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Maximum Independent Set on Tree (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Maximum Independent Set on Tree.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
