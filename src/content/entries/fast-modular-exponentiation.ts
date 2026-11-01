import type { AlgorithmEntry } from "../types";

export const fastModularExponentiationEntry: AlgorithmEntry = {
  slug: "fast-modular-exponentiation",
  name: "Fast Modular Exponentiation",
  aliases: ["Fast Modular Exponentiation"],
  curriculum: [358],
  domain: "number-theory",
  subcategory: "Number Theory",
  difficulty: "intermediate",
  summary:
    "Computes base^exp mod m in O(log exp) time using repeated squaring (binary exponentiation).",
  tags: ["modular arithmetic", "binary exponentiation", "number theory"],
  prerequisites: ["Modular Multiplication"],
  related: ["binary-exponentiation", "modular-multiplication"],
  problem: {
    input: "Integers base, exp (non-negative), and modulus m.",
    output: "base^exp mod m.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Instead of multiplying base by itself exp times, square the base and halve the exponent. Process each bit of exp: if set, multiply the result by the current base.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Set result = 1.",
          "While exp > 0: if exp is odd, multiply result by base mod m; square base mod m; halve exp.",
          "Return result.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Handle edge cases: exp = 0 returns 1, m = 1 returns 0.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "$O(\\log e)$ multiplications, each $O(1)$ for fixed-size integers. Total $O(\\log e)$.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Used in RSA encryption (large modular exponentiations).",
          "Matrix exponentiation for linear recurrences uses the same principle.",
          "Montgomery multiplication speeds up repeated modular multiplications.",
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
      entry: "mod_pow",
      code: `def mod_pow(base, exp, m):
    if m == 1: return 0
    result = 1
    base %= m
    while exp > 0:
        if exp & 1: result = result * base % m
        exp >>= 1
        base = base * base % m
    return result
`,
      tests: [
        {
          args: [2, 10, 1000],
          expected: 24,
        },
        {
          args: [3, 13, 7],
          expected: 3,
        },
        {
          args: [5, 0, 100],
          expected: 1,
        },
        {
          args: [7, 3, 10],
          expected: 3,
        },
      ],
    },
    {
      language: "javascript",
      entry: "modPow",
      code: `function modPow(base, exp, m) {
  if (m === 1) return 0;
  let result = 1;
  base %= m;
  while (exp > 0) {
    if (exp & 1) result = result * base % m;
    exp >>= 1;
    base = base * base % m;
  }
  return result;
}
`,
      tests: [
        {
          args: [2, 10, 1000],
          expected: 24,
        },
        {
          args: [5, 0, 100],
          expected: 1,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "fast-modular-exponentiation-q1",
      kind: "mcq",
      prompt: "How many multiplications does modular exponentiation need for base^1000?",
      options: ["About 10 (log2 1000)", "1000", "500", "About 30"],
      answer: 0,
      explanation: "Binary exponentiation uses O(log exp) multiplications, and log2(1000) ≈ 10.",
      hints: ["Think about the algorithm's key property."],
      objective: "Understanding",
    },
  ],
  exam: {
    definition:
      "Computes base^exp mod m in O(log exp) time using repeated squaring (binary exponentiation).",
    steps: [
      "Set result = 1.",
      "While exp > 0: if exp is odd, multiply result by base mod m; square base mod m; halve exp.",
      "Return result.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["number-theory applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Fast Modular Exponentiation?",
        a: "Computes base^exp mod m in O(log exp) time using repeated squaring (binary exponentiation).",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Fast Modular Exponentiation (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Fast Modular Exponentiation.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
