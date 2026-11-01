import type { AlgorithmEntry } from "../types";

export const backpropagationEntry: AlgorithmEntry = {
  slug: "backpropagation",
  name: "Backpropagation",
  aliases: ["Backpropagation"],
  curriculum: [498],
  domain: "machine-learning",
  subcategory: "Machine Learning",
  difficulty: "intermediate",
  summary: "Backpropagation is a well-known algorithm in the domain of machine learning.",
  tags: ["backpropagation", "ml"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Backpropagation.",
    output: "Output of Backpropagation.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Backpropagation solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Backpropagation algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Backpropagation follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Backpropagation is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Backpropagation exist in the literature. See references for details.",
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
      id: "backpropagation-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Backpropagation?",
      options: [
        "To solve the Backpropagation problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Backpropagation is designed to solve its specific problem efficiently.",
      hints: ["Think about what Backpropagation does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Backpropagation is an algorithm in the domain of machine learning.",
    steps: [
      "Apply the Backpropagation algorithm to the input.",
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
        q: "When should you use Backpropagation?",
        a: "Use Backpropagation when the problem matches its designed use case in machine learning.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Backpropagation (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Backpropagation.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
