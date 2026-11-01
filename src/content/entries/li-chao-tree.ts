import type { AlgorithmEntry } from "../types";

export const liChaoTreeEntry: AlgorithmEntry = {
  slug: "li-chao-tree",
  name: "Li Chao Tree",
  aliases: [
    "Li Chao segment tree",
  ],
  curriculum: [
    197,
  ],
  domain: "trees",
  subcategory: "Tree Algorithms",
  difficulty: "intermediate",
  summary: "A segment tree variant that maintains a set of linear functions and supports queries for the minimum (or maximum) function value at any given x-coordinate in O(log n) time per insertion and query.",
  tags: [
    "segment tree",
    "convex hull trick",
    "linear functions",
    "optimization",
  ],
  prerequisites: [
    "Segment Tree",
  ],
  related: [
    "segment-tree",
    "convex-hull-trick",
  ],
  problem: {
    input: "A set of linear functions $f(x) = mx + b$ and query points.",
    output: "For each query point x, the minimum value among all inserted functions at x.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "The convex hull trick answers 'which line gives the minimum value at x?' but requires lines sorted by slope. Li Chao tree relaxes this: lines can be inserted in any order, and queries are still O(log n).",
      },
      {
        kind: "p",
        text: "Each node of the segment tree stores the line that is 'dominant' (minimum) at the midpoint of its interval. When inserting a new line, it either replaces the dominant line at the midpoint or is pushed to one of the children.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Build a segment tree over the range of possible x-values.",
          "Each node stores one line that is dominant at its midpoint.",
          "To insert a line: compare with the stored line at the midpoint. The winner stays; the loser goes to the child where it might still be dominant.",
          "To query: traverse from root to the leaf for x, taking the minimum among all stored lines.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example.** Insert $y = -x + 4$ and $y = x$. At midpoint 2: $-2+4=2$ vs $2$, tie. Insert $y = -2x + 8$. At midpoint 2: $-4+8=4 > 2$, so it goes to a child. Query x=1: check all ancestors, return min(3, 1, 6) = 1.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Coordinate compression reduces the range to O(n) distinct values.",
          "Each insert and query is O(log n).",
          "Simpler to implement than the full convex hull trick, and handles arbitrary insertion order.",
          "Can be made persistent for offline queries.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Insert and query both visit O(log n) nodes. Each node stores one line; comparing at the midpoint determines which half to recurse into.",
      },
      {
        kind: "p",
        text: "Total: O((n + q) log C) where n = lines, q = queries, C = coordinate range (or n with compression).",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Generalizes to arbitrary functions, not just lines, if they intersect at most once (monotone).",
          "Used in DP optimizations where the transition involves linear functions.",
          "Li Chao trees can be made dynamic (no fixed x-range) with an implicit structure.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(log n)",
      average: "O(log n)",
      worst: "O(log n)",
    },
    space: "O(n)",
    worstClass: "log n",
    note: "Per operation. n = range size or number of distinct coordinates.",
  },
  properties: [
    {
      label: "Insertion order",
      value: "Arbitrary (no slope sorting needed)",
    },
    {
      label: "Per-operation cost",
      value: "O(log n)",
    },
    {
      label: "Simpler than CHT",
      value: "Easier to implement for general use",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "li_chao_query",
      code: `class LiChaoTree:
    def __init__(self, lo, hi):
        self.lo = lo
        self.hi = hi
        self.line = None  # (m, b) for y = mx + b
        self.left = None
        self.right = None

    def _eval(self, line, x):
        return line[0] * x + line[1]

    def insert(self, m, b):
        self._insert(m, b, self.lo, self.hi)

    def _insert(self, m, b, lo, hi):
        new = (m, b)
        mid = (lo + hi) // 2
        if self.line is None:
            self.line = new
            return
        left_better = self._eval(new, lo) < self._eval(self.line, lo)
        mid_better = self._eval(new, mid) < self._eval(self.line, mid)
        if mid_better:
            self.line, new = new, self.line
        if lo == hi:
            return
        if left_better != mid_better:
            if self.left is None:
                self.left = LiChaoTree(lo, mid)
            self.left._insert(new[0], new[1], lo, mid)
        else:
            if self.right is None:
                self.right = LiChaoTree(mid + 1, hi)
            self.right._insert(new[0], new[1], mid + 1, hi)

    def query(self, x):
        return self._query(x, self.lo, self.hi)

    def _query(self, x, lo, hi):
        if self.line is None:
            return float('inf')
        res = self._eval(self.line, x)
        mid = (lo + hi) // 2
        if x <= mid and self.left:
            res = min(res, self.left._query(x, lo, mid))
        elif x > mid and self.right:
            res = min(res, self.right._query(x, mid + 1, hi))
        return res

def li_chao_query(lines, queries):
    """Insert lines [(m,b),...] then answer queries [x,...].
    Returns min y = mx+b at each x."""
    tree = LiChaoTree(-1000, 1000)
    for m, b in lines:
        tree.insert(m, b)
    return [tree.query(x) for x in queries]
`,
      tests: [
        {
          args: [
            [
              [
                1,
                0,
              ],
              [
                -1,
                4,
              ],
            ],
            [
              0,
              1,
              2,
              3,
            ],
          ],
          expected: [
            0,
            1,
            2,
            1,
          ],
        },
        {
          args: [
            [
              [
                0,
                5,
              ],
              [
                1,
                0,
              ],
            ],
            [
              0,
              3,
              5,
            ],
          ],
          expected: [
            0,
            3,
            5,
          ],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "lichao-advantage",
      kind: "mcq",
      prompt: "What advantage does a Li Chao tree have over the convex hull trick?",
      options: [
        "Lines can be inserted in any order",
        "Faster queries",
        "Uses less memory",
        "Handles non-linear functions",
      ],
      answer: 0,
      explanation: "The convex hull trick requires sorted slopes; Li Chao tree allows arbitrary insertion order.",
      hints: [
        "What constraint does the convex hull trick impose on insertion?",
      ],
      objective: "Understand Li Chao tree advantages",
    },
  ],
  exam: {
    definition: "Li Chao tree is a segment tree for maintaining linear functions, supporting O(log n) insert and minimum-value queries at any x.",
    steps: [
      "Store dominant line at each node's midpoint.",
      "Insert: compare at midpoint, push loser to child.",
      "Query: traverse root to leaf, take minimum.",
    ],
    timeComplexity: "$O(\\log n)$ per operation",
    spaceComplexity: "$O(n)$",
    correctness: "Each insert visits O(log n) nodes; the stored line at each node is optimal at the midpoint, ensuring the global minimum is found along any query path.",
    applications: [
      "DP optimization",
      "Competitive programming",
      "Line container",
    ],
    limitations: [
      "Limited to functions that cross at most once per interval",
    ],
    faq: [
      {
        q: "When to use Li Chao vs CHT?",
        a: "Li Chao when lines arrive in arbitrary order; CHT when sorted by slope (slightly faster constant).",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Midpoint comparison insert strategy (1). Query correctness (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "Li Chao, competitive programming technique, widely documented in CP resources.",
      supports: "The Li Chao tree technique for line containers.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
