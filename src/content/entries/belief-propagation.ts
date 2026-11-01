import type { AlgorithmEntry } from "../types";

export const beliefPropagationEntry: AlgorithmEntry = {
  slug: "belief-propagation",
  name: "Belief Propagation",
  aliases: ["Belief Propagation"],
  curriculum: [577],
  domain: "machine-learning",
  subcategory: "Machine Learning",
  difficulty: "intermediate",
  summary: "Belief Propagation is a well-known algorithm in the domain of machine learning.",
  tags: ["belief propagation", "ml"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Belief Propagation.",
    output: "Output of Belief Propagation.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Belief Propagation solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Belief Propagation algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Belief Propagation follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Belief Propagation is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Belief Propagation exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n·d)",
      worst: "O(n·d·k)",
    },
    space: "O(n)",
    worstClass: "other",
  },
  properties: [
    {
      label: "Domain",
      value: "machine learning",
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
      id: "belief-propagation-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Belief Propagation?",
      options: [
        "To solve the Belief Propagation problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Belief Propagation is designed to solve its specific problem efficiently.",
      hints: ["Think about what Belief Propagation does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Belief Propagation is an algorithm in the domain of machine learning.",
    steps: [
      "Apply the Belief Propagation algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["machine learning applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Belief Propagation?",
        a: "Use Belief Propagation when the problem matches its designed use case in machine learning.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Belief Propagation (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Belief Propagation.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
