import type { AlgorithmEntry } from "../types";

export const doubleHashingEntry: AlgorithmEntry = {
  slug: "double-hashing",
  name: "Double Hashing",
  aliases: ["Double Hashing"],
  curriculum: [312],
  domain: "strings",
  subcategory: "Hashing",
  difficulty: "intermediate",
  summary:
    "Uses two independent hash functions for string comparison to dramatically reduce the probability of hash collisions.",
  tags: ["double hashing", "rolling hash", "collision", "string hashing"],
  prerequisites: ["Polynomial Rolling Hash"],
  related: ["polynomial-rolling-hash", "rabin-fingerprint"],
  problem: {
    input: "Two strings a and b.",
    output: "Whether they are likely equal, using two independent hash functions.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "One hash has collision probability ~1/M. Two independent hashes have collision probability ~1/(M₁·M₂), making false positives extremely rare.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Compute hash₁(s) using base B₁, mod M₁.",
          "Compute hash₂(s) using base B₂, mod M₂.",
          "Two strings match only if both hashes agree.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Choose different (base, modulus) pairs. Good choices: B₁=31, M₁=10⁹+7 and B₂=37, M₂=10⁹+9.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "If each hash has collision probability $1/M$, two independent hashes have probability $1/(M_1 \\cdot M_2) \\approx 10^{-18}$.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Essential for competitive programming to avoid anti-hash tests.",
          "Can be extended to triple hashing for even lower collision rates.",
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
      label: "Collision probability",
      value: "~1/(M₁·M₂)",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "double_hash",
      code: `def double_hash(s):
    """Return a pair of hashes for string s using two different bases and mods."""
    h1, h2 = 0, 0
    B1, M1 = 31, 10**9 + 7
    B2, M2 = 37, 10**9 + 9
    for c in s:
        h1 = (h1 * B1 + ord(c)) % M1
        h2 = (h2 * B2 + ord(c)) % M2
    return [h1, h2]
`,
      tests: [
        {
          args: ["abc"],
          expected: [96354, 137846],
        },
        {
          args: [""],
          expected: [0, 0],
        },
      ],
    },
    {
      language: "javascript",
      entry: "doubleHash",
      code: `function doubleHash(s) {
  let h1 = 0, h2 = 0;
  const B1 = 31, M1 = 1e9 + 7, B2 = 37, M2 = 1e9 + 9;
  for (let i = 0; i < s.length; i++) {
    h1 = (h1 * B1 + s.charCodeAt(i)) % M1;
    h2 = (h2 * B2 + s.charCodeAt(i)) % M2;
  }
  return [h1, h2];
}
`,
      tests: [
        {
          args: ["abc"],
          expected: [96354, 137846],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "double-hash-q1",
      kind: "mcq",
      prompt: "Why use two hash functions instead of one?",
      options: [
        "To reduce collision probability from 1/M to 1/(M₁·M₂)",
        "To make hashing faster",
        "To use less memory",
        "One hash is not enough for any comparison",
      ],
      answer: 0,
      explanation: "Two independent hashes make collisions exponentially less likely.",
      hints: ["Think about independence."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition:
      "Double hashing uses two independent hash functions to make false positives extremely rare.",
    steps: ["Compute hash with (B₁, M₁).", "Compute hash with (B₂, M₂).", "Compare both."],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(1)$ extra.",
    correctness: "Collision probability ≈ 1/(M₁·M₂).",
    applications: ["string matching", "competitive programming", "data deduplication"],
    limitations: ["Still not a proof of equality; just extremely high confidence"],
    faq: [
      {
        q: "What bases and mods to choose?",
        a: "Use different primes, e.g., (31, 10⁹+7) and (37, 10⁹+9).",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Two hash functions (1).",
          "Collision probability analysis (2).",
          "Applications (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "Hashing.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
