import type { AlgorithmEntry } from "../types";

export const kyberPostQuantumKeyExchangeEntry: AlgorithmEntry = {
  slug: "kyber-post-quantum-key-exchange",
  name: "Kyber (Post-Quantum Key Exchange)",
  aliases: ["CRYSTALS-Kyber", "ML-KEM"],
  curriculum: [597],
  domain: "cryptography",
  subcategory: "Cryptography",
  difficulty: "intermediate",
  summary:
    "A lattice-based key encapsulation mechanism (KEM) standardized by NIST as ML-KEM, based on the hardness of the Module Learning With Errors (M-LWE) problem, designed to resist quantum computer attacks.",
  tags: ["post-quantum", "lattice", "KEM", "NIST"],
  prerequisites: ["Public-Key Cryptography"],
  related: ["aes-encryption", "rsa-key-generation"],
  problem: {
    input: "Two parties wanting to establish a shared secret key.",
    output: "A shared secret, secure against both classical and quantum adversaries.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "RSA and Diffie–Hellman rely on factoring and discrete log problems, which quantum computers can solve with Shor's algorithm. Kyber instead uses lattice problems, where adding structured noise makes it hard to recover a secret vector even with a quantum computer.",
      },
      {
        kind: "p",
        text: "The core idea: given a matrix A and a noisy product b = As + e (where s is secret and e is small error), recovering s is believed to be hard — this is the Learning With Errors (LWE) problem.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "**Key Generation**: Sample random matrix A and secret s. Compute public key b = As + e.",
          "**Encapsulation**: Sender uses the public key to encrypt a random message m with fresh noise, producing a ciphertext.",
          "**Decapsulation**: Receiver uses secret key s to remove the noise and recover the shared secret.",
          "Both parties derive the same shared key from the recovered message.",
        ],
      },
      {
        kind: "p",
        text: "**Key sizes**: Kyber-768 (recommended) uses 2400-byte public keys and 1088-byte ciphertexts for 192-bit security.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Kyber operates over polynomial rings $\\mathbb{Z}_q[x]/(x^{256}+1)$ with q = 3329.",
          "NTT (Number Theoretic Transform) is used for fast polynomial multiplication.",
          "Compression and decompression reduce ciphertext size.",
          "NIST standardized it as ML-KEM (FIPS 203) in 2024.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Security is based on M-LWE: given $(A, As + e)$ where $A$ is random, $s$ is secret, and $e$ is small Gaussian noise, it's hard to distinguish from $(A, u)$ where $u$ is random.",
      },
      {
        kind: "p",
        text: "The module structure (operating over a module of rank k over a polynomial ring) provides efficiency. Decryption correctness requires that accumulated noise is small enough to decode.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Kyber comes in three variants: Kyber-512 (128-bit), Kyber-768 (192-bit), Kyber-1024 (256-bit).",
          "Combines with classical DH in hybrid mode (e.g., X25519 + Kyber) for defense in depth.",
          "Side-channel resistance is crucial: constant-time implementations needed.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n log n)",
    },
    space: "O(n)",
    worstClass: "n log n",
    note: "n = polynomial ring dimension (256). Dominated by NTT operations.",
  },
  properties: [
    {
      label: "Quantum-safe",
      value: "Based on lattice problems",
    },
    {
      label: "NIST standard",
      value: "ML-KEM (FIPS 203)",
    },
    {
      label: "Key size",
      value: "~2.4 KB public key (Kyber-768)",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "kyber_toy_lwe",
      code: `def kyber_toy_lwe(n, q):
    """Toy LWE-based encryption to illustrate the core idea.
    NOT cryptographically secure - for education only."""
    import random
    random.seed(42)
    # Key generation
    A = [[random.randint(0, q-1) for _ in range(n)] for _ in range(n)]
    s = [random.randint(0, 1) for _ in range(n)]
    e = [random.randint(-1, 1) for _ in range(n)]
    b = [(sum(A[i][j] * s[j] for j in range(n)) + e[i]) % q for i in range(n)]
    # Encrypt a bit
    bit = 1
    r = [random.randint(0, 1) for _ in range(n)]
    e1 = [random.randint(-1, 1) for _ in range(n)]
    e2 = random.randint(-1, 1)
    u = [(sum(A[j][i] * r[j] for j in range(n)) + e1[i]) % q for i in range(n)]
    v = (sum(b[j] * r[j] for j in range(n)) + e2 + (q // 2) * bit) % q
    # Decrypt
    inner = sum(s[i] * u[i] for i in range(n)) % q
    noisy = (v - inner) % q
    decrypted = 1 if abs(noisy - q // 2) < q // 4 or abs(noisy - q // 2 + q) < q // 4 else 0
    if noisy > q // 2:
        noisy = noisy - q
    decrypted = 1 if abs(noisy - q // 2) < q // 4 else 0
    return decrypted
`,
      tests: [
        {
          args: [4, 97],
          expected: 0,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "kyber-basis",
      kind: "mcq",
      prompt: "What mathematical problem is Kyber's security based on?",
      options: [
        "Module Learning With Errors (M-LWE)",
        "Integer factorization",
        "Discrete logarithm",
        "Shortest vector problem directly",
      ],
      answer: 0,
      explanation: "Kyber's security reduces to the hardness of M-LWE on structured lattices.",
      hints: ["It involves adding noise to a linear system."],
      objective: "Understand Kyber's security basis",
    },
  ],
  exam: {
    definition:
      "Kyber is a lattice-based KEM using the Module-LWE problem, standardized by NIST as ML-KEM for post-quantum key exchange.",
    steps: [
      "Generate keys from noisy matrix-vector product.",
      "Encapsulate with fresh noise.",
      "Decapsulate by removing noise with secret key.",
    ],
    timeComplexity: "$O(n \\log n)$ per operation",
    spaceComplexity: "$O(n)$",
    correctness: "M-LWE hardness: recovering s from (A, As+e) is hard even for quantum computers.",
    applications: ["Post-quantum TLS", "Hybrid key exchange", "VPN encryption"],
    limitations: ["Larger keys than classical schemes", "Relatively new, less battle-tested"],
    faq: [
      {
        q: "Why not just use RSA/DH?",
        a: "Quantum computers running Shor's algorithm can break RSA and DH in polynomial time.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["LWE problem description (1). Key generation and encapsulation (1)."],
      },
    ],
  },
  references: [
    {
      citation:
        "R. Avanzi et al., 'CRYSTALS-Kyber Algorithm Specifications and Supporting Documentation,' NIST PQC Round 3 Submission, 2021.",
      supports: "The Kyber specification.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
