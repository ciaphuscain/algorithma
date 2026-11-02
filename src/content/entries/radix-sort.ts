import type { AlgorithmEntry } from "../types";

export const radixSortEntry: AlgorithmEntry = {
  slug: "radix-sort",
  name: "Radix Sort (LSD)",
  aliases: ["Least-significant-digit radix sort", "LSD radix sort"],
  curriculum: [37],
  domain: "searching-sorting",
  subcategory: "Distribution sorting",
  difficulty: "intermediate",
  summary:
    "Sorts integers digit by digit, least significant first, with a stable counting sort for each digit; after the last digit the whole array is sorted.",
  tags: ["sorting", "non-comparison sort", "stable", "linear time", "integer keys"],
  prerequisites: ["Counting Sort"],
  related: ["counting-sort", "merge-sort"],
  problem: {
    input: "An array $A$ of $n$ non-negative integers with at most $d$ digits in base $b$.",
    output: "The same integers in non-decreasing order.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Sort a pile of three-digit numbers by their last digit, then by their middle digit, then by their first. It sounds backwards, but it works, as long as each round keeps numbers with equal digits in the order the previous round left them.",
      },
      {
        kind: "p",
        text: "After the round on the last digit, numbers are ordered by that digit. The round on the middle digit groups by the middle digit, and inside each group the previous order (by last digit) survives. So the array is ordered by its last two digits, and so on.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Let $d$ be the number of digits of the largest value.",
          "For $p = 0, 1, \\dots, d-1$: sort the array by digit $p$ (ones, tens, hundreds, …) with a **stable** counting sort over the digits 0–9.",
          "After the pass on digit $p$, the array is sorted by its last $p + 1$ digits; after the last pass it is sorted.",
        ],
      },
      { kind: "heading", text: "Worked example: [329, 457, 657, 839, 436, 720, 355]" },
      {
        kind: "table",
        head: ["After sorting by", "Array"],
        rows: [
          ["ones digit", "[720, 355, 436, 457, 657, 329, 839]"],
          ["tens digit", "[720, 329, 436, 839, 355, 457, 657]"],
          ["hundreds digit", "[329, 355, 436, 457, 657, 720, 839]"],
        ],
      },
      {
        kind: "p",
        text: "Look at 457 and 657 in the second row: both have tens digit 5, and they stay in the order the first pass left them. Three passes over 7 numbers make 141 writes in this visualizer, $3 \\cdot (4 \\cdot 7 + 19)$: per pass, 10 to clear the counts, 7 counts, 9 running totals, 7 decrements, 7 placements in $B$ and 7 copies back into $A$. No two numbers are ever compared.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "**Each pass must be stable.** With an unstable per-digit sort, the order from earlier passes is lost and the result is wrong.",
          "**Choose the base.** Base 256 (one byte per pass) is common for 32-bit integers: 4 passes with 256 counters. A larger base means fewer passes but a bigger count array.",
          "**Negative numbers** need care: sort by the sign separately, or flip the sign bit of two's-complement integers so they order correctly as unsigned values.",
          "**Strings and variable lengths:** LSD works on fixed-length keys (pad shorter ones). MSD radix sort, which starts from the most significant digit and recurses into buckets, handles variable-length strings naturally.",
        ],
      },
    ],
    mathematics: [
      { kind: "heading", text: "Correctness, by induction on the passes" },
      {
        kind: "p",
        text: "**Claim:** after the pass on digit $p$, the array is sorted by the number formed by its last $p+1$ digits, $x \\bmod b^{p+1}$. For $p = 0$ this is what the pass does. For the step, take two numbers $x$ and $y$. If their digit $p$ differs, the pass orders them by it, which decides their order by the last $p + 1$ digits. If digit $p$ is equal, the stable pass keeps their previous order, which by induction was correct for the last $p$ digits, and hence for the last $p + 1$. After the last pass, $x \\bmod b^d = x$.",
      },
      { kind: "heading", text: "Running time" },
      {
        kind: "math",
        tex: "T = \\Theta\\big(d\\,(n + b)\\big), \\qquad \\text{space } \\Theta(n + b).",
      },
      {
        kind: "p",
        text: "For $n$ keys of $w$ bits, choosing $b = 2^r$ gives $d = \\lceil w/r \\rceil$ passes; with $r \\approx \\log_2 n$, the time is $\\Theta(n \\cdot w / \\log n)$. That is linear when keys have $O(\\log n)$ bits, as they often do.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**MSD radix sort** sorts by the most significant digit first and recurses into each bucket; it can stop early on distinct prefixes and suits strings.",
          "**History.** LSD radix sorting was the method of mechanical punched-card sorters, which sorted a deck one column at a time, starting from the last (CLRS, notes to chapter 8).",
          "**In practice** radix sort is used for large arrays of integers or fixed-width keys, e.g. on GPUs, where its regular memory access pattern helps.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "\\Theta(d(n + b))", average: "\\Theta(d(n + b))", worst: "\\Theta(d(n + b))" },
    space: "\\Theta(n + b)",
    worstClass: "n",
    note: "$d$ digits in base $b$ (here $b = 10$); linear for a fixed number of digits.",
  },
  properties: [
    { label: "Stable", value: "Yes" },
    { label: "In place", value: "No" },
    { label: "Comparisons", value: "None" },
  ],
  implementations: [
    {
      language: "python",
      entry: "radix_sort",
      code: `def radix_sort(a):
    """Sort non-negative integers with LSD radix sort in base 10."""
    if not a:
        return []
    a = list(a)
    place = 1
    while max(a) // place > 0:
        count = [0] * 10
        for x in a:
            count[x // place % 10] += 1
        for v in range(1, 10):
            count[v] += count[v - 1]
        out = [0] * len(a)
        for x in reversed(a):
            d = x // place % 10
            count[d] -= 1
            out[count[d]] = x
        a = out
        place *= 10
    return a
`,
      tests: [
        {
          args: [[329, 457, 657, 839, 436, 720, 355]],
          expected: [329, 355, 436, 457, 657, 720, 839],
        },
        { args: [[170, 45, 75, 90, 802, 24, 2, 66]], expected: [2, 24, 45, 66, 75, 90, 170, 802] },
        { args: [[0, 0, 0]], expected: [0, 0, 0] },
      ],
    },
    {
      language: "javascript",
      entry: "radixSort",
      code: `function radixSort(a) {
  if (a.length === 0) return [];
  let arr = [...a];
  const max = Math.max(...arr);
  for (let place = 1; Math.floor(max / place) > 0; place *= 10) {
    const count = new Array(10).fill(0);
    for (const x of arr) count[Math.floor(x / place) % 10]++;
    for (let v = 1; v < 10; v++) count[v] += count[v - 1];
    const out = new Array(arr.length);
    for (let j = arr.length - 1; j >= 0; j--) {
      const d = Math.floor(arr[j] / place) % 10;
      out[--count[d]] = arr[j];
    }
    arr = out;
  }
  return arr;
}
`,
      tests: [
        { args: [[31, 13, 33, 11, 23, 21, 32, 12]], expected: [11, 12, 13, 21, 23, 31, 32, 33] },
        { args: [[5]], expected: [5] },
        { args: [[100, 10, 1]], expected: [1, 10, 100] },
      ],
    },
  ],
  visualizer: "radix-sort",
  practice: [
    {
      id: "radix-after-one",
      kind: "mcq",
      prompt:
        "LSD radix sort runs on [170, 45, 75, 90, 802, 24, 2, 66]. What is the array after the pass on the ones digit?",
      options: [
        "[170, 90, 802, 2, 24, 45, 75, 66]",
        "[2, 24, 45, 66, 75, 90, 170, 802]",
        "[802, 2, 24, 45, 66, 170, 75, 90]",
        "[90, 170, 2, 802, 24, 45, 75, 66]",
      ],
      answer: 0,
      explanation:
        "Ones digits: 0, 5, 5, 0, 2, 4, 2, 6. Stable order by digit: the 0s (170, 90), the 2s (802, 2), the 4 (24), the 5s (45, 75), the 6 (66).",
      distractors: {
        1: "That is the final result after all three passes.",
        2: "That is the order after the tens pass.",
        3: "Within the 0s and the 2s the input order must be kept: 170 before 90, 802 before 2.",
      },
      hints: ["Group by the last digit, keeping the input order inside each group."],
      objective: "Trace one pass",
    },
    {
      id: "radix-stable",
      kind: "mcq",
      prompt: "What goes wrong if each pass uses an unstable sort on the digit?",
      options: [
        "Earlier passes' work is lost, so the result may be unsorted",
        "It becomes slower but still correct",
        "Nothing; stability only matters for records",
        "It sorts in descending order",
      ],
      answer: 0,
      explanation:
        "Correctness relies on ties in the current digit keeping the order from the previous passes. An unstable pass can reorder 457 and 436 in the hundreds pass, for example, after the tens pass put them in order.",
      distractors: {
        1: "The running time is the same, but the result can be wrong.",
        2: "The induction step needs stability even for plain numbers.",
        3: "Instability scrambles ties; it does not reverse the order.",
      },
      hints: [
        "In the correctness argument, what happens to two numbers with the same current digit?",
      ],
      objective: "Explain why stability is needed",
    },
    {
      id: "radix-writes",
      kind: "numeric",
      prompt:
        "In this visualizer, one pass over $n$ numbers makes $4n + 19$ writes. How many writes does sorting 7 three-digit numbers take?",
      answer: 141,
      explanation: "Three passes, each $4 \\cdot 7 + 19 = 47$ writes: 141.",
      hints: ["How many passes does a three-digit maximum need?"],
      objective: "Count operations",
    },
  ],
  exam: {
    definition:
      "LSD radix sort sorts integers by applying a stable sort (usually counting sort) to each digit position in turn, from the least significant digit to the most significant.",
    steps: [
      "Let $d$ be the number of digits of the maximum key in base $b$.",
      "For $p = 0..d-1$: stably sort the array by digit $p$ using counting sort over $0..b-1$.",
      "Return the array.",
    ],
    timeComplexity: "$\\Theta(d(n + b))$ in every case.",
    spaceComplexity: "$\\Theta(n + b)$.",
    correctness:
      "By induction, after pass $p$ the keys are sorted by their last $p+1$ digits: different digits are ordered by the pass, equal digits keep their order because the pass is stable.",
    applications: [
      "Large arrays of fixed-width integers or keys",
      "Sorting on GPUs and in data-parallel systems",
      "Suffix-array construction (sorting pairs of ranks)",
    ],
    limitations: [
      "Needs keys made of digits (integers, fixed-length strings)",
      "Not in place",
      "Many passes when keys are long relative to $\\log n$",
    ],
    faq: [
      {
        q: "Why start from the least significant digit?",
        a: "So that each later, more significant pass decides the order and stability preserves the order from the less significant digits for ties.",
      },
      {
        q: "Is radix sort always faster than quicksort?",
        a: "No: constants, memory traffic and key length matter. It wins for many short integer keys.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Stable sort by each digit, least significant first.",
          "$\\Theta(d(n + b))$; requires a stable per-digit sort.",
        ],
      },
      {
        marks: 5,
        outline: [
          "Definition (1).",
          "Pseudocode with counting sort per digit (2).",
          "Trace of all passes on a small example (1).",
          "Complexity and the role of stability (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Definition and digit decomposition — 1.",
          "Counting sort as the stable subroutine — 2.",
          "Full trace showing the array after each pass — 3.",
          "Correctness by induction — 2.",
          "Complexity, choice of base, comparison with comparison sorts — 2.",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 3rd ed., MIT Press, 2009, §8.3 and the notes to chapter 8.",
      supports:
        "LSD radix sort, its correctness lemma and $\\Theta(d(n + k))$ analysis, the choice of base, the example numbers, and the punched-card history.",
    },
    {
      citation:
        "D. E. Knuth, The Art of Computer Programming, Vol. 3: Sorting and Searching, 2nd ed., Addison-Wesley, 1998, §5.2.5.",
      supports: "Sorting by distribution (radix sorting).",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked-example numbers are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-25",
};
