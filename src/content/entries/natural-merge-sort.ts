import type { AlgorithmEntry } from "../types";

export const naturalMergeSortEntry: AlgorithmEntry = {
  slug: "natural-merge-sort",
  name: "Natural Merge Sort",
  aliases: ["Natural two-way merge sort"],
  curriculum: [27],
  domain: "searching-sorting",
  subcategory: "Divide-and-conquer sorting",
  difficulty: "intermediate",
  summary:
    "Merge sort that starts from the runs already in order instead of single elements: find the maximal ascending runs, then merge neighbouring runs pairwise until one is left. Sorted input takes one scan; r runs take ⌈log₂ r⌉ passes.",
  tags: ["sorting", "merge sort", "adaptive", "runs", "stable"],
  prerequisites: ["Merge sort"],
  related: ["merge-sort", "bottom-up-merge-sort", "merge-sorted-lists"],
  problem: {
    input: "An array of numbers.",
    output: "The same numbers in non-decreasing order.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Real data is often partly sorted: a list that was sorted yesterday and has had a few additions, or several sorted lists glued together. Ordinary merge sort ignores this and splits down to single elements anyway. Natural merge sort first notices the stretches that are already in order (runs) and merges those.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Scan once, cutting the array wherever A[i] > A[i + 1]: these are the maximal non-decreasing runs.",
          "Merge runs 1 and 2, 3 and 4, …; an odd last run waits for the next pass.",
          "Repeat until one run remains.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the fourth preset): [3, 7, 9, 2, 5, 8, 1, 4, 6] has 3 runs, [3 7 9], [2 5 8] and [1 4 6]. Pass 1 merges the first two; pass 2 merges the result with [1 4 6]. Two merges and 19 comparisons (8 to find the runs). Sorted input is one run: 7 comparisons and no merge.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Merging with ≤ keeps it stable.",
          "Timsort is the industrial version: it finds natural runs, extends short ones with insertion sort, and merges them with a stack-based policy and galloping.",
          "Descending runs can be reversed in place and treated as ascending (Timsort does this for strictly descending runs).",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Cost.** Finding runs takes n − 1 comparisons. With r runs, there are $\\lceil \\log_2 r \\rceil$ merge passes of O(n) each: $O(n \\log r)$ — O(n) for sorted input, O(n log n) in the worst case (r = n/2 for alternating input). The tests check the output and that the number of passes is ⌈log₂ r⌉.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Knuth (TAOCP Vol. 3, §5.2.4) gives Algorithm N, a natural two-way merge that works from both ends of the array.",
          "Measures of presortedness such as the number of runs make “adaptive sorting” precise; natural merge sort is the standard example of a sort that adapts to the number of runs.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n log n)",
      worst: "O(n log n)",
    },
    space: "O(n)",
    worstClass: "n log n",
    note: "O(n log r) for r natural runs.",
  },
  properties: [
    {
      label: "Stable",
      value: "Yes",
    },
    {
      label: "Passes",
      value: "⌈log₂ r⌉ for r runs",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "natural_merge_sort",
      code: `from heapq import merge

def runs_of(a):
    runs, start = [], 0
    for i in range(1, len(a) + 1):
        if i == len(a) or a[i] < a[i - 1]:
            runs.append(a[start:i]); start = i
    return runs

def natural_merge_sort(a):
    runs = runs_of(list(a))
    while len(runs) > 1:
        runs = [list(merge(runs[i], runs[i + 1])) if i + 1 < len(runs) else runs[i]
                for i in range(0, len(runs), 2)]
    return runs[0] if runs else []
`,
      tests: [
        {
          args: [[3, 7, 9, 2, 5, 8, 1, 4, 6]],
          expected: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        },
        {
          args: [[4, 1, 4, 2, 1, 4]],
          expected: [1, 1, 2, 4, 4, 4],
        },
      ],
    },
    {
      language: "javascript",
      entry: "runCount",
      code: `// Number of maximal non-decreasing runs.
function runCount(a) {
  let runs = a.length ? 1 : 0;
  for (let i = 1; i < a.length; i++) if (a[i] < a[i - 1]) runs++;
  return runs;
}
`,
      tests: [
        {
          args: [[3, 7, 9, 2, 5, 8, 1, 4, 6]],
          expected: 3,
        },
        {
          args: [[1, 2, 3]],
          expected: 1,
        },
      ],
    },
  ],
  visualizer: "natural-merge-sort",
  practice: [
    {
      id: "nms-runs",
      kind: "numeric",
      prompt: "How many natural runs does [1, 5, 2, 6, 3, 7, 4, 8] have?",
      answer: 4,
      explanation: "[1 5] [2 6] [3 7] [4 8].",
      hints: ["Cut wherever a value is smaller than the one before."],
      objective: "Runs",
    },
    {
      id: "nms-passes",
      kind: "numeric",
      prompt: "An array has 9 natural runs. How many merge passes does natural merge sort make?",
      answer: 4,
      explanation: "9 → 5 → 3 → 2 → 1: ⌈log₂ 9⌉ = 4.",
      hints: ["Each pass halves the number of runs, rounding up."],
      objective: "Passes",
    },
  ],
  exam: {
    definition:
      "Natural merge sort merges the maximal ascending runs already present in the input, pairwise, until one run remains.",
    steps: ["Find runs.", "Merge pairs of runs.", "Repeat."],
    timeComplexity: "O(n log r); O(n) for sorted input.",
    spaceComplexity: "$O(n)$.",
    correctness: "Merging two sorted runs gives a sorted run; the number of runs halves each pass.",
    applications: ["Partly sorted data", "Basis of Timsort"],
    limitations: ["Extra buffer", "No gain on random data"],
    faq: [
      {
        q: "How does it differ from bottom-up merge sort?",
        a: "Bottom-up merges fixed widths 1, 2, 4, …; natural merge sort merges the runs it finds, so presorted input costs less.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Runs (2).", "Pairwise merging (2).", "O(n log r) (1)."],
      },
    ],
  },
  references: [
    {
      citation:
        "D. E. Knuth, The Art of Computer Programming, Vol. 3: Sorting and Searching, 2nd ed., Addison-Wesley, 1998, Section 5.2.4.",
      supports: "Natural two-way merge sorting (Algorithm N).",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
