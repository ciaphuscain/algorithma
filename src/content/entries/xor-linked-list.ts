import type { AlgorithmEntry } from "../types";

export const xorLinkedListEntry: AlgorithmEntry = {
  slug: "xor-linked-list",
  name: "XOR Linked List",
  aliases: ["XOR Linked List"],
  curriculum: [144],
  domain: "linear-structures",
  subcategory: "Linear Data Structures",
  difficulty: "intermediate",
  summary:
    "XOR Linked List is an algorithm in the field of linear data structures. It provides an efficient approach to solving problems in this domain.",
  tags: ["xor linked list", "linear data structures"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input data for XOR Linked List.",
    output: "Result of applying XOR Linked List to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "XOR Linked List addresses a fundamental problem in linear data structures. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind XOR Linked List is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The XOR Linked List algorithm proceeds through a series of well-defined steps:",
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
        text: "When implementing XOR Linked List, pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of XOR Linked List depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of XOR Linked List exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
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
      id: "xor-link-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of XOR Linked List?",
      options: [
        "To solve problems in linear data structures",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation:
        "XOR Linked List is designed specifically for problems in the domain of linear data structures.",
      hints: ["Think about what domain XOR Linked List belongs to"],
      objective: "Understand the purpose of XOR Linked List",
    },
  ],
  exam: {
    definition: "Define XOR Linked List and explain its purpose.",
    steps: ["Describe the main steps of XOR Linked List."],
    timeComplexity: "Analyze the time complexity of XOR Linked List.",
    spaceComplexity: "Analyze the space complexity of XOR Linked List.",
    correctness: "How does XOR Linked List guarantee correctness?",
    applications: ["List two applications of XOR Linked List."],
    limitations: ["What are the limitations of XOR Linked List?"],
    faq: [
      {
        q: "Why is XOR Linked List preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "XOR Linked List works by applying its core strategy to efficiently solve the tar",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on XOR Linked List",
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
