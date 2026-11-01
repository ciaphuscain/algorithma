import type { AlgorithmEntry } from "../types";

export const fleurySAlgorithmEntry: AlgorithmEntry = {
  slug: "fleury-s-algorithm",
  name: "Fleury's Algorithm",
  aliases: ["Fleury's Algorithm"],
  curriculum: [243],
  domain: "graphs",
  subcategory: "Graph Algorithms",
  difficulty: "intermediate",
  summary:
    "Finds an Eulerian path or circuit by avoiding bridges whenever possible, ensuring the graph stays connected as edges are removed.",
  tags: ["Eulerian path", "bridge", "graph traversal", "graph"],
  prerequisites: ["DFS", "Bridges and Articulation Points"],
  related: ["hierholzer-s-algorithm"],
  problem: {
    input: "A graph with n vertices and edges.",
    output: "An Eulerian path or circuit if one exists.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "At each step, choose an edge that is NOT a bridge (unless it's the only option). This ensures the remaining graph stays connected so all edges can still be reached.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Check if an Euler path/circuit exists (0 or 2 odd-degree vertices).",
          "Start from an odd-degree vertex (path) or any vertex (circuit).",
          "At each step, prefer non-bridge edges.",
          "Remove the chosen edge and move to the next vertex.",
          "Continue until all edges are traversed.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Bridge detection via DFS at each step makes this O(E²). Hierholzer's O(E) algorithm is preferred in practice.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "$O(E^2)$: at each of the $E$ steps, checking for bridges takes $O(E)$ with DFS.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Much slower than Hierholzer's O(E) algorithm.",
          "Primarily of historical and educational interest.",
          "The bridge-avoidance rule is the key insight.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(E^2)",
      average: "O(E^2)",
      worst: "O(E^2)",
    },
    space: "O(V + E)",
    worstClass: "n + m",
  },
  properties: [
    {
      label: "Domain",
      value: "graphs",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "fleury",
      code: `def fleury(n, edges):
    from collections import defaultdict
    adj = defaultdict(set)
    idx = 0
    edge_map = defaultdict(set)
    for u, v in edges:
        adj[u].add(idx)
        adj[v].add(idx)
        edge_map[idx] = (u, v)
        idx += 1
    degrees = [0] * n
    for u, v in edges:
        degrees[u] += 1
        degrees[v] += 1
    odd = [i for i in range(n) if degrees[i] % 2 == 1]
    if len(odd) not in (0, 2):
        return None
    start = odd[0] if odd else (edges[0][0] if edges else 0)
    path = [start]
    used = set()
    cur = start
    for _ in range(len(edges)):
        avail = [e for e in adj[cur] if e not in used]
        if not avail:
            break
        chosen = avail[0]
        used.add(chosen)
        u, v = edge_map[chosen]
        nxt = v if u == cur else u
        adj[cur].discard(chosen)
        adj[nxt].discard(chosen)
        cur = nxt
        path.append(cur)
    return path
`,
      tests: [
        {
          args: [
            3,
            [
              [0, 1],
              [1, 2],
              [2, 0],
            ],
          ],
          expected: [0, 1, 2, 0],
        },
      ],
    },
    {
      language: "javascript",
      entry: "fleury",
      code: `function fleury(n, edges) {
  const adj = Array.from({length: n}, () => new Set());
  const em = [];
  for (let i = 0; i < edges.length; i++) {
    const [u, v] = edges[i];
    adj[u].add(i); adj[v].add(i);
    em.push([u, v]);
  }
  const deg = new Array(n).fill(0);
  for (const [u, v] of edges) { deg[u]++; deg[v]++; }
  const odd = [];
  for (let i = 0; i < n; i++) if (deg[i] % 2) odd.push(i);
  if (odd.length !== 0 && odd.length !== 2) return null;
  let cur = odd.length ? odd[0] : (edges.length ? edges[0][0] : 0);
  const path = [cur], used = new Set();
  for (let step = 0; step < edges.length; step++) {
    const avail = [...adj[cur]].filter(e => !used.has(e));
    if (!avail.length) break;
    const e = avail[0];
    used.add(e);
    const [u, v] = em[e];
    const nxt = u === cur ? v : u;
    adj[cur].delete(e); adj[nxt].delete(e);
    cur = nxt;
    path.push(cur);
  }
  return path;
}
`,
      tests: [
        {
          args: [
            3,
            [
              [0, 1],
              [1, 2],
              [2, 0],
            ],
          ],
          expected: [0, 1, 2, 0],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "fleury-s-algorithm-q1",
      kind: "mcq",
      prompt: "Why does Fleury's algorithm avoid bridges?",
      options: [
        "Removing a bridge disconnects the graph, leaving unreachable edges",
        "Bridges have higher weight",
        "Bridges create cycles",
        "To minimize path length",
      ],
      answer: 0,
      explanation:
        "If a bridge is removed, the graph splits into disconnected components, making it impossible to traverse all remaining edges.",
      hints: ["Think about the algorithm's key property."],
      objective: "Understanding",
    },
  ],
  exam: {
    definition:
      "Fleury's algorithm finds an Euler path/circuit by avoiding bridge edges to maintain graph connectivity.",
    steps: [
      "Start from appropriate vertex.",
      "At each step, prefer non-bridge edges.",
      "Remove traversed edges.",
      "O(E²) total time.",
    ],
    timeComplexity: "$O(V + E)$.",
    spaceComplexity: "$O(V + E)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["graph algorithms"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Fleury's Algorithm?",
        a: "Finds an Eulerian path or circuit by avoiding bridges whenever possible, ensuring the graph stays connected as edges are removed.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Fleury's Algorithm (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "Reference for Fleury's Algorithm.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
