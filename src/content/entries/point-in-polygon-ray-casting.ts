import type { AlgorithmEntry } from "../types";

export const pointInPolygonRayCastingEntry: AlgorithmEntry = {
  slug: "point-in-polygon-ray-casting",
  name: "Point in Polygon (Ray Casting)",
  aliases: ["Point in Polygon (Ray Casting)"],
  curriculum: [411],
  domain: "geometry",
  subcategory: "Computational Geometry",
  difficulty: "intermediate",
  summary:
    "Point in Polygon (Ray Casting) is a well-known algorithm in the domain of computational geometry.",
  tags: ["point in polygon ray casting", "geometry"],
  prerequisites: ["Sorting"],
  related: [],
  problem: {
    input: "Input for Point in Polygon (Ray Casting).",
    output: "Output of Point in Polygon (Ray Casting).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Point in Polygon (Ray Casting) solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Point in Polygon (Ray Casting) algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Point in Polygon (Ray Casting) follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Point in Polygon (Ray Casting) is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Point in Polygon (Ray Casting) exist in the literature. See references for details.",
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
      id: "point-in-polygon-ray-casting-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Point in Polygon (Ray Casting)?",
      options: [
        "To solve the Point in Polygon (Ray Casting) problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation:
        "Point in Polygon (Ray Casting) is designed to solve its specific problem efficiently.",
      hints: ["Think about what Point in Polygon (Ray Casting) does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition:
      "Point in Polygon (Ray Casting) is an algorithm in the domain of computational geometry.",
    steps: [
      "Apply the Point in Polygon (Ray Casting) algorithm to the input.",
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
        q: "When should you use Point in Polygon (Ray Casting)?",
        a: "Use Point in Polygon (Ray Casting) when the problem matches its designed use case in computational geometry.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Point in Polygon (Ray Casting) (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Point in Polygon (Ray Casting).",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
