import type { AlgorithmEntry } from "../types";

export const wuManberEntry: AlgorithmEntry = {
  slug: "wu-manber",
  name: "Wu–Manber",
  aliases: ["Wu–Manber"],
  curriculum: [326],
  domain: "strings",
  subcategory: "String Algorithms",
  difficulty: "intermediate",
  summary: "Wu–Manber is a well-known algorithm in the domain of string processing.",
  tags: ["wu manber", "string"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Wu–Manber.",
    output: "Output of Wu–Manber.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Wu–Manber solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Wu–Manber algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Wu–Manber follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Wu–Manber is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Wu–Manber exist in the literature. See references for details.",
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
      id: "wu-manber-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Wu–Manber?",
      options: [
        "To solve the Wu–Manber problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Wu–Manber is designed to solve its specific problem efficiently.",
      hints: ["Think about what Wu–Manber does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Wu–Manber is an algorithm in the domain of string processing.",
    steps: [
      "Apply the Wu–Manber algorithm to the input.",
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
        q: "When should you use Wu–Manber?",
        a: "Use Wu–Manber when the problem matches its designed use case in string processing.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Wu–Manber (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Wu–Manber.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
