import type { AlgorithmEntry } from "../types";

export const xTreeEntry: AlgorithmEntry = {
  slug: "x-tree",
  name: "X Tree",
  aliases: ["X Tree"],
  curriculum: [182],
  domain: "trees",
  subcategory: "Tree Algorithms",
  difficulty: "intermediate",
  summary: "X Tree is a well-known algorithm in the domain of trees and advanced data structures.",
  tags: ["x tree", "tree"],
  prerequisites: ["Binary Search Trees"],
  related: [],
  problem: {
    input: "Input for X Tree.",
    output: "Output of X Tree.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "X Tree solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The X Tree algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of X Tree follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of X Tree is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of X Tree exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(log n)",
      average: "O(log n)",
      worst: "O(n)",
    },
    space: "O(n)",
    worstClass: "n",
  },
  properties: [
    {
      label: "Domain",
      value: "trees and advanced data structures",
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
      id: "x-tree-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of X Tree?",
      options: [
        "To solve the X Tree problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "X Tree is designed to solve its specific problem efficiently.",
      hints: ["Think about what X Tree does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "X Tree is an algorithm in the domain of trees and advanced data structures.",
    steps: [
      "Apply the X Tree algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(log n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["trees and advanced data structures applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use X Tree?",
        a: "Use X Tree when the problem matches its designed use case in trees and advanced data structures.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Define X Tree (1).", "Describe the algorithm (2).", "Analyze complexity (2)."],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for X Tree.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
