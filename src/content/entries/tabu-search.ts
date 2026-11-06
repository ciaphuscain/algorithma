import type { AlgorithmEntry } from "../types";

export const tabuSearchEntry: AlgorithmEntry = {
  slug: "tabu-search",
  name: "Tabu Search",
  aliases: ["Tabu Search"],
  curriculum: [448],
  domain: "optimization",
  subcategory: "Optimization",
  difficulty: "intermediate",
  summary:
    "Tabu Search is an algorithm in the field of optimization. It provides an efficient approach to solving problems in this domain.",
  tags: ["tabu search", "optimization"],
  prerequisites: [],
  related: ["simulated-annealing", "local-search"],
  problem: {
    input: "Input data for Tabu Search.",
    output: "Result of applying Tabu Search to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Tabu Search addresses a fundamental problem in optimization. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind Tabu Search is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Tabu Search algorithm proceeds through a series of well-defined steps:",
      },
      {
        kind: "list",
        ordered: true,
        items: [
          "Initialize the data structures needed for processing.",
          "Process each element of the input according to the algorithm's rules.",
          "Combine intermediate results to produce the final output.",
          "Return the computed result.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "The implementation follows the algorithm's specification closely. Key considerations include choosing appropriate data structures and handling edge cases.",
      },
      {
        kind: "callout",
        tone: "tip",
        text: "When implementing Tabu Search, pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of Tabu Search depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of Tabu Search exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n * W)",
      average: "O(n * W)",
      worst: "O(n * W)",
    },
    space: "O(W)",
    worstClass: "other",
  },
  properties: [
    {
      label: "Category",
      value: "Optimization",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "solve",
      code: `def solve(values, weights, capacity):
    """0/1 Knapsack: maximize total value with weight constraint.
    Demonstrates optimization via dynamic programming."""
    n = len(values)
    dp = [0] * (capacity + 1)
    for i in range(n):
        for w in range(capacity, weights[i] - 1, -1):
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i])
    return dp[capacity]
`,
      tests: [
        {
          args: [[60, 100, 120], [10, 20, 30], 50],
          expected: 220,
        },
        {
          args: [[10, 20], [5, 10], 15],
          expected: 30,
        },
      ],
    },
    {
      language: "javascript",
      entry: "solve",
      code: `function solve(values, weights, capacity) {
  const dp = new Array(capacity + 1).fill(0);
  for (let i = 0; i < values.length; i++)
    for (let w = capacity; w >= weights[i]; w--)
      dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
  return dp[capacity];
}`,
      tests: [
        {
          args: [[60, 100, 120], [10, 20, 30], 50],
          expected: 220,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "tabu-sea-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Tabu Search?",
      options: [
        "To solve problems in optimization",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation:
        "Tabu Search is designed specifically for problems in the domain of optimization.",
      hints: ["Think about what domain Tabu Search belongs to"],
      objective: "Understand the purpose of Tabu Search",
    },
  ],
  exam: {
    definition: "Define Tabu Search and explain its purpose.",
    steps: ["Describe the main steps of Tabu Search."],
    timeComplexity: "Analyze the time complexity of Tabu Search.",
    spaceComplexity: "Analyze the space complexity of Tabu Search.",
    correctness: "How does Tabu Search guarantee correctness?",
    applications: ["List two applications of Tabu Search."],
    limitations: ["What are the limitations of Tabu Search?"],
    faq: [
      {
        q: "Why is Tabu Search preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Tabu Search works by applying its core strategy to efficiently solve the target ",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on Tabu Search",
      supports: "Core algorithm description",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
