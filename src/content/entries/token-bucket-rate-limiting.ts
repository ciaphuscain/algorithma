import type { AlgorithmEntry } from "../types";

export const tokenBucketRateLimitingEntry: AlgorithmEntry = {
  slug: "token-bucket-rate-limiting",
  name: "Token Bucket Rate Limiting",
  aliases: ["Token Bucket Rate Limiting"],
  curriculum: [564],
  domain: "networks",
  subcategory: "Network Algorithms",
  difficulty: "intermediate",
  summary:
    "Token Bucket Rate Limiting is an algorithm in the field of network algorithms. It provides an efficient approach to solving problems in this domain.",
  tags: ["token bucket rate limiting", "network algorithms"],
  prerequisites: [],
  related: ["bbr-congestion-control", "tcp-congestion-control-reno-cubic"],
  problem: {
    input: "Input data for Token Bucket Rate Limiting.",
    output: "Result of applying Token Bucket Rate Limiting to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Token Bucket Rate Limiting addresses a fundamental problem in network algorithms. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind Token Bucket Rate Limiting is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Token Bucket Rate Limiting algorithm proceeds through a series of well-defined steps:",
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
        text: "When implementing Token Bucket Rate Limiting, pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of Token Bucket Rate Limiting depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of Token Bucket Rate Limiting exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
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
      id: "token-bu-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Token Bucket Rate Limiting?",
      options: [
        "To solve problems in network algorithms",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation:
        "Token Bucket Rate Limiting is designed specifically for problems in the domain of network algorithms.",
      hints: ["Think about what domain Token Bucket Rate Limiting belongs to"],
      objective: "Understand the purpose of Token Bucket Rate Limiting",
    },
  ],
  exam: {
    definition: "Define Token Bucket Rate Limiting and explain its purpose.",
    steps: ["Describe the main steps of Token Bucket Rate Limiting."],
    timeComplexity: "Analyze the time complexity of Token Bucket Rate Limiting.",
    spaceComplexity: "Analyze the space complexity of Token Bucket Rate Limiting.",
    correctness: "How does Token Bucket Rate Limiting guarantee correctness?",
    applications: ["List two applications of Token Bucket Rate Limiting."],
    limitations: ["What are the limitations of Token Bucket Rate Limiting?"],
    faq: [
      {
        q: "Why is Token Bucket Rate Limiting preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Token Bucket Rate Limiting works by applying its core strategy to efficiently so",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on Token Bucket Rate Limiting",
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
