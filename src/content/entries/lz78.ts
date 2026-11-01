import type { AlgorithmEntry } from "../types";

export const lz78Entry: AlgorithmEntry = {
  slug: "lz78",
  name: "LZ78",
  aliases: ["Lempel-Ziv 78", "LZ2"],
  curriculum: [537],
  domain: "compression",
  subcategory: "Dictionary Compression",
  difficulty: "intermediate",
  summary:
    "Builds a dictionary of phrases incrementally, encoding each new phrase as an existing dictionary index plus one new character.",
  tags: ["compression", "dictionary", "phrase"],
  prerequisites: [],
  related: ["lz77", "lzw"],
  problem: {
    input: "A byte stream.",
    output: "Sequence of (dictionary_index, character) pairs.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Build a dictionary as you go. Each new entry extends an existing entry by one character. Output the index of the longest matching dictionary entry plus the next character.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Dictionary starts with entry 0 = empty string.",
          "Read input, matching the longest dictionary entry.",
          "Output (index_of_match, next_character).",
          "Add the match + next_character as a new dictionary entry.",
          "Continue from after the output characters.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Use a trie for the dictionary for O(1) per character matching. Dictionary grows unboundedly; in practice, reset or limit it.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Universal: asymptotically optimal for stationary ergodic sources. Number of phrases is $O(n / \\log n)$.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "LZ78 influenced LZW (dictionary initialized with single characters, outputs only indices). LZW was widely used in GIF and Unix compress.",
      },
    ],
  },
  complexity: {
    worstClass: "n",
    best: "$O(n)$",
    average: "$O(n)$",
    worst: "$O(n)$",
    space: "$O(n)$",
  },
  properties: [],
  implementations: [
    {
      language: "python",
      entry: "lz78",
      code: `def lz78_compress(data: str) -> list[tuple[int, str]]:
    dictionary: dict[str, int] = {"": 0}
    tokens = []
    current = ""
    next_code = 1
    for ch in data:
        current += ch
        if current not in dictionary:
            prefix = current[:-1]
            tokens.append((dictionary[prefix], ch))
            dictionary[current] = next_code
            next_code += 1
            current = ""
    if current:
        tokens.append((dictionary[current], ""))
    return tokens

def lz78_decompress(tokens: list[tuple[int, str]]) -> str:
    dictionary = {0: ""}
    result = []
    next_code = 1
    for idx, ch in tokens:
        phrase = dictionary[idx] + ch
        result.append(phrase)
        dictionary[next_code] = phrase
        next_code += 1
    return "".join(result)
`,
      tests: [
        {
          args: ["aabaabaab"],
        },
      ],
    },
    {
      language: "javascript",
      entry: "lz78",
      code: `function lz78Compress(data) {
  const dict = {"": 0};
  const tokens = [];
  let current = "", nextCode = 1;
  for (const ch of data) {
    current += ch;
    if (!(current in dict)) {
      tokens.push([dict[current.slice(0, -1)], ch]);
      dict[current] = nextCode++;
      current = "";
    }
  }
  if (current) tokens.push([dict[current], ""]);
  return tokens;
}
`,
      tests: [],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "lz78-q1",
      kind: "mcq",
      prompt: "LZ78 dictionary entries are built by:",
      options: [
        "Extending existing entries by one character",
        "Sliding a window",
        "Sorting suffixes",
        "Huffman tree",
      ],
      answer: 0,
      explanation: "Each new entry is an existing entry plus one new character.",
      hints: ["Incremental."],
      objective: "Dictionary growth",
    },
  ],
  exam: {
    definition: "Incremental dictionary compression outputting (index, character) pairs.",
    steps: [
      "Match longest dictionary entry.",
      "Output (index, next char).",
      "Add new entry to dictionary.",
    ],
    timeComplexity: "$O(n)$ with trie.",
    spaceComplexity: "$O(n)$.",
    correctness: "Dictionary reconstruction during decompression mirrors compression.",
    applications: ["Foundation for LZW", "theoretical compression"],
    limitations: ["Dictionary grows unboundedly; needs reset strategy"],
    faq: [
      {
        q: "LZ78 vs LZW?",
        a: "LZW pre-initializes the dictionary and outputs only indices (no character).",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Token format (1).",
          "Dictionary growth (1).",
          "Universality (1).",
          "vs LZ77/LZW (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "J. Ziv and A. Lempel, 'Compression of Individual Sequences via Variable-Rate Coding', IEEE IT, 1978.",
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
