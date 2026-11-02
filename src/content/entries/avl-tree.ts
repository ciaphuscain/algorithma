import type { AlgorithmEntry } from "../types";

export const avlTreeEntry: AlgorithmEntry = {
  slug: "avl-tree",
  name: "AVL Tree",
  aliases: ["Adelson-Velsky–Landis tree", "Height-balanced binary search tree"],
  curriculum: [156],
  domain: "trees",
  subcategory: "Balanced search trees",
  difficulty: "intermediate",
  summary:
    "The first self-balancing binary search tree: the heights of every node's two subtrees differ by at most one. After each insert or delete, one or two rotations on the path to the root restore the balance, so the height stays below 1.44 log₂ n and every operation is O(log n).",
  tags: ["balanced tree", "binary search tree", "rotation", "height balance"],
  prerequisites: ["Binary search trees", "Tree rotations"],
  related: ["red-black-tree", "bst", "splay-tree", "treap"],
  problem: {
    input: "A sequence of insert, delete and search operations on integer keys.",
    output:
      "The result of each operation, with the tree kept height-balanced so that each takes O(log n) time.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A plain binary search tree built from sorted keys degenerates into a list: searches become linear. An AVL tree refuses to let either side of any node get more than one level taller than the other. When an insert or delete breaks that rule, it is broken only on the path that changed, and a **rotation** — re-hanging a parent below its child while keeping the keys in order — fixes it locally.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Insert or delete as in a binary search tree (a node with two children is replaced by its successor's key, and the successor's node is removed).",
          "Walk back up to the root. At each node, recompute height = 1 + max(heights of the children) and the **balance factor** bf = height(left) − height(right).",
          "bf = +2 (left-heavy): if the left child leans right (bf < 0), rotate it left first (the **left-right** case); then rotate right at the node.",
          "bf = −2 (right-heavy): the mirror image — **right-left** case when the right child leans left.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): insert 10, 20, …, 70 in ascending order — the input that ruins a plain BST.",
      },
      {
        kind: "table",
        head: ["insert", "imbalance", "fix", "root afterwards"],
        rows: [
          ["10, 20", "none", "—", "10"],
          ["30", "10 has bf −2", "rotate left at 10", "20"],
          ["40", "none", "—", "20"],
          ["50", "30 has bf −2", "rotate left at 30", "20"],
          ["60", "20 has bf −2", "rotate left at 20", "40"],
          ["70", "50 has bf −2", "rotate left at 50", "40"],
        ],
      },
      {
        kind: "p",
        text: "Four rotations later the tree is perfectly balanced: 40 at the root, 20 and 60 below it, and 10, 30, 50, 70 as leaves — height 3, where a plain BST would have height 7. The second preset (30, 10, 20, …) triggers a **left-right** double rotation at once: 20 is the inner grandchild of 30, so 10 is rotated left and then 30 right. In the third preset, deleting 60, 70 and 80 leaves 50 left-heavy, and one right rotation at 50 makes 30 the root.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Store the height (or just the balance factor, two bits) in every node; update it bottom-up after every change.",
          "Insertion needs at most one single or double rotation in total; after it, the subtree has its old height and the walk up can stop. Deletion may need a rotation at every level up to the root.",
          "Recursive implementations return the new subtree root from insert/delete, which makes re-attaching after a rotation automatic.",
          "AVL trees are more rigidly balanced than red-black trees: searches are slightly faster, updates do slightly more work. Lookup-heavy workloads favour AVL.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Height bound.** Let $N(h)$ be the fewest nodes in an AVL tree of height $h$. The sparsest tree has subtrees of heights $h - 1$ and $h - 2$, so $N(h) = N(h-1) + N(h-2) + 1$ with $N(1) = 1$, $N(2) = 2$. Then $N(h) + 1$ is a Fibonacci number, $N(h) + 1 = F_{h+2} \\ge \\varphi^{h}$, so $h < \\log_\\varphi(n + 2) \\approx 1.4405 \\log_2(n + 2)$. Every operation walks one root-to-leaf path: $O(\\log n)$.",
      },
      {
        kind: "p",
        text: "**Why rotations fix the balance.** Suppose an insert makes node $z$ left-heavy by 2 through its left child $y$. If the new key went into $y$'s left subtree, a right rotation at $z$ lifts that subtree one level and lowers $z$'s right subtree one level: both sides end equal. If it went into $y$'s right subtree, a single rotation would only move the imbalance to the other side; rotating $y$ left first turns it into the first case. The tests recompute every height from the final shape and check that no node is out of balance after every single operation of random sequences.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Adelson-Velsky and Landis published the structure in 1962; it was the first balanced search tree with $O(\\log n)$ worst-case operations.",
          "Rank-balanced trees (Haeupler, Sen and Tarjan) unify AVL and red-black trees; WAVL trees behave like AVL trees under insertions only and like red-black trees once deletions occur.",
          "Augmenting each node with its subtree size gives order statistics (k-th smallest, rank) in $O(\\log n)$, maintained through rotations.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(1)", average: "O(log n)", worst: "O(log n)" },
    space: "O(n)",
    worstClass: "log n",
    note: "Per operation; the best case is a search that finds the key at the root.",
  },
  properties: [
    { label: "Balance rule", value: "Subtree heights differ by at most 1 at every node" },
    { label: "Height", value: "Below $1.4405 \\log_2(n + 2)$" },
    { label: "Rotations per insert", value: "At most one single or double rotation" },
  ],
  implementations: [
    {
      language: "python",
      entry: "avl_preorder",
      code: `def height(n):
    return n["h"] if n else 0

def fix(n):
    n["h"] = 1 + max(height(n["l"]), height(n["r"]))
    return n

def rotate_right(z):
    y = z["l"]
    z["l"], y["r"] = y["r"], z
    fix(z)
    return fix(y)

def rotate_left(z):
    y = z["r"]
    z["r"], y["l"] = y["l"], z
    fix(z)
    return fix(y)

def insert(n, k):
    if n is None:
        return {"k": k, "l": None, "r": None, "h": 1}
    if k < n["k"]:
        n["l"] = insert(n["l"], k)
    elif k > n["k"]:
        n["r"] = insert(n["r"], k)
    else:
        return n
    fix(n)
    bf = height(n["l"]) - height(n["r"])
    if bf > 1:
        if k > n["l"]["k"]:                      # left-right case
            n["l"] = rotate_left(n["l"])
        return rotate_right(n)
    if bf < -1:
        if k < n["r"]["k"]:                      # right-left case
            n["r"] = rotate_right(n["r"])
        return rotate_left(n)
    return n

def avl_preorder(keys):
    root = None
    for k in keys:
        root = insert(root, k)
    out = []
    def walk(n):
        if n:
            out.append(n["k"]); walk(n["l"]); walk(n["r"])
    walk(root)
    return out
`,
      tests: [
        { args: [[10, 20, 30, 40, 50, 60, 70]], expected: [40, 20, 10, 30, 60, 50, 70] },
        { args: [[30, 10, 20]], expected: [20, 10, 30] },
      ],
    },
    {
      language: "javascript",
      entry: "minNodes",
      code: `// Fewest nodes in an AVL tree of height h: N(h) = N(h-1) + N(h-2) + 1.
function minNodes(h) {
  if (h <= 0) return 0;
  let [a, b] = [0, 1]; // N(0), N(1)
  for (let i = 2; i <= h; i++) [a, b] = [b, a + b + 1];
  return b;
}
`,
      tests: [
        { args: [1], expected: 1 },
        { args: [3], expected: 4 },
        { args: [5], expected: 12 },
        { args: [10], expected: 143 },
      ],
    },
  ],
  visualizer: "avl-tree",
  practice: [
    {
      id: "avl-case",
      kind: "mcq",
      prompt: "Insert 30, then 10, then 20 into an empty AVL tree. Which fix is applied?",
      options: [
        "Left-right: rotate left at 10, then right at 30",
        "A single right rotation at 30",
        "A single left rotation at 10",
        "None: the tree is balanced",
      ],
      answer: 0,
      explanation:
        "30 becomes left-heavy (bf +2) through 10, but 20 is 10's right child — the inner grandchild — so a double rotation is needed; 20 ends at the root.",
      distractors: {
        1: "A single rotation would make 10 the root with 30 right-heavy: still unbalanced.",
        2: "That alone leaves 30 with a left chain of height 2.",
        3: "30 has a left subtree of height 2 and an empty right subtree.",
      },
      hints: ["Is 20 an outer or inner grandchild of 30?"],
      objective: "Recognise the rotation case",
    },
    {
      id: "avl-min-nodes",
      kind: "numeric",
      prompt: "What is the fewest number of nodes an AVL tree of height 4 can have?",
      answer: 7,
      explanation: "$N(4) = N(3) + N(2) + 1 = 4 + 2 + 1 = 7$.",
      hints: ["$N(1) = 1$, $N(2) = 2$, $N(h) = N(h-1) + N(h-2) + 1$."],
      objective: "Height bound",
    },
  ],
  exam: {
    definition:
      "An AVL tree is a binary search tree in which the heights of the two subtrees of every node differ by at most one; rotations restore this after updates.",
    steps: [
      "BST insert or delete.",
      "Walk up, updating heights and balance factors.",
      "At bf ±2: single rotation (outer case) or double rotation (inner case).",
    ],
    timeComplexity: "$O(\\log n)$ for search, insert and delete.",
    spaceComplexity: "$O(n)$, plus a height per node.",
    correctness:
      "Rotations preserve in-order (the BST property) and restore the height balance at the lowest unbalanced node; the Fibonacci recurrence bounds the height by about $1.44 \\log_2 n$.",
    applications: [
      "In-memory ordered maps and sets",
      "Database indexes held in memory",
      "Lookup-heavy symbol tables",
    ],
    limitations: ["More rotations on update than red-black trees", "Extra height field per node"],
    faq: [
      {
        q: "AVL or red-black?",
        a: "AVL trees are shallower (≈1.44 log n versus ≤2 log n), so lookups are slightly faster; red-black trees rotate less on updates. Many standard libraries chose red-black.",
      },
    ],
    answers: [
      { marks: 2, outline: ["Height difference ≤ 1 at every node.", "$O(\\log n)$ operations."] },
      {
        marks: 10,
        outline: [
          "Definition and balance factor (2).",
          "The four rotation cases with a diagram (4).",
          "Worked insertion sequence (2).",
          "Height bound via Fibonacci (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "G. M. Adelson-Velsky, E. M. Landis, “An algorithm for the organization of information,” Soviet Mathematics Doklady, 3, 1962.",
      supports: "The original AVL tree.",
    },
    {
      citation:
        "D. E. Knuth, The Art of Computer Programming, Vol. 3: Sorting and Searching, 2nd ed., Addison-Wesley, 1998, Section 6.2.3.",
      supports: "Balanced trees, rotations and the Fibonacci height bound.",
    },
    {
      citation:
        "B. Haeupler, S. Sen, R. E. Tarjan, “Rank-balanced trees,” ACM Transactions on Algorithms, 11(4), 2015.",
      supports: "Rank-balanced and WAVL trees.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-26",
};
