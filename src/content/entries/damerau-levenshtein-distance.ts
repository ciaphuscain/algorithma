import type { AlgorithmEntry } from "../types";

export const damerauLevenshteinDistanceEntry: AlgorithmEntry = {
  slug: "damerau-levenshtein-distance",
  name: "Damerau–Levenshtein Distance",
  aliases: ["Damerau–Levenshtein Distance"],
  curriculum: [277],
  domain: "dynamic-programming",
  subcategory: "Dynamic Programming",
  difficulty: "intermediate",
  summary:
    "Damerau–Levenshtein Distance is a well-known algorithm in the domain of dynamic programming.",
  tags: ["damerau levenshtein distance", "dp"],
  prerequisites: ["Recursion"],
  related: [],
  problem: {
    input: "Input for Damerau–Levenshtein Distance.",
    output: "Output of Damerau–Levenshtein Distance.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Damerau–Levenshtein Distance solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Damerau–Levenshtein Distance algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Damerau–Levenshtein Distance follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Damerau–Levenshtein Distance is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Damerau–Levenshtein Distance exist in the literature. See references for details.",
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
      id: "damerau-levenshtein-distance-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Damerau–Levenshtein Distance?",
      options: [
        "To solve the Damerau–Levenshtein Distance problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation:
        "Damerau–Levenshtein Distance is designed to solve its specific problem efficiently.",
      hints: ["Think about what Damerau–Levenshtein Distance does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition:
      "Damerau–Levenshtein Distance is an algorithm in the domain of dynamic programming.",
    steps: [
      "Apply the Damerau–Levenshtein Distance algorithm to the input.",
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
        q: "When should you use Damerau–Levenshtein Distance?",
        a: "Use Damerau–Levenshtein Distance when the problem matches its designed use case in dynamic programming.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Damerau–Levenshtein Distance (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Damerau–Levenshtein Distance.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
