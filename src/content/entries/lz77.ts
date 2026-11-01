import type { AlgorithmEntry } from "../types";

export const lz77Entry: AlgorithmEntry = {
  slug: "lz77",
  name: "LZ77",
  aliases: ["Lempel-Ziv 77", "LZ1"],
  curriculum: [536],
  domain: "compression",
  subcategory: "Dictionary Compression",
  difficulty: "intermediate",
  summary:
    "Compresses data by replacing repeated sequences with back-references (offset, length) to a sliding window of previously seen data.",
  tags: ["compression", "sliding window", "dictionary"],
  prerequisites: [],
  related: ["lz78", "lzw", "deflate"],
  problem: {
    input: "A byte stream.",
    output: "Sequence of (offset, length, next_char) triples.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Maintain a sliding window of recent data. When the current position matches something in the window, output a back-reference instead of the raw bytes.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Search window: the last W bytes already processed.",
          "Look-ahead buffer: next L bytes to encode.",
          "Find longest match of look-ahead in the window.",
          "Output (offset, length, next_char).",
          "Advance by length+1 positions.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Naive search is O(WL) per step. In practice, hash chains or suffix trees speed up matching.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Compression ratio depends on data redundancy. Larger windows find more matches but increase search time.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "LZ77 is universal: it asymptotically achieves the entropy rate for stationary ergodic sources. DEFLATE, gzip, and zlib are all based on LZ77.",
      },
    ],
  },
  complexity: {
    time: { best: "$O(n)$", average: "$O(n)$", worst: "$O(n \\cdot W)$" },
    space: "$O(W)$",
    worstClass: "n",
  },
  properties: [],
  implementations: [
    {
      language: "python",
      entry: "lz77_decompress",
      code: `def lz77_compress(data: str, window_size: int = 20) -> list[tuple[int, int, str]]:
    i = 0
    tokens = []
    while i < len(data):
        best_offset, best_length = 0, 0
        start = max(0, i - window_size)
        for j in range(start, i):
            length = 0
            while i + length < len(data) and data[j + length] == data[i + length] and length < 255:
                length += 1
            if length > best_length:
                best_length = length
                best_offset = i - j
        next_char = data[i + best_length] if i + best_length < len(data) else ""
        tokens.append((best_offset, best_length, next_char))
        i += best_length + 1
    return tokens

def lz77_decompress(tokens: list[tuple[int, int, str]]) -> str:
    result = []
    for offset, length, char in tokens:
        start = len(result) - offset
        for j in range(length):
            result.append(result[start + j])
        if char:
            result.append(char)
    return "".join(result)
`,
      tests: [
        {
          args: ["aabcabc"],
          expected: [
            [0, 0, "a"],
            [1, 1, "b"],
            [0, 0, "c"],
            [3, 3, ""],
          ],
        },
      ],
    },
    {
      language: "javascript",
      entry: "lz77Compress",
      code: `function lz77Compress(data, windowSize = 20) {
  const tokens = [];
  let i = 0;
  while (i < data.length) {
    let bestOff = 0, bestLen = 0;
    for (let j = Math.max(0, i - windowSize); j < i; j++) {
      let len = 0;
      while (i + len < data.length && data[j + len] === data[i + len]) len++;
      if (len > bestLen) { bestLen = len; bestOff = i - j; }
    }
    tokens.push([bestOff, bestLen, i + bestLen < data.length ? data[i + bestLen] : ""]);
    i += bestLen + 1;
  }
  return tokens;
}
`,
      tests: [],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "lz77-q1",
      kind: "mcq",
      prompt: "LZ77 replaces repeated sequences with:",
      options: [
        "Back-references (offset, length)",
        "Variable-length codes",
        "Dictionary indices",
        "Frequency tables",
      ],
      answer: 0,
      explanation: "LZ77 uses sliding window back-references.",
      hints: ["Window."],
      objective: "Token type",
    },
  ],
  exam: {
    definition: "Sliding window compression using (offset, length, next) triples.",
    steps: ["Search window for longest match.", "Output back-reference.", "Advance."],
    timeComplexity: "$O(nW)$ naive.",
    spaceComplexity: "$O(W)$.",
    correctness: "Lossless: decompression replays references exactly.",
    applications: ["gzip", "DEFLATE", "7-zip"],
    limitations: ["Window size limits long-range matches"],
    faq: [
      {
        q: "LZ77 vs LZ78?",
        a: "LZ77 uses sliding window; LZ78 builds an explicit dictionary.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Token format (1).",
          "Window search (1).",
          "Universality (1).",
          "Applications (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "A. Lempel and J. Ziv, 'A Universal Algorithm for Sequential Data Compression', IEEE IT, 1977.",
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
