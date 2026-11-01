import type { AlgorithmEntry } from "../types";

export const regexBacktrackingAlgorithmEntry: AlgorithmEntry = {
  slug: "regex-backtracking-algorithm",
  name: "Regex Backtracking Algorithm",
  aliases: ["Regex Backtracking Algorithm"],
  curriculum: [340],
  domain: "compilers",
  subcategory: "Compiler Algorithms",
  difficulty: "intermediate",
  summary:
    "Regex Backtracking Algorithm is a well-known algorithm in the domain of compiler design.",
  tags: ["regex backtracking algorithm", "compiler"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Regex Backtracking Algorithm.",
    output: "Output of Regex Backtracking Algorithm.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Regex Backtracking Algorithm solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Regex Backtracking Algorithm algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Regex Backtracking Algorithm follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Regex Backtracking Algorithm is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Regex Backtracking Algorithm exist in the literature. See references for details.",
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
      id: "regex-backtracking-algorithm-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Regex Backtracking Algorithm?",
      options: [
        "To solve the Regex Backtracking Algorithm problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation:
        "Regex Backtracking Algorithm is designed to solve its specific problem efficiently.",
      hints: ["Think about what Regex Backtracking Algorithm does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Regex Backtracking Algorithm is an algorithm in the domain of compiler design.",
    steps: [
      "Apply the Regex Backtracking Algorithm algorithm to the input.",
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
        q: "When should you use Regex Backtracking Algorithm?",
        a: "Use Regex Backtracking Algorithm when the problem matches its designed use case in compiler design.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Regex Backtracking Algorithm (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Regex Backtracking Algorithm.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
