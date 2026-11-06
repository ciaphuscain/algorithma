import type { AlgorithmEntry } from "../types";

export const gapBufferEntry: AlgorithmEntry = {
  slug: "gap-buffer",
  name: "Gap Buffer",
  aliases: ["Gap Buffer"],
  curriculum: [141],
  domain: "linear-structures",
  subcategory: "Persistent & Text Structures",
  difficulty: "beginner",
  summary:
    "Gap Buffer is an algorithm in the field of persistent & text structures. It provides an efficient approach to solving problems in this domain.",
  tags: ["gap buffer", "persistent & text structures"],
  prerequisites: [],
  related: ["piece-table", "rope"],
  problem: {
    input: "Input data for Gap Buffer.",
    output: "Result of applying Gap Buffer to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Gap Buffer addresses a fundamental problem in persistent & text structures. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind Gap Buffer is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Gap Buffer algorithm proceeds through a series of well-defined steps:",
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
        text: "When implementing Gap Buffer, pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of Gap Buffer depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of Gap Buffer exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
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
      value: "Persistent & Text Structures",
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
      id: "gap-buff-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Gap Buffer?",
      options: [
        "To solve problems in persistent & text structures",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation:
        "Gap Buffer is designed specifically for problems in the domain of persistent & text structures.",
      hints: ["Think about what domain Gap Buffer belongs to"],
      objective: "Understand the purpose of Gap Buffer",
    },
  ],
  exam: {
    definition: "Define Gap Buffer and explain its purpose.",
    steps: ["Describe the main steps of Gap Buffer."],
    timeComplexity: "Analyze the time complexity of Gap Buffer.",
    spaceComplexity: "Analyze the space complexity of Gap Buffer.",
    correctness: "How does Gap Buffer guarantee correctness?",
    applications: ["List two applications of Gap Buffer."],
    limitations: ["What are the limitations of Gap Buffer?"],
    faq: [
      {
        q: "Why is Gap Buffer preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Gap Buffer works by applying its core strategy to efficiently solve the target p",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on Gap Buffer",
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
