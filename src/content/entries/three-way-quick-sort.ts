import type { AlgorithmEntry } from "../types";

export const threeWayQuickSortEntry: AlgorithmEntry = {
  slug: "three-way-quick-sort",
  name: "Three-Way Quicksort",
  aliases: ["Quick3way", "Dutch national flag quicksort", "Fat-pivot quicksort"],
  curriculum: [31],
  domain: "searching-sorting",
  subcategory: "Divide-and-conquer sorting",
  difficulty: "intermediate",
  summary:
    "Quicksort that partitions into less than, equal to and greater than the pivot (Dijkstra's Dutch national flag), then recurses only on the outer parts. Keys equal to the pivot are finished at once, so inputs with few distinct values sort in near-linear time.",
  tags: ["sorting", "quicksort", "duplicates", "Dutch national flag", "partitioning"],
  prerequisites: ["Quick sort"],
  related: ["quick-sort", "dual-pivot-quick-sort", "counting-sort"],
  problem: {
    input: "An array of numbers.",
    output: "The same numbers in non-decreasing order.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Classic quicksort treats a value equal to the pivot like any other, so an array of many equal keys keeps getting split into uneven pieces. Three-way partitioning gathers all the copies of the pivot in the middle in one pass; they are done, and only the strictly smaller and strictly larger values need more work.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "v = A[lo]; lt = lo, i = lo + 1, gt = hi.",
          "While i ≤ gt: if A[i] < v, swap it with A[lt] and advance both; if A[i] > v, swap it with A[gt] and shrink gt; if equal, advance i.",
          "Now A[lo..lt − 1] < v = A[lt..gt] < A[gt + 1..hi]; recurse on the two outer parts.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the fourth preset): [4, 9, 4, 4, 1, 9, 4, 1, 4, 9] has only three distinct values. The first partition around 4 settles all five 4s; two small partitions finish the 1s and 9s: 3 partitions and 12 comparisons in all. Lomuto-style quicksort keeps re-partitioning equal keys.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Bentley and McIlroy's variant (1993) keeps equal keys at both ends during the scan and swaps them into the middle afterwards, making fewer swaps when there are few duplicates.",
          "Choose a random pivot (or a median of three) to avoid quadratic behaviour on sorted input.",
          "Unstable.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Cost.** With a random pivot the expected cost is $O(n \\log n)$; when there are only $k$ distinct keys, it is $O(nk)$ in the worst case and much less on average — Sedgewick and Bentley showed three-way quicksort is optimal (to within a constant factor) for any multiset of keys, matching the entropy bound $n H$. The tests check the output and that each distinct value is a pivot at most once.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Dijkstra posed the three-colour partitioning problem as the Dutch national flag problem.",
          "The same partition is the core of multikey (three-way radix) quicksort for strings.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n log n)",
      worst: "O(n²)",
    },
    space: "O(log n) stack on average",
    worstClass: "n^2",
    note: "O(n) when all keys are equal; near-linear for few distinct keys.",
  },
  properties: [
    {
      label: "Parts",
      value: "< v, = v, > v",
    },
    {
      label: "Equal keys",
      value: "Finished in one partition",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "quick3",
      code: `def quick3(a, lo=0, hi=None):
    if hi is None:
        a = list(a); hi = len(a) - 1
    if lo >= hi:
        return a
    v, lt, i, gt = a[lo], lo, lo + 1, hi
    while i <= gt:
        if a[i] < v:
            a[lt], a[i] = a[i], a[lt]; lt += 1; i += 1
        elif a[i] > v:
            a[i], a[gt] = a[gt], a[i]; gt -= 1
        else:
            i += 1
    quick3(a, lo, lt - 1)
    quick3(a, gt + 1, hi)
    return a
`,
      tests: [
        {
          args: [[4, 9, 4, 4, 1, 9, 4, 1, 4, 9]],
          expected: [1, 1, 4, 4, 4, 4, 4, 9, 9, 9],
        },
        {
          args: [[5, 1, 4, 2, 8]],
          expected: [1, 2, 4, 5, 8],
        },
      ],
    },
    {
      language: "javascript",
      entry: "flag",
      code: `// Dutch national flag: one three-way partition around v; returns [lt, gt].
function flag(a, v) {
  let lt = 0, i = 0, gt = a.length - 1;
  while (i <= gt) {
    if (a[i] < v) { [a[lt], a[i]] = [a[i], a[lt]]; lt++; i++; }
    else if (a[i] > v) { [a[i], a[gt]] = [a[gt], a[i]]; gt--; }
    else i++;
  }
  return [lt, gt];
}
`,
      tests: [
        {
          args: [[4, 9, 4, 4, 1, 9, 4, 1, 4, 9], 4],
          expected: [2, 6],
        },
      ],
    },
  ],
  visualizer: "three-way-quick-sort",
  practice: [
    {
      id: "q3-equal",
      kind: "numeric",
      prompt:
        "An array holds 1,000 copies of the same value. How many partitions does three-way quicksort make?",
      answer: 1,
      explanation:
        "The first partition puts every element in the equal part; both outer parts are empty.",
      hints: ["Where do keys equal to the pivot go?"],
      objective: "Equal keys",
    },
    {
      id: "q3-gt",
      kind: "mcq",
      prompt: "When A[i] > v, why does i not advance?",
      options: [
        "The value swapped in from A[gt] has not been examined yet",
        "Because i ≤ gt must fail",
        "To keep the sort stable",
        "It does advance",
      ],
      answer: 0,
      explanation: "A[gt] comes from the unexamined region, so it must be classified next.",
      distractors: {
        "1": "The loop condition is checked separately.",
        "2": "The sort is not stable.",
        "3": "Only the < and = cases advance i.",
      },
      hints: ["Where did the new A[i] come from?"],
      objective: "Partition invariant",
    },
  ],
  exam: {
    definition:
      "Three-way quicksort partitions into < v, = v and > v and recurses on the outer parts.",
    steps: ["Dutch-flag partition with lt, i, gt.", "Recurse on A[lo..lt−1] and A[gt+1..hi]."],
    timeComplexity: "O(n log n) expected; O(n) for all-equal keys.",
    spaceComplexity: "$O(\\log n)$ expected stack.",
    correctness: "Invariant: A[lo..lt−1] < v, A[lt..i−1] = v, A[gt+1..hi] > v.",
    applications: ["Data with many duplicates", "String sorting (multikey quicksort)"],
    limitations: ["Unstable", "More swaps than two-way partitioning on distinct keys"],
    faq: [
      {
        q: "What is the Dutch national flag problem?",
        a: "Dijkstra's problem of arranging red, white and blue items in one pass — exactly the three-way partition.",
      },
    ],
    answers: [
      {
        marks: 10,
        outline: [
          "Invariant (3).",
          "Partition procedure (3).",
          "Duplicates analysis (2).",
          "Comparison with two-way (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "E. W. Dijkstra, A Discipline of Programming, Prentice Hall, 1976, Chapter 14.",
      supports: "The Dutch national flag problem.",
    },
    {
      citation: "R. Sedgewick, K. Wayne, Algorithms, 4th ed., Addison-Wesley, 2011, Section 2.3.",
      supports: "Three-way quicksort (Quick3way) and its entropy-optimality.",
    },
    {
      citation:
        "J. L. Bentley, M. D. McIlroy, “Engineering a sort function,” Software: Practice and Experience, 23(11), 1993.",
      supports: "A practical three-way partitioning scheme.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
