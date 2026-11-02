import type { AlgorithmEntry } from "../types";

export const twoPointersEntry: AlgorithmEntry = {
  slug: "two-pointers",
  name: "Two Pointers",
  aliases: ["Pair sum in a sorted array", "Two-sum (sorted)", "Opposite-direction pointers"],
  curriculum: [55],
  domain: "arrays-hashing",
  subcategory: "Array Techniques",
  difficulty: "beginner",
  summary:
    "On a sorted array, start one pointer at each end and move whichever one cannot be part of an answer. Finds a pair with a given sum in O(n) instead of checking all O(n²) pairs.",
  tags: ["two pointers", "sorted array", "pair sum", "greedy elimination"],
  prerequisites: ["Arrays", "Sorting"],
  related: ["sliding-window", "binary-search"],
  problem: {
    input: "A sorted array $A$ and a target $T$.",
    output: "Indices $i < j$ with $A[i] + A[j] = T$, or “none”.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Look at the smallest and largest numbers. If together they are too small, the smallest number is hopeless: even the largest partner is not enough, so drop it. If they are too large, the largest number is hopeless: even the smallest partner is too much, so drop it. Each check removes one candidate for good.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "$i = 0$, $j = n - 1$.",
          "While $i < j$: compute $s = A[i] + A[j]$.",
          "If $s = T$, report $(i, j)$. If $s < T$, move $i$ right. If $s > T$, move $j$ left.",
          "If the pointers meet, no pair exists.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): $A = [1, 3, 4, 6, 8, 10, 13]$, $T = 13$.",
      },
      {
        kind: "table",
        head: ["i", "j", "A[i] + A[j]", "decision"],
        rows: [
          ["0", "6", "1 + 13 = 14", "too large: drop 13 (j ← 5)"],
          ["0", "5", "1 + 10 = 11", "too small: drop 1 (i ← 1)"],
          ["1", "5", "3 + 10 = 13", "found"],
        ],
      },
      {
        kind: "p",
        text: "Three checks instead of up to 21 pairs.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "The array must be sorted; sorting first costs $O(n \\log n)$, which then dominates.",
          "On an unsorted array, a hash set finds a pair in $O(n)$ expected time without sorting, but uses $O(n)$ extra memory.",
          "To list **all** pairs, after a match move both pointers, skipping duplicates.",
          "The same pattern solves 3-sum (fix one element, run two pointers on the rest: $O(n^2)$), container-with-most-water, and merging two sorted lists.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Invariant:** if a pair summing to $T$ exists, one exists inside $[i, j]$. Initially true. If $A[i] + A[j] < T$, then $A[i] + A[k] \\le A[i] + A[j] < T$ for every $k \\le j$, so $A[i]$ is in no valid pair inside the range and can be dropped. The case $s > T$ is symmetric. Each step shrinks the range by one, so there are at most $n - 1$ checks.",
      },
      { kind: "math", tex: "T(n) = O(n), \\qquad \\text{space } O(1)" },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**$k$-sum:** fixing $k - 2$ elements and running two pointers gives $O(n^{k-1})$. Whether 3-sum can be solved in truly subquadratic time is a famous open problem (the 3SUM conjecture), used as a hardness assumption in computational geometry.",
          "Same-direction pointers form a **sliding window**; opposite-direction pointers, as here, exploit sorted order.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(1)", average: "O(n)", worst: "O(n)" },
    space: "O(1)",
    worstClass: "n",
    note: "On an already sorted array; sorting first adds $O(n \\log n)$.",
  },
  properties: [
    { label: "Checks", value: "At most $n - 1$" },
    { label: "Requires", value: "Sorted input" },
  ],
  implementations: [
    {
      language: "python",
      entry: "pair_sum",
      code: `def pair_sum(a, target):
    """a is sorted. Returns [i, j] with a[i] + a[j] == target, or None."""
    i, j = 0, len(a) - 1
    while i < j:
        s = a[i] + a[j]
        if s == target:
            return [i, j]
        if s < target:
            i += 1
        else:
            j -= 1
    return None
`,
      tests: [
        { args: [[1, 3, 4, 6, 8, 10, 13], 13], expected: [1, 5] },
        { args: [[2, 4, 6, 8], 11], expected: null },
        { args: [[-7, -3, 0, 2, 5, 9], 2], expected: [0, 5] },
      ],
    },
    {
      language: "javascript",
      entry: "threeSumExists",
      code: `// Is there a triple summing to target? Sort, fix one element, run two pointers.
function threeSumExists(a, target) {
  const s = [...a].sort((x, y) => x - y);
  for (let k = 0; k < s.length - 2; k++) {
    let i = k + 1;
    let j = s.length - 1;
    while (i < j) {
      const sum = s[k] + s[i] + s[j];
      if (sum === target) return true;
      if (sum < target) i++;
      else j--;
    }
  }
  return false;
}
`,
      tests: [
        { args: [[12, 3, 4, 1, 6, 9], 24], expected: true },
        { args: [[1, 2, 3], 7], expected: false },
      ],
    },
  ],
  visualizer: "two-pointers",
  practice: [
    {
      id: "two-pointers-checks",
      kind: "numeric",
      prompt:
        "In the worst case, how many sums does the two-pointer method compute on a sorted array of 20 elements?",
      answer: 19,
      explanation:
        "Each check without a match removes one element from $[i, j]$; the range starts with 20 elements and stops at 1, so at most 19 checks.",
      hints: ["How much does the range shrink per check?"],
      objective: "Bound the work",
    },
    {
      id: "two-pointers-why",
      kind: "mcq",
      prompt: "If $A[i] + A[j] < T$, why is it safe to discard $A[i]$?",
      options: [
        "Its largest possible partner, $A[j]$, is already too small, so every other partner is too",
        "Because $A[i]$ is the smallest element in the whole array",
        "Because $i$ must always move first",
        "It is not safe; the method can miss pairs",
      ],
      answer: 0,
      explanation:
        "All remaining partners are at most $A[j]$, so all sums with $A[i]$ are below $T$.",
      distractors: {
        1: "After some steps, $A[i]$ is only the smallest remaining element; the argument uses the range, not the whole array.",
        2: "The order depends on the comparison.",
        3: "The invariant shows no valid pair is lost.",
      },
      hints: ["Which partners does $A[i]$ have left?"],
      objective: "Understand the elimination argument",
    },
  ],
  exam: {
    definition:
      "The two-pointer technique scans a sorted array from both ends, moving the pointer whose element cannot belong to a solution.",
    steps: [
      "i = 0, j = n − 1.",
      "Compare A[i] + A[j] with T; move i right if smaller, j left if larger, stop if equal.",
    ],
    timeComplexity: "$O(n)$ on sorted input.",
    spaceComplexity: "$O(1)$.",
    correctness:
      "Each discarded element has no valid partner among the remaining ones, so if a pair exists it stays inside [i, j].",
    applications: [
      "Pair and triple sums",
      "Merging sorted lists",
      "Container with most water",
      "Removing duplicates in place",
    ],
    limitations: ["Needs sorted input (or an $O(n \\log n)$ sort first)"],
    faq: [
      {
        q: "Two pointers or a hash set?",
        a: "A hash set works on unsorted data in $O(n)$ expected time with $O(n)$ memory; two pointers need sorted data but no extra memory.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Pointers at both ends of a sorted array.", "Move the hopeless one; $O(n)$."],
      },
      {
        marks: 5,
        outline: [
          "Algorithm (2).",
          "Worked example (1).",
          "Correctness invariant (1).",
          "Complexity (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "A. Laaksonen, Guide to Competitive Programming, Springer, 2017.",
      supports: "The two-pointers method, 2-sum and 3-sum.",
    },
    {
      citation:
        "A. Gajentaan, M. H. Overmars, “On a class of O(n²) problems in computational geometry,” Computational Geometry, 5(3), 1995.",
      supports: "3SUM-hardness as a tool for lower bounds.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-23",
};
