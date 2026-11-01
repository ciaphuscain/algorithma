import type { AlgorithmEntry } from "../types";

export const parallelDfsEntry: AlgorithmEntry = {
  slug: "parallel-dfs",
  name: "Parallel DFS",
  aliases: ["Parallel Depth-First Search"],
  curriculum: [463],
  domain: "parallel",
  subcategory: "Parallel Algorithms",
  difficulty: "intermediate",
  summary:
    "Parallelises depth-first search by distributing subtrees across processors, though DFS is inherently more sequential than BFS and typically achieves limited speedup except on tree-structured graphs.",
  tags: ["parallel", "DFS", "graph traversal"],
  prerequisites: ["DFS", "Parallel BFS"],
  related: ["dfs", "parallel-bfs"],
  problem: {
    input: "A graph and a source vertex, with p processors.",
    output: "A DFS traversal order, computed with parallelism where possible.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Unlike BFS where each level is independent, DFS has a stack-based order that's hard to parallelise — the next vertex depends on what's currently on the stack. The key insight is that when a vertex has multiple unvisited neighbours, different processors can explore different subtrees.",
      },
      {
        kind: "p",
        text: "On trees this works well (each subtree is independent). On general graphs, contention arises because multiple processors may try to visit the same vertex.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Maintain a shared work pool of (vertex, stack-state) tasks.",
          "Each processor pops a task, explores from that vertex, and pushes new tasks for unvisited neighbours.",
          "Use atomic visited flags to avoid duplicate exploration.",
          "Terminate when the pool is empty and all processors are idle.",
        ],
      },
      {
        kind: "p",
        text: "**Example:** On a binary tree of depth 3, one processor takes the left subtree and another takes the right, achieving 2x speedup.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Work stealing helps balance load when subtree sizes differ.",
          "The DFS numbering may differ from sequential DFS, but reachability results are the same.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Work is $O(V + E)$. Span is $O(V)$ in the worst case (a path graph), so parallel DFS has limited theoretical speedup on general graphs. On trees with balanced branching, span is $O(\\text{depth})$.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Parallel DFS is P-complete, meaning it is unlikely to have an efficient parallel algorithm for general graphs.",
          "Randomised approaches and related problems (like parallel connectivity) achieve better parallelism.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O((V+E)/p)",
      average: "O(V+E)",
      worst: "O(V+E)",
    },
    space: "O(V)",
    worstClass: "n",
    note: "Limited speedup on general graphs; best on trees.",
  },
  properties: [
    {
      label: "Work",
      value: "$O(V + E)$",
    },
    {
      label: "Span",
      value: "$O(V)$ worst case",
    },
    {
      label: "P-complete",
      value: "Hard to parallelise in general",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "parallel_dfs",
      code: `def parallel_dfs(adj, source):
    """Simulated parallel DFS using iterative approach. Returns visit order."""
    n = len(adj)
    visited = [False] * n
    order = []
    stack = [source]
    visited[source] = True
    while stack:
        u = stack.pop()
        order.append(u)
        for v in adj[u]:
            if not visited[v]:
                visited[v] = True
                stack.append(v)
    return order
`,
      tests: [
        {
          args: [[[1, 2], [3], [3], []], 0],
          expected: [0, 2, 3, 1],
        },
        {
          args: [[[1], [2], [], []], 3],
          expected: [3],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "pdfs-hard",
      kind: "mcq",
      prompt: "Why is parallel DFS harder to speed up than parallel BFS?",
      options: [
        "DFS ordering is inherently sequential (P-complete)",
        "DFS uses more memory",
        "DFS visits fewer vertices",
        "DFS requires sorting",
      ],
      answer: 0,
      explanation:
        "DFS is P-complete: the next vertex to visit depends on the current stack state, limiting parallelism.",
      hints: ["What determines which vertex DFS visits next?"],
      objective: "Understand limitations of parallel DFS",
    },
  ],
  exam: {
    definition:
      "Parallel DFS distributes subtree exploration across processors but faces inherent sequentiality (P-completeness) on general graphs.",
    steps: [
      "Shared work pool of tasks.",
      "Processors explore subtrees.",
      "Atomic visited flags.",
      "Work stealing for load balance.",
    ],
    timeComplexity: "$O(V+E)$ work, $O(V)$ span.",
    spaceComplexity: "$O(V)$.",
    correctness: "DFS is P-complete, so no polylog-span algorithm is known for general graphs.",
    applications: ["Parallel tree traversal", "Game tree search"],
    limitations: ["Poor parallelism on general graphs"],
    faq: [
      {
        q: "When does parallel DFS work well?",
        a: "On trees or graphs with many independent subtrees, where each processor can explore a different branch.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["P-completeness and subtree distribution (2)."],
      },
    ],
  },
  references: [
    {
      citation:
        'J. Reif, "Depth-first search is inherently sequential," Information Processing Letters, 20(5), 1985.',
      supports: "Proof that DFS is P-complete.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
