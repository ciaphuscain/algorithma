import type { AlgorithmEntry } from "../types";

export const segmentedSieveEntry: AlgorithmEntry = {
  slug: "segmented-sieve",
  name: "Segmented Sieve",
  aliases: [
    "Segmented Sieve",
  ],
  curriculum: [
    364,
  ],
  domain: "number-theory",
  subcategory: "Number Theory",
  difficulty: "intermediate",
  summary: "Finds primes in a range [L, R] by sieving segments of size √R, using only O(√R) memory instead of O(R).",
  tags: [
    "sieve",
    "prime",
    "segmented",
    "number theory",
  ],
  prerequisites: [
    "Sieve of Eratosthenes",
  ],
  related: [
    "sieve",
    "linear-sieve",
  ],
  problem: {
    input: "Integers L and R with 2 ≤ L ≤ R.",
    output: "All primes in [L, R].",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "To find primes up to R, we only need primes up to √R for sieving. Process the range in chunks that fit in cache, using the small primes to cross off composites in each chunk.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "First, find all primes up to √R using a regular sieve.",
          "Divide [L, R] into segments of size ≈ √R.",
          "For each segment, use the small primes to mark composites.",
          "Unmarked numbers in each segment are prime.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "For each small prime p, start crossing off at the first multiple of p ≥ L: max(p*p, ceil(L/p)*p).",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Time $O((R-L+1) \\log \\log R + \\sqrt{R})$. Space $O(\\sqrt{R})$ — the key advantage over a full sieve.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Essential for Project Euler and competitive programming with large ranges.",
          "Cache-friendly: each segment fits in L1 cache.",
          "Can enumerate primes up to 10^12 with only ~10^6 memory.",
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
      label: "Domain",
      value: "number theory",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "segmented_sieve",
      code: `def segmented_sieve(lo, hi):
    """Return all primes in [lo, hi]."""
    import math
    if hi < 2: return []
    lo = max(lo, 2)
    lim = int(math.isqrt(hi)) + 1
    # small primes
    is_p = [True] * lim
    is_p[0] = is_p[1] = False
    for i in range(2, lim):
        if is_p[i]:
            for j in range(i*i, lim, i):
                is_p[j] = False
    small = [i for i in range(2, lim) if is_p[i]]
    # sieve segment
    seg = [True] * (hi - lo + 1)
    for p in small:
        start = max(p * p, ((lo + p - 1) // p) * p)
        for j in range(start, hi + 1, p):
            seg[j - lo] = False
    if lo <= 1:
        for i in range(min(2 - lo, len(seg))):
            seg[i] = False
    return [lo + i for i in range(len(seg)) if seg[i]]
`,
      tests: [
        {
          args: [
            10,
            30,
          ],
          expected: [
            11,
            13,
            17,
            19,
            23,
            29,
          ],
        },
        {
          args: [
            2,
            10,
          ],
          expected: [
            2,
            3,
            5,
            7,
          ],
        },
      ],
    },
    {
      language: "javascript",
      entry: "segmentedSieve",
      code: `function segmentedSieve(lo, hi) {
  if (hi < 2) return [];
  lo = Math.max(lo, 2);
  const lim = Math.floor(Math.sqrt(hi)) + 1;
  const isP = new Array(lim).fill(true);
  isP[0] = isP[1] = false;
  for (let i = 2; i < lim; i++)
    if (isP[i]) for (let j = i*i; j < lim; j += i) isP[j] = false;
  const small = [];
  for (let i = 2; i < lim; i++) if (isP[i]) small.push(i);
  const seg = new Array(hi - lo + 1).fill(true);
  for (const p of small) {
    let start = Math.max(p * p, Math.ceil(lo / p) * p);
    for (let j = start; j <= hi; j += p) seg[j - lo] = false;
  }
  const result = [];
  for (let i = 0; i < seg.length; i++) if (seg[i]) result.push(lo + i);
  return result;
}
`,
      tests: [
        {
          args: [
            10,
            30,
          ],
          expected: [
            11,
            13,
            17,
            19,
            23,
            29,
          ],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "segmented-sieve-q1",
      kind: "mcq",
      prompt: "What is the main advantage of a segmented sieve over a regular sieve?",
      options: [
        "Uses O(√n) memory instead of O(n)",
        "Runs faster",
        "Finds primes in any range",
        "Is easier to implement",
      ],
      answer: 0,
      explanation: "The segmented sieve processes the range in chunks, needing only O(√R) space for the small primes and one segment.",
      hints: [
        "Think about the algorithm's key property.",
      ],
      objective: "Understanding",
    },
  ],
  exam: {
    definition: "Finds primes in a range [L, R] by sieving segments of size √R, using only O(√R) memory instead of O(R).",
    steps: [
      "First, find all primes up to √R using a regular sieve.",
      "Divide [L, R] into segments of size ≈ √R.",
      "For each segment, use the small primes to mark composites.",
      "Unmarked numbers in each segment are prime.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: [
      "number-theory applications",
    ],
    limitations: [
      "Specific to its problem domain",
    ],
    faq: [
      {
        q: "When should you use Segmented Sieve?",
        a: "Finds primes in a range [L, R] by sieving segments of size √R, using only O(√R) memory instead of O(R).",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Segmented Sieve (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "General reference for Segmented Sieve.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
