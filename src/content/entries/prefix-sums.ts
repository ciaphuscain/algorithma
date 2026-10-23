import type { AlgorithmEntry } from "../types";

export const prefixSumsEntry: AlgorithmEntry = {
  slug: "prefix-sums",
  name: "Prefix Sums",
  aliases: ["Prefix sum array", "Cumulative sums", "Running totals", "Scan"],
  curriculum: [51],
  domain: "arrays-hashing",
  subcategory: "Array Techniques",
  difficulty: "beginner",
  summary:
    "One pass stores the running total P[i] of the first i elements; afterwards the sum of any range A[l..r] is P[r + 1] − P[l], in constant time.",
  tags: ["prefix sum", "range query", "cumulative", "precomputation"],
  prerequisites: ["Arrays"],
  related: ["fenwick-tree", "segment-tree", "sparse-table", "sliding-window"],
  problem: {
    input:
      "An array $A$ of $n$ numbers that does not change, and many queries “what is $A[l] + \\dots + A[r]$?”.",
    output: "The sum for each query.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A car's odometer answers “how far did I drive between Monday and Thursday?” without replaying the trip: subtract Monday's reading from Thursday's. A prefix-sum array is an odometer for an array: entry $P[i]$ is the total of everything before position $i$.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Set $P[0] = 0$ and $P[i + 1] = P[i] + A[i]$ for $i = 0, \\dots, n - 1$.",
          "The sum of $A[l..r]$ is $P[r + 1] - P[l]$: everything up to $r$, minus everything before $l$.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): $A = [3, 1, 4, 1, 5, 9, 2, 6]$.",
      },
      {
        kind: "table",
        head: ["i", "0", "1", "2", "3", "4", "5", "6", "7", "8"],
        rows: [
          ["A[i]", "3", "1", "4", "1", "5", "9", "2", "6", ""],
          ["P[i]", "0", "3", "4", "8", "9", "14", "23", "25", "31"],
        ],
      },
      {
        kind: "p",
        text: "Sum of $A[2..5]$ = $P[6] - P[2] = 23 - 4 = 19$ (indeed $4 + 1 + 5 + 9$). Sum of the whole array = $P[8] - P[0] = 31$. A single element, $A[6..6]$, is $P[7] - P[6] = 2$.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Make $P$ one longer than $A$ with $P[0] = 0$; the off-by-one disappears from every query.",
          "Watch for overflow: the prefix sums can be $n$ times larger than any element.",
          "If $A$ changes between queries, every later $P$ entry changes too ($O(n)$ per update). Use a Fenwick tree or segment tree instead.",
          "**2-D prefix sums** answer rectangle sums with four lookups (inclusion–exclusion).",
          "The reverse operation is the **difference array**: adding $x$ to a whole range becomes two point updates, and one prefix-sum pass applies them all.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "math",
        tex: "P[i] = \\sum_{k=0}^{i-1} A[k], \\qquad \\sum_{k=l}^{r} A[k] = P[r+1] - P[l]",
      },
      {
        kind: "p",
        text: "The identity holds because the two sums share the terms $A[0..l-1]$, which cancel. Building takes $n$ additions; each query takes 2 reads and 1 subtraction, so $q$ queries cost $O(n + q)$ instead of $O(nq)$.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "The idea works for any operation with an inverse (sums with subtraction, XOR with XOR). For minimum or maximum, which have no inverse, use a sparse table.",
          "**Subarray-sum counting:** a subarray $A[l..r]$ sums to $k$ exactly when $P[r+1] - P[l] = k$, so a hash map of earlier prefix sums counts such subarrays in $O(n)$.",
          "In parallel computing, prefix sum is the **scan** primitive. It runs in $O(\\log n)$ steps on $n$ processors and underlies parallel sorting, stream compaction and many GPU algorithms.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(n + q)", average: "O(n + q)", worst: "O(n + q)" },
    space: "O(n)",
    worstClass: "n",
    note: "$O(n)$ to build, $O(1)$ per query, for $q$ queries.",
  },
  properties: [
    { label: "Query cost", value: "Two reads, whatever the range length" },
    { label: "Updates", value: "Not supported efficiently" },
  ],
  implementations: [
    {
      language: "python",
      entry: "range_sums",
      code: `def range_sums(a, queries):
    """queries: list of [l, r], inclusive and 0-based."""
    p = [0]
    for x in a:
        p.append(p[-1] + x)
    return [p[r + 1] - p[l] for l, r in queries]
`,
      tests: [
        {
          args: [
            [3, 1, 4, 1, 5, 9, 2, 6],
            [
              [2, 5],
              [0, 7],
              [6, 6],
            ],
          ],
          expected: [19, 31, 2],
        },
        {
          args: [
            [5, -2, 7, -8, 4, -1],
            [
              [0, 3],
              [1, 4],
            ],
          ],
          expected: [2, 1],
        },
      ],
    },
    {
      language: "javascript",
      entry: "countSubarraysWithSum",
      code: `// How many subarrays sum to k? Count earlier prefix sums equal to P - k.
function countSubarraysWithSum(a, k) {
  const seen = new Map([[0, 1]]);
  let prefix = 0;
  let count = 0;
  for (const x of a) {
    prefix += x;
    count += seen.get(prefix - k) ?? 0;
    seen.set(prefix, (seen.get(prefix) ?? 0) + 1);
  }
  return count;
}
`,
      tests: [
        { args: [[1, 1, 1], 2], expected: 2 },
        { args: [[3, 4, 7, 2, -3, 1, 4, 2], 7], expected: 4 },
      ],
    },
  ],
  visualizer: "prefix-sums",
  practice: [
    {
      id: "prefix-sum-range",
      kind: "numeric",
      prompt: "With $P = [0, 3, 4, 8, 9, 14, 23, 25, 31]$, what is the sum of $A[3..6]$?",
      answer: 17,
      explanation:
        "$P[7]$ is the sum of $A[0..6]$ and $P[3]$ the sum of $A[0..2]$, so $A[3..6] = P[7] - P[3] = 25 - 8 = 17$ (that is, $1 + 5 + 9 + 2$).",
      hints: ["The sum of $A[l..r]$ is $P[r + 1] - P[l]$."],
      objective: "Answer a range query",
    },
    {
      id: "prefix-sum-update",
      kind: "mcq",
      prompt: "After building $P$, one element of $A$ changes. What is the cheapest correct fix?",
      options: [
        "Update every $P[i]$ after the changed position: $O(n)$",
        "Update only $P[i]$ at the changed position: $O(1)$",
        "Nothing; queries still work",
        "Rebuild only the first half",
      ],
      answer: 0,
      explanation:
        "Every prefix that includes the changed element changes. For frequent updates use a Fenwick tree, which does both in $O(\\log n)$.",
      distractors: {
        1: "Later prefixes also include that element.",
        2: "Queries would use stale totals.",
        3: "The affected entries are those after the change, not a fixed half.",
      },
      hints: ["Which $P[i]$ include the changed element?"],
      objective: "Know the limits of static prefix sums",
    },
  ],
  exam: {
    definition:
      "A prefix-sum array stores $P[i] = A[0] + \\dots + A[i-1]$ so that any range sum is a difference of two entries.",
    steps: ["$P[0] = 0$; $P[i+1] = P[i] + A[i]$.", "sum$(l, r) = P[r+1] - P[l]$."],
    timeComplexity: "$O(n)$ preprocessing, $O(1)$ per query.",
    spaceComplexity: "$O(n)$.",
    correctness:
      "$P[r+1]$ and $P[l]$ share the terms before $l$, which cancel, leaving exactly $A[l..r]$.",
    applications: [
      "Range-sum queries on static data",
      "Counting subarrays with a given sum",
      "2-D image integrals (summed-area tables)",
      "Parallel scan",
    ],
    limitations: ["Updates cost $O(n)$", "Needs an invertible operation"],
    faq: [
      {
        q: "Why is P one longer than A?",
        a: "$P[0] = 0$ lets the formula work for ranges starting at index 0 without a special case.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Definition of $P$.", "Range sum $= P[r+1] - P[l]$; $O(1)$ per query."],
      },
      {
        marks: 5,
        outline: [
          "Definition and build (2).",
          "Query formula with proof (2).",
          "Complexity and the update limitation (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "G. E. Blelloch, Prefix Sums and Their Applications, Technical Report CMU-CS-90-190, Carnegie Mellon University, 1990.",
      supports: "Prefix sums (scan) as a primitive and its parallel algorithms.",
    },
    {
      citation: "A. Laaksonen, Guide to Competitive Programming, Springer, 2017.",
      supports: "Prefix-sum arrays for static range queries, and their 2-D form.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-23",
};
