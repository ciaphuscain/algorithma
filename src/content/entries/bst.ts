import type { AlgorithmEntry } from "../types";

export const bstEntry: AlgorithmEntry = {
  slug: "bst",
  name: "Binary Search Tree",
  aliases: ["BST", "BST search, insert and delete", "Ordered binary tree"],
  curriculum: [153, 154, 155],
  domain: "trees",
  subcategory: "Binary trees & BSTs",
  difficulty: "intermediate",
  summary:
    "A binary tree in which every key is larger than everything in its left subtree and smaller than everything in its right subtree; search, insert and delete follow one root-to-leaf path.",
  tags: ["tree", "binary tree", "search", "insert", "delete", "ordered set", "dictionary"],
  prerequisites: ["Binary trees", "Binary Search", "Recursion"],
  related: ["tree-traversals", "binary-search", "heap-sort"],
  problem: {
    input: "A sequence of insert, search and delete operations on keys.",
    output: "The answers to the searches, and a tree that always satisfies the search-tree order.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Binary search halves a *sorted array* at every step, but inserting into an array means shifting everything after the new position. A binary search tree stores the same halving decisions as links: at each node, smaller keys live to the left and larger keys to the right. Searching walks down one path; inserting just hangs a new leaf where the search fell off the tree.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        items: [
          "**Search for x:** start at the root; if x equals the key, stop; go left if x is smaller, right if larger; reaching an empty slot means x is absent.",
          "**Insert x:** search for x; attach a new leaf at the empty slot where the search ended.",
          "**Delete x — leaf:** remove it. **One child:** link that child to the node's parent. **Two children:** copy the *successor* (the smallest key in the right subtree) into the node, then delete the successor, which has no left child.",
        ],
      },
      { kind: "heading", text: "Worked example" },
      {
        kind: "p",
        text: "Insert 50, 30, 70, 20, 40, 60, 80: the result is perfectly balanced, 50(30(20, 40), 70(60, 80)). Searching for 60 compares with 50, 70, 60 — found. Searching for 35 compares with 50, 30, 40 and falls off: absent. Deleting 20 removes a leaf; deleting 30 links its only child 40 to 50; deleting 50 copies its successor 60 into the root and removes the old leaf. The in-order traversal is then 40, 60, 70, 80.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Decide what duplicates mean: ignore them (a set, as here), count them, or always send equal keys to one side consistently.",
          "Deletion with two children can use the successor or the predecessor; always using the same one slowly unbalances the tree over many deletions.",
          "Iterative search avoids recursion depth problems in degenerate trees.",
          "An in-order traversal of a BST lists the keys in sorted order — a quick correctness check.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Invariant (search-tree order):** for every node $v$, all keys in $v$'s left subtree are $< v.key$ and all keys in its right subtree are $> v.key$. Insert preserves it because the new leaf is placed exactly where a search for its key ends. The two-children delete preserves it because the successor is larger than everything left of $v$ and smaller than everything else right of $v$.",
      },
      {
        kind: "p",
        text: "**Cost.** Every operation follows one root-to-leaf path, so it costs $O(h)$ where $h$ is the height. For $n$ keys,",
      },
      { kind: "math", tex: "\\lceil \\log_2 (n + 1) \\rceil \\;\\le\\; h \\;\\le\\; n." },
      {
        kind: "p",
        text: "Inserting keys in sorted order produces the worst case, a path of height $n$ (try the “sorted inserts” preset). Inserting a uniformly random permutation gives expected height $O(\\log n)$.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**Balanced BSTs** (AVL, red–black, treaps, splay trees) restore $O(\\log n)$ height with rotations after updates.",
          "**Order statistics:** storing subtree sizes lets you find the $k$-th smallest key in $O(h)$.",
          "**B-trees** generalise BSTs to many keys per node, matching disk blocks in databases.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(1)", average: "O(\\log n)", worst: "O(n)" },
    space: "O(n)",
    worstClass: "n",
    note: "Per operation: $O(h)$ for height $h$. The average is over random insertion orders; balanced variants guarantee $O(\\log n)$.",
  },
  properties: [
    { label: "In-order traversal", value: "Sorted keys" },
    { label: "Operation cost", value: "$O(h)$" },
    { label: "Height", value: "Between $\\lceil \\log_2(n+1) \\rceil$ and $n$" },
  ],
  implementations: [
    {
      language: "python",
      entry: "bst_inorder_after",
      code: `class Node:
    def __init__(self, key):
        self.key, self.left, self.right = key, None, None


def insert(root, key):
    if root is None:
        return Node(key)
    if key < root.key:
        root.left = insert(root.left, key)
    elif key > root.key:
        root.right = insert(root.right, key)
    return root


def delete(root, key):
    if root is None:
        return None
    if key < root.key:
        root.left = delete(root.left, key)
    elif key > root.key:
        root.right = delete(root.right, key)
    elif root.left is None:
        return root.right
    elif root.right is None:
        return root.left
    else:
        s = root.right
        while s.left is not None:
            s = s.left
        root.key = s.key
        root.right = delete(root.right, s.key)
    return root


def bst_inorder_after(inserts, deletes):
    """Insert, then delete, then return the keys in order."""
    root = None
    for k in inserts:
        root = insert(root, k)
    for k in deletes:
        root = delete(root, k)
    out = []

    def walk(v):
        if v:
            walk(v.left)
            out.append(v.key)
            walk(v.right)

    walk(root)
    return out
`,
      tests: [
        {
          args: [
            [50, 30, 70, 20, 40, 60, 80],
            [20, 30, 50],
          ],
          expected: [40, 60, 70, 80],
        },
        { args: [[1, 2, 3], [5]], expected: [1, 2, 3] },
        { args: [[5], [5]], expected: [] },
      ],
    },
    {
      language: "javascript",
      entry: "bstContains",
      code: `function bstContains(inserts, key) {
  let root = null;
  for (const k of inserts) {
    const node = { key: k, left: null, right: null };
    if (root === null) { root = node; continue; }
    let v = root;
    for (;;) {
      if (k === v.key) break;
      const side = k < v.key ? "left" : "right";
      if (v[side] === null) { v[side] = node; break; }
      v = v[side];
    }
  }
  let v = root;
  while (v !== null && v.key !== key) v = key < v.key ? v.left : v.right;
  return v !== null;
}
`,
      tests: [
        { args: [[50, 30, 70, 60], 60], expected: true },
        { args: [[50, 30, 70, 60], 35], expected: false },
      ],
    },
  ],
  visualizer: "bst",
  practice: [
    {
      id: "bst-height",
      kind: "numeric",
      prompt:
        "Keys 1, 2, 3, 4, 5, 6, 7 are inserted into an empty BST in that order. What is the height (number of nodes on the longest root-to-leaf path)?",
      answer: 7,
      explanation:
        "Each key is larger than all before it, so every insert goes right: the tree is a path of 7 nodes.",
      hints: ["Where does 2 go relative to 1? And 3?"],
      objective: "Recognise the degenerate case",
    },
    {
      id: "bst-successor",
      kind: "mcq",
      prompt: "Deleting a node with two children, which key replaces it?",
      options: [
        "The smallest key in its right subtree",
        "The largest key in its right subtree",
        "Its left child's key",
        "The root's key",
      ],
      answer: 0,
      explanation:
        "The successor is the next larger key: larger than everything on the left, smaller than everything else on the right, so the order is preserved. (The largest key in the left subtree, the predecessor, also works.)",
      distractors: {
        1: "That key is larger than the rest of the right subtree, so the order would break.",
        2: "The left child may itself have a right subtree with larger keys.",
        3: "The root is unrelated to the deleted node's position.",
      },
      hints: ["Which key comes right after the deleted one in sorted order?"],
      objective: "Understand deletion",
    },
    {
      id: "bst-inorder",
      kind: "mcq",
      prompt: "What does an in-order traversal of a BST produce?",
      options: [
        "The keys in increasing order",
        "The keys in insertion order",
        "The keys level by level",
        "The keys in decreasing order",
      ],
      answer: 0,
      explanation:
        "In-order visits the left subtree (all smaller), the node, then the right subtree (all larger) — recursively, that is sorted order.",
      distractors: {
        1: "The tree does not remember insertion order.",
        2: "That is level-order traversal.",
        3: "Only if you visit right before left.",
      },
      hints: ["Left subtree, node, right subtree."],
      objective: "Connect traversal and order",
    },
  ],
  exam: {
    definition:
      "A binary search tree is a binary tree in which, for every node, the keys in its left subtree are smaller and the keys in its right subtree are larger than the node's key.",
    steps: [
      "Search: compare with the node; go left if smaller, right if larger; stop on equality or an empty slot.",
      "Insert: search, then attach a new leaf at the empty slot.",
      "Delete: leaf — remove; one child — link the child to the parent; two children — replace the key by its in-order successor and delete the successor.",
    ],
    timeComplexity:
      "$O(h)$ per operation: $O(\\log n)$ when balanced or on average for random inserts, $O(n)$ in the worst case.",
    spaceComplexity: "$O(n)$ for the tree; $O(h)$ stack for recursive versions.",
    correctness:
      "Each operation preserves the search-tree order invariant, so searches always follow the only path on which the key can be.",
    applications: [
      "Ordered sets and maps",
      "Range queries and sorted iteration",
      "Basis for balanced trees (AVL, red–black) used in language libraries",
    ],
    limitations: [
      "Unbalanced trees degrade to linked lists",
      "Pointer-heavy; poorer cache behaviour than arrays",
    ],
    faq: [
      {
        q: "Why not just use a sorted array?",
        a: "Search is $O(\\log n)$ either way, but array insertion shifts $O(n)$ elements; a balanced BST inserts in $O(\\log n)$.",
      },
      {
        q: "What is the successor?",
        a: "The node with the next larger key: the leftmost node of the right subtree, when there is one.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Left subtree smaller, right subtree larger, at every node.",
          "Operations $O(h)$.",
        ],
      },
      {
        marks: 5,
        outline: [
          "Definition (1).",
          "Search and insert (2).",
          "Delete's three cases (1).",
          "Complexity and the degenerate case (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Definition and invariant — 1.",
          "Algorithms for search, insert, delete — 3.",
          "Worked example: build, search, delete each case, with diagrams — 4.",
          "Complexity, height bounds, balanced variants — 2.",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 3rd ed., MIT Press, 2009, Ch. 12.",
      supports: "BST operations, deletion cases and the expected height of randomly built trees.",
    },
    {
      citation:
        "D. E. Knuth, The Art of Computer Programming, Vol. 3: Sorting and Searching, 2nd ed., Addison-Wesley, 1998, §6.2.2.",
      supports: "Binary tree searching and its analysis.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and quantitative claims are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-21",
};
