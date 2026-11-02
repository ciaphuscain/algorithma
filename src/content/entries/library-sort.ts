import type { AlgorithmEntry } from "../types";

export const librarySortEntry: AlgorithmEntry = {
  slug: "library-sort",
  name: "Library Sort",
  aliases: ["Gapped insertion sort"],
  curriculum: [24],
  domain: "searching-sorting",
  subcategory: "Insertion-based sorting",
  difficulty: "advanced",
  summary:
    "Insertion sort with gaps left between the sorted elements, like a library shelf with space for new books, so an insertion usually shifts only a few elements. Re-spreading the elements after 1, 2, 4, 8, … insertions gives O(n log n) time with high probability for random insertion order.",
  tags: ["sorting", "insertion sort", "gaps", "randomized analysis"],
  prerequisites: ["Binary insertion sort"],
  related: ["binary-insertion-sort", "insertion-sort"],
  problem: {
    input: "An array of numbers.",
    output: "The same numbers in non-decreasing order.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Inserting a book into a packed shelf means moving every book after it. A librarian leaves gaps so that a new book usually fits with little shuffling. Library sort does the same with an array: elements sit apart, with empty cells between them, and every so often the shelf is tidied to restore the gaps.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Use a shelf S of 2n cells, initially empty.",
          "To insert x, binary-search the occupied cells for the last one ≤ x; the target is the cell after it. If that cell is empty, put x there; otherwise shift elements right up to the nearest gap and put x in place.",
          "After 1, 2, 4, 8, … insertions, re-spread the elements so that each is followed by a gap.",
          "Finally read the occupied cells from left to right.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the fifth preset): ten values [47, 12, 85, 3, 61, 29, 74, 18, 90, 55]. The shelf is re-spread after 1, 2, 4 and 8 insertions; the ten insertions make 21 comparisons and shift elements only 8 times in all. On reversed input, where every new value goes to the very front, the shifts rise to 21 — the gaps help most when insertion points are spread out.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "The paper uses a parameter ε: the shelf has (1 + ε)n cells and rebalancing leaves ε gaps per element; this visualizer uses ε = 1.",
          "Binary search must skip gaps — here it searches the list of occupied cells.",
          "The O(n log n) bound assumes the input arrives in random order; an adversarial order can still force long shifts.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Cost.** Bender, Farach-Colton and Mosteiro (2006) proved that with random insertion order, library sort runs in O(n log n) time with high probability: binary searches cost O(log n) each, re-spreading after m insertions costs O(m), so all the re-spreads together cost O(n), and with high probability the shifts between rebalances stay short. The worst case is O(n²). The tests check the output and that the shelf, read left to right, equals it.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "The paper's title, “Insertion sort is O(n log n)”, makes the point that the slowness of insertion sort comes from the data layout, not the method.",
          "Packed-memory arrays use the same idea for dynamic ordered sets in cache-oblivious data structures.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n log n)",
      average: "O(n log n) w.h.p.",
      worst: "O(n²)",
    },
    space: "O(n)",
    worstClass: "n^2",
    note: "The average is with high probability over a random insertion order.",
  },
  properties: [
    {
      label: "Shelf size",
      value: "2n cells (ε = 1)",
    },
    {
      label: "Rebalance",
      value: "After 2^k insertions",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "library_sort",
      code: `from bisect import bisect_right

def library_sort(a):
    n = len(a)
    shelf = [None] * (2 * n)
    count = 0
    for x in a:
        occ = [i for i, v in enumerate(shelf) if v is not None]
        k = bisect_right([shelf[i] for i in occ], x)
        if k == 0:
            p = occ[0] - 1 if occ and occ[0] > 0 else 0
        else:
            p = occ[k - 1] + 1
        g = p
        while shelf[g] is not None:      # find the next gap
            g += 1
        shelf[p + 1:g + 1] = shelf[p:g]  # shift right into it
        shelf[p] = x
        count += 1
        if count & (count - 1) == 0:     # 1, 2, 4, 8, ...: re-spread
            items = [v for v in shelf if v is not None]
            shelf = [None] * (2 * n)
            for j, v in enumerate(items):
                shelf[2 * j] = v
    return [v for v in shelf if v is not None]
`,
      tests: [
        {
          args: [[47, 12, 85, 3, 61, 29, 74, 18, 90, 55]],
          expected: [3, 12, 18, 29, 47, 55, 61, 74, 85, 90],
        },
        {
          args: [[2, 1]],
          expected: [1, 2],
        },
      ],
    },
    {
      language: "javascript",
      entry: "rebalances",
      code: `// Number of re-spreads during n insertions (after 1, 2, 4, … but not after the last).
function rebalances(n) {
  let count = 0;
  for (let k = 1; k < n; k *= 2) count++;
  return count;
}
`,
      tests: [
        {
          args: [10],
          expected: 4,
        },
        {
          args: [5],
          expected: 3,
        },
      ],
    },
  ],
  visualizer: "library-sort",
  practice: [
    {
      id: "lib-why",
      kind: "mcq",
      prompt: "What do the gaps buy library sort?",
      options: [
        "Shorter shifts when inserting",
        "Fewer comparisons in the binary search",
        "Stability",
        "Less memory",
      ],
      answer: 0,
      explanation: "An insertion only shifts elements up to the nearest gap.",
      distractors: {
        "1": "The binary search costs the same.",
        "2": "Stability is unrelated.",
        "3": "It uses more memory: about 2n cells.",
      },
      hints: ["What makes plain insertion sort slow?"],
      objective: "Purpose of gaps",
    },
    {
      id: "lib-rebalance",
      kind: "numeric",
      prompt:
        "Inserting 100 values, how many re-spreads happen (after 1, 2, 4, … insertions, not after the last)?",
      answer: 7,
      explanation: "After 1, 2, 4, 8, 16, 32 and 64 insertions.",
      hints: ["Count powers of two below 100."],
      objective: "Rebalancing",
    },
  ],
  exam: {
    definition:
      "Library sort is an insertion sort over an array with gaps, rebalanced after each doubling of the number of elements.",
    steps: [
      "Binary search among occupied cells.",
      "Insert into a gap or shift to the nearest gap.",
      "Re-spread after 2^k insertions.",
    ],
    timeComplexity: "O(n log n) w.h.p. for random order; O(n²) worst case.",
    spaceComplexity: "$O(n)$ extra (the gaps).",
    correctness: "Occupied cells are always in sorted order; rebalancing preserves the order.",
    applications: ["Online insertion into sorted arrays", "Packed-memory arrays"],
    limitations: ["Extra space", "Bound depends on random insertion order"],
    faq: [
      {
        q: "Is it stable?",
        a: "This version inserts after equal keys, so equal keys keep their input order.",
      },
    ],
    answers: [
      {
        marks: 10,
        outline: [
          "Idea and analogy (2).",
          "Insertion with gaps (3).",
          "Rebalancing (2).",
          "Analysis (3).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "M. A. Bender, M. Farach-Colton, M. A. Mosteiro, “Insertion sort is O(n log n),” Theory of Computing Systems, 39(3), 2006.",
      supports: "Library sort and its O(n log n) high-probability bound.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
