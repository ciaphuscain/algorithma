import type { AlgorithmEntry } from "../types";

export const longestCommonSubstringEntry: AlgorithmEntry = {
  slug: "longest-common-substring",
  name: "Longest Common Substring",
  aliases: ["Longest Common Substring", "LCSubstring"],
  curriculum: [272],
  domain: "dynamic-programming",
  subcategory: "String DP",
  difficulty: "intermediate",
  summary:
    "Finds the length of the longest contiguous substring common to two strings using a 2D DP table.",
  tags: ["substring", "string", "dynamic programming"],
  prerequisites: ["Edit Distance"],
  related: ["lcs"],
  problem: {
    input: "Two strings s1 and s2.",
    output: "Length of their longest common substring.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Build a table where dp[i][j] = length of the longest common suffix of s1[0..i-1] and s2[0..j-1]. If s1[i-1] == s2[j-1], extend from dp[i-1][j-1]; otherwise 0 (substrings must be contiguous).",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Create (m+1)×(n+1) table, initialized to 0.",
          "If s1[i-1] == s2[j-1]: dp[i][j] = dp[i-1][j-1] + 1.",
          "Otherwise dp[i][j] = 0.",
          "Track the maximum value seen.",
        ],
      },
      {
        kind: "p",
        text: "**Example.** s1='abcde', s2='abfce'. Common substrings: 'ab' (len 2), 'ce' (len 2). Answer: 2.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Only the previous row is needed, so O(min(m,n)) space suffices.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Time $O(mn)$, space $O(\\min(m,n))$. Unlike LCS (subsequence), mismatches reset the count to 0.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Suffix arrays can find it in O(m+n) time.",
          "Generalize to k strings with suffix array + LCP array.",
          "The substring constraint (contiguous) makes this different from LCS (subsequence).",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(m * n)",
      average: "O(m * n)",
      worst: "O(m * n)",
    },
    space: "O(min(m, n))",
    worstClass: "other",
  },
  properties: [
    {
      label: "Contiguous",
      value: "Yes (unlike LCS which allows gaps)",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "longest_common_substr",
      code: `def longest_common_substr(s1, s2):
    m, n = len(s1), len(s2)
    prev = [0] * (n + 1)
    best = 0
    for i in range(1, m + 1):
        cur = [0] * (n + 1)
        for j in range(1, n + 1):
            if s1[i-1] == s2[j-1]:
                cur[j] = prev[j-1] + 1
                if cur[j] > best:
                    best = cur[j]
        prev = cur
    return best
`,
      tests: [
        {
          args: ["abcde", "abfce"],
          expected: 2,
        },
        {
          args: ["abc", "abc"],
          expected: 3,
        },
        {
          args: ["abc", "def"],
          expected: 0,
        },
      ],
    },
    {
      language: "javascript",
      entry: "longestCommonSubstr",
      code: `function longestCommonSubstr(s1, s2) {
  const m = s1.length, n = s2.length;
  let prev = new Array(n + 1).fill(0), best = 0;
  for (let i = 1; i <= m; i++) {
    const cur = new Array(n + 1).fill(0);
    for (let j = 1; j <= n; j++) {
      if (s1[i-1] === s2[j-1]) {
        cur[j] = prev[j-1] + 1;
        if (cur[j] > best) best = cur[j];
      }
    }
    prev = cur;
  }
  return best;
}
`,
      tests: [
        {
          args: ["abcde", "abfce"],
          expected: 2,
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
      id: "lc-substr-q1",
      kind: "mcq",
      prompt: "What is the longest common substring of 'abcxyz' and 'xyzabc'?",
      options: ["3", "6", "0", "1"],
      answer: 0,
      explanation: "'abc' and 'xyz' are both length 3.",
      hints: ["Look for 'abc' or 'xyz' in both strings."],
      objective: "Computation",
    },
  ],
  exam: {
    definition: "Find longest contiguous substring common to two strings.",
    steps: ["dp[i][j] = dp[i-1][j-1]+1 if chars match, else 0.", "Track max."],
    timeComplexity: "$O(mn)$.",
    spaceComplexity: "$O(\\min(m,n))$.",
    correctness: "dp[i][j] correctly represents the longest common suffix ending at positions i,j.",
    applications: ["plagiarism detection", "DNA analysis"],
    limitations: ["O(mn) time for long strings"],
    faq: [
      {
        q: "How is this different from LCS?",
        a: "Substring must be contiguous; subsequence allows gaps.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define dp table (1).",
          "Recurrence with reset to 0 (2).",
          "Space optimization (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "String algorithms.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
