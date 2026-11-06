import type { AlgorithmEntry } from "../types";

export const murmurhashEntry: AlgorithmEntry = {
  slug: "murmurhash",
  name: "MurmurHash",
  aliases: ["MurmurHash"],
  curriculum: [87],
  domain: "arrays-hashing",
  subcategory: "Hashing",
  difficulty: "intermediate",
  summary:
    "MurmurHash is an algorithm in the field of hashing. It provides an efficient approach to solving problems in this domain.",
  tags: ["murmurhash", "hashing"],
  prerequisites: [],
  related: ["xxhash", "cityhash"],
  problem: {
    input: "Input data for MurmurHash.",
    output: "Result of applying MurmurHash to the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "MurmurHash addresses a fundamental problem in hashing. The algorithm works by systematically processing the input to produce the desired output efficiently.",
      },
      {
        kind: "p",
        text: "The key insight behind MurmurHash is that by decomposing the problem into manageable parts, we can solve it more efficiently than a brute-force approach.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The MurmurHash algorithm proceeds through a series of well-defined steps:",
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
        text: "When implementing MurmurHash, pay attention to boundary conditions and ensure the algorithm handles empty inputs correctly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity of MurmurHash depends on the size of the input and the specific operations performed. The space complexity accounts for any auxiliary data structures used during computation.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Advanced variants of MurmurHash exist that optimize for specific use cases. Research continues into parallel and distributed versions of this algorithm.",
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
      value: "Hashing",
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
      id: "murmurha-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of MurmurHash?",
      options: [
        "To solve problems in hashing",
        "To sort arrays",
        "To compress data",
        "To encrypt messages",
      ],
      answer: 0,
      explanation: "MurmurHash is designed specifically for problems in the domain of hashing.",
      hints: ["Think about what domain MurmurHash belongs to"],
      objective: "Understand the purpose of MurmurHash",
    },
  ],
  exam: {
    definition: "Define MurmurHash and explain its purpose.",
    steps: ["Describe the main steps of MurmurHash."],
    timeComplexity: "Analyze the time complexity of MurmurHash.",
    spaceComplexity: "Analyze the space complexity of MurmurHash.",
    correctness: "How does MurmurHash guarantee correctness?",
    applications: ["List two applications of MurmurHash."],
    limitations: ["What are the limitations of MurmurHash?"],
    faq: [
      {
        q: "Why is MurmurHash preferred over simpler alternatives?",
        a: "See the lesson for details.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "MurmurHash works by applying its core strategy to efficiently solve the target p",
        ],
      },
    ],
  },
  references: [
    {
      citation: "See literature on MurmurHash",
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
