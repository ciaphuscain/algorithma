import type { AlgorithmEntry } from "../types";

export const lazySegmentTreeEntry: AlgorithmEntry = {
  slug: "lazy-segment-tree",
  name: "Lazy Segment Tree",
  aliases: [
    "Segment tree with lazy propagation",
    "Lazy propagation",
    "Range update range query segment tree",
  ],
  curriculum: [63],
  domain: "arrays-hashing",
  subcategory: "Range Query Structures",
  difficulty: "advanced",
  summary:
    "A segment tree that supports updates to whole ranges, not just single elements, in O(log n). A node whose range lies inside the update gets its sum adjusted and a pending tag; the tag is pushed to the children only when a later operation needs to go below that node.",
  tags: ["segment tree", "lazy propagation", "range update", "range query", "tree"],
  prerequisites: ["Segment Tree"],
  related: ["segment-tree", "fenwick-tree", "difference-array", "sqrt-decomposition"],
  problem: {
    input:
      "An array, and a sequence of operations “add d to A[l..r]” and “what is A[l] + … + A[r]?”.",
    output: "The answer to each sum query.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A manager told to give everyone in a department a raise does not walk to every desk; they write ‘+3 for this department’ on the department's folder and update its payroll total. Only when someone asks about one team inside the department is the note copied down to the teams' folders. A lazy segment tree does the same: an update stops at the largest nodes that fit inside the range and leaves a note there.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Each node stores the sum of its range and a pending tag (0 at first).",
          "add(l, r, d): a node outside the range is skipped; a node inside gets sum += d · (its length) and tag += d, and the recursion stops there; a node that partly overlaps first pushes its tag to its children, then recurses into both and recomputes its sum.",
          "push: each child's sum grows by tag · (child's length) and the child's tag grows by the tag; the node's tag becomes 0.",
          "sum(l, r) is the ordinary segment-tree query, except that it also pushes tags on the way down.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): A = [5, 8, 6, 3, 2, 7, 2, 6]. Adding 3 to A[2..6] tags the nodes [2,3] and [4,5] (and changes the leaf 6), without visiting the leaves under the tags. The sum of A[0..3] is then 28, read straight from the node [0,3], whose sum was recomputed on the way back up. Adding −1 to everything tags only the root. The sum of A[4..5] is 13; reaching [4,5] pushes the root's tag down one level and then [4,7]'s tag one more level. Over the four operations the tree pushes tags twice and visits 18 nodes; the root ends with the total 46.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "The invariant: a node's sum is correct for its range, counting every tag at the node or above it that has been pushed into it; tags still waiting at a node apply to its children, not to itself.",
          "Leaves never need a tag here: their sum is updated directly.",
          "Other combinations work the same way as long as tags compose and can be applied to a sum without visiting the range: assignment (‘set A[l..r] = x’), adding to minimums, and so on. Mixing assignment and addition needs a combined tag.",
          "Recursive implementations need 4n nodes in an array; this visualizer builds the tree explicitly.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Cost.** As in an ordinary segment-tree query, an update or a query visits at most four nodes per level: at most two per level partly overlap the range, and each has two children. With ⌈log₂ n⌉ + 1 levels, both operations are O(log n), and each push is O(1). The tests compare every answer with a plain array updated element by element, check after the run that every node's sum equals its children's sums plus its own tag times its length, and check the bound of 4 nodes per level.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Persistent segment trees can carry lazy tags too, with care to copy nodes before pushing.",
          "When updates are additions and queries are sums, two Fenwick trees also give O(log n) range update and range query, with less code.",
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
    note: "Per operation, after an O(n) build.",
  },
  properties: [
    {
      label: "Range update",
      value: "O(log n)",
    },
    {
      label: "Range query",
      value: "O(log n)",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "run_ops",
      code: `def run_ops(a, ops):
    n = len(a)
    s, tag = [0] * (4 * n), [0] * (4 * n)

    def build(v, l, r):
        if l == r:
            s[v] = a[l]
            return
        m = (l + r) // 2
        build(2 * v, l, m); build(2 * v + 1, m + 1, r)
        s[v] = s[2 * v] + s[2 * v + 1]

    def apply(v, l, r, d):
        s[v] += d * (r - l + 1)
        tag[v] += d

    def push(v, l, r):
        m = (l + r) // 2
        apply(2 * v, l, m, tag[v]); apply(2 * v + 1, m + 1, r, tag[v])
        tag[v] = 0

    def add(v, l, r, ql, qr, d):
        if qr < l or r < ql:
            return
        if ql <= l and r <= qr:
            apply(v, l, r, d)
            return
        push(v, l, r)
        m = (l + r) // 2
        add(2 * v, l, m, ql, qr, d); add(2 * v + 1, m + 1, r, ql, qr, d)
        s[v] = s[2 * v] + s[2 * v + 1]

    def query(v, l, r, ql, qr):
        if qr < l or r < ql:
            return 0
        if ql <= l and r <= qr:
            return s[v]
        push(v, l, r)
        m = (l + r) // 2
        return query(2 * v, l, m, ql, qr) + query(2 * v + 1, m + 1, r, ql, qr)

    build(1, 0, n - 1)
    out = []
    for op in ops:
        if op[0] == "add":
            add(1, 0, n - 1, op[1], op[2], op[3])
        else:
            out.append(query(1, 0, n - 1, op[1], op[2]))
    return out
`,
      tests: [
        {
          args: [
            [5, 8, 6, 3, 2, 7, 2, 6],
            [
              ["add", 2, 6, 3],
              ["sum", 0, 3],
              ["add", 0, 7, -1],
              ["sum", 4, 5],
            ],
          ],
          expected: [28, 13],
        },
      ],
    },
    {
      language: "javascript",
      entry: "twoFenwick",
      code: `// Range add and range sum with two Fenwick trees (the alternative for sums).
function twoFenwick(a, ops) {
  const n = a.length, b1 = new Array(n + 1).fill(0), b2 = new Array(n + 1).fill(0);
  const upd = (b, i, v) => { for (i++; i <= n; i += i & -i) b[i] += v; };
  const qry = (b, i) => { let s = 0; for (i++; i > 0; i -= i & -i) s += b[i]; return s; };
  const rangeAdd = (l, r, d) => { upd(b1, l, d); upd(b1, r + 1, -d); upd(b2, l, d * l); upd(b2, r + 1, -d * (r + 1)); };
  const prefix = (i) => qry(b1, i) * (i + 1) - qry(b2, i);   // A[0] + … + A[i]
  a.forEach((v, i) => rangeAdd(i, i, v));
  const out = [];
  for (const [kind, l, r, d] of ops) {
    if (kind === "add") rangeAdd(l, r, d);
    else out.push(prefix(r) - (l > 0 ? prefix(l - 1) : 0));
  }
  return out;
}
`,
      tests: [
        {
          args: [
            [5, 8, 6, 3, 2, 7, 2, 6],
            [
              ["add", 2, 6, 3],
              ["sum", 0, 3],
              ["add", 0, 7, -1],
              ["sum", 4, 5],
            ],
          ],
          expected: [28, 13],
        },
        {
          args: [
            [1, 2, 3, 4, 5, 6],
            [
              ["add", 0, 5, 10],
              ["sum", 2, 2],
            ],
          ],
          expected: [13],
        },
      ],
    },
  ],
  visualizer: "lazy-segment-tree",
  practice: [
    {
      id: "lazy-why",
      kind: "mcq",
      prompt:
        "Without lazy propagation, what does adding d to a range of length k cost in a segment tree?",
      options: ["O(k log n): one point update per element", "O(log n)", "O(1)", "O(n²)"],
      answer: 0,
      explanation: "Each element needs its own root-to-leaf update.",
      distractors: {
        "1": "That is what lazy propagation achieves.",
        "2": "Some nodes must change.",
        "3": "Far too pessimistic.",
      },
      hints: ["How many point updates is a range of k elements?"],
      objective: "Motivation",
    },
    {
      id: "lazy-push",
      kind: "mcq",
      prompt: "When is a node's pending tag pushed to its children?",
      options: [
        "When an operation needs to visit those children",
        "Immediately after the update",
        "At the end of all operations",
        "Never",
      ],
      answer: 0,
      explanation: "Pushing only on demand is what keeps each operation at O(log n).",
      distractors: {
        "1": "That would visit the whole subtree.",
        "2": "Queries in between would read stale children.",
        "3": "Children would then never be correct.",
      },
      hints: ["What is ‘lazy’ about it?"],
      objective: "Mechanics",
    },
  ],
  exam: {
    definition:
      "A lazy segment tree supports range updates and range queries in O(log n) by storing pending updates as tags on nodes that are pushed down only when needed.",
    steps: [
      "Stop at nodes fully inside the range: adjust the sum, add a tag.",
      "Push a node's tag before descending below it.",
      "Recompute sums on the way back up.",
    ],
    timeComplexity: "$O(\\log n)$ per operation.",
    spaceComplexity: "$O(n)$.",
    correctness:
      "A node's sum always includes all updates applied to its whole range, and tags record exactly what its children have not received yet.",
    applications: ["Range add / range sum", "Range assignment", "Interval scheduling counters"],
    limitations: ["Tags must compose", "More code than a Fenwick tree"],
    faq: [
      {
        q: "Is the tree ever fully up to date?",
        a: "Only the nodes an operation needs; the rest may hold tags until visited.",
      },
    ],
    answers: [
      {
        marks: 10,
        outline: [
          "Problem with point updates (1).",
          "Tag and sum invariant (3).",
          "Update and push (3).",
          "Query (1).",
          "O(log n) argument (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "A. Laaksonen, Guide to Competitive Programming, Springer, 2017.",
      supports: "Segment trees and lazy propagation.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
