import type { AlgorithmEntry } from "../types";

export const naiveStringMatchingEntry: AlgorithmEntry = {
  slug: "naive-string-matching",
  name: "Naive String Matching",
  aliases: ["Brute-Force String Search"],
  curriculum: [301],
  domain: "strings",
  subcategory: "Pattern Matching",
  difficulty: "beginner",
  summary:
    "Checks every possible alignment of the pattern against the text, comparing character by character.",
  tags: ["pattern matching", "brute force", "string search"],
  prerequisites: [],
  related: ["kmp", "boyer-moore"],
  problem: {
    input: "A text string T and pattern P.",
    output: "All positions where P occurs in T.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Slide the pattern over the text one position at a time. At each position, compare all characters of the pattern.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "For each starting position i from 0 to n-m:",
          "  Compare T[i..i+m-1] with P[0..m-1].",
          "  If all match, record i.",
          "  Otherwise, move to i+1.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Two nested loops: the outer loop over text positions, the inner loop over pattern characters.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Worst case: $O((n-m+1) \\cdot m)$, e.g., text 'aaa...a' and pattern 'aa...ab'. Best case $O(n)$ when first character mismatches everywhere.",
      },
    ],
    deeper: [
      {
        kind: "p",
        text: "Despite poor worst-case performance, naive search is competitive on random text because mismatches happen quickly on average, giving expected $O(n)$ with random patterns.",
      },
    ],
  },
  complexity: {
    worstClass: "other",
    best: "$O(n)$",
    average: "$O(n)$",
    worst: "$O(nm)$",
    space: "$O(1)$",
  },
  properties: [],
  implementations: [
    {
      language: "python",
      entry: "naive_string_matching",
      code: `def naive_search(text: str, pattern: str) -> list[int]:
    n, m = len(text), len(pattern)
    result = []
    for i in range(n - m + 1):
        if text[i:i + m] == pattern:
            result.append(i)
    return result
`,
      tests: [
        {
          args: ["abcabcabc", "abc"],
          expected: [0, 3, 6],
        },
        {
          args: ["aaaa", "aa"],
          expected: [0, 1, 2],
        },
        {
          args: ["hello", "xyz"],
          expected: [],
        },
      ],
    },
    {
      language: "javascript",
      entry: "naiveStringMatching",
      code: `function naiveSearch(text, pattern) {
  const result = [];
  for (let i = 0; i <= text.length - pattern.length; i++) {
    if (text.substring(i, i + pattern.length) === pattern) result.push(i);
  }
  return result;
}
`,
      tests: [
        {
          args: ["abcabcabc", "abc"],
          expected: [0, 3, 6],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "nsm-q1",
      kind: "mcq",
      prompt: "What is the worst-case time for naive matching?",
      options: ["O(nm)", "O(n+m)", "O(n log m)", "O(m)"],
      answer: 0,
      explanation: "Each of the n-m+1 positions can require m comparisons.",
      hints: ["Think about all a's text."],
      objective: "Worst case",
    },
  ],
  exam: {
    definition: "Naive string matching slides the pattern over every text position.",
    steps: ["For i=0..n-m: compare text[i..i+m-1] with pattern."],
    timeComplexity: "$O(nm)$ worst, $O(n)$ best.",
    spaceComplexity: "$O(1)$ extra.",
    correctness: "Every possible alignment is checked.",
    applications: ["Small inputs", "baseline benchmark"],
    limitations: ["Quadratic worst case on repetitive text"],
    faq: [
      {
        q: "When is naive search good enough?",
        a: "For short patterns or natural-language text where mismatches happen early.",
      },
    ],
    answers: [
      {
        marks: 3,
        outline: [
          "Algorithm description (1).",
          "Complexity analysis (1).",
          "When it is acceptable (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "CLRS, Chapter 32.1, 'The naive string-matching algorithm'.",
      supports: "Foundation.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
