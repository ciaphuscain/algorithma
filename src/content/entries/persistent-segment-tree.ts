import type { AlgorithmEntry } from "../types";

export const persistentSegmentTreeEntry: AlgorithmEntry = {
  slug: "persistent-segment-tree",
  name: "Persistent Segment Tree",
  aliases: ["Functional Segment Tree", "Versioned Segment Tree"],
  curriculum: [194],
  domain: "trees",
  subcategory: "Tree Algorithms",
  difficulty: "intermediate",
  summary:
    "Creates a new version of a segment tree for each point update by copying only the O(log n) nodes on the root-to-leaf path, sharing the rest with the previous version, enabling queries on any historical version.",
  tags: ["segment tree", "persistent", "versioned", "path copying"],
  prerequisites: ["Segment Tree"],
  related: ["segment-tree"],
  problem: {
    input:
      "An array of n elements and a sequence of point updates and range queries, some referencing past versions.",
    output: "Query results on any specified version of the array.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A segment tree update changes O(log n) nodes from root to leaf. Instead of modifying them in place, create new copies of just those nodes, pointing to the unchanged siblings. Each update creates a new root, and the old root still points to the old tree — both versions coexist.",
      },
      {
        kind: "p",
        text: "This is called path copying. Since each version shares O(n) nodes with the previous one, the total space for m versions is O(n + m log n).",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Build the initial segment tree (version 0).",
          "For each update: create new nodes along the root-to-leaf path, copying the values and linking unchanged children.",
          "Store the root of each version.",
          "Query any version by starting from its root.",
        ],
      },
      {
        kind: "p",
        text: "**Example:** Array [1,2,3,4]. Update index 2 to 5: copy 3 nodes (root, right child, leaf). Version 0's root → [1,2,3,4]. Version 1's root → [1,2,5,4].",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Use pointer-based (not array-based) tree representation for shared nodes.",
          "Each node stores left/right child pointers plus the aggregate value.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Build: $O(n)$. Each update: $O(\\log n)$ time and space (new nodes). Each query: $O(\\log n)$. Total space for m updates: $O(n + m \\log n)$.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Used to answer kth-smallest in a range by building a persistent tree over sorted values.",
          "Can be combined with lazy propagation for persistent range updates (more complex).",
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
    space: "O(n + m log n)",
    worstClass: "log n",
    note: "Per update/query. m = number of versions.",
  },
  properties: [
    {
      label: "Per update cost",
      value: "$O(\\log n)$ time and space",
    },
    {
      label: "Versioned",
      value: "Query any historical version",
    },
    {
      label: "Path copying",
      value: "Only changed nodes are duplicated",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "PersistentSegTree",
      code: `class Node:
    __slots__ = ['val', 'left', 'right']
    def __init__(self, val=0, left=None, right=None):
        self.val = val; self.left = left; self.right = right

def build(arr, lo, hi):
    if lo == hi:
        return Node(arr[lo])
    mid = (lo + hi) // 2
    left = build(arr, lo, mid)
    right = build(arr, mid + 1, hi)
    return Node(left.val + right.val, left, right)

def update(node, lo, hi, idx, val):
    if lo == hi:
        return Node(val)
    mid = (lo + hi) // 2
    if idx <= mid:
        new_left = update(node.left, lo, mid, idx, val)
        return Node(new_left.val + node.right.val, new_left, node.right)
    else:
        new_right = update(node.right, mid + 1, hi, idx, val)
        return Node(node.left.val + new_right.val, node.left, new_right)

def query(node, lo, hi, ql, qr):
    if ql <= lo and hi <= qr:
        return node.val
    if qr < lo or hi < ql:
        return 0
    mid = (lo + hi) // 2
    return query(node.left, lo, mid, ql, qr) + query(node.right, mid + 1, hi, ql, qr)

def test_persistent_seg():
    arr = [1, 2, 3, 4]
    n = len(arr)
    v0 = build(arr, 0, n - 1)
    v1 = update(v0, 0, n - 1, 2, 5)
    q0 = query(v0, 0, n - 1, 0, 3)  # 1+2+3+4 = 10
    q1 = query(v1, 0, n - 1, 0, 3)  # 1+2+5+4 = 12
    q0_sub = query(v0, 0, n - 1, 2, 2)  # 3
    q1_sub = query(v1, 0, n - 1, 2, 2)  # 5
    return [q0, q1, q0_sub, q1_sub]
`,
      tests: [
        {
          args: [],
          expected: [10, 12, 3, 5],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "pst-space",
      kind: "mcq",
      prompt: "How much extra space does each update to a persistent segment tree use?",
      options: ["O(log n)", "O(n)", "O(1)", "O(n log n)"],
      answer: 0,
      explanation:
        "Each update creates O(log n) new nodes along the root-to-leaf path; unchanged subtrees are shared.",
      hints: ["How many nodes are on the path from root to leaf?"],
      objective: "Know persistent segment tree space cost",
    },
  ],
  exam: {
    definition:
      "A persistent segment tree creates O(log n) new nodes per update via path copying, enabling queries on any version.",
    steps: [
      "Build initial tree.",
      "Update: copy root-to-leaf path, share siblings.",
      "Store each version's root.",
      "Query from any root.",
    ],
    timeComplexity: "$O(\\log n)$ per operation.",
    spaceComplexity: "$O(n + m \\log n)$ total.",
    correctness:
      "Path copying preserves old versions by only duplicating the O(log n) changed nodes per update.",
    applications: ["Kth smallest in range", "Version history", "Offline range queries"],
    limitations: ["Higher constant than mutable segment tree"],
    faq: [
      {
        q: "Why pointer-based?",
        a: "Array-based trees can't share subtrees between versions; pointer-based trees can share unchanged children.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Path copying mechanism and space analysis (2)."],
      },
    ],
  },
  references: [
    {
      citation: 'J. R. Driscoll et al., "Making Data Structures Persistent," JCSS 38(1), 1989.',
      supports: "General techniques for persistence, including path copying.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
