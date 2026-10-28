import type { AlgorithmEntry } from "../types";

export const weakHeapSortEntry: AlgorithmEntry = {
  slug: "weak-heap-sort",
  name: "Weak Heap Sort",
  aliases: ["Weak-heapsort"],
  curriculum: [33],
  domain: "searching-sorting",
  subcategory: "Heap-based sorting",
  difficulty: "advanced",
  summary:
    "Heapsort on a weak heap, where each node only dominates its right subtree. With one reverse bit per node, joining two weak heaps is one comparison, so the sort makes at most n⌈log₂ n⌉ − 2^⌈log₂ n⌉ + n − 1 comparisons — close to the information-theoretic minimum.",
  tags: ["sorting", "heap", "weak heap", "comparison-efficient", "in-place"],
  prerequisites: ["Heap sort", "Binary heaps"],
  related: ["heap-sort", "smooth-sort", "tournament-sort"],
  problem: {
    input: "An array of numbers.",
    output: "The same numbers in non-decreasing order.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A binary heap insists that every node beats both children, which costs two comparisons per level when sifting. A weak heap relaxes the rule: a node need only beat everything in its right subtree, and the root has no left subtree. Because ‘left’ and ‘right’ can be swapped by flipping a bit, combining two weak heaps takes a single comparison: the loser's subtree simply becomes the winner's right side.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Keep a bit R[j] per node; it decides which child of j counts as left.",
          "The distinguished ancestor of j: climb while j is the left child of its parent; the parent at that point is the ancestor. Weak-heap order: every node beats all nodes that have it as distinguished ancestor.",
          "join(i, j): if A[i] < A[j], swap them and flip R[j] — one comparison.",
          "Build: for j = n − 1 down to 1, join(ancestor(j), j). A[0] is now the maximum.",
          "Sort: swap A[0] with A[m]; walk down the left spine of node 1 to a leaf x, then join(0, x) on the way back up to 1. Repeat for m = n − 1 … 2, then swap A[0] and A[1].",
        ],
      },
      {
        kind: "p",
        text: "**Worked example.** On sorted input [1, …, 8] the sort makes exactly 17 comparisons, which is n⌈log₂ n⌉ − 2^⌈log₂ n⌉ + 1 = 24 − 8 + 1; a binary-heap heapsort on 7 sorted values already needs 21. On the reversed preset it makes 19, within the bound of 23 for n = 8 (the build alone is n − 1 = 7 comparisons).",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "The reverse bits take n bits of extra memory; everything else is in place.",
          "Weak heaps also make good priority queues: Edelkamp, Elmasry and Katajainen developed variants with excellent comparison bounds.",
          "In practice the bit manipulation and irregular access often make it slower than plain heapsort despite fewer comparisons.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Cost.** Building takes exactly n − 1 joins. Each of the n − 2 extractions walks a path of at most ⌈log₂ n⌉ joins. Edelkamp and Wegener (2000) proved a total of at most $n\\lceil \\log_2 n\\rceil - 2^{\\lceil \\log_2 n \\rceil} + n - 1 \\le n \\log_2 n + 0.09n$ comparisons. The tests check the output and this bound on random arrays.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Dutton introduced weak heaps and weak-heapsort in 1993.",
          "Relaxed and rank-relaxed weak heaps support decrease-key in O(1) worst-case time.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n log n)",
    },
    space: "O(n) bits",
    worstClass: "n log n",
  },
  properties: [
    {
      label: "Comparisons",
      value: "≤ n⌈log₂ n⌉ − 2^⌈log₂ n⌉ + n − 1",
    },
    {
      label: "Join",
      value: "One comparison",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "weak_heap_sort",
      code: `def weak_heap_sort(a):
    a, n = list(a), len(a)
    r = [0] * n
    def join(i, j):
        if a[i] < a[j]:
            a[i], a[j] = a[j], a[i]
            r[j] ^= 1
    for j in range(n - 1, 0, -1):
        i = j
        while (i & 1) == r[i >> 1]:
            i >>= 1
        join(i >> 1, j)
    for m in range(n - 1, 1, -1):
        a[0], a[m] = a[m], a[0]
        x = 1
        while 2 * x + r[x] < m:
            x = 2 * x + r[x]
        while x > 0:
            join(0, x)
            x >>= 1
    if n > 1:
        a[0], a[1] = a[1], a[0]
    return a
`,
      tests: [
        {
          args: [[5, 9, 2, 7, 4, 8, 1, 6]],
          expected: [1, 2, 4, 5, 6, 7, 8, 9],
        },
        {
          args: [[3, 1, 3, 2]],
          expected: [1, 2, 3, 3],
        },
      ],
    },
    {
      language: "javascript",
      entry: "bound",
      code: `// Edelkamp–Wegener bound on weak-heapsort comparisons.
function bound(n) {
  const k = Math.ceil(Math.log2(n));
  return n * k - 2 ** k + n - 1;
}
`,
      tests: [
        {
          args: [8],
          expected: 23,
        },
        {
          args: [10],
          expected: 33,
        },
      ],
    },
  ],
  visualizer: "weak-heap-sort",
  practice: [
    {
      id: "wh-join",
      kind: "numeric",
      prompt: "How many comparisons does one join of two weak heaps take?",
      answer: 1,
      explanation:
        "Compare the two roots; the loser's tree becomes the winner's right subtree by flipping a bit.",
      hints: ["What does flipping R[j] achieve?"],
      objective: "Join",
    },
    {
      id: "wh-order",
      kind: "mcq",
      prompt: "In a weak heap, each node is at least as large as…",
      options: [
        "every node in its right subtree",
        "both its children",
        "its parent",
        "every node in its left subtree",
      ],
      answer: 0,
      explanation:
        "Only the right subtree is constrained; the left subtree is unordered relative to the node.",
      distractors: {
        "1": "That is the binary-heap rule.",
        "2": "In a max weak heap the parent's side is larger.",
        "3": "The left subtree is not constrained.",
      },
      hints: ["Which subtree does the rule mention?"],
      objective: "Weak-heap order",
    },
  ],
  exam: {
    definition:
      "Weak-heapsort sorts with a weak heap, in which each node dominates its right subtree and reverse bits make joins one comparison.",
    steps: [
      "Build with n − 1 joins.",
      "Extract: swap root to end; join along the left spine of node 1.",
    ],
    timeComplexity: "$O(n \\log n)$, at most n log n + 0.09n comparisons.",
    spaceComplexity: "n extra bits.",
    correctness: "Joins preserve weak-heap order; the root is always the maximum.",
    applications: ["Comparison-expensive sorting", "Priority queues"],
    limitations: ["Bit manipulation overhead", "Not stable"],
    faq: [
      {
        q: "Why is the root's left subtree empty?",
        a: "So that the root, which dominates its right subtree, dominates the whole heap.",
      },
    ],
    answers: [
      {
        marks: 10,
        outline: [
          "Weak-heap order (3).",
          "Join with reverse bits (3).",
          "Sort procedure (2).",
          "Comparison bound (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "R. D. Dutton, “Weak-heap sort,” BIT, 33(3), 1993.",
      supports: "Weak heaps and weak-heapsort.",
    },
    {
      citation:
        "S. Edelkamp, I. Wegener, “On the performance of WEAK-HEAPSORT,” Proceedings of STACS 2000, LNCS 1770.",
      supports: "The n⌈log n⌉ − 2^⌈log n⌉ + n − 1 comparison bound.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
