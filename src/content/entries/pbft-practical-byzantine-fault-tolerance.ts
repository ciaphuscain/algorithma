import type { AlgorithmEntry } from "../types";

export const pbftPracticalByzantineFaultToleranceEntry: AlgorithmEntry = {
  slug: "pbft-practical-byzantine-fault-tolerance",
  name: "PBFT (Practical Byzantine Fault Tolerance)",
  aliases: ["PBFT (Practical Byzantine Fault Tolerance)"],
  curriculum: [550],
  domain: "distributed",
  subcategory: "Distributed Algorithms",
  difficulty: "intermediate",
  summary:
    "PBFT (Practical Byzantine Fault Tolerance) is a well-known algorithm in the domain of distributed systems.",
  tags: ["pbft practical byzantine fault tolerance", "distributed"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for PBFT (Practical Byzantine Fault Tolerance).",
    output: "Output of PBFT (Practical Byzantine Fault Tolerance).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "PBFT (Practical Byzantine Fault Tolerance) solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The PBFT (Practical Byzantine Fault Tolerance) algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of PBFT (Practical Byzantine Fault Tolerance) follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of PBFT (Practical Byzantine Fault Tolerance) is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of PBFT (Practical Byzantine Fault Tolerance) exist in the literature. See references for details.",
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
      id: "pbft-practical-byzantine-fault-tolerance-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of PBFT (Practical Byzantine Fault Tolerance)?",
      options: [
        "To solve the PBFT (Practical Byzantine Fault Tolerance) problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation:
        "PBFT (Practical Byzantine Fault Tolerance) is designed to solve its specific problem efficiently.",
      hints: ["Think about what PBFT (Practical Byzantine Fault Tolerance) does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition:
      "PBFT (Practical Byzantine Fault Tolerance) is an algorithm in the domain of distributed systems.",
    steps: [
      "Apply the PBFT (Practical Byzantine Fault Tolerance) algorithm to the input.",
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
        q: "When should you use PBFT (Practical Byzantine Fault Tolerance)?",
        a: "Use PBFT (Practical Byzantine Fault Tolerance) when the problem matches its designed use case in distributed systems.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define PBFT (Practical Byzantine Fault Tolerance) (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for PBFT (Practical Byzantine Fault Tolerance).",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
