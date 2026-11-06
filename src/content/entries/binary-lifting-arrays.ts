import type { AlgorithmEntry } from "../types";

export const binaryLiftingArraysEntry: AlgorithmEntry = {
  slug: "binary-lifting-arrays",
  name: "Binary Lifting on Arrays",
  aliases: ["Sparse Table Lifting", "Jump Pointers on Arrays"],
  curriculum: [96],
  domain: "arrays-hashing",
  subcategory: "Further Array Techniques",
  difficulty: "advanced",
  summary:
    "Precomputes jump tables for an array-based successor function, enabling O(log n) queries to find the k-th successor of any element using binary decomposition of k.",
  tags: ["binary lifting", "jump pointers", "sparse table", "predecessor"],
  prerequisites: ["Binary Exponentiation", "Sparse Table"],
  related: ["binary-lifting", "sparse-table"],
  problem: {
    input:
      "An array next[] of length n defining a successor function, and queries (start, k) asking for the k-th successor of start.",
    output: "The element reached after following k successor links from start.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Following a successor pointer one step at a time takes O(k) time. Binary lifting precomputes jump[i][v] = the (2^i)-th successor of v. To answer a query for the k-th successor, decompose k into powers of 2 and chain the corresponding jumps, just like binary exponentiation.",
      },
      {
        kind: "p",
        text: "This trades O(n log n) preprocessing space and time for O(log k) per query, which is a huge win when k can be up to n.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Build table: jump[0][v] = next[v] for all v.",
          "For i = 1, 2, ..., floor(log2(maxK)): jump[i][v] = jump[i-1][jump[i-1][v]].",
          "Query k-th successor of v: for each set bit i in k, v = jump[i][v].",
          "Return v.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example**: next = [1, 2, 3, 4, 0] (cycle of length 5). Query: 7th successor of 0.",
      },
      {
        kind: "table",
        head: ["Level", "jump[level][0]"],
        rows: [
          ["0 (2^0=1)", "1"],
          ["1 (2^1=2)", "2"],
          ["2 (2^2=4)", "4"],
        ],
      },
      {
        kind: "p",
        text: "7 = 4 + 2 + 1: start at 0 → jump[2][0]=4 → jump[1][4]=1 → jump[0][1]=2. Answer: 2. Check: 0→1→2→3→4→0→1→2. Correct!",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "For functional graphs (each node has exactly one successor), this covers the entire structure.",
          "Works for LCA queries on trees by lifting both nodes to the same depth, then lifting together.",
          "LOG = ceil(log2(max_k)) + 1 levels suffice.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Preprocessing**: O(n log K) time and space where K is the maximum query distance.",
      },
      {
        kind: "p",
        text: "**Query**: O(log K) by binary decomposition of k.",
      },
      {
        kind: "p",
        text: "Correctness: jump[i][v] = f^{2^i}(v) by induction. Chaining jumps for set bits of k gives f^k(v).",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "In trees, binary lifting enables O(log n) LCA queries after O(n log n) preprocessing.",
          "Persistent binary lifting supports queries on historical versions of the successor function.",
          "Can be combined with functional graph cycle detection to answer queries that cross cycle boundaries.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(log k)",
      average: "O(log k)",
      worst: "O(log k)",
    },
    space: "O(n log K)",
    worstClass: "log n",
    note: "O(n log K) preprocessing; O(log k) per query.",
  },
  properties: [
    {
      label: "Preprocessing",
      value: "O(n log K)",
    },
    {
      label: "Query",
      value: "O(log k)",
    },
    {
      label: "Structure",
      value: "Works on any successor function",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "binary_lifting_query",
      code: `def binary_lifting_query(nxt, queries):
    """nxt[v] = successor of v. queries = [(start, k), ...]. Returns list of answers."""
    n = len(nxt)
    if n == 0:
        return []
    max_k = max((k for _, k in queries), default=0)
    LOG = max_k.bit_length() if max_k > 0 else 1
    # Build jump table
    jump = [list(nxt)]
    for i in range(1, LOG):
        prev = jump[-1]
        jump.append([prev[prev[v]] for v in range(n)])
    results = []
    for start, k in queries:
        v = start
        for i in range(LOG):
            if k & (1 << i):
                v = jump[i][v]
        results.append(v)
    return results
`,
      tests: [
        {
          args: [
            [1, 2, 3, 4, 0],
            [
              [0, 7],
              [0, 5],
              [2, 3],
            ],
          ],
          expected: [2, 0, 0],
        },
        {
          args: [
            [1, 0],
            [
              [0, 1],
              [0, 2],
              [1, 3],
            ],
          ],
          expected: [1, 0, 0],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "bl-levels",
      kind: "numeric",
      prompt: "How many levels does a binary lifting table need to support jumps up to k=1000?",
      answer: 10,
      explanation: "ceil(log2(1000)) = 10, since 2^10 = 1024 >= 1000.",
      hints: ["What power of 2 is just above 1000?"],
      objective: "Compute table size",
    },
  ],
  exam: {
    definition:
      "Binary lifting precomputes 2^i-th successors for all nodes, answering k-th successor queries in O(log k) by binary decomposition of k.",
    steps: [
      "jump[0][v] = next[v]",
      "jump[i][v] = jump[i-1][jump[i-1][v]]",
      "Query: decompose k into powers of 2, chain jumps",
    ],
    timeComplexity: "O(log k) query, O(n log K) preprocessing",
    spaceComplexity: "O(n log K)",
    correctness:
      "By induction, jump[i][v] = f^{2^i}(v). Query correctness follows from binary representation of k.",
    applications: ["LCA queries on trees", "Functional graph traversal", "K-th ancestor queries"],
    limitations: ["O(n log K) space overhead"],
    faq: [
      {
        q: "Why powers of 2?",
        a: "Any integer k can be written as a sum of distinct powers of 2, so chaining these jumps reaches f^k(v).",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Jump table construction and O(log k) query by bit decomposition (2)"],
      },
    ],
  },
  references: [
    {
      citation:
        "M. A. Bender and M. Farach-Colton, 'The LCA Problem Revisited,' LATIN 2000, LNCS 1776, 2000.",
      supports: "Binary lifting for LCA, applicable to array successor functions.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
