import type { AlgorithmEntry } from "../types";

export const tournamentSortEntry: AlgorithmEntry = {
  slug: "tournament-sort",
  name: "Tournament Sort",
  aliases: ["Tree selection sort"],
  curriculum: [35],
  domain: "searching-sorting",
  subcategory: "Heap-based sorting",
  difficulty: "intermediate",
  summary:
    "Sort by holding a knockout tournament: the winner (smallest value) reaches the root, is output, and is replaced by +∞; only the ⌈log₂ n⌉ matches on its path are replayed. O(n log n) comparisons, at the cost of a tree of about 2n nodes.",
  tags: ["sorting", "winner tree", "tournament", "selection"],
  prerequisites: ["Selection sort", "Binary trees"],
  related: ["heap-sort", "selection-sort", "merge-sorted-lists"],
  problem: {
    input: "An array of numbers.",
    output: "The same numbers in non-decreasing order.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Selection sort finds the smallest value by comparing it against everything, then does it all again for the second smallest. A knockout tournament remembers the results: the runner-up must have lost only to the champion, so after removing the champion, only the matches along the champion's path need replaying.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Put the values in the leaves of a complete binary tree, padding with +∞.",
          "Each internal node holds the smaller of its two children: n − 1 matches.",
          "Repeat n times: output the root, set its leaf to +∞, and recompute the nodes on the path from that leaf to the root.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the fourth preset): eight players [5, 9, 2, 7, 4, 8, 1, 6]. The first tournament takes 7 matches and crowns 1. Replacing 1 by ∞ and replaying its path of 3 matches crowns 2, and so on: 17 real comparisons in all (matches against ∞ need no comparison).",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Store the tree in an array like a binary heap: node k has children 2k and 2k + 1.",
          "Loser trees, which store the loser of each match, make replaying a path cheaper and are used for k-way merging in external sorting.",
          "Tournament sort is stable if ties are broken by position.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Cost.** Building costs n − 1 comparisons; each of the n outputs replays at most ⌈log₂ n⌉ matches, so the total is at most $n - 1 + n \\lceil \\log_2 n \\rceil$ — O(n log n). Space is O(n) for the tree. The tests check the output and this comparison bound.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Knuth (TAOCP Vol. 3, §5.2.3) describes tree selection and its relation to heapsort, which achieves the same in place.",
          "Replacement selection, used to create initial runs for external merge sort, is a tournament that keeps accepting new inputs.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n log n)",
    },
    space: "O(n)",
    worstClass: "n log n",
  },
  properties: [
    {
      label: "Tree",
      value: "Winner tree, about 2n nodes",
    },
    {
      label: "Replays per output",
      value: "⌈log₂ n⌉ matches",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "tournament_sort",
      code: `import math

def tournament_sort(a):
    n = len(a)
    size = 1
    while size < n:
        size *= 2
    t = [math.inf] * (2 * size)
    t[size:size + n] = a
    for k in range(size - 1, 0, -1):
        t[k] = min(t[2 * k], t[2 * k + 1])
    out = []
    for _ in range(n):
        w = t[1]
        out.append(w)
        k = 1
        while k < size:                      # follow the winner down
            k = 2 * k if t[2 * k] == w else 2 * k + 1
        t[k] = math.inf
        k //= 2
        while k >= 1:                        # replay its path
            t[k] = min(t[2 * k], t[2 * k + 1])
            k //= 2
    return out
`,
      tests: [
        {
          args: [[5, 9, 2, 7, 4, 8, 1, 6]],
          expected: [1, 2, 4, 5, 6, 7, 8, 9],
        },
        {
          args: [[3, 1, 3]],
          expected: [1, 3, 3],
        },
      ],
    },
    {
      language: "javascript",
      entry: "bound",
      code: `// Upper bound on comparisons: n − 1 to build, then ⌈log₂ n⌉ per output.
function bound(n) {
  return n - 1 + n * Math.ceil(Math.log2(n));
}
`,
      tests: [
        {
          args: [8],
          expected: 31,
        },
      ],
    },
  ],
  visualizer: "tournament-sort",
  practice: [
    {
      id: "ts-build",
      kind: "numeric",
      prompt: "How many matches does the first tournament between 16 players take?",
      answer: 15,
      explanation: "Each match eliminates one player; 15 must be eliminated.",
      hints: ["Count eliminations."],
      objective: "Build cost",
    },
    {
      id: "ts-replay",
      kind: "numeric",
      prompt: "After removing the champion of 16 players, how many matches are replayed?",
      answer: 4,
      explanation: "The path from a leaf to the root has log₂ 16 = 4 internal nodes.",
      hints: ["Height of the tree."],
      objective: "Replay",
    },
  ],
  exam: {
    definition:
      "Tournament sort repeatedly extracts the winner of a knockout tree and replays only the winner's path.",
    steps: ["Build the winner tree.", "Output the root; set its leaf to ∞.", "Replay the path."],
    timeComplexity: "$O(n \\log n)$.",
    spaceComplexity: "$O(n)$.",
    correctness: "Each internal node always holds the minimum of its subtree.",
    applications: ["k-way merging (loser trees)", "Replacement selection in external sorting"],
    limitations: ["O(n) extra space", "Heapsort does the same in place"],
    faq: [
      {
        q: "How does it relate to heapsort?",
        a: "Both keep a tree of partial results; heapsort keeps it in place, the tournament keeps every match result.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["Winner tree (2).", "Replay (2).", "Complexity (1)."],
      },
    ],
  },
  references: [
    {
      citation:
        "D. E. Knuth, The Art of Computer Programming, Vol. 3: Sorting and Searching, 2nd ed., Addison-Wesley, 1998, Section 5.2.3.",
      supports: "Tree selection (tournament) sorting.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
