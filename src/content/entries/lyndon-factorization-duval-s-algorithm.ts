import type { AlgorithmEntry } from "../types";

export const lyndonFactorizationDuvalSAlgorithmEntry: AlgorithmEntry = {
  slug: "lyndon-factorization-duval-s-algorithm",
  name: "Lyndon Factorization (Duval's Algorithm)",
  aliases: ["Duval's Algorithm", "Chen-Fox-Lyndon"],
  curriculum: [342],
  domain: "strings",
  subcategory: "String Decomposition",
  difficulty: "intermediate",
  summary:
    "Decomposes a string into a non-increasing sequence of Lyndon words in O(n) time. A Lyndon word is a string strictly smaller than all its rotations.",
  tags: ["Lyndon word", "factorization", "string decomposition"],
  prerequisites: ["booth-s-algorithm-lexicographically-minimum-rotation"],
  related: [],
  problem: {
    input: "A string S.",
    output:
      "The Lyndon factorization: S = w1 w2 ... wk where each wi is a Lyndon word and w1 >= w2 >= ... >= wk.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A Lyndon word is lexicographically strictly smaller than all its proper rotations. Every string has a unique factorization into non-increasing Lyndon words.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Start with i=0.",
          "Try to extend the current Lyndon factor using indices j,k.",
          "If s[k]<s[j]: a Lyndon factor of length j-i found. Output, advance i.",
          "If s[k]>s[j]: the whole segment i..k is one Lyndon word. Reset j=i, k=i+1.",
          "If s[k]==s[j]: advance both j and k.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Duval's algorithm uses three pointers (i,j,k) and runs in a single pass.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "$O(n)$ time: each character is visited at most three times across the pointer advances.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Lyndon factorization connects to suffix arrays: the suffixes of each Lyndon factor appear consecutively in the suffix array.",
      },
    ],
  },
  complexity: {
    worstClass: "n",
    best: "$O(n)$",
    average: "$O(n)$",
    worst: "$O(n)$",
    space: "$O(1)$",
  },
  properties: [],
  implementations: [
    {
      language: "python",
      entry: "lyndon_factorization",
      code: `def duval(s: str) -> list[str]:
    n = len(s)
    factorization = []
    i = 0
    while i < n:
        j, k = i, i + 1
        while k < n and s[j] <= s[k]:
            if s[j] < s[k]:
                j = i
            else:
                j += 1
            k += 1
        while i <= j:
            factorization.append(s[i:i + k - j])
            i += k - j
    return factorization
`,
      tests: [
        {
          args: ["abbaabba"],
          expected: ["abb", "aabb", "a"],
        },
        {
          args: ["cba"],
          expected: ["c", "b", "a"],
        },
      ],
    },
    {
      language: "javascript",
      entry: "lyndonFactorization",
      code: `function duval(s) {
  const n = s.length, result = [];
  let i = 0;
  while (i < n) {
    let j = i, k = i + 1;
    while (k < n && s[j] <= s[k]) {
      if (s[j] < s[k]) j = i; else j++;
      k++;
    }
    while (i <= j) { result.push(s.substring(i, i + k - j)); i += k - j; }
  }
  return result;
}
`,
      tests: [
        {
          args: ["cba"],
          expected: ["c", "b", "a"],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "lyn-q1",
      kind: "mcq",
      prompt: "Which is a Lyndon word?",
      options: ["abc", "aba", "ba", "aa"],
      answer: 0,
      explanation: "'abc' < all its rotations ('bca', 'cab').",
      hints: ["Strictly smallest rotation."],
      objective: "Definition",
    },
  ],
  exam: {
    definition: "Unique factorization into non-increasing Lyndon words.",
    steps: ["Duval's three-pointer scan.", "Output factors of length k-j when s[k]<s[j]."],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(1)$ extra.",
    correctness: "Chen-Fox-Lyndon theorem guarantees uniqueness.",
    applications: ["Suffix array construction", "minimum rotation via Lyndon"],
    limitations: ["Theoretical; direct applications are niche"],
    faq: [
      {
        q: "How many Lyndon factors can there be?",
        a: "At most n (one per character for non-increasing strings like 'cba').",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Lyndon word definition (1).", "Duval algorithm (2).", "Uniqueness theorem (1)."],
      },
    ],
  },
  references: [
    {
      citation: "J. P. Duval, 'Factorizing words over an ordered alphabet', J. Algorithms, 1983.",
      supports: "Original algorithm.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
