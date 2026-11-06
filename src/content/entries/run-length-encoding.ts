import type { AlgorithmEntry } from "../types";

export const runLengthEncodingEntry: AlgorithmEntry = {
  slug: "run-length-encoding",
  name: "Run-Length Encoding",
  aliases: ["Run-Length Encoding", "RLE"],
  curriculum: [337],
  domain: "compression",
  subcategory: "Lossless Compression",
  difficulty: "beginner",
  summary:
    "Compresses data by replacing consecutive runs of the same value with (value, count) pairs.",
  tags: ["compression", "lossless", "run length", "RLE"],
  prerequisites: [],
  related: ["burrows-wheeler-transform-bwt", "move-to-front-transform"],
  problem: {
    input: "A string or sequence of values.",
    output: "A list of (value, count) pairs representing consecutive runs.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "If you have 'AAABBBCC', instead of storing 8 characters, store 'A3B3C2' (6 characters). Works well when the input has long runs of repeated values.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Scan left to right.",
          "Count consecutive identical characters.",
          "Output each character and its count.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Simple linear scan. For decoding, expand each (value, count) pair back into the repeated characters.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "$O(n)$ time for both encoding and decoding. Best case: entire input is one character → O(1) output. Worst case: alternating characters → output is 2n (expansion).",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Used as a post-processing step after BWT in bzip2.",
          "Effective for bitmap images, fax transmission, and PCX format.",
          "PackBits variant handles both runs and literal sequences.",
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
    space: "O(n)",
    worstClass: "n",
  },
  properties: [
    {
      label: "Type",
      value: "Lossless",
    },
    {
      label: "Best for",
      value: "Data with long runs",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "rle_encode",
      code: `def rle_encode(s):
    """Run-length encode a string. Returns list of [char, count] pairs."""
    if not s: return []
    result = []
    count = 1
    for i in range(1, len(s)):
        if s[i] == s[i-1]:
            count += 1
        else:
            result.append([s[i-1], count])
            count = 1
    result.append([s[-1], count])
    return result
`,
      tests: [
        {
          args: ["AAABBBCC"],
          expected: [
            ["A", 3],
            ["B", 3],
            ["C", 2],
          ],
        },
        {
          args: ["ABC"],
          expected: [
            ["A", 1],
            ["B", 1],
            ["C", 1],
          ],
        },
        {
          args: ["AAAAAA"],
          expected: [["A", 6]],
        },
      ],
    },
    {
      language: "javascript",
      entry: "rleEncode",
      code: `function rleEncode(s) {
  if (!s) return [];
  const result = [];
  let count = 1;
  for (let i = 1; i < s.length; i++) {
    if (s[i] === s[i-1]) count++;
    else { result.push([s[i-1], count]); count = 1; }
  }
  result.push([s[s.length-1], count]);
  return result;
}
`,
      tests: [
        {
          args: ["AAABBBCC"],
          expected: [
            ["A", 3],
            ["B", 3],
            ["C", 2],
          ],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "rle-q1",
      kind: "mcq",
      prompt: "When does RLE expand the data instead of compressing it?",
      options: [
        "When there are no consecutive repeated characters",
        "Never",
        "When the data is random",
        "When the data is sorted",
      ],
      answer: 0,
      explanation: "With no runs, each character becomes (char, 1), doubling the output.",
      hints: ["Think about alternating characters."],
      objective: "Worst case",
    },
  ],
  exam: {
    definition: "RLE replaces runs of identical values with (value, count) pairs.",
    steps: ["Scan input.", "Count consecutive identical values.", "Output (value, count) pairs."],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "Every run is faithfully represented, and decoding is its exact inverse.",
    applications: ["bitmap compression", "fax", "bzip2 post-BWT step"],
    limitations: ["Can expand data with no runs"],
    faq: [
      {
        q: "Is RLE lossless?",
        a: "Yes, the original data can be perfectly reconstructed.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define RLE (1).",
          "Encode/decode algorithms (2).",
          "Best/worst compression ratio (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "D. Salomon, Data Compression: The Complete Reference, 4th ed., Springer, 2007.",
      supports: "RLE chapter.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
