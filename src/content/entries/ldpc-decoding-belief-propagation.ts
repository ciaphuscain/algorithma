import type { AlgorithmEntry } from "../types";

export const ldpcDecodingBeliefPropagationEntry: AlgorithmEntry = {
  slug: "ldpc-decoding-belief-propagation",
  name: "LDPC Decoding (Belief Propagation)",
  aliases: ["LDPC BP Decoding", "Sum-Product Algorithm"],
  curriculum: [544],
  domain: "compression",
  subcategory: "Error-Correcting Codes",
  difficulty: "intermediate",
  summary:
    "Decodes Low-Density Parity-Check codes using iterative message passing on the factor graph (belief propagation).",
  tags: ["LDPC", "belief propagation", "error correction", "factor graph"],
  prerequisites: ["belief-propagation"],
  related: ["viterbi-decoding"],
  problem: {
    input: "A received noisy codeword and LDPC parity-check matrix.",
    output: "The most likely transmitted codeword.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "LDPC codes are defined by a sparse parity-check matrix H. Decoding passes probability messages between variable nodes (bits) and check nodes (parity constraints) on the Tanner graph until convergence.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Initialize variable-to-check messages from channel probabilities.",
          "Check-to-variable update: each check node computes the probability its parity is satisfied.",
          "Variable-to-check update: each variable node combines messages from all other check nodes.",
          "Repeat until convergence or max iterations.",
          "Make hard decisions from final beliefs.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Use log-likelihood ratios (LLR) for numerical stability. The min-sum algorithm approximates the full sum-product for faster computation.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "For a code with n bits and m checks, each iteration is $O(n \\cdot d_v)$ where $d_v$ is the average variable node degree. Typically 10-50 iterations suffice.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "LDPC codes with BP decoding approach Shannon capacity on AWGN channels. Density evolution predicts the threshold noise level.",
      },
    ],
  },
  complexity: {
    time: { best: "O(n)", average: "O(n \\cdot T)", worst: "O(n \\cdot T)" },
    space: "O(n)",
    worstClass: "n",
  },
  properties: [],
  implementations: [
    {
      language: "python",
      entry: "ldpc_decode",
      code: `import math

def ldpc_decode(H: list[list[int]], llr: list[float], max_iter: int = 50) -> list[int]:
    m, n = len(H), len(H[0])
    check_to_var = [[0.0] * n for _ in range(m)]
    for iteration in range(max_iter):
        var_to_check = [[0.0] * n for _ in range(m)]
        for j in range(n):
            total = llr[j] + sum(check_to_var[i][j] for i in range(m) if H[i][j])
            for i in range(m):
                if H[i][j]:
                    var_to_check[i][j] = total - check_to_var[i][j]
        for i in range(m):
            for j in range(n):
                if H[i][j]:
                    product = 1.0
                    for jj in range(n):
                        if jj != j and H[i][jj]:
                            val = var_to_check[i][jj]
                            product *= math.tanh(val / 2) if abs(val) > 1e-10 else 0.0
                    check_to_var[i][j] = 2 * math.atanh(max(-0.9999, min(0.9999, product)))
        beliefs = [llr[j] + sum(check_to_var[i][j] for i in range(m) if H[i][j]) for j in range(n)]
        decoded = [0 if b >= 0 else 1 for b in beliefs]
        if all(sum(decoded[j] * H[i][j] for j in range(n)) % 2 == 0 for i in range(m)):
            return decoded
    return [0 if b >= 0 else 1 for b in beliefs]
`,
      tests: [
        {
          args: [
            [
              [1, 1, 0, 1],
              [0, 1, 1, 1],
            ],
            [2.0, -1.0, 1.5, 0.5],
            10,
          ],
          expected: [0, 1, 0, 1],
        },
      ],
    },
    {
      language: "javascript",
      entry: "ldpcDecode",
      code: `function ldpcDecode(H, llr, maxIter = 50) {
  const m = H.length, n = H[0].length;
  const c2v = Array.from({length: m}, () => new Array(n).fill(0));
  for (let iter = 0; iter < maxIter; iter++) {
    const v2c = Array.from({length: m}, () => new Array(n).fill(0));
    for (let j = 0; j < n; j++) {
      let total = llr[j];
      for (let i = 0; i < m; i++) if (H[i][j]) total += c2v[i][j];
      for (let i = 0; i < m; i++) if (H[i][j]) v2c[i][j] = total - c2v[i][j];
    }
    for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) if (H[i][j]) {
      let prod = 1;
      for (let jj = 0; jj < n; jj++) if (jj !== j && H[i][jj]) prod *= Math.tanh(v2c[i][jj] / 2);
      c2v[i][j] = 2 * Math.atanh(Math.max(-0.9999, Math.min(0.9999, prod)));
    }
    const beliefs = llr.map((l, j) => { let s = l; for (let i = 0; i < m; i++) if (H[i][j]) s += c2v[i][j]; return s; });
    const decoded = beliefs.map(b => b >= 0 ? 0 : 1);
    if (H.every((row, i) => row.reduce((s, h, j) => s + decoded[j] * h, 0) % 2 === 0)) return decoded;
  }
  return llr.map(b => b >= 0 ? 0 : 1);
}
`,
      tests: [
        {
          args: [
            [
              [1, 1, 0],
              [0, 1, 1],
            ],
            [5, 5, 5],
          ],
          expected: [0, 0, 0],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "ldpc-q1",
      kind: "mcq",
      prompt: "LDPC decoding uses which graphical model?",
      options: ["Tanner graph / factor graph", "Binary tree", "Hash table", "Suffix tree"],
      answer: 0,
      explanation: "Messages pass between variable and check nodes on the Tanner graph.",
      hints: ["Factor graph."],
      objective: "Graph",
    },
  ],
  exam: {
    definition: "Iterative belief propagation decoding on LDPC code's Tanner graph.",
    steps: [
      "Initialize from channel LLRs.",
      "Variable-to-check messages.",
      "Check-to-variable messages.",
      "Iterate until convergence.",
    ],
    timeComplexity: "$O(n \\cdot T)$ for T iterations.",
    spaceComplexity: "$O(n)$.",
    correctness:
      "Converges to MAP estimate on tree-structured graphs; approximate on loopy graphs.",
    applications: ["5G NR", "DVB-S2", "WiFi (802.11n)"],
    limitations: ["May not converge on short cycles; sub-optimal on loopy graphs"],
    faq: [
      {
        q: "Min-sum vs sum-product?",
        a: "Min-sum approximates tanh with min for speed, losing ~0.2dB.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Tanner graph (1).",
          "Message passing rules (2).",
          "Convergence (1).",
          "Applications (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "R. G. Gallager, 'Low-Density Parity-Check Codes', MIT Press, 1963.",
      supports: "Foundation of LDPC codes.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
