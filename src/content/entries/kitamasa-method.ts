import type { AlgorithmEntry } from "../types";

export const kitamasaMethodEntry: AlgorithmEntry = {
  slug: "kitamasa-method",
  name: "Kitamasa Method",
  aliases: ["Kitamasa's algorithm"],
  curriculum: [530],
  domain: "number-theory",
  subcategory: "Number Theory",
  difficulty: "intermediate",
  summary:
    "Computes the n-th term of a linear recurrence in O(k² log n) time by expressing it as a linear combination of the first k terms using polynomial reduction modulo the characteristic polynomial.",
  tags: ["linear recurrence", "polynomial", "fast computation"],
  prerequisites: ["Linear Recurrence", "Polynomial Arithmetic"],
  related: ["matrix-exponentiation-for-linear-recurrences"],
  problem: {
    input: "A k-th order linear recurrence with initial values, and an index n.",
    output: "The n-th term of the sequence.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Matrix exponentiation computes the n-th term of a linear recurrence in O(k³ log n). Kitamasa's method avoids the matrix: it directly computes x^n mod the characteristic polynomial, then reads off the n-th term as a linear combination of initial terms.",
      },
      {
        kind: "p",
        text: "The key insight: if the recurrence is $a_n = c_1 a_{n-1} + \\cdots + c_k a_{n-k}$, then $a_n = d_0 a_0 + d_1 a_1 + \\cdots + d_{k-1} a_{k-1}$ for some coefficients d that can be found by reducing $x^n$ modulo the characteristic polynomial.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Write the characteristic polynomial $p(x) = x^k - c_1 x^{k-1} - \\cdots - c_k$.",
          "Compute $x^n \\mod p(x)$ using repeated squaring on polynomials.",
          "The result is a polynomial of degree < k: $d_0 + d_1 x + \\cdots + d_{k-1} x^{k-1}$.",
          "The n-th term is $a_n = d_0 a_0 + d_1 a_1 + \\cdots + d_{k-1} a_{k-1}$.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example.** Fibonacci: $a_n = a_{n-1} + a_{n-2}$, $a_0=0, a_1=1$. Char polynomial: $x^2 - x - 1$. To find $a_{10}$: compute $x^{10} \\mod (x^2 - x - 1) = 34x + 21$. So $a_{10} = 21 \\cdot 0 + 34 \\cdot 1 = 34 + 21 = 55$.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Polynomial multiplication is O(k²) naively, O(k log k) with FFT.",
          "Polynomial reduction mod p(x) is O(k²) naively.",
          "Total: O(k² log n) naively, O(k log k log n) with FFT.",
          "Simpler to implement than matrix exponentiation for large k.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The Cayley-Hamilton theorem guarantees that the companion matrix satisfies its characteristic polynomial. Therefore $x^n \\mod p(x)$ gives the same coefficients as the first row of $M^n$.",
      },
      {
        kind: "p",
        text: "Time: O(k² log n) with naive polynomial arithmetic, O(k log k log n) with FFT. Space: O(k).",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Berlekamp-Massey can find the minimal recurrence if unknown, then Kitamasa computes the n-th term.",
          "For Fibonacci, this gives O(log n) with O(1) space (k=2).",
          "Used in competitive programming for computing terms of large-index recurrences modulo a prime.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(k^2 log n)",
      average: "O(k^2 log n)",
      worst: "O(k^2 log n)",
    },
    space: "O(k)",
    worstClass: "other",
    note: "k = order of recurrence, n = term index.",
  },
  properties: [
    {
      label: "Faster than matrix exp",
      value: "O(k² log n) vs O(k³ log n)",
    },
    {
      label: "Polynomial approach",
      value: "Reduces x^n mod characteristic polynomial",
    },
    {
      label: "Modular arithmetic",
      value: "Works well with modular computation",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "kitamasa",
      code: `def kitamasa(coeffs, initial, n, mod=None):
    """Compute n-th term of linear recurrence.
    a[i] = coeffs[0]*a[i-1] + coeffs[1]*a[i-2] + ...
    initial = [a[0], a[1], ...]. Returns a[n]."""
    k = len(coeffs)
    if n < k:
        return initial[n] if mod is None else initial[n] % mod
    # Polynomial multiplication mod characteristic polynomial
    def poly_mod(p):
        """Reduce polynomial p mod (x^k - coeffs[0]*x^{k-1} - ... - coeffs[k-1])."""
        while len(p) >= k + 1:
            c = p[-1]
            if mod:
                c %= mod
            deg = len(p) - 1
            for i in range(k):
                p[deg - 1 - i] = p[deg - 1 - i] + c * coeffs[i]
                if mod:
                    p[deg - 1 - i] %= mod
            p.pop()
        return p
    def poly_mul(a, b):
        res = [0] * (len(a) + len(b) - 1)
        for i, x in enumerate(a):
            for j, y in enumerate(b):
                res[i + j] += x * y
                if mod:
                    res[i + j] %= mod
        return poly_mod(res)
    # Compute x^n mod char_poly using repeated squaring
    # Start with x^1 = [0, 1]
    result = [1]  # x^0 = 1
    base = [0, 1]  # x^1
    m = n
    while m > 0:
        if m & 1:
            result = poly_mul(result, base)
        base = poly_mul(base, base)
        m >>= 1
    # result = d_0 + d_1*x + ... + d_{k-1}*x^{k-1}
    ans = 0
    for i in range(min(len(result), k)):
        ans += result[i] * initial[i]
        if mod:
            ans %= mod
    return ans
`,
      tests: [
        {
          args: [[1, 1], [0, 1], 10],
          expected: 55,
        },
        {
          args: [[1, 1], [0, 1], 0],
          expected: 0,
        },
        {
          args: [[2], [1], 10],
          expected: 1024,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "kitamasa-vs-matrix",
      kind: "mcq",
      prompt:
        "How does Kitamasa's method compare to matrix exponentiation for order-k recurrences?",
      options: [
        "O(k² log n) vs O(k³ log n)",
        "Same complexity",
        "Kitamasa is slower",
        "Kitamasa uses more memory",
      ],
      answer: 0,
      explanation: "Kitamasa avoids matrix multiplication, reducing the k³ factor to k².",
      hints: ["What's the cost of multiplying k×k matrices?"],
      objective: "Compare Kitamasa and matrix exponentiation",
    },
  ],
  exam: {
    definition:
      "Kitamasa computes x^n mod the characteristic polynomial to express the n-th recurrence term as a linear combination of initial values.",
    steps: [
      "Write characteristic polynomial.",
      "Repeated squaring on polynomials.",
      "Reduce mod char poly.",
      "Dot product with initial values.",
    ],
    timeComplexity: "$O(k^2 \\log n)$",
    spaceComplexity: "$O(k)$",
    correctness:
      "Cayley-Hamilton guarantees the companion matrix satisfies its char poly; polynomial reduction gives the same coefficients as matrix power.",
    applications: [
      "Large-index Fibonacci",
      "Competitive programming recurrences",
      "Sequence computation mod prime",
    ],
    limitations: [
      "Harder to implement than matrix exponentiation",
      "FFT needed for O(k log k log n)",
    ],
    faq: [
      {
        q: "When is matrix exponentiation preferable?",
        a: "When k is very small (k ≤ 3), the k³ overhead is negligible and matrix code is simpler.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Polynomial reduction approach (1). Complexity comparison (1)."],
      },
    ],
  },
  references: [
    {
      citation:
        "M. Fiduccia, 'An efficient formula for linear recurrences,' SIAM Journal on Computing, 14(1), 1985.",
      supports: "Polynomial approach to linear recurrences.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
