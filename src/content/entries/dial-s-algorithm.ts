import type { AlgorithmEntry } from "../types";

export const dialSAlgorithmEntry: AlgorithmEntry = {
  slug: "dial-s-algorithm",
  name: "Dial's Algorithm",
  aliases: ["Dial's Algorithm"],
  curriculum: [215],
  domain: "graphs",
  subcategory: "Shortest Paths",
  difficulty: "intermediate",
  summary:
    "A specialization of Dijkstra's algorithm for graphs with small non-negative integer edge weights, using bucket queues to achieve O(V + E + W) time where W is the maximum weight.",
  tags: ["shortest path", "Dijkstra", "bucket queue", "graph"],
  prerequisites: ["Dijkstra"],
  related: ["dijkstra", "bfs"],
  problem: {
    input: "A graph with n vertices, non-negative integer-weighted edges, and a source s.",
    output: "Shortest distances from s to all vertices.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "When edge weights are small integers, we can replace Dijkstra's priority queue with an array of buckets indexed by distance. Processing buckets in order gives the same result without the log-factor overhead of a heap.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Create W*V + 1 buckets (or use circular buckets of size W+1).",
          "Place s in bucket 0.",
          "Process the smallest non-empty bucket: for each vertex u in it, relax edges and move neighbours to their new-distance buckets.",
          "Continue until all reachable vertices are processed.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Use circular buckets of size W+1 to save memory. Since distances increase monotonically, we process each bucket index at most V times before wrapping around.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "$O(V + E + W)$ time: scanning buckets costs $O(V + W)$, edge relaxation costs $O(E)$. Space $O(V + W)$ for the buckets.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Radix heaps generalize this idea to larger weight ranges.",
          "For unit weights, Dial's reduces to BFS.",
          "Useful in network routing where link costs are small integers.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(V + E)",
      average: "O(V + E + W)",
      worst: "O(V + E + W)",
    },
    space: "O(V + W)",
    worstClass: "n + m",
  },
  properties: [
    {
      label: "Weight constraint",
      value: "Non-negative integers",
    },
    {
      label: "Advantage over Dijkstra",
      value: "No log factor when W is small",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "dial",
      code: `def dial(n, edges, s):
    adj = [[] for _ in range(n)]
    max_w = 0
    for u, v, w in edges:
        adj[u].append((v, w))
        adj[v].append((u, w))
        max_w = max(max_w, w)
    INF = float('inf')
    dist = [INF] * n
    dist[s] = 0
    max_dist = max_w * n
    buckets = [[] for _ in range(max_dist + 1)]
    buckets[0].append(s)
    for d in range(max_dist + 1):
        for u in buckets[d]:
            if dist[u] != d:
                continue
            for v, w in adj[u]:
                nd = d + w
                if nd < dist[v]:
                    dist[v] = nd
                    buckets[nd].append(v)
    return [None if d == INF else d for d in dist]
`,
      tests: [
        {
          args: [
            4,
            [
              [0, 1, 2],
              [0, 2, 4],
              [1, 2, 1],
              [1, 3, 7],
              [2, 3, 3],
            ],
            0,
          ],
          expected: [0, 2, 3, 6],
        },
        {
          args: [2, [[0, 1, 1]], 0],
          expected: [0, 1],
        },
      ],
    },
    {
      language: "javascript",
      entry: "dial",
      code: `function dial(n, edges, s) {
  const adj = Array.from({length: n}, () => []);
  let maxW = 0;
  for (const [u, v, w] of edges) {
    adj[u].push([v, w]); adj[v].push([u, w]);
    maxW = Math.max(maxW, w);
  }
  const dist = new Array(n).fill(Infinity);
  dist[s] = 0;
  const maxDist = maxW * n;
  const buckets = Array.from({length: maxDist + 1}, () => []);
  buckets[0].push(s);
  for (let d = 0; d <= maxDist; d++) {
    for (const u of buckets[d]) {
      if (dist[u] !== d) continue;
      for (const [v, w] of adj[u]) {
        const nd = d + w;
        if (nd < dist[v]) { dist[v] = nd; buckets[nd].push(v); }
      }
    }
  }
  return dist.map(d => d === Infinity ? null : d);
}
`,
      tests: [
        {
          args: [
            4,
            [
              [0, 1, 2],
              [0, 2, 4],
              [1, 2, 1],
              [1, 3, 7],
              [2, 3, 3],
            ],
            0,
          ],
          expected: [0, 2, 3, 6],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "dial-q1",
      kind: "mcq",
      prompt: "When is Dial's algorithm preferred over Dijkstra with a heap?",
      options: [
        "When edge weights are small non-negative integers",
        "When the graph is dense",
        "When edges have negative weights",
        "Always",
      ],
      answer: 0,
      explanation:
        "Dial's uses bucket queues that are efficient only when the weight range W is small, avoiding the O(log V) heap operations.",
      hints: ["Consider what the bucket array size depends on."],
      objective: "When to use",
    },
  ],
  exam: {
    definition:
      "Dial's algorithm is Dijkstra with bucket queues for small integer weights, achieving O(V + E + W) time.",
    steps: [
      "Create W+1 buckets.",
      "Place source in bucket 0.",
      "Process buckets in order, relaxing edges.",
      "Move improved vertices to new buckets.",
    ],
    timeComplexity: "$O(V + E + W)$ where W is the maximum edge weight.",
    spaceComplexity: "$O(V + W)$.",
    correctness: "Same as Dijkstra: processes vertices in non-decreasing distance order.",
    applications: ["network routing with small link costs", "BFS generalization"],
    limitations: ["Impractical when W is large"],
    faq: [
      {
        q: "How does this relate to BFS?",
        a: "For unit weights (W=1), Dial's algorithm reduces exactly to BFS.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Describe bucket queue structure (2).",
          "Prove same correctness as Dijkstra (1).",
          "Analyze O(V+E+W) time (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "R. B. Dial, 'Algorithm 360: Shortest-Path Forest with Topological Ordering', CACM, 1969.",
      supports: "Original paper.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
