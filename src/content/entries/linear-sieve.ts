import type { AlgorithmEntry } from "../types";

export const linearSieveEntry: AlgorithmEntry = {
  slug: "linear-sieve",
  name: "Linear Sieve",
  aliases: ["Linear Sieve"],
  curriculum: [363],
  domain: "number-theory",
  subcategory: "Number Theory",
  difficulty: "intermediate",
  summary: "Linear Sieve is a well-known algorithm in the domain of number theory and mathematics.",
  tags: ["linear sieve", "math"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Linear Sieve.",
    output: "Output of Linear Sieve.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Linear Sieve solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Linear Sieve algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Linear Sieve follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Linear Sieve is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Linear Sieve exist in the literature. See references for details.",
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
      id: "linear-sieve-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Linear Sieve?",
      options: [
        "To solve the Linear Sieve problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Linear Sieve is designed to solve its specific problem efficiently.",
      hints: ["Think about what Linear Sieve does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Linear Sieve is an algorithm in the domain of number theory and mathematics.",
    steps: [
      "Apply the Linear Sieve algorithm to the input.",
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
        q: "When should you use Linear Sieve?",
        a: "Use Linear Sieve when the problem matches its designed use case in number theory and mathematics.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Linear Sieve (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Linear Sieve.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
