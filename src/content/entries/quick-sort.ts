import type { AlgorithmEntry } from "../types";

export const quickSortEntry: AlgorithmEntry = {
  slug: "quick-sort",
  name: "Quick Sort",
  aliases: ["Quicksort", "Partition-exchange sort"],
  curriculum: [29],
  domain: "searching-sorting",
  subcategory: "Divide & conquer sorting",
  difficulty: "intermediate",
  summary:
    "Partitions the array around a pivot so smaller elements go left and the rest go right, then sorts each side recursively, in place.",
  tags: ["sorting", "comparison sort", "divide and conquer", "recursion", "in-place", "partition"],
  prerequisites: ["Recursion", "Swapping array elements"],
  related: ["merge-sort", "insertion-sort"],
  problem: {
    input: "An array $A$ of $n$ comparable elements.",
    output: "The same elements in non-decreasing order, rearranged in place.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Choose one element, the **pivot**. Move everything smaller than it to its left and everything else to its right. The pivot is now exactly where it belongs in the sorted array, and no element will ever cross it again.",
      },
      {
        kind: "p",
        text: "Each side is a smaller instance of the same problem. Sort the two sides independently, and the whole array is sorted. Unlike merge sort, all the work happens *before* the recursive calls, and nothing needs combining afterwards.",
      },
    ],
    mechanics: [
      { kind: "heading", text: "Lomuto partition (pivot = last element)" },
      {
        kind: "list",
        ordered: true,
        items: [
          "Let pivot $= A[hi]$ and $i = lo$. Region $A[lo..i-1]$ will hold elements $<$ pivot.",
          "Scan $j$ from $lo$ to $hi-1$. If $A[j] <$ pivot, swap $A[i]$ and $A[j]$, then increase $i$.",
          "Swap $A[i]$ with $A[hi]$. The pivot is now at index $i$, its final position.",
          "Recurse on $A[lo..i-1]$ and $A[i+1..hi]$.",
        ],
      },
      { kind: "heading", text: "Worked example: partition [2, 8, 7, 1, 3, 5, 6, 4]" },
      {
        kind: "table",
        head: ["j", "A[j] < 4?", "Action", "Array", "i after"],
        rows: [
          ["0", "2 ✓", "i = j, no swap needed", "[2, 8, 7, 1, 3, 5, 6, 4]", "1"],
          ["1", "8 ✗", "—", "[2, 8, 7, 1, 3, 5, 6, 4]", "1"],
          ["2", "7 ✗", "—", "[2, 8, 7, 1, 3, 5, 6, 4]", "1"],
          ["3", "1 ✓", "swap A[1], A[3]", "[2, 1, 7, 8, 3, 5, 6, 4]", "2"],
          ["4", "3 ✓", "swap A[2], A[4]", "[2, 1, 3, 8, 7, 5, 6, 4]", "3"],
          ["5", "5 ✗", "—", "[2, 1, 3, 8, 7, 5, 6, 4]", "3"],
          ["6", "6 ✗", "—", "[2, 1, 3, 8, 7, 5, 6, 4]", "3"],
          ["end", "", "swap A[3], A[7]", "[2, 1, 3, 4, 7, 5, 6, 8]", ""],
        ],
      },
      {
        kind: "p",
        text: "The pivot 4 is final at index 3. Next the algorithm sorts [2, 1, 3] and [7, 5, 6, 8].",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "**Pivot choice decides the running time.** The last element is the simplest choice, but already-sorted input then gives the worst case. Use a random pivot, or the median of first, middle and last.",
          "**Recurse on the smaller side first**, then loop on the larger side. This bounds the stack depth by $O(\\log n)$ even in the worst case.",
          "**Many equal keys** make Lomuto quadratic (all-equal input puts everything on one side). Hoare's partition or three-way partitioning handles duplicates well.",
          "Quicksort is **not stable**: long-distance swaps can reorder equal elements.",
        ],
      },
    ],
    mathematics: [
      { kind: "heading", text: "Best and worst case" },
      {
        kind: "p",
        text: "Partitioning $n$ elements takes $n - 1$ comparisons. If every pivot splits the range evenly, $T(n) = 2T(n/2) + \\Theta(n) = \\Theta(n \\log n)$. If every pivot is the minimum or maximum (sorted input with a last-element pivot), one side is empty:",
      },
      {
        kind: "math",
        tex: "T(n) = T(n-1) + (n-1) \\;\\Rightarrow\\; C(n) = \\sum_{k=1}^{n-1} k = \\frac{n(n-1)}{2} = \\Theta(n^2).",
      },
      { kind: "heading", text: "Average case" },
      {
        kind: "p",
        text: "If all $n!$ input orders are equally likely (or the pivot is chosen uniformly at random), elements $z_i < z_j$ (the $i$-th and $j$-th smallest) are compared exactly when one of them is the first pivot chosen among $z_i, \\dots, z_j$. That happens with probability $\\frac{2}{j - i + 1}$. By linearity of expectation,",
      },
      {
        kind: "math",
        tex: "\\mathbb{E}[C(n)] = \\sum_{i<j} \\frac{2}{j-i+1} = 2(n+1)H_n - 4n \\approx 1.39\\, n \\log_2 n.",
      },
      {
        kind: "p",
        text: "So randomised quicksort makes $\\Theta(n \\log n)$ expected comparisons on *every* input; the bad case depends only on unlucky random choices.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**Hoare's original partition** scans from both ends and makes about three times fewer swaps than Lomuto on average.",
          "**Three-way (Dutch national flag) partitioning** splits into $<$, $=$ and $>$ regions, so inputs with few distinct keys sort in linear time.",
          "**Dual-pivot quicksort** (used for primitive arrays in Java since version 7) partitions into three parts with two pivots.",
          "**Introsort** runs quicksort but switches to heap sort if the recursion gets too deep, guaranteeing $O(n \\log n)$; C++ standard library implementations commonly use it.",
          "**Quickselect** recurses into one side only to find the $k$-th smallest element in expected $O(n)$ time.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "\\Theta(n \\log n)", average: "\\Theta(n \\log n)", worst: "\\Theta(n^2)" },
    space: "O(\\log n) \\text{ to } O(n)",
    worstClass: "n^2",
    note: "Space is the recursion stack: $O(\\log n)$ on balanced splits, $O(n)$ in the worst case for this simple version (recursing on the smaller side first fixes that).",
  },
  properties: [
    { label: "Stable", value: "No" },
    { label: "In place", value: "Yes" },
    { label: "Expected comparisons", value: "$\\approx 1.39\\, n \\log_2 n$ (random pivot)" },
    { label: "Worst-case trigger", value: "Sorted input with a fixed end pivot" },
  ],
  implementations: [
    {
      language: "python",
      entry: "quick_sort",
      code: `def quick_sort(a, lo=0, hi=None):
    """Sort list a in place (Lomuto partition, last element as pivot)."""
    if hi is None:
        hi = len(a) - 1
    if lo >= hi:
        return a
    pivot, i = a[hi], lo
    for j in range(lo, hi):
        if a[j] < pivot:
            a[i], a[j] = a[j], a[i]
            i += 1
    a[i], a[hi] = a[hi], a[i]
    quick_sort(a, lo, i - 1)
    quick_sort(a, i + 1, hi)
    return a
`,
      tests: [
        { args: [[2, 8, 7, 1, 3, 5, 6, 4]], expected: [1, 2, 3, 4, 5, 6, 7, 8] },
        { args: [[]], expected: [] },
        { args: [[3, 3, 1, 3]], expected: [1, 3, 3, 3] },
      ],
    },
    {
      language: "javascript",
      entry: "quickSort",
      code: `function quickSort(a, lo = 0, hi = a.length - 1) {
  if (lo >= hi) return a;
  const pivot = a[hi];
  let i = lo;
  for (let j = lo; j < hi; j++) {
    if (a[j] < pivot) {
      [a[i], a[j]] = [a[j], a[i]];
      i++;
    }
  }
  [a[i], a[hi]] = [a[hi], a[i]];
  quickSort(a, lo, i - 1);
  quickSort(a, i + 1, hi);
  return a;
}
`,
      tests: [
        { args: [[33, 10, 55, 71, 29, 3, 18]], expected: [3, 10, 18, 29, 33, 55, 71] },
        { args: [[1, 2, 3]], expected: [1, 2, 3] },
      ],
    },
  ],
  visualizer: "quick-sort",
  practice: [
    {
      id: "quick-worst",
      kind: "mcq",
      prompt:
        "With the last element as pivot, which input makes quicksort take $\\Theta(n^2)$ time?",
      options: [
        "An already sorted array",
        "A random permutation",
        "An array whose pivot is always the median",
        "None: quicksort is always $\\Theta(n \\log n)$",
      ],
      answer: 0,
      explanation:
        "On sorted input the last element is the maximum, so every partition leaves $n-1$ elements on one side and none on the other.",
      distractors: {
        1: "Random permutations give $\\Theta(n \\log n)$ expected time.",
        2: "Median pivots give perfectly balanced splits: the best case.",
        3: "Only the expected and best cases are $\\Theta(n \\log n)$.",
      },
      hints: ["What is $A[hi]$ when the array is sorted?"],
      objective: "Identify the worst case",
    },
    {
      id: "quick-partition-comparisons",
      kind: "numeric",
      prompt: "How many comparisons does one Lomuto partition of a 10-element range make?",
      answer: 9,
      explanation: "Every element except the pivot is compared with the pivot once: $n - 1 = 9$.",
      hints: ["The loop runs $j$ from $lo$ to $hi - 1$."],
      objective: "Count partition work",
    },
    {
      id: "quick-stable",
      kind: "mcq",
      prompt: "Is quicksort stable?",
      options: [
        "No — partition swaps can carry an element past an equal one",
        "Yes, because it is in place",
        "Yes, if the pivot is the last element",
        "Only on sorted input",
      ],
      answer: 0,
      explanation:
        "For example, partitioning [2a, 2b, 1] around pivot 1 swaps 2a to the end, after 2b.",
      distractors: {
        1: "Being in place and being stable are unrelated properties.",
        2: "The pivot choice does not stop long-distance swaps.",
        3: "Stability must hold for every input.",
      },
      hints: ["Try partitioning a small array that contains two equal keys."],
      objective: "Reason about stability",
    },
  ],
  exam: {
    definition:
      "Quicksort is an in-place divide-and-conquer sorting algorithm that partitions the array around a pivot, placing smaller elements before it and larger or equal elements after it, then recursively sorts the two parts.",
    steps: [
      "If $lo \\ge hi$, return.",
      "Partition $A[lo..hi]$ around pivot $A[hi]$; let $p$ be the pivot's final index.",
      "Recursively sort $A[lo..p-1]$ and $A[p+1..hi]$.",
    ],
    timeComplexity:
      "Best and average $\\Theta(n \\log n)$; worst $\\Theta(n^2)$ when every partition is maximally unbalanced (e.g. sorted input with a last-element pivot).",
    spaceComplexity:
      "$O(\\log n)$ average stack depth; $O(n)$ worst case unless the smaller side is recursed on first.",
    correctness:
      "Partition invariant: $A[lo..i-1] <$ pivot $\\le A[i..j-1]$. After the final swap, the pivot is in its sorted position, and by induction the two recursive calls sort their parts.",
    applications: [
      "General-purpose in-memory sorting (usually as part of introsort)",
      "Selection of the $k$-th smallest element (quickselect)",
    ],
    limitations: [
      "Quadratic worst case without careful pivot choice",
      "Not stable",
      "Degrades with many duplicate keys under Lomuto partitioning",
    ],
    faq: [
      {
        q: "Why is quicksort fast in practice?",
        a: "Its inner loop is simple, it works in place, and it accesses memory sequentially, which suits caches.",
      },
      {
        q: "How do you avoid the worst case?",
        a: "Choose the pivot randomly or by median-of-three, or switch to heap sort at a depth limit (introsort).",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Partition around a pivot, recurse on both sides, in place.",
          "Average $\\Theta(n \\log n)$, worst $\\Theta(n^2)$, not stable.",
        ],
      },
      {
        marks: 5,
        outline: [
          "Definition (1).",
          "Partition and quicksort pseudocode (2).",
          "One partition traced on an example (1).",
          "Best/worst/average complexity (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Definition and idea — 1.",
          "Pseudocode for partition and quicksort — 2.",
          "Complete trace of a partition and the recursion — 3.",
          "Best and worst case recurrences; average case result — 2.",
          "Pivot strategies, stability, comparison with merge sort — 2.",
        ],
      },
    ],
  },
  references: [
    {
      citation: "C. A. R. Hoare, “Quicksort,” The Computer Journal, 5(1), 1962.",
      supports: "Original description of quicksort and its partitioning method.",
    },
    {
      citation:
        "T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 3rd ed., MIT Press, 2009, Ch. 7.",
      supports:
        "Lomuto partition, worst/best case analysis, randomised quicksort and its expected comparison count.",
    },
    {
      citation: "R. Sedgewick, K. Wayne, Algorithms, 4th ed., Addison-Wesley, 2011, §2.3.",
      supports:
        "Practical improvements: cutoff to insertion sort, median-of-three, three-way partitioning.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and quantitative claims are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-20",
};
