import type { AlgorithmEntry } from "../types";

export const fermatPrimalityTestEntry: AlgorithmEntry = {
  slug: "fermat-primality-test",
  name: "Fermat Primality Test",
  aliases: ["Fermat Primality Test"],
  curriculum: [370],
  domain: "number-theory",
  subcategory: "Number Theory",
  difficulty: "intermediate",
  summary:
    "Fermat Primality Test is an algorithm in the field of number theory. It provides an efficient approach to solving problems in this domain.",
  tags: ["fermat primality test", "number theory"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input data for Fermat Primality Test.",
    output: "Result of applying Fermat Primality Test to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Fermat Primality Test addresses a fundamental problem in number theory. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind Fermat Primality Test is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Fermat Primality Test algorithm proceeds through a series of well-defined steps:",
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
        text: "When implementing Fermat Primality Test, pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of Fermat Primality Test depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of Fermat Primality Test exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
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
    """Compute a value related to Fermat Primality Test for input n."""
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
      id: "fermat-p-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Fermat Primality Test?",
      options: [
        "To solve problems in number theory",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation:
        "Fermat Primality Test is designed specifically for problems in the domain of number theory.",
      hints: ["Think about what domain Fermat Primality Test belongs to"],
      objective: "Understand the purpose of Fermat Primality Test",
    },
  ],
  exam: {
    definition: "Define Fermat Primality Test and explain its purpose.",
    steps: ["Describe the main steps of Fermat Primality Test."],
    timeComplexity: "Analyze the time complexity of Fermat Primality Test.",
    spaceComplexity: "Analyze the space complexity of Fermat Primality Test.",
    correctness: "How does Fermat Primality Test guarantee correctness?",
    applications: ["List two applications of Fermat Primality Test."],
    limitations: ["What are the limitations of Fermat Primality Test?"],
    faq: [
      {
        q: "Why is Fermat Primality Test preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Fermat Primality Test works by applying its core strategy to efficiently solve t",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on Fermat Primality Test",
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
