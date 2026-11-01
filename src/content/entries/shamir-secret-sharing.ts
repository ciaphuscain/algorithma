import type { AlgorithmEntry } from "../types";

export const shamirSecretSharingEntry: AlgorithmEntry = {
  slug: "shamir-secret-sharing",
  name: "Shamir Secret Sharing",
  aliases: ["Shamir's Secret Sharing", "SSS", "Threshold Secret Sharing"],
  curriculum: [594],
  domain: "cryptography",
  subcategory: "Cryptography",
  difficulty: "intermediate",
  summary:
    "Shamir's secret sharing splits a secret into n shares such that any k shares can reconstruct it via polynomial interpolation, but fewer than k shares reveal nothing.",
  tags: ["secret sharing", "polynomial interpolation", "threshold scheme", "cryptography"],
  prerequisites: ["Modular Arithmetic"],
  related: [],
  problem: {
    input: "A secret value S, threshold k, total shares n, and a prime p > S.",
    output: "n shares (x_i, y_i) such that any k shares reconstruct S.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Two points determine a line, three determine a parabola, and k points determine a degree-(k-1) polynomial. Shamir's scheme hides the secret as the constant term of a random polynomial: you need k points (shares) to recover the polynomial and read off the secret, but k-1 points leave the constant term completely undetermined.",
      },
      {
        kind: "p",
        text: "This is information-theoretically secure: with fewer than k shares, every possible secret is equally likely, regardless of computational power.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Choose a prime p > max(S, n). Set the secret as the constant term: a_0 = S.",
          "Pick k-1 random coefficients a_1, ..., a_{k-1} in [0, p).",
          "The polynomial is f(x) = a_0 + a_1*x + ... + a_{k-1}*x^{k-1} mod p.",
          "Generate n shares: (i, f(i) mod p) for i = 1, ..., n.",
          "To reconstruct: use Lagrange interpolation on any k shares to find f(0) = S.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example**: Secret S=42, k=3, n=5, p=97. Random coefficients a1=3, a2=5. f(x)=42+3x+5x^2 mod 97. Shares: (1,50), (2,68), (3,96), (4,37), (5,88). Using shares (1,50),(2,68),(3,96): Lagrange interpolation gives f(0)=42.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "All arithmetic must be in a finite field (mod p) to ensure information-theoretic security.",
          "Use a cryptographically large prime (e.g., 256-bit) in practice.",
          "Lagrange interpolation only needs the x=0 evaluation, simplifying the reconstruction formula.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Perfect secrecy**: Any k-1 shares are consistent with every possible secret. Given k-1 points, for each candidate secret S' there exists exactly one polynomial of degree k-1 passing through those points with f(0)=S'. Reconstruction via Lagrange: $S = \\sum_{i} y_i \\prod_{j \\neq i} \\frac{-x_j}{x_i - x_j} \\mod p$.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Verifiable secret sharing (Feldman, Pedersen) adds commitments so shareholders can verify their shares are consistent.",
          "Proactive secret sharing periodically refreshes shares without changing the secret.",
          "Multi-party computation protocols build on secret sharing for secure distributed computation.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n k)",
      average: "O(n k)",
      worst: "O(n k)",
    },
    space: "O(n)",
    worstClass: "n^2",
    note: "Share generation is O(nk); reconstruction via Lagrange interpolation is O(k^2).",
  },
  properties: [
    {
      label: "Security",
      value: "Information-theoretic (unconditional)",
    },
    {
      label: "Threshold",
      value: "k-of-n: any k shares suffice",
    },
    {
      label: "Share size",
      value: "Same as secret size",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "shamir_split",
      code: `def shamir_split(secret, k, n, p):
    """Split secret into n shares with threshold k, mod prime p."""
    import random
    coeffs = [secret] + [random.randint(0, p - 1) for _ in range(k - 1)]
    shares = []
    for i in range(1, n + 1):
        y = sum(c * pow(i, j, p) for j, c in enumerate(coeffs)) % p
        shares.append((i, y))
    return shares

def shamir_reconstruct(shares, p):
    """Reconstruct secret from k shares using Lagrange interpolation at x=0."""
    s = 0
    k = len(shares)
    for i in range(k):
        xi, yi = shares[i]
        num = den = 1
        for j in range(k):
            if i != j:
                xj = shares[j][0]
                num = num * (-xj) % p
                den = den * (xi - xj) % p
        s = (s + yi * num * pow(den, p - 2, p)) % p
    return s
`,
      tests: [
        {
          args: [
            [
              [1, 50],
              [2, 68],
              [3, 96],
            ],
            97,
          ],
          expected: 42,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "shamir-threshold",
      kind: "mcq",
      prompt: "In a (3, 5) Shamir scheme, how many shares are needed to reconstruct the secret?",
      options: ["3", "5", "2", "4"],
      answer: 0,
      explanation: "In a (k, n) scheme, any k shares suffice. Here k=3.",
      hints: ["The first number is the threshold."],
      objective: "Understand threshold",
    },
  ],
  exam: {
    definition:
      "Shamir's secret sharing hides a secret as the constant term of a random polynomial of degree k-1, producing n shares of which any k suffice for reconstruction.",
    steps: [
      "Choose random polynomial with secret as constant term.",
      "Evaluate at n distinct points.",
      "Reconstruct via Lagrange interpolation.",
    ],
    timeComplexity: "O(nk) for sharing, O(k^2) for reconstruction",
    spaceComplexity: "O(n)",
    correctness: "Information-theoretically secure: k-1 shares reveal nothing about the secret.",
    applications: ["Key management", "Multi-party computation", "Cryptocurrency wallets"],
    limitations: ["Shares must be kept confidential", "No integrity protection without extensions"],
    faq: [
      {
        q: "Why is it information-theoretic?",
        a: "With k-1 shares, every secret is equally consistent — no computation can rule any out.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Polynomial construction and evaluation (1).",
          "Lagrange reconstruction and security (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "A. Shamir, 'How to Share a Secret,' Communications of the ACM, 22(11), 1979.",
      supports: "The original secret sharing paper.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
