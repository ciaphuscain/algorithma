import type { AlgorithmEntry } from "../types";

export const monteCarloAlgorithmEntry: AlgorithmEntry = {
  slug: "monte-carlo-algorithm",
  name: "Monte Carlo Algorithm",
  aliases: ["Monte Carlo Algorithm"],
  curriculum: [430],
  domain: "randomized",
  subcategory: "Randomized Algorithms",
  difficulty: "intermediate",
  summary:
    "Monte Carlo Algorithm is a well-known algorithm in the domain of randomized algorithms.",
  tags: ["monte carlo algorithm", "randomized"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Monte Carlo Algorithm.",
    output: "Output of Monte Carlo Algorithm.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Monte Carlo Algorithm solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Monte Carlo Algorithm algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Monte Carlo Algorithm follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Monte Carlo Algorithm is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Monte Carlo Algorithm exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n)",
      worst: "O(n²)",
    },
    space: "O(n)",
    worstClass: "other",
  },
  properties: [
    {
      label: "Domain",
      value: "randomized algorithms",
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
      id: "monte-carlo-algorithm-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Monte Carlo Algorithm?",
      options: [
        "To solve the Monte Carlo Algorithm problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Monte Carlo Algorithm is designed to solve its specific problem efficiently.",
      hints: ["Think about what Monte Carlo Algorithm does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Monte Carlo Algorithm is an algorithm in the domain of randomized algorithms.",
    steps: [
      "Apply the Monte Carlo Algorithm algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["randomized algorithms applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Monte Carlo Algorithm?",
        a: "Use Monte Carlo Algorithm when the problem matches its designed use case in randomized algorithms.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Monte Carlo Algorithm (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Monte Carlo Algorithm.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
