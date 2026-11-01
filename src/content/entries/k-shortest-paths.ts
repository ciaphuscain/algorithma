import type { AlgorithmEntry } from "../types";

export const kShortestPathsEntry: AlgorithmEntry = {
  slug: "k-shortest-paths",
  name: "K Shortest Paths",
  aliases: ["Yen's K shortest paths", "K shortest simple paths"],
  curriculum: [214],
  domain: "graphs",
  subcategory: "Graph Algorithms",
  difficulty: "intermediate",
  summary:
    "Finds the K shortest paths between two vertices by iteratively deviating from previously found paths, using Yen's algorithm for simple paths or Eppstein's for general paths.",
  tags: ["shortest path", "k-best", "Yen", "graph search"],
  prerequisites: ["Dijkstra's Algorithm"],
  related: ["dijkstra", "bellman-ford"],
  problem: {
    input: "A weighted directed graph, source s, target t, and integer K.",
    output: "The K shortest paths from s to t in non-decreasing order of weight.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "After finding the shortest path, the second shortest must deviate from it at some point. Yen's algorithm systematically explores these deviations: for each prefix of a known path, it removes the edge leaving that prefix and finds the shortest completion.",
      },
      {
        kind: "p",
        text: "Candidates are stored in a priority queue. Each new shortest path can generate new candidates by deviating at each of its internal vertices.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Find the shortest path $p_1$ using Dijkstra.",
          "For $k = 2, \\dots, K$: for each vertex $v_i$ on $p_{k-1}$ (except the last), temporarily remove edges from $v_i$ that were used by any previously found path with the same prefix up to $v_i$.",
          "Find the shortest path from $v_i$ to $t$ in the modified graph. The spur path combined with the prefix gives a candidate.",
          "Add all candidates to a priority queue. The next shortest path is the minimum candidate.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example.** Graph: 0→1 (1), 0→2 (2), 1→3 (3), 2→3 (1). Shortest: 0→2→3 (cost 3). For K=2: deviate at 0 — remove edge 0→2, find 0→1→3 (cost 4). Second shortest path is 0→1→3.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Yen's algorithm finds K shortest *simple* paths in $O(Kn(m + n \\log n))$.",
          "Eppstein's algorithm finds K shortest (possibly non-simple) paths in $O(m + n \\log n + K)$.",
          "Use a min-heap for the candidate pool.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Yen's algorithm: K iterations, each running Dijkstra up to n times. Total: $O(Kn(m + n \\log n))$.",
      },
      {
        kind: "p",
        text: "Eppstein's algorithm: precomputation $O(m + n \\log n)$, then $O(\\log n)$ per additional path, total $O(m + n \\log n + K \\log n)$.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "For loopy paths, Eppstein's algorithm is near-optimal.",
          "Applications include route planning (offer alternative routes), network reliability, and speech recognition (N-best list).",
          "Lawler's generalization handles K-best solutions to other optimization problems.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(m + n log n)",
      average: "O(K n (m + n log n))",
      worst: "O(K n (m + n log n))",
    },
    space: "O(K n)",
    worstClass: "other",
    note: "Yen's algorithm for simple paths.",
  },
  properties: [
    {
      label: "Simple paths",
      value: "Yen's algorithm guarantees simple paths",
    },
    {
      label: "Sorted output",
      value: "Paths returned in non-decreasing weight order",
    },
    {
      label: "Optimal",
      value: "Finds exact K shortest paths",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "k_shortest_paths",
      code: `import heapq

def k_shortest_paths(n, edges, s, t, K):
    """Yen's K shortest simple paths. edges = [(u, v, w)].
    Returns list of (cost, path) for up to K paths."""
    adj = [[] for _ in range(n)]
    for u, v, w in edges:
        adj[u].append((v, w))

    def dijkstra(src, dst, removed_edges, removed_nodes):
        INF = float('inf')
        d = [INF] * n
        par = [-1] * n
        d[src] = 0
        pq = [(0, src)]
        while pq:
            du, u = heapq.heappop(pq)
            if du > d[u]:
                continue
            if u == dst:
                break
            for v, w in adj[u]:
                if v in removed_nodes or (u, v) in removed_edges:
                    continue
                if d[u] + w < d[v]:
                    d[v] = d[u] + w
                    par[v] = u
                    heapq.heappush(pq, (d[v], v))
        if d[dst] == INF:
            return None
        path = []
        v = dst
        while v != -1:
            path.append(v)
            v = par[v]
        return (d[dst], path[::-1])

    result = []
    r = dijkstra(s, t, set(), set())
    if r is None:
        return []
    result.append(r)
    candidates = []
    for k in range(1, K):
        prev_path = result[-1][1]
        for i in range(len(prev_path) - 1):
            spur_node = prev_path[i]
            root_path = prev_path[:i+1]
            root_cost = 0
            for j in range(i):
                for v, w in adj[root_path[j]]:
                    if v == root_path[j+1]:
                        root_cost += w
                        break
            removed_edges = set()
            for cost, p in result:
                if p[:i+1] == root_path:
                    removed_edges.add((p[i], p[i+1]))
            removed_nodes = set(root_path[:-1])
            spur = dijkstra(spur_node, t, removed_edges, removed_nodes)
            if spur is not None:
                total = root_cost + spur[0]
                full_path = root_path[:-1] + spur[1]
                heapq.heappush(candidates, (total, full_path))
        if not candidates:
            break
        while candidates:
            c = heapq.heappop(candidates)
            if c not in result:
                result.append(c)
                break
        else:
            break
    return result
`,
      tests: [
        {
          args: [
            4,
            [
              [0, 1, 1],
              [0, 2, 2],
              [1, 3, 3],
              [2, 3, 1],
            ],
            0,
            3,
            2,
          ],
          expected: [
            [3, [0, 2, 3]],
            [4, [0, 1, 3]],
          ],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "ksp-deviation",
      kind: "mcq",
      prompt: "How does Yen's algorithm find the k-th shortest path?",
      options: [
        "By systematically deviating from previously found paths at each internal vertex",
        "By running Dijkstra K times",
        "By removing the shortest path and repeating",
        "By using dynamic programming",
      ],
      answer: 0,
      explanation:
        "Yen's generates candidates by deviating at each vertex of previously found paths.",
      hints: ["How are new candidate paths generated?"],
      objective: "Understand Yen's deviation approach",
    },
  ],
  exam: {
    definition:
      "Finds K shortest simple paths by iteratively deviating from known paths at each internal vertex and maintaining a candidate priority queue.",
    steps: [
      "Find shortest path.",
      "For each known path, deviate at each internal vertex.",
      "Add candidates to heap.",
      "Extract minimum for next shortest path.",
    ],
    timeComplexity: "$O(Kn(m + n \\log n))$",
    spaceComplexity: "$O(Kn)$",
    correctness:
      "Each possible simple path is considered as a deviation from some shorter path; the heap ensures non-decreasing order.",
    applications: [
      "Route planning alternatives",
      "Network reliability",
      "Speech recognition N-best",
    ],
    limitations: ["Cubic complexity for large K", "Only simple paths (Eppstein for general)"],
    faq: [
      {
        q: "When to use Eppstein instead?",
        a: "When non-simple paths are acceptable; Eppstein runs in O(m + n log n + K).",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Deviation strategy and candidate heap (1). Complexity (1)."],
      },
    ],
  },
  references: [
    {
      citation:
        "J. Y. Yen, 'Finding the K shortest loopless paths in a network,' Management Science, 17(11), 1971.",
      supports: "Yen's K shortest simple paths algorithm.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
