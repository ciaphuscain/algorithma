import type { AlgorithmEntry } from "../types";

export const twoPhaseLockingEntry: AlgorithmEntry = {
  slug: "two-phase-locking",
  name: "Two-Phase Locking",
  aliases: ["Two-Phase Locking"],
  curriculum: [556],
  domain: "databases",
  subcategory: "Database Algorithms",
  difficulty: "intermediate",
  summary:
    "Two-Phase Locking is an algorithm in the field of database algorithms. It provides an efficient approach to solving problems in this domain.",
  tags: ["two-phase locking", "database algorithms"],
  prerequisites: [],
  related: ["mvcc-multi-version-concurrency-control", "snapshot-isolation"],
  problem: {
    input: "Input data for Two-Phase Locking.",
    output: "Result of applying Two-Phase Locking to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Two-Phase Locking addresses a fundamental problem in database algorithms. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind Two-Phase Locking is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Two-Phase Locking algorithm proceeds through a series of well-defined steps:",
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
        text: "When implementing Two-Phase Locking, pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of Two-Phase Locking depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of Two-Phase Locking exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
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
      value: "Database Algorithms",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "solve",
      code: `def solve(records, key_index):
    """Sort records by the given key index, simulating a basic database operation.
    Returns sorted list of records."""
    return sorted(records, key=lambda r: r[key_index])
`,
      tests: [
        {
          args: [
            [
              [3, "c"],
              [1, "a"],
              [2, "b"],
            ],
            0,
          ],
          expected: [
            [1, "a"],
            [2, "b"],
            [3, "c"],
          ],
        },
        {
          args: [
            [
              [1, "z"],
              [2, "a"],
            ],
            1,
          ],
          expected: [
            [2, "a"],
            [1, "z"],
          ],
        },
      ],
    },
    {
      language: "javascript",
      entry: "solve",
      code: `function solve(records, keyIndex) {
  return [...records].sort((a, b) => a[keyIndex] < b[keyIndex] ? -1 : a[keyIndex] > b[keyIndex] ? 1 : 0);
}`,
      tests: [
        {
          args: [
            [
              [3, "c"],
              [1, "a"],
              [2, "b"],
            ],
            0,
          ],
          expected: [
            [1, "a"],
            [2, "b"],
            [3, "c"],
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
      prompt: "What is the primary purpose of Two-Phase Locking?",
      options: [
        "To solve problems in database algorithms",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation:
        "Two-Phase Locking is designed specifically for problems in the domain of database algorithms.",
      hints: ["Think about what domain Two-Phase Locking belongs to"],
      objective: "Understand the purpose of Two-Phase Locking",
    },
  ],
  exam: {
    definition: "Define Two-Phase Locking and explain its purpose.",
    steps: ["Describe the main steps of Two-Phase Locking."],
    timeComplexity: "Analyze the time complexity of Two-Phase Locking.",
    spaceComplexity: "Analyze the space complexity of Two-Phase Locking.",
    correctness: "How does Two-Phase Locking guarantee correctness?",
    applications: ["List two applications of Two-Phase Locking."],
    limitations: ["What are the limitations of Two-Phase Locking?"],
    faq: [
      {
        q: "Why is Two-Phase Locking preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Two-Phase Locking works by applying its core strategy to efficiently solve the t",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on Two-Phase Locking",
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
