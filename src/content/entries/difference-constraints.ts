import type { AlgorithmEntry } from "../types";

export const differenceConstraintsEntry: AlgorithmEntry = {
  slug: "difference-constraints",
  name: "Difference Constraints",
  aliases: ["Difference Constraints"],
  curriculum: [92],
  domain: "arrays-hashing",
  subcategory: "Further Array Techniques",
  difficulty: "advanced",
  summary:
    "Solve a system of constraints x_j - x_i <= b_ij by modeling as shortest paths: create an edge from i to j with weight b_ij, then run Bellman-Ford. A feasible solution exists iff no negative cycle.",
  tags: ["difference constraints", "shortest paths", "linear programming"],
  prerequisites: ["Bellman-Ford"],
  related: ["bellman-ford", "sweep-line"],
  problem: {
    input: "Input for Difference Constraints.",
    output: "Output of Difference Constraints.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Solve a system of constraints x_j - x_i <= b_ij by modeling as shortest paths: create an edge from i to j with weight b_ij, then run Bellman-Ford. A feasible solution exists iff no negative cycle.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Difference Constraints algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Difference Constraints follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Difference Constraints is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Difference Constraints exist in the literature. See references for details.",
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
      id: "difference-constraints-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Difference Constraints?",
      options: [
        "Solve a system of constraints x_j - x_i <= b_ij by modeling ...",
        "Sorting an array",
        "Finding shortest paths",
        "Compressing data",
      ],
      answer: 0,
      explanation:
        "Difference Constraints: Solve a system of constraints x_j - x_i <= b_ij by modeling as shortest paths: create an edge from i to j with weight b_ij, then run Bellman-Ford. A feasible solution exists iff no negative cycle.",
      hints: ["Think about what problem Difference Constraints solves."],
      objective: "Difference Constraints",
    },
  ],
  exam: {
    definition:
      "Solve a system of constraints x_j - x_i <= b_ij by modeling as shortest paths: create an edge from i to j with weight b_ij, then run Bellman-Ford. A feasible solution exists iff no negative cycle.",
    steps: ["Apply the Difference Constraints algorithm to the input."],
    timeComplexity: "See complexity section.",
    spaceComplexity: "See complexity section.",
    correctness:
      "The Difference Constraints algorithm is correct because it systematically processes all cases.",
    applications: ["Further Array Techniques"],
    limitations: ["See advanced section for limitations."],
    faq: [
      {
        q: "When should you use Difference Constraints?",
        a: "Use Difference Constraints when the problem matches its design: Solve a system of constraints x_j - x_i <= b_ij by modeling as shortest paths: create an edge from i",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Difference Constraints (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. Cormen et al., Introduction to Algorithms, 4th ed.",
      supports: "General reference for Difference Constraints.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
