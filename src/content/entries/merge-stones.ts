import type { AlgorithmEntry } from "../types";

export const mergeStonesEntry: AlgorithmEntry = {
  slug: "merge-stones",
  name: "Merge Stones",
  aliases: ["Merge K Piles of Stones", "Stone Merge"],
  curriculum: [291],
  domain: "dynamic-programming",
  subcategory: "Interval DP",
  difficulty: "intermediate",
  summary:
    "Merge consecutive stone piles into groups of k at a time. Cost = sum of merged piles. Minimize total cost. Interval DP with step size k-1.",
  tags: ["interval DP", "merge", "dynamic programming"],
  prerequisites: ["matrix-chain-multiplication"],
  related: ["burst-balloons", "matrix-chain-multiplication"],
  problem: {
    input: "Array of stone pile sizes and integer k.",
    output:
      "Minimum cost to merge all into one pile (merging k consecutive at a time), or -1 if impossible.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Each merge reduces pile count by k-1. Need (n-1) % (k-1) == 0 for it to be possible. Interval DP like matrix chain but with step k-1.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Check feasibility: (n-1) % (k-1) must be 0.",
          "dp[i][j] = min cost to optimally merge piles i..j.",
          "Split at k-1 intervals. If (j-i) % (k-1) == 0, add prefix sum cost.",
          "Return dp[0][n-1].",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Prefix sums for range costs. O(n^3/k) with step optimization.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Time $O(n^3 / k)$, space $O(n^2)$.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "For k=2 this is the classic stone-merge problem solvable in O(n^3) or O(n^2) with Knuth optimization.",
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
      entry: "mergeStones",
      code: `def mergeStones(stones, k):
    n = len(stones)
    if n == 1:
        return 0
    if (n - 1) % (k - 1) != 0:
        return -1
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + stones[i]
    dp = [[0] * n for _ in range(n)]
    for length in range(k, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            dp[i][j] = float('inf')
            for mid in range(i, j, k - 1):
                dp[i][j] = min(dp[i][j], dp[i][mid] + dp[mid + 1][j])
            if (length - 1) % (k - 1) == 0:
                dp[i][j] += prefix[j + 1] - prefix[i]
    return dp[0][n - 1]`,
      tests: [
        {
          args: [[3, 2, 4, 1], 2],
          expected: 20,
        },
        {
          args: [[3, 2, 4, 1], 3],
          expected: -1,
        },
        {
          args: [[3, 5, 1, 2, 6], 3],
          expected: 25,
        },
      ],
    },
    {
      language: "javascript",
      entry: "mergeStones",
      code: `function mergeStones(stones, k) {
  const n = stones.length;
  if (n === 1) return 0;
  if ((n - 1) % (k - 1) !== 0) return -1;
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + stones[i];
  const dp = Array.from({length: n}, () => new Array(n).fill(0));
  for (let len = k; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1;
      dp[i][j] = Infinity;
      for (let mid = i; mid < j; mid += k - 1) {
        dp[i][j] = Math.min(dp[i][j], dp[i][mid] + dp[mid + 1][j]);
      }
      if ((len - 1) % (k - 1) === 0) dp[i][j] += prefix[j + 1] - prefix[i];
    }
  }
  return dp[0][n - 1];
}`,
      tests: [
        {
          args: [[3, 2, 4, 1], 2],
          expected: 20,
        },
        {
          args: [[3, 2, 4, 1], 3],
          expected: -1,
        },
        {
          args: [[3, 5, 1, 2, 6], 3],
          expected: 25,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "ms-q1",
      kind: "mcq",
      prompt: "stones=[1,2,3], k=2. Min cost?",
      options: ["9", "8", "6", "12"],
      answer: 0,
      explanation: "Merge (1,2)→3 cost 3, then (3,3)→6 cost 6. Total 9.",
      hints: ["Try different merge orders."],
      objective: "Computation",
    },
  ],
  exam: {
    definition: "Minimize cost to merge stone piles k at a time.",
    steps: ["Check feasibility.", "Interval DP with step k-1.", "Add range sum when mergeable."],
    timeComplexity: "$O(n^3)$.",
    spaceComplexity: "$O(n^2)$.",
    correctness: "Optimal substructure with k-pile merge constraint.",
    applications: ["resource merging", "Huffman-like coding"],
    limitations: ["cubic for general k"],
    faq: [
      {
        q: "Why (n-1)%(k-1)==0?",
        a: "Each merge of k piles reduces count by k-1; to reach 1 pile from n need exact divisibility.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Feasibility check (1).",
          "Interval DP with k-1 step (2).",
          "Prefix sum optimization (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "LeetCode Problem 1000: Minimum Cost to Merge Stones.",
      supports: "K-way merge DP.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
