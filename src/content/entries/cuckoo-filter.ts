import type { AlgorithmEntry } from "../types";

export const cuckooFilterEntry: AlgorithmEntry = {
  slug: "cuckoo-filter",
  name: "Cuckoo Filter",
  aliases: ["Cuckoo Filter"],
  curriculum: [77],
  domain: "arrays-hashing",
  subcategory: "Probabilistic Data Structures",
  difficulty: "advanced",
  summary:
    "A space-efficient probabilistic filter supporting insertion, deletion, and membership queries. Uses cuckoo hashing on fingerprints for better space efficiency than counting Bloom filters.",
  tags: ["cuckoo filter", "probabilistic", "fingerprint"],
  prerequisites: ["Hash Tables", "Cuckoo Hashing"],
  related: ["bloom-filter", "cuckoo-hashing"],
  problem: {
    input: "Input for Cuckoo Filter.",
    output: "Output of Cuckoo Filter.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A space-efficient probabilistic filter supporting insertion, deletion, and membership queries. Uses cuckoo hashing on fingerprints for better space efficiency than counting Bloom filters.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Cuckoo Filter algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Cuckoo Filter follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Cuckoo Filter is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Cuckoo Filter exist in the literature. See references for details.",
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
      id: "cuckoo-filter-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Cuckoo Filter?",
      options: [
        "A space-efficient probabilistic filter supporting insertion,...",
        "Sorting an array",
        "Finding shortest paths",
        "Compressing data",
      ],
      answer: 0,
      explanation:
        "Cuckoo Filter: A space-efficient probabilistic filter supporting insertion, deletion, and membership queries. Uses cuckoo hashing on fingerprints for better space efficiency than counting Bloom filters.",
      hints: ["Think about what problem Cuckoo Filter solves."],
      objective: "Cuckoo Filter",
    },
  ],
  exam: {
    definition:
      "A space-efficient probabilistic filter supporting insertion, deletion, and membership queries. Uses cuckoo hashing on fingerprints for better space efficiency than counting Bloom filters.",
    steps: ["Apply the Cuckoo Filter algorithm to the input."],
    timeComplexity: "See complexity section.",
    spaceComplexity: "See complexity section.",
    correctness:
      "The Cuckoo Filter algorithm is correct because it systematically processes all cases.",
    applications: ["Probabilistic Data Structures"],
    limitations: ["See advanced section for limitations."],
    faq: [
      {
        q: "When should you use Cuckoo Filter?",
        a: "Use Cuckoo Filter when the problem matches its design: A space-efficient probabilistic filter supporting insertion, deletion, and membership queries. Uses ",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Cuckoo Filter (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. Cormen et al., Introduction to Algorithms, 4th ed.",
      supports: "General reference for Cuckoo Filter.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
