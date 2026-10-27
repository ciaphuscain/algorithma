import type { AlgorithmEntry } from "../types";

export const recursiveBinarySearchEntry: AlgorithmEntry = {
  slug: "recursive-binary-search",
  name: "Recursive Binary Search",
  aliases: ["Binary search (recursive)"],
  curriculum: [4],
  domain: "searching-sorting",
  subcategory: "Searching",
  difficulty: "beginner",
  summary:
    "Binary search expressed as a function that calls itself on the half that can still contain the target. The call stack grows by one frame per halving: O(log n) time and O(log n) stack.",
  tags: ["searching", "binary search", "recursion", "divide and conquer"],
  prerequisites: ["Binary search", "Recursion"],
  related: ["binary-search", "uniform-binary-search"],
  problem: {
    input: "A sorted array $A[0..n-1]$ and a target $x$.",
    output: "An index $k$ with $A[k] = x$, or $-1$.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Binary search has a naturally recursive description: to search a range, look at its middle; if that is not the answer, search the half that is left. Writing it that way makes the algorithm read like its definition, and the call stack shows the shrinking ranges one above another.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "search(lo, hi): if lo > hi, the range is empty — return −1.",
          "mid = ⌊(lo + hi) / 2⌋. If A[mid] = x, return mid.",
          "If A[mid] < x, return search(mid + 1, hi); otherwise return search(lo, mid − 1).",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): searching for 23 in [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]. search(0, 9) probes 16 at 4 and recurses on (5, 9); that probes 56 at 7 and recurses on (5, 6); that probes 23 at 5 — found. Three calls, three comparisons. Searching for 40 makes five calls: the last is search(7, 6), an empty range.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Every recursive call is in tail position, so a compiler with tail-call elimination turns it into the loop version; Python and Java do not eliminate tail calls.",
          "Compute mid as lo + (hi − lo) // 2 in fixed-width languages to avoid overflow of lo + hi.",
          "Passing slices instead of indices copies the array at every level — O(n) time overall, which defeats the purpose.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Recurrence.** $T(n) = T(\\lfloor n/2 \\rfloor) + 1$, so $T(n) = \\lfloor \\log_2 n \\rfloor + 1$ comparisons at most, and the recursion is at most $\\lfloor \\log_2 n \\rfloor + 2$ calls deep (counting the final empty call). **Correctness** follows by induction on hi − lo: if x is in A[lo..hi], it is at mid or in the half chosen, since the array is sorted. The tests check every result against the array.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "The same shape — solve one subproblem of half the size — gives the Master theorem case $T(n) = T(n/2) + O(1) = O(\\log n)$.",
          "Recursion depth matters in practice: Python's default limit of 1000 frames is far more than binary search needs, but a recursive linear search would hit it.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(1)", average: "O(log n)", worst: "O(log n)" },
    space: "O(log n) call stack",
    worstClass: "log n",
  },
  properties: [
    { label: "Calls", value: "At most ⌊log₂ n⌋ + 2" },
    { label: "Tail recursive", value: "Yes" },
  ],
  implementations: [
    {
      language: "python",
      entry: "search",
      code: `def search(a, x, lo=0, hi=None):
    if hi is None:
        hi = len(a) - 1
    if lo > hi:
        return -1
    mid = (lo + hi) // 2
    if a[mid] == x:
        return mid
    if a[mid] < x:
        return search(a, x, mid + 1, hi)
    return search(a, x, lo, mid - 1)
`,
      tests: [
        { args: [[2, 5, 8, 12, 16, 23, 38, 56, 72, 91], 23], expected: 5 },
        { args: [[2, 5, 8, 12, 16, 23, 38, 56, 72, 91], 40], expected: -1 },
      ],
    },
    {
      language: "javascript",
      entry: "calls",
      code: `// Number of calls made by recursive binary search.
function calls(a, x) {
  let count = 0;
  const go = (lo, hi) => {
    count++;
    if (lo > hi) return -1;
    const mid = Math.floor((lo + hi) / 2);
    if (a[mid] === x) return mid;
    return a[mid] < x ? go(mid + 1, hi) : go(lo, mid - 1);
  };
  go(0, a.length - 1);
  return count;
}
`,
      tests: [
        { args: [[2, 5, 8, 12, 16, 23, 38, 56, 72, 91], 23], expected: 3 },
        { args: [[2, 5, 8, 12, 16, 23, 38, 56, 72, 91], 40], expected: 5 },
      ],
    },
  ],
  visualizer: "recursive-binary-search",
  practice: [
    {
      id: "rbs-depth",
      kind: "numeric",
      prompt:
        "At most how many element comparisons does recursive binary search make on 100 sorted elements?",
      answer: 7,
      explanation: "⌊log₂ 100⌋ + 1 = 6 + 1 = 7.",
      hints: ["2⁶ = 64 ≤ 100 < 128."],
      objective: "Cost",
    },
    {
      id: "rbs-slice",
      kind: "mcq",
      prompt:
        "A recursive binary search passes a[mid+1:] (a copy) instead of index bounds. What happens to its running time?",
      options: ["It becomes O(n)", "It stays O(log n)", "It becomes O(n log n)", "It becomes O(1)"],
      answer: 0,
      explanation: "Copying halves costs n/2 + n/4 + … = O(n) in total.",
      distractors: {
        1: "The comparisons are still logarithmic, but the copies are not free.",
        2: "The copies shrink geometrically, so their total is linear.",
        3: "Copying can only add cost.",
      },
      hints: ["Add up the sizes of the copies."],
      objective: "Implementation pitfalls",
    },
  ],
  exam: {
    definition:
      "Recursive binary search searches A[lo..hi] by probing the middle and recursing on one half.",
    steps: ["Empty range: −1.", "Probe mid.", "Recurse left or right."],
    timeComplexity: "$O(\\log n)$.",
    spaceComplexity: "$O(\\log n)$ stack (O(1) with tail-call elimination).",
    correctness: "Induction on the range size, using sortedness.",
    applications: ["Teaching recursion", "Divide-and-conquer templates"],
    limitations: ["Stack use without tail-call elimination"],
    faq: [
      {
        q: "Is the recursive version slower?",
        a: "Slightly, because of call overhead; the comparisons are identical.",
      },
    ],
    answers: [
      { marks: 5, outline: ["Code (2).", "Recurrence T(n) = T(n/2) + 1 (2).", "Stack depth (1)."] },
    ],
  },
  references: [
    {
      citation:
        "T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 3rd ed., MIT Press, 2009, Exercise 2.3-5.",
      supports: "Recursive binary search and its O(log n) recurrence.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
