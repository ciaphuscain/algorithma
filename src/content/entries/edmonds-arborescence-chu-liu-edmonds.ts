import type { AlgorithmEntry } from "../types";

export const edmondsArborescenceChuLiuEdmondsEntry: AlgorithmEntry = {
  slug: "edmonds-arborescence-chu-liu-edmonds",
  name: "Edmonds' Arborescence (Chu–Liu/Edmonds)",
  aliases: [
    "Chu-Liu/Edmonds",
    "Minimum spanning arborescence",
  ],
  curriculum: [
    505,
  ],
  domain: "graphs",
  subcategory: "Graph Algorithms",
  difficulty: "intermediate",
  summary: "Finds the minimum-weight arborescence (directed spanning tree rooted at a given vertex) in a weighted directed graph by iteratively contracting cycles and adjusting edge weights.",
  tags: [
    "directed graph",
    "spanning tree",
    "arborescence",
    "cycle contraction",
  ],
  prerequisites: [
    "Graphs",
  ],
  related: [
    "bor-vka-s-algorithm",
  ],
  problem: {
    input: "A weighted directed graph and a root vertex.",
    output: "A minimum-weight arborescence (every vertex reachable from the root via a unique directed path).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "An arborescence is a directed tree where all edges point away from the root and every vertex is reachable. Unlike undirected MSTs, you can't just use Kruskal's or Prim's because edge directions matter.",
      },
      {
        kind: "p",
        text: "Edmonds' algorithm greedily picks the cheapest incoming edge for each non-root vertex. If this creates a cycle, contract the cycle into a single vertex, adjust edge weights, and recurse. After finding the arborescence on the contracted graph, expand the cycles.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "For each non-root vertex, select the minimum-weight incoming edge.",
          "If no cycle forms, these edges form the arborescence.",
          "If a cycle forms, contract it into a single vertex. For edges entering the cycle, adjust weights: w'(u, cycle) = w(u, v) − w(min_in(v), v) where min_in(v) is v's selected edge.",
          "Recurse on the contracted graph.",
          "Expand cycles: for each contracted cycle, remove one edge (the one replaced by the entering edge) to break the cycle.",
        ],
      },
      {
        kind: "p",
        text: "**Example:** Graph with 3 vertices: 0→1(2), 0→2(3), 1→2(1), 2→1(4). Root=0. Min incoming: 1←0(2), 2←1(1). No cycle. Arborescence weight = 3.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "The naive implementation runs in O(VE) time.",
          "Using efficient data structures (Fibonacci heap), O(E + V log V) is achievable.",
          "The algorithm can be implemented with union-find for cycle detection.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Correctness:** Contracting a cycle is valid because any arborescence must include all but one edge of the cycle (to break it). The weight adjustment accounts for the replaced edge.",
      },
      {
        kind: "p",
        text: "**Complexity:** O(VE) naive, O(E + V log V) with Fibonacci heap.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "The Tarjan variant achieves O(E + V log V) using a priority queue.",
          "Applications include optimal branching in phylogenetic trees and dependency parsing in NLP.",
          "The problem is also known as the optimum branching problem.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(E)",
      average: "O(V E)",
      worst: "O(V E)",
    },
    space: "O(V + E)",
    worstClass: "n^2",
    note: "O(VE) for the basic algorithm.",
  },
  properties: [
    {
      label: "Input",
      value: "Weighted directed graph + root",
    },
    {
      label: "Output",
      value: "Minimum-weight arborescence",
    },
    {
      label: "Key idea",
      value: "Cycle contraction with weight adjustment",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "min_arborescence_weight",
      code: `def min_arborescence_weight(n, edges, root):
    """Minimum arborescence weight. edges: list of [u, v, w] (directed u->v).
    Returns total weight or -1 if no arborescence exists."""
    INF = float('inf')
    cur_edges = [(u, v, w) for u, v, w in edges]
    ids = list(range(n))  # vertex mapping
    res = 0
    while True:
        # Find min incoming for each non-root vertex
        min_in = [INF] * n
        min_edge = [-1] * n
        for i, (u, v, w) in enumerate(cur_edges):
            if u != v and v != root and w < min_in[v]:
                min_in[v] = w
                min_edge[v] = u
        for v in range(n):
            if v != root and min_in[v] == INF:
                return -1
        # Check for cycles
        visited = [-1] * n
        cycle_id = [-1] * n
        num_cycles = 0
        for v in range(n):
            if v == root:
                continue
            res += min_in[v]
            u = v
            while visited[u] == -1 and cycle_id[u] == -1 and u != root:
                visited[u] = v
                u = min_edge[u]
            if u != root and cycle_id[u] == -1 and visited[u] == v:
                # Found a cycle
                w = u
                cycle_id[u] = num_cycles
                u = min_edge[u]
                while u != w:
                    cycle_id[u] = num_cycles
                    u = min_edge[u]
                num_cycles += 1
            visited = [-1] * n  # reset for next vertex
        if num_cycles == 0:
            break
        # Assign non-cycle vertices to new ids
        for v in range(n):
            if cycle_id[v] == -1:
                cycle_id[v] = num_cycles
                num_cycles += 1
        # Contract
        new_edges = []
        for u, v, w in cur_edges:
            nu, nv = cycle_id[u], cycle_id[v]
            if nu != nv:
                new_edges.append((nu, nv, w - min_in[v]))
        cur_edges = new_edges
        root = cycle_id[root]
        n = num_cycles
    return res
`,
      tests: [
        {
          args: [
            3,
            [
              [
                0,
                1,
                2,
              ],
              [
                0,
                2,
                3,
              ],
              [
                1,
                2,
                1,
              ],
            ],
            0,
          ],
          expected: 3,
        },
        {
          args: [
            3,
            [
              [
                0,
                1,
                1,
              ],
              [
                1,
                2,
                1,
              ],
              [
                2,
                0,
                1,
              ],
            ],
            0,
          ],
          expected: 2,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "edmonds-cycle",
      kind: "mcq",
      prompt: "What happens when the greedy min-incoming-edge selection creates a cycle?",
      options: [
        "The cycle is contracted into a single vertex with adjusted weights",
        "The algorithm fails",
        "All cycle edges are removed",
        "The heaviest edge is deleted",
      ],
      answer: 0,
      explanation: "Edmonds' algorithm contracts cycles, adjusting incoming edge weights to account for the edge being replaced.",
      hints: [
        "Why can't we just delete a cycle edge?",
      ],
      objective: "Understand cycle contraction",
    },
  ],
  exam: {
    definition: "Edmonds' algorithm finds minimum arborescences by greedily selecting min incoming edges and contracting cycles.",
    steps: [
      "Select min incoming edge per vertex.",
      "If cycle, contract it, adjust weights.",
      "Recurse on contracted graph.",
      "Expand to recover arborescence.",
    ],
    timeComplexity: "O(VE)",
    spaceComplexity: "O(V + E)",
    correctness: "Weight adjustment ensures the contracted problem's optimum corresponds to the original's.",
    applications: [
      "Phylogenetic trees",
      "NLP dependency parsing",
    ],
    limitations: [
      "Directed graphs only; undirected case is simpler (Kruskal/Prim)",
    ],
    faq: [
      {
        q: "Why not use Prim/Kruskal?",
        a: "They work on undirected graphs; edge direction matters for arborescences.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Greedy min incoming + cycle contraction.",
          "Weight adjustment formula.",
        ],
      },
    ],
  },
  references: [
    {
      citation: "J. Edmonds, 'Optimum Branchings,' J. Research NBS, 71B, 1967.",
      supports: "The original optimum branching algorithm.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
