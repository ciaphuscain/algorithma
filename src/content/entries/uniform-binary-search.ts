import type { AlgorithmEntry } from "../types";

export const uniformBinarySearchEntry: AlgorithmEntry = {
  slug: "uniform-binary-search",
  name: "Uniform Binary Search",
  aliases: ["Knuth's uniform binary search", "Binary search with a delta table"],
  curriculum: [10],
  domain: "searching-sorting",
  subcategory: "Searching",
  difficulty: "intermediate",
  summary:
    "A binary search that keeps a single position and moves it by precomputed step sizes — the j-th step is the same for every search on arrays of that length. One index update per comparison, steps read from a small table.",
  tags: ["searching", "binary search", "lookup table", "Knuth"],
  prerequisites: ["Binary search"],
  related: ["binary-search", "fibonacci-search"],
  problem: {
    input: "A sorted array and a target $x$.",
    output: "An index $k$ with $A[k] = x$, or $-1$.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "In ordinary binary search the next probe depends on both ends of the range. But the size of the range after j steps hardly depends on which way the search went — it is about n/2^j either way. Uniform binary search exploits this: precompute the step sizes once, keep only the current position, and move left or right by the next step in the table.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Precompute DELTA[j] = ⌊(n + 2^(j−1)) / 2^j⌋ for j = 1, 2, … until it is 0.",
          "Positions count from 1. Start at i = DELTA[1], j = 2.",
          "Compare x with A[i] (positions 0 and n + 1 count as −∞ and +∞, without a comparison): if equal, done. If smaller, move to i − DELTA[j]; if larger, to i + DELTA[j]. If DELTA[j] = 0, x is absent. Then j ← j + 1.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): n = 10, DELTA = 5, 3, 1, 1, 0. Searching for 23: position 5 holds 16 < 23, move right 3 to position 8 (56 > 23), left 1 to 7 (38 > 23), left 1 to 6: 23, found (index 5). Four comparisons. For 40, the last step from position 7 (38 < 40) moves to 8 (56 > 40), and DELTA[5] = 0 ends the search: absent.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "The table depends only on n, so build it once and reuse it for many searches.",
          "Knuth's Algorithm U is a variant that computes the steps on the fly; Algorithm C (shown) uses the table.",
          "The same idea — branch-free stepping by precomputed sizes — underlies fast branchless binary searches on modern CPUs.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Cost.** The table has $\\lfloor \\log_2 n \\rfloor + 2$ entries, and the search makes at most $\\lfloor \\log_2 n \\rfloor + 1$ comparisons, like binary search. The rounding in DELTA keeps the uncertainty interval around the current position consistent at every step (Knuth, TAOCP Vol. 3, §6.2.1). The tests check results against the array for every length up to 40 and random contents, and check the comparison bound.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "When n + 1 is a power of two, every DELTA is a power of two and the search tree is perfectly balanced.",
          "Because the step table is fixed, the whole search can be unrolled into straight-line code for a known n.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(1)", average: "O(log n)", worst: "O(log n)" },
    space: "O(log n) table",
    worstClass: "log n",
  },
  properties: [
    { label: "State", value: "One position and a step index" },
    { label: "Steps", value: "DELTA[j] = ⌊(n + 2^(j−1)) / 2^j⌋" },
  ],
  implementations: [
    {
      language: "python",
      entry: "deltas",
      code: `def deltas(n):
    d, j = [], 1
    while True:
        v = (n + 2 ** (j - 1)) // 2 ** j
        d.append(v)
        if v == 0:
            return d
        j += 1
`,
      tests: [
        { args: [10], expected: [5, 3, 1, 1, 0] },
        { args: [7], expected: [4, 2, 1, 0] },
      ],
    },
    {
      language: "javascript",
      entry: "uniformSearch",
      code: `function uniformSearch(a, x) {
  const n = a.length;
  const d = [0];
  for (let j = 1; ; j++) {
    const v = Math.floor((n + 2 ** (j - 1)) / 2 ** j);
    d.push(v);
    if (v === 0) break;
  }
  let i = d[1], j = 2;   // 1-based position
  for (;;) {
    // Positions 0 and n + 1 stand for −∞ and +∞.
    const key = i < 1 ? -Infinity : i > n ? Infinity : a[i - 1];
    if (x === key) return i - 1;
    if (d[j] === 0) return -1;
    i = x < key ? i - d[j] : i + d[j];
    j++;
  }
}
`,
      tests: [
        { args: [[2, 5, 8, 12, 16, 23, 38, 56, 72, 91], 23], expected: 5 },
        { args: [[2, 5, 8, 12, 16, 23, 38, 56, 72, 91], 40], expected: -1 },
        { args: [[3, 6, 9, 12, 15, 18, 21], 18], expected: 5 },
      ],
    },
  ],
  visualizer: "uniform-binary-search",
  practice: [
    {
      id: "ubs-table",
      kind: "numeric",
      prompt: "For n = 15, what is DELTA[1]?",
      answer: 8,
      explanation: "⌊(15 + 1) / 2⌋ = 8.",
      hints: ["DELTA[j] = ⌊(n + 2^(j−1)) / 2^j⌋."],
      objective: "Delta table",
    },
    {
      id: "ubs-state",
      kind: "mcq",
      prompt: "What does uniform binary search keep instead of the pair (lo, hi)?",
      options: [
        "One position and the index into the step table",
        "Only lo",
        "A stack of ranges",
        "Two Fibonacci numbers",
      ],
      answer: 0,
      explanation: "The current position moves by DELTA[j]; the range size is implied by j.",
      distractors: {
        1: "lo alone does not say where to probe.",
        2: "No stack is needed.",
        3: "That is Fibonacci search.",
      },
      hints: ["What changes after each comparison?"],
      objective: "Idea",
    },
  ],
  exam: {
    definition:
      "Uniform binary search moves a single probe position by precomputed step sizes DELTA[j] that depend only on n.",
    steps: [
      "Build DELTA.",
      "Start at DELTA[1].",
      "Move ±DELTA[j] after each comparison; stop at 0.",
    ],
    timeComplexity: "$O(\\log n)$, at most ⌊log₂ n⌋ + 1 comparisons.",
    spaceComplexity: "$O(\\log n)$ for the table.",
    correctness:
      "The steps halve the uncertainty interval around the position, as in binary search.",
    applications: ["Repeated searches on arrays of the same length", "Branch-light search loops"],
    limitations: ["Table per length", "Harder to get right than plain binary search"],
    faq: [
      {
        q: "Why “uniform”?",
        a: "The step sizes are the same for every search path; only their signs differ.",
      },
    ],
    answers: [{ marks: 5, outline: ["Table (2).", "Search loop (2).", "Cost (1)."] }],
  },
  references: [
    {
      citation:
        "D. E. Knuth, The Art of Computer Programming, Vol. 3: Sorting and Searching, 2nd ed., Addison-Wesley, 1998, Section 6.2.1.",
      supports: "Uniform binary search (Algorithms U and C) and the DELTA table.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
