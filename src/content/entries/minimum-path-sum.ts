import type { AlgorithmEntry } from "../types";

export const minimumPathSumEntry: AlgorithmEntry = {
  slug: "minimum-path-sum",
  name: "Minimum Path Sum",
  aliases: ["Minimum Path Sum", "Grid minimum cost path"],
  curriculum: [280],
  domain: "dynamic-programming",
  subcategory: "Grid DP",
  difficulty: "beginner",
  summary:
    "Finds the path from top-left to bottom-right of a grid that minimizes the sum of values along the path, moving only right or down.",
  tags: ["grid", "minimum path", "dynamic programming"],
  prerequisites: ["Unique Paths"],
  related: ["unique-paths", "dungeon-game"],
  problem: {
    input: "A 2D grid of non-negative integers.",
    output: "Minimum sum path from (0,0) to (m-1,n-1).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Each cell's minimum path sum is its value plus the minimum of the path sums from above and from the left.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "dp[0][0] = grid[0][0].",
          "First row: dp[0][j] = dp[0][j-1] + grid[0][j].",
          "First col: dp[i][0] = dp[i-1][0] + grid[i][0].",
          "dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1]).",
          "Return dp[m-1][n-1].",
        ],
      },
      {
        kind: "p",
        text: "**Example.** [[1,3,1],[1,5,1],[4,2,1]]: path 1→3→1→1→1 = 7.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Can modify grid in-place or use a 1D DP array.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Time $O(mn)$, space $O(1)$ if modifying grid in-place, $O(n)$ otherwise.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Dungeon Game reverses direction (dp from bottom-right).",
          "With negative values, need more careful handling.",
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
      value: "Grid DP with min aggregation",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "min_path_sum",
      code: `def min_path_sum(grid):
    m, n = len(grid), len(grid[0])
    dp = [0] * n
    dp[0] = grid[0][0]
    for j in range(1, n):
        dp[j] = dp[j-1] + grid[0][j]
    for i in range(1, m):
        dp[0] += grid[i][0]
        for j in range(1, n):
            dp[j] = grid[i][j] + min(dp[j], dp[j-1])
    return dp[n-1]
`,
      tests: [
        {
          args: [
            [
              [1, 3, 1],
              [1, 5, 1],
              [4, 2, 1],
            ],
          ],
          expected: 7,
        },
        {
          args: [
            [
              [1, 2],
              [3, 4],
            ],
          ],
          expected: 7,
        },
      ],
    },
    {
      language: "javascript",
      entry: "minPathSum",
      code: `function minPathSum(grid) {
  const m = grid.length, n = grid[0].length;
  const dp = new Array(n).fill(0);
  dp[0] = grid[0][0];
  for (let j = 1; j < n; j++) dp[j] = dp[j-1] + grid[0][j];
  for (let i = 1; i < m; i++) {
    dp[0] += grid[i][0];
    for (let j = 1; j < n; j++) dp[j] = grid[i][j] + Math.min(dp[j], dp[j-1]);
  }
  return dp[n-1];
}
`,
      tests: [
        {
          args: [
            [
              [1, 3, 1],
              [1, 5, 1],
              [4, 2, 1],
            ],
          ],
          expected: 7,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "min-path-sum-q1",
      kind: "mcq",
      prompt: "For grid [[1,2,3],[4,5,6]], what is the minimum path sum?",
      options: ["12", "15", "14", "10"],
      answer: 0,
      explanation: "Path: 1→2→3→6 = 12.",
      hints: ["Only move right or down."],
      objective: "Computation",
    },
  ],
  exam: {
    definition: "Find minimum cost path in a grid moving right or down.",
    steps: [
      "Init first row/col cumulatively.",
      "dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1]).",
      "Return dp[m-1][n-1].",
    ],
    timeComplexity: "$O(mn)$.",
    spaceComplexity: "$O(n)$.",
    correctness:
      "Optimal substructure: best path to (i,j) comes from the better of (i-1,j) and (i,j-1).",
    applications: ["image processing", "cost optimization"],
    limitations: ["Only right and down moves"],
    faq: [
      {
        q: "Can we modify the grid in-place?",
        a: "Yes, for O(1) extra space, but it destroys the input.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Define recurrence (1).", "Show DP solution (2).", "Space optimization (2)."],
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
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
