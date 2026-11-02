import type { AlgorithmEntry } from "../types";

export const cycleDetectionDirectedEntry: AlgorithmEntry = {
  slug: "cycle-detection-directed",
  name: "Cycle Detection (Directed)",
  aliases: ["Cycle Detection (Directed)"],
  curriculum: [231],
  domain: "graphs",
  subcategory: "Graph Traversal",
  difficulty: "intermediate",
  summary:
    "Detects whether a directed graph contains a cycle using DFS with a recursion-stack marker: a back edge to a vertex currently on the DFS stack indicates a cycle.",
  tags: ["cycle detection", "directed graph", "DFS", "back edge", "graph"],
  prerequisites: ["DFS"],
  related: ["cycle-detection-undirected", "topological-sort"],
  problem: {
    input: "A directed graph with n vertices and a list of directed edges.",
    output: "True if the graph contains a directed cycle, false otherwise.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "In a directed graph, DFS colours vertices white (unvisited), grey (in current DFS path) and black (finished). If we reach a grey vertex, we have found a back edge and thus a cycle.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Colour all vertices white.",
          "For each white vertex, start DFS: colour it grey.",
          "For each outgoing neighbour: if grey → cycle found; if white → recurse.",
          "After processing all neighbours, colour the vertex black.",
          "If no grey-to-grey edge is found, the graph is acyclic (a DAG).",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Use two boolean arrays: `visited` and `on_stack`. A vertex is added to on_stack when DFS enters it and removed when DFS leaves. A directed cycle exists iff DFS finds a neighbour that is on the stack.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "DFS visits each vertex and edge once: $O(V + E)$. A directed graph is acyclic if and only if DFS produces no back edges, which is also equivalent to the existence of a topological ordering.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "An alternative is to attempt a topological sort (Kahn's algorithm): if the result has fewer than V vertices, a cycle exists.",
          "For finding an actual cycle path, track parents during DFS and trace back from the back edge.",
          "In functional programming, cycle detection often uses colouring or visited-set approaches.",
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
      value: "Directed",
    },
    {
      label: "Approach",
      value: "DFS with recursion-stack tracking",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "has_cycle_directed",
      code: `def has_cycle_directed(n, edges):
    adj = [[] for _ in range(n)]
    for u, v in edges:
        adj[u].append(v)
    visited = [False] * n
    on_stack = [False] * n
    def dfs(u):
        visited[u] = True
        on_stack[u] = True
        for v in adj[u]:
            if not visited[v]:
                if dfs(v):
                    return True
            elif on_stack[v]:
                return True
        on_stack[u] = False
        return False
    for i in range(n):
        if not visited[i]:
            if dfs(i):
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
          args: [
            2,
            [
              [0, 1],
              [1, 0],
            ],
          ],
          expected: true,
        },
      ],
    },
    {
      language: "javascript",
      entry: "hasCycleDirected",
      code: `function hasCycleDirected(n, edges) {
  const adj = Array.from({length: n}, () => []);
  for (const [u, v] of edges) adj[u].push(v);
  const visited = new Array(n).fill(false);
  const onStack = new Array(n).fill(false);
  function dfs(u) {
    visited[u] = true;
    onStack[u] = true;
    for (const v of adj[u]) {
      if (!visited[v]) { if (dfs(v)) return true; }
      else if (onStack[v]) return true;
    }
    onStack[u] = false;
    return false;
  }
  for (let i = 0; i < n; i++) {
    if (!visited[i] && dfs(i)) return true;
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
      id: "cycle-detection-directed-q1",
      kind: "mcq",
      prompt: "What does the 'grey' colour represent in directed cycle detection?",
      options: [
        "The vertex is on the current DFS path (recursion stack)",
        "The vertex has been fully processed",
        "The vertex has not been visited",
        "The vertex is in a cycle",
      ],
      answer: 0,
      explanation:
        "Grey means the vertex is currently being explored. If DFS encounters another grey vertex, the path from that vertex back to itself forms a cycle.",
      hints: ["Think about the three-colour DFS classification."],
      objective: "DFS colouring",
    },
  ],
  exam: {
    definition:
      "Directed cycle detection uses DFS with a recursion-stack marker to find back edges, which indicate directed cycles.",
    steps: [
      "Run DFS with white/grey/black colouring.",
      "If a grey vertex is reached, a cycle exists.",
      "If all vertices turn black without a back edge, the graph is a DAG.",
    ],
    timeComplexity: "$O(V + E)$.",
    spaceComplexity: "$O(V + E)$.",
    correctness:
      "A back edge to a grey vertex proves a directed path from that vertex to itself exists.",
    applications: ["deadlock detection", "dependency validation", "compiler cycle checking"],
    limitations: ["Returns only existence; finding the actual cycle requires parent tracking"],
    faq: [
      {
        q: "Why can't we use the undirected method?",
        a: "In directed graphs, a visited vertex may be fully processed (black), not forming a cycle. Only grey (on-stack) vertices indicate back edges.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define directed cycle (1).",
          "Three-colour DFS algorithm (2).",
          "Prove correctness (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "Section 22.3: Depth-First Search.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
