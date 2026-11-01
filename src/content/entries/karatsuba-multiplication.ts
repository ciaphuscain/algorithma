import type { AlgorithmEntry } from "../types";

export const karatsubaMultiplicationEntry: AlgorithmEntry = {
  slug: "karatsuba-multiplication",
  name: "Karatsuba Multiplication",
  aliases: ["Karatsuba", "Fast multiplication"],
  curriculum: [394],
  domain: "number-theory",
  subcategory: "Number Theory",
  difficulty: "intermediate",
  summary:
    "Multiplies two n-digit numbers using three half-size multiplications instead of four, achieving O(n^1.585) time — the first sub-quadratic multiplication algorithm.",
  tags: ["multiplication", "divide and conquer", "big integer"],
  prerequisites: ["Divide and Conquer"],
  related: ["fft", "binary-exponentiation"],
  problem: {
    input: "Two n-digit integers.",
    output: "Their product.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "School multiplication of two n-digit numbers needs n² single-digit multiplications. Karatsuba noticed that to multiply (a·B + b)(c·B + d) = ac·B² + (ad + bc)·B + bd, you need ac, bd, and (ad + bc). But (a+b)(c+d) = ac + ad + bc + bd, so ad + bc = (a+b)(c+d) − ac − bd.",
      },
      {
        kind: "p",
        text: "This trades one multiplication for additions and subtractions: three multiplications of half-size numbers instead of four. Recursing gives $O(n^{\\log_2 3}) \\approx O(n^{1.585})$.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Split each number into two halves: $x = a \\cdot B + b$, $y = c \\cdot B + d$, where $B = 10^{n/2}$.",
          "Compute $z_0 = b \\cdot d$, $z_2 = a \\cdot c$, $z_1 = (a + b)(c + d) - z_0 - z_2$.",
          "Result: $z_2 \\cdot B^2 + z_1 \\cdot B + z_0$.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example.** Multiply 1234 × 5678. Split: a=12, b=34, c=56, d=78. z0=34×78=2652, z2=12×56=672, z1=(12+34)(56+78)−672−2652=46×134−3324=6164−3324=2840. Result: 672×10000 + 2840×100 + 2652 = 7006652.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Base case: for small numbers (e.g., single digits), use regular multiplication.",
          "In practice, the crossover point where Karatsuba beats schoolbook is around 20-40 digits.",
          "Handle odd-length numbers by padding or splitting unevenly.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Recurrence: $T(n) = 3T(n/2) + O(n)$. By the Master theorem, $T(n) = O(n^{\\log_2 3}) \\approx O(n^{1.585})$.",
      },
      {
        kind: "p",
        text: "This was the first improvement over $O(n^2)$ multiplication, discovered by Karatsuba in 1960. Toom–Cook generalizes to more splits, and FFT-based multiplication achieves $O(n \\log n \\log \\log n)$.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Toom-Cook (Toom-3) uses 5 multiplications of n/3-size numbers: $O(n^{1.465})$.",
          "Schönhage–Strassen uses FFT: $O(n \\log n \\log \\log n)$.",
          "Harvey–van der Hoeven (2019): $O(n \\log n)$ multiplication.",
          "GMP (GNU Multiple Precision) switches between schoolbook, Karatsuba, Toom, and FFT based on input size.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n^1.585)",
      average: "O(n^1.585)",
      worst: "O(n^1.585)",
    },
    space: "O(n)",
    worstClass: "other",
    note: "n = number of digits. Exponent is log₂(3) ≈ 1.585.",
  },
  properties: [
    {
      label: "Sub-quadratic",
      value: "Yes, $O(n^{1.585})$ vs $O(n^2)$",
    },
    {
      label: "Divide and conquer",
      value: "Splits into 3 half-size problems",
    },
    {
      label: "Practical",
      value: "Used in GMP for medium-size integers",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "karatsuba",
      code: `def karatsuba(x, y):
    """Multiply two non-negative integers using Karatsuba's algorithm."""
    if x < 10 or y < 10:
        return x * y
    n = max(len(str(x)), len(str(y)))
    m = n // 2
    B = 10 ** m
    a, b = divmod(x, B)
    c, d = divmod(y, B)
    z0 = karatsuba(b, d)
    z2 = karatsuba(a, c)
    z1 = karatsuba(a + b, c + d) - z0 - z2
    return z2 * B * B + z1 * B + z0
`,
      tests: [
        {
          args: [1234, 5678],
          expected: 7006652,
        },
        {
          args: [12, 34],
          expected: 408,
        },
        {
          args: [0, 999],
          expected: 0,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "karatsuba-trick",
      kind: "mcq",
      prompt: "What is the key trick in Karatsuba multiplication?",
      options: [
        "Computing ad + bc from (a+b)(c+d) − ac − bd, saving one multiplication",
        "Using FFT to multiply",
        "Parallelizing digit multiplications",
        "Memorizing multiplication tables",
      ],
      answer: 0,
      explanation:
        "By computing (a+b)(c+d), we get ad+bc using only one new multiplication instead of two.",
      hints: ["How many multiplications does the schoolbook method need for (aB+b)(cB+d)?"],
      objective: "Understand the Karatsuba trick",
    },
  ],
  exam: {
    definition:
      "Karatsuba multiplies n-digit numbers with 3 half-size multiplications instead of 4, achieving O(n^1.585) time.",
    steps: [
      "Split x = aB + b, y = cB + d.",
      "Compute z0 = bd, z2 = ac, z1 = (a+b)(c+d) − z0 − z2.",
      "Result = z2·B² + z1·B + z0.",
    ],
    timeComplexity: "$O(n^{\\log_2 3}) \\approx O(n^{1.585})$",
    spaceComplexity: "$O(n)$",
    correctness: "Three subproblems of size n/2: Master theorem gives n^{log₂3}.",
    applications: [
      "Big integer multiplication",
      "Polynomial multiplication",
      "Cryptographic arithmetic",
    ],
    limitations: [
      "Overhead for small numbers",
      "Superseded by FFT-based methods for very large numbers",
    ],
    faq: [
      {
        q: "Why 3 multiplications, not 4?",
        a: "(a+b)(c+d) gives ac+ad+bc+bd in one multiplication; subtract ac and bd to get ad+bc.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["The 3-multiplication trick (1). Recurrence and complexity (1)."],
      },
    ],
  },
  references: [
    {
      citation:
        "A. Karatsuba and Y. Ofman, 'Multiplication of multidigit numbers on automata,' Soviet Physics Doklady, 7, 1963.",
      supports: "The original Karatsuba multiplication.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
