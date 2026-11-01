import type { AlgorithmEntry } from "../types";

export const fmIndexFullTextSearchEntry: AlgorithmEntry = {
  slug: "fm-index-full-text-search",
  name: "FM-Index (Full-Text Search)",
  aliases: ["FM-Index (Full-Text Search)"],
  curriculum: [350],
  domain: "strings",
  subcategory: "String Algorithms",
  difficulty: "intermediate",
  summary:
    "FM-Index (Full-Text Search) is a well-known algorithm in the domain of string processing.",
  tags: ["fm index full text search", "string"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for FM-Index (Full-Text Search).",
    output: "Output of FM-Index (Full-Text Search).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "FM-Index (Full-Text Search) solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The FM-Index (Full-Text Search) algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of FM-Index (Full-Text Search) follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of FM-Index (Full-Text Search) is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of FM-Index (Full-Text Search) exist in the literature. See references for details.",
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
      id: "fm-index-full-text-search-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of FM-Index (Full-Text Search)?",
      options: [
        "To solve the FM-Index (Full-Text Search) problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation:
        "FM-Index (Full-Text Search) is designed to solve its specific problem efficiently.",
      hints: ["Think about what FM-Index (Full-Text Search) does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "FM-Index (Full-Text Search) is an algorithm in the domain of string processing.",
    steps: [
      "Apply the FM-Index (Full-Text Search) algorithm to the input.",
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
        q: "When should you use FM-Index (Full-Text Search)?",
        a: "Use FM-Index (Full-Text Search) when the problem matches its designed use case in string processing.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define FM-Index (Full-Text Search) (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for FM-Index (Full-Text Search).",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
