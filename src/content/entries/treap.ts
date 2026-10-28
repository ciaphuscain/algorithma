import type { AlgorithmEntry } from "../types";

export const treapEntry: AlgorithmEntry = {
  slug: "treap",
  name: "Treap",
  aliases: [
    "Tree-heap",
    "Randomized binary search tree",
    "Cartesian tree (with random priorities)",
  ],
  curriculum: [159],
  domain: "trees",
  subcategory: "Balanced search trees",
  difficulty: "intermediate",
  summary:
    "A binary search tree on keys that is at the same time a heap on random priorities. The priorities make the shape exactly that of a BST built by inserting the keys in random order, so the expected depth is O(log n) whatever order the keys really arrive in.",
  tags: ["randomized", "binary search tree", "heap", "rotation", "cartesian tree"],
  prerequisites: ["Binary search trees", "Binary heaps", "Tree rotations"],
  related: ["avl-tree", "red-black-tree", "splay-tree", "binary-heap"],
  problem: {
    input: "A sequence of insert, delete and search operations on integer keys.",
    output: "The result of each operation, with expected O(log n) time per operation.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A plain BST is only as good as its insertion order: sorted input gives a path, random input gives depth about $2 \\ln n$. A treap makes the order random even when the input is not. Each key draws a random priority, and the tree is arranged as if keys had been inserted in priority order: the key with the smallest priority is the root, and so on down. Both the key order (left < node < right) and the priority order (parent < children) hold at once.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "**Insert:** give the key a priority, attach it as a leaf as in a BST, then rotate it up while its priority is smaller than its parent's.",
          "**Delete:** while the key has two children, rotate up the child with the smaller priority (the key moves down a level each time); then remove it, now with at most one child.",
          "**Search:** exactly as in a BST.",
          "In this visualizer the priorities come from a fixed permutation of 0–100, $p(k) = (37k + 23) \\bmod 101$, so runs are reproducible and no two keys share a priority. A real treap draws them at random.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): insert 1, 2, …, 10 in sorted order.",
      },
      {
        kind: "table",
        head: ["insert", "priority", "rotations up", "note"],
        rows: [
          ["1", "60", "—", "root"],
          ["2", "97", "0", "97 > 60"],
          ["3", "33", "2", "above 2, then above 1: 3 becomes the root"],
          ["4", "70", "0", "70 > 33"],
          ["5", "6", "2", "above 4, then above 3: 5 becomes the root"],
          ["6, 7", "43, 80", "0", ""],
          ["8", "16", "2", "above 7, then above 6; stops under 5 (6 < 16)"],
          ["9, 10", "53, 90", "0", ""],
        ],
      },
      {
        kind: "p",
        text: "Six rotations in all, and the sorted input produced a tree of height 4 (5 at the root, with 3 and 8 below it) instead of a path of height 10. The shape is forced: with distinct priorities there is exactly one treap for a set of keys, whatever order they arrived in.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "**Split and merge** give a simpler implementation without rotations: split(t, k) cuts a treap into keys < k and ≥ k; merge joins two treaps whose keys are ordered, choosing the root by priority. Insert = split + merge twice; delete = split twice + merge.",
          "**Implicit treaps** use positions instead of keys (each node stores its subtree size) to support array operations — insert at index, reverse a range — in $O(\\log n)$ expected time.",
          "Priorities only need to be random and independent of the keys; a 32-bit random number per node is plenty.",
          "Treaps are popular in programming contests and appear in some libraries as randomized ordered sets.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Uniqueness.** With distinct keys and priorities, the root must hold the smallest priority, its left subtree the keys below it and its right subtree the keys above it; by induction the treap is unique. It is the **Cartesian tree** of the keys in sorted order, weighted by priority — the tests rebuild that tree directly from the keys and compare shapes after every random sequence.",
      },
      {
        kind: "p",
        text: "**Expected depth.** Key $j$ is an ancestor of key $i$ exactly when $j$ has the smallest priority among the keys between them (inclusive), which happens with probability $1/(|i - j| + 1)$. Summing over $j$, the expected depth of $i$ is less than $2 H_n \\approx 2 \\ln n$, so search, insert and delete take $O(\\log n)$ expected time, and an insert or delete makes fewer than 2 rotations on average.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Seidel and Aragon introduced treaps in 1989 (journal version 1996); Vuillemin had described Cartesian trees in 1980.",
          "Randomized BSTs (Martínez and Roura) achieve the same distribution without stored priorities, deciding at each insertion whether the new key becomes the root of a subtree.",
          "Treaps support fast set operations (union, intersection, difference) by split and merge, which is useful in parallel algorithms (Blelloch and Reid-Miller).",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(1)", average: "O(log n)", worst: "O(n)" },
    space: "O(n)",
    worstClass: "n",
    note: "Expected O(log n) per operation over the random priorities; O(n) only with vanishing probability (or with adversarial priorities).",
  },
  properties: [
    { label: "Key order", value: "Binary search tree on keys" },
    { label: "Priority order", value: "Heap on priorities (smallest at the root here)" },
    { label: "Shape", value: "Unique for distinct priorities: the Cartesian tree" },
  ],
  implementations: [
    {
      language: "python",
      entry: "treap_preorder",
      code: `def split(t, k):
    """Split treap t into (keys < k, keys >= k). Nodes are [key, prio, left, right]."""
    if t is None:
        return None, None
    if t[0] < k:
        l, r = split(t[3], k)
        t[3] = l
        return t, r
    l, r = split(t[2], k)
    t[2] = r
    return l, t

def merge(a, b):
    """All keys of a are below all keys of b."""
    if a is None or b is None:
        return a or b
    if a[1] < b[1]:                       # smaller priority stays on top
        a[3] = merge(a[3], b)
        return a
    b[2] = merge(a, b[2])
    return b

def insert(t, k, prio):
    l, r = split(t, k)
    return merge(merge(l, [k, prio, None, None]), r)

def treap_preorder(keys):
    t = None
    for k in keys:
        t = insert(t, k, (37 * k + 23) % 101)
    out = []
    def walk(n):
        if n:
            out.append(n[0]); walk(n[2]); walk(n[3])
    walk(t)
    return out
`,
      tests: [
        {
          args: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]],
          expected: [5, 3, 1, 2, 4, 8, 6, 7, 9, 10],
        },
        { args: [[10, 9, 8, 7, 6, 5, 4, 3, 2, 1]], expected: [5, 3, 1, 2, 4, 8, 6, 7, 9, 10] },
      ],
    },
    {
      language: "javascript",
      entry: "expectedDepth",
      code: `// Expected depth of the i-th smallest of n keys (1-based) in a random treap:
// the sum over j != i of 1 / (|i - j| + 1).
function expectedDepth(i, n) {
  let d = 0;
  for (let j = 1; j <= n; j++) if (j !== i) d += 1 / (Math.abs(i - j) + 1);
  return Math.round(d * 1000) / 1000;
}
`,
      tests: [
        { args: [1, 1], expected: 0 },
        { args: [1, 3], expected: 0.833 },
        { args: [2, 3], expected: 1 },
      ],
    },
  ],
  visualizer: "treap",
  practice: [
    {
      id: "treap-root",
      kind: "numeric",
      prompt: "Keys 4, 7, 9 have priorities 50, 10, 30 (smallest on top). Which key is the root?",
      answer: 7,
      explanation:
        "The root holds the smallest priority, 10, which belongs to key 7; 4 and 9 become its children.",
      hints: ["A treap is a heap on priorities."],
      objective: "Treap shape",
    },
    {
      id: "treap-order",
      kind: "mcq",
      prompt: "Why does inserting sorted keys into a treap not produce a path?",
      options: [
        "The shape depends only on the priorities, which are random, not on the insertion order",
        "The treap sorts the keys before inserting them",
        "Rotations keep heights within one, as in an AVL tree",
        "Sorted input is rejected",
      ],
      answer: 0,
      explanation:
        "The treap for a set of keys is unique given the priorities, so it is the same as for a random insertion order: expected depth $O(\\log n)$.",
      distractors: {
        1: "Keys are inserted one at a time, in the order given.",
        2: "Treaps store no heights; their balance is only expected, not guaranteed.",
        3: "Any order is accepted.",
      },
      hints: ["Is the final shape affected by the insertion order?"],
      objective: "Why randomization balances",
    },
  ],
  exam: {
    definition:
      "A treap is a binary search tree on keys that is also a heap on randomly chosen priorities; its shape equals a BST built by inserting keys in random order.",
    steps: [
      "Insert as a BST leaf with a random priority; rotate up while the heap order is violated.",
      "Delete by rotating the key down (lifting the child with the smaller priority) until it is a leaf, then remove it.",
      "Alternatively: split and merge.",
    ],
    timeComplexity: "$O(\\log n)$ expected per operation.",
    spaceComplexity: "$O(n)$ plus a priority per node.",
    correctness:
      "Rotations preserve in-order and fix the one heap violation; the shape is the unique Cartesian tree, whose expected depth is below $2 H_n$.",
    applications: [
      "Ordered sets in contests",
      "Implicit treaps for sequence editing",
      "Parallel set operations",
    ],
    limitations: ["Guarantees are only in expectation", "Needs a good random source"],
    faq: [
      {
        q: "Treap or Cartesian tree?",
        a: "Same structure: a Cartesian tree is defined for any priorities; a treap uses random priorities to get expected balance.",
      },
    ],
    answers: [
      { marks: 2, outline: ["BST on keys + heap on random priorities.", "Expected $O(\\log n)$."] },
      {
        marks: 10,
        outline: [
          "Definition and uniqueness (2).",
          "Insert and delete by rotations (3).",
          "Worked example (2).",
          "Expected depth argument (3).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "R. Seidel, C. R. Aragon, “Randomized search trees,” Algorithmica, 16(4/5), 1996.",
      supports: "Treaps, their expected depth and rotation counts.",
    },
    {
      citation:
        "J. Vuillemin, “A unifying look at data structures,” Communications of the ACM, 23(4), 1980.",
      supports: "Cartesian trees.",
    },
    {
      citation:
        "C. Martínez, S. Roura, “Randomized binary search trees,” Journal of the ACM, 45(2), 1998.",
      supports: "Randomized BSTs without stored priorities.",
    },
    {
      citation:
        "G. E. Blelloch, M. Reid-Miller, “Fast set operations using treaps,” Proceedings of the 10th ACM Symposium on Parallel Algorithms and Architectures (SPAA), 1998.",
      supports: "Set operations by split and merge.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-26",
};
