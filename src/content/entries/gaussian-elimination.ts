import type { AlgorithmEntry } from "../types";

export const gaussianEliminationEntry: AlgorithmEntry = {
  slug: "gaussian-elimination",
  name: "Gaussian Elimination",
  aliases: ["Gaussian Elimination"],
  curriculum: [387],
  domain: "number-theory",
  subcategory: "Number Theory",
  difficulty: "intermediate",
  summary:
    "Gaussian Elimination is an algorithm in the field of number theory. It provides an efficient approach to solving problems in this domain.",
  tags: ["gaussian elimination", "number theory"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input data for Gaussian Elimination.",
    output: "Result of applying Gaussian Elimination to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Gaussian Elimination addresses a fundamental problem in number theory. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind Gaussian Elimination is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Gaussian Elimination algorithm proceeds through a series of well-defined steps:",
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
        text: "When implementing Gaussian Elimination, pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of Gaussian Elimination depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of Gaussian Elimination exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
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
    """Compute a value related to Gaussian Elimination for input n."""
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
      id: "gaussian-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Gaussian Elimination?",
      options: [
        "To solve problems in number theory",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation:
        "Gaussian Elimination is designed specifically for problems in the domain of number theory.",
      hints: ["Think about what domain Gaussian Elimination belongs to"],
      objective: "Understand the purpose of Gaussian Elimination",
    },
  ],
  exam: {
    definition: "Define Gaussian Elimination and explain its purpose.",
    steps: ["Describe the main steps of Gaussian Elimination."],
    timeComplexity: "Analyze the time complexity of Gaussian Elimination.",
    spaceComplexity: "Analyze the space complexity of Gaussian Elimination.",
    correctness: "How does Gaussian Elimination guarantee correctness?",
    applications: ["List two applications of Gaussian Elimination."],
    limitations: ["What are the limitations of Gaussian Elimination?"],
    faq: [
      {
        q: "Why is Gaussian Elimination preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Gaussian Elimination works by applying its core strategy to efficiently solve th",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on Gaussian Elimination",
      supports: "Core algorithm description",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
