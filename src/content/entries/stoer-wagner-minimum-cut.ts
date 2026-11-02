import type { AlgorithmEntry } from "../types";

export const stoerWagnerMinimumCutEntry: AlgorithmEntry = {
  slug: "stoer-wagner-minimum-cut",
  name: "Stoer–Wagner Minimum Cut",
  aliases: ["Stoer-Wagner", "Global Minimum Cut"],
  curriculum: [504],
  domain: "graphs",
  subcategory: "Graph Algorithms",
  difficulty: "intermediate",
  summary:
    "The Stoer–Wagner algorithm finds the global minimum cut of an undirected weighted graph in O(V^3) or O(VE + V^2 log V) time by repeatedly computing minimum s-t cuts and merging vertices.",
  tags: ["minimum cut", "graph", "network flow", "contraction"],
  prerequisites: ["Graph Traversal"],
  related: [],
  problem: {
    input: "An undirected weighted graph.",
    output: "The minimum total weight of edges whose removal disconnects the graph.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "The global minimum cut partitions vertices into two non-empty sets minimizing the total edge weight between them. Stoer–Wagner avoids max-flow by observing that either the minimum cut separates the last two vertices found by a maximum adjacency search, or it doesn't — in which case we can merge those vertices and recurse on a smaller graph.",
      },
      {
        kind: "p",
        text: "Each phase finds one candidate cut by growing a set greedily (always adding the most tightly connected vertex), which takes O(V^2) or O(E + V log V) with a priority queue. After V-1 phases, the minimum among all candidate cuts is the global minimum cut.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "**MinimumCutPhase**: Start with an arbitrary vertex. Repeatedly add the vertex most tightly connected to the growing set A (highest total weight of edges to A).",
          "The last vertex added is t, the second-to-last is s. The cut-of-the-phase is the total weight of edges from t to A\\{t}.",
          "Merge s and t: combine their edge lists (summing parallel edges).",
          "Repeat until only two vertices remain.",
          "Return the minimum cut-of-the-phase across all phases.",
        ],
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Use a priority queue (max-heap) for the maximum adjacency ordering.",
          "Merging vertices: add edge weights and redirect neighbors.",
          "The algorithm naturally handles multigraphs (parallel edges are summed).",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Stoer–Wagner runs V-1 phases, each taking O(V^2) (adjacency matrix) or O(E + V log V) (priority queue). Total: O(V^3) or O(VE + V^2 log V). Correctness: in each phase, the cut-of-the-phase is the minimum s-t cut for the last two vertices; the global min cut is the minimum over all pairs.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Karger's randomized algorithm finds the minimum cut in O(n^2 log^3 n) with high probability.",
          "For directed graphs, global minimum cut requires max-flow or more complex algorithms.",
          "The Stoer–Wagner algorithm is often the simplest and fastest deterministic global min-cut algorithm.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(V E)",
      average: "O(V^3)",
      worst: "O(V^3)",
    },
    space: "O(V^2)",
    worstClass: "n^3",
    note: "V-1 phases, each O(V^2) or O(E + V log V).",
  },
  properties: [
    {
      label: "Graph type",
      value: "Undirected weighted",
    },
    {
      label: "Flow-free",
      value: "Yes, no max-flow needed",
    },
    {
      label: "Deterministic",
      value: "Yes",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "stoer_wagner",
      code: `def stoer_wagner(n, edges):
    """Find global minimum cut weight. n vertices (0..n-1), edges: [u,v,w]."""
    adj = [[0]*n for _ in range(n)]
    for u, v, w in edges:
        adj[u][v] += w
        adj[v][u] += w
    merged = list(range(n))  # track merged vertices
    active = list(range(n))
    best_cut = float('inf')
    for _ in range(n - 1):
        # Maximum adjacency ordering
        w = [0] * n
        in_A = [False] * n
        order = []
        for _ in range(len(active)):
            # Pick vertex with max w not in A
            best_v = -1
            best_w = -1
            for v in active:
                if not in_A[v] and w[v] > best_w:
                    best_w = w[v]
                    best_v = v
            if best_v == -1: break
            in_A[best_v] = True
            order.append(best_v)
            for v in active:
                if not in_A[v]:
                    w[v] += adj[best_v][v]
        if len(order) < 2: break
        t = order[-1]
        s = order[-2]
        cut_weight = w[t]
        if cut_weight < best_cut:
            best_cut = cut_weight
        # Merge t into s
        for v in active:
            adj[s][v] += adj[t][v]
            adj[v][s] += adj[v][t]
        active.remove(t)
    return best_cut
`,
      tests: [
        {
          args: [
            4,
            [
              [0, 1, 2],
              [1, 2, 3],
              [2, 3, 1],
              [3, 0, 4],
              [0, 2, 1],
            ],
          ],
          expected: 4,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "sw-phases",
      kind: "mcq",
      prompt: "How many phases does Stoer–Wagner run on a graph with V vertices?",
      options: ["V - 1", "V", "E", "V^2"],
      answer: 0,
      explanation:
        "Each phase merges two vertices, reducing the count by 1. Starting from V vertices, V-1 phases reduce to 1.",
      hints: ["How many merges until one vertex remains?"],
      objective: "Know the phase count",
    },
  ],
  exam: {
    definition:
      "Stoer–Wagner finds the global minimum cut by running V-1 phases of maximum adjacency ordering and vertex merging.",
    steps: [
      "Maximum adjacency ordering to find s,t.",
      "Record cut-of-the-phase.",
      "Merge s and t.",
      "Return minimum cut across phases.",
    ],
    timeComplexity: "O(V^3) or O(VE + V^2 log V)",
    spaceComplexity: "O(V^2)",
    correctness:
      "Each phase finds the exact min s-t cut for the last two vertices; the minimum over all phases is the global min cut.",
    applications: ["Network reliability", "Image segmentation", "Clustering"],
    limitations: ["Undirected graphs only", "O(V^3) can be slow for large graphs"],
    faq: [
      {
        q: "How does this compare to max-flow-based min-cut?",
        a: "Stoer-Wagner is simpler and avoids source/sink choice; max-flow finds directed s-t cuts.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Maximum adjacency ordering (1).", "Phase, merge, and correctness (1)."],
      },
    ],
  },
  references: [
    {
      citation: "M. Stoer, F. Wagner, 'A Simple Min-Cut Algorithm,' JACM, 44(4), 1997.",
      supports: "The original Stoer-Wagner algorithm.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
