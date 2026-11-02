import type { AlgorithmEntry } from "../types";

export const smoothSortEntry: AlgorithmEntry = {
  slug: "smooth-sort",
  name: "Smoothsort",
  aliases: ["Smooth sort"],
  curriculum: [34],
  domain: "searching-sorting",
  subcategory: "Heap-based sorting",
  difficulty: "advanced",
  summary:
    "Dijkstra's heapsort variant on a row of Leonardo heaps. It sorts in place in O(n log n) worst case, like heapsort, but takes O(n) on input that is already sorted — it adapts smoothly to presortedness.",
  tags: ["sorting", "heap", "Leonardo numbers", "adaptive", "in-place"],
  prerequisites: ["Heap sort", "Fibonacci numbers"],
  related: ["heap-sort", "weak-heap-sort"],
  problem: {
    input: "An array of numbers.",
    output: "The same numbers in non-decreasing order.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Heapsort first builds a max-heap with the maximum at the front, then moves it to the back — undoing any existing order. Smoothsort keeps its heaps with their roots at the right end instead, as a row of heaps whose sizes are Leonardo numbers (1, 1, 3, 5, 9, 15, …). The largest element is always the rightmost root, which is already where it belongs. On sorted input almost nothing has to move.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "A Leonardo tree of order k has L(k) nodes: its root is at the right end, preceded by trees of orders k − 1 and k − 2.",
          "Grow: add A[i] to the row — merging the last two trees if their orders are consecutive, otherwise as a new tree of order 1 (or 0).",
          "Trinkle: move the new root left past earlier roots that are larger (so roots increase left to right), then sift it down in its tree.",
          "Shrink: the last root A[i] is the maximum and stays put; if its tree had children, they become two trees, and each is trinkled.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example.** Sorted input [1, …, 8] makes 17 comparisons and no swap — linear. Heapsort on 7 sorted values makes 21 comparisons and 16 swaps. The reversed preset needs 34 comparisons and 18 swaps.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Dijkstra's original keeps the heap sizes in a bit vector and delays some sifting (semi-heaps); this visualizer re-establishes the root order after every step, which is simpler and still O(n log n).",
          "Smoothsort is rarely used in practice: its constant factors are high and it is not stable.",
          "It is the classic example of an adaptive in-place O(n log n) sort.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Cost.** There are O(log n) Leonardo trees in the row, each of height O(log n), so each grow or shrink step costs O(log n): O(n log n) in the worst case. On sorted input each trinkle stops after one comparison and each sift after two, so the total is O(n). The tests check the output on random arrays and that sorted input costs at most 4n comparisons.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Any n is a sum of O(log n) distinct Leonardo numbers, which is why the row stays short.",
          "Hertel (1983) analysed how smoothsort behaves on partly sorted inputs.",
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
    space: "O(1)",
    worstClass: "n log n",
  },
  properties: [
    {
      label: "Heap sizes",
      value: "Leonardo numbers",
    },
    {
      label: "Adaptive",
      value: "O(n) on sorted input",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "leonardo",
      code: `def leonardo(k):
    a, b = 1, 1
    for _ in range(k):
        a, b = b, a + b + 1
    return a
`,
      tests: [
        {
          args: [0],
          expected: 1,
        },
        {
          args: [5],
          expected: 15,
        },
        {
          args: [8],
          expected: 67,
        },
      ],
    },
    {
      language: "javascript",
      entry: "decompose",
      code: `// Write n as a sum of distinct Leonardo numbers, largest first (greedy).
function decompose(n) {
  const L = [1, 1];
  while (L[L.length - 1] < n) L.push(L[L.length - 1] + L[L.length - 2] + 1);
  const parts = [];
  for (let k = L.length - 1; k >= 0 && n > 0; k--)
    if (L[k] <= n && !(k === 0 && parts.at(-1) === 1)) { parts.push(L[k]); n -= L[k]; }
  return parts;
}
`,
      tests: [
        {
          args: [8],
          expected: [5, 3],
        },
        {
          args: [10],
          expected: [9, 1],
        },
      ],
    },
  ],
  visualizer: "smooth-sort",
  practice: [
    {
      id: "ss-leo",
      kind: "numeric",
      prompt: "What is the Leonardo number after 1, 1, 3, 5, 9, 15?",
      answer: 25,
      explanation: "L(k) = L(k − 1) + L(k − 2) + 1 = 15 + 9 + 1.",
      hints: ["Like Fibonacci, plus one."],
      objective: "Leonardo numbers",
    },
    {
      id: "ss-sorted",
      kind: "mcq",
      prompt: "Why is smoothsort linear on sorted input?",
      options: [
        "The largest element is already a rightmost root, so trinkling and sifting stop immediately",
        "It checks first whether the input is sorted",
        "It uses binary search",
        "It skips the heap phase",
      ],
      answer: 0,
      explanation: "Roots at the right end match the final order; no element needs to move.",
      distractors: {
        "1": "There is no separate check.",
        "2": "No binary search is involved.",
        "3": "Both phases run, but each step is O(1).",
      },
      hints: ["Where are the roots kept?"],
      objective: "Adaptivity",
    },
  ],
  exam: {
    definition:
      "Smoothsort is an in-place heapsort variant using a row of Leonardo heaps with roots at their right ends, giving O(n) on sorted input and O(n log n) worst case.",
    steps: [
      "Grow the row of Leonardo heaps.",
      "Trinkle each new root.",
      "Shrink: split the last heap's children into two heaps and trinkle them.",
    ],
    timeComplexity: "O(n) best; O(n log n) worst.",
    spaceComplexity: "$O(1)$.",
    correctness:
      "Roots increase left to right, so the rightmost root is the maximum of what remains.",
    applications: ["Adaptive in-place sorting"],
    limitations: ["Complex", "High constant factors", "Unstable"],
    faq: [
      {
        q: "Why Leonardo numbers?",
        a: "A Leonardo tree splits into two Leonardo trees of the previous two orders, and any n is a sum of few distinct Leonardo numbers.",
      },
    ],
    answers: [
      {
        marks: 10,
        outline: [
          "Leonardo heaps (3).",
          "Grow and trinkle (3).",
          "Shrink (2).",
          "Complexity and adaptivity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "E. W. Dijkstra, “Smoothsort, an alternative for sorting in situ,” Science of Computer Programming, 1(3), 1982.",
      supports: "Smoothsort and Leonardo heaps.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
