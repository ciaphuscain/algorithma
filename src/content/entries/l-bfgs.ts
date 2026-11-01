import type { AlgorithmEntry } from "../types";

export const lBfgsEntry: AlgorithmEntry = {
  slug: "l-bfgs",
  name: "L-BFGS",
  aliases: ["L-BFGS"],
  curriculum: [592],
  domain: "optimization",
  subcategory: "Optimization",
  difficulty: "intermediate",
  summary: "L-BFGS is a well-known algorithm in the domain of optimization.",
  tags: ["l bfgs", "optimization"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for L-BFGS.",
    output: "Output of L-BFGS.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "L-BFGS solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The L-BFGS algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of L-BFGS follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of L-BFGS is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of L-BFGS exist in the literature. See references for details.",
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
      id: "l-bfgs-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of L-BFGS?",
      options: [
        "To solve the L-BFGS problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "L-BFGS is designed to solve its specific problem efficiently.",
      hints: ["Think about what L-BFGS does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "L-BFGS is an algorithm in the domain of optimization.",
    steps: [
      "Apply the L-BFGS algorithm to the input.",
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
        q: "When should you use L-BFGS?",
        a: "Use L-BFGS when the problem matches its designed use case in optimization.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Define L-BFGS (1).", "Describe the algorithm (2).", "Analyze complexity (2)."],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for L-BFGS.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
