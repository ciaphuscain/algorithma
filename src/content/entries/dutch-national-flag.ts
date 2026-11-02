import type { AlgorithmEntry } from "../types";

export const dutchNationalFlagEntry: AlgorithmEntry = {
  slug: "dutch-national-flag",
  name: "Dutch National Flag",
  aliases: ["Dutch national flag problem", "Three-way partitioning", "Sort colors", "0-1-2 sort"],
  curriculum: [56],
  domain: "arrays-hashing",
  subcategory: "Array Techniques",
  difficulty: "beginner",
  summary:
    "Sort an array of three kinds of values (0, 1, 2 — red, white and blue) in one pass and in place, with three pointers that keep four regions: reds, whites, unknown, blues. Dijkstra's classic exercise and the partitioning step of three-way quicksort.",
  tags: ["partitioning", "three pointers", "in-place", "one pass", "invariant"],
  prerequisites: ["Two Pointers"],
  related: ["two-pointers", "three-way-quick-sort", "counting-sort"],
  problem: {
    input: "An array whose values are 0, 1 or 2.",
    output: "The same values in order: all 0s, then 1s, then 2s.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Sort a row of red, white and blue pebbles by swapping, looking at each pebble once. Keep reds at the left, blues at the right, whites behind the reds, and an unknown stretch in the middle. Look at the first unknown pebble: a red goes to the end of the reds, a white stays, a blue swaps to just before the blues. The unknown stretch shrinks by one each time.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "lo = mid = 0, hi = n − 1. Invariant: A[0..lo) = 0, A[lo..mid) = 1, A[mid..hi] unknown, A(hi..n − 1] = 2.",
          "If A[mid] = 0: swap A[lo] and A[mid]; lo++ and mid++.",
          "If A[mid] = 1: mid++.",
          "If A[mid] = 2: swap A[mid] and A[hi]; hi−−. Do not advance mid: the value swapped in is still unknown.",
          "Stop when mid > hi.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): [2, 0, 2, 1, 1, 0, 1, 2, 0] takes exactly 9 steps — one per element — and 4 swaps, ending with lo = 3, mid = 6, hi = 5: three 0s, three 1s, three 2s.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Each step reads A[mid] once and shrinks the unknown region by one, so there are exactly n steps.",
          "The visualizer skips swaps of an element with itself (when lo = mid, or mid = hi).",
          "With a pivot p instead of colours (< p, = p, > p) this is the partition of three-way quicksort, which handles many equal keys in linear time.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Correctness.** The four-region invariant holds initially (all regions but the unknown are empty) and each case preserves it. Each step either increments mid or decrements hi, so after n steps mid > hi and the unknown region is empty: the array is sorted. **Cost:** n steps, at most n swaps, O(1) extra space. Counting sort would need two passes; this needs one. The tests check the output on random arrays of 0s, 1s and 2s and that exactly n steps are made.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Dijkstra posed the problem in A Discipline of Programming (1976) to teach programming with invariants.",
          "Bentley and McIlroy's ‘split-end’ partition (1993) keeps equal keys at both ends and swaps them to the middle afterwards, with fewer swaps when equal keys are rare.",
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
  },
  properties: [
    {
      label: "Passes",
      value: "One",
    },
    {
      label: "Swaps",
      value: "At most n",
    },
    {
      label: "Stable",
      value: "No",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "sort_colors",
      code: `def sort_colors(a):
    a = list(a)
    lo, mid, hi = 0, 0, len(a) - 1
    while mid <= hi:
        if a[mid] == 0:
            a[lo], a[mid] = a[mid], a[lo]
            lo += 1
            mid += 1
        elif a[mid] == 1:
            mid += 1
        else:
            a[mid], a[hi] = a[hi], a[mid]
            hi -= 1
    return a
`,
      tests: [
        {
          args: [[2, 0, 2, 1, 1, 0, 1, 2, 0]],
          expected: [0, 0, 0, 1, 1, 1, 2, 2, 2],
        },
        {
          args: [[1, 1]],
          expected: [1, 1],
        },
      ],
    },
    {
      language: "javascript",
      entry: "partition3",
      code: `// Three-way partition around a pivot value: [< p, = p, > p].
function partition3(input, p) {
  const a = [...input];
  let lo = 0, mid = 0, hi = a.length - 1;
  while (mid <= hi) {
    if (a[mid] < p) { [a[lo], a[mid]] = [a[mid], a[lo]]; lo++; mid++; }
    else if (a[mid] === p) mid++;
    else { [a[mid], a[hi]] = [a[hi], a[mid]]; hi--; }
  }
  return a;
}
`,
      tests: [
        {
          args: [[5, 1, 5, 9, 2, 5], 5],
          expected: [1, 2, 5, 5, 5, 9],
        },
        {
          args: [[3], 3],
          expected: [3],
        },
      ],
    },
  ],
  visualizer: "dutch-national-flag",
  practice: [
    {
      id: "dnf-mid",
      kind: "mcq",
      prompt: "After swapping A[mid] with A[hi] for a 2, why is mid not advanced?",
      options: [
        "The value now at mid has not been classified yet",
        "To keep the sort stable",
        "Because hi moved instead",
        "It should be; this is a bug",
      ],
      answer: 0,
      explanation: "It came from the unknown region, so it still needs to be examined.",
      distractors: {
        "1": "The algorithm is not stable.",
        "2": "hi moves too, but that is not the reason.",
        "3": "Advancing mid would leave an unclassified value behind.",
      },
      hints: ["Where did the swapped-in value come from?"],
      objective: "Invariant",
    },
    {
      id: "dnf-steps",
      kind: "numeric",
      prompt: "How many loop iterations does the algorithm make on an array of 12 values?",
      answer: 12,
      explanation: "Each iteration shrinks the unknown region by one.",
      hints: ["What shrinks each time?"],
      objective: "Cost",
    },
  ],
  exam: {
    definition:
      "The Dutch national flag problem is to sort an array of three distinct values in one pass, in place.",
    steps: [
      "Keep regions 0s, 1s, unknown, 2s with pointers lo, mid, hi.",
      "Classify A[mid] and swap or advance.",
      "Stop when the unknown region is empty.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(1)$.",
    correctness: "The four-region invariant is preserved and the unknown region shrinks each step.",
    applications: ["Three-way quicksort partitioning", "Segregating values by category"],
    limitations: ["Only three classes", "Not stable"],
    faq: [
      {
        q: "Why not counting sort?",
        a: "Counting works for bare values but needs two passes; the flag algorithm moves whole records in one pass.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Invariant (2).", "Three cases (2).", "Termination and cost (1)."],
      },
    ],
  },
  references: [
    {
      citation: "E. W. Dijkstra, A Discipline of Programming, Prentice-Hall, 1976, Chapter 14.",
      supports: "The problem and its invariant-based solution.",
    },
    {
      citation:
        "J. L. Bentley, M. D. McIlroy, “Engineering a sort function,” Software: Practice and Experience, 23(11), 1993.",
      supports: "Three-way partitioning in quicksort.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
