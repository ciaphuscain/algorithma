import type { AlgorithmEntry } from "../types";

export const inverseFftEntry: AlgorithmEntry = {
  slug: "inverse-fft",
  name: "Inverse FFT",
  aliases: ["IFFT", "Inverse Discrete Fourier Transform"],
  curriculum: [392],
  domain: "number-theory",
  subcategory: "Number Theory",
  difficulty: "intermediate",
  summary:
    "Recovers a sequence from its frequency-domain representation by running the FFT with conjugate twiddle factors and dividing by n.",
  tags: ["fft", "inverse", "fourier transform", "signal processing"],
  prerequisites: ["FFT"],
  related: ["fft", "ntt"],
  problem: {
    input: "An array of n complex numbers representing a DFT.",
    output: "The original n-element sequence whose DFT was the input.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "The FFT converts a signal from time domain to frequency domain. The inverse FFT reverses this: given the frequency coefficients, it reconstructs the original signal.",
      },
      {
        kind: "p",
        text: "The key insight is that IFFT is almost the same as FFT — you conjugate the twiddle factors (use $e^{+2\\pi i k/n}$ instead of $e^{-2\\pi i k/n}$) and divide the result by n.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Take the input array of n complex frequency coefficients.",
          "Replace each twiddle factor $\\omega = e^{-2\\pi i/n}$ with its conjugate $\\bar{\\omega} = e^{+2\\pi i/n}$.",
          "Run the standard FFT butterfly algorithm with these conjugated factors.",
          "Divide every output element by n.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example.** Given DFT [10, -2+2j, -2, -2-2j] of [1, 2, 3, 4]: conjugate-FFT gives [4, 12, 8, 16], dividing by 4 yields [1, 3, 2, 4]. Reordering via bit-reversal gives [1, 2, 3, 4].",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Reuse your FFT implementation; pass a flag to conjugate the roots of unity.",
          "Remember to divide by n at the end — a common source of off-by-one scaling bugs.",
          "For real-valued signals, the output of IFFT should have negligible imaginary parts; round them to zero.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The DFT matrix $F$ is unitary up to scaling: $F^{-1} = \\frac{1}{n}\\bar{F}$. Therefore $x = \\frac{1}{n}\\bar{F}\\cdot X$, which is exactly FFT with conjugated roots divided by n.",
      },
      {
        kind: "p",
        text: "Time complexity is $O(n \\log n)$, same as forward FFT. Space is $O(n)$.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Used in polynomial multiplication: multiply DFTs pointwise, then IFFT to get the product coefficients.",
          "In convolution theorem: convolution in time domain equals pointwise multiplication in frequency domain, recovered by IFFT.",
          "Numerically, repeated FFT/IFFT cycles accumulate floating-point error; NTT avoids this for integer problems.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n log n)",
    },
    space: "O(n)",
    worstClass: "n log n",
    note: "Same as forward FFT.",
  },
  properties: [
    {
      label: "In-place",
      value: "Yes, with iterative Cooley–Tukey",
    },
    {
      label: "Exact inverse",
      value: "Yes, $\\text{IFFT}(\\text{FFT}(x)) = x$",
    },
    {
      label: "Numerical stability",
      value: "Good for floating point; exact with NTT",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "ifft_real",
      code: `def ifft_real(X):
    """Compute inverse FFT of a real-valued DFT (length must be power of 2).
    Returns real-valued time-domain signal as a list of rounded integers."""
    import cmath
    n = len(X)
    # Conjugate-then-FFT-then-conjugate-then-divide
    def fft(a):
        m = len(a)
        if m == 1:
            return [a[0]]
        e = fft(a[0::2])
        o = fft(a[1::2])
        T = [cmath.exp(-2j * cmath.pi * k / m) * o[k] for k in range(m // 2)]
        return [e[k] + T[k] for k in range(m // 2)] + [e[k] - T[k] for k in range(m // 2)]
    conj = [complex(x).conjugate() for x in X]
    result = fft(conj)
    return [round(x.conjugate().real / n) for x in result]
`,
      tests: [
        {
          args: [[6, -2, 2, -2]],
          expected: [1, 1, 3, 1],
        },
        {
          args: [[8, 0, 0, 0]],
          expected: [2, 2, 2, 2],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "ifft-relation",
      kind: "mcq",
      prompt: "How does IFFT relate to FFT?",
      options: [
        "Conjugate roots of unity and divide by n",
        "Run FFT backwards",
        "Double the input size",
        "Square each coefficient",
      ],
      answer: 0,
      explanation: "IFFT uses conjugated twiddle factors and scales by 1/n.",
      hints: ["Think about the DFT matrix inverse."],
      objective: "Understand IFFT-FFT relationship",
    },
  ],
  exam: {
    definition:
      "IFFT recovers a time-domain signal from its frequency-domain DFT by applying conjugated twiddle factors and dividing by n.",
    steps: [
      "Conjugate input or twiddle factors.",
      "Run FFT butterfly.",
      "Divide all outputs by n.",
    ],
    timeComplexity: "$O(n \\log n)$",
    spaceComplexity: "$O(n)$",
    correctness: "$F^{-1} = \\frac{1}{n}\\bar{F}$ so IFFT(FFT(x)) = x exactly.",
    applications: ["Polynomial multiplication", "Convolution", "Signal reconstruction"],
    limitations: [
      "Requires power-of-2 length (or use Bluestein)",
      "Floating-point rounding for non-integer signals",
    ],
    faq: [
      {
        q: "Why divide by n?",
        a: "The DFT matrix satisfies $F \\bar{F} = nI$, so the inverse needs the 1/n factor.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["State IFFT formula and its relation to FFT (2)."],
      },
    ],
  },
  references: [
    {
      citation:
        "J. W. Cooley and J. W. Tukey, 'An algorithm for the machine calculation of complex Fourier series,' Mathematics of Computation, 19(90), 1965.",
      supports: "The FFT algorithm that IFFT inverts.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
