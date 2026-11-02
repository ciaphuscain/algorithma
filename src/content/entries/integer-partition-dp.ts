import type { AlgorithmEntry } from "../types";

export const integerPartitionDpEntry: AlgorithmEntry = {
  slug: "integer-partition-dp",
  name: "Integer Partition (DP)",
  aliases: ["Partition Number", "Number Partitions"],
  curriculum: [268],
  domain: "dynamic-programming",
  subcategory: "Counting DP",
  difficulty: "intermediate",
  summary:
    "Count the number of ways to write n as a sum of positive integers (order doesn't matter). Uses the same coin-change-ways pattern with 'coins' 1..n.",
  tags: ["partition", "counting", "dynamic programming"],
  prerequisites: ["coin-change-ways"],
  related: ["coin-change-ways"],
  problem: {
    input: "A positive integer n.",
    output: "The number of partitions of n.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A partition of n is a multiset of positive integers summing to n. Like coin change where denominations are 1,2,...,n.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "dp[0] = 1.",
          "For each k from 1 to n: for j from k to n, dp[j] += dp[j-k].",
          "Return dp[n].",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Identical to coin-change-ways with coins = [1..n].",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Time $O(n^2)$, space $O(n)$. Euler's pentagonal theorem gives $O(n\\sqrt{n})$.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Hardy-Ramanujan asymptotic: $p(n) \\sim \\frac{1}{4n\\sqrt{3}} e^{\\pi\\sqrt{2n/3}}$.",
      },
    ],
  },
  complexity: {
    time: { best: "O(n²)", average: "O(n²)", worst: "O(n²)" },
    space: "O(n)",
    worstClass: "other",
  },
  properties: [],
  implementations: [
    {
      language: "python",
      entry: "integerPartition",
      code: `def integerPartition(n):
    dp = [0] * (n + 1)
    dp[0] = 1
    for k in range(1, n + 1):
        for j in range(k, n + 1):
            dp[j] += dp[j - k]
    return dp[n]`,
      tests: [
        {
          args: [5],
          expected: 7,
        },
        {
          args: [10],
          expected: 42,
        },
        {
          args: [1],
          expected: 1,
        },
      ],
    },
    {
      language: "javascript",
      entry: "integerPartition",
      code: `function integerPartition(n) {
  const dp = new Array(n + 1).fill(0);
  dp[0] = 1;
  for (let k = 1; k <= n; k++) {
    for (let j = k; j <= n; j++) dp[j] += dp[j - k];
  }
  return dp[n];
}`,
      tests: [
        {
          args: [5],
          expected: 7,
        },
        {
          args: [10],
          expected: 42,
        },
        {
          args: [1],
          expected: 1,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "ip-q1",
      kind: "mcq",
      prompt: "p(4) = ?",
      options: ["5", "4", "3", "6"],
      answer: 0,
      explanation: "4, 3+1, 2+2, 2+1+1, 1+1+1+1 = 5.",
      hints: ["List all partitions."],
      objective: "Computation",
    },
  ],
  exam: {
    definition: "Count ways to write n as sum of positive integers.",
    steps: ["dp[0]=1.", "For k=1..n, inner loop j=k..n.", "dp[j] += dp[j-k]."],
    timeComplexity: "$O(n^2)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "Same as coin-change-ways with denominations 1..n.",
    applications: ["number theory", "combinatorics"],
    limitations: ["O(n^2)"],
    faq: [
      {
        q: "Difference from compositions?",
        a: "Partitions ignore order; compositions count order.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Reduction to coin change (2).", "Recurrence (1).", "Complexity (2)."],
      },
    ],
  },
  references: [
    {
      citation: "G. E. Andrews, The Theory of Partitions, Cambridge University Press, 1998.",
      supports: "Partition theory.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
