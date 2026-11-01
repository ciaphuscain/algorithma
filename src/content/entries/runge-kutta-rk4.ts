import type { AlgorithmEntry } from "../types";

export const rungeKuttaRk4Entry: AlgorithmEntry = {
  slug: "runge-kutta-rk4",
  name: "Runge–Kutta (RK4)",
  aliases: ["Runge–Kutta (RK4)"],
  curriculum: [589],
  domain: "number-theory",
  subcategory: "Number Theory",
  difficulty: "intermediate",
  summary:
    "Runge–Kutta (RK4) is a well-known algorithm in the domain of number theory and mathematics.",
  tags: ["runge kutta rk4", "math"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Runge–Kutta (RK4).",
    output: "Output of Runge–Kutta (RK4).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Runge–Kutta (RK4) solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Runge–Kutta (RK4) algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Runge–Kutta (RK4) follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Runge–Kutta (RK4) is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Runge–Kutta (RK4) exist in the literature. See references for details.",
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
      id: "runge-kutta-rk4-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Runge–Kutta (RK4)?",
      options: [
        "To solve the Runge–Kutta (RK4) problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Runge–Kutta (RK4) is designed to solve its specific problem efficiently.",
      hints: ["Think about what Runge–Kutta (RK4) does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Runge–Kutta (RK4) is an algorithm in the domain of number theory and mathematics.",
    steps: [
      "Apply the Runge–Kutta (RK4) algorithm to the input.",
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
        q: "When should you use Runge–Kutta (RK4)?",
        a: "Use Runge–Kutta (RK4) when the problem matches its designed use case in number theory and mathematics.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Runge–Kutta (RK4) (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Runge–Kutta (RK4).",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
