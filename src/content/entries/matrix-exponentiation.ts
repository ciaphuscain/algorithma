import type { AlgorithmEntry } from "../types";

export const matrixExponentiationEntry: AlgorithmEntry = {
  slug: "matrix-exponentiation",
  name: "Matrix Exponentiation",
  aliases: [
    "Fast matrix power",
    "Exponentiation by squaring",
    "Fibonacci in O(log n)",
    "Linear recurrences",
  ],
  curriculum: [360],
  domain: "number-theory",
  subcategory: "Fast exponentiation",
  difficulty: "intermediate",
  summary:
    "Raises a square matrix to the n-th power with O(log n) multiplications by repeated squaring. Since a linear recurrence advances by multiplying a state vector by a fixed matrix, its n-th term (for example the n-th Fibonacci number modulo m) takes O(k³ log n) time.",
  tags: [
    "matrix power",
    "fibonacci",
    "linear recurrence",
    "repeated squaring",
    "modular arithmetic",
  ],
  prerequisites: ["Matrix multiplication", "Binary numbers", "Modular arithmetic"],
  related: ["binary-lifting", "memoization-tabulation"],
  problem: {
    input: "A whole number n and a modulus m.",
    output: "F(n) mod m, the n-th Fibonacci number (F(0) = 0, F(1) = 1) modulo m.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "One Fibonacci step turns the pair (F(i+1), F(i)) into (F(i+2), F(i+1)), and that step is a fixed linear map: multiply by $M = \\begin{pmatrix} 1 & 1 \\\\ 1 & 0 \\end{pmatrix}$. So n steps are one multiplication by $M^n$.",
      },
      {
        kind: "p",
        text: "Powers can be built by squaring: $M^2, M^4, M^8, \\dots$ Write n in binary and multiply together the squares for its 1-bits: $M^{10} = M^8 \\cdot M^2$. That takes about $2\\log_2 n$ matrix multiplications instead of n.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Start with $R = I$ (the identity) and $M$ the step matrix.",
          "While $n > 0$: if the lowest bit of $n$ is 1, set $R = R \\cdot M$; halve $n$; if $n > 0$, square $M$.",
          "Every product is reduced modulo m, so entries stay below m.",
          "At the end $R = M^n = \\begin{pmatrix} F(n+1) & F(n) \\\\ F(n) & F(n-1) \\end{pmatrix}$, and $F(n) = R[0][1]$.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): n = 10 = 1010₂, m = 1000. Bits are read from the least significant.",
      },
      {
        kind: "table",
        head: ["Bit", "Value", "R after", "M after"],
        rows: [
          ["0", "0", "I", "M² = [[2, 1], [1, 1]]"],
          ["1", "1", "M² = [[2, 1], [1, 1]]", "M⁴ = [[5, 3], [3, 2]]"],
          ["2", "0", "M²", "M⁸ = [[34, 21], [21, 13]]"],
          ["3", "1", "M² · M⁸ = M¹⁰ = [[89, 55], [55, 34]]", "(n is now 0: no squaring)"],
        ],
      },
      {
        kind: "p",
        text: "F(10) = 55, after 3 squarings and 2 multiplications into R: 5 matrix multiplications. In general it takes $\\lfloor \\log_2 n \\rfloor$ squarings plus one multiplication per 1-bit.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Reduce after every multiplication. With signed 64-bit integers, m ≤ 2³¹ keeps a sum of two products below 2⁶³; for larger m use 128-bit products or big integers (the JavaScript sample uses BigInt).",
          "The visualizer limits m to 10⁶ so every product fits exactly in a JavaScript number (a double holds integers up to 2⁵³).",
          "For a recurrence of order k, $a(i) = c_1 a(i-1) + \\dots + c_k a(i-k)$, use the k × k companion matrix: first row $c_1 \\dots c_k$, then a shifted identity (the Python sample).",
          "Multiplication is not commutative in general, but all factors here are powers of the same matrix, so the order does not matter.",
          "The same loop computes $a^n \\bmod m$ for numbers (fast modular exponentiation), and powers of any associative operation.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Identity.** By induction, $M^n = \\begin{pmatrix} F(n+1) & F(n) \\\\ F(n) & F(n-1) \\end{pmatrix}$ for $n \\ge 1$: multiplying by $M$ adds the columns, which is the Fibonacci rule.",
      },
      {
        kind: "p",
        text: "**Cost.** The loop runs once per bit of n. With $b = \\lfloor \\log_2 n \\rfloor + 1$ bits and $p$ of them set, it makes $(b - 1) + p \\le 2\\lfloor \\log_2 n \\rfloor + 1$ multiplications, each $O(k^3)$ for k × k matrices:",
      },
      { kind: "math", tex: "T(n) = O(k^3 \\log n)" },
      {
        kind: "p",
        text: "The oracle compares every answer with the fast-doubling identities $F(2j) = F(j)(2F(j+1) - F(j))$ and $F(2j+1) = F(j)^2 + F(j+1)^2$, computed in exact big-integer arithmetic. It also checks the exact multiplication count.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Fast doubling (the oracle's method) does the same job for Fibonacci with three number multiplications per bit instead of full 2 × 2 matrix products.",
          "For order-k recurrences, polynomial methods (Kitamasa's, or Fiduccia's) reduce the cost to $O(k^2 \\log n)$ or $O(k \\log k \\log n)$.",
          "Matrix powers over other semirings count things: in (min, +) arithmetic, the n-th power of a graph's weight matrix gives shortest walks of exactly n edges.",
          "Over the integers modulo m, Fibonacci numbers repeat with the Pisano period, which is at most 6m.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(\\log n)", average: "O(\\log n)", worst: "O(\\log n)" },
    space: "O(1)",
    worstClass: "log n",
    note: "Matrix multiplications for a fixed size k; each costs $O(k^3)$.",
  },
  properties: [
    { label: "Multiplications", value: "$\\lfloor \\log_2 n \\rfloor$ squarings + one per 1-bit" },
    { label: "Works for", value: "Any associative operation (numbers, matrices, permutations)" },
  ],
  implementations: [
    {
      language: "python",
      entry: "linear_recurrence",
      code: `def linear_recurrence(coeffs, initial, n, m):
    # a(i) = coeffs[0]·a(i−1) + … + coeffs[k−1]·a(i−k);  initial = [a(0), …, a(k−1)]
    k = len(coeffs)
    if n < k:
        return initial[n] % m

    def mul(A, B):
        return [[sum(A[i][t] * B[t][j] for t in range(k)) % m for j in range(k)]
                for i in range(k)]

    M = [coeffs[:]] + [[int(j == i) for j in range(k)] for i in range(k - 1)]
    R = [[int(i == j) for j in range(k)] for i in range(k)]
    e = n - k + 1
    while e:
        if e & 1:
            R = mul(R, M)
        M = mul(M, M)
        e >>= 1
    state = initial[::-1]          # [a(k−1), …, a(0)]
    return sum(R[0][j] * state[j] for j in range(k)) % m
`,
      tests: [
        { args: [[1, 1], [0, 1], 10, 1000], expected: 55 },
        { args: [[1, 1, 1], [0, 0, 1], 10, 1000000000], expected: 81 },
        { args: [[1, 1], [0, 1], 1000000, 1000000], expected: 546875 },
      ],
    },
    {
      language: "javascript",
      entry: "fibMod",
      code: `// F(n) mod m by squaring [[1, 1], [1, 0]]; BigInt keeps products exact.
function fibMod(n, m) {
  const M = BigInt(m);
  const mul = (A, B) => [
    [(A[0][0] * B[0][0] + A[0][1] * B[1][0]) % M, (A[0][0] * B[0][1] + A[0][1] * B[1][1]) % M],
    [(A[1][0] * B[0][0] + A[1][1] * B[1][0]) % M, (A[1][0] * B[0][1] + A[1][1] * B[1][1]) % M],
  ];
  let R = [[1n, 0n], [0n, 1n]], P = [[1n, 1n], [1n, 0n]];
  for (let e = BigInt(n); e > 0n; e >>= 1n) {
    if (e & 1n) R = mul(R, P);
    P = mul(P, P);
  }
  return Number(R[0][1]);
}
`,
      tests: [
        { args: [10, 1000], expected: 55 },
        { args: [1000000000000000, 1000000007], expected: 648325137 },
        { args: [0, 7], expected: 0 },
      ],
    },
  ],
  visualizer: "matrix-exponentiation",
  practice: [
    {
      id: "matpow-count",
      kind: "numeric",
      prompt:
        "How many 2 × 2 matrix multiplications does the visualized loop make for n = 64 (squaring only while n > 0 after halving)?",
      answer: 7,
      explanation:
        "64 = 1000000₂: six squarings to reach M⁶⁴, and one multiplication into R for the single 1-bit.",
      hints: ["Count the bits of n, and how many of them are 1."],
      objective: "Count the work of repeated squaring",
    },
    {
      id: "matpow-why",
      kind: "mcq",
      prompt: "Why can F(n) be computed with a matrix power?",
      options: [
        "One Fibonacci step is multiplication of (F(i+1), F(i)) by a fixed matrix",
        "Because Fibonacci numbers are always divisible by m",
        "Because matrices are smaller than numbers",
        "Because squaring a number doubles its Fibonacci index",
      ],
      answer: 0,
      explanation:
        "A linear recurrence advances by a fixed linear map, so n steps are its n-th power, which squaring computes in O(log n) products.",
      distractors: {
        1: "Divisibility plays no role; the modulus only keeps numbers small.",
        2: "The trick is fewer steps, not smaller numbers.",
        3: "It is the matrix that is squared, not a number.",
      },
      hints: ["Write F(i+2) and F(i+1) in terms of F(i+1) and F(i)."],
      objective: "See recurrences as matrix powers",
    },
  ],
  exam: {
    definition:
      "Matrix exponentiation computes Mⁿ with O(log n) multiplications by repeated squaring; applied to the companion matrix of a linear recurrence it yields the n-th term in O(k³ log n).",
    steps: [
      "R ← I; M ← step matrix.",
      "For each bit of n from the lowest: if 1, R ← R·M; then M ← M² (mod m).",
      "Read the answer from R (e.g. F(n) = R[0][1]).",
    ],
    timeComplexity: "$O(k^3 \\log n)$ for k × k matrices.",
    spaceComplexity: "$O(k^2)$.",
    correctness:
      "Mⁿ is the product of M^(2^i) over the 1-bits i of n; the loop keeps M = M^(2^i) for the current bit i and R = the product of the bits seen so far.",
    applications: [
      "n-th term of linear recurrences (Fibonacci, tilings)",
      "Counting walks of length n in a graph",
      "Modular exponentiation (RSA, primality tests)",
      "Linear dynamical systems",
    ],
    limitations: [
      "$O(k^3)$ per multiplication for large k",
      "Needs exact or modular arithmetic: entries grow exponentially otherwise",
    ],
    faq: [
      {
        q: "Why reduce modulo m?",
        a: "Fibonacci numbers grow exponentially (F(n) has about 0.21n decimal digits); modular reduction keeps every entry below m.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Repeated squaring on the step matrix.", "$O(\\log n)$ multiplications."],
      },
      {
        marks: 5,
        outline: [
          "The Fibonacci matrix identity (1).",
          "Squaring loop (2).",
          "Worked example (1).",
          "Complexity (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Recurrence as a matrix product (2).",
          "Exponentiation by squaring with proof (2).",
          "Worked example n = 10 (2).",
          "General companion matrix (2).",
          "Complexity and applications (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "D. E. Knuth, The Art of Computer Programming, Vol. 2: Seminumerical Algorithms, 3rd ed., Addison-Wesley, 1997, §4.6.3.",
      supports: "Evaluation of powers by repeated squaring and its cost.",
    },
    {
      citation:
        "T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 3rd ed., MIT Press, 2009, §31.6.",
      supports: "Modular exponentiation by repeated squaring.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-23",
};
