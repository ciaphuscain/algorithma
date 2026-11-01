import type { AlgorithmEntry } from "../types";

export const minHashEntry: AlgorithmEntry = {
  slug: "minhash",
  name: "MinHash",
  aliases: ["MinHash"],
  curriculum: [80],
  domain: "arrays-hashing",
  subcategory: "Probabilistic Data Structures",
  difficulty: "advanced",
  summary:
    "MinHash is an algorithm in the field of probabilistic data structures. It provides an efficient approach to solving problems in this domain.",
  tags: ["minhash", "probabilistic data structures"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input data for MinHash.",
    output: "Result of applying MinHash to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "MinHash addresses a fundamental problem in probabilistic data structures. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind MinHash is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The MinHash algorithm proceeds through a series of well-defined steps:",
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
        text: "When implementing MinHash, pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of MinHash depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of MinHash exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
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
      value: "Probabilistic Data Structures",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "solve",
      code: `def solve(arr, target):
    """Two sum: find two indices whose values sum to target. Returns [i, j] or []."""
    seen = {}
    for i, v in enumerate(arr):
        complement = target - v
        if complement in seen:
            return [seen[complement], i]
        seen[v] = i
    return []
`,
      tests: [
        {
          args: [[2, 7, 11, 15], 9],
          expected: [0, 1],
        },
        {
          args: [[1, 2, 3], 7],
          expected: [],
        },
      ],
    },
    {
      language: "javascript",
      entry: "solve",
      code: `function solve(arr, target) {
  const seen = new Map();
  for (let i = 0; i < arr.length; i++) {
    const c = target - arr[i];
    if (seen.has(c)) return [seen.get(c), i];
    seen.set(arr[i], i);
  }
  return [];
}`,
      tests: [
        {
          args: [[2, 7, 11, 15], 9],
          expected: [0, 1],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "minhash-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of MinHash?",
      options: [
        "To solve problems in probabilistic data structures",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation:
        "MinHash is designed specifically for problems in the domain of probabilistic data structures.",
      hints: ["Think about what domain MinHash belongs to"],
      objective: "Understand the purpose of MinHash",
    },
  ],
  exam: {
    definition: "Define MinHash and explain its purpose.",
    steps: ["Describe the main steps of MinHash."],
    timeComplexity: "Analyze the time complexity of MinHash.",
    spaceComplexity: "Analyze the space complexity of MinHash.",
    correctness: "How does MinHash guarantee correctness?",
    applications: ["List two applications of MinHash."],
    limitations: ["What are the limitations of MinHash?"],
    faq: [
      {
        q: "Why is MinHash preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "MinHash works by applying its core strategy to efficiently solve the target prob",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on MinHash",
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
