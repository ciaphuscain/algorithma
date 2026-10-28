import type { AlgorithmEntry } from "../types";

export const jumpSearchEntry: AlgorithmEntry = {
  slug: "jump-search",
  name: "Jump Search",
  aliases: ["Block search", "Square-root search"],
  curriculum: [8],
  domain: "searching-sorting",
  subcategory: "Searching",
  difficulty: "beginner",
  summary:
    "Jumps through a sorted array in blocks of √n until a block's last key reaches the target, then scans that block: at most about 2√n comparisons, moving only forwards.",
  tags: ["searching", "sorted array", "square root", "blocks"],
  prerequisites: ["Linear search", "Sorted order"],
  related: ["linear-search", "binary-search", "exponential-search"],
  problem: {
    input: "A sorted array and a target $x$.",
    output: "An index $k$ with $A[k] = x$, or $-1$.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Looking for a page in a book by flicking forward a chunk at a time: once you overshoot, go back to the start of that chunk and read page by page. Big jumps cover ground fast; a short scan finishes. The best chunk size balances the number of jumps against the length of the final scan.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Let m = ⌊√n⌋. Look at the last key of each block: A[m − 1], A[2m − 1], … until one is at least x.",
          "If every block ends below x, x is absent.",
          "Scan that block from its start; stop early once a key exceeds x.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the third preset): the 16 Fibonacci-like keys [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610], searching for 55 with m = 4. Block ends A[3] = 2 and A[7] = 13 are smaller; A[11] = 89 is not. Scan positions 8, 9, 10: found at 10. Six comparisons.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "The jumps only move forward, which suits media where going back is expensive, such as tape or a singly linked list with skip pointers.",
          "A second level of jumps inside the block (blocks of n^(1/4)) reduces the cost further; taken to the limit this becomes a B-tree-like hierarchy.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Choosing m.** With block size m, the worst case is about $n/m$ jumps plus $m$ scanned elements. $n/m + m$ is minimised at $m = \\sqrt{n}$, giving about $2\\sqrt{n}$ comparisons: O(√n), between linear and binary search. The tests check every result against the array.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Square-root decomposition uses the same balance for range queries: √n blocks of √n elements.",
          "Skip lists generalise jumping to log n levels and reach O(log n).",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(1)", average: "O(√n)", worst: "O(√n)" },
    space: "O(1)",
    worstClass: "n",
    note: "O(√n) is listed under n in the filters, the next class up.",
  },
  properties: [
    { label: "Block size", value: "⌊√n⌋" },
    { label: "Direction", value: "Forwards only" },
  ],
  implementations: [
    {
      language: "python",
      entry: "jump_search",
      code: `from math import isqrt

def jump_search(a, x):
    n = len(a)
    m = max(1, isqrt(n))
    prev, nxt = 0, m
    while a[min(nxt, n) - 1] < x:
        prev, nxt = nxt, nxt + m
        if prev >= n:
            return -1
    for i in range(prev, min(nxt, n)):
        if a[i] == x:
            return i
        if a[i] > x:
            break
    return -1
`,
      tests: [
        { args: [[0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610], 55], expected: 10 },
        { args: [[2, 5, 8, 12, 16, 23, 38, 56, 72, 91], 40], expected: -1 },
      ],
    },
    {
      language: "javascript",
      entry: "worstCase",
      code: `// Worst-case comparisons of jump search with block size m on n elements (about n/m + m).
function worstCase(n, m) {
  return Math.ceil(n / m) + m - 1;
}
`,
      tests: [
        { args: [100, 10], expected: 19 },
        { args: [100, 5], expected: 24 },
      ],
    },
  ],
  visualizer: "jump-search",
  practice: [
    {
      id: "jump-block",
      kind: "numeric",
      prompt: "What block size does jump search use for 400 elements?",
      answer: 20,
      explanation: "⌊√400⌋ = 20.",
      hints: ["The block size is ⌊√n⌋."],
      objective: "Block size",
    },
    {
      id: "jump-why-sqrt",
      kind: "mcq",
      prompt: "Why is √n the best block size?",
      options: [
        "It balances the number of jumps (n/m) against the scan length (m)",
        "It makes the scan length 1",
        "It makes the number of jumps 1",
        "It matches the cache line size",
      ],
      answer: 0,
      explanation: "n/m + m is smallest when m = √n.",
      distractors: {
        1: "That would need n jumps.",
        2: "That would need a scan of n elements.",
        3: "The choice is about comparisons, not hardware.",
      },
      hints: ["Minimise n/m + m."],
      objective: "Analysis",
    },
  ],
  exam: {
    definition:
      "Jump search checks every ⌊√n⌋-th element of a sorted array to find the block containing the target, then scans that block.",
    steps: ["Jump by √n while the block end is below x.", "Scan the block."],
    timeComplexity: "$O(\\sqrt{n})$.",
    spaceComplexity: "$O(1)$.",
    correctness:
      "The block found is the first whose last key is ≥ x, so x, if present, lies in it.",
    applications: ["Forward-only media", "Simple improvement over linear search"],
    limitations: ["Slower than binary search on random-access arrays"],
    faq: [
      {
        q: "When would you use it over binary search?",
        a: "When moving backwards is costly; binary search jumps back and forth.",
      },
    ],
    answers: [
      { marks: 5, outline: ["Algorithm (2).", "Optimal block size (2).", "Comparison (1)."] },
    ],
  },
  references: [
    {
      citation:
        "B. Shneiderman, “Jump searching: a fast sequential search technique,” Communications of the ACM, 21(10), 1978.",
      supports: "Jump search and the √n block size.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
