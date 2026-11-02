import type { AlgorithmEntry } from "../types";

export const splayTreeEntry: AlgorithmEntry = {
  slug: "splay-tree",
  name: "Splay Tree",
  aliases: ["Self-adjusting binary search tree"],
  curriculum: [158],
  domain: "trees",
  subcategory: "Balanced search trees",
  difficulty: "advanced",
  summary:
    "A binary search tree that stores no balance information at all: every access moves the touched key to the root through zig, zig-zig and zig-zag rotations. Single operations can be slow, but any sequence of m operations costs O((m + n) log n), and frequently used keys stay near the top.",
  tags: ["self-adjusting", "binary search tree", "rotation", "amortized analysis"],
  prerequisites: ["Binary search trees", "Tree rotations", "Amortised analysis"],
  related: ["avl-tree", "red-black-tree", "treap", "bst"],
  problem: {
    input: "A sequence of insert, delete and search operations on integer keys.",
    output:
      "The result of each operation; the tree reorganises itself so that the total cost is O(log n) amortised per operation.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Instead of keeping the tree balanced all the time, keep the keys you use close to the root. After every access, rotate the key all the way up. Done naively (one rotation at a time), this can leave a long path long; done in **pairs** of rotations — the splay step — every node on the access path ends up roughly half as deep as before, so long paths repair themselves while they are being used.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "To **splay** $x$, repeat until $x$ is the root (p = parent, g = grandparent):",
          "**Zig** — p is the root: rotate at p.",
          "**Zig-zig** — x and p are both left children (or both right): rotate at g first, then at p.",
          "**Zig-zag** — one is a left child and the other a right child: rotate at p, then at g.",
          "Search and insert walk down as in a BST and splay the key found or inserted (after a failed search, the last node visited). Delete splays the key to the root, splays the largest key of its left subtree up to just below it, hangs the right subtree there, and removes the root.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): insert 10, 20, …, 70, then search 10 and 40.",
      },
      {
        kind: "table",
        head: ["step", "what happens", "height afterwards"],
        rows: [
          [
            "insert 10 … 70",
            "each new key is a right child of the root: one zig puts it on top",
            "7 (a left-leaning path 70, 60, …, 10)",
          ],
          ["search 10", "10 is at depth 7: three zig-zig steps", "5"],
          ["search 40", "one zig-zag step brings 40 to the root", "4"],
        ],
      },
      {
        kind: "p",
        text: "Inserting sorted keys built a path — the worst shape — cheaply, one rotation each. Paying for it, the search for 10 walked 7 levels, but its splay folded the path: afterwards 10 is the root and the height is 5. In the third preset, deleting 5 splays it to the root, splays 4 (the largest key on its left) up under it, hangs 8's subtree under 4, and removes 5: the tree has height 3.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "**Top-down splaying** (Sleator and Tarjan) splays while walking down, with no parent pointers and no second pass; it is the usual production version.",
          "Splaying on every read makes reads modify the tree: splay trees are awkward to share between threads, and a read-only traversal must avoid splaying.",
          "Good for skewed or local access patterns: caches, recently used lists, and data compression. GCC's support library (libiberty), for example, ships a splay-tree implementation.",
          "Split and join are natural: splay a key to the root and cut one of its edges, which makes splay trees convenient for link-cut trees and ropes.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Amortised analysis.** Give each node $x$ a rank $r(x) = \\log_2(\\text{size of } x\\text{'s subtree})$ and take the potential $\\Phi$ = the sum of all ranks. The **access lemma** shows that splaying $x$ in a tree with root $t$ costs at most $3(r(t) - r(x)) + 1 \\le 3 \\log_2 n + 1$ rotations amortised: each zig-zig or zig-zag step costs at most $3(r'(x) - r(x))$, the sum telescopes, and only the single final zig adds 1. Hence $m$ operations cost $O((m + n) \\log n)$.",
      },
      {
        kind: "p",
        text: "**Why pairs of rotations.** Rotating $x$ up one level at a time can leave the rest of the path as long as before, and a sequence of such accesses can cost $\\Theta(n)$ each. The zig-zig step rotates at the grandparent first, which is exactly what makes the potential drop pay for long paths. The tests check the splay rule after every random sequence: a key that was found or inserted ends at the root, and after a failed search the root is the key's predecessor or successor.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**Static optimality:** splay trees are within a constant factor of the best static BST for any access sequence, without knowing the frequencies. The **working-set** and **sequential-access** theorems also hold.",
          "The **dynamic optimality conjecture** — that splay trees are within a constant factor of every BST algorithm on every sequence — has been open since 1985.",
          "Link-cut trees (also by Sleator and Tarjan) use splay trees to represent paths of a forest, giving $O(\\log n)$ amortised dynamic-tree operations used in network-flow algorithms.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(1)", average: "O(log n) amortised", worst: "O(n)" },
    space: "O(n)",
    worstClass: "n",
    note: "A single operation can cost O(n), but any m operations cost O((m + n) log n) in total.",
  },
  properties: [
    { label: "Balance information", value: "None" },
    { label: "Amortised cost", value: "$O(\\log n)$ per operation" },
    { label: "After an access", value: "The key accessed is at the root" },
  ],
  implementations: [
    {
      language: "python",
      entry: "splay_root_after",
      code: `class N:
    def __init__(self, k):
        self.k, self.l, self.r, self.p = k, None, None, None

def rotate(x):
    """Rotate x above its parent."""
    p, g = x.p, x.p.p
    if p.l is x:
        p.l, x.r = x.r, p
        if p.l: p.l.p = p
    else:
        p.r, x.l = x.l, p
        if p.r: p.r.p = p
    p.p, x.p = x, g
    if g:
        if g.l is p: g.l = x
        else: g.r = x

def splay(x):
    while x.p:
        p, g = x.p, x.p.p
        if g and (g.l is p) == (p.l is x):
            rotate(p)                      # zig-zig: the grandparent first
        elif g:
            rotate(x)                      # zig-zag
        rotate(x)
    return x

def splay_root_after(keys, accesses):
    root = None
    for k in keys:                          # insert and splay each key
        if root is None:
            root = N(k)
            continue
        v = root
        while True:
            nxt = v.l if k < v.k else v.r
            if nxt is None:
                n = N(k); n.p = v
                if k < v.k: v.l = n
                else: v.r = n
                root = splay(n)
                break
            v = nxt
    for k in accesses:                      # search (keys present) and splay
        v = root
        while v.k != k:
            v = v.l if k < v.k else v.r
        root = splay(v)
    return root.k
`,
      tests: [
        { args: [[10, 20, 30, 40, 50, 60, 70], [10]], expected: 10 },
        {
          args: [
            [10, 20, 30, 40, 50, 60, 70],
            [10, 40],
          ],
          expected: 40,
        },
      ],
    },
    {
      language: "javascript",
      entry: "accessBound",
      code: `// Amortised rotations for one splay in an n-node tree, by the access lemma: 3 log2 n + 1.
function accessBound(n) {
  return 3 * Math.log2(n) + 1;
}
`,
      tests: [
        { args: [1], expected: 1 },
        { args: [8], expected: 10 },
      ],
    },
  ],
  visualizer: "splay-tree",
  practice: [
    {
      id: "splay-case",
      kind: "mcq",
      prompt:
        "x is the left child of p, and p is the left child of g. Which splay step applies, and in what order are the rotations?",
      options: [
        "Zig-zig: rotate at g, then at p",
        "Zig-zig: rotate at p, then at g",
        "Zig-zag: rotate at p, then at g",
        "Zig: rotate at p only",
      ],
      answer: 0,
      explanation:
        "Both are left children, so it is zig-zig, and the grandparent is rotated first — the order that gives the amortised bound.",
      distractors: {
        1: "Rotating at p first is plain move-to-root, which lacks the amortised guarantee.",
        2: "Zig-zag is for a left child of a right child (or vice versa).",
        3: "Zig applies only when p is the root.",
      },
      hints: ["Are x and p on the same side?"],
      objective: "Splay steps",
    },
    {
      id: "splay-root",
      kind: "numeric",
      prompt:
        "In a splay tree holding 1 to 9, you search for 6 and then for 3. Which key is at the root afterwards?",
      answer: 3,
      explanation: "Every access splays the key it finds to the root; the last access was 3.",
      hints: ["What does every access do to the key it finds?"],
      objective: "Self-adjustment",
    },
  ],
  exam: {
    definition:
      "A splay tree is a self-adjusting BST that moves each accessed key to the root with zig, zig-zig and zig-zag rotations, achieving O(log n) amortised time per operation.",
    steps: [
      "Access the key as in a BST.",
      "Splay it to the root: zig (parent is root), zig-zig (same side: grandparent first), zig-zag (opposite sides).",
      "Delete: splay the key, join its two subtrees via the maximum of the left one.",
    ],
    timeComplexity: "$O(\\log n)$ amortised; $O(n)$ for a single worst-case operation.",
    spaceComplexity: "$O(n)$; no balance fields.",
    correctness:
      "Rotations preserve in-order; the potential-function argument (access lemma) bounds the amortised cost by $3 \\log_2 n + 1$ rotations.",
    applications: [
      "Caches and recently-used lists",
      "Link-cut trees",
      "Ropes and editors",
      "Compression",
    ],
    limitations: [
      "Reads modify the tree",
      "Single operations can be slow, unsuitable for real-time guarantees",
    ],
    faq: [
      {
        q: "Why not just rotate the key to the root one step at a time?",
        a: "That simple move-to-root rule can cost $\\Theta(n)$ per access forever (for example, accessing keys in sorted order repeatedly); the zig-zig step is what halves the depth of the access path.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Self-adjusting BST; splay accessed key to the root.", "$O(\\log n)$ amortised."],
      },
      {
        marks: 10,
        outline: [
          "The three splay steps with diagrams (4).",
          "Worked access (2).",
          "Potential function and access lemma (3).",
          "One application (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "D. D. Sleator, R. E. Tarjan, “Self-adjusting binary search trees,” Journal of the ACM, 32(3), 1985.",
      supports:
        "Splay trees, the access lemma, static optimality and the dynamic optimality conjecture.",
    },
    {
      citation: "R. E. Tarjan, Data Structures and Network Algorithms, SIAM, 1983.",
      supports: "Amortised analysis and dynamic trees.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-26",
};
