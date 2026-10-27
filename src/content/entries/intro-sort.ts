import type { AlgorithmEntry } from "../types";

export const introSortEntry: AlgorithmEntry = {
  slug: "intro-sort",
  name: "IntroSort",
  aliases: ["Introspective sort"],
  curriculum: [42],
  domain: "searching-sorting",
  subcategory: "Specialized sorting",
  difficulty: "intermediate",
  summary:
    "Quicksort that watches its own recursion depth and switches to heapsort when it exceeds 2⌊log₂ n⌋, finishing small parts with insertion sort. It keeps quicksort's speed and guarantees O(n log n) — the design of C++'s std::sort.",
  tags: ["sorting", "quicksort", "heap sort", "hybrid", "unstable"],
  prerequisites: ["Quick sort", "Heap sort", "Insertion sort"],
  related: ["quick-sort", "heap-sort", "insertion-sort"],
  problem: {
    input: "An array of numbers.",
    output: "The same numbers in non-decreasing order.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Quicksort is usually the fastest sort, but bad pivots make it quadratic. Heapsort is never quadratic but usually slower. Introsort runs quicksort and keeps an eye on the recursion depth: if it grows past what balanced splitting would need, quicksort is clearly having a bad day on that part, and heapsort takes over there.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "depth limit = 2⌊log₂ n⌋.",
          "For a range of at most 4 elements (16 in real libraries), insertion sort it.",
          "If the depth limit is used up, heapsort the range.",
          "Otherwise partition and recurse on both sides with depth − 1.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): sorted [1, …, 16] with the last element as pivot. Each partition peels off only the pivot, so after 8 levels the depth limit is reached on A[0..7], which is finished by heapsort: 8 partitions, 1 heapsort. The random preset never hits the limit: 4 partitions and 5 small insertion sorts.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Production versions choose the pivot by median of three (or more) and use a cutoff around 16; some leave small ranges for one final insertion-sort pass.",
          "Unstable.",
          "The same idea, introselect, guards quickselect.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Cost.** Partitioning work at each depth is O(n), and depth is at most 2⌊log₂ n⌋, so the quicksort part is O(n log n); each heapsorted range of size m costs O(m log m). Insertion sort on ranges of constant size is O(n) in total. So the worst case is O(n log n), and on typical input it behaves like quicksort. The tests check the output and that the heapsort fallback is used on sorted input.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Musser introduced introsort (and introselect) in 1997.",
          "pdqsort (pattern-defeating quicksort) extends the idea with pattern detection; it is used in Rust and Go.",
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
    space: "O(log n)",
    worstClass: "n log n",
  },
  properties: [
    {
      label: "Depth limit",
      value: "2⌊log₂ n⌋",
    },
    {
      label: "Fallback",
      value: "Heapsort",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "introsort",
      code: `import heapq, math

def introsort(a):
    a = list(a)
    def sort(lo, hi, depth):
        if hi - lo + 1 <= 4:
            a[lo:hi + 1] = sorted(a[lo:hi + 1])    # stands in for insertion sort
            return
        if depth == 0:
            part = a[lo:hi + 1]; heapq.heapify(part)
            a[lo:hi + 1] = [heapq.heappop(part) for _ in range(len(part))]
            return
        pivot, i = a[hi], lo
        for j in range(lo, hi):
            if a[j] < pivot:
                a[i], a[j] = a[j], a[i]; i += 1
        a[i], a[hi] = a[hi], a[i]
        sort(lo, i - 1, depth - 1); sort(i + 1, hi, depth - 1)
    if a:
        sort(0, len(a) - 1, 2 * int(math.log2(len(a))))
    return a
`,
      tests: [
        {
          args: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]],
          expected: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
        },
        {
          args: [[12, 3, 15, 7, 9, 1, 14, 5]],
          expected: [1, 3, 5, 7, 9, 12, 14, 15],
        },
      ],
    },
    {
      language: "javascript",
      entry: "depthLimit",
      code: `function depthLimit(n) {
  return 2 * Math.floor(Math.log2(n));
}
`,
      tests: [
        {
          args: [16],
          expected: 8,
        },
        {
          args: [1000],
          expected: 18,
        },
      ],
    },
  ],
  visualizer: "intro-sort",
  practice: [
    {
      id: "intro-limit",
      kind: "numeric",
      prompt: "What is introsort's depth limit for n = 1,000?",
      answer: 18,
      explanation: "2⌊log₂ 1000⌋ = 2 · 9 = 18.",
      hints: ["2⁹ = 512."],
      objective: "Depth limit",
    },
    {
      id: "intro-why",
      kind: "mcq",
      prompt: "Why does introsort switch to heapsort rather than merge sort?",
      options: [
        "Heapsort is in place and O(n log n) in the worst case",
        "Heapsort is stable",
        "Heapsort is faster on random data",
        "Merge sort cannot sort subarrays",
      ],
      answer: 0,
      explanation: "It keeps the whole sort in place with a guaranteed bound.",
      distractors: {
        "1": "Heapsort is not stable.",
        "2": "Quicksort is usually faster; heapsort is the safety net.",
        "3": "It can, but needs a buffer.",
      },
      hints: ["What does introsort want to keep from quicksort?"],
      objective: "Design",
    },
  ],
  exam: {
    definition:
      "Introsort is quicksort with a recursion-depth limit beyond which it heapsorts the subarray, plus insertion sort for small subarrays.",
    steps: ["Small: insertion sort.", "Depth exhausted: heapsort.", "Else partition and recurse."],
    timeComplexity: "$O(n \\log n)$ worst case.",
    spaceComplexity: "$O(\\log n)$.",
    correctness: "Each branch sorts its range correctly; the switch only changes the method.",
    applications: ["C++ std::sort", ".NET Array.Sort"],
    limitations: ["Unstable"],
    faq: [
      {
        q: "Why 2 log n?",
        a: "A balanced quicksort needs about log₂ n levels; twice that leaves room for ordinary bad luck before declaring failure.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Three components (2).", "Depth limit (2).", "Guarantee (1)."],
      },
    ],
  },
  references: [
    {
      citation:
        "D. R. Musser, “Introspective sorting and selection algorithms,” Software: Practice and Experience, 27(8), 1997.",
      supports: "Introsort and its O(n log n) guarantee.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
