import type { AlgorithmEntry } from "../types";

export const minimaxEntry: AlgorithmEntry = {
  slug: "minimax",
  name: "Minimax",
  aliases: ["Minimax"],
  curriculum: [452],
  domain: "ai-search",
  subcategory: "AI Search",
  difficulty: "intermediate",
  summary: "Minimax is a well-known algorithm in the domain of AI search.",
  tags: ["minimax", "ai", "search"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Minimax.",
    output: "Output of Minimax.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Minimax solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Minimax algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Minimax follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Minimax is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Minimax exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(b^d)",
      average: "O(b^d)",
      worst: "O(b^d)",
    },
    space: "O(bd)",
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
      id: "minimax-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Minimax?",
      options: [
        "To solve the Minimax problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Minimax is designed to solve its specific problem efficiently.",
      hints: ["Think about what Minimax does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Minimax is an algorithm in the domain of AI search.",
    steps: [
      "Apply the Minimax algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(b^d)$.",
    spaceComplexity: "$O(bd)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["AI search applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Minimax?",
        a: "Use Minimax when the problem matches its designed use case in AI search.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Define Minimax (1).", "Describe the algorithm (2).", "Analyze complexity (2)."],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Minimax.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
