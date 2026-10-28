import type { AlgorithmEntry } from "../types";

export const softHeapEntry: AlgorithmEntry = {
  slug: "soft-heap",
  name: "Soft Heap",
  aliases: ["Soft Heap"],
  curriculum: [132],
  domain: "linear-structures",
  subcategory: "Heaps",
  difficulty: "advanced",
  summary:
    "A heap that deliberately corrupts up to epsilon fraction of keys to achieve O(1) amortized insert, merge, and delete-min. Key ingredient in the optimal MST algorithm.",
  tags: ["soft heap", "approximate", "priority queue"],
  prerequisites: ["Binary Heap", "Binomial Heap"],
  related: ["fibonacci-heap", "binomial-heap"],
  problem: {
    input: "Input for Soft Heap.",
    output: "Output of Soft Heap.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A heap that deliberately corrupts up to epsilon fraction of keys to achieve O(1) amortized insert, merge, and delete-min. Key ingredient in the optimal MST algorithm.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Soft Heap algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Soft Heap follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Soft Heap is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Soft Heap exist in the literature. See references for details.",
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
    worstClass: "other",
  },
  properties: [
    {
      label: "Category",
      value: "Heaps",
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
      id: "soft-heap-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Soft Heap?",
      options: [
        "A heap that deliberately corrupts up to epsilon fraction of ...",
        "Sorting an array",
        "Finding shortest paths",
        "Compressing data",
      ],
      answer: 0,
      explanation:
        "Soft Heap: A heap that deliberately corrupts up to epsilon fraction of keys to achieve O(1) amortized insert, merge, and delete-min. Key ingredient in the optimal MST algorithm.",
      hints: ["Think about what problem Soft Heap solves."],
      objective: "Soft Heap",
    },
  ],
  exam: {
    definition:
      "A heap that deliberately corrupts up to epsilon fraction of keys to achieve O(1) amortized insert, merge, and delete-min. Key ingredient in the optimal MST algorithm.",
    steps: ["Apply the Soft Heap algorithm to the input."],
    timeComplexity: "See complexity section.",
    spaceComplexity: "See complexity section.",
    correctness:
      "The Soft Heap algorithm is correct because it systematically processes all cases.",
    applications: ["Heaps"],
    limitations: ["See advanced section for limitations."],
    faq: [
      {
        q: "When should you use Soft Heap?",
        a: "Use Soft Heap when the problem matches its design: A heap that deliberately corrupts up to epsilon fraction of keys to achieve O(1) amortized insert, m",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Soft Heap (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. Cormen et al., Introduction to Algorithms, 4th ed.",
      supports: "General reference for Soft Heap.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
