import type { AlgorithmEntry } from "../types";

export const eulerSTotientFunctionEntry: AlgorithmEntry = {
  slug: "euler-s-totient-function",
  name: "Euler's Totient Function",
  aliases: ["Euler's Totient Function"],
  curriculum: [374],
  domain: "number-theory",
  subcategory: "Number Theory",
  difficulty: "intermediate",
  summary:
    "Computes Euler's totient function phi(n), which counts the number of integers from 1 to n that are coprime with n. Uses the product formula over prime factors.",
  tags: ["number theory", "totient", "prime factorization", "coprime"],
  prerequisites: ["Sieve of Eratosthenes"],
  related: [],
  problem: {
    input: "Input for Euler's Totient Function.",
    output: "Output of Euler's Totient Function.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Euler's totient function phi(n) counts how many integers from 1 to n share no common factor with n other than 1. For example, phi(12) = 4 because only 1, 5, 7, and 11 are coprime with 12.",
      },
      {
        kind: "p",
        text: "The function is fundamental in number theory: it appears in Euler's theorem (a^phi(n) = 1 mod n for gcd(a,n) = 1) and in RSA encryption.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The algorithm uses the product formula: phi(n) = n * product over distinct primes p dividing n of (1 - 1/p).",
      },
      {
        kind: "list",
        ordered: true,
        items: [
          "Start with result = n.",
          "Trial-divide n by each prime factor p.",
          "For each distinct prime factor, multiply result by (1 - 1/p), equivalently: result -= result / p.",
          "Return result.",
        ],
      },
      {
        kind: "table",
        head: ["n", "Prime factors", "phi(n)"],
        rows: [
          ["12", "2, 3", "12 * (1-1/2) * (1-1/3) = 4"],
          ["30", "2, 3, 5", "30 * 1/2 * 2/3 * 4/5 = 8"],
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "We iterate p from 2 to sqrt(n). When p divides n, we divide out all copies of p and apply result -= result // p. Any remaining factor greater than 1 after the loop is a large prime.",
      },
      {
        kind: "code",
        language: "python",
        code: `def euler_totient(n):
    result = n
    p, temp = 2, n
    while p * p <= temp:
        if temp % p == 0:
            while temp % p == 0: temp //= p
            result -= result // p
        p += 1
    if temp > 1: result -= result // temp
    return result`,
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The formula phi(n) = n * prod(1 - 1/p) for p | n follows from inclusion-exclusion on the sets of multiples of each prime factor. For prime p, phi(p) = p - 1. For prime power p^k, phi(p^k) = p^k - p^(k-1). The function is multiplicative: phi(ab) = phi(a)*phi(b) when gcd(a,b) = 1.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "A sieve can compute phi for all integers up to N in O(N log log N) time, similar to the Sieve of Eratosthenes. The sum of phi(d) over all divisors d of n equals n. Euler's totient is used in computing modular inverses and in the RSA cryptosystem.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(sqrt(n))",
      average: "O(sqrt(n))",
      worst: "O(sqrt(n))",
    },
    space: "O(1)",
    worstClass: "other",
  },
  properties: [
    {
      label: "Category",
      value: "Number Theory",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "euler_totient",
      code: `def euler_totient(n):
    """Return phi(n): count of integers in [1, n] coprime to n."""
    if n <= 0:
        return 0
    result = n
    p = 2
    temp = n
    while p * p <= temp:
        if temp % p == 0:
            while temp % p == 0:
                temp //= p
            result -= result // p
        p += 1
    if temp > 1:
        result -= result // temp
    return result
`,
      tests: [
        {
          args: [1],
          expected: 1,
        },
        {
          args: [10],
          expected: 4,
        },
        {
          args: [12],
          expected: 4,
        },
        {
          args: [7],
          expected: 6,
        },
        {
          args: [36],
          expected: 12,
        },
      ],
    },
    {
      language: "javascript",
      entry: "euler_totient",
      code: `function eulerTotient(n) {
  if (n <= 0) return 0;
  let result = n;
  let temp = n;
  for (let p = 2; p * p <= temp; p++) {
    if (temp % p === 0) {
      while (temp % p === 0) temp = Math.floor(temp / p);
      result -= Math.floor(result / p);
    }
  }
  if (temp > 1) result -= Math.floor(result / temp);
  return result;
}`,
      tests: [
        {
          args: [1],
          expected: 1,
        },
        {
          args: [10],
          expected: 4,
        },
        {
          args: [12],
          expected: 4,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "et-q1",
      kind: "mcq",
      prompt: "What is phi(15)?",
      options: ["4", "6", "8", "10"],
      answer: 2,
      explanation: "15 = 3*5, phi = 15*(1-1/3)*(1-1/5) = 15*2/3*4/5 = 8",
      hints: ["Factor 15 first"],
      objective: "Compute Euler's totient",
    },
  ],
  exam: {
    definition: "Define Euler's Totient Function and explain its purpose.",
    steps: ["Describe the main steps of Euler's Totient Function."],
    timeComplexity: "Analyze the time complexity of Euler's Totient Function.",
    spaceComplexity: "Analyze the space complexity of Euler's Totient Function.",
    correctness: "How does Euler's Totient Function guarantee correctness?",
    applications: ["List two applications of Euler's Totient Function."],
    limitations: ["What are the limitations of Euler's Totient Function?"],
    faq: [
      {
        q: "Why is Euler's Totient Function preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Euler's Totient Function works by applying its core strategy to efficiently solv",
        ],
      },
    ],
  },
  references: [
    {
      citation: "Hardy & Wright, An Introduction to the Theory of Numbers, Ch. 5",
      supports: "Euler's totient product formula",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
