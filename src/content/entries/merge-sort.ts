import type { AlgorithmEntry } from "../types";

export const mergeSortEntry: AlgorithmEntry = {
  slug: "merge-sort",
  name: "Merge Sort",
  aliases: ["Top-down merge sort"],
  curriculum: [26],
  domain: "searching-sorting",
  subcategory: "Divide & conquer sorting",
  difficulty: "intermediate",
  summary:
    "Splits the array in half, sorts each half recursively, then merges the two sorted halves in linear time: Θ(n log n) on every input.",
  tags: ["sorting", "comparison sort", "divide and conquer", "recursion", "stable", "n log n"],
  prerequisites: ["Recursion", "Insertion Sort"],
  related: ["quick-sort", "insertion-sort"],
  problem: {
    input: "An array $A$ of $n$ comparable elements.",
    output: "The same elements in non-decreasing order.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Merging two piles that are already sorted is easy. Look at the top card of each pile, take the smaller, and repeat. You never need to look further down either pile.",
      },
      {
        kind: "p",
        text: "Merge sort turns sorting into merging. Split the array in half, sort each half the same way, and merge them. The splitting stops at single elements, which are already sorted.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "If the range $A[lo..hi]$ has at most one element, it is sorted: return.",
          "Let $mid = \\lfloor (lo + hi)/2 \\rfloor$. Sort $A[lo..mid]$ and $A[mid+1..hi]$ recursively.",
          "Copy $A[lo..hi]$ into a buffer $B$.",
          "Merge: keep a pointer $i$ into the left half of $B$ and $j$ into the right half. Repeatedly copy the smaller of $B[i]$ and $B[j]$ into the next position of $A$ (taking from the left on ties). When one half runs out, copy the rest of the other.",
        ],
      },
      { kind: "heading", text: "Worked example: [38, 27, 43, 3, 9, 82, 10]" },
      {
        kind: "table",
        head: ["Level", "Subarrays after merging"],
        rows: [
          ["Single elements", "[38] [27] [43] [3] [9] [82] [10]"],
          ["Pairs", "[27, 38]  [3, 43]  [9, 82]  [10]"],
          ["Halves", "[3, 27, 38, 43]  [9, 10, 82]"],
          ["Whole array", "[3, 9, 10, 27, 38, 43, 82]"],
        ],
      },
      {
        kind: "p",
        text: "The visualizer follows the real recursion order: it sorts the whole left half before starting the right half. The table groups the merges by level only to show the structure.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "**Allocate the buffer once** and reuse it for every merge, rather than creating new arrays in each call.",
          "**Take from the left on ties** (`B[i] <= B[j]`). This is what makes merge sort stable.",
          "**Compute the midpoint safely.** In languages with fixed-width integers, `lo + (hi - lo) / 2` avoids overflow.",
          "**Recursion depth** is only $\\lceil \\log_2 n \\rceil$, so stack overflow is not a concern even for very large arrays.",
        ],
      },
    ],
    mathematics: [
      { kind: "heading", text: "The recurrence" },
      {
        kind: "p",
        text: "Merging two halves of total size $n$ takes at most $n - 1$ comparisons and exactly $n$ copies, so the running time satisfies",
      },
      {
        kind: "math",
        tex: "T(n) = T(\\lceil n/2 \\rceil) + T(\\lfloor n/2 \\rfloor) + \\Theta(n), \\qquad T(1) = \\Theta(1).",
      },
      {
        kind: "p",
        text: "The recursion tree has about $\\log_2 n$ levels, and the merges on each level together touch all $n$ elements, so $T(n) = \\Theta(n \\log n)$. This holds for every input, because the splits do not depend on the data. The comparison count is at most $n \\lceil \\log_2 n \\rceil$.",
      },
      { kind: "heading", text: "Why merging is correct" },
      {
        kind: "p",
        text: "**Merge invariant:** before writing $A[k]$, the prefix $A[lo..k-1]$ holds the $k - lo$ smallest elements of the two halves in sorted order, and $B[i]$ and $B[j]$ are the smallest elements not yet copied from each half. The smaller of the two is therefore the smallest remaining element overall, so writing it to $A[k]$ preserves the invariant. Correctness of the whole sort then follows by induction on the range length.",
      },
      { kind: "heading", text: "Optimality" },
      {
        kind: "p",
        text: "Any comparison sort needs $\\lceil \\log_2 n! \\rceil = \\Omega(n \\log n)$ comparisons in the worst case. A decision tree must distinguish all $n!$ orderings, and a binary tree of height $h$ has at most $2^h$ leaves. So merge sort is asymptotically optimal among comparison sorts.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**Bottom-up merge sort** merges runs of width 1, 2, 4, … iteratively, with no recursion.",
          "**Natural merge sort** starts from the runs already present in the input, so nearly sorted data is fast. Timsort refines this idea.",
          "**External sorting.** Merging reads its inputs sequentially, which makes it the standard way to sort data larger than memory (k-way merging of sorted runs on disk).",
          "**Linked lists** can be merge-sorted with $O(1)$ extra space, because merging relinks nodes instead of copying them.",
          "**Counting inversions:** while merging, each time an element is taken from the right half, it is smaller than every remaining left element. Summing those counts gives the inversion count in $O(n \\log n)$.",
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
    space: "\\Theta(n)",
    worstClass: "n log n",
    note: "The $\\Theta(n)$ space is the merge buffer; the recursion stack adds $O(\\log n)$.",
  },
  properties: [
    { label: "Stable", value: "Yes" },
    { label: "In place", value: "No (needs a buffer)" },
    { label: "Adaptive", value: "No (natural merge sort is)" },
    { label: "Comparisons", value: "At most $n \\lceil \\log_2 n \\rceil$" },
  ],
  implementations: [
    {
      language: "python",
      entry: "merge_sort",
      code: `def merge_sort(a):
    """Return a new sorted list; the input is not modified."""
    if len(a) <= 1:
        return list(a)
    mid = len(a) // 2
    left, right = merge_sort(a[:mid]), merge_sort(a[mid:])
    merged, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:  # <= keeps equal elements in order (stable)
            merged.append(left[i])
            i += 1
        else:
            merged.append(right[j])
            j += 1
    merged.extend(left[i:])
    merged.extend(right[j:])
    return merged
`,
      tests: [
        { args: [[38, 27, 43, 3, 9, 82, 10]], expected: [3, 9, 10, 27, 38, 43, 82] },
        { args: [[]], expected: [] },
        { args: [[2, 2, 1]], expected: [1, 2, 2] },
      ],
    },
    {
      language: "javascript",
      entry: "mergeSort",
      code: `function mergeSort(a) {
  const buffer = new Array(a.length);
  function sort(lo, hi) {
    if (lo >= hi) return;
    const mid = lo + Math.floor((hi - lo) / 2);
    sort(lo, mid);
    sort(mid + 1, hi);
    for (let k = lo; k <= hi; k++) buffer[k] = a[k];
    let i = lo;
    let j = mid + 1;
    for (let k = lo; k <= hi; k++) {
      if (j > hi || (i <= mid && buffer[i] <= buffer[j])) a[k] = buffer[i++];
      else a[k] = buffer[j++];
    }
  }
  sort(0, a.length - 1);
  return a;
}
`,
      tests: [
        { args: [[5, 2, 4, 7, 1, 3, 2, 6]], expected: [1, 2, 2, 3, 4, 5, 6, 7] },
        { args: [[1]], expected: [1] },
        { args: [[]], expected: [] },
      ],
    },
  ],
  visualizer: "merge-sort",
  practice: [
    {
      id: "merge-recurrence",
      kind: "mcq",
      prompt: "Which recurrence describes merge sort's running time?",
      options: [
        "$T(n) = 2T(n/2) + \\Theta(n)$",
        "$T(n) = T(n-1) + \\Theta(n)$",
        "$T(n) = 2T(n/2) + \\Theta(1)$",
        "$T(n) = T(n/2) + \\Theta(1)$",
      ],
      answer: 0,
      explanation:
        "Two half-size subproblems, plus linear work to merge them. By the master theorem this is $\\Theta(n \\log n)$.",
      distractors: {
        1: "That is quicksort's worst case (one side empty), which solves to $\\Theta(n^2)$.",
        2: "Merging is not constant time; it touches every element.",
        3: "That is binary search: one half-size subproblem.",
      },
      hints: ["How many recursive calls are there, on what sizes, and what does the merge cost?"],
      objective: "Set up the recurrence",
    },
    {
      id: "merge-max-comparisons",
      kind: "numeric",
      prompt:
        "What is the largest number of comparisons needed to merge two sorted lists of 4 elements each?",
      answer: 7,
      explanation:
        "Each comparison outputs one element, and the last element never needs a comparison: at most $4 + 4 - 1 = 7$. This happens when the two lists interleave, e.g. [1, 3, 5, 7] and [2, 4, 6, 8].",
      hints: [
        "Each comparison places exactly one element in the output.",
        "When can you stop comparing?",
      ],
      objective: "Analyse the merge step",
    },
    {
      id: "merge-stable",
      kind: "mcq",
      prompt: "In the merge, what makes merge sort stable?",
      options: [
        "Taking from the left half when $B[i] = B[j]$",
        "Splitting at the exact midpoint",
        "Using an auxiliary buffer",
        "Recursing on the left half first",
      ],
      answer: 0,
      explanation:
        "Equal elements from the left half originally came first. Taking from the left on ties keeps them first.",
      distractors: {
        1: "Any split point works for stability; the tie rule is what matters.",
        2: "The buffer makes merging easy, but taking from the right on ties would still break stability.",
        3: "Recursion order does not affect the relative order of equal elements.",
      },
      hints: ["What happens with `<` instead of `<=`?"],
      objective: "Explain stability",
    },
  ],
  exam: {
    definition:
      "Merge sort is a stable divide-and-conquer sorting algorithm that recursively sorts the two halves of an array and merges the sorted halves in linear time, giving $\\Theta(n \\log n)$ time in all cases.",
    steps: [
      "If the subarray has fewer than two elements, return.",
      "Divide at $mid = \\lfloor (lo+hi)/2 \\rfloor$.",
      "Conquer: recursively sort $A[lo..mid]$ and $A[mid+1..hi]$.",
      "Combine: merge the two sorted halves using an auxiliary array.",
    ],
    timeComplexity:
      "$T(n) = 2T(n/2) + \\Theta(n) = \\Theta(n \\log n)$ in the best, average and worst case.",
    spaceComplexity: "$\\Theta(n)$ auxiliary array plus $O(\\log n)$ recursion stack.",
    correctness:
      "By induction on the subarray length: single elements are sorted; if both halves are sorted, the merge invariant (the output prefix holds the smallest elements in order) yields a sorted whole.",
    applications: [
      "Sorting linked lists",
      "External sorting of data that does not fit in memory",
      "Counting inversions",
      "Stable sorting of records by key",
    ],
    limitations: [
      "$\\Theta(n)$ extra memory for arrays",
      "Not adaptive: sorted input still costs $\\Theta(n \\log n)$",
    ],
    faq: [
      {
        q: "Merge sort or quicksort?",
        a: "Merge sort guarantees $\\Theta(n \\log n)$ and stability; quicksort is in place and usually faster in practice, but has a $\\Theta(n^2)$ worst case.",
      },
      {
        q: "Can it be done in place?",
        a: "Array merge sort in place is possible but complicated and slower in practice; on linked lists it needs only $O(1)$ extra space.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Divide into halves, sort recursively, merge.",
          "$\\Theta(n \\log n)$ time, $\\Theta(n)$ space, stable.",
        ],
      },
      {
        marks: 5,
        outline: [
          "Definition and divide/conquer/combine (1).",
          "Pseudocode of mergeSort and merge (2).",
          "Recursion tree for a 6–8 element example (1).",
          "Recurrence and solution (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Definition, divide-and-conquer idea — 1.",
          "Pseudocode for both procedures — 3.",
          "Complete worked example with the recursion tree — 2.",
          "Recurrence solved by recursion tree or master theorem — 2.",
          "Merge correctness, stability, comparison with quicksort — 2.",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "D. E. Knuth, The Art of Computer Programming, Vol. 3: Sorting and Searching, 2nd ed., Addison-Wesley, 1998, §5.2.4.",
      supports: "Sorting by merging, its history and comparison counts.",
    },
    {
      citation:
        "T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 3rd ed., MIT Press, 2009, §2.3 and §8.1.",
      supports:
        "Divide-and-conquer analysis of merge sort and the $\\Omega(n \\log n)$ lower bound for comparison sorting.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and quantitative claims are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-20",
};
