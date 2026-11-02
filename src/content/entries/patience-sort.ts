import type { AlgorithmEntry } from "../types";

export const patienceSortEntry: AlgorithmEntry = {
  slug: "patience-sort",
  name: "Patience Sort",
  aliases: ["Patience sorting"],
  curriculum: [25],
  domain: "searching-sorting",
  subcategory: "Insertion-based sorting",
  difficulty: "intermediate",
  summary:
    "Deal the values onto piles like the card game patience — each onto the leftmost pile whose top is at least as large — then repeatedly take the smallest top. The number of piles is the length of the longest increasing subsequence, which this deal computes in O(n log n).",
  tags: ["sorting", "longest increasing subsequence", "card game", "k-way merge"],
  prerequisites: ["Binary search", "Stacks"],
  related: ["lis", "merge-sort", "binary-heap"],
  problem: {
    input: "An array of numbers.",
    output: "The same numbers in non-decreasing order.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Deal cards one at a time. A card may go on a pile whose top card is at least as high; if none is, start a new pile to the right. Each pile then reads downwards from high to low, and the pile tops increase from left to right. To sort, keep picking up the lowest top card.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "For each value x: binary-search the pile tops (which increase left to right) for the leftmost top ≥ x; put x there, or start a new pile.",
          "Merge: repeatedly remove the smallest top among all piles into the output.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the fourth preset): [7, 2, 8, 1, 3, 4, 10, 6, 9, 5] deals into 5 piles, with tops 1, 3, 4, 5, 9 at the end of the deal — and 5 is exactly the length of a longest strictly increasing subsequence, such as 2, 3, 4, 6, 9. Reversed input stacks onto one pile; sorted input needs a new pile for every value.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "This visualizer finds the smallest top by scanning the piles; a min-heap of the tops makes the merge O(n log k) for k piles.",
          "Remembering, for each card, the top of the pile to its left when it was dealt lets you read off an actual longest increasing subsequence.",
          "For random permutations the number of piles is about 2√n.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Cost.** The deal takes $O(n \\log k)$ comparisons with binary search over $k$ piles, and a heap-based merge another $O(n \\log k)$ — $O(n \\log n)$ in all. **Piles = LIS:** the values on one pile form a non-increasing sequence, so an increasing subsequence uses each pile at most once (≤ k); conversely, following each card back to a smaller card on the previous pile builds an increasing subsequence of length k. The tests check the output and that the pile count equals an independently computed LIS length.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Mallows analysed the card game in the early 1960s; Aldous and Diaconis (1999) connected it to the distribution of the longest increasing subsequence of a random permutation (the Baik–Deift–Johansson theorem).",
          "The deal alone is the standard O(n log n) algorithm for the LIS problem.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n log n)",
      worst: "O(n log n)",
    },
    space: "O(n)",
    worstClass: "n log n",
    note: "With a heap for the merge; this visualizer scans the k pile tops instead (O(nk)).",
  },
  properties: [
    {
      label: "Piles",
      value: "Length of a longest increasing subsequence",
    },
    {
      label: "Pile tops",
      value: "Increase left to right",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "patience_sort",
      code: `from bisect import bisect_left
import heapq

def patience_sort(a):
    piles, tops = [], []
    for x in a:
        i = bisect_left(tops, x)     # leftmost top >= x
        if i == len(piles):
            piles.append([x]); tops.append(x)
        else:
            piles[i].append(x); tops[i] = x
    heap = [(p[-1], i) for i, p in enumerate(piles)]
    heapq.heapify(heap)
    out = []
    while heap:
        v, i = heapq.heappop(heap)
        out.append(v)
        piles[i].pop()
        if piles[i]:
            heapq.heappush(heap, (piles[i][-1], i))
    return out
`,
      tests: [
        {
          args: [[7, 2, 8, 1, 3, 4, 10, 6, 9, 5]],
          expected: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        },
        {
          args: [[3, 1, 3, 2]],
          expected: [1, 2, 3, 3],
        },
      ],
    },
    {
      language: "javascript",
      entry: "pileCount",
      code: `// Number of piles after the deal = length of a longest strictly increasing subsequence.
function pileCount(a) {
  const tops = [];
  for (const x of a) {
    let lo = 0, hi = tops.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tops[mid] >= x) hi = mid; else lo = mid + 1;
    }
    tops[lo] = x;
  }
  return tops.length;
}
`,
      tests: [
        {
          args: [[7, 2, 8, 1, 3, 4, 10, 6, 9, 5]],
          expected: 5,
        },
        {
          args: [[9, 8, 7]],
          expected: 1,
        },
      ],
    },
  ],
  visualizer: "patience-sort",
  practice: [
    {
      id: "pat-piles",
      kind: "numeric",
      prompt: "How many piles does the deal of [3, 1, 4, 1, 5, 9, 2, 6] make?",
      answer: 4,
      explanation:
        "A longest strictly increasing subsequence has 4 values (e.g. 1, 4, 5, 9 or 3, 4, 5, 6).",
      hints: ["Piles = LIS length."],
      objective: "Piles and LIS",
    },
    {
      id: "pat-where",
      kind: "mcq",
      prompt: "On which pile does a new card go?",
      options: [
        "The leftmost pile whose top is at least the card",
        "The rightmost pile",
        "The pile with the fewest cards",
        "Any pile whose top is smaller",
      ],
      answer: 0,
      explanation: "Leftmost with top ≥ x keeps the tops increasing from left to right.",
      distractors: {
        "1": "That would break the order of the tops.",
        "2": "Pile sizes do not matter.",
        "3": "A pile must read high to low downwards.",
      },
      hints: ["Which rule keeps each pile decreasing?"],
      objective: "Dealing rule",
    },
  ],
  exam: {
    definition:
      "Patience sort deals values onto piles (leftmost top ≥ x) and merges the piles by repeatedly taking the smallest top.",
    steps: ["Deal with binary search.", "k-way merge of the piles."],
    timeComplexity: "$O(n \\log n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "Each pile is sorted (smallest on top); merging sorted piles sorts the whole.",
    applications: ["Longest increasing subsequence", "Sorting nearly sorted data (few piles)"],
    limitations: ["O(n) extra space", "Merge needs a heap for the best bound"],
    faq: [
      {
        q: "Why does the number of piles equal the LIS?",
        a: "Each pile is non-increasing, so an increasing subsequence takes at most one card per pile; back-pointers build one of length k.",
      },
    ],
    answers: [
      {
        marks: 10,
        outline: ["Dealing rule (2).", "Merge (2).", "Piles = LIS proof (4).", "Complexity (2)."],
      },
    ],
  },
  references: [
    {
      citation:
        "D. Aldous, P. Diaconis, “Longest increasing subsequences: from patience sorting to the Baik–Deift–Johansson theorem,” Bulletin of the American Mathematical Society, 36(4), 1999.",
      supports:
        "Patience sorting, its history and its relation to longest increasing subsequences.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
