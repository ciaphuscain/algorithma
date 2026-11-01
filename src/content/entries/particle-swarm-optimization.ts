import type { AlgorithmEntry } from "../types";

export const particleSwarmOptimizationEntry: AlgorithmEntry = {
  slug: "particle-swarm-optimization",
  name: "Particle Swarm Optimization",
  aliases: ["Particle Swarm Optimization"],
  curriculum: [440],
  domain: "randomized",
  subcategory: "Randomized Algorithms",
  difficulty: "intermediate",
  summary:
    "Particle Swarm Optimization is a well-known algorithm in the domain of randomized algorithms.",
  tags: ["particle swarm optimization", "randomized"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Particle Swarm Optimization.",
    output: "Output of Particle Swarm Optimization.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Particle Swarm Optimization solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Particle Swarm Optimization algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Particle Swarm Optimization follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Particle Swarm Optimization is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Particle Swarm Optimization exist in the literature. See references for details.",
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
      id: "particle-swarm-optimization-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Particle Swarm Optimization?",
      options: [
        "To solve the Particle Swarm Optimization problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation:
        "Particle Swarm Optimization is designed to solve its specific problem efficiently.",
      hints: ["Think about what Particle Swarm Optimization does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition:
      "Particle Swarm Optimization is an algorithm in the domain of randomized algorithms.",
    steps: [
      "Apply the Particle Swarm Optimization algorithm to the input.",
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
        q: "When should you use Particle Swarm Optimization?",
        a: "Use Particle Swarm Optimization when the problem matches its designed use case in randomized algorithms.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Particle Swarm Optimization (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Particle Swarm Optimization.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
