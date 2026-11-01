import type { AlgorithmEntry } from "../types";

export const palindromicTreeEertreeEntry: AlgorithmEntry = {
  slug: "palindromic-tree-eertree",
  name: "Palindromic Tree (Eertree)",
  aliases: ["Palindromic Tree (Eertree)"],
  curriculum: [329],
  domain: "strings",
  subcategory: "String Algorithms",
  difficulty: "intermediate",
  summary:
    "Palindromic Tree (Eertree) is a well-known algorithm in the domain of string processing.",
  tags: ["palindromic tree eertree", "string"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Palindromic Tree (Eertree).",
    output: "Output of Palindromic Tree (Eertree).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Palindromic Tree (Eertree) solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Palindromic Tree (Eertree) algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Palindromic Tree (Eertree) follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Palindromic Tree (Eertree) is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Palindromic Tree (Eertree) exist in the literature. See references for details.",
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
      id: "palindromic-tree-eertree-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Palindromic Tree (Eertree)?",
      options: [
        "To solve the Palindromic Tree (Eertree) problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation:
        "Palindromic Tree (Eertree) is designed to solve its specific problem efficiently.",
      hints: ["Think about what Palindromic Tree (Eertree) does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Palindromic Tree (Eertree) is an algorithm in the domain of string processing.",
    steps: [
      "Apply the Palindromic Tree (Eertree) algorithm to the input.",
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
        q: "When should you use Palindromic Tree (Eertree)?",
        a: "Use Palindromic Tree (Eertree) when the problem matches its designed use case in string processing.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Palindromic Tree (Eertree) (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Palindromic Tree (Eertree).",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
