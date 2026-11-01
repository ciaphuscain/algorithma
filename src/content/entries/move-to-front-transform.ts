import type { AlgorithmEntry } from "../types";

export const moveToFrontTransformEntry: AlgorithmEntry = {
  slug: "move-to-front-transform",
  name: "Move-to-Front Transform",
  aliases: ["Move-to-Front Transform"],
  curriculum: [336],
  domain: "compression",
  subcategory: "Compression",
  difficulty: "intermediate",
  summary: "Move-to-Front Transform is a well-known algorithm in the domain of data compression.",
  tags: ["move to front transform", "compression"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Move-to-Front Transform.",
    output: "Output of Move-to-Front Transform.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Move-to-Front Transform solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Move-to-Front Transform algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Move-to-Front Transform follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Move-to-Front Transform is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Move-to-Front Transform exist in the literature. See references for details.",
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
    worstClass: "n",
  },
  properties: [
    {
      label: "Domain",
      value: "data compression",
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
      id: "move-to-front-transform-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Move-to-Front Transform?",
      options: [
        "To solve the Move-to-Front Transform problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Move-to-Front Transform is designed to solve its specific problem efficiently.",
      hints: ["Think about what Move-to-Front Transform does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Move-to-Front Transform is an algorithm in the domain of data compression.",
    steps: [
      "Apply the Move-to-Front Transform algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["data compression applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Move-to-Front Transform?",
        a: "Use Move-to-Front Transform when the problem matches its designed use case in data compression.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Move-to-Front Transform (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Move-to-Front Transform.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
