import type { AlgorithmEntry } from "../types";

export const polynomialRollingHashEntry: AlgorithmEntry = {
  slug: "polynomial-rolling-hash",
  name: "Polynomial Rolling Hash",
  aliases: ["Polynomial Rolling Hash"],
  curriculum: [311],
  domain: "strings",
  subcategory: "Hashing",
  difficulty: "intermediate",
  summary:
    "Computes hash values for substrings by treating the string as a polynomial evaluated at a base, enabling O(1) hash updates when the window slides.",
  tags: ["rolling hash", "polynomial hash", "Rabin-Karp", "string hashing"],
  prerequisites: ["Modular Arithmetic"],
  related: ["rabin-karp", "rabin-fingerprint", "double-hashing"],
  problem: {
    input: "A string s and a window length k.",
    output: "The polynomial hash of each substring of length k.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Treat each character as a digit in base B. The hash of 'abc' is a·B² + b·B + c (mod M). When the window slides right, subtract the leftmost character's contribution and add the new character: O(1) per slide.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Choose a base B and modulus M.",
          "Compute hash of first window: h = s[0]·B^(k-1) + s[1]·B^(k-2) + ... + s[k-1].",
          "To slide: h = (h - s[i]·B^(k-1)) · B + s[i+k].",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Precompute B^(k-1) mod M. Use a large prime M to reduce collisions.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "$O(n)$ total for all windows: $O(k)$ for the first hash, $O(1)$ per slide. Collision probability $\\approx 1/M$ per comparison.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Double hashing (two different bases/mods) reduces collision probability.",
          "Used in Rabin-Karp string matching.",
          "Can detect repeated substrings in O(n log n) with binary search on length.",
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
      label: "Update cost",
      value: "O(1) per slide",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "rolling_hash_count",
      code: `def rolling_hash_count(s, k):
    """Return the number of distinct polynomial rolling hashes for substrings of length k."""
    if k > len(s) or k == 0: return 0
    B, M = 31, 10**9 + 7
    h = 0
    pw = pow(B, k - 1, M)
    for i in range(k):
        h = (h * B + ord(s[i])) % M
    seen = {h}
    for i in range(k, len(s)):
        h = (h - ord(s[i - k]) * pw % M + M) % M
        h = (h * B + ord(s[i])) % M
        seen.add(h)
    return len(seen)
`,
      tests: [
        {
          args: ["abcabc", 3],
          expected: 3,
        },
        {
          args: ["aaaa", 2],
          expected: 1,
        },
        {
          args: ["abcd", 1],
          expected: 4,
        },
      ],
    },
    {
      language: "javascript",
      entry: "rollingHashCount",
      code: `function rollingHashCount(s, k) {
  if (k > s.length || k === 0) return 0;
  const B = 31, M = 1e9 + 7;
  let h = 0, pw = 1;
  for (let i = 0; i < k - 1; i++) pw = (pw * B) % M;
  for (let i = 0; i < k; i++) h = (h * B + s.charCodeAt(i)) % M;
  const seen = new Set([h]);
  for (let i = k; i < s.length; i++) {
    h = (((h - s.charCodeAt(i - k) * pw % M + M) % M) * B + s.charCodeAt(i)) % M;
    seen.add(h);
  }
  return seen.size;
}
`,
      tests: [
        {
          args: ["abcabc", 3],
          expected: 3,
        },
        {
          args: ["aaaa", 2],
          expected: 1,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "poly-hash-q1",
      kind: "mcq",
      prompt: "What is the time to update a rolling hash when the window slides by one position?",
      options: ["O(1)", "O(k)", "O(n)", "O(log n)"],
      answer: 0,
      explanation: "Subtract the old character's contribution and add the new one, both O(1).",
      hints: ["How many operations per slide?"],
      objective: "Update cost",
    },
  ],
  exam: {
    definition:
      "Polynomial rolling hash treats a string as a polynomial in a chosen base, computed modulo a prime, with O(1) updates.",
    steps: [
      "Choose base B, modulus M.",
      "Compute first window hash.",
      "Slide: subtract old char, multiply by B, add new char.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "Each hash is s[i]·B^(k-1) + ... + s[i+k-1] mod M.",
    applications: ["Rabin-Karp matching", "plagiarism detection", "longest repeated substring"],
    limitations: ["Hash collisions require verification"],
    faq: [
      {
        q: "How to reduce collisions?",
        a: "Use double hashing with two different (base, mod) pairs.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Hash formula (1).", "Sliding update (2).", "Collision analysis (2)."],
      },
    ],
  },
  references: [
    {
      citation:
        "M. O. Rabin and R. M. Karp, 'Efficient Randomized Pattern-Matching Algorithms', IBM Journal, 1987.",
      supports: "Rabin-Karp.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
