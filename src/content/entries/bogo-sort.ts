import type { AlgorithmEntry } from "../types";

export const bogoSortEntry: AlgorithmEntry = {
  slug: "bogo-sort",
  name: "Bogo Sort",
  aliases: ["Bogosort", "Permutation sort", "Stupid sort (random)"],
  curriculum: [50],
  domain: "searching-sorting",
  subcategory: "Specialized sorting",
  difficulty: "beginner",
  summary:
    "Shuffle the array at random until it happens to be sorted. With n distinct values each shuffle succeeds with probability 1/n!, so about n! shuffles are expected — the standard example of a hopeless algorithm. This version uses a seeded generator and gives up after 5,000 shuffles.",
  tags: ["sorting", "randomized", "joke algorithm", "permutations", "expected time"],
  prerequisites: ["Fisher–Yates shuffle", "Permutations"],
  related: ["fisher-yates", "quickselect", "bubble-sort"],
  problem: {
    input: "Up to 6 numbers and a random seed.",
    output: "The numbers in order, or a report that it gave up.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Throw a deck of cards in the air, pick them up, and check whether they are in order. If not, throw them again. Every arrangement is equally likely, and only one of the n! arrangements is sorted, so for a deck of 52 cards you would wait far longer than the age of the universe.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Check whether A is sorted (at most n − 1 comparisons).",
          "If not, shuffle it uniformly at random (Fisher–Yates) and check again.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): [3, 1, 4, 2] with seed 7 happens to be sorted after 3 shuffles — lucky, since 4! = 24 orders are possible and about 24 shuffles are expected. The third preset is already sorted: one check, no shuffle.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "The seed makes runs reproducible; change it to see different luck.",
          "The visualizer stops after 5,000 shuffles and reports that it gave up — with 6 distinct values (720 orders) that happens about once in a thousand runs.",
          "Deterministic “bogo” variants that enumerate permutations in order take up to n! steps in the worst case.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Expected cost.** With distinct values, each shuffle produces the sorted order with probability 1/n!, so the number of shuffles is geometric with mean about n! (if the input is not already sorted), and each shuffle costs O(n): expected O(n · n!). There is no upper bound on the running time. Gruber, Holzer and Ruepp (2007) analysed this and worse variants in detail. The tests replay the same seeded shuffles independently and check both the result and when the run should give up.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "‘Quantum bogosort’ is a joke that destroys every universe in which the shuffle failed.",
          "Bogosort illustrates the difference between expected and worst-case running time.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n · n!)",
      worst: "Unbounded",
    },
    space: "O(1)",
    worstClass: "other",
  },
  properties: [
    {
      label: "Expected shuffles",
      value: "About n! (distinct values)",
    },
    {
      label: "Worst case",
      value: "Unbounded",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "expected_shuffles",
      code: `from math import factorial

def expected_shuffles(n):
    """Mean number of shuffles for n distinct values not already sorted (geometric, p = 1/n!)."""
    return factorial(n)
`,
      tests: [
        {
          args: [4],
          expected: 24,
        },
        {
          args: [6],
          expected: 720,
        },
      ],
    },
    {
      language: "javascript",
      entry: "isSorted",
      code: `function isSorted(a) {
  for (let i = 1; i < a.length; i++) if (a[i - 1] > a[i]) return false;
  return true;
}
`,
      tests: [
        {
          args: [[1, 2, 3]],
          expected: true,
        },
        {
          args: [[2, 1]],
          expected: false,
        },
      ],
    },
  ],
  visualizer: "bogo-sort",
  practice: [
    {
      id: "bogo-exp",
      kind: "numeric",
      prompt: "About how many shuffles does bogosort expect for 5 distinct values?",
      answer: 120,
      explanation: "5! = 120 orders, one of them sorted.",
      hints: ["How many orders are there?"],
      objective: "Expected cost",
    },
    {
      id: "bogo-worst",
      kind: "mcq",
      prompt: "What is bogosort's worst-case running time?",
      options: ["Unbounded", "O(n!)", "O(n²)", "O(n · n!)"],
      answer: 0,
      explanation: "Random shuffles can keep failing forever, however unlikely.",
      distractors: {
        "1": "That is about the expected number of shuffles, not a bound.",
        "2": "Far too optimistic.",
        "3": "That is the expected cost.",
      },
      hints: ["Is there a run that never stops?"],
      objective: "Worst case",
    },
  ],
  exam: {
    definition: "Bogosort repeatedly shuffles an array uniformly at random until it is sorted.",
    steps: ["Check sorted.", "Shuffle.", "Repeat."],
    timeComplexity: "Expected O(n · n!); unbounded worst case.",
    spaceComplexity: "$O(1)$.",
    correctness: "It stops only when the array is sorted.",
    applications: ["Teaching expected vs worst case"],
    limitations: ["Hopelessly slow"],
    faq: [
      {
        q: "Can it ever be fast?",
        a: "Only by luck, or on input that is already sorted (one check).",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Shuffle until sorted (1).", "Expected n! shuffles (1)."],
      },
    ],
  },
  references: [
    {
      citation:
        "H. Gruber, M. Holzer, O. Ruepp, “Sorting the slow way: an analysis of perversely awful randomized sorting algorithms,” Proceedings of FUN 2007, LNCS 4475.",
      supports: "Analysis of bogosort and its variants.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
