import type { AlgorithmEntry } from "../types";

export const burstBalloonsEntry: AlgorithmEntry = {
  slug: "burst-balloons",
  name: "Burst Balloons",
  aliases: ["Balloon Burst DP"],
  curriculum: [289],
  domain: "dynamic-programming",
  subcategory: "Interval DP",
  difficulty: "intermediate",
  summary:
    "Given n balloons with values, bursting balloon i earns nums[left]*nums[i]*nums[right]. Find the maximum coins by bursting all balloons. Interval DP on which balloon to burst last in each range.",
  tags: ["interval DP", "dynamic programming", "balloons"],
  prerequisites: ["matrix-chain-multiplication"],
  related: ["merge-stones", "matrix-chain-multiplication"],
  problem: {
    input: "Array of balloon values.",
    output: "Maximum coins obtainable by bursting all balloons.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Think in reverse: instead of which balloon to burst first, decide which to burst LAST in a range. The last balloon in range [l,r] sees the boundaries l-1 and r+1.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Pad array with 1s at both ends.",
          "dp[l][r] = max over k in [l,r] of: dp[l][k-1] + nums[l-1]*nums[k]*nums[r+1] + dp[k+1][r].",
          "Return dp[1][n].",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Iterate by interval length. O(n^3) time, O(n^2) space.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Time $O(n^3)$, space $O(n^2)$. Similar structure to matrix chain multiplication.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "The 'burst last' reversal transforms an order-dependent problem into interval DP with independent subproblems.",
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
      entry: "maxCoins",
      code: `def maxCoins(nums):
    nums = [1] + nums + [1]
    n = len(nums)
    dp = [[0] * n for _ in range(n)]
    for length in range(1, n - 1):
        for l in range(1, n - length):
            r = l + length - 1
            for k in range(l, r + 1):
                coins = nums[l - 1] * nums[k] * nums[r + 1]
                coins += dp[l][k - 1] + dp[k + 1][r]
                dp[l][r] = max(dp[l][r], coins)
    return dp[1][n - 2]`,
      tests: [
        {
          args: [[3, 1, 5, 8]],
          expected: 167,
        },
        {
          args: [[1, 5]],
          expected: 10,
        },
      ],
    },
    {
      language: "javascript",
      entry: "maxCoins",
      code: `function maxCoins(nums) {
  nums = [1, ...nums, 1];
  const n = nums.length;
  const dp = Array.from({length: n}, () => new Array(n).fill(0));
  for (let len = 1; len < n - 1; len++) {
    for (let l = 1; l < n - len; l++) {
      const r = l + len - 1;
      for (let k = l; k <= r; k++) {
        const coins = nums[l - 1] * nums[k] * nums[r + 1] + dp[l][k - 1] + dp[k + 1][r];
        dp[l][r] = Math.max(dp[l][r], coins);
      }
    }
  }
  return dp[1][n - 2];
}`,
      tests: [
        {
          args: [[3, 1, 5, 8]],
          expected: 167,
        },
        {
          args: [[1, 5]],
          expected: 10,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "bb-q1",
      kind: "mcq",
      prompt: "Why think about the LAST balloon burst?",
      options: ["Independent subproblems", "Greedy works", "Fewer states", "Simpler code"],
      answer: 0,
      explanation: "Bursting last means left/right subproblems are independent.",
      hints: ["What does the last burst see?"],
      objective: "Concept",
    },
  ],
  exam: {
    definition: "Maximize coins from bursting all balloons (earn left*self*right).",
    steps: ["Pad with 1s.", "Interval DP: pick last burst in range.", "dp[l][r] = max over k."],
    timeComplexity: "$O(n^3)$.",
    spaceComplexity: "$O(n^2)$.",
    correctness: "Last-burst decomposition creates independent subproblems.",
    applications: ["optimization", "interval scheduling"],
    limitations: ["cubic time"],
    faq: [
      {
        q: "Why pad with 1s?",
        a: "Boundary balloons that never burst, simplifying edge cases.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Padding (1).", "Interval DP recurrence (2).", "Correctness of last-burst (2)."],
      },
    ],
  },
  references: [
    {
      citation: "LeetCode Problem 312: Burst Balloons.",
      supports: "Interval DP.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
