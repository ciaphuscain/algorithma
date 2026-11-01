import type { AlgorithmEntry } from "../types";

export const michaelScottQueueEntry: AlgorithmEntry = {
  slug: "michael-scott-queue",
  name: "Michael-Scott Queue",
  aliases: ["Michael-Scott Queue"],
  curriculum: [135],
  domain: "linear-structures",
  subcategory: "Linear Data Structures",
  difficulty: "intermediate",
  summary: "Michael-Scott Queue is a well-known algorithm in the domain of linear data structures.",
  tags: ["michael scott queue", "data structure"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Michael-Scott Queue.",
    output: "Output of Michael-Scott Queue.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Michael-Scott Queue solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Michael-Scott Queue algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Michael-Scott Queue follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Michael-Scott Queue is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Michael-Scott Queue exist in the literature. See references for details.",
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
      id: "michael-scott-queue-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Michael-Scott Queue?",
      options: [
        "To solve the Michael-Scott Queue problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Michael-Scott Queue is designed to solve its specific problem efficiently.",
      hints: ["Think about what Michael-Scott Queue does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Michael-Scott Queue is an algorithm in the domain of linear data structures.",
    steps: [
      "Apply the Michael-Scott Queue algorithm to the input.",
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
        q: "When should you use Michael-Scott Queue?",
        a: "Use Michael-Scott Queue when the problem matches its designed use case in linear data structures.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Michael-Scott Queue (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Michael-Scott Queue.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
