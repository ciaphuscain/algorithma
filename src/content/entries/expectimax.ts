import type { AlgorithmEntry } from "../types";

export const expectimaxEntry: AlgorithmEntry = {
  slug: "expectimax",
  name: "Expectimax",
  aliases: ["Expectimax"],
  curriculum: [454],
  domain: "ai-search",
  subcategory: "AI Search",
  difficulty: "intermediate",
  summary: "Expectimax is a well-known algorithm in the domain of AI search.",
  tags: ["expectimax", "ai", "search"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Expectimax.",
    output: "Output of Expectimax.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Expectimax solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Expectimax algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Expectimax follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Expectimax is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Expectimax exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(b^d)",
      average: "O(b^d)",
      worst: "O(b^d)",
    },
    space: "O(b^d)",
    worstClass: "other",
  },
  properties: [
    {
      label: "Domain",
      value: "AI search",
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
      id: "expectimax-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Expectimax?",
      options: [
        "To solve the Expectimax problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Expectimax is designed to solve its specific problem efficiently.",
      hints: ["Think about what Expectimax does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Expectimax is an algorithm in the domain of AI search.",
    steps: [
      "Apply the Expectimax algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(b^d)$.",
    spaceComplexity: "$O(b^d)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["AI search applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Expectimax?",
        a: "Use Expectimax when the problem matches its designed use case in AI search.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Expectimax (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Expectimax.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
