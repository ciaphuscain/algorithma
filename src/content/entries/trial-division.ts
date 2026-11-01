import type { AlgorithmEntry } from "../types";

export const trialDivisionEntry: AlgorithmEntry = {
  slug: "trial-division",
  name: "Trial Division",
  aliases: ["Trial Division"],
  curriculum: [361],
  domain: "number-theory",
  subcategory: "Number Theory",
  difficulty: "intermediate",
  summary:
    "Tests whether a number n is prime by checking divisibility by all integers from 2 to √n.",
  tags: ["primality", "trial division", "number theory"],
  prerequisites: [],
  related: ["sieve", "miller-rabin"],
  problem: {
    input: "A positive integer n ≥ 2.",
    output: "True if n is prime, false otherwise.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "If n has a factor other than 1 and itself, at least one factor must be ≤ √n. So we only need to check up to √n.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Check if n is divisible by 2.",
          "Check odd numbers from 3 to √n.",
          "If no divisor found, n is prime.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "First handle 2 separately, then iterate odd numbers only. Can also skip multiples of 2 and 3 (check 6k±1).",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "$O(\\sqrt{n})$ divisions in the worst case. Space $O(1)$.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "For large n, probabilistic tests (Miller-Rabin) are much faster.",
          "Trial division is optimal for finding small factors quickly.",
          "Can be combined with a small sieve for the first few primes.",
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
      entry: "is_prime",
      code: `def is_prime(n):
    if n < 2: return False
    if n < 4: return True
    if n % 2 == 0 or n % 3 == 0: return False
    i = 5
    while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0: return False
        i += 6
    return True
`,
      tests: [
        {
          args: [2],
          expected: true,
        },
        {
          args: [17],
          expected: true,
        },
        {
          args: [15],
          expected: false,
        },
        {
          args: [1],
          expected: false,
        },
        {
          args: [97],
          expected: true,
        },
      ],
    },
    {
      language: "javascript",
      entry: "isPrime",
      code: `function isPrime(n) {
  if (n < 2) return false;
  if (n < 4) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}
`,
      tests: [
        {
          args: [17],
          expected: true,
        },
        {
          args: [15],
          expected: false,
        },
        {
          args: [97],
          expected: true,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "trial-division-q1",
      kind: "mcq",
      prompt: "Why do we only check divisors up to √n?",
      options: [
        "If n = a*b with a ≤ b, then a ≤ √n",
        "To save memory",
        "Larger divisors don't exist",
        "It's an approximation",
      ],
      answer: 0,
      explanation:
        "If n = a * b and both a,b > √n, then a*b > n, a contradiction. So at least one factor is ≤ √n.",
      hints: ["Think about the algorithm's key property."],
      objective: "Understanding",
    },
  ],
  exam: {
    definition:
      "Tests whether a number n is prime by checking divisibility by all integers from 2 to √n.",
    steps: [
      "Check if n is divisible by 2.",
      "Check odd numbers from 3 to √n.",
      "If no divisor found, n is prime.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["number-theory applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Trial Division?",
        a: "Tests whether a number n is prime by checking divisibility by all integers from 2 to √n.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Trial Division (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Trial Division.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
