import type { AlgorithmEntry } from "../types";

const draft = {
  status: "draft" as const,
  note: "Written with AI assistance. Code samples and quantitative claims are checked by automated tests; the prose has not yet had expert review.",
};

export const linearSearchEntry: AlgorithmEntry = {
  slug: "linear-search",
  name: "Linear Search",
  aliases: ["Sequential search"],
  curriculum: [1],
  domain: "searching-sorting",
  subcategory: "Searching",
  difficulty: "beginner",
  summary:
    "Checks every element in turn until it finds the target or runs out: works on any list, sorted or not, in O(n).",
  tags: ["searching", "unsorted", "sequential", "linear"],
  prerequisites: ["Arrays and loops"],
  related: ["binary-search"],
  problem: {
    input: "An array $A$ of $n$ elements (in any order) and a target $x$.",
    output: "The first index $i$ with $A[i] = x$, or $-1$ if there is none.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Looking for your keys, you check each pocket in turn until you find them. If they are in the last pocket, or in none, you check every pocket. That is linear search: no cleverness, no requirements, and a cost proportional to the number of places to look.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "For $i = 0, 1, \\dots, n-1$: if $A[i] = x$, return $i$.",
          "If the loop finishes, return $-1$.",
        ],
      },
      {
        kind: "p",
        text: "**Example.** In [7, 3, 9, 1, 4, 8, 2], searching for 4 checks 7, 3, 9, 1, 4 and returns index 4 after 5 comparisons. Searching for 5 checks all 7 elements and returns $-1$.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Return the **first** match; to find all matches, keep scanning and collect indices.",
          "**Sentinel search** writes $x$ into an extra slot at the end, so the loop needs no separate bounds check; it is a separate curriculum entry.",
          "Linear search works on linked lists and streams, where binary search cannot jump to the middle.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Worst case:** $n$ comparisons (target last or absent). **Best case:** 1. If the target is present and equally likely to be at each position, the expected number of comparisons is",
      },
      { kind: "math", tex: "\\frac{1}{n}\\sum_{i=1}^{n} i = \\frac{n+1}{2}." },
      {
        kind: "p",
        text: "**Optimality on unsorted data.** Any algorithm that has not examined some position cannot rule out that the target is there, so in the worst case every position must be examined: $\\Omega(n)$. Linear search is optimal when nothing is known about the order.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "If the same array is searched many times, sorting once ($O(n \\log n)$) and then using binary search ($O(\\log n)$ each) wins after enough queries; a hash table gives $O(1)$ expected lookups.",
          "**Move-to-front / transpose heuristics** reorder the list after each successful search so frequent targets drift to the front.",
          "Linear scans are cache- and SIMD-friendly, so for small arrays they often beat “smarter” searches in practice.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "\\Theta(1)", average: "\\Theta(n)", worst: "\\Theta(n)" },
    space: "\\Theta(1)",
    worstClass: "n",
  },
  properties: [
    { label: "Requires sorted input", value: "No" },
    { label: "Worst-case comparisons", value: "$n$" },
    { label: "Works on linked lists", value: "Yes" },
  ],
  implementations: [
    {
      language: "python",
      entry: "linear_search",
      code: `def linear_search(a, target):
    """Return the first index of target in a, or -1."""
    for i, value in enumerate(a):
        if value == target:
            return i
    return -1
`,
      tests: [
        { args: [[7, 3, 9, 1, 4, 8, 2], 4], expected: 4 },
        { args: [[7, 3, 9, 1, 4, 8, 2], 5], expected: -1 },
        { args: [[5, 2, 6, 2, 9], 2], expected: 1 },
        { args: [[], 1], expected: -1 },
      ],
    },
    {
      language: "javascript",
      entry: "linearSearch",
      code: `function linearSearch(a, target) {
  for (let i = 0; i < a.length; i++) {
    if (a[i] === target) return i;
  }
  return -1;
}
`,
      tests: [
        { args: [[7, 3, 9, 1, 4, 8, 2], 2], expected: 6 },
        { args: [[1], 1], expected: 0 },
      ],
    },
  ],
  visualizer: "linear-search",
  practice: [
    {
      id: "linear-average",
      kind: "numeric",
      prompt:
        "The target is present in an array of 9 elements, equally likely at each position. What is the expected number of comparisons?",
      answer: 5,
      explanation: "$(n + 1)/2 = 10/2 = 5$.",
      hints: ["Average the comparisons needed for positions 1 through 9."],
      objective: "Compute the average case",
    },
    {
      id: "linear-when",
      kind: "mcq",
      prompt: "When is linear search the right choice over binary search?",
      options: [
        "The data is unsorted and searched only once",
        "The data is sorted and searched millions of times",
        "Never: binary search is always faster",
        "When the array has more than a million elements",
      ],
      answer: 0,
      explanation:
        "Sorting first costs $O(n \\log n)$, more than one $O(n)$ scan. Binary search pays off only over many searches of sorted data.",
      distractors: {
        1: "Repeated searches of sorted data are binary search's ideal case.",
        2: "Binary search needs sorted data and random access.",
        3: "Size alone does not decide; sortedness and the number of queries do.",
      },
      hints: ["What would it cost to make binary search possible?"],
      objective: "Choose between search algorithms",
    },
  ],
  exam: {
    definition:
      "Linear search examines the elements of a list one by one, in order, until it finds the target or reaches the end.",
    steps: ["For $i = 0$ to $n - 1$: if $A[i] = x$ return $i$.", "Return $-1$."],
    timeComplexity:
      "Best $\\Theta(1)$, average $\\Theta(n)$ ($\\frac{n+1}{2}$ comparisons when present), worst $\\Theta(n)$.",
    spaceComplexity: "$\\Theta(1)$.",
    correctness:
      "Invariant: before examining index $i$, $x$ does not occur in $A[0..i-1]$. Returning at the first match or after the whole array is therefore correct.",
    applications: [
      "Small or unsorted collections",
      "Linked lists and streams",
      "One-off searches where sorting would cost more",
    ],
    limitations: ["$\\Theta(n)$ per query, slow for repeated searches of large data"],
    faq: [
      {
        q: "Is linear search ever optimal?",
        a: "Yes: on unsorted data any algorithm needs $\\Omega(n)$ comparisons in the worst case.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Check each element in turn.", "$O(n)$ worst, $O(1)$ best, no sorting needed."],
      },
      {
        marks: 5,
        outline: [
          "Definition (1).",
          "Algorithm (1).",
          "Example trace (1).",
          "Best/average/worst with the $(n+1)/2$ derivation (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "D. E. Knuth, The Art of Computer Programming, Vol. 3: Sorting and Searching, 2nd ed., Addison-Wesley, 1998, §6.1.",
      supports: "Sequential searching, its analysis and the sentinel variant.",
    },
  ],
  review: draft,
  version: 1,
  updated: "2026-10-20",
};
