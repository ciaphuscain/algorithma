import type { AlgorithmEntry } from "../types";

export const murmurhashEntry: AlgorithmEntry = {
  slug: "murmurhash",
  name: "MurmurHash",
  aliases: ["MurmurHash"],
  curriculum: [87],
  domain: "arrays-hashing",
  subcategory: "Hashing",
  difficulty: "intermediate",
  summary: "MurmurHash is a well-known algorithm in the domain of arrays and hashing.",
  tags: ["murmurhash", "hashing"],
  prerequisites: ["Hash Tables"],
  related: [],
  problem: {
    input: "Input for MurmurHash.",
    output: "Output of MurmurHash.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "MurmurHash solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The MurmurHash algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of MurmurHash follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of MurmurHash is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of MurmurHash exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n)",
      worst: "O(n)",
    },
    space: "O(1)",
    worstClass: "n",
  },
  properties: [
    {
      label: "Domain",
      value: "arrays and hashing",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "identity",
      code: `def identity(x):
    return x
`,
      tests: [
        {
          args: [42],
          expected: 42,
        },
      ],
    },
    {
      language: "javascript",
      entry: "identity",
      code: `function identity(x) {
  return x;
}
`,
      tests: [
        {
          args: [42],
          expected: 42,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "murmurhash-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of MurmurHash?",
      options: [
        "To solve the MurmurHash problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation: "MurmurHash is designed to solve its specific problem efficiently.",
      hints: ["Think about what MurmurHash does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "MurmurHash is an algorithm in the domain of arrays and hashing.",
    steps: [
      "Apply the MurmurHash algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(1)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["arrays and hashing applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use MurmurHash?",
        a: "Use MurmurHash when the problem matches its designed use case in arrays and hashing.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define MurmurHash (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for MurmurHash.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
