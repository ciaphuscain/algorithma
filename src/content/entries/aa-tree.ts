import type { AlgorithmEntry } from "../types";

export const aaTreeEntry: AlgorithmEntry = {
  slug: "aa-tree",
  name: "AA Tree",
  aliases: ["Arne Andersson tree", "Level-balanced tree"],
  curriculum: [161],
  domain: "trees",
  subcategory: "Balanced search trees",
  difficulty: "intermediate",
  summary:
    "A simplified red-black tree in which red nodes may only be right children, written with integer levels instead of colours. Two short operations — skew (a right rotation) and split (a left rotation that promotes a node) — keep it balanced, so the code is a fraction of a red-black tree's.",
  tags: ["balanced tree", "binary search tree", "rotation", "skew", "split"],
  prerequisites: ["Binary search trees", "Tree rotations", "Red-black trees"],
  related: ["red-black-tree", "avl-tree", "bst"],
  problem: {
    input: "A sequence of insert, delete and search operations on integer keys.",
    output:
      "The result of each operation, with the level rules kept so that each takes O(log n) time.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Red-black trees have many cases because a red node can lean either way. Arne Andersson removed half of them: only a **right** child may share its parent's level (a “horizontal link”, the equivalent of a red node). Think of each node together with its horizontal right neighbour as one node of a 2-3 tree. A left horizontal link is fixed by rotating it to the right (skew); two horizontal links in a row are a 4-node, fixed by lifting the middle one up a level (split).",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "**Rules:** leaves are at level 1; a left child is exactly one level below its parent; a right child is at its parent's level or one below; a right grandchild is strictly below; every node above level 1 has two children.",
          "**skew(t):** if t's left child is at t's level, rotate right at t.",
          "**split(t):** if t's right child's right child is at t's level, rotate left at t and raise the new top one level.",
          "**Insert:** add a leaf at level 1; on the way back up, skew then split every node on the path.",
          "**Delete:** remove the key's leaf (copying the nearest key from a leaf first if needed); on the way up, lower a node's level if a child is two levels below, then skew t, t.right, t.right.right and split t, t.right.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): insert 1, 2, …, 7.",
      },
      {
        kind: "table",
        head: ["insert", "fix", "result"],
        rows: [
          ["1, 2", "2 is a horizontal right link: allowed", "1 → 2 at level 1"],
          ["3", "1, 2, 3 all at level 1: split at 1", "2 at level 2, children 1 and 3"],
          ["4", "allowed (3 → 4 horizontal)", ""],
          ["5", "3, 4, 5 at level 1: split at 3", "4 moves up to level 2, beside 2"],
          ["6", "allowed", ""],
          [
            "7",
            "split at 5 (6 to level 2); then 2, 4, 6 at level 2: split at 2",
            "4 at level 3 is the root",
          ],
        ],
      },
      {
        kind: "p",
        text: "Four rotations (all splits) produce the perfect tree with 4 at the root, 2 and 6 at level 2 and the odd keys as leaves. Ascending inserts never need a skew; in the second preset (40, 20, 60, …) every left insertion is first skewed to the right. In the third preset, deleting 1 leaves 2 with an empty left side, so 2 drops to level 1 and 4 to level 2.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Store the level as a small integer per node. Insert and delete are each about a dozen lines with recursive skew and split.",
          "Because only right links can be horizontal, the structure has far fewer cases than red-black trees, at the cost of somewhat more rotations.",
          "Using a sentinel node at level 0 for empty children removes null checks.",
          "AA trees are a good choice when a balanced tree must be written from scratch and code clarity matters.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Height.** The level of a node equals the black height of the corresponding red-black tree (horizontal links are red). Every root-to-leaf path descends through each level once, plus at most one horizontal link per level, so the height is at most $2L$ for root level $L$, and a tree of level $L$ has at least $2^L - 1$ nodes. Hence the height is at most $2 \\log_2(n + 1)$, as for red-black trees.",
      },
      {
        kind: "p",
        text: "**Why skew then split.** An insert adds a level-1 leaf; it can create a left horizontal link (fixed by skew, which turns it into a right one) and then two right horizontal links in a row (fixed by split, which raises the middle node, possibly creating the same situation one level up). The tests check all the level rules on the final tree after every operation of random sequences and while deleting every key.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Andersson published AA trees in 1993 as “balanced search trees made simple”.",
          "The same restriction applied to red-black trees gives Sedgewick's left-leaning red-black trees (with the opposite lean), which correspond to 2-3 trees in the same way.",
          "Like red-black trees, AA trees can be augmented (subtree sizes, interval maxima), updating the extra fields during skew and split.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(1)", average: "O(log n)", worst: "O(log n)" },
    space: "O(n)",
    worstClass: "log n",
  },
  properties: [
    { label: "Horizontal links", value: "Only to the right, never two in a row" },
    { label: "Height", value: "At most $2 \\log_2(n + 1)$" },
    { label: "Rebalancing", value: "Two operations: skew and split" },
  ],
  implementations: [
    {
      language: "python",
      entry: "aa_levels",
      code: `def skew(t):
    if t and t["l"] and t["l"]["lv"] == t["lv"]:
        l = t["l"]
        t["l"], l["r"] = l["r"], t
        return l
    return t

def split(t):
    if t and t["r"] and t["r"]["r"] and t["r"]["r"]["lv"] == t["lv"]:
        r = t["r"]
        t["r"], r["l"] = r["l"], t
        r["lv"] += 1
        return r
    return t

def insert(t, k):
    if t is None:
        return {"k": k, "lv": 1, "l": None, "r": None}
    if k < t["k"]:
        t["l"] = insert(t["l"], k)
    elif k > t["k"]:
        t["r"] = insert(t["r"], k)
    return split(skew(t))

def aa_levels(keys):
    """Insert the keys; return (key, level) pairs in pre-order."""
    root = None
    for k in keys:
        root = insert(root, k)
    out = []
    def walk(n):
        if n:
            out.append([n["k"], n["lv"]]); walk(n["l"]); walk(n["r"])
    walk(root)
    return out
`,
      tests: [
        {
          args: [[1, 2, 3, 4, 5, 6, 7]],
          expected: [
            [4, 3],
            [2, 2],
            [1, 1],
            [3, 1],
            [6, 2],
            [5, 1],
            [7, 1],
          ],
        },
      ],
    },
    {
      language: "javascript",
      entry: "isAA",
      code: `// Check Andersson's rules on nested {k, lv, l, r} nodes.
function isAA(t) {
  const lv = (n) => (n ? n.lv : 0);
  const ok = (n) => {
    if (!n) return true;
    if (!n.l && !n.r && n.lv !== 1) return false;
    if (lv(n.l) !== n.lv - 1) return false;
    if (lv(n.r) !== n.lv && lv(n.r) !== n.lv - 1) return false;
    if (n.r && lv(n.r.r) >= n.lv) return false;
    if (n.lv > 1 && !(n.l && n.r)) return false;
    return ok(n.l) && ok(n.r);
  };
  return ok(t);
}
`,
      tests: [
        {
          args: [{ k: 2, lv: 1, l: null, r: { k: 3, lv: 1, l: null, r: null } }],
          expected: true,
        },
        {
          args: [{ k: 3, lv: 1, l: { k: 2, lv: 1, l: null, r: null }, r: null }],
          expected: false,
        },
      ],
    },
  ],
  visualizer: "aa-tree",
  practice: [
    {
      id: "aa-fix",
      kind: "mcq",
      prompt: "A node at level 2 gets a left child at level 2. Which operation fixes it?",
      options: [
        "Skew: rotate right at the node",
        "Split: rotate left and promote",
        "Lower the child to level 1",
        "Nothing: it is allowed",
      ],
      answer: 0,
      explanation:
        "Left horizontal links are forbidden; skew turns it into a right horizontal link, which split may then fix if there are two in a row.",
      distractors: {
        1: "Split handles two right horizontal links in a row.",
        2: "Levels are not changed directly by insertion fix-ups.",
        3: "A left child must be exactly one level below.",
      },
      hints: ["Which links may be horizontal?"],
      objective: "Skew and split",
    },
    {
      id: "aa-root-level",
      kind: "numeric",
      prompt: "After inserting 1 to 7 in order, what is the level of the root?",
      answer: 3,
      explanation:
        "The result is the perfect tree with root 4 at level 3, 2 and 6 at level 2 and the leaves at level 1.",
      hints: ["Follow the splits in the worked example."],
      objective: "Trace inserts",
    },
  ],
  exam: {
    definition:
      "An AA tree is a binary search tree with a level per node in which only right children may share their parent's level (and never two in a row); it is equivalent to a red-black tree whose red nodes are right children.",
    steps: [
      "Insert at level 1; on the way up, skew then split.",
      "Delete a leaf; on the way up, lower levels, then skew three times and split twice.",
    ],
    timeComplexity: "$O(\\log n)$ per operation.",
    spaceComplexity: "$O(n)$ plus a level per node.",
    correctness:
      "Skew and split preserve in-order and restore the level rules; height is at most $2 \\log_2(n + 1)$.",
    applications: [
      "Ordered maps where a simple, verifiable implementation matters",
      "Teaching balanced trees",
    ],
    limitations: ["More rotations than red-black trees", "Less common in standard libraries"],
    faq: [
      {
        q: "How does an AA tree relate to a 2-3 tree?",
        a: "A node with a horizontal right link forms a 3-node; the level is the depth in the 2-3 tree counted from the bottom.",
      },
    ],
    answers: [
      { marks: 2, outline: ["Levels; only right horizontal links.", "Skew and split."] },
      {
        marks: 10,
        outline: [
          "Rules (2).",
          "Skew and split with diagrams (3).",
          "Trace of inserts (3).",
          "Height bound (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "A. Andersson, “Balanced search trees made simple,” Proceedings of the 3rd Workshop on Algorithms and Data Structures (WADS), LNCS 709, Springer, 1993.",
      supports: "AA trees, skew and split.",
    },
    {
      citation:
        "M. A. Weiss, Data Structures and Algorithm Analysis in C++, 4th ed., Pearson, 2014, Chapter 12.",
      supports: "AA tree insertion and deletion.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-26",
};
