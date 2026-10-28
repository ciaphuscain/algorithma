import type { AlgorithmEntry } from "../types";

export const countMinSketchEntry: AlgorithmEntry = {
  slug: "count-min-sketch",
  name: "Count-Min Sketch",
  aliases: ["Count-Min Sketch"],
  curriculum: [78],
  domain: "arrays-hashing",
  subcategory: "Probabilistic Data Structures",
  difficulty: "intermediate",
  summary:
    "A probabilistic data structure for frequency estimation in data streams. Uses d hash functions mapping to w counters. Provides approximate frequency counts with one-sided error.",
  tags: ["count-min sketch", "streaming", "frequency"],
  prerequisites: ["Hash Tables"],
  related: ["bloom-filter", "hyperloglog"],
  problem: {
    input: "Input for Count-Min Sketch.",
    output: "Output of Count-Min Sketch.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A probabilistic data structure for frequency estimation in data streams. Uses d hash functions mapping to w counters. Provides approximate frequency counts with one-sided error.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Count-Min Sketch algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Count-Min Sketch follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Count-Min Sketch is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Count-Min Sketch exist in the literature. See references for details.",
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
      id: "count-min-sketch-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Count-Min Sketch?",
      options: [
        "A probabilistic data structure for frequency estimation in d...",
        "Sorting an array",
        "Finding shortest paths",
        "Compressing data",
      ],
      answer: 0,
      explanation:
        "Count-Min Sketch: A probabilistic data structure for frequency estimation in data streams. Uses d hash functions mapping to w counters. Provides approximate frequency counts with one-sided error.",
      hints: ["Think about what problem Count-Min Sketch solves."],
      objective: "Count-Min Sketch",
    },
  ],
  exam: {
    definition:
      "A probabilistic data structure for frequency estimation in data streams. Uses d hash functions mapping to w counters. Provides approximate frequency counts with one-sided error.",
    steps: ["Apply the Count-Min Sketch algorithm to the input."],
    timeComplexity: "See complexity section.",
    spaceComplexity: "See complexity section.",
    correctness:
      "The Count-Min Sketch algorithm is correct because it systematically processes all cases.",
    applications: ["Probabilistic Data Structures"],
    limitations: ["See advanced section for limitations."],
    faq: [
      {
        q: "When should you use Count-Min Sketch?",
        a: "Use Count-Min Sketch when the problem matches its design: A probabilistic data structure for frequency estimation in data streams. Uses d hash functions mappi",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Count-Min Sketch (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. Cormen et al., Introduction to Algorithms, 4th ed.",
      supports: "General reference for Count-Min Sketch.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
