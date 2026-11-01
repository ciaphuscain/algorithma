import type { AlgorithmEntry } from "../types";

export const wildcardPatternMatchingEntry: AlgorithmEntry = {
  slug: "wildcard-pattern-matching",
  name: "Wildcard Pattern Matching",
  aliases: ["Glob Matching"],
  curriculum: [348],
  domain: "strings",
  subcategory: "Pattern Matching",
  difficulty: "intermediate",
  summary:
    "Matches a string against a pattern with '?' (any single char) and '*' (any sequence) using DP or greedy backtracking.",
  tags: ["wildcard", "pattern matching", "dynamic programming"],
  prerequisites: [],
  related: ["regular-expression-matching-dp"],
  problem: {
    input: "A string s and pattern p with '?' and '*'.",
    output: "Whether the entire string matches the pattern.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "'?' matches exactly one character, '*' matches any sequence (including empty). Build a DP table or use greedy matching with backtracking on '*'.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "DP: dp[i][j] = s[0..i-1] matches p[0..j-1].",
          "If p[j-1] is '*': dp[i][j] = dp[i][j-1] (empty match) OR dp[i-1][j] (extend match).",
          "If p[j-1] is '?' or matches s[i-1]: dp[i][j] = dp[i-1][j-1].",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Greedy approach: track the last '*' position and backtrack to it on mismatch. O(mn) worst case but often faster in practice.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "DP is $O(mn)$ time and space. Greedy is $O(mn)$ worst case but $O(n)$ amortized for most patterns.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Wildcard matching is simpler than regex: '*' is independent (not tied to a preceding char) and '?' is exactly one char, not zero or one.",
      },
    ],
  },
  complexity: {
    worstClass: "n",
    best: "$O(n)$",
    average: "$O(mn)$",
    worst: "$O(mn)$",
    space: "$O(mn)$",
  },
  properties: [],
  implementations: [
    {
      language: "python",
      entry: "wildcard_pattern_matching",
      code: `def is_match(s: str, p: str) -> bool:
    m, n = len(s), len(p)
    dp = [[False] * (n + 1) for _ in range(m + 1)]
    dp[0][0] = True
    for j in range(1, n + 1):
        if p[j - 1] == "*":
            dp[0][j] = dp[0][j - 1]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if p[j - 1] == "*":
                dp[i][j] = dp[i][j - 1] or dp[i - 1][j]
            elif p[j - 1] == "?" or p[j - 1] == s[i - 1]:
                dp[i][j] = dp[i - 1][j - 1]
    return dp[m][n]
`,
      tests: [
        {
          args: ["adceb", "*a*b"],
          expected: true,
        },
        {
          args: ["acdcb", "a*c?b"],
          expected: false,
        },
        {
          args: ["", "*"],
          expected: true,
        },
      ],
    },
    {
      language: "javascript",
      entry: "wildcardPatternMatching",
      code: `function isMatch(s, p) {
  const m = s.length, n = p.length;
  const dp = Array.from({length: m+1}, () => new Array(n+1).fill(false));
  dp[0][0] = true;
  for (let j = 1; j <= n; j++) if (p[j-1] === "*") dp[0][j] = dp[0][j-1];
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {
    if (p[j-1] === "*") dp[i][j] = dp[i][j-1] || dp[i-1][j];
    else if (p[j-1] === "?" || p[j-1] === s[i-1]) dp[i][j] = dp[i-1][j-1];
  }
  return dp[m][n];
}
`,
      tests: [
        {
          args: ["adceb", "*a*b"],
          expected: true,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "wc-q1",
      kind: "mcq",
      prompt: "Does '*' match the empty string?",
      options: ["Yes", "No", "Only at the end", "Only at the start"],
      answer: 0,
      explanation: "'*' matches any sequence including empty.",
      hints: ["Zero length."],
      objective: "Empty match",
    },
  ],
  exam: {
    definition: "DP matching for '?' (one char) and '*' (any sequence).",
    steps: ["dp[i][j] transitions based on *, ?, or character match."],
    timeComplexity: "$O(mn)$.",
    spaceComplexity: "$O(mn)$.",
    correctness: "All subsequences explored.",
    applications: ["File glob matching", "simplified search"],
    limitations: ["O(mn) can be slow for very long strings"],
    faq: [
      {
        q: "How is * different from regex *?",
        a: "Wildcard * matches any sequence independently; regex * means zero or more of the preceding character.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["DP recurrence (2).", "Difference from regex (1)."],
      },
    ],
  },
  references: [
    {
      citation: "LeetCode Problem 44, 'Wildcard Matching'.",
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
