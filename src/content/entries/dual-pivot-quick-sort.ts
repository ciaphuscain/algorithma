import type { AlgorithmEntry } from "../types";

export const dualPivotQuickSortEntry: AlgorithmEntry = {
  slug: "dual-pivot-quick-sort",
  name: "Dual-Pivot Quicksort",
  aliases: ["Yaroslavskiy's quicksort"],
  curriculum: [30],
  domain: "searching-sorting",
  subcategory: "Divide-and-conquer sorting",
  difficulty: "advanced",
  summary:
    "Quicksort with two pivots p ≤ q, splitting the array into three parts — below p, between, above q — in one scan. Introduced by Yaroslavskiy and adopted for Java's primitive-array sort in Java 7; it makes slightly fewer comparisons than classic quicksort on average.",
  tags: ["sorting", "quicksort", "partitioning", "divide and conquer", "unstable"],
  prerequisites: ["Quick sort"],
  related: ["quick-sort", "three-way-quick-sort"],
  problem: {
    input: "An array of numbers.",
    output: "The same numbers in non-decreasing order.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "One pivot splits the array in two; two pivots split it in three, so the recursion is shallower. The partitioning scan keeps three regions growing — small values on the left, large on the right, middle values in between — with one pointer each.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Take p = A[lo] and q = A[hi], swapping them if p > q.",
          "Scan k from lo + 1 to g: values < p swap into the left region (l grows); values > q swap with A[g] from the right (g shrinks), after skipping values at g that are already > q.",
          "Swap the pivots into positions l and g; recurse on the three parts.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the fifth preset): [24, 8, 42, 75, 29, 77, 38, 57, 13, 3]. The pivots are 3 and 24 (swapped into order); the first partition leaves [3] [8 13] [24] and the rest above 24. Four partitions sort the array with 26 comparisons and 7 swaps.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Java's actual implementation chooses the pivots from five sample elements, switches to insertion sort for small parts, and has a special path for many equal keys.",
          "Unstable, like classic quicksort.",
          "Sorted input with end pivots is still quadratic; sampling the pivots avoids it.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Cost.** On random input, Wild and Nebel (2012) showed Yaroslavskiy's algorithm makes about $1.9\\, n \\ln n$ comparisons on average, against $2\\, n \\ln n$ for classic quicksort, at the price of more swaps; later work attributed much of its practical speed to fewer cache misses. The worst case is O(n²). The tests check the output on random arrays with duplicates.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Multi-pivot quicksort with three or more pivots has also been studied; the gains shrink as pivots are added.",
          "Java uses dual-pivot quicksort for primitives but a stable merge-based sort (Timsort) for objects.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n²)",
    },
    space: "O(log n) stack on average",
    worstClass: "n^2",
  },
  properties: [
    {
      label: "Pivots",
      value: "Two, p ≤ q",
    },
    {
      label: "Parts",
      value: "< p, between, > q",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "dual_pivot",
      code: `def dual_pivot(a, lo=0, hi=None):
    if hi is None:
        a = list(a); hi = len(a) - 1
    if lo >= hi:
        return a
    if a[lo] > a[hi]:
        a[lo], a[hi] = a[hi], a[lo]
    p, q = a[lo], a[hi]
    l = k = lo + 1
    g = hi - 1
    while k <= g:
        if a[k] < p:
            a[k], a[l] = a[l], a[k]; l += 1
        elif a[k] > q:
            while a[g] > q and k < g:
                g -= 1
            a[k], a[g] = a[g], a[k]; g -= 1
            if a[k] < p:
                a[k], a[l] = a[l], a[k]; l += 1
        k += 1
    l -= 1; g += 1
    a[lo], a[l] = a[l], a[lo]
    a[hi], a[g] = a[g], a[hi]
    dual_pivot(a, lo, l - 1); dual_pivot(a, l + 1, g - 1); dual_pivot(a, g + 1, hi)
    return a
`,
      tests: [
        {
          args: [[24, 8, 42, 75, 29, 77, 38, 57, 13, 3]],
          expected: [3, 8, 13, 24, 29, 38, 42, 57, 75, 77],
        },
        {
          args: [[4, 9, 4, 4, 1, 9, 4, 1, 4, 9]],
          expected: [1, 1, 4, 4, 4, 4, 4, 9, 9, 9],
        },
      ],
    },
    {
      language: "javascript",
      entry: "threeParts",
      code: `// Sizes of the three parts after one dual-pivot partition with pivots p <= q.
function threeParts(a, p, q) {
  return [a.filter((x) => x < p).length, a.filter((x) => x >= p && x <= q).length, a.filter((x) => x > q).length];
}
`,
      tests: [
        {
          args: [[8, 42, 75, 29, 77, 38, 57, 13], 3, 24],
          expected: [0, 2, 6],
        },
      ],
    },
  ],
  visualizer: "dual-pivot-quick-sort",
  practice: [
    {
      id: "dp-parts",
      kind: "mcq",
      prompt: "After one dual-pivot partition with pivots p ≤ q, where are values equal to p?",
      options: [
        "In the middle part (between p and q)",
        "In the left part",
        "In the right part",
        "They are discarded",
      ],
      answer: 0,
      explanation: "Only values strictly below p go left; p ≤ x ≤ q stays in the middle.",
      distractors: {
        "1": "The left part is for x < p.",
        "2": "The right part is for x > q.",
        "3": "Nothing is discarded.",
      },
      hints: ["Read the comparison in the scan."],
      objective: "Partition",
    },
    {
      id: "dp-java",
      kind: "mcq",
      prompt: "Which Java arrays are sorted with dual-pivot quicksort?",
      options: [
        "Arrays of primitives (int[], double[], …)",
        "Arrays of objects",
        "Linked lists",
        "None",
      ],
      answer: 0,
      explanation: "Objects need a stable sort, so Java uses Timsort for them.",
      distractors: {
        "1": "Object sorts must be stable.",
        "2": "Lists are copied to arrays and sorted with the object sort.",
        "3": "Java 7 adopted it for primitives.",
      },
      hints: ["Which sort must be stable?"],
      objective: "Context",
    },
  ],
  exam: {
    definition:
      "Dual-pivot quicksort partitions around two pivots into three parts and recurses on each.",
    steps: ["Choose p ≤ q.", "Three-region scan.", "Place pivots; recurse on three parts."],
    timeComplexity: "O(n log n) average (≈ 1.9 n ln n comparisons); O(n²) worst.",
    spaceComplexity: "$O(\\log n)$ expected stack.",
    correctness: "After partitioning, every value is on the correct side of each pivot.",
    applications: ["Java's Arrays.sort for primitives"],
    limitations: ["Unstable", "Quadratic worst case without pivot sampling"],
    faq: [
      {
        q: "Why is it faster in practice?",
        a: "Fewer comparisons on average and, by later analyses, better memory behaviour; the extra swaps cost less on modern hardware.",
      },
    ],
    answers: [
      {
        marks: 10,
        outline: [
          "Pivot choice (2).",
          "Partition scan (4).",
          "Recursion and complexity (2).",
          "Comparison with classic quicksort (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "S. Wild, M. E. Nebel, “Average case analysis of Java 7's dual pivot quicksort,” Proceedings of the European Symposium on Algorithms (ESA), 2012.",
      supports: "The 1.9 n ln n average comparison count and the swap count.",
    },
    {
      citation:
        "V. Yaroslavskiy, “Dual-pivot quicksort,” proposal to the OpenJDK core-libs mailing list, 2009.",
      supports: "The algorithm adopted in Java 7.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
