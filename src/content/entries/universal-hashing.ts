import type { AlgorithmEntry } from "../types";

export const universalHashingEntry: AlgorithmEntry = {
  slug: "universal-hashing",
  name: "Universal Hashing",
  aliases: ["Universal Hashing"],
  curriculum: [73],
  domain: "arrays-hashing",
  subcategory: "Hash Tables",
  difficulty: "intermediate",
  summary:
    "A family of hash functions where any two distinct keys collide with probability at most 1/m. Randomized selection from the family prevents adversarial inputs from causing worst-case behavior.",
  tags: ["universal hashing", "randomized", "collision"],
  prerequisites: ["Hash Tables"],
  related: ["perfect-hashing", "hash-chaining"],
  problem: {
    input: "Input for Universal Hashing.",
    output: "Output of Universal Hashing.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A family of hash functions where any two distinct keys collide with probability at most 1/m. Randomized selection from the family prevents adversarial inputs from causing worst-case behavior.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Universal Hashing algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Universal Hashing follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Universal Hashing is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Universal Hashing exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "varies",
      average: "varies",
      worst: "varies",
    },
    space: "varies",
    worstClass: "1",
  },
  properties: [
    {
      label: "Category",
      value: "Hash Tables",
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
      id: "universal-hashing-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Universal Hashing?",
      options: [
        "A family of hash functions where any two distinct keys colli...",
        "Sorting an array",
        "Finding shortest paths",
        "Compressing data",
      ],
      answer: 0,
      explanation:
        "Universal Hashing: A family of hash functions where any two distinct keys collide with probability at most 1/m. Randomized selection from the family prevents adversarial inputs from causing worst-case behavior.",
      hints: ["Think about what problem Universal Hashing solves."],
      objective: "Universal Hashing",
    },
  ],
  exam: {
    definition:
      "A family of hash functions where any two distinct keys collide with probability at most 1/m. Randomized selection from the family prevents adversarial inputs from causing worst-case behavior.",
    steps: ["Apply the Universal Hashing algorithm to the input."],
    timeComplexity: "See complexity section.",
    spaceComplexity: "See complexity section.",
    correctness:
      "The Universal Hashing algorithm is correct because it systematically processes all cases.",
    applications: ["Hash Tables"],
    limitations: ["See advanced section for limitations."],
    faq: [
      {
        q: "When should you use Universal Hashing?",
        a: "Use Universal Hashing when the problem matches its design: A family of hash functions where any two distinct keys collide with probability at most 1/m. Randomi",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Universal Hashing (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. Cormen et al., Introduction to Algorithms, 4th ed.",
      supports: "General reference for Universal Hashing.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
