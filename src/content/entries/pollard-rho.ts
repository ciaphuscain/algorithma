import type { AlgorithmEntry } from "../types";

export const pollardRhoEntry: AlgorithmEntry = {
  slug: "pollard-rho",
  name: "Pollard's Rho Factorization",
  aliases: ["Pollard rho", "Rho method", "Monte Carlo factorization"],
  curriculum: [367],
  domain: "number-theory",
  subcategory: "Factorization",
  difficulty: "advanced",
  summary:
    "Finds a factor of a composite n in about √p steps, where p is its smallest prime factor. It iterates x ← x² + c (mod n), which modulo p soon repeats; Floyd's tortoise and hare detect the repeat through gcd(|x − y|, n) without knowing p.",
  tags: ["factorization", "cycle detection", "gcd", "randomized", "birthday paradox"],
  prerequisites: ["Euclid's algorithm", "Floyd's cycle detection", "Miller–Rabin Primality Test"],
  related: ["miller-rabin", "crt"],
  problem: {
    input: "A composite number n and a start value x₀.",
    output: "A factor d of n with 1 < d < n.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Pick numbers that look random modulo n. Viewed modulo a hidden prime factor p, there are only p possible values, so by the birthday paradox two of them collide after about √p picks. A collision modulo p shows up without knowing p: p divides x − y, so $\\gcd(|x - y|, n)$ is a multiple of p, usually p itself or another proper factor.",
      },
      {
        kind: "p",
        text: "Instead of storing all the numbers, generate them by $x \\leftarrow x^2 + c$. The sequence modulo p is eventually periodic; drawn out, it is a tail leading into a cycle, like the Greek letter ρ. Floyd's tortoise (one step) and hare (two steps) must meet inside the cycle.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Set $x = y = x_0$ and $f(v) = v^2 + c \\bmod n$, starting with c = 1.",
          "Repeat: $x \\leftarrow f(x)$, $y \\leftarrow f(f(y))$, $d \\leftarrow \\gcd(|x - y|, n)$, until $d \\ne 1$.",
          "If $d \\ne n$, it is a factor. If $d = n$, x and y met modulo n itself; try again with the next c.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): n = 8051 = 83 · 97, x₀ = 2, c = 1.",
      },
      {
        kind: "table",
        head: ["Round", "x (tortoise)", "y (hare)", "|x − y|", "gcd(|x − y|, 8051)"],
        rows: [
          ["1", "5", "26", "21", "1"],
          ["2", "26", "7474", "7448", "1"],
          ["3", "677", "871", "194", "97"],
        ],
      },
      {
        kind: "p",
        text: "194 = 2 · 97, so 8051 = 97 · 83 after three rounds. With n = 25 (the second preset) the first attempt meets modulo 25 itself, a useless gcd of 25, and the second attempt with c = 2 finds 5.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Check small primes and primality (Miller–Rabin) first: rho never terminates usefully on a prime.",
          "To factor completely, split n into d and n/d and recurse on each (the Python sample).",
          "Avoid c = 0 and c = −2: then $x^2 + c$ has algebraic structure that defeats the method.",
          "**Brent's variant** compares against saved powers-of-two positions and multiplies many |x − y| together before taking one gcd, which is typically much faster.",
          "For n near $2^{64}$, the products need 128-bit arithmetic.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Detection.** If the sequence modulo p has a tail of length μ and a cycle of length λ, the tortoise at step i and the hare at step 2i agree modulo p as soon as $i \\ge \\mu$ and λ divides i, which happens for some $i \\le \\mu + \\lambda \\le p$. The property tests check that each attempt takes at most p rounds, where p is the smallest prime factor.",
      },
      {
        kind: "p",
        text: "**Heuristic cost.** If $f$ behaved like a random map, the expected tail plus cycle length modulo p would be about $\\sqrt{\\pi p / 2}$. Since $p \\le \\sqrt{n}$ for the smallest factor:",
      },
      { kind: "math", tex: "\\text{expected gcd steps} \\approx O(\\sqrt{p}) = O(n^{1/4})" },
      {
        kind: "p",
        text: "This is a heuristic: no proof is known that $x^2 + c$ behaves randomly enough, but it matches practice well.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Pollard's p − 1 method and Lenstra's elliptic-curve method (ECM) also find small factors, ECM in time depending on the size of p.",
          "For numbers with only large factors, the quadratic sieve and the general number field sieve are the methods of choice; RSA relies on these being slow.",
          "Rho-style collision searches also solve discrete logarithms (Pollard's rho for logarithms), the best generic attack on elliptic-curve groups.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(1)", average: "O(n^{1/4})", worst: "\\text{no proven bound}" },
    space: "O(1)",
    worstClass: "other",
    note: "Expected gcd steps under the heuristic that $x^2 + c$ behaves like a random map.",
  },
  properties: [
    { label: "Finds", value: "One factor (recurse to factor completely)" },
    { label: "Memory", value: "Two numbers: tortoise and hare" },
  ],
  implementations: [
    {
      language: "python",
      entry: "factorize",
      code: `from math import gcd


def is_prime(n):
    if n < 2:
        return False
    for p in (2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37):
        if n % p == 0:
            return n == p
    d, s = n - 1, 0
    while d % 2 == 0:
        d, s = d // 2, s + 1
    for a in (2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37):
        x = pow(a, d, n)
        if x in (1, n - 1):
            continue
        for _ in range(s - 1):
            x = x * x % n
            if x == n - 1:
                break
        else:
            return False
    return True


def rho(n):
    if n % 2 == 0:
        return 2
    c = 1
    while True:
        x = y = 2
        d = 1
        while d == 1:
            x = (x * x + c) % n
            y = (y * y + c) % n
            y = (y * y + c) % n
            d = gcd(abs(x - y), n)
        if d != n:
            return d
        c += 1


def factorize(n):
    if n == 1:
        return []
    if is_prime(n):
        return [n]
    d = rho(n)
    return sorted(factorize(d) + factorize(n // d))
`,
      tests: [
        { args: [8051], expected: [83, 97] },
        { args: [600851475143], expected: [71, 839, 1471, 6857] },
        { args: [435888], expected: [2, 2, 2, 2, 3, 3, 3, 1009] },
      ],
    },
    {
      language: "javascript",
      entry: "rhoFactor",
      code: `// One factor of n with f(x) = x² + c, or null if this c fails.
function rhoFactor(n, x0, c) {
  const N = BigInt(n), C = BigInt(c);
  const f = (v) => (v * v + C) % N;
  const gcd = (a, b) => (b === 0n ? a : gcd(b, a % b));
  let x = BigInt(x0), y = BigInt(x0), d = 1n;
  while (d === 1n) {
    x = f(x);
    y = f(f(y));
    d = gcd(x > y ? x - y : y - x, N);
  }
  return d === N ? null : Number(d);
}
`,
      tests: [
        { args: [8051, 2, 1], expected: 97 },
        { args: [25, 2, 1], expected: null },
        { args: [25, 2, 2], expected: 5 },
      ],
    },
  ],
  visualizer: "pollard-rho",
  practice: [
    {
      id: "rho-rounds",
      kind: "numeric",
      prompt:
        "Starting from x₀ = 2 with f(x) = x² + 1, after how many rounds does Pollard's rho find a factor of 8051?",
      answer: 3,
      explanation: "Rounds give gcds 1, 1 and then gcd(194, 8051) = 97.",
      hints: [
        "Compute x and y = f(f(·)) for each round, then the gcd of their difference with 8051.",
      ],
      objective: "Trace the tortoise and hare",
    },
    {
      id: "rho-why-gcd",
      kind: "mcq",
      prompt: "Why does gcd(|x − y|, n) reveal a factor before x = y modulo n?",
      options: [
        "x and y first agree modulo the hidden prime p, so p divides x − y",
        "Because x − y is always prime",
        "Because the gcd of any two numbers divides n",
        "Because the hare has reached the end of the sequence",
      ],
      answer: 0,
      explanation:
        "The sequence modulo p has only p values and repeats far sooner than modulo n; a repeat modulo p makes p a common divisor of x − y and n.",
      distractors: {
        1: "x − y is usually composite (194 = 2 · 97).",
        2: "Only a gcd taken with n divides n, and it may be 1 or n itself.",
        3: "The sequence has no end; it cycles.",
      },
      hints: ["Think of the same sequence modulo 97 instead of modulo 8051."],
      objective: "Understand why the gcd works",
    },
  ],
  exam: {
    definition:
      "Pollard's rho finds a non-trivial factor of a composite n by iterating x ↦ x² + c mod n and detecting, with Floyd's cycle detection, a collision modulo an unknown prime factor via gcd(|x − y|, n).",
    steps: [
      "x = y = x₀.",
      "x ← f(x), y ← f(f(y)), d ← gcd(|x − y|, n), until d ≠ 1.",
      "d ≠ n: factor. d = n: retry with another c (or x₀).",
    ],
    timeComplexity: "Heuristically $O(\\sqrt{p}) = O(n^{1/4})$ gcd steps.",
    spaceComplexity: "$O(1)$.",
    correctness:
      "Any value of d with 1 < d < n divides n by construction; the method may fail (d = n) and is retried.",
    applications: [
      "Factoring medium-sized numbers",
      "Splitting off small factors before heavier methods",
      "Discrete logarithms (rho for logarithms)",
    ],
    limitations: ["Heuristic running time", "Slow when the smallest prime factor is large"],
    faq: [
      {
        q: "Why the name rho?",
        a: "Drawn out, the sequence modulo p is a tail leading into a cycle, shaped like the Greek letter ρ.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "x ↦ x² + c with Floyd's cycle detection; gcd reveals p.",
          "≈ n^(1/4) steps (heuristic).",
        ],
      },
      {
        marks: 5,
        outline: [
          "Birthday-paradox idea (1).",
          "Algorithm (2).",
          "Worked example (1).",
          "Cost (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Idea: collisions modulo p (2).",
          "Floyd's detection and the gcd (2).",
          "Worked example on 8051 (2).",
          "Failure and retry (1).",
          "Heuristic analysis (2).",
          "Brent's improvement (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "J. M. Pollard, “A Monte Carlo method for factorization,” BIT Numerical Mathematics, 15(3), 1975.",
      supports: "The rho method.",
    },
    {
      citation:
        "R. P. Brent, “An improved Monte Carlo factorization algorithm,” BIT Numerical Mathematics, 20(2), 1980.",
      supports: "Brent's faster cycle detection and batched gcds.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-23",
};
