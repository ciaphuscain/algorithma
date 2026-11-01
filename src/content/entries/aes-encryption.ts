import type { AlgorithmEntry } from "../types";

export const aesEncryptionEntry: AlgorithmEntry = {
  slug: "aes-encryption",
  name: "AES Encryption",
  aliases: [
    "Advanced Encryption Standard",
    "Rijndael",
  ],
  curriculum: [
    476,
  ],
  domain: "cryptography",
  subcategory: "Cryptography",
  difficulty: "intermediate",
  summary: "A symmetric block cipher that encrypts 128-bit blocks using a key of 128, 192, or 256 bits through multiple rounds of substitution, shifting, mixing, and key addition.",
  tags: [
    "encryption",
    "symmetric",
    "block cipher",
    "cryptography",
  ],
  prerequisites: [
    "Bit Manipulation",
  ],
  related: [
    "chacha20",
  ],
  problem: {
    input: "A 128-bit plaintext block and a 128/192/256-bit key.",
    output: "A 128-bit ciphertext block.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "AES scrambles a 16-byte block through repeated rounds of four operations. SubBytes provides non-linearity (each byte is replaced via a lookup table). ShiftRows and MixColumns spread each byte's influence across the block. AddRoundKey XORs in key material. After 10-14 rounds, the result is indistinguishable from random without the key.",
      },
      {
        kind: "p",
        text: "The design philosophy is a substitution-permutation network: substitute bytes for confusion, permute (shift and mix) for diffusion, and inject key bits each round.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Expand the key into round keys (key schedule).",
          "AddRoundKey with the initial round key.",
          "For each of the Nr-1 main rounds: SubBytes, ShiftRows, MixColumns, AddRoundKey.",
          "Final round: SubBytes, ShiftRows, AddRoundKey (no MixColumns).",
        ],
      },
      {
        kind: "p",
        text: "**Block layout**: the 16 input bytes fill a 4x4 column-major matrix called the state.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "SubBytes uses a fixed 256-byte S-box derived from GF(2^8) inversion.",
          "MixColumns multiplies each column by a fixed matrix in GF(2^8).",
          "AES-NI hardware instructions compute rounds in a single CPU instruction.",
          "Never implement your own AES for production — use a vetted library.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "AES operates in GF(2^8) with the irreducible polynomial x^8 + x^4 + x^3 + x + 1.",
      },
      {
        kind: "p",
        text: "The S-box is the composition of GF(2^8) inversion and an affine transformation, giving high non-linearity.",
      },
      {
        kind: "p",
        text: "**Rounds**: 10 (AES-128), 12 (AES-192), or 14 (AES-256). Each round has O(1) work on a fixed block size.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Side-channel attacks (timing, cache, power analysis) threaten table-based implementations; constant-time bitsliced implementations resist them.",
          "AES-GCM combines AES-CTR encryption with GHASH authentication for authenticated encryption.",
          "The best known attack on full AES-128 is biclique, reducing security from 2^128 to ~2^126.1 — still impractical.",
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
    note: "Fixed block size; O(n) to encrypt n blocks.",
  },
  properties: [
    {
      label: "Block size",
      value: "128 bits",
    },
    {
      label: "Key sizes",
      value: "128, 192, or 256 bits",
    },
    {
      label: "Rounds",
      value: "10, 12, or 14",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "aes_sbox_demo",
      code: `def aes_sbox_demo(byte_val):
    """Demonstrate AES S-box lookup for a single byte (0-255)."""
    SBOX = [
        0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x76,
        0xca,0x82,0xc9,0x7d,0xfa,0x59,0x47,0xf0,0xad,0xd4,0xa2,0xaf,0x9c,0xa4,0x72,0xc0,
        0xb7,0xfd,0x93,0x26,0x36,0x3f,0xf7,0xcc,0x34,0xa5,0xe5,0xf1,0x71,0xd8,0x31,0x15,
        0x04,0xc7,0x23,0xc3,0x18,0x96,0x05,0x9a,0x07,0x12,0x80,0xe2,0xeb,0x27,0xb2,0x75,
        0x09,0x83,0x2c,0x1a,0x1b,0x6e,0x5a,0xa0,0x52,0x3b,0xd6,0xb3,0x29,0xe3,0x2f,0x84,
        0x53,0xd1,0x00,0xed,0x20,0xfc,0xb1,0x5b,0x6a,0xcb,0xbe,0x39,0x4a,0x4c,0x58,0xcf,
        0xd0,0xef,0xaa,0xfb,0x43,0x4d,0x33,0x85,0x45,0xf9,0x02,0x7f,0x50,0x3c,0x9f,0xa8,
        0x51,0xa3,0x40,0x8f,0x92,0x9d,0x38,0xf5,0xbc,0xb6,0xda,0x21,0x10,0xff,0xf3,0xd2,
        0xcd,0x0c,0x13,0xec,0x5f,0x97,0x44,0x17,0xc4,0xa7,0x7e,0x3d,0x64,0x5d,0x19,0x73,
        0x60,0x81,0x4f,0xdc,0x22,0x2a,0x90,0x88,0x46,0xee,0xb8,0x14,0xde,0x5e,0x0b,0xdb,
        0xe0,0x32,0x3a,0x0a,0x49,0x06,0x24,0x5c,0xc2,0xd3,0xac,0x62,0x91,0x95,0xe4,0x79,
        0xe7,0xc8,0x37,0x6d,0x8d,0xd5,0x4e,0xa9,0x6c,0x56,0xf4,0xea,0x65,0x7a,0xae,0x08,
        0xba,0x78,0x25,0x2e,0x1c,0xa6,0xb4,0xc6,0xe8,0xdd,0x74,0x1f,0x4b,0xbd,0x8b,0x8a,
        0x70,0x3e,0xb5,0x66,0x48,0x03,0xf6,0x0e,0x61,0x35,0x57,0xb9,0x86,0xc1,0x1d,0x9e,
        0xe1,0xf8,0x98,0x11,0x69,0xd9,0x8e,0x94,0x9b,0x1e,0x87,0xe9,0xce,0x55,0x28,0xdf,
        0x8c,0xa1,0x89,0x0d,0xbf,0xe6,0x42,0x68,0x41,0x99,0x2d,0x0f,0xb0,0x54,0xbb,0x16,
    ]
    return SBOX[byte_val]
`,
      tests: [
        {
          args: [
            0,
          ],
          expected: 99,
        },
        {
          args: [
            1,
          ],
          expected: 124,
        },
        {
          args: [
            255,
          ],
          expected: 22,
        },
      ],
    },
  ],
  practice: [
    {
      id: "aes-rounds",
      kind: "mcq",
      prompt: "How many rounds does AES-256 use?",
      options: [
        "10",
        "12",
        "14",
        "16",
      ],
      answer: 2,
      explanation: "AES-128 uses 10 rounds, AES-192 uses 12, and AES-256 uses 14.",
      hints: [
        "How does key size relate to round count?",
      ],
      objective: "Know AES round counts",
    },
  ],
  exam: {
    definition: "AES is a symmetric block cipher encrypting 128-bit blocks through rounds of SubBytes, ShiftRows, MixColumns, and AddRoundKey.",
    steps: [
      "Key expansion",
      "Initial AddRoundKey",
      "Nr-1 main rounds (Sub, Shift, Mix, Add)",
      "Final round (no MixColumns)",
    ],
    timeComplexity: "O(1) per block",
    spaceComplexity: "O(1)",
    correctness: "The combination of substitution (S-box), permutation (ShiftRows, MixColumns), and key injection provides both confusion and diffusion after sufficient rounds.",
    applications: [
      "TLS/SSL encryption",
      "Disk encryption",
      "VPN protocols",
    ],
    limitations: [
      "Requires secure key management",
      "ECB mode leaks patterns",
    ],
    faq: [
      {
        q: "Why no MixColumns in the last round?",
        a: "To make the structure symmetric for decryption; the inverse last round also skips InvMixColumns.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Four operations per round, 10-14 rounds (2)",
        ],
      },
      {
        marks: 5,
        outline: [
          "Block structure and state matrix (1)",
          "Four round operations (2)",
          "Key schedule overview (1)",
          "Security properties (1)",
        ],
      },
    ],
  },
  references: [
    {
      citation: "J. Daemen and V. Rijmen, The Design of Rijndael: AES — The Advanced Encryption Standard, Springer, 2002.",
      supports: "AES specification by its designers.",
    },
    {
      citation: "NIST FIPS 197, Advanced Encryption Standard, 2001.",
      supports: "Official AES standard.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
