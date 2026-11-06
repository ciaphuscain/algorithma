import type { AlgorithmEntry } from "../types";

export const rabinFingerprintEntry: AlgorithmEntry = {
  slug: "rabin-fingerprint",
  name: "Rabin Fingerprint",
  aliases: ["Rabin Fingerprint"],
  curriculum: [313],
  domain: "strings",
  subcategory: "Hashing",
  difficulty: "intermediate",
  summary:
    "A fingerprinting scheme based on polynomial evaluation over a finite field (GF(2)), using irreducible polynomials for high-quality hash distribution.",
  tags: ["fingerprint", "Rabin", "polynomial", "hashing"],
  prerequisites: ["Polynomial Rolling Hash"],
  related: ["polynomial-rolling-hash", "double-hashing"],
  problem: {
    input: "A byte string.",
    output: "A fingerprint (hash value) of the string.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Rabin fingerprints treat the input as coefficients of a polynomial over GF(2) and compute the remainder when divided by a random irreducible polynomial. This gives provably low collision probability.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Choose a random irreducible polynomial p(x) of degree k over GF(2).",
          "Treat the input as a polynomial m(x) over GF(2).",
          "The fingerprint is m(x) mod p(x).",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "In practice, this is computed using XOR and shift operations, similar to CRC. A simpler approach: use a polynomial rolling hash with a prime modulus as an approximation.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "For an irreducible polynomial of degree $k$, two distinct strings of length $n$ have collision probability at most $n/2^k$. The fingerprint is $k$ bits long.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Used in the original Rabin-Karp algorithm.",
          "Rabin fingerprints have the nice property of being polynomial: f(ab) can be computed from f(a) and f(b).",
          "Used in content-defined chunking (e.g., rsync, LBFS).",
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
    space: "O(1)",
    worstClass: "n",
  },
  properties: [
    {
      label: "Based on",
      value: "Polynomial division over GF(2)",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "rabin_fingerprint",
      code: `def rabin_fingerprint(data, mod=None):
    """Simple Rabin-style fingerprint using polynomial hashing."""
    if mod is None:
        mod = (1 << 61) - 1  # Mersenne prime
    B = 256
    h = 0
    for byte in data:
        h = (h * B + byte) % mod
    return h
`,
      tests: [
        {
          args: [[104, 101, 108, 108, 111]],
          expected: 448378203247,
        },
        {
          args: [[1, 2, 3], 1000003],
          expected: 66051,
        },
      ],
    },
    {
      language: "javascript",
      entry: "rabinFingerprint",
      code: `function rabinFingerprint(data, mod) {
  if (!mod) mod = 1000000007;
  const B = 256;
  let h = 0;
  for (const byte of data) h = (h * B + byte) % mod;
  return h;
}
`,
      tests: [
        {
          args: [[1, 2, 3], 1000003],
          expected: 66051,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "rabin-fp-q1",
      kind: "mcq",
      prompt:
        "What makes Rabin fingerprints mathematically stronger than simple polynomial hashing?",
      options: [
        "They use irreducible polynomials over GF(2) with provable collision bounds",
        "They use larger numbers",
        "They are faster",
        "They use more memory",
      ],
      answer: 0,
      explanation:
        "Division by an irreducible polynomial gives provable collision probability n/2^k.",
      hints: ["Think about the field."],
      objective: "Strength",
    },
  ],
  exam: {
    definition:
      "Rabin fingerprint: polynomial remainder over GF(2) using an irreducible polynomial.",
    steps: [
      "Treat input as polynomial over GF(2).",
      "Divide by irreducible polynomial p(x).",
      "Remainder is the fingerprint.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(1)$.",
    correctness: "Collision probability ≤ n/2^k for k-bit fingerprints.",
    applications: ["Rabin-Karp", "content-defined chunking", "deduplication"],
    limitations: ["GF(2) arithmetic less intuitive than integer hashing"],
    faq: [
      {
        q: "How is it used in rsync?",
        a: "Content-defined chunking uses Rabin fingerprints to find split points that are content-dependent, not position-dependent.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["GF(2) polynomial division (2).", "Collision bound (2).", "Applications (1)."],
      },
    ],
  },
  references: [
    {
      citation: "M. O. Rabin, 'Fingerprinting by Random Polynomials', Tech Report, Harvard, 1981.",
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
