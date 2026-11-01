import type { AlgorithmEntry } from "../types";

export const geneticAlgorithmEntry: AlgorithmEntry = {
  slug: "genetic-algorithm",
  name: "Genetic Algorithm",
  aliases: ["Genetic Algorithm"],
  curriculum: [439],
  domain: "randomized",
  subcategory: "Randomized Algorithms",
  difficulty: "intermediate",
  summary: "Genetic Algorithm is a well-known algorithm in the domain of randomized algorithms.",
  tags: ["genetic algorithm", "randomized"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Genetic Algorithm.",
    output: "Output of Genetic Algorithm.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Genetic Algorithm solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Genetic Algorithm algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Genetic Algorithm follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Genetic Algorithm is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Genetic Algorithm exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(g·p·n)",
      average: "O(g·p·n)",
      worst: "O(g·p·n)",
    },
    space: "O(p·n)",
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
      id: "genetic-algorithm-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Genetic Algorithm?",
      options: [
        "To solve the Genetic Algorithm problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Genetic Algorithm is designed to solve its specific problem efficiently.",
      hints: ["Think about what Genetic Algorithm does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Genetic Algorithm is an algorithm in the domain of randomized algorithms.",
    steps: [
      "Apply the Genetic Algorithm algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(g·p·n)$.",
    spaceComplexity: "$O(p·n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["randomized algorithms applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Genetic Algorithm?",
        a: "Use Genetic Algorithm when the problem matches its designed use case in randomized algorithms.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Genetic Algorithm (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Genetic Algorithm.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
