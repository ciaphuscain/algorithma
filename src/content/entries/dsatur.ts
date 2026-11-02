import type { AlgorithmEntry } from "../types";

export const dsaturEntry: AlgorithmEntry = {
  slug: "dsatur",
  name: "DSATUR",
  aliases: ["DSATUR"],
  curriculum: [241],
  domain: "graphs",
  subcategory: "Graph Coloring",
  difficulty: "intermediate",
  summary:
    "A graph coloring heuristic that always colors the vertex with the highest saturation degree (most different colors among neighbours) next, breaking ties by highest degree.",
  tags: ["graph coloring", "greedy", "saturation", "graph"],
  prerequisites: ["Welsh-Powell"],
  related: ["welsh-powell"],
  problem: {
    input: "An undirected graph.",
    output: "A valid vertex coloring.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Instead of a fixed ordering, DSATUR dynamically picks the most constrained vertex: the one with the most different-colored neighbours (highest saturation). This adapts to the coloring progress and often uses fewer colors.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Initialize all vertices as uncolored with saturation 0.",
          "While uncolored vertices remain: pick the one with highest saturation (ties broken by highest degree).",
          "Assign the smallest color not used by its neighbours.",
          "Update saturation of its uncolored neighbours.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Use a priority queue or linear scan to select the next vertex. Saturation is the count of distinct colors among neighbours.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "$O(V^2)$ with a linear scan, or $O(V \\log V + E)$ with a priority queue. Optimal for bipartite graphs and produces exact results on many graph classes where greedy ordering fails.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "DSATUR is exact for bipartite and interval graphs.",
          "Can be used as a branching heuristic in exact coloring algorithms.",
          "In practice, often produces near-optimal colorings.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(V + E)",
      average: "O(V^2)",
      worst: "O(V^2)",
    },
    space: "O(V + E)",
    worstClass: "n + m",
  },
  properties: [
    {
      label: "Approach",
      value: "Greedy by saturation degree",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "dsatur",
      code: `def dsatur(n, edges):
    adj = [set() for _ in range(n)]
    for u, v in edges:
        adj[u].add(v)
        adj[v].add(u)
    color = [-1] * n
    sat = [set() for _ in range(n)]
    for _ in range(n):
        best = -1
        for v in range(n):
            if color[v] != -1: continue
            if best == -1 or len(sat[v]) > len(sat[best]) or (len(sat[v]) == len(sat[best]) and len(adj[v]) > len(adj[best])):
                best = v
        used = {color[u] for u in adj[best] if color[u] != -1}
        c = 0
        while c in used: c += 1
        color[best] = c
        for u in adj[best]:
            if color[u] == -1:
                sat[u].add(c)
    return color
`,
      tests: [
        {
          args: [
            4,
            [
              [0, 1],
              [1, 2],
              [2, 3],
              [3, 0],
            ],
          ],
          expected: [0, 1, 0, 1],
        },
        {
          args: [
            3,
            [
              [0, 1],
              [1, 2],
              [0, 2],
            ],
          ],
          expected: [0, 1, 2],
        },
      ],
    },
    {
      language: "javascript",
      entry: "dsatur",
      code: `function dsatur(n, edges) {
  const adj = Array.from({length: n}, () => new Set());
  for (const [u, v] of edges) { adj[u].add(v); adj[v].add(u); }
  const color = new Array(n).fill(-1);
  const sat = Array.from({length: n}, () => new Set());
  for (let step = 0; step < n; step++) {
    let best = -1;
    for (let v = 0; v < n; v++) {
      if (color[v] !== -1) continue;
      if (best === -1 || sat[v].size > sat[best].size || (sat[v].size === sat[best].size && adj[v].size > adj[best].size))
        best = v;
    }
    const used = new Set();
    for (const u of adj[best]) if (color[u] !== -1) used.add(color[u]);
    let c = 0;
    while (used.has(c)) c++;
    color[best] = c;
    for (const u of adj[best]) if (color[u] === -1) sat[u].add(c);
  }
  return color;
}
`,
      tests: [
        {
          args: [
            4,
            [
              [0, 1],
              [1, 2],
              [2, 3],
              [3, 0],
            ],
          ],
          expected: [0, 1, 0, 1],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "dsatur-q1",
      kind: "mcq",
      prompt: "What is 'saturation degree'?",
      options: [
        "The number of different colors used by a vertex's neighbours",
        "The total number of neighbours",
        "The vertex's assigned color",
        "The number of uncolored neighbours",
      ],
      answer: 0,
      explanation:
        "Saturation counts how many distinct colors appear among the vertex's already-colored neighbours.",
      hints: ["Think about what constrains color choices for a vertex."],
      objective: "Saturation",
    },
  ],
  exam: {
    definition:
      "DSATUR colors vertices by dynamically selecting the most saturated vertex (most different-colored neighbours) at each step.",
    steps: [
      "Pick vertex with highest saturation (tie-break: highest degree).",
      "Assign smallest available color.",
      "Update saturation of neighbours.",
    ],
    timeComplexity: "$O(V^2)$.",
    spaceComplexity: "$O(V + E)$.",
    correctness: "Greedy with saturation ordering produces valid colorings.",
    applications: ["register allocation", "scheduling"],
    limitations: ["Not always optimal, but exact for bipartite graphs"],
    faq: [
      {
        q: "How does DSATUR differ from Welsh-Powell?",
        a: "Welsh-Powell uses a fixed degree ordering; DSATUR dynamically picks the most constrained vertex at each step.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define saturation degree (1).",
          "Algorithm loop (2).",
          "Compare with fixed ordering (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "D. Brélaz, 'New Methods to Color the Vertices of a Graph', CACM, 1979.",
      supports: "Original DSATUR paper.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
