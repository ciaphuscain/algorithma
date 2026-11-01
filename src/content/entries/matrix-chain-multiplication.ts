import type { AlgorithmEntry } from "../types";

export const matrixChainEntry: AlgorithmEntry = {
  slug: "matrix-chain-multiplication",
  name: "Matrix Chain Multiplication",
  aliases: ["MCM", "Matrix Chain Order"],
  curriculum: [279],
  domain: "dynamic-programming",
  subcategory: "Interval DP",
  difficulty: "intermediate",
  summary:
    "Find the optimal parenthesization of a chain of matrices to minimize scalar multiplications. Classic interval DP: dp[i][j] = min over split k of dp[i][k] + dp[k+1][j] + cost.",
  tags: ["matrix chain", "interval DP", "dynamic programming"],
  prerequisites: [],
  related: ["burst-balloons", "optimal-binary-search-tree"],
  problem: {
    input: "Array p where matrix i has dimensions p[i-1] × p[i].",
    output: "Minimum number of scalar multiplications.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Matrix multiplication is associative but order affects cost. (A×B)×C vs A×(B×C) can differ dramatically.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "dp[i][j] = minimum cost to multiply matrices i through j.",
          "For length 1: dp[i][i] = 0.",
          "dp[i][j] = min over k in [i, j-1] of dp[i][k] + dp[k+1][j] + p[i-1]*p[k]*p[j].",
          "Return dp[1][n-1].",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Fill by increasing interval length. O(n^3) time, O(n^2) space.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Time $O(n^3)$, space $O(n^2)$. Hu-Shing algorithm achieves $O(n \\log n)$ but is complex.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Knuth's optimization can reduce to $O(n^2)$ when the cost function satisfies the quadrangle inequality.",
      },
    ],
  },
  complexity: {
    time: { best: "O(n³)", average: "O(n³)", worst: "O(n³)" },
    space: "O(n²)",
    worstClass: "n^3",
  },
  properties: [],
  implementations: [
    {
      language: "python",
      entry: "matrixChainOrder",
      code: `def matrixChainOrder(p):
    n = len(p) - 1
    if n <= 0:
        return 0
    dp = [[0] * n for _ in range(n)]
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            dp[i][j] = float('inf')
            for k in range(i, j):
                cost = dp[i][k] + dp[k+1][j] + p[i] * p[k+1] * p[j+1]
                dp[i][j] = min(dp[i][j], cost)
    return dp[0][n-1]`,
      tests: [
        {
          args: [[10, 20, 30, 40, 30]],
          expected: 30000,
        },
        {
          args: [[40, 20, 30, 10, 30]],
          expected: 26000,
        },
      ],
    },
    {
      language: "javascript",
      entry: "matrixChainOrder",
      code: `function matrixChainOrder(p) {
  const n = p.length - 1;
  if (n <= 0) return 0;
  const dp = Array.from({length: n}, () => new Array(n).fill(0));
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1;
      dp[i][j] = Infinity;
      for (let k = i; k < j; k++) {
        const cost = dp[i][k] + dp[k+1][j] + p[i] * p[k+1] * p[j+1];
        dp[i][j] = Math.min(dp[i][j], cost);
      }
    }
  }
  return dp[0][n-1];
}`,
      tests: [
        {
          args: [[10, 20, 30, 40, 30]],
          expected: 30000,
        },
        {
          args: [[40, 20, 30, 10, 30]],
          expected: 26000,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "mcm-q1",
      kind: "mcq",
      prompt: "p=[10,30,5,60]. Optimal cost?",
      options: ["4500", "9000", "27000", "18000"],
      answer: 0,
      explanation: "(A1×A2)×A3: 10*30*5 + 10*5*60 = 1500+3000=4500.",
      hints: ["Try both split points."],
      objective: "Computation",
    },
  ],
  exam: {
    definition: "Minimize scalar multiplications for a matrix chain.",
    steps: ["dp[i][i]=0.", "Enumerate splits k.", "dp[i][j] = min cost over k."],
    timeComplexity: "$O(n^3)$.",
    spaceComplexity: "$O(n^2)$.",
    correctness:
      "Optimal substructure: best parenthesization splits into best sub-parenthesizations.",
    applications: ["compiler optimization", "query planning"],
    limitations: ["cubic time"],
    faq: [
      {
        q: "Why not just multiply left to right?",
        a: "Different orderings can differ by orders of magnitude in cost.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Interval DP setup (2).", "Recurrence (2).", "Complexity (1)."],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "Matrix chain multiplication.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
