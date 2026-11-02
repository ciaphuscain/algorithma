import type { AlgorithmEntry } from "../types";

export const sha2Entry: AlgorithmEntry = {
  slug: "sha-2",
  name: "SHA-2",
  aliases: ["SHA-256", "SHA-512", "Secure Hash Algorithm 2"],
  curriculum: [482],
  domain: "cryptography",
  subcategory: "Cryptography",
  difficulty: "intermediate",
  summary:
    "SHA-2 is a family of cryptographic hash functions (SHA-224, SHA-256, SHA-384, SHA-512) using the Merkle–Damgård construction with 64 or 80 rounds, widely used for data integrity and digital signatures.",
  tags: ["hash function", "cryptography", "SHA-256", "SHA-512"],
  prerequisites: ["Hashing Fundamentals"],
  related: ["sha-1", "sha-3"],
  problem: {
    input: "An arbitrary-length byte string.",
    output: "A fixed-size hash digest (256 or 512 bits depending on variant).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "SHA-2 improves on SHA-1 by using more state words (eight instead of five), more complex round functions, and larger word sizes (32-bit for SHA-256, 64-bit for SHA-512). The extra complexity provides strong collision resistance with no known practical attacks.",
      },
      {
        kind: "p",
        text: "Like SHA-1, it uses Merkle–Damgård: pad, split into blocks, chain through a compression function. The compression function uses Σ (sigma) rotation functions and Ch/Maj bitwise operations across 64 rounds (SHA-256) or 80 rounds (SHA-512).",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Pad the message to a multiple of 512 bits (SHA-256) or 1024 bits (SHA-512).",
          "Initialise eight state words from fractional parts of square roots of the first 8 primes.",
          "For each block: expand message schedule (16 → 64 or 80 words), run rounds updating eight working variables.",
          "Each round: T1 = h + Σ1(e) + Ch(e,f,g) + K_i + W_i, T2 = Σ0(a) + Maj(a,b,c), shift and add.",
          "Add round result to state; concatenate for final digest.",
        ],
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "SHA-256 uses 32-bit words with 64 rounds; SHA-512 uses 64-bit words with 80 rounds.",
          "The round constants K_i are derived from cube roots of the first 64 (or 80) primes.",
          "Hardware acceleration (SHA-NI instructions) makes SHA-256 very fast on modern CPUs.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "SHA-256 provides 2^128 collision resistance and 2^256 preimage resistance. No attacks better than brute force are known. The security margin is comfortable for the foreseeable future.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "SHA-256 is used in Bitcoin's proof-of-work (double SHA-256).",
          "SHA-512/256 truncates SHA-512 output to 256 bits, gaining speed on 64-bit platforms with SHA-512's larger word size.",
          "Length extension attacks apply to plain SHA-2 hashes; use HMAC or SHA-512/256 to prevent them.",
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
    note: "n is message length; linear in the number of blocks.",
  },
  properties: [
    {
      label: "Digest sizes",
      value: "224, 256, 384, or 512 bits",
    },
    {
      label: "Collision resistance",
      value: "No known attacks better than brute force",
    },
    {
      label: "Widely deployed",
      value: "TLS, Bitcoin, code signing, etc.",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "sha256_hash",
      code: `def sha256_hash(message):
    """Compute SHA-256 hash of a string. Returns hex digest."""
    import hashlib
    return hashlib.sha256(message.encode()).hexdigest()
`,
      tests: [
        {
          args: [""],
          expected: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        },
        {
          args: ["abc"],
          expected: "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "sha2-vs-sha1",
      kind: "mcq",
      prompt: "What is the primary improvement of SHA-256 over SHA-1?",
      options: [
        "Eight state words and more complex rounds give stronger collision resistance",
        "It is faster",
        "It produces shorter hashes",
        "It uses less memory",
      ],
      answer: 0,
      explanation:
        "SHA-256 uses eight 32-bit state words (vs five in SHA-1) and more sophisticated round functions, with no known collision attacks.",
      hints: ["Compare the internal state sizes."],
      objective: "Contrast SHA-1 and SHA-2",
    },
  ],
  exam: {
    definition:
      "SHA-2 is a family of Merkle–Damgård hashes with eight state words, providing strong collision resistance.",
    steps: [
      "Pad message.",
      "Init 8 state words.",
      "Expand message schedule.",
      "64 or 80 rounds.",
      "Output concatenated state.",
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    correctness: "No attacks better than brute force; 2^128 collision resistance for SHA-256.",
    applications: ["TLS certificates", "Bitcoin", "Code signing", "File integrity"],
    limitations: [
      "Vulnerable to length extension attacks without HMAC",
      "Slower than SHA-3 on some platforms",
    ],
    faq: [
      {
        q: "Why use SHA-512/256?",
        a: "It runs at SHA-512 speed on 64-bit CPUs but is immune to length extension attacks.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Describe structure (1).", "Variants and security (1)."],
      },
    ],
  },
  references: [
    {
      citation: "NIST, 'Secure Hash Standard,' FIPS PUB 180-4, 2015.",
      supports: "Official SHA-2 specification.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
