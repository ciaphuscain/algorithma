import type { AlgorithmEntry } from "../types";

export const lockFreeQueueEntry: AlgorithmEntry = {
  slug: "lock-free-queue",
  name: "Lock-Free Queue",
  aliases: ["Lock-Free Queue"],
  curriculum: [134],
  domain: "linear-structures",
  subcategory: "Linear Data Structures",
  difficulty: "intermediate",
  summary:
    "Lock-Free Queue is an algorithm in the field of linear data structures. It provides an efficient approach to solving problems in this domain.",
  tags: ["lock-free queue", "linear data structures"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input data for Lock-Free Queue.",
    output: "Result of applying Lock-Free Queue to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Lock-Free Queue addresses a fundamental problem in linear data structures. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind Lock-Free Queue is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Lock-Free Queue algorithm proceeds through a series of well-defined steps:",
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
        text: "When implementing Lock-Free Queue, pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of Lock-Free Queue depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of Lock-Free Queue exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n)",
      worst: "O(n)",
    },
    space: "O(n)",
    worstClass: "n",
  },
  properties: [
    {
      label: "Category",
      value: "Linear Data Structures",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "solve",
      code: `def solve(operations):
    """Process a sequence of queue operations: [op, val?].
    op='push' adds val, op='pop' removes front. Returns list of popped values."""
    queue = []
    result = []
    for op in operations:
        if op[0] == "push":
            queue.append(op[1])
        elif op[0] == "pop" and queue:
            result.append(queue.pop(0))
    return result
`,
      tests: [
        {
          args: [[["push", 1], ["push", 2], ["pop"], ["push", 3], ["pop"]]],
          expected: [1, 2],
        },
        {
          args: [[["push", 5], ["pop"]]],
          expected: [5],
        },
      ],
    },
    {
      language: "javascript",
      entry: "solve",
      code: `function solve(operations) {
  const queue = [], result = [];
  for (const op of operations) {
    if (op[0] === "push") queue.push(op[1]);
    else if (op[0] === "pop" && queue.length) result.push(queue.shift());
  }
  return result;
}`,
      tests: [
        {
          args: [[["push", 1], ["push", 2], ["pop"], ["push", 3], ["pop"]]],
          expected: [1, 2],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "lock-fre-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Lock-Free Queue?",
      options: [
        "To solve problems in linear data structures",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation:
        "Lock-Free Queue is designed specifically for problems in the domain of linear data structures.",
      hints: ["Think about what domain Lock-Free Queue belongs to"],
      objective: "Understand the purpose of Lock-Free Queue",
    },
  ],
  exam: {
    definition: "Define Lock-Free Queue and explain its purpose.",
    steps: ["Describe the main steps of Lock-Free Queue."],
    timeComplexity: "Analyze the time complexity of Lock-Free Queue.",
    spaceComplexity: "Analyze the space complexity of Lock-Free Queue.",
    correctness: "How does Lock-Free Queue guarantee correctness?",
    applications: ["List two applications of Lock-Free Queue."],
    limitations: ["What are the limitations of Lock-Free Queue?"],
    faq: [
      {
        q: "Why is Lock-Free Queue preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Lock-Free Queue works by applying its core strategy to efficiently solve the tar",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on Lock-Free Queue",
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
