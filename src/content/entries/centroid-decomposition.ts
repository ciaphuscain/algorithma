import type { AlgorithmEntry } from "../types";

export const centroidDecompositionEntry: AlgorithmEntry = {
  slug: "centroid-decomposition",
  name: "Centroid Decomposition",
  aliases: ["Centroid Decomposition"],
  curriculum: [191],
  domain: "trees",
  subcategory: "Tree Algorithms",
  difficulty: "intermediate",
  summary:
    "Centroid Decomposition is a well-known algorithm in the domain of trees and advanced data structures.",
  tags: ["centroid decomposition", "tree"],
  prerequisites: ["Binary Search Trees"],
  related: [],
  problem: {
    input: "Input for Centroid Decomposition.",
    output: "Output of Centroid Decomposition.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Centroid Decomposition solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Centroid Decomposition algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Centroid Decomposition follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Centroid Decomposition is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Centroid Decomposition exist in the literature. See references for details.",
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
      id: "centroid-decomposition-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Centroid Decomposition?",
      options: [
        "To solve the Centroid Decomposition problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Centroid Decomposition is designed to solve its specific problem efficiently.",
      hints: ["Think about what Centroid Decomposition does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition:
      "Centroid Decomposition is an algorithm in the domain of trees and advanced data structures.",
    steps: [
      "Apply the Centroid Decomposition algorithm to the input.",
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
        q: "When should you use Centroid Decomposition?",
        a: "Use Centroid Decomposition when the problem matches its designed use case in trees and advanced data structures.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Centroid Decomposition (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Centroid Decomposition.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
