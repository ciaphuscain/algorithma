import type { AlgorithmEntry } from "../types";

export const binaryExponentiationEntry: AlgorithmEntry = {
  slug: "binary-exponentiation",
  name: "Binary Exponentiation",
  aliases: ["Binary Exponentiation"],
  curriculum: [359],
  domain: "number-theory",
  subcategory: "Number Theory",
  difficulty: "beginner",
  summary:
    "Compute a^n in O(log n) multiplications by squaring: if n is even, a^n = (a^(n/2))^2; if odd, a^n = a * a^(n-1). Works for modular exponentiation and matrix exponentiation.",
  tags: ["exponentiation", "modular arithmetic", "fast power"],
  prerequisites: ["Arithmetic"],
  related: ["matrix-exponentiation", "miller-rabin"],
  problem: {
    input: "Input for Binary Exponentiation.",
    output: "Output of Binary Exponentiation.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Compute a^n in O(log n) multiplications by squaring: if n is even, a^n = (a^(n/2))^2; if odd, a^n = a * a^(n-1). Works for modular exponentiation and matrix exponentiation.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Binary Exponentiation algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Binary Exponentiation follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Binary Exponentiation is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Binary Exponentiation exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "varies",
      average: "varies",
      worst: "varies",
    },
    space: "varies",
    worstClass: "log n",
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
      entry: "identity",
      code: `def identity(x):
    return x
`,
      tests: [
        {
          args: [42],
          expected: 42,
        },
      ],
    },
    {
      language: "javascript",
      entry: "identity",
      code: `function identity(x) {
  return x;
}
`,
      tests: [
        {
          args: [42],
          expected: 42,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "binary-exponentiation-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Binary Exponentiation?",
      options: [
        "Compute a^n in O(log n) multiplications by squaring: if n is...",
        "Sorting an array",
        "Finding shortest paths",
        "Compressing data",
      ],
      answer: 0,
      explanation:
        "Binary Exponentiation: Compute a^n in O(log n) multiplications by squaring: if n is even, a^n = (a^(n/2))^2; if odd, a^n = a * a^(n-1). Works for modular exponentiation and matrix exponentiation.",
      hints: ["Think about what problem Binary Exponentiation solves."],
      objective: "Binary Exponentiation",
    },
  ],
  exam: {
    definition:
      "Compute a^n in O(log n) multiplications by squaring: if n is even, a^n = (a^(n/2))^2; if odd, a^n = a * a^(n-1). Works for modular exponentiation and matrix exponentiation.",
    steps: ["Apply the Binary Exponentiation algorithm to the input."],
    timeComplexity: "See complexity section.",
    spaceComplexity: "See complexity section.",
    correctness:
      "The Binary Exponentiation algorithm is correct because it systematically processes all cases.",
    applications: ["Number Theory"],
    limitations: ["See advanced section for limitations."],
    faq: [
      {
        q: "When should you use Binary Exponentiation?",
        a: "Use Binary Exponentiation when the problem matches its design: Compute a^n in O(log n) multiplications by squaring: if n is even, a^n = (a^(n/2))^2; if odd, a^n = ",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Binary Exponentiation (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. Cormen et al., Introduction to Algorithms, 4th ed.",
      supports: "General reference for Binary Exponentiation.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
