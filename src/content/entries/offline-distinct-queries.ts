import type { AlgorithmEntry } from "../types";

export const offlineDistinctQueriesEntry: AlgorithmEntry = {
  slug: "offline-distinct-queries",
  name: "Offline Query Processing",
  aliases: ["Offline queries", "Distinct values in a range (offline)", "Sweep with a Fenwick tree"],
  curriculum: [94],
  domain: "arrays-hashing",
  subcategory: "Further Array Techniques",
  difficulty: "advanced",
  summary:
    "When all queries are known in advance, answer them in whatever order makes the work easy. Example: distinct values in A[l..r]. Sort queries by r, sweep r left to right keeping a mark only at the latest occurrence of each value, and count marks in [l, r] with a Fenwick tree: O((n + q) log n).",
  tags: ["offline", "sweep", "Fenwick tree", "sorting queries", "distinct values"],
  prerequisites: ["Fenwick Tree"],
  related: ["mo-algorithm", "fenwick-tree", "prefix-sums"],
  problem: {
    input: "An array and a batch of queries “how many distinct values does A[l..r] hold?”.",
    output: "The answer to each query, in the original order.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Counting distinct values in a range is awkward because a value can repeat. But if you only ever count the most recent copy of each value, repeats disappear — and ‘most recent’ is easy to maintain if you walk the array from left to right. So walk once, and whenever you reach the right end of some query, answer it on the spot. That only works because you know all the queries beforehand: this is what ‘offline’ means.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Sort the queries by right end r.",
          "Sweep r = 0, 1, …: if A[r] occurred before at p, clear M[p]; set M[r] = 1. M marks the last occurrence of each value seen so far.",
          "For every query (l, r) ending here, the answer is M[l] + … + M[r], which the Fenwick tree gives as two prefix sums.",
          "Return the answers in the original order.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset, shared with Mo's algorithm): A = [1, 2, 1, 3, 2, 2, 4, 1, 3]. The queries are answered by right end — q2 [1,3], q0 [0,4], q4 [4,5], q3 [2,7], q1 [6,8] — giving the same answers as Mo's algorithm: 3, 3, 3, 4, 1. When the sweep reaches r = 4, the marks sit at 2 (the 1), 3 (the 3) and 4 (the 2), so q0 counts 3 marks in [0, 4].",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Why it is correct: when the sweep is at r, a value occurring in A[l..r] has its last occurrence (up to r) inside [l, r], so it is counted exactly once; a value not in the range has no mark there.",
          "The Fenwick tree makes both mark changes and range counts O(log n).",
          "The same pattern — sort queries, sweep, keep a structure — answers many other problems: ‘count elements ≤ x in a range’ (sort by x), interval stabbing, and offline connectivity.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Cost.** Sorting the queries takes O(q log q). The sweep makes at most two mark changes per position and two prefix sums per query, each O(log n) in the Fenwick tree: O((n + q) log n) in all, better than Mo's O((n + q)√n) for this problem. The tests compare the answers with counting distinct values directly and with Mo's algorithm, and check that F is the Fenwick tree of M and that no value carries two marks.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "A persistent segment tree answers the same queries online in O(log n) each, at the cost of O(n log n) memory.",
          "Offline divide-and-conquer techniques (CDQ, parallel binary search) extend the idea to harder problems.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O((n + q) log n)",
      average: "O((n + q) log n)",
      worst: "O((n + q) log n)",
    },
    space: "O(n + q)",
    worstClass: "other",
    note: "Plus O(q log q) to sort the queries.",
  },
  properties: [
    {
      label: "Mode",
      value: "Offline",
    },
    {
      label: "Per step",
      value: "O(log n) Fenwick update or sum",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "distinct_offline",
      code: `def distinct_offline(a, queries):
    n = len(a)
    fen = [0] * (n + 1)

    def add(i, d):
        i += 1
        while i <= n:
            fen[i] += d
            i += i & -i

    def prefix(i):          # M[0] + ... + M[i - 1]
        s = 0
        while i > 0:
            s += fen[i]
            i -= i & -i
        return s

    order = sorted(range(len(queries)), key=lambda i: queries[i][1])
    last, ans, k = {}, [0] * len(queries), 0
    for r, x in enumerate(a):
        if x in last:
            add(last[x], -1)
        add(r, 1)
        last[x] = r
        while k < len(order) and queries[order[k]][1] == r:
            l = queries[order[k]][0]
            ans[order[k]] = prefix(r + 1) - prefix(l)
            k += 1
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
        {
          args: [
            [5, 5, 6, 7, 6, 5, 8, 8],
            [
              [0, 7],
              [1, 6],
              [2, 5],
              [3, 4],
            ],
          ],
          expected: [4, 4, 3, 2],
        },
      ],
    },
    {
      language: "javascript",
      entry: "lastMarks",
      code: `// The marks M after sweeping up to r: 1 at the last occurrence of each value so far.
function lastMarks(a, r) {
  const m = new Array(a.length).fill(0), last = new Map();
  for (let i = 0; i <= r; i++) {
    if (last.has(a[i])) m[last.get(a[i])] = 0;
    m[i] = 1;
    last.set(a[i], i);
  }
  return m;
}
`,
      tests: [
        {
          args: [[1, 2, 1, 3, 2, 2, 4, 1, 3], 4],
          expected: [0, 0, 1, 1, 1, 0, 0, 0, 0],
        },
      ],
    },
  ],
  visualizer: "offline-distinct-queries",
  practice: [
    {
      id: "off-def",
      kind: "mcq",
      prompt: "What makes an algorithm ‘offline’?",
      options: [
        "It sees all queries before answering any",
        "It runs without a network",
        "It answers in O(1)",
        "It never sorts",
      ],
      answer: 0,
      explanation: "Knowing all queries lets it choose a convenient order.",
      distractors: {
        "1": "Unrelated meaning.",
        "2": "Speed is not the definition.",
        "3": "Sorting the queries is typical.",
      },
      hints: ["Think of when queries become known."],
      objective: "Definition",
    },
    {
      id: "off-marks",
      kind: "numeric",
      prompt: "For A = [4, 7, 4, 4] after sweeping to r = 3, how many marks lie in [1, 3]?",
      answer: 2,
      explanation: "Marks are at 1 (the 7) and 3 (the last 4): two distinct values.",
      hints: ["Only the last occurrence of each value is marked."],
      objective: "Mechanics",
    },
  ],
  exam: {
    definition:
      "Offline query processing answers a batch of known queries in an order chosen for efficiency, typically sorted and combined with a sweep.",
    steps: [
      "Sort queries by r.",
      "Sweep r, keeping marks at last occurrences in a Fenwick tree.",
      "Answer queries ending at r by a range count.",
    ],
    timeComplexity: "$O((n + q) \\log n)$.",
    spaceComplexity: "$O(n + q)$.",
    correctness:
      "At sweep position r, the marks in [l, r] are in one-to-one correspondence with the distinct values of A[l..r].",
    applications: [
      "Distinct counts",
      "Counting values below a threshold in ranges",
      "Offline connectivity",
    ],
    limitations: ["Queries must all be known in advance"],
    faq: [
      {
        q: "How does it compare with Mo's algorithm?",
        a: "Here it is faster (log n instead of √n per step), but Mo's algorithm works for any statistic with cheap add and remove.",
      },
    ],
    answers: [
      {
        marks: 10,
        outline: [
          "Offline idea (2).",
          "Last-occurrence marks (3).",
          "Fenwick tree counting (3).",
          "Complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "P. M. Fenwick, “A new data structure for cumulative frequency tables,” Software: Practice and Experience, 24(3), 1994, pp. 327–336.",
      supports: "The Fenwick (binary indexed) tree.",
    },
    {
      citation: "A. Laaksonen, Guide to Competitive Programming, Springer, 2017.",
      supports: "Range queries with Fenwick trees and query-ordering techniques.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
