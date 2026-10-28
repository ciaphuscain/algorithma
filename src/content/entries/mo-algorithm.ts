import type { AlgorithmEntry } from "../types";

export const moAlgorithmEntry: AlgorithmEntry = {
  slug: "mo-algorithm",
  name: "Mo's Algorithm",
  aliases: [
    "Mo's algorithm",
    "Query square-root decomposition",
    "Offline range queries by sorting",
  ],
  curriculum: [66],
  domain: "arrays-hashing",
  subcategory: "Range Query Structures",
  difficulty: "advanced",
  summary:
    "Answer many range queries offline by reordering them so that a sliding window moves little: sort by the √n-block of the left end, then by the right end. The window's ends then move O((n + q)√n) steps in total, so any statistic that can be updated when one element enters or leaves — here the number of distinct values — is answered fast.",
  tags: ["offline", "square root", "range query", "sliding window", "sorting queries"],
  prerequisites: ["Sqrt Decomposition", "Sliding Window"],
  related: ["sqrt-decomposition", "offline-distinct-queries", "sliding-window"],
  problem: {
    input:
      "An array and a batch of range queries “how many distinct values does A[l..r] hold?”, all known in advance.",
    output: "The answer to each query, in the original order.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A delivery driver with many stops does not drive them in the order the orders came in; they sort the stops to avoid crossing town repeatedly. Mo's algorithm sorts range queries the same way: queries whose left ends are close together are handled together, in order of their right ends, so the window [L, R] creeps along instead of jumping around.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Choose b = ⌈√n⌉. Sort the queries by (⌊l/b⌋, r).",
          "Keep a window [L, R], initially empty, with a count per value and the number of distinct values.",
          "For each query, move R and L one step at a time until the window is [l, r]; each step adds or removes one element and updates the counts.",
          "Record the answer for that query's original position.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): A = [1, 2, 1, 3, 2, 2, 4, 1, 3], b = 3. The queries q0 [0,4], q1 [6,8], q2 [1,3], q3 [2,7], q4 [4,5] are processed as q2, q0, q3, q4, q1 — three left ends in block 0 by increasing right end, then blocks 1 and 2. The window moves 21 steps in all, and the answers are 3, 3, 3, 4, 1.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Expand the window before shrinking it, so it never becomes ‘negative’.",
          "A common refinement sorts odd blocks by decreasing r, which saves the right pointer's trip back.",
          "It needs add and remove operations for the statistic; when removal is hard, the ‘rollback’ variant only adds and undoes.",
          "Mo's algorithm is offline: all queries must be known before the first is answered.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Cost.** Within one block of left ends the right end only moves forward: at most n steps per block, n·⌈n/b⌉ in all. The left end moves at most about 2b per query (within a block, or across one boundary). Total O(n²/b + q·b), which is O((n + q)√n) for b ≈ √n, each step costing O(1) here. The tests compare the answers with counting distinct values directly, check that the processing order is sorted by (block, r), and bound the number of window moves.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Mo's algorithm extends to queries on trees (via Euler tours) and to queries with point updates (‘Mo with updates’, sorting by three keys, O(n^{5/3})).",
          "Hilbert-curve orders of the (l, r) pairs can reduce the movement further in practice.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O((n + q)√n)",
      average: "O((n + q)√n)",
      worst: "O((n + q)√n)",
    },
    space: "O(n + q)",
    worstClass: "other",
    note: "Plus O(q log q) to sort the queries; assumes O(1) add and remove.",
  },
  properties: [
    {
      label: "Mode",
      value: "Offline",
    },
    {
      label: "Window moves",
      value: "O((n + q)√n)",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "distinct_queries",
      code: `from math import ceil, sqrt

def distinct_queries(a, queries):
    b = max(1, ceil(sqrt(len(a))))
    order = sorted(range(len(queries)), key=lambda i: (queries[i][0] // b, queries[i][1]))
    count, distinct = {}, 0
    L, R = 0, -1
    ans = [0] * len(queries)

    def add(x):
        nonlocal distinct
        count[x] = count.get(x, 0) + 1
        distinct += count[x] == 1

    def remove(x):
        nonlocal distinct
        count[x] -= 1
        distinct -= count[x] == 0

    for i in order:
        l, r = queries[i]
        while R < r: R += 1; add(a[R])
        while L > l: L -= 1; add(a[L])
        while R > r: remove(a[R]); R -= 1
        while L < l: remove(a[L]); L += 1
        ans[i] = distinct
    return ans
`,
      tests: [
        {
          args: [
            [1, 2, 1, 3, 2, 2, 4, 1, 3],
            [
              [0, 4],
              [6, 8],
              [1, 3],
              [2, 7],
              [4, 5],
            ],
          ],
          expected: [3, 3, 3, 4, 1],
        },
      ],
    },
    {
      language: "javascript",
      entry: "moOrder",
      code: `function moOrder(queries, n) {
  const b = Math.max(1, Math.ceil(Math.sqrt(n)));
  return queries
    .map(([l, r], i) => [Math.floor(l / b), r, i])
    .sort((x, y) => x[0] - y[0] || x[1] - y[1] || x[2] - y[2])
    .map((x) => x[2]);
}
`,
      tests: [
        {
          args: [
            [
              [0, 4],
              [6, 8],
              [1, 3],
              [2, 7],
              [4, 5],
            ],
            9,
          ],
          expected: [2, 0, 3, 4, 1],
        },
      ],
    },
  ],
  visualizer: "mo-algorithm",
  practice: [
    {
      id: "mo-offline",
      kind: "mcq",
      prompt: "Why can Mo's algorithm not answer queries as they arrive?",
      options: [
        "It needs all queries to sort them first",
        "It modifies the array",
        "It needs a segment tree",
        "It can; it is online",
      ],
      answer: 0,
      explanation: "Its speed comes from processing queries in its own order.",
      distractors: {
        "1": "The array is only read.",
        "2": "No tree is needed.",
        "3": "It is an offline algorithm.",
      },
      hints: ["Where does the speed come from?"],
      objective: "Offline",
    },
    {
      id: "mo-bound",
      kind: "mcq",
      prompt: "Within one block of left ends, how does the right end R move?",
      options: ["Only forwards", "Back and forth", "Only backwards", "It does not move"],
      answer: 0,
      explanation: "Queries in a block are sorted by r, so R only increases there.",
      distractors: {
        "1": "That is the left end's behaviour, within about b steps.",
        "2": "Sorted by increasing r.",
        "3": "It moves to each query's r.",
      },
      hints: ["What is the second sort key?"],
      objective: "Analysis",
    },
  ],
  exam: {
    definition:
      "Mo's algorithm answers offline range queries by sorting them by (block of l, r) and moving a window between consecutive queries.",
    steps: [
      "Sort queries by (⌊l/√n⌋, r).",
      "Move the window's ends one step at a time, updating the statistic.",
      "Store answers by original index.",
    ],
    timeComplexity: "$O((n + q)\\sqrt{n})$ window moves.",
    spaceComplexity: "$O(n + q)$.",
    correctness: "Each answer is computed from exactly the window [l, r].",
    applications: [
      "Distinct counts in ranges",
      "Frequency statistics in ranges",
      "Tree path queries via Euler tours",
    ],
    limitations: ["Offline only", "Needs O(1) add and remove for the bound"],
    faq: [
      {
        q: "What if updates are mixed in?",
        a: "Use the time dimension as a third sort key (Mo with updates), at a higher cost.",
      },
    ],
    answers: [
      {
        marks: 10,
        outline: [
          "Offline idea (2).",
          "Sort order (2).",
          "Window moves (3).",
          "Complexity argument (3).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "A. Laaksonen, Guide to Competitive Programming, Springer, 2017.",
      supports: "Mo's algorithm and its analysis.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
