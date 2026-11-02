import type { AlgorithmEntry } from "../types";

export const kruskalEntry: AlgorithmEntry = {
  slug: "kruskal",
  name: "Kruskal's Algorithm",
  aliases: ["Kruskal", "Minimum spanning tree (Kruskal)", "MST", "Minimum spanning forest"],
  curriculum: [216],
  domain: "graphs",
  subcategory: "Minimum Spanning Trees",
  difficulty: "intermediate",
  summary:
    "Builds a minimum spanning tree by taking edges from lightest to heaviest and keeping each one that joins two different trees, using union-find to detect cycles.",
  tags: ["mst", "minimum spanning tree", "greedy", "union-find", "weighted graph"],
  prerequisites: ["Graphs", "Sorting", "Union-Find"],
  related: ["prim", "union-find", "dijkstra"],
  problem: {
    input: "An undirected graph with a weight on every edge.",
    output:
      "A set of edges connecting every vertex of each component with no cycle and the smallest possible total weight (a minimum spanning forest).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "You must connect towns with roads as cheaply as possible, and any connected network will do. Kruskal's idea: consider the possible roads from cheapest to most expensive, and build each one unless the two towns are already connected by roads you have built. A road between already-connected towns would only add a loop.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Sort the edges by weight.",
          "Put every vertex in its own set (union-find).",
          "For each edge $(u, v)$ in order: if find(u) ≠ find(v), keep the edge and union the two sets; otherwise skip it.",
          "Stop when all edges are scanned, or early once $|V| - 1$ edges are kept in a connected graph.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset). Sorted edges: A–D 5, C–E 5, D–F 6, A–B 7, B–E 7, B–C 8, E–F 8, B–D 9, E–G 9, F–G 11, D–E 15. Equal weights keep their input order.",
      },
      {
        kind: "table",
        head: ["Edge", "Weight", "Decision", "Trees afterwards"],
        rows: [
          ["A–D", "5", "keep", "{A,D} {B} {C} {E} {F} {G}"],
          ["C–E", "5", "keep", "{A,D} {C,E} {B} {F} {G}"],
          ["D–F", "6", "keep", "{A,D,F} {C,E} {B} {G}"],
          ["A–B", "7", "keep", "{A,B,D,F} {C,E} {G}"],
          ["B–E", "7", "keep", "{A,B,C,D,E,F} {G}"],
          ["B–C", "8", "skip (cycle)", "unchanged"],
          ["E–F", "8", "skip (cycle)", "unchanged"],
          ["B–D", "9", "skip (cycle)", "unchanged"],
          ["E–G", "9", "keep", "{A,B,C,D,E,F,G}"],
          ["F–G", "11", "skip (cycle)", "unchanged"],
          ["D–E", "15", "skip (cycle)", "unchanged"],
        ],
      },
      {
        kind: "p",
        text: "Six edges are kept for seven vertices, with total weight $5 + 5 + 6 + 7 + 7 + 9 = 39$.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Sorting dominates: $O(E \\log E)$. The union-find work is nearly linear.",
          "Use a stable sort, or break ties explicitly, if you need reproducible output; any tie-breaking gives *a* minimum spanning tree.",
          "On a disconnected graph the result is a minimum spanning *forest*: one tree per component, $|V| - c$ edges for $c$ components.",
          "Negative weights are fine: only the order of weights matters, so adding a constant to every weight does not change the choice.",
        ],
      },
      {
        kind: "callout",
        tone: "tip",
        title: "Early exit",
        text: "In a connected graph, stop as soon as $|V| - 1$ edges are kept. Every later edge would close a cycle.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Cut property.** For any partition of the vertices into two sides, a lightest edge crossing the partition belongs to some minimum spanning tree. Exchange argument: if a minimum tree $T$ avoids that edge $e$, adding $e$ creates a cycle that crosses the partition at least twice; removing the other crossing edge $f$ gives a spanning tree of weight $w(T) + w(e) - w(f) \\le w(T)$.",
      },
      {
        kind: "p",
        text: "**Why Kruskal is correct.** When Kruskal keeps edge $(u, v)$, take the partition with $u$'s current tree on one side. Every lighter crossing edge was already scanned and skipped or kept, and no kept edge crosses this partition, so $(u, v)$ is a lightest crossing edge and the cut property applies. Induction on the edges kept shows the result is contained in a minimum spanning tree.",
      },
      {
        kind: "math",
        tex: "T(V, E) = O(E \\log E) = O(E \\log V)",
      },
      {
        kind: "p",
        text: "The two forms are equal because $E \\le V^2$, so $\\log E \\le 2 \\log V$.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**Uniqueness:** if all edge weights are distinct, the minimum spanning tree is unique.",
          "**Cycle property:** an edge that is the unique heaviest on some cycle belongs to no minimum spanning tree. The reverse-delete algorithm uses this.",
          "**Faster algorithms:** Borůvka's algorithm adds the cheapest edge out of every component in parallel rounds; Karger, Klein and Tarjan's randomised algorithm runs in expected linear time.",
          "**Applications:** network design, single-linkage clustering (stop Kruskal with $k$ trees left), and approximating the metric travelling salesperson tour within a factor of 2.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(E \\log E)", average: "O(E \\log E)", worst: "O(E \\log E)" },
    space: "O(V + E)",
    worstClass: "n log n",
    note: "Sorting the $E$ edges dominates; union-find adds $O(E\\,\\alpha(V))$.",
  },
  properties: [
    { label: "Strategy", value: "Greedy, justified by the cut property" },
    { label: "Disconnected graphs", value: "Returns a minimum spanning forest" },
    { label: "Negative weights", value: "Allowed" },
  ],
  implementations: [
    {
      language: "python",
      entry: "kruskal",
      code: `def kruskal(n, edges):
    """n vertices 0..n-1; edges as [u, v, w]. Returns [total, chosen edges]."""
    parent = list(range(n))

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]   # path halving
            x = parent[x]
        return x

    total, chosen = 0, []
    for u, v, w in sorted(edges, key=lambda e: e[2]):
        ru, rv = find(u), find(v)
        if ru != rv:
            parent[rv] = ru
            total += w
            chosen.append([u, v, w])
    return [total, chosen]
`,
      tests: [
        {
          // The worked example with A..G as 0..6.
          args: [
            7,
            [
              [0, 1, 7],
              [0, 3, 5],
              [1, 2, 8],
              [1, 3, 9],
              [1, 4, 7],
              [2, 4, 5],
              [3, 4, 15],
              [3, 5, 6],
              [4, 5, 8],
              [4, 6, 9],
              [5, 6, 11],
            ],
          ],
          expected: [
            39,
            [
              [0, 3, 5],
              [2, 4, 5],
              [3, 5, 6],
              [0, 1, 7],
              [1, 4, 7],
              [4, 6, 9],
            ],
          ],
        },
      ],
    },
    {
      language: "javascript",
      entry: "mstWeight",
      code: `function mstWeight(n, edges) {
  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (x) => (parent[x] === x ? x : (parent[x] = find(parent[x])));
  let total = 0;
  for (const [u, v, w] of [...edges].sort((a, b) => a[2] - b[2])) {
    const ru = find(u), rv = find(v);
    if (ru !== rv) {
      parent[rv] = ru;
      total += w;
    }
  }
  return total;
}
`,
      tests: [
        {
          args: [
            4,
            [
              [0, 1, 1],
              [1, 2, 2],
              [2, 3, 3],
              [3, 0, 4],
              [0, 2, 5],
            ],
          ],
          expected: 6,
        },
        {
          args: [
            3,
            [
              [0, 1, -5],
              [1, 2, 3],
              [0, 2, 1],
            ],
          ],
          expected: -4,
        },
      ],
    },
  ],
  visualizer: "kruskal",
  practice: [
    {
      id: "kruskal-edges",
      kind: "numeric",
      prompt:
        "A connected graph has 12 vertices and 30 edges. How many edges does Kruskal's algorithm keep?",
      answer: 11,
      explanation: "A spanning tree on $n$ vertices has exactly $n - 1 = 11$ edges.",
      hints: ["How many edges does any tree on $n$ vertices have?"],
      objective: "Know the size of a spanning tree",
    },
    {
      id: "kruskal-skip",
      kind: "mcq",
      prompt: "Kruskal skips an edge $(u, v)$ exactly when…",
      options: [
        "u and v are already in the same tree",
        "the edge is heavier than the previous edge",
        "u or v already has a kept edge",
        "the edge is the heaviest in the graph",
      ],
      answer: 0,
      explanation:
        "Then the edge would close a cycle; union-find detects this with find(u) = find(v).",
      distractors: {
        1: "Edges are scanned in non-decreasing order, so each one is at least as heavy as the last.",
        2: "Vertices can have many kept edges; trees branch.",
        3: "The heaviest edge can be essential, for example a bridge.",
      },
      hints: ["What would keeping an edge inside one tree create?"],
      objective: "Understand the cycle test",
    },
    {
      id: "kruskal-weight",
      kind: "numeric",
      prompt:
        "Square A–B–C–D–A has edge weights 1, 2, 3, 4 in that order around the square, plus a diagonal A–C of weight 5. What is the weight of the minimum spanning tree?",
      answer: 6,
      explanation: "Keep A–B (1), B–C (2), C–D (3); then D–A and A–C would close cycles. Total 6.",
      hints: ["Scan edges in weight order and keep each that joins two trees."],
      objective: "Run Kruskal by hand",
    },
  ],
  exam: {
    definition:
      "Kruskal's algorithm finds a minimum spanning forest of an undirected weighted graph by scanning edges in non-decreasing weight and keeping each edge whose endpoints are in different trees.",
    steps: [
      "Sort edges by weight.",
      "make-set for every vertex.",
      "For each edge (u, v): if find(u) ≠ find(v), keep it and union(u, v).",
      "Return the kept edges.",
    ],
    timeComplexity: "$O(E \\log E)$ for sorting; union-find adds $O(E\\,\\alpha(V))$.",
    spaceComplexity: "$O(V + E)$.",
    correctness:
      "Each kept edge is a lightest edge crossing the cut between its endpoint's tree and the rest, so by the cut property the kept set always extends to a minimum spanning tree.",
    applications: [
      "Network and circuit design",
      "Single-linkage clustering",
      "2-approximation for metric TSP",
      "Image segmentation",
    ],
    limitations: [
      "Needs all edges up front (sorted)",
      "Prim's algorithm with a heap is usually faster on dense graphs",
    ],
    faq: [
      {
        q: "Kruskal or Prim?",
        a: "Kruskal is simple and good for sparse graphs or edge lists; Prim grows one tree from a start vertex and suits dense graphs with adjacency structures.",
      },
      {
        q: "Does it work with negative weights?",
        a: "Yes. Only the relative order of the weights matters.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Greedy: lightest edge that does not form a cycle.",
          "Union-find for the cycle test; $O(E \\log E)$.",
        ],
      },
      {
        marks: 5,
        outline: [
          "Definition of MST (1).",
          "Algorithm steps (1).",
          "Worked example with an edge table (2).",
          "Complexity (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "MST definition and the cut property with proof (3).",
          "Pseudocode with union-find (2).",
          "Worked example (2).",
          "Correctness via the cut property (2).",
          "Complexity and comparison with Prim (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "J. B. Kruskal, “On the shortest spanning subtree of a graph and the traveling salesman problem,” Proceedings of the American Mathematical Society, 7(1), 1956.",
      supports: "The original algorithm.",
    },
    {
      citation:
        "T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 3rd ed., MIT Press, 2009, Ch. 23.",
      supports: "The cut property, the correctness proof and the running-time analysis.",
    },
    {
      citation:
        "D. R. Karger, P. N. Klein, R. E. Tarjan, “A randomized linear-time algorithm to find minimum spanning trees,” Journal of the ACM, 42(2), 1995.",
      supports: "Expected linear-time minimum spanning trees.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-21",
};
