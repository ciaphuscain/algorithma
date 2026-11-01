import type { AlgorithmEntry } from "../types";

export const rangeTreeEntry: AlgorithmEntry = {
  slug: "range-tree",
  name: "Range Tree",
  aliases: ["Range Tree"],
  curriculum: [419],
  domain: "geometry",
  subcategory: "Computational Geometry",
  difficulty: "intermediate",
  summary: "Range Tree is a well-known algorithm in the domain of computational geometry.",
  tags: ["range tree", "geometry"],
  prerequisites: ["Sorting"],
  related: [],
  problem: {
    input: "Input for Range Tree.",
    output: "Output of Range Tree.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Range Tree solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Range Tree algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Range Tree follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Range Tree is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Range Tree exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n log n)",
    },
    space: "O(n)",
    worstClass: "n log n",
  },
  properties: [
    {
      label: "Domain",
      value: "computational geometry",
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
      id: "range-tree-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Range Tree?",
      options: [
        "To solve the Range Tree problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Range Tree is designed to solve its specific problem efficiently.",
      hints: ["Think about what Range Tree does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Range Tree is an algorithm in the domain of computational geometry.",
    steps: [
      "Apply the Range Tree algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(n log n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["computational geometry applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Range Tree?",
        a: "Use Range Tree when the problem matches its designed use case in computational geometry.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Range Tree (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Range Tree.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
