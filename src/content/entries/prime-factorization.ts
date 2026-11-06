import type { AlgorithmEntry } from "../types";

export const primeFactorizationEntry: AlgorithmEntry = {
  slug: "prime-factorization",
  name: "Prime Factorization",
  aliases: ["Prime Factorization"],
  curriculum: [366],
  domain: "number-theory",
  subcategory: "Number Theory",
  difficulty: "intermediate",
  summary: "Decomposes a positive integer into its prime factors by trial division up to √n.",
  tags: ["factorization", "prime", "trial division", "number theory"],
  prerequisites: ["Trial Division"],
  related: ["trial-division", "pollard-rho"],
  problem: {
    input: "A positive integer n ≥ 2.",
    output: "The prime factorization of n as a list of [prime, exponent] pairs.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Divide n by each prime starting from 2. Each time a prime divides n, count how many times and divide it out. After checking up to √n, if anything remains, it's a prime factor.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Divide by 2 as many times as possible.",
          "Try odd divisors from 3 to √n.",
          "If n > 1 at the end, n itself is prime.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Keep dividing n by each factor until it no longer divides, counting the exponent.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "$O(\\sqrt{n})$ trial divisions in the worst case (when n is prime). Can be sped up with a precomputed SPF table to $O(\\log n)$.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "For large n, use Pollard's rho or the quadratic sieve.",
          "With a linear sieve's SPF array, factorization takes O(log n).",
          "The fundamental theorem of arithmetic guarantees uniqueness of the factorization.",
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
      entry: "factorize",
      code: `def factorize(n):
    """Return prime factorization as list of [prime, exponent] pairs."""
    factors = []
    d = 2
    while d * d <= n:
        if n % d == 0:
            exp = 0
            while n % d == 0:
                n //= d
                exp += 1
            factors.append([d, exp])
        d += 1 if d == 2 else 2
    if n > 1:
        factors.append([n, 1])
    return factors
`,
      tests: [
        {
          args: [12],
          expected: [
            [2, 2],
            [3, 1],
          ],
        },
        {
          args: [100],
          expected: [
            [2, 2],
            [5, 2],
          ],
        },
        {
          args: [17],
          expected: [[17, 1]],
        },
        {
          args: [360],
          expected: [
            [2, 3],
            [3, 2],
            [5, 1],
          ],
        },
      ],
    },
    {
      language: "javascript",
      entry: "factorize",
      code: `function factorize(n) {
  const factors = [];
  let d = 2;
  while (d * d <= n) {
    if (n % d === 0) {
      let exp = 0;
      while (n % d === 0) { n = Math.floor(n / d); exp++; }
      factors.push([d, exp]);
    }
    d += d === 2 ? 1 : 2;
  }
  if (n > 1) factors.push([n, 1]);
  return factors;
}
`,
      tests: [
        {
          args: [12],
          expected: [
            [2, 2],
            [3, 1],
          ],
        },
        {
          args: [17],
          expected: [[17, 1]],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "prime-factorization-q1",
      kind: "mcq",
      prompt: "What is the time complexity of trial division factorization?",
      options: ["O(√n)", "O(n)", "O(log n)", "O(n log n)"],
      answer: 0,
      explanation:
        "We try divisors up to √n. If n is prime, all √n checks fail and we conclude n is prime.",
      hints: ["Think about the algorithm's key property."],
      objective: "Understanding",
    },
  ],
  exam: {
    definition: "Decomposes a positive integer into its prime factors by trial division up to √n.",
    steps: [
      "Divide by 2 as many times as possible.",
      "Try odd divisors from 3 to √n.",
      "If n > 1 at the end, n itself is prime.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["number-theory applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Prime Factorization?",
        a: "Decomposes a positive integer into its prime factors by trial division up to √n.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Prime Factorization (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Prime Factorization.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
