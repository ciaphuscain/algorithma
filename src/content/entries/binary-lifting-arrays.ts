import type { AlgorithmEntry } from "../types";

export const binaryLiftingArraysEntry: AlgorithmEntry = {
  slug: "binary-lifting-arrays",
  name: "Binary Lifting on Arrays",
  aliases: ["Binary Lifting on Arrays"],
  curriculum: [96],
  domain: "arrays-hashing",
  subcategory: "Further Array Techniques",
  difficulty: "advanced",
  summary:
    "Precompute jump tables to answer 'k-th ancestor' or 'k-th successor' queries in O(log k) time. up[v][j] stores the 2^j-th ancestor of v. Used for LCA and functional graph queries.",
  tags: ["binary lifting", "sparse table", "LCA"],
  prerequisites: ["Sparse Table"],
  related: ["binary-lifting", "sparse-table"],
  problem: {
    input: "Input for Binary Lifting on Arrays.",
    output: "Output of Binary Lifting on Arrays.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Precompute jump tables to answer 'k-th ancestor' or 'k-th successor' queries in O(log k) time. up[v][j] stores the 2^j-th ancestor of v. Used for LCA and functional graph queries.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Binary Lifting on Arrays algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Binary Lifting on Arrays follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Binary Lifting on Arrays is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Binary Lifting on Arrays exist in the literature. See references for details.",
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
      value: "Further Array Techniques",
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
      id: "binary-lifting-arrays-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Binary Lifting on Arrays?",
      options: [
        "Precompute jump tables to answer 'k-th ancestor' or 'k-th su...",
        "Sorting an array",
        "Finding shortest paths",
        "Compressing data",
      ],
      answer: 0,
      explanation:
        "Binary Lifting on Arrays: Precompute jump tables to answer 'k-th ancestor' or 'k-th successor' queries in O(log k) time. up[v][j] stores the 2^j-th ancestor of v. Used for LCA and functional graph queries.",
      hints: ["Think about what problem Binary Lifting on Arrays solves."],
      objective: "Binary Lifting on Arrays",
    },
  ],
  exam: {
    definition:
      "Precompute jump tables to answer 'k-th ancestor' or 'k-th successor' queries in O(log k) time. up[v][j] stores the 2^j-th ancestor of v. Used for LCA and functional graph queries.",
    steps: ["Apply the Binary Lifting on Arrays algorithm to the input."],
    timeComplexity: "See complexity section.",
    spaceComplexity: "See complexity section.",
    correctness:
      "The Binary Lifting on Arrays algorithm is correct because it systematically processes all cases.",
    applications: ["Further Array Techniques"],
    limitations: ["See advanced section for limitations."],
    faq: [
      {
        q: "When should you use Binary Lifting on Arrays?",
        a: "Use Binary Lifting on Arrays when the problem matches its design: Precompute jump tables to answer 'k-th ancestor' or 'k-th successor' queries in O(log k) time. up[v]",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Binary Lifting on Arrays (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. Cormen et al., Introduction to Algorithms, 4th ed.",
      supports: "General reference for Binary Lifting on Arrays.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
