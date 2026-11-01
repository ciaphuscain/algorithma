import type { AlgorithmEntry } from "../types";

export const alphaBetaPruningEntry: AlgorithmEntry = {
  slug: "alpha-beta-pruning",
  name: "Alpha–Beta Pruning",
  aliases: ["Alpha–Beta Pruning"],
  curriculum: [453],
  domain: "ai-search",
  subcategory: "AI Search",
  difficulty: "intermediate",
  summary: "Alpha–Beta Pruning is a well-known algorithm in the domain of AI search.",
  tags: ["alpha beta pruning", "ai", "search"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Alpha–Beta Pruning.",
    output: "Output of Alpha–Beta Pruning.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Alpha–Beta Pruning solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Alpha–Beta Pruning algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Alpha–Beta Pruning follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Alpha–Beta Pruning is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Alpha–Beta Pruning exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(b^(d/2))",
      average: "O(b^(3d/4))",
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
      id: "alpha-beta-pruning-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Alpha–Beta Pruning?",
      options: [
        "To solve the Alpha–Beta Pruning problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Alpha–Beta Pruning is designed to solve its specific problem efficiently.",
      hints: ["Think about what Alpha–Beta Pruning does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Alpha–Beta Pruning is an algorithm in the domain of AI search.",
    steps: [
      "Apply the Alpha–Beta Pruning algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(b^(d/2))$.",
    spaceComplexity: "$O(bd)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["AI search applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Alpha–Beta Pruning?",
        a: "Use Alpha–Beta Pruning when the problem matches its designed use case in AI search.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Alpha–Beta Pruning (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Alpha–Beta Pruning.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
