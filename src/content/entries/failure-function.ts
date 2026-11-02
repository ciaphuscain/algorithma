import type { AlgorithmEntry } from "../types";

export const failureFunctionEntry: AlgorithmEntry = {
  slug: "failure-function",
  name: "Failure Function",
  aliases: ["Failure Function", "KMP Failure Function", "Prefix Function"],
  curriculum: [309],
  domain: "strings",
  subcategory: "Pattern Matching",
  difficulty: "intermediate",
  summary:
    "Computes the KMP failure (prefix) function: for each position i in a string, the length of the longest proper prefix that is also a suffix of the substring [0..i].",
  tags: ["KMP", "prefix function", "failure function", "string"],
  prerequisites: [],
  related: ["kmp", "border-array"],
  problem: {
    input: "A string s of length n.",
    output:
      "An array F where F[i] is the length of the longest proper prefix of s[0..i] that is also a suffix.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "The failure function tells us: if we're matching a pattern and hit a mismatch at position i, what is the longest prefix of the pattern that is still matched? This lets KMP avoid re-scanning characters.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Set F[0] = 0, k = 0.",
          "For i from 1 to n-1:",
          "  While k > 0 and s[k] ≠ s[i], set k = F[k-1].",
          "  If s[k] = s[i], increment k.",
          "  Set F[i] = k.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "The key insight: when s[k] ≠ s[i], we 'fall back' to F[k-1], reusing previously computed prefix information.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "$O(n)$ time: each character is compared at most twice (once advancing k, once through fallbacks). The total number of fallback steps is bounded by the total number of advances.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "The failure function also computes all periods of each prefix.",
          "Used in string matching (KMP), string compression, and counting pattern occurrences.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n)",
      worst: "O(n)",
    },
    space: "O(n)",
    worstClass: "n",
  },
  properties: [
    {
      label: "Also known as",
      value: "Prefix function",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "failure_function",
      code: `def failure_function(s):
    n = len(s)
    f = [0] * n
    k = 0
    for i in range(1, n):
        while k > 0 and s[k] != s[i]:
            k = f[k - 1]
        if s[k] == s[i]:
            k += 1
        f[i] = k
    return f
`,
      tests: [
        {
          args: ["aabaaab"],
          expected: [0, 1, 0, 1, 2, 2, 3],
        },
        {
          args: ["abcabc"],
          expected: [0, 0, 0, 1, 2, 3],
        },
        {
          args: ["aaaa"],
          expected: [0, 1, 2, 3],
        },
      ],
    },
    {
      language: "javascript",
      entry: "failureFunction",
      code: `function failureFunction(s) {
  const n = s.length;
  const f = new Array(n).fill(0);
  let k = 0;
  for (let i = 1; i < n; i++) {
    while (k > 0 && s[k] !== s[i]) k = f[k - 1];
    if (s[k] === s[i]) k++;
    f[i] = k;
  }
  return f;
}
`,
      tests: [
        {
          args: ["abcabc"],
          expected: [0, 0, 0, 1, 2, 3],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "failure-function-q1",
      kind: "mcq",
      prompt: "What does F[i] represent?",
      options: [
        "Length of longest proper prefix of s[0..i] that is also a suffix",
        "The next character to compare",
        "The number of mismatches",
        "The pattern length",
      ],
      answer: 0,
      explanation: "F[i] gives the longest border (proper prefix = suffix) length.",
      hints: ["Think about what 'prefix equals suffix' means."],
      objective: "Definition",
    },
  ],
  exam: {
    definition:
      "The failure function computes, for each position, the longest proper prefix that equals a suffix.",
    steps: [
      "Initialize F[0]=0, k=0.",
      "For each i>0: fall back k via F while mismatch, advance if match.",
      "Set F[i] = k.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness:
      "Each fallback reduces k, and k increases at most n times total, so total fallbacks ≤ n.",
    applications: ["KMP pattern matching", "string periods", "pattern counting"],
    limitations: ["Single string only; see Aho-Corasick for multiple patterns"],
    faq: [
      {
        q: "Why is it O(n)?",
        a: "k is incremented at most n times, so it can be decremented at most n times.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Define F[i] (1).", "Algorithm with fallback (2).", "Amortized O(n) proof (2)."],
      },
    ],
  },
  references: [
    {
      citation:
        "D. E. Knuth, J. H. Morris, V. R. Pratt, 'Fast Pattern Matching in Strings', SIAM J. Computing, 1977.",
      supports: "Original KMP paper.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
