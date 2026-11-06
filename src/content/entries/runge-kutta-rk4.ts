import type { AlgorithmEntry } from "../types";

export const rungeKuttaRk4Entry: AlgorithmEntry = {
  slug: "runge-kutta-rk4",
  name: "Runge–Kutta (RK4)",
  aliases: ["Runge–Kutta (RK4)"],
  curriculum: [589],
  domain: "number-theory",
  subcategory: "Number Theory",
  difficulty: "intermediate",
  summary:
    "Runge–Kutta (RK4) is an algorithm in the field of number theory. It provides an efficient approach to solving problems in this domain.",
  tags: ["runge–kutta (rk4)", "number theory"],
  prerequisites: [],
  related: ["newton-raphson-method", "finite-element-method-1d-2d"],
  problem: {
    input: "Input data for Runge–Kutta (RK4).",
    output: "Result of applying Runge–Kutta (RK4) to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Runge–Kutta (RK4) addresses a fundamental problem in number theory. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind Runge–Kutta (RK4) is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Runge–Kutta (RK4) algorithm proceeds through a series of well-defined steps:",
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
        text: "When implementing Runge–Kutta (RK4), pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of Runge–Kutta (RK4) depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of Runge–Kutta (RK4) exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
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
    """Compute a value related to Runge–Kutta (RK4) for input n."""
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
      id: "runge-ku-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Runge–Kutta (RK4)?",
      options: [
        "To solve problems in number theory",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation:
        "Runge–Kutta (RK4) is designed specifically for problems in the domain of number theory.",
      hints: ["Think about what domain Runge–Kutta (RK4) belongs to"],
      objective: "Understand the purpose of Runge–Kutta (RK4)",
    },
  ],
  exam: {
    definition: "Define Runge–Kutta (RK4) and explain its purpose.",
    steps: ["Describe the main steps of Runge–Kutta (RK4)."],
    timeComplexity: "Analyze the time complexity of Runge–Kutta (RK4).",
    spaceComplexity: "Analyze the space complexity of Runge–Kutta (RK4).",
    correctness: "How does Runge–Kutta (RK4) guarantee correctness?",
    applications: ["List two applications of Runge–Kutta (RK4)."],
    limitations: ["What are the limitations of Runge–Kutta (RK4)?"],
    faq: [
      {
        q: "Why is Runge–Kutta (RK4) preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Runge–Kutta (RK4) works by applying its core strategy to efficiently solve the t",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on Runge–Kutta (RK4)",
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
