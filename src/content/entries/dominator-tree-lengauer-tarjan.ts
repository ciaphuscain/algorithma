import type { AlgorithmEntry } from "../types";

export const dominatorTreeLengauerTarjanEntry: AlgorithmEntry = {
  slug: "dominator-tree-lengauer-tarjan",
  name: "Dominator Tree (Lengauer–Tarjan)",
  aliases: ["Lengauer-Tarjan", "Dominator tree"],
  curriculum: [506],
  domain: "graphs",
  subcategory: "Graph Algorithms",
  difficulty: "intermediate",
  summary:
    "Computes the dominator tree of a directed graph in O(E α(V)) time, where vertex u dominates v if every path from the entry to v passes through u.",
  tags: ["dominator tree", "control flow", "graph", "compiler"],
  prerequisites: ["DFS"],
  related: [],
  problem: {
    input: "A directed graph with a distinguished entry vertex.",
    output: "The dominator tree: for each vertex, its immediate dominator.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "In a control-flow graph, vertex u dominates v if you must pass through u to reach v from the entry. The immediate dominator of v (idom(v)) is the closest dominator — the last one on every path. The dominator tree has edges from idom(v) to v.",
      },
      {
        kind: "p",
        text: "Lengauer–Tarjan computes this efficiently using DFS, semi-dominators (an approximation computable from the DFS tree), and a link-eval structure to propagate dominance information upward.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Run DFS from the entry, numbering vertices in DFS order.",
          "Compute semi-dominators: sdom(v) = min DFS number reachable from v by paths through non-tree edges then tree edges upward.",
          "Use a union-find (link-eval) structure to efficiently query the minimum semi-dominator on tree paths.",
          "Compute immediate dominators from semi-dominators using a second pass.",
        ],
      },
      {
        kind: "p",
        text: "The semi-dominator is the key intermediate concept; it upper-bounds where the dominator can be in the DFS tree.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "The link-eval data structure with path compression gives near-linear O(E α(V)) time.",
          "A simpler quadratic algorithm iteratively computes dominators by intersecting dominator sets, but is too slow for large graphs.",
          "Cooper, Harvey, and Kennedy's 'simple, fast' algorithm is practical for most compilers.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Semi-dominator theorem:** sdom(w) = min({v : (v,w) ∈ E, v < w} ∪ {sdom(u) : u > w, ∃ path u →* v → w with all internal vertices > w}).",
      },
      {
        kind: "p",
        text: "**Complexity:** O(E α(V)) with sophisticated link-eval, O(E log V) with simple path compression.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Dominator trees are fundamental in SSA-form construction for optimizing compilers.",
          "The dominator tree can be incrementally maintained as edges are added/removed.",
          "Post-dominator trees (reversing all edges) determine which vertices must execute after a given vertex.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(E)",
      average: "O(E α(V))",
      worst: "O(E α(V))",
    },
    space: "O(V + E)",
    worstClass: "n + m",
    note: "α is the inverse Ackermann function.",
  },
  properties: [
    {
      label: "Output",
      value: "Immediate dominator for each vertex",
    },
    {
      label: "Key structure",
      value: "Semi-dominators + link-eval",
    },
    {
      label: "Application",
      value: "Compiler SSA construction",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "dominators_simple",
      code: `def dominators_simple(n, adj, entry):
    """Compute immediate dominators using iterative dataflow (simple O(V^2) version).
    adj: adjacency list (list of lists). Returns idom array (-1 for entry)."""
    # Reverse graph for predecessor lookup
    pred = [[] for _ in range(n)]
    for u in range(n):
        for v in adj[u]:
            pred[v].append(u)
    # BFS order from entry
    from collections import deque
    order = []
    visited = [False] * n
    q = deque([entry])
    visited[entry] = True
    while q:
        u = q.popleft()
        order.append(u)
        for v in adj[u]:
            if not visited[v]:
                visited[v] = True
                q.append(v)
    idx = {v: i for i, v in enumerate(order)}
    idom = [-1] * n
    idom[entry] = entry
    changed = True
    def intersect(b1, b2):
        while b1 != b2:
            while idx.get(b1, n) > idx.get(b2, n):
                b1 = idom[b1]
            while idx.get(b2, n) > idx.get(b1, n):
                b2 = idom[b2]
        return b1
    while changed:
        changed = False
        for v in order[1:]:
            preds = [p for p in pred[v] if idom[p] != -1]
            if not preds:
                continue
            new_idom = preds[0]
            for p in preds[1:]:
                new_idom = intersect(new_idom, p)
            if idom[v] != new_idom:
                idom[v] = new_idom
                changed = True
    idom[entry] = -1
    return idom
`,
      tests: [
        {
          args: [4, [[1, 2], [3], [3], []], 0],
          expected: [-1, 0, 0, 0],
        },
        {
          args: [3, [[1], [2], []], 0],
          expected: [-1, 0, 1],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "dominator-def",
      kind: "mcq",
      prompt: "What does it mean for u to dominate v?",
      options: [
        "Every path from entry to v passes through u",
        "u is adjacent to v",
        "u has a higher DFS number",
        "u and v are in the same SCC",
      ],
      answer: 0,
      explanation: "u dominates v if removing u disconnects v from the entry.",
      hints: ["Think about what vertices are unavoidable on all paths."],
      objective: "Define dominance",
    },
  ],
  exam: {
    definition:
      "The Lengauer–Tarjan algorithm computes immediate dominators in near-linear time using semi-dominators and link-eval.",
    steps: [
      "DFS numbering.",
      "Compute semi-dominators.",
      "Use link-eval for path queries.",
      "Derive immediate dominators.",
    ],
    timeComplexity: "O(E α(V))",
    spaceComplexity: "O(V + E)",
    correctness:
      "Semi-dominators correctly approximate dominators; the link-eval structure enables efficient path minimum queries.",
    applications: ["Compiler optimization (SSA form)", "Control flow analysis"],
    limitations: ["Complex to implement correctly"],
    faq: [
      {
        q: "What is a semi-dominator?",
        a: "The vertex with smallest DFS number reachable from v via specific tree/non-tree edge paths.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Define dominance and immediate dominator.", "Sketch Lengauer–Tarjan steps."],
      },
    ],
  },
  references: [
    {
      citation:
        "T. Lengauer, R. E. Tarjan, 'A Fast Algorithm for Finding Dominators in a Flowgraph,' TOPLAS 1(1), 1979.",
      supports: "The original Lengauer–Tarjan algorithm.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
