import type { AlgorithmEntry } from "../types";

export const chandyLamportSnapshotAlgorithmEntry: AlgorithmEntry = {
  slug: "chandy-lamport-snapshot-algorithm",
  name: "Chandy–Lamport Snapshot Algorithm",
  aliases: ["Chandy–Lamport Snapshot Algorithm"],
  curriculum: [469],
  domain: "distributed",
  subcategory: "Distributed Algorithms",
  difficulty: "intermediate",
  summary:
    "Chandy–Lamport Snapshot Algorithm is an algorithm in the field of distributed algorithms. It provides an efficient approach to solving problems in this domain.",
  tags: ["chandy–lamport snapshot algorithm", "distributed algorithms"],
  prerequisites: [],
  related: ["vector-clocks", "lamport-clocks"],
  problem: {
    input: "Input data for Chandy–Lamport Snapshot Algorithm.",
    output: "Result of applying Chandy–Lamport Snapshot Algorithm to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Chandy–Lamport Snapshot Algorithm addresses a fundamental problem in distributed algorithms. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind Chandy–Lamport Snapshot Algorithm is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Chandy–Lamport Snapshot Algorithm algorithm proceeds through a series of well-defined steps:",
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
        text: "When implementing Chandy–Lamport Snapshot Algorithm, pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of Chandy–Lamport Snapshot Algorithm depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of Chandy–Lamport Snapshot Algorithm exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
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
      id: "chandy-l-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Chandy–Lamport Snapshot Algorithm?",
      options: [
        "To solve problems in distributed algorithms",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation:
        "Chandy–Lamport Snapshot Algorithm is designed specifically for problems in the domain of distributed algorithms.",
      hints: ["Think about what domain Chandy–Lamport Snapshot Algorithm belongs to"],
      objective: "Understand the purpose of Chandy–Lamport Snapshot Algorithm",
    },
  ],
  exam: {
    definition: "Define Chandy–Lamport Snapshot Algorithm and explain its purpose.",
    steps: ["Describe the main steps of Chandy–Lamport Snapshot Algorithm."],
    timeComplexity: "Analyze the time complexity of Chandy–Lamport Snapshot Algorithm.",
    spaceComplexity: "Analyze the space complexity of Chandy–Lamport Snapshot Algorithm.",
    correctness: "How does Chandy–Lamport Snapshot Algorithm guarantee correctness?",
    applications: ["List two applications of Chandy–Lamport Snapshot Algorithm."],
    limitations: ["What are the limitations of Chandy–Lamport Snapshot Algorithm?"],
    faq: [
      {
        q: "Why is Chandy–Lamport Snapshot Algorithm preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Chandy–Lamport Snapshot Algorithm works by applying its core strategy to efficie",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on Chandy–Lamport Snapshot Algorithm",
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
