import type { AlgorithmEntry } from "../types";

export const arithmeticCodingEntry: AlgorithmEntry = {
  slug: "arithmetic-coding",
  name: "Arithmetic Coding",
  aliases: ["Arithmetic Encoding"],
  curriculum: [540],
  domain: "compression",
  subcategory: "Entropy Coding",
  difficulty: "intermediate",
  summary:
    "Encodes an entire message as a single number in [0,1), achieving near-optimal compression by narrowing the interval according to symbol probabilities.",
  tags: ["entropy coding", "compression", "interval"],
  prerequisites: [],
  related: ["huffman-tree", "asymmetric-numeral-systems-ans"],
  problem: {
    input: "A message and symbol probabilities.",
    output: "A number in [0,1) encoding the message.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Divide [0,1) into sub-intervals proportional to symbol probabilities. For each symbol, narrow to its sub-interval. The final interval uniquely encodes the message.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Start with interval [0, 1).",
          "For each symbol:",
          "  Divide current interval by symbol probabilities.",
          "  Narrow to the sub-interval for the current symbol.",
          "Output any number in the final interval.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "In practice, use integer arithmetic with scaling to avoid precision loss. Output bits as the interval narrows.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Optimal: the code length approaches the entropy $H = -\\sum p_i \\log_2 p_i$, with at most 2 bits overhead for the entire message.",
      },
    ],
    deeper: [
      {
        kind: "p",
        text: "Unlike Huffman coding which assigns whole bits per symbol, arithmetic coding can use fractional bits, achieving better compression for skewed distributions.",
      },
    ],
  },
  complexity: {
    worstClass: "n",
    best: "$O(n)$",
    average: "$O(n)$",
    worst: "$O(n)$",
    space: "$O(|\\Sigma|)$",
  },
  properties: [],
  implementations: [
    {
      language: "python",
      entry: "arithmetic_coding",
      code: `def arithmetic_encode(message: str, probs: dict[str, tuple[float, float]]) -> float:
    low, high = 0.0, 1.0
    for ch in message:
        rng = high - low
        ch_low, ch_high = probs[ch]
        high = low + rng * ch_high
        low = low + rng * ch_low
    return (low + high) / 2

def arithmetic_decode(code: float, length: int, probs: dict[str, tuple[float, float]]) -> str:
    result = []
    for _ in range(length):
        for ch, (ch_low, ch_high) in probs.items():
            if ch_low <= code < ch_high:
                result.append(ch)
                rng = ch_high - ch_low
                code = (code - ch_low) / rng
                break
    return "".join(result)
`,
      tests: [
        {
          args: [
            "aab",
            {
              a: [0.0, 0.6],
              b: [0.6, 1.0],
            },
          ],
          expected_range: [0.0, 1.0],
        },
      ],
    },
    {
      language: "javascript",
      entry: "arithmeticCoding",
      code: `function arithmeticEncode(message, probs) {
  let low = 0, high = 1;
  for (const ch of message) {
    const range = high - low;
    const [cLow, cHigh] = probs[ch];
    high = low + range * cHigh;
    low = low + range * cLow;
  }
  return (low + high) / 2;
}
`,
      tests: [],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "ac-q1",
      kind: "mcq",
      prompt: "What does arithmetic coding represent the message as?",
      options: [
        "A single number in [0,1)",
        "A binary tree",
        "A sequence of codewords",
        "A hash value",
      ],
      answer: 0,
      explanation: "The entire message maps to a narrowing interval in [0,1).",
      hints: ["Interval."],
      objective: "Representation",
    },
  ],
  exam: {
    definition: "Encodes a message as a number by recursively narrowing a probability interval.",
    steps: ["Start [0,1).", "Narrow interval per symbol.", "Output midpoint."],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(|\\Sigma|)$.",
    correctness: "Non-overlapping intervals ensure unique decodability.",
    applications: ["JPEG", "H.264/H.265", "data compression"],
    limitations: ["Patent issues historically; precision management in fixed-point"],
    faq: [
      {
        q: "Why better than Huffman?",
        a: "Can use fractional bits per symbol, approaching entropy more closely.",
      },
    ],
    answers: [
      {
        marks: 4,
        outline: ["Interval narrowing (2).", "Why near-optimal (1).", "vs Huffman (1)."],
      },
    ],
  },
  references: [
    {
      citation:
        "I. H. Witten, R. M. Neal, J. G. Cleary, 'Arithmetic coding for data compression', CACM, 1987.",
      supports: "Classic tutorial.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
