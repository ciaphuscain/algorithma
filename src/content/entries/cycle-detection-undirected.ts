import type { AlgorithmEntry } from "../types";

export const cycleDetectionUndirectedEntry: AlgorithmEntry = {
  slug: "cycle-detection-undirected",
  name: "Cycle Detection (Undirected)",
  aliases: ["Cycle Detection (Undirected)"],
  curriculum: [230],
  domain: "graphs",
  subcategory: "Graph Traversal",
  difficulty: "beginner",
  summary:
    "Detects whether an undirected graph contains a cycle using DFS: a back edge to an already-visited vertex (other than the parent) indicates a cycle.",
  tags: ["cycle detection", "undirected graph", "DFS", "graph"],
  prerequisites: ["DFS"],
  related: ["cycle-detection-directed", "union-find"],
  problem: {
    input: "An undirected graph with n vertices and a list of edges.",
    output: "True if the graph contains a cycle, false otherwise.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Run DFS and track each vertex's parent. If DFS reaches a vertex that is already visited and is not the current vertex's parent, we have found a cycle — there are two distinct paths between those vertices.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Build an adjacency list. Mark all vertices unvisited.",
          "For each unvisited vertex, start a DFS.",
          "During DFS from vertex u (parent p): for each neighbour v, if v is visited and v ≠ p, a cycle exists. If v is unvisited, recurse with parent = u.",
          "If no back edge is found across all components, the graph is acyclic (a forest).",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Use iterative DFS with an explicit stack storing (vertex, parent) pairs to avoid recursion limits.",
      },
      {
        kind: "callout",
        tone: "warn",
        text: "Multi-edges between the same pair of vertices form a cycle. Track edge indices or count occurrences if multi-edges are possible.",
        title: "Multi-edges",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "An undirected graph on $V$ vertices is acyclic if and only if it has at most $V - 1$ edges (per component). DFS visits each vertex and edge once: $O(V + E)$.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Union-Find can also detect cycles: if two vertices of an edge are already in the same set, adding the edge creates a cycle.",
          "For directed graphs, cycle detection requires tracking vertices in the current DFS path (the recursion stack), not just visited status.",
          "The cycle space of a graph has dimension $E - V + C$ where $C$ is the number of components.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(V + E)",
      average: "O(V + E)",
      worst: "O(V + E)",
    },
    space: "O(V + E)",
    worstClass: "n + m",
  },
  properties: [
    {
      label: "Graph type",
      value: "Undirected",
    },
    {
      label: "Approach",
      value: "DFS back-edge detection",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "has_cycle_undirected",
      code: `def has_cycle_undirected(n, edges):
    adj = [[] for _ in range(n)]
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)
    visited = [False] * n
    for start in range(n):
        if visited[start]:
            continue
        stack = [(start, -1)]
        visited[start] = True
        while stack:
            u, parent = stack.pop()
            for v in adj[u]:
                if not visited[v]:
                    visited[v] = True
                    stack.append((v, u))
                elif v != parent:
                    return True
    return False
`,
      tests: [
        {
          args: [
            4,
            [
              [0, 1],
              [1, 2],
              [2, 0],
              [2, 3],
            ],
          ],
          expected: true,
        },
        {
          args: [
            4,
            [
              [0, 1],
              [1, 2],
              [2, 3],
            ],
          ],
          expected: false,
        },
        {
          args: [1, []],
          expected: false,
        },
      ],
    },
    {
      language: "javascript",
      entry: "hasCycleUndirected",
      code: `function hasCycleUndirected(n, edges) {
  const adj = Array.from({length: n}, () => []);
  for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u); }
  const visited = new Array(n).fill(false);
  for (let s = 0; s < n; s++) {
    if (visited[s]) continue;
    const stack = [[s, -1]];
    visited[s] = true;
    while (stack.length) {
      const [u, parent] = stack.pop();
      for (const v of adj[u]) {
        if (!visited[v]) { visited[v] = true; stack.push([v, u]); }
        else if (v !== parent) return true;
      }
    }
  }
  return false;
}
`,
      tests: [
        {
          args: [
            4,
            [
              [0, 1],
              [1, 2],
              [2, 0],
              [2, 3],
            ],
          ],
          expected: true,
        },
        {
          args: [
            4,
            [
              [0, 1],
              [1, 2],
              [2, 3],
            ],
          ],
          expected: false,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "cycle-detection-undirected-q1",
      kind: "mcq",
      prompt: "In undirected cycle detection via DFS, what indicates a cycle?",
      options: [
        "A visited neighbour that is not the parent of the current vertex",
        "Any visited neighbour",
        "A vertex with no unvisited neighbours",
        "An edge to a vertex in a different component",
      ],
      answer: 0,
      explanation:
        "In an undirected graph, the edge back to the parent is not a back edge. A visited non-parent neighbour means a second path exists, forming a cycle.",
      hints: ["Think about why the parent check is necessary."],
      objective: "Back-edge detection",
    },
  ],
  exam: {
    definition:
      "Cycle detection in an undirected graph finds whether any cycle exists by checking for back edges during DFS.",
    steps: [
      "Run DFS tracking parent of each vertex.",
      "If a visited non-parent neighbour is found, report cycle.",
      "If DFS completes without finding one, the graph is acyclic.",
    ],
    timeComplexity: "$O(V + E)$.",
    spaceComplexity: "$O(V + E)$.",
    correctness:
      "A back edge (to a visited non-parent) proves two vertex-disjoint paths exist, forming a cycle.",
    applications: ["detecting redundant connections", "checking if a graph is a tree/forest"],
    limitations: ["Does not work for directed graphs without tracking recursion stack"],
    faq: [
      {
        q: "Why exclude the parent?",
        a: "In an undirected graph, every edge u-v appears in both adjacency lists; the edge back to the parent is not a back edge.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define cycle in undirected graph (1).",
          "DFS with parent tracking (2).",
          "Prove correctness and O(V+E) time (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "Chapter 22.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
