import type { AlgorithmEntry } from "../types";

export const binarySearchEntry: AlgorithmEntry = {
  slug: "binary-search",
  name: "Binary Search",
  aliases: ["Half-interval search", "Logarithmic search"],
  curriculum: [3],
  domain: "searching-sorting",
  subcategory: "Searching",
  difficulty: "beginner",
  summary:
    "Finds a value in a sorted array by repeatedly halving the range that could contain it: O(log n) comparisons.",
  tags: ["searching", "sorted array", "divide and conquer", "logarithmic"],
  prerequisites: ["Arrays and indexing", "Sorted order"],
  related: ["insertion-sort"],
  problem: {
    input: "An array $A[0..n-1]$ sorted in non-decreasing order, and a target value $x$.",
    output: "An index $k$ with $A[k] = x$, or $-1$ if $x$ does not occur.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "To find a word in a dictionary, you open it near the middle. If your word comes earlier, you ignore the whole second half; otherwise you ignore the first half. Each look throws away half of what is left.",
      },
      {
        kind: "p",
        text: "Halving is powerful. A million entries shrink to one in about 20 looks, because $2^{20} \\approx 10^6$.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Keep a range $[lo, hi]$ that contains the target if it is anywhere. Start with $lo = 0$, $hi = n-1$.",
          "While $lo \\le hi$, look at the middle $mid = \\lfloor (lo+hi)/2 \\rfloor$.",
          "If $A[mid] = x$, return $mid$. If $A[mid] < x$, the target must be right of $mid$: set $lo = mid + 1$. Otherwise set $hi = mid - 1$.",
          "If the range becomes empty ($lo > hi$), $x$ is not present.",
        ],
      },
      { kind: "heading", text: "Worked example: find 23 in [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]" },
      {
        kind: "table",
        head: ["lo", "hi", "mid", "A[mid]", "Decision"],
        rows: [
          ["0", "9", "4", "16", "16 < 23 → lo = 5"],
          ["5", "9", "7", "56", "56 > 23 → hi = 6"],
          ["5", "6", "5", "23", "found at index 5"],
        ],
      },
      { kind: "p", text: "Three comparisons instead of the six a left-to-right scan would need." },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "**The input must be sorted.** On unsorted data, binary search can report “not found” for a value that is present.",
          "**Overflow.** With fixed-width integers, `(lo + hi) / 2` can overflow for huge arrays; `lo + (hi - lo) / 2` cannot. This bug sat unnoticed in widely used libraries for years.",
          "**Off-by-one errors** are the classic trap. Decide whether $hi$ is inclusive or exclusive and keep the loop condition and updates consistent ($lo \\le hi$ with $hi = mid - 1$ here).",
          "**Duplicates.** This version returns *some* index of $x$. To find the first one, keep searching left after a match (the lower-bound variant).",
        ],
      },
    ],
    mathematics: [
      { kind: "heading", text: "Correctness" },
      {
        kind: "p",
        text: "**Invariant:** if $x$ occurs in $A$, it occurs in $A[lo..hi]$. It holds initially. If $A[mid] < x$, every element at or before $mid$ is $\\le A[mid] < x$ (the array is sorted), so discarding them keeps the invariant; the other case is symmetric. The range shrinks each iteration, so the loop terminates. When it does with $lo > hi$, the range is empty, so $x$ is absent.",
      },
      { kind: "heading", text: "Number of comparisons" },
      {
        kind: "p",
        text: "If the range has $r$ elements, the next one has at most $\\lfloor r/2 \\rfloor$. After $k$ iterations at most $\\lfloor n / 2^k \\rfloor$ elements remain, so the loop runs at most $\\lfloor \\log_2 n \\rfloor + 1$ times:",
      },
      { kind: "math", tex: "C_{\\max}(n) = \\lfloor \\log_2 n \\rfloor + 1 = \\Theta(\\log n)." },
      {
        kind: "p",
        text: "Here one iteration counts as one three-way comparison ($<$, $=$ or $>$). Implementations that test equality separately make up to two comparisons per iteration.",
      },
      {
        kind: "p",
        text: "**Lower bound.** Any comparison-based search must distinguish $n + 1$ outcomes (one of $n$ positions or “absent”). A decision tree with three-way branching therefore needs depth $\\Omega(\\log n)$, so binary search is optimal up to a constant factor.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**Binary search on the answer.** If a predicate $P(k)$ is false then true as $k$ grows, binary search finds the boundary. This solves many optimisation problems, e.g. the smallest capacity that ships all packages in $d$ days.",
          "**Lower and upper bound** variants return the first index $\\ge x$ and the first index $> x$. Their difference counts occurrences.",
          "**Exponential search** finds a range by doubling, then binary-searches it: $O(\\log k)$ where $k$ is the target's position. It also works on unbounded lists.",
          "**Interpolation search** guesses the position from the values, giving $O(\\log \\log n)$ on uniformly distributed keys but $O(n)$ in the worst case.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "\\Theta(1)", average: "\\Theta(\\log n)", worst: "\\Theta(\\log n)" },
    space: "\\Theta(1)",
    worstClass: "log n",
    note: "Iterative version. A recursive version uses $\\Theta(\\log n)$ stack space.",
  },
  properties: [
    { label: "Requires", value: "Sorted input with random access" },
    { label: "Worst-case comparisons", value: "$\\lfloor \\log_2 n \\rfloor + 1$" },
    { label: "With duplicates", value: "Returns some matching index" },
  ],
  implementations: [
    {
      language: "python",
      entry: "binary_search",
      code: `def binary_search(a, target):
    """Return an index of target in sorted list a, or -1."""
    lo, hi = 0, len(a) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if a[mid] == target:
            return mid
        if a[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1
`,
      tests: [
        { args: [[2, 5, 8, 12, 16, 23, 38, 56, 72, 91], 23], expected: 5 },
        { args: [[2, 5, 8, 12, 16, 23, 38, 56, 72, 91], 40], expected: -1 },
        { args: [[], 1], expected: -1 },
        { args: [[7], 7], expected: 0 },
      ],
    },
    {
      language: "javascript",
      entry: "binarySearch",
      code: `function binarySearch(a, target) {
  let lo = 0;
  let hi = a.length - 1;
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (a[mid] === target) return mid;
    if (a[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
`,
      tests: [
        { args: [[3, 6, 9, 12, 15, 18, 21], 3], expected: 0 },
        { args: [[3, 6, 9, 12, 15, 18, 21], 21], expected: 6 },
        { args: [[3, 6, 9], 4], expected: -1 },
      ],
    },
  ],
  visualizer: "binary-search",
  practice: [
    {
      id: "binary-max-comparisons",
      kind: "numeric",
      prompt:
        "At most how many iterations (three-way comparisons) does binary search need on a sorted array of 1000 elements?",
      answer: 10,
      explanation:
        "$\\lfloor \\log_2 1000 \\rfloor + 1 = 9 + 1 = 10$, since $2^9 = 512 \\le 1000 < 1024 = 2^{10}$.",
      hints: [
        "Each iteration at least halves the remaining range.",
        "Use $\\lfloor \\log_2 n \\rfloor + 1$.",
      ],
      objective: "Bound the number of comparisons",
    },
    {
      id: "binary-unsorted",
      kind: "mcq",
      prompt:
        "Binary search runs on the unsorted array [9, 1, 5, 3, 7] looking for 3. What does it return?",
      options: ["−1 (not found), although 3 is present", "3", "It loops forever", "1"],
      answer: 0,
      explanation:
        "mid = 2 holds 5 > 3, so hi = 1. Then mid = 0 holds 9 > 3, so hi = −1 and the range is empty. The 3 at index 3 was discarded in the first step, because the algorithm assumed everything right of 5 is larger. That assumption needs a sorted array.",
      distractors: {
        1: "Index 3 is ruled out in the very first step.",
        2: "The range shrinks every iteration, so binary search always terminates.",
        3: "A[1] = 1 is never even examined.",
      },
      hints: ["Compute the first mid and compare.", "Which half does the algorithm throw away?"],
      objective: "Understand the sortedness precondition",
    },
    {
      id: "binary-next-range",
      kind: "mcq",
      prompt:
        "Searching for 30 in [4, 9, 15, 22, 30, 41, 57], the first mid is 3 (value 22). What is the next range?",
      options: ["lo = 4, hi = 6", "lo = 0, hi = 2", "lo = 3, hi = 6", "lo = 4, hi = 5"],
      answer: 0,
      explanation:
        "22 < 30, so the target can only be right of index 3: lo = mid + 1 = 4, and hi stays 6.",
      distractors: {
        1: "That would discard the right half, but 30 > 22.",
        2: "Index 3 has already been ruled out, so lo moves past it.",
        3: "hi does not change when the target is to the right.",
      },
      hints: ["Is 30 to the left or to the right of 22?"],
      objective: "Apply the update rule",
    },
  ],
  exam: {
    definition:
      "Binary search finds a target in a sorted array by comparing it with the middle element and discarding the half that cannot contain it, repeating until the target is found or the range is empty.",
    steps: [
      "Set $lo = 0$, $hi = n - 1$.",
      "While $lo \\le hi$: $mid = \\lfloor (lo+hi)/2 \\rfloor$.",
      "If $A[mid] = x$, return $mid$; if $A[mid] < x$, $lo = mid + 1$; else $hi = mid - 1$.",
      "Return $-1$.",
    ],
    timeComplexity:
      "$\\Theta(\\log n)$ worst and average; $\\Theta(1)$ best (target at the first middle).",
    spaceComplexity: "$\\Theta(1)$ iterative; $\\Theta(\\log n)$ recursive.",
    correctness:
      "Invariant: if $x$ is in $A$, it is in $A[lo..hi]$. Sortedness justifies each discard; the range strictly shrinks, so the loop terminates.",
    applications: [
      "Lookup in sorted tables and indexes",
      "Finding boundaries: first/last occurrence, insertion position",
      "Binary search on the answer for monotone predicates",
      "Debugging by bisection (e.g. `git bisect`)",
    ],
    limitations: [
      "Requires sorted data and random access",
      "Not useful on linked lists, where reaching the middle costs $O(n)$",
    ],
    faq: [
      {
        q: "Recursive or iterative?",
        a: "Both are $\\Theta(\\log n)$ time; the iterative form uses $O(1)$ space.",
      },
      {
        q: "What if the array has duplicates?",
        a: "It returns some occurrence. Use the lower-bound variant for the first one.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Compare with the middle, discard half, repeat; needs sorted input.",
          "$O(\\log n)$ time, $O(1)$ space.",
        ],
      },
      {
        marks: 5,
        outline: [
          "Definition and precondition (1).",
          "Pseudocode (2).",
          "Trace for a present and an absent target (1).",
          "Complexity with the halving argument (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Definition and precondition — 1.",
          "Iterative and recursive pseudocode — 2.",
          "Full traces: found and not found — 2.",
          "Derivation of $\\lfloor \\log_2 n \\rfloor + 1$ — 2.",
          "Correctness invariant, pitfalls (overflow, off-by-one), applications — 3.",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "D. E. Knuth, The Art of Computer Programming, Vol. 3: Sorting and Searching, 2nd ed., Addison-Wesley, 1998, §6.2.1.",
      supports: "Analysis of binary search, its variants and history.",
    },
    {
      citation:
        "J. Bloch, “Extra, Extra — Read All About It: Nearly All Binary Searches and Mergesorts are Broken,” Google Research Blog, 2006.",
      supports: "The integer-overflow bug in computing the midpoint.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and quantitative claims are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-20",
};
