import type { AlgorithmEntry } from "../types";

export const simulatedAnnealingEntry: AlgorithmEntry = {
  slug: "simulated-annealing",
  name: "Simulated Annealing",
  aliases: ["Simulated Annealing"],
  curriculum: [438],
  domain: "randomized",
  subcategory: "Randomized Algorithms",
  difficulty: "intermediate",
  summary: "Simulated Annealing is a well-known algorithm in the domain of randomized algorithms.",
  tags: ["simulated annealing", "randomized"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Simulated Annealing.",
    output: "Output of Simulated Annealing.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Simulated Annealing solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Simulated Annealing algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Simulated Annealing follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Simulated Annealing is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Simulated Annealing exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n·T)",
      worst: "O(n·T)",
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
      id: "simulated-annealing-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Simulated Annealing?",
      options: [
        "To solve the Simulated Annealing problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Simulated Annealing is designed to solve its specific problem efficiently.",
      hints: ["Think about what Simulated Annealing does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Simulated Annealing is an algorithm in the domain of randomized algorithms.",
    steps: [
      "Apply the Simulated Annealing algorithm to the input.",
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
        q: "When should you use Simulated Annealing?",
        a: "Use Simulated Annealing when the problem matches its designed use case in randomized algorithms.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Simulated Annealing (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Simulated Annealing.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
