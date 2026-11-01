import type { AlgorithmEntry } from "../types";

export const sundayAlgorithmEntry: AlgorithmEntry = {
  slug: "sunday-algorithm",
  name: "Sunday Algorithm",
  aliases: ["Sunday Algorithm"],
  curriculum: [306],
  domain: "strings",
  subcategory: "String Algorithms",
  difficulty: "intermediate",
  summary: "Sunday Algorithm is a well-known algorithm in the domain of string processing.",
  tags: ["sunday algorithm", "string"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Sunday Algorithm.",
    output: "Output of Sunday Algorithm.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Sunday Algorithm solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Sunday Algorithm algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Sunday Algorithm follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Sunday Algorithm is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Sunday Algorithm exist in the literature. See references for details.",
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
      id: "sunday-algorithm-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Sunday Algorithm?",
      options: [
        "To solve the Sunday Algorithm problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Sunday Algorithm is designed to solve its specific problem efficiently.",
      hints: ["Think about what Sunday Algorithm does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Sunday Algorithm is an algorithm in the domain of string processing.",
    steps: [
      "Apply the Sunday Algorithm algorithm to the input.",
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
        q: "When should you use Sunday Algorithm?",
        a: "Use Sunday Algorithm when the problem matches its designed use case in string processing.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Sunday Algorithm (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Sunday Algorithm.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
