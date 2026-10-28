import type { AlgorithmEntry } from "../types";

export const ternarySearchEntry: AlgorithmEntry = {
  slug: "ternary-search",
  name: "Ternary Search",
  aliases: ["Search on a unimodal sequence"],
  curriculum: [5],
  domain: "searching-sorting",
  subcategory: "Searching",
  difficulty: "intermediate",
  summary:
    "Finds the peak of a sequence that rises and then falls by comparing two interior points and discarding a third of the range each step: O(log n) comparisons. The same idea maximises unimodal functions of a real variable.",
  tags: ["searching", "unimodal", "optimisation", "divide and conquer"],
  prerequisites: ["Binary search"],
  related: ["binary-search", "gradient-descent"],
  problem: {
    input: "An array that strictly increases up to one peak and then strictly decreases.",
    output: "The index of the peak (the maximum).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "You are walking along a ridge in fog and want the summit. Look at two points, one a third of the way along and one two thirds. If the first is lower, you were still climbing there, so the summit is not before it. If the second is lower, you were already descending there, so the summit is not after it. Either way a third of the path is ruled out.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Keep a range [lo, hi] that contains the peak; start with the whole array.",
          "While it has more than three elements, take m1 = lo + ⌊(hi − lo)/3⌋ and m2 = hi − ⌊(hi − lo)/3⌋.",
          "If A[m1] < A[m2], set lo = m1 + 1; otherwise set hi = m2 − 1.",
          "Return the largest of the at most three remaining elements.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): [1, 4, 9, 15, 22, 18, 12, 7, 2]. First m1 = 2 and m2 = 6: 9 < 12, so lo = 3. Then m1 = 4 and m2 = 7: 22 ≥ 7, so hi = 6. Then m1 = 4 and m2 = 5: 22 ≥ 18, so hi = 4. Two candidates remain; one more comparison picks index 4 (22). Four comparisons in all.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Strictness matters: with equal neighbours (a plateau) the comparison can discard the peak. For non-strict sequences, compare A[mid] with A[mid + 1] (a binary search on the slope) where possible.",
          "On integers, binary search on the sign of A[mid + 1] − A[mid] needs only one comparison per halving and so beats ternary search.",
          "For real functions, stop when hi − lo is below the tolerance; golden-section search reuses one interior point per step and needs one new evaluation instead of two.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Cost.** Each step keeps at most $2/3$ of the range, so after $k$ steps the range has at most $n (2/3)^k$ elements, and about $\\log_{3/2} n \\approx 1.71 \\log_2 n$ steps suffice — two comparisons each. **Correctness:** if $A[m1] < A[m2]$ then $m1$ is on the rising part (otherwise both points would be on the falling part and $A[m1] > A[m2]$), so the peak is after $m1$; symmetrically for the other case. The tests compare the result with the true maximum.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Golden-section search (Kiefer, 1953) chooses the interior points in the golden ratio so that one of them is reused at the next step.",
          "In competitive programming, ternary search finds optima of convex cost functions, for example the best meeting point on a line.",
          "“Ternary search” also names a search on sorted arrays that splits into thirds; it makes more comparisons than binary search and is rarely useful.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(1)", average: "O(log n)", worst: "O(log n)" },
    space: "O(1)",
    worstClass: "log n",
  },
  properties: [
    { label: "Input", value: "Strictly unimodal" },
    { label: "Range kept per step", value: "Two thirds" },
  ],
  implementations: [
    {
      language: "python",
      entry: "peak",
      code: `def peak(a):
    lo, hi = 0, len(a) - 1
    while hi - lo > 2:
        third = (hi - lo) // 3
        m1, m2 = lo + third, hi - third
        if a[m1] < a[m2]:
            lo = m1 + 1
        else:
            hi = m2 - 1
    return max(range(lo, hi + 1), key=lambda i: a[i])
`,
      tests: [
        { args: [[1, 4, 9, 15, 22, 18, 12, 7, 2]], expected: 4 },
        { args: [[3, 6, 10, 15, 21, 28]], expected: 5 },
      ],
    },
    {
      language: "javascript",
      entry: "maximiseParabola",
      code: `// Maximise a unimodal function on [lo, hi] to within eps.
function maximise(f, lo, hi, eps) {
  while (hi - lo > eps) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (f(m1) < f(m2)) lo = m1;
    else hi = m2;
  }
  return Math.round((lo + hi) / 2 * 1000) / 1000;
}
const parabola = (x) => -(x - 2) * (x - 2);
function maximiseParabola() {
  return maximise(parabola, 0, 5, 1e-6);
}
`,
      tests: [{ args: [], expected: 2 }],
    },
  ],
  visualizer: "ternary-search",
  practice: [
    {
      id: "ternary-discard",
      kind: "mcq",
      prompt:
        "On a unimodal array, A[m1] = 30 and A[m2] = 12 with m1 < m2. Which part can be discarded?",
      options: ["Everything from m2 onwards", "Everything up to m1", "Nothing", "The middle third"],
      answer: 0,
      explanation:
        "A[m1] > A[m2] means the sequence is already falling at m2, so the peak is before m2.",
      distractors: {
        1: "That would be right if A[m1] were smaller.",
        2: "One comparison always rules out a third.",
        3: "The peak may well be in the middle third.",
      },
      hints: ["Is the sequence rising or falling at m2?"],
      objective: "Discarding a third",
    },
    {
      id: "ternary-steps",
      kind: "numeric",
      prompt:
        "Starting from 81 candidates and keeping exactly 2/3 each step, how many steps leave at most 3 candidates? (Round up.)",
      answer: 9,
      explanation: "81 · (2/3)^k ≤ 3 needs (3/2)^k ≥ 27, so k ≥ log 27 / log 1.5 ≈ 8.13: 9 steps.",
      hints: ["Solve (3/2)^k ≥ 27."],
      objective: "Cost",
    },
  ],
  exam: {
    definition:
      "Ternary search locates the maximum of a unimodal sequence by comparing two interior points and discarding a third of the range.",
    steps: [
      "m1, m2 at thirds.",
      "Discard [lo, m1] or [m2, hi].",
      "Finish by comparing the last few.",
    ],
    timeComplexity: "$O(\\log n)$.",
    spaceComplexity: "$O(1)$.",
    correctness:
      "Unimodality: a lower left point is on the rise; a lower right point is on the fall.",
    applications: [
      "Peak finding",
      "Maximising unimodal or convex functions",
      "Golden-section search",
    ],
    limitations: ["Fails on plateaus", "Binary search on the slope is faster on arrays"],
    faq: [
      {
        q: "Why not split into halves?",
        a: "One middle value alone does not tell which side the peak is on; you need two points, or a point and its neighbour.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Unimodality (1).", "Algorithm (2).", "Why a third can be discarded (2)."],
      },
    ],
  },
  references: [
    {
      citation:
        "J. Kiefer, “Sequential minimax search for a maximum,” Proceedings of the American Mathematical Society, 4(3), 1953.",
      supports: "Search for the maximum of a unimodal function; golden-section search.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
