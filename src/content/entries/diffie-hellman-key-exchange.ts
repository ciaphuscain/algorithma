import type { AlgorithmEntry } from "../types";

export const diffieHellmanKeyExchangeEntry: AlgorithmEntry = {
  slug: "diffie-hellman-key-exchange",
  name: "Diffie–Hellman Key Exchange",
  aliases: ["DH key exchange", "DHKE"],
  curriculum: [473],
  domain: "cryptography",
  subcategory: "Cryptography",
  difficulty: "intermediate",
  summary:
    "Allows two parties to agree on a shared secret over an insecure channel using modular exponentiation, with security based on the discrete logarithm problem.",
  tags: ["key exchange", "modular arithmetic", "public key", "discrete logarithm"],
  prerequisites: ["Binary Exponentiation"],
  related: ["elliptic-curve-diffie-hellman-ecdh"],
  problem: {
    input: "A public prime p, generator g, and each party's private key.",
    output: "A shared secret known only to the two parties.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Alice and Bob agree on a public prime p and generator g. Alice picks secret a and sends g^a mod p; Bob picks secret b and sends g^b mod p. Both compute the shared secret g^(ab) mod p: Alice raises Bob's value to her secret, and vice versa.",
      },
      {
        kind: "p",
        text: "An eavesdropper sees g^a and g^b but cannot compute g^(ab) without solving the discrete logarithm problem, which is believed to be computationally hard for large primes.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Agree on public parameters: prime p and generator g.",
          "Alice picks random a, computes A = g^a mod p, sends A to Bob.",
          "Bob picks random b, computes B = g^b mod p, sends B to Alice.",
          "Alice computes secret = B^a mod p = g^(ab) mod p.",
          "Bob computes secret = A^b mod p = g^(ab) mod p.",
          "Both now share the same secret.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example:** p=23, g=5. Alice: a=6, A=5^6 mod 23=8. Bob: b=15, B=5^15 mod 23=19. Alice: 19^6 mod 23=2. Bob: 8^15 mod 23=2. Shared secret = 2.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Use fast modular exponentiation (binary exponentiation).",
          "In practice, p should be at least 2048 bits for security.",
          "Vulnerable to man-in-the-middle attacks without authentication.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Security relies on the Computational Diffie–Hellman (CDH) assumption: given g^a and g^b mod p, it is hard to compute g^(ab) mod p without knowing a or b.",
      },
      {
        kind: "p",
        text: "The protocol runs in O(log a × log² p) time per party using fast modular exponentiation. Key generation is dominated by the exponentiation.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Elliptic Curve Diffie–Hellman (ECDH) provides equivalent security with smaller keys.",
          "The protocol is the basis for TLS/SSL key establishment.",
          "Shor's quantum algorithm can solve discrete log in polynomial time, threatening DH security.",
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
    note: "n = exponent size; dominated by modular exponentiation.",
  },
  properties: [
    {
      label: "Security basis",
      value: "Discrete logarithm problem",
    },
    {
      label: "Key size",
      value: "2048+ bits recommended",
    },
    {
      label: "Authentication",
      value: "None (needs separate mechanism)",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "diffie_hellman",
      code: `def diffie_hellman(p, g, a, b):
    """Simulate Diffie-Hellman. Returns (A, B, shared_secret)."""
    A = pow(g, a, p)
    B = pow(g, b, p)
    secret_a = pow(B, a, p)
    secret_b = pow(A, b, p)
    assert secret_a == secret_b
    return [A, B, secret_a]
`,
      tests: [
        {
          args: [23, 5, 6, 15],
          expected: [8, 19, 2],
        },
        {
          args: [7, 3, 2, 5],
          expected: [2, 5, 4],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "dh-security",
      kind: "mcq",
      prompt: "What hard problem does Diffie–Hellman security rely on?",
      options: ["Discrete logarithm", "Integer factorization", "Subset sum", "Graph isomorphism"],
      answer: 0,
      explanation: "Computing a from g^a mod p requires solving the discrete logarithm problem.",
      hints: ["What must an attacker compute from the public values?"],
      objective: "Know the security basis of DH",
    },
  ],
  exam: {
    definition:
      "Diffie–Hellman lets two parties establish a shared secret g^(ab) mod p over an insecure channel.",
    steps: [
      "Agree on p, g.",
      "Each party picks a secret exponent, sends g^x mod p.",
      "Each computes g^(ab) mod p from the other's public value.",
    ],
    timeComplexity: "O(log n) per exponentiation",
    spaceComplexity: "O(1)",
    correctness: "Security reduces to the CDH assumption in the group Z_p*.",
    applications: ["TLS/SSL key exchange", "VPN establishment"],
    limitations: ["Vulnerable to MITM without authentication", "Threatened by quantum computers"],
    faq: [
      {
        q: "Why is authentication needed?",
        a: "Without it, a man-in-the-middle can establish separate secrets with each party.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Protocol steps.", "CDH assumption."],
      },
    ],
  },
  references: [
    {
      citation:
        "W. Diffie, M. Hellman, 'New Directions in Cryptography,' IEEE Trans. on Information Theory, 22(6), 1976.",
      supports: "The original DH key exchange paper.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
