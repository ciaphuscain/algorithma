import type { AlgorithmEntry } from "../types";

export const stringInterleavingDpEntry: AlgorithmEntry = {
  slug: "string-interleaving-dp",
  name: "String Interleaving (DP)",
  aliases: ["Interleaving String"],
  curriculum: [347],
  domain: "strings",
  subcategory: "Dynamic Programming",
  difficulty: "intermediate",
  summary: "Determines whether a string is an interleaving of two other strings using DP.",
  tags: ["interleaving", "dynamic programming", "string"],
  prerequisites: [],
  related: ["regular-expression-matching-dp"],
  problem: {
    input: "Strings s1, s2, s3.",
    output: "Whether s3 is formed by interleaving s1 and s2.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "s3 is an interleaving of s1 and s2 if we can split s3 into characters from s1 and s2, maintaining their relative order. Use dp[i][j] = whether s1[0..i-1] and s2[0..j-1] can form s3[0..i+j-1].",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "If |s1|+|s2| != |s3|, return false.",
          "dp[0][0] = true.",
          "Fill first row: dp[0][j] = dp[0][j-1] AND s2[j-1]==s3[j-1].",
          "Fill first col: dp[i][0] = dp[i-1][0] AND s1[i-1]==s3[i-1].",
          "dp[i][j] = (dp[i-1][j] AND s1[i-1]==s3[i+j-1]) OR (dp[i][j-1] AND s2[j-1]==s3[i+j-1]).",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Can optimize space to O(min(m,n)) using a single row.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "$O(mn)$ time and $O(mn)$ space, reducible to $O(\\min(m,n))$ space.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "The problem is equivalent to finding a path in a grid from (0,0) to (m,n) where right moves consume s2 characters and down moves consume s1 characters.",
      },
    ],
  },
  complexity: {
    worstClass: "n",
    best: "$O(mn)$",
    average: "$O(mn)$",
    worst: "$O(mn)$",
    space: "$O(mn)$",
  },
  properties: [],
  implementations: [
    {
      language: "python",
      entry: "string_interleaving_dp",
      code: `def is_interleave(s1: str, s2: str, s3: str) -> bool:
    m, n = len(s1), len(s2)
    if m + n != len(s3):
        return False
    dp = [[False] * (n + 1) for _ in range(m + 1)]
    dp[0][0] = True
    for j in range(1, n + 1):
        dp[0][j] = dp[0][j - 1] and s2[j - 1] == s3[j - 1]
    for i in range(1, m + 1):
        dp[i][0] = dp[i - 1][0] and s1[i - 1] == s3[i - 1]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            dp[i][j] = (dp[i - 1][j] and s1[i - 1] == s3[i + j - 1]) or                        (dp[i][j - 1] and s2[j - 1] == s3[i + j - 1])
    return dp[m][n]
`,
      tests: [
        {
          args: ["aab", "axy", "aaxaby"],
          expected: true,
        },
        {
          args: ["ab", "cd", "acbd"],
          expected: true,
        },
        {
          args: ["ab", "cd", "abdc"],
          expected: true,
        },
        {
          args: ["ab", "cd", "adcb"],
          expected: false,
        },
      ],
    },
    {
      language: "javascript",
      entry: "stringInterleavingDp",
      code: `function isInterleave(s1, s2, s3) {
  const m = s1.length, n = s2.length;
  if (m + n !== s3.length) return false;
  const dp = Array.from({length: m + 1}, () => new Array(n + 1).fill(false));
  dp[0][0] = true;
  for (let j = 1; j <= n; j++) dp[0][j] = dp[0][j-1] && s2[j-1] === s3[j-1];
  for (let i = 1; i <= m; i++) dp[i][0] = dp[i-1][0] && s1[i-1] === s3[i-1];
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++)
    dp[i][j] = (dp[i-1][j] && s1[i-1] === s3[i+j-1]) || (dp[i][j-1] && s2[j-1] === s3[i+j-1]);
  return dp[m][n];
}
`,
      tests: [
        {
          args: ["ab", "cd", "acbd"],
          expected: true,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "si-q1",
      kind: "mcq",
      prompt: "Is 'adcb' an interleaving of 'ab' and 'cd'?",
      options: ["No", "Yes", "Only with repetition", "Depends on order"],
      answer: 0,
      explanation: "'adcb' requires d before c, violating the order of 'cd'.",
      hints: ["Track relative order."],
      objective: "Order",
    },
  ],
  exam: {
    definition: "DP to check if s3 interleaves s1 and s2 preserving character order.",
    steps: ["Check lengths.", "Fill dp[i][j] using s1[i-1] or s2[j-1] matching s3[i+j-1]."],
    timeComplexity: "$O(mn)$.",
    spaceComplexity: "$O(mn)$, reducible to $O(n)$.",
    correctness: "All valid interleavings explored via the 2D recurrence.",
    applications: ["Merge validation", "version control merging"],
    limitations: ["Exponential number of actual interleavings; DP only decides existence"],
    faq: [
      {
        q: "Can BFS solve this?",
        a: "Yes, BFS on the (i,j) grid also works in O(mn).",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Recurrence (2).", "Base cases (1).", "Grid analogy (1)."],
      },
    ],
  },
  references: [
    {
      citation: "LeetCode Problem 97, 'Interleaving String'.",
      supports: "Classic formulation.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
