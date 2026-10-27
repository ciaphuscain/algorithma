import type { AlgorithmEntry } from "../types";

export const binaryInsertionSortEntry: AlgorithmEntry = {
  slug: "binary-insertion-sort",
  name: "Binary Insertion Sort",
  aliases: ["Binary insertion"],
  curriculum: [22],
  domain: "searching-sorting",
  subcategory: "Insertion-based sorting",
  difficulty: "beginner",
  summary:
    "Insertion sort that finds each element's place by binary search: O(n log n) comparisons, but still O(n²) moves to make room. Worth it when comparisons are expensive and moves are cheap.",
  tags: ["sorting", "insertion sort", "binary search", "stable", "in-place"],
  prerequisites: ["Insertion sort", "Binary search"],
  related: ["insertion-sort", "binary-search", "library-sort"],
  problem: {
    input: "An array of numbers.",
    output: "The same numbers in non-decreasing order.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Insertion sort searches the sorted prefix for the new element's place by walking backwards one element at a time. But the prefix is sorted — binary search can find the place in about log₂ i comparisons. The elements after that place still have to shift right to make room, so the saving is in comparisons only.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "For i = 1 … n − 1: key = A[i].",
          "Binary-search A[0..i − 1] for the first position p with A[p] > key (after any equal keys, which keeps the sort stable).",
          "Shift A[p..i − 1] one place right and put key at p.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example.** On reversed input [9, 8, 7, 6, 5, 4, 3, 2] it makes only 17 comparisons — against 28 for plain insertion sort — but still 28 shifts, one per inversion. On sorted input it makes 13 comparisons where plain insertion sort makes 7: binary search does not exploit existing order.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Searching for the first element greater than the key (an upper bound) keeps equal keys in input order.",
          "Use a block move (memmove) for the shift; it is fast on contiguous memory.",
          "Python's bisect.insort does exactly this on a list.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Cost.** Inserting into a prefix of i elements takes at most $\\lceil \\log_2 (i+1) \\rceil$ comparisons, so the total is at most $\\sum_{i=1}^{n-1} \\lceil \\log_2(i+1) \\rceil \\le n \\log_2 n$. Moves equal the number of inversions — $O(n^2)$ in the worst case. The tests check the output, that shifts equal inversions, and the comparison bound.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Knuth (TAOCP Vol. 3, §5.2.1) attributes binary insertion to John Mauchly (1946) and notes it is close to the information-theoretic minimum of comparisons for small n.",
          "Library sort leaves gaps between elements so that the shifts become cheap too.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n log n)",
      average: "O(n²)",
      worst: "O(n²)",
    },
    space: "O(1)",
    worstClass: "n^2",
    note: "O(n log n) comparisons; O(n²) element moves.",
  },
  properties: [
    {
      label: "Comparisons",
      value: "O(n log n)",
    },
    {
      label: "Moves",
      value: "One per inversion",
    },
    {
      label: "Stable",
      value: "Yes",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "binary_insertion_sort",
      code: `from bisect import bisect_right

def binary_insertion_sort(a):
    out = []
    for x in a:
        p = bisect_right(out, x)   # after equal keys: stable
        out.insert(p, x)
    return out
`,
      tests: [
        {
          args: [[5, 1, 4, 2, 8]],
          expected: [1, 2, 4, 5, 8],
        },
        {
          args: [[3, 1, 3, 2, 1, 2]],
          expected: [1, 1, 2, 2, 3, 3],
        },
      ],
    },
    {
      language: "javascript",
      entry: "maxComparisons",
      code: `// Upper bound on binary insertion sort's comparisons for n elements.
function maxComparisons(n) {
  let total = 0;
  for (let i = 1; i < n; i++) total += Math.ceil(Math.log2(i + 1));
  return total;
}
`,
      tests: [
        {
          args: [8],
          expected: 17,
        },
        {
          args: [1],
          expected: 0,
        },
      ],
    },
  ],
  visualizer: "binary-insertion-sort",
  practice: [
    {
      id: "bis-comparisons",
      kind: "numeric",
      prompt:
        "Binary search inserts an element into a sorted prefix of 15 elements. At most how many comparisons does it need?",
      answer: 4,
      explanation: "⌈log₂ 16⌉ = 4.",
      hints: ["There are 16 possible positions."],
      objective: "Search cost",
    },
    {
      id: "bis-limit",
      kind: "mcq",
      prompt: "Why is binary insertion sort still O(n²) in the worst case?",
      options: [
        "Making room still shifts up to i elements per insertion",
        "Binary search takes linear time",
        "It compares every pair",
        "It is not stable",
      ],
      answer: 0,
      explanation: "Comparisons drop to O(n log n), but the moves remain one per inversion.",
      distractors: {
        "1": "Binary search is logarithmic.",
        "2": "It makes O(n log n) comparisons.",
        "3": "Stability does not affect running time.",
      },
      hints: ["What happens after the position is found?"],
      objective: "Moves vs comparisons",
    },
  ],
  exam: {
    definition:
      "Binary insertion sort inserts each element into the sorted prefix at a position found by binary search.",
    steps: ["Binary search for the position.", "Shift the larger elements right.", "Insert."],
    timeComplexity: "O(n log n) comparisons; O(n²) moves.",
    spaceComplexity: "$O(1)$.",
    correctness: "Same invariant as insertion sort: the prefix is sorted.",
    applications: ["Expensive comparisons (e.g. long strings)", "Small arrays inside hybrid sorts"],
    limitations: ["Quadratic moves", "Does not exploit presortedness"],
    faq: [
      {
        q: "Is it faster than insertion sort on nearly sorted data?",
        a: "No — plain insertion sort makes about n comparisons there; binary search always makes about log i.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Algorithm (2).", "Comparison bound (2).", "Moves remain quadratic (1)."],
      },
    ],
  },
  references: [
    {
      citation:
        "D. E. Knuth, The Art of Computer Programming, Vol. 3: Sorting and Searching, 2nd ed., Addison-Wesley, 1998, Section 5.2.1.",
      supports: "Binary insertion and its comparison count.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
