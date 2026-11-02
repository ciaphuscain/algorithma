import type { AlgorithmEntry } from "../types";

export const skipListEntry: AlgorithmEntry = {
  slug: "skip-list",
  name: "Skip List",
  aliases: ["Skiplist"],
  curriculum: [145],
  domain: "linear-structures",
  subcategory: "Lists, buffers and caches",
  difficulty: "intermediate",
  summary:
    "A sorted linked list with express lanes: each key gets a tower of random height, and level i links the keys whose towers reach it. Searches skip ahead on the upper levels and drop down when they would overshoot, taking O(log n) expected time — with no rotations or rebalancing.",
  tags: ["linked list", "randomized", "search", "ordered set", "probabilistic", "dictionary"],
  prerequisites: ["Linked lists", "Binary search"],
  related: ["treap", "bst", "red-black-tree", "reverse-linked-list"],
  problem: {
    input: "A sequence of insert, delete and search operations on keys 0–99.",
    output: "Whether each operation succeeded, and the keys left with their tower heights.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Searching a sorted linked list means walking it node by node. Add a second list that links every other node and you can skip ahead two at a time, dropping to the full list only at the end; add a third that links every fourth node, and so on, and a search costs about log₂ n steps, like binary search. Keeping that perfect pattern under insertions would be expensive, so a skip list chooses each new node's height by flipping a coin until it comes up tails: half the nodes reach level 2, a quarter level 3, and so on — the right proportions on average, with nothing to maintain.",
      },
      {
        kind: "p",
        text: "In the visualizer, each row is one level's linked list, read left to right; a column is one key's tower. Heights here come from fixed coin flips derived from the key (a hash), so every run is reproducible; a real skip list flips fresh coins.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "**Search for k:** start at the top of the head tower. On each level, move right while the next key is smaller than k; when the next key is k or larger (or there is none), drop down a level. On the bottom level, k is present if the next key is k.",
          "**Insert k:** search, remembering on each level the last node before k. If k is absent, flip coins for its height h and link k in after the remembered node on each of the bottom h levels.",
          "**Delete k:** search the same way; if k is present, unlink it from every level of its tower.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): insert 30, 10, 50, 70, 20, 60, 40, 80, whose towers have heights 2, 2, 2, 2, 3, 3, 4, 4. Then search for 60:",
      },
      {
        kind: "table",
        head: ["level", "keys on this level", "steps", "comparisons"],
        rows: [
          ["4", "40, 80", "40 < 60: move to 40; 80 ≥ 60: drop", "2"],
          ["3", "20, 40, 60, 80", "from 40, next is 60 ≥ 60: drop", "1"],
          ["2", "every key", "from 40, 50 < 60: move; 60: drop", "2"],
          ["1", "every key", "from 50, the next key is 60: found", "1"],
        ],
      },
      {
        kind: "p",
        text: "Six comparisons, against six for a walk along the bottom list from the head (10, 20, 30, 40, 50, 60) — the gap grows with n. Searching for 45 instead takes five comparisons and ends at 50 on the bottom level: missing. In the third preset the keys arrive in sorted order, which would make an unbalanced binary search tree a path; the skip list does not care.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Each node holds its key and an array of `next` pointers, one per level of its tower; the head has the maximum height. Cap the height at about log₂ of the largest expected n.",
          "Insert and delete keep an `update` array: the last node before k on each level, found during the search.",
          "Skip lists are simple to make concurrent, because an insertion only changes a few local pointers. Java's `ConcurrentSkipListMap` is one, and Redis uses a skip list for its sorted sets.",
          "With p = 1/4 instead of 1/2, towers are shorter (fewer pointers) and searches slightly longer; Pugh recommends p = 1/4 for most uses.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Height.** A tower reaches level i with probability $2^{-(i-1)}$, so the expected number of nodes on level i is $n/2^{i-1}$, and with high probability the tallest tower has height $O(\\log n)$. The expected number of pointers is $\\sum_i n/2^{i-1} \\le 2n$, so space is O(n).",
      },
      {
        kind: "p",
        text: "**Search cost.** Trace a search backwards from the bottom: at each node the path came either from the left (the node's tower stopped here, probability 1/2) or from above (the tower continues). So on each level the search takes an expected 2 steps before climbing, and the expected total is about $2 \\log_2 n$ — O(log n) expected for search, insert and delete. The bounds hold for every input order, because the randomness is in the algorithm, not the data; an unlucky run can still be slow. The tests check results against a plain set, tower heights against the coin flips, and that every drawn tower is unbroken.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Deterministic skip lists (Munro, Papadakis and Sedgewick) enforce gap sizes between towers and are closely related to 2-3-4 trees.",
          "Indexable skip lists store on each pointer how many bottom-level nodes it skips, giving O(log n) access by rank.",
          "Lock-free skip lists (for example by Fraser, or Herlihy and Shavit's textbook version) underpin many concurrent ordered maps.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(1)", average: "O(log n) expected", worst: "O(n)" },
    space: "O(n) expected",
    worstClass: "n",
    note: "Expected bounds hold for any input order; the O(n) worst case needs an unlucky sequence of coin flips.",
  },
  properties: [
    { label: "Levels", value: "A tower reaches level i with probability 2^−(i−1)" },
    { label: "Rebalancing", value: "None" },
    { label: "Order", value: "Keys are kept sorted on every level" },
  ],
  implementations: [
    {
      language: "python",
      entry: "search_steps",
      code: `def search_steps(towers, k):
    """towers: {key: height}. Comparisons to search for k, top level down, and whether found."""
    towers = {int(key): h for key, h in towers.items()}
    keys = sorted(towers)
    top = max(towers.values())
    x, steps = -1, 0                        # -1 stands for the head
    for level in range(top, 0, -1):
        while True:
            nxt = next((j for j in range(x + 1, len(keys)) if towers[keys[j]] >= level), None)
            if nxt is None:
                break
            steps += 1
            if keys[nxt] < k:
                x = nxt
            else:
                break
    nxt = x + 1
    return [steps, nxt < len(keys) and keys[nxt] == k]
`,
      tests: [
        {
          args: [{ "10": 2, "20": 3, "30": 2, "40": 4, "50": 2, "60": 3, "70": 2, "80": 4 }, 60],
          expected: [6, true],
        },
        {
          args: [{ "10": 2, "20": 3, "30": 2, "40": 4, "50": 2, "60": 3, "70": 2, "80": 4 }, 45],
          expected: [5, false],
        },
      ],
    },
    {
      language: "javascript",
      entry: "expectedPointers",
      code: `// Expected number of next pointers in a skip list of n keys with coin bias p, heights capped at maxLevel.
function expectedPointers(n, p, maxLevel) {
  let total = 0;
  for (let i = 1; i <= maxLevel; i++) total += n * p ** (i - 1);
  return total;
}
`,
      tests: [
        { args: [16, 0.5, 4], expected: 30 },
        { args: [16, 0.25, 3], expected: 21 },
      ],
    },
  ],
  visualizer: "skip-list",
  practice: [
    {
      id: "skip-drop",
      kind: "mcq",
      prompt:
        "Searching for 35, the search is at node 30 on level 3, and the next node on level 3 is 50. What happens?",
      options: [
        "Drop to level 2 and continue from 30",
        "Move to 50",
        "Go back to the head and start level 2",
        "Stop: 35 is not present",
      ],
      answer: 0,
      explanation:
        "50 ≥ 35 would overshoot, so the search drops a level at the same node and continues rightwards from 30.",
      distractors: {
        1: "Moving right is only allowed while the next key is smaller than the target.",
        2: "The search never goes back; that is what makes it fast.",
        3: "Absence is only decided on the bottom level.",
      },
      hints: ["Which way does a search never move?"],
      objective: "Search",
    },
    {
      id: "skip-levels",
      kind: "numeric",
      prompt:
        "With p = 1/2, about how many of 1,024 keys are expected to have towers reaching level 4 or higher?",
      answer: 128,
      explanation:
        "A tower reaches level 4 if the first three flips all come up heads: probability 1/8, and 1024 / 8 = 128.",
      hints: ["How many heads in a row does reaching level 4 need?"],
      objective: "Tower heights",
    },
  ],
  exam: {
    definition:
      "A skip list is a hierarchy of sorted linked lists in which each element appears in the bottom list and, independently with probability p, in each next list up; searches start at the top and move right or down.",
    steps: [
      "Search: move right while the next key is smaller; otherwise drop a level.",
      "Insert: search, recording predecessors; pick a random height; splice into each level.",
      "Delete: search; unlink from each level of the tower.",
    ],
    timeComplexity: "$O(\\log n)$ expected per operation; $O(n)$ in the worst case.",
    spaceComplexity: "$O(n)$ expected (about 2n pointers for p = 1/2).",
    correctness:
      "Every level is a sorted list and the bottom level contains every key, so the search ends at the right place on the bottom level.",
    applications: [
      "Redis sorted sets",
      "Concurrent ordered maps (Java's ConcurrentSkipListMap)",
      "In-memory indexes such as LSM-tree memtables",
    ],
    limitations: ["Only expected bounds", "Extra pointers per node", "Poor cache locality"],
    faq: [
      {
        q: "Why not just use a balanced tree?",
        a: "Skip lists give the same expected bounds with far simpler code and no rotations, and they are easier to make concurrent.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Structure and random heights (2).",
          "Search with an example (2).",
          "Expected complexity (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Structure (2).",
          "Search, insert, delete with the update array (4).",
          "Expected height, space and search analysis (4).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "W. Pugh, “Skip lists: a probabilistic alternative to balanced trees,” Communications of the ACM, 33(6), 1990.",
      supports: "Skip lists, their algorithms and the expected-cost analysis.",
    },
    {
      citation:
        "J. I. Munro, T. Papadakis, R. Sedgewick, “Deterministic skip lists,” Proceedings of the 3rd ACM-SIAM Symposium on Discrete Algorithms (SODA), 1992.",
      supports: "Deterministic skip lists.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-26",
};
