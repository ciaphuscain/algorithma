import type { AlgorithmEntry } from "../types";

export const solovayStrassenTestEntry: AlgorithmEntry = {
  slug: "solovay-strassen-test",
  name: "Solovay–Strassen Test",
  aliases: ["Solovay-Strassen", "Euler witness test"],
  curriculum: [372],
  domain: "number-theory",
  subcategory: "Number Theory",
  difficulty: "intermediate",
  summary:
    "The Solovay–Strassen test is a probabilistic primality test that checks whether a^((n-1)/2) ≡ Jacobi(a,n) (mod n) for random witnesses a, catching composites with probability ≥ 1/2 per round.",
  tags: ["primality testing", "probabilistic", "Jacobi symbol", "Euler criterion"],
  prerequisites: ["Modular Arithmetic", "Binary Exponentiation"],
  related: [],
  problem: {
    input: "An odd integer n > 2 and a number of rounds k.",
    output:
      "Whether n is probably prime (with error probability ≤ (1/2)^k) or definitely composite.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Euler's criterion says that for prime p and gcd(a,p)=1: a^((p-1)/2) ≡ Jacobi(a,p) (mod p). If n is composite, this fails for at least half of all a in [1, n-1]. So by testing random a values, we catch composites with high probability.",
      },
      {
        kind: "p",
        text: "The Solovay–Strassen test was the first polynomial-time probabilistic primality test (1977), predating Miller–Rabin. It's slightly weaker (1/2 error per round vs 1/4 for Miller–Rabin) but historically important.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Given odd n > 2, pick random a in [2, n-2].",
          "Compute the Jacobi symbol J = (a/n) using the law of quadratic reciprocity.",
          "Compute x = a^((n-1)/2) mod n.",
          "If J ≡ 0 (mod n) or x ≠ J mod n, declare n composite.",
          "Repeat k times. If no witness found, declare probably prime.",
        ],
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "The Jacobi symbol is computed in O(log^2 n) using quadratic reciprocity and reduction rules.",
          "Modular exponentiation uses binary exponentiation in O(log n) multiplications.",
          "In practice, Miller–Rabin is preferred (fewer rounds for same confidence).",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "If n is composite, at most half of a in [1, n-1] satisfy the Euler criterion. So each round catches a composite with probability ≥ 1/2. After k rounds, the error probability is ≤ (1/2)^k. For 30 rounds, error < 10^{-9}.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Euler pseudoprimes (composites passing the test for a specific a) are a strict subset of Fermat pseudoprimes.",
          "No Carmichael-number analogue: every composite fails for ≥ half of witnesses.",
          "The AKS algorithm (2002) provides deterministic polynomial-time primality testing, but is slower in practice.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(k log^2 n)",
      average: "O(k log^2 n)",
      worst: "O(k log^2 n)",
    },
    space: "O(log n)",
    worstClass: "other",
    note: "k rounds, each computing Jacobi symbol and modular exponentiation.",
  },
  properties: [
    {
      label: "Type",
      value: "Probabilistic (Monte Carlo)",
    },
    {
      label: "Error per round",
      value: "≤ 1/2",
    },
    {
      label: "False positives",
      value: "Possible (calls composite 'prime')",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "solovay_strassen",
      code: `def solovay_strassen(n, k=20):
    """Test if n is probably prime using k rounds. Returns True if probably prime."""
    if n < 3: return n == 2
    if n % 2 == 0: return False
    def jacobi(a, n):
        a = a % n
        result = 1
        while a != 0:
            while a % 2 == 0:
                a //= 2
                if n % 8 in (3, 5): result = -result
            a, n = n, a
            if a % 4 == 3 and n % 4 == 3: result = -result
            a = a % n
        return result if n == 1 else 0
    import random
    random.seed(42)
    for _ in range(k):
        a = random.randint(2, n - 2)
        j = jacobi(a, n) % n
        x = pow(a, (n - 1) // 2, n)
        if j == 0 or x != j:
            return False
    return True
`,
      tests: [
        {
          args: [97],
          expected: true,
        },
        {
          args: [561],
          expected: false,
        },
        {
          args: [2],
          expected: true,
        },
        {
          args: [15],
          expected: false,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "ss-vs-mr",
      kind: "mcq",
      prompt: "What is the error probability per round for Solovay–Strassen?",
      options: ["1/2", "1/4", "1/3", "1/8"],
      answer: 0,
      explanation:
        "Each round catches a composite with probability ≥ 1/2, so the error is at most 1/2. Miller–Rabin achieves 1/4.",
      hints: ["Compare with Miller-Rabin's guarantee."],
      objective: "Know error bounds",
    },
  ],
  exam: {
    definition:
      "The Solovay–Strassen test checks a^((n-1)/2) ≡ Jacobi(a,n) mod n for random a, catching composites with probability ≥ 1/2 per round.",
    steps: [
      "Pick random a.",
      "Compute Jacobi symbol and modular exponentiation.",
      "Compare; if different, composite.",
      "Repeat k times.",
    ],
    timeComplexity: "O(k log^2 n)",
    spaceComplexity: "O(log n)",
    correctness:
      "At most half of a satisfy the criterion for composites; k rounds give error ≤ (1/2)^k.",
    applications: ["Historical primality testing", "Basis for Miller-Rabin"],
    limitations: ["Weaker than Miller-Rabin (1/2 vs 1/4 error)", "Superseded in practice"],
    faq: [
      {
        q: "Why was it important historically?",
        a: "First polynomial-time probabilistic primality test (1977), before Miller-Rabin (1980).",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Euler criterion test (1).", "Error analysis (1)."],
      },
    ],
  },
  references: [
    {
      citation:
        "R. Solovay, V. Strassen, 'A Fast Monte-Carlo Test for Primality,' SIAM Journal on Computing, 6(1), 1977.",
      supports: "The original paper.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
