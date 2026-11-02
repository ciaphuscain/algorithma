import type { AlgorithmEntry } from "../types";

export const parallelBinarySearchEntry: AlgorithmEntry = {
  slug: "parallel-binary-search",
  name: "Parallel Binary Search",
  aliases: ["Offline Binary Search"],
  curriculum: [532],
  domain: "research",
  subcategory: "Advanced Topics",
  difficulty: "intermediate",
  summary:
    "Answers multiple binary-search queries simultaneously by grouping queries by their current search midpoint, processing all midpoints in one sweep, and halving the search space for every query at once.",
  tags: ["binary search", "offline", "competitive programming"],
  prerequisites: ["Binary Search"],
  related: ["binary-search"],
  problem: {
    input:
      "A sequence of updates and multiple queries, each asking for the first update after which a condition holds.",
    output: "For each query, the index of the critical update.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "If we have Q queries each needing binary search over T time steps, running them independently costs O(Q T log T). But in each round of binary search, many queries share the same midpoint — we can batch-process them together.",
      },
      {
        kind: "p",
        text: "By maintaining all queries' search intervals and processing each round in one pass, we reduce the total work to O((T + Q) log T).",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Each query i has an interval [lo_i, hi_i].",
          "Group queries by their midpoint mid_i = (lo_i + hi_i) / 2.",
          "Sweep through updates 1..T. When reaching mid_i, check whether query i's condition holds.",
          "Halve each query's interval based on the check.",
          "Repeat for O(log T) rounds.",
        ],
      },
      {
        kind: "p",
        text: "**Example:** 3 queries over 8 updates. Round 1: all check at mid=4. Round 2: queries split to check at 2 or 6. Round 3: converged.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Typically combined with a data structure (BIT/segment tree) that can be built incrementally and rolled back.",
          "Often used in competitive programming for problems like 'when does vertex i become connected to vertex j?'",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "O(log T) rounds, each doing O(T + Q) work for the sweep and checks, giving O((T + Q) log T) total.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Can be combined with persistent data structures for an online variant.",
          "Closely related to fractional cascading for multi-level binary search.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O((T+Q) log T)",
      average: "O((T+Q) log T)",
      worst: "O((T+Q) log T)",
    },
    space: "O(T + Q)",
    worstClass: "n log n",
    note: "T = number of updates, Q = number of queries.",
  },
  properties: [
    {
      label: "Rounds",
      value: "$O(\\log T)$",
    },
    {
      label: "Work per round",
      value: "$O(T + Q)$",
    },
    {
      label: "Offline",
      value: "All queries known in advance",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "parallel_binary_search",
      code: `def parallel_binary_search(n, thresholds):
    """Given cumulative sums 1..n, for each threshold find the first prefix sum >= threshold.
    Simulates parallel binary search over Q queries on T=n steps."""
    prefix = [0] * (n + 1)
    for i in range(1, n + 1):
        prefix[i] = prefix[i - 1] + i
    Q = len(thresholds)
    lo = [1] * Q
    hi = [n] * Q
    for _ in range(20):
        buckets = {}
        for q in range(Q):
            if lo[q] <= hi[q]:
                mid = (lo[q] + hi[q]) // 2
                buckets.setdefault(mid, []).append(q)
        for mid, qs in buckets.items():
            for q in qs:
                if prefix[mid] >= thresholds[q]:
                    hi[q] = mid - 1
                else:
                    lo[q] = mid + 1
    return lo
`,
      tests: [
        {
          args: [10, [1, 15, 55]],
          expected: [1, 5, 10],
        },
        {
          args: [5, [3, 10]],
          expected: [2, 4],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "pbs-rounds",
      kind: "mcq",
      prompt: "How many rounds does parallel binary search need?",
      options: ["O(log T)", "O(T)", "O(Q)", "O(T Q)"],
      answer: 0,
      explanation: "Each round halves the search interval, so O(log T) rounds suffice.",
      hints: ["What happens to the interval each round?"],
      objective: "Understand parallel binary search complexity",
    },
  ],
  exam: {
    definition:
      "Parallel binary search answers Q binary-search queries over T updates simultaneously in O(log T) rounds.",
    steps: [
      "Init [lo, hi] for each query.",
      "Group by midpoint.",
      "Sweep and check.",
      "Halve intervals.",
      "Repeat.",
    ],
    timeComplexity: "$O((T+Q) \\log T)$.",
    spaceComplexity: "$O(T + Q)$.",
    correctness: "Each round does O(T+Q) work; O(log T) rounds suffice since intervals halve.",
    applications: ["Competitive programming", "Offline query processing"],
    limitations: ["Requires offline access to all queries"],
    faq: [
      {
        q: "Why batch?",
        a: "Many queries share midpoints, so one sweep answers multiple checks.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Batching idea and complexity (2)."],
      },
    ],
  },
  references: [
    {
      citation: "Competitive Programming 3, S. Halim, F. Halim, 2013.",
      supports: "Parallel binary search technique for offline queries.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
