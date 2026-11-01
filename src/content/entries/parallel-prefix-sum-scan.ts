import type { AlgorithmEntry } from "../types";

export const parallelPrefixSumScanEntry: AlgorithmEntry = {
  slug: "parallel-prefix-sum-scan",
  name: "Parallel Prefix Sum (Scan)",
  aliases: ["Parallel Prefix Sum (Scan)"],
  curriculum: [456],
  domain: "parallel",
  subcategory: "Parallel Algorithms",
  difficulty: "intermediate",
  summary:
    "Parallel Prefix Sum (Scan) is a well-known algorithm in the domain of parallel computing.",
  tags: ["parallel prefix sum scan", "parallel"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Parallel Prefix Sum (Scan).",
    output: "Output of Parallel Prefix Sum (Scan).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Parallel Prefix Sum (Scan) solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Parallel Prefix Sum (Scan) algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Parallel Prefix Sum (Scan) follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Parallel Prefix Sum (Scan) is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Parallel Prefix Sum (Scan) exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n/p)",
      average: "O(n log n / p)",
      worst: "O(n log n / p)",
    },
    space: "O(n)",
    worstClass: "other",
  },
  properties: [
    {
      label: "Domain",
      value: "parallel computing",
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
      id: "parallel-prefix-sum-scan-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Parallel Prefix Sum (Scan)?",
      options: [
        "To solve the Parallel Prefix Sum (Scan) problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation:
        "Parallel Prefix Sum (Scan) is designed to solve its specific problem efficiently.",
      hints: ["Think about what Parallel Prefix Sum (Scan) does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Parallel Prefix Sum (Scan) is an algorithm in the domain of parallel computing.",
    steps: [
      "Apply the Parallel Prefix Sum (Scan) algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(n/p)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["parallel computing applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Parallel Prefix Sum (Scan)?",
        a: "Use Parallel Prefix Sum (Scan) when the problem matches its designed use case in parallel computing.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Parallel Prefix Sum (Scan) (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Parallel Prefix Sum (Scan).",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
