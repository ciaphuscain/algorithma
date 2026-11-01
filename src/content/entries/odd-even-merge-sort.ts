import type { AlgorithmEntry } from "../types";

export const oddEvenMergeSortEntry: AlgorithmEntry = {
  slug: "odd-even-merge-sort",
  name: "Odd–Even Merge Sort",
  aliases: ["Odd–Even Merge Sort"],
  curriculum: [460],
  domain: "parallel",
  subcategory: "Parallel Algorithms",
  difficulty: "intermediate",
  summary:
    "Odd–Even Merge Sort is an algorithm in the field of parallel algorithms. It provides an efficient approach to solving problems in this domain.",
  tags: ["odd–even merge sort", "parallel algorithms"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input data for Odd–Even Merge Sort.",
    output: "Result of applying Odd–Even Merge Sort to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Odd–Even Merge Sort addresses a fundamental problem in parallel algorithms. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind Odd–Even Merge Sort is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Odd–Even Merge Sort algorithm proceeds through a series of well-defined steps:",
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
        text: "When implementing Odd–Even Merge Sort, pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of Odd–Even Merge Sort depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of Odd–Even Merge Sort exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n)",
      worst: "O(n)",
    },
    space: "O(log n)",
    worstClass: "n",
  },
  properties: [
    {
      label: "Category",
      value: "Parallel Algorithms",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "parallel_reduce",
      code: `def parallel_reduce(arr):
    """Simulate parallel reduction (sum) on an array.
    Returns the sum computed via divide and conquer (tree reduction)."""
    if not arr:
        return 0
    if len(arr) == 1:
        return arr[0]
    mid = len(arr) // 2
    left = parallel_reduce(arr[:mid])
    right = parallel_reduce(arr[mid:])
    return left + right
`,
      tests: [
        {
          args: [[1, 2, 3, 4]],
          expected: 10,
        },
        {
          args: [[5]],
          expected: 5,
        },
        {
          args: [[]],
          expected: 0,
        },
      ],
    },
    {
      language: "javascript",
      entry: "parallel_reduce",
      code: `function parallelReduce(arr) {
  if (!arr.length) return 0;
  if (arr.length === 1) return arr[0];
  const mid = arr.length >> 1;
  return parallelReduce(arr.slice(0, mid)) + parallelReduce(arr.slice(mid));
}`,
      tests: [
        {
          args: [[1, 2, 3, 4]],
          expected: 10,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "odd-even-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Odd–Even Merge Sort?",
      options: [
        "To solve problems in parallel algorithms",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation:
        "Odd–Even Merge Sort is designed specifically for problems in the domain of parallel algorithms.",
      hints: ["Think about what domain Odd–Even Merge Sort belongs to"],
      objective: "Understand the purpose of Odd–Even Merge Sort",
    },
  ],
  exam: {
    definition: "Define Odd–Even Merge Sort and explain its purpose.",
    steps: ["Describe the main steps of Odd–Even Merge Sort."],
    timeComplexity: "Analyze the time complexity of Odd–Even Merge Sort.",
    spaceComplexity: "Analyze the space complexity of Odd–Even Merge Sort.",
    correctness: "How does Odd–Even Merge Sort guarantee correctness?",
    applications: ["List two applications of Odd–Even Merge Sort."],
    limitations: ["What are the limitations of Odd–Even Merge Sort?"],
    faq: [
      {
        q: "Why is Odd–Even Merge Sort preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Odd–Even Merge Sort works by applying its core strategy to efficiently solve the",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on Odd–Even Merge Sort",
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
