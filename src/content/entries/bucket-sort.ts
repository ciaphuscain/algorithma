import type { AlgorithmEntry } from "../types";

export const bucketSortEntry: AlgorithmEntry = {
  slug: "bucket-sort",
  name: "Bucket Sort",
  aliases: ["Bin sort"],
  curriculum: [39],
  domain: "searching-sorting",
  subcategory: "Distribution sorting",
  difficulty: "beginner",
  summary:
    "Scatter values into equal-width buckets by their value, sort each small bucket, and concatenate. For uniformly distributed input each bucket holds O(1) values on average, so the expected time is O(n).",
  tags: ["sorting", "distribution", "buckets", "average case", "non-comparison"],
  prerequisites: ["Insertion sort"],
  related: ["counting-sort", "radix-sort", "flash-sort"],
  problem: {
    input: "Whole numbers in [0, 100).",
    output: "The same numbers in non-decreasing order.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Sorting exam papers by mark: put them into piles 0–9, 10–19, …, 90–99, sort each small pile, and stack the piles in order. If the marks are spread evenly, every pile is tiny and almost no sorting is left.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Make k buckets for equal ranges of the values (here k = n, at most 8).",
          "Put each value into bucket ⌊x · k / 100⌋.",
          "Concatenate the buckets in order, insertion-sorting each bucket's stretch.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset, the classic CLRS example scaled to [0, 100)): [78, 17, 39, 26, 72, 94, 21, 12, 23, 68] with 8 buckets of width 12.5. The buckets hold at most 3 values; insertion sort needs only 3 comparisons and 1 swap. The clustered preset puts six of eight values in one bucket and needs 11 comparisons: bucket sort is only as good as the distribution.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "The bucket index must be monotone in the value, or the concatenation is out of order.",
          "Insertion sort is used inside buckets because they are expected to be tiny; for skewed data a better inner sort guards the worst case.",
          "Knowing the value range (or computing min and max first) is required.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Cost.** With n buckets and independent uniform input, the expected bucket-sorting cost is $\\sum_i E[n_i^2] = n(2 - 1/n)$, so the expected total is O(n) (CLRS §8.4). In the worst case all values land in one bucket and insertion sort makes it O(n²). The tests check the output on random arrays.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Counting sort is the special case of one bucket per possible value.",
          "Flashsort and interpolation-based sorts estimate bucket boundaries from the data.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n) for uniform input",
      worst: "O(n²)",
    },
    space: "O(n + k)",
    worstClass: "n^2",
  },
  properties: [
    {
      label: "Buckets",
      value: "Equal-width ranges of values",
    },
    {
      label: "Inner sort",
      value: "Insertion sort",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "bucket_sort",
      code: `def bucket_sort(a, k=None):
    k = k or max(1, len(a))
    buckets = [[] for _ in range(k)]
    for x in a:                       # values in [0, 100)
        buckets[x * k // 100].append(x)
    return [y for b in buckets for y in sorted(b)]
`,
      tests: [
        {
          args: [[78, 17, 39, 26, 72, 94, 21, 12, 23, 68]],
          expected: [12, 17, 21, 23, 26, 39, 68, 72, 78, 94],
        },
      ],
    },
    {
      language: "javascript",
      entry: "bucketSizes",
      code: `// How many values fall into each of k buckets over [0, 100).
function bucketSizes(a, k) {
  const s = new Array(k).fill(0);
  for (const x of a) s[Math.floor((x * k) / 100)]++;
  return s;
}
`,
      tests: [
        {
          args: [[41, 44, 40, 47, 43, 42, 3, 95], 8],
          expected: [1, 0, 0, 6, 0, 0, 0, 1],
        },
      ],
    },
  ],
  visualizer: "bucket-sort",
  practice: [
    {
      id: "bk-index",
      kind: "numeric",
      prompt: "With 10 buckets over [0, 100), which bucket does 57 go to?",
      answer: 5,
      explanation: "⌊57 · 10 / 100⌋ = 5.",
      hints: ["⌊x · k / 100⌋"],
      objective: "Bucket index",
    },
    {
      id: "bk-worst",
      kind: "mcq",
      prompt: "When is bucket sort slow?",
      options: [
        "When most values fall into the same bucket",
        "When the values are uniform",
        "When there are as many buckets as values",
        "When the input is sorted",
      ],
      answer: 0,
      explanation: "Then the inner sort does all the work.",
      distractors: {
        "1": "That is the best case.",
        "2": "That is the standard choice.",
        "3": "Sorted uniform input is fine.",
      },
      hints: ["What does the expected O(n) assume?"],
      objective: "Worst case",
    },
  ],
  exam: {
    definition:
      "Bucket sort distributes values into buckets by range, sorts each bucket and concatenates them.",
    steps: ["Scatter into buckets.", "Sort each bucket.", "Gather in order."],
    timeComplexity: "O(n) expected for uniform input; O(n²) worst.",
    spaceComplexity: "$O(n + k)$.",
    correctness: "Buckets cover increasing ranges, so concatenating sorted buckets is sorted.",
    applications: ["Uniform real-valued data", "Histogram-based sorting"],
    limitations: ["Depends on the distribution", "Needs the value range"],
    faq: [
      {
        q: "Is it a comparison sort?",
        a: "The scattering uses values directly; only the inner sort compares, which is how it beats the n log n lower bound on average.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Procedure (2).", "Expected O(n) under uniformity (2).", "Worst case (1)."],
      },
    ],
  },
  references: [
    {
      citation:
        "T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 3rd ed., MIT Press, 2009, Section 8.4.",
      supports: "Bucket sort and its expected linear time for uniform input.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
