import type { AlgorithmEntry } from "../types";

export const leftistHeapEntry: AlgorithmEntry = {
  slug: "leftist-heap",
  name: "Leftist Heap",
  aliases: ["Leftist tree", "Mergeable heap (leftist)"],
  curriculum: [130],
  domain: "linear-structures",
  subcategory: "Heaps",
  difficulty: "intermediate",
  summary:
    "A heap-ordered binary tree kept deliberately lopsided: every node's right spine is no longer than its left one. All work happens on right spines, which hold O(log n) nodes, so two heaps merge in O(log n) — and insert and extract-min are just merges.",
  tags: ["heap", "priority queue", "mergeable heap", "meld", "rank"],
  prerequisites: ["Binary heaps", "Binary trees", "Recursion"],
  related: ["skew-heap", "binary-heap", "heap-sort"],
  problem: {
    input: "A sequence of insert x, extract (remove the minimum) and peek operations.",
    output:
      "What each operation returns, with every operation built on an O(log n) merge of two heaps.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A binary heap in an array is fast but cannot merge with another heap without rebuilding. Pointer-based heaps can merge by walking down both heaps at once — but only if the walk is short. A leftist heap guarantees a short walk by keeping all the depth on the **left**: the path that keeps going right from any node (its right spine) is never longer than the left side's, so it has at most $\\log_2(n+1)$ nodes. Merging walks down the two right spines, like merging two sorted lists, and then swaps children wherever a node has become right-heavy.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "**Rank** of a node: the number of nodes on its right spine (an empty tree has rank 0). The **leftist property**: rank(left child) ≥ rank(right child) at every node.",
          "**merge(a, b):** if a is empty return b (and vice versa). Make a the heap with the smaller root. Merge a's right subtree with b, and put the result in a's right slot. If now rank(a.left) < rank(a.right), swap a's children. Set rank(a) = rank(a.right) + 1.",
          "**insert x:** merge with a one-node heap. **extract:** remove the root and merge its two subtrees. **peek:** the root.",
          "This visualizer draws the merge under a placeholder ⋃: the heap on its left, the incoming heap on its right. Walking down the right spine, the smaller root is always swapped into the spine.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): insert 5, 9, 2, 7, 1, 8, 3, then extract twice and peek.",
      },
      {
        kind: "table",
        head: ["operation", "what the merge does", "heap afterwards (left, right)"],
        rows: [
          ["insert 5, 9", "9 hangs right of 5; rank 0 < 1, so swap", "5(9, ·)"],
          [
            "insert 2",
            "2 is smaller: it becomes the top; 5's heap hangs right, then swaps left",
            "2(5(9, ·), ·)",
          ],
          ["insert 7", "7 hangs right of 2; ranks equal: no swap", "2(5(9), 7)"],
          [
            "insert 1, 8",
            "1 on top, the rest swapped left; 8 hangs right of 1",
            "1(2(5(9), 7), 8)",
          ],
          [
            "insert 3",
            "3 < 8: 3 takes 1's right slot; 8 hangs under 3 and swaps left",
            "1(2(5(9), 7), 3(8, ·))",
          ],
          [
            "extract → 1",
            "merge 2(…) with 3(8): 3 < 7 goes into 2's spine; 7 under 3; 2 swaps children",
            "2(3(8, 7), 5(9))",
          ],
          [
            "extract → 2",
            "merge 3(8, 7) with 5(9): 5 < 7 into the spine; 3 swaps children",
            "3(5(9, 7), 8)",
          ],
        ],
      },
      {
        kind: "p",
        text: "Peek then returns 3. Over the whole run the merge paths visited 11 nodes and made 11 comparisons — about one or two per operation for these 10 operations.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "The recursive merge is a few lines; an iterative version walks the right spines down, then fixes ranks on the way back up (as drawn here).",
          "Store the rank in each node; it changes only on the merge path.",
          "Use a leftist heap when heaps must be **merged** — for example combining per-thread queues, or in algorithms that repeatedly unite priority queues (some minimum-spanning-tree and scheduling algorithms).",
          "Leftist heaps are persistent-friendly: a merge copies only the O(log n) nodes on the right spines, so old versions can be kept cheaply in functional languages.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Right spine bound.** A node of rank $r$ has a perfect binary tree of height $r$ hanging from it (every node on its right spine has a left subtree at least as high, by the leftist property), so its subtree has at least $2^r - 1$ nodes. Hence a heap of $n$ nodes has a right spine of at most $\\lfloor \\log_2(n+1) \\rfloor$ nodes. A merge of heaps of sizes $n_1$ and $n_2$ visits at most the two right spines: $O(\\log n_1 + \\log n_2)$.",
      },
      {
        kind: "p",
        text: "**Correctness.** The merge keeps heap order because it always puts the smaller root on top and only ever attaches heaps below smaller keys. Swapping children restores the leftist property at each node on the path, and ranks are recomputed bottom-up. The tests compare every run with an independent recursive implementation, check heap order, the leftist property and the ranks, and check that the right spine never exceeds $\\lfloor \\log_2(n + 1) \\rfloor$ nodes.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Crane introduced leftist trees in 1972; Knuth's Volume 3 popularised them.",
          "Skew heaps (the next curriculum item) drop the ranks and always swap, getting the same bound amortised instead of worst case.",
          "Building a leftist heap from $n$ keys by repeatedly merging pairs (as in a tournament) takes $O(n)$ time.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(1)", average: "O(log n)", worst: "O(log n)" },
    space: "O(n)",
    worstClass: "log n",
    note: "Merge, insert and extract-min are O(log n) worst case; peek is O(1).",
  },
  properties: [
    { label: "Leftist property", value: "rank(left) ≥ rank(right) at every node" },
    { label: "Right spine", value: "At most $\\lfloor \\log_2(n + 1) \\rfloor$ nodes" },
    { label: "Merge", value: "$O(\\log n)$ worst case" },
  ],
  implementations: [
    {
      language: "python",
      entry: "drain",
      code: `def rank(h):
    return h[3] if h else 0

def merge(a, b):
    """Heaps as [key, left, right, rank] lists or None."""
    if a is None: return b
    if b is None: return a
    if b[0] < a[0]:
        a, b = b, a
    a[2] = merge(a[2], b)
    if rank(a[1]) < rank(a[2]):
        a[1], a[2] = a[2], a[1]          # keep the left side at least as deep
    a[3] = rank(a[2]) + 1
    return a

def drain(keys):
    """Insert all keys, then extract them all: heap sort with a leftist heap."""
    h = None
    for k in keys:
        h = merge(h, [k, None, None, 1])
    out = []
    while h:
        out.append(h[0])
        h = merge(h[1], h[2])
    return out
`,
      tests: [
        { args: [[5, 9, 2, 7, 1, 8, 3]], expected: [1, 2, 3, 5, 7, 8, 9] },
        { args: [[4, 4, 1]], expected: [1, 4, 4] },
      ],
    },
    {
      language: "javascript",
      entry: "maxSpine",
      code: `// Longest possible right spine in a leftist heap of n nodes.
function maxSpine(n) {
  return Math.floor(Math.log2(n + 1));
}
`,
      tests: [
        { args: [1], expected: 1 },
        { args: [7], expected: 3 },
        { args: [1000], expected: 9 },
      ],
    },
  ],
  visualizer: "leftist-heap",
  practice: [
    {
      id: "leftist-rank",
      kind: "numeric",
      prompt: "A leftist heap holds 20 keys. At most how many nodes can its right spine have?",
      answer: 4,
      explanation:
        "$\\lfloor \\log_2 21 \\rfloor = 4$: a rank-5 node would need at least $2^5 - 1 = 31$ nodes.",
      hints: ["A node of rank r has at least $2^r - 1$ nodes below and including it."],
      objective: "Right spine bound",
    },
    {
      id: "leftist-swap",
      kind: "mcq",
      prompt:
        "After merging into a node's right subtree, its left child has rank 1 and its right child rank 2. What happens?",
      options: [
        "Swap the two children, then set the node's rank to 2",
        "Rotate the node left",
        "Nothing: ranks may differ by one",
        "Re-insert the right child's keys",
      ],
      answer: 0,
      explanation:
        "The leftist property needs rank(left) ≥ rank(right); swapping fixes it, and the node's rank becomes rank(right) + 1 = 1 + 1 = 2.",
      distractors: {
        1: "Rotations are for search trees; heaps only swap children.",
        2: "Any right child of higher rank breaks the property.",
        3: "No keys need to move.",
      },
      hints: ["Which property must hold at every node?"],
      objective: "Merge fix-up",
    },
  ],
  exam: {
    definition:
      "A leftist heap is a heap-ordered binary tree in which each node's left child has rank (right-spine length) at least that of its right child; merges walk only the right spines.",
    steps: [
      "merge(a, b): smaller root on top; recursively merge its right subtree with the other heap.",
      "Swap children where rank(left) < rank(right); rank = rank(right) + 1.",
      "insert = merge with a single node; extract = merge the root's subtrees.",
    ],
    timeComplexity: "$O(\\log n)$ for merge, insert and extract-min; $O(1)$ peek.",
    spaceComplexity: "$O(n)$ plus a rank per node.",
    correctness:
      "Heap order is kept by placing the smaller root on top; the leftist property bounds the right spine by $\\log_2(n+1)$.",
    applications: [
      "Mergeable priority queues",
      "Functional / persistent priority queues",
      "Event simulation with merging queues",
    ],
    limitations: [
      "Pointer-based, less cache-friendly than an array heap",
      "Decrease-key needs extra work",
    ],
    faq: [
      {
        q: "Why not just use a binary heap?",
        a: "Merging two array binary heaps costs O(n); a leftist heap merges in O(log n).",
      },
    ],
    answers: [
      { marks: 2, outline: ["Rank and the leftist property.", "Merge in O(log n)."] },
      {
        marks: 10,
        outline: [
          "Definitions (2).",
          "Merge algorithm with an example (4).",
          "Insert/extract via merge (2).",
          "Right-spine bound (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "C. A. Crane, “Linear lists and priority queues as balanced binary trees,” PhD thesis, Stanford University, 1972.",
      supports: "The original leftist tree.",
    },
    {
      citation:
        "D. E. Knuth, The Art of Computer Programming, Vol. 3: Sorting and Searching, 2nd ed., Addison-Wesley, 1998, Section 5.2.3.",
      supports: "Leftist trees as mergeable priority queues.",
    },
    {
      citation:
        "C. Okasaki, Purely Functional Data Structures, Cambridge University Press, 1998, Chapter 3.",
      supports: "Leftist heaps in functional programming and the rank bound.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-26",
};
