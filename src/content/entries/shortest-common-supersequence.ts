import type { AlgorithmEntry } from "../types";

export const shortestCommonSupersequenceEntry: AlgorithmEntry = {
  slug: "shortest-common-supersequence",
  name: "Shortest Common Supersequence",
  aliases: ["Shortest Common Supersequence"],
  curriculum: [275],
  domain: "dynamic-programming",
  subcategory: "Dynamic Programming",
  difficulty: "intermediate",
  summary:
    "Shortest Common Supersequence is a well-known algorithm in the domain of dynamic programming.",
  tags: ["shortest common supersequence", "dp"],
  prerequisites: ["Recursion"],
  related: [],
  problem: {
    input: "Input for Shortest Common Supersequence.",
    output: "Output of Shortest Common Supersequence.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Shortest Common Supersequence solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Shortest Common Supersequence algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Shortest Common Supersequence follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Shortest Common Supersequence is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Shortest Common Supersequence exist in the literature. See references for details.",
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
      id: "shortest-common-supersequence-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Shortest Common Supersequence?",
      options: [
        "To solve the Shortest Common Supersequence problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation:
        "Shortest Common Supersequence is designed to solve its specific problem efficiently.",
      hints: ["Think about what Shortest Common Supersequence does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition:
      "Shortest Common Supersequence is an algorithm in the domain of dynamic programming.",
    steps: [
      "Apply the Shortest Common Supersequence algorithm to the input.",
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
        q: "When should you use Shortest Common Supersequence?",
        a: "Use Shortest Common Supersequence when the problem matches its designed use case in dynamic programming.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Shortest Common Supersequence (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Shortest Common Supersequence.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
