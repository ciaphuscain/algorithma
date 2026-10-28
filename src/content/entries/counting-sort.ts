import type { AlgorithmEntry } from "../types";

export const countingSortEntry: AlgorithmEntry = {
  slug: "counting-sort",
  name: "Counting Sort",
  aliases: ["Distribution counting"],
  curriculum: [36],
  domain: "searching-sorting",
  subcategory: "Distribution sorting",
  difficulty: "beginner",
  summary:
    "Sorts small whole numbers without comparing them: count how often each value occurs, turn the counts into positions, and place every element directly.",
  tags: ["sorting", "non-comparison sort", "stable", "linear time", "integer keys"],
  prerequisites: ["Prefix Sums"],
  related: ["radix-sort", "prefix-sums", "insertion-sort"],
  problem: {
    input: "An array $A$ of $n$ whole numbers in the range $0..k$.",
    output: "An array $B$ holding the same numbers in non-decreasing order.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "If you know the values are small whole numbers, you do not need to compare them. Count how many 0s, 1s, 2s, … there are. If there are two 0s and two 2s, the 0s go in positions 0–1 and the 2s start at position 2.",
      },
      {
        kind: "p",
        text: "Running totals of the counts tell every value where its block ends. Filling each block from the back, while reading the input from the back, keeps equal values in their original order.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Make a count array $C[0..k]$ of zeros.",
          "For each element $A[j]$, add 1 to $C[A[j]]$.",
          "Replace each $C[v]$ by $C[0] + \\dots + C[v]$: now $C[v]$ is the number of elements $\\le v$, one past the last slot for $v$.",
          "For $j = n-1$ down to 0: decrease $C[A[j]]$ by 1 and write $A[j]$ into $B[C[A[j]]]$.",
        ],
      },
      { kind: "heading", text: "Worked example: [2, 5, 3, 0, 2, 3, 0, 3], k = 5" },
      {
        kind: "table",
        head: ["Value v", "0", "1", "2", "3", "4", "5"],
        rows: [
          ["Count", "2", "0", "2", "3", "0", "1"],
          ["Running total C[v]", "2", "2", "4", "7", "7", "8"],
        ],
      },
      {
        kind: "p",
        text: "Reading from the right, the last 3 goes to $B[6]$ ($C[3]$ drops from 7 to 6), the 0 before it to $B[1]$, and so on, giving $B = [0, 0, 2, 2, 3, 3, 3, 5]$. The run makes no comparisons and $3n + k = 29$ writes: 8 counts, 5 running totals, and 8 decrements plus 8 placements.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "**Iterate from right to left in the last loop.** Each value's block is filled from its end, so equal values keep their input order: the sort is *stable*. Going left to right with these decrements would reverse them.",
          "**Shift negative or offset keys.** For values in $lo..hi$, index $C$ by $v - lo$; the count array has $hi - lo + 1$ slots.",
          "**Sort records by a key** by counting keys but moving whole records. Stability is what lets radix sort use counting sort on one digit at a time.",
          "**Watch $k$.** The count array costs $\\Theta(k)$ time and space. Sorting five numbers up to $10^9$ this way is absurd; use a comparison sort or radix sort.",
        ],
      },
    ],
    mathematics: [
      { kind: "heading", text: "Correctness" },
      {
        kind: "p",
        text: "After the running totals, $C[v]$ equals the number of elements $\\le v$, so the elements equal to $v$ belong exactly in positions $C[v-1], \\dots, C[v]-1$. The last loop hands those positions out in decreasing order, to the occurrences of $v$ in decreasing input position. So every element lands in its block, each block is filled exactly, and equal elements keep their relative order.",
      },
      { kind: "heading", text: "Running time" },
      {
        kind: "math",
        tex: "T(n, k) = \\Theta(n) + \\Theta(k) + \\Theta(n) = \\Theta(n + k), \\qquad \\text{space } \\Theta(n + k).",
      },
      {
        kind: "p",
        text: "When $k = O(n)$ this is linear. It does not contradict the $\\Omega(n \\log n)$ lower bound for sorting: that bound applies to algorithms that learn about the input only by comparing elements, and counting sort uses the values themselves as array indices.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**Radix sort** applies counting sort once per digit, from least significant to most, to sort larger integers in $\\Theta(d(n + b))$ for $d$ digits in base $b$.",
          "**Bucket sort** generalises the idea to real keys spread over a range, sorting each bucket separately.",
          "**History.** The chapter notes of CLRS (ch. 8) report that Knuth credits H. H. Seward with counting sort, in 1954.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "\\Theta(n + k)", average: "\\Theta(n + k)", worst: "\\Theta(n + k)" },
    space: "\\Theta(n + k)",
    worstClass: "n",
    note: "$k$ is the largest key; linear when $k = O(n)$.",
  },
  properties: [
    { label: "Stable", value: "Yes (when placing from right to left)" },
    { label: "In place", value: "No: needs the output array and $k + 1$ counts" },
    { label: "Comparisons", value: "None" },
  ],
  implementations: [
    {
      language: "python",
      entry: "counting_sort",
      code: `def counting_sort(a):
    """Return the whole numbers in a (all >= 0) in non-decreasing order."""
    if not a:
        return []
    k = max(a)
    count = [0] * (k + 1)
    for x in a:
        count[x] += 1
    for v in range(1, k + 1):
        count[v] += count[v - 1]
    out = [0] * len(a)
    for x in reversed(a):
        count[x] -= 1
        out[count[x]] = x
    return out
`,
      tests: [
        { args: [[2, 5, 3, 0, 2, 3, 0, 3]], expected: [0, 0, 2, 2, 3, 3, 3, 5] },
        { args: [[]], expected: [] },
        { args: [[7]], expected: [7] },
      ],
    },
    {
      language: "javascript",
      entry: "countingSort",
      code: `function countingSort(a) {
  if (a.length === 0) return [];
  const k = Math.max(...a);
  const count = new Array(k + 1).fill(0);
  for (const x of a) count[x]++;
  for (let v = 1; v <= k; v++) count[v] += count[v - 1];
  const out = new Array(a.length);
  for (let j = a.length - 1; j >= 0; j--) out[--count[a[j]]] = a[j];
  return out;
}
`,
      tests: [
        { args: [[1, 4, 1, 4, 2, 1, 4, 0, 2, 1]], expected: [0, 1, 1, 1, 1, 2, 2, 4, 4, 4] },
        { args: [[0, 0]], expected: [0, 0] },
        { args: [[20, 0, 10, 20, 5]], expected: [0, 5, 10, 20, 20] },
      ],
    },
  ],
  visualizer: "counting-sort",
  practice: [
    {
      id: "counting-prefix",
      kind: "numeric",
      prompt:
        "Counting sort runs on [2, 5, 3, 0, 2, 3, 0, 3]. After the running-totals loop, what is $C[3]$?",
      answer: 7,
      explanation: "Two 0s, no 1s, two 2s and three 3s: $2 + 0 + 2 + 3 = 7$ elements are $\\le 3$.",
      hints: ["$C[v]$ becomes the number of elements that are at most $v$."],
      objective: "Compute running totals",
    },
    {
      id: "counting-direction",
      kind: "mcq",
      prompt: "Why does the placing loop run from the last element to the first?",
      options: [
        "So that equal elements keep their input order",
        "So that the sort runs in linear time",
        "Because C is filled from the right",
        "So that no element is placed twice",
      ],
      answer: 0,
      explanation:
        "Each block is filled from its end. Taking elements from the end of the input gives the last occurrence the last slot, which keeps equal elements in order (stability).",
      distractors: {
        1: "Either direction takes the same $\\Theta(n)$ time.",
        2: "C holds running totals; the direction of the placing loop is a separate choice.",
        3: "Every element is placed exactly once in either direction.",
      },
      hints: [
        "What would happen to two equal keys if you went left to right with these decrements?",
      ],
      objective: "Explain stability",
    },
    {
      id: "counting-bound",
      kind: "mcq",
      prompt:
        "Counting sort runs in $\\Theta(n + k)$. Why does this not contradict the $\\Omega(n \\log n)$ lower bound for sorting?",
      options: [
        "The lower bound is for comparison sorts; counting sort uses keys as indices",
        "Because $k$ is always smaller than $\\log n$",
        "The lower bound only holds on average",
        "Counting sort is not a correct sort for all inputs",
      ],
      answer: 0,
      explanation:
        "The $\\Omega(n \\log n)$ bound counts comparisons between elements. Counting sort never compares; it needs keys that are small whole numbers.",
      distractors: {
        1: "$k$ can be large; then counting sort is slow.",
        2: "The comparison lower bound holds in the worst case and on average.",
        3: "It sorts every array of whole numbers in $0..k$ correctly.",
      },
      hints: ["What operation does the lower-bound argument count?"],
      objective: "Relate to the comparison lower bound",
    },
  ],
  exam: {
    definition:
      "Counting sort is a stable, non-comparison sort for integer keys in a range $0..k$: it counts occurrences of each key, converts the counts to positions with running totals, and places each element directly into the output.",
    steps: [
      "$C[0..k] \\leftarrow 0$; for each $A[j]$: $C[A[j]] \\leftarrow C[A[j]] + 1$.",
      "For $v = 1..k$: $C[v] \\leftarrow C[v] + C[v-1]$.",
      "For $j = n-1$ down to 0: $C[A[j]] \\leftarrow C[A[j]] - 1$; $B[C[A[j]]] \\leftarrow A[j]$.",
    ],
    timeComplexity: "$\\Theta(n + k)$ in every case.",
    spaceComplexity: "$\\Theta(n + k)$: the output array and the counts.",
    correctness:
      "After the running totals, $C[v]$ is the number of keys $\\le v$, so the keys equal to $v$ occupy positions $C[v-1]..C[v]-1$; the right-to-left loop fills each block exactly and stably.",
    applications: [
      "Sorting small integers: grades, ages, bytes, histogram buckets",
      "The per-digit sort inside radix sort",
    ],
    limitations: [
      "Needs integer keys in a known, small range",
      "Not in place",
      "Time and space grow with $k$, not just $n$",
    ],
    faq: [
      {
        q: "Is counting sort stable?",
        a: "Yes, when the placing loop runs from right to left.",
      },
      {
        q: "When is it a bad choice?",
        a: "When $k$ is much larger than $n$: the count array dominates.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Count each key, take running totals, place elements by their totals.",
          "$\\Theta(n + k)$ time and space; stable.",
        ],
      },
      {
        marks: 5,
        outline: [
          "Definition and the integer-key requirement (1).",
          "Pseudocode with the three loops (2).",
          "Trace showing C after counting and after running totals (1).",
          "Complexity and stability (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Definition and motivation — 1.",
          "Pseudocode — 2.",
          "Full trace: counts, running totals, each placement — 3.",
          "Correctness and stability argument — 2.",
          "Complexity, the comparison lower bound, use in radix sort — 2.",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 3rd ed., MIT Press, 2009, §8.2 and the notes to chapter 8.",
      supports:
        "The algorithm, its stability and $\\Theta(n + k)$ analysis, the example array, the comparison-sort lower bound (§8.1), and the history.",
    },
    {
      citation:
        "D. E. Knuth, The Art of Computer Programming, Vol. 3: Sorting and Searching, 2nd ed., Addison-Wesley, 1998, §5.2.",
      supports: "Distribution counting.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked-example numbers are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-25",
};
