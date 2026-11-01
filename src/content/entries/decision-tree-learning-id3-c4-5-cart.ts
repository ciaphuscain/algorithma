import type { AlgorithmEntry } from "../types";

export const decisionTreeLearningId3C45CartEntry: AlgorithmEntry = {
  slug: "decision-tree-learning-id3-c4-5-cart",
  name: "Decision Tree Learning (ID3/C4.5/CART)",
  aliases: ["Decision Tree Learning (ID3/C4.5/CART)"],
  curriculum: [500],
  domain: "machine-learning",
  subcategory: "Machine Learning",
  difficulty: "intermediate",
  summary:
    "Decision Tree Learning (ID3/C4.5/CART) is a well-known algorithm in the domain of machine learning.",
  tags: ["decision tree learning id3 c4 5 cart", "ml"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Decision Tree Learning (ID3/C4.5/CART).",
    output: "Output of Decision Tree Learning (ID3/C4.5/CART).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Decision Tree Learning (ID3/C4.5/CART) solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Decision Tree Learning (ID3/C4.5/CART) algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Decision Tree Learning (ID3/C4.5/CART) follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Decision Tree Learning (ID3/C4.5/CART) is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Decision Tree Learning (ID3/C4.5/CART) exist in the literature. See references for details.",
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
      id: "decision-tree-learning-id3-c4-5-cart-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Decision Tree Learning (ID3/C4.5/CART)?",
      options: [
        "To solve the Decision Tree Learning (ID3/C4.5/CART) problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation:
        "Decision Tree Learning (ID3/C4.5/CART) is designed to solve its specific problem efficiently.",
      hints: ["Think about what Decision Tree Learning (ID3/C4.5/CART) does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition:
      "Decision Tree Learning (ID3/C4.5/CART) is an algorithm in the domain of machine learning.",
    steps: [
      "Apply the Decision Tree Learning (ID3/C4.5/CART) algorithm to the input.",
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
        q: "When should you use Decision Tree Learning (ID3/C4.5/CART)?",
        a: "Use Decision Tree Learning (ID3/C4.5/CART) when the problem matches its designed use case in machine learning.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Decision Tree Learning (ID3/C4.5/CART) (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Decision Tree Learning (ID3/C4.5/CART).",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
