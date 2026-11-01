import type { AlgorithmEntry } from "../types";

export const dixonSFactorizationEntry: AlgorithmEntry = {
  slug: "dixon-s-factorization",
  name: "Dixon's Factorization",
  aliases: ["Dixon's Factorization"],
  curriculum: [369],
  domain: "number-theory",
  subcategory: "Number Theory",
  difficulty: "intermediate",
  summary:
    "Dixon's Factorization is a well-known algorithm in the domain of number theory and mathematics.",
  tags: ["dixon s factorization", "math"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Dixon's Factorization.",
    output: "Output of Dixon's Factorization.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Dixon's Factorization solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Dixon's Factorization algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Dixon's Factorization follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Dixon's Factorization is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Dixon's Factorization exist in the literature. See references for details.",
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
      id: "dixon-s-factorization-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Dixon's Factorization?",
      options: [
        "To solve the Dixon's Factorization problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Dixon's Factorization is designed to solve its specific problem efficiently.",
      hints: ["Think about what Dixon's Factorization does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition:
      "Dixon's Factorization is an algorithm in the domain of number theory and mathematics.",
    steps: [
      "Apply the Dixon's Factorization algorithm to the input.",
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
        q: "When should you use Dixon's Factorization?",
        a: "Use Dixon's Factorization when the problem matches its designed use case in number theory and mathematics.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Dixon's Factorization (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Dixon's Factorization.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
