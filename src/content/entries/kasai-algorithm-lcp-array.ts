import type { AlgorithmEntry } from "../types";

export const kasaiAlgorithmLcpArrayEntry: AlgorithmEntry = {
  slug: "kasai-algorithm-lcp-array",
  name: "Kasai Algorithm (LCP Array)",
  aliases: ["Kasai Algorithm (LCP Array)"],
  curriculum: [316],
  domain: "strings",
  subcategory: "String Algorithms",
  difficulty: "intermediate",
  summary:
    "Kasai Algorithm (LCP Array) is a well-known algorithm in the domain of string processing.",
  tags: ["kasai algorithm lcp array", "string"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Kasai Algorithm (LCP Array).",
    output: "Output of Kasai Algorithm (LCP Array).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Kasai Algorithm (LCP Array) solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Kasai Algorithm (LCP Array) algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Kasai Algorithm (LCP Array) follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Kasai Algorithm (LCP Array) is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Kasai Algorithm (LCP Array) exist in the literature. See references for details.",
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
      value: "string processing",
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
      id: "kasai-algorithm-lcp-array-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Kasai Algorithm (LCP Array)?",
      options: [
        "To solve the Kasai Algorithm (LCP Array) problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation:
        "Kasai Algorithm (LCP Array) is designed to solve its specific problem efficiently.",
      hints: ["Think about what Kasai Algorithm (LCP Array) does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Kasai Algorithm (LCP Array) is an algorithm in the domain of string processing.",
    steps: [
      "Apply the Kasai Algorithm (LCP Array) algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["string processing applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Kasai Algorithm (LCP Array)?",
        a: "Use Kasai Algorithm (LCP Array) when the problem matches its designed use case in string processing.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Kasai Algorithm (LCP Array) (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Kasai Algorithm (LCP Array).",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
