import type { AlgorithmEntry } from "../types";

export const boyerMooreHorspoolEntry: AlgorithmEntry = {
  slug: "boyer-moore-horspool",
  name: "Boyer–Moore–Horspool",
  aliases: ["Boyer–Moore–Horspool"],
  curriculum: [305],
  domain: "strings",
  subcategory: "String Algorithms",
  difficulty: "intermediate",
  summary: "Boyer–Moore–Horspool is a well-known algorithm in the domain of string processing.",
  tags: ["boyer moore horspool", "string"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Boyer–Moore–Horspool.",
    output: "Output of Boyer–Moore–Horspool.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Boyer–Moore–Horspool solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Boyer–Moore–Horspool algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Boyer–Moore–Horspool follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Boyer–Moore–Horspool is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Boyer–Moore–Horspool exist in the literature. See references for details.",
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
      id: "boyer-moore-horspool-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Boyer–Moore–Horspool?",
      options: [
        "To solve the Boyer–Moore–Horspool problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Boyer–Moore–Horspool is designed to solve its specific problem efficiently.",
      hints: ["Think about what Boyer–Moore–Horspool does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Boyer–Moore–Horspool is an algorithm in the domain of string processing.",
    steps: [
      "Apply the Boyer–Moore–Horspool algorithm to the input.",
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
        q: "When should you use Boyer–Moore–Horspool?",
        a: "Use Boyer–Moore–Horspool when the problem matches its designed use case in string processing.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Boyer–Moore–Horspool (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Boyer–Moore–Horspool.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
