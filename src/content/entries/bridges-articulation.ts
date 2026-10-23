import type { AlgorithmEntry } from "../types";

export const bridgesArticulationEntry: AlgorithmEntry = {
  slug: "bridges-articulation",
  name: "Bridges and Articulation Points",
  aliases: ["Cut edges", "Cut vertices", "Tarjan's bridge algorithm", "Low-link (undirected)"],
  curriculum: [245, 246],
  domain: "graphs",
  subcategory: "Connectivity",
  difficulty: "advanced",
  summary:
    "One depth-first search finds every edge (bridge) and every vertex (articulation point) whose removal disconnects an undirected graph, by comparing discovery times with low-links.",
  tags: ["bridge", "articulation point", "cut vertex", "biconnected", "dfs", "low-link"],
  prerequisites: ["Depth-First Search"],
  related: ["tarjan-scc", "dfs", "union-find"],
  problem: {
    input: "An undirected graph.",
    output:
      "Its bridges (edges whose removal increases the number of connected components) and articulation points (vertices whose removal does).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A road is a bridge if it is the only way between two parts of a network; a town is a cut vertex if every route between some parts passes through it. In a DFS tree, a subtree is in danger exactly when nothing inside it has a back edge climbing above its parent. The low-link of a vertex measures how high its subtree can climb.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "DFS assigns each vertex a discovery time $disc[u]$.",
          "$low[u]$ is the smallest $disc$ reachable from $u$'s subtree using tree edges and at most one back edge.",
          "Tree edge $u$–$v$ is a **bridge** when $low[v] > disc[u]$: $v$'s subtree cannot reach $u$ or above any other way.",
          "A non-root $u$ is an **articulation point** when some child $v$ has $low[v] \\ge disc[u]$. The root is one when it has at least two DFS children.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): triangle A–B–C, path C–D–E, triangle E–F–G. Final disc/low values:",
      },
      {
        kind: "table",
        head: ["vertex", "A", "B", "C", "D", "E", "F", "G"],
        rows: [
          ["disc", "0", "1", "2", "3", "4", "5", "6"],
          ["low", "0", "0", "0", "3", "4", "4", "4"],
        ],
      },
      {
        kind: "list",
        items: [
          "D–E: $low[E] = 4 > disc[D] = 3$, a bridge (found first, as the recursion unwinds). C–D: $low[D] = 3 > disc[C] = 2$, a bridge.",
          "E: child F has $low = 4 \\ge disc[E] = 4$. D: child E has $4 \\ge 3$. C: child D has $3 \\ge 2$. So C, D and E are articulation points.",
          "A is the root with one child, so it is not an articulation point; B's child C has $low = 0 < 1$.",
        ],
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Skip the edge back to the parent, but only once. With parallel edges, track the parent **edge** id rather than the parent vertex, or a doubled edge is wrongly reported as a bridge.",
          "Run DFS from every undiscovered vertex so disconnected graphs are handled.",
          "An articulation point can be detected several times (once per qualifying child); report it once.",
          "For large graphs use an iterative DFS; recursion depth can reach $V$.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "In an undirected DFS every non-tree edge joins a vertex to one of its ancestors (there are no cross edges). Removing tree edge $u$–$v$ separates $v$'s subtree from the rest unless some back edge leaves the subtree to $u$ or above, that is unless $low[v] \\le disc[u]$. Hence the bridge test $low[v] > disc[u]$.",
      },
      {
        kind: "p",
        text: "Removing a non-root $u$ cuts off child $v$'s subtree exactly when no back edge from that subtree reaches a proper ancestor of $u$: $low[v] \\ge disc[u]$. The root has no ancestors, so it separates its subtrees exactly when it has two or more. One DFS gives:",
      },
      { kind: "math", tex: "T(V, E) = O(V + E)" },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**Biconnected components** (maximal subgraphs without articulation points) come from the same DFS by keeping a stack of edges.",
          "The **bridge tree** (contract every 2-edge-connected component) is a tree; many network-reliability questions become tree questions on it.",
          "Dynamic versions (edges inserted and deleted) are much harder; offline divide-and-conquer with a rollback union-find is a common approach.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(V + E)", average: "O(V + E)", worst: "O(V + E)" },
    space: "O(V)",
    worstClass: "n + m",
  },
  properties: [
    { label: "Passes", value: "One DFS per connected component" },
    { label: "Bridge test", value: "$low[v] > disc[u]$" },
    { label: "Cut-vertex test", value: "$low[v] \\ge disc[u]$ (root: two or more children)" },
  ],
  implementations: [
    {
      language: "python",
      entry: "cut_structure",
      code: `def cut_structure(vertices, edges):
    """Returns [sorted bridges as 'u-v' with u < v, sorted articulation points]."""
    adj = {v: [] for v in vertices}
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)
    disc, low, time = {}, {}, [0]
    bridges, cut = [], set()

    def dfs(u, parent):
        disc[u] = low[u] = time[0]
        time[0] += 1
        children = 0
        for v in sorted(adj[u]):
            if v not in disc:
                children += 1
                dfs(v, u)
                low[u] = min(low[u], low[v])
                if low[v] > disc[u]:
                    bridges.append("-".join(sorted((u, v))))
                if parent is not None and low[v] >= disc[u]:
                    cut.add(u)
            elif v != parent:
                low[u] = min(low[u], disc[v])
        if parent is None and children >= 2:
            cut.add(u)

    for r in sorted(vertices):
        if r not in disc:
            dfs(r, None)
    return [sorted(bridges), sorted(cut)]
`,
      tests: [
        {
          args: [
            ["A", "B", "C", "D", "E", "F", "G"],
            [
              ["A", "B"],
              ["B", "C"],
              ["C", "A"],
              ["C", "D"],
              ["D", "E"],
              ["E", "F"],
              ["F", "G"],
              ["G", "E"],
            ],
          ],
          expected: [
            ["C-D", "D-E"],
            ["C", "D", "E"],
          ],
        },
      ],
    },
    {
      language: "javascript",
      entry: "isBridgeByRemoval",
      code: `// The definition, checked directly: does removing edge k disconnect its endpoints?
function isBridgeByRemoval(n, edges, k) {
  const adj = Array.from({ length: n }, () => []);
  edges.forEach(([u, v], i) => {
    if (i === k) return;
    adj[u].push(v);
    adj[v].push(u);
  });
  const [s, t] = edges[k];
  const seen = new Set([s]);
  const stack = [s];
  while (stack.length) for (const v of adj[stack.pop()]) if (!seen.has(v)) { seen.add(v); stack.push(v); }
  return !seen.has(t);
}
`,
      tests: [
        {
          args: [
            4,
            [
              [0, 1],
              [1, 2],
              [2, 0],
              [2, 3],
            ],
            3,
          ],
          expected: true,
        },
        {
          args: [
            4,
            [
              [0, 1],
              [1, 2],
              [2, 0],
              [2, 3],
            ],
            0,
          ],
          expected: false,
        },
      ],
    },
  ],
  visualizer: "bridges-articulation",
  practice: [
    {
      id: "bridges-tree",
      kind: "numeric",
      prompt: "A tree has 9 vertices. How many of its edges are bridges?",
      answer: 8,
      explanation:
        "A tree has $n - 1 = 8$ edges and no cycles, so removing any edge disconnects it.",
      hints: ["Does a tree have any cycle that offers a detour?"],
      objective: "Recognise bridges",
    },
    {
      id: "bridges-test",
      kind: "mcq",
      prompt: "For tree edge u–v (v a child of u), which condition makes it a bridge?",
      options: ["low[v] > disc[u]", "low[v] ≥ disc[u]", "low[u] > disc[v]", "disc[v] > disc[u]"],
      answer: 0,
      explanation:
        "low[v] > disc[u] means v's subtree cannot reach u or anything above it except through the edge u–v.",
      distractors: {
        1: "That is the articulation-point test: a back edge to u itself keeps the edge u–v on a cycle, so it is not a bridge.",
        2: "The roles are reversed.",
        3: "Always true for a child; it says nothing about cycles.",
      },
      hints: ["Can v's subtree reach u without using u–v?"],
      objective: "Apply the bridge test",
    },
  ],
  exam: {
    definition:
      "A bridge is an edge, and an articulation point a vertex, whose removal increases the number of connected components; both are found with one DFS using discovery times and low-links.",
    steps: [
      "DFS; disc[u] = low[u] = time++.",
      "Tree child v: recurse; low[u] = min(low[u], low[v]); bridge if low[v] > disc[u]; cut vertex if (non-root) low[v] ≥ disc[u].",
      "Back edge to v ≠ parent: low[u] = min(low[u], disc[v]).",
      "Root is a cut vertex iff it has ≥ 2 DFS children.",
    ],
    timeComplexity: "$O(V + E)$.",
    spaceComplexity: "$O(V)$.",
    correctness:
      "Undirected DFS has only tree and back edges, so a subtree stays connected to the rest after deleting its root edge (or parent vertex) exactly when a back edge leaves it above that point.",
    applications: [
      "Network reliability",
      "Biconnected components",
      "Critical routers and links",
      "Planarity testing pre-processing",
    ],
    limitations: ["Static graphs; parallel edges need edge-id bookkeeping"],
    faq: [
      {
        q: "Why ≥ for vertices but > for edges?",
        a: "A back edge reaching u itself keeps edge u–v on a cycle (not a bridge), but removing u still cuts v's subtree off.",
      },
    ],
    answers: [
      { marks: 2, outline: ["Definitions.", "One DFS with low-links; tests > and ≥."] },
      {
        marks: 5,
        outline: ["Definitions (1).", "Low-link (1).", "Tests (2).", "Example and complexity (1)."],
      },
      {
        marks: 10,
        outline: [
          "Definitions (1).",
          "DFS edge classification in undirected graphs (2).",
          "Pseudocode (2).",
          "Worked example with disc/low table (2).",
          "Proof of both tests, including the root case (3).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "J. Hopcroft, R. Tarjan, “Algorithm 447: Efficient algorithms for graph manipulation,” Communications of the ACM, 16(6), 1973.",
      supports: "Linear-time biconnected components and articulation points.",
    },
    {
      citation:
        "R. Tarjan, “Depth-first search and linear graph algorithms,” SIAM Journal on Computing, 1(2), 1972.",
      supports: "Low-link values and DFS-based connectivity algorithms.",
    },
    {
      citation:
        "T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 3rd ed., MIT Press, 2009, Problem 22-2.",
      supports: "Articulation points, bridges and biconnected components via low values.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-23",
};
