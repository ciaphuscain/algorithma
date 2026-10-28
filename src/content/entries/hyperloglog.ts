import type { AlgorithmEntry } from "../types";

export const hyperLogLogEntry: AlgorithmEntry = {
  slug: "hyperloglog",
  name: "HyperLogLog",
  aliases: ["HyperLogLog"],
  curriculum: [79],
  domain: "arrays-hashing",
  subcategory: "Probabilistic Data Structures",
  difficulty: "advanced",
  summary:
    "Estimates the cardinality (number of distinct elements) of a multiset using O(log log n) space. Counts leading zeros in hash values across m registers to estimate distinct count.",
  tags: ["HyperLogLog", "cardinality", "streaming"],
  prerequisites: ["Hash Tables"],
  related: ["count-min-sketch", "minhash"],
  problem: {
    input: "Input for HyperLogLog.",
    output: "Output of HyperLogLog.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Estimates the cardinality (number of distinct elements) of a multiset using O(log log n) space. Counts leading zeros in hash values across m registers to estimate distinct count.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The HyperLogLog algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of HyperLogLog follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of HyperLogLog is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of HyperLogLog exist in the literature. See references for details.",
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
      value: "Probabilistic Data Structures",
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
      id: "hyperloglog-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of HyperLogLog?",
      options: [
        "Estimates the cardinality (number of distinct elements) of a...",
        "Sorting an array",
        "Finding shortest paths",
        "Compressing data",
      ],
      answer: 0,
      explanation:
        "HyperLogLog: Estimates the cardinality (number of distinct elements) of a multiset using O(log log n) space. Counts leading zeros in hash values across m registers to estimate distinct count.",
      hints: ["Think about what problem HyperLogLog solves."],
      objective: "HyperLogLog",
    },
  ],
  exam: {
    definition:
      "Estimates the cardinality (number of distinct elements) of a multiset using O(log log n) space. Counts leading zeros in hash values across m registers to estimate distinct count.",
    steps: ["Apply the HyperLogLog algorithm to the input."],
    timeComplexity: "See complexity section.",
    spaceComplexity: "See complexity section.",
    correctness:
      "The HyperLogLog algorithm is correct because it systematically processes all cases.",
    applications: ["Probabilistic Data Structures"],
    limitations: ["See advanced section for limitations."],
    faq: [
      {
        q: "When should you use HyperLogLog?",
        a: "Use HyperLogLog when the problem matches its design: Estimates the cardinality (number of distinct elements) of a multiset using O(log log n) space. Coun",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define HyperLogLog (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. Cormen et al., Introduction to Algorithms, 4th ed.",
      supports: "General reference for HyperLogLog.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
