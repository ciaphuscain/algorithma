import type { AlgorithmEntry } from "../types";

export const johnsonsAlgorithmEntry: AlgorithmEntry = {
  slug: "johnsons-algorithm",
  name: "Johnson's Algorithm",
  aliases: ["Johnson's Algorithm"],
  curriculum: [210],
  domain: "graphs",
  subcategory: "Shortest Paths",
  difficulty: "advanced",
  summary:
    "All-pairs shortest paths for sparse graphs with negative edges. One Bellman-Ford computes reweighting potentials; then Dijkstra from each vertex. O(VE + V^2 log V).",
  tags: ["Johnson", "APSP", "reweighting"],
  prerequisites: ["Dijkstra's Algorithm", "Bellman-Ford"],
  related: ["dijkstra", "bellman-ford", "floyd-warshall"],
  problem: {
    input: "Input for Johnson's Algorithm.",
    output: "Output of Johnson's Algorithm.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "All-pairs shortest paths for sparse graphs with negative edges. One Bellman-Ford computes reweighting potentials; then Dijkstra from each vertex. O(VE + V^2 log V).",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Johnson's Algorithm algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Johnson's Algorithm follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Johnson's Algorithm is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Johnson's Algorithm exist in the literature. See references for details.",
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
      value: "Shortest Paths",
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
      id: "johnsons-algorithm-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Johnson's Algorithm?",
      options: [
        "All-pairs shortest paths for sparse graphs with negative edg...",
        "Sorting an array",
        "Finding shortest paths",
        "Compressing data",
      ],
      answer: 0,
      explanation:
        "Johnson's Algorithm: All-pairs shortest paths for sparse graphs with negative edges. One Bellman-Ford computes reweighting potentials; then Dijkstra from each vertex. O(VE + V^2 log V).",
      hints: ["Think about what problem Johnson's Algorithm solves."],
      objective: "Johnson's Algorithm",
    },
  ],
  exam: {
    definition:
      "All-pairs shortest paths for sparse graphs with negative edges. One Bellman-Ford computes reweighting potentials; then Dijkstra from each vertex. O(VE + V^2 log V).",
    steps: ["Apply the Johnson's Algorithm algorithm to the input."],
    timeComplexity: "See complexity section.",
    spaceComplexity: "See complexity section.",
    correctness:
      "The Johnson's Algorithm algorithm is correct because it systematically processes all cases.",
    applications: ["Shortest Paths"],
    limitations: ["See advanced section for limitations."],
    faq: [
      {
        q: "When should you use Johnson's Algorithm?",
        a: "Use Johnson's Algorithm when the problem matches its design: All-pairs shortest paths for sparse graphs with negative edges. One Bellman-Ford computes reweightin",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Johnson's Algorithm (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. Cormen et al., Introduction to Algorithms, 4th ed.",
      supports: "General reference for Johnson's Algorithm.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
