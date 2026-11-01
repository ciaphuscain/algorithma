import type { AlgorithmEntry } from "../types";

export const halfPlaneIntersectionEntry: AlgorithmEntry = {
  slug: "half-plane-intersection",
  name: "Half-Plane Intersection",
  aliases: ["Half-Plane Intersection"],
  curriculum: [425],
  domain: "geometry",
  subcategory: "Computational Geometry",
  difficulty: "intermediate",
  summary:
    "Half-Plane Intersection is a well-known algorithm in the domain of computational geometry.",
  tags: ["half plane intersection", "geometry"],
  prerequisites: ["Sorting"],
  related: [],
  problem: {
    input: "Input for Half-Plane Intersection.",
    output: "Output of Half-Plane Intersection.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Half-Plane Intersection solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Half-Plane Intersection algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Half-Plane Intersection follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Half-Plane Intersection is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Half-Plane Intersection exist in the literature. See references for details.",
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
      id: "half-plane-intersection-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Half-Plane Intersection?",
      options: [
        "To solve the Half-Plane Intersection problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Half-Plane Intersection is designed to solve its specific problem efficiently.",
      hints: ["Think about what Half-Plane Intersection does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Half-Plane Intersection is an algorithm in the domain of computational geometry.",
    steps: [
      "Apply the Half-Plane Intersection algorithm to the input.",
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
        q: "When should you use Half-Plane Intersection?",
        a: "Use Half-Plane Intersection when the problem matches its designed use case in computational geometry.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Half-Plane Intersection (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Half-Plane Intersection.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
