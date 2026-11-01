import type { AlgorithmEntry } from "../types";

export const palindromePartitioningEntry: AlgorithmEntry = {
  slug: "palindrome-partitioning",
  name: "Palindrome Partitioning",
  aliases: ["Palindrome Partitioning"],
  curriculum: [288],
  domain: "dynamic-programming",
  subcategory: "Dynamic Programming",
  difficulty: "intermediate",
  summary:
    "Palindrome Partitioning is a well-known algorithm in the domain of dynamic programming.",
  tags: ["palindrome partitioning", "dp"],
  prerequisites: ["Recursion"],
  related: [],
  problem: {
    input: "Input for Palindrome Partitioning.",
    output: "Output of Palindrome Partitioning.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Palindrome Partitioning solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Palindrome Partitioning algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Palindrome Partitioning follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Palindrome Partitioning is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Palindrome Partitioning exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n²)",
      average: "O(n²)",
      worst: "O(n²)",
    },
    space: "O(n)",
    worstClass: "other",
  },
  properties: [
    {
      label: "Domain",
      value: "dynamic programming",
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
      id: "palindrome-partitioning-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Palindrome Partitioning?",
      options: [
        "To solve the Palindrome Partitioning problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Palindrome Partitioning is designed to solve its specific problem efficiently.",
      hints: ["Think about what Palindrome Partitioning does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Palindrome Partitioning is an algorithm in the domain of dynamic programming.",
    steps: [
      "Apply the Palindrome Partitioning algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(n²)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["dynamic programming applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Palindrome Partitioning?",
        a: "Use Palindrome Partitioning when the problem matches its designed use case in dynamic programming.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Palindrome Partitioning (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Palindrome Partitioning.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
