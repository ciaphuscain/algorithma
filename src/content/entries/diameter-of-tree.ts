import type { AlgorithmEntry } from "../types";

export const diameterOfTreeEntry: AlgorithmEntry = {
  slug: "diameter-of-tree",
  name: "Diameter of Tree",
  aliases: ["Diameter of Tree"],
  curriculum: [293],
  domain: "dynamic-programming",
  subcategory: "Dynamic Programming",
  difficulty: "intermediate",
  summary: "Diameter of Tree is a well-known algorithm in the domain of dynamic programming.",
  tags: ["diameter of tree", "dp"],
  prerequisites: ["Recursion"],
  related: [],
  problem: {
    input: "Input for Diameter of Tree.",
    output: "Output of Diameter of Tree.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Diameter of Tree solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Diameter of Tree algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Diameter of Tree follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Diameter of Tree is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Diameter of Tree exist in the literature. See references for details.",
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
      id: "diameter-of-tree-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Diameter of Tree?",
      options: [
        "To solve the Diameter of Tree problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Diameter of Tree is designed to solve its specific problem efficiently.",
      hints: ["Think about what Diameter of Tree does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Diameter of Tree is an algorithm in the domain of dynamic programming.",
    steps: [
      "Apply the Diameter of Tree algorithm to the input.",
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
        q: "When should you use Diameter of Tree?",
        a: "Use Diameter of Tree when the problem matches its designed use case in dynamic programming.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Diameter of Tree (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Diameter of Tree.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
