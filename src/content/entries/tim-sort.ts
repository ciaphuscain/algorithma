import type { AlgorithmEntry } from "../types";

export const timSortEntry: AlgorithmEntry = {
  slug: "tim-sort",
  name: "TimSort",
  aliases: ["Timsort"],
  curriculum: [41],
  domain: "searching-sorting",
  subcategory: "Specialized sorting",
  difficulty: "advanced",
  summary:
    "The hybrid stable sort behind Python's sorted() and Java's object sort: find natural runs, extend short ones with binary insertion sort, and merge them under stack rules that keep merges balanced. Linear on sorted or reversed input, O(n log n) in the worst case.",
  tags: ["sorting", "merge sort", "hybrid", "adaptive", "stable", "runs"],
  prerequisites: ["Natural merge sort", "Binary insertion sort"],
  related: ["natural-merge-sort", "binary-insertion-sort", "merge-sort", "exponential-search"],
  problem: {
    input: "An array of numbers.",
    output: "The same numbers in non-decreasing order.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Real-world data is rarely random: logs arrive almost in order, lists are concatenations of sorted lists, reversed lists appear. Timsort is built to exploit that. It scans for runs that are already in order (reversing descending ones), makes sure every run is reasonably long, and merges runs of similar size so that no merge is lopsided.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Find the next natural run; reverse it if strictly descending.",
          "If it is shorter than minrun, extend it to minrun with binary insertion sort.",
          "Push it on a stack of pending runs. While the top runs X, Y, Z (Z on top) violate |X| > |Y| + |Z| or |Y| > |Z|, merge Y with the smaller of its neighbours.",
          "At the end, merge everything left on the stack.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the fourth preset): [1, 3, 5, 7, 9, 8, 6, 4, 2, 0, 10, 11, 12, 13]. Runs: 1–9 ascending (5), 8–0 descending (5, reversed in place), 10–13 ascending (4). The two runs of 5 are merged as soon as the second is pushed (|Y| ≤ |Z|), then the run of 4 at the end: 2 merges, 32 comparisons. Sorted or reversed input is a single run: 7 comparisons, no merge.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Real Timsort uses minrun between 32 and 64 (computed from n so that n / minrun is close to a power of two); this visualizer uses 4 so that runs and merges show up on short arrays.",
          "Galloping mode — switching to exponential search when one run keeps winning — is left out here; it makes merging runs with very different values much faster.",
          "This version checks only the top three runs, as in the original description. De Gouw et al. (2015) showed this does not always keep the invariant deeper in the stack; fixed versions also check the fourth run. Sorting stays correct either way — only the bound on the stack's depth is affected.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Cost.** Run detection is O(n). The stack rules make run lengths grow at least like Fibonacci numbers from the top down, so the stack has O(log n) runs and each element takes part in O(log n) merges: O(n log n) worst case, O(n) when the input has few runs. Auger, Jugé, Nicaud and Pivoteau (2018) proved the worst case is O(n + n log ρ) for ρ runs. The tests check the output on random arrays and that sorted and strictly reversed inputs cost n − 1 comparisons and no merge.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Tim Peters designed it for Python in 2002; Java adopted it for objects in Java 7.",
          "Powersort (Munro and Wild, 2018) replaces the merge rules with ones based on run boundaries and is now used in Python.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n log n)",
      worst: "O(n log n)",
    },
    space: "O(n)",
    worstClass: "n log n",
  },
  properties: [
    {
      label: "Stable",
      value: "Yes",
    },
    {
      label: "Adaptive",
      value: "Linear on few runs",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "min_run",
      code: `def min_run(n):
    r = 0
    while n >= 64:
        r |= n & 1
        n >>= 1
    return n + r
`,
      tests: [
        {
          args: [63],
          expected: 63,
        },
        {
          args: [64],
          expected: 32,
        },
        {
          args: [1000],
          expected: 63,
        },
        {
          args: [2112],
          expected: 33,
        },
      ],
    },
    {
      language: "javascript",
      entry: "runs",
      code: `// Lengths of natural runs (descending runs counted as one run, as Timsort reverses them).
function runs(a) {
  const out = [];
  let i = 0;
  while (i < a.length) {
    let j = i + 1;
    if (j < a.length && a[j] < a[i]) while (j < a.length && a[j] < a[j - 1]) j++;
    else while (j < a.length && a[j] >= a[j - 1]) j++;
    out.push(j - i);
    i = j;
  }
  return out;
}
`,
      tests: [
        {
          args: [[1, 3, 5, 7, 9, 8, 6, 4, 2, 0, 10, 11, 12, 13]],
          expected: [5, 5, 4],
        },
      ],
    },
  ],
  visualizer: "tim-sort",
  practice: [
    {
      id: "tim-rule",
      kind: "mcq",
      prompt: "The top three runs on the stack have lengths 30, 20, 15 (15 on top). What happens?",
      options: [
        "Merge the 20 with the 15",
        "Merge the 30 with the 20",
        "Nothing",
        "Merge all three",
      ],
      answer: 0,
      explanation: "30 ≤ 20 + 15, so Y = 20 is merged with the smaller neighbour, Z = 15.",
      distractors: {
        "1": "X = 30 is larger than Z = 15, so Y merges with Z.",
        "2": "The rule |X| > |Y| + |Z| is violated.",
        "3": "Merges are always pairwise.",
      },
      hints: ["Check |X| > |Y| + |Z|."],
      objective: "Merge rules",
    },
    {
      id: "tim-minrun",
      kind: "numeric",
      prompt: "What is minrun for n = 1000?",
      answer: 63,
      explanation:
        "Shifting 1000 right until it is below 64 gives 62 with a 1 bit shifted out, so 62 + 1 = 63.",
      hints: ["Keep the top 6 bits; add 1 if anything else was set."],
      objective: "minrun",
    },
  ],
  exam: {
    definition:
      "Timsort is a stable hybrid merge sort that merges natural runs, extended to a minimum length by binary insertion sort, under stack invariants.",
    steps: [
      "Detect and normalise runs.",
      "Extend short runs.",
      "Push and merge per the invariants.",
      "Final merges.",
    ],
    timeComplexity: "O(n log n) worst; O(n) on presorted input.",
    spaceComplexity: "$O(n)$.",
    correctness: "Every merge combines adjacent sorted runs stably.",
    applications: ["Python sorted()", "Java object sorting", "Android"],
    limitations: ["Complex", "O(n) buffer"],
    faq: [
      {
        q: "Why keep run lengths Fibonacci-like?",
        a: "It bounds the stack at O(log n) and keeps merges balanced, like merge sort's halves.",
      },
    ],
    answers: [
      {
        marks: 10,
        outline: [
          "Runs and minrun (3).",
          "Stack invariants (3).",
          "Galloping (2).",
          "Complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "T. Peters, “listsort.txt” (description of Timsort), CPython source distribution, 2002.",
      supports: "Timsort's design.",
    },
    {
      citation:
        "S. de Gouw, J. Rot, F. S. de Boer, R. Bubel, R. Hähnle, “OpenJDK's java.utils.Collection.sort() is broken: the good, the bad and the worst case,” Proceedings of CAV, 2015.",
      supports: "The flaw in the original stack invariant check.",
    },
    {
      citation:
        "N. Auger, V. Jugé, C. Nicaud, C. Pivoteau, “On the worst-case complexity of TimSort,” Proceedings of ESA, 2018.",
      supports: "The O(n + n log ρ) bound.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
