import type { AlgorithmEntry } from "../types";

export const spfaShortestPathFasterAlgorithmEntry: AlgorithmEntry = {
  slug: "spfa-shortest-path-faster-algorithm",
  name: "SPFA (Shortest Path Faster Algorithm)",
  aliases: ["SPFA (Shortest Path Faster Algorithm)"],
  curriculum: [250],
  domain: "graphs",
  subcategory: "Shortest Paths",
  difficulty: "intermediate",
  summary:
    "A queue-based optimization of Bellman-Ford that only relaxes edges from vertices whose distance recently improved, often running much faster in practice though retaining O(VE) worst case.",
  tags: ["shortest path", "SPFA", "Bellman-Ford", "queue", "graph"],
  prerequisites: ["Bellman-Ford"],
  related: ["bellman-ford", "dijkstra"],
  problem: {
    input: "A directed graph with n vertices, weighted edges (possibly negative), and a source s.",
    output: "Shortest distances from s to all vertices, or detection of a negative cycle.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Bellman-Ford relaxes every edge in every round. SPFA maintains a queue of vertices whose distances just improved — only their outgoing edges need relaxing. This skips many unnecessary relaxations.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Set dist[s] = 0, all others ∞. Enqueue s.",
          "While queue is non-empty: dequeue u. For each edge u→v with weight w: if dist[u] + w < dist[v], update dist[v] and enqueue v if not already in queue.",
          "To detect negative cycles: if any vertex is enqueued more than V times, a negative cycle exists.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Use an `in_queue` array to avoid duplicate enqueues. Track enqueue counts per vertex for negative cycle detection.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Worst case is still $O(VE)$ (same as Bellman-Ford), achieved by adversarial graphs. Average case on random graphs is often close to $O(E)$.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "SPFA with SLF (shortest label first) and LLL (large label last) heuristics further improves practical performance.",
          "Can be used for min-cost flow (successive shortest paths).",
          "Not recommended for competitive programming where adversarial inputs can trigger worst case.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(E)",
      average: "O(E)",
      worst: "O(V * E)",
    },
    space: "O(V + E)",
    worstClass: "n + m",
  },
  properties: [
    {
      label: "Negative weights",
      value: "Allowed",
    },
    {
      label: "Negative cycles",
      value: "Detected via enqueue count",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "spfa",
      code: `def spfa(n, edges, s):
    from collections import deque
    adj = [[] for _ in range(n)]
    for u, v, w in edges:
        adj[u].append((v, w))
    INF = float('inf')
    dist = [INF] * n
    dist[s] = 0
    in_queue = [False] * n
    in_queue[s] = True
    q = deque([s])
    count = [0] * n
    count[s] = 1
    while q:
        u = q.popleft()
        in_queue[u] = False
        for v, w in adj[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                if not in_queue[v]:
                    in_queue[v] = True
                    q.append(v)
                    count[v] += 1
                    if count[v] >= n:
                        return "negative cycle"
    return [None if d == INF else d for d in dist]
`,
      tests: [
        {
          args: [
            5,
            [
              [0, 1, 4],
              [0, 2, 5],
              [1, 3, -2],
              [2, 1, -3],
              [2, 3, 4],
              [3, 4, 3],
              [2, 4, 7],
            ],
            0,
          ],
          expected: [0, 2, 5, 0, 3],
        },
        {
          args: [2, [[0, 1, 3]], 0],
          expected: [0, 3],
        },
      ],
    },
    {
      language: "javascript",
      entry: "spfa",
      code: `function spfa(n, edges, s) {
  const adj = Array.from({length: n}, () => []);
  for (const [u, v, w] of edges) adj[u].push([v, w]);
  const dist = new Array(n).fill(Infinity);
  dist[s] = 0;
  const inQueue = new Array(n).fill(false);
  inQueue[s] = true;
  const q = [s];
  let qi = 0;
  const count = new Array(n).fill(0);
  count[s] = 1;
  while (qi < q.length) {
    const u = q[qi++];
    inQueue[u] = false;
    for (const [v, w] of adj[u]) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        if (!inQueue[v]) {
          inQueue[v] = true;
          q.push(v);
          count[v]++;
          if (count[v] >= n) return "negative cycle";
        }
      }
    }
  }
  return dist.map(d => d === Infinity ? null : d);
}
`,
      tests: [
        {
          args: [
            5,
            [
              [0, 1, 4],
              [0, 2, 5],
              [1, 3, -2],
              [2, 1, -3],
              [2, 3, 4],
              [3, 4, 3],
              [2, 4, 7],
            ],
            0,
          ],
          expected: [0, 2, 5, 0, 3],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "spfa-q1",
      kind: "mcq",
      prompt: "How does SPFA improve on Bellman-Ford?",
      options: [
        "It only relaxes edges from vertices whose distance recently improved",
        "It uses a different relaxation formula",
        "It avoids negative weights",
        "It uses a priority queue",
      ],
      answer: 0,
      explanation:
        "SPFA enqueues only vertices that improved, avoiding the full edge scan of each Bellman-Ford round.",
      hints: ["Think about which vertices actually need their edges re-relaxed."],
      objective: "Optimization",
    },
  ],
  exam: {
    definition:
      "SPFA is a queue-based Bellman-Ford optimization that relaxes edges only from recently improved vertices.",
    steps: [
      "Enqueue source.",
      "Dequeue u, relax outgoing edges, enqueue improved vertices.",
      "Detect negative cycles via enqueue count.",
    ],
    timeComplexity: "$O(VE)$ worst case, often $O(E)$ in practice.",
    spaceComplexity: "$O(V + E)$.",
    correctness:
      "Same as Bellman-Ford: distances converge after at most V-1 rounds of improvements.",
    applications: ["shortest paths with negative weights", "min-cost flow"],
    limitations: ["O(VE) worst case on adversarial graphs"],
    faq: [
      {
        q: "Is SPFA always faster than Bellman-Ford?",
        a: "In practice often yes, but adversarial graphs can force O(VE) behaviour.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Describe queue-based relaxation (2).",
          "Compare with Bellman-Ford (1).",
          "Analyze time complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "Exercise on SPFA variant of Bellman-Ford.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
