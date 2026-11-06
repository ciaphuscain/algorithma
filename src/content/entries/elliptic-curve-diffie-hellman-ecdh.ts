import type { AlgorithmEntry } from "../types";

export const ellipticCurveDiffieHellmanEcdhEntry: AlgorithmEntry = {
  slug: "elliptic-curve-diffie-hellman-ecdh",
  name: "Elliptic Curve Diffie–Hellman (ECDH)",
  aliases: ["ECDH"],
  curriculum: [474],
  domain: "cryptography",
  subcategory: "Cryptography",
  difficulty: "intermediate",
  summary:
    "Performs key agreement over an insecure channel using elliptic curve point multiplication, providing equivalent security to classical DH with much smaller keys (256-bit vs 3072-bit).",
  tags: ["key exchange", "elliptic curve", "cryptography"],
  prerequisites: ["Diffie–Hellman Key Exchange"],
  related: ["diffie-hellman-key-exchange", "elliptic-curve-digital-signature-algorithm-ecdsa"],
  problem: {
    input: "A public elliptic curve, generator point G, and each party's private key (scalar).",
    output: "A shared secret point on the curve.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "ECDH is Diffie–Hellman transplanted from modular arithmetic to elliptic curves. Instead of g^a mod p, Alice computes a×G (scalar multiplication of the curve's generator point). Security comes from the elliptic curve discrete log problem (ECDLP): given G and a×G, finding a is believed to be hard.",
      },
      {
        kind: "p",
        text: "The advantage over classical DH is key size: 256-bit ECC keys provide security comparable to 3072-bit RSA/DH keys.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Agree on curve parameters (e.g., P-256 or Curve25519) and generator point G.",
          "Alice picks random scalar a, computes A = a × G, sends A.",
          "Bob picks random scalar b, computes B = b × G, sends B.",
          "Alice computes shared = a × B = a × b × G.",
          "Bob computes shared = b × A = b × a × G.",
          "Both derive the same shared secret.",
        ],
      },
      {
        kind: "p",
        text: "The shared secret is typically the x-coordinate of the resulting point, fed into a key derivation function.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Scalar multiplication uses double-and-add (analogous to binary exponentiation).",
          "Constant-time implementations prevent side-channel attacks.",
          "X25519 (Curve25519 for ECDH) uses Montgomery ladder for efficient, constant-time scalar multiplication.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "An elliptic curve over F_p is the set of points (x,y) satisfying y² = x³ + ax + b (plus the point at infinity). Point addition forms an abelian group. Scalar multiplication n × P means adding P to itself n times.",
      },
      {
        kind: "p",
        text: "Scalar multiplication takes O(log n) point additions, each O(log² p) for field arithmetic. Overall O(log n × log² p).",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Post-quantum hybrid schemes combine ECDH with lattice-based key exchange for quantum resistance.",
          "Curve25519 (Montgomery form) and P-256 (Weierstrass form) are the most widely deployed curves.",
          "Invalid curve attacks exploit implementations that don't validate received points.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(log n)",
      average: "O(log n)",
      worst: "O(log n)",
    },
    space: "O(1)",
    worstClass: "log n",
    note: "n = scalar size (256 bits typically).",
  },
  properties: [
    {
      label: "Key size",
      value: "256 bits (≈ 128-bit security)",
    },
    {
      label: "Basis",
      value: "Elliptic curve discrete log problem",
    },
    {
      label: "Curves",
      value: "P-256, Curve25519",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "ecdh_demo",
      code: `def ecdh_demo(private_a, private_b, group_order):
    """Simplified ECDH demo using modular arithmetic as analogy.
    Shared secret = (private_a * private_b) mod group_order."""
    public_a = private_a % group_order
    public_b = private_b % group_order
    shared_a = (public_b * private_a) % group_order
    shared_b = (public_a * private_b) % group_order
    return shared_a
`,
      tests: [
        {
          args: [7, 11, 23],
          expected: 8,
        },
        {
          args: [3, 5, 13],
          expected: 2,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "ecdh-advantage",
      kind: "mcq",
      prompt: "What is the main advantage of ECDH over classical Diffie–Hellman?",
      options: [
        "Equivalent security with much smaller keys",
        "It's faster to implement",
        "It doesn't need a generator",
        "It's quantum-resistant",
      ],
      answer: 0,
      explanation: "A 256-bit ECC key provides security comparable to a 3072-bit classical DH key.",
      hints: ["Compare key sizes for the same security level."],
      objective: "Know ECDH key size advantage",
    },
  ],
  exam: {
    definition:
      "ECDH performs Diffie–Hellman over elliptic curves, achieving equivalent security with smaller keys.",
    steps: [
      "Agree on curve and generator G.",
      "Each party picks scalar, sends scalar × G.",
      "Shared secret = a × b × G.",
    ],
    timeComplexity: "O(log n) scalar multiplication",
    spaceComplexity: "O(1)",
    correctness: "Security reduces to the ECDLP on the chosen curve.",
    applications: ["TLS key exchange", "Signal Protocol", "Cryptocurrency"],
    limitations: ["Not quantum-resistant"],
    faq: [
      {
        q: "Why use curves instead of Z_p*?",
        a: "No known subexponential algorithm for ECDLP (unlike index calculus for DLP).",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["ECDH protocol steps.", "Key size advantage over classical DH."],
      },
    ],
  },
  references: [
    {
      citation: "V. Miller, 'Use of Elliptic Curves in Cryptography,' CRYPTO 1985.",
      supports: "Elliptic curve cryptography introduction.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
