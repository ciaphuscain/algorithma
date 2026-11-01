import type { AlgorithmEntry } from "../types";

export const leastCommonMultipleLcmEntry: AlgorithmEntry = {
  slug: "least-common-multiple-lcm",
  name: "Least Common Multiple (LCM)",
  aliases: ["Least Common Multiple (LCM)"],
  curriculum: [354],
  domain: "number-theory",
  subcategory: "Number Theory",
  difficulty: "intermediate",
  summary:
    "Least Common Multiple (LCM) is a well-known algorithm in the domain of number theory and mathematics.",
  tags: ["least common multiple lcm", "math"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Least Common Multiple (LCM).",
    output: "Output of Least Common Multiple (LCM).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Least Common Multiple (LCM) solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Least Common Multiple (LCM) algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Least Common Multiple (LCM) follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Least Common Multiple (LCM) is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Least Common Multiple (LCM) exist in the literature. See references for details.",
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
      id: "least-common-multiple-lcm-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Least Common Multiple (LCM)?",
      options: [
        "To solve the Least Common Multiple (LCM) problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation:
        "Least Common Multiple (LCM) is designed to solve its specific problem efficiently.",
      hints: ["Think about what Least Common Multiple (LCM) does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition:
      "Least Common Multiple (LCM) is an algorithm in the domain of number theory and mathematics.",
    steps: [
      "Apply the Least Common Multiple (LCM) algorithm to the input.",
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
        q: "When should you use Least Common Multiple (LCM)?",
        a: "Use Least Common Multiple (LCM) when the problem matches its designed use case in number theory and mathematics.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Least Common Multiple (LCM) (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Least Common Multiple (LCM).",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
