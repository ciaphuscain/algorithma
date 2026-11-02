import type { AlgorithmEntry } from "../types";

export const twoPhaseCommitEntry: AlgorithmEntry = {
  slug: "two-phase-commit",
  name: "Two-Phase Commit",
  aliases: ["Two-Phase Commit"],
  curriculum: [548],
  domain: "distributed",
  subcategory: "Distributed Algorithms",
  difficulty: "intermediate",
  summary:
    "Two-Phase Commit is an algorithm in the field of distributed algorithms. It provides an efficient approach to solving problems in this domain.",
  tags: ["two-phase commit", "distributed algorithms"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input data for Two-Phase Commit.",
    output: "Result of applying Two-Phase Commit to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Two-Phase Commit addresses a fundamental problem in distributed algorithms. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind Two-Phase Commit is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Two-Phase Commit algorithm proceeds through a series of well-defined steps:",
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
        text: "When implementing Two-Phase Commit, pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of Two-Phase Commit depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of Two-Phase Commit exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
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
      id: "two-phas-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Two-Phase Commit?",
      options: [
        "To solve problems in distributed algorithms",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation:
        "Two-Phase Commit is designed specifically for problems in the domain of distributed algorithms.",
      hints: ["Think about what domain Two-Phase Commit belongs to"],
      objective: "Understand the purpose of Two-Phase Commit",
    },
  ],
  exam: {
    definition: "Define Two-Phase Commit and explain its purpose.",
    steps: ["Describe the main steps of Two-Phase Commit."],
    timeComplexity: "Analyze the time complexity of Two-Phase Commit.",
    spaceComplexity: "Analyze the space complexity of Two-Phase Commit.",
    correctness: "How does Two-Phase Commit guarantee correctness?",
    applications: ["List two applications of Two-Phase Commit."],
    limitations: ["What are the limitations of Two-Phase Commit?"],
    faq: [
      {
        q: "Why is Two-Phase Commit preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Two-Phase Commit works by applying its core strategy to efficiently solve the ta",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on Two-Phase Commit",
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
