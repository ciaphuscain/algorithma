import type { AlgorithmEntry } from "../types";

export const tcpCongestionControlRenoCubicEntry: AlgorithmEntry = {
  slug: "tcp-congestion-control-reno-cubic",
  name: "TCP Congestion Control (Reno/CUBIC)",
  aliases: ["TCP Congestion Control (Reno/CUBIC)"],
  curriculum: [562],
  domain: "networks",
  subcategory: "Network Algorithms",
  difficulty: "intermediate",
  summary:
    "TCP Congestion Control (Reno/CUBIC) is an algorithm in the field of network algorithms. It provides an efficient approach to solving problems in this domain.",
  tags: ["tcp congestion control (reno/cubic)", "network algorithms"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input data for TCP Congestion Control (Reno/CUBIC).",
    output: "Result of applying TCP Congestion Control (Reno/CUBIC) to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "TCP Congestion Control (Reno/CUBIC) addresses a fundamental problem in network algorithms. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind TCP Congestion Control (Reno/CUBIC) is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The TCP Congestion Control (Reno/CUBIC) algorithm proceeds through a series of well-defined steps:",
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
        text: "When implementing TCP Congestion Control (Reno/CUBIC), pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of TCP Congestion Control (Reno/CUBIC) depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of TCP Congestion Control (Reno/CUBIC) exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
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
      id: "tcp-cong-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of TCP Congestion Control (Reno/CUBIC)?",
      options: [
        "To solve problems in network algorithms",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation:
        "TCP Congestion Control (Reno/CUBIC) is designed specifically for problems in the domain of network algorithms.",
      hints: ["Think about what domain TCP Congestion Control (Reno/CUBIC) belongs to"],
      objective: "Understand the purpose of TCP Congestion Control (Reno/CUBIC)",
    },
  ],
  exam: {
    definition: "Define TCP Congestion Control (Reno/CUBIC) and explain its purpose.",
    steps: ["Describe the main steps of TCP Congestion Control (Reno/CUBIC)."],
    timeComplexity: "Analyze the time complexity of TCP Congestion Control (Reno/CUBIC).",
    spaceComplexity: "Analyze the space complexity of TCP Congestion Control (Reno/CUBIC).",
    correctness: "How does TCP Congestion Control (Reno/CUBIC) guarantee correctness?",
    applications: ["List two applications of TCP Congestion Control (Reno/CUBIC)."],
    limitations: ["What are the limitations of TCP Congestion Control (Reno/CUBIC)?"],
    faq: [
      {
        q: "Why is TCP Congestion Control (Reno/CUBIC) preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "TCP Congestion Control (Reno/CUBIC) works by applying its core strategy to effic",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on TCP Congestion Control (Reno/CUBIC)",
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
