import type { AlgorithmEntry } from "../types";

export const millerRabinEntry: AlgorithmEntry = {
  slug: "miller-rabin",
  name: "Miller–Rabin Primality Test",
  aliases: ["Strong probable prime test", "Rabin–Miller", "Strong pseudoprime test"],
  curriculum: [371],
  domain: "number-theory",
  subcategory: "Primality",
  difficulty: "intermediate",
  summary:
    "Tests whether n is prime with a handful of modular exponentiations. Each base a either proves n composite or is consistent with primality; at most a quarter of bases fool the test for a composite, and fixed small sets of bases are exact below known bounds.",
  tags: ["primality", "modular exponentiation", "randomized", "witness", "pseudoprime"],
  prerequisites: ["Modular arithmetic", "Fast exponentiation"],
  related: ["pollard-rho", "matrix-exponentiation", "crt"],
  problem: {
    input: "An odd number n and a list of bases a.",
    output:
      "Composite (with a witness base), or probably prime (prime, when the bases are known to suffice).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Fermat's little theorem says $a^{n-1} \\equiv 1 \\pmod n$ when n is prime, so a base where this fails proves n composite. Some composites (Carmichael numbers such as 561) pass that test for every base coprime to them. Miller–Rabin looks closer: it watches how $a^{n-1}$ is reached by repeated squaring.",
      },
      {
        kind: "p",
        text: "Modulo a prime, the only square roots of 1 are 1 and −1. So in the chain $a^d, a^{2d}, a^{4d}, \\dots, a^{n-1}$, a prime n forces the chain to start at 1 or to hit −1 just before reaching 1. A composite usually breaks this, and the base that breaks it is a **witness**.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Write $n - 1 = d \\cdot 2^s$ with d odd.",
          "For each base a: compute $x = a^d \\bmod n$. If $x = 1$ or $x = n - 1$, a passes.",
          "Otherwise square up to $s - 1$ times; if x becomes $n - 1$, a passes.",
          "If a never passes, n is composite and a is a witness.",
          "If every base passes, n is probably prime: certainly prime if the bases are known to decide all numbers of that size.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset, n = 561 = 3 · 11 · 17, a Carmichael number). $560 = 35 \\cdot 2^4$, so d = 35 and s = 4.",
      },
      {
        kind: "table",
        head: ["Base", "a^35", "a^70", "a^140", "a^280", "Verdict"],
        rows: [["2", "263", "166", "67", "1", "witness: 1 appears without −1 (= 560) before it"]],
      },
      {
        kind: "p",
        text: "67 is a square root of 1 modulo 561 other than ±1, which is impossible modulo a prime: 561 is composite, even though $2^{560} \\equiv 1$ and the Fermat test would have passed it. By contrast, for n = 2047 = 23 · 89, base 2 gives $2^{1023} \\equiv 1$ at once: 2047 is a **strong pseudoprime** to base 2, and base 3 is needed to expose it.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Exponentiate by repeated squaring, reducing after every product. For n near $2^{64}$ the products need 128-bit arithmetic or big integers.",
          "Only bases from 2 to n − 2 carry information; reduce larger bases mod n and skip 0, 1 and n − 1 (the visualizer does this).",
          "Deterministic base sets: 2, 3, 5, 7, 11, 13 decide every n below 3,474,749,660,383; the first twelve primes (2 to 37) decide every n below about $3.3 \\cdot 10^{24}$, which covers all 64-bit integers (the Python sample).",
          "Trial division by a few small primes first is cheaper than a full test for most inputs.",
          "As a random test, k independent random bases leave error probability at most $4^{-k}$ for a composite.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Why primes pass.** If n is prime, $x^2 \\equiv 1 \\pmod n$ means n divides $(x-1)(x+1)$, so $x \\equiv \\pm 1$. The last term $a^{n-1}$ is 1 (Fermat), so walking backwards through the chain, either every term is 1 (the first is 1) or the term before the first 1 is −1.",
      },
      {
        kind: "p",
        text: "**Why composites fail.** Rabin and Monier showed that for an odd composite n, at most a quarter of the bases in $[1, n-1]$ are strong liars:",
      },
      { kind: "math", tex: "\\Pr[\\text{composite passes } k \\text{ random bases}] \\le 4^{-k}" },
      {
        kind: "p",
        text: "**Cost.** One modular exponentiation per base, $O(\\log n)$ multiplications, plus at most $s - 1$ squarings: $O(k \\log n)$ multiplications for k bases. The property tests check the deterministic bases against trial division on random n up to $10^9$.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Miller's original test was deterministic, assuming the generalized Riemann hypothesis: it checks every base up to $O((\\log n)^2)$. Bach later showed that bases up to $2 (\\ln n)^2$ suffice.",
          "AKS (Agrawal, Kayal, Saxena, 2002) proved primality testing is in P unconditionally, but it is far slower in practice.",
          "Baillie–PSW combines one strong test with a Lucas test; no counterexample is known.",
          "Factoring is believed to be much harder than primality testing: Miller–Rabin says 561 is composite without finding 3, 11 or 17. Pollard's rho finds factors.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(k \\log n)", average: "O(k \\log n)", worst: "O(k \\log n)" },
    space: "O(1)",
    worstClass: "log n",
    note: "k bases, counting modular multiplications; each costs $O(\\log^2 n)$ bit operations with schoolbook arithmetic.",
  },
  properties: [
    {
      label: "Errors",
      value:
        "Never calls a prime composite; a composite passes k random bases with probability ≤ $4^{-k}$",
    },
    { label: "Exact for", value: "n < 3,474,749,660,383 with bases 2–13" },
  ],
  implementations: [
    {
      language: "python",
      entry: "is_prime",
      code: `def is_prime(n):
    # Deterministic for n < 3.3 · 10^24 with the first twelve primes as bases.
    if n < 2:
        return False
    bases = (2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37)
    for p in bases:
        if n % p == 0:
            return n == p
    d, s = n - 1, 0
    while d % 2 == 0:
        d //= 2
        s += 1
    for a in bases:
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
`,
      tests: [
        { args: [561], expected: false },
        { args: [1000003], expected: true },
        { args: [3215031751], expected: false },
        { args: [999999999989], expected: true },
        { args: [1], expected: false },
      ],
    },
    {
      language: "javascript",
      entry: "millerRabin",
      code: `// true when n passes the strong test for every base (prime, or a strong liar)
function millerRabin(n, bases) {
  const N = BigInt(n);
  const powMod = (a, e) => {
    let r = 1n;
    for (a %= N; e > 0n; e >>= 1n, a = (a * a) % N) if (e & 1n) r = (r * a) % N;
    return r;
  };
  let d = N - 1n, s = 0;
  while (d % 2n === 0n) { d /= 2n; s++; }
  return bases.every((base) => {
    const a = BigInt(base) % N;
    if (a < 2n || a > N - 2n) return true; // 0, 1 and n − 1 prove nothing
    let x = powMod(a, d);
    if (x === 1n || x === N - 1n) return true;
    for (let r = 1; r < s; r++) {
      x = (x * x) % N;
      if (x === N - 1n) return true;
    }
    return false;
  });
}
`,
      tests: [
        { args: [2047, [2]], expected: true },
        { args: [2047, [2, 3]], expected: false },
        { args: [561, [2]], expected: false },
        { args: [1000003, [2, 3, 5]], expected: true },
      ],
    },
  ],
  visualizer: "miller-rabin",
  practice: [
    {
      id: "mr-ds",
      kind: "numeric",
      prompt: "For n = 561, write n − 1 = d · 2^s with d odd. What is d?",
      answer: 35,
      explanation: "560 = 35 · 16 = 35 · 2^4, so d = 35 and s = 4.",
      hints: ["Divide 560 by 2 until the result is odd."],
      objective: "Decompose n − 1",
    },
    {
      id: "mr-liar",
      kind: "mcq",
      prompt: "Base 2 says 2047 is “probably prime”, but 2047 = 23 · 89. What does this show?",
      options: [
        "2047 is a strong pseudoprime to base 2: a single base can be fooled",
        "The test has a bug: it must never call a composite probably prime",
        "2047 is prime after all",
        "Base 2 is never a valid base",
      ],
      answer: 0,
      explanation:
        "Miller–Rabin can only err in one direction: composites can pass some bases. That is why several bases (or random ones) are used; base 3 exposes 2047.",
      distractors: {
        1: "One-sided error is expected; only a “composite” verdict is a proof.",
        2: "23 · 89 = 2047.",
        3: "Base 2 is a fine base; it just cannot catch every composite alone.",
      },
      hints: ["Which verdict of the test is a proof?"],
      objective: "Understand one-sided error",
    },
  ],
  exam: {
    definition:
      "The Miller–Rabin test writes n − 1 = d·2^s and checks, for bases a, that a^d ≡ 1 or a^(d·2^r) ≡ −1 (mod n) for some r < s; any base that fails proves n composite.",
    steps: [
      "n − 1 = d · 2^s, d odd.",
      "x = a^d mod n; pass if x = ±1.",
      "Square up to s − 1 times; pass if x = −1.",
      "No pass: composite (a is a witness). All bases pass: probably prime.",
    ],
    timeComplexity: "$O(k \\log n)$ modular multiplications for k bases.",
    spaceComplexity: "$O(1)$ numbers.",
    correctness:
      "Modulo a prime the only square roots of 1 are ±1, so the squaring chain of a prime always starts at 1 or passes through −1; at most 1/4 of bases are strong liars for a composite.",
    applications: [
      "Key generation in RSA and other cryptosystems",
      "Primality checks in factoring algorithms",
      "Hashing (choosing prime table sizes)",
    ],
    limitations: [
      "Probabilistic unless a proven base set covers n",
      "Proves compositeness without giving a factor",
    ],
    faq: [
      {
        q: "Why not just Fermat's test?",
        a: "Carmichael numbers such as 561 pass Fermat's test for every coprime base; they fail the strong test for most bases.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Strong probable-prime test on n − 1 = d·2^s.",
          "Error ≤ 4^(−k) for k random bases.",
        ],
      },
      {
        marks: 5,
        outline: [
          "Fermat's theorem and its weakness (1).",
          "The squaring chain (2).",
          "Example with 561 (1).",
          "Error bound (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Fermat test and Carmichael numbers (2).",
          "Square roots of 1 modulo a prime (2).",
          "Algorithm (2).",
          "Worked example (2).",
          "Error bound, deterministic bases, complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "G. L. Miller, “Riemann's hypothesis and tests for primality,” Journal of Computer and System Sciences, 13(3), 1976.",
      supports:
        "The strong test and its deterministic version under the generalized Riemann hypothesis.",
    },
    {
      citation:
        "M. O. Rabin, “Probabilistic algorithm for testing primality,” Journal of Number Theory, 12(1), 1980.",
      supports: "The randomized test and the bound of 1/4 on strong liars.",
    },
    {
      citation:
        "E. Bach, “Explicit bounds for primality testing and related problems,” Mathematics of Computation, 55(191), 1990.",
      supports: "Under the generalized Riemann hypothesis, bases up to 2 (ln n)² suffice.",
    },
    {
      citation:
        "G. Jaeschke, “On strong pseudoprimes to several bases,” Mathematics of Computation, 61(204), 1993.",
      supports: "The bound 3,474,749,660,383 for the bases 2 to 13.",
    },
    {
      citation:
        "J. Sorenson, J. Webster, “Strong pseudoprimes to twelve prime bases,” Mathematics of Computation, 86(304), 2017.",
      supports: "The first twelve primes as bases decide all n below about 3.3 · 10^24.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-23",
};
