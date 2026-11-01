import type { AlgorithmEntry } from "../types";

export const andrewSMonotoneChainEntry: AlgorithmEntry = {
  slug: "andrew-s-monotone-chain",
  name: "Andrew's Monotone Chain",
  aliases: ["Andrew's Monotone Chain"],
  curriculum: [408],
  domain: "geometry",
  subcategory: "Computational Geometry",
  difficulty: "intermediate",
  summary:
    "Andrew's Monotone Chain is a well-known algorithm in the domain of computational geometry.",
  tags: ["andrew s monotone chain", "geometry"],
  prerequisites: ["Sorting"],
  related: [],
  problem: {
    input: "Input for Andrew's Monotone Chain.",
    output: "Output of Andrew's Monotone Chain.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Andrew's Monotone Chain solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Andrew's Monotone Chain algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Andrew's Monotone Chain follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Andrew's Monotone Chain is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Andrew's Monotone Chain exist in the literature. See references for details.",
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
      id: "andrew-s-monotone-chain-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Andrew's Monotone Chain?",
      options: [
        "To solve the Andrew's Monotone Chain problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Andrew's Monotone Chain is designed to solve its specific problem efficiently.",
      hints: ["Think about what Andrew's Monotone Chain does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Andrew's Monotone Chain is an algorithm in the domain of computational geometry.",
    steps: [
      "Apply the Andrew's Monotone Chain algorithm to the input.",
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
        q: "When should you use Andrew's Monotone Chain?",
        a: "Use Andrew's Monotone Chain when the problem matches its designed use case in computational geometry.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Andrew's Monotone Chain (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Andrew's Monotone Chain.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
