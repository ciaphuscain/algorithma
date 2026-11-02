import type { AlgorithmEntry } from "../types";

export const knuthOptimizationEntry: AlgorithmEntry = {
  slug: "knuth-optimization",
  name: "Knuth Optimization",
  aliases: ["Knuth's optimization", "Optimal BST DP speedup"],
  curriculum: [521],
  domain: "dynamic-programming",
  subcategory: "Dynamic Programming",
  difficulty: "intermediate",
  summary:
    "Speeds up certain O(n³) interval DP recurrences to O(n²) by exploiting the monotonicity of optimal split points, originally applied to optimal binary search tree construction.",
  tags: ["DP optimization", "interval DP", "monotone", "Knuth"],
  prerequisites: ["Dynamic Programming", "Interval DP"],
  related: ["divide-and-conquer-dp-optimization"],
  problem: {
    input:
      "An interval DP recurrence $dp[i][j] = \\min_{i \\le k < j} (dp[i][k] + dp[k+1][j] + C[i][j])$ where optimal split points are monotone.",
    output: "The optimal DP values computed in O(n²) instead of O(n³).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "In interval DP, we often try all split points k in [i, j), making the recurrence O(n³). Knuth observed that for certain cost functions, the optimal split point opt[i][j] satisfies opt[i][j-1] ≤ opt[i][j] ≤ opt[i+1][j].",
      },
      {
        kind: "p",
        text: "This monotonicity means we don't need to search all possible split points — the range for each cell is constrained by its neighbors, and the total work over all cells telescopes to O(n²).",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Compute DP in order of increasing interval length.",
          "For interval [i, j], search for the optimal split only in the range [opt[i][j-1], opt[i+1][j]].",
          "Record opt[i][j] for use by larger intervals.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example.** Optimal BST with keys 1,2,3 and frequencies 3,1,2. Instead of checking all splits for each interval, use monotonicity: opt[1][2] constrains opt[1][3]'s search range.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "The cost function C must satisfy the quadrangle inequality: C[a][c] + C[b][d] ≤ C[a][d] + C[b][c] for a ≤ b ≤ c ≤ d.",
          "C must also be monotone on the lattice of intervals.",
          "Fill the DP table by increasing length of interval, tracking opt[i][j].",
          "Base case: opt[i][i] = i for single elements.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "When C satisfies the quadrangle inequality, optimal split points are monotone: $opt[i][j-1] \\le opt[i][j] \\le opt[i+1][j]$. The sum of search ranges over all intervals of a fixed length is O(n), and there are O(n) lengths, giving O(n²) total.",
      },
      {
        kind: "p",
        text: "This was discovered by Knuth in 1971 for optimal BST, and generalized by Yao (1980) to all cost functions satisfying the quadrangle inequality.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "The optimal BST problem (Knuth 1971) is the canonical example.",
          "Other applications: optimal alphabetic tree, matrix chain with special structure.",
          "Divide and conquer optimization handles a related class of DP recurrences.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n^2)",
      average: "O(n^2)",
      worst: "O(n^2)",
    },
    space: "O(n^2)",
    worstClass: "n^2",
    note: "Reduces O(n³) interval DP to O(n²).",
  },
  properties: [
    {
      label: "Speedup",
      value: "O(n³) → O(n²)",
    },
    {
      label: "Requires",
      value: "Quadrangle inequality on cost function",
    },
    {
      label: "Split monotonicity",
      value: "opt[i][j-1] ≤ opt[i][j] ≤ opt[i+1][j]",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "knuth_optimal_bst",
      code: `def knuth_optimal_bst(freq):
    """Compute minimum expected search cost for optimal BST.
    freq[i] = frequency of key i. Returns minimum cost."""
    n = len(freq)
    if n == 0:
        return 0
    INF = float('inf')
    # prefix sums for range cost
    ps = [0] * (n + 1)
    for i in range(n):
        ps[i+1] = ps[i] + freq[i]
    dp = [[0]*n for _ in range(n)]
    opt = [[0]*n for _ in range(n)]
    for i in range(n):
        dp[i][i] = freq[i]
        opt[i][i] = i
    for length in range(2, n+1):
        for i in range(n - length + 1):
            j = i + length - 1
            dp[i][j] = INF
            lo = opt[i][j-1]
            hi = opt[i+1][j] if i+1 <= j else j
            for k in range(lo, hi+1):
                cost = (dp[i][k-1] if k > i else 0) + (dp[k+1][j] if k < j else 0) + (ps[j+1] - ps[i])
                if cost < dp[i][j]:
                    dp[i][j] = cost
                    opt[i][j] = k
    return dp[0][n-1]
`,
      tests: [
        {
          args: [[3, 1, 2]],
          expected: 10,
        },
        {
          args: [[1, 1]],
          expected: 3,
        },
        {
          args: [[5]],
          expected: 5,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "knuth-condition",
      kind: "mcq",
      prompt: "What condition must the cost function satisfy for Knuth's optimization?",
      options: ["Quadrangle inequality", "Triangle inequality", "Submodularity", "Convexity"],
      answer: 0,
      explanation:
        "The quadrangle inequality C[a][c]+C[b][d] ≤ C[a][d]+C[b][c] ensures monotone optimal splits.",
      hints: ["It's a condition on intervals."],
      objective: "Understand the quadrangle inequality",
    },
  ],
  exam: {
    definition:
      "Knuth's optimization reduces interval DP from O(n³) to O(n²) by exploiting monotonicity of optimal split points under the quadrangle inequality.",
    steps: [
      "Fill DP by interval length.",
      "Search splits only in [opt[i][j-1], opt[i+1][j]].",
      "Track optimal split points.",
    ],
    timeComplexity: "$O(n^2)$",
    spaceComplexity: "$O(n^2)$",
    correctness:
      "Quadrangle inequality implies opt[i][j-1] ≤ opt[i][j] ≤ opt[i+1][j]; search ranges telescope to O(n) per length.",
    applications: ["Optimal BST", "Optimal alphabetic tree"],
    limitations: ["Only applies when quadrangle inequality holds"],
    faq: [
      {
        q: "Why does the total work become O(n²)?",
        a: "For each interval length, the sum of search ranges is O(n), and there are O(n) lengths.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Quadrangle inequality statement (1). Why O(n²) (1)."],
      },
    ],
  },
  references: [
    {
      citation: "D. E. Knuth, 'Optimum binary search trees,' Acta Informatica, 1(1), 1971.",
      supports: "Original optimal BST algorithm with O(n²) speedup.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
