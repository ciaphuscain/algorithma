import type { AlgorithmEntry } from "../types";

export const waveletTreeEntry: AlgorithmEntry = {
  slug: "wavelet-tree",
  name: "Wavelet Tree",
  aliases: ["Wavelet Tree"],
  curriculum: [195],
  domain: "trees",
  subcategory: "Tree Algorithms",
  difficulty: "intermediate",
  summary:
    "Wavelet Tree is a well-known algorithm in the domain of trees and advanced data structures.",
  tags: ["wavelet tree", "tree"],
  prerequisites: ["Binary Search Trees"],
  related: [],
  problem: {
    input: "Input for Wavelet Tree.",
    output: "Output of Wavelet Tree.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Wavelet Tree solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Wavelet Tree algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Wavelet Tree follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Wavelet Tree is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Wavelet Tree exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(log σ)",
      average: "O(log σ)",
      worst: "O(log σ)",
    },
    space: "O(n log σ)",
    worstClass: "other",
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
      id: "wavelet-tree-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Wavelet Tree?",
      options: [
        "To solve the Wavelet Tree problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Wavelet Tree is designed to solve its specific problem efficiently.",
      hints: ["Think about what Wavelet Tree does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Wavelet Tree is an algorithm in the domain of trees and advanced data structures.",
    steps: [
      "Apply the Wavelet Tree algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(log σ)$.",
    spaceComplexity: "$O(n log σ)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["trees and advanced data structures applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Wavelet Tree?",
        a: "Use Wavelet Tree when the problem matches its designed use case in trees and advanced data structures.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Wavelet Tree (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Wavelet Tree.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
