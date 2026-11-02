import type { AlgorithmEntry } from "../types";

export const floydFindDuplicateEntry: AlgorithmEntry = {
  slug: "floyd-find-duplicate",
  name: "Cycle Detection (Floyd) on Arrays",
  aliases: [
    "Find the duplicate number",
    "Tortoise and hare on arrays",
    "Floyd's algorithm for duplicates",
    "Cycle detection (Floyd)",
  ],
  curriculum: [60],
  domain: "arrays-hashing",
  subcategory: "Array Techniques",
  difficulty: "intermediate",
  summary:
    "Treat an array of n + 1 values in 1..n as a function i → A[i]. Following it from index 0 must enter a cycle, and the cycle's entry is a value held at two positions. Floyd's tortoise and hare finds it in O(n) time, O(1) memory, without changing the array.",
  tags: ["cycle detection", "tortoise and hare", "functional graph", "duplicate", "two pointers"],
  prerequisites: ["Floyd's Cycle Detection"],
  related: ["floyd-cycle", "pollard-rho", "two-pointers"],
  problem: {
    input: "n + 1 values, each between 1 and n (so at least one repeats).",
    output: "A repeated value: the entry of the cycle reached from index 0.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Think of each index as a room with one door marked with a room number, A[i]. Start in room 0 and keep walking through doors. There are finitely many rooms, so you must eventually come back to a room you have visited — and the first room you revisit has two doors leading to it: the one you came through first and the one that closes the loop. Two doors with the same number means two positions with the same value.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Phase 1: slow = fast = 0; repeat slow = A[slow], fast = A[A[fast]] until they meet. They meet inside the cycle.",
          "Phase 2: p = 0; move p and slow one step at a time until they meet. The meeting point is the cycle's entry.",
          "Return it: it is a duplicated value.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): A = [1, 3, 4, 2, 2]. From 0 the walk is 0 → 1 → 3 → 2 → 4 → 2 → 4 …, a tail of three steps into the cycle 2 → 4 → 2. Slow and fast meet at index 4 after 4 rounds; in phase 2 p and slow meet at 2 after 3 more rounds. That is 18 array reads in all, and 2 is indeed at positions 3 and 4.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Index 0 is the right start: no value is 0, so 0 has no incoming edge and cannot be on a cycle — the walk must have a tail, and the entry has a predecessor on the tail and one on the cycle.",
          "With several duplicates the algorithm finds one of them: the one at the entry of the cycle reachable from 0.",
          "The array is only read. Alternatives either use O(n) memory (a set), modify the array (marking signs), or take O(n log n) time (binary search on the value range with counting).",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Why phase 2 works.** Let the tail have length μ and the cycle length λ. When they meet after t steps, fast has walked 2t and slow t steps, so t is a multiple of λ, with t ≥ μ. A pointer that walks μ more steps from the meeting point is at position t + μ ≡ μ (mod λ) along the cycle — the entry — and so is p after μ steps from 0. **Cost:** phase 1 takes at most μ + λ rounds, phase 2 μ rounds: O(n) reads, O(1) memory. The tests compare the answer with walking from 0 and recording visited indices in a set.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "The same rho shape underlies Pollard's rho factorisation and cycle detection in pseudo-random generators.",
          "Brent's method finds the cycle with fewer function evaluations by moving a power-of-two checkpoint.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n)",
      average: "O(n)",
      worst: "O(n)",
    },
    space: "O(1)",
    worstClass: "n",
  },
  properties: [
    {
      label: "Modifies the array",
      value: "No",
    },
    {
      label: "Extra memory",
      value: "O(1)",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "find_duplicate",
      code: `def find_duplicate(a):
    slow = fast = 0
    while True:
        slow = a[slow]
        fast = a[a[fast]]
        if slow == fast:
            break
    p = 0
    while p != slow:
        p, slow = a[p], a[slow]
    return p
`,
      tests: [
        {
          args: [[1, 3, 4, 2, 2]],
          expected: 2,
        },
        {
          args: [[3, 1, 3, 4, 2]],
          expected: 3,
        },
        {
          args: [[2, 5, 9, 6, 9, 3, 8, 9, 7, 1]],
          expected: 9,
        },
      ],
    },
    {
      language: "javascript",
      entry: "tailAndCycle",
      code: `// Length of the tail (mu) and of the cycle (lambda) of the walk i -> a[i] from 0.
function tailAndCycle(a) {
  const firstSeen = new Map();
  let i = 0, step = 0;
  while (!firstSeen.has(i)) { firstSeen.set(i, step++); i = a[i]; }
  return [firstSeen.get(i), step - firstSeen.get(i)];
}
`,
      tests: [
        {
          args: [[1, 3, 4, 2, 2]],
          expected: [3, 2],
        },
        {
          args: [[3, 3, 3, 3, 3]],
          expected: [1, 1],
        },
      ],
    },
  ],
  visualizer: "floyd-find-duplicate",
  practice: [
    {
      id: "fd-start",
      kind: "mcq",
      prompt: "Why must the walk start at index 0?",
      options: [
        "No value is 0, so index 0 is never on the cycle",
        "Index 0 always holds the duplicate",
        "It is the smallest index",
        "Any start works equally well",
      ],
      answer: 0,
      explanation: "Starting off the cycle guarantees a tail, so the entry has two predecessors.",
      distractors: {
        "1": "A[0] can be anything in 1..n.",
        "2": "Smallness is not the point.",
        "3": "Starting on a cycle without a tail finds no entry with two predecessors.",
      },
      hints: ["Which index has no incoming edge?"],
      objective: "Functional graph",
    },
    {
      id: "fd-run",
      kind: "numeric",
      prompt: "Which value does the algorithm return for [3, 1, 3, 4, 2]?",
      answer: 3,
      explanation: "The walk is 0 → 3 → 4 → 2 → 3, so the cycle 3 → 4 → 2 → 3 is entered at 3.",
      hints: ["Follow i → A[i] from 0."],
      objective: "Run the algorithm",
    },
  ],
  exam: {
    definition:
      "Finding a duplicate with Floyd's algorithm reads the array as a function i → A[i] and finds the entry of the cycle reached from index 0.",
    steps: [
      "Phase 1: tortoise and hare until they meet.",
      "Phase 2: one pointer from 0, one from the meeting point, until they meet.",
      "Return the meeting point.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(1)$.",
    correctness:
      "The cycle's entry has two predecessors, so it is a repeated value; phase 2 meets exactly at the entry.",
    applications: [
      "Duplicate detection with read-only memory",
      "Cycle detection in iterated functions",
    ],
    limitations: ["Requires values in 1..n with n + 1 entries"],
    faq: [
      {
        q: "What if there are several duplicates?",
        a: "It returns the one at the entry of the cycle reached from 0.",
      },
    ],
    answers: [
      {
        marks: 10,
        outline: [
          "Functional graph view (2).",
          "Phase 1 (2).",
          "Phase 2 and its proof (5).",
          "Complexity (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "D. E. Knuth, The Art of Computer Programming, Vol. 2: Seminumerical Algorithms, 3rd ed., Addison-Wesley, 1997, Section 3.1, Exercise 6.",
      supports: "Floyd's cycle-finding method for iterated functions.",
    },
    {
      citation:
        "R. P. Brent, “An improved Monte Carlo factorization algorithm,” BIT, 20(2), 1980, pp. 176–184.",
      supports: "Brent's cycle-detection variant.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
