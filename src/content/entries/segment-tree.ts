import type { AlgorithmEntry } from "../types";

export const segmentTreeEntry: AlgorithmEntry = {
  slug: "segment-tree",
  name: "Segment Tree",
  aliases: ["Range-sum segment tree", "Interval tree (competitive programming sense)"],
  curriculum: [62],
  domain: "arrays-hashing",
  subcategory: "Range query structures",
  difficulty: "advanced",
  summary:
    "A binary tree over array ranges that answers range-sum queries and point updates in O(log n), each by touching a few nodes per level.",
  tags: ["tree", "range query", "range sum", "point update", "divide and conquer"],
  prerequisites: ["Recursion", "Binary Tree Traversals"],
  related: ["fenwick-tree", "bst", "tree-traversals"],
  problem: {
    input:
      "An array $A[0..n-1]$ and a sequence of operations: sum of $A[l..r]$, or set $A[i] = x$.",
    output: "The answer to every sum query, interleaved correctly with the updates.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Prefix sums answer range sums in $O(1)$ but need $O(n)$ work after every update. Plain arrays update in $O(1)$ but sum in $O(n)$. A segment tree balances the two: precompute the sums of halves, quarters, eighths… of the array. Any range is a union of $O(\\log n)$ of these pieces, and any update changes only the $O(\\log n)$ pieces containing that position.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        items: [
          "**Build:** the root covers $[0, n-1]$; each node covering $[l, r]$ with $l < r$ has children covering $[l, m]$ and $[m+1, r]$; leaves hold array values, internal nodes the sum of their children.",
          "**Query $[q_l, q_r]$:** at a node outside the range return 0; at a node inside it return its stored sum; otherwise ask both children.",
          "**Update $A[i] = x$:** walk down to the leaf for $i$, set it, and recompute sums on the way back up.",
        ],
      },
      {
        kind: "p",
        text: "**Example.** For [5, 8, 6, 3, 2, 7, 2, 6], sum(2..5) = 6 + 3 + 2 + 7 = 18. After set(3, 10) the total becomes 46.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Array-based storage puts node $v$'s children at $2v$ and $2v+1$ (1-based); allocate $4n$ slots to be safe for arbitrary $n$.",
          "Iterative bottom-up segment trees with $2n$ slots are shorter and faster for sums.",
          "Any associative operation works: min, max, gcd, matrix products — not just sums.",
          "**Lazy propagation** adds range updates (add $x$ to $A[l..r]$) by deferring work to the children until needed.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Height.** Ranges halve at each level, so the height is $\\lceil \\log_2 n \\rceil + 1$ and there are $2n - 1$ nodes.",
      },
      {
        kind: "p",
        text: "**Query cost.** At any level, at most two visited nodes partially overlap the query range (one at each end); only those recurse. So at most 4 nodes per level are visited, $O(\\log n)$ in total. ALGORITHMA's property tests check the bound $4(\\lceil \\log_2 n \\rceil + 1)$ on random queries.",
      },
      {
        kind: "p",
        text: "**Update cost:** one root-to-leaf path, $O(\\log n)$. **Build:** each node once, $O(n)$.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**Fenwick (binary indexed) trees** answer prefix sums and point updates with less code and memory, but handle fewer operation types.",
          "**Persistent segment trees** keep every version by copying only the $O(\\log n)$ changed nodes.",
          "**Merge sort trees** store sorted lists in nodes for order-statistic range queries.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(\\log n)", average: "O(\\log n)", worst: "O(\\log n)" },
    space: "O(n)",
    worstClass: "log n",
    note: "Per query or update; building takes $O(n)$.",
  },
  properties: [
    { label: "Build", value: "$O(n)$" },
    { label: "Query / update", value: "$O(\\log n)$" },
    { label: "Nodes", value: "$2n - 1$" },
  ],
  implementations: [
    {
      language: "python",
      entry: "run_ops",
      code: `def run_ops(values, ops):
    """ops: [["sum", l, r] | ["set", i, x]]. Returns the sum results."""
    n = len(values)
    tree = [0] * (4 * n)

    def build(v, l, r):
        if l == r:
            tree[v] = values[l]
            return
        m = (l + r) // 2
        build(2 * v, l, m)
        build(2 * v + 1, m + 1, r)
        tree[v] = tree[2 * v] + tree[2 * v + 1]

    def query(v, l, r, ql, qr):
        if qr < l or r < ql:
            return 0
        if ql <= l and r <= qr:
            return tree[v]
        m = (l + r) // 2
        return query(2 * v, l, m, ql, qr) + query(2 * v + 1, m + 1, r, ql, qr)

    def update(v, l, r, i, x):
        if l == r:
            tree[v] = x
            return
        m = (l + r) // 2
        if i <= m:
            update(2 * v, l, m, i, x)
        else:
            update(2 * v + 1, m + 1, r, i, x)
        tree[v] = tree[2 * v] + tree[2 * v + 1]

    build(1, 0, n - 1)
    out = []
    for kind, a, b in ops:
        if kind == "sum":
            out.append(query(1, 0, n - 1, a, b))
        else:
            update(1, 0, n - 1, a, b)
    return out
`,
      tests: [
        {
          args: [
            [5, 8, 6, 3, 2, 7, 2, 6],
            [
              ["sum", 2, 5],
              ["set", 3, 10],
              ["sum", 0, 7],
            ],
          ],
          expected: [18, 46],
        },
        { args: [[4], [["sum", 0, 0]]], expected: [4] },
      ],
    },
    {
      language: "javascript",
      entry: "rangeSums",
      code: `// Iterative bottom-up segment tree with 2n slots.
function rangeSums(values, queries) {
  const n = values.length;
  const t = new Array(2 * n).fill(0);
  for (let i = 0; i < n; i++) t[n + i] = values[i];
  for (let i = n - 1; i > 0; i--) t[i] = t[2 * i] + t[2 * i + 1];
  return queries.map(([l, r]) => {
    let sum = 0;
    for (l += n, r += n + 1; l < r; l >>= 1, r >>= 1) {
      if (l & 1) sum += t[l++];
      if (r & 1) sum += t[--r];
    }
    return sum;
  });
}
`,
      tests: [
        {
          args: [
            [5, 8, 6, 3, 2, 7, 2, 6],
            [
              [2, 5],
              [0, 7],
              [4, 4],
            ],
          ],
          expected: [18, 39, 2],
        },
      ],
    },
  ],
  visualizer: "segment-tree",
  practice: [
    {
      id: "seg-nodes",
      kind: "numeric",
      prompt: "How many nodes does a segment tree over 8 elements have?",
      answer: 15,
      explanation: "$2n - 1 = 15$: 8 leaves, 4 + 2 + 1 internal nodes.",
      hints: ["Count leaves, then each level above."],
      objective: "Understand the structure",
    },
    {
      id: "seg-vs-prefix",
      kind: "mcq",
      prompt: "When is a segment tree better than a prefix-sum array?",
      options: [
        "When the array changes between queries",
        "When there are no updates at all",
        "When only the total sum is needed",
        "Never",
      ],
      answer: 0,
      explanation:
        "Prefix sums need $O(n)$ rebuilding after each update; the segment tree updates in $O(\\log n)$.",
      distractors: {
        1: "Then prefix sums answer in $O(1)$ and win.",
        2: "A single running total suffices.",
        3: "Updates are the reason it exists.",
      },
      hints: ["What does an update cost for each structure?"],
      objective: "Choose a range-query structure",
    },
  ],
  exam: {
    definition:
      "A segment tree is a binary tree over an array in which each node stores an aggregate (e.g. the sum) of a contiguous range, children splitting their parent's range in half.",
    steps: [
      "Build recursively: leaves hold elements; internal nodes combine their children.",
      "Query: return 0 for disjoint nodes, the stored value for contained nodes, otherwise combine both children.",
      "Update: change the leaf and recompute its ancestors.",
    ],
    timeComplexity: "Build $O(n)$; query and point update $O(\\log n)$.",
    spaceComplexity: "$O(n)$ ($2n - 1$ nodes; $4n$ slots in the simple array layout).",
    correctness:
      "Every query range decomposes into disjoint node ranges; each stored value is correct by induction from the leaves.",
    applications: [
      "Range sum/min/max queries with updates",
      "Competitive programming",
      "Computational geometry sweeps",
    ],
    limitations: ["More code and memory than a Fenwick tree for simple prefix sums"],
    faq: [
      {
        q: "Why 4n array slots?",
        a: "The recursive layout's indices can exceed $2n$ when $n$ is not a power of two; $4n$ is always enough.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Tree of range aggregates; halving ranges.", "Query/update $O(\\log n)$."],
      },
      {
        marks: 5,
        outline: [
          "Structure and build (2).",
          "Query algorithm (1).",
          "Update algorithm (1).",
          "Complexity (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Definition and motivation vs prefix sums — 2.",
          "Build, query, update pseudocode — 3.",
          "Worked example with tree diagram — 3.",
          "Proof of $O(\\log n)$ query — 2.",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "M. de Berg, O. Cheong, M. van Kreveld, M. Overmars, Computational Geometry: Algorithms and Applications, 3rd ed., Springer, 2008, Ch. 10.",
      supports: "Segment trees as a geometric data structure.",
    },
    {
      citation: "A. Laaksonen, Guide to Competitive Programming, Springer, 2017.",
      supports: "Range-query segment trees, the bottom-up implementation and Fenwick trees.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and quantitative claims are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-21",
};
