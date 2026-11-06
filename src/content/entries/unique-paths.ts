import type { AlgorithmEntry } from "../types";

export const uniquePathsEntry: AlgorithmEntry = {
  slug: "unique-paths",
  name: "Unique Paths",
  aliases: ["Unique Paths", "Grid paths"],
  curriculum: [281],
  domain: "dynamic-programming",
  subcategory: "Grid DP",
  difficulty: "beginner",
  summary:
    "Counts the number of unique paths from the top-left to the bottom-right of an m×n grid, moving only right or down.",
  tags: ["grid", "paths", "dynamic programming", "combinatorics"],
  prerequisites: ["Climbing Stairs"],
  related: ["unique-paths-ii", "minimum-path-sum"],
  problem: {
    input: "Two integers m and n (grid dimensions).",
    output: "Number of unique paths from (0,0) to (m-1,n-1).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Each cell can be reached from above or from the left. The number of paths to any cell is the sum of paths to those two neighbors.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "dp[0][j] = 1 for all j (only one way along the top row).",
          "dp[i][0] = 1 for all i (only one way along the left column).",
          "dp[i][j] = dp[i-1][j] + dp[i][j-1].",
          "Return dp[m-1][n-1].",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Use a single row of size n, updated left to right: dp[j] += dp[j-1].",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The answer is $\\binom{m+n-2}{m-1}$ — choose which m-1 of the m+n-2 steps go down. DP takes $O(mn)$ time, $O(n)$ space.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Combinatorial formula gives O(min(m,n)) time.",
          "Unique Paths II adds obstacles.",
          "Generalize to 3D or k-dimensional grids.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(m * n)",
      average: "O(m * n)",
      worst: "O(m * n)",
    },
    space: "O(n)",
    worstClass: "other",
  },
  properties: [
    {
      label: "Formula",
      value: "C(m+n-2, m-1)",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "unique_paths",
      code: `def unique_paths(m, n):
    dp = [1] * n
    for i in range(1, m):
        for j in range(1, n):
            dp[j] += dp[j - 1]
    return dp[n - 1]
`,
      tests: [
        {
          args: [3, 7],
          expected: 28,
        },
        {
          args: [3, 2],
          expected: 3,
        },
        {
          args: [1, 1],
          expected: 1,
        },
      ],
    },
    {
      language: "javascript",
      entry: "uniquePaths",
      code: `function uniquePaths(m, n) {
  const dp = new Array(n).fill(1);
  for (let i = 1; i < m; i++)
    for (let j = 1; j < n; j++) dp[j] += dp[j - 1];
  return dp[n - 1];
}
`,
      tests: [
        {
          args: [3, 7],
          expected: 28,
        },
        {
          args: [3, 2],
          expected: 3,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "unique-paths-q1",
      kind: "mcq",
      prompt: "How many unique paths in a 3×3 grid?",
      options: ["6", "4", "9", "8"],
      answer: 0,
      explanation: "C(4,2) = 6. Need 2 downs and 2 rights in any order.",
      hints: ["Count: RRDD, RDRD, RDDR, DRRD, DRDR, DDRR."],
      objective: "Counting",
    },
  ],
  exam: {
    definition: "Count paths in m×n grid moving only right or down.",
    steps: [
      "Init top row and left column to 1.",
      "dp[i][j] = dp[i-1][j] + dp[i][j-1].",
      "Return dp[m-1][n-1].",
    ],
    timeComplexity: "$O(mn)$.",
    spaceComplexity: "$O(n)$ with rolling array.",
    correctness: "Each cell's path count is the sum of paths from above and from the left.",
    applications: ["combinatorics", "lattice paths"],
    limitations: ["No obstacles"],
    faq: [
      {
        q: "Can this be computed without DP?",
        a: "Yes, C(m+n-2, m-1) in O(min(m,n)) time.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define recurrence (1).",
          "DP with space optimization (2).",
          "Combinatorial formula (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "Dynamic programming.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
