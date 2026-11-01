import type { AlgorithmEntry } from "../types";

export const derangementsEntry: AlgorithmEntry = {
  slug: "derangements",
  name: "Derangements",
  aliases: ["Subfactorial", "!n"],
  curriculum: [383],
  domain: "number-theory",
  subcategory: "Number Theory",
  difficulty: "intermediate",
  summary:
    "Counts permutations where no element appears in its original position, using the recurrence D(n) = (n−1)(D(n−1) + D(n−2)).",
  tags: ["combinatorics", "permutation", "recurrence", "inclusion-exclusion"],
  prerequisites: ["Recursion"],
  related: ["inclusion-exclusion-principle", "binomial-coefficient-dp"],
  problem: {
    input: "A non-negative integer n.",
    output: "The number of derangements of n elements, D(n).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A derangement is a permutation where nothing stays in place — every element moves. For example with three items {1,2,3}, the derangements are (2,3,1) and (3,1,2). The fraction of permutations that are derangements converges to 1/e ≈ 0.368 as n grows.",
      },
      {
        kind: "p",
        text: "The count follows a neat recurrence: element 1 must go to some position k (n−1 choices). Then either k goes to 1 (leaving n−2 items to derange) or k goes elsewhere (leaving n−1 items to derange). This gives D(n) = (n−1)(D(n−1) + D(n−2)).",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Base cases: D(0) = 1 (the empty permutation is vacuously a derangement), D(1) = 0.",
          "For each n from 2 upward, compute D(n) = (n − 1) × (D(n − 1) + D(n − 2)).",
          "Return D(n).",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** for n = 4:",
      },
      {
        kind: "table",
        head: ["n", "D(n)", "Calculation"],
        rows: [
          ["0", "1", "base"],
          ["1", "0", "base"],
          ["2", "1", "1 × (0 + 1)"],
          [
            "3",
            "2",
            "2 × (1 + 0) — but actually 2 × (1 + 1) = wait — let me restate: D(3) = 2 × (D(2) + D(1)) = 2 × (1 + 0) = 2",
          ],
          ["4", "9", "3 × (D(3) + D(2)) = 3 × (2 + 1) = 9"],
        ],
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "The iterative bottom-up approach needs only two previous values, so O(1) space suffices.",
          "For large n, use modular arithmetic if only D(n) mod p is needed.",
          "The closed form is D(n) = n! × Σ(−1)^k / k! for k = 0..n, or equivalently round(n!/e).",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Recurrence:** D(n) = (n−1)(D(n−1) + D(n−2)), with D(0) = 1, D(1) = 0.",
      },
      {
        kind: "p",
        text: "**Closed form:** D(n) = n! Σ_{k=0}^{n} (−1)^k / k!, which equals the nearest integer to n!/e for n ≥ 1. This follows from inclusion-exclusion on the n events 'element i is fixed'.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "The probability that a random permutation is a derangement approaches 1/e as n → ∞.",
          "The exponential generating function for derangements is e^{-x}/(1-x).",
          "Generalized derangements (no element within distance d of its original position) arise in combinatorics and coding theory.",
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
    space: "O(1)",
    worstClass: "n",
    note: "Bottom-up DP with two variables.",
  },
  properties: [
    {
      label: "Type",
      value: "Counting / Combinatorics",
    },
    {
      label: "Approach",
      value: "Dynamic programming recurrence",
    },
    {
      label: "Limit",
      value: "D(n)/n! → 1/e ≈ 0.3679",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "derangements",
      code: `def derangements(n):
    """Return the number of derangements of n elements."""
    if n == 0:
        return 1
    if n == 1:
        return 0
    a, b = 1, 0  # D(0), D(1)
    for i in range(2, n + 1):
        a, b = b, (i - 1) * (b + a)
    return b
`,
      tests: [
        {
          args: [0],
          expected: 1,
        },
        {
          args: [1],
          expected: 0,
        },
        {
          args: [4],
          expected: 9,
        },
        {
          args: [5],
          expected: 44,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "derangements-recurrence",
      kind: "mcq",
      prompt: "What is D(3), the number of derangements of 3 elements?",
      options: ["2", "3", "1", "6"],
      answer: 0,
      explanation:
        "D(3) = 2 × (D(2) + D(1)) = 2 × (1 + 0) = 2. The two derangements are (2,3,1) and (3,1,2).",
      hints: ["Use the recurrence D(n) = (n−1)(D(n−1) + D(n−2))."],
      objective: "Apply the derangement recurrence",
    },
  ],
  exam: {
    definition:
      "A derangement is a permutation with no fixed points. D(n) = (n−1)(D(n−1) + D(n−2)).",
    steps: ["D(0)=1, D(1)=0.", "For i=2..n: D(i) = (i−1)(D(i−1)+D(i−2)).", "Return D(n)."],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    correctness: "Follows from inclusion-exclusion on fixed points.",
    applications: ["Counting problems", "Probability of no fixed points"],
    limitations: ["Only counts exact derangements, not partial displacements"],
    faq: [
      {
        q: "What is D(n)/n! as n→∞?",
        a: "1/e ≈ 0.3679.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["State the recurrence and base cases.", "Compute D(4) = 9."],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 3rd ed., MIT Press, 2009.",
      supports: "Inclusion-exclusion background.",
    },
    {
      citation:
        "R. P. Stanley, Enumerative Combinatorics, Vol. 1, Cambridge University Press, 2012.",
      supports: "Derangement generating functions and asymptotics.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
