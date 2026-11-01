import type { AlgorithmEntry } from "../types";

export const deflateEntry: AlgorithmEntry = {
  slug: "deflate",
  name: "DEFLATE",
  aliases: ["Deflate Compression"],
  curriculum: [539],
  domain: "compression",
  subcategory: "Lossless Compression",
  difficulty: "intermediate",
  summary:
    "Combines LZ77 dictionary compression with Huffman coding. Used in gzip, PNG, and ZIP formats.",
  tags: ["compression", "LZ77", "Huffman", "gzip"],
  prerequisites: ["lz77", "huffman-tree"],
  related: ["lzw"],
  problem: {
    input: "A byte stream.",
    output: "Compressed byte stream using LZ77 + Huffman.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "First pass: find repeated sequences using LZ77 (replace with back-references). Second pass: encode the literals and back-references using Huffman codes for further compression.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Divide input into blocks.",
          "For each block, apply LZ77 to find matches.",
          "Build Huffman trees for literal/length codes and distance codes.",
          "Encode: literals as Huffman codes, matches as length+distance pairs.",
          "Store the Huffman tree in the block header.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Three block types: uncompressed (for incompressible data), fixed Huffman (predefined codes), dynamic Huffman (custom codes in header).",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Compression ratio depends on data redundancy. Typically 60-70% reduction on text. Block-level adaptivity helps handle varying data characteristics.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "DEFLATE's simplicity and effectiveness made it ubiquitous. Zstandard improves on it with ANS and larger windows, but DEFLATE remains the standard for compatibility.",
      },
    ],
  },
  complexity: {
    time: { best: "$O(n)$", average: "$O(n)$", worst: "$O(n^2)$" },
    space: "$O(n)$",
    worstClass: "n",
  },
  properties: [],
  implementations: [
    {
      language: "python",
      entry: "deflate",
      code: `def simplified_deflate(data: str) -> list:
    tokens = []
    i = 0
    window_size = 32
    while i < len(data):
        best_len, best_dist = 0, 0
        start = max(0, i - window_size)
        for j in range(start, i):
            length = 0
            while i + length < len(data) and data[j + length] == data[i + length] and length < 258:
                length += 1
            if length > best_len:
                best_len = length
                best_dist = i - j
        if best_len >= 3:
            tokens.append((best_dist, best_len))
            i += best_len
        else:
            tokens.append(data[i])
            i += 1
    return tokens

def simplified_inflate(tokens: list) -> str:
    result = []
    for t in tokens:
        if isinstance(t, str):
            result.append(t)
        else:
            dist, length = t
            start = len(result) - dist
            for j in range(length):
                result.append(result[start + j])
    return "".join(result)
`,
      tests: [
        {
          args: ["abcabcabc"],
          expected: ["a", "b", "c", [3, 6]],
        },
      ],
    },
    {
      language: "javascript",
      entry: "deflate",
      code: `function simplifiedDeflate(data) {
  const tokens = [];
  let i = 0;
  while (i < data.length) {
    let bestLen = 0, bestDist = 0;
    const start = Math.max(0, i - 32);
    for (let j = start; j < i; j++) {
      let len = 0;
      while (i + len < data.length && data[j + len] === data[i + len] && len < 258) len++;
      if (len > bestLen) { bestLen = len; bestDist = i - j; }
    }
    if (bestLen >= 3) { tokens.push([bestDist, bestLen]); i += bestLen; }
    else { tokens.push(data[i]); i++; }
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
      id: "deflate-q1",
      kind: "mcq",
      prompt: "DEFLATE combines which two techniques?",
      options: [
        "LZ77 and Huffman coding",
        "BWT and MTF",
        "LZW and arithmetic coding",
        "RLE and Huffman",
      ],
      answer: 0,
      explanation: "DEFLATE uses LZ77 for dictionary compression and Huffman for entropy coding.",
      hints: ["Two-stage."],
      objective: "Components",
    },
  ],
  exam: {
    definition: "Lossless compression combining LZ77 back-references with Huffman coding.",
    steps: [
      "LZ77 pass: find matches.",
      "Huffman pass: encode literals and lengths.",
      "Output block with Huffman tree header.",
    ],
    timeComplexity: "$O(n)$ to $O(n^2)$ depending on match strategy.",
    spaceComplexity: "$O(n)$.",
    correctness: "Lossless: inflate reverses deflate exactly.",
    applications: ["gzip", "PNG", "ZIP", "HTTP compression"],
    limitations: ["32KB window limits long-range matches; newer formats use larger windows"],
    faq: [
      {
        q: "Why is DEFLATE still used?",
        a: "Universal compatibility; standardized in RFC 1951.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["LZ77 stage (1).", "Huffman stage (1).", "Block types (1).", "Applications (1)."],
      },
    ],
  },
  references: [
    {
      citation: "P. Deutsch, 'DEFLATE Compressed Data Format Specification', RFC 1951, 1996.",
      supports: "Standard.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
