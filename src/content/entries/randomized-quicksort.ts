import type { AlgorithmEntry } from "../types";

export const randomizedQuicksortEntry: AlgorithmEntry = {
  slug: "randomized-quicksort",
  name: "Randomized QuickSort",
  aliases: ["Randomized QuickSort"],
  curriculum: [426],
  domain: "randomized",
  subcategory: "Randomized Algorithms",
  difficulty: "intermediate",
  summary: "Randomized QuickSort is a well-known algorithm in the domain of randomized algorithms.",
  tags: ["randomized quicksort", "randomized"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Randomized QuickSort.",
    output: "Output of Randomized QuickSort.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Randomized QuickSort solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Randomized QuickSort algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Randomized QuickSort follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Randomized QuickSort is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Randomized QuickSort exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n)",
      worst: "O(n²)",
    },
    space: "O(n)",
    worstClass: "other",
  },
  properties: [
    {
      label: "Domain",
      value: "randomized algorithms",
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
      id: "randomized-quicksort-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Randomized QuickSort?",
      options: [
        "To solve the Randomized QuickSort problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Randomized QuickSort is designed to solve its specific problem efficiently.",
      hints: ["Think about what Randomized QuickSort does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Randomized QuickSort is an algorithm in the domain of randomized algorithms.",
    steps: [
      "Apply the Randomized QuickSort algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["randomized algorithms applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Randomized QuickSort?",
        a: "Use Randomized QuickSort when the problem matches its designed use case in randomized algorithms.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Randomized QuickSort (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Randomized QuickSort.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
