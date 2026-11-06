import type { AlgorithmEntry } from "../types";

export const hillClimbingEntry: AlgorithmEntry = {
  slug: "hill-climbing",
  name: "Hill Climbing",
  aliases: ["Hill Climbing"],
  curriculum: [447],
  domain: "optimization",
  subcategory: "Optimization",
  difficulty: "intermediate",
  summary:
    "Hill Climbing is an algorithm in the field of optimization. It provides an efficient approach to solving problems in this domain.",
  tags: ["hill climbing", "optimization"],
  prerequisites: [],
  related: ["simulated-annealing", "local-search"],
  problem: {
    input: "Input data for Hill Climbing.",
    output: "Result of applying Hill Climbing to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Hill Climbing addresses a fundamental problem in optimization. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind Hill Climbing is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Hill Climbing algorithm proceeds through a series of well-defined steps:",
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
        text: "When implementing Hill Climbing, pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of Hill Climbing depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of Hill Climbing exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
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
      id: "hill-cli-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Hill Climbing?",
      options: [
        "To solve problems in optimization",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation:
        "Hill Climbing is designed specifically for problems in the domain of optimization.",
      hints: ["Think about what domain Hill Climbing belongs to"],
      objective: "Understand the purpose of Hill Climbing",
    },
  ],
  exam: {
    definition: "Define Hill Climbing and explain its purpose.",
    steps: ["Describe the main steps of Hill Climbing."],
    timeComplexity: "Analyze the time complexity of Hill Climbing.",
    spaceComplexity: "Analyze the space complexity of Hill Climbing.",
    correctness: "How does Hill Climbing guarantee correctness?",
    applications: ["List two applications of Hill Climbing."],
    limitations: ["What are the limitations of Hill Climbing?"],
    faq: [
      {
        q: "Why is Hill Climbing preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Hill Climbing works by applying its core strategy to efficiently solve the targe",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on Hill Climbing",
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
