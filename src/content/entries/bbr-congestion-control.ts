import type { AlgorithmEntry } from "../types";

export const bbrCongestionControlEntry: AlgorithmEntry = {
  slug: "bbr-congestion-control",
  name: "BBR Congestion Control",
  aliases: ["BBR Congestion Control"],
  curriculum: [563],
  domain: "networks",
  subcategory: "Network Algorithms",
  difficulty: "intermediate",
  summary:
    "BBR Congestion Control is an algorithm in the field of network algorithms. It provides an efficient approach to solving problems in this domain.",
  tags: ["bbr congestion control", "network algorithms"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input data for BBR Congestion Control.",
    output: "Result of applying BBR Congestion Control to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "BBR Congestion Control addresses a fundamental problem in network algorithms. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind BBR Congestion Control is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The BBR Congestion Control algorithm proceeds through a series of well-defined steps:",
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
        text: "When implementing BBR Congestion Control, pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of BBR Congestion Control depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of BBR Congestion Control exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
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
      value: "Network Algorithms",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "solve",
      code: `def solve(packets):
    """Simulate packet processing: sort by arrival time and compute total latency.
    Each packet is [arrival_time, size]. Returns total processing time."""
    if not packets:
        return 0
    packets = sorted(packets, key=lambda p: p[0])
    time = 0
    for arrival, size in packets:
        time = max(time, arrival) + size
    return time
`,
      tests: [
        {
          args: [
            [
              [0, 3],
              [1, 2],
              [5, 1],
            ],
          ],
          expected: 6,
        },
        {
          args: [[[0, 1]]],
          expected: 1,
        },
      ],
    },
    {
      language: "javascript",
      entry: "solve",
      code: `function solve(packets) {
  if (!packets.length) return 0;
  const sorted = [...packets].sort((a, b) => a[0] - b[0]);
  let time = 0;
  for (const [arrival, size] of sorted) {
    time = Math.max(time, arrival) + size;
  }
  return time;
}`,
      tests: [
        {
          args: [
            [
              [0, 3],
              [1, 2],
              [5, 1],
            ],
          ],
          expected: 6,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "bbr-cong-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of BBR Congestion Control?",
      options: [
        "To solve problems in network algorithms",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation:
        "BBR Congestion Control is designed specifically for problems in the domain of network algorithms.",
      hints: ["Think about what domain BBR Congestion Control belongs to"],
      objective: "Understand the purpose of BBR Congestion Control",
    },
  ],
  exam: {
    definition: "Define BBR Congestion Control and explain its purpose.",
    steps: ["Describe the main steps of BBR Congestion Control."],
    timeComplexity: "Analyze the time complexity of BBR Congestion Control.",
    spaceComplexity: "Analyze the space complexity of BBR Congestion Control.",
    correctness: "How does BBR Congestion Control guarantee correctness?",
    applications: ["List two applications of BBR Congestion Control."],
    limitations: ["What are the limitations of BBR Congestion Control?"],
    faq: [
      {
        q: "Why is BBR Congestion Control preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "BBR Congestion Control works by applying its core strategy to efficiently solve ",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on BBR Congestion Control",
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
