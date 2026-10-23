import type { AlgorithmEntry } from "../types";

export const crtEntry: AlgorithmEntry = {
  slug: "crt",
  name: "Chinese Remainder Theorem",
  aliases: ["CRT", "Simultaneous congruences", "Sunzi's theorem"],
  curriculum: [376],
  domain: "number-theory",
  subcategory: "Modular arithmetic",
  difficulty: "intermediate",
  summary:
    "Solves x ≡ a₁ (mod m₁), …, x ≡ a_k (mod m_k) by merging the congruences one at a time with extended Euclid. A solution exists exactly when the congruences agree wherever their moduli overlap, and it is unique modulo the lcm of the moduli.",
  tags: ["congruences", "extended euclid", "modular inverse", "lcm", "number theory"],
  prerequisites: ["Modular arithmetic", "Extended Euclidean algorithm"],
  related: ["miller-rabin", "ntt", "matrix-exponentiation"],
  problem: {
    input: "Congruences x ≡ aᵢ (mod mᵢ); the moduli need not be coprime.",
    output:
      "The least x ≥ 0 satisfying all of them and the modulus M (the lcm) of the solution set, or “no solution”.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "The oldest known form is a puzzle in the Sunzi Suanjing: a number leaves remainder 2 when divided by 3, remainder 3 when divided by 5, and remainder 2 when divided by 7; what is it? The answer, 23, is unique up to adding multiples of 3 · 5 · 7 = 105.",
      },
      {
        kind: "p",
        text: "Solve it one condition at a time. All x ≡ 2 (mod 3) are 2, 5, 8, 11, …; walk along that list in steps of 3 until you also have x ≡ 3 (mod 5): that is 8, and now x ≡ 8 (mod 15). Walk in steps of 15 until x ≡ 2 (mod 7): 8, 23. Extended Euclid computes how many steps to take instead of walking.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Start with X = 0, M = 1 (every integer is a solution of no congruences).",
          "To add x ≡ a (mod m): let $g = \\gcd(M, m)$, and p with $M p \\equiv g \\pmod m$ (extended Euclid).",
          "If g does not divide $a - X$, there is no solution.",
          "Otherwise take $t = \\frac{a - X}{g} \\cdot p \\bmod \\frac{m}{g}$, then $X \\leftarrow X + M t$ and $M \\leftarrow \\operatorname{lcm}(M, m) = M m / g$.",
        ],
      },
      { kind: "p", text: "**Worked example** (the first preset: 2 mod 3, 3 mod 5, 2 mod 7)." },
      {
        kind: "table",
        head: ["Congruence", "g = gcd(M, m)", "p", "t", "X after", "M after"],
        rows: [
          ["x ≡ 2 (mod 3)", "gcd(1, 3) = 1", "1", "2", "2", "3"],
          [
            "x ≡ 3 (mod 5)",
            "gcd(3, 5) = 1",
            "2 (3·2 ≡ 1)",
            "(3 − 2)·2 mod 5 = 2",
            "2 + 3·2 = 8",
            "15",
          ],
          [
            "x ≡ 2 (mod 7)",
            "gcd(15, 7) = 1",
            "1 (15 ≡ 1)",
            "(2 − 8)·1 mod 7 = 1",
            "8 + 15 = 23",
            "105",
          ],
        ],
      },
      {
        kind: "p",
        text: "With shared factors (second preset: 5 mod 6, 3 mod 10, 8 mod 15) the answer is 23 modulo lcm = 30, not 900. For 1 mod 4 and 2 mod 6 (third preset), gcd(4, 6) = 2 does not divide 2 − 1: an odd and an even remainder modulo even numbers contradict each other.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Keep X reduced modulo M after every merge, or it grows without bound.",
          "M·t can exceed 64 bits even when the answer fits; use 128-bit products or big integers when M approaches $2^{63}$ (the visualizer uses big integers internally and limits the lcm to $10^{15}$).",
          "With pairwise coprime moduli the classic formula $x = \\sum a_i M_i (M_i^{-1} \\bmod m_i)$, $M_i = M / m_i$, also works; incremental merging handles every case.",
          "The modular inverse in the JavaScript sample is extended Euclid; it exists exactly when gcd(a, m) = 1.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Theorem.** For pairwise coprime moduli the map $x \\mapsto (x \\bmod m_1, \\dots, x \\bmod m_k)$ is a bijection from $\\mathbb{Z}_M$ to $\\mathbb{Z}_{m_1} \\times \\dots \\times \\mathbb{Z}_{m_k}$, with $M = \\prod m_i$: a ring isomorphism.",
      },
      {
        kind: "p",
        text: "**General moduli.** x ≡ X (mod M) and x ≡ a (mod m) are solvable together exactly when $\\gcd(M, m)$ divides $a - X$; the solution is unique modulo lcm(M, m). For a whole system this means: solvable exactly when $a_i \\equiv a_j \\pmod{\\gcd(m_i, m_j)}$ for every pair. The oracle checks the algorithm's verdict against this pairwise criterion.",
      },
      {
        kind: "math",
        tex: "T = O\\Big(\\sum_i \\log m_i\\Big) \\text{ arithmetic operations (extended Euclid per merge)}",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "RSA decryption is often done modulo p and q separately and recombined with CRT, about four times faster.",
          "Multi-modular arithmetic: compute an integer result modulo several word-sized primes (for example with NTTs) and reconstruct it with CRT.",
          "Garner's algorithm reconstructs in mixed-radix form, avoiding big intermediate products.",
          "CRT also describes the structure of $\\mathbb{Z}_n$: it is the product of the rings $\\mathbb{Z}_{p^e}$ for the prime powers in n.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(k \\log m)", average: "O(k \\log m)", worst: "O(k \\log m)" },
    space: "O(1)",
    worstClass: "log n",
    note: "k congruences with moduli up to m, counting arithmetic operations on numbers up to the lcm.",
  },
  properties: [
    { label: "Solvable iff", value: "$a_i \\equiv a_j \\pmod{\\gcd(m_i, m_j)}$ for all pairs" },
    { label: "Unique modulo", value: "lcm of the moduli" },
  ],
  implementations: [
    {
      language: "python",
      entry: "crt",
      code: `from math import gcd


def crt(congruences):
    # congruences: [a, m] pairs; returns [x, M] or None
    x, M = 0, 1
    for a, m in congruences:
        g = gcd(M, m)
        if (a - x) % g:
            return None
        p = pow(M // g, -1, m // g)      # inverse of M/g modulo m/g
        t = (a - x) // g * p % (m // g)
        x += M * t
        M = M // g * m
        x %= M
    return [x, M]
`,
      tests: [
        {
          args: [
            [
              [2, 3],
              [3, 5],
              [2, 7],
            ],
          ],
          expected: [23, 105],
        },
        {
          args: [
            [
              [5, 6],
              [3, 10],
              [8, 15],
            ],
          ],
          expected: [23, 30],
        },
        {
          args: [
            [
              [1, 4],
              [2, 6],
            ],
          ],
          expected: null,
        },
      ],
    },
    {
      language: "javascript",
      entry: "modInverse",
      code: `// Inverse of a modulo m by extended Euclid; null when gcd(a, m) ≠ 1.
function modInverse(a, m) {
  let [r0, r1, s0, s1] = [a % m, m, 1, 0];
  while (r1 !== 0) {
    const q = Math.floor(r0 / r1);
    [r0, r1] = [r1, r0 - q * r1];
    [s0, s1] = [s1, s0 - q * s1];
  }
  return r0 === 1 ? ((s0 % m) + m) % m : null;
}
`,
      tests: [
        { args: [3, 7], expected: 5 },
        { args: [10, 17], expected: 12 },
        { args: [6, 9], expected: null },
      ],
    },
  ],
  visualizer: "crt",
  practice: [
    {
      id: "crt-sunzi",
      kind: "numeric",
      prompt:
        "What is the least non-negative x with x ≡ 2 (mod 3), x ≡ 3 (mod 5) and x ≡ 2 (mod 7)?",
      answer: 23,
      explanation: "Merging gives x ≡ 8 (mod 15), then x ≡ 23 (mod 105).",
      hints: ["Solve the first two, then add the third."],
      objective: "Merge congruences",
    },
    {
      id: "crt-solvable",
      kind: "mcq",
      prompt: "When do x ≡ a (mod m) and x ≡ b (mod n) have a common solution?",
      options: [
        "Exactly when gcd(m, n) divides a − b",
        "Only when m and n are coprime",
        "Always",
        "Exactly when m divides n",
      ],
      answer: 0,
      explanation:
        "Both congruences fix x modulo gcd(m, n), so a and b must agree there; when they do, extended Euclid builds a solution modulo lcm(m, n).",
      distractors: {
        1: "Coprime moduli always work, but 5 mod 6 and 3 mod 10 also have solutions.",
        2: "1 mod 4 and 2 mod 6 have none.",
        3: "Divisibility of the moduli is neither needed nor sufficient.",
      },
      hints: ["What does each congruence say about x modulo gcd(m, n)?"],
      objective: "Know when a solution exists",
    },
  ],
  exam: {
    definition:
      "The Chinese Remainder Theorem states that congruences with pairwise coprime moduli have a solution unique modulo the product of the moduli; in general a system is solvable iff it is pairwise consistent modulo the gcds, and the solution is unique modulo the lcm.",
    steps: [
      "X = 0, M = 1.",
      "For each x ≡ a (mod m): g = gcd(M, m); fail if g ∤ (a − X).",
      "t = ((a − X)/g)·(M/g)⁻¹ mod (m/g); X ← X + M·t; M ← lcm(M, m).",
      "Answer X mod M.",
    ],
    timeComplexity: "$O(k \\log m)$ arithmetic operations.",
    spaceComplexity: "$O(1)$.",
    correctness:
      "After each merge, X satisfies every congruence so far and M is their lcm; the step t makes the new congruence hold without disturbing the old ones (M·t ≡ 0 modulo each earlier modulus).",
    applications: [
      "Fast RSA decryption",
      "Multi-modular big-integer arithmetic",
      "Calendar and scheduling problems",
      "Secret sharing",
    ],
    limitations: ["Intermediate values grow with the lcm", "Needs exact arithmetic"],
    faq: [
      {
        q: "Is the solution unique?",
        a: "Unique modulo the lcm of the moduli; all solutions are x + k·M.",
      },
    ],
    answers: [
      { marks: 2, outline: ["Statement for coprime moduli.", "Uniqueness modulo the product."] },
      {
        marks: 5,
        outline: ["Statement (1).", "Construction with inverses (2).", "Example (2)."],
      },
      {
        marks: 10,
        outline: [
          "Statement and proof of existence and uniqueness (3).",
          "Incremental algorithm with extended Euclid (3).",
          "Non-coprime moduli and the solvability condition (2).",
          "Worked example and an application (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 3rd ed., MIT Press, 2009, §31.5.",
      supports: "The theorem, its proof and the construction with modular inverses.",
    },
    {
      citation:
        "D. E. Knuth, The Art of Computer Programming, Vol. 2: Seminumerical Algorithms, 3rd ed., Addison-Wesley, 1997, §4.3.2.",
      supports: "Modular arithmetic, the Chinese remainder theorem and Garner's method.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-23",
};
