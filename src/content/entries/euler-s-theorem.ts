import type { AlgorithmEntry } from "../types";

export const eulerSTheoremEntry: AlgorithmEntry = {
  slug: "euler-s-theorem",
  name: "Euler's Theorem",
  aliases: [
    "Euler's generalization of Fermat's little theorem",
  ],
  curriculum: [
    375,
  ],
  domain: "number-theory",
  subcategory: "Number Theory",
  difficulty: "intermediate",
  summary: "States that a^φ(n) ≡ 1 (mod n) for any a coprime to n, where φ(n) is Euler's totient function, generalizing Fermat's little theorem to composite moduli.",
  tags: [
    "number theory",
    "modular arithmetic",
    "totient",
    "Fermat",
  ],
  prerequisites: [
    "Euler's Totient Function",
  ],
  related: [
    "euler-s-totient-function",
    "binary-exponentiation",
  ],
  problem: {
    input: "Integers a and n with gcd(a, n) = 1.",
    output: "Verification that a^φ(n) ≡ 1 (mod n) and applications like computing modular inverses.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Fermat's little theorem says a^(p−1) ≡ 1 (mod p) for prime p. Euler generalized this: for any n, a^φ(n) ≡ 1 (mod n) when gcd(a,n) = 1. Here φ(n) counts integers less than n that are coprime to n.",
      },
      {
        kind: "p",
        text: "This is powerful for modular arithmetic: to compute a⁻¹ mod n, use a^(φ(n)−1) mod n. It's the mathematical foundation of RSA encryption.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Compute φ(n) using the totient function.",
          "Then a^φ(n) mod n = 1 for any a coprime to n.",
          "To find a⁻¹ mod n: compute a^(φ(n)−1) mod n using fast exponentiation.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example:** n=10, φ(10)=4. Take a=3 (coprime to 10). 3⁴ = 81. 81 mod 10 = 1. ✓",
      },
      {
        kind: "p",
        text: "For modular inverse: 3⁻¹ mod 10 = 3³ mod 10 = 27 mod 10 = 7. Check: 3×7 = 21 ≡ 1 (mod 10). ✓",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Use fast modular exponentiation to compute a^(φ(n)) mod n efficiently.",
          "For modular inverse, a^(φ(n)−1) mod n; but extended GCD is often faster.",
          "For prime n: φ(n) = n−1, recovering Fermat's little theorem.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Proof sketch:** The φ(n) integers coprime to n form a group under multiplication mod n (denoted (Z/nZ)*). By Lagrange's theorem, every element raised to the group order equals the identity. The group order is φ(n).",
      },
      {
        kind: "p",
        text: "**Complexity:** Computing φ(n) takes O(√n) via trial division. The exponentiation takes O(log φ(n) × log² n).",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "RSA works because e·d ≡ 1 (mod φ(n)), so (m^e)^d = m^(ed) = m^(1+kφ(n)) ≡ m (mod n).",
          "Carmichael's theorem uses the Carmichael function λ(n) ≤ φ(n), giving a potentially smaller exponent.",
          "The discrete logarithm problem in (Z/nZ)* is the basis for several cryptographic protocols.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(√n + log n)",
      average: "O(√n + log n)",
      worst: "O(√n + log n)",
    },
    space: "O(1)",
    worstClass: "other",
    note: "√n for computing φ(n), log n for the exponentiation.",
  },
  properties: [
    {
      label: "Condition",
      value: "gcd(a, n) = 1",
    },
    {
      label: "Result",
      value: "a^φ(n) ≡ 1 (mod n)",
    },
    {
      label: "Special case",
      value: "Fermat's little theorem when n is prime",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "euler_theorem_check",
      code: `def euler_theorem_check(a, n):
    """Verify Euler's theorem: a^phi(n) mod n == 1 when gcd(a,n)==1.
    Returns [phi_n, result] where result = a^phi(n) mod n."""
    from math import gcd
    if gcd(a, n) != 1:
        return [-1, -1]
    # Compute Euler's totient
    phi = n
    temp = n
    d = 2
    while d * d <= temp:
        if temp % d == 0:
            while temp % d == 0:
                temp //= d
            phi -= phi // d
        d += 1
    if temp > 1:
        phi -= phi // temp
    return [phi, pow(a, phi, n)]
`,
      tests: [
        {
          args: [
            3,
            10,
          ],
          expected: [
            4,
            1,
          ],
        },
        {
          args: [
            2,
            7,
          ],
          expected: [
            6,
            1,
          ],
        },
        {
          args: [
            5,
            12,
          ],
          expected: [
            4,
            1,
          ],
        },
      ],
    },
  ],
  practice: [
    {
      id: "euler-thm-rsa",
      kind: "mcq",
      prompt: "How does RSA use Euler's theorem?",
      options: [
        "Decryption works because (m^e)^d = m^(1+kφ(n)) ≡ m (mod n)",
        "It generates random primes",
        "It compresses messages",
        "It hashes the key",
      ],
      answer: 0,
      explanation: "RSA picks e and d such that ed ≡ 1 (mod φ(n)), so raising m^e to d recovers m by Euler's theorem.",
      hints: [
        "What is the relationship between e, d, and φ(n)?",
      ],
      objective: "Understand RSA's use of Euler's theorem",
    },
  ],
  exam: {
    definition: "Euler's theorem: a^φ(n) ≡ 1 (mod n) when gcd(a,n) = 1, generalizing Fermat's little theorem.",
    steps: [
      "Compute φ(n).",
      "a^φ(n) ≡ 1 (mod n) for coprime a.",
      "Modular inverse: a^(φ(n)−1) mod n.",
    ],
    timeComplexity: "O(√n + log n)",
    spaceComplexity: "O(1)",
    correctness: "Follows from Lagrange's theorem applied to the multiplicative group (Z/nZ)*.",
    applications: [
      "RSA encryption",
      "Modular inverse computation",
      "Discrete log cryptography",
    ],
    limitations: [
      "Requires gcd(a,n) = 1",
    ],
    faq: [
      {
        q: "When does Fermat's little theorem suffice?",
        a: "When n is prime, φ(n) = n−1 and the theorem applies to all 1 ≤ a < n.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "State theorem and condition.",
          "Connection to RSA.",
        ],
      },
    ],
  },
  references: [
    {
      citation: "K. H. Rosen, Elementary Number Theory, 6th ed., Pearson, 2010.",
      supports: "Euler's theorem and its applications.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
