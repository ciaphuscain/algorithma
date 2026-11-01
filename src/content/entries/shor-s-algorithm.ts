import type { AlgorithmEntry } from "../types";

export const shorSAlgorithmEntry: AlgorithmEntry = {
  slug: "shor-s-algorithm",
  name: "Shor's Algorithm",
  aliases: ["Shor's Factoring Algorithm"],
  curriculum: [600],
  domain: "research",
  subcategory: "Advanced Topics",
  difficulty: "intermediate",
  summary:
    "Shor's algorithm factors integers in polynomial time on a quantum computer by reducing factoring to period-finding and using the quantum Fourier transform to find the period efficiently.",
  tags: ["quantum computing", "factoring", "period finding", "QFT", "cryptography"],
  prerequisites: ["Binary Exponentiation"],
  related: [],
  problem: {
    input: "A composite integer N to factor.",
    output: "A non-trivial factor of N.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Factoring is hard classically but reduces to period-finding: given a random a < N, find the smallest r such that a^r ≡ 1 (mod N). If r is even, then (a^(r/2) - 1)(a^(r/2) + 1) ≡ 0 (mod N), and GCD gives a factor. Classical period-finding is exponential, but quantum computers can find periods in polynomial time using superposition and interference.",
      },
      {
        kind: "p",
        text: "The quantum Fourier transform converts the periodic amplitude pattern of a^x mod N (computed in superposition) into a frequency measurement, from which the period r can be deduced with continued fractions.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Pick random a with 1 < a < N. If gcd(a, N) > 1, we already have a factor.",
          "Use quantum period-finding: prepare superposition |x⟩|a^x mod N⟩, apply QFT to the first register, measure to get s/r approximation.",
          "Use continued fractions to extract r from the measurement.",
          "If r is even and a^(r/2) ≢ ±1 (mod N), compute gcd(a^(r/2) ± 1, N) for factors.",
          "Repeat with new random a if needed (succeeds with high probability).",
        ],
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "The quantum circuit needs about 2n qubits and O(n^3) gates for an n-bit number.",
          "Modular exponentiation in the quantum circuit is the most expensive part.",
          "Current quantum hardware cannot factor cryptographically relevant numbers; the largest Shor factoring demonstration is 21 = 3 × 7.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The quantum Fourier transform maps |j⟩ to $(1/\\sqrt{N})\\sum_k e^{2\\pi ijk/N}|k\\rangle$ in O(n^2) gates. After measuring, continued fractions extract r from a rational approximation s/r. The algorithm runs in O((log N)^3) time — exponentially faster than the best classical algorithms (general number field sieve at ~exp(n^{1/3})).",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Shor's algorithm breaks RSA, Diffie–Hellman, and elliptic curve cryptography.",
          "Post-quantum cryptography (lattice-based, code-based, hash-based) is being standardized as a replacement.",
          "Extensions handle the discrete logarithm problem with a similar approach.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O((log N)^2 log log N)",
      average: "O((log N)^3)",
      worst: "O((log N)^3)",
    },
    space: "O(log N)",
    worstClass: "other",
    note: "Polynomial in the number of bits of N; exponentially faster than classical factoring.",
  },
  properties: [
    {
      label: "Type",
      value: "Quantum algorithm",
    },
    {
      label: "Speedup",
      value: "Exponential over classical factoring",
    },
    {
      label: "Threat",
      value: "Breaks RSA, DH, ECC when large quantum computers exist",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "classical_part_shor",
      code: `def classical_part_shor(N, a, r):
    """Classical post-processing of Shor's algorithm.
    Given N to factor, random base a, and discovered period r,
    return a non-trivial factor or None."""
    from math import gcd
    if r % 2 != 0:
        return None
    x = pow(a, r // 2, N)
    if x == N - 1:
        return None
    f1 = gcd(x - 1, N)
    f2 = gcd(x + 1, N)
    for f in [f1, f2]:
        if 1 < f < N:
            return f
    return None
`,
      tests: [
        {
          args: [15, 7, 4],
          expected: 3,
        },
        {
          args: [21, 2, 6],
          expected: 7,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "shor-reduction",
      kind: "mcq",
      prompt: "Shor's algorithm reduces integer factoring to which problem?",
      options: ["Period finding", "Graph coloring", "Satisfiability", "Shortest path"],
      answer: 0,
      explanation:
        "The key insight is that factoring reduces to finding the period of a^x mod N, which quantum computers solve efficiently.",
      hints: ["What mathematical structure does the quantum part exploit?"],
      objective: "Understand Shor's reduction",
    },
  ],
  exam: {
    definition:
      "Shor's algorithm factors integers in polynomial time on a quantum computer by reducing factoring to quantum period-finding.",
    steps: [
      "Pick random a.",
      "Quantum period-finding with QFT.",
      "Continued fractions to get r.",
      "GCD to extract factors.",
    ],
    timeComplexity: "O((log N)^3)",
    spaceComplexity: "O(log N) qubits",
    correctness:
      "Correctness from number theory: even period r gives factors via GCD with high probability.",
    applications: ["Breaking RSA/DH/ECC", "Motivating post-quantum cryptography"],
    limitations: [
      "Requires fault-tolerant quantum computer",
      "Current hardware too small for cryptographic sizes",
    ],
    faq: [
      {
        q: "When will Shor's algorithm break RSA?",
        a: "Unknown; requires millions of physical qubits for error correction. Estimates range from 2030s onwards.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Reduction to period-finding (1).", "QFT and classical post-processing (1)."],
      },
    ],
  },
  references: [
    {
      citation:
        "P. Shor, 'Polynomial-Time Algorithms for Prime Factorization and Discrete Logarithms on a Quantum Computer,' SIAM Journal on Computing, 26(5), 1997.",
      supports: "The original paper.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
