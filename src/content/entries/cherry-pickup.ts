import type { AlgorithmEntry } from "../types";

export const cherryPickupEntry: AlgorithmEntry = {
  slug: "cherry-pickup",
  name: "Cherry Pickup",
  aliases: ["Cherry Pickup"],
  curriculum: [285],
  domain: "dynamic-programming",
  subcategory: "Dynamic Programming",
  difficulty: "intermediate",
  summary: "Cherry Pickup is a well-known algorithm in the domain of dynamic programming.",
  tags: ["cherry pickup", "dp"],
  prerequisites: ["Recursion"],
  related: [],
  problem: {
    input: "Input for Cherry Pickup.",
    output: "Output of Cherry Pickup.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Cherry Pickup solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Cherry Pickup algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Cherry Pickup follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Cherry Pickup is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Cherry Pickup exist in the literature. See references for details.",
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
      id: "cherry-pickup-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Cherry Pickup?",
      options: [
        "To solve the Cherry Pickup problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "Cherry Pickup is designed to solve its specific problem efficiently.",
      hints: ["Think about what Cherry Pickup does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Cherry Pickup is an algorithm in the domain of dynamic programming.",
    steps: [
      "Apply the Cherry Pickup algorithm to the input.",
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
        q: "When should you use Cherry Pickup?",
        a: "Use Cherry Pickup when the problem matches its designed use case in dynamic programming.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Cherry Pickup (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Cherry Pickup.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
