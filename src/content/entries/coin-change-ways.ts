import type { AlgorithmEntry } from "../types";

export const coinChangeWaysEntry: AlgorithmEntry = {
  slug: "coin-change-ways",
  name: "Coin Change (Number of Ways)",
  aliases: ["Coin Change 2", "Count Change"],
  curriculum: [267],
  domain: "dynamic-programming",
  subcategory: "Knapsack Variants",
  difficulty: "intermediate",
  summary:
    "Count the number of distinct ways to make change for a given amount using given denominations. Iterate coins in outer loop to avoid counting permutations.",
  tags: ["coin change", "counting", "dynamic programming"],
  prerequisites: ["coin-change-min"],
  related: ["coin-change-min", "unbounded-knapsack"],
  problem: {
    input: "An array of coin denominations and a target amount.",
    output: "The number of distinct combinations of coins that sum to the target.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Unlike minimum coins, here we count combinations. Iterating coins in the outer loop ensures each combination is counted once (order doesn't matter).",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Create dp[0..amount], set dp[0]=1.",
          "For each coin c: for a from c to amount, dp[a] += dp[a-c].",
          "Return dp[amount].",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "The outer-coin-inner-amount order avoids double-counting permutations like (1,2) and (2,1).",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Time $O(n \\cdot k)$, space $O(n)$.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Generating functions: the answer is the coefficient of $x^{\\text{amount}}$ in $\\prod_c \\frac{1}{1-x^c}$.",
      },
    ],
  },
  complexity: {
    time: { best: "O(n·k)", average: "O(n·k)", worst: "O(n·k)" },
    space: "O(n)",
    worstClass: "other",
  },
  properties: [],
  implementations: [
    {
      language: "python",
      entry: "coinChangeWays",
      code: `def coinChangeWays(coins, amount):
    dp = [0] * (amount + 1)
    dp[0] = 1
    for c in coins:
        for a in range(c, amount + 1):
            dp[a] += dp[a - c]
    return dp[amount]`,
      tests: [
        {
          args: [[1, 2, 5], 5],
          expected: 4,
        },
        {
          args: [[2], 3],
          expected: 0,
        },
        {
          args: [[1], 0],
          expected: 1,
        },
      ],
    },
    {
      language: "javascript",
      entry: "coinChangeWays",
      code: `function coinChangeWays(coins, amount) {
  const dp = new Array(amount + 1).fill(0);
  dp[0] = 1;
  for (const c of coins) {
    for (let a = c; a <= amount; a++) dp[a] += dp[a - c];
  }
  return dp[amount];
}`,
      tests: [
        {
          args: [[1, 2, 5], 5],
          expected: 4,
        },
        {
          args: [[2], 3],
          expected: 0,
        },
        {
          args: [[1], 0],
          expected: 1,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "ccw-q1",
      kind: "mcq",
      prompt: "coins=[1,2,3], amount=4. How many ways?",
      options: ["4", "3", "5", "7"],
      answer: 0,
      explanation: "{1111, 112, 13, 22} = 4 ways.",
      hints: ["List all combinations."],
      objective: "Computation",
    },
  ],
  exam: {
    definition: "Count distinct combinations of coins summing to target.",
    steps: ["dp[0]=1.", "Outer loop: coins. Inner: amounts.", "dp[a] += dp[a-c]."],
    timeComplexity: "$O(n \\cdot k)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "Coin-outer order partitions solutions by largest coin used.",
    applications: ["combinatorics", "financial systems"],
    limitations: ["pseudo-polynomial"],
    faq: [
      {
        q: "Why outer loop on coins?",
        a: "To count combinations not permutations.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Define dp (1).", "Loop order explanation (2).", "Correctness (2)."],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "DP counting.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
