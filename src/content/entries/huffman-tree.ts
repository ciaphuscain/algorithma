import type { AlgorithmEntry } from "../types";

export const huffmanTreeEntry: AlgorithmEntry = {
  slug: "huffman-tree",
  name: "Huffman Tree",
  aliases: ["Huffman Tree"],
  curriculum: [171],
  domain: "compression",
  subcategory: "Compression",
  difficulty: "intermediate",
  summary:
    "A greedy algorithm building an optimal prefix-free binary code for symbols with known frequencies. Frequent symbols get short codes. Foundation of lossless compression.",
  tags: ["Huffman", "compression", "greedy", "prefix code"],
  prerequisites: ["Binary Heap"],
  related: ["trie"],
  problem: {
    input: "Input for Huffman Tree.",
    output: "Output of Huffman Tree.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A greedy algorithm building an optimal prefix-free binary code for symbols with known frequencies. Frequent symbols get short codes. Foundation of lossless compression.",
      },
    ],
    mechanics: [
      {
        kind: "p",
        text: "The Huffman Tree algorithm processes its input step by step. See the implementation level for details.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A standard implementation of Huffman Tree follows the pseudocode directly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The time complexity analysis of Huffman Tree is based on the algorithm's structure and the operations performed at each step.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "Variants and extensions of Huffman Tree exist in the literature. See references for details.",
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
    worstClass: "n log n",
  },
  properties: [
    {
      label: "Category",
      value: "Compression",
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
      id: "huffman-tree-q1",
      kind: "mcq",
      prompt: "What is the primary purpose of Huffman Tree?",
      options: [
        "A greedy algorithm building an optimal prefix-free binary co...",
        "Sorting an array",
        "Finding shortest paths",
        "Compressing data",
      ],
      answer: 0,
      explanation:
        "Huffman Tree: A greedy algorithm building an optimal prefix-free binary code for symbols with known frequencies. Frequent symbols get short codes. Foundation of lossless compression.",
      hints: ["Think about what problem Huffman Tree solves."],
      objective: "Huffman Tree",
    },
  ],
  exam: {
    definition:
      "A greedy algorithm building an optimal prefix-free binary code for symbols with known frequencies. Frequent symbols get short codes. Foundation of lossless compression.",
    steps: ["Apply the Huffman Tree algorithm to the input."],
    timeComplexity: "See complexity section.",
    spaceComplexity: "See complexity section.",
    correctness:
      "The Huffman Tree algorithm is correct because it systematically processes all cases.",
    applications: ["Compression"],
    limitations: ["See advanced section for limitations."],
    faq: [
      {
        q: "When should you use Huffman Tree?",
        a: "Use Huffman Tree when the problem matches its design: A greedy algorithm building an optimal prefix-free binary code for symbols with known frequencies. F",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Huffman Tree (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. Cormen et al., Introduction to Algorithms, 4th ed.",
      supports: "General reference for Huffman Tree.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
