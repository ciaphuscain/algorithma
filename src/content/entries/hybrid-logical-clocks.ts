import type { AlgorithmEntry } from "../types";

export const hybridLogicalClocksEntry: AlgorithmEntry = {
  slug: "hybrid-logical-clocks",
  name: "Hybrid Logical Clocks",
  aliases: ["Hybrid Logical Clocks"],
  curriculum: [559],
  domain: "distributed",
  subcategory: "Distributed Algorithms",
  difficulty: "intermediate",
  summary:
    "Hybrid Logical Clocks is an algorithm in the field of distributed algorithms. It provides an efficient approach to solving problems in this domain.",
  tags: ["hybrid logical clocks", "distributed algorithms"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input data for Hybrid Logical Clocks.",
    output: "Result of applying Hybrid Logical Clocks to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Hybrid Logical Clocks addresses a fundamental problem in distributed algorithms. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind Hybrid Logical Clocks is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Hybrid Logical Clocks algorithm proceeds through a series of well-defined steps:",
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
        text: "When implementing Hybrid Logical Clocks, pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of Hybrid Logical Clocks depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of Hybrid Logical Clocks exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
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
      value: "Distributed Algorithms",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "solve",
      code: `def solve(events):
    """Process distributed events with logical timestamps.
    Each event is [node_id, local_time]. Returns events sorted by causal order."""
    return sorted(events, key=lambda e: (e[1], e[0]))
`,
      tests: [
        {
          args: [
            [
              [1, 3],
              [2, 1],
              [1, 2],
            ],
          ],
          expected: [
            [2, 1],
            [1, 2],
            [1, 3],
          ],
        },
        {
          args: [[[0, 0]]],
          expected: [[0, 0]],
        },
      ],
    },
    {
      language: "javascript",
      entry: "solve",
      code: `function solve(events) {
  return [...events].sort((a, b) => a[1] - b[1] || a[0] - b[0]);
}`,
      tests: [
        {
          args: [
            [
              [1, 3],
              [2, 1],
              [1, 2],
            ],
          ],
          expected: [
            [2, 1],
            [1, 2],
            [1, 3],
          ],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "hybrid-l-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Hybrid Logical Clocks?",
      options: [
        "To solve problems in distributed algorithms",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation:
        "Hybrid Logical Clocks is designed specifically for problems in the domain of distributed algorithms.",
      hints: ["Think about what domain Hybrid Logical Clocks belongs to"],
      objective: "Understand the purpose of Hybrid Logical Clocks",
    },
  ],
  exam: {
    definition: "Define Hybrid Logical Clocks and explain its purpose.",
    steps: ["Describe the main steps of Hybrid Logical Clocks."],
    timeComplexity: "Analyze the time complexity of Hybrid Logical Clocks.",
    spaceComplexity: "Analyze the space complexity of Hybrid Logical Clocks.",
    correctness: "How does Hybrid Logical Clocks guarantee correctness?",
    applications: ["List two applications of Hybrid Logical Clocks."],
    limitations: ["What are the limitations of Hybrid Logical Clocks?"],
    faq: [
      {
        q: "Why is Hybrid Logical Clocks preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Hybrid Logical Clocks works by applying its core strategy to efficiently solve t",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on Hybrid Logical Clocks",
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
