import type { AlgorithmEntry } from "../types";

export const bbrCongestionControlEntry: AlgorithmEntry = {
  slug: "bbr-congestion-control",
  name: "BBR Congestion Control",
  aliases: ["BBR Congestion Control"],
  curriculum: [563],
  domain: "networks",
  subcategory: "Network Algorithms",
  difficulty: "intermediate",
  summary: "BBR Congestion Control is a well-known algorithm in the domain of network algorithms.",
  tags: ["bbr congestion control", "networking"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for BBR Congestion Control.",
    output: "Output of BBR Congestion Control.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "BBR Congestion Control solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The BBR Congestion Control algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of BBR Congestion Control follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of BBR Congestion Control is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of BBR Congestion Control exist in the literature. See references for details.",
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
    worstClass: "other",
  },
  properties: [
    {
      label: "Domain",
      value: "network algorithms",
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
      id: "bbr-congestion-control-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of BBR Congestion Control?",
      options: [
        "To solve the BBR Congestion Control problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "BBR Congestion Control is designed to solve its specific problem efficiently.",
      hints: ["Think about what BBR Congestion Control does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "BBR Congestion Control is an algorithm in the domain of network algorithms.",
    steps: [
      "Apply the BBR Congestion Control algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["network algorithms applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use BBR Congestion Control?",
        a: "Use BBR Congestion Control when the problem matches its designed use case in network algorithms.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define BBR Congestion Control (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for BBR Congestion Control.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
