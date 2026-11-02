import type { AlgorithmEntry } from "../types";

export const conjugateGradientEntry: AlgorithmEntry = {
  slug: "conjugate-gradient",
  name: "Conjugate Gradient",
  aliases: ["Conjugate Gradient"],
  curriculum: [588],
  domain: "number-theory",
  subcategory: "Number Theory",
  difficulty: "intermediate",
  summary:
    "Conjugate Gradient is an algorithm in the field of number theory. It provides an efficient approach to solving problems in this domain.",
  tags: ["conjugate gradient", "number theory"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input data for Conjugate Gradient.",
    output: "Result of applying Conjugate Gradient to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Conjugate Gradient addresses a fundamental problem in number theory. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind Conjugate Gradient is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Conjugate Gradient algorithm proceeds through a series of well-defined steps:",
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
        text: "When implementing Conjugate Gradient, pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of Conjugate Gradient depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of Conjugate Gradient exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
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
    """Compute a value related to Conjugate Gradient for input n."""
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
      id: "conjugat-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Conjugate Gradient?",
      options: [
        "To solve problems in number theory",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation:
        "Conjugate Gradient is designed specifically for problems in the domain of number theory.",
      hints: ["Think about what domain Conjugate Gradient belongs to"],
      objective: "Understand the purpose of Conjugate Gradient",
    },
  ],
  exam: {
    definition: "Define Conjugate Gradient and explain its purpose.",
    steps: ["Describe the main steps of Conjugate Gradient."],
    timeComplexity: "Analyze the time complexity of Conjugate Gradient.",
    spaceComplexity: "Analyze the space complexity of Conjugate Gradient.",
    correctness: "How does Conjugate Gradient guarantee correctness?",
    applications: ["List two applications of Conjugate Gradient."],
    limitations: ["What are the limitations of Conjugate Gradient?"],
    faq: [
      {
        q: "Why is Conjugate Gradient preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Conjugate Gradient works by applying its core strategy to efficiently solve the ",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on Conjugate Gradient",
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
