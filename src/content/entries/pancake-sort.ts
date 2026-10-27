import type { AlgorithmEntry } from "../types";

export const pancakeSortEntry: AlgorithmEntry = {
  slug: "pancake-sort",
  name: "Pancake Sort",
  aliases: ["Sorting by prefix reversal"],
  curriculum: [47],
  domain: "searching-sorting",
  subcategory: "Specialized sorting",
  difficulty: "beginner",
  summary:
    "Sort a stack of pancakes when the only move is to flip the top k with a spatula. Repeatedly flip the largest unsorted pancake to the top, then down into place: at most 2n − 3 flips.",
  tags: ["sorting", "prefix reversal", "puzzle", "combinatorics"],
  prerequisites: ["Selection sort"],
  related: ["selection-sort", "double-selection-sort"],
  problem: {
    input: "An array of numbers.",
    output: "The same numbers in non-decreasing order.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A waiter wants the pancakes ordered with the biggest at the bottom, but can only slide a spatula under some pancake and flip everything above it. The trick: flip the biggest pancake to the top, then flip the whole unsorted stack so it lands at the bottom. Repeat with the next biggest.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "For size = n down to 2: find the largest of the top `size` pancakes.",
          "If it is not already at the bottom of that part: flip it to the top (unless it is there), then flip the top `size` so it goes to the bottom.",
          "flip(k) reverses A[0..k]; index 0 is the top.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the fourth preset): [3, 6, 1, 8, 2, 7, 4, 5] takes 11 flips — within the 2n − 3 = 13 bound. Reversed input needs just one flip; sorted input none.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Counting flips, not comparisons, is the point: the comparisons are those of selection sort, O(n²).",
          "Flips can be done in O(k) time with an array, or faster with more elaborate structures.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Flips.** Each of the n − 1 placements uses at most two flips, and the last two pancakes need at most one: at most 2n − 3. Gates and Papadimitriou (1979) proved that (5n + 5)/3 flips always suffice and that some stacks need 17n/16; later work improved the upper bound to about 18n/11. Finding the minimum number of flips for a given stack is NP-hard (Bulteau, Fertin and Rusu, 2015). The tests check the output and the 2n − 3 bound.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Bill Gates's only research paper is on pancake sorting.",
          "The burnt pancake problem requires each pancake to end burnt side down.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n²)",
      average: "O(n²)",
      worst: "O(n²)",
    },
    space: "O(1)",
    worstClass: "n^2",
    note: "At most 2n − 3 flips; comparisons are those of selection sort.",
  },
  properties: [
    {
      label: "Move",
      value: "Reverse a prefix",
    },
    {
      label: "Flips",
      value: "At most 2n − 3",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "pancake_flips",
      code: `def pancake_flips(a):
    a, flips = list(a), []
    for size in range(len(a), 1, -1):
        m = a.index(max(a[:size]))
        if m == size - 1:
            continue
        if m > 0:
            a[:m + 1] = a[:m + 1][::-1]; flips.append(m + 1)
        a[:size] = a[:size][::-1]; flips.append(size)
    return [a, flips]
`,
      tests: [
        {
          args: [[3, 1, 2]],
          expected: [
            [1, 2, 3],
            [3, 2],
          ],
        },
        {
          args: [[9, 8, 7]],
          expected: [[7, 8, 9], [3]],
        },
      ],
    },
    {
      language: "javascript",
      entry: "maxFlips",
      code: `function maxFlips(n) {
  return Math.max(0, 2 * n - 3);
}
`,
      tests: [
        {
          args: [8],
          expected: 13,
        },
      ],
    },
  ],
  visualizer: "pancake-sort",
  practice: [
    {
      id: "pan-bound",
      kind: "numeric",
      prompt: "What is the simple algorithm's upper bound on flips for 10 pancakes?",
      answer: 17,
      explanation: "2n − 3 = 17.",
      hints: ["Two flips per pancake, except the last two."],
      objective: "Flip bound",
    },
    {
      id: "pan-step",
      kind: "mcq",
      prompt: "The largest of the top 5 pancakes is at position 2. What are the next two flips?",
      options: [
        "Flip the top 3, then flip the top 5",
        "Flip the top 5, then the top 3",
        "Flip the top 2 only",
        "Flip the top 5 only",
      ],
      answer: 0,
      explanation: "Bring it to the top (flip 3), then to position 4 (flip 5).",
      distractors: {
        "1": "That moves the wrong pancake.",
        "2": "It must reach the top first.",
        "3": "It is not at the top yet.",
      },
      hints: ["First to the top, then to the bottom of the part."],
      objective: "Procedure",
    },
  ],
  exam: {
    definition:
      "Pancake sort sorts using only prefix reversals, placing the largest remaining element with at most two flips.",
    steps: ["Find max in the unsorted prefix.", "Flip it to the top.", "Flip it into place."],
    timeComplexity: "O(n²) time; ≤ 2n − 3 flips.",
    spaceComplexity: "$O(1)$.",
    correctness:
      "Each round places the largest remaining value at the bottom of the unsorted part.",
    applications: ["Puzzles", "Genome rearrangement models (reversals)"],
    limitations: ["Quadratic"],
    faq: [
      {
        q: "Is 2n − 3 optimal?",
        a: "No; better bounds exist, and computing the optimum for a given stack is NP-hard.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Move (1).", "Algorithm (2).", "Bounds (2)."],
      },
    ],
  },
  references: [
    {
      citation:
        "W. H. Gates, C. H. Papadimitriou, “Bounds for sorting by prefix reversal,” Discrete Mathematics, 27(1), 1979.",
      supports: "Flip bounds for pancake sorting.",
    },
    {
      citation:
        "L. Bulteau, G. Fertin, I. Rusu, “Pancake flipping is hard,” Journal of Computer and System Sciences, 81(8), 2015.",
      supports: "NP-hardness of the minimum-flip problem.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
