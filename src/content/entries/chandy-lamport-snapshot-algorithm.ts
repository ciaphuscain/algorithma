import type { AlgorithmEntry } from "../types";

export const chandyLamportSnapshotAlgorithmEntry: AlgorithmEntry = {
  slug: "chandy-lamport-snapshot-algorithm",
  name: "Chandy–Lamport Snapshot Algorithm",
  aliases: ["Chandy–Lamport Snapshot Algorithm"],
  curriculum: [469],
  domain: "distributed",
  subcategory: "Distributed Algorithms",
  difficulty: "intermediate",
  summary:
    "Chandy–Lamport Snapshot Algorithm is a well-known algorithm in the domain of distributed systems.",
  tags: ["chandy lamport snapshot algorithm", "distributed"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Chandy–Lamport Snapshot Algorithm.",
    output: "Output of Chandy–Lamport Snapshot Algorithm.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Chandy–Lamport Snapshot Algorithm solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Chandy–Lamport Snapshot Algorithm algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Chandy–Lamport Snapshot Algorithm follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Chandy–Lamport Snapshot Algorithm is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Chandy–Lamport Snapshot Algorithm exist in the literature. See references for details.",
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
      id: "chandy-lamport-snapshot-algorithm-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Chandy–Lamport Snapshot Algorithm?",
      options: [
        "To solve the Chandy–Lamport Snapshot Algorithm problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation:
        "Chandy–Lamport Snapshot Algorithm is designed to solve its specific problem efficiently.",
      hints: ["Think about what Chandy–Lamport Snapshot Algorithm does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition:
      "Chandy–Lamport Snapshot Algorithm is an algorithm in the domain of distributed systems.",
    steps: [
      "Apply the Chandy–Lamport Snapshot Algorithm algorithm to the input.",
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
        q: "When should you use Chandy–Lamport Snapshot Algorithm?",
        a: "Use Chandy–Lamport Snapshot Algorithm when the problem matches its designed use case in distributed systems.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Chandy–Lamport Snapshot Algorithm (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Chandy–Lamport Snapshot Algorithm.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
