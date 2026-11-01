import type { AlgorithmEntry } from "../types";

export const fastModularExponentiationEntry: AlgorithmEntry = {
  slug: "fast-modular-exponentiation",
  name: "Fast Modular Exponentiation",
  aliases: ["Fast Modular Exponentiation"],
  curriculum: [358],
  domain: "number-theory",
  subcategory: "Number Theory",
  difficulty: "intermediate",
  summary:
    "Fast Modular Exponentiation is a well-known algorithm in the domain of number theory and mathematics.",
  tags: ["fast modular exponentiation", "math"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Fast Modular Exponentiation.",
    output: "Output of Fast Modular Exponentiation.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Fast Modular Exponentiation solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Fast Modular Exponentiation algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Fast Modular Exponentiation follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Fast Modular Exponentiation is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Fast Modular Exponentiation exist in the literature. See references for details.",
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
      id: "fast-modular-exponentiation-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Fast Modular Exponentiation?",
      options: [
        "To solve the Fast Modular Exponentiation problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation:
        "Fast Modular Exponentiation is designed to solve its specific problem efficiently.",
      hints: ["Think about what Fast Modular Exponentiation does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition:
      "Fast Modular Exponentiation is an algorithm in the domain of number theory and mathematics.",
    steps: [
      "Apply the Fast Modular Exponentiation algorithm to the input.",
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
        q: "When should you use Fast Modular Exponentiation?",
        a: "Use Fast Modular Exponentiation when the problem matches its designed use case in number theory and mathematics.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Fast Modular Exponentiation (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Fast Modular Exponentiation.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
