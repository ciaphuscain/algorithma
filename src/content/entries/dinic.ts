import type { AlgorithmEntry } from "../types";

export const dinicEntry: AlgorithmEntry = {
  slug: "dinic",
  name: "Dinic's Algorithm (Maximum Flow)",
  aliases: ["Dinitz's algorithm", "Blocking flow", "Level graph", "Max flow"],
  curriculum: [235],
  domain: "graphs",
  subcategory: "Network flow",
  difficulty: "advanced",
  summary:
    "Computes a maximum flow in phases. Each phase builds the level graph by BFS from the source, then sends a blocking flow along edges that go one level deeper, using DFS with per-vertex edge pointers. At most |V| − 1 phases, O(V²E) in total.",
  tags: ["max flow", "min cut", "level graph", "blocking flow", "network flow", "bfs", "dfs"],
  prerequisites: ["Breadth-First Search", "Depth-First Search", "Ford–Fulkerson method"],
  related: ["push-relabel", "hopcroft-karp", "bfs"],
  problem: {
    input: "A directed graph with edge capacities, a source s and a sink t.",
    output:
      "A maximum flow from s to t, its value, and a minimum cut (the vertices still reachable from s in the residual graph).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Think of pipes. Flow can be pushed along any path from s to t with spare capacity, and earlier choices can be undone by pushing flow back along an edge (the residual graph contains a reverse edge for every unit sent). Ford–Fulkerson augments one path at a time and can take very long on bad path choices.",
      },
      {
        kind: "p",
        text: "Dinic organises the search. A BFS labels each vertex with its distance from s (its level). Only edges going exactly one level deeper are used, so every path found is a shortest path. Within a phase, augment until no such path is left (a blocking flow), skipping edges that led to dead ends. Then rebuild the levels: the distance to t has grown.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "BFS from s in the residual graph; stop if t is unreachable.",
          "Reset each vertex's pointer to its first outgoing residual edge.",
          "DFS from s towards t along edges with level[v] = level[u] + 1, carrying the bottleneck capacity; augment along the path found.",
          "When an edge leads nowhere, advance u's pointer past it for the rest of the phase. Repeat the DFS until it finds nothing; then start a new phase.",
          "At the end, the vertices reachable from s form the source side of a minimum cut.",
        ],
      },
      { kind: "p", text: "**Worked example** (the first preset, the classic textbook network)." },
      {
        kind: "table",
        head: ["Phase", "Levels", "Augmenting paths", "Flow"],
        rows: [
          ["1", "S 0; A, B 1; C, D 2; T 3", "12 along S → A → C → T; 4 along S → B → D → T", "16"],
          ["2", "S 0; A, B 1; D 2; C 3; T 4", "7 along S → B → D → C → T", "23"],
          ["—", "S 0; A, B 1; D 2 (T unreachable)", "none", "23"],
        ],
      },
      {
        kind: "p",
        text: "The last BFS reaches {S, A, B, D}. The edges leaving that set are A → C (12), D → C (7) and D → T (4), with total capacity 23, equal to the flow, which proves the flow maximum.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Store each edge with its reverse in an adjacency list (arc i and arc i ^ 1), so augmenting updates both in O(1).",
          "The per-vertex pointer (current edge) is what makes a phase O(VE); without it, dead ends are re-explored.",
          "Recursive DFS depth is at most the level of t; an iterative version avoids stack limits on long paths.",
          "Integer capacities give an integer maximum flow (integrality), which is why flows model matchings and assignments.",
          "Scaling variants (augment only by large amounts first) help with very different capacities.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Max-flow min-cut.** For any flow f and s–t cut (S, T), $|f| \\le c(S, T)$. When no augmenting path exists, the set S of vertices reachable from s in the residual graph gives equality: every edge from S to T is saturated and every edge from T to S carries no flow. The oracle checks exactly this certificate on every run.",
      },
      {
        kind: "p",
        text: "**Phases.** After a blocking flow, every shortest s–t path in the residual graph has an edge that was saturated or is new (a reverse edge pointing to a lower level), so the distance from s to t strictly increases. It is at most |V| − 1, so there are at most |V| − 1 phases. A phase costs O(VE): each augmentation is O(V) plus pointer advances, which total O(E).",
      },
      {
        kind: "math",
        tex: "T = O(V^2 E), \\qquad O(E\\sqrt{V}) \\text{ on unit-capacity bipartite graphs}",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "On unit-capacity graphs Dinic runs in $O(E \\min(\\sqrt{E}, V^{2/3}))$; on bipartite matching graphs it is the Hopcroft–Karp algorithm in disguise.",
          "Dynamic trees (Sleator–Tarjan) reduce a phase to $O(E \\log V)$, giving $O(VE \\log V)$.",
          "Push–relabel algorithms are often faster in practice on large dense graphs.",
          "Recent theoretical work (2022) solves maximum flow in almost-linear time $m^{1 + o(1)}$, using interior-point methods.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(V^2 E)", average: "O(V^2 E)", worst: "O(V^2 E)" },
    space: "O(V + E)",
    worstClass: "other",
    note: "Upper bound; much faster in practice and on unit-capacity graphs.",
  },
  properties: [
    { label: "Phases", value: "At most |V| − 1" },
    { label: "Certificate", value: "Residual reachability gives a minimum cut" },
  ],
  implementations: [
    {
      language: "python",
      entry: "max_flow",
      code: `from collections import deque


def max_flow(n, edges, s, t):
    # edges: [u, v, capacity] with vertices 0..n-1
    graph = [[] for _ in range(n)]       # arc: [to, residual, index of reverse arc]
    for u, v, c in edges:
        graph[u].append([v, c, len(graph[v])])
        graph[v].append([u, 0, len(graph[u]) - 1])
    flow = 0
    while True:
        level = [-1] * n
        level[s] = 0
        queue = deque([s])
        while queue:
            u = queue.popleft()
            for v, cap, _ in graph[u]:
                if cap > 0 and level[v] < 0:
                    level[v] = level[u] + 1
                    queue.append(v)
        if level[t] < 0:
            return flow
        it = [0] * n

        def dfs(u, f):
            if u == t:
                return f
            while it[u] < len(graph[u]):
                arc = graph[u][it[u]]
                v, cap, rev = arc
                if cap > 0 and level[v] == level[u] + 1:
                    d = dfs(v, min(f, cap))
                    if d > 0:
                        arc[1] -= d
                        graph[v][rev][1] += d
                        return d
                it[u] += 1
            return 0

        while True:
            f = dfs(s, float("inf"))
            if f == 0:
                break
            flow += f
`,
      tests: [
        {
          args: [
            6,
            [
              [0, 1, 16],
              [0, 2, 13],
              [1, 3, 12],
              [2, 1, 4],
              [2, 4, 14],
              [3, 2, 9],
              [3, 5, 20],
              [4, 3, 7],
              [4, 5, 4],
            ],
            0,
            5,
          ],
          expected: 23,
        },
        {
          args: [
            4,
            [
              [0, 1, 1],
              [0, 2, 1],
              [1, 2, 1],
              [1, 3, 1],
              [2, 3, 1],
            ],
            0,
            3,
          ],
          expected: 2,
        },
      ],
    },
    {
      language: "javascript",
      entry: "edmondsKarp",
      code: `// Edmonds–Karp for comparison: one BFS (shortest) augmenting path at a time, O(V·E²).
function edmondsKarp(n, edges, s, t) {
  const cap = Array.from({ length: n }, () => new Array(n).fill(0));
  for (const [u, v, c] of edges) cap[u][v] += c;
  let flow = 0;
  for (;;) {
    const parent = new Array(n).fill(-1);
    parent[s] = s;
    const queue = [s];
    while (queue.length && parent[t] < 0) {
      const u = queue.shift();
      for (let v = 0; v < n; v++)
        if (cap[u][v] > 0 && parent[v] < 0) { parent[v] = u; queue.push(v); }
    }
    if (parent[t] < 0) return flow;
    let f = Infinity;
    for (let v = t; v !== s; v = parent[v]) f = Math.min(f, cap[parent[v]][v]);
    for (let v = t; v !== s; v = parent[v]) { cap[parent[v]][v] -= f; cap[v][parent[v]] += f; }
    flow += f;
  }
}
`,
      tests: [
        {
          args: [
            6,
            [
              [0, 1, 16],
              [0, 2, 13],
              [1, 3, 12],
              [2, 1, 4],
              [2, 4, 14],
              [3, 2, 9],
              [3, 5, 20],
              [4, 3, 7],
              [4, 5, 4],
            ],
            0,
            5,
          ],
          expected: 23,
        },
      ],
    },
  ],
  visualizer: "dinic",
  practice: [
    {
      id: "dinic-phases",
      kind: "numeric",
      prompt:
        "How many phases (BFS rounds that reach t) does Dinic's algorithm need on the first preset?",
      answer: 2,
      explanation:
        "Phase 1 (t at level 3) sends 16; phase 2 (t at level 4) sends 7; the next BFS cannot reach t.",
      hints: ["The level of t must increase from one phase to the next."],
      objective: "Trace Dinic's phases",
    },
    {
      id: "dinic-cut",
      kind: "mcq",
      prompt: "When Dinic's algorithm stops, how do you read off a minimum cut?",
      options: [
        "Take the vertices reachable from s in the residual graph",
        "Take the edges with the smallest capacities",
        "Take the vertices at even levels",
        "Take every edge that carries flow",
      ],
      answer: 0,
      explanation:
        "Edges leaving that set are saturated and edges entering it are empty, so its capacity equals the flow value.",
      distractors: {
        1: "Small edges need not separate s from t.",
        2: "Levels change from phase to phase and say nothing about cuts.",
        3: "Flow-carrying edges usually include many that are not in a minimum cut.",
      },
      hints: ["Which vertices can s still send flow to?"],
      objective: "Extract the minimum cut",
    },
  ],
  exam: {
    definition:
      "Dinic's algorithm computes a maximum flow by repeatedly building the BFS level graph of the residual network and saturating it with a blocking flow found by DFS with current-edge pointers.",
    steps: [
      "BFS levels from s in the residual graph; stop if t is unreachable.",
      "DFS along level + 1 edges; augment; advance pointers past dead ends.",
      "Repeat until the DFS finds nothing; start the next phase.",
      "Minimum cut: vertices reachable from s at the end.",
    ],
    timeComplexity: "$O(V^2 E)$; $O(E\\sqrt{V})$ for unit-capacity bipartite graphs.",
    spaceComplexity: "$O(V + E)$.",
    correctness:
      "Each augmentation keeps a valid flow; termination with no s–t residual path gives a cut equal to the flow (max-flow min-cut); the s–t distance increases every phase.",
    applications: [
      "Network capacity",
      "Bipartite matching",
      "Image segmentation (min cut)",
      "Project selection",
      "Baseball elimination",
    ],
    limitations: [
      "Worst-case bound is high for dense graphs",
      "Needs integer or exact arithmetic for termination guarantees with irrational capacities",
    ],
    faq: [
      {
        q: "Why is it faster than Ford–Fulkerson?",
        a: "Paths are shortest and found in batches per phase; the distance to t grows each phase, bounding the number of phases by V − 1.",
      },
    ],
    answers: [
      { marks: 2, outline: ["Level graph by BFS + blocking flow by DFS.", "$O(V^2 E)$."] },
      {
        marks: 5,
        outline: [
          "Residual graph (1).",
          "Phases and level graph (2).",
          "Blocking flow (1).",
          "Complexity (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Flow networks and residual graphs (2).",
          "Algorithm (2).",
          "Worked example (2).",
          "Max-flow min-cut theorem (2).",
          "Phase bound and complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "E. A. Dinic, “Algorithm for solution of a problem of maximum flow in networks with power estimation,” Soviet Mathematics Doklady, 11, 1970.",
      supports: "The level-graph algorithm.",
    },
    {
      citation:
        "L. R. Ford, D. R. Fulkerson, “Maximal flow through a network,” Canadian Journal of Mathematics, 8, 1956.",
      supports: "Augmenting paths and the max-flow min-cut theorem.",
    },
    {
      citation:
        "J. Edmonds, R. M. Karp, “Theoretical improvements in algorithmic efficiency for network flow problems,” Journal of the ACM, 19(2), 1972.",
      supports: "Shortest augmenting paths (the Edmonds–Karp algorithm in the JavaScript sample).",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-23",
};
