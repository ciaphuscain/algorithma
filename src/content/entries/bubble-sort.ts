import type { AlgorithmEntry } from "../types";

export const bubbleSortEntry: AlgorithmEntry = {
  slug: "bubble-sort",
  name: "Bubble Sort",
  aliases: ["Sinking sort", "Exchange sort (adjacent)"],
  curriculum: [11],
  domain: "searching-sorting",
  subcategory: "Elementary sorting",
  difficulty: "beginner",
  summary:
    "Repeatedly swaps adjacent out-of-order pairs; each pass carries the largest remaining value to the end.",
  tags: ["sorting", "comparison sort", "in-place", "stable", "quadratic"],
  prerequisites: ["Arrays and indexing", "Nested loops"],
  related: ["insertion-sort", "merge-sort"],
  problem: {
    input: "An array $A$ of $n$ comparable elements.",
    output: "The same elements rearranged so that $A[0] \\le A[1] \\le \\dots \\le A[n-1]$.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Imagine people standing in a line who may only ever swap places with the person directly beside them. Walk down the line and, whenever someone is taller than the person to their right, swap the two. By the time you reach the end, the tallest person has been pushed, swap by swap, all the way to the last position.",
      },
      {
        kind: "p",
        text: "Repeat the walk. Each walk settles one more person at the end of the line, so after $n-1$ walks everyone is in order. Large values “bubble” towards the end, which gives the algorithm its name.",
      },
      {
        kind: "callout",
        tone: "note",
        title: "Why learn it?",
        text: "Bubble sort is rarely the right choice in practice, but it is the clearest example of three ideas you will use everywhere: comparing and swapping, loop invariants, and counting operations to analyse cost.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Set $i = 0$. Positions $n-i$ to $n-1$ (initially none) are already final.",
          "Scan $j$ from $0$ to $n-2-i$. Compare $A[j]$ with $A[j+1]$; if $A[j] > A[j+1]$, swap them.",
          "After the scan, $A[n-1-i]$ holds the largest value among $A[0..n-1-i]$, so it is final.",
          "Increase $i$ and repeat until $i = n-1$. The single element left at position $0$ is the smallest.",
        ],
      },
      { kind: "heading", text: "Worked example: [5, 1, 4, 2, 8]" },
      {
        kind: "table",
        head: ["Pass", "Comparisons (swap?)", "Array after pass", "Now final"],
        rows: [
          ["1", "5>1 ✓, 5>4 ✓, 5>2 ✓, 5>8 ✗", "[1, 4, 2, 5, 8]", "8"],
          ["2", "1>4 ✗, 4>2 ✓, 4>5 ✗", "[1, 2, 4, 5, 8]", "5"],
          ["3", "1>2 ✗, 2>4 ✗", "[1, 2, 4, 5, 8]", "4"],
          ["4", "1>2 ✗", "[1, 2, 4, 5, 8]", "2 (and 1)"],
        ],
      },
      {
        kind: "p",
        text: "That is $4+3+2+1 = 10$ comparisons and $4$ swaps. The array was already sorted after pass 2, but the classic algorithm cannot tell, so it still runs passes 3 and 4. The *optimized* variant stops early when a pass makes no swaps.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "The inner loop bound $n-2-i$ is where most bugs hide. Going one step too far reads past the end of the array; stopping one step early leaves the last unsorted pair unchecked.",
      },
      {
        kind: "list",
        items: [
          "**Use a strict comparison** (`>`), not `>=`. Swapping equal elements wastes work and breaks stability.",
          "**Empty and single-element arrays** need no special case: the outer loop simply runs zero times.",
          "**Sorting in place** means the caller's array changes. Copy first if the original must be kept.",
        ],
      },
      {
        kind: "callout",
        tone: "tip",
        text: "In the visualizer, step to the comparison at line 5 and watch the variables panel: $j$ never exceeds $n-2-i$.",
      },
    ],
    mathematics: [
      { kind: "heading", text: "Counting comparisons" },
      { kind: "p", text: "Pass $i$ performs $n-1-i$ comparisons, regardless of the data:" },
      {
        kind: "math",
        tex: "C(n) = \\sum_{i=0}^{n-2} (n-1-i) = \\sum_{k=1}^{n-1} k = \\frac{n(n-1)}{2} \\in \\Theta(n^2).",
      },
      { kind: "heading", text: "Counting swaps" },
      {
        kind: "p",
        text: "An **inversion** is a pair of positions $p < q$ with $A[p] > A[q]$. Swapping two adjacent out-of-order elements removes exactly one inversion and creates none. The algorithm ends with zero inversions and never swaps an in-order pair, so the number of swaps equals the number of inversions in the input, $\\operatorname{inv}(A)$.",
      },
      {
        kind: "p",
        text: "This ranges from $0$ (sorted input) to $\\binom{n}{2}$ (reversed input). For a uniformly random permutation of distinct values each of the $\\binom{n}{2}$ pairs is inverted with probability $\\tfrac12$, so by linearity of expectation the expected number of swaps is $\\frac{n(n-1)}{4}$.",
      },
      { kind: "heading", text: "Correctness" },
      {
        kind: "p",
        text: "**Inner-loop invariant.** Before the comparison at index $j$, $A[j]$ is a maximum of $A[0..j]$. It holds for $j = 0$. If $A[j] > A[j+1]$ the swap moves that maximum to $j+1$; otherwise $A[j+1] \\ge A[j]$ is itself a maximum. Either way the invariant holds for $j+1$.",
      },
      {
        kind: "p",
        text: "**Outer-loop invariant.** Before pass $i$, the suffix $A[n-i..n-1]$ holds the $i$ largest elements in sorted order. By the inner invariant, pass $i$ ends with a maximum of $A[0..n-1-i]$ at position $n-1-i$, which is no larger than anything in the suffix, so the invariant extends to $i+1$. When the loop ends ($i = n-1$) the suffix covers positions $1..n-1$, and $A[0]$ is the smallest element, so the array is sorted.",
      },
      {
        kind: "p",
        text: "**Stability.** Elements are swapped only when strictly out of order, so two equal elements never pass each other.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**Early exit.** Tracking whether a pass swapped anything makes the best case (sorted input) $\\Theta(n)$. The worst case is unchanged.",
          "**Cocktail shaker sort** alternates left-to-right and right-to-left passes, moving small elements (“turtles”) left faster.",
          "**Comb sort** first compares elements a shrinking gap apart, removing turtles early, before finishing with gap 1.",
          "**Odd–even transposition sort** compares disjoint adjacent pairs in parallel and is a classic model for sorting networks.",
        ],
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Insertion sort makes exactly the same number of element moves (one per inversion) but usually far fewer comparisons, and it adapts to nearly-sorted data. Prefer it when a simple quadratic sort is required.",
      },
    ],
  },
  complexity: {
    time: { best: "\\Theta(n^2)", average: "\\Theta(n^2)", worst: "\\Theta(n^2)" },
    space: "\\Theta(1)",
    worstClass: "n^2",
    note: "This is the classic version with no early exit. It always makes $n(n-1)/2$ comparisons; the number of swaps equals the number of inversions.",
  },
  properties: [
    { label: "Stable", value: "Yes" },
    { label: "In place", value: "Yes" },
    { label: "Adaptive", value: "Swaps only (comparisons are fixed)" },
    { label: "Comparisons", value: "$n(n-1)/2$ exactly" },
  ],
  implementations: [
    {
      language: "python",
      entry: "bubble_sort",
      code: `def bubble_sort(a):
    """Sort list a in place in ascending order and return it."""
    n = len(a)
    for i in range(n - 1):
        for j in range(n - 1 - i):
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
    return a
`,
      tests: [
        { args: [[5, 1, 4, 2, 8]], expected: [1, 2, 4, 5, 8] },
        { args: [[]], expected: [] },
        { args: [[7]], expected: [7] },
        { args: [[3, -1, 3, 0, -1]], expected: [-1, -1, 0, 3, 3] },
      ],
    },
    {
      language: "javascript",
      entry: "bubbleSort",
      code: `function bubbleSort(a) {
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
      }
    }
  }
  return a;
}
`,
      tests: [
        { args: [[5, 1, 4, 2, 8]], expected: [1, 2, 4, 5, 8] },
        { args: [[]], expected: [] },
        { args: [[9, 8, 7, 6]], expected: [6, 7, 8, 9] },
      ],
    },
  ],
  visualizer: "bubble-sort",
  practice: [
    {
      id: "bubble-first-pass",
      kind: "mcq",
      prompt: "What does the array [5, 1, 4, 2, 8] look like after the first pass of bubble sort?",
      options: ["[1, 4, 2, 5, 8]", "[1, 2, 4, 5, 8]", "[1, 5, 4, 2, 8]", "[5, 1, 4, 2, 8]"],
      answer: 0,
      explanation:
        "The 5 is carried right past 1, 4 and 2, stopping before 8. Only one value is guaranteed final after a pass: the maximum, 8.",
      distractors: {
        1: "That is the fully sorted array; it appears only after pass 2.",
        2: "That is the state after the first swap only, not the whole pass.",
        3: "The first pass makes three swaps, so the array changes.",
      },
      hints: [
        "Follow the 5: it keeps moving right while it is larger than its neighbour.",
        "Which value can a single pass guarantee to place?",
      ],
      objective: "Trace one pass of bubble sort",
    },
    {
      id: "bubble-comparisons",
      kind: "numeric",
      prompt:
        "How many comparisons does classic bubble sort (no early exit) make on an array of 6 elements?",
      answer: 15,
      explanation:
        "Pass $i$ makes $n-1-i$ comparisons: $5+4+3+2+1 = 15 = 6\\cdot5/2$. The count does not depend on the data.",
      hints: ["Count comparisons pass by pass.", "Use $n(n-1)/2$."],
      objective: "Derive the comparison count",
    },
    {
      id: "bubble-swaps",
      kind: "numeric",
      prompt: "How many swaps does bubble sort perform on [3, 2, 1]?",
      answer: 3,
      explanation:
        "Swaps equal inversions. The pairs (3,2), (3,1) and (2,1) are all out of order, so there are 3 swaps.",
      hints: [
        "Each adjacent swap fixes exactly one out-of-order pair.",
        "Count pairs $p<q$ with $A[p] > A[q]$.",
      ],
      objective: "Relate swaps to inversions",
    },
    {
      id: "bubble-stable",
      kind: "mcq",
      prompt: "Why is bubble sort stable?",
      options: [
        "It swaps only when $A[j] > A[j+1]$, so equal elements never pass each other",
        "It runs in $\\Theta(n^2)$ time",
        "It sorts in place",
        "It compares only adjacent elements",
      ],
      answer: 0,
      explanation:
        "Stability is about equal keys keeping their relative order. The strict comparison guarantees two equal elements are never exchanged.",
      distractors: {
        1: "Running time says nothing about the order of equal elements.",
        2: "Heap sort is in place but not stable.",
        3: "Adjacency alone is not enough: with `>=` the algorithm would still compare only neighbours but would become unstable.",
      },
      hints: ["What would change if the comparison were `>=`?"],
      objective: "Explain stability",
    },
  ],
  exam: {
    definition:
      "Bubble sort is a comparison-based, in-place sorting algorithm that repeatedly compares adjacent elements and swaps them when they are out of order, so that each pass moves the largest remaining element to its final position.",
    steps: [
      "Repeat for $i = 0$ to $n-2$:",
      "For $j = 0$ to $n-2-i$: if $A[j] > A[j+1]$, swap $A[j]$ and $A[j+1]$.",
      "After pass $i$, the element at index $n-1-i$ is in its final position.",
      "Stop after $n-1$ passes; the array is sorted.",
    ],
    timeComplexity:
      "$n(n-1)/2$ comparisons in every case, so $\\Theta(n^2)$ best, average and worst. With an early-exit flag the best case (already sorted) becomes $\\Theta(n)$.",
    spaceComplexity: "$\\Theta(1)$ auxiliary space; it sorts in place.",
    correctness:
      "Loop invariant: before pass $i$, the last $i$ positions hold the $i$ largest elements in sorted order. Each pass carries the maximum of the unsorted prefix to its end, extending the invariant; after $n-1$ passes the whole array is sorted.",
    applications: [
      "Teaching sorting, loop invariants and inversion counting",
      "Tiny arrays where code size matters more than speed",
      "Detecting whether a list is already sorted (with early exit)",
    ],
    limitations: [
      "Quadratic time makes it impractical beyond small inputs",
      "Makes more comparisons than insertion sort on most inputs",
      "Moves elements only one position per swap, so small values far to the right travel slowly",
    ],
    faq: [
      { q: "Is bubble sort stable?", a: "Yes, because it swaps only on a strict $>$ comparison." },
      {
        q: "What is the best case?",
        a: "$\\Theta(n^2)$ for the classic version; $\\Theta(n)$ with the early-exit optimisation on sorted input.",
      },
      {
        q: "How many swaps does it make?",
        a: "Exactly the number of inversions in the input: $0$ to $n(n-1)/2$.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Definition: adjacent compare-and-swap; largest element bubbles to the end each pass.",
          "Time $\\Theta(n^2)$, space $O(1)$, stable.",
        ],
      },
      {
        marks: 5,
        outline: [
          "Definition and idea (1 mark).",
          "Algorithm steps or pseudocode (2 marks).",
          "Short example such as [5, 1, 4, 2, 8] pass by pass (1 mark).",
          "Complexity: $n(n-1)/2$ comparisons, $\\Theta(n^2)$ time, $O(1)$ space (1 mark).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Definition, intuition and properties (stable, in place) — 2 marks.",
          "Pseudocode with correct loop bounds — 2 marks.",
          "Full dry run on a 5–6 element array, showing each pass — 3 marks.",
          "Derivation of $C(n) = n(n-1)/2$; swaps = inversions; best/average/worst — 2 marks.",
          "Correctness via the loop invariant, or applications and limitations — 1 mark.",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "D. E. Knuth, The Art of Computer Programming, Vol. 3: Sorting and Searching, 2nd ed., Addison-Wesley, 1998, §5.2.2.",
      supports: "Analysis of bubble sort and other exchange sorts.",
    },
    {
      citation:
        "T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 3rd ed., MIT Press, 2009, Problem 2-2.",
      supports: "Loop-invariant proof of bubble sort's correctness.",
    },
    {
      citation:
        "O. Astrachan, “Bubble Sort: An Archaeological Algorithmic Analysis,” Proc. SIGCSE 2003, ACM.",
      supports:
        "History of the algorithm and its name, and the case against teaching it as a practical sort.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and quantitative claims are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-19",
};
