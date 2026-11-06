import type { AlgorithmEntry } from "../types";

export const johnsonsAlgorithmEntry: AlgorithmEntry = {
  slug: "johnsons-algorithm",
  name: "Johnson's Algorithm",
  aliases: ["Johnson's reweighting"],
  curriculum: [210],
  domain: "graphs",
  subcategory: "Shortest Paths",
  difficulty: "advanced",
  summary:
    "Computes all-pairs shortest paths in a sparse graph with possibly negative weights by reweighting edges via one Bellman–Ford run to make all weights non-negative, then running Dijkstra from every vertex.",
  tags: ["shortest path", "all-pairs", "negative weights", "reweighting"],
  prerequisites: ["Bellman–Ford", "Dijkstra's Algorithm"],
  related: ["bellman-ford", "dijkstra", "floyd-warshall"],
  problem: {
    input:
      "A weighted directed graph with n vertices and m edges (possibly negative weights, no negative cycles).",
    output: "Shortest-path distances between all pairs of vertices.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Floyd–Warshall solves all-pairs shortest paths in $O(n^3)$, which is fine for dense graphs. For sparse graphs ($m \\ll n^2$), we'd rather run Dijkstra from every vertex — $O(n(m + n \\log n))$ — but Dijkstra requires non-negative weights.",
      },
      {
        kind: "p",
        text: "Johnson's insight: use Bellman–Ford once to compute a potential function $h(v)$ such that reweighted edges $w'(u,v) = w(u,v) + h(u) - h(v) \\ge 0$. Then run Dijkstra on the reweighted graph.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Add a virtual source vertex $q$ with zero-weight edges to every vertex.",
          "Run Bellman–Ford from $q$ to get $h(v) = \\delta(q, v)$ for all $v$.",
          "If Bellman–Ford detects a negative cycle, report it.",
          "Reweight each edge: $w'(u, v) = w(u, v) + h(u) - h(v)$.",
          "Run Dijkstra from every vertex $u$ on the reweighted graph.",
          "Convert back: $\\delta(u, v) = \\delta'(u, v) - h(u) + h(v)$.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example.** Three vertices, edges: (0→1, 4), (0→2, 5), (1→2, −2). Bellman–Ford from q gives h = [0, 0, −2]. Reweighted: (0→1, 4), (0→2, 7), (1→2, 0). Dijkstra works on these non-negative weights.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "The virtual source q doesn't need to actually exist; just initialize Bellman–Ford with d[v] = 0 for all v.",
          "After reweighting, all edges are non-negative — a formal proof follows from the triangle inequality of shortest paths.",
          "Use a Fibonacci heap Dijkstra for best asymptotics.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Bellman–Ford runs in $O(nm)$. Dijkstra from each of $n$ vertices on a graph with $m$ edges takes $O(n(m + n \\log n))$ with Fibonacci heaps. Total: $O(nm + n^2 \\log n)$.",
      },
      {
        kind: "p",
        text: "Reweighting preserves shortest paths because for any path $p$ from $u$ to $v$: $w'(p) = w(p) + h(u) - h(v)$. The $h$ terms telescope, so the relative order of paths is unchanged.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "For dense graphs ($m = \\Theta(n^2)$), Floyd–Warshall's $O(n^3)$ is simpler and has comparable speed.",
          "For sparse graphs, Johnson's $O(nm + n^2 \\log n)$ is significantly better than $O(n^3)$.",
          "The reweighting technique appears in other contexts like min-cost flow.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n m + n^2 log n)",
      average: "O(n m + n^2 log n)",
      worst: "O(n m + n^2 log n)",
    },
    space: "O(n^2)",
    worstClass: "n^2",
    note: "With Fibonacci heaps; O(nm log n) with binary heaps.",
  },
  properties: [
    {
      label: "Handles negative weights",
      value: "Yes (no negative cycles)",
    },
    {
      label: "Sparse graph advantage",
      value: "O(nm + n² log n) vs Floyd–Warshall's O(n³)",
    },
    {
      label: "Detects negative cycles",
      value: "Yes, via Bellman–Ford",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "johnson",
      code: `import heapq

def johnson(n, edges):
    """All-pairs shortest paths. edges = [(u, v, w)]. Returns n×n matrix (None = unreachable)."""
    INF = float('inf')
    # Bellman-Ford with virtual source (d[v] = 0 for all v)
    h = [0] * n
    for _ in range(n - 1):
        for u, v, w in edges:
            if h[u] + w < h[v]:
                h[v] = h[u] + w
    for u, v, w in edges:
        if h[u] + w < h[v]:
            return "negative cycle"
    # Reweight
    adj = [[] for _ in range(n)]
    for u, v, w in edges:
        adj[u].append((v, w + h[u] - h[v]))
    # Dijkstra from each vertex
    dist = [[None]*n for _ in range(n)]
    for s in range(n):
        d = [INF] * n
        d[s] = 0
        pq = [(0, s)]
        while pq:
            du, u = heapq.heappop(pq)
            if du > d[u]:
                continue
            for v, w in adj[u]:
                if d[u] + w < d[v]:
                    d[v] = d[u] + w
                    heapq.heappush(pq, (d[v], v))
        for v in range(n):
            if d[v] < INF:
                dist[s][v] = d[v] - h[s] + h[v]
    return dist
`,
      tests: [
        {
          args: [
            3,
            [
              [0, 1, 4],
              [0, 2, 5],
              [1, 2, -2],
            ],
          ],
          expected: [
            [0, 4, 2],
            [null, 0, -2],
            [null, null, 0],
          ],
        },
        {
          args: [
            2,
            [
              [0, 1, 3],
              [1, 0, 2],
            ],
          ],
          expected: [
            [0, 3],
            [2, 0],
          ],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "johnson-why",
      kind: "mcq",
      prompt: "Why does Johnson's algorithm run Bellman–Ford before Dijkstra?",
      options: [
        "To compute potentials that make all edge weights non-negative",
        "To find the shortest path tree",
        "To detect connected components",
        "To sort vertices by distance",
      ],
      answer: 0,
      explanation:
        "Bellman–Ford computes h(v) so that reweighted edges w'(u,v) = w(u,v) + h(u) - h(v) ≥ 0.",
      hints: ["What does Dijkstra require of edge weights?"],
      objective: "Understand the reweighting technique",
    },
  ],
  exam: {
    definition:
      "Johnson's algorithm solves all-pairs shortest paths by reweighting edges with Bellman–Ford potentials to make them non-negative, then running Dijkstra from every vertex.",
    steps: [
      "Add virtual source, run Bellman–Ford to get h(v).",
      "Reweight: w' = w + h(u) - h(v).",
      "Dijkstra from each vertex.",
      "Convert back: δ(u,v) = δ'(u,v) - h(u) + h(v).",
    ],
    timeComplexity: "$O(nm + n^2 \\log n)$",
    spaceComplexity: "$O(n^2)$",
    correctness:
      "Reweighting preserves shortest paths (h terms telescope). Bellman–Ford ensures non-negative reweighted edges.",
    applications: ["All-pairs shortest paths in sparse graphs", "Graphs with negative weights"],
    limitations: ["More complex than Floyd–Warshall", "Not needed for non-negative weight graphs"],
    faq: [
      {
        q: "When to use over Floyd–Warshall?",
        a: "When the graph is sparse: O(nm + n² log n) beats O(n³).",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Reweighting proof (2).",
          "Bellman–Ford + Dijkstra steps (2).",
          "Complexity comparison with Floyd–Warshall (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "D. B. Johnson, 'Efficient algorithms for shortest paths in sparse networks,' Journal of the ACM, 24(1), 1977.",
      supports: "The original algorithm.",
    },
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 3rd ed., MIT Press, 2009, §25.3.",
      supports: "Textbook treatment of Johnson's algorithm.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
