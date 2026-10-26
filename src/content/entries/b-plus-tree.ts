import type { AlgorithmEntry } from "../types";

export const bPlusTreeEntry: AlgorithmEntry = {
  slug: "b-plus-tree",
  name: "B+ Tree",
  aliases: ["B+-tree", "Bplus tree"],
  curriculum: [163],
  domain: "trees",
  subcategory: "Balanced search trees",
  difficulty: "advanced",
  summary:
    "The B-tree variant used by most databases and file systems: every key (and its record) lives in the leaves, which are linked in order, while internal nodes hold only separator copies for routing. Lookups cost O(log n), and a range query finds its first leaf and then just walks the chain.",
  tags: ["balanced tree", "multiway tree", "database index", "range query", "linked leaves"],
  prerequisites: ["B-trees"],
  related: ["b-tree", "bst", "binary-search"],
  problem: {
    input:
      "An order m (the most keys per node) and a sequence of insert, search and scan operations.",
    output:
      "The result of each operation; a scan from k returns every key ≥ k in order, read along the linked leaves.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A B-tree mixes data and signposts: some keys sit in internal nodes, so an in-order listing has to go up and down the tree. A B+ tree separates the two jobs. The leaves form one sorted, linked list holding every key; the internal nodes are only an index into that list, holding copies of keys to steer the search. To list a range, find where it starts and then walk sideways along the leaves.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "**Find the leaf for k:** at each internal node, follow the child after the last separator ≤ k.",
          "**Insert:** put k into its leaf. If the leaf now has m + 1 keys, split it in two, link the new leaf into the chain, and **copy** the right leaf's first key up to the parent as a separator.",
          "If an internal node now has m + 1 separators, split it and **move** its middle separator up (it is not needed in either half). A split root gives the tree a new level.",
          "**Search:** find the leaf; the key is in the tree exactly when it is in that leaf.",
          "**Scan from k:** find k's leaf, then read keys ≥ k leaf after leaf by following the links.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): order m = 3, inserting 10, 20, …, 80, then scanning from 35.",
      },
      {
        kind: "table",
        head: ["insert", "split", "tree afterwards (leaves linked left to right)"],
        rows: [
          ["10, 20, 30", "—", "leaf [10 20 30]"],
          [
            "40",
            "[10 20 30 40] → [10 20] [30 40]; copy 30 up (new root)",
            "[30] ( [10 20] → [30 40] )",
          ],
          [
            "50, 60",
            "[30 40 50 60] → [30 40] [50 60]; copy 50 up",
            "[30 50] ( [10 20] → [30 40] → [50 60] )",
          ],
          [
            "70, 80",
            "[50 60 70 80] → [50 60] [70 80]; copy 70 up",
            "[30 50 70] ( [10 20] → [30 40] → [50 60] → [70 80] )",
          ],
        ],
      },
      {
        kind: "p",
        text: "Note that 30, 50 and 70 appear twice — once as a separator and once in a leaf — which is how a B+ tree differs from a B-tree. The scan from 35 descends to the leaf [30 40], reads 40, and follows the links to read 50, 60, 70, 80 without returning to the root.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Internal nodes carry only keys and child pointers, so more of them fit in a page: higher fan-out and a shallower tree than a B-tree storing records everywhere.",
          "Leaves often keep both next and previous links, for scans in either direction (e.g. `ORDER BY … DESC`).",
          "**Deletion** (not shown in this visualizer) removes the key from its leaf, then borrows from or merges with a sibling leaf if the leaf falls below half full, updating or removing a separator in the parent; separators may lag behind deleted keys without harming correctness.",
          "**Bulk loading** sorted data builds the leaves left to right and the index on top, much faster than repeated inserts.",
          "Used by InnoDB (MySQL), PostgreSQL's B-tree indexes (a B+ variant with Lehman–Yao links), SQLite tables, and file systems such as NTFS and XFS.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Cost.** All leaves are at the same depth $h = O(\\log_{m/2} n)$, so a point lookup reads $h + 1$ nodes. A range query returning $r$ keys reads $h + 1 + \\lceil r / (m/2) \\rceil$ nodes at most: the descent once, then one node per leaf of output. In a plain B-tree the same range costs about as much per key as a lookup when the keys straddle many internal nodes.",
      },
      {
        kind: "p",
        text: "**Separators.** A separator is a copy of the smallest key in the subtree to its right, so every key $x$ in child $i$ satisfies $s_{i-1} \\le x < s_i$. Copying (rather than moving) at leaf splits keeps every key in a leaf; moving at internal splits avoids storing a routing key twice in the index. The tests check these ranges, that the leaf chain lists every key once in order, and compare every tree with an independent implementation of bottom-up insertion.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Comer's 1979 survey describes the B+ tree as the variant in which all records reside in the leaves and the upper levels form an index.",
          "Lehman and Yao's B-link trees add a right link to every node so that concurrent readers and writers need far less locking.",
          "Prefix B+ trees store only as much of each separator as is needed to tell the neighbouring keys apart, raising fan-out for string keys.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(log n)", average: "O(log n)", worst: "O(log n)" },
    space: "O(n)",
    worstClass: "log n",
    note: "Per lookup or insert; a range scan adds O(r / m) leaf reads for r results.",
  },
  properties: [
    { label: "Keys", value: "All in the leaves, which are linked in order" },
    { label: "Internal nodes", value: "Separator copies only" },
    { label: "Leaf split", value: "Copies the right half's first key up" },
  ],
  implementations: [
    {
      language: "python",
      entry: "bplus_leaves",
      code: `def insert(node, k, m):
    """Returns (separator, new right node) if node split, else None."""
    if not node["kids"]:                                  # leaf
        node["keys"] = sorted(node["keys"] + [k])
        if len(node["keys"]) <= m:
            return None
        mid = (len(node["keys"]) + 1) // 2
        right = {"keys": node["keys"][mid:], "kids": []}
        node["keys"] = node["keys"][:mid]
        return right["keys"][0], right                    # copy up
    i = sum(1 for s in node["keys"] if k >= s)
    up = insert(node["kids"][i], k, m)
    if up is None:
        return None
    node["keys"].insert(i, up[0])
    node["kids"].insert(i + 1, up[1])
    if len(node["keys"]) <= m:
        return None
    mid = len(node["keys"]) // 2
    sep = node["keys"][mid]
    right = {"keys": node["keys"][mid + 1:], "kids": node["kids"][mid + 1:]}
    node["keys"], node["kids"] = node["keys"][:mid], node["kids"][:mid + 1]
    return sep, right                                     # move up

def bplus_leaves(keys, m):
    """Insert keys; return [root separators, leaves left to right]."""
    root = {"keys": [], "kids": []}
    for k in keys:
        up = insert(root, k, m)
        if up:
            root = {"keys": [up[0]], "kids": [root, up[1]]}
    leaves = []
    def walk(n):
        if n["kids"]:
            for c in n["kids"]:
                walk(c)
        else:
            leaves.append(n["keys"])
    walk(root)
    return [root["keys"], leaves]
`,
      tests: [
        {
          args: [[10, 20, 30, 40, 50, 60, 70, 80], 3],
          expected: [
            [30, 50, 70],
            [
              [10, 20],
              [30, 40],
              [50, 60],
              [70, 80],
            ],
          ],
        },
      ],
    },
    {
      language: "javascript",
      entry: "scanFrom",
      code: `// Range scan over linked leaves: start at the first leaf that can hold k.
function scanFrom(leaves, k) {
  // leaves: arrays of keys, in chain order
  let i = 0;
  while (i < leaves.length - 1 && leaves[i + 1][0] <= k) i++;
  const out = [];
  for (; i < leaves.length; i++) for (const v of leaves[i]) if (v >= k) out.push(v);
  return out;
}
`,
      tests: [
        {
          args: [
            [
              [10, 20],
              [30, 40],
              [50, 60],
              [70, 80],
            ],
            35,
          ],
          expected: [40, 50, 60, 70, 80],
        },
      ],
    },
  ],
  visualizer: "b-plus-tree",
  practice: [
    {
      id: "bplus-copy",
      kind: "mcq",
      prompt: "When a B+ tree leaf [30 40 50 60] (order 3) splits, what goes up to the parent?",
      options: [
        "A copy of 50; the leaves are [30 40] and [50 60]",
        "50 itself, removed from the leaves",
        "40, moved up from the left leaf",
        "Nothing: leaves never split",
      ],
      answer: 0,
      explanation: "Leaf splits copy the right half's first key up, so every key stays in a leaf.",
      distractors: {
        1: "That would remove 50 from the leaf chain, breaking range scans.",
        2: "The separator is the smallest key of the right half.",
        3: "Leaves split whenever they exceed m keys.",
      },
      hints: ["Where must every key remain in a B+ tree?"],
      objective: "Leaf splits",
    },
    {
      id: "bplus-scan",
      kind: "numeric",
      prompt:
        "A B+ tree of height 3 (root, one internal level, leaves) answers a scan whose results fill 4 leaves. How many nodes does it read at most?",
      answer: 6,
      explanation:
        "The descent reads the root and one internal node (2), then the 4 leaves: 6 nodes.",
      hints: ["Descend once, then walk the chain."],
      objective: "Range query cost",
    },
  ],
  exam: {
    definition:
      "A B+ tree is a B-tree variant that stores all keys in linked leaves and only separator copies in internal nodes.",
    steps: [
      "Find the leaf by following separators.",
      "Insert into the leaf; on overflow split it and copy the right half's first key up.",
      "Split overflowing internal nodes by moving the middle separator up.",
      "Range scan: find the first leaf, then follow the leaf links.",
    ],
    timeComplexity:
      "$O(\\log n)$ per lookup/insert; $O(\\log n + r/m)$ node reads for a range of r keys.",
    spaceComplexity: "$O(n)$; separators duplicate some keys.",
    correctness:
      "Separators bound every child's keys ($s_{i-1} \\le x < s_i$), all keys stay in the leaves, and leaf splits keep the chain in order.",
    applications: [
      "Database primary and secondary indexes",
      "File system directories and extents",
      "Key-value stores",
    ],
    limitations: ["Some keys stored twice", "Point lookups always go to a leaf (no early exit)"],
    faq: [
      {
        q: "B-tree or B+ tree for a database index?",
        a: "Almost always B+: range scans and sequential reads are much cheaper, and internal nodes have higher fan-out because they hold no records.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Keys only in linked leaves; internal separators.", "Fast range scans."],
      },
      {
        marks: 10,
        outline: [
          "Structure and invariants (2).",
          "Insert with leaf copy-up and internal move-up (4).",
          "Range scan and its cost (2).",
          "Comparison with B-trees (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "D. Comer, “The ubiquitous B-tree,” ACM Computing Surveys, 11(2), 1979.",
      supports: "The B+ tree variant and its use for indexes.",
    },
    {
      citation:
        "P. L. Lehman, S. B. Yao, “Efficient locking for concurrent operations on B-trees,” ACM Transactions on Database Systems, 6(4), 1981.",
      supports: "B-link trees for concurrency.",
    },
    {
      citation:
        "R. Ramakrishnan, J. Gehrke, Database Management Systems, 3rd ed., McGraw-Hill, 2003, Chapter 10.",
      supports: "B+ tree insertion, deletion and use as a database index.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-26",
};
