import type { AlgorithmEntry } from "../types";

export const cityhashEntry: AlgorithmEntry = {
  slug: "cityhash",
  name: "CityHash",
  aliases: [],
  curriculum: [89],
  domain: "arrays-hashing",
  subcategory: "Hashing",
  difficulty: "intermediate",
  summary:
    "A family of non-cryptographic hash functions designed by Google for fast hashing of strings, optimized for modern CPUs with 64-bit multiplications and unaligned reads.",
  tags: ["hashing", "non-cryptographic", "string hashing"],
  prerequisites: ["Hash Tables"],
  related: ["zobrist-hashing"],
  problem: {
    input: "A byte string of arbitrary length.",
    output: "A 64-bit (or 128-bit) hash value with good distribution.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "CityHash is designed for speed on modern x86-64 processors. It exploits 64-bit multiply instructions and unaligned memory reads to process input in large chunks, achieving high throughput for strings of all lengths.",
      },
      {
        kind: "p",
        text: "For short strings (< 64 bytes) it uses specialized fast paths; for longer strings it processes 64-byte chunks with a mixing function similar to MurmurHash but tuned for x86-64.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "For strings <= 16 bytes: mix the bytes with constants using multiply-and-shift.",
          "For strings 17-64 bytes: compute a few 64-bit hash values from different portions and combine.",
          "For strings > 64 bytes: process 64-byte blocks in a loop, maintaining state variables mixed after each block.",
          "Finalize by combining state variables.",
        ],
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Uses specific magic constants for mixing.",
          "Relies on unaligned 64-bit loads, which are fast on x86 but may need byte-swapping on other architectures.",
          "CityHash128 extends to 128-bit output using CRC intrinsics when available.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Avalanche**: a single bit change in input flips each output bit with probability close to 1/2.",
      },
      {
        kind: "p",
        text: "**Distribution**: passes SMHasher quality tests for collision resistance and uniformity.",
      },
      {
        kind: "p",
        text: "**Time**: O(n) where n is the input length, with low constant factor on x86-64.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "FarmHash succeeded CityHash at Google with better portability.",
          "xxHash and wyhash offer similar or better performance on modern hardware.",
          "CityHash is NOT suitable for adversarial inputs — use SipHash for hash table security.",
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
    note: "Very low constant factor on x86-64.",
  },
  properties: [
    {
      label: "Output",
      value: "64 or 128 bits",
    },
    {
      label: "Cryptographic",
      value: "No",
    },
    {
      label: "Architecture",
      value: "Optimized for x86-64",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "simple_hash64",
      code: `def simple_hash64(data):
    """Simplified demonstration of a CityHash-style mixing function."""
    h = len(data) * 2654435761 & 0xFFFFFFFF
    for b in data:
        h = ((h ^ b) * 16777619) & 0xFFFFFFFF
    h ^= h >> 16
    h = (h * 0x45d9f3b) & 0xFFFFFFFF
    h ^= h >> 16
    return h
`,
      tests: [
        {
          args: [[]],
          expected: 0,
        },
        {
          args: [[104, 101, 108, 108, 111]],
          expected: 343375755,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "city-use",
      kind: "mcq",
      prompt: "CityHash is best suited for:",
      options: ["Password hashing", "Hash table keys", "Digital signatures", "Encryption"],
      answer: 1,
      explanation:
        "CityHash is a non-cryptographic hash designed for speed in hash tables, not security applications.",
      hints: ["Is CityHash cryptographic?"],
      objective: "Know CityHash use cases",
    },
  ],
  exam: {
    definition:
      "CityHash is a non-cryptographic hash function family from Google, optimized for fast string hashing on x86-64 using 64-bit multiplications.",
    steps: [
      "Length-based dispatch to specialized paths",
      "Short strings: multiply-shift mixing",
      "Long strings: 64-byte block processing",
      "Final mixing",
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    correctness: "Passes SMHasher avalanche and distribution tests empirically.",
    applications: ["Hash tables in databases", "Distributed cache key hashing", "Deduplication"],
    limitations: ["Not cryptographically secure", "Not portable (x86-64 optimized)"],
    faq: [
      {
        q: "Why different paths for different lengths?",
        a: "Short strings can be hashed with fewer operations; the overhead of the loop is not worth it for small inputs.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Non-cryptographic hash for speed; O(n) (2)"],
      },
    ],
  },
  references: [
    {
      citation:
        "G. Pike and J. Alakuijala, CityHash: Fast Hash Functions for Strings, Google, 2011.",
      supports: "CityHash design and benchmarks.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
