import type { AlgorithmEntry } from "../types";

export const hammingDistanceEntry: AlgorithmEntry = {
  slug: "hamming-distance",
  name: "Hamming Distance",
  aliases: ["Hamming Distance"],
  curriculum: [332],
  domain: "strings",
  subcategory: "String Metrics",
  difficulty: "beginner",
  summary: "Counts the number of positions where two equal-length strings differ.",
  tags: ["hamming distance", "string distance", "error detection"],
  prerequisites: [],
  related: ["edit-distance", "jaro-similarity"],
  problem: {
    input: "Two strings of equal length.",
    output: "The number of positions where they differ.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Simply count mismatches position by position. Hamming distance tells you the minimum number of character substitutions to transform one string into the other.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Compare characters at each position.",
          "Count the number of positions where they differ.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "A one-line implementation: zip the two strings and count pairs where characters differ.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "$O(n)$ time, $O(1)$ space. The Hamming distance is a metric: satisfies non-negativity, identity, symmetry, and triangle inequality.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "For binary strings, Hamming distance equals the popcount of XOR.",
          "Used in error-correcting codes: a code with minimum Hamming distance d can detect d-1 errors and correct ⌊(d-1)/2⌋ errors.",
          "Hamming weight is the distance from the zero string.",
        ],
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
      label: "Metric",
      value: "Yes",
    },
    {
      label: "Requires",
      value: "Equal-length strings",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "hamming_distance",
      code: `def hamming_distance(a, b):
    if len(a) != len(b):
        raise ValueError("Strings must be equal length")
    return sum(x != y for x, y in zip(a, b))
`,
      tests: [
        {
          args: ["karolin", "kathrin"],
          expected: 3,
        },
        {
          args: ["1011101", "1001001"],
          expected: 2,
        },
        {
          args: ["abc", "abc"],
          expected: 0,
        },
      ],
    },
    {
      language: "javascript",
      entry: "hammingDistance",
      code: `function hammingDistance(a, b) {
  if (a.length !== b.length) throw new Error("Strings must be equal length");
  let d = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d++;
  return d;
}
`,
      tests: [
        {
          args: ["karolin", "kathrin"],
          expected: 3,
        },
        {
          args: ["abc", "abc"],
          expected: 0,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "hamming-q1",
      kind: "mcq",
      prompt: "What is the Hamming distance between '1011' and '1100'?",
      options: ["3", "2", "4", "1"],
      answer: 0,
      explanation: "Positions 1, 2, 3 differ: 0≠1, 1≠0, 1≠0.",
      hints: ["Compare each position."],
      objective: "Calculation",
    },
  ],
  exam: {
    definition: "Hamming distance counts mismatches between equal-length strings.",
    steps: ["Compare each position.", "Count differences."],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(1)$.",
    correctness: "Every position is checked exactly once.",
    applications: ["error-correcting codes", "DNA comparison", "binary similarity"],
    limitations: ["Only works on equal-length strings"],
    faq: [
      {
        q: "How does it relate to error correction?",
        a: "A code with minimum distance d can correct ⌊(d-1)/2⌋ errors.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Define (1).", "Metric properties (2).", "Error correction connection (2)."],
      },
    ],
  },
  references: [
    {
      citation:
        "R. W. Hamming, 'Error Detecting and Error Correcting Codes', Bell System Technical Journal, 1950.",
      supports: "Original paper.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
