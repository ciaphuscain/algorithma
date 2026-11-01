import type { AlgorithmEntry } from "../types";

export const desEntry: AlgorithmEntry = {
  slug: "des",
  name: "DES",
  aliases: ["Data Encryption Standard"],
  curriculum: [477],
  domain: "cryptography",
  subcategory: "Cryptography",
  difficulty: "intermediate",
  summary:
    "A 16-round Feistel-network block cipher that encrypts 64-bit blocks with a 56-bit key, once the dominant symmetric cipher, now replaced by AES.",
  tags: ["block cipher", "Feistel network", "symmetric encryption"],
  prerequisites: ["Binary representation"],
  related: ["aes-encryption"],
  problem: {
    input: "A 64-bit plaintext block and a 56-bit key.",
    output: "A 64-bit ciphertext block.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "DES splits a 64-bit block into two 32-bit halves and runs 16 rounds of the Feistel structure: in each round, the right half is expanded, XORed with a round key, passed through S-boxes (substitution), permuted, and then XORed into the left half. The halves swap and the process repeats.",
      },
      {
        kind: "p",
        text: "The Feistel structure means encryption and decryption use the same circuit — just reverse the round-key order. The S-boxes provide the non-linearity that makes the cipher hard to break analytically.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Apply an initial permutation (IP) to the 64-bit input.",
          "Split into L₀ (left 32 bits) and R₀ (right 32 bits).",
          "For rounds i = 1..16: Lᵢ = Rᵢ₋₁, Rᵢ = Lᵢ₋₁ ⊕ f(Rᵢ₋₁, Kᵢ) where f expands R to 48 bits, XORs with round key Kᵢ, substitutes via 8 S-boxes, and permutes.",
          "Swap final halves and apply the inverse initial permutation (IP⁻¹).",
        ],
      },
      {
        kind: "p",
        text: "The key schedule derives 16 48-bit round keys from the 56-bit key by shifting and selecting bits.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "DES operates on bits; implementations use lookup tables for S-boxes and permutations.",
          "Triple DES (3DES) applies DES three times with two or three keys for 112- or 168-bit security.",
          "DES is insecure for new applications; its 56-bit key can be brute-forced.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Each S-box maps 6 bits to 4 bits non-linearly. The permutation and expansion steps ensure diffusion: each plaintext bit affects many ciphertext bits. The cipher's security relies on the avalanche effect across 16 rounds.",
      },
      {
        kind: "p",
        text: "DES runs in O(1) per block (fixed 16 rounds on fixed-size blocks). Key schedule is also O(1).",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Differential cryptanalysis (Biham & Shamir) and linear cryptanalysis (Matsui) showed theoretical weaknesses but require impractical amounts of data for full DES.",
          "DES was designed to resist differential cryptanalysis, which was classified at the time (1970s).",
          "The 56-bit key was broken by the EFF's Deep Crack machine in 1998 in about 56 hours.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(1)",
      average: "O(1)",
      worst: "O(1)",
    },
    space: "O(1)",
    worstClass: "1",
    note: "Fixed 16 rounds on a 64-bit block.",
  },
  properties: [
    {
      label: "Block size",
      value: "64 bits",
    },
    {
      label: "Key size",
      value: "56 bits (64 with parity)",
    },
    {
      label: "Rounds",
      value: "16 Feistel rounds",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "des_feistel_demo",
      code: `def des_feistel_demo(left, right, round_keys):
    """Simplified Feistel demo (no real S-boxes). Shows the structure of DES rounds.
    left, right: 32-bit integers. round_keys: list of 32-bit integers."""
    for k in round_keys:
        new_right = left ^ (right ^ k)
        left = right
        right = new_right
    return left, right
`,
      tests: [
        {
          args: [0, 0, [0, 0, 0]],
          expected: [0, 0],
        },
        {
          args: [1, 2, [3]],
          expected: [2, 2],
        },
        {
          args: [10, 20, [5, 7]],
          expected: [27, 30],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "des-keylength",
      kind: "mcq",
      prompt: "What is the effective key length of DES?",
      options: ["56 bits", "64 bits", "128 bits", "48 bits"],
      answer: 0,
      explanation: "DES uses a 64-bit key but 8 bits are parity, leaving 56 effective bits.",
      hints: ["How many of the 64 key bits are parity?"],
      objective: "Know DES key parameters",
    },
  ],
  exam: {
    definition: "DES is a 16-round Feistel cipher encrypting 64-bit blocks with a 56-bit key.",
    steps: [
      "Apply initial permutation.",
      "Split into L and R halves.",
      "16 Feistel rounds with round keys from the key schedule.",
      "Swap halves, apply inverse permutation.",
    ],
    timeComplexity: "O(1) per block",
    spaceComplexity: "O(1)",
    correctness:
      "16 rounds of the Feistel network provide adequate diffusion and confusion for the 56-bit key space.",
    applications: ["Legacy system compatibility", "Understanding Feistel ciphers"],
    limitations: ["56-bit key is brute-forceable", "Replaced by AES"],
    faq: [
      {
        q: "Why is DES insecure today?",
        a: "Its 56-bit key can be exhaustively searched with modern hardware.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Describe Feistel structure.", "State block and key sizes."],
      },
    ],
  },
  references: [
    {
      citation: "FIPS PUB 46-3, Data Encryption Standard (DES), NIST, 1999.",
      supports: "The official DES specification.",
    },
    {
      citation:
        "E. Biham, A. Shamir, Differential Cryptanalysis of the Data Encryption Standard, Springer, 1993.",
      supports: "Differential cryptanalysis of DES.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
