import type { AlgorithmEntry } from "../types";

export const bidirectionalBfsEntry: AlgorithmEntry = {
  slug: "bidirectional-bfs",
  name: "Bidirectional BFS",
  aliases: ["Bidirectional BFS"],
  curriculum: [205],
  domain: "graphs",
  subcategory: "Shortest Paths",
  difficulty: "intermediate",
  summary:
    "Finds the shortest path between two vertices by running BFS simultaneously from both the source and target, meeting in the middle for a quadratic speedup in the explored space.",
  tags: ["BFS", "bidirectional", "shortest path", "graph"],
  prerequisites: ["BFS"],
  related: ["bfs", "bidirectional-dijkstra"],
  problem: {
    input: "An unweighted graph with n vertices, a list of edges, a source s and a target t.",
    output: "The shortest distance from s to t, or -1 if unreachable.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Standard BFS from s explores a 'sphere' of radius d. Bidirectional BFS runs two BFS instances — one from s and one from t — expanding the smaller frontier each step. They meet when the spheres touch, having explored roughly $O(b^{d/2})$ vertices instead of $O(b^d)$, where b is the branching factor.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Initialize two queues: one from s, one from t. Maintain two distance maps.",
          "Alternately expand the smaller frontier by one BFS layer.",
          "After each expansion, check if any newly reached vertex was already reached by the other BFS.",
          "If so, the shortest path length is the sum of the two distances.",
          "If both queues empty without meeting, s and t are disconnected.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Use two dictionaries for visited vertices and their distances. Expand the side with fewer frontier vertices to balance work.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "In a graph with branching factor $b$, standard BFS explores $O(b^d)$ vertices. Bidirectional BFS explores $O(b^{d/2})$ from each side, totaling $O(2 \\cdot b^{d/2})$ — much smaller when $b > 1$.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Works only for unweighted graphs or when heuristics guide the search (bidirectional Dijkstra/A*).",
          "For weighted graphs, use bidirectional Dijkstra with careful termination conditions.",
          "In practice, the speedup depends on the graph structure; high-degree hub vertices can reduce the benefit.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(1)",
      average: "O(b^(d/2))",
      worst: "O(V + E)",
    },
    space: "O(V)",
    worstClass: "other",
  },
  properties: [
    {
      label: "Graph type",
      value: "Unweighted",
    },
    {
      label: "Speedup",
      value: "Quadratic in explored vertices compared to BFS",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "bidirectional_bfs",
      code: `def bidirectional_bfs(n, edges, s, t):
    if s == t:
        return 0
    adj = [[] for _ in range(n)]
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)
    dist_s = {s: 0}
    dist_t = {t: 0}
    front_s = [s]
    front_t = [t]
    while front_s and front_t:
        if len(front_s) <= len(front_t):
            nxt = []
            for u in front_s:
                for v in adj[u]:
                    if v not in dist_s:
                        dist_s[v] = dist_s[u] + 1
                        nxt.append(v)
                        if v in dist_t:
                            return dist_s[v] + dist_t[v]
            front_s = nxt
        else:
            nxt = []
            for u in front_t:
                for v in adj[u]:
                    if v not in dist_t:
                        dist_t[v] = dist_t[u] + 1
                        nxt.append(v)
                        if v in dist_s:
                            return dist_s[v] + dist_t[v]
            front_t = nxt
    return -1
`,
      tests: [
        {
          args: [
            5,
            [
              [0, 1],
              [1, 2],
              [2, 3],
              [3, 4],
            ],
            0,
            4,
          ],
          expected: 4,
        },
        {
          args: [
            4,
            [
              [0, 1],
              [1, 2],
              [0, 2],
            ],
            0,
            2,
          ],
          expected: 1,
        },
        {
          args: [3, [[0, 1]], 0, 2],
          expected: -1,
        },
        {
          args: [1, [], 0, 0],
          expected: 0,
        },
      ],
    },
    {
      language: "javascript",
      entry: "bidirectionalBfs",
      code: `function bidirectionalBfs(n, edges, s, t) {
  if (s === t) return 0;
  const adj = Array.from({length: n}, () => []);
  for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u); }
  const distS = new Map([[s, 0]]);
  const distT = new Map([[t, 0]]);
  let frontS = [s], frontT = [t];
  while (frontS.length && frontT.length) {
    if (frontS.length <= frontT.length) {
      const nxt = [];
      for (const u of frontS) for (const v of adj[u]) {
        if (!distS.has(v)) {
          distS.set(v, distS.get(u) + 1);
          nxt.push(v);
          if (distT.has(v)) return distS.get(v) + distT.get(v);
        }
      }
      frontS = nxt;
    } else {
      const nxt = [];
      for (const u of frontT) for (const v of adj[u]) {
        if (!distT.has(v)) {
          distT.set(v, distT.get(u) + 1);
          nxt.push(v);
          if (distS.has(v)) return distS.get(v) + distT.get(v);
        }
      }
      frontT = nxt;
    }
  }
  return -1;
}
`,
      tests: [
        {
          args: [
            5,
            [
              [0, 1],
              [1, 2],
              [2, 3],
              [3, 4],
            ],
            0,
            4,
          ],
          expected: 4,
        },
        {
          args: [3, [[0, 1]], 0, 2],
          expected: -1,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "bidirectional-bfs-q1",
      kind: "mcq",
      prompt: "What is the main advantage of bidirectional BFS?",
      options: [
        "Explores O(b^(d/2)) vertices instead of O(b^d)",
        "Uses less memory than BFS",
        "Works on weighted graphs",
        "Always faster than BFS",
      ],
      answer: 0,
      explanation:
        "By searching from both ends, each side only needs to explore half the depth, reducing the explored space exponentially.",
      hints: ["Think about the volume of a sphere of radius d vs two spheres of radius d/2."],
      objective: "Speedup analysis",
    },
  ],
  exam: {
    definition:
      "Bidirectional BFS runs BFS from both source and target simultaneously, meeting in the middle for faster shortest-path discovery.",
    steps: [
      "Initialize frontiers from both s and t.",
      "Expand the smaller frontier.",
      "Check for intersection after each expansion.",
      "Return sum of distances at meeting point.",
    ],
    timeComplexity: "$O(b^{d/2})$ where b is branching factor and d is distance.",
    spaceComplexity: "$O(V)$ for the two visited sets.",
    correctness:
      "When frontiers meet, the path through the meeting vertex is shortest because BFS explores in order of distance.",
    applications: ["social network shortest paths", "puzzle solving", "route planning"],
    limitations: [
      "Requires knowing the target vertex",
      "Only for unweighted graphs without modification",
    ],
    faq: [
      {
        q: "When is bidirectional BFS not helpful?",
        a: "When the graph has very different branching factors from s and t, or when s and t are in different components.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Describe two-frontier approach (2).",
          "Analyze explored space (2).",
          "Prove shortest path correctness (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "Exercise on bidirectional BFS.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
