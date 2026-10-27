import type { AlgorithmEntry } from "../types";

export const cycleSortEntry: AlgorithmEntry = {
  slug: "cycle-sort",
  name: "Cycle Sort",
  aliases: ["Write-minimal sort"],
  curriculum: [20],
  domain: "searching-sorting",
  subcategory: "Elementary sorting",
  difficulty: "intermediate",
  summary:
    "Writes each element straight into its final position, found by counting the smaller elements, and carries the displaced element on around its cycle. It makes the minimum possible number of writes to the array — useful when writes are expensive — at the cost of O(n²) comparisons.",
  tags: ["sorting", "in-place", "permutation cycles", "minimum writes", "unstable"],
  prerequisites: ["Selection sort", "Permutations"],
  related: ["selection-sort", "counting-sort"],
  problem: {
    input: "An array of numbers.",
    output: "The same numbers in non-decreasing order.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Every element knows where it belongs: if 3 elements are smaller, it belongs at position 3. Pick one up, put it there, and pick up the one you displaced; that one also knows where it belongs. Following the chain you eventually return to where you started — a cycle of the permutation — and every element on it was written exactly once.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "For each start position: item = A[start]; pos = start + the number of later elements smaller than item.",
          "If pos = start, it is in place. Otherwise skip past any equal values already at pos, write item there, and pick up the old value.",
          "Repeat for the carried value until the cycle returns to start.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): [5, 1, 4, 2, 8]. 5 has three smaller elements, so it goes to 3, displacing 2; 2 goes to 1, displacing 1; 1 goes to 0, closing the cycle. 4 and 8 are already in place. Three writes — exactly the three misplaced elements.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Comparisons are Θ(n²): each placement scans the rest of the array.",
          "Duplicates need the “skip equal values” step, or two equal elements would be written to the same position forever.",
          "Useful for EEPROM or flash memory with limited write cycles, and as a teaching tool for permutation cycles.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Writes.** An element already in place is never written; every other element is written once. For distinct values that is n − (number of fixed points), the minimum any in-place algorithm can achieve, since every misplaced element must be written at least once (Haddon, 1990). **Comparisons:** Θ(n²). The tests check the output and that, for distinct values, the writes equal the number of misplaced elements.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Sorting by cycles is also how one applies a known permutation in place.",
          "Selection sort minimises swaps (at most n − 1) but each swap is two writes; cycle sort minimises writes.",
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
    note: "Writes: at most n, and the minimum possible.",
  },
  properties: [
    {
      label: "Writes",
      value: "Each misplaced element once",
    },
    {
      label: "Stable",
      value: "No",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "cycle_sort",
      code: `def cycle_sort(a):
    a = list(a)
    writes = 0
    for start in range(len(a) - 1):
        item = a[start]
        pos = start + sum(1 for x in a[start + 1:] if x < item)
        if pos == start:
            continue
        while item == a[pos]:
            pos += 1
        a[pos], item = item, a[pos]
        writes += 1
        while pos != start:
            pos = start + sum(1 for x in a[start + 1:] if x < item)
            while item == a[pos]:
                pos += 1
            a[pos], item = item, a[pos]
            writes += 1
    return [a, writes]
`,
      tests: [
        {
          args: [[5, 1, 4, 2, 8]],
          expected: [[1, 2, 4, 5, 8], 3],
        },
        {
          args: [[4, 2, 4, 1, 2]],
          expected: [[1, 2, 2, 4, 4], 4],
        },
      ],
    },
    {
      language: "javascript",
      entry: "misplaced",
      code: `// Elements not already in their sorted position (distinct values): cycle sort's write count.
function misplaced(a) {
  const s = [...a].sort((x, y) => x - y);
  return a.filter((x, i) => x !== s[i]).length;
}
`,
      tests: [
        {
          args: [[5, 1, 4, 2, 8]],
          expected: 3,
        },
        {
          args: [[3, 1, 2, 5, 4]],
          expected: 5,
        },
      ],
    },
  ],
  visualizer: "cycle-sort",
  practice: [
    {
      id: "cycle-writes",
      kind: "numeric",
      prompt: "How many writes does cycle sort make on [2, 1, 3, 5, 4]?",
      answer: 4,
      explanation: "Two 2-cycles: (2 1) and (5 4); 3 is in place. 4 misplaced elements, 4 writes.",
      hints: ["Count elements not in their sorted position."],
      objective: "Writes",
    },
    {
      id: "cycle-why",
      kind: "mcq",
      prompt: "When is cycle sort the right choice?",
      options: [
        "When writing to memory is far more expensive than reading",
        "When the array is huge",
        "When stability is required",
        "When the input is nearly sorted and time matters",
      ],
      answer: 0,
      explanation: "It minimises writes, at the price of quadratic comparisons.",
      distractors: {
        "1": "Its Θ(n²) comparisons make it slow on large arrays.",
        "2": "It is not stable.",
        "3": "Insertion sort is better then.",
      },
      hints: ["What does it minimise?"],
      objective: "Use case",
    },
  ],
  exam: {
    definition:
      "Cycle sort places each element at the position given by the number of smaller elements, following permutation cycles, so each element is written at most once.",
    steps: [
      "Count smaller elements to find the position.",
      "Skip equal values.",
      "Write and carry the displaced value around the cycle.",
    ],
    timeComplexity: "$O(n^2)$ comparisons.",
    spaceComplexity: "$O(1)$.",
    correctness: "Each placement is final; cycles close at the start.",
    applications: ["Write-limited memory", "Applying permutations"],
    limitations: ["Quadratic comparisons", "Unstable"],
    faq: [
      {
        q: "Why skip equal values?",
        a: "Without it, an element equal to the one at its target position would bounce forever.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Position by counting (2).", "Cycles (2).", "Minimum writes (1)."],
      },
    ],
  },
  references: [
    {
      citation:
        "B. K. Haddon, “Cycle-sort: a linear sorting method,” The Computer Journal, 33(4), 1990.",
      supports: "Sorting by following permutation cycles with minimal writes.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
