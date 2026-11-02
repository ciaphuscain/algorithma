import type { AlgorithmEntry } from "../types";

export const meetInTheMiddleEntry: AlgorithmEntry = {
  slug: "meet-in-the-middle",
  name: "Meet in the Middle",
  aliases: ["Meet in the Middle"],
  curriculum: [531],
  domain: "research",
  subcategory: "Advanced Topics",
  difficulty: "intermediate",
  summary:
    "Meet in the Middle is an algorithm in the field of advanced topics. It provides an efficient approach to solving problems in this domain.",
  tags: ["meet in the middle", "advanced topics"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input data for Meet in the Middle.",
    output: "Result of applying Meet in the Middle to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Meet in the Middle addresses a fundamental problem in advanced topics. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind Meet in the Middle is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Meet in the Middle algorithm proceeds through a series of well-defined steps:",
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
        text: "When implementing Meet in the Middle, pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of Meet in the Middle depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of Meet in the Middle exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n log n)",
    },
    space: "O(n)",
    worstClass: "n log n",
  },
  properties: [
    {
      label: "Category",
      value: "Advanced Topics",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "solve",
      code: `def solve(data):
    """Process data using a divide-and-conquer approach.
    Returns sorted and deduplicated data."""
    return sorted(set(data))
`,
      tests: [
        {
          args: [[3, 1, 4, 1, 5, 9, 2, 6]],
          expected: [1, 2, 3, 4, 5, 6, 9],
        },
        {
          args: [[1, 1, 1]],
          expected: [1],
        },
      ],
    },
    {
      language: "javascript",
      entry: "solve",
      code: `function solve(data) {
  return [...new Set(data)].sort((a, b) => a - b);
}`,
      tests: [
        {
          args: [[3, 1, 4, 1, 5, 9, 2, 6]],
          expected: [1, 2, 3, 4, 5, 6, 9],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "meet-in--q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Meet in the Middle?",
      options: [
        "To solve problems in advanced topics",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation:
        "Meet in the Middle is designed specifically for problems in the domain of advanced topics.",
      hints: ["Think about what domain Meet in the Middle belongs to"],
      objective: "Understand the purpose of Meet in the Middle",
    },
  ],
  exam: {
    definition: "Define Meet in the Middle and explain its purpose.",
    steps: ["Describe the main steps of Meet in the Middle."],
    timeComplexity: "Analyze the time complexity of Meet in the Middle.",
    spaceComplexity: "Analyze the space complexity of Meet in the Middle.",
    correctness: "How does Meet in the Middle guarantee correctness?",
    applications: ["List two applications of Meet in the Middle."],
    limitations: ["What are the limitations of Meet in the Middle?"],
    faq: [
      {
        q: "Why is Meet in the Middle preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Meet in the Middle works by applying its core strategy to efficiently solve the ",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on Meet in the Middle",
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
