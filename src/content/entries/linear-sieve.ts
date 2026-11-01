import type { AlgorithmEntry } from "../types";

export const linearSieveEntry: AlgorithmEntry = {
  slug: "linear-sieve",
  name: "Linear Sieve",
  aliases: ["Linear Sieve"],
  curriculum: [363],
  domain: "number-theory",
  subcategory: "Number Theory",
  difficulty: "intermediate",
  summary:
    "Generates all primes up to n in O(n) time by ensuring each composite is crossed off exactly once, by its smallest prime factor.",
  tags: ["sieve", "prime", "linear time", "number theory"],
  prerequisites: ["Sieve of Eratosthenes"],
  related: ["sieve", "segmented-sieve"],
  problem: {
    input: "A positive integer n.",
    output: "All primes up to n.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Unlike the Sieve of Eratosthenes which may mark a composite multiple times, the linear sieve marks each composite exactly once using its smallest prime factor (SPF), achieving true O(n) time.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Maintain a list of discovered primes and an SPF array.",
          "For each i from 2 to n: if SPF[i] is 0, i is prime.",
          "For each prime p ≤ SPF[i]: mark i*p with SPF[i*p] = p. Stop when p divides i (ensures each composite is marked by its SPF only once).",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "The key is breaking when p divides i: this ensures i*p is marked by p = SPF(i*p), not any larger prime.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Each number 2..n is visited O(1) times total, giving $O(n)$ time and $O(n)$ space. Also computes the smallest prime factor of every number, enabling O(log n) factorization.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Also called the Euler sieve.",
          "The SPF array enables fast factorization: divide by SPF repeatedly.",
          "Can be extended to compute multiplicative functions (Euler's totient, Möbius, divisor sum) in O(n).",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n)",
      worst: "O(n)",
    },
    space: "O(n)",
    worstClass: "n",
  },
  properties: [
    {
      label: "Domain",
      value: "number theory",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "linear_sieve",
      code: `def linear_sieve(n):
    """Return list of primes up to n using the linear sieve."""
    spf = [0] * (n + 1)
    primes = []
    for i in range(2, n + 1):
        if spf[i] == 0:
            spf[i] = i
            primes.append(i)
        for p in primes:
            if p > spf[i] or i * p > n:
                break
            spf[i * p] = p
    return primes
`,
      tests: [
        {
          args: [10],
          expected: [2, 3, 5, 7],
        },
        {
          args: [20],
          expected: [2, 3, 5, 7, 11, 13, 17, 19],
        },
        {
          args: [2],
          expected: [2],
        },
      ],
    },
    {
      language: "javascript",
      entry: "linearSieve",
      code: `function linearSieve(n) {
  const spf = new Array(n + 1).fill(0);
  const primes = [];
  for (let i = 2; i <= n; i++) {
    if (spf[i] === 0) { spf[i] = i; primes.push(i); }
    for (const p of primes) {
      if (p > spf[i] || i * p > n) break;
      spf[i * p] = p;
    }
  }
  return primes;
}
`,
      tests: [
        {
          args: [10],
          expected: [2, 3, 5, 7],
        },
        {
          args: [20],
          expected: [2, 3, 5, 7, 11, 13, 17, 19],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "linear-sieve-q1",
      kind: "mcq",
      prompt: "What makes the linear sieve O(n) instead of O(n log log n)?",
      options: [
        "Each composite is marked exactly once by its smallest prime factor",
        "It uses a hash table",
        "It skips even numbers",
        "It uses bit manipulation",
      ],
      answer: 0,
      explanation:
        "The stopping condition (break when p divides i) ensures each composite is crossed off exactly once.",
      hints: ["Think about the algorithm's key property."],
      objective: "Understanding",
    },
  ],
  exam: {
    definition:
      "Generates all primes up to n in O(n) time by ensuring each composite is crossed off exactly once, by its smallest prime factor.",
    steps: [
      "Maintain a list of discovered primes and an SPF array.",
      "For each i from 2 to n: if SPF[i] is 0, i is prime.",
      "For each prime p ≤ SPF[i]: mark i*p with SPF[i*p] = p. Stop when p divides i (ensures each composite is marked by its SPF only once).",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["number-theory applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Linear Sieve?",
        a: "Generates all primes up to n in O(n) time by ensuring each composite is crossed off exactly once, by its smallest prime factor.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Linear Sieve (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Linear Sieve.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
