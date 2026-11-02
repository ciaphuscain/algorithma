import type { AlgorithmEntry } from "../types";

export const modularAdditionEntry: AlgorithmEntry = {
  slug: "modular-addition",
  name: "Modular Addition",
  aliases: ["Modular Addition"],
  curriculum: [355],
  domain: "number-theory",
  subcategory: "Number Theory",
  difficulty: "intermediate",
  summary:
    "Adds two numbers under a modulus, returning (a + b) mod m, handling potential overflow.",
  tags: ["modular arithmetic", "number theory"],
  prerequisites: [],
  related: ["modular-multiplication"],
  problem: {
    input: "Two integers a and b, and a positive modulus m.",
    output: "(a + b) mod m.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "In modular arithmetic, we keep numbers in range [0, m) by taking the remainder after division. For addition, (a+b) mod m gives the result.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: ["Reduce a and b modulo m.", "Add them.", "If the sum >= m, subtract m."],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "To avoid overflow in languages with fixed-width integers, reduce a and b first, then check if a + b >= m rather than computing (a+b) % m directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "$(a + b) \\bmod m = ((a \\bmod m) + (b \\bmod m)) \\bmod m$. Runs in $O(1)$ time.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Forms a group $(\\mathbb{Z}/m\\mathbb{Z}, +)$.",
          "Foundation for modular multiplication and exponentiation.",
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
      entry: "mod_add",
      code: `def mod_add(a, b, m):
    return (a % m + b % m) % m
`,
      tests: [
        {
          args: [7, 5, 10],
          expected: 2,
        },
        {
          args: [3, 4, 12],
          expected: 7,
        },
        {
          args: [999, 1, 1000],
          expected: 0,
        },
      ],
    },
    {
      language: "javascript",
      entry: "modAdd",
      code: `function modAdd(a, b, m) {
  return ((a % m) + (b % m)) % m;
}
`,
      tests: [
        {
          args: [7, 5, 10],
          expected: 2,
        },
        {
          args: [999, 1, 1000],
          expected: 0,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "modular-addition-q1",
      kind: "mcq",
      prompt: "Why reduce a and b before adding in modular addition?",
      options: [
        "To prevent integer overflow",
        "To make the algorithm faster",
        "Because it changes the result",
        "To handle negative numbers",
      ],
      answer: 0,
      explanation:
        "Reducing first keeps intermediate values smaller, preventing overflow in fixed-width integer types.",
      hints: ["Think about the algorithm's key property."],
      objective: "Understanding",
    },
  ],
  exam: {
    definition:
      "Adds two numbers under a modulus, returning (a + b) mod m, handling potential overflow.",
    steps: ["Reduce a and b modulo m.", "Add them.", "If the sum >= m, subtract m."],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["number-theory applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Modular Addition?",
        a: "Adds two numbers under a modulus, returning (a + b) mod m, handling potential overflow.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Modular Addition (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Modular Addition.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
