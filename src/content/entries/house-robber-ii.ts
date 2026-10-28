import type { AlgorithmEntry } from "../types";

export const houseRobberIiEntry: AlgorithmEntry = {
  slug: "house-robber-ii",
  name: "House Robber II",
  aliases: ["House Robber II"],
  curriculum: [260],
  domain: "dynamic-programming",
  subcategory: "Beginner DP",
  difficulty: "intermediate",
  summary:
    "House Robber on a circular arrangement: the first and last houses are adjacent. Solve twice — once excluding the first house, once excluding the last — and take the maximum.",
  tags: ["house robber", "DP", "circular"],
  prerequisites: ["House Robber"],
  related: ["house-robber", "climbing-stairs"],
  problem: {
    input: "Input for House Robber II.",
    output: "Output of House Robber II.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "House Robber on a circular arrangement: the first and last houses are adjacent. Solve twice — once excluding the first house, once excluding the last — and take the maximum.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The House Robber II algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of House Robber II follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of House Robber II is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of House Robber II exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "varies",
      average: "varies",
      worst: "varies",
    },
    space: "varies",
    worstClass: "n",
  },
  properties: [
    {
      label: "Category",
      value: "Beginner DP",
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
      id: "house-robber-ii-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of House Robber II?",
      options: [
        "House Robber on a circular arrangement: the first and last h...",
        "Sorting an array",
        "Finding shortest paths",
        "Compressing data",
      ],
      answer: 0,
      explanation:
        "House Robber II: House Robber on a circular arrangement: the first and last houses are adjacent. Solve twice — once excluding the first house, once excluding the last — and take the maximum.",
      hints: ["Think about what problem House Robber II solves."],
      objective: "House Robber II",
    },
  ],
  exam: {
    definition:
      "House Robber on a circular arrangement: the first and last houses are adjacent. Solve twice — once excluding the first house, once excluding the last — and take the maximum.",
    steps: ["Apply the House Robber II algorithm to the input."],
    timeComplexity: "See complexity section.",
    spaceComplexity: "See complexity section.",
    correctness:
      "The House Robber II algorithm is correct because it systematically processes all cases.",
    applications: ["Beginner DP"],
    limitations: ["See advanced section for limitations."],
    faq: [
      {
        q: "When should you use House Robber II?",
        a: "Use House Robber II when the problem matches its design: House Robber on a circular arrangement: the first and last houses are adjacent. Solve twice — once e",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define House Robber II (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. Cormen et al., Introduction to Algorithms, 4th ed.",
      supports: "General reference for House Robber II.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
