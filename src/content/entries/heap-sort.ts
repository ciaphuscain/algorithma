import type { AlgorithmEntry } from "../types";

export const heapSortEntry: AlgorithmEntry = {
  slug: "heap-sort",
  name: "Heap Sort",
  aliases: ["Heapsort"],
  curriculum: [32],
  domain: "searching-sorting",
  subcategory: "Heap-based sorting",
  difficulty: "intermediate",
  summary:
    "Builds a max-heap inside the array, then repeatedly moves the maximum to the end: Θ(n log n) worst case, in place.",
  tags: ["sorting", "comparison sort", "heap", "priority queue", "in-place", "n log n"],
  prerequisites: ["Binary trees", "Selection Sort"],
  related: ["selection-sort", "merge-sort", "quick-sort"],
  problem: {
    input: "An array $A$ of $n$ comparable elements.",
    output: "The same elements in non-decreasing order, sorted in place.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Selection sort spends most of its time searching for the maximum. A **max-heap** is a tree kept so that every parent is at least as large as its children; its maximum is always at the root, and after removing it the heap can be repaired in $O(\\log n)$ steps.",
      },
      {
        kind: "p",
        text: "Heap sort stores that tree inside the array itself: the children of position $i$ are at $2i+1$ and $2i+2$. No pointers and no extra memory are needed.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "**Build the heap:** for every parent from the last ($\\lfloor n/2 \\rfloor - 1$) down to the root, *sift down*: while the element is smaller than its larger child, swap them.",
          "**Extract:** swap the root (the maximum) with the last element of the heap; that position is now final. Shrink the heap by one and sift the new root down.",
          "Repeat the extraction until the heap has one element.",
        ],
      },
      { kind: "heading", text: "Worked example: [4, 10, 3, 5, 1]" },
      {
        kind: "table",
        head: ["Step", "Array", "Final positions"],
        rows: [
          ["Heap built", "[10, 5, 3, 4, 1]", "—"],
          ["Extract 10", "[5, 4, 3, 1, | 10]", "10"],
          ["Extract 5", "[4, 1, 3, | 5, 10]", "5, 10"],
          ["Extract 4", "[3, 1, | 4, 5, 10]", "4, 5, 10"],
          ["Extract 3", "[1, | 3, 4, 5, 10]", "all"],
        ],
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "**0-based indices:** children of $i$ are $2i+1$ and $2i+2$; the parent of $i$ is $\\lfloor (i-1)/2 \\rfloor$.",
          "**Sift down to the larger child.** Swapping with the smaller child would break the heap property between the two siblings.",
          "**Pass the heap size** to sift-down; positions at or after it are already sorted and must not be touched.",
          "Heap sort is not stable, and its scattered memory accesses make it slower than quicksort in practice despite the better worst case.",
        ],
      },
    ],
    mathematics: [
      { kind: "heading", text: "Building a heap takes linear time" },
      {
        kind: "p",
        text: "Sifting down a node of height $h$ costs $O(h)$, and a heap of $n$ elements has at most $\\lceil n / 2^{h+1} \\rceil$ nodes of height $h$. So building costs",
      },
      {
        kind: "math",
        tex: "\\sum_{h=0}^{\\lfloor \\log_2 n \\rfloor} \\left\\lceil \\frac{n}{2^{h+1}} \\right\\rceil O(h) = O\\Big(n \\sum_{h \\ge 0} \\frac{h}{2^h}\\Big) = O(n),",
      },
      { kind: "p", text: "since $\\sum_{h \\ge 0} h/2^h = 2$." },
      { kind: "heading", text: "Sorting" },
      {
        kind: "p",
        text: "Each of the $n - 1$ extractions sifts down a heap of height at most $\\lfloor \\log_2 n \\rfloor$, with two comparisons per level, so the total is $O(n \\log n)$ in the worst case. Combined with the $\\Omega(n \\log n)$ lower bound for comparison sorting, heap sort is worst-case optimal.",
      },
      {
        kind: "p",
        text: "**Invariant of the extraction loop:** $A[0..end]$ is a max-heap, and $A[end+1..n-1]$ holds the largest elements in sorted order, each at least as large as everything in the heap.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**Priority queues** use the same heap operations (insert, extract-max) and power Dijkstra's and Prim's algorithms.",
          "**Bottom-up heapsort** sifts the new root all the way down along larger children, then up, saving comparisons on average.",
          "**Introsort** falls back to heap sort when quicksort recurses too deeply, combining quicksort's speed with heap sort's guarantee.",
          "**Smoothsort** (Dijkstra) uses Leonardo heaps to approach $O(n)$ on nearly sorted input.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "\\Theta(n \\log n)",
      average: "\\Theta(n \\log n)",
      worst: "\\Theta(n \\log n)",
    },
    space: "\\Theta(1)",
    worstClass: "n log n",
    note: "Best case $\\Theta(n \\log n)$ for distinct keys; inputs with all keys equal sort in $O(n)$.",
  },
  properties: [
    { label: "Stable", value: "No" },
    { label: "In place", value: "Yes" },
    { label: "Heap construction", value: "$O(n)$" },
    { label: "Worst case", value: "$\\Theta(n \\log n)$" },
  ],
  implementations: [
    {
      language: "python",
      entry: "heap_sort",
      code: `def heap_sort(a):
    """Sort list a in place using a max-heap and return it."""

    def sift_down(i, size):
        while 2 * i + 1 < size:
            c = 2 * i + 1
            if c + 1 < size and a[c + 1] > a[c]:
                c += 1
            if a[i] >= a[c]:
                return
            a[i], a[c] = a[c], a[i]
            i = c

    n = len(a)
    for i in range(n // 2 - 1, -1, -1):
        sift_down(i, n)
    for end in range(n - 1, 0, -1):
        a[0], a[end] = a[end], a[0]
        sift_down(0, end)
    return a
`,
      tests: [
        { args: [[4, 10, 3, 5, 1]], expected: [1, 3, 4, 5, 10] },
        { args: [[16, 4, 10, 14, 7, 9, 3, 2, 8]], expected: [2, 3, 4, 7, 8, 9, 10, 14, 16] },
        { args: [[]], expected: [] },
      ],
    },
    {
      language: "javascript",
      entry: "heapSort",
      code: `function heapSort(a) {
  const siftDown = (i, size) => {
    while (2 * i + 1 < size) {
      let c = 2 * i + 1;
      if (c + 1 < size && a[c + 1] > a[c]) c++;
      if (a[i] >= a[c]) return;
      [a[i], a[c]] = [a[c], a[i]];
      i = c;
    }
  };
  for (let i = Math.floor(a.length / 2) - 1; i >= 0; i--) siftDown(i, a.length);
  for (let end = a.length - 1; end > 0; end--) {
    [a[0], a[end]] = [a[end], a[0]];
    siftDown(0, end);
  }
  return a;
}
`,
      tests: [{ args: [[3, 1, 3, 2, 3]], expected: [1, 2, 3, 3, 3] }],
    },
  ],
  visualizer: "heap-sort",
  practice: [
    {
      id: "heap-children",
      kind: "mcq",
      prompt: "In a 0-based array heap, where are the children of index 4?",
      options: ["9 and 10", "8 and 9", "5 and 6", "2 and 3"],
      answer: 0,
      explanation: "$2 \\cdot 4 + 1 = 9$ and $2 \\cdot 4 + 2 = 10$.",
      distractors: {
        1: "That is the 1-based formula ($2i$, $2i+1$) applied to 0-based indices.",
        2: "Those are neighbours, not children.",
        3: "Those are earlier indices; parents come before children.",
      },
      hints: ["Use $2i+1$ and $2i+2$."],
      objective: "Navigate an array heap",
    },
    {
      id: "heap-build",
      kind: "mcq",
      prompt: "How long does building a heap from n elements bottom-up take?",
      options: ["$O(n)$", "$O(n \\log n)$", "$O(\\log n)$", "$O(n^2)$"],
      answer: 0,
      explanation:
        "Most nodes are near the bottom and sift down only a little; the sum $\\sum_h \\frac{n}{2^{h+1}} h$ is $O(n)$.",
      distractors: {
        1: "That is a correct upper bound but not tight; it is what inserting elements one at a time costs.",
        2: "Every element must at least be looked at.",
        3: "Far too pessimistic.",
      },
      hints: ["How many nodes have height $h$?"],
      objective: "Analyse heap construction",
    },
    {
      id: "heap-after-build",
      kind: "mcq",
      prompt: "What does [4, 10, 3, 5, 1] look like after the heap-building phase?",
      options: ["[10, 5, 3, 4, 1]", "[10, 4, 3, 5, 1]", "[1, 3, 4, 5, 10]", "[10, 5, 4, 3, 1]"],
      answer: 0,
      explanation:
        "Index 1 (10) already beats its children 5 and 1. At the root, 4 swaps with its larger child 10, then with its new larger child 5.",
      distractors: {
        1: "4 must keep sifting: it is smaller than its new child 5.",
        2: "That is the sorted result, not a heap.",
        3: "A heap is not fully sorted; 3 stays at index 2.",
      },
      hints: ["Sift down index 1, then index 0."],
      objective: "Trace heap construction",
    },
  ],
  exam: {
    definition:
      "Heap sort is an in-place comparison sort that arranges the array as a binary max-heap and repeatedly swaps the maximum (the root) to the end of the unsorted region, restoring the heap after each swap.",
    steps: [
      "Build a max-heap: for $i = \\lfloor n/2 \\rfloor - 1$ down to 0, siftDown($i$, $n$).",
      "For end $= n-1$ down to 1: swap $A[0]$ and $A[end]$; siftDown(0, end).",
      "siftDown($i$, size): while $i$ has a child, swap $A[i]$ with its larger child if that child is larger; otherwise stop.",
    ],
    timeComplexity:
      "$O(n)$ to build the heap plus $O(n \\log n)$ for the extractions: $\\Theta(n \\log n)$ worst case.",
    spaceComplexity: "$\\Theta(1)$ extra space (iterative sift-down).",
    correctness:
      "After building, $A[0..n-1]$ is a max-heap. Each extraction places the current maximum in its final position and restores the heap on the remainder.",
    applications: [
      "Guaranteed $O(n \\log n)$ in-place sorting",
      "Fallback inside introsort",
      "Priority queues (same heap operations)",
    ],
    limitations: ["Not stable", "Poor cache locality: usually slower than quicksort in practice"],
    faq: [
      {
        q: "Why build the heap bottom-up?",
        a: "Bottom-up construction is $O(n)$; inserting elements one by one is $O(n \\log n)$.",
      },
      {
        q: "Why a max-heap for ascending order?",
        a: "The maximum is moved to the end, so the sorted part grows from the right.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Build a max-heap, repeatedly swap root to the end and sift down.",
          "$\\Theta(n \\log n)$, in place, not stable.",
        ],
      },
      {
        marks: 5,
        outline: [
          "Definition and heap property (1).",
          "Pseudocode for heapSort and siftDown (2).",
          "Short trace (1).",
          "Complexity (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Heap property and array representation — 2.",
          "Pseudocode for siftDown, buildHeap and heapSort — 2.",
          "Full trace: heap after building and after each extraction — 3.",
          "$O(n)$ build-heap proof and $O(n \\log n)$ total — 2.",
          "Comparison with merge sort and quicksort — 1.",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "J. W. J. Williams, “Algorithm 232: Heapsort,” Communications of the ACM, 7(6), 1964.",
      supports: "Original heapsort.",
    },
    {
      citation: "R. W. Floyd, “Algorithm 245: Treesort 3,” Communications of the ACM, 7(12), 1964.",
      supports: "Bottom-up linear-time heap construction.",
    },
    {
      citation:
        "T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 3rd ed., MIT Press, 2009, Ch. 6.",
      supports: "Heap operations, the $O(n)$ build-heap bound and heapsort analysis.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and quantitative claims are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-20",
};
