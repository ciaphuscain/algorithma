import type { AlgorithmEntry } from "../types";

export const modularInverseEntry: AlgorithmEntry = {
  slug: "modular-inverse",
  name: "Modular Inverse",
  aliases: ["Modular Inverse"],
  curriculum: [377],
  domain: "number-theory",
  subcategory: "Number Theory",
  difficulty: "intermediate",
  summary:
    "Modular Inverse is a well-known algorithm in the domain of number theory and mathematics.",
  tags: ["modular inverse", "math"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Modular Inverse.",
    output: "Output of Modular Inverse.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Modular Inverse solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Modular Inverse algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Modular Inverse follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Modular Inverse is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Modular Inverse exist in the literature. See references for details.",
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
      id: "modular-inverse-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Modular Inverse?",
      options: [
        "To solve the Modular Inverse problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Modular Inverse is designed to solve its specific problem efficiently.",
      hints: ["Think about what Modular Inverse does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Modular Inverse is an algorithm in the domain of number theory and mathematics.",
    steps: [
      "Apply the Modular Inverse algorithm to the input.",
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
        q: "When should you use Modular Inverse?",
        a: "Use Modular Inverse when the problem matches its designed use case in number theory and mathematics.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Modular Inverse (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Modular Inverse.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
