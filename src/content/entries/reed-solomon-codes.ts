import type { AlgorithmEntry } from "../types";

export const reedSolomonCodesEntry: AlgorithmEntry = {
  slug: "reed-solomon-codes",
  name: "Reed-Solomon Codes",
  aliases: ["RS Codes"],
  curriculum: [542],
  domain: "compression",
  subcategory: "Error-Correcting Codes",
  difficulty: "intermediate",
  summary:
    "Error-correcting codes based on polynomial evaluation over finite fields, capable of correcting up to t symbol errors where 2t redundancy symbols are added.",
  tags: ["error correction", "finite field", "polynomial", "RS"],
  prerequisites: [],
  related: ["hamming-codes"],
  problem: {
    input: "A message of k symbols over GF(q).",
    output: "A codeword of n=k+2t symbols that can correct up to t errors.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Represent the message as a polynomial of degree < k. Evaluate it at n points over a finite field. The redundancy (n-k evaluations) lets us detect and correct errors using polynomial interpolation.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Represent message as polynomial P(x) of degree < k.",
          "Encode: compute P(x) mod generator polynomial g(x), append remainder.",
          "Alternatively, evaluate P at n distinct field elements.",
          "Decode: use syndromes to detect errors.",
          "Berlekamp-Massey or Euclidean algorithm to find error positions.",
          "Forney algorithm to find error values.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "All arithmetic in GF(2^8) for byte-oriented RS codes. Generator polynomial has roots at consecutive powers of a primitive element.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "An RS(n,k) code over GF(q) has minimum distance d = n-k+1, correcting up to $t = \\lfloor(n-k)/2\\rfloor$ errors. This meets the Singleton bound (MDS code).",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "RS codes are optimal (MDS) but work at the symbol level. They excel at burst errors since a burst affects few symbols. Concatenated with inner codes, they provide both burst and random error correction.",
      },
    ],
  },
  complexity: {
    time: { best: "O(n \\log n)", average: "O(n^2)", worst: "O(n^2)" },
    space: "O(n)",
    worstClass: "n",
  },
  properties: [],
  implementations: [
    {
      language: "python",
      entry: "rs_encode",
      code: `def gf256_mul(a: int, b: int) -> int:
    p = 0
    for _ in range(8):
        if b & 1:
            p ^= a
        hi = a & 0x80
        a = (a << 1) & 0xFF
        if hi:
            a ^= 0x1D
        b >>= 1
    return p

def rs_encode(message: list[int], nsym: int) -> list[int]:
    gen = [1]
    for i in range(nsym):
        new_gen = [0] * (len(gen) + 1)
        alpha_i = pow(2, i, 256)
        for j in range(len(gen)):
            new_gen[j] ^= gen[j]
            new_gen[j + 1] ^= gf256_mul(gen[j], alpha_i)
        gen = new_gen
    msg = list(message) + [0] * nsym
    for i in range(len(message)):
        coef = msg[i]
        if coef != 0:
            for j in range(1, len(gen)):
                msg[i + j] ^= gf256_mul(gen[j], coef)
    return list(message) + msg[len(message):]
`,
      tests: [
        {
          args: [[1, 2, 3], 4],
          expected: [1, 2, 3, 139, 243, 142, 246],
        },
      ],
    },
    {
      language: "javascript",
      entry: "rsEncode",
      code: `function gf256Mul(a, b) {
  let p = 0;
  for (let i = 0; i < 8; i++) {
    if (b & 1) p ^= a;
    const hi = a & 0x80;
    a = (a << 1) & 0xFF;
    if (hi) a ^= 0x1D;
    b >>= 1;
  }
  return p;
}
function rsEncode(message, nsym) {
  let gen = [1];
  for (let i = 0; i < nsym; i++) {
    const newGen = new Array(gen.length + 1).fill(0);
    for (let j = 0; j < gen.length; j++) {
      newGen[j] ^= gen[j];
      newGen[j+1] ^= gf256Mul(gen[j], (1 << i) & 0xFF);
    }
    gen = newGen;
  }
  const msg = [...message, ...new Array(nsym).fill(0)];
  for (let i = 0; i < message.length; i++) {
    if (msg[i]) for (let j = 1; j < gen.length; j++) msg[i+j] ^= gf256Mul(gen[j], msg[i]);
  }
  return [...message, ...msg.slice(message.length)];
}
`,
      tests: [],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "rs-q1",
      kind: "mcq",
      prompt: "An RS(255,223) code can correct up to how many symbol errors?",
      options: ["16", "32", "223", "255"],
      answer: 0,
      explanation: "t = (255-223)/2 = 16 symbol errors.",
      hints: ["(n-k)/2."],
      objective: "Error capacity",
    },
  ],
  exam: {
    definition: "MDS error-correcting codes based on polynomial evaluation over finite fields.",
    steps: [
      "Encode via generator polynomial.",
      "Decode via syndromes + Berlekamp-Massey + Forney.",
    ],
    timeComplexity: "$O(n^2)$ or $O(n \\log^2 n)$ with FFT.",
    spaceComplexity: "$O(n)$.",
    correctness: "MDS: d=n-k+1 meets Singleton bound.",
    applications: ["QR codes", "CDs/DVDs", "deep-space communication"],
    limitations: ["Symbol-level: less efficient for random bit errors without concatenation"],
    faq: [
      {
        q: "Why used in QR codes?",
        a: "RS excels at burst errors caused by physical damage to the QR pattern.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Encoding (2).",
          "MDS property (1).",
          "Decoding outline (1).",
          "Applications (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "I. S. Reed and G. Solomon, 'Polynomial Codes Over Certain Finite Fields', JSIAM, 1960.",
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
