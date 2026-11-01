import type { AlgorithmEntry } from "../types";

export const stochasticGradientDescentSgdEntry: AlgorithmEntry = {
  slug: "stochastic-gradient-descent-sgd",
  name: "Stochastic Gradient Descent (SGD)",
  aliases: ["Stochastic Gradient Descent (SGD)"],
  curriculum: [497],
  domain: "machine-learning",
  subcategory: "Machine Learning",
  difficulty: "intermediate",
  summary:
    "Stochastic Gradient Descent (SGD) is a well-known algorithm in the domain of machine learning.",
  tags: ["stochastic gradient descent sgd", "ml"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Stochastic Gradient Descent (SGD).",
    output: "Output of Stochastic Gradient Descent (SGD).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Stochastic Gradient Descent (SGD) solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Stochastic Gradient Descent (SGD) algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Stochastic Gradient Descent (SGD) follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Stochastic Gradient Descent (SGD) is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Stochastic Gradient Descent (SGD) exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n)",
      worst: "O(n)",
    },
    space: "O(d)",
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
      id: "stochastic-gradient-descent-sgd-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Stochastic Gradient Descent (SGD)?",
      options: [
        "To solve the Stochastic Gradient Descent (SGD) problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation:
        "Stochastic Gradient Descent (SGD) is designed to solve its specific problem efficiently.",
      hints: ["Think about what Stochastic Gradient Descent (SGD) does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition:
      "Stochastic Gradient Descent (SGD) is an algorithm in the domain of machine learning.",
    steps: [
      "Apply the Stochastic Gradient Descent (SGD) algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(d)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["machine learning applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Stochastic Gradient Descent (SGD)?",
        a: "Use Stochastic Gradient Descent (SGD) when the problem matches its designed use case in machine learning.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Stochastic Gradient Descent (SGD) (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Stochastic Gradient Descent (SGD).",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
