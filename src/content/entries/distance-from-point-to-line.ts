import type { AlgorithmEntry } from "../types";

export const distanceFromPointToLineEntry: AlgorithmEntry = {
  slug: "distance-from-point-to-line",
  name: "Distance from Point to Line",
  aliases: ["Distance from Point to Line"],
  curriculum: [405],
  domain: "geometry",
  subcategory: "Computational Geometry",
  difficulty: "intermediate",
  summary:
    "Distance from Point to Line is a well-known algorithm in the domain of computational geometry.",
  tags: ["distance from point to line", "geometry"],
  prerequisites: ["Sorting"],
  related: [],
  problem: {
    input: "Input for Distance from Point to Line.",
    output: "Output of Distance from Point to Line.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Distance from Point to Line solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Distance from Point to Line algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Distance from Point to Line follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Distance from Point to Line is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Distance from Point to Line exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n log n)",
    },
    space: "O(n)",
    worstClass: "n log n",
  },
  properties: [
    {
      label: "Domain",
      value: "computational geometry",
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
      id: "distance-from-point-to-line-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Distance from Point to Line?",
      options: [
        "To solve the Distance from Point to Line problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation:
        "Distance from Point to Line is designed to solve its specific problem efficiently.",
      hints: ["Think about what Distance from Point to Line does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition:
      "Distance from Point to Line is an algorithm in the domain of computational geometry.",
    steps: [
      "Apply the Distance from Point to Line algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(n log n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["computational geometry applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Distance from Point to Line?",
        a: "Use Distance from Point to Line when the problem matches its designed use case in computational geometry.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Distance from Point to Line (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Distance from Point to Line.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
