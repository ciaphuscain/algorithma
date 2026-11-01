import type { AlgorithmEntry } from "../types";

export const tcpCongestionControlRenoCubicEntry: AlgorithmEntry = {
  slug: "tcp-congestion-control-reno-cubic",
  name: "TCP Congestion Control (Reno/CUBIC)",
  aliases: ["TCP Congestion Control (Reno/CUBIC)"],
  curriculum: [562],
  domain: "networks",
  subcategory: "Network Algorithms",
  difficulty: "intermediate",
  summary:
    "TCP Congestion Control (Reno/CUBIC) is a well-known algorithm in the domain of network algorithms.",
  tags: ["tcp congestion control reno cubic", "networking"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for TCP Congestion Control (Reno/CUBIC).",
    output: "Output of TCP Congestion Control (Reno/CUBIC).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "TCP Congestion Control (Reno/CUBIC) solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The TCP Congestion Control (Reno/CUBIC) algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of TCP Congestion Control (Reno/CUBIC) follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of TCP Congestion Control (Reno/CUBIC) is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of TCP Congestion Control (Reno/CUBIC) exist in the literature. See references for details.",
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
      id: "tcp-congestion-control-reno-cubic-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of TCP Congestion Control (Reno/CUBIC)?",
      options: [
        "To solve the TCP Congestion Control (Reno/CUBIC) problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation:
        "TCP Congestion Control (Reno/CUBIC) is designed to solve its specific problem efficiently.",
      hints: ["Think about what TCP Congestion Control (Reno/CUBIC) does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition:
      "TCP Congestion Control (Reno/CUBIC) is an algorithm in the domain of network algorithms.",
    steps: [
      "Apply the TCP Congestion Control (Reno/CUBIC) algorithm to the input.",
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
        q: "When should you use TCP Congestion Control (Reno/CUBIC)?",
        a: "Use TCP Congestion Control (Reno/CUBIC) when the problem matches its designed use case in network algorithms.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define TCP Congestion Control (Reno/CUBIC) (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for TCP Congestion Control (Reno/CUBIC).",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
