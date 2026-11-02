import type { AlgorithmEntry } from "../types";

export const flashSortEntry: AlgorithmEntry = {
  slug: "flash-sort",
  name: "Flashsort",
  aliases: ["Flash sort"],
  curriculum: [40],
  domain: "searching-sorting",
  subcategory: "Distribution sorting",
  difficulty: "advanced",
  summary:
    "A distribution sort that estimates each value's class by linear interpolation between the minimum and maximum, moves every value into its class's region in place by following cycles, and finishes with insertion sort. Close to O(n) for roughly uniform data, with O(1) extra space besides the class table.",
  tags: ["sorting", "distribution", "in-place", "interpolation", "permutation cycles"],
  prerequisites: ["Bucket sort", "Insertion sort"],
  related: ["bucket-sort", "cycle-sort", "interpolation-search"],
  problem: {
    input: "An array of numbers.",
    output: "The same numbers in non-decreasing order.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Bucket sort needs separate buckets. Flashsort guesses where each value roughly belongs from its value alone — the same straight-line estimate as interpolation search — counts how many values fall into each class, and then shuffles values into their class regions within the array itself, following permutation cycles like cycle sort. Insertion sort then fixes the small disorder left inside each class.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Find min and max; with m classes, class(x) = ⌊(m − 1)(x − min) / (max − min)⌋.",
          "Count the values per class and turn the counts into region ends L[c].",
          "Swap the maximum to A[0]. Permute: take a value not yet placed, put it at the end of its class's region (decrementing L[c]), pick up the value that was there, and continue until the cycle closes.",
          "Insertion sort the whole array.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the fourth preset): twelve roughly uniform values with m = 5 classes. After the cycles, every value is in its class region; insertion sort then finishes with 37 comparisons in total for the whole run, including finding the minimum and maximum.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "The number of classes is a tuning choice; this visualizer uses ⌊0.43n⌋, and values around 0.4n–0.5n are typical.",
          "Skewed data leaves big classes and makes the final insertion sort expensive.",
          "Equal minimum and maximum means everything is equal: stop immediately.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Cost.** Classification and counting are O(n); the cycle permutation moves each value once, O(n); the final insertion sort costs O(Σ class sizes²), which is O(n) when values are spread evenly so each class has O(1) values, and O(n²) in the worst case. Extra space is the class table, O(m). The tests check the output on random arrays.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Neubert published Flashsort1 in Dr. Dobb's Journal in 1998.",
          "The in-place cycle permutation is the same technique as American flag sort and cycle sort.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n) for uniform input",
      worst: "O(n²)",
    },
    space: "O(m)",
    worstClass: "n^2",
  },
  properties: [
    {
      label: "Classes",
      value: "m ≈ 0.43n here",
    },
    {
      label: "Permutation",
      value: "In place, by cycles",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "flash_classes",
      code: `def flash_classes(a, m):
    lo, hi = min(a), max(a)
    return [(m - 1) * (x - lo) // (hi - lo) for x in a]
`,
      tests: [
        {
          args: [[42, 7, 88, 15, 63, 29, 94, 51, 3, 76, 34, 60], 5],
          expected: [1, 0, 3, 0, 2, 1, 4, 2, 0, 3, 1, 2],
        },
      ],
    },
    {
      language: "javascript",
      entry: "flashSort",
      code: `function flashSort(input) {
  const a = [...input], n = a.length;
  if (n < 2) return a;
  const m = Math.max(1, Math.floor(0.43 * n));
  let lo = a[0], maxI = 0;
  for (let i = 1; i < n; i++) { if (a[i] < lo) lo = a[i]; if (a[i] > a[maxI]) maxI = i; }
  const hi = a[maxI];
  if (lo === hi) return a;
  const cls = (x) => Math.floor(((m - 1) * (x - lo)) / (hi - lo));
  const L = new Array(m).fill(0);
  for (const x of a) L[cls(x)]++;
  for (let c = 1; c < m; c++) L[c] += L[c - 1];
  [a[0], a[maxI]] = [a[maxI], a[0]];
  let moves = 0, j = 0, k = m - 1;
  while (moves < n - 1) {
    while (j > L[k] - 1) { j++; k = cls(a[j]); }
    let flash = a[j];
    while (j !== L[k]) {
      k = cls(flash);
      const at = --L[k];
      [a[at], flash] = [flash, a[at]];
      moves++;
    }
  }
  for (let i = 1; i < n; i++) for (let p = i; p > 0 && a[p - 1] > a[p]; p--) [a[p - 1], a[p]] = [a[p], a[p - 1]];
  return a;
}
`,
      tests: [
        {
          args: [[42, 7, 88, 15, 63, 29, 94, 51, 3, 76, 34, 60]],
          expected: [3, 7, 15, 29, 34, 42, 51, 60, 63, 76, 88, 94],
        },
        {
          args: [[3, 1, 3, 2]],
          expected: [1, 2, 3, 3],
        },
      ],
    },
  ],
  visualizer: "flash-sort",
  practice: [
    {
      id: "fs-class",
      kind: "numeric",
      prompt: "Values range from 0 to 100 with m = 5 classes. Which class does 60 belong to?",
      answer: 2,
      explanation: "⌊4 · 60 / 100⌋ = ⌊2.4⌋ = 2.",
      hints: ["class(x) = ⌊(m − 1)(x − min) / (max − min)⌋"],
      objective: "Classification",
    },
    {
      id: "fs-space",
      kind: "mcq",
      prompt: "Compared with bucket sort, what does flashsort save?",
      options: [
        "The separate buckets: values are permuted within the array",
        "The final insertion sort",
        "Finding the minimum and maximum",
        "The class counts",
      ],
      answer: 0,
      explanation: "It needs only the class-boundary table.",
      distractors: {
        "1": "It still finishes with insertion sort.",
        "2": "It needs both.",
        "3": "It needs the counts to know the regions.",
      },
      hints: ["Where do the values go during classification?"],
      objective: "In-place permutation",
    },
  ],
  exam: {
    definition:
      "Flashsort classifies values by linear interpolation, permutes them into class regions in place by cycles, and finishes with insertion sort.",
    steps: ["Classify and count.", "Permute by cycles.", "Insertion sort."],
    timeComplexity: "O(n) for uniform data; O(n²) worst.",
    spaceComplexity: "$O(m)$.",
    correctness:
      "After the permutation classes are in order; insertion sort orders within classes.",
    applications: ["Large uniform numeric data"],
    limitations: ["Distribution-dependent", "Unstable"],
    faq: [
      {
        q: "Why move the maximum to A[0] first?",
        a: "It starts the first cycle at position 0 with a value that belongs at the very end of the last class.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Classification (2).", "Cycle permutation (2).", "Finishing pass and cost (1)."],
      },
    ],
  },
  references: [
    {
      citation: "K.-D. Neubert, “The Flashsort1 algorithm,” Dr. Dobb's Journal, February 1998.",
      supports: "Flashsort and its in-place class permutation.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
