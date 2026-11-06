import type { AlgorithmEntry } from "../types";

export const parallelBfsEntry: AlgorithmEntry = {
  slug: "parallel-bfs",
  name: "Parallel BFS",
  aliases: ["Level-synchronous BFS"],
  curriculum: [462],
  domain: "parallel",
  subcategory: "Parallel Algorithms",
  difficulty: "intermediate",
  summary:
    "Explores a graph level by level, processing all vertices at the same BFS distance from the source in parallel, achieving a span of O(D) where D is the graph diameter.",
  tags: ["parallel", "BFS", "graph traversal", "level-synchronous"],
  prerequisites: ["BFS", "Parallel Prefix Sum (Scan)"],
  related: ["bfs", "parallel-dfs"],
  problem: {
    input: "A graph and a source vertex, with p processors available.",
    output: "BFS distances from the source, computed in parallel.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Standard BFS processes one vertex at a time from a queue. But all vertices at the same distance from the source are independent — they can be explored simultaneously. Parallel BFS exploits this by processing each level as a batch.",
      },
      {
        kind: "p",
        text: "The number of sequential steps equals the number of BFS levels (the diameter D), regardless of the graph size, making it efficient on wide graphs.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Start with the source in the current frontier.",
          "In parallel, each vertex in the frontier examines its neighbours.",
          "Neighbours not yet visited form the next frontier (use atomic compare-and-swap to avoid duplicates).",
          "Repeat until the frontier is empty.",
        ],
      },
      {
        kind: "p",
        text: "**Example:** A complete binary tree of depth 3 rooted at the source: level 0 has 1 node, level 1 has 2, level 2 has 4. Each level is processed in one parallel step.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Use a frontier array and a next-frontier array; swap after each level.",
          "Atomic operations prevent two threads from visiting the same vertex twice.",
          "Prefix sum compacts the next frontier efficiently.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Work is $O(V + E)$ same as sequential BFS. Span (parallel depth) is $O(D \\log V)$ where $D$ is the diameter, and the $\\log V$ comes from prefix-sum compaction of each frontier.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Direction-optimising BFS (Beamer et al.) switches between top-down and bottom-up exploration based on frontier size.",
          "Used in the Graph500 benchmark for ranking supercomputers.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O((V+E)/p)",
      average: "O((V+E)/p)",
      worst: "O((V+E)/p)",
    },
    space: "O(V)",
    worstClass: "n",
    note: "Span is O(D log V) where D is the graph diameter.",
  },
  properties: [
    {
      label: "Work",
      value: "$O(V + E)$",
    },
    {
      label: "Span",
      value: "$O(D \\log V)$",
    },
    {
      label: "Parallelism",
      value: "Level-synchronous",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "parallel_bfs",
      code: `def parallel_bfs(adj, source):
    """Simulate parallel BFS (level-synchronous). adj: adjacency list. Returns distances."""
    n = len(adj)
    dist = [-1] * n
    dist[source] = 0
    frontier = [source]
    d = 0
    while frontier:
        next_frontier = []
        for u in frontier:
            for v in adj[u]:
                if dist[v] == -1:
                    dist[v] = d + 1
                    next_frontier.append(v)
        d += 1
        frontier = next_frontier
    return dist
`,
      tests: [
        {
          args: [
            [
              [1, 2],
              [0, 3],
              [0, 3],
              [1, 2],
            ],
            0,
          ],
          expected: [0, 1, 1, 2],
        },
        {
          args: [[[1], [2], [3], []], 0],
          expected: [0, 1, 2, 3],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "pbfs-span",
      kind: "mcq",
      prompt: "What determines the span (parallel depth) of parallel BFS?",
      options: [
        "The graph diameter",
        "The number of edges",
        "The number of vertices",
        "The number of processors",
      ],
      answer: 0,
      explanation:
        "Each BFS level is one parallel step, so the span is proportional to the diameter.",
      hints: ["How many levels does BFS have?"],
      objective: "Understand parallel BFS span",
    },
  ],
  exam: {
    definition:
      "Parallel BFS processes all vertices at the same distance from the source simultaneously, achieving span proportional to the graph diameter.",
    steps: [
      "Init frontier = {source}.",
      "In parallel, explore all neighbours of frontier vertices.",
      "Next frontier = newly discovered vertices.",
      "Repeat until frontier is empty.",
    ],
    timeComplexity: "$O((V+E)/p)$ with p processors.",
    spaceComplexity: "$O(V)$.",
    correctness: "Same work as sequential BFS; span is O(D log V) for diameter D.",
    applications: [
      "Graph analytics on large graphs",
      "Social network analysis",
      "Supercomputer benchmarks",
    ],
    limitations: ["Poor parallelism on high-diameter graphs"],
    faq: [
      {
        q: "Why atomic operations?",
        a: "Two threads may discover the same vertex simultaneously; atomics prevent duplicate visits.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Level-synchronous approach and span analysis (2)."],
      },
    ],
  },
  references: [
    {
      citation:
        'A. Buluç, K. Madduri, "Parallel Breadth-First Search on Distributed Memory Systems," SC 2011.',
      supports: "Level-synchronous parallel BFS on distributed systems.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
