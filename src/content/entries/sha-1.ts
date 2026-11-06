import type { AlgorithmEntry } from "../types";

export const sha1Entry: AlgorithmEntry = {
  slug: "sha-1",
  name: "SHA-1",
  aliases: ["Secure Hash Algorithm 1"],
  curriculum: [481],
  domain: "cryptography",
  subcategory: "Cryptography",
  difficulty: "intermediate",
  summary:
    "SHA-1 is a cryptographic hash function that produces a 160-bit digest from arbitrary-length input using Merkle–Damgård construction with 80 rounds of bitwise operations.",
  tags: ["hash function", "cryptography", "Merkle-Damgard", "message digest"],
  prerequisites: ["Hashing Fundamentals"],
  related: ["sha-2", "sha-3"],
  problem: {
    input: "An arbitrary-length byte string.",
    output: "A 160-bit (20-byte) hash digest.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "SHA-1 chops the message into 512-bit blocks, then processes each block through 80 rounds of mixing that scramble five 32-bit state words. Each round uses bitwise operations (AND, OR, XOR, rotations) and additions to make the output highly sensitive to input changes.",
      },
      {
        kind: "p",
        text: "The Merkle–Damgård construction chains blocks: each block's output becomes the next block's input state, so the final hash depends on every bit of the message. SHA-1 is now considered broken for collision resistance but is still widely encountered in legacy systems.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Pad the message to a multiple of 512 bits (append 1 bit, zeros, then 64-bit length).",
          "Initialise five 32-bit state words: h0=0x67452301, h1=0xEFCDAB89, h2=0x98BADCFE, h3=0x10325476, h4=0xC3D2E1F0.",
          "For each 512-bit block, expand 16 words to 80 words using XOR and left-rotate.",
          "Run 80 rounds: each round updates (a,b,c,d,e) using a round function, constant, and message word.",
          "Add the round results back to the state words.",
        ],
      },
      {
        kind: "p",
        text: "After all blocks, concatenate h0–h4 for the 160-bit digest.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "All arithmetic is modulo 2^32.",
          "The 80 rounds split into four groups of 20 with different logical functions (Ch, Parity, Maj, Parity) and constants.",
          "Message expansion: w[i] = (w[i-3] XOR w[i-8] XOR w[i-14] XOR w[i-16]) <<< 1 for i >= 16.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "SHA-1 provides 2^80 operations of collision resistance in theory, but practical attacks by Wang et al. (2005) and SHAttered (2017) find collisions in about 2^63 operations. It remains preimage-resistant at approximately 2^160.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Google and CWI Amsterdam demonstrated a practical SHA-1 collision in 2017 (SHAttered).",
          "SHA-1 is deprecated for digital signatures (NIST, 2011) but still used in Git object hashing.",
          "HMAC-SHA1 remains safe because HMAC security does not require collision resistance.",
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
    note: "n is the message length; processing is one pass over 512-bit blocks.",
  },
  properties: [
    {
      label: "Digest size",
      value: "160 bits",
    },
    {
      label: "Block size",
      value: "512 bits",
    },
    {
      label: "Collision resistance",
      value: "Broken (practical attacks exist)",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "sha1_hash",
      code: `def sha1_hash(message):
    """Compute SHA-1 hash of a string. Returns hex digest."""
    import hashlib
    return hashlib.sha1(message.encode()).hexdigest()
`,
      tests: [
        {
          args: [""],
          expected: "da39a3ee5e6b4b0d3255bfef95601890afd80709",
        },
        {
          args: ["abc"],
          expected: "a9993e364706816aba3e25717850c26c9cd0d89d",
        },
        {
          args: ["hello"],
          expected: "aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d",
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "sha1-broken",
      kind: "mcq",
      prompt: "Why is SHA-1 considered insecure for digital signatures?",
      options: [
        "Practical collision attacks exist",
        "Its output is too short for any use",
        "It is too slow",
        "It cannot hash large files",
      ],
      answer: 0,
      explanation:
        "In 2017, the SHAttered attack demonstrated a practical collision, meaning two different inputs producing the same hash.",
      hints: ["Think about what property digital signatures need from a hash."],
      objective: "Understand SHA-1 deprecation",
    },
  ],
  exam: {
    definition:
      "SHA-1 is a Merkle–Damgård hash producing 160-bit digests via 80 rounds per 512-bit block.",
    steps: [
      "Pad message.",
      "Initialize h0-h4.",
      "Expand 16 words to 80.",
      "80 rounds of mixing.",
      "Output h0||h1||h2||h3||h4.",
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    correctness: "Collision resistance broken; preimage resistance still ~2^160.",
    applications: ["Legacy systems", "Git object IDs", "HMAC-SHA1"],
    limitations: ["Collision attacks in ~2^63 ops", "Deprecated for signatures"],
    faq: [
      {
        q: "Is HMAC-SHA1 still safe?",
        a: "Yes, HMAC security relies on pseudorandomness, not collision resistance.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Structure (1).", "Why deprecated (1)."],
      },
    ],
  },
  references: [
    {
      citation: "NIST, 'Secure Hash Standard,' FIPS PUB 180-4, 2015.",
      supports: "Official SHA-1 specification.",
    },
    {
      citation: "M. Stevens et al., 'The First Collision for Full SHA-1,' CRYPTO 2017.",
      supports: "The SHAttered practical collision.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
