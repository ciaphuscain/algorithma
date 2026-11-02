import type { AlgorithmEntry } from "../types";

export const boyerMooreEntry: AlgorithmEntry = {
  slug: "boyer-moore",
  name: "Boyer-Moore",
  aliases: ["Boyer-Moore"],
  curriculum: [304],
  domain: "strings",
  subcategory: "Pattern Matching",
  difficulty: "intermediate",
  summary:
    "Searches for a pattern in text by scanning the pattern right-to-left, using bad-character and good-suffix heuristics to skip large portions of text.",
  tags: ["pattern matching", "string search", "bad character", "good suffix"],
  prerequisites: ["Naive String Matching"],
  related: ["boyer-moore-horspool", "kmp"],
  problem: {
    input: "A text string and a pattern string.",
    output: "All starting positions where the pattern occurs in the text.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Compare the pattern from right to left. On a mismatch, use two rules to skip ahead: the bad-character rule shifts based on where the mismatched character appears in the pattern; the good-suffix rule shifts based on matching suffixes within the pattern.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Precompute the bad-character table: for each character in the alphabet, store its last occurrence in the pattern.",
          "Align the pattern at the start of the text.",
          "Compare characters from right to left.",
          "On a mismatch, shift by the maximum of the bad-character and good-suffix shifts.",
          "On a full match, record the position and shift by the good-suffix rule.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "This simplified version uses only the bad-character heuristic. The full Boyer-Moore also uses the good-suffix rule for better worst-case performance.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Best case $O(n/m)$ — the bad-character rule can skip $m$ positions at a time. Worst case $O(nm)$ with bad-character only, but $O(n+m)$ with the full good-suffix rule.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "The Horspool variant uses only the bad-character rule with the text character aligned with the end of the pattern.",
          "The Turbo-BM variant avoids redundant comparisons for O(n) worst case.",
          "Boyer-Moore is often the fastest practical algorithm for single-pattern search.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n/m)",
      average: "O(n)",
      worst: "O(n * m)",
    },
    space: "O(m + σ)",
    worstClass: "n",
    note: "σ is alphabet size. With full good-suffix rule, worst case is O(n + m).",
  },
  properties: [
    {
      label: "Scan direction",
      value: "Right to left",
    },
    {
      label: "Preprocessing",
      value: "O(m + σ)",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "boyer_moore",
      code: `def boyer_moore(text, pattern):
    """Return all starting indices where pattern occurs in text."""
    n, m = len(text), len(pattern)
    if m == 0: return []
    if m > n: return []
    # Bad character table
    bad = {}
    for i in range(m):
        bad[pattern[i]] = i
    results = []
    s = 0
    while s <= n - m:
        j = m - 1
        while j >= 0 and pattern[j] == text[s + j]:
            j -= 1
        if j < 0:
            results.append(s)
            s += m - bad.get(text[s + m], -1) if s + m < n else 1
        else:
            shift = j - bad.get(text[s + j], -1)
            s += max(1, shift)
    return results
`,
      tests: [
        {
          args: ["ABAAABCDABC", "ABC"],
          expected: [4, 8],
        },
        {
          args: ["AAAAAA", "AAA"],
          expected: [0, 1, 2, 3],
        },
        {
          args: ["hello", "xyz"],
          expected: [],
        },
      ],
    },
    {
      language: "javascript",
      entry: "boyerMoore",
      code: `function boyerMoore(text, pattern) {
  const n = text.length, m = pattern.length;
  if (m === 0 || m > n) return [];
  const bad = {};
  for (let i = 0; i < m; i++) bad[pattern[i]] = i;
  const results = [];
  let s = 0;
  while (s <= n - m) {
    let j = m - 1;
    while (j >= 0 && pattern[j] === text[s + j]) j--;
    if (j < 0) {
      results.push(s);
      s += s + m < n ? m - (bad[text[s + m]] ?? -1) : 1;
    } else {
      s += Math.max(1, j - (bad[text[s + j]] ?? -1));
    }
  }
  return results;
}
`,
      tests: [
        {
          args: ["ABAAABCDABC", "ABC"],
          expected: [4, 8],
        },
        {
          args: ["hello", "xyz"],
          expected: [],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "boyer-moore-q1",
      kind: "mcq",
      prompt: "What is the best-case time complexity of Boyer-Moore?",
      options: ["O(n/m)", "O(n)", "O(n*m)", "O(m)"],
      answer: 0,
      explanation:
        "When the last character of the pattern mismatches every time, the algorithm can skip m positions, scanning only n/m characters.",
      hints: ["Think about what happens when the last character never matches."],
      objective: "Best case",
    },
  ],
  exam: {
    definition:
      "Boyer-Moore searches for a pattern by comparing right-to-left and using bad-character and good-suffix heuristics to skip text.",
    steps: [
      "Precompute bad-character table.",
      "Align pattern, compare right-to-left.",
      "On mismatch, shift by max of heuristics.",
      "On match, record and shift.",
    ],
    timeComplexity: "$O(n/m)$ best, $O(nm)$ worst (bad-char only), $O(n+m)$ with full rules.",
    spaceComplexity: "$O(m + \\sigma)$.",
    correctness: "The shift rules never skip a valid alignment, so all occurrences are found.",
    applications: ["text editors", "grep-like tools", "DNA sequence search"],
    limitations: ["Bad-character only variant has O(nm) worst case"],
    faq: [
      {
        q: "Why scan right to left?",
        a: "Right-to-left scanning allows the bad-character rule to skip large portions of text when a mismatch occurs near the end of the pattern.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define the two heuristics (2).",
          "Describe the algorithm (2).",
          "Analyze complexity (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "R. S. Boyer and J. S. Moore, 'A Fast String Searching Algorithm', CACM, 1977.",
      supports: "Original paper.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
