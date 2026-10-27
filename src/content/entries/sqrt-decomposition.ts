import type { AlgorithmEntry } from "../types";

export const sqrtDecompositionEntry: AlgorithmEntry = {
  slug: "sqrt-decomposition",
  name: "Sqrt Decomposition",
  aliases: ["Square-root decomposition", "Block decomposition", "Bucket decomposition"],
  curriculum: [65],
  domain: "arrays-hashing",
  subcategory: "Range Query Structures",
  difficulty: "intermediate",
  summary:
    "Cut the array into about √n blocks of about √n elements and keep a summary (here the sum) of each block. A range query adds whole blocks from the summaries and only the partial blocks at its ends element by element: O(√n) per query, O(1) per point update — simpler than a segment tree, and easy to adapt.",
  tags: ["square root", "blocks", "range query", "point update"],
  prerequisites: ["Prefix Sums"],
  related: ["segment-tree", "fenwick-tree", "mo-algorithm", "lazy-segment-tree"],
  problem: {
    input: "An array, and a sequence of operations “sum l r” and “set i x”.",
    output: "The answer to each sum query.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "To count the money in a stretch of shelves, you do not open every envelope if each shelf has a label with its total: you read the labels of the shelves fully inside the stretch and open envelopes only on the two partial shelves at the ends. With shelves of √n envelopes there are about √n labels and at most 2√n loose envelopes to read.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Choose the block size b = ⌈√n⌉ and compute B[k], the sum of block k.",
          "sum(l, r): add A[l], A[l + 1], … until reaching a block start; then add whole blocks B[k] while they fit; then add the remaining elements.",
          "set(i, x): B[⌊i/b⌋] changes by x − A[i]; then A[i] = x.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset, the same as the segment tree's): A = [5, 8, 6, 3, 2, 7, 2, 6], b = 3, so B = [19, 12, 8]. The sum of A[2..5] reads A[2] and then block 1 whole: 6 + 12 = 18. After setting A[3] = 10 (B[1] becomes 19), the sum of A[0..7] reads two blocks and two loose elements: 19 + 19 + 2 + 6 = 46. Including the 8 reads that build B, the run reads 15 values.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Any summary that can be combined works: minimums, counts, sorted copies of each block (to count values below x by binary search).",
          "Range updates fit too: keep a pending addition per block, like a lazy tag one level deep.",
          "The block size need not be exactly √n; when queries and updates have different costs, tuning b balances them.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Cost.** A query reads fewer than b elements before the first whole block, at most ⌈n/b⌉ block sums, and fewer than b elements after the last: under 2b + n/b reads. This is smallest when b ≈ √n, giving O(√n) per query; a point update is O(1), and building is O(n). A segment tree does both in O(log n), but square-root decomposition adapts to operations that segment trees handle awkwardly. The tests compare every answer with a plain array, check that B holds the block sums at the end, and check the read bound per query.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Mo's algorithm uses the same √n blocks to order offline queries.",
          "Square-root ideas also appear in graph algorithms (heavy and light vertices by degree) and in processing updates in batches of √q.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(1)",
      average: "O(√n)",
      worst: "O(√n)",
    },
    space: "O(n)",
    worstClass: "other",
    note: "Per query; point updates are O(1).",
  },
  properties: [
    {
      label: "Query",
      value: "O(√n)",
    },
    {
      label: "Point update",
      value: "O(1)",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "run_ops",
      code: `from math import ceil, sqrt

def run_ops(a, ops):
    a = list(a)
    n = len(a)
    b = ceil(sqrt(n))
    blocks = [sum(a[k:k + b]) for k in range(0, n, b)]
    out = []
    for kind, x, y in ops:
        if kind == "set":
            blocks[x // b] += y - a[x]
            a[x] = y
            continue
        l, r, s = x, y, 0
        while l <= r and l % b:
            s += a[l]; l += 1
        while l + b - 1 <= r:
            s += blocks[l // b]; l += b
        while l <= r:
            s += a[l]; l += 1
        out.append(s)
    return out
`,
      tests: [
        {
          args: [
            [5, 8, 6, 3, 2, 7, 2, 6],
            [
              ["sum", 2, 5],
              ["set", 3, 10],
              ["sum", 0, 7],
            ],
          ],
          expected: [18, 46],
        },
      ],
    },
    {
      language: "javascript",
      entry: "maxReads",
      code: `// The most reads one sum query can need with block size b: partial, whole blocks, partial.
function maxReads(n, b) {
  let worst = 0;
  for (let l = 0; l < n; l++)
    for (let r = l; r < n; r++) {
      let reads = 0, i = l;
      while (i <= r && i % b) { reads++; i++; }
      while (i + b - 1 <= r) { reads++; i += b; }
      reads += r - i + 1;
      worst = Math.max(worst, reads);
    }
  return worst;
}
`,
      tests: [
        {
          args: [16, 4],
          expected: 8,
        },
        {
          args: [16, 2],
          expected: 8,
        },
        {
          args: [16, 8],
          expected: 14,
        },
      ],
    },
  ],
  visualizer: "sqrt-decomposition",
  practice: [
    {
      id: "sq-b",
      kind: "numeric",
      prompt:
        "For n = 100 and blocks of 10, at most how many values does a sum query read? (Partial blocks have at most 9 loose elements each.)",
      answer: 26,
      explanation:
        "9 + 8 whole blocks + 9 = 26: if both ends are partial, at most 8 whole blocks fit between them.",
      hints: ["Both partial ends can have 9 elements; how many whole blocks then fit?"],
      objective: "Cost",
    },
    {
      id: "sq-why",
      kind: "mcq",
      prompt: "Why choose blocks of about √n?",
      options: [
        "It balances the loose elements (about b) against the number of blocks (about n/b)",
        "√n is always an integer",
        "It makes updates O(√n)",
        "It is required for correctness",
      ],
      answer: 0,
      explanation: "b + n/b is smallest at b = √n.",
      distractors: {
        "1": "It usually is not; we round.",
        "2": "Updates are O(1) either way.",
        "3": "Any block size gives correct answers.",
      },
      hints: ["Minimise b + n/b."],
      objective: "Block size",
    },
  ],
  exam: {
    definition:
      "Square-root decomposition splits an array into √n blocks with a precomputed summary each, answering range queries in O(√n).",
    steps: [
      "Choose b ≈ √n and summarise each block.",
      "Query: loose elements, whole blocks, loose elements.",
      "Update: fix the element and its block's summary.",
    ],
    timeComplexity: "$O(\\sqrt{n})$ per query, $O(1)$ per point update.",
    spaceComplexity: "$O(n)$.",
    correctness:
      "Every index in [l, r] is counted exactly once, either loose or inside a whole block.",
    applications: [
      "Range queries with unusual operations",
      "Mo's algorithm",
      "Batch processing of updates",
    ],
    limitations: ["Slower than O(log n) structures for large n"],
    faq: [
      {
        q: "Why not always use a segment tree?",
        a: "The block version is shorter, and some summaries (sorted blocks, counts of values) are easier to keep per block than per tree node.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Blocks and summaries (1).",
          "Query in three parts (2).",
          "Update (1).",
          "Choice of √n (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "A. Laaksonen, Guide to Competitive Programming, Springer, 2017.",
      supports: "Square-root algorithms and block decomposition.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
