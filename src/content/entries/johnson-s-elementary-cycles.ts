import type { AlgorithmEntry } from "../types";

export const johnsonSElementaryCyclesEntry: AlgorithmEntry = {
  slug: "johnson-s-elementary-cycles",
  name: "Johnson's Elementary Cycles",
  aliases: ["Johnson's cycle detection", "All simple cycles"],
  curriculum: [511],
  domain: "graphs",
  subcategory: "Graph Algorithms",
  difficulty: "intermediate",
  summary:
    "Finds all elementary (simple) cycles in a directed graph by performing DFS from each vertex in the order of strongly connected components, using a blocking mechanism to avoid redundant exploration.",
  tags: ["cycles", "directed graph", "enumeration", "SCC"],
  prerequisites: ["DFS", "Tarjan's Strongly Connected Components"],
  related: ["tarjan-scc", "cycle-detection-directed"],
  problem: {
    input: "A directed graph with n vertices and m edges.",
    output: "All elementary (simple) cycles in the graph.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A brute-force search for all simple cycles would explore far too many paths. Johnson's algorithm is smart about avoiding redundant work: it only searches from each vertex within its strongly connected component, and uses a 'blocked' set to skip vertices that can't lead back to the current start.",
      },
      {
        kind: "p",
        text: "When a vertex is found unable to complete a cycle, it's blocked. When a cycle through it is later found, it's unblocked, cascading to other vertices that were blocked waiting on it.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Compute the SCCs of the graph.",
          "For the smallest vertex s in each SCC, run a modified DFS looking for cycles back to s.",
          "Maintain a 'blocked' set: when exploring from vertex v, mark v as blocked.",
          "If DFS from v reaches s, record the cycle and unblock v.",
          "If no path from v leads to s, leave v blocked but record that v blocks its successors.",
          "Remove s and repeat for the next SCC.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example.** Graph: 1→2, 2→3, 3→1, 2→1. Starting from 1: DFS finds 1→2→3→1 (cycle!) and 1→2→1 (cycle!). Both are reported. Then vertex 1 is removed and the algorithm continues on the remaining graph.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Use Tarjan's SCC as a subroutine.",
          "The blocked map is crucial for performance: without it, the algorithm degenerates to exponential in non-cycle paths.",
          "Output one cycle at a time to handle graphs with exponentially many cycles.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Time complexity is $O((n + m)(c + 1))$ where $c$ is the number of elementary cycles. This is optimal per cycle found.",
      },
      {
        kind: "p",
        text: "Space is $O(n + m)$ for the graph plus $O(n)$ for the recursion stack and blocked sets, not counting output.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "The number of elementary cycles can be exponential in n — even a complete directed graph on n vertices has super-exponential cycles.",
          "Used in circuit analysis, deadlock detection, and finding feedback arc sets.",
          "Tiernan's algorithm is an older, less efficient alternative.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n + m)",
      average: "O((n + m)(c + 1))",
      worst: "O((n + m)(c + 1))",
    },
    space: "O(n + m)",
    worstClass: "other",
    note: "c = number of elementary cycles found.",
  },
  properties: [
    {
      label: "Enumerates all",
      value: "Yes, all simple cycles",
    },
    {
      label: "Output-sensitive",
      value: "Yes, O((n+m) per cycle)",
    },
    {
      label: "Requires",
      value: "SCC decomposition",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "johnson_cycles",
      code: `def johnson_cycles(n, edges):
    """Find all elementary cycles in a directed graph on vertices 0..n-1.
    edges is list of (u, v)."""
    from collections import defaultdict
    adj = defaultdict(set)
    for u, v in edges:
        adj[u].add(v)
    cycles = []
    def _unblock(v, blocked, block_map):
        blocked.discard(v)
        while block_map[v]:
            w = block_map[v].pop()
            if w in blocked:
                _unblock(w, blocked, block_map)
    def _dfs(v, s, adj_sub, blocked, block_map, stack):
        found = False
        stack.append(v)
        blocked.add(v)
        for w in adj_sub.get(v, set()):
            if w == s:
                cycles.append(list(stack))
                found = True
            elif w not in blocked:
                if _dfs(w, s, adj_sub, blocked, block_map, stack):
                    found = True
        if found:
            _unblock(v, blocked, block_map)
        else:
            for w in adj_sub.get(v, set()):
                block_map[w].add(v)
        stack.pop()
        return found
    # Process each vertex as start
    nodes = set(range(n))
    while nodes:
        s = min(nodes)
        # Build subgraph on nodes >= s
        sub = defaultdict(set)
        for u in nodes:
            for v in adj[u]:
                if v in nodes:
                    sub[u].add(v)
        blocked = set()
        block_map = defaultdict(set)
        _dfs(s, s, sub, blocked, block_map, [])
        nodes.discard(s)
    return sorted([sorted(c) for c in cycles])
`,
      tests: [
        {
          args: [
            3,
            [
              [0, 1],
              [1, 2],
              [2, 0],
              [1, 0],
            ],
          ],
          expected: [
            [0, 1],
            [0, 1, 2],
          ],
        },
        {
          args: [
            2,
            [
              [0, 1],
              [1, 0],
            ],
          ],
          expected: [[0, 1]],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "johnson-blocking",
      kind: "mcq",
      prompt: "What is the purpose of the 'blocked' set in Johnson's algorithm?",
      options: [
        "Prevents redundant exploration of vertices that can't reach the start",
        "Marks visited vertices permanently",
        "Stores cycle vertices",
        "Tracks SCCs",
      ],
      answer: 0,
      explanation:
        "Blocking prevents exploring paths that are known not to lead back to the current start vertex.",
      hints: ["Think about what happens when a DFS path fails to find a cycle."],
      objective: "Understand the blocking mechanism",
    },
  ],
  exam: {
    definition:
      "Johnson's algorithm finds all elementary cycles by DFS from each vertex with a blocking mechanism to skip futile paths.",
    steps: [
      "Compute SCCs.",
      "For each start vertex, DFS with blocking.",
      "Record cycles, unblock on success.",
      "Remove start and repeat.",
    ],
    timeComplexity: "$O((n+m)(c+1))$",
    spaceComplexity: "$O(n+m)$",
    correctness:
      "The blocking mechanism ensures each path is explored at most once per cycle found; SCC decomposition ensures only reachable vertices are searched.",
    applications: ["Deadlock detection", "Circuit analysis", "Feedback arc sets"],
    limitations: ["Output can be exponential", "SCC computation overhead"],
    faq: [
      {
        q: "Why process by SCC?",
        a: "Cycles only exist within SCCs, so searching across components is wasteful.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Blocking mechanism and DFS description (1). Complexity with c cycles (1)."],
      },
    ],
  },
  references: [
    {
      citation:
        "D. B. Johnson, 'Finding all the elementary circuits of a directed graph,' SIAM Journal on Computing, 4(1), 1975.",
      supports: "The original algorithm.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
