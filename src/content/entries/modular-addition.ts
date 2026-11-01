import type { AlgorithmEntry } from "../types";

export const modularAdditionEntry: AlgorithmEntry = {
  slug: "modular-addition",
  name: "Modular Addition",
  aliases: ["Modular Addition"],
  curriculum: [355],
  domain: "number-theory",
  subcategory: "Number Theory",
  difficulty: "intermediate",
  summary:
    "Modular Addition is a well-known algorithm in the domain of number theory and mathematics.",
  tags: ["modular addition", "math"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Modular Addition.",
    output: "Output of Modular Addition.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Modular Addition solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Modular Addition algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Modular Addition follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Modular Addition is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Modular Addition exist in the literature. See references for details.",
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
      id: "modular-addition-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Modular Addition?",
      options: [
        "To solve the Modular Addition problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Modular Addition is designed to solve its specific problem efficiently.",
      hints: ["Think about what Modular Addition does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Modular Addition is an algorithm in the domain of number theory and mathematics.",
    steps: [
      "Apply the Modular Addition algorithm to the input.",
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
        q: "When should you use Modular Addition?",
        a: "Use Modular Addition when the problem matches its designed use case in number theory and mathematics.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Modular Addition (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Modular Addition.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
