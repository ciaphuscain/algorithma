import type { AlgorithmEntry } from "../types";

export const msdRadixSortEntry: AlgorithmEntry = {
  slug: "msd-radix-sort",
  name: "MSD Radix Sort",
  aliases: ["Radix Sort (MSD)", "Most-significant-digit radix sort"],
  curriculum: [38],
  domain: "searching-sorting",
  subcategory: "Distribution sorting",
  difficulty: "intermediate",
  summary:
    "Radix sort that starts from the most significant digit: split the values into groups by their leading digit, then sort each group by the next digit, recursively. Groups that shrink to one element stop early, so MSD radix sort suits keys that differ early, such as strings.",
  tags: ["sorting", "radix sort", "non-comparison", "recursion", "counting sort"],
  prerequisites: ["Counting sort", "Radix sort (LSD)"],
  related: ["radix-sort", "counting-sort", "bucket-sort"],
  problem: {
    input: "An array of whole numbers 0–999.",
    output: "The same numbers in non-decreasing order.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A post office sorts letters by country first, then each country's pile by city, then by street. Nobody sorts the whole world's mail by street number first. MSD radix sort works the same way: the leading digit decides the coarse order, and each group is refined on its own.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Pad the numbers to d digits; start with the most significant digit.",
          "Distribute A[lo..hi] into ten groups by that digit with a counting sort (stable), through a buffer.",
          "Recurse on each group with the next digit; stop when a group has one element or the digits run out.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the second preset): [512, 507, 519, 503, 98, 511, 534, 5]. The hundreds digit splits off 98 and 5 (digit 0) from the six 5xx values. Each of those groups is sorted by tens, and the 51x group again by units — 5 distribution calls in all. The first preset needs only 2 calls, since most values are alone after the first split.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Switch to insertion sort for small groups: recursing on tiny groups with 10 counters each is wasteful.",
          "For strings, the ‘digits’ are characters and keys of different lengths end at an end-of-string symbol that sorts first.",
          "American flag sort is an in-place MSD radix sort; three-way radix quicksort is a comparison-based relative.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Cost.** Each value is distributed once per digit level it reaches, so the total work is O(n·d + (number of groups)·base) for d-digit keys — and often far less, because values stop as soon as they are alone in a group. Unlike LSD radix sort, it need not look at every digit. The tests check the output on random arrays.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "McIlroy, Bostic and McIlroy (1993) engineered fast in-place MSD radix sorts for strings.",
          "MSD radix sort's recursion tree is a trie of the keys' prefixes.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n·d)",
      worst: "O(n·d)",
    },
    space: "O(n + base · d)",
    worstClass: "n",
    note: "d digits in base 10; d = 3 here.",
  },
  properties: [
    {
      label: "Order",
      value: "Most significant digit first",
    },
    {
      label: "Stable",
      value: "Yes (each distribution is stable)",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "msd",
      code: `def msd(a, p=None):
    if p is None:
        p = len(str(max(a))) - 1 if a else 0
    if len(a) <= 1 or p < 0:
        return list(a)
    groups = [[] for _ in range(10)]
    for x in a:
        groups[x // 10 ** p % 10].append(x)
    return [y for g in groups for y in msd(g, p - 1)]
`,
      tests: [
        {
          args: [[512, 507, 519, 503, 98, 511, 534, 5]],
          expected: [5, 98, 503, 507, 511, 512, 519, 534],
        },
        {
          args: [[170, 45, 75, 90, 802, 24, 2, 66]],
          expected: [2, 24, 45, 66, 75, 90, 170, 802],
        },
      ],
    },
    {
      language: "javascript",
      entry: "leadingGroups",
      code: `// Sizes of the ten groups after the first (hundreds-digit) split of 3-digit keys.
function leadingGroups(a) {
  const g = new Array(10).fill(0);
  for (const x of a) g[Math.floor(x / 100) % 10]++;
  return g;
}
`,
      tests: [
        {
          args: [[512, 507, 519, 503, 98, 511, 534, 5]],
          expected: [2, 0, 0, 0, 0, 6, 0, 0, 0, 0],
        },
      ],
    },
  ],
  visualizer: "msd-radix-sort",
  practice: [
    {
      id: "msd-first",
      kind: "mcq",
      prompt: "Which digit does MSD radix sort examine first?",
      options: [
        "The most significant",
        "The least significant",
        "The middle one",
        "Whichever has the most distinct values",
      ],
      answer: 0,
      explanation: "Hence the name; LSD radix sort starts at the other end.",
      distractors: {
        "1": "That is LSD radix sort.",
        "2": "The order is fixed.",
        "3": "The order is fixed.",
      },
      hints: ["What does MSD stand for?"],
      objective: "Digit order",
    },
    {
      id: "msd-stop",
      kind: "mcq",
      prompt: "When does MSD radix sort stop recursing on a group?",
      options: [
        "When the group has at most one element, or the digits run out",
        "Only after the last digit",
        "When the group is sorted",
        "After two levels",
      ],
      answer: 0,
      explanation: "A single element is sorted; this early stop is MSD's advantage.",
      distractors: {
        "1": "Groups of one stop early.",
        "2": "It does not check sortedness.",
        "3": "There is no fixed depth.",
      },
      hints: ["What is special about a group of one?"],
      objective: "Early termination",
    },
  ],
  exam: {
    definition:
      "MSD radix sort distributes keys by their most significant digit and recursively sorts each group by the following digits.",
    steps: [
      "Counting-sort by the current digit.",
      "Recurse on each non-trivial group with the next digit.",
    ],
    timeComplexity: "O(n·d), often less.",
    spaceComplexity: "O(n + base·d).",
    correctness: "Groups are in order of the leading digit; recursion orders within groups.",
    applications: ["String sorting", "Keys that differ early"],
    limitations: ["Many small groups are expensive", "Needs digit access"],
    faq: [
      {
        q: "MSD or LSD?",
        a: "LSD is simpler and needs no recursion but always processes every digit; MSD can stop early and suits variable-length keys.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Procedure (2).", "Early termination (2).", "Comparison with LSD (1)."],
      },
    ],
  },
  references: [
    {
      citation:
        "P. M. McIlroy, K. Bostic, M. D. McIlroy, “Engineering radix sort,” Computing Systems, 6(1), 1993.",
      supports: "MSD radix sorting in practice.",
    },
    {
      citation:
        "D. E. Knuth, The Art of Computer Programming, Vol. 3: Sorting and Searching, 2nd ed., Addison-Wesley, 1998, Section 5.2.5.",
      supports: "Radix sorting, MSD and LSD.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
