import type { AlgorithmEntry } from "../types";

export const lzwEntry: AlgorithmEntry = {
  slug: "lzw",
  name: "LZW",
  aliases: ["Lempel-Ziv-Welch"],
  curriculum: [538],
  domain: "compression",
  subcategory: "Dictionary Compression",
  difficulty: "intermediate",
  summary:
    "A refinement of LZ78 that initializes the dictionary with all single characters and outputs only dictionary indices, eliminating the extra character per token.",
  tags: ["compression", "dictionary", "LZW"],
  prerequisites: ["lz78"],
  related: ["lz77", "deflate"],
  problem: {
    input: "A byte stream.",
    output: "Sequence of dictionary indices.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Start with a dictionary of all single characters. Read the longest match, output its index, then add match+next_char to the dictionary.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Initialize dictionary with all single characters (codes 0..255 for bytes).",
          "Set current = first input character.",
          "For each next character:",
          "  If current+next is in dictionary: current = current+next.",
          "  Else: output code for current, add current+next to dictionary, current = next.",
          "Output code for final current.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "When the dictionary fills up, either reset it or stop adding entries. Variable-width codes grow as the dictionary grows.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "$O(n)$ time with hash table dictionary. Space is $O(D)$ where D is dictionary size, typically capped at 2^12 to 2^16 entries.",
      },
    ],
    deeper: [
      {
        kind: "p",
        text: "LZW was patented (Unisys) until 2004, which drove the transition from GIF to PNG (which uses DEFLATE). Now patent-free, LZW remains in TIFF and PDF.",
      },
    ],
  },
  complexity: {
    worstClass: "n",
    best: "$O(n)$",
    average: "$O(n)$",
    worst: "$O(n)$",
    space: "$O(D)$",
  },
  properties: [],
  implementations: [
    {
      language: "python",
      entry: "lzw",
      code: `def lzw_compress(data: str) -> list[int]:
    dictionary = {chr(i): i for i in range(256)}
    next_code = 256
    current = ""
    codes = []
    for ch in data:
        combined = current + ch
        if combined in dictionary:
            current = combined
        else:
            codes.append(dictionary[current])
            dictionary[combined] = next_code
            next_code += 1
            current = ch
    if current:
        codes.append(dictionary[current])
    return codes

def lzw_decompress(codes: list[int]) -> str:
    dictionary = {i: chr(i) for i in range(256)}
    next_code = 256
    result = [dictionary[codes[0]]]
    prev = result[0]
    for code in codes[1:]:
        if code in dictionary:
            entry = dictionary[code]
        elif code == next_code:
            entry = prev + prev[0]
        else:
            raise ValueError(f"Bad code: {code}")
        result.append(entry)
        dictionary[next_code] = prev + entry[0]
        next_code += 1
        prev = entry
    return "".join(result)
`,
      tests: [
        {
          args: ["ABABABA"],
          expected: [65, 66, 256, 258, 65],
        },
      ],
    },
    {
      language: "javascript",
      entry: "lzw",
      code: `function lzwCompress(data) {
  const dict = {};
  for (let i = 0; i < 256; i++) dict[String.fromCharCode(i)] = i;
  let nextCode = 256, current = "", codes = [];
  for (const ch of data) {
    const combined = current + ch;
    if (combined in dict) { current = combined; }
    else { codes.push(dict[current]); dict[combined] = nextCode++; current = ch; }
  }
  if (current) codes.push(dict[current]);
  return codes;
}
`,
      tests: [
        {
          args: ["ABABABA"],
          expected: [65, 66, 256, 258, 65],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "lzw-q1",
      kind: "mcq",
      prompt: "How does LZW differ from LZ78?",
      options: [
        "Dictionary pre-initialized with single chars; outputs only indices",
        "Uses sliding window",
        "Uses Huffman codes",
        "No dictionary",
      ],
      answer: 0,
      explanation: "LZW starts with single-char entries and drops the extra character per token.",
      hints: ["Pre-init."],
      objective: "Difference",
    },
  ],
  exam: {
    definition:
      "Dictionary compression outputting only indices, initialized with single characters.",
    steps: [
      "Init dictionary with single chars.",
      "Match longest, output code, extend dictionary.",
      "Handle special case code == next_code.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(D)$.",
    correctness: "Decoder reconstructs dictionary in sync with encoder.",
    applications: ["GIF", "TIFF", "PDF", "Unix compress"],
    limitations: ["Patent history; dictionary reset needed for long streams"],
    faq: [
      {
        q: "What is the special case in decompression?",
        a: "When code == next_code, the entry is previous + previous[0].",
      },
    ],
    answers: [
      {
        marks: 4,
        outline: ["Algorithm (2).", "Special decode case (1).", "Applications (1)."],
      },
    ],
  },
  references: [
    {
      citation:
        "T. A. Welch, 'A Technique for High-Performance Data Compression', IEEE Computer, 1984.",
      supports: "Original LZW paper.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
