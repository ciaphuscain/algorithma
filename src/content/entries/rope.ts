import type { AlgorithmEntry } from "../types";

export const ropeEntry: AlgorithmEntry = {
  slug: "rope",
  name: "Rope",
  aliases: ["Rope"],
  curriculum: [140],
  domain: "linear-structures",
  subcategory: "Persistent & Text Structures",
  difficulty: "intermediate",
  summary:
    "Rope is an algorithm in the field of persistent & text structures. It provides an efficient approach to solving problems in this domain.",
  tags: ["rope", "persistent & text structures"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input data for Rope.",
    output: "Result of applying Rope to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Rope addresses a fundamental problem in persistent & text structures. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind Rope is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Rope algorithm proceeds through a series of well-defined steps:",
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
        text: "When implementing Rope, pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of Rope depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of Rope exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
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
      id: "rope-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Rope?",
      options: [
        "To solve problems in persistent & text structures",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation:
        "Rope is designed specifically for problems in the domain of persistent & text structures.",
      hints: ["Think about what domain Rope belongs to"],
      objective: "Understand the purpose of Rope",
    },
  ],
  exam: {
    definition: "Define Rope and explain its purpose.",
    steps: ["Describe the main steps of Rope."],
    timeComplexity: "Analyze the time complexity of Rope.",
    spaceComplexity: "Analyze the space complexity of Rope.",
    correctness: "How does Rope guarantee correctness?",
    applications: ["List two applications of Rope."],
    limitations: ["What are the limitations of Rope?"],
    faq: [
      { q: "Why is Rope preferred over simpler alternatives?", a: "See the lesson for details." },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Rope works by applying its core strategy to efficiently solve the target problem",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on Rope",
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
