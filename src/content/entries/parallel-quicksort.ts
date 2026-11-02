import type { AlgorithmEntry } from "../types";

export const parallelQuicksortEntry: AlgorithmEntry = {
  slug: "parallel-quicksort",
  name: "Parallel QuickSort",
  aliases: ["Parallel Quicksort"],
  curriculum: [458],
  domain: "parallel",
  subcategory: "Parallel Algorithms",
  difficulty: "intermediate",
  summary:
    "Parallelises quicksort by partitioning using parallel prefix sum, then recursing on the two partitions concurrently, achieving O(n log n / p) expected time.",
  tags: ["parallel", "sorting", "quicksort", "partition"],
  prerequisites: ["Quick Sort", "Parallel Prefix Sum (Scan)"],
  related: ["quick-sort", "parallel-merge-sort"],
  problem: {
    input: "An array of n elements and p processors.",
    output: "The sorted array, computed in parallel.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Quicksort's partition step splits an array into elements less than and greater than a pivot. Both halves are then independent — perfect for parallelism. The partition itself can be parallelised using a prefix sum to compute where each element goes.",
      },
      {
        kind: "p",
        text: "With a good pivot (median-of-three or random), the recursion depth is O(log n) and each level does O(n) work in parallel.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Choose a pivot (randomly or median-of-three).",
          "In parallel, compare each element to the pivot; mark as 'less' or 'greater'.",
          "Use parallel prefix sum on the marks to compute destination indices.",
          "Move elements to their destinations in parallel.",
          "Recurse on both partitions concurrently.",
        ],
      },
      {
        kind: "p",
        text: "**Example:** [5,1,4,2,3], pivot=3. Mark: [G,L,G,L,L]. Prefix sums give positions. Result: [1,2,3] and [5,4].",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Practical implementations switch to sequential sort for small subarrays.",
          "Sample sort generalises by picking multiple pivots to create more partitions.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Expected work: $O(n \\log n)$. Expected span: $O(\\log^2 n)$ — $O(\\log n)$ recursion levels, each with $O(\\log n)$ span for the parallel partition via prefix sum.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Hyperquicksort distributes data across processors by pivoting at each level of a hypercube network.",
          "Sample sort with p−1 pivots creates p buckets, achieving better load balance.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n log n / p)",
      average: "O(n log n / p)",
      worst: "O(n² / p)",
    },
    space: "O(n)",
    worstClass: "n log n",
    note: "Expected span O(log² n). Worst case O(n) span with bad pivots.",
  },
  properties: [
    {
      label: "Expected work",
      value: "$O(n \\log n)$",
    },
    {
      label: "Expected span",
      value: "$O(\\log^2 n)$",
    },
    {
      label: "In-place",
      value: "No (parallel partition needs auxiliary array)",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "parallel_quicksort",
      code: `def parallel_quicksort(arr):
    """Simulated parallel quicksort. Returns sorted list."""
    if len(arr) <= 1:
        return list(arr)
    pivot = arr[len(arr) // 2]
    less = [x for x in arr if x < pivot]
    equal = [x for x in arr if x == pivot]
    greater = [x for x in arr if x > pivot]
    return parallel_quicksort(less) + equal + parallel_quicksort(greater)
`,
      tests: [
        {
          args: [[3, 1, 4, 1, 5, 9, 2, 6]],
          expected: [1, 1, 2, 3, 4, 5, 6, 9],
        },
        {
          args: [[1]],
          expected: [1],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "pqs-partition",
      kind: "mcq",
      prompt: "How is the partition step parallelised in parallel quicksort?",
      options: [
        "Using parallel prefix sum to compute destination indices",
        "By sorting the partition",
        "Using a hash table",
        "By comparing pairs",
      ],
      answer: 0,
      explanation:
        "Each element is marked as less/greater, then prefix sum computes where each element goes in O(log n) span.",
      hints: ["How do you compute output positions from boolean marks?"],
      objective: "Understand parallel partition",
    },
  ],
  exam: {
    definition:
      "Parallel quicksort uses parallel partition (via prefix sum) and concurrent recursion to sort in expected O(log² n) span.",
    steps: [
      "Choose pivot.",
      "Parallel compare and mark.",
      "Prefix sum for positions.",
      "Parallel scatter.",
      "Recurse on both halves.",
    ],
    timeComplexity: "$O(n \\log n / p)$ expected.",
    spaceComplexity: "$O(n)$.",
    correctness: "O(log n) recursion levels each with O(log n) span for parallel partition.",
    applications: ["Parallel sorting in shared memory", "Multicore sorting libraries"],
    limitations: ["Bad pivot choice degrades to O(n) span"],
    faq: [
      {
        q: "Why prefix sum?",
        a: "It computes each element's output position in O(log n) span from the comparison marks.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Parallel partition via prefix sum and span analysis (2)."],
      },
    ],
  },
  references: [
    {
      citation: 'G. E. Blelloch, "Programming Parallel Algorithms," CACM 39(3), 1996.',
      supports: "Parallel quicksort using scan.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
