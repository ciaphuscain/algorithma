import type { AlgorithmEntry } from "../types";

export const fftEntry: AlgorithmEntry = {
  slug: "fft",
  name: "Fast Fourier Transform (FFT)",
  aliases: ["FFT", "Cooley–Tukey", "Discrete Fourier transform", "Fast polynomial multiplication"],
  curriculum: [391],
  domain: "number-theory",
  subcategory: "Fast transforms",
  difficulty: "advanced",
  summary:
    "Computes the discrete Fourier transform of N = 2^k values in O(N log N) by splitting into even- and odd-indexed halves. Evaluating two polynomials at the complex roots of unity, multiplying pointwise and transforming back multiplies them in O(n log n) instead of O(n²).",
  tags: [
    "fft",
    "dft",
    "roots of unity",
    "divide and conquer",
    "convolution",
    "polynomial multiplication",
  ],
  prerequisites: ["Complex numbers", "Divide and conquer", "Polynomials"],
  related: ["ntt", "merge-sort", "matrix-exponentiation"],
  problem: {
    input: "Two polynomials with integer coefficients (constant term first).",
    output: "The coefficients of their product.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A polynomial of degree below N is fixed by its values at N points. Multiplying values is cheap (one product per point), so multiply polynomials by evaluating both, multiplying the values, and turning the result back into coefficients. The catch is that evaluation at N arbitrary points costs $O(N^2)$.",
      },
      {
        kind: "p",
        text: "The FFT picks clever points: the N-th roots of unity $\\omega^k$. Split $A(x) = A_{even}(x^2) + x\\,A_{odd}(x^2)$. Squaring the N-th roots gives only N/2 distinct points, the (N/2)-th roots, so both halves are problems of half the size, and $\\omega^{k + N/2} = -\\omega^k$ lets one result serve two outputs: $A(\\omega^k) = E_k + \\omega^k O_k$ and $A(\\omega^{k+N/2}) = E_k - \\omega^k O_k$. That pair is a **butterfly**.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Pad both coefficient lists to N, the smallest power of two ≥ the product's length.",
          "Reorder each list by bit-reversed index, so the recursion's leaves sit side by side.",
          "For len = 2, 4, …, N: combine adjacent blocks with butterflies $u \\pm w^j v$, $w = e^{-2\\pi i / len}$.",
          "Multiply the two transforms pointwise; transform back with $w = e^{+2\\pi i / len}$ and divide by N; round to integers.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): $(1 + 2x + 3x^2)(4 + 5x)$, N = 4, forward root $w = e^{-2\\pi i/4} = -i$. Entry k of a transform is the value at $(-i)^k$:",
      },
      {
        kind: "table",
        head: ["k", "Point", "A", "B", "C = A · B"],
        rows: [
          ["0", "1", "6", "9", "54"],
          ["1", "−i", "−2 − 2i", "4 − 5i", "−18 + 2i"],
          ["2", "−1", "2", "−1", "−2"],
          ["3", "i", "−2 + 2i", "4 + 5i", "−18 − 2i"],
        ],
      },
      {
        kind: "p",
        text: "The inverse transform and division by 4 return [4, 13, 22, 15]. The tiny floating-point errors (here below $10^{-15}$) disappear when rounding.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Iterative, in-place versions (bit reversal, then stages) avoid recursion and copying; the Python sample shows the recursive form for clarity.",
          "Precompute twiddle factors $w^j$ per stage instead of multiplying them up, which accumulates rounding error.",
          "Rounding is safe while the error stays well below 0.5. With 64-bit doubles that limits coefficient sizes and lengths; split large coefficients into smaller digits, or use the NTT for exact results.",
          "Two real polynomials can share one complex FFT (one as the real part, one as the imaginary part).",
          "Production code uses tuned libraries (FFTW, cuFFT, pocketfft in NumPy) with mixed radices for any N.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Recurrence.** Two half-size transforms plus N/2 butterflies:",
      },
      { kind: "math", tex: "T(N) = 2\\,T(N/2) + \\Theta(N) = \\Theta(N \\log N)" },
      {
        kind: "p",
        text: "**Inverse.** The DFT matrix $F_{jk} = \\omega^{jk}$ satisfies $F \\bar{F} = N I$ because $\\sum_{k} \\omega^{(j - l)k} = 0$ for $j \\ne l$. So the inverse transform is the same algorithm with $\\omega^{-1}$, divided by N.",
      },
      {
        kind: "p",
        text: "**Convolution theorem.** The coefficients of A·B are the convolution of their coefficient lists, and the DFT turns convolution into pointwise multiplication; padding to N ≥ |A| + |B| − 1 prevents wrap-around. The property tests compare every product with the schoolbook $O(n^2)$ method.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Cooley and Tukey's 1965 paper made the method widely known; Gauss had used the same idea around 1805.",
          "Applications go far beyond polynomials: signal and image processing, spectral methods for differential equations, JPEG-style transforms (DCT), and big-integer multiplication.",
          "Split-radix and other variants reduce the operation count; Bluestein's algorithm handles any N.",
          "Over finite fields the same algorithm is the NTT, exact and free of rounding.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(n \\log n)", average: "O(n \\log n)", worst: "O(n \\log n)" },
    space: "O(n)",
    worstClass: "n log n",
    note: "n = number of product coefficients; floating-point arithmetic.",
  },
  properties: [
    { label: "Butterflies", value: "$\\tfrac{N}{2} \\log_2 N$ per transform" },
    { label: "Exactness", value: "Rounding error; round to integers at the end" },
  ],
  implementations: [
    {
      language: "python",
      entry: "poly_multiply",
      code: `import cmath


def fft(a, invert=False):
    n = len(a)
    if n == 1:
        return a
    even, odd = fft(a[0::2], invert), fft(a[1::2], invert)
    sign = 1 if invert else -1
    out = [0] * n
    for k in range(n // 2):
        t = cmath.exp(sign * 2j * cmath.pi * k / n) * odd[k]
        out[k], out[k + n // 2] = even[k] + t, even[k] - t
    return out


def poly_multiply(a, b):
    n = 1
    while n < len(a) + len(b) - 1:
        n *= 2
    fa = fft([complex(x) for x in a] + [0] * (n - len(a)))
    fb = fft([complex(x) for x in b] + [0] * (n - len(b)))
    c = fft([p * q for p, q in zip(fa, fb)], invert=True)
    return [round((v / n).real) for v in c[: len(a) + len(b) - 1]]
`,
      tests: [
        {
          args: [
            [1, 2, 3],
            [4, 5],
          ],
          expected: [4, 13, 22, 15],
        },
        {
          args: [
            [1, -1],
            [1, 1, 1, 1],
          ],
          expected: [1, 0, 0, 0, -1],
        },
      ],
    },
    {
      language: "javascript",
      entry: "fftMultiply",
      code: `// Polynomial product with an iterative complex FFT, rounded to integers.
function fftMultiply(a, b) {
  let n = 1;
  while (n < a.length + b.length - 1) n *= 2;
  const transform = (re, im, invert) => {
    for (let i = 1, j = 0; i < n; i++) {
      let bit = n >> 1;
      for (; j & bit; bit >>= 1) j ^= bit;
      j |= bit;
      if (i < j) {
        [re[i], re[j]] = [re[j], re[i]];
        [im[i], im[j]] = [im[j], im[i]];
      }
    }
    for (let len = 2; len <= n; len *= 2) {
      const ang = ((invert ? 2 : -2) * Math.PI) / len;
      for (let i = 0; i < n; i += len)
        for (let k = 0; k < len / 2; k++) {
          const [wr, wi] = [Math.cos(ang * k), Math.sin(ang * k)];
          const p = i + k, q = p + len / 2;
          const tr = re[q] * wr - im[q] * wi, ti = re[q] * wi + im[q] * wr;
          [re[q], im[q]] = [re[p] - tr, im[p] - ti];
          [re[p], im[p]] = [re[p] + tr, im[p] + ti];
        }
    }
  };
  const pad = (v) => [...v, ...Array(n - v.length).fill(0)];
  const [ar, ai, br, bi] = [pad(a), Array(n).fill(0), pad(b), Array(n).fill(0)];
  transform(ar, ai, false);
  transform(br, bi, false);
  const cr = ar.map((x, i) => x * br[i] - ai[i] * bi[i]);
  const ci = ar.map((x, i) => x * bi[i] + ai[i] * br[i]);
  transform(cr, ci, true);
  return cr.slice(0, a.length + b.length - 1).map((x) => Math.round(x / n) || 0);
}
`,
      tests: [
        {
          args: [
            [1, 2, 3],
            [4, 5],
          ],
          expected: [4, 13, 22, 15],
        },
        {
          args: [
            [1, 2, 1],
            [1, 2, 1],
          ],
          expected: [1, 4, 6, 4, 1],
        },
      ],
    },
  ],
  visualizer: "fft",
  practice: [
    {
      id: "fft-butterflies",
      kind: "numeric",
      prompt: "How many butterflies does one FFT of size N = 8 perform?",
      answer: 12,
      explanation: "log₂ 8 = 3 stages of N/2 = 4 butterflies.",
      hints: ["Count the stages and the butterflies per stage."],
      objective: "Count FFT work",
    },
    {
      id: "fft-why-roots",
      kind: "mcq",
      prompt: "Why does the FFT evaluate at roots of unity rather than at 0, 1, 2, …?",
      options: [
        "Squaring the N-th roots of unity gives the N/2-th roots, so the problem halves at every level",
        "Because polynomials are only defined at roots of unity",
        "Because roots of unity are integers",
        "To avoid multiplying values pointwise",
      ],
      answer: 0,
      explanation:
        "With A(x) = E(x²) + x·O(x²), both halves only need values at the squares of the points; for roots of unity there are half as many squares, and ω^(k+N/2) = −ω^k pairs the outputs.",
      distractors: {
        1: "Polynomials can be evaluated anywhere; any N distinct points determine them.",
        2: "Apart from ±1 they are complex numbers.",
        3: "Pointwise multiplication is the whole point of evaluating.",
      },
      hints: ["What happens to the set of points when you square them?"],
      objective: "Understand the divide-and-conquer structure",
    },
  ],
  exam: {
    definition:
      "The fast Fourier transform computes the DFT X_k = Σ x_j ω^(jk) of N = 2^k values in O(N log N) by recursively splitting even- and odd-indexed terms and combining them with butterflies.",
    steps: [
      "Pad to N = 2^k.",
      "Bit-reverse; for len = 2 … N combine with u ± w^j v.",
      "Pointwise multiply two transforms.",
      "Inverse FFT (conjugate root), divide by N, round.",
    ],
    timeComplexity: "$O(n \\log n)$.",
    spaceComplexity: "$O(n)$.",
    correctness:
      "A(x) = E(x²) + x·O(x²) and ω^(k+N/2) = −ω^k give the recurrence; the inverse uses F·F̄ = N·I; the convolution theorem gives the product.",
    applications: [
      "Polynomial and big-integer multiplication",
      "Signal processing and filtering",
      "Image compression",
      "Solving PDEs (spectral methods)",
    ],
    limitations: ["Floating-point rounding error", "Plain radix-2 needs power-of-two sizes"],
    faq: [
      {
        q: "What is a butterfly?",
        a: "The pair of outputs u + wv and u − wv computed from two inputs; drawn as a diagram, the crossing lines look like butterfly wings.",
      },
    ],
    answers: [
      { marks: 2, outline: ["Divide-and-conquer DFT at roots of unity.", "$O(n \\log n)$."] },
      {
        marks: 5,
        outline: [
          "DFT and roots of unity (1).",
          "Even/odd split and butterflies (2).",
          "Recurrence (1).",
          "Multiplication application (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Evaluation–interpolation idea (2).",
          "Even/odd split and the halving lemma (2).",
          "Iterative algorithm with bit reversal (2).",
          "Inverse transform proof (2).",
          "Worked example and complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "J. W. Cooley, J. W. Tukey, “An algorithm for the machine calculation of complex Fourier series,” Mathematics of Computation, 19(90), 1965.",
      supports: "The radix-2 FFT.",
    },
    {
      citation:
        "T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 3rd ed., MIT Press, 2009, ch. 30.",
      supports:
        "Polynomial multiplication with the FFT, the iterative implementation and the inverse transform.",
    },
    {
      citation:
        "M. T. Heideman, D. H. Johnson, C. S. Burrus, “Gauss and the history of the fast Fourier transform,” IEEE ASSP Magazine, 1(4), 1984.",
      supports: "Gauss's earlier use of the method.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-23",
};
