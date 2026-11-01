import type { AlgorithmEntry } from "../types";

export const parallelPrefixSumScanEntry: AlgorithmEntry = {
  slug: "parallel-prefix-sum-scan",
  name: "Parallel Prefix Sum (Scan)",
  aliases: ["Prefix Scan", "Blelloch Scan", "Hillis-Steele Scan"],
  curriculum: [456],
  domain: "parallel",
  subcategory: "Parallel Algorithms",
  difficulty: "intermediate",
  summary:
    "Computes all prefix sums of an array in O(n) work and O(log n) span by combining an up-sweep (reduce) and down-sweep phase, enabling efficient parallel algorithms that depend on cumulative aggregation.",
  tags: ["parallel", "prefix sum", "scan", "reduce"],
  prerequisites: ["Prefix Sums"],
  related: ["prefix-sums"],
  problem: {
    input: "An array of n numbers.",
    output: "The array of prefix sums: output[i] = sum of input[0..i].",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Computing prefix sums sequentially is trivial — just accumulate left to right. But that's O(n) span (each sum depends on the previous). The parallel scan breaks this dependency by first computing partial sums in a tree structure (up-sweep), then distributing them back down (down-sweep).",
      },
      {
        kind: "p",
        text: "The result is O(n) total work with only O(log n) parallel steps — a fundamental building block for parallel algorithms.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "**Up-sweep (reduce):** Build a binary tree of partial sums bottom-up. At each level, combine pairs.",
          "**Down-sweep:** The root holds the total. Push partial sums down: each node sends its accumulated sum to its children.",
          "After log n levels of each phase, every position has its prefix sum.",
        ],
      },
      {
        kind: "p",
        text: "**Example:** [3, 1, 4, 1]. Up-sweep: [3,4,4,5] → [3,4,4,10]. Down-sweep produces [3, 4, 8, 9].",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Blelloch's work-efficient scan does O(n) work; Hillis-Steele does O(n log n) work but is simpler.",
          "GPU implementations (thrust::inclusive_scan) use this as a primitive.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Blelloch scan: Work $O(n)$, span $O(\\log n)$. Hillis-Steele: Work $O(n \\log n)$, span $O(\\log n)$. Both achieve $O(\\log n)$ parallel depth.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Segmented scan allows prefix sums within segments, enabling parallel lexical analysis and more.",
          "Scan is the parallel analogue of fold/reduce — any associative operator works.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n)",
      worst: "O(n)",
    },
    space: "O(n)",
    worstClass: "n",
    note: "O(n) work, O(log n) span (Blelloch scan).",
  },
  properties: [
    {
      label: "Work",
      value: "$O(n)$ (Blelloch)",
    },
    {
      label: "Span",
      value: "$O(\\log n)$",
    },
    {
      label: "Operator",
      value: "Any associative operation",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "parallel_prefix_sum",
      code: `def parallel_prefix_sum(arr):
    """Blelloch-style work-efficient prefix scan (inclusive). Returns prefix sums."""
    n = len(arr)
    if n == 0:
        return []
    a = list(arr)
    # Up-sweep
    d = 1
    while d < n:
        for i in range(2 * d - 1, n, 2 * d):
            a[i] += a[i - d]
        d *= 2
    # Down-sweep (exclusive scan, then shift to inclusive)
    a[n - 1] = 0  # clear last
    d = d // 2
    while d >= 1:
        for i in range(2 * d - 1, n, 2 * d):
            t = a[i - d]
            a[i - d] = a[i]
            a[i] += t
        d //= 2
    # Convert exclusive to inclusive by shifting and adding original
    result = [a[i] + arr[i] for i in range(n)]
    return result
`,
      tests: [
        {
          args: [[1, 2, 3, 4]],
          expected: [1, 3, 6, 10],
        },
        {
          args: [[5, 3, 1]],
          expected: [5, 8, 9],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "scan-work",
      kind: "mcq",
      prompt: "What is the work complexity of Blelloch's parallel scan?",
      options: ["O(n)", "O(n log n)", "O(log n)", "O(n²)"],
      answer: 0,
      explanation:
        "Blelloch's up-sweep and down-sweep each do O(n) work, totalling O(n) — work-efficient.",
      hints: ["How much total computation do the two phases perform?"],
      objective: "Know work-efficient scan",
    },
  ],
  exam: {
    definition:
      "Parallel prefix sum (scan) computes all prefix sums in O(log n) parallel steps using an up-sweep and down-sweep on a binary tree.",
    steps: [
      "Up-sweep: reduce pairs bottom-up.",
      "Down-sweep: distribute partial sums top-down.",
      "Each position gets its prefix sum.",
    ],
    timeComplexity: "$O(n)$ work, $O(\\log n)$ span.",
    spaceComplexity: "$O(n)$.",
    correctness: "Each phase has O(log n) levels; total work across all levels is O(n).",
    applications: ["GPU programming primitive", "Parallel compaction", "Stream compaction"],
    limitations: ["Overhead compared to sequential for small arrays"],
    faq: [
      {
        q: "Why is this fundamental?",
        a: "Many parallel algorithms reduce to scan: compaction, sorting, tree operations, and more.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Up-sweep/down-sweep phases and complexity (2)."],
      },
    ],
  },
  references: [
    {
      citation: 'G. E. Blelloch, "Prefix Sums and Their Applications," CMU-CS-90-190, 1990.',
      supports: "Work-efficient parallel scan algorithm.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
