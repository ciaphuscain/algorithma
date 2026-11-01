import type { AlgorithmEntry } from "../types";

export const modularDivisionEntry: AlgorithmEntry = {
  slug: "modular-division",
  name: "Modular Division",
  aliases: [
    "Modular Division",
  ],
  curriculum: [
    357,
  ],
  domain: "number-theory",
  subcategory: "Number Theory",
  difficulty: "intermediate",
  summary: "Computes (a / b) mod m by multiplying a with the modular inverse of b, which exists when gcd(b, m) = 1.",
  tags: [
    "modular arithmetic",
    "modular inverse",
    "number theory",
  ],
  prerequisites: [
    "Modular Multiplication",
    "Binary Exponentiation",
  ],
  related: [
    "modular-multiplication",
    "modular-inverse",
    "fast-modular-exponentiation",
  ],
  problem: {
    input: "Integers a and b, and a prime modulus m with gcd(b, m) = 1.",
    output: "(a * b^(-1)) mod m.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Division mod m means multiplying by the modular inverse. By Fermat's little theorem, when m is prime, b^(-1) = b^(m-2) mod m.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Compute b^(m-2) mod m using fast exponentiation (Fermat's little theorem).",
          "Multiply: result = a * b^(m-2) mod m.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "For non-prime m, use the extended Euclidean algorithm to find the inverse (if it exists).",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "When $m$ is prime and $\\gcd(b, m) = 1$: $b^{-1} \\equiv b^{m-2} \\pmod{m}$ by Fermat's little theorem. Time $O(\\log m)$.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "For composite m, use extended GCD.",
          "No inverse exists when gcd(b, m) > 1.",
          "Used heavily in competitive programming and cryptography.",
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
      entry: "mod_div",
      code: `def mod_div(a, b, m):
    """Compute (a / b) mod m. Requires m prime and b not divisible by m."""
    def power(base, exp, mod):
        result = 1
        base %= mod
        while exp > 0:
            if exp & 1: result = result * base % mod
            exp >>= 1
            base = base * base % mod
        return result
    return a % m * power(b, m - 2, m) % m
`,
      tests: [
        {
          args: [
            10,
            2,
            7,
          ],
          expected: 5,
        },
        {
          args: [
            6,
            3,
            11,
          ],
          expected: 2,
        },
      ],
    },
    {
      language: "javascript",
      entry: "modDiv",
      code: `function modDiv(a, b, m) {
  function power(base, exp, mod) {
    let result = 1;
    base %= mod;
    while (exp > 0) {
      if (exp & 1) result = result * base % mod;
      exp >>= 1;
      base = base * base % mod;
    }
    return result;
  }
  return a % m * power(b, m - 2, m) % m;
}
`,
      tests: [
        {
          args: [
            10,
            2,
            7,
          ],
          expected: 5,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "modular-division-q1",
      kind: "mcq",
      prompt: "When does a modular inverse of b mod m exist?",
      options: [
        "When gcd(b, m) = 1",
        "Always",
        "When b < m",
        "When m is even",
      ],
      answer: 0,
      explanation: "The modular inverse exists if and only if b and m are coprime (gcd = 1).",
      hints: [
        "Think about the algorithm's key property.",
      ],
      objective: "Understanding",
    },
  ],
  exam: {
    definition: "Computes (a / b) mod m by multiplying a with the modular inverse of b, which exists when gcd(b, m) = 1.",
    steps: [
      "Compute b^(m-2) mod m using fast exponentiation (Fermat's little theorem).",
      "Multiply: result = a * b^(m-2) mod m.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: [
      "number-theory applications",
    ],
    limitations: [
      "Specific to its problem domain",
    ],
    faq: [
      {
        q: "When should you use Modular Division?",
        a: "Computes (a / b) mod m by multiplying a with the modular inverse of b, which exists when gcd(b, m) = 1.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Modular Division (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Modular Division.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
