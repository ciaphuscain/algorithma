import type { AlgorithmEntry } from "../types";

export const binaryGcdSteinSAlgorithmEntry: AlgorithmEntry = {
  slug: "binary-gcd-stein-s-algorithm",
  name: "Binary GCD (Stein's Algorithm)",
  aliases: ["Binary GCD (Stein's Algorithm)"],
  curriculum: [353],
  domain: "number-theory",
  subcategory: "Number Theory",
  difficulty: "intermediate",
  summary:
    "Computes the GCD of two non-negative integers using only subtraction and bit shifts, avoiding expensive division operations.",
  tags: ["gcd", "binary", "bit manipulation", "number theory"],
  prerequisites: ["Euclidean Algorithm"],
  related: ["euclid"],
  problem: {
    input: "Two non-negative integers a and b.",
    output: "Their greatest common divisor.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Instead of dividing, use the facts: if both even, gcd(a,b) = 2·gcd(a/2,b/2); if one even, gcd(a,b) = gcd(a/2,b); if both odd, gcd(a,b) = gcd(|a-b|/2, min(a,b)).",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Count common factors of 2 (trailing zeros), shift both right.",
          "Make both odd by shifting out remaining factors of 2.",
          "Repeatedly subtract the smaller from the larger, shift out factors of 2.",
          "Multiply the result by the common power of 2.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Use bitwise AND with 1 to test parity, right-shift to divide by 2. Count trailing zeros with a loop or __builtin_ctz.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Each step reduces at least one operand by half, so $O(\\log(\\max(a,b))^2)$ bit operations. No division needed, making it faster on hardware without fast dividers.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Used in cryptographic libraries where constant-time GCD is needed.",
          "The extended binary GCD computes Bézout coefficients similarly.",
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
      entry: "binary_gcd",
      code: `def binary_gcd(a, b):
    if a == 0: return b
    if b == 0: return a
    shift = 0
    while ((a | b) & 1) == 0:
        a >>= 1; b >>= 1; shift += 1
    while (a & 1) == 0:
        a >>= 1
    while b != 0:
        while (b & 1) == 0:
            b >>= 1
        if a > b: a, b = b, a
        b -= a
    return a << shift
`,
      tests: [
        {
          args: [48, 18],
          expected: 6,
        },
        {
          args: [0, 5],
          expected: 5,
        },
        {
          args: [17, 13],
          expected: 1,
        },
        {
          args: [100, 75],
          expected: 25,
        },
      ],
    },
    {
      language: "javascript",
      entry: "binaryGcd",
      code: `function binaryGcd(a, b) {
  if (a === 0) return b;
  if (b === 0) return a;
  let shift = 0;
  while (((a | b) & 1) === 0) { a >>= 1; b >>= 1; shift++; }
  while ((a & 1) === 0) a >>= 1;
  while (b !== 0) {
    while ((b & 1) === 0) b >>= 1;
    if (a > b) { const t = a; a = b; b = t; }
    b -= a;
  }
  return a << shift;
}
`,
      tests: [
        {
          args: [48, 18],
          expected: 6,
        },
        {
          args: [17, 13],
          expected: 1,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "binary-gcd-stein-s-algorithm-q1",
      kind: "mcq",
      prompt: "What advantage does Binary GCD have over the Euclidean algorithm?",
      options: [
        "It avoids division, using only shifts and subtraction",
        "It always runs in fewer steps",
        "It works with floating-point numbers",
        "It finds the LCM as well",
      ],
      answer: 0,
      explanation:
        "Binary GCD replaces modular reduction with bit shifts and subtraction, which can be faster on hardware without efficient dividers.",
      hints: ["Think about the algorithm's key property."],
      objective: "Understanding",
    },
  ],
  exam: {
    definition:
      "Computes the GCD of two non-negative integers using only subtraction and bit shifts, avoiding expensive division operations.",
    steps: [
      "Count common factors of 2 (trailing zeros), shift both right.",
      "Make both odd by shifting out remaining factors of 2.",
      "Repeatedly subtract the smaller from the larger, shift out factors of 2.",
      "Multiply the result by the common power of 2.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["number-theory applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Binary GCD (Stein's Algorithm)?",
        a: "Computes the GCD of two non-negative integers using only subtraction and bit shifts, avoiding expensive division operations.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Binary GCD (Stein's Algorithm) (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Binary GCD (Stein's Algorithm).",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
