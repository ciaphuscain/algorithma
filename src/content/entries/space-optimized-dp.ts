import type { AlgorithmEntry } from "../types";

export const spaceOptimizedDpEntry: AlgorithmEntry = {
  slug: "space-optimized-dp",
  name: "Space-Optimized DP",
  aliases: ["Rolling Array DP", "1D DP from 2D"],
  curriculum: [253],
  domain: "dynamic-programming",
  subcategory: "Dynamic Programming",
  difficulty: "intermediate",
  summary:
    "Space-optimized DP reduces memory from O(n×m) to O(m) by observing that each row of a 2D DP table depends only on the previous row, so only two rows (or even one) need to be stored.",
  tags: ["dynamic programming", "space optimization", "rolling array"],
  prerequisites: ["Dynamic Programming"],
  related: ["slope-trick"],
  problem: {
    input: "A 2D DP problem where dp[i] depends only on dp[i-1].",
    output: "The same optimal answer using O(row size) space instead of O(table size).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Many 2D DP tables have a simple dependency: row i only looks at row i-1. Keeping the entire table wastes memory. Instead, we keep just two rows (current and previous) and alternate between them. For some recurrences, even a single row suffices if we process it in the right direction.",
      },
      {
        kind: "p",
        text: "The classic example is the 0/1 knapsack: the 2D table dp[i][w] uses O(nW) space, but since dp[i][w] only depends on dp[i-1][w] and dp[i-1][w-w_i], we can use a single 1D array processed right-to-left.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Identify the dependency: does row i depend only on row i-1?",
          "Replace dp[n][m] with dp_prev[m] and dp_curr[m] (two-row technique).",
          "After processing row i, swap: dp_prev = dp_curr.",
          "For single-row: if dp[i][j] depends on dp[i-1][j'] where j' < j, process j right-to-left.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example**: 0/1 knapsack with items [(weight=2, value=3), (w=3, v=4)] and capacity 5. 2D: dp[2][5]=7. 1D: start [0,0,0,0,0,0]. After item 1 (right-to-left): [0,0,3,3,3,3]. After item 2: [0,0,3,4,4,7]. Answer: dp[5]=7.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Right-to-left iteration for 0/1 knapsack prevents using the same item twice.",
          "Left-to-right iteration gives unbounded knapsack (each item usable multiple times).",
          "For LCS and edit distance, two rows suffice since dp[i][j] depends on dp[i-1][j], dp[i][j-1], dp[i-1][j-1].",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Space reduction: O(nm) → O(m) for n rows and m columns. Time remains the same. The technique applies whenever the recurrence has bounded lookback in one dimension.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Hirschberg's algorithm combines space optimization with divide and conquer to recover the actual LCS in O(m+n) space.",
          "For some problems, the rolling array technique extends to keeping k rows for O(km) space when the lookback is k rows.",
          "Bitmask DP can sometimes be space-optimized by iterating over subsets in a specific order.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n m)",
      average: "O(n m)",
      worst: "O(n m)",
    },
    space: "O(m)",
    worstClass: "n^2",
    note: "Same time as full 2D DP; space reduced from O(nm) to O(m).",
  },
  properties: [
    {
      label: "Space reduction",
      value: "O(nm) → O(m)",
    },
    {
      label: "Time",
      value: "Unchanged",
    },
    {
      label: "Trade-off",
      value: "Cannot reconstruct the solution path without extra work",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "knapsack_01_space",
      code: `def knapsack_01_space(capacity, items):
    """0/1 knapsack with O(capacity) space. items: list of [weight, value]."""
    dp = [0] * (capacity + 1)
    for w, v in items:
        for j in range(capacity, w - 1, -1):
            dp[j] = max(dp[j], dp[j - w] + v)
    return dp[capacity]
`,
      tests: [
        {
          args: [
            5,
            [
              [2, 3],
              [3, 4],
            ],
          ],
          expected: 7,
        },
        {
          args: [
            4,
            [
              [1, 1],
              [2, 4],
              [3, 5],
            ],
          ],
          expected: 5,
        },
        {
          args: [0, [[1, 10]]],
          expected: 0,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "space-dp-direction",
      kind: "mcq",
      prompt: "In space-optimized 0/1 knapsack, why process the capacity right-to-left?",
      options: [
        "To avoid using the same item twice in one row",
        "To make it run faster",
        "Because Python requires it",
        "To ensure the array is sorted",
      ],
      answer: 0,
      explanation:
        "Right-to-left ensures dp[j-w] still holds the value from the previous item's row, not the current one.",
      hints: ["What would happen if you went left-to-right?"],
      objective: "Understand iteration direction",
    },
  ],
  exam: {
    definition:
      "Space-optimized DP reduces 2D tables to O(row size) by keeping only the current and previous rows.",
    steps: [
      "Check dependency: does row i need only row i-1?",
      "Use 1 or 2 arrays instead of full table.",
      "Process in correct direction.",
    ],
    timeComplexity: "O(nm) time, O(m) space",
    spaceComplexity: "O(m)",
    correctness: "Same recurrence, same answer; only the storage changes.",
    applications: ["Knapsack", "LCS", "Edit distance", "Path counting"],
    limitations: [
      "Cannot reconstruct the solution path directly",
      "Must identify the dependency pattern",
    ],
    faq: [
      {
        q: "How to reconstruct the path?",
        a: "Use Hirschberg's divide-and-conquer approach, or store backpointers in a separate pass.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Two-row / one-row technique (1).", "Direction matters for correctness (1)."],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 3rd ed., MIT Press, 2009.",
      supports: "Standard DP space optimization techniques.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
