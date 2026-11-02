import type { AlgorithmEntry } from "../types";

export const divideAndConquerDpOptimizationEntry: AlgorithmEntry = {
  slug: "divide-and-conquer-dp-optimization",
  name: "Divide-and-Conquer DP Optimization",
  aliases: ["D&C DP", "Monotone minima DP"],
  curriculum: [522],
  domain: "dynamic-programming",
  subcategory: "Dynamic Programming",
  difficulty: "intermediate",
  summary:
    "Optimizes a 1D/1D DP recurrence from O(n²) to O(n log n) by exploiting the monotonicity of optimal split points, recursing on the answer array while narrowing the search range.",
  tags: ["dynamic programming", "optimization", "divide and conquer", "monotone minima"],
  prerequisites: ["Dynamic Programming Basics"],
  related: ["aliens-trick-lagrangian-relaxation-wqs-binary-search"],
  problem: {
    input:
      "A DP recurrence dp[i] = min over j < i of (dp[j] + cost(j, i)) where optimal j is non-decreasing in i.",
    output: "The dp array computed in O(n log n) instead of O(n²).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "In many DP problems, dp[i] = min_{j<i} (dp[j] + cost(j,i)). If the optimal j for dp[i] is always ≤ the optimal j for dp[i+1] (monotonicity), we can use divide and conquer: solve the middle element, then recurse on the left and right halves with narrowed j ranges.",
      },
      {
        kind: "p",
        text: "This is like binary search on the answer array: solving the midpoint splits the search space for the optimal j, giving O(n log n) total work instead of O(n²).",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "To fill dp[lo..hi], pick mid = (lo + hi) / 2.",
          "Find the optimal j for dp[mid] by scanning j from j_lo to j_hi.",
          "Recurse on dp[lo..mid-1] with j range [j_lo, opt_j].",
          "Recurse on dp[mid+1..hi] with j range [opt_j, j_hi].",
          "Base case: lo > hi.",
        ],
      },
      {
        kind: "p",
        text: "**Example:** For n=4, solve dp[2] first (mid of 1..4). If optimal j=1, then dp[1] searches j in [0,1] and dp[3..4] searches j in [1,3].",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "The cost function must satisfy the monotonicity property (also called the 'opt is non-decreasing' condition).",
          "Concave/convex SMAWK or Knuth optimization may also apply depending on the structure.",
          "Typically used in competitive programming for partition problems.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Correctness:** If opt(i) ≤ opt(i+1), solving the midpoint correctly constrains the search ranges for both halves. Each j is visited O(log n) times across all recursion levels.",
      },
      {
        kind: "p",
        text: "**Complexity:** O(n log n) time, O(n) space for the DP array.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "The SMAWK algorithm solves totally monotone matrices in O(n) time.",
          "Knuth's optimization applies when opt(i,j) ≤ opt(i,j+1) ≤ opt(i+1,j+1).",
          "The concave/convex conditions on cost(j,i) often arise from prefix sums or geometric properties.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n log n)",
    },
    space: "O(n)",
    worstClass: "n log n",
    note: "Each element is processed O(log n) times across recursion levels.",
  },
  properties: [
    {
      label: "Prerequisite",
      value: "Optimal split point monotonicity",
    },
    {
      label: "Speedup",
      value: "O(n²) → O(n log n)",
    },
    {
      label: "Pattern",
      value: "1D/1D DP optimization",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "dc_dp",
      code: `def dc_dp(n):
    """D&C DP optimization demo with cost(j,i) = (i-j)^2.
    Computes dp[i] = min over j in [0, i) of dp[j] + (i-j)^2.
    Returns dp[0..n-1] where dp[0] = 0."""
    INF = float('inf')
    dp = [INF] * n
    dp[0] = 0
    def cost(j, i):
        return (i - j) ** 2
    def solve(lo, hi, j_lo, j_hi):
        if lo > hi:
            return
        mid = (lo + hi) // 2
        best_j = j_lo
        best_val = INF
        for j in range(j_lo, min(j_hi, mid) + 1):
            val = dp[j] + cost(j, mid)
            if val < best_val:
                best_val = val
                best_j = j
        dp[mid] = min(dp[mid], best_val)
        solve(lo, mid - 1, j_lo, best_j)
        solve(mid + 1, hi, best_j, j_hi)
    solve(1, n - 1, 0, n - 1)
    return dp
`,
      tests: [
        {
          args: [4],
          expected: [0, 1, 4, 5],
        },
        {
          args: [1],
          expected: [0],
        },
        {
          args: [5],
          expected: [0, 1, 4, 5, 6],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "dc-dp-condition",
      kind: "mcq",
      prompt: "What condition on optimal split points enables D&C DP optimization?",
      options: [
        "Optimal j is non-decreasing in i",
        "Optimal j equals i/2",
        "Cost function is linear",
        "Split points are always 0",
      ],
      answer: 0,
      explanation:
        "The optimization requires that the optimal transition point for dp[i] is ≤ the optimal for dp[i+1].",
      hints: ["Think about what enables halving the search range."],
      objective: "Know the monotonicity condition",
    },
  ],
  exam: {
    definition: "D&C DP exploits monotone optimal split points to solve 1D/1D DP in O(n log n).",
    steps: [
      "Solve midpoint of range.",
      "Find its optimal j by linear scan.",
      "Recurse on halves with narrowed j ranges.",
    ],
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    correctness: "Monotonicity ensures each j is visited O(log n) times total.",
    applications: ["Partition problems", "Competitive programming"],
    limitations: ["Requires monotonicity of optimal split points"],
    faq: [
      {
        q: "When does this not apply?",
        a: "When optimal split points are not monotonically non-decreasing.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Explain the monotonicity condition.", "Describe the recursion."],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 3rd ed., MIT Press, 2009.",
      supports: "Dynamic programming optimization techniques.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
