import type { AlgorithmEntry } from "../types";

export const modularMultiplicationEntry: AlgorithmEntry = {
  slug: "modular-multiplication",
  name: "Modular Multiplication",
  aliases: ["Modular Multiplication"],
  curriculum: [356],
  domain: "number-theory",
  subcategory: "Number Theory",
  difficulty: "intermediate",
  summary:
    "Multiplies two numbers under a modulus, returning (a * b) mod m, avoiding overflow by reducing intermediates.",
  tags: ["modular arithmetic", "number theory"],
  prerequisites: ["Modular Addition"],
  related: ["modular-addition", "fast-modular-exponentiation"],
  problem: {
    input: "Two integers a and b, and a positive modulus m.",
    output: "(a * b) mod m.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Multiply a and b, then take the remainder. For large numbers, reduce a and b first to keep intermediates small.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: ["Reduce a mod m and b mod m.", "Multiply the results.", "Take modulo m again."],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "In Python, arbitrary-precision integers handle overflow. In C/JS, use 64-bit types or Russian-peasant multiplication for very large moduli.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "$(a \\cdot b) \\bmod m = ((a \\bmod m) \\cdot (b \\bmod m)) \\bmod m$. Time $O(1)$ with hardware multiplication.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Russian-peasant (binary) method: decompose b into powers of 2, use modular addition to avoid overflow.",
          "Montgomery multiplication accelerates repeated modular multiplications.",
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
      entry: "mod_mul",
      code: `def mod_mul(a, b, m):
    return (a % m) * (b % m) % m
`,
      tests: [
        {
          args: [7, 5, 10],
          expected: 5,
        },
        {
          args: [123, 456, 1000],
          expected: 88,
        },
        {
          args: [3, 4, 5],
          expected: 2,
        },
      ],
    },
    {
      language: "javascript",
      entry: "modMul",
      code: `function modMul(a, b, m) {
  return ((a % m) * (b % m)) % m;
}
`,
      tests: [
        {
          args: [7, 5, 10],
          expected: 5,
        },
        {
          args: [3, 4, 5],
          expected: 2,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "modular-multiplication-q1",
      kind: "mcq",
      prompt: "What is (7 * 8) mod 10?",
      options: ["6", "56", "5", "8"],
      answer: 0,
      explanation: "7 * 8 = 56, and 56 mod 10 = 6.",
      hints: ["Think about the algorithm's key property."],
      objective: "Understanding",
    },
  ],
  exam: {
    definition:
      "Multiplies two numbers under a modulus, returning (a * b) mod m, avoiding overflow by reducing intermediates.",
    steps: ["Reduce a mod m and b mod m.", "Multiply the results.", "Take modulo m again."],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["number-theory applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Modular Multiplication?",
        a: "Multiplies two numbers under a modulus, returning (a * b) mod m, avoiding overflow by reducing intermediates.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Modular Multiplication (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Modular Multiplication.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
