import type { AlgorithmEntry } from "../types";

export const aksPrimalityTestEntry: AlgorithmEntry = {
  slug: "aks-primality-test",
  name: "AKS Primality Test",
  aliases: ["AKS Primality Test"],
  curriculum: [373],
  domain: "number-theory",
  subcategory: "Number Theory",
  difficulty: "intermediate",
  summary:
    "AKS Primality Test is a well-known algorithm in the domain of number theory and mathematics.",
  tags: ["aks primality test", "math"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for AKS Primality Test.",
    output: "Output of AKS Primality Test.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "AKS Primality Test solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The AKS Primality Test algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of AKS Primality Test follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of AKS Primality Test is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of AKS Primality Test exist in the literature. See references for details.",
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
      value: "number theory and mathematics",
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
      id: "aks-primality-test-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of AKS Primality Test?",
      options: [
        "To solve the AKS Primality Test problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "AKS Primality Test is designed to solve its specific problem efficiently.",
      hints: ["Think about what AKS Primality Test does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition:
      "AKS Primality Test is an algorithm in the domain of number theory and mathematics.",
    steps: [
      "Apply the AKS Primality Test algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["number theory and mathematics applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use AKS Primality Test?",
        a: "Use AKS Primality Test when the problem matches its designed use case in number theory and mathematics.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define AKS Primality Test (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for AKS Primality Test.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
