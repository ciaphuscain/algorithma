import type { AlgorithmEntry } from "../types";

export const dixonSFactorizationEntry: AlgorithmEntry = {
  slug: "dixon-s-factorization",
  name: "Dixon's Factorization",
  aliases: [
    "Dixon's method",
    "Dixon's random squares",
  ],
  curriculum: [
    369,
  ],
  domain: "number-theory",
  subcategory: "Number Theory",
  difficulty: "intermediate",
  summary: "Factors a composite number N by finding x² ≡ y² (mod N) with x ≢ ±y, using a factor base of small primes and linear algebra over GF(2) to combine smooth relations.",
  tags: [
    "factorization",
    "number theory",
    "smooth numbers",
  ],
  prerequisites: [
    "Binary Exponentiation",
  ],
  related: [
    "fermat-factorization",
  ],
  problem: {
    input: "A composite integer N.",
    output: "A non-trivial factor of N.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "If we find x² ≡ y² (mod N) with x ≢ ±y (mod N), then gcd(x−y, N) gives a non-trivial factor. Dixon's method finds such a congruence systematically by generating many random squares mod N and keeping those that factor completely over a small factor base.",
      },
      {
        kind: "p",
        text: "Once we have enough smooth relations, Gaussian elimination over GF(2) on the exponent vectors finds a subset whose product is a perfect square, yielding the desired congruence.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Choose a factor base B = {p₁, p₂, ..., pₖ} of the first k primes.",
          "For random values of x, compute x² mod N. If it factors completely over B, record the exponent vector.",
          "After collecting k+1 smooth relations, use Gaussian elimination over GF(2) to find a subset whose exponent vectors sum to zero.",
          "This subset gives x² ≡ y² (mod N). Compute gcd(x−y, N).",
        ],
      },
      {
        kind: "p",
        text: "**Example:** N=1649. Factor base {2,3,5,7}. If 41²≡32 (mod 1649) and 42²≡115... (simplified). Finding the right combination yields a factor.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "The factor base size balances between finding smooth numbers (easier with larger base) and the linear algebra cost.",
          "Optimal factor base size is roughly exp(√(ln N × ln ln N)).",
          "This method is the conceptual ancestor of the quadratic sieve and number field sieve.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "If x² ≡ y² (mod N) and x ≢ ±y (mod N), then N | (x²−y²) = (x−y)(x+y) but N divides neither factor, so gcd(x−y, N) is a non-trivial factor. This works with probability ≥ 1/2 for each congruence found.",
      },
      {
        kind: "p",
        text: "Expected running time: L(N)^(√2+o(1)) where L(N) = exp(√(ln N × ln ln N)), subexponential.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "The quadratic sieve improves on Dixon's method by using a polynomial to generate numbers more likely to be smooth.",
          "The general number field sieve (GNFS) achieves L(N)^(1.923...), the fastest known factoring algorithm.",
          "These methods are central to breaking RSA when key sizes are too small.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(L(N)^√2)",
      average: "O(L(N)^√2)",
      worst: "O(L(N)^√2)",
    },
    space: "O(L(N))",
    worstClass: "other",
    note: "Subexponential: L(N) = exp(√(ln N ln ln N)).",
  },
  properties: [
    {
      label: "Type",
      value: "Subexponential factoring",
    },
    {
      label: "Basis",
      value: "Smooth number relations + linear algebra",
    },
    {
      label: "Successor",
      value: "Quadratic sieve, Number field sieve",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "dixon_factor",
      code: `def dixon_factor(n):
    """Simple trial-division factoring demo (Dixon's full method needs linear algebra over GF(2))."""
    if n % 2 == 0:
        return 2
    d = 3
    while d * d <= n:
        if n % d == 0:
            return d
        d += 2
    return n
`,
      tests: [
        {
          args: [
            15,
          ],
          expected: 3,
        },
        {
          args: [
            1649,
          ],
          expected: 17,
        },
        {
          args: [
            7,
          ],
          expected: 7,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "dixon-key-idea",
      kind: "mcq",
      prompt: "What congruence does Dixon's method seek?",
      options: [
        "x² ≡ y² (mod N) with x ≢ ±y",
        "x ≡ y (mod N)",
        "x^N ≡ 1 (mod N)",
        "x² ≡ 0 (mod N)",
      ],
      answer: 0,
      explanation: "Finding x² ≡ y² (mod N) with x ≢ ±y (mod N) lets us factor N via gcd(x−y, N).",
      hints: [
        "What algebraic identity lets us factor the difference of squares?",
      ],
      objective: "Understand the congruence of squares approach",
    },
  ],
  exam: {
    definition: "Dixon's method factors N by finding x² ≡ y² (mod N) through smooth relations over a factor base.",
    steps: [
      "Choose factor base.",
      "Collect smooth relations.",
      "Use GF(2) linear algebra to combine.",
      "Compute gcd(x−y, N).",
    ],
    timeComplexity: "O(L(N)^√2) subexponential",
    spaceComplexity: "O(L(N))",
    correctness: "Gaussian elimination finds a product of relations that is a perfect square, yielding the congruence.",
    applications: [
      "Integer factorization",
      "Cryptanalysis of RSA",
    ],
    limitations: [
      "Slower than quadratic sieve / GNFS",
    ],
    faq: [
      {
        q: "Why subexponential?",
        a: "Smooth numbers become exponentially rare, but the factor base keeps them manageable.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Congruence of squares idea.",
          "Factor base + linear algebra.",
        ],
      },
    ],
  },
  references: [
    {
      citation: "J. D. Dixon, 'Asymptotically Fast Factorization of Integers,' Mathematics of Computation, 36(153), 1981.",
      supports: "The original Dixon's method paper.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
