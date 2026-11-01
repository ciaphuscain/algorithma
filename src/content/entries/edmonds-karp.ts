import type { AlgorithmEntry } from "../types";

export const edmondsKarpEntry: AlgorithmEntry = {
  slug: "edmonds-karp",
  name: "Edmonds-Karp",
  aliases: ["Edmonds-Karp"],
  curriculum: [234],
  domain: "graphs",
  subcategory: "Network Flow",
  difficulty: "intermediate",
  summary:
    "A BFS-based implementation of Ford-Fulkerson that always uses shortest augmenting paths, guaranteeing O(VE²) worst-case time.",
  tags: ["max flow", "BFS", "augmenting path", "network flow", "graph"],
  prerequisites: ["BFS", "Ford-Fulkerson"],
  related: ["ford-fulkerson", "dinic"],
  problem: {
    input: "A directed graph with n vertices, edges with capacities, a source s and a sink t.",
    output: "The maximum flow from s to t.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Edmonds-Karp is Ford-Fulkerson with one rule: always use BFS to find the shortest augmenting path. This ensures the shortest-path distance never decreases, bounding augmentations to O(VE).",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Build the residual graph as a capacity matrix.",
          "BFS from s to t in the residual graph.",
          "Trace the BFS path back to find the bottleneck.",
          "Push bottleneck flow, updating residual capacities.",
          "Repeat until BFS cannot reach t.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "BFS returns a parent array. Trace from t to s to find the path and its bottleneck. Update the capacity matrix along the path.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "After each augmentation, the BFS distance from s to any vertex does not decrease. Each edge becomes critical (bottleneck) at most $O(V)$ times, giving $O(VE)$ total augmentations, each costing $O(E)$: total $O(VE^2)$.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Strictly polynomial, unlike DFS-based Ford-Fulkerson.",
          "Dinic's algorithm improves to $O(V^2 E)$ with blocking flows.",
          "For unit-capacity graphs, runs in $O(E\\sqrt{V})$.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(E)",
      average: "O(V * E^2)",
      worst: "O(V * E^2)",
    },
    space: "O(V^2)",
    worstClass: "other",
  },
  properties: [
    {
      label: "Path strategy",
      value: "BFS (shortest augmenting path)",
    },
    {
      label: "Polynomial",
      value: "Yes, always",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "edmonds_karp",
      code: `def edmonds_karp(n, edges, s, t):
    from collections import deque
    cap = [[0]*n for _ in range(n)]
    for u, v, c in edges:
        cap[u][v] += c
    flow = 0
    while True:
        parent = [-1]*n
        parent[s] = s
        q = deque([s])
        while q and parent[t] == -1:
            u = q.popleft()
            for v in range(n):
                if parent[v] == -1 and cap[u][v] > 0:
                    parent[v] = u
                    q.append(v)
        if parent[t] == -1:
            break
        aug = float('inf')
        v = t
        while v != s:
            u = parent[v]
            aug = min(aug, cap[u][v])
            v = u
        v = t
        while v != s:
            u = parent[v]
            cap[u][v] -= aug
            cap[v][u] += aug
            v = u
        flow += aug
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
          args: [2, [[0, 1, 7]], 0, 1],
          expected: 7,
        },
      ],
    },
    {
      language: "javascript",
      entry: "edmondsKarp",
      code: `function edmondsKarp(n, edges, s, t) {
  const cap = Array.from({length: n}, () => new Array(n).fill(0));
  for (const [u, v, c] of edges) cap[u][v] += c;
  let flow = 0;
  while (true) {
    const parent = new Array(n).fill(-1);
    parent[s] = s;
    const q = [s];
    let qi = 0;
    while (qi < q.length && parent[t] === -1) {
      const u = q[qi++];
      for (let v = 0; v < n; v++) {
        if (parent[v] === -1 && cap[u][v] > 0) { parent[v] = u; q.push(v); }
      }
    }
    if (parent[t] === -1) break;
    let aug = Infinity;
    for (let v = t; v !== s; v = parent[v]) aug = Math.min(aug, cap[parent[v]][v]);
    for (let v = t; v !== s; v = parent[v]) { cap[parent[v]][v] -= aug; cap[v][parent[v]] += aug; }
    flow += aug;
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
      id: "edmonds-karp-q1",
      kind: "mcq",
      prompt: "Why does Edmonds-Karp use BFS instead of DFS?",
      options: [
        "BFS ensures shortest augmenting paths, giving polynomial time",
        "BFS is always faster than DFS",
        "DFS cannot find augmenting paths",
        "BFS uses less memory",
      ],
      answer: 0,
      explanation:
        "Shortest augmenting paths ensure the distance to any vertex never decreases, bounding the number of augmentations.",
      hints: ["Think about the monotonicity property of BFS distances."],
      objective: "BFS advantage",
    },
  ],
  exam: {
    definition:
      "Edmonds-Karp uses BFS for augmenting paths in Ford-Fulkerson, guaranteeing O(VE²) time.",
    steps: [
      "BFS to find shortest s→t path.",
      "Push bottleneck flow.",
      "Repeat until no path exists.",
    ],
    timeComplexity: "$O(VE^2)$.",
    spaceComplexity: "$O(V^2)$.",
    correctness: "BFS distance monotonicity bounds augmentations to O(VE); each costs O(E).",
    applications: ["maximum flow", "bipartite matching"],
    limitations: ["Slower than Dinic's O(V²E)"],
    faq: [
      {
        q: "How many augmentations at most?",
        a: "O(VE), since each edge is critical at most O(V) times.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Describe BFS augmentation loop (2).",
          "Prove O(VE) augmentation bound (2).",
          "Total time analysis (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "J. Edmonds and R. M. Karp, 'Theoretical Improvements in Algorithmic Efficiency for Network Flow Problems', JACM, 1972.",
      supports: "Original paper.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
