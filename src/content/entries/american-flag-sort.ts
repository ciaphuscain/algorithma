import type { AlgorithmEntry } from "../types";

export const americanFlagSortEntry: AlgorithmEntry = {
  slug: "american-flag-sort",
  name: "American Flag Sort",
  aliases: ["In-place MSD radix sort"],
  curriculum: [44],
  domain: "searching-sorting",
  subcategory: "Specialized sorting",
  difficulty: "advanced",
  summary:
    "An in-place MSD radix sort: count the values per digit, work out where each digit's region starts, then swap values into their regions by following cycles — no buffer — and recurse on each region with the next digit.",
  tags: ["sorting", "radix sort", "in-place", "permutation cycles", "non-comparison"],
  prerequisites: ["MSD radix sort", "Counting sort"],
  related: ["msd-radix-sort", "radix-sort", "flash-sort"],
  problem: {
    input: "Whole numbers 0–999.",
    output: "The same numbers in non-decreasing order.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "The Dutch national flag problem sorts three colours in place; the American flag has more stripes. With 10 digits instead of 3 colours, first count how many values have each leading digit — that says where each stripe starts — then walk through the array, swapping each value into its stripe.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Count values per digit d at the current position; region d starts at lo + (counts of digits smaller than d).",
          "For each region, while its next unfilled cell holds a value of a different digit e, swap that value into region e's next cell (advancing e's pointer); otherwise advance this region's pointer.",
          "Recurse on every region of two or more values with the next digit.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the second preset): [512, 507, 519, 503, 98, 511, 534, 5]. The hundreds digit splits the values into regions 0 (two values) and 5 (six values); recursion refines the 5xx region by tens and then the 51x and 50x regions by units — 5 calls and 11 swaps in all, with no buffer.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Each swap puts at least one value into its final region, so a pass makes at most n swaps.",
          "Unstable: the cycle swaps reorder equal digits.",
          "McIlroy, Bostic and McIlroy used it for strings (one region per byte value) with an insertion-sort cutoff.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Cost.** Like MSD radix sort, O(n·d) for d-digit keys, but with O(base) extra space per level instead of an O(n) buffer. Each value is moved at most once per level. The tests check the output on random arrays.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "The name refers to Dijkstra's Dutch national flag problem, generalised to many ‘stripes’.",
          "Parallel in-place radix sorts (e.g. regions sorted by different threads) build on the same permutation step.",
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
    space: "O(base · d)",
    worstClass: "n",
  },
  properties: [
    {
      label: "Buffer",
      value: "None (in place)",
    },
    {
      label: "Stable",
      value: "No",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "flag_sort",
      code: `def flag_sort(a, lo=0, hi=None, p=None):
    if hi is None:
        a = list(a); hi = len(a) - 1
        p = len(str(max(a))) - 1 if a else 0
    if hi <= lo or p < 0:
        return a
    dig = lambda x: x // 10 ** p % 10
    count = [0] * 10
    for i in range(lo, hi + 1):
        count[dig(a[i])] += 1
    start, s = [], lo
    for k in range(10):
        start.append(s); s += count[k]
    nxt = start[:]
    for k in range(10):
        while nxt[k] < start[k] + count[k]:
            d = dig(a[nxt[k]])
            if d == k:
                nxt[k] += 1
            else:
                a[nxt[k]], a[nxt[d]] = a[nxt[d]], a[nxt[k]]
                nxt[d] += 1
    for k in range(10):
        if count[k] > 1:
            flag_sort(a, start[k], start[k] + count[k] - 1, p - 1)
    return a
`,
      tests: [
        {
          args: [[512, 507, 519, 503, 98, 511, 534, 5]],
          expected: [5, 98, 503, 507, 511, 512, 519, 534],
        },
      ],
    },
    {
      language: "javascript",
      entry: "regionStarts",
      code: `// Where each leading-digit region starts (3-digit keys).
function regionStarts(a) {
  const count = new Array(10).fill(0);
  for (const x of a) count[Math.floor(x / 100) % 10]++;
  const start = [];
  let s = 0;
  for (let k = 0; k < 10; k++) { start.push(s); s += count[k]; }
  return start;
}
`,
      tests: [
        {
          args: [[512, 507, 519, 503, 98, 511, 534, 5]],
          expected: [0, 2, 2, 2, 2, 2, 8, 8, 8, 8],
        },
      ],
    },
  ],
  visualizer: "american-flag-sort",
  practice: [
    {
      id: "afs-space",
      kind: "mcq",
      prompt: "What does American flag sort save compared with MSD radix sort?",
      options: [
        "The O(n) buffer",
        "The digit counts",
        "The recursion",
        "Comparisons between digits",
      ],
      answer: 0,
      explanation: "It permutes in place; it still counts digits and recurses.",
      distractors: {
        "1": "Counts are needed to find region starts.",
        "2": "It still recurses per region.",
        "3": "Neither compares whole values.",
      },
      hints: ["Where do values go during distribution?"],
      objective: "In-place",
    },
    {
      id: "afs-start",
      kind: "numeric",
      prompt: "Counts per leading digit are 0:3, 1:0, 2:4, 3:1. Where does region 3 start?",
      answer: 7,
      explanation: "3 + 0 + 4 = 7 values come before it.",
      hints: ["Sum the counts of smaller digits."],
      objective: "Region starts",
    },
  ],
  exam: {
    definition:
      "American flag sort is an in-place MSD radix sort that permutes values into digit regions by cycle swaps.",
    steps: [
      "Count digits; compute region starts.",
      "Swap values into regions.",
      "Recurse per region.",
    ],
    timeComplexity: "O(n·d).",
    spaceComplexity: "O(base) per level.",
    correctness: "After the permutation, region k holds exactly the values with digit k.",
    applications: ["Large string and integer sorting in place"],
    limitations: ["Unstable", "Overhead on small regions"],
    faq: [
      {
        q: "Why “American flag”?",
        a: "It generalises the three-colour Dutch national flag problem to many stripes.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Counting and regions (2).", "Cycle permutation (2).", "Recursion (1)."],
      },
    ],
  },
  references: [
    {
      citation:
        "P. M. McIlroy, K. Bostic, M. D. McIlroy, “Engineering radix sort,” Computing Systems, 6(1), 1993.",
      supports: "American flag sort.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
