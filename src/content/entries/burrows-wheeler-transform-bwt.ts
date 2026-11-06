import type { AlgorithmEntry } from "../types";

export const burrowsWheelerTransformBwtEntry: AlgorithmEntry = {
  slug: "burrows-wheeler-transform-bwt",
  name: "Burrows-Wheeler Transform (BWT)",
  aliases: ["Burrows-Wheeler Transform", "BWT"],
  curriculum: [335],
  domain: "compression",
  subcategory: "Text Transform",
  difficulty: "intermediate",
  summary:
    "A reversible text transformation that rearranges characters to group similar contexts together, making the output highly compressible by run-length encoding or move-to-front coding.",
  tags: ["BWT", "text transform", "compression", "suffix array"],
  prerequisites: [],
  related: ["move-to-front-transform", "run-length-encoding", "suffix-array"],
  problem: {
    input: "A string s with a unique end-of-string marker $.",
    output: "The last column of the sorted rotation matrix.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Write all rotations of the string, sort them, and take the last column. Characters that appear before similar contexts end up grouped together, creating runs that compress well.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Append a sentinel character ($ or \\0, lexicographically smallest) if not present.",
          "Generate all cyclic rotations of the string.",
          "Sort the rotations lexicographically.",
          "The BWT output is the last column of the sorted matrix.",
          "Also output the row number where the original string appears.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "The naive approach generates all rotations: O(n² log n). Using a suffix array, BWT can be computed in O(n) time.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The BWT is reversible: from the last column and the knowledge of which row is the original, we can reconstruct the string using the LF-mapping. Time O(n) for both transform and inverse.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Used in bzip2: BWT → MTF → RLE → Huffman/arithmetic coding.",
          "The FM-index uses BWT for compressed full-text search.",
          "SA-IS builds the suffix array (and thus BWT) in O(n) time.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n log n)",
      worst: "O(n^2)",
    },
    space: "O(n)",
    worstClass: "n",
  },
  properties: [
    {
      label: "Reversible",
      value: "Yes",
    },
    {
      label: "Used in",
      value: "bzip2, FM-index",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "bwt",
      code: `def bwt(s):
    """Burrows-Wheeler Transform. Returns (transformed string, original row index)."""
    s = s + "$"
    n = len(s)
    rotations = sorted(s[i:] + s[:i] for i in range(n))
    bwt_str = "".join(r[-1] for r in rotations)
    idx = rotations.index(s)
    return [bwt_str, idx]
`,
      tests: [
        {
          args: ["banana"],
          expected: ["annb$aa", 4],
        },
        {
          args: ["abracadabra"],
          expected: ["ard$rcaaaabb", 3],
        },
      ],
    },
    {
      language: "javascript",
      entry: "bwt",
      code: `function bwt(s) {
  s = s + "$";
  const n = s.length;
  const rotations = [];
  for (let i = 0; i < n; i++) rotations.push(s.slice(i) + s.slice(0, i));
  rotations.sort();
  const bwtStr = rotations.map(r => r[r.length - 1]).join("");
  const idx = rotations.indexOf(s);
  return [bwtStr, idx];
}
`,
      tests: [
        {
          args: ["banana"],
          expected: ["annb$aa", 4],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "bwt-q1",
      kind: "mcq",
      prompt: "What is the main purpose of BWT?",
      options: [
        "To group similar characters together for better compression",
        "To encrypt the text",
        "To sort the text",
        "To find patterns",
      ],
      answer: 0,
      explanation:
        "BWT rearranges characters so that similar contexts (and thus similar characters) cluster together.",
      hints: ["Think about what happens before compression."],
      objective: "Purpose",
    },
  ],
  exam: {
    definition:
      "BWT sorts all cyclic rotations and takes the last column, grouping similar contexts.",
    steps: ["Form all rotations.", "Sort lexicographically.", "Take last column."],
    timeComplexity: "Naive $O(n^2 \\log n)$; with suffix array $O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The LF-mapping allows perfect reconstruction from the last column.",
    applications: ["bzip2", "FM-index", "bioinformatics"],
    limitations: ["Requires random access for inverse; streaming is harder"],
    faq: [
      {
        q: "How is BWT reversed?",
        a: "Using the first column (sorted last column) and the LF-mapping to reconstruct each character.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Rotation matrix concept (1).",
          "Forward transform (2).",
          "Inverse via LF-mapping (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "M. Burrows and D. J. Wheeler, 'A Block-Sorting Lossless Data Compression Algorithm', DEC SRC Research Report 124, 1994.",
      supports: "Original paper.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
