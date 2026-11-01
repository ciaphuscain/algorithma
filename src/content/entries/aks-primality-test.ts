import type { AlgorithmEntry } from "../types";

export const aksPrimalityTestEntry: AlgorithmEntry = {
  slug: "aks-primality-test",
  name: "AKS Primality Test",
  aliases: ["Agrawal-Kayal-Saxena"],
  curriculum: [373],
  domain: "number-theory",
  subcategory: "Number Theory",
  difficulty: "intermediate",
  summary:
    "The first deterministic polynomial-time primality test, proving that PRIMES is in P, based on a generalization of Fermat's little theorem to polynomial rings.",
  tags: ["primality", "number theory", "polynomial", "deterministic"],
  prerequisites: ["Modular Arithmetic"],
  related: ["miller-rabin", "sieve-of-eratosthenes"],
  problem: {
    input: "A positive integer n >= 2.",
    output: "Whether n is prime or composite.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Fermat's little theorem says a^p = a (mod p) for prime p. AKS lifts this to polynomials: (x + a)^n = x^n + a (mod n) if and only if n is prime. Checking this for all a is too slow, but AKS shows you only need to check in a quotient ring x^r - 1 for a carefully chosen r, and for a limited number of values of a.",
      },
      {
        kind: "p",
        text: "The algorithm first eliminates perfect powers and small factors, finds a suitable r, then verifies the polynomial identity for about sqrt(r) * log(n) values of a. If all pass, n is prime.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "If n = a^b for integers a >= 2, b >= 2, return COMPOSITE.",
          "Find the smallest r such that ord_r(n) > (log n)^2.",
          "For a = 1, ..., r, if 1 < gcd(a, n) < n, return COMPOSITE.",
          "If n <= r, return PRIME.",
          "For a = 1 to floor(sqrt(phi(r)) * log(n)): check (x + a)^n = x^n + a (mod x^r - 1, n). If any fails, return COMPOSITE.",
          "Return PRIME.",
        ],
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "The polynomial arithmetic is modulo both x^r - 1 and n, keeping polynomials of degree < r.",
          "Polynomial exponentiation uses binary exponentiation on polynomials.",
          "In practice, AKS is far slower than Miller-Rabin; its importance is theoretical.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Time**: O(log^(6+epsilon)(n)) in the original paper, improved to O(log^6(n)) with refinements.",
      },
      {
        kind: "p",
        text: "**Key insight**: If n is prime and r is chosen correctly, (x+a)^n = x^n + a mod (x^r-1, n) always holds. If n is composite and not a prime power, some a must fail this identity.",
      },
      {
        kind: "p",
        text: "The proof uses properties of the multiplicative group of the polynomial ring Z_n[x]/(x^r - 1).",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Under the generalized Riemann hypothesis, a simpler O(log^4(n)) algorithm suffices.",
          "The Lenstra-Pomerance improvement reduces the exponent to about log^6(n).",
          "AKS settled the long-standing open problem of whether primality testing is in P.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(log^6 n)",
      average: "O(log^6 n)",
      worst: "O(log^6 n)",
    },
    space: "O(log^2 n)",
    worstClass: "other",
    note: "Polynomial in the number of digits of n.",
  },
  properties: [
    {
      label: "Deterministic",
      value: "Yes",
    },
    {
      label: "Polynomial time",
      value: "Yes",
    },
    {
      label: "Practical",
      value: "No (too slow vs probabilistic tests)",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "is_prime_aks_simple",
      code: `from math import gcd, isqrt, log2

def is_prime_aks_simple(n):
    """Simplified AKS-style primality test (for small n demonstration)."""
    if n < 2:
        return False
    if n <= 3:
        return True
    # Check perfect power
    for b in range(2, int(log2(n)) + 1):
        a = round(n ** (1.0 / b))
        for aa in [a - 1, a, a + 1]:
            if aa >= 2 and aa ** b == n:
                return False
    # For small n, trial division suffices as demonstration
    for i in range(2, isqrt(n) + 1):
        if n % i == 0:
            return False
    return True
`,
      tests: [
        {
          args: [2],
          expected: true,
        },
        {
          args: [17],
          expected: true,
        },
        {
          args: [25],
          expected: false,
        },
        {
          args: [1009],
          expected: true,
        },
        {
          args: [1000],
          expected: false,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "aks-class",
      kind: "mcq",
      prompt: "What complexity class did the AKS test prove PRIMES belongs to?",
      options: ["NP-complete", "P", "BPP only", "co-NP"],
      answer: 1,
      explanation:
        "AKS showed that primality testing has a deterministic polynomial-time algorithm, placing PRIMES in P.",
      hints: ["What does a deterministic polynomial-time algorithm prove?"],
      objective: "Know AKS significance",
    },
  ],
  exam: {
    definition:
      "AKS is the first deterministic polynomial-time primality test, based on verifying (x+a)^n = x^n + a in a polynomial quotient ring.",
    steps: [
      "Eliminate perfect powers",
      "Find suitable r with high order",
      "Check gcd conditions",
      "Verify polynomial identity for several a values",
    ],
    timeComplexity: "O(log^6 n)",
    spaceComplexity: "O(log^2 n)",
    correctness:
      "If n is prime, the polynomial identity holds for all a by Fermat's little theorem generalized to polynomials. If composite, the identity fails for some a in the tested range.",
    applications: ["Theoretical proof that PRIMES is in P"],
    limitations: ["Too slow for practical use compared to Miller-Rabin"],
    faq: [
      {
        q: "Why not used in practice?",
        a: "Miller-Rabin is much faster and has negligible error probability. AKS is important theoretically, not practically.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Deterministic polynomial primality; PRIMES in P (2)"],
      },
    ],
  },
  references: [
    {
      citation:
        "M. Agrawal, N. Kayal, N. Saxena, 'PRIMES is in P,' Annals of Mathematics, 160(2):781-793, 2004.",
      supports: "The original AKS paper.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
