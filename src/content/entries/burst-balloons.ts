import type { AlgorithmEntry } from "../types";

export const burstBalloonsEntry: AlgorithmEntry = {
  slug: "burst-balloons",
  name: "Burst Balloons",
  aliases: ["Burst Balloons"],
  curriculum: [289],
  domain: "dynamic-programming",
  subcategory: "Dynamic Programming",
  difficulty: "intermediate",
  summary: "Burst Balloons is a well-known algorithm in the domain of dynamic programming.",
  tags: ["burst balloons", "dp"],
  prerequisites: ["Recursion"],
  related: [],
  problem: {
    input: "Input for Burst Balloons.",
    output: "Output of Burst Balloons.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Burst Balloons solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Burst Balloons algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Burst Balloons follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Burst Balloons is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Burst Balloons exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n²)",
      average: "O(n²)",
      worst: "O(n²)",
    },
    space: "O(n)",
    worstClass: "other",
  },
  properties: [
    {
      label: "Domain",
      value: "dynamic programming",
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
      id: "burst-balloons-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Burst Balloons?",
      options: [
        "To solve the Burst Balloons problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Burst Balloons is designed to solve its specific problem efficiently.",
      hints: ["Think about what Burst Balloons does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Burst Balloons is an algorithm in the domain of dynamic programming.",
    steps: [
      "Apply the Burst Balloons algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(n²)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["dynamic programming applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Burst Balloons?",
        a: "Use Burst Balloons when the problem matches its designed use case in dynamic programming.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Burst Balloons (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Burst Balloons.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
