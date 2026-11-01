import type { AlgorithmEntry } from "../types";

export const ed25519Entry: AlgorithmEntry = {
  slug: "ed25519",
  name: "Ed25519",
  aliases: [
    "Edwards-curve Digital Signature Algorithm",
  ],
  curriculum: [
    596,
  ],
  domain: "cryptography",
  subcategory: "Cryptography",
  difficulty: "intermediate",
  summary: "A digital signature scheme using Curve25519 (a twisted Edwards curve) that produces 64-byte signatures with 128-bit security, valued for speed, small keys, and resistance to side-channel attacks.",
  tags: [
    "digital signature",
    "elliptic curve",
    "Curve25519",
    "cryptography",
  ],
  prerequisites: [
    "Elliptic Curve Diffie–Hellman (ECDH)",
  ],
  related: [
    "elliptic-curve-digital-signature-algorithm-ecdsa",
  ],
  problem: {
    input: "A message and a private key (or public key for verification).",
    output: "A 64-byte digital signature (signing) or a boolean (verification).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Ed25519 is a modern signature scheme designed for safety and speed. It uses a twisted Edwards curve where point addition has a complete formula (no special cases), eliminating many implementation pitfalls.",
      },
      {
        kind: "p",
        text: "Signing is deterministic: the nonce is derived from the private key and message via hashing, preventing the catastrophic nonce-reuse vulnerability that has broken ECDSA implementations.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "**Key generation:** Private key a (32 random bytes). Hash a to get scalar s and prefix. Public key A = s × B (base point multiplication).",
          "**Sign:** r = H(prefix || message). R = r × B. S = r + H(R || A || message) × s mod ℓ. Signature = (R, S).",
          "**Verify:** Check S × B = R + H(R || A || message) × A.",
        ],
      },
      {
        kind: "p",
        text: "All arithmetic is modular, using the curve's group order ℓ ≈ 2^252. The hash function is SHA-512.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Deterministic signatures prevent nonce-reuse attacks.",
          "Batch verification can verify many signatures faster than one-by-one.",
          "The 'clamping' of the private key scalar prevents small-subgroup attacks.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Curve25519: x² + y² = 1 + d·x²·y² over F_p where p = 2^255 − 19 and d = −121665/121666.",
      },
      {
        kind: "p",
        text: "Signing and verification each require 1-2 scalar multiplications: O(256) point additions, each O(1) field operations. Overall O(1) with respect to message length (after hashing).",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Ed448 is a similar scheme with 224-bit security using Curve448.",
          "Ristretto group encoding eliminates cofactor-related issues for protocols built on Curve25519.",
          "Ed25519 is used in SSH, TLS 1.3, Signal Protocol, and many blockchain systems.",
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
    note: "Constant-time operations on fixed-size keys and signatures.",
  },
  properties: [
    {
      label: "Curve",
      value: "Twisted Edwards Curve25519",
    },
    {
      label: "Security",
      value: "~128 bits",
    },
    {
      label: "Signature size",
      value: "64 bytes",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "ed25519_demo",
      code: `def ed25519_demo(message_len, key_len):
    """Demo: Ed25519 key and signature sizes are fixed regardless of input."""
    public_key_bytes = 32
    signature_bytes = 64
    private_key_bytes = 32
    return [public_key_bytes, private_key_bytes, signature_bytes]
`,
      tests: [
        {
          args: [
            100,
            32,
          ],
          expected: [
            32,
            32,
            64,
          ],
        },
        {
          args: [
            1000000,
            32,
          ],
          expected: [
            32,
            32,
            64,
          ],
        },
      ],
    },
  ],
  practice: [
    {
      id: "ed25519-nonce",
      kind: "mcq",
      prompt: "Why is Ed25519's deterministic nonce generation important?",
      options: [
        "Prevents catastrophic nonce-reuse attacks",
        "Makes signatures smaller",
        "Enables batch verification",
        "Increases speed",
      ],
      answer: 0,
      explanation: "If the same nonce is used for two different messages, the private key can be extracted. Deterministic nonce derivation prevents this.",
      hints: [
        "What happens if a nonce is reused in ECDSA?",
      ],
      objective: "Understand Ed25519 security advantages",
    },
  ],
  exam: {
    definition: "Ed25519 is a deterministic signature scheme on Curve25519 with 128-bit security and 64-byte signatures.",
    steps: [
      "Hash private key to get scalar and prefix.",
      "Sign: R = rB, S = r + H(R,A,msg)·s.",
      "Verify: SB = R + H(R,A,msg)·A.",
    ],
    timeComplexity: "O(1) per signature",
    spaceComplexity: "O(1)",
    correctness: "Security reduces to the discrete logarithm problem on Curve25519.",
    applications: [
      "SSH key authentication",
      "TLS 1.3",
      "Cryptocurrency signing",
    ],
    limitations: [
      "Quantum computers threaten all elliptic curve schemes",
    ],
    faq: [
      {
        q: "Why is Ed25519 preferred over ECDSA?",
        a: "Deterministic nonces, simpler implementation, resistance to side channels.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Sign and verify steps.",
          "Deterministic nonce advantage.",
        ],
      },
    ],
  },
  references: [
    {
      citation: "D. J. Bernstein et al., 'High-speed high-security signatures,' Journal of Cryptographic Engineering, 2(2), 2012.",
      supports: "The Ed25519 specification.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
