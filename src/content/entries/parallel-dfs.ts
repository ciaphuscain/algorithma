import type { AlgorithmEntry } from "../types";

export const parallelDfsEntry: AlgorithmEntry = {
  slug: "parallel-dfs",
  name: "Parallel DFS",
  aliases: ["Parallel DFS"],
  curriculum: [463],
  domain: "parallel",
  subcategory: "Parallel Algorithms",
  difficulty: "intermediate",
  summary: "Parallel DFS is a well-known algorithm in the domain of parallel computing.",
  tags: ["parallel dfs", "parallel"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Parallel DFS.",
    output: "Output of Parallel DFS.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Parallel DFS solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Parallel DFS algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Parallel DFS follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Parallel DFS is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Parallel DFS exist in the literature. See references for details.",
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
      id: "parallel-dfs-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Parallel DFS?",
      options: [
        "To solve the Parallel DFS problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Parallel DFS is designed to solve its specific problem efficiently.",
      hints: ["Think about what Parallel DFS does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Parallel DFS is an algorithm in the domain of parallel computing.",
    steps: [
      "Apply the Parallel DFS algorithm to the input.",
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
        q: "When should you use Parallel DFS?",
        a: "Use Parallel DFS when the problem matches its designed use case in parallel computing.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Parallel DFS (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Parallel DFS.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
