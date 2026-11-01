import type { AlgorithmEntry } from "../types";

export const coordinateCompressionEntry: AlgorithmEntry = {
  slug: "coordinate-compression",
  name: "Coordinate Compression",
  aliases: ["Value Compression", "Discretization"],
  curriculum: [95],
  domain: "arrays-hashing",
  subcategory: "Further Array Techniques",
  difficulty: "intermediate",
  summary:
    "Maps a set of values to a smaller range [0, k) preserving their relative order, enabling the use of array-indexed data structures on sparse value ranges.",
  tags: ["compression", "discretization", "sorting", "preprocessing"],
  prerequisites: ["Sorting"],
  related: ["segment-tree", "fenwick-tree"],
  problem: {
    input: "An array of n integers, possibly with values up to 10^9.",
    output:
      "A mapping from each value to its rank in [0, k) where k is the number of distinct values.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Many data structures like segment trees or BIT/Fenwick trees are indexed by value. If values are huge (up to 10^9) but few in number (say 10^5), we can sort the distinct values and replace each with its rank. This lets us use an array of size k instead of 10^9.",
      },
      {
        kind: "p",
        text: "The relative order is preserved: if a < b in the original array, rank(a) < rank(b). This is all that matters for problems about inversions, range queries, or order statistics.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Collect all values into a list.",
          "Sort and deduplicate.",
          "Assign rank 0, 1, 2, ... to each unique value.",
          "Replace each original value with its rank.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example**: [100, 3, 100, 50, 3] → sorted unique: [3, 50, 100] → ranks: {3:0, 50:1, 100:2} → compressed: [2, 0, 2, 1, 0].",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "In Python: sorted(set(arr)) then bisect or dict lookup.",
          "In C++: sort, unique, erase, then lower_bound.",
          "Time is dominated by sorting: O(n log n).",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Time**: O(n log n) for sorting. **Space**: O(n) for the mapping.",
      },
      {
        kind: "p",
        text: "The compressed values are in [0, k) where k <= n, enabling O(k)-sized data structures.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Used as preprocessing for offline segment tree / BIT problems with large value ranges.",
          "In computational geometry, coordinate compression reduces the grid size for sweep line algorithms.",
          "Can be combined with persistent data structures for online rank queries.",
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
    note: "Dominated by the sort step.",
  },
  properties: [
    {
      label: "Order preserved",
      value: "Yes",
    },
    {
      label: "Output range",
      value: "[0, k) where k = distinct count",
    },
    {
      label: "Reversible",
      value: "Yes, with the mapping",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "compress",
      code: `def compress(arr):
    """Return compressed array with values replaced by their ranks."""
    sorted_unique = sorted(set(arr))
    rank = {v: i for i, v in enumerate(sorted_unique)}
    return [rank[x] for x in arr]
`,
      tests: [
        {
          args: [[100, 3, 100, 50, 3]],
          expected: [2, 0, 2, 1, 0],
        },
        {
          args: [[5, 5, 5]],
          expected: [0, 0, 0],
        },
        {
          args: [[3, 1, 2]],
          expected: [2, 0, 1],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "cc-size",
      kind: "numeric",
      prompt:
        "After coordinate compression of [1000000, 5, 1000000, 7, 5, 42], what is the largest compressed value?",
      answer: 3,
      explanation:
        "There are 4 distinct values: {5, 7, 42, 1000000}, so ranks are 0, 1, 2, 3. The largest is 3.",
      hints: ["How many distinct values are there?"],
      objective: "Apply coordinate compression",
    },
  ],
  exam: {
    definition:
      "Coordinate compression maps sparse values to a dense range [0, k) preserving relative order, enabling array-indexed data structures.",
    steps: ["Collect values", "Sort and deduplicate", "Assign ranks", "Replace values with ranks"],
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    correctness: "Sorting preserves relative order; ranks form a bijection on distinct values.",
    applications: [
      "Segment tree on large value ranges",
      "Sweep line algorithms",
      "Inversion counting",
    ],
    limitations: ["Only preserves order, not distances"],
    faq: [
      {
        q: "When is it needed?",
        a: "When values are too large for direct array indexing but their count is manageable.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Sort-and-rank technique for dense indexing (2)"],
      },
    ],
  },
  references: [
    {
      citation: "S. Halim and F. Halim, Competitive Programming, 3rd ed., 2013, §2.2.",
      supports: "Coordinate compression as a competitive programming technique.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
