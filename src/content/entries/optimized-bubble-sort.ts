import type { AlgorithmEntry } from "../types";

export const optimizedBubbleSortEntry: AlgorithmEntry = {
  slug: "optimized-bubble-sort",
  name: "Optimized Bubble Sort",
  aliases: ["Bubble sort with early exit"],
  curriculum: [12],
  domain: "searching-sorting",
  subcategory: "Elementary sorting",
  difficulty: "beginner",
  summary:
    "Bubble sort that stops when a pass makes no swap and ends each pass where the previous one last swapped. Sorted input takes one pass of n − 1 comparisons; the worst case is still O(n²).",
  tags: ["sorting", "bubble sort", "adaptive", "in-place", "stable"],
  prerequisites: ["Bubble sort"],
  related: ["bubble-sort", "cocktail-shaker-sort", "insertion-sort"],
  problem: {
    input: "An array of numbers.",
    output: "The same numbers in non-decreasing order.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Plain bubble sort keeps making passes even when the array is already sorted. But a pass that swaps nothing proves the array is sorted, and more generally, if a pass's last swap was at position k, everything after k is already in its final place — the next pass can stop there.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "end = n − 1.",
          "Scan A[0..end], swapping out-of-order neighbours and remembering the position `last` of the last swap.",
          "Set end = last. If no swap happened, last = 0 and the sort stops.",
        ],
      },
      {
        kind: "p",
        text: "**Worked examples.** On sorted input [1, …, 8] one pass makes 7 comparisons and no swap: done. On the nearly sorted [1, 2, 3, 5, 4, 6, 7, 8] the first pass swaps 5 and 4 at position 3, so the second pass only scans A[0..3] — 7 + 3 = 10 comparisons in all, against 28 for plain bubble sort. On [5, 1, 4, 2, 8] it takes 3 passes and 7 comparisons (plain: 10).",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "The swap count equals the number of inversions — the same as plain bubble sort; only comparisons are saved.",
          "It is stable: equal elements are never swapped.",
          "Insertion sort does the same work with fewer writes and is usually preferred.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Cost.** Best case n − 1 comparisons (sorted input); worst case $n(n-1)/2$ (reversed input), O(n²). Each swap removes exactly one inversion, so swaps = inversions. **Correctness:** after a pass whose last swap was at position $k$, no pair beyond $k$ is out of order, and each of those positions holds the largest values seen, so they are final. The tests check the output, that swaps equal inversions, and that sorted input costs n − 1 comparisons.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Knuth (TAOCP Vol. 3, §5.2.2) analyses bubble sort with this “last exchange” bound and shows it is still quadratic on average.",
          "Cocktail shaker sort applies the same bound from both ends.",
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
      label: "Adaptive",
      value: "Yes: stops early, shrinks to the last swap",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "bubble_sort",
      code: `def bubble_sort(a):
    a = list(a)
    end = len(a) - 1
    while end > 0:
        last = 0
        for j in range(end):
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
                last = j
        end = last
    return a
`,
      tests: [
        {
          args: [[5, 1, 4, 2, 8]],
          expected: [1, 2, 4, 5, 8],
        },
        {
          args: [[3, 1, 3, 2]],
          expected: [1, 2, 3, 3],
        },
      ],
    },
    {
      language: "javascript",
      entry: "comparisons",
      code: `// Comparisons made by optimized bubble sort.
function comparisons(input) {
  const a = [...input];
  let end = a.length - 1, count = 0;
  while (end > 0) {
    let last = 0;
    for (let j = 0; j < end; j++) {
      count++;
      if (a[j] > a[j + 1]) { [a[j], a[j + 1]] = [a[j + 1], a[j]]; last = j; }
    }
    end = last;
  }
  return count;
}
`,
      tests: [
        {
          args: [[1, 2, 3, 4, 5, 6, 7, 8]],
          expected: 7,
        },
        {
          args: [[1, 2, 3, 5, 4, 6, 7, 8]],
          expected: 10,
        },
      ],
    },
  ],
  visualizer: "optimized-bubble-sort",
  practice: [
    {
      id: "obs-best",
      kind: "numeric",
      prompt:
        "How many comparisons does optimized bubble sort make on 20 elements already in order?",
      answer: 19,
      explanation: "One pass of n − 1 comparisons, with no swap, ends the sort.",
      hints: ["How many passes are needed to see no swap?"],
      objective: "Best case",
    },
    {
      id: "obs-swaps",
      kind: "numeric",
      prompt: "How many swaps does it make on [3, 1, 2]?",
      answer: 2,
      explanation: "Swaps equal inversions: (3,1) and (3,2).",
      hints: ["Count pairs out of order."],
      objective: "Swaps = inversions",
    },
  ],
  exam: {
    definition:
      "Optimized bubble sort is bubble sort that remembers the last swap of each pass and stops when a pass makes none.",
    steps: [
      "Scan to end, tracking the last swap.",
      "Shrink end to the last swap.",
      "Stop when no swap.",
    ],
    timeComplexity: "O(n) best, O(n²) worst.",
    spaceComplexity: "$O(1)$.",
    correctness: "Beyond the last swap, everything is final.",
    applications: ["Nearly sorted small arrays", "Teaching adaptivity"],
    limitations: ["Quadratic in general"],
    faq: [
      {
        q: "Does it reduce swaps?",
        a: "No — swaps always equal inversions; it saves comparisons.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Early exit (2).", "Last-swap bound (2).", "Best/worst case (1)."],
      },
    ],
  },
  references: [
    {
      citation:
        "D. E. Knuth, The Art of Computer Programming, Vol. 3: Sorting and Searching, 2nd ed., Addison-Wesley, 1998, Section 5.2.2.",
      supports: "Bubble sort with the last-exchange bound, and its analysis.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
