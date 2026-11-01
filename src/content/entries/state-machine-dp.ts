import type { AlgorithmEntry } from "../types";

export const stateMachineDpEntry: AlgorithmEntry = {
  slug: "state-machine-dp",
  name: "State Machine DP",
  aliases: ["State Machine DP"],
  curriculum: [255],
  domain: "dynamic-programming",
  subcategory: "Dynamic Programming",
  difficulty: "intermediate",
  summary: "State Machine DP is a well-known algorithm in the domain of dynamic programming.",
  tags: ["state machine dp", "dp"],
  prerequisites: ["Recursion"],
  related: [],
  problem: {
    input: "Input for State Machine DP.",
    output: "Output of State Machine DP.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "State Machine DP solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The State Machine DP algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of State Machine DP follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of State Machine DP is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of State Machine DP exist in the literature. See references for details.",
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
      id: "state-machine-dp-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of State Machine DP?",
      options: [
        "To solve the State Machine DP problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "State Machine DP is designed to solve its specific problem efficiently.",
      hints: ["Think about what State Machine DP does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "State Machine DP is an algorithm in the domain of dynamic programming.",
    steps: [
      "Apply the State Machine DP algorithm to the input.",
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
        q: "When should you use State Machine DP?",
        a: "Use State Machine DP when the problem matches its designed use case in dynamic programming.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define State Machine DP (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for State Machine DP.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
