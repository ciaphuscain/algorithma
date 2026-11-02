import type { AlgorithmEntry } from "../types";

export const ellipticCurveDigitalSignatureAlgorithmEcdsaEntry: AlgorithmEntry = {
  slug: "elliptic-curve-digital-signature-algorithm-ecdsa",
  name: "Elliptic Curve Digital Signature Algorithm (ECDSA)",
  aliases: ["ECDSA"],
  curriculum: [475],
  domain: "cryptography",
  subcategory: "Cryptography",
  difficulty: "intermediate",
  summary:
    "A digital signature scheme using elliptic curves that generates compact signatures (64 bytes for 128-bit security), widely used in TLS, Bitcoin, and other protocols.",
  tags: ["digital signature", "elliptic curve", "cryptography"],
  prerequisites: ["Elliptic Curve Diffie–Hellman (ECDH)"],
  related: ["ed25519"],
  problem: {
    input: "A message and a private key (signing) or public key (verification).",
    output: "A signature (r, s) or a boolean verification result.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "ECDSA is the elliptic curve version of DSA. To sign, you pick a random nonce k, compute a curve point k×G, and use its x-coordinate along with the message hash and private key to produce the signature (r, s).",
      },
      {
        kind: "p",
        text: "Verification reconstructs a point from the public key, message hash, and signature, and checks if its x-coordinate matches r. The security relies on the difficulty of the ECDLP.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "**Sign:** Pick random k. Compute R = k × G, set r = R.x mod n. Compute s = k⁻¹(H(m) + r·d) mod n where d is the private key.",
          "**Verify:** Compute u₁ = H(m)·s⁻¹ mod n, u₂ = r·s⁻¹ mod n. Compute P = u₁G + u₂Q (Q = public key). Accept if P.x mod n = r.",
          "The nonce k must be unique per signature; reuse reveals the private key.",
        ],
      },
      {
        kind: "p",
        text: "In practice, k is derived deterministically from the private key and message (RFC 6979) to prevent nonce-reuse vulnerabilities.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "RFC 6979 specifies deterministic nonce generation for safety.",
          "The signature is 64 bytes (two 32-byte integers r, s) for P-256.",
          "ECDSA is used in Bitcoin (secp256k1 curve), TLS, and code signing.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Correctness: u₁G + u₂Q = u₁G + u₂·dG = (u₁ + u₂·d)G = s⁻¹(H(m) + r·d)G = k·G = R. So P.x = r.",
      },
      {
        kind: "p",
        text: "Signing and verification each require 1-2 scalar multiplications: O(log n) point operations.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Ed25519 (EdDSA) is increasingly preferred over ECDSA for its simpler, safer design.",
          "The Sony PS3 hack (2010) exploited a static nonce in ECDSA to extract the private key.",
          "Schnorr signatures (BIP 340) replace ECDSA in newer Bitcoin protocols.",
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
    note: "n = curve order (256 bits typically).",
  },
  properties: [
    {
      label: "Signature size",
      value: "64 bytes (P-256)",
    },
    {
      label: "Security",
      value: "~128 bits (P-256)",
    },
    {
      label: "Nonce sensitivity",
      value: "Critical — reuse leaks private key",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "ecdsa_demo",
      code: `def ecdsa_demo(hash_val, private_key, nonce, order):
    """Simplified ECDSA signing demo (mod arithmetic, not real curve ops).
    Returns (r, s) where r = nonce mod order, s = nonce_inv * (hash + r * key) mod order."""
    r = nonce % order
    if r == 0:
        return [-1, -1]
    nonce_inv = pow(nonce, order - 2, order)  # Fermat's little theorem
    s = (nonce_inv * (hash_val + r * private_key)) % order
    return [r, s]
`,
      tests: [
        {
          args: [10, 3, 7, 11],
          expected: [7, 6],
        },
        {
          args: [5, 2, 3, 7],
          expected: [3, 6],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "ecdsa-nonce-reuse",
      kind: "mcq",
      prompt: "What happens if the same nonce k is used for two different ECDSA signatures?",
      options: [
        "The private key can be extracted",
        "The signatures are identical",
        "Verification fails",
        "Nothing; nonces can be reused",
      ],
      answer: 0,
      explanation:
        "Two signatures with the same k but different messages yield two equations in two unknowns (k and private key d), which can be solved.",
      hints: ["What is shared between the two signatures?"],
      objective: "Understand the nonce-reuse vulnerability",
    },
  ],
  exam: {
    definition:
      "ECDSA produces compact digital signatures using elliptic curve scalar multiplication.",
    steps: ["Sign: r = (kG).x, s = k⁻¹(H(m) + rd) mod n.", "Verify: check (u₁G + u₂Q).x = r."],
    timeComplexity: "O(log n) per operation",
    spaceComplexity: "O(1)",
    correctness:
      "Algebraically, verification reconstructs the point R = kG from the signature and message.",
    applications: ["Bitcoin transactions", "TLS certificates", "Code signing"],
    limitations: ["Nonce reuse catastrophic", "Not quantum-resistant"],
    faq: [
      {
        q: "Why use deterministic nonces (RFC 6979)?",
        a: "Eliminates the risk of random number generator failure causing nonce reuse.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["ECDSA sign/verify steps.", "Nonce-reuse vulnerability."],
      },
    ],
  },
  references: [
    {
      citation:
        "D. Johnson, A. Menezes, S. Vanstone, 'The Elliptic Curve Digital Signature Algorithm (ECDSA),' Int. J. Inf. Security, 1(1), 2001.",
      supports: "ECDSA specification and analysis.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
