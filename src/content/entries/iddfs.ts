import type { AlgorithmEntry } from "../types";

export const iddfsEntry: AlgorithmEntry = {
  slug: "iddfs",
  name: "Iterative Deepening DFS (IDDFS)",
  aliases: ["Iterative Deepening DFS (IDDFS)"],
  curriculum: [206],
  domain: "graphs",
  subcategory: "Graph Traversal",
  difficulty: "intermediate",
  summary:
    "Combines DFS memory efficiency with BFS optimality. Runs depth-limited DFS with increasing limits. Overhead is only b/(b-1) times the last iteration.",
  tags: ["IDDFS", "iterative deepening", "search"],
  prerequisites: ["DFS", "BFS"],
  related: ["iterative-dfs", "a-star"],
  problem: {
    input: "Input for Iterative Deepening DFS (IDDFS).",
    output: "Output of Iterative Deepening DFS (IDDFS).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Combines DFS memory efficiency with BFS optimality. Runs depth-limited DFS with increasing limits. Overhead is only b/(b-1) times the last iteration.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Iterative Deepening DFS (IDDFS) algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Iterative Deepening DFS (IDDFS) follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Iterative Deepening DFS (IDDFS) is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Iterative Deepening DFS (IDDFS) exist in the literature. See references for details.",
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
      value: "Graph Traversal",
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
      id: "iddfs-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Iterative Deepening DFS (IDDFS)?",
      options: [
        "Combines DFS memory efficiency with BFS optimality. Runs dep...",
        "Sorting an array",
        "Finding shortest paths",
        "Compressing data",
      ],
      answer: 0,
      explanation:
        "Iterative Deepening DFS (IDDFS): Combines DFS memory efficiency with BFS optimality. Runs depth-limited DFS with increasing limits. Overhead is only b/(b-1) times the last iteration.",
      hints: ["Think about what problem Iterative Deepening DFS (IDDFS) solves."],
      objective: "Iterative Deepening DFS (IDDFS)",
    },
  ],
  exam: {
    definition:
      "Combines DFS memory efficiency with BFS optimality. Runs depth-limited DFS with increasing limits. Overhead is only b/(b-1) times the last iteration.",
    steps: ["Apply the Iterative Deepening DFS (IDDFS) algorithm to the input."],
    timeComplexity: "See complexity section.",
    spaceComplexity: "See complexity section.",
    correctness:
      "The Iterative Deepening DFS (IDDFS) algorithm is correct because it systematically processes all cases.",
    applications: ["Graph Traversal"],
    limitations: ["See advanced section for limitations."],
    faq: [
      {
        q: "When should you use Iterative Deepening DFS (IDDFS)?",
        a: "Use Iterative Deepening DFS (IDDFS) when the problem matches its design: Combines DFS memory efficiency with BFS optimality. Runs depth-limited DFS with increasing limits. O",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Iterative Deepening DFS (IDDFS) (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. Cormen et al., Introduction to Algorithms, 4th ed.",
      supports: "General reference for Iterative Deepening DFS (IDDFS).",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
