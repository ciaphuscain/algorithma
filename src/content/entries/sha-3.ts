import type { AlgorithmEntry } from "../types";

export const sha3Entry: AlgorithmEntry = {
  slug: "sha-3",
  name: "SHA-3",
  aliases: ["Keccak", "SHA3-256", "SHA3-512"],
  curriculum: [483],
  domain: "cryptography",
  subcategory: "Cryptography",
  difficulty: "intermediate",
  summary:
    "SHA-3 (Keccak) is a cryptographic hash function using a sponge construction instead of Merkle–Damgård, providing a completely different design basis from SHA-2 as a backup standard.",
  tags: ["hash function", "cryptography", "sponge construction", "Keccak"],
  prerequisites: ["Hashing Fundamentals"],
  related: ["sha-1", "sha-2"],
  problem: {
    input: "An arbitrary-length byte string.",
    output: "A fixed-size hash digest (224, 256, 384, or 512 bits).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "SHA-3 abandons Merkle–Damgård entirely in favor of a sponge: the state is a 1600-bit array that absorbs input blocks by XORing them in, then squeezes out the hash. The permutation function (Keccak-f) thoroughly mixes all 1600 bits in 24 rounds.",
      },
      {
        kind: "p",
        text: "The sponge construction is inherently resistant to length extension attacks and provides a clean separation between the capacity (security) and rate (speed) parameters. Higher capacity means more security but slower hashing.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Pad the message with multi-rate padding (append 0x06, zeros, 0x80).",
          "Split into r-bit blocks where r = 1600 - 2*security_bits (r=1088 for SHA3-256).",
          "Absorb: XOR each block into the first r bits of the 1600-bit state, apply Keccak-f.",
          "Squeeze: read r bits of state as output; if more bits needed, apply Keccak-f and read again.",
        ],
      },
      {
        kind: "p",
        text: "The Keccak-f permutation operates on a 5×5×64 bit array through 5 steps (θ, ρ, π, χ, ι) for 24 rounds.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "The 1600-bit state is organized as a 5×5 array of 64-bit lanes.",
          "SHA3-256 has rate 1088 bits and capacity 512 bits.",
          "SHAKE128 and SHAKE256 are extendable-output variants (XOFs) producing arbitrary-length output.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The sponge construction provides min(2^(c/2), 2^d) collision resistance where c is capacity and d is output length. For SHA3-256: c=512, d=256, giving 2^256 preimage and 2^128 collision resistance.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "SHA-3 is not meant to replace SHA-2 (which remains secure) but to provide algorithmic diversity.",
          "SHAKE XOFs enable domain separation and are used in post-quantum cryptography (Kyber, Dilithium).",
          "The duplex construction extends the sponge for authenticated encryption (Keyak, Ketje).",
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
    note: "Linear in message length; constant 1600-bit state.",
  },
  properties: [
    {
      label: "Construction",
      value: "Sponge (not Merkle–Damgård)",
    },
    {
      label: "State size",
      value: "1600 bits",
    },
    {
      label: "Length extension",
      value: "Inherently immune",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "sha3_256_hash",
      code: `def sha3_256_hash(message):
    """Compute SHA3-256 hash of a string. Returns hex digest."""
    import hashlib
    return hashlib.sha3_256(message.encode()).hexdigest()
`,
      tests: [
        {
          args: [""],
          expected: "a7ffc6f8bf1ed76651c14756a061d662f580ff4de43b49fa82d80a4b80f8434a",
        },
        {
          args: ["abc"],
          expected: "3a985da74fe225b2045c172d6bd390bd855f086e3e9d525b46bfe24511431532",
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "sha3-sponge",
      kind: "mcq",
      prompt: "What construction does SHA-3 use?",
      options: ["Sponge", "Merkle–Damgård", "Davies–Meyer", "Feistel network"],
      answer: 0,
      explanation:
        "SHA-3 uses the sponge construction, which absorbs input and squeezes output through a fixed permutation on a large state.",
      hints: ["It's fundamentally different from SHA-1 and SHA-2."],
      objective: "Know SHA-3 design",
    },
  ],
  exam: {
    definition:
      "SHA-3 (Keccak) uses a sponge construction with a 1600-bit state and 24 rounds of the Keccak-f permutation.",
    steps: [
      "Pad message.",
      "Absorb blocks into state via XOR + permutation.",
      "Squeeze output bits.",
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    correctness: "Security from sponge: 2^(c/2) collision resistance.",
    applications: [
      "Algorithmic diversity backup for SHA-2",
      "Post-quantum crypto (SHAKE XOFs)",
      "Authenticated encryption",
    ],
    limitations: ["Often slower than SHA-2 in software without hardware support"],
    faq: [
      {
        q: "Why was SHA-3 standardized if SHA-2 is secure?",
        a: "Algorithmic diversity: if a structural weakness is found in Merkle–Damgård, SHA-3 provides an independent backup.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Sponge construction (1).", "Compare with SHA-2 (1)."],
      },
    ],
  },
  references: [
    {
      citation:
        "G. Bertoni, J. Daemen, M. Peeters, G. Van Assche, 'Keccak,' NIST SHA-3 Competition, 2012.",
      supports: "The winning SHA-3 submission.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
