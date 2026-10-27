import type { AlgorithmEntry } from "../types";

export const bingoSortEntry: AlgorithmEntry = {
  slug: "bingo-sort",
  name: "Bingo Sort",
  aliases: ["Bingo selection sort"],
  curriculum: [19],
  domain: "searching-sorting",
  subcategory: "Elementary sorting",
  difficulty: "intermediate",
  summary:
    "A selection sort for arrays with many duplicates: each pass moves every copy of the current largest value to the end at once, finding the next largest value as it goes. Passes = distinct values, not n.",
  tags: ["sorting", "selection sort", "duplicates", "in-place"],
  prerequisites: ["Selection sort"],
  related: ["selection-sort", "double-selection-sort", "counting-sort"],
  problem: {
    input: "An array of numbers.",
    output: "The same numbers in non-decreasing order.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Calling bingo numbers: when 3 is called, every card with a 3 marks it at once. Bingo sort does the same with values: once it knows the largest value, one pass moves all its copies to the end. While scanning, it notes the largest value among the rest, which becomes the next number called.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Find the largest value; skip any copies already at the end.",
          "Pass: bingo = that value; scan the unsorted part from right to left. A copy of bingo is swapped to the end of the unsorted part (which shrinks). Any other value larger than the next candidate becomes the next candidate.",
          "Skip copies of the next value already at the end, and repeat.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the fourth preset): [3, 1, 3, 2, 1, 3, 2, 1, 2, 3] has three distinct values. The 3 at the end is already in place; the first pass moves the other three 3s, and the second moves the 2s — leaving the 1s in front. Two passes and 5 swaps, where selection sort would make 9 passes.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "The NIST Dictionary of Algorithms and Data Structures describes it as a variant of selection sort for many duplicates.",
          "With all values distinct it is just selection sort (picking maxima).",
          "If the value range is small and known, counting sort is faster still.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Cost.** With m distinct values, it makes at most m passes over a shrinking part: O(mn) comparisons — O(n) when m is constant, O(n²) when m ≈ n. Swaps are at most n. **Correctness:** after each pass the suffix holds all copies of the largest values in order. The tests check the output and that passes never exceed the number of distinct values.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Counting how many elements equal each bingo value also gives a stable scheme for small value sets.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(mn)",
      worst: "O(n²)",
    },
    space: "O(1)",
    worstClass: "n^2",
    note: "m is the number of distinct values.",
  },
  properties: [
    {
      label: "Passes",
      value: "At most the number of distinct values",
    },
    {
      label: "Stable",
      value: "No",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "bingo_sort",
      code: `def bingo_sort(a):
    a = list(a)
    end = len(a) - 1
    if end < 1:
        return a
    nxt = max(a)
    while end > 0 and a[end] == nxt:
        end -= 1
    while end > 0:
        bingo, nxt = nxt, a[end]
        for i in range(end - 1, -1, -1):
            if a[i] == bingo:
                a[i], a[end] = a[end], a[i]
                end -= 1
            elif a[i] > nxt:
                nxt = a[i]
        while end > 0 and a[end] == nxt:
            end -= 1
    return a
`,
      tests: [
        {
          args: [[3, 1, 3, 2, 1, 3, 2, 1, 2, 3]],
          expected: [1, 1, 1, 2, 2, 2, 3, 3, 3, 3],
        },
        {
          args: [[5, 1, 4, 2, 8]],
          expected: [1, 2, 4, 5, 8],
        },
      ],
    },
    {
      language: "javascript",
      entry: "distinct",
      code: `// Upper bound on bingo sort's passes: the number of distinct values.
function distinct(a) {
  return new Set(a).size;
}
`,
      tests: [
        {
          args: [[3, 1, 3, 2, 1, 3, 2, 1, 2, 3]],
          expected: 3,
        },
      ],
    },
  ],
  visualizer: "bingo-sort",
  practice: [
    {
      id: "bingo-passes",
      kind: "numeric",
      prompt:
        "An array of 1,000 elements holds only the values 0 and 1. At most how many passes does bingo sort make?",
      answer: 2,
      explanation:
        "One pass per distinct value at most (often fewer if the largest values are already at the end).",
      hints: ["Count distinct values."],
      objective: "Passes",
    },
    {
      id: "bingo-when",
      kind: "mcq",
      prompt: "When is bingo sort clearly better than selection sort?",
      options: [
        "When there are few distinct values",
        "When all values are distinct",
        "When the array is reversed",
        "Never",
      ],
      answer: 0,
      explanation: "Its passes scale with distinct values, not with n.",
      distractors: {
        "1": "Then it does the same work as selection sort.",
        "2": "Reversal does not help it.",
        "3": "Few distinct values make it much faster.",
      },
      hints: ["What does one pass place?"],
      objective: "Use case",
    },
  ],
  exam: {
    definition:
      "Bingo sort is a selection sort that, in each pass, moves all copies of the current largest value to the end.",
    steps: [
      "Find the max.",
      "Pass: move copies of the bingo value; find the next value.",
      "Repeat.",
    ],
    timeComplexity: "O(mn) for m distinct values; O(n²) worst.",
    spaceComplexity: "$O(1)$.",
    correctness: "Each pass completes the suffix of the largest remaining value.",
    applications: ["Data with few distinct keys"],
    limitations: ["Unstable", "No better than selection sort for distinct keys"],
    faq: [
      {
        q: "Why scan from right to left?",
        a: "Copies found are swapped to the shrinking end of the unsorted part, which the scan has already passed.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Idea (2).", "Pass structure (2).", "Cost in distinct values (1)."],
      },
    ],
  },
  references: [
    {
      citation:
        "P. E. Black (ed.), “bingo sort,” Dictionary of Algorithms and Data Structures, U.S. National Institute of Standards and Technology.",
      supports: "Definition of bingo sort as a selection-sort variant for many duplicates.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
