import type { AlgorithmEntry } from "../types";

export const exponentialSearchEntry: AlgorithmEntry = {
  slug: "exponential-search",
  name: "Exponential Search",
  aliases: ["Galloping search", "Doubling search"],
  curriculum: [7],
  domain: "searching-sorting",
  subcategory: "Searching",
  difficulty: "beginner",
  summary:
    "Probes positions 1, 2, 4, 8, … until it passes the target, then binary-searches the last interval. It costs O(log i) when the target is at position i, so it works on lists of unknown length and is fast for targets near the front.",
  tags: ["searching", "sorted array", "unbounded search", "galloping"],
  prerequisites: ["Binary search"],
  related: ["binary-search", "jump-search", "merge-sort"],
  problem: {
    input: "A sorted array (possibly of unknown length) and a target $x$.",
    output: "An index $k$ with $A[k] = x$, or $-1$.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Binary search needs to know where the array ends. If it does not — a huge file, an infinite sequence — first find an upper bound by doubling: look at 1, then 2, 4, 8, … until you see a value at least the target. The target now lies between the last two probes, a range no bigger than the distance already covered, and binary search finishes the job.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "If A[0] = x, return 0.",
          "bound = 1; while bound < n and A[bound] < x, double bound.",
          "Binary-search A[⌊bound/2⌋ .. min(bound, n − 1)].",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): searching for 23 in [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]. A[0] = 2; then A[1] = 5, A[2] = 8, A[4] = 16 are all smaller, and A[8] = 72 is not. Binary search on positions 4–8 probes 38, 16 and 23: found at index 5 after 8 comparisons. In the third preset the target 6 is at index 3 of 20 elements, and the search takes only 5 comparisons.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Timsort's merge uses galloping: when one run keeps winning, it switches from one-by-one comparison to exponential search to find how far ahead it can jump.",
          "For unbounded sequences, the doubling phase needs a way to detect “beyond the end”, such as a sentinel ∞.",
          "Doubling from the current position rather than from 0 gives finger search in sorted lists.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Cost.** If x belongs at position $i$, the doubling phase stops after $\\lceil \\log_2 i \\rceil + 1$ probes, and the final interval has fewer than $i$ elements, so binary search adds at most $\\lfloor \\log_2 i \\rfloor + 1$: about $2 \\log_2 i$ in total, O(log i) — never worse than O(log n). Bentley and Yao (1976) studied this and refinements that approach $\\log_2 i$. The tests check every result against the array.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Bentley–Yao unbounded search nests the idea: gallop to find the number of bits of i, then gallop on that, giving $\\log_2 i + O(\\log \\log i)$ comparisons.",
          "Exponential search makes binary search adaptive: its cost depends on the answer, not on n.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(1)", average: "O(log i)", worst: "O(log n)" },
    space: "O(1)",
    worstClass: "log n",
    note: "i is the position of the target.",
  },
  properties: [
    { label: "Phase 1", value: "Double the bound until A[bound] ≥ x" },
    { label: "Phase 2", value: "Binary search the last interval" },
  ],
  implementations: [
    {
      language: "python",
      entry: "exponential_search",
      code: `from bisect import bisect_left

def exponential_search(a, x):
    if not a:
        return -1
    if a[0] == x:
        return 0
    bound = 1
    while bound < len(a) and a[bound] < x:
        bound *= 2
    lo, hi = bound // 2, min(bound, len(a) - 1)
    i = bisect_left(a, x, lo, hi + 1)
    return i if i <= hi and a[i] == x else -1
`,
      tests: [
        { args: [[2, 5, 8, 12, 16, 23, 38, 56, 72, 91], 23], expected: 5 },
        { args: [[2, 5, 8, 12, 16, 23, 38, 56, 72, 91], 40], expected: -1 },
      ],
    },
    {
      language: "javascript",
      entry: "finalRange",
      code: `// The range exponential search hands to binary search.
function finalRange(a, x) {
  let bound = 1;
  while (bound < a.length && a[bound] < x) bound *= 2;
  return [Math.floor(bound / 2), Math.min(bound, a.length - 1)];
}
`,
      tests: [{ args: [[2, 5, 8, 12, 16, 23, 38, 56, 72, 91], 23], expected: [4, 8] }],
    },
  ],
  visualizer: "exponential-search",
  practice: [
    {
      id: "exp-bound",
      kind: "numeric",
      prompt:
        "The target is at index 37 of a long sorted array. At which bound does the doubling phase stop?",
      answer: 64,
      explanation:
        "The bounds are 1, 2, 4, 8, 16, 32, 64; A[32] is still smaller than the target, A[64] is not.",
      hints: ["Find the first power of two greater than 37."],
      objective: "Doubling phase",
    },
    {
      id: "exp-why",
      kind: "mcq",
      prompt: "Why is exponential search useful when the array's length is unknown?",
      options: [
        "It finds an upper bound by itself before binary searching",
        "It never compares with elements past the target",
        "It needs no sorted order",
        "It uses less memory than binary search",
      ],
      answer: 0,
      explanation: "The doubling phase discovers a range containing the target without knowing n.",
      distractors: {
        1: "It may probe up to about twice the target's position.",
        2: "It relies on sorted order like binary search.",
        3: "Both use O(1) extra memory.",
      },
      hints: ["What does binary search need to start?"],
      objective: "Unbounded search",
    },
  ],
  exam: {
    definition:
      "Exponential search finds a range [2^(k−1), 2^k] containing the target by doubling, then binary-searches it.",
    steps: ["Check A[0].", "Double bound while A[bound] < x.", "Binary search the last interval."],
    timeComplexity: "$O(\\log i)$ for a target at position i.",
    spaceComplexity: "$O(1)$.",
    correctness: "A[bound/2] < x ≤ A[bound] (or bound ≥ n), so x can only be in that interval.",
    applications: ["Unbounded or streaming sorted data", "Galloping in Timsort", "Finger search"],
    limitations: ["About twice the comparisons of binary search for targets near the end"],
    faq: [
      {
        q: "Is it ever worse than binary search?",
        a: "By a constant factor of about 2 for targets near the end; asymptotically both are O(log n).",
      },
    ],
    answers: [
      { marks: 5, outline: ["Two phases (2).", "O(log i) analysis (2).", "Use case (1)."] },
    ],
  },
  references: [
    {
      citation:
        "J. L. Bentley, A. C. Yao, “An almost optimal algorithm for unbounded searching,” Information Processing Letters, 5(3), 1976.",
      supports: "Unbounded (exponential) search and its cost.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
