import type { AlgorithmEntry } from "../types";

export const parallelMergeSortEntry: AlgorithmEntry = {
  slug: "parallel-merge-sort",
  name: "Parallel Merge Sort",
  aliases: ["Parallel Mergesort"],
  curriculum: [457],
  domain: "parallel",
  subcategory: "Parallel Algorithms",
  difficulty: "intermediate",
  summary:
    "Sorts n elements by recursively dividing the array and sorting halves in parallel, then merging the sorted halves, achieving O(n log n / p) time with p processors and O(log² n) or O(log n) span.",
  tags: ["parallel", "sorting", "merge sort", "divide and conquer"],
  prerequisites: ["Merge Sort"],
  related: ["merge-sort", "parallel-quicksort"],
  problem: {
    input: "An array of n elements and p processors.",
    output: "The sorted array, computed in parallel.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Merge sort naturally parallelises: the two recursive calls are independent, so they can run on different processors. The merge step is the bottleneck, but it too can be parallelised using binary search to split the merge into independent pieces.",
      },
      {
        kind: "p",
        text: "With parallel recursion and parallel merge, the algorithm achieves O(log² n) span — far less than the O(n log n) sequential time.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Divide the array in half.",
          "Sort both halves in parallel (recursive calls on different processors).",
          "Merge the two sorted halves. To parallelise the merge: pick the median of one half, binary-search for it in the other, and merge the two resulting subproblems in parallel.",
        ],
      },
      {
        kind: "p",
        text: "**Example:** [4,2,3,1]. Split into [4,2] and [3,1]. Sort in parallel → [2,4] and [1,3]. Merge → [1,2,3,4].",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Practical implementations switch to sequential sort for small subarrays.",
          "The parallel merge uses O(log n) binary searches, each O(log n), giving O(log n) merge span.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Work: $O(n \\log n)$. Span with parallel merge: $T_\\infty = O(\\log^2 n)$ (or $O(\\log n)$ with a more sophisticated merge). Parallelism: $O(n / \\log n)$.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Cole's merge sort achieves O(log n) span via pipelining.",
          "Sample sort and bitonic sort are alternatives with different trade-offs.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n log n / p)",
      average: "O(n log n / p)",
      worst: "O(n log n / p)",
    },
    space: "O(n)",
    worstClass: "n log n",
    note: "Span is O(log² n) with parallel merge.",
  },
  properties: [
    {
      label: "Work",
      value: "$O(n \\log n)$",
    },
    {
      label: "Span",
      value: "$O(\\log^2 n)$",
    },
    {
      label: "Stable",
      value: "Yes",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "parallel_merge_sort",
      code: `def parallel_merge_sort(arr):
    """Simulated parallel merge sort. Returns sorted list."""
    if len(arr) <= 1:
        return list(arr)
    mid = len(arr) // 2
    left = parallel_merge_sort(arr[:mid])
    right = parallel_merge_sort(arr[mid:])
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result
`,
      tests: [
        {
          args: [[4, 2, 3, 1]],
          expected: [1, 2, 3, 4],
        },
        {
          args: [[5, 1, 4, 2, 8]],
          expected: [1, 2, 4, 5, 8],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "pms-bottleneck",
      kind: "mcq",
      prompt: "What is the bottleneck in parallelising merge sort?",
      options: ["The merge step", "The divide step", "Memory allocation", "Comparison count"],
      answer: 0,
      explanation:
        "The recursive sorts are independent, but the merge step processes elements sequentially unless it too is parallelised.",
      hints: ["Which step of merge sort is hardest to parallelise?"],
      objective: "Identify the parallel bottleneck",
    },
  ],
  exam: {
    definition:
      "Parallel merge sort sorts both halves concurrently and parallelises the merge via binary-search splitting.",
    steps: [
      "Divide in half.",
      "Sort halves in parallel.",
      "Parallel merge using median + binary search.",
    ],
    timeComplexity: "$O(n \\log n / p)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "Work is O(n log n); span is O(log² n) with parallel merge.",
    applications: ["Large-scale sorting", "External sorting"],
    limitations: ["Parallel merge adds complexity"],
    faq: [
      {
        q: "Why O(log² n) span?",
        a: "log n levels of recursion, each with a parallel merge of O(log n) span.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Parallel recursion and merge analysis (2)."],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 3rd ed., MIT Press, 2009, §27.3.",
      supports: "Parallel merge sort analysis.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
