import type { AlgorithmEntry } from "../types";

export const redBlackTreeEntry: AlgorithmEntry = {
  slug: "red-black-tree",
  name: "Red-Black Tree",
  aliases: ["RB tree", "Symmetric binary B-tree"],
  curriculum: [157],
  domain: "trees",
  subcategory: "Balanced search trees",
  difficulty: "advanced",
  summary:
    "A self-balancing binary search tree that colours each node red or black: no red node has a red child, and every path down from a node passes the same number of black nodes. Fixing a violation takes recolouring and at most a few rotations, and the height stays below 2 log₂(n + 1).",
  tags: ["balanced tree", "binary search tree", "rotation", "red-black", "2-3-4 tree"],
  prerequisites: ["Binary search trees", "Tree rotations"],
  related: ["avl-tree", "bst", "splay-tree", "treap"],
  problem: {
    input: "A sequence of insert, delete and search operations on integer keys.",
    output:
      "The result of each operation, with the colour rules kept so that each takes O(log n) time.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Instead of tracking exact heights like an AVL tree, a red-black tree tracks a looser property with one bit per node. Count only the black nodes: every path from the root to an empty spot has the same number of them, so the black nodes alone form a perfectly balanced skeleton. Red nodes are slack, allowed only between black ones — never two in a row — so no path can be more than twice as long as another.",
      },
      {
        kind: "p",
        text: "Another way to see it: merge each red node into its black parent. Each black node with its red children becomes one node of a **2-3-4 tree** (a B-tree with 2 to 4 children), and every leaf of that tree is at the same depth. Recolouring corresponds to splitting a full 4-node; rotations just reshape a node's internal layout.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "**Rules:** every node is red or black; the root is black; a red node has no red child; every path from a node down to an empty child has the same number of black nodes (its black height).",
          "**Insert:** add the key as a red leaf (it changes no black count). If its parent is red, look at the uncle: if the uncle is red, colour the parent and uncle black and the grandparent red, then repeat from the grandparent; if the uncle is black, rotate (twice if the new node is an inner grandchild) so the middle key rises, colour it black and the old grandparent red. Finally colour the root black.",
          "**Delete:** remove the node (or its successor) as in a BST. Removing a red node changes nothing; removing a black one leaves its place one black short — a “double black” — which is fixed by looking at the sibling: borrow through rotations if the sibling or one of its children is red, otherwise colour the sibling red and push the shortage up to the parent.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): insert 10, 20, …, 80 in ascending order.",
      },
      {
        kind: "table",
        head: ["insert", "conflict", "fix"],
        rows: [
          ["10, 20", "none (20 is red under black 10)", "—"],
          ["30", "red 30 under red 20; uncle empty (black)", "rotate left at 10; 20 black, 10 red"],
          [
            "40",
            "red 40 under red 30; uncle 10 red",
            "recolour: 30, 10 black; 20 red, then the root is coloured black",
          ],
          ["50", "red under red; uncle empty", "rotate left at 30"],
          ["60", "uncle 30 red", "recolour: 50, 30 black; 40 red"],
          ["70", "uncle empty", "rotate left at 50"],
          [
            "80",
            "uncle 50 red",
            "recolour: 70, 50 black; 60 red — now 60 and 40 are both red, uncle 10 black: rotate left at 20",
          ],
        ],
      },
      {
        kind: "p",
        text: "The result has 40 (black) at the root, red children 20 and 60, black 10, 30, 50, 70 and a red 80: height 4 and black height 2, after 4 rotations. The delete preset removes 8, 12, 19 and 31 from a six-key tree: removing the red 8 needs nothing, while removing black nodes twice pushes a double black up by recolouring a sibling red.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Many libraries use red-black trees: C++ `std::map` and `std::set` in common implementations, Java's `TreeMap`, and the Linux kernel's `rbtree` (used, for example, by its process scheduler).",
          "A sentinel `NIL` node (black) in place of empty children removes many null checks, as in Cormen et al.",
          "Insertion needs at most 2 rotations and deletion at most 3; recolouring can travel up the tree but is cheap. Fewer rotations than AVL makes red-black trees attractive when rotations are expensive (persistent or concurrent versions).",
          "**Left-leaning red-black trees** (Sedgewick) allow red links only on the left, which shortens the code considerably; they correspond to 2-3 trees.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Height bound.** By induction, a subtree whose root has black height $b$ contains at least $2^{b} - 1$ nodes. No two reds are adjacent, so at least half the nodes on any root-to-leaf path are black: $b \\ge h/2$. Hence $n \\ge 2^{h/2} - 1$, that is $h \\le 2 \\log_2(n + 1)$, and every operation is $O(\\log n)$.",
      },
      {
        kind: "p",
        text: "**Why the insert fix works.** A red leaf keeps every black height; the only possible violation is red-under-red. A red uncle means the grandparent's 2-3-4 node is full: recolouring splits it and sends the middle key (the grandparent, now red) up, which may cause the same conflict one level higher. A black uncle means there is room: one or two rotations place the three keys with the middle one on top, black, and the conflict is gone. The tests check all four colour rules, the black height and the $2 \\log_2(n + 1)$ bound after every operation of random insert/delete sequences.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Guibas and Sedgewick introduced the red-black colouring in 1978, building on Bayer's symmetric binary B-trees (1972).",
          "Updates take $O(1)$ amortised restructuring (recolourings and rotations) over any sequence, which makes red-black trees good bases for persistent and finger-tree variants.",
          "AA trees (one of the next curriculum items) restrict red nodes to right children, reducing the number of cases further.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(1)", average: "O(log n)", worst: "O(log n)" },
    space: "O(n)",
    worstClass: "log n",
    note: "Per operation; insert uses at most 2 rotations and delete at most 3.",
  },
  properties: [
    { label: "Height", value: "At most $2 \\log_2(n + 1)$" },
    { label: "Rotations", value: "≤ 2 per insert, ≤ 3 per delete" },
    { label: "Extra storage", value: "One colour bit per node" },
  ],
  implementations: [
    {
      language: "python",
      entry: "is_red_black",
      code: `def is_red_black(tree):
    """tree: (key, colour, left, right) tuples or None. Returns the black height, or -1."""
    def check(n, lo, hi, parent_red):
        if n is None:
            return 1
        key, colour, left, right = n
        if not (lo < key < hi):
            return -1                                  # not a search tree
        red = colour == "red"
        if red and parent_red:
            return -1                                  # red node with a red parent
        a = check(left, lo, key, red)
        b = check(right, key, hi, red)
        if a < 0 or a != b:
            return -1                                  # unequal black counts
        return a + (0 if red else 1)
    if tree is not None and tree[1] != "black":
        return -1
    bh = check(tree, float("-inf"), float("inf"), False)
    return bh - 1 if bh > 0 else -1
`,
      tests: [
        {
          args: [
            [
              38,
              "black",
              [19, "red", [12, "black", [8, "red", null, null], null], [31, "black", null, null]],
              [41, "black", null, null],
            ],
          ],
          expected: 2,
        },
        { args: [[10, "black", [5, "red", [2, "red", null, null], null], null]], expected: -1 },
        { args: [[10, "black", [5, "black", null, null], null]], expected: -1 },
      ],
    },
    {
      language: "javascript",
      entry: "maxHeight",
      code: `// The height bound a red-black tree with n keys can never exceed: 2 log2(n + 1).
function maxHeight(n) {
  return Math.floor(2 * Math.log2(n + 1));
}
`,
      tests: [
        { args: [7], expected: 6 },
        { args: [1000000], expected: 39 },
      ],
    },
  ],
  visualizer: "red-black-tree",
  practice: [
    {
      id: "rb-uncle",
      kind: "mcq",
      prompt: "A new red node's parent is red and its uncle is red. What happens?",
      options: [
        "Parent and uncle become black, grandparent red; continue from the grandparent",
        "Rotate at the grandparent",
        "Colour the new node black",
        "Nothing: two reds in a row are allowed",
      ],
      answer: 0,
      explanation:
        "This keeps every black height and moves the possible conflict two levels up — in 2-3-4 terms, it splits a full node.",
      distractors: {
        1: "Rotation is for a black uncle.",
        2: "That would add a black node to some paths only.",
        3: "No red node may have a red child.",
      },
      hints: ["Which case needs no rotation?"],
      objective: "Insert fix-up cases",
    },
    {
      id: "rb-min-nodes",
      kind: "numeric",
      prompt: "A red-black tree's root has black height 3. At least how many keys does it hold?",
      answer: 7,
      explanation:
        "A subtree of black height $b$ has at least $2^b - 1$ nodes: $2^3 - 1 = 7$ (a perfect all-black tree).",
      hints: ["The fewest nodes come from a tree with no red nodes."],
      objective: "Height bound",
    },
  ],
  exam: {
    definition:
      "A red-black tree is a BST with a colour per node such that the root is black, red nodes have black children, and all root-to-leaf paths have the same number of black nodes.",
    steps: [
      "Insert a red leaf; fix red-red by recolouring (red uncle) or rotating (black uncle).",
      "Delete as a BST; if a black node was removed, fix the double black using the sibling.",
      "Colour the root black.",
    ],
    timeComplexity: "$O(\\log n)$ per operation.",
    spaceComplexity: "$O(n)$ plus one bit per node.",
    correctness:
      "The colour rules force $h \\le 2 \\log_2(n + 1)$; each fix-up case restores them while preserving in-order.",
    applications: [
      "Ordered maps in standard libraries",
      "Kernel schedulers and memory maps",
      "Interval and order-statistic trees",
    ],
    limitations: ["Many cases to implement, especially deletion", "Slightly taller than AVL trees"],
    faq: [
      {
        q: "Why is a new node red, not black?",
        a: "A black leaf would add one to the black count of some paths only; a red leaf breaks at most the no-red-red rule, which is local and easier to fix.",
      },
    ],
    answers: [
      { marks: 2, outline: ["The four colour rules.", "Height ≤ 2 log₂(n + 1)."] },
      {
        marks: 10,
        outline: [
          "Rules (2).",
          "Insert cases with diagrams (4).",
          "Worked insertion sequence (2).",
          "Height bound proof (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "L. J. Guibas, R. Sedgewick, “A dichromatic framework for balanced trees,” Proceedings of the 19th Annual Symposium on Foundations of Computer Science (FOCS), 1978.",
      supports: "The red-black colouring.",
    },
    {
      citation:
        "R. Bayer, “Symmetric binary B-trees: data structure and maintenance algorithms,” Acta Informatica, 1(4), 1972.",
      supports: "The B-tree view underlying red-black trees.",
    },
    {
      citation:
        "T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 3rd ed., MIT Press, 2009, Chapter 13.",
      supports: "Insert and delete fix-up cases and the height bound.",
    },
    {
      citation:
        "R. Sedgewick, “Left-leaning red-black trees,” manuscript, Princeton University, 2008.",
      supports: "The left-leaning variant.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-26",
};
