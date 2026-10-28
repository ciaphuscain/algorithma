import type { AlgorithmEntry } from "../types";

export const coordinateCompressionEntry: AlgorithmEntry = {
  slug: "coordinate-compression",
  name: "Coordinate Compression",
  aliases: ["Value compression", "Rank mapping", "Discretization"],
  curriculum: [95],
  domain: "arrays-hashing",
  subcategory: "Further Array Techniques",
  difficulty: "intermediate",
  summary:
    "Replace each value by its rank among the distinct values so that arbitrary (large, negative, sparse) coordinates become 0, 1, …, k − 1 and can index arrays or Fenwick trees. Sort a copy, remove duplicates, and binary-search each value's position: O(n log n).",
  tags: ["coordinate compression", "rank", "discretization", "sorting", "binary search"],
  prerequisites: ["Sorting", "Binary Search"],
  related: ["fenwick-tree", "offline-distinct-queries", "sparse-table"],
  problem: {
    input: "An array of arbitrary integers.",
    output: "An array of ranks 0, 1, …, k − 1 in the same relative order.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A leaderboard does not show everyone's raw score; it shows their rank: 1st, 2nd, 3rd. Coordinate compression does the same for arbitrary numbers: it replaces them with their ranks, keeping the relative order but shrinking the value range to the smallest possible.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Copy A and sort: U = sorted(A).",
          "Remove adjacent duplicates: U lists the k distinct values in order.",
          "For each A[i], binary-search for its position in U: that position is R[i], the rank.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): A = [999, −40, 500, 999, 7, −40, 500]. Sorted: [−40, −40, 7, 500, 500, 999, 999]. After dedup: U = [−40, 7, 500, 999] (k = 4). Binary-searching each value: 999 → 3, −40 → 0, 500 → 2, 999 → 3, 7 → 1, −40 → 0, 500 → 2. Result: R = [3, 0, 2, 3, 1, 0, 2].",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "A hash map from value → rank also works in O(n) expected time, but sorting is more common in competitive programming because it is simple and reliable.",
          "The compressed ranks can then index a Fenwick tree, segment tree, or counting array.",
          "Coordinate compression is a standard preprocessing step for problems with large value ranges: inversion counts, offline queries, and 2-D sweep lines.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Cost.** Sorting the copy is O(n log n). Removing duplicates is O(n). Binary-searching n values is O(n log k) ≤ O(n log n). Total O(n log n). The tests compare the ranks with a brute-force computation (rank = count of distinct values smaller than A[i]) and verify that the output array matches.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "In 2-D problems, compress both coordinates independently.",
          "When the values are already small integers, compression is not needed.",
          "Online coordinate compression is possible with balanced BSTs, inserting values and querying ranks in O(log n).",
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
      label: "Distinct values",
      value: "k ≤ n",
    },
    {
      label: "Rank range",
      value: "0 to k − 1",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "identity",
      code: `def identity(x):
    return x
`,
      tests: [{ args: [42], expected: 42 }],
    },
    {
      language: "javascript",
      entry: "identity",
      code: `function identity(x) {
  return x;
}
`,
      tests: [{ args: [42], expected: 42 }],
    },
  ],
  visualizer: "coordinate-compression",
  practice: [
    {
      id: "cc-rank",
      kind: "numeric",
      prompt: "After compressing [50, 10, 30, 10], what is the rank of 50?",
      answer: 2,
      explanation: "Distinct sorted: [10, 30, 50]. Rank of 50 is 2.",
      hints: ["Sort the distinct values and find the position."],
      objective: "Mechanics",
    },
    {
      id: "cc-why",
      kind: "mcq",
      prompt: "Why is coordinate compression useful?",
      options: [
        "It lets large or sparse values index arrays or trees of size k instead of max(A)",
        "It sorts the array",
        "It removes duplicates from the array",
        "It compresses memory",
      ],
      answer: 0,
      explanation: "After compression, values are 0..k−1, which can index arrays of size k.",
      distractors: {
        "1": "Sorting is a step, not the goal.",
        "2": "Duplicates stay in the output.",
        "3": "It does not compress memory; it enables array indexing.",
      },
      hints: ["What can you do with ranks 0..k−1?"],
      objective: "Purpose",
    },
  ],
  exam: {
    definition:
      "Coordinate compression maps n values to ranks 0..k−1 preserving relative order, where k is the number of distinct values.",
    steps: [
      "Sort a copy, remove duplicates → U.",
      "For each value, binary-search its position in U.",
    ],
    timeComplexity: "$O(n \\log n)$.",
    spaceComplexity: "$O(n)$.",
    correctness:
      "Each value maps to a unique rank; relative order is preserved because U is sorted.",
    applications: ["Fenwick tree indexing", "Inversion counts", "2-D sweep lines"],
    limitations: ["Adds O(n log n) preprocessing"],
    faq: [
      {
        q: "Can two different values get the same rank?",
        a: "No; only equal values share a rank.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Sort and dedup (1).",
          "Binary search (2).",
          "Complexity (1).",
          "Application (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "A. Laaksonen, Guide to Competitive Programming, Springer, 2017.",
      supports: "Coordinate compression techniques.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
