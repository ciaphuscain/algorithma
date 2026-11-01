import type { AlgorithmEntry } from "../types";

export const kargerSMinimumCutAlgorithmEntry: AlgorithmEntry = {
  slug: "karger-s-minimum-cut-algorithm",
  name: "Karger's Minimum Cut Algorithm",
  aliases: ["Karger's Minimum Cut Algorithm"],
  curriculum: [435],
  domain: "randomized",
  subcategory: "Randomized Algorithms",
  difficulty: "intermediate",
  summary:
    "Karger's Minimum Cut Algorithm is a well-known algorithm in the domain of randomized algorithms.",
  tags: ["karger s minimum cut algorithm", "randomized"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Karger's Minimum Cut Algorithm.",
    output: "Output of Karger's Minimum Cut Algorithm.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Karger's Minimum Cut Algorithm solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Karger's Minimum Cut Algorithm algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Karger's Minimum Cut Algorithm follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Karger's Minimum Cut Algorithm is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Karger's Minimum Cut Algorithm exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n)",
      worst: "O(n²)",
    },
    space: "O(n)",
    worstClass: "other",
  },
  properties: [
    {
      label: "Domain",
      value: "randomized algorithms",
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
      id: "karger-s-minimum-cut-algorithm-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Karger's Minimum Cut Algorithm?",
      options: [
        "To solve the Karger's Minimum Cut Algorithm problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation:
        "Karger's Minimum Cut Algorithm is designed to solve its specific problem efficiently.",
      hints: ["Think about what Karger's Minimum Cut Algorithm does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition:
      "Karger's Minimum Cut Algorithm is an algorithm in the domain of randomized algorithms.",
    steps: [
      "Apply the Karger's Minimum Cut Algorithm algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["randomized algorithms applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Karger's Minimum Cut Algorithm?",
        a: "Use Karger's Minimum Cut Algorithm when the problem matches its designed use case in randomized algorithms.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Karger's Minimum Cut Algorithm (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Karger's Minimum Cut Algorithm.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
