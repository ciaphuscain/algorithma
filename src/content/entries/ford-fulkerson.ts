import type { AlgorithmEntry } from "../types";

export const fordFulkersonEntry: AlgorithmEntry = {
  slug: "ford-fulkerson",
  name: "Ford-Fulkerson",
  aliases: ["Ford-Fulkerson"],
  curriculum: [233],
  domain: "graphs",
  subcategory: "Network Flow",
  difficulty: "intermediate",
  summary:
    "Computes maximum flow in a network by repeatedly finding augmenting paths from source to sink in the residual graph and pushing flow along them.",
  tags: ["max flow", "augmenting path", "residual graph", "network flow", "graph"],
  prerequisites: ["BFS", "DFS"],
  related: ["edmonds-karp", "dinic"],
  problem: {
    input: "A directed graph with n vertices, edges with capacities, a source s and a sink t.",
    output: "The maximum flow from s to t.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Imagine pipes with limited capacity. Ford-Fulkerson finds how much water can flow from source to sink by repeatedly finding a path with available capacity and pushing flow through it. The residual graph tracks remaining capacity and allows undoing flow.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Initialize all flows to 0. Build the residual graph.",
          "Find any path from s to t in the residual graph (DFS).",
          "Determine the bottleneck (minimum residual capacity on the path).",
          "Push that much flow: decrease forward residual, increase backward residual.",
          "Repeat until no s→t path exists. Total flow is maximum.",
        ],
      },
      {
        kind: "table",
        head: ["Step", "Path", "Bottleneck", "Total"],
        rows: [
          ["1", "s→a→t", "6", "6"],
          ["2", "s→b→t", "10", "16"],
          ["3", "s→a→b→t", "2", "18"],
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Use an adjacency matrix or adjacency list with reverse edge pointers. DFS finds augmenting paths; BFS gives Edmonds-Karp.",
      },
      {
        kind: "callout",
        tone: "warn",
        text: "With DFS, the algorithm may not terminate for irrational capacities. Use BFS (Edmonds-Karp) for guaranteed polynomial time.",
        title: "Termination",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Max-flow min-cut theorem:** max flow = min cut capacity. When no augmenting path exists, vertices reachable from s in the residual graph form the min-cut.",
      },
      {
        kind: "p",
        text: "Time: $O(E \\cdot f^*)$ where $f^*$ is the max flow value (pseudo-polynomial). Each path takes $O(E)$.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Edmonds-Karp (BFS) guarantees $O(VE^2)$.",
          "Dinic's algorithm uses layered graphs for $O(V^2 E)$.",
          "Applications: bipartite matching, image segmentation, baseball elimination.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(E)",
      average: "O(E * f)",
      worst: "O(E * f)",
    },
    space: "O(V + E)",
    worstClass: "other",
  },
  properties: [
    {
      label: "Path strategy",
      value: "DFS (BFS gives Edmonds-Karp)",
    },
    {
      label: "Terminates",
      value: "Always for integer capacities",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "ford_fulkerson",
      code: `def ford_fulkerson(n, edges, s, t):
    cap = [[0]*n for _ in range(n)]
    for u, v, c in edges:
        cap[u][v] += c
    def dfs(u, pushed, visited):
        if u == t:
            return pushed
        visited[u] = True
        for v in range(n):
            if not visited[v] and cap[u][v] > 0:
                d = dfs(v, min(pushed, cap[u][v]), visited)
                if d > 0:
                    cap[u][v] -= d
                    cap[v][u] += d
                    return d
        return 0
    flow = 0
    while True:
        d = dfs(s, float('inf'), [False]*n)
        if d == 0:
            break
        flow += d
    return flow
`,
      tests: [
        {
          args: [
            4,
            [
              [0, 1, 10],
              [0, 2, 10],
              [1, 2, 2],
              [1, 3, 6],
              [2, 3, 10],
            ],
            0,
            3,
          ],
          expected: 18,
        },
        {
          args: [2, [[0, 1, 5]], 0, 1],
          expected: 5,
        },
      ],
    },
    {
      language: "javascript",
      entry: "fordFulkerson",
      code: `function fordFulkerson(n, edges, s, t) {
  const cap = Array.from({length: n}, () => new Array(n).fill(0));
  for (const [u, v, c] of edges) cap[u][v] += c;
  function dfs(u, pushed, visited) {
    if (u === t) return pushed;
    visited[u] = true;
    for (let v = 0; v < n; v++) {
      if (!visited[v] && cap[u][v] > 0) {
        const d = dfs(v, Math.min(pushed, cap[u][v]), visited);
        if (d > 0) { cap[u][v] -= d; cap[v][u] += d; return d; }
      }
    }
    return 0;
  }
  let flow = 0;
  while (true) {
    const d = dfs(s, Infinity, new Array(n).fill(false));
    if (d === 0) break;
    flow += d;
  }
  return flow;
}
`,
      tests: [
        {
          args: [
            4,
            [
              [0, 1, 10],
              [0, 2, 10],
              [1, 2, 2],
              [1, 3, 6],
              [2, 3, 10],
            ],
            0,
            3,
          ],
          expected: 18,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "ford-fulkerson-q1",
      kind: "mcq",
      prompt: "What does the residual graph represent?",
      options: [
        "Remaining capacity and ability to undo flow on each edge",
        "The original graph with used capacity removed",
        "Only edges that have flow",
        "The minimum spanning tree",
      ],
      answer: 0,
      explanation:
        "The residual graph has forward edges (remaining capacity) and backward edges (flow that can be reversed).",
      hints: ["Think about what the backward edge allows."],
      objective: "Residual graph",
    },
  ],
  exam: {
    definition:
      "Ford-Fulkerson computes maximum flow by finding augmenting paths in the residual graph until none remain.",
    steps: [
      "Initialize all flows to 0.",
      "Find augmenting path (DFS/BFS).",
      "Push bottleneck flow.",
      "Repeat until no path exists.",
    ],
    timeComplexity: "$O(E \\cdot f^*)$ where $f^*$ is the max flow.",
    spaceComplexity: "$O(V^2)$ for the capacity matrix.",
    correctness:
      "By the max-flow min-cut theorem, when no augmenting path exists, the flow equals the minimum cut.",
    applications: ["network routing", "bipartite matching", "image segmentation"],
    limitations: ["Pseudo-polynomial with DFS; may not terminate with irrational capacities"],
    faq: [
      {
        q: "Why backward edges?",
        a: "They let the algorithm undo suboptimal flow decisions to find the global optimum.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define residual graph (1).",
          "Augmenting path algorithm (2).",
          "Max-flow min-cut theorem (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "L. R. Ford and D. R. Fulkerson, 'Maximal Flow Through a Network', Canadian J. Math., 1956.",
      supports: "Original paper.",
    },
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "Chapter 26: Maximum Flow.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
