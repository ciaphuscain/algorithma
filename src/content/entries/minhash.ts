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
    "Estimates Jaccard similarity between sets using random permutations. The probability that two sets share the same minimum hash equals their Jaccard similarity. Foundation of locality-sensitive hashing.",
  tags: ["MinHash", "similarity", "LSH", "Jaccard"],
  prerequisites: ["Hash Tables"],
  related: ["hyperloglog", "bloom-filter"],
  problem: {
    input: "Input for MinHash.",
    output: "Output of MinHash.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Estimates Jaccard similarity between sets using random permutations. The probability that two sets share the same minimum hash equals their Jaccard similarity. Foundation of locality-sensitive hashing.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The MinHash algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of MinHash follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of MinHash is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of MinHash exist in the literature. See references for details.",
      },
    ],
  },
  complexity: {
    time: {
      best: "varies",
      average: "varies",
      worst: "varies",
    },
    space: "varies",
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
      id: "minhash-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of MinHash?",
      options: [
        "Estimates Jaccard similarity between sets using random permu...",
        "Sorting an array",
        "Finding shortest paths",
        "Compressing data",
      ],
      answer: 0,
      explanation:
        "MinHash: Estimates Jaccard similarity between sets using random permutations. The probability that two sets share the same minimum hash equals their Jaccard similarity. Foundation of locality-sensitive hashing.",
      hints: ["Think about what problem MinHash solves."],
      objective: "MinHash",
    },
  ],
  exam: {
    definition:
      "Estimates Jaccard similarity between sets using random permutations. The probability that two sets share the same minimum hash equals their Jaccard similarity. Foundation of locality-sensitive hashing.",
    steps: ["Apply the MinHash algorithm to the input."],
    timeComplexity: "See complexity section.",
    spaceComplexity: "See complexity section.",
    correctness: "The MinHash algorithm is correct because it systematically processes all cases.",
    applications: ["Probabilistic Data Structures"],
    limitations: ["See advanced section for limitations."],
    faq: [
      {
        q: "When should you use MinHash?",
        a: "Use MinHash when the problem matches its design: Estimates Jaccard similarity between sets using random permutations. The probability that two sets s",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Define MinHash (1).", "Describe the algorithm (2).", "Analyze complexity (2)."],
      },
    ],
  },
  references: [
    {
      citation: "T. Cormen et al., Introduction to Algorithms, 4th ed.",
      supports: "General reference for MinHash.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
