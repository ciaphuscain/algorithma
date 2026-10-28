import type { AlgorithmEntry } from "../types";

export const bottomUpMergeSortEntry: AlgorithmEntry = {
  slug: "bottom-up-merge-sort",
  name: "Bottom-Up Merge Sort",
  aliases: ["Iterative merge sort", "Straight two-way merge sort"],
  curriculum: [28],
  domain: "searching-sorting",
  subcategory: "Divide-and-conquer sorting",
  difficulty: "beginner",
  summary:
    "Merge sort without recursion: merge pairs of runs of width 1, then 2, 4, 8, … until one run covers the array. ⌈log₂ n⌉ passes of O(n) each.",
  tags: ["sorting", "merge sort", "iterative", "stable"],
  prerequisites: ["Merge sort"],
  related: ["merge-sort", "natural-merge-sort"],
  problem: {
    input: "An array of numbers.",
    output: "The same numbers in non-decreasing order.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Top-down merge sort splits the array recursively and merges on the way back. Every split ends at single elements anyway, so start there: treat each element as a sorted run of width 1, merge neighbours into runs of width 2, then 4, and so on. No recursion, no call stack.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "width = 1.",
          "For lo = 0, 2·width, 4·width, …: merge A[lo .. lo + width − 1] with A[lo + width .. min(lo + 2·width, n) − 1].",
          "Double the width and repeat while width < n.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): [5, 1, 4, 2, 8]. Width 1 merges (5, 1) and (4, 2) — 8 waits; width 2 merges [1 5] with [2 4]; width 4 merges [1 2 4 5] with [8]. Four merges, 9 comparisons, 3 passes. Unlike natural merge sort it does the same passes on sorted input.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Alternate the roles of A and the buffer between passes to avoid copying back (ping-pong merging).",
          "It is the natural choice for linked lists and for external sorting of files, where recursion is awkward.",
          "When n is not a power of two, the last run in a pass may be short or have no partner.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Cost.** $\\lceil \\log_2 n \\rceil$ passes, each merging every element once: $O(n \\log n)$ comparisons and moves in every case, with an O(n) buffer. It makes the same merges as top-down merge sort when n is a power of two. The tests check the output and that the number of passes is ⌈log₂ n⌉.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Knuth (TAOCP Vol. 3, §5.2.4) gives it as Algorithm S, straight two-way merge sorting.",
          "Sedgewick and Wayne show it makes between ½ n lg n and n lg n compares.",
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
    space: "O(n)",
    worstClass: "n log n",
  },
  properties: [
    {
      label: "Stable",
      value: "Yes",
    },
    {
      label: "Recursion",
      value: "None",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "bottom_up_merge_sort",
      code: `def bottom_up_merge_sort(a):
    a = list(a)
    n, width = len(a), 1
    while width < n:
        for lo in range(0, n - width, 2 * width):
            mid, hi = lo + width, min(lo + 2 * width, n)
            left, right = a[lo:mid], a[mid:hi]
            i = j = 0
            for k in range(lo, hi):
                if j >= len(right) or (i < len(left) and left[i] <= right[j]):
                    a[k] = left[i]; i += 1
                else:
                    a[k] = right[j]; j += 1
        width *= 2
    return a
`,
      tests: [
        {
          args: [[5, 1, 4, 2, 8]],
          expected: [1, 2, 4, 5, 8],
        },
        {
          args: [[3, 7, 9, 2, 5, 8, 1, 4, 6]],
          expected: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        },
      ],
    },
    {
      language: "javascript",
      entry: "passes",
      code: `// Passes bottom-up merge sort makes on n elements.
function passes(n) {
  let p = 0;
  for (let w = 1; w < n; w *= 2) p++;
  return p;
}
`,
      tests: [
        {
          args: [5],
          expected: 3,
        },
        {
          args: [9],
          expected: 4,
        },
        {
          args: [1],
          expected: 0,
        },
      ],
    },
  ],
  visualizer: "bottom-up-merge-sort",
  practice: [
    {
      id: "bu-passes",
      kind: "numeric",
      prompt: "How many passes does bottom-up merge sort make on 100 elements?",
      answer: 7,
      explanation: "Widths 1, 2, 4, 8, 16, 32, 64: ⌈log₂ 100⌉ = 7.",
      hints: ["Double the width until it reaches n."],
      objective: "Passes",
    },
    {
      id: "bu-vs",
      kind: "mcq",
      prompt: "What does bottom-up merge sort avoid compared with top-down merge sort?",
      options: ["Recursion", "The merge buffer", "Comparisons", "Stability"],
      answer: 0,
      explanation: "It iterates over widths instead of recursing.",
      distractors: {
        "1": "It still needs an O(n) buffer.",
        "2": "It makes a similar number of comparisons.",
        "3": "It is stable too.",
      },
      hints: ["What drives the order of merges?"],
      objective: "Iterative structure",
    },
  ],
  exam: {
    definition: "Bottom-up merge sort merges runs of width 1, 2, 4, … iteratively.",
    steps: ["Width 1 merges.", "Double width.", "Stop when width ≥ n."],
    timeComplexity: "$O(n \\log n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "After the pass with width w, every block of 2w is sorted.",
    applications: ["Linked lists", "External sorting"],
    limitations: ["Extra buffer", "Not adaptive"],
    faq: [
      {
        q: "Does it give the same result as top-down?",
        a: "The same sorted output; the merge order differs when n is not a power of two.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Algorithm (2).", "Pass count (2).", "Comparison with top-down (1)."],
      },
    ],
  },
  references: [
    {
      citation:
        "D. E. Knuth, The Art of Computer Programming, Vol. 3: Sorting and Searching, 2nd ed., Addison-Wesley, 1998, Section 5.2.4.",
      supports: "Straight two-way merge sorting (Algorithm S).",
    },
    {
      citation: "R. Sedgewick, K. Wayne, Algorithms, 4th ed., Addison-Wesley, 2011, Section 2.2.",
      supports: "Bottom-up mergesort and its compare bounds.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
