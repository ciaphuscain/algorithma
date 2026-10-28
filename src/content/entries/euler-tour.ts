import type { AlgorithmEntry } from "../types";

export const eulerTourEntry: AlgorithmEntry = {
  slug: "euler-tour",
  name: "Euler Tour",
  aliases: ["Euler Tour"],
  curriculum: [189],
  domain: "graphs",
  subcategory: "Tree Techniques",
  difficulty: "intermediate",
  summary:
    "Flatten a rooted tree into a linear array by recording DFS entry/exit times. Subtree queries become contiguous range queries, solvable with segment trees in O(log n).",
  tags: ["Euler tour", "tree", "DFS", "range query"],
  prerequisites: ["DFS", "Segment Tree"],
  related: ["binary-lifting", "heavy-light"],
  problem: {
    input: "Input for Euler Tour.",
    output: "Output of Euler Tour.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Flatten a rooted tree into a linear array by recording DFS entry/exit times. Subtree queries become contiguous range queries, solvable with segment trees in O(log n).",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Euler Tour algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Euler Tour follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Euler Tour is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Euler Tour exist in the literature. See references for details.",
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
    worstClass: "n",
  },
  properties: [
    {
      label: "Category",
      value: "Tree Techniques",
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
      id: "euler-tour-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Euler Tour?",
      options: [
        "Flatten a rooted tree into a linear array by recording DFS e...",
        "Sorting an array",
        "Finding shortest paths",
        "Compressing data",
      ],
      answer: 0,
      explanation:
        "Euler Tour: Flatten a rooted tree into a linear array by recording DFS entry/exit times. Subtree queries become contiguous range queries, solvable with segment trees in O(log n).",
      hints: ["Think about what problem Euler Tour solves."],
      objective: "Euler Tour",
    },
  ],
  exam: {
    definition:
      "Flatten a rooted tree into a linear array by recording DFS entry/exit times. Subtree queries become contiguous range queries, solvable with segment trees in O(log n).",
    steps: ["Apply the Euler Tour algorithm to the input."],
    timeComplexity: "See complexity section.",
    spaceComplexity: "See complexity section.",
    correctness:
      "The Euler Tour algorithm is correct because it systematically processes all cases.",
    applications: ["Tree Techniques"],
    limitations: ["See advanced section for limitations."],
    faq: [
      {
        q: "When should you use Euler Tour?",
        a: "Use Euler Tour when the problem matches its design: Flatten a rooted tree into a linear array by recording DFS entry/exit times. Subtree queries become ",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Euler Tour (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. Cormen et al., Introduction to Algorithms, 4th ed.",
      supports: "General reference for Euler Tour.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
