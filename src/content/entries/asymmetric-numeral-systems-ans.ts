import type { AlgorithmEntry } from "../types";

export const asymmetricNumeralSystemsAnsEntry: AlgorithmEntry = {
  slug: "asymmetric-numeral-systems-ans",
  name: "Asymmetric Numeral Systems (ANS)",
  aliases: ["ANS", "rANS", "tANS"],
  curriculum: [541],
  domain: "compression",
  subcategory: "Entropy Coding",
  difficulty: "intermediate",
  summary:
    "A family of entropy coding methods that achieve near-optimal compression like arithmetic coding but with simpler, faster single-state encoding/decoding.",
  tags: ["entropy coding", "compression", "ANS"],
  prerequisites: ["arithmetic-coding"],
  related: ["huffman-tree"],
  problem: {
    input: "A message and symbol frequencies.",
    output: "A compressed integer state encoding the message.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Encode information into a single natural number. Each symbol either multiplies the state (for common symbols, adding few bits) or shifts it (for rare symbols, adding many bits).",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "rANS: state x encodes symbol s as x' = (x // freq[s]) * total + cumul[s] + (x mod freq[s]).",
          "Decode reverses: s = symbol at (x mod total), x' = (x // total) * freq[s] + (x mod total) - cumul[s].",
          "Renormalize by streaming bits in/out to keep state in range.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "tANS (tabled) precomputes a finite-state table for even faster encoding/decoding. rANS (range) is more flexible.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Achieves compression within 1 bit of entropy per symbol. Encoding and decoding are each $O(1)$ per symbol after table construction.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "ANS combines the compression ratio of arithmetic coding with the speed of Huffman coding. Used in Zstandard (zstd), LZFSE, and JPEG XL.",
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
      entry: "ans",
      code: `def rans_encode(message: list[int], freqs: list[int]) -> int:
    total = sum(freqs)
    cumul = [0] * (len(freqs) + 1)
    for i in range(len(freqs)):
        cumul[i + 1] = cumul[i] + freqs[i]
    x = total
    for s in reversed(message):
        x = (x // freqs[s]) * total + cumul[s] + (x % freqs[s])
    return x

def rans_decode(x: int, length: int, freqs: list[int]) -> list[int]:
    total = sum(freqs)
    cumul = [0] * (len(freqs) + 1)
    for i in range(len(freqs)):
        cumul[i + 1] = cumul[i] + freqs[i]
    result = []
    for _ in range(length):
        slot = x % total
        s = 0
        while cumul[s + 1] <= slot:
            s += 1
        result.append(s)
        x = (x // total) * freqs[s] + slot - cumul[s]
    return result
`,
      tests: [
        {
          args: [
            [0, 0, 1, 0],
            [3, 1],
          ],
        },
      ],
    },
    {
      language: "javascript",
      entry: "ans",
      code: `function ransEncode(message, freqs) {
  const total = freqs.reduce((a, b) => a + b, 0);
  const cumul = [0];
  for (let i = 0; i < freqs.length; i++) cumul.push(cumul[i] + freqs[i]);
  let x = total;
  for (let i = message.length - 1; i >= 0; i--) {
    const s = message[i];
    x = Math.floor(x / freqs[s]) * total + cumul[s] + (x % freqs[s]);
  }
  return x;
}
`,
      tests: [],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "ans-q1",
      kind: "mcq",
      prompt: "ANS encodes a message into:",
      options: [
        "A single integer state",
        "A binary tree",
        "A sequence of codewords",
        "A floating-point interval",
      ],
      answer: 0,
      explanation: "ANS maintains a single state integer that encodes the entire message.",
      hints: ["State."],
      objective: "Representation",
    },
  ],
  exam: {
    definition: "Entropy coding using a single integer state with near-optimal compression.",
    steps: [
      "Initialize state.",
      "For each symbol, update state using frequency table.",
      "Renormalize as needed.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(|\\Sigma|)$.",
    correctness: "Bijection between messages and state values.",
    applications: ["Zstandard", "LZFSE", "JPEG XL"],
    limitations: ["Decode order is reverse of encode (LIFO)"],
    faq: [
      {
        q: "Why is ANS popular now?",
        a: "It offers arithmetic-coding compression with Huffman-coding speed, and is patent-free.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "rANS formula (2).",
          "Comparison with arithmetic coding (1).",
          "Applications (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "J. Duda, 'Asymmetric numeral systems', arXiv:0902.0271, 2009.",
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
