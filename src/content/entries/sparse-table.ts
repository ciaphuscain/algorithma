import type { AlgorithmEntry } from "../types";

export const sparseTableEntry: AlgorithmEntry = {
  slug: "sparse-table",
  name: "Sparse Table (Range Minimum Query)",
  aliases: ["RMQ", "Range minimum query", "Static range minimum"],
  curriculum: [64],
  domain: "arrays-hashing",
  subcategory: "Range Query Structures",
  difficulty: "intermediate",
  summary:
    "Precomputes the minimum of every block whose length is a power of two. Any range is covered by two such blocks, so a minimum query takes O(1) after O(n log n) preprocessing.",
  tags: ["range minimum", "rmq", "doubling", "static array", "idempotent"],
  prerequisites: ["Arrays", "Logarithms", "Dynamic Programming"],
  related: ["segment-tree", "prefix-sums", "fenwick-tree"],
  problem: {
    input: "An array $A$ that does not change, and queries “what is the minimum of $A[l..r]$?”.",
    output: "The minimum for each query.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Prefix sums do not work for minimums: you cannot “subtract” a minimum. But minimums have a different gift: counting an element twice does not change them. So cover the range with two blocks that may overlap. If every power-of-two block's minimum is precomputed, two lookups answer any query.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Row 0: $ST[0][i] = A[i]$ (blocks of length 1).",
          "Row $j$: $ST[j][i] = \\min(ST[j-1][i], ST[j-1][i + 2^{j-1}])$: a block of length $2^j$ is two blocks of length $2^{j-1}$.",
          "Query $[l, r]$: let $j = \\lfloor \\log_2(r - l + 1) \\rfloor$; the answer is $\\min(ST[j][l], ST[j][r - 2^j + 1])$.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): $A = [5, 2, 4, 7, 6, 3, 1, 2]$.",
      },
      {
        kind: "table",
        head: ["j (length)", "i = 0", "1", "2", "3", "4", "5", "6", "7"],
        rows: [
          ["0 (1)", "5", "2", "4", "7", "6", "3", "1", "2"],
          ["1 (2)", "2", "2", "4", "6", "3", "1", "1", ""],
          ["2 (4)", "2", "2", "3", "1", "1", "", "", ""],
          ["3 (8)", "1", "", "", "", "", "", "", ""],
        ],
      },
      {
        kind: "list",
        items: [
          "$\\min A[0..4]$: length 5, $j = 2$; blocks at 0 and 1: $\\min(2, 2) = 2$.",
          "$\\min A[3..6]$: length 4, $j = 2$; both blocks start at 3: $1$.",
          "$\\min A[2..3]$: length 2, $j = 1$: $4$.",
        ],
      },
      {
        kind: "p",
        text: "Building took 13 comparisons (7 + 5 + 1 new entries); each query took one more.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Precompute $\\lfloor \\log_2 x \\rfloor$ for $x \\le n$ in a table, or use a count-leading-zeros instruction, to keep queries $O(1)$.",
          "Row $j$ has $n - 2^j + 1$ entries; a square array wastes a little memory but is simpler.",
          "Works for any **idempotent** operation, where $x \\circ x = x$: min, max, gcd, bitwise and/or. For sums, overlapping blocks would double-count; use the “disjoint” $O(\\log n)$ query or prefix sums instead.",
          "The array must not change: one update can affect $O(n)$ table entries. Use a segment tree for updates.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "With $j = \\lfloor \\log_2 (r - l + 1) \\rfloor$ we have $2^j \\le r - l + 1 < 2^{j+1}$. The block $[l, l + 2^j - 1]$ starts at $l$, the block $[r - 2^j + 1, r]$ ends at $r$, and their combined length $2^{j+1}$ exceeds the range length, so together they cover $[l, r]$ exactly (with overlap). Because $\\min$ is idempotent, the overlap is harmless.",
      },
      {
        kind: "math",
        tex: "\\text{build: } \\sum_{j \\ge 1} (n - 2^j + 1) = O(n \\log n), \\qquad \\text{query: } O(1)",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Bender and Farach-Colton used sparse tables with a block decomposition to get $O(n)$ preprocessing and $O(1)$ queries for RMQ, and through it for lowest common ancestors in trees.",
          "LCA reduces to RMQ on the Euler tour of a tree, so a sparse table also answers LCA queries in $O(1)$.",
          "The **disjoint sparse table** answers any associative operation (including sums) in $O(1)$ by splitting the range at a precomputed midpoint.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(n \\log n)", average: "O(n \\log n)", worst: "O(n \\log n)" },
    space: "O(n \\log n)",
    worstClass: "n log n",
    note: "Preprocessing; each query is $O(1)$.",
  },
  properties: [
    { label: "Query cost", value: "Two table reads" },
    { label: "Operations", value: "Idempotent ones: min, max, gcd" },
    { label: "Updates", value: "Not supported" },
  ],
  implementations: [
    {
      language: "python",
      entry: "range_minimums",
      code: `def range_minimums(a, queries):
    n = len(a)
    table = [a[:]]
    j = 1
    while (1 << j) <= n:
        prev, half = table[-1], 1 << (j - 1)
        table.append([min(prev[i], prev[i + half]) for i in range(n - (1 << j) + 1)])
        j += 1
    out = []
    for l, r in queries:
        k = (r - l + 1).bit_length() - 1        # floor(log2(length))
        out.append(min(table[k][l], table[k][r - (1 << k) + 1]))
    return out
`,
      tests: [
        {
          args: [
            [5, 2, 4, 7, 6, 3, 1, 2],
            [
              [0, 4],
              [3, 6],
              [2, 3],
            ],
          ],
          expected: [2, 1, 4],
        },
        {
          args: [
            [9, -4, 8],
            [
              [1, 1],
              [0, 2],
            ],
          ],
          expected: [-4, -4],
        },
      ],
    },
    {
      language: "javascript",
      entry: "rangeGcd",
      code: `// gcd is idempotent too, so the same table answers range-gcd queries.
function rangeGcd(a, queries) {
  const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
  const table = [a.slice()];
  for (let j = 1; 1 << j <= a.length; j++) {
    const prev = table[j - 1];
    const half = 1 << (j - 1);
    table.push(prev.slice(0, a.length - (1 << j) + 1).map((x, i) => gcd(x, prev[i + half])));
  }
  return queries.map(([l, r]) => {
    const k = 31 - Math.clz32(r - l + 1);
    return gcd(table[k][l], table[k][r - (1 << k) + 1]);
  });
}
`,
      tests: [
        {
          args: [
            [12, 18, 24, 9, 15],
            [
              [0, 2],
              [1, 4],
              [3, 3],
            ],
          ],
          expected: [6, 3, 9],
        },
      ],
    },
  ],
  visualizer: "sparse-table",
  practice: [
    {
      id: "sparse-j",
      kind: "numeric",
      prompt: "For a query on $A[3..12]$, which row $j$ does the sparse table use?",
      answer: 3,
      explanation:
        "The length is 10; $\\lfloor \\log_2 10 \\rfloor = 3$, so two blocks of length 8 (starting at 3 and at 5) cover the range.",
      hints: ["Find the largest power of two not exceeding the length."],
      objective: "Choose the block size",
    },
    {
      id: "sparse-sum",
      kind: "mcq",
      prompt: "Why can't the two-block query answer range **sums**?",
      options: [
        "The blocks overlap, so elements in the overlap would be counted twice",
        "Sums do not fit in the table",
        "Sums need sorted input",
        "It can; sums work the same way",
      ],
      answer: 0,
      explanation:
        "Only idempotent operations tolerate overlap; for sums use prefix sums or disjoint blocks.",
      distractors: {
        1: "Storage is the same for any operation.",
        2: "No sorting is involved.",
        3: "Overlap double-counts for sums.",
      },
      hints: ["What is $x + x$ compared with $\\min(x, x)$?"],
      objective: "Know when overlap is allowed",
    },
  ],
  exam: {
    definition:
      "A sparse table stores the answer for every block of length $2^j$ of a static array, answering idempotent range queries such as minimum in $O(1)$.",
    steps: [
      "ST[0][i] = A[i].",
      "ST[j][i] = min(ST[j−1][i], ST[j−1][i + 2^(j−1)]).",
      "Query: j = ⌊log₂(len)⌋; min(ST[j][l], ST[j][r − 2^j + 1]).",
    ],
    timeComplexity: "$O(n \\log n)$ preprocessing, $O(1)$ per query.",
    spaceComplexity: "$O(n \\log n)$.",
    correctness:
      "Two blocks of length 2^j, one starting at l and one ending at r, cover [l, r] because 2^(j+1) > r − l + 1; overlap does not affect an idempotent operation.",
    applications: [
      "Static range minimum/maximum",
      "LCA via Euler tour",
      "Range gcd",
      "Suffix-array LCP queries",
    ],
    limitations: ["No updates", "Only idempotent operations in O(1)"],
    faq: [
      {
        q: "Sparse table or segment tree?",
        a: "Sparse table: O(1) queries, static data. Segment tree: O(log n) queries but supports updates and any associative operation.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Precompute power-of-two blocks.", "Two overlapping blocks per query; $O(1)$."],
      },
      {
        marks: 5,
        outline: [
          "Recurrence (1).",
          "Query and why it covers the range (2).",
          "Worked table (1).",
          "Complexity and limits (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "M. A. Bender, M. Farach-Colton, “The LCA problem revisited,” Proc. LATIN 2000, Lecture Notes in Computer Science 1776, Springer.",
      supports: "Sparse tables for RMQ and the RMQ–LCA connection.",
    },
    {
      citation: "A. Laaksonen, Guide to Competitive Programming, Springer, 2017.",
      supports: "Static range minimum queries with O(n log n) preprocessing.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-23",
};
