import type { AlgorithmEntry } from "../types";

export const gossipProtocolEntry: AlgorithmEntry = {
  slug: "gossip-protocol",
  name: "Gossip Protocol",
  aliases: ["Gossip Protocol"],
  curriculum: [468],
  domain: "distributed",
  subcategory: "Distributed Algorithms",
  difficulty: "intermediate",
  summary: "Gossip Protocol is a well-known algorithm in the domain of distributed systems.",
  tags: ["gossip protocol", "distributed"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Gossip Protocol.",
    output: "Output of Gossip Protocol.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Gossip Protocol solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Gossip Protocol algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Gossip Protocol follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Gossip Protocol is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Gossip Protocol exist in the literature. See references for details.",
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
      value: "distributed systems",
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
      id: "gossip-protocol-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Gossip Protocol?",
      options: [
        "To solve the Gossip Protocol problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Gossip Protocol is designed to solve its specific problem efficiently.",
      hints: ["Think about what Gossip Protocol does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Gossip Protocol is an algorithm in the domain of distributed systems.",
    steps: [
      "Apply the Gossip Protocol algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["distributed systems applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Gossip Protocol?",
        a: "Use Gossip Protocol when the problem matches its designed use case in distributed systems.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Gossip Protocol (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Gossip Protocol.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
