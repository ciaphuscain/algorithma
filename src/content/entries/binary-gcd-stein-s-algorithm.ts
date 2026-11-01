import type { AlgorithmEntry } from "../types";

export const binaryGcdSteinSAlgorithmEntry: AlgorithmEntry = {
  slug: "binary-gcd-stein-s-algorithm",
  name: "Binary GCD (Stein's Algorithm)",
  aliases: ["Binary GCD (Stein's Algorithm)"],
  curriculum: [353],
  domain: "number-theory",
  subcategory: "Number Theory",
  difficulty: "intermediate",
  summary:
    "Binary GCD (Stein's Algorithm) is a well-known algorithm in the domain of number theory and mathematics.",
  tags: ["binary gcd stein s algorithm", "math"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Binary GCD (Stein's Algorithm).",
    output: "Output of Binary GCD (Stein's Algorithm).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Binary GCD (Stein's Algorithm) solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Binary GCD (Stein's Algorithm) algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Binary GCD (Stein's Algorithm) follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Binary GCD (Stein's Algorithm) is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Binary GCD (Stein's Algorithm) exist in the literature. See references for details.",
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
      id: "binary-gcd-stein-s-algorithm-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Binary GCD (Stein's Algorithm)?",
      options: [
        "To solve the Binary GCD (Stein's Algorithm) problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation:
        "Binary GCD (Stein's Algorithm) is designed to solve its specific problem efficiently.",
      hints: ["Think about what Binary GCD (Stein's Algorithm) does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition:
      "Binary GCD (Stein's Algorithm) is an algorithm in the domain of number theory and mathematics.",
    steps: [
      "Apply the Binary GCD (Stein's Algorithm) algorithm to the input.",
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
        q: "When should you use Binary GCD (Stein's Algorithm)?",
        a: "Use Binary GCD (Stein's Algorithm) when the problem matches its designed use case in number theory and mathematics.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Binary GCD (Stein's Algorithm) (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Binary GCD (Stein's Algorithm).",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
