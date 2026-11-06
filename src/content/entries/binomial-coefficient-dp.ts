import type { AlgorithmEntry } from "../types";

export const binomialCoefficientDpEntry: AlgorithmEntry = {
  slug: "binomial-coefficient-dp",
  name: "Binomial Coefficient DP",
  aliases: ["Pascal's Triangle DP", "nCr DP"],
  curriculum: [380],
  domain: "number-theory",
  subcategory: "Number Theory",
  difficulty: "intermediate",
  summary:
    "Computes binomial coefficients C(n, k) using Pascal's triangle recurrence C(n, k) = C(n-1, k-1) + C(n-1, k), avoiding large intermediate values and overflow issues.",
  tags: ["combinatorics", "dynamic programming", "Pascal's triangle"],
  prerequisites: ["Dynamic Programming"],
  related: ["catalan-numbers"],
  problem: {
    input: "Two non-negative integers n and k with k <= n.",
    output: "The binomial coefficient C(n, k) = n! / (k! * (n-k)!).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "The binomial coefficient C(n, k) counts the number of ways to choose k items from n. Computing it directly as n!/(k!(n-k)!) involves huge factorials that overflow. Pascal's recurrence breaks it into smaller subproblems that never exceed the final answer.",
      },
      {
        kind: "p",
        text: "Think of Pascal's triangle: each entry is the sum of the two entries above it. Row n, column k gives C(n, k). We only need the previous row to compute the current one, so we can use O(k) space.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Create an array dp of size k+1, initialized to 0 except dp[0] = 1.",
          "For i from 1 to n: for j from min(i, k) down to 1: dp[j] += dp[j-1].",
          "Return dp[k].",
        ],
      },
      {
        kind: "p",
        text: "**Worked example**: C(5, 2).",
      },
      {
        kind: "table",
        head: ["After row", "dp[0]", "dp[1]", "dp[2]"],
        rows: [
          ["0", "1", "0", "0"],
          ["1", "1", "1", "0"],
          ["2", "1", "2", "1"],
          ["3", "1", "3", "3"],
          ["4", "1", "4", "6"],
          ["5", "1", "5", "10"],
        ],
      },
      {
        kind: "p",
        text: "C(5, 2) = 10.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Iterate j downward to avoid using the same row's updated values.",
          "For modular C(n, k), replace addition with modular addition.",
          "For a full row of Pascal's triangle, compute all dp[0..n] in O(n) per row.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Recurrence**: C(n, k) = C(n-1, k-1) + C(n-1, k) with C(n, 0) = C(n, n) = 1.",
      },
      {
        kind: "p",
        text: "**Time**: O(n * k). **Space**: O(k) with the rolling array.",
      },
      {
        kind: "p",
        text: "All intermediate values are at most C(n, k), avoiding overflow that the factorial formula would cause.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Lucas' theorem computes C(n, k) mod p for prime p by reducing to smaller binomial coefficients.",
          "For very large n with small p, Lucas' theorem is O(log_p(n) * p) while DP is O(nk).",
          "Precomputing factorials and inverse factorials mod p allows O(1) per query after O(n) setup.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n * k)",
      average: "O(n * k)",
      worst: "O(n * k)",
    },
    space: "O(k)",
    worstClass: "n^2",
    note: "O(k) space with rolling array.",
  },
  properties: [
    {
      label: "Overflow-safe",
      value: "All intermediates <= C(n,k)",
    },
    {
      label: "Space-optimized",
      value: "O(k) with 1D array",
    },
    {
      label: "Modular",
      value: "Easy to extend",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "binom",
      code: `def binom(n, k):
    """Compute C(n, k) using DP."""
    if k < 0 or k > n:
        return 0
    if k > n - k:
        k = n - k
    dp = [0] * (k + 1)
    dp[0] = 1
    for i in range(1, n + 1):
        for j in range(min(i, k), 0, -1):
            dp[j] += dp[j - 1]
    return dp[k]
`,
      tests: [
        {
          args: [5, 2],
          expected: 10,
        },
        {
          args: [10, 3],
          expected: 120,
        },
        {
          args: [0, 0],
          expected: 1,
        },
        {
          args: [7, 0],
          expected: 1,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "binom-val",
      kind: "numeric",
      prompt: "What is C(6, 3)?",
      answer: 20,
      explanation: "C(6,3) = 6!/(3!*3!) = 720/36 = 20.",
      hints: ["Use Pascal's recurrence or the formula."],
      objective: "Compute a binomial coefficient",
    },
  ],
  exam: {
    definition:
      "Binomial coefficient DP computes C(n,k) using Pascal's recurrence C(n,k) = C(n-1,k-1) + C(n-1,k) in O(nk) time and O(k) space.",
    steps: [
      "dp[0] = 1, rest 0",
      "For each row 1..n, update dp[j] += dp[j-1] right to left",
      "Return dp[k]",
    ],
    timeComplexity: "O(nk)",
    spaceComplexity: "O(k)",
    correctness:
      "By induction, dp[j] after processing row i equals C(i, j). The downward iteration ensures each value uses the previous row's entries.",
    applications: ["Combinatorial counting", "Probability calculations", "Polynomial expansion"],
    limitations: [
      "O(nk) is slow for very large n; use factorial/inverse for O(n) with modular arithmetic",
    ],
    faq: [
      {
        q: "Why iterate j downward?",
        a: "To avoid using dp[j-1] that was already updated for the current row.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Pascal recurrence with rolling array in O(nk)/O(k) (2)"],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 3rd ed., §C.1, 2009.",
      supports: "Binomial coefficients and Pascal's triangle.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
