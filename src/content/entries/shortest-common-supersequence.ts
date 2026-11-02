import type { AlgorithmEntry } from "../types";

export const shortestCommonSupersequenceEntry: AlgorithmEntry = {
  slug: "shortest-common-supersequence",
  name: "Shortest Common Supersequence",
  aliases: ["SCS"],
  curriculum: [275],
  domain: "dynamic-programming",
  subcategory: "String DP",
  difficulty: "intermediate",
  summary:
    "Find the shortest string that has both input strings as subsequences. Length = m + n - LCS(a,b).",
  tags: ["supersequence", "LCS", "dynamic programming"],
  prerequisites: ["longest-common-subsequence"],
  related: ["longest-common-substring"],
  problem: {
    input: "Two strings a and b.",
    output: "Length of the shortest common supersequence.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "The SCS merges both strings, sharing their LCS. So SCS length = |a| + |b| - LCS(a,b).",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Compute LCS length via standard DP.",
          "SCS length = m + n - lcs_length.",
          "Traceback through LCS DP to construct the actual SCS.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "LCS DP is O(mn). Traceback merges characters following the DP table.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Time $O(mn)$, space $O(mn)$.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Hirschberg can reduce space to O(min(m,n)) for length only. Constructing the string needs O(mn) or divide-and-conquer.",
      },
    ],
  },
  complexity: {
    time: { best: "O(m·n)", average: "O(m·n)", worst: "O(m·n)" },
    space: "O(m·n)",
    worstClass: "other",
  },
  properties: [],
  implementations: [
    {
      language: "python",
      entry: "shortestCommonSupersequence",
      code: `def shortestCommonSupersequence(a, b):
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if a[i-1] == b[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return m + n - dp[m][n]`,
      tests: [
        {
          args: ["abac", "cab"],
          expected: 5,
        },
        {
          args: ["abc", "abc"],
          expected: 3,
        },
      ],
    },
    {
      language: "javascript",
      entry: "shortestCommonSupersequence",
      code: `function shortestCommonSupersequence(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({length: m + 1}, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] + 1 : Math.max(dp[i-1][j], dp[i][j-1]);
    }
  }
  return m + n - dp[m][n];
}`,
      tests: [
        {
          args: ["abac", "cab"],
          expected: 5,
        },
        {
          args: ["abc", "abc"],
          expected: 3,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "scs-q1",
      kind: "mcq",
      prompt: "SCS('abc','adc')=?",
      options: ["4", "5", "3", "6"],
      answer: 0,
      explanation: "LCS='ac'(len 2), SCS=3+3-2=4.",
      hints: ["SCS = m + n - LCS."],
      objective: "Computation",
    },
  ],
  exam: {
    definition: "Shortest string having both inputs as subsequences.",
    steps: ["Compute LCS.", "SCS = m + n - LCS.", "Traceback for actual string."],
    timeComplexity: "$O(mn)$.",
    spaceComplexity: "$O(mn)$.",
    correctness: "SCS shares the LCS and fills remaining characters.",
    applications: ["data compression", "bioinformatics"],
    limitations: ["quadratic time/space"],
    faq: [
      {
        q: "Relation to LCS?",
        a: "SCS length = m + n - LCS length.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["LCS reduction (2).", "Formula (1).", "Traceback (2)."],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "LCS-based SCS.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
