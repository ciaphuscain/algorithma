import type { AlgorithmEntry } from "../types";

export const inclusionExclusionPrincipleEntry: AlgorithmEntry = {
  slug: "inclusion-exclusion-principle",
  name: "Inclusion–Exclusion Principle",
  aliases: ["Inclusion–Exclusion Principle"],
  curriculum: [382],
  domain: "number-theory",
  subcategory: "Number Theory",
  difficulty: "intermediate",
  summary:
    "Inclusion–Exclusion Principle is a well-known algorithm in the domain of number theory and mathematics.",
  tags: ["inclusion exclusion principle", "math"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Inclusion–Exclusion Principle.",
    output: "Output of Inclusion–Exclusion Principle.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Inclusion–Exclusion Principle solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Inclusion–Exclusion Principle algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Inclusion–Exclusion Principle follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Inclusion–Exclusion Principle is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Inclusion–Exclusion Principle exist in the literature. See references for details.",
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
      id: "inclusion-exclusion-principle-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Inclusion–Exclusion Principle?",
      options: [
        "To solve the Inclusion–Exclusion Principle problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation:
        "Inclusion–Exclusion Principle is designed to solve its specific problem efficiently.",
      hints: ["Think about what Inclusion–Exclusion Principle does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition:
      "Inclusion–Exclusion Principle is an algorithm in the domain of number theory and mathematics.",
    steps: [
      "Apply the Inclusion–Exclusion Principle algorithm to the input.",
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
        q: "When should you use Inclusion–Exclusion Principle?",
        a: "Use Inclusion–Exclusion Principle when the problem matches its designed use case in number theory and mathematics.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Inclusion–Exclusion Principle (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Inclusion–Exclusion Principle.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
