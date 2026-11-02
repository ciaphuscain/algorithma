import type { AlgorithmEntry } from "../types";

export const hammingCodesEntry: AlgorithmEntry = {
  slug: "hamming-codes",
  name: "Hamming Codes",
  aliases: ["Hamming Codes", "Hamming(7,4)"],
  curriculum: [543],
  domain: "compression",
  subcategory: "Error Correction",
  difficulty: "intermediate",
  summary:
    "An error-correcting code that adds parity bits at power-of-two positions, enabling single-bit error detection and correction.",
  tags: ["hamming", "error correction", "parity", "coding theory"],
  prerequisites: [],
  related: ["hamming-distance", "reed-solomon-codes"],
  problem: {
    input: "A data word of k bits.",
    output: "A codeword of k + r bits (r parity bits) that can correct any single-bit error.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Place parity bits at positions 1, 2, 4, 8, ... (powers of 2). Each parity bit checks a specific subset of data bits determined by the binary representation of their positions. On receiving, recompute parities — the error position is the binary number formed by the failing parity checks (the syndrome).",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Position numbering starts at 1. Positions that are powers of 2 (1, 2, 4, 8, ...) hold parity bits; the rest hold data bits.",
          "Parity bit at position $2^j$ checks all positions whose binary representation has bit $j$ set.",
          "To decode: compute each parity check. The XOR of failing check positions gives the error position.",
          "Flip the bit at that position to correct the error.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "For Hamming(7,4): 4 data bits, 3 parity bits. Positions: P1 P2 D1 P4 D2 D3 D4.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "For $k$ data bits, need $r$ parity bits where $2^r \\ge k + r + 1$. Hamming(7,4) uses $r=3$ for $k=4$. Minimum distance is 3, so it corrects 1 error and detects 2 (with an extra overall parity bit).",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "SECDED (single error correction, double error detection) adds an overall parity bit.",
          "Extended Hamming(8,4) has minimum distance 4.",
          "Hamming codes are perfect codes: every syndrome corresponds to exactly one error pattern.",
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
      label: "Error correction",
      value: "1 bit",
    },
    {
      label: "Minimum distance",
      value: "3",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "hamming_encode",
      code: `def hamming_encode(data):
    """Encode a list of 4 data bits using Hamming(7,4). Returns 7-bit codeword."""
    d = data
    p1 = d[0] ^ d[1] ^ d[3]
    p2 = d[0] ^ d[2] ^ d[3]
    p4 = d[1] ^ d[2] ^ d[3]
    return [p1, p2, d[0], p4, d[1], d[2], d[3]]
`,
      tests: [
        {
          args: [[1, 0, 1, 1]],
          expected: [0, 1, 1, 0, 0, 1, 1],
        },
        {
          args: [[0, 0, 0, 0]],
          expected: [0, 0, 0, 0, 0, 0, 0],
        },
        {
          args: [[1, 1, 1, 1]],
          expected: [1, 1, 1, 1, 1, 1, 1],
        },
      ],
    },
    {
      language: "javascript",
      entry: "hammingEncode",
      code: `function hammingEncode(data) {
  const d = data;
  const p1 = d[0] ^ d[1] ^ d[3];
  const p2 = d[0] ^ d[2] ^ d[3];
  const p4 = d[1] ^ d[2] ^ d[3];
  return [p1, p2, d[0], p4, d[1], d[2], d[3]];
}
`,
      tests: [
        {
          args: [[1, 0, 1, 1]],
          expected: [0, 1, 1, 0, 0, 1, 1],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "hamming-codes-q1",
      kind: "mcq",
      prompt: "Where are parity bits placed in a Hamming code?",
      options: [
        "At power-of-two positions (1, 2, 4, 8, ...)",
        "At the end of the codeword",
        "At even positions",
        "Randomly",
      ],
      answer: 0,
      explanation:
        "Powers of 2 give each parity bit a unique check pattern based on binary position representations.",
      hints: ["Think about binary representations."],
      objective: "Parity placement",
    },
  ],
  exam: {
    definition:
      "Hamming codes place parity bits at power-of-2 positions to correct single-bit errors.",
    steps: [
      "Place data bits at non-power-of-2 positions.",
      "Compute parity bits.",
      "To decode: compute syndrome, flip bit if nonzero.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The syndrome uniquely identifies any single-bit error position.",
    applications: ["ECC memory", "data storage", "telecommunications"],
    limitations: ["Corrects only 1 bit error per codeword"],
    faq: [
      {
        q: "What is the syndrome?",
        a: "The XOR of positions where parity checks fail — it gives the error position in binary.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Parity bit placement (1).",
          "Encoding/decoding (2).",
          "Minimum distance and correction capability (2).",
        ],
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
