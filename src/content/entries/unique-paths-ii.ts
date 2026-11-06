import type { AlgorithmEntry } from "../types";

export const uniquePathsIiEntry: AlgorithmEntry = {
  slug: "unique-paths-ii",
  name: "Unique Paths II",
  aliases: ["Unique Paths II", "Grid paths with obstacles"],
  curriculum: [282],
  domain: "dynamic-programming",
  subcategory: "Grid DP",
  difficulty: "intermediate",
  summary:
    "Counts unique paths in a grid with obstacles. Cells marked as obstacles cannot be traversed.",
  tags: ["grid", "paths", "obstacles", "dynamic programming"],
  prerequisites: ["Unique Paths"],
  related: ["unique-paths", "minimum-path-sum"],
  problem: {
    input: "A 2D grid where 0 = free, 1 = obstacle.",
    output: "Number of unique paths from top-left to bottom-right avoiding obstacles.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Same as Unique Paths, but if a cell is an obstacle, it contributes 0 paths. An obstacle blocks all paths through it.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "If start or end is an obstacle, return 0.",
          "dp[0][0] = 1. First row/column: dp = 1 until an obstacle, then 0.",
          "For obstacle cells: dp[i][j] = 0. Otherwise dp[i][j] = dp[i-1][j] + dp[i][j-1].",
          "Return dp[m-1][n-1].",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Use 1D DP array. Set dp[j] = 0 when grid[i][j] is an obstacle.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Time $O(mn)$, space $O(n)$. Same as Unique Paths but with obstacle handling.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Can extend to count paths with exactly k obstacles removed.",
          "Related to shortest path in a grid with BFS.",
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
      label: "Pattern",
      value: "Grid DP with blocked cells",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "unique_paths_ii",
      code: `def unique_paths_ii(grid):
    m, n = len(grid), len(grid[0])
    if grid[0][0] == 1 or grid[m-1][n-1] == 1:
        return 0
    dp = [0] * n
    dp[0] = 1
    for i in range(m):
        for j in range(n):
            if grid[i][j] == 1:
                dp[j] = 0
            elif j > 0:
                dp[j] += dp[j - 1]
    return dp[n - 1]
`,
      tests: [
        {
          args: [
            [
              [0, 0, 0],
              [0, 1, 0],
              [0, 0, 0],
            ],
          ],
          expected: 2,
        },
        {
          args: [
            [
              [0, 1],
              [0, 0],
            ],
          ],
          expected: 1,
        },
        {
          args: [[[1, 0]]],
          expected: 0,
        },
      ],
    },
    {
      language: "javascript",
      entry: "uniquePathsII",
      code: `function uniquePathsII(grid) {
  const m = grid.length, n = grid[0].length;
  if (grid[0][0] === 1 || grid[m-1][n-1] === 1) return 0;
  const dp = new Array(n).fill(0);
  dp[0] = 1;
  for (let i = 0; i < m; i++)
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 1) dp[j] = 0;
      else if (j > 0) dp[j] += dp[j - 1];
    }
  return dp[n - 1];
}
`,
      tests: [
        {
          args: [
            [
              [0, 0, 0],
              [0, 1, 0],
              [0, 0, 0],
            ],
          ],
          expected: 2,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "unique-paths-ii-q1",
      kind: "mcq",
      prompt: "If the start cell is an obstacle, what is the answer?",
      options: ["0", "1", "-1", "Undefined"],
      answer: 0,
      explanation: "No path can begin from an obstacle.",
      hints: ["Think about what happens at (0,0)."],
      objective: "Edge case",
    },
  ],
  exam: {
    definition: "Count unique paths in a grid avoiding obstacle cells.",
    steps: [
      "Check start/end.",
      "dp[i][j] = 0 if obstacle, else dp[i-1][j] + dp[i][j-1].",
      "Return dp[m-1][n-1].",
    ],
    timeComplexity: "$O(mn)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "Obstacles contribute 0, correctly blocking all paths through them.",
    applications: ["robotics path planning", "maze solving"],
    limitations: ["Only right and down moves"],
    faq: [
      {
        q: "How to handle multiple obstacles?",
        a: "Each obstacle cell sets dp=0, naturally blocking all paths through it.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Obstacle handling (1).", "DP recurrence (2).", "Space optimization (2)."],
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
