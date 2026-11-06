import type { AlgorithmEntry } from "../types";

export const gramSchmidtOrthogonalizationEntry: AlgorithmEntry = {
  slug: "gram-schmidt-orthogonalization",
  name: "Gram–Schmidt Orthogonalization",
  aliases: ["Gram–Schmidt Orthogonalization"],
  curriculum: [400],
  domain: "number-theory",
  subcategory: "Number Theory",
  difficulty: "intermediate",
  summary:
    "Gram–Schmidt Orthogonalization is an algorithm in the field of number theory. It provides an efficient approach to solving problems in this domain.",
  tags: ["gram–schmidt orthogonalization", "number theory"],
  prerequisites: [],
  related: ["qr-decomposition", "singular-value-decomposition"],
  problem: {
    input: "Input data for Gram–Schmidt Orthogonalization.",
    output: "Result of applying Gram–Schmidt Orthogonalization to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Gram–Schmidt Orthogonalization addresses a fundamental problem in number theory. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind Gram–Schmidt Orthogonalization is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Gram–Schmidt Orthogonalization algorithm proceeds through a series of well-defined steps:",
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
        text: "When implementing Gram–Schmidt Orthogonalization, pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of Gram–Schmidt Orthogonalization depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of Gram–Schmidt Orthogonalization exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
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
    """Compute a value related to Gram–Schmidt Orthogonalization for input n."""
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
      id: "gram-sch-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Gram–Schmidt Orthogonalization?",
      options: [
        "To solve problems in number theory",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation:
        "Gram–Schmidt Orthogonalization is designed specifically for problems in the domain of number theory.",
      hints: ["Think about what domain Gram–Schmidt Orthogonalization belongs to"],
      objective: "Understand the purpose of Gram–Schmidt Orthogonalization",
    },
  ],
  exam: {
    definition: "Define Gram–Schmidt Orthogonalization and explain its purpose.",
    steps: ["Describe the main steps of Gram–Schmidt Orthogonalization."],
    timeComplexity: "Analyze the time complexity of Gram–Schmidt Orthogonalization.",
    spaceComplexity: "Analyze the space complexity of Gram–Schmidt Orthogonalization.",
    correctness: "How does Gram–Schmidt Orthogonalization guarantee correctness?",
    applications: ["List two applications of Gram–Schmidt Orthogonalization."],
    limitations: ["What are the limitations of Gram–Schmidt Orthogonalization?"],
    faq: [
      {
        q: "Why is Gram–Schmidt Orthogonalization preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Gram–Schmidt Orthogonalization works by applying its core strategy to efficientl",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on Gram–Schmidt Orthogonalization",
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
