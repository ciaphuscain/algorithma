import type { AlgorithmEntry } from "../types";

export const beadSortEntry: AlgorithmEntry = {
  slug: "bead-sort",
  name: "Bead Sort",
  aliases: ["Gravity sort", "Abacus sort"],
  curriculum: [48],
  domain: "searching-sorting",
  subcategory: "Specialized sorting",
  difficulty: "beginner",
  summary:
    "Represent each positive integer as a row of beads on vertical rods and let gravity pull the beads down. Each rod's beads stack at the bottom, and the rows then hold the values in order. A ‘natural’ algorithm: free in physics, O(n · max) when simulated.",
  tags: ["sorting", "natural computing", "positive integers", "grid"],
  prerequisites: ["Counting sort"],
  related: ["counting-sort", "bucket-sort"],
  problem: {
    input: "Positive whole numbers 1–12.",
    output: "The same numbers in non-decreasing order.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "On an abacus, put a row of 3 beads for the value 3, a row of 1 bead for 1, and so on, each starting from the left. Now tilt the frame so the beads fall down their rods. A rod has a bead in a row exactly when that row's value is larger than the rod's index — so after the fall, the bottom rows have the most beads and the top rows the fewest.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Row i gets A[i] beads, on rods 0 … A[i] − 1.",
          "For each rod, count its beads and move them to the bottom of the rod.",
          "Read row i's bead count: it is the i-th smallest value.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): [3, 1, 4, 1, 5]. Rod 0 holds 5 beads, rod 1 three, rod 2 three, rod 3 two, rod 4 one. After they fall, the rows from top to bottom hold 1, 1, 3, 4, 5 beads.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Only for positive integers; zero and negatives need shifting first.",
          "Simulated, the cost is the number of grid cells, O(n · max) — usually worse than counting sort.",
          "With hardware (or a physical frame) each rod falls in parallel; the original paper discusses analogue and hardware realisations.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Correctness.** After the fall, rod j holds c_j beads at the bottom, where c_j is the number of values > j. Row i from the top (of n rows) holds a bead on rod j exactly when c_j ≥ n − i, so its bead count is the number of j with c_j ≥ n − i — the (i+1)-th smallest value. **Cost:** n · max cell operations simulated; O(1) to O(n) ‘time steps’ in idealised physical models. The tests check the output.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Arulanandham, Calude and Dinneen (2002) proposed bead sort as an example of natural computing.",
          "It is equivalent to counting how many values exceed each threshold: a transposed counting sort.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n · max)",
      average: "O(n · max)",
      worst: "O(n · max)",
    },
    space: "O(n · max)",
    worstClass: "other",
    note: "Simulated in software; max is the largest value.",
  },
  properties: [
    {
      label: "Values",
      value: "Positive integers only",
    },
    {
      label: "Model",
      value: "Beads falling on rods",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "bead_sort",
      code: `def bead_sort(a):
    n, m = len(a), max(a)
    rods = [sum(1 for x in a if x > j) for j in range(m)]   # beads per rod
    # after the fall, row i (from the top) has a bead on rod j iff rods[j] >= n - i
    return [sum(1 for c in rods if c >= n - i) for i in range(n)]
`,
      tests: [
        {
          args: [[3, 1, 4, 1, 5]],
          expected: [1, 1, 3, 4, 5],
        },
        {
          args: [[6, 5, 4, 3, 2, 1]],
          expected: [1, 2, 3, 4, 5, 6],
        },
      ],
    },
    {
      language: "javascript",
      entry: "rodCounts",
      code: `function rodCounts(a) {
  const m = Math.max(...a);
  return Array.from({ length: m }, (_, j) => a.filter((x) => x > j).length);
}
`,
      tests: [
        {
          args: [[3, 1, 4, 1, 5]],
          expected: [5, 3, 3, 2, 1],
        },
      ],
    },
  ],
  visualizer: "bead-sort",
  practice: [
    {
      id: "bead-rod",
      kind: "numeric",
      prompt: "For values [2, 7, 4], how many beads are on rod 3 (rods count from 0)?",
      answer: 2,
      explanation: "Rod 3 has a bead in every row whose value exceeds 3: 7 and 4.",
      hints: ["Count values greater than the rod index."],
      objective: "Rods",
    },
    {
      id: "bead-neg",
      kind: "mcq",
      prompt: "Why can't bead sort sort −3 directly?",
      options: [
        "A row cannot have a negative number of beads",
        "Gravity points the wrong way",
        "It only sorts even numbers",
        "It can",
      ],
      answer: 0,
      explanation: "Values are bead counts; shift them to be positive first.",
      distractors: {
        "1": "Direction is not the issue.",
        "2": "Any positive integer works.",
        "3": "Negative counts are meaningless.",
      },
      hints: ["What does a value become on the frame?"],
      objective: "Domain",
    },
  ],
  exam: {
    definition:
      "Bead sort sorts positive integers by letting beads representing each value fall along rods.",
    steps: ["Place beads.", "Let each rod's beads fall.", "Count beads per row."],
    timeComplexity: "O(n·max) simulated.",
    spaceComplexity: "O(n·max).",
    correctness: "Rod counts are threshold counts; rows then read the order statistics.",
    applications: ["Natural/analogue computing examples"],
    limitations: ["Positive integers only", "Slow in software"],
    faq: [
      {
        q: "Is it O(n)?",
        a: "Only in idealised physical models; simulated in software it is O(n · max).",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Model (2).", "Correctness (2).", "Cost (1)."],
      },
    ],
  },
  references: [
    {
      citation:
        "J. J. Arulanandham, C. S. Calude, M. J. Dinneen, “Bead-sort: a natural sorting algorithm,” Bulletin of the European Association for Theoretical Computer Science, 76, 2002.",
      supports: "Bead sort and its analysis.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
