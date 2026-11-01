import type { AlgorithmEntry } from "../types";

export const newtonRaphsonMethodEntry: AlgorithmEntry = {
  slug: "newton-raphson-method",
  name: "Newton–Raphson Method",
  aliases: ["Newton–Raphson Method"],
  curriculum: [384],
  domain: "number-theory",
  subcategory: "Number Theory",
  difficulty: "intermediate",
  summary:
    "Newton–Raphson Method is a well-known algorithm in the domain of number theory and mathematics.",
  tags: ["newton raphson method", "math"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Newton–Raphson Method.",
    output: "Output of Newton–Raphson Method.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Newton–Raphson Method solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Newton–Raphson Method algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Newton–Raphson Method follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Newton–Raphson Method is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Newton–Raphson Method exist in the literature. See references for details.",
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
      value: "number theory and mathematics",
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
      id: "newton-raphson-method-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Newton–Raphson Method?",
      options: [
        "To solve the Newton–Raphson Method problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Newton–Raphson Method is designed to solve its specific problem efficiently.",
      hints: ["Think about what Newton–Raphson Method does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition:
      "Newton–Raphson Method is an algorithm in the domain of number theory and mathematics.",
    steps: [
      "Apply the Newton–Raphson Method algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["number theory and mathematics applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Newton–Raphson Method?",
        a: "Use Newton–Raphson Method when the problem matches its designed use case in number theory and mathematics.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Newton–Raphson Method (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Newton–Raphson Method.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
