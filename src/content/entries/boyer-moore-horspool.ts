import type { AlgorithmEntry } from "../types";

export const boyerMooreHorspoolEntry: AlgorithmEntry = {
  slug: "boyer-moore-horspool",
  name: "Boyer-Moore-Horspool",
  aliases: ["Boyer-Moore-Horspool", "Horspool"],
  curriculum: [305],
  domain: "strings",
  subcategory: "Pattern Matching",
  difficulty: "intermediate",
  summary:
    "A simplified Boyer-Moore variant that uses only the bad-character shift based on the text character aligned with the end of the pattern.",
  tags: ["pattern matching", "string search", "horspool"],
  prerequisites: ["Boyer-Moore"],
  related: ["boyer-moore", "sunday-algorithm"],
  problem: {
    input: "A text string and a pattern string.",
    output: "All starting positions where the pattern occurs in the text.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Like Boyer-Moore but simpler: on any mismatch (or after a full match), shift based on the text character aligned with the **last** position of the pattern. This one rule is enough for excellent average-case performance.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Build a shift table: for each character c, the shift is m minus the position of c's last occurrence in pattern[0..m-2] (m if c doesn't appear).",
          "Align pattern at position 0. Compare right to left.",
          "On mismatch or match, shift using the character at text[s + m - 1].",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "The shift table maps each character to m minus its rightmost position in the first m-1 characters of the pattern. Characters not in the pattern shift by m.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Average case $O(n/m)$ for random text (sublinear). Worst case $O(nm)$, e.g., pattern 'aa' in text 'aaa...a'.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Often faster than full Boyer-Moore in practice due to simpler preprocessing.",
          "The Sunday algorithm looks at text[s + m] (one past the window) for even better shifts.",
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
      label: "Simplification of",
      value: "Boyer-Moore (bad-character only)",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "horspool",
      code: `def horspool(text, pattern):
    n, m = len(text), len(pattern)
    if m == 0 or m > n: return []
    shift = {}
    for i in range(m - 1):
        shift[pattern[i]] = m - 1 - i
    results = []
    s = 0
    while s <= n - m:
        j = m - 1
        while j >= 0 and text[s + j] == pattern[j]:
            j -= 1
        if j < 0:
            results.append(s)
        s += shift.get(text[s + m - 1], m)
    return results
`,
      tests: [
        {
          args: ["ABCABDABC", "ABC"],
          expected: [0, 6],
        },
        {
          args: ["aaaa", "aa"],
          expected: [0, 1, 2],
        },
      ],
    },
    {
      language: "javascript",
      entry: "horspool",
      code: `function horspool(text, pattern) {
  const n = text.length, m = pattern.length;
  if (m === 0 || m > n) return [];
  const shift = {};
  for (let i = 0; i < m - 1; i++) shift[pattern[i]] = m - 1 - i;
  const results = [];
  let s = 0;
  while (s <= n - m) {
    let j = m - 1;
    while (j >= 0 && text[s + j] === pattern[j]) j--;
    if (j < 0) results.push(s);
    s += shift[text[s + m - 1]] ?? m;
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
      id: "horspool-q1",
      kind: "mcq",
      prompt: "How does Horspool differ from full Boyer-Moore?",
      options: [
        "It uses only the bad-character rule based on the last aligned character",
        "It scans left to right",
        "It uses the good-suffix rule only",
        "It has better worst case",
      ],
      answer: 0,
      explanation: "Horspool simplifies Boyer-Moore to just one shift rule.",
      hints: ["Think about which heuristic is dropped."],
      objective: "Difference",
    },
  ],
  exam: {
    definition:
      "Horspool simplifies Boyer-Moore by using only the bad-character shift based on the text character at the pattern's last position.",
    steps: [
      "Build shift table from pattern.",
      "Compare right-to-left.",
      "Shift using character at end of window.",
    ],
    timeComplexity: "Average $O(n/m)$, worst $O(nm)$.",
    spaceComplexity: "$O(\\sigma)$.",
    correctness: "The shift never skips a valid alignment.",
    applications: ["practical string search"],
    limitations: ["O(nm) worst case"],
    faq: [
      {
        q: "Why is Horspool often faster than KMP?",
        a: "It achieves sublinear average time O(n/m) by skipping characters.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Describe the shift table (2).",
          "Algorithm loop (2).",
          "Average-case analysis (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "R. N. Horspool, 'Practical Fast Searching in Strings', Software: Practice and Experience, 1980.",
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
