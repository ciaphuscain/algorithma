import type { AlgorithmEntry } from "../types";

export const longestPalindromicSubstringEntry: AlgorithmEntry = {
  slug: "longest-palindromic-substring",
  name: "Longest Palindromic Substring",
  aliases: ["LPS Substring", "Manacher"],
  curriculum: [274],
  domain: "dynamic-programming",
  subcategory: "String DP",
  difficulty: "intermediate",
  summary:
    "Find the longest contiguous palindrome in a string. Expand-around-center gives O(n^2); Manacher's algorithm achieves O(n).",
  tags: ["palindrome", "string", "dynamic programming"],
  prerequisites: [],
  related: ["longest-palindromic-subsequence"],
  problem: {
    input: "A string s.",
    output: "Length of the longest palindromic substring.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Every palindrome has a center (or center pair). Expanding outward from each center finds the longest palindrome there.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "For each index i (and each pair i,i+1), expand while characters match.",
          "Track the longest palindrome found.",
          "Return its length.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Expand-around-center: O(n^2) time, O(1) space. Simple and practical.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Expand: $O(n^2)$ time, $O(1)$ space. Manacher's: $O(n)$ time, $O(n)$ space.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Manacher's algorithm uses previously computed palindrome radii to skip redundant comparisons, achieving linear time.",
      },
    ],
  },
  complexity: {
    time: { best: "O(n²)", average: "O(n²)", worst: "O(n²)" },
    space: "O(1)",
    worstClass: "other",
  },
  properties: [],
  implementations: [
    {
      language: "python",
      entry: "longestPalindromicSubstring",
      code: `def longestPalindromicSubstring(s):
    n = len(s)
    if n == 0:
        return 0
    best = 1
    def expand(l, r):
        while l >= 0 and r < n and s[l] == s[r]:
            l -= 1
            r += 1
        return r - l - 1
    for i in range(n):
        best = max(best, expand(i, i), expand(i, i + 1))
    return best`,
      tests: [
        {
          args: ["babad"],
          expected: 3,
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
      entry: "longestPalindromicSubstring",
      code: `function longestPalindromicSubstring(s) {
  const n = s.length;
  if (n === 0) return 0;
  let best = 1;
  function expand(l, r) {
    while (l >= 0 && r < n && s[l] === s[r]) { l--; r++; }
    return r - l - 1;
  }
  for (let i = 0; i < n; i++) {
    best = Math.max(best, expand(i, i), expand(i, i + 1));
  }
  return best;
}`,
      tests: [
        {
          args: ["babad"],
          expected: 3,
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
  ],
  visualizer: null,
  practice: [
    {
      id: "lpsub-q1",
      kind: "mcq",
      prompt: "Longest palindromic substring of 'racecar'?",
      options: ["7", "5", "3", "1"],
      answer: 0,
      explanation: "'racecar' itself is a palindrome of length 7.",
      hints: ["Check the whole string."],
      objective: "Computation",
    },
  ],
  exam: {
    definition: "Find longest contiguous palindrome in a string.",
    steps: ["Try each center.", "Expand while matching.", "Track longest."],
    timeComplexity: "$O(n^2)$ expand, $O(n)$ Manacher.",
    spaceComplexity: "$O(1)$ expand.",
    correctness: "Every palindrome has a center; we try all centers.",
    applications: ["text analysis", "bioinformatics"],
    limitations: ["O(n^2) for expand approach"],
    faq: [
      {
        q: "Substring vs subsequence?",
        a: "Substring is contiguous; subsequence allows gaps.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Center expansion (2).", "Odd and even cases (1).", "Manacher overview (2)."],
      },
    ],
  },
  references: [
    {
      citation:
        "G. Manacher, A New Linear-Time 'On-Line' Algorithm for Finding the Smallest Initial Palindrome, 1975.",
      supports: "Linear palindrome algorithm.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
