import type { AlgorithmEntry } from "../types";

export const moveToFrontTransformEntry: AlgorithmEntry = {
  slug: "move-to-front-transform",
  name: "Move-to-Front Transform",
  aliases: ["Move-to-Front Transform", "MTF"],
  curriculum: [336],
  domain: "compression",
  subcategory: "Text Transform",
  difficulty: "beginner",
  summary:
    "Transforms a sequence by replacing each symbol with its index in a dynamically maintained list, then moving that symbol to the front. Produces many small integers from data with locality.",
  tags: ["MTF", "compression", "transform"],
  prerequisites: [],
  related: ["burrows-wheeler-transform-bwt", "run-length-encoding"],
  problem: {
    input: "A sequence of symbols from a known alphabet.",
    output: "A sequence of indices representing each symbol's position in the MTF list.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Keep a list of symbols. For each input symbol, output its current index in the list, then move it to the front. Repeated or recently-seen symbols get small indices (0 or near 0), which compress well with entropy coding.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Initialize list to the alphabet in order.",
          "For each input symbol: find its index, output the index, move the symbol to position 0.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Use a simple list. For small alphabets (256 bytes), linear search is acceptable.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "$O(n \\cdot |\\Sigma|)$ time for an alphabet of size $|\\Sigma|$. After BWT, the output has many 0s and small values, ideal for entropy coding.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Part of the bzip2 pipeline: BWT → MTF → RLE → Huffman.",
          "The inverse is straightforward: insert symbol at the given index, remove from current position.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n * σ)",
      worst: "O(n * σ)",
    },
    space: "O(σ)",
    worstClass: "n",
  },
  properties: [
    {
      label: "Reversible",
      value: "Yes",
    },
    {
      label: "Used after",
      value: "BWT",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "mtf_encode",
      code: `def mtf_encode(s):
    """Move-to-front encode a string of lowercase letters. Returns list of indices."""
    alphabet = list("abcdefghijklmnopqrstuvwxyz$")
    result = []
    for c in s:
        idx = alphabet.index(c)
        result.append(idx)
        alphabet.pop(idx)
        alphabet.insert(0, c)
    return result
`,
      tests: [
        {
          args: ["banana"],
          expected: [1, 1, 13, 1, 1, 1],
        },
        {
          args: ["aaa"],
          expected: [0, 0, 0],
        },
      ],
    },
    {
      language: "javascript",
      entry: "mtfEncode",
      code: `function mtfEncode(s) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz$".split("");
  const result = [];
  for (const c of s) {
    const idx = alphabet.indexOf(c);
    result.push(idx);
    alphabet.splice(idx, 1);
    alphabet.unshift(c);
  }
  return result;
}
`,
      tests: [
        {
          args: ["banana"],
          expected: [1, 1, 13, 1, 1, 1],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "mtf-q1",
      kind: "mcq",
      prompt: "After encoding 'aab', what is the MTF list state?",
      options: ["b, a, c, d, ...", "a, b, c, d, ...", "b, c, a, d, ...", "a, c, b, d, ..."],
      answer: 0,
      explanation:
        "After 'a': a moves to front (already there). After second 'a': same. After 'b': b moves to front.",
      hints: ["Track the list step by step."],
      objective: "List state",
    },
  ],
  exam: {
    definition:
      "MTF replaces each symbol with its current position in a dynamically reordered list.",
    steps: ["Initialize alphabet list.", "For each symbol: output index, move to front."],
    timeComplexity: "$O(n \\cdot |\\Sigma|)$.",
    spaceComplexity: "$O(|\\Sigma|)$.",
    correctness: "The inverse simply reverses each operation: look up by index, move to front.",
    applications: ["bzip2 pipeline", "adaptive compression"],
    limitations: ["O(n·σ) is slow for large alphabets without optimized data structures"],
    faq: [
      {
        q: "Why use MTF after BWT?",
        a: "BWT groups similar characters; MTF converts these runs into sequences of small integers.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Algorithm description (2).", "Why small indices appear (2).", "Inverse (1)."],
      },
    ],
  },
  references: [
    {
      citation: "J. L. Bentley et al., 'A Locally Adaptive Data Compression Scheme', CACM, 1986.",
      supports: "MTF analysis.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
