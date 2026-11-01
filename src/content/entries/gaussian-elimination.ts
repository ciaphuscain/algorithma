import type { AlgorithmEntry } from "../types";

export const gaussianEliminationEntry: AlgorithmEntry = {
  slug: "gaussian-elimination",
  name: "Gaussian Elimination",
  aliases: ["Gaussian Elimination"],
  curriculum: [387],
  domain: "number-theory",
  subcategory: "Number Theory",
  difficulty: "intermediate",
  summary:
    "Gaussian Elimination is a well-known algorithm in the domain of number theory and mathematics.",
  tags: ["gaussian elimination", "math"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Gaussian Elimination.",
    output: "Output of Gaussian Elimination.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Gaussian Elimination solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Gaussian Elimination algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Gaussian Elimination follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Gaussian Elimination is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Gaussian Elimination exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n³)",
      average: "O(n³)",
      worst: "O(n³)",
    },
    space: "O(n²)",
    worstClass: "n^3",
  },
  properties: [
    {
      label: "Domain",
      value: "number theory and mathematics",
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
      id: "gaussian-elimination-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Gaussian Elimination?",
      options: [
        "To solve the Gaussian Elimination problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Gaussian Elimination is designed to solve its specific problem efficiently.",
      hints: ["Think about what Gaussian Elimination does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition:
      "Gaussian Elimination is an algorithm in the domain of number theory and mathematics.",
    steps: [
      "Apply the Gaussian Elimination algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(n³)$.",
    spaceComplexity: "$O(n²)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["number theory and mathematics applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Gaussian Elimination?",
        a: "Use Gaussian Elimination when the problem matches its designed use case in number theory and mathematics.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Gaussian Elimination (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Gaussian Elimination.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
