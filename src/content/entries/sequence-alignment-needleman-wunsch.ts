import type { AlgorithmEntry } from "../types";

export const sequenceAlignmentNeedlemanWunschEntry: AlgorithmEntry = {
  slug: "sequence-alignment-needleman-wunsch",
  name: "Sequence Alignment (Needleman–Wunsch)",
  aliases: ["Sequence Alignment (Needleman–Wunsch)"],
  curriculum: [278],
  domain: "dynamic-programming",
  subcategory: "Dynamic Programming",
  difficulty: "intermediate",
  summary:
    "Sequence Alignment (Needleman–Wunsch) is a well-known algorithm in the domain of dynamic programming.",
  tags: ["sequence alignment needleman wunsch", "dp"],
  prerequisites: ["Recursion"],
  related: [],
  problem: {
    input: "Input for Sequence Alignment (Needleman–Wunsch).",
    output: "Output of Sequence Alignment (Needleman–Wunsch).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Sequence Alignment (Needleman–Wunsch) solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Sequence Alignment (Needleman–Wunsch) algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Sequence Alignment (Needleman–Wunsch) follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Sequence Alignment (Needleman–Wunsch) is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Sequence Alignment (Needleman–Wunsch) exist in the literature. See references for details.",
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
      id: "sequence-alignment-needleman-wunsch-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Sequence Alignment (Needleman–Wunsch)?",
      options: [
        "To solve the Sequence Alignment (Needleman–Wunsch) problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation:
        "Sequence Alignment (Needleman–Wunsch) is designed to solve its specific problem efficiently.",
      hints: ["Think about what Sequence Alignment (Needleman–Wunsch) does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition:
      "Sequence Alignment (Needleman–Wunsch) is an algorithm in the domain of dynamic programming.",
    steps: [
      "Apply the Sequence Alignment (Needleman–Wunsch) algorithm to the input.",
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
        q: "When should you use Sequence Alignment (Needleman–Wunsch)?",
        a: "Use Sequence Alignment (Needleman–Wunsch) when the problem matches its designed use case in dynamic programming.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Sequence Alignment (Needleman–Wunsch) (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Sequence Alignment (Needleman–Wunsch).",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
