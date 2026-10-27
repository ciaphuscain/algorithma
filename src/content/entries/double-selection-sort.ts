import type { AlgorithmEntry } from "../types";

export const doubleSelectionSortEntry: AlgorithmEntry = {
  slug: "double-selection-sort",
  name: "Double Selection Sort",
  aliases: ["Bidirectional selection sort", "Min-max selection sort"],
  curriculum: [18],
  domain: "searching-sorting",
  subcategory: "Elementary sorting",
  difficulty: "beginner",
  summary:
    "Selection sort that finds both the minimum and the maximum of the unsorted middle in each pass and puts them at the two ends, halving the number of passes. Still O(n²) comparisons.",
  tags: ["sorting", "selection sort", "in-place", "unstable"],
  prerequisites: ["Selection sort"],
  related: ["selection-sort", "bingo-sort", "heap-sort"],
  problem: {
    input: "An array of numbers.",
    output: "The same numbers in non-decreasing order.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Selection sort scans the whole unsorted part just to find its minimum. While scanning, you might as well also note the maximum — then both ends of the unsorted part can be filled in one pass.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "lo = 0, hi = n − 1.",
          "Scan A[lo..hi] for the positions of its minimum and maximum.",
          "Swap the minimum into lo. If the maximum was at lo, it has just moved to the minimum's old position — update it.",
          "Swap the maximum into hi; then lo + 1 and hi − 1.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the fourth preset): [9, 3, 7, 1, 5]. The first scan finds the minimum 1 at 3 and the maximum 9 at 0. Swapping 1 into position 0 moves the 9 to position 3, so the maximum's index must be updated to 3 before swapping it to the end: [1, 3, 7, 5, 9]. The second pass places 3 and 7: sorted after 2 passes, 3 swaps.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "The “maximum was at lo” case is the classic bug: forgetting it puts the wrong value at hi.",
          "Comparisons stay about n²/2: each pass compares every element with both the minimum and the maximum. Comparing elements in pairs first cuts it to about 3n²/8.",
          "Unstable, like selection sort.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Cost.** About n/2 passes; the pass over k elements makes 2(k − 1) comparisons, about $n^2/2$ in total, and at most 2 swaps per pass, so at most $n$ swaps. **Correctness:** after each pass, A[0..lo − 1] holds the smallest values in order and A[hi + 1..] the largest. The tests check the output on random arrays, including duplicates and maxima at the left end.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "It is a folk variant of selection sort rather than a published algorithm; Knuth's selection-sorting section (TAOCP Vol. 3, §5.2.3) covers the underlying method.",
          "Finding the minimum and maximum together needs only ⌈3n/2⌉ − 2 comparisons if elements are compared in pairs first.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n²)",
      average: "O(n²)",
      worst: "O(n²)",
    },
    space: "O(1)",
    worstClass: "n^2",
  },
  properties: [
    {
      label: "Passes",
      value: "About n/2",
    },
    {
      label: "Swaps",
      value: "At most n",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "double_selection_sort",
      code: `def double_selection_sort(a):
    a = list(a)
    lo, hi = 0, len(a) - 1
    while lo < hi:
        mn = mx = lo
        for i in range(lo + 1, hi + 1):
            if a[i] < a[mn]:
                mn = i
            if a[i] > a[mx]:
                mx = i
        a[lo], a[mn] = a[mn], a[lo]
        if mx == lo:
            mx = mn                 # the maximum just moved
        a[hi], a[mx] = a[mx], a[hi]
        lo, hi = lo + 1, hi - 1
    return a
`,
      tests: [
        {
          args: [[9, 3, 7, 1, 5]],
          expected: [1, 3, 5, 7, 9],
        },
        {
          args: [[2, 2, 1, 1]],
          expected: [1, 1, 2, 2],
        },
      ],
    },
    {
      language: "javascript",
      entry: "minMaxComparisons",
      code: `// Comparisons to find both min and max of n values by comparing in pairs: ⌈3n/2⌉ − 2.
function minMaxComparisons(n) {
  return Math.ceil((3 * n) / 2) - 2;
}
`,
      tests: [
        {
          args: [10],
          expected: 13,
        },
        {
          args: [7],
          expected: 9,
        },
      ],
    },
  ],
  visualizer: "double-selection-sort",
  practice: [
    {
      id: "dss-bug",
      kind: "mcq",
      prompt:
        "In [9, 3, 7, 1, 5], the minimum is swapped into position 0 first. Where is the maximum afterwards?",
      options: ["Position 3", "Position 0", "Position 4", "Position 2"],
      answer: 0,
      explanation: "The 9 was at position 0 and was swapped to where the 1 was, position 3.",
      distractors: {
        "1": "That is where the minimum now is.",
        "2": "It has not been moved to the end yet.",
        "3": "Position 2 holds 7.",
      },
      hints: ["Follow the 9 through the swap."],
      objective: "The max-at-lo case",
    },
    {
      id: "dss-passes",
      kind: "numeric",
      prompt: "How many passes does double selection sort make on 11 elements?",
      answer: 5,
      explanation:
        "Each pass fixes two elements: 11 → 9 → 7 → 5 → 3 → 1, so 5 passes; the middle element is then in place.",
      hints: ["Two elements per pass."],
      objective: "Passes",
    },
  ],
  exam: {
    definition:
      "Double selection sort places both the minimum and maximum of the unsorted part in each pass.",
    steps: ["Find min and max.", "Swap min to lo (fix max index if needed).", "Swap max to hi."],
    timeComplexity: "$O(n^2)$.",
    spaceComplexity: "$O(1)$.",
    correctness: "Both ends grow with final values each pass.",
    applications: ["Teaching selection sort"],
    limitations: ["Still quadratic", "Unstable"],
    faq: [
      {
        q: "Does it halve the running time?",
        a: "It halves the passes, but each pass makes twice as many comparisons; the total is about the same.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Algorithm (2).", "Max-at-lo case (2).", "Cost (1)."],
      },
    ],
  },
  references: [
    {
      citation:
        "D. E. Knuth, The Art of Computer Programming, Vol. 3: Sorting and Searching, 2nd ed., Addison-Wesley, 1998, Section 5.2.3.",
      supports: "Sorting by selection, which this variant extends.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
