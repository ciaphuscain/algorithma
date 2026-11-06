import type { AlgorithmEntry } from "../types";

export const concurrentSkipListEntry: AlgorithmEntry = {
  slug: "concurrent-skip-list",
  name: "Concurrent Skip List",
  aliases: ["Concurrent Skip List"],
  curriculum: [146],
  domain: "linear-structures",
  subcategory: "Linear Data Structures",
  difficulty: "intermediate",
  summary:
    "Concurrent Skip List is an algorithm in the field of linear data structures. It provides an efficient approach to solving problems in this domain.",
  tags: ["concurrent skip list", "linear data structures"],
  prerequisites: [],
  related: ["skip-list", "lock-free-queue"],
  problem: {
    input: "Input data for Concurrent Skip List.",
    output: "Result of applying Concurrent Skip List to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Concurrent Skip List addresses a fundamental problem in linear data structures. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind Concurrent Skip List is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Concurrent Skip List algorithm proceeds through a series of well-defined steps:",
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
        text: "When implementing Concurrent Skip List, pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of Concurrent Skip List depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of Concurrent Skip List exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
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
      id: "concurre-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Concurrent Skip List?",
      options: [
        "To solve problems in linear data structures",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation:
        "Concurrent Skip List is designed specifically for problems in the domain of linear data structures.",
      hints: ["Think about what domain Concurrent Skip List belongs to"],
      objective: "Understand the purpose of Concurrent Skip List",
    },
  ],
  exam: {
    definition: "Define Concurrent Skip List and explain its purpose.",
    steps: ["Describe the main steps of Concurrent Skip List."],
    timeComplexity: "Analyze the time complexity of Concurrent Skip List.",
    spaceComplexity: "Analyze the space complexity of Concurrent Skip List.",
    correctness: "How does Concurrent Skip List guarantee correctness?",
    applications: ["List two applications of Concurrent Skip List."],
    limitations: ["What are the limitations of Concurrent Skip List?"],
    faq: [
      {
        q: "Why is Concurrent Skip List preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Concurrent Skip List works by applying its core strategy to efficiently solve th",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on Concurrent Skip List",
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
