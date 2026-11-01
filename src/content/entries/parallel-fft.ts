import type { AlgorithmEntry } from "../types";

export const parallelFftEntry: AlgorithmEntry = {
  slug: "parallel-fft",
  name: "Parallel FFT",
  aliases: ["Parallel Fast Fourier Transform"],
  curriculum: [465],
  domain: "parallel",
  subcategory: "Parallel Algorithms",
  difficulty: "intermediate",
  summary:
    "Computes the discrete Fourier transform of n points in O(log n) parallel depth by executing the butterfly operations of each FFT stage simultaneously across processors.",
  tags: ["parallel", "FFT", "Fourier transform", "butterfly"],
  prerequisites: ["FFT"],
  related: ["fft-fast-fourier-transform"],
  problem: {
    input: "An array of n complex numbers (n a power of 2) and p processors.",
    output: "The DFT of the array, computed in parallel.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "The FFT has log n stages, and within each stage, all butterfly operations are independent — they read from and write to disjoint pairs of array elements. This makes FFT naturally parallel: each stage can run in O(1) depth with n/2 processors.",
      },
      {
        kind: "p",
        text: "The total parallel depth is O(log n), compared to O(n log n) sequential time, giving near-perfect speedup.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Bit-reverse the input array (can be done in parallel with O(n) work, O(1) depth).",
          "For each of log n stages, execute all n/2 butterfly operations in parallel.",
          "Each butterfly reads two elements, multiplies one by a twiddle factor, and writes the sum and difference back.",
        ],
      },
      {
        kind: "p",
        text: "**Example:** n=4, two stages. Stage 1: pairs (0,1) and (2,3) in parallel. Stage 2: pairs (0,2) and (1,3) in parallel.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "On shared-memory machines, each processor handles n/(2p) butterflies per stage.",
          "On distributed memory, data must be redistributed between stages (all-to-all communication).",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Work: $O(n \\log n)$. Span (parallel depth): $O(\\log n)$ with $n/2$ processors per stage. Communication cost on distributed systems is $O(n \\log n / p)$ with $O(\\log p)$ communication rounds.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "The butterfly network topology mirrors the FFT computation graph.",
          "GPU-based FFT (cuFFT) achieves very high throughput for large transforms.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n log n / p)",
      average: "O(n log n / p)",
      worst: "O(n log n / p)",
    },
    space: "O(n)",
    worstClass: "n log n",
    note: "Span is O(log n); near-perfect speedup with p = n/2 processors.",
  },
  properties: [
    {
      label: "Work",
      value: "$O(n \\log n)$",
    },
    {
      label: "Span",
      value: "$O(\\log n)$",
    },
    {
      label: "Parallelism",
      value: "$O(n)$ — each butterfly is independent",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "parallel_fft",
      code: `import cmath

def parallel_fft(a):
    """Iterative FFT (simulates parallel butterfly stages). Returns DFT of a."""
    n = len(a)
    # Bit-reversal permutation
    j = 0
    result = list(a)
    for i in range(1, n):
        bit = n >> 1
        while j & bit:
            j ^= bit
            bit >>= 1
        j ^= bit
        if i < j:
            result[i], result[j] = result[j], result[i]
    # Butterfly stages
    length = 2
    while length <= n:
        w = cmath.exp(-2j * cmath.pi / length)
        for i in range(0, n, length):
            wn = 1
            for k in range(length // 2):
                u = result[i + k]
                v = result[i + k + length // 2] * wn
                result[i + k] = u + v
                result[i + k + length // 2] = u - v
                wn *= w
        length *= 2
    return [round(x.real, 6) + round(x.imag, 6) * 1j for x in result]
`,
      tests: [
        {
          args: [[1, 1, 1, 1]],
          expected: [
            {
              __complex__: [4.0, 0.0],
            },
            {
              __complex__: [0.0, 0.0],
            },
            {
              __complex__: [0.0, 0.0],
            },
            {
              __complex__: [0.0, 0.0],
            },
          ],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "pfft-span",
      kind: "mcq",
      prompt: "What is the parallel depth (span) of FFT on n points?",
      options: ["O(log n)", "O(n)", "O(n log n)", "O(1)"],
      answer: 0,
      explanation:
        "FFT has log n stages, each with independent butterfly operations that run in O(1) depth.",
      hints: ["How many stages does FFT have?"],
      objective: "Understand parallel FFT span",
    },
  ],
  exam: {
    definition:
      "Parallel FFT computes the DFT in O(log n) parallel stages, each with n/2 independent butterfly operations.",
    steps: [
      "Bit-reverse permutation.",
      "For each of log n stages: execute all butterflies in parallel.",
      "Each butterfly: twiddle multiply, add, subtract.",
    ],
    timeComplexity: "$O(n \\log n / p)$ with p processors.",
    spaceComplexity: "$O(n)$.",
    correctness: "Each stage's butterflies are independent; log n stages give O(log n) span.",
    applications: ["Signal processing on GPUs", "Large-scale polynomial multiplication"],
    limitations: ["Communication overhead on distributed memory"],
    faq: [
      {
        q: "Why is FFT naturally parallel?",
        a: "Within each stage, butterflies operate on disjoint pairs, so they can all execute simultaneously.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Butterfly independence and span analysis (2)."],
      },
    ],
  },
  references: [
    {
      citation:
        "A. V. Oppenheim, R. W. Schafer, Discrete-Time Signal Processing, 3rd ed., Pearson, 2010.",
      supports: "Iterative FFT with butterfly structure.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
