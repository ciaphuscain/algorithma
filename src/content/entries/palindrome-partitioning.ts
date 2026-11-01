import type { AlgorithmEntry } from "../types";

export const palindromePartitioningEntry: AlgorithmEntry = {
  slug: "palindrome-partitioning",
  name: "Palindrome Partitioning",
  aliases: ["Min Cut Palindrome"],
  curriculum: [288],
  domain: "dynamic-programming",
  subcategory: "String DP",
  difficulty: "intermediate",
  summary:
    "Find minimum cuts to partition a string into palindromes. Two DPs: one precomputes palindrome ranges, another computes min cuts.",
  tags: ["palindrome", "partitioning", "dynamic programming"],
  prerequisites: ["longest-palindromic-substring"],
  related: ["longest-palindromic-substring"],
  problem: {
    input: "A string s.",
    output: "Minimum number of cuts to split s into palindromic substrings.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "If we know which substrings are palindromes, we can use DP: cuts[i] = min cuts to partition s[0..i].",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Precompute isPal[i][j] using expand-from-center or interval DP.",
          "cuts[i] = min over j<i where isPal[j+1][i] of (cuts[j]+1), or 0 if isPal[0][i].",
          "Return cuts[n-1].",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "O(n^2) time and space.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Time $O(n^2)$, space $O(n^2)$ for palindrome table.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Eertree (palindromic tree) can find all palindromic substrings in O(n) and help optimize.",
      },
    ],
  },
  complexity: {
    time: {
      worst: "O(n²)",
    },
    space: {
      worst: "O(n²)",
    },
  },
  properties: {
    worstClass: "other",
  },
  implementations: [
    {
      language: "python",
      entry: "minCutPalindrome",
      code: `def minCutPalindrome(s):
    n = len(s)
    if n <= 1:
        return 0
    pal = [[False] * n for _ in range(n)]
    for i in range(n):
        pal[i][i] = True
    for i in range(n - 1):
        pal[i][i + 1] = (s[i] == s[i + 1])
    for length in range(3, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            pal[i][j] = (s[i] == s[j]) and pal[i + 1][j - 1]
    cuts = list(range(n))
    for i in range(n):
        if pal[0][i]:
            cuts[i] = 0
        else:
            for j in range(i):
                if pal[j + 1][i]:
                    cuts[i] = min(cuts[i], cuts[j] + 1)
    return cuts[n - 1]`,
      tests: [
        {
          input: {
            s: "aab",
          },
          expected: 1,
        },
        {
          input: {
            s: "a",
          },
          expected: 0,
        },
        {
          input: {
            s: "abcba",
          },
          expected: 0,
        },
      ],
    },
    {
      language: "javascript",
      entry: "minCutPalindrome",
      code: `function minCutPalindrome(s) {
  const n = s.length;
  if (n <= 1) return 0;
  const pal = Array.from({length: n}, () => new Array(n).fill(false));
  for (let i = 0; i < n; i++) pal[i][i] = true;
  for (let i = 0; i < n - 1; i++) pal[i][i+1] = s[i] === s[i+1];
  for (let len = 3; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1;
      pal[i][j] = s[i] === s[j] && pal[i+1][j-1];
    }
  }
  const cuts = Array.from({length: n}, (_, i) => i);
  for (let i = 0; i < n; i++) {
    if (pal[0][i]) { cuts[i] = 0; continue; }
    for (let j = 0; j < i; j++) {
      if (pal[j+1][i]) cuts[i] = Math.min(cuts[i], cuts[j] + 1);
    }
  }
  return cuts[n - 1];
}`,
      tests: [
        {
          input: {
            s: "aab",
          },
          expected: 1,
        },
        {
          input: {
            s: "a",
          },
          expected: 0,
        },
        {
          input: {
            s: "abcba",
          },
          expected: 0,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "pp-q1",
      kind: "mcq",
      prompt: "Min cuts for 'abacaba'?",
      options: ["0", "1", "2", "3"],
      answer: 0,
      explanation: "'abacaba' is itself a palindrome, 0 cuts.",
      hints: ["Check if whole string is palindrome."],
      objective: "Computation",
    },
  ],
  exam: {
    definition: "Minimum cuts to partition string into palindromes.",
    steps: [
      "Precompute palindrome table.",
      "cuts[i] = min(cuts[j]+1) where s[j+1..i] palindrome.",
      "Return cuts[n-1].",
    ],
    timeComplexity: "$O(n^2)$.",
    spaceComplexity: "$O(n^2)$.",
    correctness: "Tries all valid palindromic last segments.",
    applications: ["text processing"],
    limitations: ["quadratic"],
    faq: [
      {
        q: "Why precompute palindromes?",
        a: "Checking palindromes on-the-fly would add O(n) per check, making it O(n^3).",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Palindrome precomputation (2).", "DP recurrence (2).", "Complexity (1)."],
      },
    ],
  },
  references: [
    {
      citation: "LeetCode Problem 132: Palindrome Partitioning II.",
      supports: "Min-cut palindrome partitioning.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
