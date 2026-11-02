import type { AlgorithmEntry } from "../types";

export const sentinelSearchEntry: AlgorithmEntry = {
  slug: "sentinel-search",
  name: "Sentinel Linear Search",
  aliases: ["Linear search with a sentinel"],
  curriculum: [2],
  domain: "searching-sorting",
  subcategory: "Searching",
  difficulty: "beginner",
  summary:
    "Linear search with the target copied into one extra cell after the end, so the loop needs no bounds test: one comparison per element instead of two.",
  tags: ["searching", "linear search", "sentinel", "loop optimisation"],
  prerequisites: ["Linear search"],
  related: ["linear-search", "binary-search"],
  problem: {
    input: "An array $A[0..n-1]$ with one spare cell after it, and a target $x$.",
    output: "The first index $k$ with $A[k] = x$, or $-1$.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A plain linear search asks two questions at every step: “am I still inside the array?” and “is this the target?”. Put a copy of the target just past the end and the first question becomes unnecessary — the scan is certain to stop, at the latest on the copy. One check at the end tells a real match from the sentinel.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Write the target into $A[n]$, the spare cell.",
          "Starting at $i = 0$, advance while $A[i] \\ne x$. No bounds test is needed.",
          "If the loop stopped at $i < n$, return $i$; otherwise only the sentinel matched, so return $-1$.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the second preset): searching for 5 in [7, 3, 9, 1, 4, 8, 2]. The sentinel 5 goes in cell 7; the scan compares 8 cells and stops on the sentinel, so the answer is −1 — 8 comparisons and no bounds tests, against 7 comparisons plus 8 bounds tests for the plain loop. In the first preset the scan finds 4 at index 4 after 5 comparisons.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "The array needs one writable cell after its end. If the array is full, save the last element, put the sentinel there, and check that element separately.",
          "Restore the spare cell afterwards if the array is shared.",
          "Modern compilers and branch predictors make the saving small; the technique matters most in tight loops and in teaching loop invariants.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Cost.** With the target at index $k$ the loop makes $k + 1$ comparisons; when it is absent, $n + 1$. The plain loop makes the same number of element comparisons but also up to $n + 1$ index comparisons, so the sentinel roughly halves the tests per step. **Correctness:** the loop invariant “$A[0..i-1]$ contains no $x$” holds throughout, and termination is guaranteed because $A[n] = x$. The tests check that the result is the first occurrence.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Knuth (TAOCP Vol. 3, §6.1, Algorithm Q) presents this “quick sequential search” and shows that it runs noticeably faster than the plain loop on his MIX machine.",
          "Sentinels appear elsewhere too: insertion sort can place the minimum first to drop a bounds test, and merge can append ∞ to each run.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(1)", average: "O(n)", worst: "O(n)" },
    space: "O(1) extra (one cell)",
    worstClass: "n",
  },
  properties: [
    { label: "Comparisons", value: "n + 1 when absent, with no bounds tests" },
    { label: "Needs", value: "One writable cell after the array" },
  ],
  implementations: [
    {
      language: "python",
      entry: "sentinel_search",
      code: `def sentinel_search(a, x):
    a = a + [x]                 # the sentinel
    i = 0
    while a[i] != x:            # no bounds test needed
        i += 1
    return i if i < len(a) - 1 else -1
`,
      tests: [
        { args: [[7, 3, 9, 1, 4, 8, 2], 4], expected: 4 },
        { args: [[7, 3, 9, 1, 4, 8, 2], 5], expected: -1 },
        { args: [[5, 2, 6, 2, 9], 2], expected: 1 },
      ],
    },
    {
      language: "javascript",
      entry: "comparisons",
      code: `// Element comparisons made by sentinel search.
function comparisons(a, x) {
  const b = [...a, x];
  let i = 0;
  while (b[i] !== x) i++;
  return i + 1;
}
`,
      tests: [
        { args: [[7, 3, 9, 1, 4, 8, 2], 5], expected: 8 },
        { args: [[7, 3, 9, 1, 4, 8, 2], 4], expected: 5 },
      ],
    },
  ],
  visualizer: "sentinel-search",
  practice: [
    {
      id: "sentinel-why",
      kind: "mcq",
      prompt: "What does the sentinel remove from the loop?",
      options: [
        "The test that the index is still inside the array",
        "The comparison with the target",
        "The need to scan the whole array",
        "The final check of whether the match is real",
      ],
      answer: 0,
      explanation:
        "The scan always stops on the sentinel at the latest, so the bounds test is redundant.",
      distractors: {
        1: "Each element still has to be compared with the target.",
        2: "An absent target still needs a full scan.",
        3: "That one check is still needed, once, after the loop.",
      },
      hints: ["Why can the loop not run off the end any more?"],
      objective: "Purpose of a sentinel",
    },
    {
      id: "sentinel-count",
      kind: "numeric",
      prompt:
        "How many element comparisons does sentinel search make on an array of 12 elements that does not contain the target?",
      answer: 13,
      explanation: "It compares all 12 elements and then the sentinel: n + 1 = 13.",
      hints: ["Count the sentinel too."],
      objective: "Cost",
    },
  ],
  exam: {
    definition:
      "Sentinel linear search places the target after the last element so that the scan terminates without a bounds test.",
    steps: ["Store x in A[n].", "Scan while A[i] ≠ x.", "Return i if i < n, else −1."],
    timeComplexity: "$O(n)$; n + 1 comparisons when absent.",
    spaceComplexity: "$O(1)$ extra.",
    correctness: "Invariant: no x in A[0..i−1]; termination by the sentinel.",
    applications: ["Tight search loops", "Teaching loop invariants"],
    limitations: ["Needs a writable spare cell", "Still linear"],
    faq: [
      {
        q: "Is it asymptotically faster?",
        a: "No — it is still O(n). It removes one test per step, a constant-factor saving.",
      },
    ],
    answers: [{ marks: 2, outline: ["Target stored past the end.", "Removes the bounds test."] }],
  },
  references: [
    {
      citation:
        "D. E. Knuth, The Art of Computer Programming, Vol. 3: Sorting and Searching, 2nd ed., Addison-Wesley, 1998, Section 6.1.",
      supports: "Sequential search with a sentinel (Algorithm Q).",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
