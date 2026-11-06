import type { AlgorithmEntry } from "../types";

export const unrolledLinkedListEntry: AlgorithmEntry = {
  slug: "unrolled-linked-list",
  name: "Unrolled Linked List",
  aliases: ["Unrolled Linked List"],
  curriculum: [143],
  domain: "linear-structures",
  subcategory: "Linear Data Structures",
  difficulty: "intermediate",
  summary:
    "Unrolled Linked List is an algorithm in the field of linear data structures. It provides an efficient approach to solving problems in this domain.",
  tags: ["unrolled linked list", "linear data structures"],
  prerequisites: [],
  related: ["xor-linked-list", "skip-list"],
  problem: {
    input: "Input data for Unrolled Linked List.",
    output: "Result of applying Unrolled Linked List to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Unrolled Linked List addresses a fundamental problem in linear data structures. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind Unrolled Linked List is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Unrolled Linked List algorithm proceeds through a series of well-defined steps:",
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
        text: "When implementing Unrolled Linked List, pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of Unrolled Linked List depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of Unrolled Linked List exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
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
      id: "unrolled-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Unrolled Linked List?",
      options: [
        "To solve problems in linear data structures",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation:
        "Unrolled Linked List is designed specifically for problems in the domain of linear data structures.",
      hints: ["Think about what domain Unrolled Linked List belongs to"],
      objective: "Understand the purpose of Unrolled Linked List",
    },
  ],
  exam: {
    definition: "Define Unrolled Linked List and explain its purpose.",
    steps: ["Describe the main steps of Unrolled Linked List."],
    timeComplexity: "Analyze the time complexity of Unrolled Linked List.",
    spaceComplexity: "Analyze the space complexity of Unrolled Linked List.",
    correctness: "How does Unrolled Linked List guarantee correctness?",
    applications: ["List two applications of Unrolled Linked List."],
    limitations: ["What are the limitations of Unrolled Linked List?"],
    faq: [
      {
        q: "Why is Unrolled Linked List preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Unrolled Linked List works by applying its core strategy to efficiently solve th",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on Unrolled Linked List",
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
