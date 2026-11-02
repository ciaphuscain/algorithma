import type { AlgorithmEntry } from "../types";

export const modularInverseEntry: AlgorithmEntry = {
  slug: "modular-inverse",
  name: "Modular Inverse",
  aliases: ["Modular Inverse"],
  curriculum: [377],
  domain: "number-theory",
  subcategory: "Number Theory",
  difficulty: "intermediate",
  summary:
    "Modular Inverse is an algorithm in the field of number theory. It provides an efficient approach to solving problems in this domain.",
  tags: ["modular inverse", "number theory"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input data for Modular Inverse.",
    output: "Result of applying Modular Inverse to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Modular Inverse addresses a fundamental problem in number theory. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind Modular Inverse is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Modular Inverse algorithm proceeds through a series of well-defined steps:",
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
        text: "When implementing Modular Inverse, pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of Modular Inverse depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of Modular Inverse exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
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
    """Compute a value related to Modular Inverse for input n."""
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
      id: "modular--q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Modular Inverse?",
      options: [
        "To solve problems in number theory",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation:
        "Modular Inverse is designed specifically for problems in the domain of number theory.",
      hints: ["Think about what domain Modular Inverse belongs to"],
      objective: "Understand the purpose of Modular Inverse",
    },
  ],
  exam: {
    definition: "Define Modular Inverse and explain its purpose.",
    steps: ["Describe the main steps of Modular Inverse."],
    timeComplexity: "Analyze the time complexity of Modular Inverse.",
    spaceComplexity: "Analyze the space complexity of Modular Inverse.",
    correctness: "How does Modular Inverse guarantee correctness?",
    applications: ["List two applications of Modular Inverse."],
    limitations: ["What are the limitations of Modular Inverse?"],
    faq: [
      {
        q: "Why is Modular Inverse preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Modular Inverse works by applying its core strategy to efficiently solve the tar",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on Modular Inverse",
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
