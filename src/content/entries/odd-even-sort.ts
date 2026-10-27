import type { AlgorithmEntry } from "../types";

export const oddEvenSortEntry: AlgorithmEntry = {
  slug: "odd-even-sort",
  name: "Odd-Even Sort",
  aliases: ["Odd–even transposition sort", "Brick sort", "Parity sort"],
  curriculum: [15],
  domain: "searching-sorting",
  subcategory: "Elementary sorting",
  difficulty: "beginner",
  summary:
    "Alternately compare-and-swap the pairs starting at odd positions and those starting at even positions. The pairs in a phase are independent, so with one processor per pair each phase takes one step and n phases always suffice.",
  tags: ["sorting", "parallel", "sorting network", "stable", "bubble sort"],
  prerequisites: ["Bubble sort"],
  related: ["bubble-sort", "cocktail-shaker-sort"],
  problem: {
    input: "An array of numbers.",
    output: "The same numbers in non-decreasing order.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Picture the elements as people in a line, each allowed to swap only with a neighbour. In one round, everyone in an odd position compares with the person to their right — all at once, since no two pairs overlap. In the next round, everyone in an even position does. Alternating these rounds sorts the line.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Odd phase: for i = 1, 3, 5, …: if A[i] > A[i + 1], swap.",
          "Even phase: for i = 0, 2, 4, …: if A[i] > A[i + 1], swap.",
          "Repeat until two consecutive phases make no swap (sequentially) — or run exactly n phases (as a fixed network).",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): [5, 1, 4, 2, 8] sorts after 6 phases and 4 swaps; reversed [9, 8, …, 2] needs 10 phases, the last two of which only confirm the order, and 28 swaps — one per inversion.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "As a sorting network it has n phases of about n/2 comparators each — Θ(n²) comparators, but depth n.",
          "Used on mesh-connected and SIMD machines where each processor talks only to its neighbours.",
          "Stable, because only adjacent elements are swapped and equal ones never are.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Cost.** Sequentially O(n²); with n/2 processors, O(n) time. **Correctness:** n phases sort any input — a classic result proved with the 0–1 principle (Knuth, TAOCP Vol. 3, §5.3.4): it suffices to check inputs of 0s and 1s, where each 1 moves right at most once per phase and is delayed by at most one phase by the 1s to its right. The tests check the output, that swaps equal inversions, and that the sequential version stops within 2⌈n/2⌉ + 2 phases (n to sort, rounded up to whole odd–even pairs, plus one pair that confirms the order).",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Batcher's odd–even merge sort and bitonic sort reach depth O(log² n).",
          "Habermann (1972) analysed the parallel version for linear arrays of processors.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n²)",
      worst: "O(n²)",
    },
    space: "O(1)",
    worstClass: "n^2",
    note: "With one processor per pair: O(n) parallel time.",
  },
  properties: [
    {
      label: "Stable",
      value: "Yes",
    },
    {
      label: "Parallel depth",
      value: "n phases",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "odd_even_sort",
      code: `def odd_even_sort(a):
    a = list(a)
    done = False
    while not done:
        done = True
        for start in (1, 0):
            for i in range(start, len(a) - 1, 2):
                if a[i] > a[i + 1]:
                    a[i], a[i + 1] = a[i + 1], a[i]
                    done = False
    return a
`,
      tests: [
        {
          args: [[5, 1, 4, 2, 8]],
          expected: [1, 2, 4, 5, 8],
        },
        {
          args: [[3, 2, 3, 8, 5, 6, 4, 1]],
          expected: [1, 2, 3, 3, 4, 5, 6, 8],
        },
      ],
    },
    {
      language: "javascript",
      entry: "network",
      code: `// Run exactly n phases (the sorting-network form) and return the result.
function network(input) {
  const a = [...input];
  for (let phase = 0; phase < a.length; phase++)
    for (let i = phase % 2; i + 1 < a.length; i += 2)
      if (a[i] > a[i + 1]) [a[i], a[i + 1]] = [a[i + 1], a[i]];
  return a;
}
`,
      tests: [
        {
          args: [[9, 8, 7, 6, 5, 4, 3, 2]],
          expected: [2, 3, 4, 5, 6, 7, 8, 9],
        },
        {
          args: [[1, 0, 1, 0, 1, 0]],
          expected: [0, 0, 0, 1, 1, 1],
        },
      ],
    },
  ],
  visualizer: "odd-even-sort",
  practice: [
    {
      id: "oe-parallel",
      kind: "mcq",
      prompt: "Why can all comparisons in one phase run at the same time?",
      options: [
        "The pairs in a phase do not share any element",
        "Each pair is already sorted",
        "Only one pair is compared per phase",
        "The array is split in two halves",
      ],
      answer: 0,
      explanation:
        "Odd phases use pairs (1,2), (3,4), …; even phases (0,1), (2,3), … — disjoint in each phase.",
      distractors: {
        "1": "Pairs may be out of order — that is why they are compared.",
        "2": "About n/2 pairs are compared per phase.",
        "3": "There is no split into halves.",
      },
      hints: ["Can two pairs in one phase touch the same position?"],
      objective: "Parallelism",
    },
    {
      id: "oe-phases",
      kind: "numeric",
      prompt: "As a fixed network, how many phases guarantee that 16 elements are sorted?",
      answer: 16,
      explanation: "n phases always suffice.",
      hints: ["The bound is n."],
      objective: "Depth",
    },
  ],
  exam: {
    definition:
      "Odd–even transposition sort alternates compare-exchanges of odd-indexed and even-indexed neighbour pairs.",
    steps: ["Odd phase.", "Even phase.", "Repeat (n phases suffice)."],
    timeComplexity: "O(n²) sequential; O(n) with n/2 processors.",
    spaceComplexity: "$O(1)$.",
    correctness: "n phases sort any input (0–1 principle).",
    applications: ["Mesh and SIMD sorting", "Sorting networks"],
    limitations: ["Θ(n²) work"],
    faq: [
      {
        q: "How does it relate to bubble sort?",
        a: "It performs bubble sort's adjacent exchanges, reorganised so that each phase is parallel.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Phases (2).", "Parallelism (2).", "n-phase bound (1)."],
      },
    ],
  },
  references: [
    {
      citation:
        "D. E. Knuth, The Art of Computer Programming, Vol. 3: Sorting and Searching, 2nd ed., Addison-Wesley, 1998, Section 5.3.4.",
      supports: "Sorting networks, the 0–1 principle and odd–even transposition.",
    },
    {
      citation:
        "N. Habermann, “Parallel neighbor-sort (or the glory of the induction principle),” Carnegie Mellon University technical report, 1972.",
      supports: "The parallel odd–even transposition sort and its n-step bound.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
