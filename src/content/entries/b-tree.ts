import type { AlgorithmEntry } from "../types";

export const bTreeEntry: AlgorithmEntry = {
  slug: "b-tree",
  name: "B-Tree",
  aliases: ["Bayer–McCreight tree", "2-3-4 tree (t = 2)", "Balanced multiway search tree"],
  curriculum: [162],
  domain: "trees",
  subcategory: "Balanced search trees",
  difficulty: "advanced",
  summary:
    "A balanced search tree whose nodes hold many sorted keys and have many children, built for storage where reading a block is expensive. Nodes split when they fill and merge when they empty, the tree grows and shrinks only at the root, and every leaf is at the same depth: O(log n) operations touching only O(log_t n) nodes.",
  tags: ["balanced tree", "multiway tree", "database index", "disk", "split", "merge"],
  prerequisites: ["Binary search trees", "Binary search"],
  related: ["b-plus-tree", "red-black-tree", "avl-tree", "aa-tree"],
  problem: {
    input: "A minimum degree t ≥ 2 and a sequence of insert, delete and search operations on keys.",
    output:
      "The result of each operation, keeping every non-root node between t − 1 and 2t − 1 keys and all leaves at one depth.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "On a disk or SSD, reading one block costs about as much as reading one byte, so a binary tree that touches 30 nodes for a lookup is wasteful. A B-tree packs hundreds of keys into each node, one node per block, so the tree is only three or four levels deep even for billions of keys. Inside a node, keys are sorted and act as signposts: the children between them hold the keys in between.",
      },
      {
        kind: "p",
        text: "Balance comes from growing at the top instead of the bottom. New keys go into leaves; a full node splits in two and pushes its middle key up to its parent. Only when the root itself splits does the tree get a new level — so every leaf is always at the same depth.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "**Search:** in each node, find the first key ≥ k (by binary or linear search); stop if it equals k, otherwise descend into the child to its left.",
          "**Insert** (top-down, as in Cormen et al.): if the root is full (2t − 1 keys), split it and grow a level. Walk down; before entering a full child, split it — its middle key moves up into the current node, which has room. Put the key into the leaf.",
          "**Delete:** walk down making sure every node entered has at least t keys: borrow a key through the parent from a sibling with ≥ t keys (a rotation), or merge the child with a sibling, pulling the parent's separator down. A key found in an internal node is replaced by its predecessor or successor, which is then deleted from below. If the root ends with no keys, its only child becomes the root.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): t = 2 (each node holds 1–3 keys: a 2-3-4 tree), inserting 10, 20, …, 90.",
      },
      {
        kind: "table",
        head: ["insert", "split on the way down", "tree afterwards"],
        rows: [
          ["10, 20, 30", "—", "[10 20 30]"],
          ["40", "root [10 20 30] is full: 20 moves up", "[20] ( [10] [30 40] )"],
          ["50", "—", "[20] ( [10] [30 40 50] )"],
          ["60", "[30 40 50]: 40 moves up", "[20 40] ( [10] [30] [50 60] )"],
          [
            "70, 80",
            "[50 60 70] splits before 80: 60 moves up",
            "[20 40 60] ( [10] [30] [50] [70 80] )",
          ],
          [
            "90",
            "root [20 40 60] is full: 40 moves up — a new level",
            "[40] ( [20] ( [10] [30] ) [60] ( [50] [70 80 90] ) )",
          ],
        ],
      },
      {
        kind: "p",
        text: "Four splits, height 3, every leaf at depth 2. With t = 3 (second preset), twelve keys fit in a tree of height 2 after only two splits. The third preset deletes 60, 70, 10, 50 and 20: three merges, one borrow from a sibling, and one shrink of the root, ending with [80] ( [30 40] [90] ). The fourth preset shows an internal key leaving: in [20] ( [5 10] [30 40] ), deleting 20 copies its predecessor 10 up, giving [10] ( [5] [30 40] ).",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Choose t so that a node fills one disk page: with 4 KB pages and 16-byte entries, t is around 100–128, and a tree of height 3 holds about $10^6$–$10^7$ keys; height 4 holds billions. The root (and often the next level) stays cached in memory.",
          "Within a node, use binary search for the key position; the comparisons are cheap next to the block read.",
          "**Top-down** splitting (shown here) needs one pass and no parent pointers; **bottom-up** splitting (split only after inserting into a full leaf, and propagate) keeps nodes fuller. Both are common.",
          "File systems (NTFS, HFS+, Btrfs, ext4's directory index) and most databases use B-trees or the B+ variant, which keeps all records in the leaves.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Height.** The root has at least 1 key and 2 children; every other internal node at least $t$ children. So depth $h$ has at least $2t^{h-1}$ nodes, each with at least $t - 1$ keys, and $n \\ge 1 + (t-1)\\sum_{i=1}^{h} 2t^{i-1} = 2t^h - 1$. Hence $h \\le \\log_t \\frac{n+1}{2}$: an operation reads $O(\\log_t n)$ nodes and does $O(t \\log_t n)$ key comparisons (or $O(\\log n)$ with binary search inside nodes).",
      },
      {
        kind: "p",
        text: "**Why top-down splitting works.** Because a full child is split before the walk enters it, the parent always has room for the key that moves up, so a split never cascades upwards; symmetrically, delete enters only nodes with at least $t$ keys, so a merge or borrow never leaves a node below $t - 1$. The tests check all the B-tree invariants and compare every final tree with an independent implementation of the same rules, including after deleting every key in random order.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Bayer and McCreight introduced B-trees in 1970 (published 1972) at Boeing Research Labs; Comer's 1979 survey called them “ubiquitous”.",
          "A 2-3-4 tree (t = 2) corresponds exactly to a red-black tree: each node becomes a black node with up to two red children.",
          "Cache-oblivious B-trees and B^ε-trees (used by write-optimised stores) refine the same idea for memory hierarchies and fast inserts.",
          "B* trees (a later curriculum item) delay splits by redistributing keys to a sibling, keeping nodes at least two-thirds full.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(1)", average: "O(log n)", worst: "O(log n)" },
    space: "O(n)",
    worstClass: "log n",
    note: "O(log_t n) node visits per operation; O(t) work per node (O(log t) with binary search).",
  },
  properties: [
    { label: "Keys per node", value: "$t - 1$ to $2t - 1$ (root: at least 1)" },
    { label: "Leaves", value: "All at the same depth" },
    { label: "Height", value: "At most $\\log_t \\frac{n + 1}{2}$" },
  ],
  implementations: [
    {
      language: "python",
      entry: "btree_levels",
      code: `def split_child(x, i, t):
    y = x["kids"][i]
    z = {"keys": y["keys"][t:], "kids": y["kids"][t:]}
    mid = y["keys"][t - 1]
    y["keys"], y["kids"] = y["keys"][:t - 1], y["kids"][:t]
    x["keys"].insert(i, mid)
    x["kids"].insert(i + 1, z)

def insert(root, k, t):
    if len(root["keys"]) == 2 * t - 1:            # grow at the root
        root = {"keys": [], "kids": [root]}
        split_child(root, 0, t)
    x = root
    while True:
        i = sum(1 for key in x["keys"] if key < k)
        if not x["kids"]:
            x["keys"].insert(i, k)
            return root
        if len(x["kids"][i]["keys"]) == 2 * t - 1:  # split before entering
            split_child(x, i, t)
            if k > x["keys"][i]:
                i += 1
        x = x["kids"][i]

def btree_levels(keys, t):
    """Insert keys; return each level's nodes as key lists, top to bottom."""
    root = {"keys": [], "kids": []}
    for k in keys:
        root = insert(root, k, t)
    levels, frontier = [], [root]
    while frontier:
        levels.append([n["keys"] for n in frontier])
        frontier = [c for n in frontier for c in n["kids"]]
    return levels
`,
      tests: [
        {
          args: [[10, 20, 30, 40, 50, 60, 70, 80, 90], 2],
          expected: [[[40]], [[20], [60]], [[10], [30], [50], [70, 80, 90]]],
        },
      ],
    },
    {
      language: "javascript",
      entry: "maxHeight",
      code: `// Height bound (in edges below the root) for n keys and minimum degree t.
function maxHeight(n, t) {
  return Math.floor(Math.log((n + 1) / 2) / Math.log(t));
}
`,
      tests: [
        { args: [9, 2], expected: 2 },
        { args: [1000000, 100], expected: 2 },
        { args: [1000000000, 100], expected: 4 },
      ],
    },
  ],
  visualizer: "b-tree",
  practice: [
    {
      id: "btree-split",
      kind: "mcq",
      prompt: "With t = 2, the leaf [30 40 50] is full and 60 must go below it. What happens?",
      options: [
        "Split it: 40 moves up to the parent, leaving [30] and [50]; 60 then joins [50]",
        "60 is added, making [30 40 50 60]",
        "The tree grows a new level below the leaf",
        "The keys are redistributed to a sibling",
      ],
      answer: 0,
      explanation:
        "A full node (2t − 1 = 3 keys) is split before the walk enters it; its middle key moves up.",
      distractors: {
        1: "A node may hold at most 2t − 1 = 3 keys.",
        2: "B-trees grow only at the root, so all leaves stay at one depth.",
        3: "That is the B* tree's refinement, not the basic B-tree.",
      },
      hints: ["How many keys may a node hold when t = 2?"],
      objective: "Node splits",
    },
    {
      id: "btree-height",
      kind: "numeric",
      prompt:
        "A B-tree with t = 100 holds one million keys. At most how many levels below the root can it have?",
      answer: 2,
      explanation: "$h \\le \\log_{100} \\frac{10^6 + 1}{2} \\approx 2.85$, so at most 2.",
      hints: ["$h \\le \\log_t \\frac{n+1}{2}$."],
      objective: "Height bound",
    },
  ],
  exam: {
    definition:
      "A B-tree of minimum degree t is a search tree whose non-root nodes hold t − 1 to 2t − 1 sorted keys, internal nodes with k keys have k + 1 children, and all leaves share one depth.",
    steps: [
      "Search: pick the child between the right keys at each node.",
      "Insert: split full nodes on the way down (the root split grows the tree); insert into the leaf.",
      "Delete: ensure each node entered has ≥ t keys by borrowing or merging; replace internal keys by predecessor/successor.",
    ],
    timeComplexity: "$O(\\log_t n)$ node accesses; $O(t \\log_t n)$ CPU time.",
    spaceComplexity: "$O(n)$; nodes at least half full.",
    correctness:
      "Splits and merges preserve sorted order and keep all leaves at one depth because height changes only at the root.",
    applications: ["Database indexes", "File systems", "Key-value stores on disk"],
    limitations: [
      "Many cases for deletion",
      "Less efficient than binary trees when everything is in memory and nodes are small",
    ],
    faq: [
      {
        q: "Why is the root allowed fewer keys?",
        a: "When the root splits, the new root has a single key and two children; requiring t − 1 keys of it would make the first split impossible.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Multiway nodes, t − 1 to 2t − 1 keys.", "All leaves at one depth; O(log n)."],
      },
      {
        marks: 15,
        outline: [
          "Definition and invariants (3).",
          "Search and insert with splitting, with a diagram (5).",
          "Delete cases (4).",
          "Height bound and why disks favour large t (3).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "R. Bayer, E. McCreight, “Organization and maintenance of large ordered indexes,” Acta Informatica, 1(3), 1972.",
      supports: "The original B-tree.",
    },
    {
      citation: "D. Comer, “The ubiquitous B-tree,” ACM Computing Surveys, 11(2), 1979.",
      supports: "B-tree variants and their use in practice.",
    },
    {
      citation:
        "T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 3rd ed., MIT Press, 2009, Chapter 18.",
      supports: "Top-down insertion and deletion, and the height bound.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-26",
};
