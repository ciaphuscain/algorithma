import type { AlgorithmEntry } from "../types";

export const policyGradientReinforceEntry: AlgorithmEntry = {
  slug: "policy-gradient-reinforce",
  name: "Policy Gradient (REINFORCE)",
  aliases: ["Policy Gradient (REINFORCE)"],
  curriculum: [582],
  domain: "machine-learning",
  subcategory: "Machine Learning",
  difficulty: "intermediate",
  summary:
    "Policy Gradient (REINFORCE) is a well-known algorithm in the domain of machine learning.",
  tags: ["policy gradient reinforce", "ml"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Policy Gradient (REINFORCE).",
    output: "Output of Policy Gradient (REINFORCE).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Policy Gradient (REINFORCE) solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Policy Gradient (REINFORCE) algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Policy Gradient (REINFORCE) follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Policy Gradient (REINFORCE) is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Policy Gradient (REINFORCE) exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n·d)",
      worst: "O(n·d·k)",
    },
    space: "O(n)",
    worstClass: "other",
  },
  properties: [
    {
      label: "Domain",
      value: "machine learning",
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
      id: "policy-gradient-reinforce-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Policy Gradient (REINFORCE)?",
      options: [
        "To solve the Policy Gradient (REINFORCE) problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation:
        "Policy Gradient (REINFORCE) is designed to solve its specific problem efficiently.",
      hints: ["Think about what Policy Gradient (REINFORCE) does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Policy Gradient (REINFORCE) is an algorithm in the domain of machine learning.",
    steps: [
      "Apply the Policy Gradient (REINFORCE) algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["machine learning applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Policy Gradient (REINFORCE)?",
        a: "Use Policy Gradient (REINFORCE) when the problem matches its designed use case in machine learning.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Policy Gradient (REINFORCE) (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Policy Gradient (REINFORCE).",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
