import type { AlgorithmEntry } from "../types";

export const intervalTreeEntry: AlgorithmEntry = {
  slug: "interval-tree",
  name: "Interval Tree",
  aliases: ["Interval Tree"],
  curriculum: [175],
  domain: "trees",
  subcategory: "Special-purpose Trees",
  difficulty: "intermediate",
  summary:
    "An augmented balanced BST storing intervals. Each node tracks the max endpoint in its subtree, enabling O(log n + k) overlap queries where k is the number of results.",
  tags: ["interval tree", "augmented BST", "overlap"],
  prerequisites: ["Binary Search Tree", "AVL Tree"],
  related: ["segment-tree", "sweep-line"],
  problem: {
    input: "Input for Interval Tree.",
    output: "Output of Interval Tree.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "An augmented balanced BST storing intervals. Each node tracks the max endpoint in its subtree, enabling O(log n + k) overlap queries where k is the number of results.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Interval Tree algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Interval Tree follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Interval Tree is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Interval Tree exist in the literature. See references for details.",
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
      value: "Special-purpose Trees",
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
      id: "interval-tree-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Interval Tree?",
      options: [
        "An augmented balanced BST storing intervals. Each node track...",
        "Sorting an array",
        "Finding shortest paths",
        "Compressing data",
      ],
      answer: 0,
      explanation:
        "Interval Tree: An augmented balanced BST storing intervals. Each node tracks the max endpoint in its subtree, enabling O(log n + k) overlap queries where k is the number of results.",
      hints: ["Think about what problem Interval Tree solves."],
      objective: "Interval Tree",
    },
  ],
  exam: {
    definition:
      "An augmented balanced BST storing intervals. Each node tracks the max endpoint in its subtree, enabling O(log n + k) overlap queries where k is the number of results.",
    steps: ["Apply the Interval Tree algorithm to the input."],
    timeComplexity: "See complexity section.",
    spaceComplexity: "See complexity section.",
    correctness:
      "The Interval Tree algorithm is correct because it systematically processes all cases.",
    applications: ["Special-purpose Trees"],
    limitations: ["See advanced section for limitations."],
    faq: [
      {
        q: "When should you use Interval Tree?",
        a: "Use Interval Tree when the problem matches its design: An augmented balanced BST storing intervals. Each node tracks the max endpoint in its subtree, enabl",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Interval Tree (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. Cormen et al., Introduction to Algorithms, 4th ed.",
      supports: "General reference for Interval Tree.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
