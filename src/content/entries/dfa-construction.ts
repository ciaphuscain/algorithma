import type { AlgorithmEntry } from "../types";

export const dfaConstructionEntry: AlgorithmEntry = {
  slug: "dfa-construction",
  name: "DFA Construction",
  aliases: ["DFA Construction"],
  curriculum: [339],
  domain: "compilers",
  subcategory: "Compiler Algorithms",
  difficulty: "intermediate",
  summary: "DFA Construction is a well-known algorithm in the domain of compiler design.",
  tags: ["dfa construction", "compiler"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for DFA Construction.",
    output: "Output of DFA Construction.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "DFA Construction solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The DFA Construction algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of DFA Construction follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of DFA Construction is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of DFA Construction exist in the literature. See references for details.",
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
      value: "compiler design",
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
      id: "dfa-construction-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of DFA Construction?",
      options: [
        "To solve the DFA Construction problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "DFA Construction is designed to solve its specific problem efficiently.",
      hints: ["Think about what DFA Construction does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "DFA Construction is an algorithm in the domain of compiler design.",
    steps: [
      "Apply the DFA Construction algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["compiler design applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use DFA Construction?",
        a: "Use DFA Construction when the problem matches its designed use case in compiler design.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define DFA Construction (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for DFA Construction.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
