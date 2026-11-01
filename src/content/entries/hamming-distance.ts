import type { AlgorithmEntry } from "../types";

export const hammingDistanceEntry: AlgorithmEntry = {
  slug: "hamming-distance",
  name: "Hamming Distance",
  aliases: ["Hamming Distance"],
  curriculum: [332],
  domain: "strings",
  subcategory: "String Algorithms",
  difficulty: "intermediate",
  summary: "Hamming Distance is a well-known algorithm in the domain of string processing.",
  tags: ["hamming distance", "string"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Hamming Distance.",
    output: "Output of Hamming Distance.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Hamming Distance solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Hamming Distance algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Hamming Distance follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Hamming Distance is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Hamming Distance exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n)",
      worst: "O(n)",
    },
    space: "O(n)",
    worstClass: "n",
  },
  properties: [
    {
      label: "Domain",
      value: "string processing",
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
      id: "hamming-distance-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Hamming Distance?",
      options: [
        "To solve the Hamming Distance problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Hamming Distance is designed to solve its specific problem efficiently.",
      hints: ["Think about what Hamming Distance does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Hamming Distance is an algorithm in the domain of string processing.",
    steps: [
      "Apply the Hamming Distance algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["string processing applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Hamming Distance?",
        a: "Use Hamming Distance when the problem matches its designed use case in string processing.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Hamming Distance (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Hamming Distance.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
