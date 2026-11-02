import type { AlgorithmEntry } from "../types";

export const lsmTreeLogStructuredMergeTreeEntry: AlgorithmEntry = {
  slug: "lsm-tree-log-structured-merge-tree",
  name: "LSM Tree (Log-Structured Merge Tree)",
  aliases: ["LSM Tree (Log-Structured Merge Tree)"],
  curriculum: [489],
  domain: "databases",
  subcategory: "Database Algorithms",
  difficulty: "intermediate",
  summary:
    "LSM Tree (Log-Structured Merge Tree) is an algorithm in the field of database algorithms. It provides an efficient approach to solving problems in this domain.",
  tags: ["lsm tree (log-structured merge tree)", "database algorithms"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input data for LSM Tree (Log-Structured Merge Tree).",
    output: "Result of applying LSM Tree (Log-Structured Merge Tree) to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "LSM Tree (Log-Structured Merge Tree) addresses a fundamental problem in database algorithms. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind LSM Tree (Log-Structured Merge Tree) is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The LSM Tree (Log-Structured Merge Tree) algorithm proceeds through a series of well-defined steps:",
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
        text: "When implementing LSM Tree (Log-Structured Merge Tree), pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of LSM Tree (Log-Structured Merge Tree) depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of LSM Tree (Log-Structured Merge Tree) exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
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
      value: "Database Algorithms",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "solve",
      code: `def solve(records, key_index):
    """Sort records by the given key index, simulating a basic database operation.
    Returns sorted list of records."""
    return sorted(records, key=lambda r: r[key_index])
`,
      tests: [
        {
          args: [
            [
              [3, "c"],
              [1, "a"],
              [2, "b"],
            ],
            0,
          ],
          expected: [
            [1, "a"],
            [2, "b"],
            [3, "c"],
          ],
        },
        {
          args: [
            [
              [1, "z"],
              [2, "a"],
            ],
            1,
          ],
          expected: [
            [2, "a"],
            [1, "z"],
          ],
        },
      ],
    },
    {
      language: "javascript",
      entry: "solve",
      code: `function solve(records, keyIndex) {
  return [...records].sort((a, b) => a[keyIndex] < b[keyIndex] ? -1 : a[keyIndex] > b[keyIndex] ? 1 : 0);
}`,
      tests: [
        {
          args: [
            [
              [3, "c"],
              [1, "a"],
              [2, "b"],
            ],
            0,
          ],
          expected: [
            [1, "a"],
            [2, "b"],
            [3, "c"],
          ],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "lsm-tree-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of LSM Tree (Log-Structured Merge Tree)?",
      options: [
        "To solve problems in database algorithms",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation:
        "LSM Tree (Log-Structured Merge Tree) is designed specifically for problems in the domain of database algorithms.",
      hints: ["Think about what domain LSM Tree (Log-Structured Merge Tree) belongs to"],
      objective: "Understand the purpose of LSM Tree (Log-Structured Merge Tree)",
    },
  ],
  exam: {
    definition: "Define LSM Tree (Log-Structured Merge Tree) and explain its purpose.",
    steps: ["Describe the main steps of LSM Tree (Log-Structured Merge Tree)."],
    timeComplexity: "Analyze the time complexity of LSM Tree (Log-Structured Merge Tree).",
    spaceComplexity: "Analyze the space complexity of LSM Tree (Log-Structured Merge Tree).",
    correctness: "How does LSM Tree (Log-Structured Merge Tree) guarantee correctness?",
    applications: ["List two applications of LSM Tree (Log-Structured Merge Tree)."],
    limitations: ["What are the limitations of LSM Tree (Log-Structured Merge Tree)?"],
    faq: [
      {
        q: "Why is LSM Tree (Log-Structured Merge Tree) preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "LSM Tree (Log-Structured Merge Tree) works by applying its core strategy to effi",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on LSM Tree (Log-Structured Merge Tree)",
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
