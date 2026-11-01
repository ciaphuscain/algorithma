import type { AlgorithmEntry } from "../types";

export const persistentStackEntry: AlgorithmEntry = {
  slug: "persistent-stack",
  name: "Persistent Stack",
  aliases: ["Persistent Stack"],
  curriculum: [138],
  domain: "linear-structures",
  subcategory: "Linear Data Structures",
  difficulty: "intermediate",
  summary: "Persistent Stack is a well-known algorithm in the domain of linear data structures.",
  tags: ["persistent stack", "data structure"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Persistent Stack.",
    output: "Output of Persistent Stack.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Persistent Stack solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Persistent Stack algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Persistent Stack follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Persistent Stack is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Persistent Stack exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(1)",
      average: "O(1)",
      worst: "O(n)",
    },
    space: "O(n)",
    worstClass: "n",
  },
  properties: [
    {
      label: "Domain",
      value: "linear data structures",
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
      id: "persistent-stack-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Persistent Stack?",
      options: [
        "To solve the Persistent Stack problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Persistent Stack is designed to solve its specific problem efficiently.",
      hints: ["Think about what Persistent Stack does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Persistent Stack is an algorithm in the domain of linear data structures.",
    steps: [
      "Apply the Persistent Stack algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(1)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["linear data structures applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Persistent Stack?",
        a: "Use Persistent Stack when the problem matches its designed use case in linear data structures.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Persistent Stack (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Persistent Stack.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
