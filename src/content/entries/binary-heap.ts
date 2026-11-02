import type { AlgorithmEntry } from "../types";

export const binaryHeapEntry: AlgorithmEntry = {
  slug: "binary-heap",
  name: "Binary Heap (Priority Queue)",
  aliases: ["Priority queue", "Min-heap", "Max-heap", "Heap"],
  curriculum: [125, 126],
  domain: "linear-structures",
  subcategory: "Heaps",
  difficulty: "intermediate",
  summary:
    "A priority queue stored as a complete binary tree in an array, where every parent is at most (min-heap) or at least (max-heap) its children. Insert sifts a new item up and extract-min sifts the last item down from the root, each along one path: O(log n).",
  tags: ["heap", "priority queue", "complete binary tree", "sift up", "sift down"],
  prerequisites: ["Arrays", "Binary trees"],
  related: ["heap-sort", "dijkstra", "merge-sorted-lists", "prim"],
  problem: {
    input: "A sequence of insert x, extract and peek operations, for a min-heap or a max-heap.",
    output:
      "What each operation returns: extract removes and returns the smallest (largest) item; peek returns it without removing it.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A priority queue serves the most urgent item first, whatever order items arrived in. A sorted array serves fast but inserts slowly; an unsorted one inserts fast but searches slowly. A heap is the compromise: it is only *partially* sorted — every parent beats its children — which is enough to keep the best item at the root and cheap enough to repair along a single root-to-leaf path.",
      },
      {
        kind: "p",
        text: "The tree is always complete (filled level by level, left to right), so it fits in an array with no pointers: the children of slot $i$ are slots $2i + 1$ and $2i + 2$, and its parent is $\\lfloor (i - 1)/2 \\rfloor$.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "insert(x): put x in the first free slot, then **sift up**: while x beats its parent, swap them.",
          "extract(): take the root; move the last item to the root, then **sift down**: while it has a child that beats it, swap it with the better child.",
          "peek(): the root.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): a min-heap; insert 5, 3, 8, 1, 9, 2; then extract, extract, peek, extract.",
      },
      {
        kind: "table",
        head: ["operation", "what happens", "array afterwards", "comparisons"],
        rows: [
          ["insert 5", "first item", "5", "0"],
          ["insert 3", "3 < 5: swap", "3 5", "1"],
          ["insert 8", "8 > 3: stop", "3 5 8", "1"],
          ["insert 1", "1 < 5: swap; 1 < 3: swap", "1 3 8 5", "2"],
          ["insert 9", "9 > 3: stop", "1 3 8 5 9", "1"],
          ["insert 2", "2 < 8: swap; 2 > 1: stop", "1 3 2 5 9 8", "2"],
          ["extract → 1", "8 to the root; better child 2 < 8: swap", "2 3 8 5 9", "2"],
          ["extract → 2", "9 to the root; swap with 3, then with 5", "3 5 8 9", "3"],
          ["peek → 3", "the root", "3 5 8 9", "0"],
          ["extract → 3", "9 to the root; swap with 5", "5 9 8", "2"],
        ],
      },
      {
        kind: "p",
        text: "14 comparisons in all, and the items came out in order: 1, 2, 3. In the max-heap preset, inserting 20, 50, 10 and extracting gives 50; after inserting 40 and 30, two extracts give 40 and 30, using 9 comparisons.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Store items in a dynamic array; no child pointers are needed. Some texts use 1-based slots, where the children of $i$ are $2i$ and $2i + 1$.",
          "Most libraries provide a min-heap (Python `heapq`, Java `PriorityQueue`, C++ `std::priority_queue` is a max-heap). For the other order, negate the keys or pass a comparator.",
          "**Decrease-key** (needed by Dijkstra and Prim) sifts an item up after lowering its key, but needs each item's position: keep an index map, or insert a duplicate and skip stale entries when they are extracted (“lazy deletion”).",
          "Equal priorities come out in no particular order: a heap is not stable. Add an insertion counter to the key to break ties first-in, first-out.",
          "**Building** a heap from $n$ items by sifting down from the last parent to the root takes $O(n)$, faster than $n$ inserts (see heap sort).",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Height.** A complete binary tree with $n$ nodes has height $\\lfloor \\log_2 n \\rfloor$. Sift-up makes at most one comparison per level; sift-down at most two (choose the better child, then compare). So insert costs at most $\\lfloor \\log_2 n \\rfloor$ comparisons and extract at most $2\\lfloor \\log_2 n \\rfloor$: $O(\\log n)$. The tests check every run against these bounds, and every answer against a sorted list.",
      },
      {
        kind: "p",
        text: "**Correctness.** The heap property (every parent beats its children) puts the best item at the root. During sift-up, only the edge between the moving item and its parent can be violated, and each swap moves that edge one level up; during sift-down, only the edges from the moving item to its children can be violated, and swapping with the *better* child fixes the edge to the other child too.",
      },
      {
        kind: "p",
        text: "**Lower bound.** Any comparison-based priority queue needs $\\Omega(\\log n)$ amortised comparisons per operation: $n$ inserts followed by $n$ extracts would otherwise sort in $o(n \\log n)$ comparisons.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**$d$-ary heaps** (children $di + 1, \\dots, di + d$) are shallower: inserts and decrease-keys get cheaper and extracts dearer, a good trade for Dijkstra on dense graphs.",
          "**Fibonacci and pairing heaps** offer $O(1)$ amortised insert and decrease-key, giving Dijkstra $O(E + V \\log V)$; binomial, leftist and skew heaps support fast merging. These are later items in this curriculum.",
          "Applications: Dijkstra, Prim, A*, Huffman coding, $k$-way merging, event-driven simulation, the $k$ largest items of a stream (a min-heap of size $k$), and running medians (two heaps).",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(1)", average: "O(log n)", worst: "O(log n)" },
    space: "O(n)",
    worstClass: "log n",
    note: "Insert and extract are O(log n); peek is O(1). Average insert into a random heap is O(1) comparisons.",
  },
  properties: [
    { label: "Heap property", value: "Every parent is at most (min-heap) its children" },
    { label: "Comparisons", value: "Insert ≤ ⌊log₂ n⌋; extract ≤ 2⌊log₂ n⌋" },
  ],
  implementations: [
    {
      language: "python",
      entry: "run",
      code: `def sift_up(a, i):
    while i > 0 and a[i] < a[(i - 1) // 2]:
        p = (i - 1) // 2
        a[i], a[p] = a[p], a[i]
        i = p

def sift_down(a, i):
    n = len(a)
    while 2 * i + 1 < n:
        c = 2 * i + 1
        if c + 1 < n and a[c + 1] < a[c]:
            c += 1                         # the smaller child
        if a[c] >= a[i]:
            return
        a[i], a[c] = a[c], a[i]
        i = c

def run(ops):
    """Min-heap; returns [extracted values, final array]."""
    a, out = [], []
    for op in ops:
        if op.startswith("insert"):
            a.append(int(op.split()[1]))
            sift_up(a, len(a) - 1)
        else:
            top, last = a[0], a.pop()
            if a:
                a[0] = last
                sift_down(a, 0)
            out.append(top)
    return [out, a]
`,
      tests: [
        {
          args: [
            [
              "insert 5",
              "insert 3",
              "insert 8",
              "insert 1",
              "insert 9",
              "insert 2",
              "extract",
              "extract",
              "extract",
            ],
          ],
          expected: [
            [1, 2, 3],
            [5, 9, 8],
          ],
        },
      ],
    },
    {
      language: "javascript",
      entry: "kLargest",
      code: `// The k largest values of a stream, with a min-heap of size k (largest first).
function kLargest(values, k) {
  const h = [];
  const swap = (i, j) => ([h[i], h[j]] = [h[j], h[i]]);
  for (const v of values) {
    if (h.length < k) {
      h.push(v);
      for (let i = h.length - 1; i > 0 && h[i] < h[(i - 1) >> 1]; i = (i - 1) >> 1)
        swap(i, (i - 1) >> 1);
    } else if (v > h[0]) {
      h[0] = v; // replace the smallest of the k, then sift down
      for (let i = 0; ; ) {
        let c = 2 * i + 1;
        if (c >= h.length) break;
        if (c + 1 < h.length && h[c + 1] < h[c]) c++;
        if (h[c] >= h[i]) break;
        swap(i, c);
        i = c;
      }
    }
  }
  return h.sort((a, b) => b - a);
}
`,
      tests: [
        { args: [[5, 1, 9, 3, 7, 2, 8], 3], expected: [9, 8, 7] },
        { args: [[4, 4, 1], 2], expected: [4, 4] },
      ],
    },
  ],
  visualizer: "binary-heap",
  practice: [
    {
      id: "heap-parent",
      kind: "numeric",
      prompt: "In a 0-based array heap, what is the index of the parent of slot 9?",
      answer: 4,
      explanation: "$\\lfloor (9 - 1) / 2 \\rfloor = 4$ (slot 4's children are 9 and 10).",
      hints: ["parent(i) = ⌊(i − 1)/2⌋."],
      objective: "Array layout",
    },
    {
      id: "heap-insert",
      kind: "mcq",
      prompt: "Insert 0 into the min-heap [1, 3, 2, 5, 9, 8]. What is the array afterwards?",
      options: ["0 3 1 5 9 8 2", "0 1 2 3 5 8 9", "1 3 0 5 9 8 2", "0 3 2 5 9 8 1"],
      answer: 0,
      explanation:
        "0 goes to slot 6, whose parent is slot 2 (value 2): swap. Its parent is then slot 0 (value 1): swap. Result: 0 3 1 5 9 8 2.",
      distractors: {
        1: "A heap is not fully sorted; insertion only moves along one path.",
        2: "0 is smaller than the root too, so it keeps rising.",
        3: "The old root moves down one step, to slot 2, not to the bottom.",
      },
      hints: ["Follow the path from slot 6 up to the root."],
      objective: "Sift up",
    },
    {
      id: "heap-why-log",
      kind: "mcq",
      prompt: "Why is extract $O(\\log n)$ rather than $O(n)$?",
      options: [
        "Sift-down follows a single root-to-leaf path in a tree of height ⌊log₂ n⌋",
        "The heap is sorted, so the next item is at slot 1",
        "Only half the items are compared",
        "Extract does not need to restore the heap property",
      ],
      answer: 0,
      explanation:
        "Each level costs at most two comparisons and the complete tree has ⌊log₂ n⌋ levels below the root.",
      distractors: {
        1: "The heap is only partially ordered; the second-best item is one of the root's children.",
        2: "Half the items would still be $O(n)$.",
        3: "Moving the last item to the root breaks the property; sift-down repairs it.",
      },
      hints: ["How tall is a complete binary tree with n nodes?"],
      objective: "Cost of heap operations",
    },
  ],
  exam: {
    definition:
      "A binary heap is a complete binary tree stored in an array in which every parent is at most (min-heap) or at least (max-heap) its children; it implements a priority queue.",
    steps: [
      "insert: append, then sift up while the item beats its parent.",
      "extract: remove the root, move the last item to the root, sift down by swapping with the better child.",
      "peek: read the root.",
    ],
    timeComplexity: "$O(\\log n)$ insert and extract; $O(1)$ peek; $O(n)$ to build from $n$ items.",
    spaceComplexity: "$O(n)$, with no pointers.",
    correctness:
      "Each sift repairs the only edge that can violate the heap property, moving it one level per swap until none is violated.",
    applications: [
      "Dijkstra, Prim and A*",
      "Scheduling and event simulation",
      "Heap sort",
      "k-way merge and top-k",
    ],
    limitations: [
      "Searching for an arbitrary item is O(n)",
      "Merging two binary heaps costs O(n)",
      "Not stable for equal priorities",
    ],
    faq: [
      {
        q: "Priority queue or heap?",
        a: "A priority queue is the abstract interface (insert, extract the best); a binary heap is its most common implementation. The curriculum lists both, and this lesson covers both.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Complete tree in an array with the heap property.",
          "$O(\\log n)$ insert and extract.",
        ],
      },
      {
        marks: 10,
        outline: [
          "Array layout and heap property (2).",
          "Insert with sift-up (2).",
          "Extract with sift-down (3).",
          "Complexity from the height (2).",
          "An application (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "J. W. J. Williams, “Algorithm 232: Heapsort,” Communications of the ACM, 7(6), 1964.",
      supports: "The binary heap stored in an array.",
    },
    {
      citation:
        "T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 3rd ed., MIT Press, 2009, Chapter 6.",
      supports: "Heaps, priority queues, and their analysis.",
    },
    {
      citation: "R. Sedgewick, K. Wayne, Algorithms, 4th ed., Addison-Wesley, 2011, Section 2.4.",
      supports: "Priority queues with binary heaps, swim and sink operations.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-25",
};
