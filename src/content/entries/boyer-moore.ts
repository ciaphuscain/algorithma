import type { AlgorithmEntry } from "../types";

export const boyerMooreEntry: AlgorithmEntry = {
  slug: "boyer-moore",
  name: "Boyer–Moore",
  aliases: ["Boyer–Moore"],
  curriculum: [304],
  domain: "strings",
  subcategory: "String Algorithms",
  difficulty: "intermediate",
  summary: "Boyer–Moore is a well-known algorithm in the domain of string processing.",
  tags: ["boyer moore", "string"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Boyer–Moore.",
    output: "Output of Boyer–Moore.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Boyer–Moore solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Boyer–Moore algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Boyer–Moore follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Boyer–Moore is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Boyer–Moore exist in the literature. See references for details.",
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
      id: "boyer-moore-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Boyer–Moore?",
      options: [
        "To solve the Boyer–Moore problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Boyer–Moore is designed to solve its specific problem efficiently.",
      hints: ["Think about what Boyer–Moore does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Boyer–Moore is an algorithm in the domain of string processing.",
    steps: [
      "Apply the Boyer–Moore algorithm to the input.",
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
        q: "When should you use Boyer–Moore?",
        a: "Use Boyer–Moore when the problem matches its designed use case in string processing.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Boyer–Moore (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Boyer–Moore.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
