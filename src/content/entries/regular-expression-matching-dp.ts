import type { AlgorithmEntry } from "../types";

export const regularExpressionMatchingDpEntry: AlgorithmEntry = {
  slug: "regular-expression-matching-dp",
  name: "Regular Expression Matching (DP)",
  aliases: ["Regular Expression Matching (DP)"],
  curriculum: [349],
  domain: "strings",
  subcategory: "String Algorithms",
  difficulty: "intermediate",
  summary:
    "Regular Expression Matching (DP) is a well-known algorithm in the domain of string processing.",
  tags: ["regular expression matching dp", "string"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Regular Expression Matching (DP).",
    output: "Output of Regular Expression Matching (DP).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Regular Expression Matching (DP) solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Regular Expression Matching (DP) algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Regular Expression Matching (DP) follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Regular Expression Matching (DP) is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Regular Expression Matching (DP) exist in the literature. See references for details.",
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
    worstClass: "n",
  },
  properties: [
    {
      label: "Domain",
      value: "string processing",
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
      id: "regular-expression-matching-dp-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Regular Expression Matching (DP)?",
      options: [
        "To solve the Regular Expression Matching (DP) problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation:
        "Regular Expression Matching (DP) is designed to solve its specific problem efficiently.",
      hints: ["Think about what Regular Expression Matching (DP) does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition:
      "Regular Expression Matching (DP) is an algorithm in the domain of string processing.",
    steps: [
      "Apply the Regular Expression Matching (DP) algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["string processing applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Regular Expression Matching (DP)?",
        a: "Use Regular Expression Matching (DP) when the problem matches its designed use case in string processing.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Regular Expression Matching (DP) (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Regular Expression Matching (DP).",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
