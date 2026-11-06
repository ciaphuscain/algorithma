import type { AlgorithmEntry } from "../types";

export const sundayAlgorithmEntry: AlgorithmEntry = {
  slug: "sunday-algorithm",
  name: "Sunday Algorithm",
  aliases: ["Sunday Algorithm"],
  curriculum: [306],
  domain: "strings",
  subcategory: "Pattern Matching",
  difficulty: "intermediate",
  summary:
    "A pattern matching algorithm that shifts based on the character just past the current window, often achieving larger shifts than Horspool.",
  tags: ["pattern matching", "string search", "sunday"],
  prerequisites: ["Boyer-Moore-Horspool"],
  related: ["boyer-moore-horspool", "boyer-moore"],
  problem: {
    input: "A text string and a pattern string.",
    output: "All starting positions where the pattern occurs.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "After a mismatch, the character at text[s + m] (one past the window) must appear somewhere in the pattern for any shifted alignment to match. Use its position to compute the shift.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Build shift table: for each char c, shift = m + 1 - last position of c in pattern (m+1 if absent).",
          "Compare pattern against text at current position (any direction).",
          "On mismatch, shift based on text[s + m].",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "The shift table uses the character at position s + m, which is one past the current alignment window.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Average case $O(n/m)$ or better, since looking one past the window often gives larger shifts. Worst case $O(nm)$.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Sunday's algorithm can give larger shifts than Horspool.",
          "Best suited for short patterns on large alphabets.",
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
    space: "O(σ)",
    worstClass: "n",
  },
  properties: [
    {
      label: "Shift character",
      value: "text[s + m] (one past window)",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "sunday_search",
      code: `def sunday_search(text, pattern):
    n, m = len(text), len(pattern)
    if m == 0 or m > n: return []
    shift = {}
    for i in range(m):
        shift[pattern[i]] = m - i
    results = []
    s = 0
    while s <= n - m:
        if text[s:s+m] == pattern:
            results.append(s)
        if s + m < n:
            s += shift.get(text[s + m], m + 1)
        else:
            break
    return results
`,
      tests: [
        {
          args: ["ABCABDABC", "ABC"],
          expected: [0, 6],
        },
        {
          args: ["aabaa", "aa"],
          expected: [0, 3],
        },
      ],
    },
    {
      language: "javascript",
      entry: "sundaySearch",
      code: `function sundaySearch(text, pattern) {
  const n = text.length, m = pattern.length;
  if (m === 0 || m > n) return [];
  const shift = {};
  for (let i = 0; i < m; i++) shift[pattern[i]] = m - i;
  const results = [];
  let s = 0;
  while (s <= n - m) {
    if (text.substring(s, s + m) === pattern) results.push(s);
    if (s + m < n) s += shift[text[s + m]] ?? m + 1;
    else break;
  }
  return results;
}
`,
      tests: [
        {
          args: ["ABCABDABC", "ABC"],
          expected: [0, 6],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "sunday-q1",
      kind: "mcq",
      prompt: "Which character does Sunday's algorithm use for shifting?",
      options: [
        "The character just past the current window (text[s+m])",
        "The last character of the window",
        "The first mismatched character",
        "The first character of the pattern",
      ],
      answer: 0,
      explanation: "Sunday uses text[s+m], one position past the alignment window.",
      hints: ["Where does Sunday look compared to Horspool?"],
      objective: "Shift rule",
    },
  ],
  exam: {
    definition: "Sunday's algorithm shifts based on text[s+m], one past the pattern window.",
    steps: ["Build shift table.", "Compare at current position.", "Shift using text[s+m]."],
    timeComplexity: "Average $O(n/m)$, worst $O(nm)$.",
    spaceComplexity: "$O(\\sigma)$.",
    correctness: "Any valid alignment must include text[s+m] somewhere in the pattern.",
    applications: ["text search"],
    limitations: ["O(nm) worst case"],
    faq: [
      {
        q: "When is Sunday better than Horspool?",
        a: "When the alphabet is large relative to the pattern, the character past the window is more likely absent, giving the maximum shift.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Shift rule (2).", "Algorithm (2).", "Comparison with Horspool (1)."],
      },
    ],
  },
  references: [
    {
      citation: "D. M. Sunday, 'A Very Fast Substring Searching Algorithm', CACM, 1990.",
      supports: "Original paper.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
