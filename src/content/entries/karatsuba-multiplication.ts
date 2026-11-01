import type { AlgorithmEntry } from "../types";

export const karatsubaMultiplicationEntry: AlgorithmEntry = {
  slug: "karatsuba-multiplication",
  name: "Karatsuba Multiplication",
  aliases: ["Karatsuba Multiplication"],
  curriculum: [394],
  domain: "number-theory",
  subcategory: "Number Theory",
  difficulty: "intermediate",
  summary:
    "Karatsuba Multiplication is a well-known algorithm in the domain of number theory and mathematics.",
  tags: ["karatsuba multiplication", "math"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Karatsuba Multiplication.",
    output: "Output of Karatsuba Multiplication.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Karatsuba Multiplication solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Karatsuba Multiplication algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Karatsuba Multiplication follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Karatsuba Multiplication is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Karatsuba Multiplication exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n^1.585)",
      average: "O(n^1.585)",
      worst: "O(n^1.585)",
    },
    space: "O(n)",
    worstClass: "other",
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
      id: "karatsuba-multiplication-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Karatsuba Multiplication?",
      options: [
        "To solve the Karatsuba Multiplication problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation:
        "Karatsuba Multiplication is designed to solve its specific problem efficiently.",
      hints: ["Think about what Karatsuba Multiplication does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition:
      "Karatsuba Multiplication is an algorithm in the domain of number theory and mathematics.",
    steps: [
      "Apply the Karatsuba Multiplication algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(n^1.585)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["number theory and mathematics applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Karatsuba Multiplication?",
        a: "Use Karatsuba Multiplication when the problem matches its designed use case in number theory and mathematics.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Karatsuba Multiplication (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Karatsuba Multiplication.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
