import type { AlgorithmEntry } from "../types";

export const dungeonGameEntry: AlgorithmEntry = {
  slug: "dungeon-game",
  name: "Dungeon Game",
  aliases: ["Minimum HP to Traverse Grid"],
  curriculum: [286],
  domain: "dynamic-programming",
  subcategory: "Grid DP",
  difficulty: "intermediate",
  summary:
    "Find minimum initial health to reach bottom-right of a grid, with cells adding or subtracting HP. Work backwards: dp[i][j] = max(1, min(dp[i+1][j], dp[i][j+1]) - grid[i][j]).",
  tags: ["grid DP", "dynamic programming", "backwards DP"],
  prerequisites: ["minimum-path-sum"],
  related: ["minimum-path-sum", "cherry-pickup"],
  problem: {
    input: "A grid of integers (negative = damage, positive = healing).",
    output:
      "Minimum initial HP (at least 1 at all times) to traverse from top-left to bottom-right.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Forward DP fails because minimizing cost doesn't guarantee survival at every step. Working backwards from the destination tells us exactly how much HP we need at each cell.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "dp[m-1][n-1] = max(1, 1 - grid[m-1][n-1]).",
          "Fill last row/col: dp[i][j] = max(1, dp[next] - grid[i][j]).",
          "General: dp[i][j] = max(1, min(dp[i+1][j], dp[i][j+1]) - grid[i][j]).",
          "Return dp[0][0].",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "O(mn) time and space. Can reduce to O(n) space with a single row.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Time $O(mn)$, space $O(n)$.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "The backwards formulation is key: forward DP would need to track both min-HP-seen and current-HP, making it 2D per cell.",
      },
    ],
  },
  complexity: {
    time: { best: "O(m·n)", average: "O(m·n)", worst: "O(m·n)" },
    space: "O(n)",
    worstClass: "other",
  },
  properties: [],
  implementations: [
    {
      language: "python",
      entry: "calculateMinimumHP",
      code: `def calculateMinimumHP(dungeon):
    m, n = len(dungeon), len(dungeon[0])
    dp = [[0] * n for _ in range(m)]
    dp[m-1][n-1] = max(1, 1 - dungeon[m-1][n-1])
    for i in range(m - 2, -1, -1):
        dp[i][n-1] = max(1, dp[i+1][n-1] - dungeon[i][n-1])
    for j in range(n - 2, -1, -1):
        dp[m-1][j] = max(1, dp[m-1][j+1] - dungeon[m-1][j])
    for i in range(m - 2, -1, -1):
        for j in range(n - 2, -1, -1):
            dp[i][j] = max(1, min(dp[i+1][j], dp[i][j+1]) - dungeon[i][j])
    return dp[0][0]`,
      tests: [
        {
          args: [
            [
              [-2, -3, 3],
              [-5, -10, 1],
              [10, 30, -5],
            ],
          ],
          expected: 7,
        },
        {
          args: [[[0]]],
          expected: 1,
        },
      ],
    },
    {
      language: "javascript",
      entry: "calculateMinimumHP",
      code: `function calculateMinimumHP(dungeon) {
  const m = dungeon.length, n = dungeon[0].length;
  const dp = Array.from({length: m}, () => new Array(n).fill(0));
  dp[m-1][n-1] = Math.max(1, 1 - dungeon[m-1][n-1]);
  for (let i = m - 2; i >= 0; i--) dp[i][n-1] = Math.max(1, dp[i+1][n-1] - dungeon[i][n-1]);
  for (let j = n - 2; j >= 0; j--) dp[m-1][j] = Math.max(1, dp[m-1][j+1] - dungeon[m-1][j]);
  for (let i = m - 2; i >= 0; i--) {
    for (let j = n - 2; j >= 0; j--) {
      dp[i][j] = Math.max(1, Math.min(dp[i+1][j], dp[i][j+1]) - dungeon[i][j]);
    }
  }
  return dp[0][0];
}`,
      tests: [
        {
          args: [
            [
              [-2, -3, 3],
              [-5, -10, 1],
              [10, 30, -5],
            ],
          ],
          expected: 7,
        },
        {
          args: [[[0]]],
          expected: 1,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "dg-q1",
      kind: "mcq",
      prompt: "Why work backwards?",
      options: [
        "Forward DP needs 2 states per cell",
        "It's faster",
        "Grid is symmetric",
        "Greedy works backwards",
      ],
      answer: 0,
      explanation: "Forward DP requires tracking both current HP and minimum HP encountered.",
      hints: ["What info does forward DP lack?"],
      objective: "Concept",
    },
  ],
  exam: {
    definition: "Find min initial HP to traverse grid staying above 0 HP.",
    steps: [
      "Start from bottom-right.",
      "dp[i][j] = max(1, min(down, right) - grid[i][j]).",
      "Answer is dp[0][0].",
    ],
    timeComplexity: "$O(mn)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "Backward induction ensures exactly the HP needed at each cell.",
    applications: ["game design", "path planning"],
    limitations: ["only right/down moves"],
    faq: [
      {
        q: "Why max(1, ...)?",
        a: "HP must stay ≥ 1 at every cell.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Backward DP justification (2).", "Recurrence (2).", "Complexity (1)."],
      },
    ],
  },
  references: [
    {
      citation: "LeetCode Problem 174: Dungeon Game.",
      supports: "Grid DP backwards.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
