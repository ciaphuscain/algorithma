import type { AlgorithmEntry } from "../types";

export const partitionEqualSubsetSumEntry: AlgorithmEntry = {
  slug: "partition-equal-subset-sum",
  name: "Partition Equal Subset Sum",
  aliases: ["Equal Partition", "Subset Sum Partition"],
  curriculum: [287],
  domain: "dynamic-programming",
  subcategory: "Knapsack Variants",
  difficulty: "intermediate",
  summary:
    "Determine if an array can be partitioned into two subsets with equal sum. Reduces to subset-sum for target = totalSum/2.",
  tags: ["partition", "subset sum", "dynamic programming"],
  prerequisites: ["0-1-knapsack"],
  related: ["coin-change-ways"],
  problem: {
    input: "An array of positive integers.",
    output: "True if the array can be split into two subsets with equal sum.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "If total sum is odd, impossible. Otherwise, find a subset summing to half the total — a classic 0/1 knapsack / subset-sum problem.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Compute total. If odd, return false.",
          "Target = total/2. Use boolean dp[0..target].",
          "dp[0] = true. For each num, update dp right-to-left.",
          "Return dp[target].",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Bitset optimization can speed this up with word-parallel operations.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Time $O(n \\cdot S)$ where S = sum/2, space $O(S)$.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "NP-complete in general but pseudo-polynomial. Meet-in-the-middle gives $O(2^{n/2})$ for small n.",
      },
    ],
  },
  complexity: {
    time: {
      worst: "O(n·S)",
    },
    space: {
      worst: "O(S)",
    },
  },
  properties: {
    worstClass: "other",
  },
  implementations: [
    {
      language: "python",
      entry: "canPartition",
      code: `def canPartition(nums):
    total = sum(nums)
    if total % 2 != 0:
        return False
    target = total // 2
    dp = [False] * (target + 1)
    dp[0] = True
    for num in nums:
        for s in range(target, num - 1, -1):
            dp[s] = dp[s] or dp[s - num]
    return dp[target]`,
      tests: [
        {
          input: {
            nums: [1, 5, 11, 5],
          },
          expected: true,
        },
        {
          input: {
            nums: [1, 2, 3, 5],
          },
          expected: false,
        },
        {
          input: {
            nums: [1, 1],
          },
          expected: true,
        },
      ],
    },
    {
      language: "javascript",
      entry: "canPartition",
      code: `function canPartition(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % 2 !== 0) return false;
  const target = total / 2;
  const dp = new Array(target + 1).fill(false);
  dp[0] = true;
  for (const num of nums) {
    for (let s = target; s >= num; s--) dp[s] = dp[s] || dp[s - num];
  }
  return dp[target];
}`,
      tests: [
        {
          input: {
            nums: [1, 5, 11, 5],
          },
          expected: true,
        },
        {
          input: {
            nums: [1, 2, 3, 5],
          },
          expected: false,
        },
        {
          input: {
            nums: [1, 1],
          },
          expected: true,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "pes-q1",
      kind: "mcq",
      prompt: "nums=[3,3,3,3,3]. Can partition?",
      options: ["False", "True"],
      answer: 0,
      explanation: "Sum is 15 (odd), so no equal partition.",
      hints: ["Check if sum is even first."],
      objective: "Computation",
    },
  ],
  exam: {
    definition: "Check if array splits into two subsets of equal sum.",
    steps: ["Check sum parity.", "target = sum/2.", "Subset-sum DP.", "Return dp[target]."],
    timeComplexity: "$O(n \\cdot S)$.",
    spaceComplexity: "$O(S)$.",
    correctness: "Reduces to subset sum; 0/1 knapsack correctness applies.",
    applications: ["load balancing", "fair division"],
    limitations: ["pseudo-polynomial"],
    faq: [
      {
        q: "Why check parity first?",
        a: "Odd total can never be split into two equal integer sums.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Parity check (1).", "Reduction to subset sum (2).", "DP recurrence (2)."],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "Subset sum.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
