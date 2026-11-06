import type { AlgorithmEntry } from "../types";

export const damerauLevenshteinDistanceEntry: AlgorithmEntry = {
  slug: "damerau-levenshtein-distance",
  name: "Damerau-Levenshtein Distance",
  aliases: ["DL Distance", "Optimal String Alignment"],
  curriculum: [277],
  domain: "dynamic-programming",
  subcategory: "String DP",
  difficulty: "intermediate",
  summary:
    "Edit distance allowing insertions, deletions, substitutions, and adjacent transpositions. Extends Levenshtein with a swap operation.",
  tags: ["edit distance", "dynamic programming", "strings"],
  prerequisites: ["edit-distance-levenshtein"],
  related: ["sequence-alignment-needleman-wunsch"],
  problem: {
    input: "Two strings a and b.",
    output: "Minimum edits (insert, delete, substitute, transpose adjacent) to transform a into b.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Like Levenshtein, but we also check if swapping two adjacent characters helps. If a[i-1]==b[j-2] and a[i-2]==b[j-1], we can transpose.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "dp[i][j] = min of: dp[i-1][j]+1, dp[i][j-1]+1, dp[i-1][j-1] + (0 if match, 1 if not).",
          "If i>=2, j>=2, and a[i-1]==b[j-2] and a[i-2]==b[j-1]: also consider dp[i-2][j-2]+1.",
          "Return dp[m][n].",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Optimal String Alignment variant (no substring reuse after transposition). Full DL uses a more complex algorithm.",
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
        text: "The unrestricted DL distance uses a different algorithm with a 'last occurrence' table. OSA distance ≥ true DL distance.",
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
      entry: "damerauLevenshtein",
      code: `def damerauLevenshtein(a, b):
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            cost = 0 if a[i-1] == b[j-1] else 1
            dp[i][j] = min(dp[i-1][j] + 1, dp[i][j-1] + 1, dp[i-1][j-1] + cost)
            if i >= 2 and j >= 2 and a[i-1] == b[j-2] and a[i-2] == b[j-1]:
                dp[i][j] = min(dp[i][j], dp[i-2][j-2] + 1)
    return dp[m][n]`,
      tests: [
        {
          args: ["ca", "abc"],
          expected: 3,
        },
        {
          args: ["kitten", "sitting"],
          expected: 3,
        },
        {
          args: ["", "abc"],
          expected: 3,
        },
      ],
    },
    {
      language: "javascript",
      entry: "damerauLevenshtein",
      code: `function damerauLevenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({length: m + 1}, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i-1] === b[j-1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i-1][j] + 1, dp[i][j-1] + 1, dp[i-1][j-1] + cost);
      if (i >= 2 && j >= 2 && a[i-1] === b[j-2] && a[i-2] === b[j-1])
        dp[i][j] = Math.min(dp[i][j], dp[i-2][j-2] + 1);
    }
  }
  return dp[m][n];
}`,
      tests: [
        {
          args: ["ca", "abc"],
          expected: 3,
        },
        {
          args: ["kitten", "sitting"],
          expected: 3,
        },
        {
          args: ["", "abc"],
          expected: 3,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "dl-q1",
      kind: "mcq",
      prompt: "DL distance between 'ab' and 'ba'?",
      options: ["1", "2", "0", "3"],
      answer: 0,
      explanation: "Single transposition.",
      hints: ["Can we swap adjacent characters?"],
      objective: "Computation",
    },
  ],
  exam: {
    definition: "Minimum edits (insert, delete, substitute, transpose) between strings.",
    steps: ["Init borders.", "Fill dp with 4 operations.", "Transposition check for i>=2,j>=2."],
    timeComplexity: "$O(mn)$.",
    spaceComplexity: "$O(mn)$.",
    correctness: "All four operations captured in recurrence.",
    applications: ["spell checking", "DNA analysis"],
    limitations: ["OSA variant, not unrestricted DL"],
    faq: [
      {
        q: "OSA vs full DL?",
        a: "OSA forbids editing a transposed substring further; full DL allows it.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Four operations (2).", "Transposition condition (1).", "Complexity (2)."],
      },
    ],
  },
  references: [
    {
      citation:
        "F. J. Damerau, A technique for computer detection and correction of spelling errors, 1964.",
      supports: "Original transposition extension.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
