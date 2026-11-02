import type { AlgorithmEntry } from "../types";

export const euclidEntry: AlgorithmEntry = {
  slug: "euclid",
  name: "Extended Euclidean Algorithm",
  aliases: ["Euclidean algorithm", "Euclid's algorithm", "GCD"],
  curriculum: [351, 352],
  domain: "number-theory",
  subcategory: "Basic number theory",
  difficulty: "beginner",
  summary:
    "Finds gcd(a, b) by repeatedly replacing the larger number with its remainder, and keeps track of how each remainder is built from a and b, which gives x and y with ax + by = gcd(a, b).",
  tags: ["gcd", "number theory", "modular inverse", "Bézout"],
  prerequisites: ["Integer division and remainders"],
  related: ["crt", "sieve", "miller-rabin"],
  problem: {
    input: "Whole numbers $a, b \\ge 0$, not both zero.",
    output: "$g = \\gcd(a, b)$ and integers $x, y$ with $ax + by = g$.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Any number that divides both $a$ and $b$ also divides $a - b$, and so also the remainder $a \\bmod b$. So $\\gcd(a, b) = \\gcd(b, a \\bmod b)$. Repeating this, the numbers shrink quickly, and when the remainder reaches 0, the last nonzero number is the gcd.",
      },
      {
        kind: "p",
        text: "The extended version keeps a receipt for every remainder: how to write it as (something)·$a$ + (something)·$b$. The first two receipts are trivial: $a = 1 \\cdot a + 0 \\cdot b$ and $b = 0 \\cdot a + 1 \\cdot b$. Each new remainder is an old one minus a multiple of another, so its receipt is the same combination of their receipts.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Row 0 is $(r, s, t) = (a, 1, 0)$; row 1 is $(b, 0, 1)$. Every row satisfies $r = s \\cdot a + t \\cdot b$.",
          "While the last remainder is not 0: $q = \\lfloor r_{i-1} / r_i \\rfloor$, and the next row is row $i-1$ minus $q$ times row $i$.",
          "When the remainder 0 appears, the row before it gives $g = r$, $x = s$ and $y = t$.",
        ],
      },
      { kind: "heading", text: "Worked example: a = 240, b = 46" },
      {
        kind: "table",
        head: ["Row", "q", "r", "s", "t"],
        rows: [
          ["0", "", "240", "1", "0"],
          ["1", "", "46", "0", "1"],
          ["2", "5", "10", "1", "−5"],
          ["3", "4", "6", "−4", "21"],
          ["4", "1", "4", "5", "−26"],
          ["5", "1", "2", "−9", "47"],
          ["6", "2", "0", "23", "−120"],
        ],
      },
      {
        kind: "p",
        text: "So $\\gcd(240, 46) = 2 = -9 \\cdot 240 + 47 \\cdot 46$, after 5 divisions. Check: $-2160 + 2162 = 2$.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "**Only two rows are needed at a time.** Keep `(old_r, r)`, `(old_s, s)` and `(old_t, t)` and update them together.",
          "**Modular inverse.** If $\\gcd(a, m) = 1$, then $ax + my = 1$, so $x \\bmod m$ is the inverse of $a$ modulo $m$. For $a = 17$, $m = 3120$: the visualizer's coprime preset gives $2 \\cdot 3120 - 367 \\cdot 17 = 1$, so the inverse of 17 is $-367 \\equiv 2753 \\pmod{3120}$.",
          "**Normalise negatives.** In C-like languages `%` can return a negative result for negative operands; in Python `%` takes the sign of the divisor. Reduce `x % m` again with `(x % m + m) % m` where needed.",
          "**Overflow.** The coefficients stay bounded by $b/g$ and $a/g$ (the property tests check this), so with 64-bit inputs, intermediate products in modular arithmetic still need 128-bit or bignum care.",
        ],
      },
    ],
    mathematics: [
      { kind: "heading", text: "Correctness" },
      {
        kind: "p",
        text: "**Gcd.** If $d$ divides $r_{i-1}$ and $r_i$, it divides $r_{i+1} = r_{i-1} - q r_i$; conversely, a divisor of $r_i$ and $r_{i+1}$ divides $r_{i-1} = q r_i + r_{i+1}$. So every pair of consecutive remainders has the same common divisors as $(a, b)$. The remainders strictly decrease, so one reaches 0, and $\\gcd(r, 0) = r$.",
      },
      {
        kind: "p",
        text: "**Coefficients.** Rows 0 and 1 satisfy $r = sa + tb$, and each new row is a combination of two rows with the same coefficients for all three columns, so the identity holds for every row (Bézout's identity).",
      },
      { kind: "heading", text: "Number of steps: Lamé's theorem" },
      {
        kind: "p",
        text: "If $a > b \\ge 1$ and the algorithm makes $k$ divisions, then $a \\ge F_{k+2}$ and $b \\ge F_{k+1}$, where $F$ are the Fibonacci numbers ($F_1 = F_2 = 1$). Consecutive Fibonacci numbers are the worst case: $(89, 55) = (F_{11}, F_{10})$ takes 9 divisions, every quotient but the last being 1. Since $F_k$ grows like $\\varphi^k$, the number of steps is $O(\\log \\min(a, b))$: at most about 5 per decimal digit of the smaller number.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**Binary GCD** (Stein's algorithm) uses only shifts and subtraction; the visualizer's checker uses it as an independent oracle.",
          "**Uses:** modular inverses for RSA key generation, solving linear Diophantine equations $ax + by = c$ (solvable iff $\\gcd(a, b)$ divides $c$), the Chinese remainder theorem, and continued fractions, whose terms are the quotients $q$.",
          "**Bit complexity.** For $n$-bit inputs, the classical algorithm uses $O(n^2)$ bit operations; half-gcd methods reach $O(M(n) \\log n)$ with fast multiplication.",
          "**Generalisations:** the same algorithm works in any Euclidean domain, e.g. polynomials over a field.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(1)", average: "O(\\log \\min(a, b))", worst: "O(\\log \\min(a, b))" },
    space: "O(1)",
    worstClass: "log n",
    note: "Counting arithmetic operations on machine-sized numbers. Worst case: consecutive Fibonacci numbers.",
  },
  properties: [
    { label: "Output", value: "$\\gcd(a, b)$ and Bézout coefficients $x, y$" },
    {
      label: "Coefficient size",
      value: "$|x| \\le b/g$, $|y| \\le a/g$ (for $a, b \\ge 1$; checked by property tests)",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "extended_gcd",
      code: `def extended_gcd(a, b):
    """Return (g, x, y) with g = gcd(a, b) and a*x + b*y = g."""
    old_r, r = a, b
    old_s, s = 1, 0
    old_t, t = 0, 1
    while r != 0:
        q = old_r // r
        old_r, r = r, old_r - q * r
        old_s, s = s, old_s - q * s
        old_t, t = t, old_t - q * t
    return [old_r, old_s, old_t]
`,
      tests: [
        { args: [240, 46], expected: [2, -9, 47] },
        { args: [3120, 17], expected: [1, 2, -367] },
        { args: [7, 0], expected: [7, 1, 0] },
      ],
    },
    {
      language: "javascript",
      entry: "extendedGcd",
      code: `function extendedGcd(a, b) {
  let [oldR, r] = [a, b];
  let [oldS, s] = [1, 0];
  let [oldT, t] = [0, 1];
  while (r !== 0) {
    const q = Math.floor(oldR / r);
    [oldR, r] = [r, oldR - q * r];
    [oldS, s] = [s, oldS - q * s];
    [oldT, t] = [t, oldT - q * t];
  }
  return [oldR, oldS, oldT];
}
`,
      tests: [
        { args: [89, 55], expected: [1, -21, 34] },
        { args: [46, 240], expected: [2, 47, -9] },
        { args: [0, 5], expected: [5, 0, 1] },
      ],
    },
  ],
  visualizer: "euclid",
  practice: [
    {
      id: "euclid-gcd",
      kind: "numeric",
      prompt: "What is $\\gcd(252, 105)$?",
      answer: 21,
      explanation:
        "$252 = 2 \\cdot 105 + 42$, $105 = 2 \\cdot 42 + 21$, $42 = 2 \\cdot 21 + 0$. The last nonzero remainder is 21.",
      hints: ["Replace the pair $(a, b)$ by $(b, a \\bmod b)$ until the remainder is 0."],
      objective: "Run Euclid's algorithm",
    },
    {
      id: "euclid-inverse",
      kind: "numeric",
      prompt:
        "Extended Euclid gives $2 \\cdot 3120 - 367 \\cdot 17 = 1$. What is the inverse of 17 modulo 3120, as a number from 0 to 3119?",
      answer: 2753,
      explanation:
        "Reducing modulo 3120: $-367 \\cdot 17 \\equiv 1$, so the inverse is $-367 \\equiv 3120 - 367 = 2753$.",
      hints: [
        "Which term vanishes modulo 3120?",
        "Make the coefficient non-negative by adding 3120.",
      ],
      objective: "Compute a modular inverse",
    },
    {
      id: "euclid-worst",
      kind: "mcq",
      prompt:
        "Which of these pairs $(a, b)$ makes Euclid's algorithm take the most division steps?",
      options: ["(89, 55)", "(99, 98)", "(96, 64)", "(97, 2)"],
      answer: 0,
      explanation:
        "Consecutive Fibonacci numbers are the worst case (Lamé): every quotient is 1, so the remainders shrink as slowly as possible. (89, 55) takes 9 divisions.",
      distractors: {
        1: "$99 = 1 \\cdot 98 + 1$, then $98 = 98 \\cdot 1$: only 2 divisions.",
        2: "$96 = 1 \\cdot 64 + 32$, $64 = 2 \\cdot 32$: 2 divisions.",
        3: "$97 = 48 \\cdot 2 + 1$, $2 = 2 \\cdot 1$: 2 divisions.",
      },
      hints: ["The remainders shrink most slowly when every quotient is 1."],
      objective: "Recognise the worst case",
    },
  ],
  exam: {
    definition:
      "The extended Euclidean algorithm computes $g = \\gcd(a, b)$ by repeated division with remainder, and maintains coefficients so that each remainder equals $s \\cdot a + t \\cdot b$; the final row gives $ax + by = g$.",
    steps: [
      "Set $(r_0, s_0, t_0) = (a, 1, 0)$ and $(r_1, s_1, t_1) = (b, 0, 1)$.",
      "While $r_i \\ne 0$: $q = \\lfloor r_{i-1} / r_i \\rfloor$; $(r, s, t)_{i+1} = (r, s, t)_{i-1} - q \\cdot (r, s, t)_i$.",
      "Return $g = r_{i-1}$, $x = s_{i-1}$, $y = t_{i-1}$.",
    ],
    timeComplexity: "$O(\\log \\min(a, b))$ division steps (Lamé's theorem).",
    spaceComplexity: "$O(1)$ when only the last two rows are kept.",
    correctness:
      "$\\gcd(r_{i-1}, r_i)$ is invariant because common divisors are preserved by $r_{i+1} = r_{i-1} - q r_i$; the identity $r = sa + tb$ holds for the first two rows and is preserved by the same linear combination.",
    applications: [
      "Modular inverses (RSA key generation, modular division)",
      "Solving linear Diophantine equations",
      "The Chinese remainder theorem",
      "Reducing fractions",
    ],
    limitations: [
      "Division steps are expensive for very large numbers without fast arithmetic",
      "Coefficients can be negative and need normalising modulo $m$",
    ],
    faq: [
      {
        q: "What if $a < b$?",
        a: "The first quotient is 0 and the first step simply swaps them; the visualizer's fourth preset shows this.",
      },
      {
        q: "Are $x$ and $y$ unique?",
        a: "No: $(x + kb/g,\\ y - ka/g)$ works for every integer $k$. The algorithm returns one small solution.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "$\\gcd(a, b) = \\gcd(b, a \\bmod b)$ until the remainder is 0.",
          "The extended form also returns $x, y$ with $ax + by = \\gcd(a, b)$.",
        ],
      },
      {
        marks: 5,
        outline: [
          "Definition and the key identity (1).",
          "Pseudocode with the $r, s, t$ rows (2).",
          "A full table for a small example (1).",
          "Complexity via Lamé's theorem (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Definition and Bézout's identity — 1.",
          "Pseudocode — 2.",
          "Full worked table with a check of $ax + by$ — 3.",
          "Correctness of the gcd and of the coefficients — 2.",
          "Complexity (Fibonacci worst case) and the modular-inverse application — 2.",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 3rd ed., MIT Press, 2009, §31.2.",
      supports:
        "Euclid's algorithm, the extended version, Lamé's theorem and the Fibonacci worst case.",
    },
    {
      citation:
        "D. E. Knuth, The Art of Computer Programming, Vol. 2: Seminumerical Algorithms, 3rd ed., Addison-Wesley, 1997, §4.5.2–4.5.3.",
      supports: "The extended algorithm, binary gcd and the analysis of the number of steps.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked-example numbers are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-25",
};
