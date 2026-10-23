import type { AlgorithmEntry } from "../types";

export const floydWarshallEntry: AlgorithmEntry = {
  slug: "floyd-warshall",
  name: "Floyd–Warshall Algorithm",
  aliases: [
    "Floyd-Warshall",
    "All-pairs shortest paths",
    "APSP",
    "Roy–Floyd",
    "Warshall's algorithm",
  ],
  curriculum: [209],
  domain: "graphs",
  subcategory: "Shortest Paths",
  difficulty: "intermediate",
  summary:
    "Computes shortest distances between every pair of vertices with three nested loops: in round k, each distance may improve by routing through vertex k.",
  tags: ["shortest path", "all pairs", "dynamic programming", "negative weights", "matrix"],
  prerequisites: ["Graphs", "Dynamic Programming"],
  related: ["bellman-ford", "dijkstra"],
  problem: {
    input: "A directed graph with integer edge weights (possibly negative).",
    output:
      "The matrix $d$ where $d[i][j]$ is the shortest distance from $i$ to $j$ (∞ if unreachable), or a report that the graph has a negative cycle.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Start with a table of direct flight prices. Then ask, for one city $k$ at a time: “would any trip get cheaper if it were allowed to change planes at $k$?” After every city has been allowed as a stopover, the table holds the cheapest price of every trip, however many changes it takes.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Initialise $d[i][j]$ to the edge weight, $d[i][i] = 0$, and ∞ where there is no edge.",
          "For each vertex $k$, then each $i$, then each $j$: if $d[i][k] + d[k][j] < d[i][j]$, set $d[i][j] = d[i][k] + d[k][j]$.",
          "Afterwards, a negative entry on the diagonal means a negative cycle.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): A→C −2, B→A 4, B→C 3, C→D 2, D→B −1. Rows are sources, columns destinations.",
      },
      {
        kind: "table",
        head: ["Start", "A", "B", "C", "D"],
        rows: [
          ["A", "0", "∞", "−2", "∞"],
          ["B", "4", "0", "3", "∞"],
          ["C", "∞", "∞", "0", "2"],
          ["D", "∞", "−1", "∞", "0"],
        ],
      },
      {
        kind: "list",
        items: [
          "**k = A:** B→A→C costs 4 − 2 = 2 < 3.",
          "**k = B:** D→B→A costs 3 and D→B→C costs 1.",
          "**k = C:** A→C→D costs 0 and B→C→D costs 4.",
          "**k = D:** A→D→B costs −1, C→D→A costs 5 and C→D→B costs 1.",
        ],
      },
      {
        kind: "table",
        head: ["Final", "A", "B", "C", "D"],
        rows: [
          ["A", "0", "−1", "−2", "0"],
          ["B", "4", "0", "2", "4"],
          ["C", "5", "1", "0", "2"],
          ["D", "3", "−1", "1", "0"],
        ],
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "**The loop order matters:** $k$ must be the outermost loop. With $k$ inside, the recurrence is evaluated before its inputs are ready.",
          "The update can be done in place: in round $k$, row $k$ and column $k$ do not change (unless there is a negative cycle), so one matrix suffices.",
          "Skipping a row when $d[i][k] = \\infty$ saves time and avoids overflow with integer “infinity” values.",
          "**Path reconstruction:** keep $next[i][j]$, the first hop on the best path, and set $next[i][j] = next[i][k]$ when going through $k$ improves $d[i][j]$.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Number the vertices $1..n$ and let $d_k[i][j]$ be the shortest distance from $i$ to $j$ using only intermediate vertices from $\\{1, \\dots, k\\}$. A shortest such path either avoids $k$, or passes through it once (if there is no negative cycle), splitting into two paths that use only $\\{1, \\dots, k-1\\}$:",
      },
      {
        kind: "math",
        tex: "d_k[i][j] = \\min\\big(d_{k-1}[i][j],\\; d_{k-1}[i][k] + d_{k-1}[k][j]\\big)",
      },
      {
        kind: "p",
        text: "$d_0$ is the edge-weight matrix and $d_n$ is the answer. There are $n$ rounds of $n^2$ constant-time updates, so the time is $\\Theta(n^3)$ and the space $\\Theta(n^2)$. Every entry is always the weight of some real walk, so a negative diagonal entry exhibits a negative closed walk, and therefore a negative cycle.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**Transitive closure (Warshall):** replace $(\\min, +)$ with $(\\lor, \\land)$ to compute reachability.",
          "**Sparse graphs:** Johnson's algorithm (one Bellman–Ford, then Dijkstra from every vertex) runs in $O(VE \\log V)$, which beats $O(V^3)$ when $E$ is much smaller than $V^2$.",
          "**Min-plus matrix products:** all-pairs shortest paths is equivalent to $(\\min, +)$ matrix multiplication; no truly subcubic algorithm is known for general weights.",
          "**Applications:** routing tables, the diameter and centre of a graph, and detecting arbitrage over many currencies at once.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "\\Theta(n^3)", average: "\\Theta(n^3)", worst: "\\Theta(n^3)" },
    space: "\\Theta(n^2)",
    worstClass: "n^3",
    note: "For $n$ vertices, regardless of the number of edges.",
  },
  properties: [
    { label: "Pairs", value: "All pairs at once" },
    { label: "Negative weights", value: "Allowed; negative cycles detected on the diagonal" },
    { label: "Technique", value: "Dynamic programming over allowed intermediate vertices" },
  ],
  implementations: [
    {
      language: "python",
      entry: "floyd_warshall",
      code: `def floyd_warshall(n, edges):
    """Directed edges [u, v, w] on 0..n-1. Returns the distance matrix (None = unreachable)."""
    INF = float("inf")
    d = [[0 if i == j else INF for j in range(n)] for i in range(n)]
    for u, v, w in edges:
        d[u][v] = min(d[u][v], w)
    for k in range(n):
        for i in range(n):
            if d[i][k] == INF:
                continue
            for j in range(n):
                if d[i][k] + d[k][j] < d[i][j]:
                    d[i][j] = d[i][k] + d[k][j]
    return [[None if x == INF else x for x in row] for row in d]
`,
      tests: [
        {
          // The worked example with A, B, C, D = 0..3.
          args: [
            4,
            [
              [0, 2, -2],
              [1, 0, 4],
              [1, 2, 3],
              [2, 3, 2],
              [3, 1, -1],
            ],
          ],
          expected: [
            [0, -1, -2, 0],
            [4, 0, 2, 4],
            [5, 1, 0, 2],
            [3, -1, 1, 0],
          ],
        },
        {
          args: [3, [[0, 1, 7]]],
          expected: [
            [0, 7, null],
            [null, 0, null],
            [null, null, 0],
          ],
        },
      ],
    },
    {
      language: "javascript",
      entry: "reachable",
      code: `// Warshall's transitive closure: reach[i][j] is true when j can be reached from i.
function reachable(n, edges) {
  const reach = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => i === j),
  );
  for (const [u, v] of edges) reach[u][v] = true;
  for (let k = 0; k < n; k++)
    for (let i = 0; i < n; i++)
      if (reach[i][k])
        for (let j = 0; j < n; j++) if (reach[k][j]) reach[i][j] = true;
  return reach;
}
`,
      tests: [
        {
          args: [
            3,
            [
              [0, 1],
              [1, 2],
            ],
          ],
          expected: [
            [true, true, true],
            [false, true, true],
            [false, false, true],
          ],
        },
      ],
    },
  ],
  visualizer: "floyd-warshall",
  practice: [
    {
      id: "fw-updates",
      kind: "numeric",
      prompt:
        "For a graph with 50 vertices, how many times is the comparison $d[i][k] + d[k][j] < d[i][j]$ evaluated by the plain triple loop?",
      answer: 125000,
      explanation: "$n^3 = 50^3 = 125\\,000$, independent of the number of edges.",
      hints: ["Three nested loops of $n$ each."],
      objective: "Count the work of Floyd–Warshall",
    },
    {
      id: "fw-loop-order",
      kind: "mcq",
      prompt: "Which loop must be outermost?",
      options: [
        "k, the intermediate vertex",
        "i, the source",
        "j, the destination",
        "Any order gives the same result",
      ],
      answer: 0,
      explanation:
        "Round $k$ needs $d_{k-1}$ to be complete for all pairs; only with $k$ outermost is every entry using vertices $1..k-1$ ready before round $k$.",
      distractors: {
        1: "With i outermost, some entries are combined before their best values are known.",
        2: "Same problem as with i outermost.",
        3: "Other orders can miss shortest paths that need several intermediate vertices.",
      },
      hints: ["Look at the recurrence: what does round k depend on?"],
      objective: "Understand the dynamic programme",
    },
    {
      id: "fw-cycle",
      kind: "mcq",
      prompt: "After Floyd–Warshall finishes, $d[v][v] = -3$ for some $v$. What does this mean?",
      options: [
        "There is a cycle of negative total weight through v",
        "v is unreachable",
        "There is an error in the input",
        "The shortest path from v to itself has three edges",
      ],
      answer: 0,
      explanation:
        "Entries are always weights of real walks; a closed walk from $v$ of weight −3 contains a negative cycle.",
      distractors: {
        1: "Unreachable pairs have ∞, and $d[v][v]$ starts at 0.",
        2: "Negative cycles are valid inputs; they just make some distances undefined.",
        3: "The value is a weight, not an edge count.",
      },
      hints: ["$d[v][v]$ starts at 0. When could it decrease?"],
      objective: "Detect negative cycles",
    },
  ],
  exam: {
    definition:
      "Floyd–Warshall is a dynamic-programming algorithm that computes shortest-path distances between all pairs of vertices of a weighted directed graph with no negative cycles, by allowing intermediate vertices one at a time.",
    steps: [
      "d[i][j] = w(i, j), d[i][i] = 0, ∞ otherwise.",
      "for k: for i: for j: d[i][j] = min(d[i][j], d[i][k] + d[k][j]).",
      "A negative d[i][i] indicates a negative cycle.",
    ],
    timeComplexity: "$\\Theta(n^3)$.",
    spaceComplexity: "$\\Theta(n^2)$ (in place).",
    correctness:
      "By induction on k, after round k each d[i][j] is the shortest distance using intermediates from the first k vertices, because such a path either avoids vertex k or splits at it into two shorter subproblems.",
    applications: [
      "All-pairs shortest paths on dense graphs",
      "Transitive closure",
      "Graph diameter and centre",
      "Routing tables",
    ],
    limitations: ["Cubic time regardless of sparsity", "Quadratic memory"],
    faq: [
      {
        q: "Floyd–Warshall or Dijkstra from every vertex?",
        a: "For non-negative weights on sparse graphs, $V$ runs of Dijkstra take $O(VE \\log V)$, which is faster. On dense graphs, or with negative weights, Floyd–Warshall is simpler and competitive.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "All-pairs shortest paths by DP over intermediate vertices.",
          "$\\Theta(n^3)$ time, $\\Theta(n^2)$ space.",
        ],
      },
      {
        marks: 5,
        outline: [
          "Recurrence (2).",
          "Algorithm with k outermost (1).",
          "Small worked example (1).",
          "Complexity and negative-cycle detection (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Problem definition (1).",
          "Recurrence with justification (3).",
          "Pseudocode (2).",
          "Worked example with matrices (2).",
          "Complexity, negative cycles and path reconstruction (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "R. W. Floyd, “Algorithm 97: Shortest path,” Communications of the ACM, 5(6), 1962.",
      supports: "The all-pairs shortest-path algorithm.",
    },
    {
      citation: "S. Warshall, “A theorem on Boolean matrices,” Journal of the ACM, 9(1), 1962.",
      supports: "The transitive-closure version.",
    },
    {
      citation:
        "T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 3rd ed., MIT Press, 2009, §25.2.",
      supports: "The recurrence, correctness proof and analysis.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-21",
};
