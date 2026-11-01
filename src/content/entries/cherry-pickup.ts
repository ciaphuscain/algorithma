import type { AlgorithmEntry } from "../types";

export const cherryPickupEntry: AlgorithmEntry = {
  slug: "cherry-pickup",
  name: "Cherry Pickup",
  aliases: ["Cherry Pickup DP"],
  curriculum: [285],
  domain: "dynamic-programming",
  subcategory: "Grid DP",
  difficulty: "intermediate",
  summary:
    "Two people traverse an n×n grid from top-left to bottom-right, collecting cherries. Equivalent to two simultaneous paths. 3D DP on (step, row1, row2).",
  tags: ["grid DP", "dynamic programming", "two paths"],
  prerequisites: ["minimum-path-sum"],
  related: ["minimum-path-sum", "unique-paths"],
  problem: {
    input: "An n×n grid where 0=empty, 1=cherry, -1=thorn.",
    output:
      "Maximum cherries collectible by two traversals (top-left to bottom-right and back, or equivalently two simultaneous forward paths).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Model as two people walking simultaneously from (0,0) to (n-1,n-1). At each step both move one cell (right or down). If they're on the same cell, count the cherry once.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Let step = r1+c1 = r2+c2. State is (step, r1, r2), c1=step-r1, c2=step-r2.",
          "dp[step][r1][r2] = grid values at both positions (minus double-count if same cell) + max of 4 predecessor moves.",
          "Return max(0, dp[2n-2][n-1][n-1]).",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "3D DP of size O(n^3). Can optimize to O(n^2) per step.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Time $O(n^3)$, space $O(n^2)$ with rolling array.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Generalizes to k agents for small k. The round-trip formulation is equivalent to two forward paths.",
      },
    ],
  },
  complexity: {
    time: { best: "O(n³)", average: "O(n³)", worst: "O(n³)" },
    space: "O(n²)",
    worstClass: "other",
  },
  properties: [],
  implementations: [
    {
      language: "python",
      entry: "cherryPickup",
      code: `def cherryPickup(grid):
    n = len(grid)
    NEG = float('-inf')
    dp = [[NEG] * n for _ in range(n)]
    dp[0][0] = grid[0][0]
    for step in range(1, 2 * n - 1):
        ndp = [[NEG] * n for _ in range(n)]
        for r1 in range(max(0, step - n + 1), min(n, step + 1)):
            c1 = step - r1
            if c1 < 0 or c1 >= n or grid[r1][c1] == -1:
                continue
            for r2 in range(r1, min(n, step + 1)):
                c2 = step - r2
                if c2 < 0 or c2 >= n or grid[r2][c2] == -1:
                    continue
                val = grid[r1][c1]
                if r1 != r2:
                    val += grid[r2][c2]
                best = NEG
                for pr1 in (r1, r1 - 1):
                    for pr2 in (r2, r2 - 1):
                        if pr1 >= 0 and pr2 >= 0 and pr1 <= pr2:
                            best = max(best, dp[pr1][pr2])
                        elif pr1 >= 0 and pr2 >= 0 and pr2 < pr1:
                            best = max(best, dp[pr2][pr1])
                if best != NEG:
                    ndp[r1][r2] = val + best
        dp = ndp
    return max(0, dp[n - 1][n - 1])`,
      tests: [
        {
          args: [
            [
              [0, 1, -1],
              [1, 0, -1],
              [1, 1, 1],
            ],
          ],
          expected: 5,
        },
        {
          args: [
            [
              [1, 1],
              [1, 1],
            ],
          ],
          expected: 4,
        },
      ],
    },
    {
      language: "javascript",
      entry: "cherryPickup",
      code: `function cherryPickup(grid) {
  const n = grid.length, NEG = -Infinity;
  let dp = Array.from({length: n}, () => new Array(n).fill(NEG));
  dp[0][0] = grid[0][0];
  for (let step = 1; step < 2 * n - 1; step++) {
    const ndp = Array.from({length: n}, () => new Array(n).fill(NEG));
    for (let r1 = Math.max(0, step - n + 1); r1 < Math.min(n, step + 1); r1++) {
      const c1 = step - r1;
      if (c1 < 0 || c1 >= n || grid[r1][c1] === -1) continue;
      for (let r2 = r1; r2 < Math.min(n, step + 1); r2++) {
        const c2 = step - r2;
        if (c2 < 0 || c2 >= n || grid[r2][c2] === -1) continue;
        let val = grid[r1][c1];
        if (r1 !== r2) val += grid[r2][c2];
        let best = NEG;
        for (const pr1 of [r1, r1 - 1]) {
          for (const pr2 of [r2, r2 - 1]) {
            if (pr1 >= 0 && pr2 >= 0) {
              const a = Math.min(pr1, pr2), b = Math.max(pr1, pr2);
              best = Math.max(best, dp[a][b]);
            }
          }
        }
        if (best !== NEG) ndp[r1][r2] = val + best;
      }
    }
    dp = ndp;
  }
  return Math.max(0, dp[n - 1][n - 1]);
}`,
      tests: [
        {
          args: [
            [
              [0, 1, -1],
              [1, 0, -1],
              [1, 1, 1],
            ],
          ],
          expected: 5,
        },
        {
          args: [
            [
              [1, 1],
              [1, 1],
            ],
          ],
          expected: 4,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "cp-q1",
      kind: "mcq",
      prompt: "Why model as two simultaneous paths?",
      options: ["Avoids recount", "Simpler DP", "Greedy works", "Fewer states"],
      answer: 0,
      explanation:
        "Two forward paths avoid the problem of the return trip depending on the forward path.",
      hints: ["Think about independence."],
      objective: "Concept",
    },
  ],
  exam: {
    definition: "Collect maximum cherries with two paths in a grid.",
    steps: [
      "State: (step, r1, r2).",
      "Cherry value (avoid double-count).",
      "Max over 4 predecessor pairs.",
    ],
    timeComplexity: "$O(n^3)$.",
    spaceComplexity: "$O(n^2)$.",
    correctness: "Two simultaneous paths cover all valid collection strategies.",
    applications: ["path optimization", "resource collection"],
    limitations: ["cubic time"],
    faq: [
      {
        q: "Why not greedy forward then back?",
        a: "Greedy forward may block the optimal return path.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Two-path equivalence (2).", "DP state and recurrence (2).", "Complexity (1)."],
      },
    ],
  },
  references: [
    {
      citation: "LeetCode Problem 741: Cherry Pickup.",
      supports: "Grid DP two paths.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
