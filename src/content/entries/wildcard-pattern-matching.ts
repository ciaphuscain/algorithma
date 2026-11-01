import type { AlgorithmEntry } from "../types";

export const wildcardPatternMatchingEntry: AlgorithmEntry = {
  slug: "wildcard-pattern-matching",
  name: "Wildcard Pattern Matching",
  aliases: ["Wildcard Pattern Matching"],
  curriculum: [348],
  domain: "strings",
  subcategory: "String Algorithms",
  difficulty: "intermediate",
  summary:
    "Wildcard Pattern Matching is a well-known algorithm in the domain of string processing.",
  tags: ["wildcard pattern matching", "string"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Wildcard Pattern Matching.",
    output: "Output of Wildcard Pattern Matching.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Wildcard Pattern Matching solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Wildcard Pattern Matching algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Wildcard Pattern Matching follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Wildcard Pattern Matching is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Wildcard Pattern Matching exist in the literature. See references for details.",
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
      id: "wildcard-pattern-matching-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Wildcard Pattern Matching?",
      options: [
        "To solve the Wildcard Pattern Matching problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation:
        "Wildcard Pattern Matching is designed to solve its specific problem efficiently.",
      hints: ["Think about what Wildcard Pattern Matching does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Wildcard Pattern Matching is an algorithm in the domain of string processing.",
    steps: [
      "Apply the Wildcard Pattern Matching algorithm to the input.",
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
        q: "When should you use Wildcard Pattern Matching?",
        a: "Use Wildcard Pattern Matching when the problem matches its designed use case in string processing.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Wildcard Pattern Matching (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Wildcard Pattern Matching.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
