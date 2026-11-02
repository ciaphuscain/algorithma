import type { AlgorithmEntry } from "../types";

export const insertionSortEntry: AlgorithmEntry = {
  slug: "insertion-sort",
  name: "Insertion Sort",
  aliases: ["Straight insertion"],
  curriculum: [21],
  domain: "searching-sorting",
  subcategory: "Insertion-based sorting",
  difficulty: "beginner",
  summary:
    "Grows a sorted prefix one element at a time, shifting larger elements right to open a gap for each new key.",
  tags: ["sorting", "comparison sort", "in-place", "stable", "adaptive", "online", "quadratic"],
  prerequisites: ["Arrays and indexing", "Nested loops"],
  related: ["bubble-sort", "merge-sort", "binary-search"],
  problem: {
    input: "An array $A$ of $n$ comparable elements.",
    output: "The same elements rearranged so that $A[0] \\le A[1] \\le \\dots \\le A[n-1]$.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "This is how many people sort a hand of playing cards. Pick up cards one at a time. Each new card slides left past every card that is bigger than it, and settles in the gap just after the first card that is not bigger.",
      },
      {
        kind: "p",
        text: "The cards already in your hand are always in order. Each new card only has to find its place among them.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Treat $A[0]$ as a sorted prefix of length 1.",
          "For $i = 1, \\dots, n-1$: copy $A[i]$ into `key`.",
          "Walk $j$ left from $i-1$. While $A[j] > \\text{key}$, copy $A[j]$ one place right to $A[j+1]$.",
          "Write `key` into the gap at $A[j+1]$. The prefix $A[0..i]$ is now sorted.",
        ],
      },
      { kind: "heading", text: "Worked example: [5, 2, 4, 6, 1, 3]" },
      {
        kind: "table",
        head: ["i", "key", "Shifted right", "Array afterwards"],
        rows: [
          ["1", "2", "5", "[2, 5, 4, 6, 1, 3]"],
          ["2", "4", "5", "[2, 4, 5, 6, 1, 3]"],
          ["3", "6", "—", "[2, 4, 5, 6, 1, 3]"],
          ["4", "1", "6, 5, 4, 2", "[1, 2, 4, 5, 6, 3]"],
          ["5", "3", "6, 5, 4", "[1, 2, 3, 4, 5, 6]"],
        ],
      },
      {
        kind: "p",
        text: "That is 9 shifts (the input has 9 inversions), 5 writes of a key and 12 comparisons. In the visualizer you will see the array briefly hold two copies of a value while it shifts; the missing value is safe in `key`.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "**Check `j ≥ 0` before reading `A[j]`.** Most languages evaluate `and` left to right, which makes this safe.",
          "**Shift, don't swap.** Swapping the key leftwards also works, but costs three writes per step instead of one.",
          "**Use `>` rather than `>=`** so equal elements keep their order (stability).",
          "Insertion sort is *online*: it can sort elements as they arrive, because step $i$ never looks at $A[i+1..]$.",
        ],
      },
    ],
    mathematics: [
      { kind: "heading", text: "Cost in terms of inversions" },
      {
        kind: "p",
        text: "Each shift moves one larger element past the key, removing exactly one inversion. So the number of shifts equals $\\operatorname{inv}(A)$, the number of pairs $p < q$ with $A[p] > A[q]$. Each iteration also makes one comparison that stops the loop, unless $j$ runs off the front. Hence",
      },
      {
        kind: "math",
        tex: "\\operatorname{inv}(A) \\;\\le\\; C(A) \\;\\le\\; \\operatorname{inv}(A) + n - 1, \\qquad T(n) = \\Theta(n + \\operatorname{inv}(A)).",
      },
      {
        kind: "p",
        text: "Sorted input has no inversions, so it costs $n-1$ comparisons: $\\Theta(n)$. Reversed input has $\\binom{n}{2}$ inversions: $\\Theta(n^2)$. A random permutation has $\\frac{n(n-1)}{4}$ inversions on average, so the average case is also $\\Theta(n^2)$.",
      },
      { kind: "heading", text: "Correctness" },
      {
        kind: "p",
        text: "**Invariant:** at the start of iteration $i$, $A[0..i-1]$ contains the elements originally in $A[0..i-1]$, in sorted order. The inner loop moves exactly the elements greater than `key` one place right, preserving their order, and places `key` after the last element $\\le$ key. So $A[0..i]$ is sorted and holds the original first $i+1$ elements. At termination $i = n$, so the whole array is sorted.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**Binary insertion sort** finds the gap by binary search: $O(n \\log n)$ comparisons, but still $\\Theta(n^2)$ moves.",
          "**Shell sort** runs insertion sort on elements a decreasing gap apart, moving far-out-of-place elements quickly.",
          "**Small-array cutoff.** Practical merge sorts and quicksorts switch to insertion sort for subarrays of roughly 10–30 elements, where its low overhead wins.",
          "**Nearly sorted data.** If every element is at most $k$ places from its final position, there are at most $nk$ inversions, so insertion sort runs in $O(nk)$.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "\\Theta(n)", average: "\\Theta(n^2)", worst: "\\Theta(n^2)" },
    space: "\\Theta(1)",
    worstClass: "n^2",
    note: "More precisely $\\Theta(n + \\operatorname{inv}(A))$: fast on nearly sorted input.",
  },
  properties: [
    { label: "Stable", value: "Yes" },
    { label: "In place", value: "Yes" },
    { label: "Adaptive", value: "Yes: $\\Theta(n + \\text{inversions})$" },
    { label: "Online", value: "Yes" },
  ],
  implementations: [
    {
      language: "python",
      entry: "insertion_sort",
      code: `def insertion_sort(a):
    """Sort list a in place in ascending order and return it."""
    for i in range(1, len(a)):
        key = a[i]
        j = i - 1
        while j >= 0 and a[j] > key:
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = key
    return a
`,
      tests: [
        { args: [[5, 2, 4, 6, 1, 3]], expected: [1, 2, 3, 4, 5, 6] },
        { args: [[]], expected: [] },
        { args: [[2, 1, 2, 1]], expected: [1, 1, 2, 2] },
      ],
    },
    {
      language: "javascript",
      entry: "insertionSort",
      code: `function insertionSort(a) {
  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      j--;
    }
    a[j + 1] = key;
  }
  return a;
}
`,
      tests: [
        { args: [[5, 2, 4, 6, 1, 3]], expected: [1, 2, 3, 4, 5, 6] },
        { args: [[1]], expected: [1] },
        { args: [[-1, -5, 0]], expected: [-5, -1, 0] },
      ],
    },
  ],
  visualizer: "insertion-sort",
  practice: [
    {
      id: "insertion-best",
      kind: "mcq",
      prompt: "What is insertion sort's running time on an array that is already sorted?",
      options: ["$\\Theta(n)$", "$\\Theta(n \\log n)$", "$\\Theta(n^2)$", "$\\Theta(1)$"],
      answer: 0,
      explanation:
        "Each key is compared once with its left neighbour, finds it no larger, and stays: $n-1$ comparisons and no shifts.",
      distractors: {
        1: "Nothing here halves the problem; there is no logarithmic factor.",
        2: "That is the worst case (reversed input), not the best.",
        3: "Every element must be looked at at least once.",
      },
      hints: ["How many times does the inner loop run when $A[i-1] \\le A[i]$ already?"],
      objective: "Analyse the best case",
    },
    {
      id: "insertion-shifts",
      kind: "numeric",
      prompt: "How many shifts does insertion sort perform on [4, 3, 2, 1]?",
      answer: 6,
      explanation:
        "Shifts equal inversions; every one of the $\\binom{4}{2} = 6$ pairs is inverted.",
      hints: [
        "Each shift removes exactly one inversion.",
        "Count the pairs that are out of order.",
      ],
      objective: "Relate shifts to inversions",
    },
    {
      id: "insertion-after-three",
      kind: "mcq",
      prompt:
        "Insertion sort runs on [7, 3, 5, 1]. What does the array look like after the iteration with $i = 2$ finishes?",
      options: ["[3, 5, 7, 1]", "[3, 7, 5, 1]", "[1, 3, 5, 7]", "[3, 5, 1, 7]"],
      answer: 0,
      explanation:
        "After $i = 1$: [3, 7, 5, 1]. With $i = 2$, key 5 shifts 7 right and lands between 3 and 7: [3, 5, 7, 1]. The prefix $A[0..2]$ is sorted; 1 has not been touched yet.",
      distractors: {
        1: "That is the state after $i = 1$.",
        2: "That is the final result, after $i = 3$.",
        3: "The element at index 3 is not considered until $i = 3$.",
      },
      hints: ["After iteration $i$, exactly the prefix $A[0..i]$ is sorted."],
      objective: "Trace the invariant",
    },
  ],
  exam: {
    definition:
      "Insertion sort is a stable, in-place comparison sort that builds a sorted prefix by inserting each element into its correct position among the elements before it, shifting larger elements one place right.",
    steps: [
      "For $i = 1$ to $n-1$: set key $= A[i]$, $j = i-1$.",
      "While $j \\ge 0$ and $A[j] > \\text{key}$: $A[j+1] = A[j]$; $j = j-1$.",
      "Set $A[j+1] = \\text{key}$.",
    ],
    timeComplexity:
      "Best $\\Theta(n)$ (sorted input), average and worst $\\Theta(n^2)$; precisely $\\Theta(n + \\text{inversions})$.",
    spaceComplexity: "$\\Theta(1)$ extra space.",
    correctness:
      "Invariant: before iteration $i$, $A[0..i-1]$ is the original first $i$ elements in sorted order. Inserting the key after the last element $\\le$ key extends it to $A[0..i]$.",
    applications: [
      "Small arrays and the base case of hybrid sorts (e.g. inside Timsort and introsort implementations)",
      "Nearly sorted data, e.g. re-sorting after a few changes",
      "Online sorting of a stream as elements arrive",
    ],
    limitations: ["Quadratic on random or reversed data", "Moves elements one position at a time"],
    faq: [
      {
        q: "Insertion or bubble sort?",
        a: "Insertion sort: same number of element moves, fewer comparisons, and $\\Theta(n)$ on sorted input.",
      },
      {
        q: "Is it stable?",
        a: "Yes, as long as the loop condition is the strict $A[j] > \\text{key}$.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Insert each element into the sorted prefix by shifting larger ones right.",
          "$\\Theta(n^2)$ worst, $\\Theta(n)$ best, $O(1)$ space, stable.",
        ],
      },
      {
        marks: 5,
        outline: [
          "Definition (1).",
          "Pseudocode with the key and shifting loop (2).",
          "Trace on a 5–6 element array (1).",
          "Best/worst complexity with reasons (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Definition and card-sorting intuition — 1.",
          "Pseudocode — 2.",
          "Full dry run showing the array after every iteration — 3.",
          "Analysis: shifts = inversions, best/average/worst — 2.",
          "Loop-invariant proof, stability, applications — 2.",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 3rd ed., MIT Press, 2009, §2.1–2.2.",
      supports: "Pseudocode, loop-invariant proof and running-time analysis.",
    },
    {
      citation:
        "D. E. Knuth, The Art of Computer Programming, Vol. 3: Sorting and Searching, 2nd ed., Addison-Wesley, 1998, §5.2.1.",
      supports:
        "Insertion sorting, inversions and their analysis; binary insertion and Shell sort.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and quantitative claims are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-20",
};
