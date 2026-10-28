import type { AlgorithmEntry } from "../types";

export const sieveEntry: AlgorithmEntry = {
  slug: "sieve",
  name: "Sieve of Eratosthenes",
  aliases: ["Prime sieve"],
  curriculum: [362],
  domain: "number-theory",
  subcategory: "Primes",
  difficulty: "beginner",
  summary:
    "Lists every prime up to n by crossing out the multiples of each prime in turn, starting from its square; whatever is never crossed out is prime.",
  tags: ["primes", "number theory", "sieve", "precomputation"],
  prerequisites: ["Arrays and indexing", "Divisibility"],
  related: ["miller-rabin", "pollard-rho", "euclid"],
  problem: {
    input: "A whole number $n \\ge 2$.",
    output: "All primes $p \\le n$.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Write the numbers 2 to $n$. 2 is prime; cross out every other multiple of 2. The next number not crossed out, 3, must be prime, because nothing smaller divides it. Cross out its multiples. Continue: each number that survives to its turn is prime.",
      },
      {
        kind: "p",
        text: "You can stop early. Once $p^2 > n$, every composite number up to $n$ has already been crossed out, because a composite has a prime factor no larger than its square root.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Mark $2, 3, \\dots, n$ as candidates.",
          "For $p = 2, 3, \\dots$ while $p^2 \\le n$: if $p$ is still a candidate, it is prime; cross out $p^2, p^2 + p, p^2 + 2p, \\dots \\le n$.",
          "Every candidate left is prime.",
        ],
      },
      { kind: "heading", text: "Worked example: n = 30" },
      {
        kind: "table",
        head: ["p", "Crossed out", "Already crossed"],
        rows: [
          ["2", "4, 6, 8, …, 30 (14 numbers)", "—"],
          ["3", "9, 12, 15, 18, 21, 24, 27, 30 (8)", "12, 18, 24, 30"],
          ["4", "skipped: crossed out by 2", "—"],
          ["5", "25, 30 (2)", "30"],
        ],
      },
      {
        kind: "p",
        text: "$6^2 = 36 > 30$, so the sieve stops after $p = 5$. It made 24 crossings, 5 of them repeats, and the 10 survivors are the primes 2, 3, 5, 7, 11, 13, 17, 19, 23, 29. Up to 100 it makes 104 crossings and finds 25 primes.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "**Use a boolean array** `is_prime[0..n]`, not a list of numbers you delete from: crossing out is then one write.",
          "**Start at $p^2$, step $p$.** Smaller multiples $kp$ with $k < p$ were crossed out by the prime factors of $k$.",
          "**Loop while $p \\cdot p \\le n$**, not $p \\le \\sqrt{n}$ in floating point, to avoid rounding errors.",
          "**Memory:** one bit per odd number (skip the evens) brings the table to $n/16$ bytes. For $n$ beyond memory, a *segmented sieve* processes blocks of size about $\\sqrt{n}$ with the primes up to $\\sqrt{n}$.",
        ],
      },
    ],
    mathematics: [
      { kind: "heading", text: "Correctness" },
      {
        kind: "p",
        text: "A prime is never crossed out: only multiples $kp$ with $k \\ge p \\ge 2$ are, and those are composite. A composite $m \\le n$ has a smallest prime factor $q$ with $q^2 \\le m \\le n$, and $m = q \\cdot k$ with $k \\ge q$, so $m$ is among $q^2, q^2 + q, \\dots$ and is crossed out when the sieve reaches $q$. And $q$ is still a candidate at that moment, because it is prime.",
      },
      { kind: "heading", text: "Running time" },
      {
        kind: "p",
        text: "The prime $p$ crosses out $\\lfloor (n - p^2)/p \\rfloor + 1 \\le n/p$ numbers, so the total is at most",
      },
      {
        kind: "math",
        tex: "\\sum_{p \\le \\sqrt{n},\\ p \\text{ prime}} \\frac{n}{p} \\;=\\; n \\ln\\ln n + O(n),",
      },
      {
        kind: "p",
        text: "using Mertens' theorem, $\\sum_{p \\le x} 1/p = \\ln\\ln x + O(1)$. With the outer loop the time is $\\Theta(n \\log \\log n)$ and the space is $\\Theta(n)$. The test suite checks the exact crossing count for every $n$ from 2 to 200.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**Linear sieve.** Crossing out each composite exactly once, by its smallest prime factor, gives $\\Theta(n)$ time and also yields every number's smallest prime factor, which makes factorization of numbers up to $n$ fast.",
          "**Wheel factorization** skips multiples of 2, 3, 5, … from the start, cutting the work by a constant factor.",
          "**Sieve of Atkin** has a better asymptotic bound ($O(n / \\log\\log n)$ in its optimized form), though well-tuned Eratosthenes sieves are competitive in practice.",
          "**Single numbers.** To test one large number, use a primality test such as Miller–Rabin instead of sieving.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "\\Theta(n \\log\\log n)",
      average: "\\Theta(n \\log\\log n)",
      worst: "\\Theta(n \\log\\log n)",
    },
    space: "\\Theta(n)",
    worstClass: "other",
    note: "Essentially linear: $\\log\\log n < 4$ for every $n$ below $10^{20}$.",
  },
  properties: [
    { label: "Output", value: "All primes up to $n$" },
    { label: "Operations", value: "Additions only: no division" },
  ],
  implementations: [
    {
      language: "python",
      entry: "sieve",
      code: `def sieve(n):
    """Return the list of primes up to n (n >= 2)."""
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    p = 2
    while p * p <= n:
        if is_prime[p]:
            for m in range(p * p, n + 1, p):
                is_prime[m] = False
        p += 1
    return [m for m in range(n + 1) if is_prime[m]]
`,
      tests: [
        { args: [30], expected: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29] },
        { args: [2], expected: [2] },
        { args: [10], expected: [2, 3, 5, 7] },
      ],
    },
    {
      language: "javascript",
      entry: "sieve",
      code: `function sieve(n) {
  const isPrime = new Array(n + 1).fill(true);
  isPrime[0] = isPrime[1] = false;
  for (let p = 2; p * p <= n; p++) {
    if (!isPrime[p]) continue;
    for (let m = p * p; m <= n; m += p) isPrime[m] = false;
  }
  const primes = [];
  for (let m = 2; m <= n; m++) if (isPrime[m]) primes.push(m);
  return primes;
}
`,
      tests: [
        { args: [20], expected: [2, 3, 5, 7, 11, 13, 17, 19] },
        { args: [3], expected: [2, 3] },
        { args: [49], expected: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47] },
      ],
    },
  ],
  visualizer: "sieve",
  practice: [
    {
      id: "sieve-start",
      kind: "mcq",
      prompt: "When the sieve reaches the prime 7, which number does it cross out first?",
      options: ["49", "14", "21", "7"],
      answer: 0,
      explanation:
        "Multiples $7k$ with $k < 7$ have a prime factor smaller than 7 and are already crossed out, so the first new one is $7^2 = 49$.",
      distractors: {
        1: "14 was crossed out by 2.",
        2: "21 was crossed out by 3.",
        3: "7 itself is prime and is never crossed out.",
      },
      hints: ["Which multiples of 7 have a smaller prime factor?"],
      objective: "Explain the start at p²",
    },
    {
      id: "sieve-stop",
      kind: "numeric",
      prompt: "For $n = 120$, what is the largest $p$ whose multiples the sieve crosses out?",
      answer: 7,
      explanation:
        "The loop runs while $p^2 \\le 120$, so up to $p = 10$; the primes among them are 2, 3, 5 and 7. $11^2 = 121 > 120$.",
      hints: [
        "Only primes cross anything out.",
        "Find the largest prime whose square is at most 120.",
      ],
      objective: "Use the √n bound",
    },
    {
      id: "sieve-crossings",
      kind: "numeric",
      prompt:
        "How many crossings does the sieve make for $n = 30$, counting numbers crossed out twice?",
      answer: 24,
      explanation:
        "$p = 2$: 4..30, 14 numbers. $p = 3$: 9..30, 8 numbers. $p = 5$: 25 and 30. Total $14 + 8 + 2 = 24$.",
      hints: ["For each prime $p$ with $p^2 \\le 30$, count $p^2, p^2 + p, \\dots \\le 30$."],
      objective: "Count the work",
    },
  ],
  exam: {
    definition:
      "The sieve of Eratosthenes finds all primes up to $n$ by repeatedly taking the smallest remaining number $p$ (which is prime) and crossing out its multiples from $p^2$, stopping when $p^2 > n$.",
    steps: [
      "Set is_prime[2..n] = true.",
      "For $p = 2$ while $p^2 \\le n$: if is_prime[$p$], set is_prime[$m$] = false for $m = p^2, p^2 + p, \\dots \\le n$.",
      "Output every $m$ with is_prime[$m$].",
    ],
    timeComplexity: "$\\Theta(n \\log \\log n)$.",
    spaceComplexity: "$\\Theta(n)$ (one flag per number).",
    correctness:
      "Primes are never crossed out; every composite $m$ has a smallest prime factor $q \\le \\sqrt{m}$ and is crossed out as $q \\cdot k$ with $k \\ge q$.",
    applications: [
      "Precomputing primes for factorization, number-theory problems and tests",
      "Generating primes for hash table sizes or cryptographic parameter searches (with further tests)",
    ],
    limitations: [
      "Memory grows with $n$ (a segmented sieve helps)",
      "Wasteful for testing a single large number",
    ],
    faq: [
      {
        q: "Why start crossing at $p^2$?",
        a: "Smaller multiples $kp$, $k < p$, have a smaller prime factor and are already crossed out.",
      },
      {
        q: "Why stop at $\\sqrt{n}$?",
        a: "Every composite up to $n$ has a prime factor at most $\\sqrt{n}$.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Cross out multiples of each prime from $p^2$; survivors are prime.",
          "$\\Theta(n \\log\\log n)$ time, $\\Theta(n)$ space.",
        ],
      },
      {
        marks: 5,
        outline: [
          "Definition (1).",
          "Pseudocode (2).",
          "Trace for a small $n$ such as 30 (1).",
          "Complexity and the two optimisations ($p^2$ start, $\\sqrt{n}$ stop) (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Definition and idea — 1.",
          "Pseudocode — 2.",
          "Full trace showing the numbers crossed by each prime — 3.",
          "Correctness proof — 2.",
          "Complexity via $\\sum 1/p$, segmented and linear sieves — 2.",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "G. H. Hardy, E. M. Wright, An Introduction to the Theory of Numbers, 6th ed., Oxford University Press, 2008, ch. 22.",
      supports: "Mertens' theorem on $\\sum_{p \\le x} 1/p$, used in the running-time bound.",
    },
    {
      citation:
        "R. Crandall, C. Pomerance, Prime Numbers: A Computational Perspective, 2nd ed., Springer, 2005, ch. 3.",
      supports: "The sieve of Eratosthenes, segmented sieving and their costs.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked-example numbers are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-25",
};
