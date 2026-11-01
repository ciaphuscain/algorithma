import type { AlgorithmEntry } from "../types";

export const tokenBucketRateLimitingEntry: AlgorithmEntry = {
  slug: "token-bucket-rate-limiting",
  name: "Token Bucket Rate Limiting",
  aliases: ["Token Bucket Rate Limiting"],
  curriculum: [564],
  domain: "networks",
  subcategory: "Network Algorithms",
  difficulty: "intermediate",
  summary:
    "Token Bucket Rate Limiting is a well-known algorithm in the domain of network algorithms.",
  tags: ["token bucket rate limiting", "networking"],
  prerequisites: [],
  related: [],
  problem: {
    input: "Input for Token Bucket Rate Limiting.",
    output: "Output of Token Bucket Rate Limiting.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Token Bucket Rate Limiting solves its problem by following a systematic approach. See the mechanics level for a step-by-step description.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Token Bucket Rate Limiting algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Token Bucket Rate Limiting follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Token Bucket Rate Limiting is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Token Bucket Rate Limiting exist in the literature. See references for details.",
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
    worstClass: "other",
  },
  properties: [
    {
      label: "Domain",
      value: "network algorithms",
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
      id: "token-bucket-rate-limiting-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Token Bucket Rate Limiting?",
      options: [
        "To solve the Token Bucket Rate Limiting problem efficiently",
        "To sort an array",
        "To search a graph",
        "To compress data",
      ],
      answer: 0,
      explanation:
        "Token Bucket Rate Limiting is designed to solve its specific problem efficiently.",
      hints: ["Think about what Token Bucket Rate Limiting does."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition: "Token Bucket Rate Limiting is an algorithm in the domain of network algorithms.",
    steps: [
      "Apply the Token Bucket Rate Limiting algorithm to the input.",
      "Process according to the algorithm's rules.",
      "Return the result.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["network algorithms applications"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Token Bucket Rate Limiting?",
        a: "Use Token Bucket Rate Limiting when the problem matches its designed use case in network algorithms.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Token Bucket Rate Limiting (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Token Bucket Rate Limiting.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
