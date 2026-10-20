import type { AlgorithmEntry } from "../types";

export const selectionSortEntry: AlgorithmEntry = {
  slug: "selection-sort",
  name: "Selection Sort",
  aliases: ["Straight selection"],
  curriculum: [17],
  domain: "searching-sorting",
  subcategory: "Elementary sorting",
  difficulty: "beginner",
  summary:
    "Repeatedly selects the smallest remaining element and swaps it into the next position: always n(n−1)/2 comparisons, at most n−1 swaps.",
  tags: ["sorting", "comparison sort", "in-place", "unstable", "quadratic", "few swaps"],
  prerequisites: ["Arrays and indexing", "Nested loops"],
  related: ["bubble-sort", "insertion-sort", "heap-sort"],
  problem: {
    input: "An array $A$ of $n$ comparable elements.",
    output: "The same elements in non-decreasing order.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "To line people up by height, find the shortest person and send them to the front. Then find the shortest of those left and put them second, and so on. Each round fixes one position for good.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "For $i = 0, \\dots, n-2$: scan $A[i..n-1]$ for the index of its minimum.",
          "Swap that minimum into position $i$. Positions $0..i$ are now final.",
        ],
      },
      { kind: "heading", text: "Worked example: [64, 25, 12, 22, 11]" },
      {
        kind: "table",
        head: ["i", "Minimum of A[i..]", "Swap", "Array afterwards"],
        rows: [
          ["0", "11 (index 4)", "A[0] ↔ A[4]", "[11, 25, 12, 22, 64]"],
          ["1", "12 (index 2)", "A[1] ↔ A[2]", "[11, 12, 25, 22, 64]"],
          ["2", "22 (index 3)", "A[2] ↔ A[3]", "[11, 12, 22, 25, 64]"],
          ["3", "25 (index 3)", "none", "[11, 12, 22, 25, 64]"],
        ],
      },
      { kind: "p", text: "That is $4 + 3 + 2 + 1 = 10$ comparisons and 3 swaps." },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Track the **index** of the minimum, not its value, so you know where to swap from.",
          "Skipping the swap when the minimum is already in place saves writes but changes nothing else.",
          "Selection sort is **not stable**: in [4a, 2, 4b, 1], the first swap sends 4a past 4b.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Finding the minimum of $n - i$ elements takes $n - i - 1$ comparisons, regardless of the data, so",
      },
      {
        kind: "math",
        tex: "C(n) = \\sum_{i=0}^{n-2} (n-1-i) = \\frac{n(n-1)}{2} \\quad\\text{in every case, and at most } n-1 \\text{ swaps.}",
      },
      {
        kind: "p",
        text: "**Invariant:** before iteration $i$, $A[0..i-1]$ holds the $i$ smallest elements in sorted order. Swapping the minimum of the rest into position $i$ extends it.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**Few writes.** At most $n - 1$ swaps makes selection sort a reasonable choice when writing is far more expensive than reading (some flash memory).",
          "**Heap sort is selection sort with a better data structure:** it finds each maximum in $O(\\log n)$ with a heap instead of $O(n)$ by scanning.",
          "**Double selection sort** finds the minimum and maximum in the same pass.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "\\Theta(n^2)", average: "\\Theta(n^2)", worst: "\\Theta(n^2)" },
    space: "\\Theta(1)",
    worstClass: "n^2",
    note: "Exactly $n(n-1)/2$ comparisons on every input; at most $n-1$ swaps.",
  },
  properties: [
    { label: "Stable", value: "No" },
    { label: "In place", value: "Yes" },
    { label: "Swaps", value: "At most $n - 1$" },
    { label: "Adaptive", value: "No" },
  ],
  implementations: [
    {
      language: "python",
      entry: "selection_sort",
      code: `def selection_sort(a):
    """Sort list a in place in ascending order and return it."""
    n = len(a)
    for i in range(n - 1):
        m = i
        for j in range(i + 1, n):
            if a[j] < a[m]:
                m = j
        if m != i:
            a[i], a[m] = a[m], a[i]
    return a
`,
      tests: [
        { args: [[64, 25, 12, 22, 11]], expected: [11, 12, 22, 25, 64] },
        { args: [[]], expected: [] },
        { args: [[4, 2, 4, 1]], expected: [1, 2, 4, 4] },
      ],
    },
    {
      language: "javascript",
      entry: "selectionSort",
      code: `function selectionSort(a) {
  for (let i = 0; i < a.length - 1; i++) {
    let m = i;
    for (let j = i + 1; j < a.length; j++) if (a[j] < a[m]) m = j;
    if (m !== i) [a[i], a[m]] = [a[m], a[i]];
  }
  return a;
}
`,
      tests: [{ args: [[3, 1, 2]], expected: [1, 2, 3] }],
    },
  ],
  visualizer: "selection-sort",
  practice: [
    {
      id: "selection-comparisons",
      kind: "numeric",
      prompt:
        "How many comparisons does selection sort make on an already sorted array of 8 elements?",
      answer: 28,
      explanation:
        "Always $n(n-1)/2 = 8 \\cdot 7 / 2 = 28$: finding each minimum scans the whole remainder even when the data is sorted.",
      hints: ["Does the scan for the minimum ever stop early?"],
      objective: "Count comparisons",
    },
    {
      id: "selection-stable",
      kind: "mcq",
      prompt:
        "Sorting [4a, 2, 4b, 1] with selection sort, where 4a and 4b are equal keys. What is the result?",
      options: ["[1, 2, 4b, 4a]", "[1, 2, 4a, 4b]", "[2, 1, 4a, 4b]", "[1, 4a, 2, 4b]"],
      answer: 0,
      explanation:
        "The first swap exchanges 4a (index 0) with 1 (index 3): [1, 2, 4b, 4a]. Nothing moves after that, so 4b now precedes 4a. Selection sort is not stable.",
      distractors: {
        1: "That would be the stable order, which selection sort does not guarantee.",
        2: "The output is sorted.",
        3: "The output is sorted.",
      },
      hints: ["Perform the first swap carefully."],
      objective: "Recognise instability",
    },
  ],
  exam: {
    definition:
      "Selection sort sorts in place by repeatedly selecting the minimum of the unsorted part and swapping it to the end of the sorted part.",
    steps: [
      "For $i = 0$ to $n-2$: find $m$, the index of the minimum of $A[i..n-1]$.",
      "Swap $A[i]$ and $A[m]$.",
    ],
    timeComplexity: "$\\Theta(n^2)$ in all cases: exactly $n(n-1)/2$ comparisons.",
    spaceComplexity: "$\\Theta(1)$.",
    correctness:
      "Invariant: $A[0..i-1]$ holds the $i$ smallest elements in order; each iteration adds the next smallest.",
    applications: ["Small arrays", "Settings where writes are much more expensive than reads"],
    limitations: ["Quadratic even on sorted input", "Not stable"],
    faq: [
      {
        q: "Selection or insertion sort?",
        a: "Insertion sort is adaptive and stable; selection sort makes fewer swaps.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Select the minimum of the unsorted part, swap it into place.",
          "$\\Theta(n^2)$, in place, not stable, ≤ $n-1$ swaps.",
        ],
      },
      {
        marks: 5,
        outline: [
          "Definition (1).",
          "Pseudocode (2).",
          "Trace on 5 elements (1).",
          "Comparison and swap counts (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "D. E. Knuth, The Art of Computer Programming, Vol. 3: Sorting and Searching, 2nd ed., Addison-Wesley, 1998, §5.2.3.",
      supports: "Sorting by selection and its analysis.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and quantitative claims are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-20",
};
