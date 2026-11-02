import type { AlgorithmEntry } from "../types";

export const cocktailShakerSortEntry: AlgorithmEntry = {
  slug: "cocktail-shaker-sort",
  name: "Cocktail Shaker Sort",
  aliases: ["Bidirectional bubble sort", "Shaker sort", "Ripple sort"],
  curriculum: [13],
  domain: "searching-sorting",
  subcategory: "Elementary sorting",
  difficulty: "beginner",
  summary:
    "Bubble sort that alternates left-to-right and right-to-left passes, so small values stuck near the end move to the front in one pass instead of one step per pass. Still O(n²).",
  tags: ["sorting", "bubble sort", "bidirectional", "stable", "in-place"],
  prerequisites: ["Bubble sort"],
  related: ["optimized-bubble-sort", "bubble-sort", "comb-sort"],
  problem: {
    input: "An array of numbers.",
    output: "The same numbers in non-decreasing order.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "In bubble sort big values race to the right (“rabbits”) but small values near the right end crawl left one position per pass (“turtles”). Shaking the other way too — a backward pass that carries the smallest value to the front — fixes the turtles.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Forward pass over A[lo..hi]; everything after its last swap is final, so hi shrinks to that position.",
          "Backward pass over A[lo..hi]; everything before its last swap is final, so lo grows to that position.",
          "Repeat until lo ≥ hi.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the turtle preset): [2, 3, 4, 5, 6, 7, 8, 1]. Everything is in order up to the 1, so the first forward pass makes a single swap, carrying 8 to the end. The backward pass then carries 1 all the way to the front in 6 swaps. A final forward pass confirms the order: 2 rounds, 18 comparisons, 7 swaps. Plain bubble sort needs 7 passes for the same turtle.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Swaps still equal the number of inversions; the saving is in passes and comparisons.",
          "Stable and in place.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Cost.** O(n) on sorted input (one forward pass), O(n²) comparisons and swaps in the worst case; Knuth shows the average remains quadratic. **Correctness:** each forward pass fixes at least the largest remaining value, each backward pass the smallest, so the unsorted window shrinks every round. The tests check the output and that swaps equal inversions.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Knuth (TAOCP Vol. 3, §5.2.2) calls it the cocktail-shaker sort and notes it only slightly improves on bubble sort.",
          "Comb sort attacks turtles differently, with large gaps.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n²)",
      worst: "O(n²)",
    },
    space: "O(1)",
    worstClass: "n^2",
  },
  properties: [
    {
      label: "Stable",
      value: "Yes",
    },
    {
      label: "Passes",
      value: "Alternate directions",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "shaker_sort",
      code: `def shaker_sort(a):
    a = list(a)
    lo, hi = 0, len(a) - 1
    while lo < hi:
        last = lo
        for j in range(lo, hi):
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
                last = j
        hi = last
        first = hi
        for j in range(hi - 1, lo - 1, -1):
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
                first = j + 1
        lo = first
    return a
`,
      tests: [
        {
          args: [[2, 3, 4, 5, 6, 7, 8, 1]],
          expected: [1, 2, 3, 4, 5, 6, 7, 8],
        },
        {
          args: [[5, 1, 4, 2, 8]],
          expected: [1, 2, 4, 5, 8],
        },
      ],
    },
    {
      language: "javascript",
      entry: "bubblePasses",
      code: `// Passes plain bubble sort (with early exit) needs: compare with cocktail shaker sort's rounds.
function bubblePasses(input) {
  const a = [...input];
  let passes = 0, swapped = true;
  while (swapped) {
    swapped = false;
    passes++;
    for (let j = 0; j + 1 < a.length; j++)
      if (a[j] > a[j + 1]) { [a[j], a[j + 1]] = [a[j + 1], a[j]]; swapped = true; }
  }
  return passes;
}
`,
      tests: [
        {
          args: [[2, 3, 4, 5, 6, 7, 8, 1]],
          expected: 8,
        },
      ],
    },
  ],
  visualizer: "cocktail-shaker-sort",
  practice: [
    {
      id: "shaker-turtle",
      kind: "mcq",
      prompt: "Which values does the backward pass help most?",
      options: [
        "Small values near the right end",
        "Large values near the left end",
        "Values already in place",
        "Duplicates",
      ],
      answer: 0,
      explanation: "A backward pass carries the smallest value of the window all the way left.",
      distractors: {
        "1": "Forward passes already move large values quickly.",
        "2": "They are never swapped.",
        "3": "Duplicates are not special.",
      },
      hints: ["Which direction does a small value need to travel?"],
      objective: "Turtles",
    },
    {
      id: "shaker-swaps",
      kind: "numeric",
      prompt: "How many swaps does cocktail shaker sort make on [4, 3, 2, 1]?",
      answer: 6,
      explanation: "Adjacent swaps remove one inversion each; [4, 3, 2, 1] has 6 inversions.",
      hints: ["Count inversions."],
      objective: "Swaps = inversions",
    },
  ],
  exam: {
    definition: "Cocktail shaker sort is bubble sort with alternating forward and backward passes.",
    steps: ["Forward pass; shrink hi.", "Backward pass; grow lo.", "Repeat until they meet."],
    timeComplexity: "$O(n^2)$; $O(n)$ best.",
    spaceComplexity: "$O(1)$.",
    correctness: "Each round fixes the largest and smallest of the window.",
    applications: ["Teaching", "Arrays with a few misplaced small values"],
    limitations: ["Quadratic"],
    faq: [
      {
        q: "Is it faster than bubble sort?",
        a: "By a constant factor at best; the number of swaps is the same.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Two-direction passes (2).", "Turtles (2).", "Complexity (1)."],
      },
    ],
  },
  references: [
    {
      citation:
        "D. E. Knuth, The Art of Computer Programming, Vol. 3: Sorting and Searching, 2nd ed., Addison-Wesley, 1998, Section 5.2.2.",
      supports: "The cocktail-shaker sort.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
