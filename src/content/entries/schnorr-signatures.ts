import type { AlgorithmEntry } from "../types";

export const schnorrSignaturesEntry: AlgorithmEntry = {
  slug: "schnorr-signatures",
  name: "Schnorr Signatures",
  aliases: ["Schnorr Signature Scheme"],
  curriculum: [595],
  domain: "cryptography",
  subcategory: "Cryptography",
  difficulty: "intermediate",
  summary:
    "Schnorr signatures are a digital signature scheme based on the discrete logarithm problem, producing short signatures with provable security under the random oracle model.",
  tags: ["digital signature", "discrete logarithm", "cryptography", "elliptic curve"],
  prerequisites: ["Modular Arithmetic"],
  related: ["rsa-encryption"],
  problem: {
    input:
      "A private key, a message to sign, and group parameters (prime p, generator g, order q).",
    output: "A signature pair (s, e) that anyone can verify using the corresponding public key.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Schnorr signatures work by combining a random commitment with a hash challenge. The signer picks a random nonce, computes a commitment, hashes it together with the message to get a challenge, and then responds to the challenge using the private key. Anyone with the public key can verify the response matches the commitment.",
      },
      {
        kind: "p",
        text: "The security relies on the discrete logarithm problem: given g^x mod p, it is computationally infeasible to recover x. The random oracle model (modeled by a hash function) ensures the challenge is unpredictable.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Key generation: pick random private key x, compute public key y = g^x mod p.",
          "To sign message m: pick random k, compute r = g^k mod p.",
          "Compute challenge e = H(r || m) where H is a cryptographic hash.",
          "Compute s = k - x*e mod q.",
          "Signature is (s, e).",
        ],
      },
      {
        kind: "p",
        text: "**Verification**: compute r' = g^s * y^e mod p, then check e == H(r' || m).",
      },
      {
        kind: "p",
        text: "**Worked example** with small numbers: p=23, q=11, g=2, x=6, y=2^6 mod 23=18. Sign m='hi': k=7, r=2^7 mod 23=13. e=H(13||'hi') mod 11, say e=3. s=(7-6*3) mod 11 = (7-18) mod 11 = 0. Verify: r'=2^0*18^3 mod 23=1*5832 mod 23=13. Check H(13||'hi') mod 11==3.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Use a cryptographically secure random number generator for the nonce k. Reusing k leaks the private key.",
          "In practice Schnorr signatures are implemented over elliptic curves (e.g., Ed25519).",
          "The signature (s, e) is compact — about half the size of an RSA signature for equivalent security.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Correctness**: r' = g^s * y^e = g^(k-xe) * g^(xe) = g^k = r mod p, so H(r'||m) = H(r||m) = e.",
      },
      {
        kind: "p",
        text: "**Security**: Under the discrete logarithm assumption and the random oracle model, forging a signature is as hard as computing discrete logarithms. The scheme is existentially unforgeable under chosen-message attacks.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Schnorr signatures are the basis for multi-signature schemes like MuSig and threshold signatures.",
          "Bitcoin adopted Schnorr signatures (BIP 340) for Taproot, enabling key and signature aggregation.",
          "The scheme is linearly homomorphic: signatures can be aggregated, which is not possible with ECDSA.",
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
    worstClass: "other",
    note: "Dominated by modular exponentiation, where n is the bit length of the modulus.",
  },
  properties: [
    {
      label: "Signature size",
      value: "Two group elements (~64 bytes for 256-bit curves)",
    },
    {
      label: "Security assumption",
      value: "Discrete logarithm + random oracle model",
    },
    {
      label: "Aggregatable",
      value: "Yes, signatures can be linearly combined",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "schnorr_sign",
      code: `def schnorr_sign(p, q, g, x, k, m_hash):
    """Simplified Schnorr signing. Returns (s, e).
    p: prime, q: order of g, g: generator, x: private key, k: nonce, m_hash: int hash of message."""
    r = pow(g, k, p)
    e = (r + m_hash) % q  # simplified hash
    s = (k - x * e) % q
    return (s, e)

def schnorr_verify(p, q, g, y, m_hash, s, e):
    """Verify a Schnorr signature."""
    r_prime = (pow(g, s, p) * pow(y, e, p)) % p
    e_prime = (r_prime + m_hash) % q
    return e_prime == e
`,
      tests: [
        {
          args: [23, 11, 2, 6, 7, 5],
          expected: [9, 7],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "schnorr-reuse",
      kind: "mcq",
      prompt: "What happens if the same nonce k is used to sign two different messages?",
      options: [
        "The private key can be recovered",
        "The signature becomes invalid",
        "Nothing, nonces can be reused",
        "The public key changes",
      ],
      answer: 0,
      explanation:
        "If k is reused for messages m1 and m2, the attacker gets two equations s1=k-x*e1 and s2=k-x*e2, from which x can be computed.",
      hints: ["Think about what the attacker can compute from two signatures with the same k."],
      objective: "Understand nonce security",
    },
  ],
  exam: {
    definition:
      "Schnorr signatures produce short digital signatures based on the discrete logarithm problem, with provable security in the random oracle model.",
    steps: [
      "Generate keys: x random, y = g^x mod p.",
      "Sign: pick k, r = g^k mod p, e = H(r||m), s = k - xe mod q.",
      "Verify: check H(g^s * y^e mod p || m) == e.",
    ],
    timeComplexity: "O(log n) for modular exponentiation",
    spaceComplexity: "O(1)",
    correctness: "Correctness follows from g^(k-xe)*g^(xe) = g^k.",
    applications: ["Bitcoin Taproot", "Multi-signatures", "Threshold cryptography"],
    limitations: ["Requires random oracle model for proof", "Nonce reuse is catastrophic"],
    faq: [
      {
        q: "Why are Schnorr signatures shorter than RSA?",
        a: "They operate in smaller groups (256-bit curves vs 2048-bit RSA moduli) for equivalent security.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Describe key gen, sign, verify (1).", "State security assumption (1)."],
      },
      {
        marks: 5,
        outline: ["Full protocol (2).", "Correctness proof (2).", "Security discussion (1)."],
      },
    ],
  },
  references: [
    {
      citation:
        "C. P. Schnorr, 'Efficient Signature Generation by Smart Cards,' Journal of Cryptology, 4(3), 1991.",
      supports: "The original Schnorr signature scheme.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
