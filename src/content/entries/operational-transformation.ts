import type { AlgorithmEntry } from "../types";

export const operationalTransformationEntry: AlgorithmEntry = {
  slug: "operational-transformation",
  name: "Operational Transformation",
  aliases: ["Operational Transformation"],
  curriculum: [554],
  domain: "distributed",
  subcategory: "Distributed Algorithms",
  difficulty: "intermediate",
  summary:
    "Operational Transformation is an algorithm in the field of distributed algorithms. It provides an efficient approach to solving problems in this domain.",
  tags: ["operational transformation", "distributed algorithms"],
  prerequisites: [],
  related: ["crdts-g-counter-or-set-rga", "rope"],
  problem: {
    input: "Input data for Operational Transformation.",
    output: "Result of applying Operational Transformation to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Operational Transformation addresses a fundamental problem in distributed algorithms. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind Operational Transformation is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Operational Transformation algorithm proceeds through a series of well-defined steps:",
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
        text: "When implementing Operational Transformation, pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of Operational Transformation depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of Operational Transformation exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
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
      id: "operatio-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Operational Transformation?",
      options: [
        "To solve problems in distributed algorithms",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation:
        "Operational Transformation is designed specifically for problems in the domain of distributed algorithms.",
      hints: ["Think about what domain Operational Transformation belongs to"],
      objective: "Understand the purpose of Operational Transformation",
    },
  ],
  exam: {
    definition: "Define Operational Transformation and explain its purpose.",
    steps: ["Describe the main steps of Operational Transformation."],
    timeComplexity: "Analyze the time complexity of Operational Transformation.",
    spaceComplexity: "Analyze the space complexity of Operational Transformation.",
    correctness: "How does Operational Transformation guarantee correctness?",
    applications: ["List two applications of Operational Transformation."],
    limitations: ["What are the limitations of Operational Transformation?"],
    faq: [
      {
        q: "Why is Operational Transformation preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Operational Transformation works by applying its core strategy to efficiently so",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on Operational Transformation",
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
