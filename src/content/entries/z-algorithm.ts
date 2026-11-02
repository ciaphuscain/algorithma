import type { AlgorithmEntry } from "../types";

export const zAlgorithmEntry: AlgorithmEntry = {
  slug: "z-algorithm",
  name: "Z-Algorithm",
  aliases: ["Z-Array", "Z-Function"],
  curriculum: [307],
  domain: "strings",
  subcategory: "Pattern Matching",
  difficulty: "intermediate",
  summary:
    "Computes the Z-array where Z[i] is the length of the longest substring starting at i that matches a prefix of the string, enabling linear-time pattern matching.",
  tags: ["z-array", "pattern matching", "prefix matching"],
  prerequisites: ["naive-string-matching"],
  related: ["kmp", "failure-function"],
  problem: {
    input: "A string S.",
    output: "Z-array where Z[i] = length of longest prefix of S matching S[i..].",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Maintain a window [L,R] of the rightmost Z-box seen. For each new position, use previously computed values to avoid redundant comparisons.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Initialize L=R=0.",
          "For i=1..n-1:",
          "  If i>R: compare from i, update [L,R].",
          "  Else: k=i-L. If Z[k]<R-i+1, Z[i]=Z[k].",
          "  Otherwise, start comparing from R+1, update [L,R].",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "For pattern matching, concatenate pattern + '$' + text and compute the Z-array. Positions where Z[i]=m are matches.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "$O(n)$: each comparison either extends R (at most n times total) or completes in O(1) using cached values.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "The Z-algorithm generalizes to multiple patterns by concatenation. It also provides a simpler derivation of the KMP failure function.",
      },
    ],
  },
  complexity: {
    time: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    space: "O(n)",
    worstClass: "n",
  },
  properties: [],
  implementations: [
    {
      language: "python",
      entry: "z_function",
      code: `def z_function(s: str) -> list[int]:
    n = len(s)
    z = [0] * n
    z[0] = n
    l, r = 0, 0
    for i in range(1, n):
        if i < r:
            z[i] = min(r - i, z[i - l])
        while i + z[i] < n and s[z[i]] == s[i + z[i]]:
            z[i] += 1
        if i + z[i] > r:
            l, r = i, i + z[i]
    return z

def z_search(text: str, pattern: str) -> list[int]:
    s = pattern + "$" + text
    z = z_function(s)
    m = len(pattern)
    return [i - m - 1 for i in range(m + 1, len(s)) if z[i] == m]
`,
      tests: [
        {
          args: ["aabxaab"],
          expected: [7, 1, 0, 0, 3, 1, 0],
        },
        {
          args: ["aaaa"],
          expected: [4, 3, 2, 1],
        },
      ],
    },
    {
      language: "javascript",
      entry: "zFunction",
      code: `function zFunction(s) {
  const n = s.length, z = new Array(n).fill(0);
  z[0] = n;
  let l = 0, r = 0;
  for (let i = 1; i < n; i++) {
    if (i < r) z[i] = Math.min(r - i, z[i - l]);
    while (i + z[i] < n && s[z[i]] === s[i + z[i]]) z[i]++;
    if (i + z[i] > r) { l = i; r = i + z[i]; }
  }
  return z;
}
`,
      tests: [
        {
          args: ["aabxaab"],
          expected: [7, 1, 0, 0, 3, 1, 0],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "z-q1",
      kind: "mcq",
      prompt: "What does Z[i]=k mean?",
      options: [
        "s[0..k-1] == s[i..i+k-1]",
        "s has k occurrences",
        "The pattern is length k",
        "There are k mismatches",
      ],
      answer: 0,
      explanation: "Z[i] is the length of the longest prefix match starting at i.",
      hints: ["Think prefix."],
      objective: "Z-array definition",
    },
  ],
  exam: {
    definition:
      "Z[i] = length of longest substring starting at i that matches a prefix of the string.",
    steps: [
      "Maintain Z-box [L,R].",
      "Use cached Z-values when inside the box.",
      "Extend by character comparison.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "R never decreases and each comparison either advances R or uses cached value.",
    applications: ["Pattern matching", "string period computation"],
    limitations: ["Requires O(n) space for Z-array"],
    faq: [
      {
        q: "How does Z compare to KMP?",
        a: "Both O(n), Z is often simpler to code; KMP uses less space for online matching.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Z-box invariant (2).", "Why O(n) (2).", "Application to search (1)."],
      },
    ],
  },
  references: [
    {
      citation: "D. Gusfield, 'Algorithms on Strings, Trees, and Sequences', 1997.",
      supports: "Chapter 1: Z-algorithm.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
