import type { AlgorithmEntry } from "../types";

export const leastCommonMultipleLcmEntry: AlgorithmEntry = {
  slug: "least-common-multiple-lcm",
  name: "Least Common Multiple (LCM)",
  aliases: ["Least Common Multiple (LCM)"],
  curriculum: [354],
  domain: "number-theory",
  subcategory: "Number Theory",
  difficulty: "intermediate",
  summary:
    "Computes the least common multiple of two integers using the relationship LCM(a,b) = |a*b| / GCD(a,b).",
  tags: ["lcm", "gcd", "number theory"],
  prerequisites: ["Euclidean Algorithm"],
  related: ["euclid"],
  problem: {
    input: "Two positive integers a and b.",
    output: "Their least common multiple.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "The LCM is the smallest number divisible by both a and b. Since a*b = GCD(a,b) * LCM(a,b), we can compute LCM from the GCD.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Compute GCD(a, b) using the Euclidean algorithm.",
          "Return a // GCD * b to avoid overflow (divide first, then multiply).",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Divide a by gcd(a,b) first to avoid integer overflow, then multiply by b.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "$\\text{lcm}(a,b) = \\frac{|a \\cdot b|}{\\gcd(a,b)}$. Time is dominated by the GCD computation: $O(\\log(\\min(a,b)))$.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "LCM of multiple numbers: fold pairwise.",
          "LCM appears in fraction arithmetic and in scheduling periodic events.",
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
      entry: "lcm",
      code: `def lcm(a, b):
    if a == 0 or b == 0: return 0
    def gcd(x, y):
        while y: x, y = y, x % y
        return x
    return abs(a) // gcd(abs(a), abs(b)) * abs(b)
`,
      tests: [
        {
          args: [4, 6],
          expected: 12,
        },
        {
          args: [3, 7],
          expected: 21,
        },
        {
          args: [0, 5],
          expected: 0,
        },
        {
          args: [12, 18],
          expected: 36,
        },
      ],
    },
    {
      language: "javascript",
      entry: "lcm",
      code: `function lcm(a, b) {
  if (a === 0 || b === 0) return 0;
  function gcd(x, y) { while (y) { const t = y; y = x % y; x = t; } return x; }
  return Math.abs(a) / gcd(Math.abs(a), Math.abs(b)) * Math.abs(b);
}
`,
      tests: [
        {
          args: [4, 6],
          expected: 12,
        },
        {
          args: [3, 7],
          expected: 21,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "least-common-multiple-lcm-q1",
      kind: "mcq",
      prompt: "How is LCM related to GCD?",
      options: [
        "LCM(a,b) = |a*b| / GCD(a,b)",
        "LCM(a,b) = GCD(a,b) * (a+b)",
        "LCM(a,b) = a * b",
        "LCM(a,b) = GCD(a,b)^2",
      ],
      answer: 0,
      explanation: "The product of two numbers equals the product of their GCD and LCM.",
      hints: ["Think about the algorithm's key property."],
      objective: "Understanding",
    },
  ],
  exam: {
    definition:
      "Computes the least common multiple of two integers using the relationship LCM(a,b) = |a*b| / GCD(a,b).",
    steps: [
      "Compute GCD(a, b) using the Euclidean algorithm.",
      "Return a // GCD * b to avoid overflow (divide first, then multiply).",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["number-theory applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Least Common Multiple (LCM)?",
        a: "Computes the least common multiple of two integers using the relationship LCM(a,b) = |a*b| / GCD(a,b).",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Least Common Multiple (LCM) (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Least Common Multiple (LCM).",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
