import type { AlgorithmEntry } from "../types";

export const combSortEntry: AlgorithmEntry = {
  slug: "comb-sort",
  name: "Comb Sort",
  aliases: ["Dobosiewicz sort"],
  curriculum: [14],
  domain: "searching-sorting",
  subcategory: "Elementary sorting",
  difficulty: "beginner",
  summary:
    "Bubble sort with a shrinking gap: compare elements gap apart, divide the gap by 1.3 each pass, and finish with ordinary bubble passes. Large early gaps move small values from the far end quickly.",
  tags: ["sorting", "bubble sort", "gap sequence", "in-place", "unstable"],
  prerequisites: ["Bubble sort"],
  related: ["shell-sort", "bubble-sort", "cocktail-shaker-sort"],
  problem: {
    input: "An array of numbers.",
    output: "The same numbers in non-decreasing order.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Bubble sort moves values one step per swap, so a small value at the far right needs many passes. Comb sort first compares values far apart, like a coarse comb through tangled hair, then finer and finer, ending with gap 1. By then the array is nearly sorted, and bubble passes finish quickly.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "gap = n.",
          "Each pass: gap = ⌊gap / 1.3⌋ (at least 1); compare and swap every pair (i, i + gap).",
          "Stop after a pass with gap 1 that made no swap.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the turtle preset): [5, 6, 7, 8, 9, 10, 4, 3, 2, 1]. The gaps are 7, 5, 3, 2, 1, 1: the first pass already swaps 5↔3, 6↔2, 7↔1, moving three small values 7 positions left in three swaps. Six passes, 41 comparisons and 12 swaps in all; plain bubble sort needs 30 swaps (the number of inversions).",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "A shrink factor of about 1.3 was found empirically by Lacey and Box; some versions round gaps of 9 or 10 up to 11 (“Combsort11”).",
          "Unstable: a long-gap swap can jump over an equal element.",
          "Shell sort uses the same gap idea with insertion sort instead of bubble passes and is generally faster.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Cost.** The gap passes alone make about $n \\log_{1.3} n$ comparisons on every input, so even sorted input costs Θ(n log n). The final gap-1 phase is bubble sort, so the worst case is O(n²). Comb sort is a simple, practical improvement, but its average-case behaviour is not well characterised by a simple formula. The tests check the output on random arrays with duplicates.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Dobosiewicz (1980) introduced the idea as a variation of bubble sort; Lacey and Box (1991) popularised it as comb sort.",
          "Shellsort's analysis by Pratt shows that gap choice matters greatly; comb sort's geometric gaps are a rough equivalent.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n log n)",
      average: "O(n²)",
      worst: "O(n²)",
    },
    space: "O(1)",
    worstClass: "n^2",
    note: "Gap passes cost about n log₁.₃ n comparisons on any input; the final bubble phase bounds the worst case at O(n²).",
  },
  properties: [
    {
      label: "Shrink factor",
      value: "1.3",
    },
    {
      label: "Stable",
      value: "No",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "comb_sort",
      code: `def comb_sort(a):
    a = list(a)
    gap, done = len(a), False
    while not done:
        gap = max(1, int(gap / 1.3))
        done = gap == 1
        for i in range(len(a) - gap):
            if a[i] > a[i + gap]:
                a[i], a[i + gap] = a[i + gap], a[i]
                done = False
    return a
`,
      tests: [
        {
          args: [[5, 6, 7, 8, 9, 10, 4, 3, 2, 1]],
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
      entry: "gaps",
      code: `// The gaps comb sort uses for n elements, until the first gap of 1.
function gaps(n) {
  const out = [];
  let gap = n;
  do {
    gap = Math.max(1, Math.floor(gap / 1.3));
    out.push(gap);
  } while (gap > 1);
  return out;
}
`,
      tests: [
        {
          args: [10],
          expected: [7, 5, 3, 2, 1],
        },
        {
          args: [5],
          expected: [3, 2, 1],
        },
      ],
    },
  ],
  visualizer: "comb-sort",
  practice: [
    {
      id: "comb-gap",
      kind: "numeric",
      prompt: "Comb sort on 20 elements: what is the first gap?",
      answer: 15,
      explanation: "⌊20 / 1.3⌋ = ⌊15.38⌋ = 15.",
      hints: ["Divide by 1.3 and round down."],
      objective: "Gap sequence",
    },
    {
      id: "comb-stable",
      kind: "mcq",
      prompt: "Is comb sort stable?",
      options: [
        "No: long-gap swaps can jump over equal values",
        "Yes, like bubble sort",
        "Only with an odd number of elements",
        "Only for gap 1",
      ],
      answer: 0,
      explanation: "Swapping elements far apart can reorder equal keys between them.",
      distractors: {
        "1": "Bubble sort is stable because it only swaps neighbours.",
        "2": "Parity does not matter.",
        "3": "The damage is done by the earlier long gaps.",
      },
      hints: ["What can a swap of distance 5 jump over?"],
      objective: "Stability",
    },
  ],
  exam: {
    definition:
      "Comb sort is bubble sort with a gap that shrinks by a factor of 1.3 each pass until it is 1.",
    steps: ["gap ← ⌊gap/1.3⌋.", "Compare-swap pairs gap apart.", "Stop when gap = 1 and no swap."],
    timeComplexity: "O(n²) worst; Θ(n log n) at best.",
    spaceComplexity: "$O(1)$.",
    correctness: "The final phase is bubble sort, which sorts any array.",
    applications: ["Simple in-place sorting with good practical speed"],
    limitations: ["Unstable", "No strong guarantees"],
    faq: [
      {
        q: "Why 1.3?",
        a: "Lacey and Box found it empirically; much smaller factors waste passes, larger ones leave too many turtles.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Gap idea (2).", "Shrink factor (1).", "Termination and complexity (2)."],
      },
    ],
  },
  references: [
    {
      citation:
        "W. Dobosiewicz, “An efficient variation of bubble sort,” Information Processing Letters, 11(1), 1980.",
      supports: "Bubble sort with diminishing gaps.",
    },
    {
      citation: "S. Lacey, R. Box, “A fast, easy sort,” Byte, 16(4), 1991.",
      supports: "Comb sort and the shrink factor 1.3.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
