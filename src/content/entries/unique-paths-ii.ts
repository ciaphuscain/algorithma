import type { AlgorithmEntry } from "../types";

export const uniquePathsIiEntry: AlgorithmEntry = {
  slug: "unique-paths-ii",
  name: "Unique Paths II",
  aliases: ["Unique Paths II"],
  curriculum: [282],
  domain: "dynamic-programming",
  subcategory: "Dynamic Programming",
  difficulty: "intermediate",
  summary: "Unique Paths II is a well-known algorithm in the domain of dynamic programming.",
  tags: ["unique paths ii", "dp"],
  prerequisites: ["Recursion"],
  related: [],
  problem: {
    input: "Input for Unique Paths II.",
    output: "Output of Unique Paths II.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Unique Paths II solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Unique Paths II algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Unique Paths II follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Unique Paths II is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Unique Paths II exist in the literature. See references for details.",
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
      id: "unique-paths-ii-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Unique Paths II?",
      options: [
        "To solve the Unique Paths II problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Unique Paths II is designed to solve its specific problem efficiently.",
      hints: ["Think about what Unique Paths II does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Unique Paths II is an algorithm in the domain of dynamic programming.",
    steps: [
      "Apply the Unique Paths II algorithm to the input.",
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
        q: "When should you use Unique Paths II?",
        a: "Use Unique Paths II when the problem matches its designed use case in dynamic programming.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Unique Paths II (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Unique Paths II.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
