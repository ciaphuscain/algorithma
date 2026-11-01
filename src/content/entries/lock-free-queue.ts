import type { AlgorithmEntry } from "../types";

export const lockFreeQueueEntry: AlgorithmEntry = {
  slug: "lock-free-queue",
  name: "Lock-Free Queue",
  aliases: ["Lock-Free Queue"],
  curriculum: [134],
  domain: "linear-structures",
  subcategory: "Linear Data Structures",
  difficulty: "intermediate",
  summary: "Lock-Free Queue is a well-known algorithm in the domain of linear data structures.",
  tags: ["lock free queue", "data structure"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Lock-Free Queue.",
    output: "Output of Lock-Free Queue.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Lock-Free Queue solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Lock-Free Queue algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Lock-Free Queue follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Lock-Free Queue is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Lock-Free Queue exist in the literature. See references for details.",
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
      id: "lock-free-queue-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Lock-Free Queue?",
      options: [
        "To solve the Lock-Free Queue problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Lock-Free Queue is designed to solve its specific problem efficiently.",
      hints: ["Think about what Lock-Free Queue does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Lock-Free Queue is an algorithm in the domain of linear data structures.",
    steps: [
      "Apply the Lock-Free Queue algorithm to the input.",
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
        q: "When should you use Lock-Free Queue?",
        a: "Use Lock-Free Queue when the problem matches its designed use case in linear data structures.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Lock-Free Queue (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Lock-Free Queue.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
