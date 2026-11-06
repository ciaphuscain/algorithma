import type { AlgorithmEntry } from "../types";

export const berlekampMasseyEntry: AlgorithmEntry = {
  slug: "berlekamp-massey",
  name: "Berlekamp-Massey",
  aliases: ["Berlekamp-Massey Algorithm"],
  curriculum: [529],
  domain: "number-theory",
  subcategory: "Number Theory",
  difficulty: "intermediate",
  summary:
    "Finds the shortest linear recurrence that generates a given sequence, running in O(n^2) time, widely used in coding theory and competitive programming.",
  tags: ["linear recurrence", "sequence", "coding theory", "competitive programming"],
  prerequisites: ["Linear Algebra", "Modular Arithmetic"],
  related: ["matrix-exponentiation"],
  problem: {
    input: "A sequence of n elements from a field (e.g., integers mod p).",
    output: "The shortest linear recurrence relation that generates the sequence.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Given a sequence s_0, s_1, ..., s_{n-1}, we want to find the shortest list of coefficients c_1, ..., c_d such that s_i = c_1*s_{i-1} + ... + c_d*s_{i-d} for all valid i. This is the minimal polynomial of the sequence.",
      },
      {
        kind: "p",
        text: "Berlekamp-Massey builds this incrementally: process one element at a time, and whenever the current recurrence fails to predict the next element (a 'discrepancy'), extend it using a previously stored recurrence.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Start with the empty recurrence (length 0).",
          "For each new element s_i: compute the discrepancy d = s_i - (predicted value from current recurrence).",
          "If d = 0, the current recurrence still works; continue.",
          "If d != 0, update the recurrence using the stored backup to correct the discrepancy.",
          "If the new recurrence is longer, save the old one as the backup.",
          "The final recurrence has minimum length.",
        ],
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "All arithmetic is typically done modulo a prime p.",
          "Store the best previous recurrence and the position where it last changed.",
          "The output length d satisfies 2d <= n, so at least 2d terms are needed to determine a recurrence of length d.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Time**: O(n * d) where d is the recurrence length, worst case O(n^2).",
      },
      {
        kind: "p",
        text: "**Correctness**: At each step, the algorithm maintains a recurrence consistent with all elements seen so far. The update rule ensures minimality by choosing the shortest extension.",
      },
      {
        kind: "p",
        text: "The algorithm is equivalent to computing the GCD of two polynomials via the extended Euclidean algorithm.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "In coding theory, it decodes BCH and Reed-Solomon codes by finding the error-locator polynomial.",
          "Combined with matrix exponentiation, it can find the k-th term of a linear recurrence in O(d^2 log k) after O(n*d) preprocessing.",
          "Kitamasa's method uses Berlekamp-Massey output to evaluate recurrences at arbitrary positions.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n * d)",
      worst: "O(n^2)",
    },
    space: "O(n)",
    worstClass: "n^2",
    note: "d is the length of the minimal recurrence.",
  },
  properties: [
    {
      label: "Output",
      value: "Minimal linear recurrence",
    },
    {
      label: "Field",
      value: "Any field (typically Z/pZ)",
    },
    {
      label: "Online",
      value: "Processes elements one at a time",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "bm_test",
      code: `def berlekamp_massey(s, mod=998244353):
    """Find shortest linear recurrence for sequence s modulo mod."""
    n = len(s)
    cur = []  # current recurrence coefficients
    lst = []  # last recurrence before length change
    cur_delta = 1
    lst_delta = 1
    lst_pos = -1
    for i in range(n):
        # Compute discrepancy
        d = s[i]
        for j, c in enumerate(cur):
            d = (d - c * s[i - 1 - j]) % mod
        if d == 0:
            continue
        if lst_pos == -1:
            # First nonzero: recurrence is just length i+1 of zeros
            cur = [0] * (i + 1)
            lst_pos = i
            lst_delta = d
            continue
        factor = d * pow(lst_delta, mod - 2, mod) % mod
        shift = i - lst_pos - 1
        new = list(cur) + [0] * max(0, shift + len(lst) + 1 - len(cur))
        new[shift] = (new[shift] + factor) % mod
        for j, c in enumerate(lst):
            new[shift + 1 + j] = (new[shift + 1 + j] - factor * c) % mod
        if len(cur) < len(new):
            lst = cur
            lst_delta = d
            lst_pos = i
        cur = new
    return [c % mod for c in cur]

def bm_test(s):
    """Test BM: return recurrence length."""
    return len(berlekamp_massey(s))
`,
      tests: [
        {
          args: [[1, 1, 2, 3, 5, 8, 13, 21]],
          expected: 2,
        },
        {
          args: [[1, 2, 4, 8, 16, 32]],
          expected: 1,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "bm-min",
      kind: "mcq",
      prompt:
        "How many terms of a sequence are needed to determine a linear recurrence of length d?",
      options: ["d", "2d", "d^2", "d + 1"],
      answer: 1,
      explanation:
        "You need at least 2d terms: d to establish the recurrence and d more to confirm it.",
      hints: ["Think about the degrees of freedom."],
      objective: "Know Berlekamp-Massey requirements",
    },
  ],
  exam: {
    definition:
      "Berlekamp-Massey finds the shortest linear recurrence generating a sequence in O(n^2), processing elements online and updating when discrepancies occur.",
    steps: [
      "Start with empty recurrence",
      "For each element, compute discrepancy",
      "If nonzero, update using stored backup",
      "Track shortest recurrence",
    ],
    timeComplexity: "O(n^2) worst case",
    spaceComplexity: "O(n)",
    correctness:
      "At each step, the recurrence is consistent with all seen elements. The update uses the last change point to minimize the new length.",
    applications: ["BCH/RS decoding", "Competitive programming", "Sequence analysis"],
    limitations: [
      "Requires a field (division must be possible)",
      "2d terms needed for length-d recurrence",
    ],
    faq: [
      {
        q: "What if the sequence is not linearly recurrent?",
        a: "The algorithm still returns a recurrence of length at most ceil(n/2), but it may not predict future terms.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Online discrepancy-driven minimal recurrence finding (2)"],
      },
    ],
  },
  references: [
    {
      citation:
        "E. R. Berlekamp, 'Nonbinary BCH decoding,' IEEE Trans. Information Theory, 14(2), 1968.",
      supports: "Original algorithm for BCH decoding.",
    },
    {
      citation:
        "J. L. Massey, 'Shift-register synthesis and BCH decoding,' IEEE Trans. Information Theory, 15(1), 1969.",
      supports: "Simplified formulation.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
