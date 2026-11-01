import type { AlgorithmEntry } from "../types";

export const regularExpressionMatchingDpEntry: AlgorithmEntry = {
  slug: "regular-expression-matching-dp",
  name: "Regular Expression Matching (DP)",
  aliases: ["Regex Matching DP"],
  curriculum: [349],
  domain: "strings",
  subcategory: "Pattern Matching",
  difficulty: "intermediate",
  summary:
    "Matches a string against a pattern with '.' (any char) and '*' (zero or more of preceding) using dynamic programming.",
  tags: ["regex", "dynamic programming", "pattern matching"],
  prerequisites: [],
  related: ["wildcard-pattern-matching"],
  problem: {
    input: "A string s and pattern p with '.' and '*'.",
    output: "Whether s fully matches p.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Build a 2D table where dp[i][j] = true if s[0..i-1] matches p[0..j-1]. Handle '*' by considering zero or more repetitions of the preceding character.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "dp[0][0] = true.",
          "First row: dp[0][j] = true if p[j-1]=='*' and dp[0][j-2].",
          "For each cell: if p[j-1]=='*':",
          "  dp[i][j] = dp[i][j-2] (zero occurrences)",
          "  OR (s[i-1] matches p[j-2]) AND dp[i-1][j] (one more occurrence).",
          "Otherwise: dp[i][j] = dp[i-1][j-1] AND (s[i-1] matches p[j-1]).",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "'.' matches any single character. '*' means zero or more of the character before it.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "$O(mn)$ time and space where m=|s|, n=|p|.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "This DP handles the specific regex subset of '.', '*'. Full regex matching (with '+', '?', character classes) requires NFA-based approaches like Thompson's construction.",
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
      entry: "regex_matching_dp",
      code: `def is_match(s: str, p: str) -> bool:
    m, n = len(s), len(p)
    dp = [[False] * (n + 1) for _ in range(m + 1)]
    dp[0][0] = True
    for j in range(1, n + 1):
        if p[j - 1] == "*" and j >= 2:
            dp[0][j] = dp[0][j - 2]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if p[j - 1] == "*":
                dp[i][j] = dp[i][j - 2]
                if p[j - 2] == "." or p[j - 2] == s[i - 1]:
                    dp[i][j] = dp[i][j] or dp[i - 1][j]
            elif p[j - 1] == "." or p[j - 1] == s[i - 1]:
                dp[i][j] = dp[i - 1][j - 1]
    return dp[m][n]
`,
      tests: [
        {
          args: ["aa", "a*"],
          expected: true,
        },
        {
          args: ["ab", ".*"],
          expected: true,
        },
        {
          args: ["ab", "a"],
          expected: false,
        },
      ],
    },
    {
      language: "javascript",
      entry: "regexMatchingDp",
      code: `function isMatch(s, p) {
  const m = s.length, n = p.length;
  const dp = Array.from({length: m + 1}, () => new Array(n + 1).fill(false));
  dp[0][0] = true;
  for (let j = 1; j <= n; j++) if (p[j-1] === "*" && j >= 2) dp[0][j] = dp[0][j-2];
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {
    if (p[j-1] === "*") {
      dp[i][j] = dp[i][j-2];
      if (p[j-2] === "." || p[j-2] === s[i-1]) dp[i][j] = dp[i][j] || dp[i-1][j];
    } else if (p[j-1] === "." || p[j-1] === s[i-1]) dp[i][j] = dp[i-1][j-1];
  }
  return dp[m][n];
}
`,
      tests: [
        {
          args: ["aa", "a*"],
          expected: true,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "regex-q1",
      kind: "mcq",
      prompt: "Does 'a*' match the empty string?",
      options: ["Yes", "No", "Only with '.'", "Depends on implementation"],
      answer: 0,
      explanation: "'*' means zero or more, so 'a*' matches zero 'a's.",
      hints: ["Zero matches."],
      objective: "Zero match",
    },
  ],
  exam: {
    definition: "DP matching for patterns with '.' (any char) and '*' (zero or more).",
    steps: [
      "Build dp[m+1][n+1] table.",
      "Handle '*' as zero or more.",
      "'. ' matches any character.",
    ],
    timeComplexity: "$O(mn)$.",
    spaceComplexity: "$O(mn)$.",
    correctness: "All subproblems considered via recurrence.",
    applications: ["Text editors", "simplified regex engines"],
    limitations: ["Only handles '.' and '*'; no character classes or alternation"],
    faq: [
      {
        q: "How does this relate to Thompson NFA?",
        a: "This DP is specific to '.' and '*'; Thompson handles full regex.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Recurrence (2).", "Base cases (1).", "Complexity (1)."],
      },
    ],
  },
  references: [
    {
      citation: "LeetCode Problem 10, 'Regular Expression Matching'.",
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
