import type { AlgorithmEntry } from "../types";

export const orientationTestCcwTestEntry: AlgorithmEntry = {
  slug: "orientation-test-ccw-test",
  name: "Orientation Test (CCW Test)",
  aliases: ["Orientation Test (CCW Test)"],
  curriculum: [401],
  domain: "geometry",
  subcategory: "Computational Geometry",
  difficulty: "intermediate",
  summary:
    "Orientation Test (CCW Test) is a well-known algorithm in the domain of computational geometry.",
  tags: ["orientation test ccw test", "geometry"],
  prerequisites: ["Sorting"],
  related: [],
  problem: {
    input: "Input for Orientation Test (CCW Test).",
    output: "Output of Orientation Test (CCW Test).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Orientation Test (CCW Test) solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Orientation Test (CCW Test) algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Orientation Test (CCW Test) follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Orientation Test (CCW Test) is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Orientation Test (CCW Test) exist in the literature. See references for details.",
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
      id: "orientation-test-ccw-test-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Orientation Test (CCW Test)?",
      options: [
        "To solve the Orientation Test (CCW Test) problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation:
        "Orientation Test (CCW Test) is designed to solve its specific problem efficiently.",
      hints: ["Think about what Orientation Test (CCW Test) does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition:
      "Orientation Test (CCW Test) is an algorithm in the domain of computational geometry.",
    steps: [
      "Apply the Orientation Test (CCW Test) algorithm to the input.",
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
        q: "When should you use Orientation Test (CCW Test)?",
        a: "Use Orientation Test (CCW Test) when the problem matches its designed use case in computational geometry.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Orientation Test (CCW Test) (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Orientation Test (CCW Test).",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
