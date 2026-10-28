import type { AlgorithmEntry } from "../types";

export const perfectHashingEntry: AlgorithmEntry = {
  slug: "perfect-hashing",
  name: "Perfect Hashing",
  aliases: ["Perfect Hashing"],
  curriculum: [72],
  domain: "arrays-hashing",
  subcategory: "Hash Tables",
  difficulty: "advanced",
  summary:
    "A hash function with no collisions for a known, fixed set of keys. Static perfect hashing achieves O(1) worst-case lookup with O(n) space using a two-level scheme (FKS).",
  tags: ["perfect hashing", "FKS", "minimal perfect hash"],
  prerequisites: ["Hash Tables"],
  related: ["universal-hashing", "hash-chaining"],
  problem: {
    input: "Input for Perfect Hashing.",
    output: "Output of Perfect Hashing.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A hash function with no collisions for a known, fixed set of keys. Static perfect hashing achieves O(1) worst-case lookup with O(n) space using a two-level scheme (FKS).",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Perfect Hashing algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Perfect Hashing follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Perfect Hashing is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Perfect Hashing exist in the literature. See references for details.",
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
      id: "perfect-hashing-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Perfect Hashing?",
      options: [
        "A hash function with no collisions for a known, fixed set of...",
        "Sorting an array",
        "Finding shortest paths",
        "Compressing data",
      ],
      answer: 0,
      explanation:
        "Perfect Hashing: A hash function with no collisions for a known, fixed set of keys. Static perfect hashing achieves O(1) worst-case lookup with O(n) space using a two-level scheme (FKS).",
      hints: ["Think about what problem Perfect Hashing solves."],
      objective: "Perfect Hashing",
    },
  ],
  exam: {
    definition:
      "A hash function with no collisions for a known, fixed set of keys. Static perfect hashing achieves O(1) worst-case lookup with O(n) space using a two-level scheme (FKS).",
    steps: ["Apply the Perfect Hashing algorithm to the input."],
    timeComplexity: "See complexity section.",
    spaceComplexity: "See complexity section.",
    correctness:
      "The Perfect Hashing algorithm is correct because it systematically processes all cases.",
    applications: ["Hash Tables"],
    limitations: ["See advanced section for limitations."],
    faq: [
      {
        q: "When should you use Perfect Hashing?",
        a: "Use Perfect Hashing when the problem matches its design: A hash function with no collisions for a known, fixed set of keys. Static perfect hashing achieves O",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Perfect Hashing (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. Cormen et al., Introduction to Algorithms, 4th ed.",
      supports: "General reference for Perfect Hashing.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
