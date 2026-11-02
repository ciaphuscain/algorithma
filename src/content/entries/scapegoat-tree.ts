import type { AlgorithmEntry } from "../types";

export const scapegoatTreeEntry: AlgorithmEntry = {
  slug: "scapegoat-tree",
  name: "Scapegoat Tree",
  aliases: ["α-weight-balanced tree with partial rebuilding"],
  curriculum: [160],
  domain: "trees",
  subcategory: "Balanced search trees",
  difficulty: "advanced",
  summary:
    "A binary search tree that stores nothing extra in its nodes. When an insert lands too deep, it finds an ancestor whose subtree is lopsided — the scapegoat — and rebuilds that subtree perfectly balanced. Searches are O(log n) in the worst case and updates O(log n) amortised.",
  tags: [
    "balanced tree",
    "binary search tree",
    "partial rebuilding",
    "amortized analysis",
    "weight balance",
  ],
  prerequisites: ["Binary search trees", "Amortised analysis", "Tree rotations"],
  related: ["avl-tree", "red-black-tree", "splay-tree", "bst"],
  problem: {
    input: "A sequence of insert, delete and search operations on integer keys.",
    output:
      "The result of each operation, keeping the depth below log₃⁄₂ n so that searches take O(log n) time.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Other balanced trees repair every small imbalance at once, which needs balance data in every node. A scapegoat tree lets the tree drift and only reacts when something is clearly wrong: a new key deeper than $\\log_{3/2} n$. Somewhere on the way back up there must be a node with one side holding more than two thirds of its keys. Blame that node, and rebuild its subtree from scratch as a perfectly balanced tree. Rebuilding is expensive, but it happens rarely enough that the cost averages out.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "**Insert:** add the key as a BST leaf. If its depth exceeds $\\lfloor \\log_{3/2} n \\rfloor$, walk up to the first ancestor $s$ with a child holding more than $\\tfrac{2}{3}$ of $s$'s subtree, and rebuild $s$'s subtree.",
          "**Delete:** delete as in a BST. If the size falls below $\\tfrac{2}{3}$ of the largest size since the last full rebuild, rebuild the whole tree.",
          "**Rebuild** (here, with rotations only — the Day–Stout–Warren method): rotate right until the subtree is a right-leaning “vine”; then rotate left at every other vine node, repeatedly, which folds the vine into a tree of minimum height.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): insert 1, 2, …, 10 in ascending order.",
      },
      {
        kind: "table",
        head: ["insert", "depth", "limit ⌊log₃⁄₂ n⌋", "action"],
        rows: [
          ["1–4", "0–3", "0–3", "none"],
          ["5", "4", "3", "scapegoat 2 (its child 3 holds 3 of its 4 keys): rebuild 2's subtree"],
          ["6–8", "within the limit", "", "none"],
          ["9", "6", "5", "scapegoat 6 (child 7 holds 3 of 4 keys): rebuild 6's subtree"],
          ["10", "5", "5", "none"],
        ],
      },
      {
        kind: "p",
        text: "Two small rebuilds of 4 keys each kept sorted input from building a path: the final height is 6 rather than 10. In the third preset, deleting 20, 30 and 40 from seven keys leaves 4, fewer than $\\tfrac{2}{3} \\times 7$, so the whole tree is rebuilt into height 3.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Nodes need only a key and two children: sizes are computed during the walk back up, which is paid for by the rebuild that follows.",
          "The usual rebuild flattens the subtree into an array by in-order traversal and builds a balanced tree from the middle element outwards: $O(k)$ time and $O(k)$ extra space. Day–Stout–Warren does the same in $O(k)$ time with $O(1)$ extra space, using rotations.",
          "The balance parameter $\\alpha$ (here $\\tfrac{2}{3}$) trades search speed against rebuild frequency: closer to $\\tfrac{1}{2}$ means shallower trees and more rebuilds.",
          "Because nodes carry no balance data, scapegoat trees suit structures where per-node bookkeeping is awkward, such as k-d trees and other trees with expensive rotations.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**A scapegoat exists.** If every ancestor $v$ of the new node had both children of size at most $\\alpha \\cdot \\text{size}(v)$, then sizes would shrink by a factor $\\alpha$ per level, and a node at depth $d$ would need $n \\ge (1/\\alpha)^d$, so $d \\le \\log_{1/\\alpha} n$. A deeper node therefore has an ancestor that is not $\\alpha$-weight-balanced.",
      },
      {
        kind: "p",
        text: "**Amortised cost.** Right after a rebuild, the subtree is perfectly balanced. For its root to become the scapegoat again, the sizes of its two sides must diverge by a constant fraction of its size, which takes $\\Omega(k)$ inserts or deletes inside it; each of those pays $O(1)$ toward the $O(k)$ rebuild, and each update lies in $O(\\log n)$ subtrees. So updates cost $O(\\log n)$ amortised. The tests check that every rebuilt subtree has the minimum height $\\lceil \\log_2(k + 1) \\rceil$, that the size counter matches an independent replay, and that the height stays within $\\lfloor \\log_{3/2} n \\rfloor + 1$ levels after every operation.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Galperin and Rivest introduced scapegoat trees in 1993; Andersson had published the same idea of general balanced trees with partial rebuilding in 1989.",
          "Day (1976) and Stout and Warren (1986) gave the in-place, linear-time rebuild by rotations used here.",
          "Partial rebuilding is a general technique: it makes static structures (k-d trees, range trees) dynamic with amortised guarantees.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(1)", average: "O(log n) amortised", worst: "O(n)" },
    space: "O(n)",
    worstClass: "n",
    note: "Search is O(log n) worst case; an update that triggers a rebuild of k keys costs O(k), O(log n) amortised.",
  },
  properties: [
    { label: "Per-node data", value: "None beyond key and children" },
    { label: "Depth", value: "At most $\\lfloor \\log_{3/2} n \\rfloor$ after each insert" },
    { label: "Rebuilt subtrees", value: "Minimum height, $\\lceil \\log_2(k + 1) \\rceil$" },
  ],
  implementations: [
    {
      language: "python",
      entry: "rebuild",
      code: `def rebuild(keys):
    """Balanced BST from sorted keys (the array method); returns (preorder, height)."""
    def build(lo, hi):
        if lo > hi:
            return None, 0
        mid = (lo + hi) // 2
        left, hl = build(lo, mid - 1)
        right, hr = build(mid + 1, hi)
        return (keys[mid], left, right), 1 + max(hl, hr)
    root, height = build(0, len(keys) - 1)
    out = []
    def walk(n):
        if n:
            out.append(n[0]); walk(n[1]); walk(n[2])
    walk(root)
    return [out, height]
`,
      tests: [
        { args: [[1, 2, 3, 4, 5, 6, 7]], expected: [[4, 2, 1, 3, 6, 5, 7], 3] },
        { args: [[10, 20, 30, 40]], expected: [[20, 10, 30, 40], 3] },
      ],
    },
    {
      language: "javascript",
      entry: "depthLimit",
      code: `// Deepest depth allowed after inserting into a tree of n keys, with alpha = 2/3.
function depthLimit(n) {
  return Math.floor(Math.log(n) / Math.log(1.5) + 1e-9);
}
`,
      tests: [
        { args: [5], expected: 3 },
        { args: [9], expected: 5 },
        { args: [100], expected: 11 },
      ],
    },
  ],
  visualizer: "scapegoat-tree",
  practice: [
    {
      id: "scapegoat-limit",
      kind: "numeric",
      prompt:
        "With α = 2/3, what is the deepest a new key may land in a tree of 20 keys before a rebuild is triggered?",
      answer: 7,
      explanation: "$\\lfloor \\log_{3/2} 20 \\rfloor = \\lfloor 7.39 \\rfloor = 7$.",
      hints: ["$\\log_{3/2} 20 = \\ln 20 / \\ln 1.5$."],
      objective: "Depth limit",
    },
    {
      id: "scapegoat-which",
      kind: "mcq",
      prompt: "Which node is rebuilt after an insert lands too deep?",
      options: [
        "The first ancestor with a child holding more than α of its subtree",
        "The root, always",
        "The new node's parent",
        "The deepest node in the tree",
      ],
      answer: 0,
      explanation:
        "Walking up from the new node, the first ancestor that is not α-weight-balanced is the scapegoat; rebuilding it is enough to restore the depth bound.",
      distractors: {
        1: "Only deletes ever rebuild the whole tree.",
        2: "The parent is usually balanced; the imbalance is higher up.",
        3: "Depth alone does not identify the lopsided subtree.",
      },
      hints: ["What makes a node to blame?"],
      objective: "Finding the scapegoat",
    },
  ],
  exam: {
    definition:
      "A scapegoat tree is a binary search tree that keeps depth O(log n) by rebuilding the subtree of an α-weight-unbalanced ancestor (the scapegoat) when an insert lands too deep.",
    steps: [
      "Insert as a BST; if depth > ⌊log_{1/α} n⌋, find the scapegoat and rebuild its subtree.",
      "Delete as a BST; if n < α · maxSize, rebuild the whole tree.",
      "Rebuild: flatten to sorted order and build balanced (or Day–Stout–Warren with rotations).",
    ],
    timeComplexity: "Search $O(\\log n)$ worst case; updates $O(\\log n)$ amortised.",
    spaceComplexity: "$O(n)$; no per-node balance data.",
    correctness:
      "A node deeper than $\\log_{1/\\alpha} n$ must have an α-unbalanced ancestor; rebuilding it restores the bound.",
    applications: [
      "Trees with expensive rotations (k-d trees)",
      "Memory-tight ordered sets",
      "Making static structures dynamic",
    ],
    limitations: ["Occasional O(n) rebuild pauses", "Computing subtree sizes during the walk up"],
    faq: [
      {
        q: "Why is it called a scapegoat tree?",
        a: "The node chosen for rebuilding takes the blame for the imbalance, even though the cause was the series of insertions below it.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["No balance data; rebuild a lopsided subtree when an insert is too deep."],
      },
      {
        marks: 10,
        outline: [
          "Insert and delete rules (3).",
          "Finding the scapegoat and why it exists (2).",
          "Rebuild method (2).",
          "Amortised analysis (3).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "I. Galperin, R. L. Rivest, “Scapegoat trees,” Proceedings of the 4th ACM-SIAM Symposium on Discrete Algorithms (SODA), 1993.",
      supports: "Scapegoat trees and their analysis.",
    },
    {
      citation:
        "A. Andersson, “Improving partial rebuilding by using simple balance criteria,” WADS 1989, LNCS 382, Springer.",
      supports: "General balanced trees with partial rebuilding.",
    },
    {
      citation:
        "Q. F. Stout, B. L. Warren, “Tree rebalancing in optimal time and space,” Communications of the ACM, 29(9), 1986.",
      supports: "The Day–Stout–Warren rebuild by rotations.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-26",
};
