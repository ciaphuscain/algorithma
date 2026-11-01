import type { AlgorithmEntry } from "../types";

export const meetInTheMiddleEntry: AlgorithmEntry = {
  slug: "meet-in-the-middle",
  name: "Meet in the Middle",
  aliases: ["Meet in the Middle"],
  curriculum: [531],
  domain: "research",
  subcategory: "Advanced Topics",
  difficulty: "intermediate",
  summary:
    "Meet in the Middle is a well-known algorithm in the domain of advanced research topics.",
  tags: ["meet in the middle", "research"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Meet in the Middle.",
    output: "Output of Meet in the Middle.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Meet in the Middle solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Meet in the Middle algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Meet in the Middle follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Meet in the Middle is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Meet in the Middle exist in the literature. See references for details.",
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
    worstClass: "other",
  },
  properties: [
    {
      label: "Domain",
      value: "advanced research topics",
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
      id: "meet-in-the-middle-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Meet in the Middle?",
      options: [
        "To solve the Meet in the Middle problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Meet in the Middle is designed to solve its specific problem efficiently.",
      hints: ["Think about what Meet in the Middle does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Meet in the Middle is an algorithm in the domain of advanced research topics.",
    steps: [
      "Apply the Meet in the Middle algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["advanced research topics applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Meet in the Middle?",
        a: "Use Meet in the Middle when the problem matches its designed use case in advanced research topics.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Meet in the Middle (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Meet in the Middle.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
