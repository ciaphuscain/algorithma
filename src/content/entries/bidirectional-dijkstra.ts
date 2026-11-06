import type { AlgorithmEntry } from "../types";

export const bidirectionalDijkstraEntry: AlgorithmEntry = {
  slug: "bidirectional-dijkstra",
  name: "Bidirectional Dijkstra",
  aliases: ["Bidirectional Dijkstra"],
  curriculum: [212],
  domain: "graphs",
  subcategory: "Shortest Paths",
  difficulty: "intermediate",
  summary:
    "Runs Dijkstra's algorithm simultaneously from source and target, meeting in the middle to reduce the explored space in practice.",
  tags: ["shortest path", "Dijkstra", "bidirectional", "graph"],
  prerequisites: ["Dijkstra"],
  related: ["dijkstra", "bidirectional-bfs"],
  problem: {
    input:
      "A weighted graph with n vertices, edges with non-negative weights, source s and target t.",
    output: "The shortest distance from s to t, or -1 if unreachable.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Two Dijkstra searches expand from s and t. When a vertex is settled by both, we can compute the answer. The correct termination condition checks that no shorter path can exist through unsettled vertices.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Run two min-heaps: one from s (forward), one from t (backward).",
          "Alternately extract the minimum from the smaller heap.",
          "When a vertex settled by one side is reached by the other, record the total distance.",
          "Stop when the sum of the two minimum heap keys ≥ best known distance.",
          "Return the best distance found.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Use two priority queues and two distance arrays. Track the best path length `mu` seen so far through any vertex settled by both sides.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Worst case is the same as Dijkstra: $O((V + E) \\log V)$. In practice, the explored region is much smaller, especially in road networks and social graphs.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "The termination condition is crucial: stopping when frontiers meet is wrong — a shorter path through unsettled vertices may exist.",
          "ALT (A*, Landmarks, Triangle inequality) further speeds up point-to-point queries.",
          "Used in production route planners (Google Maps, OSRM).",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(E log V)",
      average: "O(E log V)",
      worst: "O((V + E) log V)",
    },
    space: "O(V + E)",
    worstClass: "n + m",
  },
  properties: [
    {
      label: "Weight constraint",
      value: "Non-negative",
    },
    {
      label: "Practical speedup",
      value: "Often 2-10x over unidirectional",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "bidirectional_dijkstra",
      code: `def bidirectional_dijkstra(n, edges, s, t):
    import heapq
    if s == t: return 0
    adj_f = [[] for _ in range(n)]
    adj_b = [[] for _ in range(n)]
    for u, v, w in edges:
        adj_f[u].append((v, w))
        adj_b[v].append((u, w))
        adj_f[v].append((u, w))
        adj_b[u].append((v, w))
    INF = float('inf')
    df = [INF]*n; db = [INF]*n
    df[s] = 0; db[t] = 0
    hf = [(0, s)]; hb = [(0, t)]
    sf = [False]*n; sb = [False]*n
    mu = INF
    while hf and hb:
        d_min = min(hf[0][0], hb[0][0])
        if d_min >= mu: break
        if hf[0][0] <= hb[0][0]:
            d, u = heapq.heappop(hf)
            if sf[u]: continue
            sf[u] = True
            if sb[u]: mu = min(mu, df[u] + db[u])
            for v, w in adj_f[u]:
                if d + w < df[v]:
                    df[v] = d + w
                    heapq.heappush(hf, (df[v], v))
                    if sb[v]: mu = min(mu, df[v] + db[v])
        else:
            d, u = heapq.heappop(hb)
            if sb[u]: continue
            sb[u] = True
            if sf[u]: mu = min(mu, df[u] + db[u])
            for v, w in adj_b[u]:
                if d + w < db[v]:
                    db[v] = d + w
                    heapq.heappush(hb, (db[v], v))
                    if sf[v]: mu = min(mu, df[v] + db[v])
    return mu if mu < INF else -1
`,
      tests: [
        {
          args: [
            4,
            [
              [0, 1, 1],
              [1, 2, 2],
              [0, 2, 4],
              [2, 3, 1],
            ],
            0,
            3,
          ],
          expected: 4,
        },
        {
          args: [3, [[0, 1, 5]], 0, 2],
          expected: -1,
        },
      ],
    },
    {
      language: "javascript",
      entry: "bidirectionalDijkstra",
      code: `function bidirectionalDijkstra(n, edges, s, t) {
  if (s === t) return 0;
  const adjF = Array.from({length: n}, () => []);
  const adjB = Array.from({length: n}, () => []);
  for (const [u, v, w] of edges) {
    adjF[u].push([v, w]); adjF[v].push([u, w]);
    adjB[v].push([u, w]); adjB[u].push([v, w]);
  }
  const df = new Array(n).fill(Infinity), db = new Array(n).fill(Infinity);
  df[s] = 0; db[t] = 0;
  const sf = new Array(n).fill(false), sb = new Array(n).fill(false);
  const hf = [[0, s]], hb = [[0, t]];
  let mu = Infinity;
  function pop(h) {
    const top = h[0]; h[0] = h[h.length-1]; h.pop();
    let i=0;
    while (true) {
      let s=i, l=2*i+1, r=2*i+2;
      if (l<h.length && h[l][0]<h[s][0]) s=l;
      if (r<h.length && h[r][0]<h[s][0]) s=r;
      if (s===i) break;
      [h[i],h[s]]=[h[s],h[i]]; i=s;
    }
    return top;
  }
  function push(h, v) {
    h.push(v); let i=h.length-1;
    while (i>0) {
      const p=Math.floor((i-1)/2);
      if (h[p][0]<=h[i][0]) break;
      [h[p],h[i]]=[h[i],h[p]]; i=p;
    }
  }
  while (hf.length && hb.length) {
    if (Math.min(hf[0][0], hb[0][0]) >= mu) break;
    if (hf[0][0] <= hb[0][0]) {
      const [d, u] = pop(hf);
      if (sf[u]) continue; sf[u] = true;
      if (sb[u]) mu = Math.min(mu, df[u]+db[u]);
      for (const [v, w] of adjF[u]) {
        if (d+w < df[v]) { df[v]=d+w; push(hf,[df[v],v]); if (sb[v]) mu=Math.min(mu,df[v]+db[v]); }
      }
    } else {
      const [d, u] = pop(hb);
      if (sb[u]) continue; sb[u] = true;
      if (sf[u]) mu = Math.min(mu, df[u]+db[u]);
      for (const [v, w] of adjB[u]) {
        if (d+w < db[v]) { db[v]=d+w; push(hb,[db[v],v]); if (sf[v]) mu=Math.min(mu,df[v]+db[v]); }
      }
    }
  }
  return mu === Infinity ? -1 : mu;
}
`,
      tests: [
        {
          args: [
            4,
            [
              [0, 1, 1],
              [1, 2, 2],
              [0, 2, 4],
              [2, 3, 1],
            ],
            0,
            3,
          ],
          expected: 4,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "bidirectional-dijkstra-q1",
      kind: "mcq",
      prompt: "What is the correct termination condition for bidirectional Dijkstra?",
      options: [
        "When the sum of both heap minimums ≥ best path found",
        "When the frontiers first meet",
        "When one heap is empty",
        "After V iterations",
      ],
      answer: 0,
      explanation:
        "Stopping when frontiers first meet may miss shorter paths through unsettled vertices. We stop when no unsettled vertex can improve the best known path.",
      hints: ["Think about paths through vertices not yet settled."],
      objective: "Termination",
    },
  ],
  exam: {
    definition:
      "Bidirectional Dijkstra runs two Dijkstra instances from source and target, stopping when no unsettled vertex can improve the best known path.",
    steps: [
      "Run two heaps from s and t.",
      "Alternate expanding the smaller heap.",
      "Track best distance through settled vertices.",
      "Stop when heap minimums sum ≥ best.",
    ],
    timeComplexity: "$O((V + E) \\log V)$ worst case.",
    spaceComplexity: "$O(V + E)$.",
    correctness:
      "The termination condition ensures all potentially shorter paths have been explored.",
    applications: ["route planning", "point-to-point queries"],
    limitations: ["Complex termination logic", "Same worst case as unidirectional"],
    faq: [
      {
        q: "Why not stop when frontiers meet?",
        a: "A shorter path may go through a vertex not yet settled by either side.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Two-frontier Dijkstra (2).",
          "Termination condition proof (2).",
          "Practical speedup analysis (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "Bidirectional search exercises.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
