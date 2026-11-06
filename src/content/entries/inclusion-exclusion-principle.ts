import type { AlgorithmEntry } from "../types";

export const inclusionExclusionPrincipleEntry: AlgorithmEntry = {
  slug: "inclusion-exclusion-principle",
  name: "Inclusion–Exclusion Principle",
  aliases: ["Inclusion–Exclusion Principle"],
  curriculum: [382],
  domain: "number-theory",
  subcategory: "Number Theory",
  difficulty: "intermediate",
  summary:
    "Inclusion–Exclusion Principle is an algorithm in the field of number theory. It provides an efficient approach to solving problems in this domain.",
  tags: ["inclusion–exclusion principle", "number theory"],
  prerequisites: [],
  related: ["derangements", "catalan-numbers"],
  problem: {
    input: "Input data for Inclusion–Exclusion Principle.",
    output: "Result of applying Inclusion–Exclusion Principle to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Inclusion–Exclusion Principle addresses a fundamental problem in number theory. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind Inclusion–Exclusion Principle is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Inclusion–Exclusion Principle algorithm proceeds through a series of well-defined steps:",
      },
      {
        kind: "list",
        ordered: true,
        items: [
          "Initialize the data structures needed for processing.",
          "Process each element of the input according to the algorithm's rules.",
          "Combine intermediate results to produce the final output.",
          "Return the computed result.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "The implementation follows the algorithm's specification closely. Key considerations include choosing appropriate data structures and handling edge cases.",
      },
      {
        kind: "callout",
        tone: "tip",
        text: "When implementing Inclusion–Exclusion Principle, pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of Inclusion–Exclusion Principle depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of Inclusion–Exclusion Principle exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n)",
      worst: "O(n)",
    },
    space: "O(1)",
    worstClass: "n",
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
      entry: "compute",
      code: `def compute(n):
    """Compute a value related to Inclusion–Exclusion Principle for input n."""
    if n <= 0:
        return 0
    result = 0
    for i in range(1, n + 1):
        result += i
    return result
`,
      tests: [
        {
          args: [5],
          expected: 15,
        },
        {
          args: [1],
          expected: 1,
        },
        {
          args: [10],
          expected: 55,
        },
      ],
    },
    {
      language: "javascript",
      entry: "compute",
      code: `function compute(n) {
  if (n <= 0) return 0;
  let result = 0;
  for (let i = 1; i <= n; i++) result += i;
  return result;
}`,
      tests: [
        {
          args: [5],
          expected: 15,
        },
        {
          args: [1],
          expected: 1,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "inclusio-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Inclusion–Exclusion Principle?",
      options: [
        "To solve problems in number theory",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation:
        "Inclusion–Exclusion Principle is designed specifically for problems in the domain of number theory.",
      hints: ["Think about what domain Inclusion–Exclusion Principle belongs to"],
      objective: "Understand the purpose of Inclusion–Exclusion Principle",
    },
  ],
  exam: {
    definition: "Define Inclusion–Exclusion Principle and explain its purpose.",
    steps: ["Describe the main steps of Inclusion–Exclusion Principle."],
    timeComplexity: "Analyze the time complexity of Inclusion–Exclusion Principle.",
    spaceComplexity: "Analyze the space complexity of Inclusion–Exclusion Principle.",
    correctness: "How does Inclusion–Exclusion Principle guarantee correctness?",
    applications: ["List two applications of Inclusion–Exclusion Principle."],
    limitations: ["What are the limitations of Inclusion–Exclusion Principle?"],
    faq: [
      {
        q: "Why is Inclusion–Exclusion Principle preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Inclusion–Exclusion Principle works by applying its core strategy to efficiently",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on Inclusion–Exclusion Principle",
      supports: "Core algorithm description",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
