import type { AlgorithmEntry } from "../types";

export const removeBoxesEntry: AlgorithmEntry = {
  slug: "remove-boxes",
  name: "Remove Boxes",
  aliases: ["Remove Boxes DP"],
  curriculum: [292],
  domain: "dynamic-programming",
  subcategory: "Interval DP",
  difficulty: "intermediate",
  summary:
    "Remove boxes to maximize points. Removing k consecutive same-color boxes earns k² points. 3D interval DP: dp[l][r][k] where k extra same-color boxes are attached to boxes[l].",
  tags: ["interval DP", "3D DP", "dynamic programming"],
  prerequisites: ["burst-balloons"],
  related: ["burst-balloons"],
  problem: {
    input: "Array of box colors.",
    output: "Maximum points from removing all boxes.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Removing same-color boxes together earns more (k²). The key insight: track how many same-color boxes are waiting to merge with the leftmost box of a range.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "dp[l][r][k] = max points from boxes[l..r] with k extra copies of boxes[l] attached to the left.",
          "Option 1: remove boxes[l] with the k extras: (k+1)² + dp[l+1][r][0].",
          "Option 2: find m in (l,r] where boxes[m]==boxes[l], merge: dp[l+1][m-1][0] + dp[m][r][k+1].",
          "Return dp[0][n-1][0].",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Memoization is more natural than bottom-up for this 3D state.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Time $O(n^4)$, space $O(n^3)$.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "One of the hardest interval DP problems. The extra dimension k captures the 'delayed merging' insight.",
      },
    ],
  },
  complexity: {
    time: { best: "O(n⁴)", average: "O(n⁴)", worst: "O(n⁴)" },
    space: "O(n³)",
    worstClass: "other",
  },
  properties: [],
  implementations: [
    {
      language: "python",
      entry: "removeBoxes",
      code: `def removeBoxes(boxes):
    n = len(boxes)
    memo = {}
    def dp(l, r, k):
        if l > r:
            return 0
        key = (l, r, k)
        if key in memo:
            return memo[key]
        while l < r and boxes[l] == boxes[l + 1]:
            l += 1
            k += 1
        res = (k + 1) * (k + 1) + dp(l + 1, r, 0)
        for m in range(l + 1, r + 1):
            if boxes[m] == boxes[l]:
                res = max(res, dp(l + 1, m - 1, 0) + dp(m, r, k + 1))
        memo[key] = res
        return res
    return dp(0, n - 1, 0)`,
      tests: [
        {
          args: [[1, 3, 2, 2, 2, 3, 4, 3, 1]],
          expected: 23,
        },
        {
          args: [[1, 1, 1]],
          expected: 9,
        },
      ],
    },
    {
      language: "javascript",
      entry: "removeBoxes",
      code: `function removeBoxes(boxes) {
  const n = boxes.length;
  const memo = new Map();
  function dp(l, r, k) {
    if (l > r) return 0;
    const key = l * 10000 + r * 100 + k;
    if (memo.has(key)) return memo.get(key);
    let ll = l, kk = k;
    while (ll < r && boxes[ll] === boxes[ll + 1]) { ll++; kk++; }
    let res = (kk + 1) * (kk + 1) + dp(ll + 1, r, 0);
    for (let m = ll + 1; m <= r; m++) {
      if (boxes[m] === boxes[ll]) {
        res = Math.max(res, dp(ll + 1, m - 1, 0) + dp(m, r, kk + 1));
      }
    }
    memo.set(key, res);
    return res;
  }
  return dp(0, n - 1, 0);
}`,
      tests: [
        {
          args: [[1, 3, 2, 2, 2, 3, 4, 3, 1]],
          expected: 23,
        },
        {
          args: [[1, 1, 1]],
          expected: 9,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "rb-q1",
      kind: "mcq",
      prompt: "boxes=[1,1]. Max points?",
      options: ["4", "2", "1", "3"],
      answer: 0,
      explanation: "Remove both together: 2²=4.",
      hints: ["Same color boxes merge."],
      objective: "Computation",
    },
  ],
  exam: {
    definition: "Maximize points removing boxes (k same-color → k² points).",
    steps: [
      "dp[l][r][k] with k extra same-color attached.",
      "Remove left group or merge with later same color.",
      "Return dp[0][n-1][0].",
    ],
    timeComplexity: "$O(n^4)$.",
    spaceComplexity: "$O(n^3)$.",
    correctness: "The k parameter captures delayed merging of same-color boxes.",
    applications: ["puzzle games"],
    limitations: ["O(n^4) limits to small n"],
    faq: [
      {
        q: "Why 3D?",
        a: "Need to track how many same-color boxes from outside the range will merge with boxes[l].",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["3D state explanation (2).", "Two choices (2).", "Complexity (1)."],
      },
    ],
  },
  references: [
    {
      citation: "LeetCode Problem 546: Remove Boxes.",
      supports: "3D interval DP.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
