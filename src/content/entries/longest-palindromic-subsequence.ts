import type { AlgorithmEntry } from "../types";

export const longestPalindromicSubsequenceEntry: AlgorithmEntry = {
  slug: "longest-palindromic-subsequence",
  name: "Longest Palindromic Subsequence",
  aliases: ["Longest Palindromic Subsequence", "LPS"],
  curriculum: [273],
  domain: "dynamic-programming",
  subcategory: "String DP",
  difficulty: "intermediate",
  summary:
    "Finds the length of the longest subsequence of a string that reads the same forwards and backwards.",
  tags: ["palindrome", "subsequence", "dynamic programming", "string"],
  prerequisites: ["LCS"],
  related: ["longest-palindromic-substring", "lcs"],
  problem: {
    input: "A string s.",
    output: "Length of the longest palindromic subsequence.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "The longest palindromic subsequence of s is the LCS of s and its reverse. Alternatively, dp[i][j] = length of LPS in s[i..j].",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "dp[i][i] = 1 for all i (single char is a palindrome).",
          "For length 2 to n: if s[i] == s[j], dp[i][j] = dp[i+1][j-1] + 2.",
          "Otherwise dp[i][j] = max(dp[i+1][j], dp[i][j-1]).",
          "Return dp[0][n-1].",
        ],
      },
      {
        kind: "p",
        text: "**Example.** 'bbbab': LPS = 'bbbb', length 4.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Fill diagonally or by substring length. Can also reduce to LCS(s, reverse(s)).",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Time $O(n^2)$, space $O(n^2)$ or $O(n)$ with rolling arrays.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "LPS = LCS(s, reverse(s)).",
          "Minimum deletions to make palindrome = n - LPS(s).",
          "Can recover the actual subsequence by backtracking through the DP table.",
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
  },
  properties: [
    {
      label: "Equivalent to",
      value: "LCS(s, reverse(s))",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "lps",
      code: `def lps(s):
    n = len(s)
    if n == 0:
        return 0
    dp = [[0]*n for _ in range(n)]
    for i in range(n):
        dp[i][i] = 1
    for length in range(2, n+1):
        for i in range(n-length+1):
            j = i + length - 1
            if s[i] == s[j]:
                dp[i][j] = dp[i+1][j-1] + 2 if length > 2 else 2
            else:
                dp[i][j] = max(dp[i+1][j], dp[i][j-1])
    return dp[0][n-1]
`,
      tests: [
        {
          args: ["bbbab"],
          expected: 4,
        },
        {
          args: ["cbbd"],
          expected: 2,
        },
        {
          args: ["a"],
          expected: 1,
        },
      ],
    },
    {
      language: "javascript",
      entry: "lps",
      code: `function lps(s) {
  const n = s.length;
  if (n === 0) return 0;
  const dp = Array.from({length: n}, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) dp[i][i] = 1;
  for (let len = 2; len <= n; len++)
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1;
      if (s[i] === s[j]) dp[i][j] = (len > 2 ? dp[i+1][j-1] : 0) + 2;
      else dp[i][j] = Math.max(dp[i+1][j], dp[i][j-1]);
    }
  return dp[0][n-1];
}
`,
      tests: [
        {
          args: ["bbbab"],
          expected: 4,
        },
        {
          args: ["cbbd"],
          expected: 2,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "lps-q1",
      kind: "mcq",
      prompt: "What is the LPS length of 'character'?",
      options: ["5", "3", "4", "6"],
      answer: 0,
      explanation: "The LPS is 'carac' (length 5).",
      hints: ["A subsequence can skip characters."],
      objective: "Computation",
    },
  ],
  exam: {
    definition: "Find longest subsequence of a string that is a palindrome.",
    steps: [
      "dp[i][i] = 1.",
      "If s[i]==s[j]: dp[i][j] = dp[i+1][j-1]+2.",
      "Else: max(dp[i+1][j], dp[i][j-1]).",
    ],
    timeComplexity: "$O(n^2)$.",
    spaceComplexity: "$O(n^2)$.",
    correctness: "Matching endpoints extend the inner LPS by 2; mismatches try both exclusions.",
    applications: ["bioinformatics", "text analysis"],
    limitations: ["O(n^2) for long strings"],
    faq: [
      {
        q: "How is this different from longest palindromic substring?",
        a: "Subsequence allows gaps; substring must be contiguous.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Define interval DP (1).", "Recurrence (2).", "LCS equivalence (2)."],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "Dynamic programming.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
