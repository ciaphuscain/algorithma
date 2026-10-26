import type { AlgorithmEntry } from "../types";

export const fibonacciHeapEntry: AlgorithmEntry = {
  slug: "fibonacci-heap",
  name: "Fibonacci Heap",
  aliases: ["F-heap"],
  curriculum: [128],
  domain: "linear-structures",
  subcategory: "Heaps",
  difficulty: "advanced",
  summary:
    "A lazy forest of heap-ordered trees. Insert and decrease-key do almost nothing — O(1) amortised — and all the tidying is deferred to extract-min, which links trees of equal degree in O(log n) amortised. Those bounds give Dijkstra's and Prim's algorithms their best theoretical running times.",
  tags: ["heap", "priority queue", "amortized analysis", "decrease-key", "cascading cut"],
  prerequisites: ["Binomial heaps", "Amortised analysis"],
  related: ["binomial-heap", "pairing-heap", "dijkstra", "prim"],
  problem: {
    input:
      "A sequence of insert, extract (remove the minimum), peek and decrease-key operations on distinct keys.",
    output:
      "What each operation returns, with O(1) amortised insert and decrease-key and O(log n) amortised extract-min.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Dijkstra's algorithm calls decrease-key far more often than extract-min, so a heap that makes decrease-key cheap pays off. A Fibonacci heap is a binomial heap that refuses to tidy up early. A new key is just a new root. A decreased key that breaks heap order is simply cut off and made a root. Only extract-min, which must look at all the roots anyway, cleans up — linking roots of equal degree until no two share a degree.",
      },
      {
        kind: "p",
        text: "Cutting freely could leave trees skinny and degrees large, so one rule limits it: a node may lose one child (it is then **marked**); if it loses a second, it is cut too, and the rule continues upward — a **cascading cut**. This keeps a tree whose root has degree d at least $F_{d+2}$ nodes big, which is where the name comes from.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "**Insert:** add a one-node tree to the root list; update the min pointer.",
          "**Extract-min:** move the min root's children to the root list (unmarked) and remove it. **Consolidate:** go through the roots; while two have the same degree, link them (the larger root becomes a child of the smaller). Rebuild the root list from the survivors and find the new minimum.",
          "**Decrease-key:** lower the key. If it is now smaller than its parent, cut it to the root list (unmarked); then, for the parent: if unmarked (and not a root), mark it; if already marked, cut it as well and repeat for its parent.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the second preset): insert 70, 30, 90, 50, 10, 80, 60, 40, 20; extract-min; then decrease 70 to 5, 90 to 3 and 50 to 1.",
      },
      {
        kind: "table",
        head: ["operation", "what happens", "roots afterwards"],
        rows: [
          ["9 inserts", "nine one-node roots, min = 10", "70 30 90 50 10 80 60 40 20"],
          [
            "extract → 10",
            "consolidation links roots of equal degree 7 times",
            "20(40 60(80) 30(70 50(90)))",
          ],
          [
            "decrease 70 to 5",
            "5 < 30: cut it; 30 has lost its first child, so mark it",
            "20(…), 5",
          ],
          ["decrease 90 to 3", "3 < 50: cut it; mark 50", "20(…), 5, 3"],
          [
            "decrease 50 to 1",
            "1 < 30: cut it; 30 is already marked, so cut 30 too (cascade)",
            "20(40 60(80)), 5, 3, 1 (min), 30",
          ],
        ],
      },
      {
        kind: "p",
        text: "Four cuts and no consolidation: the five roots wait for the next extract-min. In the first preset, eight lazy inserts are followed by one extract-min whose consolidation makes 4 links and leaves roots of degrees 0, 1 and 2.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Store roots and siblings in circular doubly linked lists so that cutting and splicing are O(1); each node keeps parent, one child pointer, degree and mark.",
          "Consolidation uses an array indexed by degree, of size $O(\\log n)$ (at most about $\\log_\\varphi n$).",
          "Constant factors are high: in practice binary or pairing heaps are often faster, even for Dijkstra, unless the graph is very dense.",
          "Decrease-key needs a handle (pointer) to the node; algorithms keep one per vertex.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Degree bound.** The i-th child linked to a node had degree at least i − 1 when linked (roots of equal degree are linked) and has lost at most one child since (or it would have been cut), so it has degree at least i − 2. By induction a node of degree d has at least $F_{d+2} \\ge \\varphi^d$ descendants, so every degree is at most $\\log_\\varphi n \\approx 1.44 \\log_2 n$.",
      },
      {
        kind: "p",
        text: "**Amortised costs.** With potential $\\Phi$ = (number of roots) + 2 × (number of marked nodes): insert adds one root, O(1). Extract-min spends time proportional to the roots but leaves at most $O(\\log n)$ of them, so its amortised cost is $O(\\log n)$. A cascading cut of length c turns c − 1 marked nodes into unmarked roots, releasing enough potential to pay for itself, so decrease-key is O(1) amortised. Dijkstra then runs in $O(E + V \\log V)$. The tests check heap order, that roots are unmarked, the min pointer, the $F_{d+2}$ size bound for every node, and the whole forest against an independent implementation.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Fredman and Tarjan introduced Fibonacci heaps in 1984 (journal version 1987) to speed up network optimisation algorithms.",
          "Simpler structures with the same amortised bounds have since appeared, such as rank-pairing heaps (Haeupler, Sen and Tarjan) and strict Fibonacci heaps with worst-case bounds (Brodal, Lagogiannis and Tarjan).",
          "Pairing heaps, simpler still, are fast in practice; their exact decrease-key cost was a long-standing open question.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(1)", average: "O(log n) amortised", worst: "O(n)" },
    space: "O(n)",
    worstClass: "n",
    note: "Insert, decrease-key, union, peek: O(1) amortised. Extract-min: O(log n) amortised; a single one can take O(n).",
  },
  properties: [
    { label: "Lazy operations", value: "Insert and cut only add roots" },
    { label: "Degree bound", value: "Degree d ⇒ at least $F_{d+2}$ nodes" },
    { label: "Marks", value: "A node that has lost one child; a second loss cuts it too" },
  ],
  implementations: [
    {
      language: "python",
      entry: "consolidate",
      code: `def consolidate(roots):
    """roots: list of (key, children) trees. Link equal degrees; return sorted (key, degree)."""
    by_degree = {}
    for tree in roots:
        x = tree
        while len(x[1]) in by_degree:
            y = by_degree.pop(len(x[1]))
            if y[0] < x[0]:
                x, y = y, x
            x[1].append(y)                       # larger root becomes a child
        by_degree[len(x[1])] = x
    return sorted((t[0], len(t[1])) for t in by_degree.values())
`,
      tests: [
        {
          args: [
            [
              [70, []],
              [30, []],
              [90, []],
              [50, []],
              [80, []],
              [60, []],
              [40, []],
              [20, []],
            ],
          ],
          expected: [[20, 3]],
        },
        {
          args: [
            [
              [4, []],
              [8, []],
              [2, []],
            ],
          ],
          expected: [
            [2, 0],
            [4, 1],
          ],
        },
      ],
    },
    {
      language: "javascript",
      entry: "minSize",
      code: `// Fewest nodes in a Fibonacci-heap tree whose root has degree d: F(d + 2).
function minSize(d) {
  let [a, b] = [0, 1];
  for (let i = 0; i < d + 2; i++) [a, b] = [b, a + b];
  return a;
}
`,
      tests: [
        { args: [0], expected: 1 },
        { args: [3], expected: 5 },
        { args: [10], expected: 144 },
      ],
    },
  ],
  visualizer: "fibonacci-heap",
  practice: [
    {
      id: "fib-cascade",
      kind: "mcq",
      prompt:
        "A decrease-key cuts node x from its parent p, which is already marked. What happens to p?",
      options: [
        "p is cut too and becomes an unmarked root; then the same check runs on p's parent",
        "p is unmarked and stays where it is",
        "p's subtree is consolidated",
        "Nothing: only x moves",
      ],
      answer: 0,
      explanation:
        "A marked node has already lost one child; losing a second triggers a cascading cut.",
      distractors: {
        1: "Unmarking happens when a node becomes a root or is linked, not on a second loss.",
        2: "Consolidation happens only during extract-min.",
        3: "Without cascading cuts the degree bound would fail.",
      },
      hints: ["What does a mark record?"],
      objective: "Cascading cuts",
    },
    {
      id: "fib-size",
      kind: "numeric",
      prompt: "At least how many nodes does a Fibonacci-heap tree whose root has degree 4 contain?",
      answer: 8,
      explanation: "$F_{4+2} = F_6 = 8$.",
      hints: ["$F_1 = F_2 = 1$, $F_3 = 2$, …"],
      objective: "Degree bound",
    },
  ],
  exam: {
    definition:
      "A Fibonacci heap is a lazy forest of heap-ordered trees with a min pointer, supporting insert and decrease-key in O(1) amortised and extract-min in O(log n) amortised.",
    steps: [
      "Insert: new root.",
      "Extract-min: children to roots; consolidate by linking equal degrees.",
      "Decrease-key: cut on violation; cascading cuts on marked parents.",
    ],
    timeComplexity: "O(1) amortised insert/decrease-key/union; O(log n) amortised extract-min.",
    spaceComplexity: "$O(n)$.",
    correctness:
      "Heap order is kept by linking under the smaller root and cutting violators; marks bound degrees by $\\log_\\varphi n$.",
    applications: ["Dijkstra in $O(E + V \\log V)$", "Prim's MST", "Theoretical algorithm design"],
    limitations: ["Large constant factors", "Complex pointer structure"],
    faq: [
      {
        q: "Why Fibonacci?",
        a: "The smallest tree with root degree d has $F_{d+2}$ nodes, so sizes grow like Fibonacci numbers.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Lazy forest; O(1) amortised decrease-key.", "Consolidation in extract-min."],
      },
      {
        marks: 15,
        outline: [
          "Operations (5).",
          "Marks and cascading cuts with an example (4).",
          "Degree bound (3).",
          "Potential-function analysis (3).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "M. L. Fredman, R. E. Tarjan, “Fibonacci heaps and their uses in improved network optimization algorithms,” Journal of the ACM, 34(3), 1987.",
      supports: "Fibonacci heaps, their analysis and applications.",
    },
    {
      citation:
        "T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 3rd ed., MIT Press, 2009, Chapter 19.",
      supports: "Operations, cascading cuts, the degree bound and the potential function.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-26",
};
