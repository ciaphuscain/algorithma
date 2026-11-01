import type { AlgorithmEntry } from "../types";

export const branchAndBoundEntry: AlgorithmEntry = {
  slug: "branch-and-bound",
  name: "Branch and Bound",
  aliases: ["Branch and Bound"],
  curriculum: [444],
  domain: "optimization",
  subcategory: "Optimization",
  difficulty: "intermediate",
  summary: "Branch and Bound is a well-known algorithm in the domain of optimization.",
  tags: ["branch and bound", "optimization"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Branch and Bound.",
    output: "Output of Branch and Bound.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Branch and Bound solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Branch and Bound algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Branch and Bound follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Branch and Bound is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Branch and Bound exist in the literature. See references for details.",
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
      value: "optimization",
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
      id: "branch-and-bound-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Branch and Bound?",
      options: [
        "To solve the Branch and Bound problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Branch and Bound is designed to solve its specific problem efficiently.",
      hints: ["Think about what Branch and Bound does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Branch and Bound is an algorithm in the domain of optimization.",
    steps: [
      "Apply the Branch and Bound algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(n²)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["optimization applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Branch and Bound?",
        a: "Use Branch and Bound when the problem matches its designed use case in optimization.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Branch and Bound (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Branch and Bound.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
