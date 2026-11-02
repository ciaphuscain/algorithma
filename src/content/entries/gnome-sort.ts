import type { AlgorithmEntry } from "../types";

export const gnomeSortEntry: AlgorithmEntry = {
  slug: "gnome-sort",
  name: "Gnome Sort",
  aliases: ["Stupid sort"],
  curriculum: [16],
  domain: "searching-sorting",
  subcategory: "Elementary sorting",
  difficulty: "beginner",
  summary:
    "A single position walks along the array: in order, step forward; out of order, swap and step back. It is insertion sort written as one loop with adjacent swaps — O(n²), stable, and very short.",
  tags: ["sorting", "insertion sort", "stable", "in-place", "simple"],
  prerequisites: ["Insertion sort"],
  related: ["insertion-sort", "bubble-sort"],
  problem: {
    input: "An array of numbers.",
    output: "The same numbers in non-decreasing order.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A garden gnome sorts a row of flower pots: it looks at the pot beside it and the previous one. If they are in order it steps forward; if not, it swaps them and steps back to check again. When it reaches the end of the row, the row is sorted.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "pos = 0.",
          "If pos = 0 or A[pos − 1] ≤ A[pos], move forward.",
          "Otherwise swap A[pos − 1] and A[pos] and move back.",
          "Stop when pos = n.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the fourth preset): [34, 2, 10, −9]. The gnome swaps 34 and 2, walks forward, swaps 34 and 10 and steps back (2, 10 in order), walks forward again, then carries −9 back past 34, 10 and 2. Five swaps — one per inversion — and 11 comparisons.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Each backward walk is exactly insertion sort's inner loop, done with swaps.",
          "Remembering where the forward walk was interrupted (and jumping back there) removes the repeated forward steps; that is insertion sort.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Cost.** Every swap removes one inversion, so swaps = inversions $I$, and comparisons are at most $2I + n - 1$: O(n) on sorted input, O(n²) in the worst case. **Correctness:** the invariant “A[0..pos − 1] is sorted” holds whenever the gnome steps forward. The tests check the output and that swaps equal inversions.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Sarbazi-Azad (2000) published it as “stupid sort”; Dick Grune later named it gnome sort.",
          "Its single loop with no nested loop is popular in code-golf and teaching.",
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
  },
  properties: [
    {
      label: "Stable",
      value: "Yes",
    },
    {
      label: "Swaps",
      value: "Equal to the number of inversions",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "gnome_sort",
      code: `def gnome_sort(a):
    a = list(a)
    pos = 0
    while pos < len(a):
        if pos == 0 or a[pos - 1] <= a[pos]:
            pos += 1
        else:
            a[pos - 1], a[pos] = a[pos], a[pos - 1]
            pos -= 1
    return a
`,
      tests: [
        {
          args: [[34, 2, 10, -9]],
          expected: [-9, 2, 10, 34],
        },
        {
          args: [[3, 1, 3, 2]],
          expected: [1, 2, 3, 3],
        },
      ],
    },
    {
      language: "javascript",
      entry: "swaps",
      code: `// Swaps made by gnome sort.
function swaps(input) {
  const a = [...input];
  let pos = 0, count = 0;
  while (pos < a.length) {
    if (pos === 0 || a[pos - 1] <= a[pos]) pos++;
    else { [a[pos - 1], a[pos]] = [a[pos], a[pos - 1]]; count++; pos--; }
  }
  return count;
}
`,
      tests: [
        {
          args: [[34, 2, 10, -9]],
          expected: 5,
        },
        {
          args: [[9, 8, 7, 6, 5, 4, 3, 2]],
          expected: 28,
        },
      ],
    },
  ],
  visualizer: "gnome-sort",
  practice: [
    {
      id: "gnome-swaps",
      kind: "numeric",
      prompt: "How many swaps does gnome sort make on [2, 3, 1]?",
      answer: 2,
      explanation: "Two inversions: (2,1) and (3,1).",
      hints: ["Swaps = inversions."],
      objective: "Cost",
    },
    {
      id: "gnome-relation",
      kind: "mcq",
      prompt: "Which algorithm does gnome sort perform, in effect?",
      options: ["Insertion sort, using swaps", "Selection sort", "Merge sort", "Quick sort"],
      answer: 0,
      explanation: "Each backward walk inserts one element into the sorted prefix.",
      distractors: {
        "1": "Selection sort picks minimums.",
        "2": "No merging happens.",
        "3": "No partitioning happens.",
      },
      hints: ["What does a backward walk do to the element?"],
      objective: "Relation to insertion sort",
    },
  ],
  exam: {
    definition:
      "Gnome sort moves a position forward when neighbours are in order and swaps them and moves back otherwise.",
    steps: ["Forward if ordered.", "Swap and back if not.", "Stop at the end."],
    timeComplexity: "$O(n^2)$; $O(n)$ best.",
    spaceComplexity: "$O(1)$.",
    correctness: "The prefix before pos is always sorted.",
    applications: ["Teaching", "Tiny arrays"],
    limitations: ["Quadratic"],
    faq: [
      {
        q: "Why is it slower than insertion sort?",
        a: "After each backward walk it steps forward again over already-sorted elements, repeating comparisons.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Rule (1).", "Equivalent to insertion sort (1)."],
      },
    ],
  },
  references: [
    {
      citation:
        "H. Sarbazi-Azad, “Stupid sort: a new sorting algorithm,” Newsletter of the Department of Computing Science, University of Glasgow, 2000.",
      supports: "The original description (as stupid sort).",
    },
    {
      citation:
        "D. Grune, “Gnome sort — the simplest sort algorithm,” web page, Vrije Universiteit Amsterdam.",
      supports: "The name gnome sort and its description.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
