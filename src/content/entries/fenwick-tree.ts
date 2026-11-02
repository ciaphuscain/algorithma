import type { AlgorithmEntry } from "../types";

export const fenwickTreeEntry: AlgorithmEntry = {
  slug: "fenwick-tree",
  name: "Fenwick Tree (Binary Indexed Tree)",
  aliases: ["Binary indexed tree", "BIT", "Fenwick tree"],
  curriculum: [61],
  domain: "arrays-hashing",
  subcategory: "Range Queries",
  difficulty: "intermediate",
  summary:
    "An array T in which T[i] stores the sum of a block of A ending at i, sized by i's lowest set bit, so prefix sums and point updates both take O(log n) with a few lines of code.",
  tags: [
    "prefix sums",
    "range queries",
    "bit manipulation",
    "point update",
    "cumulative frequency",
  ],
  prerequisites: ["Prefix Sums", "Binary Representation"],
  related: ["segment-tree"],
  problem: {
    input:
      "An array $A[1..n]$, then a sequence of point updates (add $x$ to $A[i]$) and range-sum queries.",
    output: "The sum of $A[l..r]$ for each query, reflecting all earlier updates.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Plain prefix sums answer a query in one step but need $O(n)$ work after every update. A Fenwick tree splits the difference: every position $i$ keeps the total of a block that ends at $i$, and the block sizes are powers of two chosen so that any prefix is the union of at most $\\log_2 n$ blocks, and any position lies in at most $\\log_2 n$ blocks.",
      },
      {
        kind: "p",
        text: "The block length at $i$ is $\\text{lowbit}(i)$, the value of $i$'s lowest set bit: `i & -i`. For example, $\\text{lowbit}(6) = 2$ because $6 = 110_2$, so $T[6] = A[5] + A[6]$.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "**Prefix sum** up to $i$: add $T[i]$, then jump to $i - \\text{lowbit}(i)$ (clear the lowest bit), until $i = 0$.",
          "**Add $x$ to $A[i]$:** add $x$ to $T[i]$, then jump to $i + \\text{lowbit}(i)$, until $i > n$. These are exactly the blocks that contain position $i$.",
          "**Range sum** $A[l..r]$ = prefix($r$) − prefix($l - 1$).",
          "**Build in $O(n)$:** copy $A$ into $T$, then for $i = 1..n$ add $T[i]$ into $T[i + \\text{lowbit}(i)]$ (if that is at most $n$).",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): $A = [5, 2, 9, -3, 5, 20, 10, -7]$ at positions 1 to 8.",
      },
      {
        kind: "table",
        head: ["i", "1", "2", "3", "4", "5", "6", "7", "8"],
        rows: [
          ["binary", "0001", "0010", "0011", "0100", "0101", "0110", "0111", "1000"],
          ["block", "1..1", "1..2", "3..3", "1..4", "5..5", "5..6", "7..7", "1..8"],
          ["T[i]", "5", "7", "9", "13", "5", "25", "10", "41"],
        ],
      },
      {
        kind: "list",
        items: [
          "**sum 1..6:** prefix(6) = T[6] + T[4] = 25 + 13 = 38 (6 → 4 → 0).",
          "**add 3 4:** updates T[3], T[4], T[8] (3 → 4 → 8 → 16 > 8), giving 13, 17, 45.",
          "**sum 2..7:** prefix(7) − prefix(1) = (T[7] + T[6] + T[4]) − T[1] = (10 + 25 + 17) − 5 = 47.",
        ],
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Use 1-based indices: lowbit(0) is 0, so index 0 would loop forever. Leave `T[0]` unused or shift indices by one.",
          "`i & -i` relies on two's complement, which JavaScript (32-bit bitwise operators), Python, C and Java all use for this purpose.",
          "To **set** $A[i] = v$ rather than add, keep a copy of $A$ and add $v - A[i]$.",
          "**Range update, point query:** store differences instead, so adding $x$ to $A[l..r]$ is add($l$, $x$) and add($r + 1$, $-x$), and $A[i]$ is prefix($i$).",
        ],
      },
      {
        kind: "callout",
        tone: "tip",
        title: "Fenwick or segment tree?",
        text: "A Fenwick tree needs $n$ extra numbers and a few lines of code, but only works for operations that can be undone (like + and −) or are prefix-only. A segment tree handles any associative operation, such as min or max over arbitrary ranges, and lazy range updates.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "$T[i] = \\sum_{j = i - \\text{lowbit}(i) + 1}^{i} A[j]$. Clearing the lowest set bit of $i$ moves to the end of the previous block, so the prefix walk visits one index per set bit of $i$: at most $\\lfloor \\log_2 n \\rfloor + 1$ steps.",
      },
      {
        kind: "p",
        text: "Adding lowbit($i$) clears a run of trailing ones and sets the next bit, so each update step strictly increases the position of the lowest set bit, and the update also takes at most $\\lfloor \\log_2 n \\rfloor + 1$ steps. The blocks it visits are exactly those containing position $i$.",
      },
      {
        kind: "math",
        tex: "\\text{query, update: } O(\\log n), \\qquad \\text{build: } O(n), \\qquad \\text{space: } n",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**2-D Fenwick trees** answer rectangle sums in $O(\\log^2 n)$.",
          "**Order statistics:** over counts of values, walking down the bits finds the $k$-th smallest element in $O(\\log n)$.",
          "**Counting inversions** in $O(n \\log n)$: scan from the left, and for each value ask how many larger values were already inserted.",
          "Fenwick introduced the structure for cumulative frequency tables in arithmetic coding.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(\\log n)", average: "O(\\log n)", worst: "O(\\log n)" },
    space: "O(n)",
    worstClass: "log n",
    note: "Per query or update; building takes $O(n)$.",
  },
  properties: [
    { label: "Operations", value: "Point update, prefix and range sum" },
    { label: "Memory", value: "Exactly $n$ numbers" },
    { label: "Needs inverses", value: "Range queries need subtraction" },
  ],
  implementations: [
    {
      language: "python",
      entry: "fenwick_run",
      code: `def fenwick_run(values, ops):
    """values: A[1..n]; ops: ["add", i, x] or ["sum", l, r] (1-based). Returns the sums."""
    n = len(values)
    t = [0] + list(values)
    for i in range(1, n + 1):            # O(n) build
        j = i + (i & -i)
        if j <= n:
            t[j] += t[i]

    def prefix(i):
        s = 0
        while i > 0:
            s += t[i]
            i -= i & -i
        return s

    out = []
    for op in ops:
        if op[0] == "add":
            i, x = op[1], op[2]
            while i <= n:
                t[i] += x
                i += i & -i
        else:
            out.append(prefix(op[2]) - prefix(op[1] - 1))
    return out
`,
      tests: [
        {
          args: [
            [5, 2, 9, -3, 5, 20, 10, -7],
            [
              ["sum", 1, 6],
              ["add", 3, 4],
              ["sum", 2, 7],
            ],
          ],
          expected: [38, 47],
        },
      ],
    },
    {
      language: "javascript",
      entry: "countInversions",
      code: `// Inversions of a permutation of 1..n with a Fenwick tree over seen values.
function countInversions(p) {
  const n = p.length;
  const t = new Array(n + 1).fill(0);
  let inversions = 0;
  for (let k = 0; k < n; k++) {
    let seenAtMost = 0;
    for (let i = p[k]; i > 0; i -= i & -i) seenAtMost += t[i];
    inversions += k - seenAtMost; // earlier values larger than p[k]
    for (let i = p[k]; i <= n; i += i & -i) t[i] += 1;
  }
  return inversions;
}
`,
      tests: [
        { args: [[1, 2, 3, 4]], expected: 0 },
        { args: [[4, 3, 2, 1]], expected: 6 },
        { args: [[2, 4, 1, 3, 5]], expected: 3 },
      ],
    },
  ],
  visualizer: "fenwick-tree",
  practice: [
    {
      id: "fenwick-lowbit",
      kind: "numeric",
      prompt: "How many entries of T does a prefix-sum query for i = 13 read?",
      answer: 3,
      explanation:
        "$13 = 1101_2$: 13 → 12 → 8 → 0, reading T[13], T[12] and T[8]: one per set bit.",
      hints: ["Repeatedly clear the lowest set bit of 13."],
      objective: "Trace a prefix query",
    },
    {
      id: "fenwick-block",
      kind: "mcq",
      prompt: "Which elements of A does T[12] cover?",
      options: ["A[9..12]", "A[1..12]", "A[11..12]", "A[12] only"],
      answer: 0,
      explanation: "$12 = 1100_2$, lowbit(12) = 4, so the block is the 4 positions ending at 12.",
      distractors: {
        1: "That would be a prefix sum; only powers of two cover whole prefixes.",
        2: "That would need lowbit(12) = 2.",
        3: "Only odd positions cover a single element.",
      },
      hints: ["Compute lowbit(12) = 12 & −12."],
      objective: "Understand the block structure",
    },
    {
      id: "fenwick-update",
      kind: "numeric",
      prompt: "With n = 16, how many entries of T change when you add to A[5]?",
      answer: 4,
      explanation:
        "5 + 1 = 6, 6 + 2 = 8, 8 + 8 = 16, and 16 + 16 = 32 is past the end, so T[5], T[6], T[8] and T[16] change.",
      hints: ["Repeatedly add lowbit until you pass 16."],
      objective: "Trace an update",
    },
  ],
  exam: {
    definition:
      "A Fenwick tree (binary indexed tree) stores, for each index i, the sum of the lowbit(i) array elements ending at i, supporting prefix sums and point updates in O(log n).",
    steps: [
      "lowbit(i) = i & −i.",
      "prefix(i): while i > 0: s += T[i]; i −= lowbit(i).",
      "add(i, x): while i ≤ n: T[i] += x; i += lowbit(i).",
      "range(l, r) = prefix(r) − prefix(l − 1).",
    ],
    timeComplexity: "$O(\\log n)$ per query or update; $O(n)$ to build.",
    spaceComplexity: "$O(n)$.",
    correctness:
      "Clearing lowest bits decomposes [1, i] into disjoint blocks (i − lowbit(i), i]; adding lowest bits enumerates exactly the blocks that contain a given index.",
    applications: [
      "Dynamic prefix sums and frequency tables",
      "Counting inversions",
      "Order statistics over counts",
      "Arithmetic coding",
    ],
    limitations: [
      "Range queries need an invertible operation (no min/max over arbitrary ranges)",
      "Less flexible than a segment tree",
    ],
    faq: [
      {
        q: "Why is it called a tree?",
        a: "Linking each i to i + lowbit(i) forms a tree for updates, and i to i − lowbit(i) another for queries; the array stores both implicitly.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "T[i] covers lowbit(i) elements ending at i.",
          "Query and update in $O(\\log n)$.",
        ],
      },
      {
        marks: 5,
        outline: [
          "Definition and lowbit (1).",
          "Query and update procedures (2).",
          "Small worked example (1).",
          "Complexity and comparison with prefix sums (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "P. M. Fenwick, “A new data structure for cumulative frequency tables,” Software: Practice and Experience, 24(3), 1994.",
      supports: "The original data structure and its use in arithmetic coding.",
    },
    {
      citation: "A. Laaksonen, Guide to Competitive Programming, Springer, 2017.",
      supports: "Binary indexed trees, range queries and their applications.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-21",
};
