import type { AlgorithmEntry } from "../types";

export const iterativeDfsEntry: AlgorithmEntry = {
  slug: "iterative-dfs",
  name: "Iterative DFS",
  aliases: ["Iterative DFS"],
  curriculum: [203],
  domain: "graphs",
  subcategory: "Graph Traversal",
  difficulty: "beginner",
  summary:
    "Implements depth-first search using an explicit stack instead of recursion, avoiding stack overflow on deep graphs while preserving O(V+E) time complexity.",
  tags: ["DFS", "iterative", "stack", "graph traversal", "graph"],
  prerequisites: ["DFS"],
  related: ["dfs", "iddfs", "bfs"],
  problem: {
    input: "A graph with n vertices, a list of edges, and a start vertex s.",
    output: "A list of vertices in DFS visit order.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Recursive DFS uses the call stack. Iterative DFS replaces it with an explicit stack data structure, giving the same traversal order while handling graphs too deep for recursion.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Push the start vertex onto the stack.",
          "While the stack is not empty: pop a vertex u. If u is unvisited, mark it visited and add it to the result. Push all unvisited neighbours of u onto the stack.",
          "Return the visit-order list.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Note: iterative DFS may visit vertices in a different order than recursive DFS if neighbours are pushed in forward order (since a stack reverses the order). Push in reverse order to match recursive DFS exactly.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Same as recursive DFS: $O(V + E)$ time, $O(V)$ space for the visited array and stack.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Iterative DFS is essential in languages with small stack limits (e.g., Python's default 1000-frame limit).",
          "Some DFS applications (topological sort, SCC) need careful handling in iterative form to track pre/post-order times.",
          "Iterative deepening DFS (IDDFS) combines the space efficiency of DFS with the optimality of BFS.",
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
    space: "O(V)",
    worstClass: "n",
  },
  properties: [
    {
      label: "Stack",
      value: "Explicit (avoids recursion limit)",
    },
    {
      label: "Order",
      value: "DFS order (deepest-first)",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "iterative_dfs",
      code: `def iterative_dfs(n, edges, s):
    adj = [[] for _ in range(n)]
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)
    visited = [False] * n
    order = []
    stack = [s]
    while stack:
        u = stack.pop()
        if visited[u]:
            continue
        visited[u] = True
        order.append(u)
        for v in reversed(adj[u]):
            if not visited[v]:
                stack.append(v)
    return order
`,
      tests: [
        {
          args: [
            4,
            [
              [0, 1],
              [0, 2],
              [1, 3],
            ],
            0,
          ],
          expected: [0, 1, 3, 2],
        },
        {
          args: [1, [], 0],
          expected: [0],
        },
      ],
    },
    {
      language: "javascript",
      entry: "iterativeDfs",
      code: `function iterativeDfs(n, edges, s) {
  const adj = Array.from({length: n}, () => []);
  for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u); }
  const visited = new Array(n).fill(false);
  const order = [];
  const stack = [s];
  while (stack.length) {
    const u = stack.pop();
    if (visited[u]) continue;
    visited[u] = true;
    order.push(u);
    for (let i = adj[u].length - 1; i >= 0; i--) {
      if (!visited[adj[u][i]]) stack.push(adj[u][i]);
    }
  }
  return order;
}
`,
      tests: [
        {
          args: [
            4,
            [
              [0, 1],
              [0, 2],
              [1, 3],
            ],
            0,
          ],
          expected: [0, 1, 3, 2],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "iterative-dfs-q1",
      kind: "mcq",
      prompt: "Why use iterative DFS instead of recursive DFS?",
      options: [
        "To avoid stack overflow on deep graphs",
        "It is always faster",
        "It uses less memory",
        "It produces a different traversal order",
      ],
      answer: 0,
      explanation:
        "Recursive DFS uses the call stack which has a limited size. Iterative DFS uses an explicit stack that can be as large as needed.",
      hints: ["Consider what limits recursive depth."],
      objective: "Motivation",
    },
  ],
  exam: {
    definition:
      "Iterative DFS performs depth-first search using an explicit stack instead of recursion.",
    steps: [
      "Push start vertex.",
      "Pop, mark visited, push unvisited neighbours.",
      "Repeat until stack is empty.",
    ],
    timeComplexity: "$O(V + E)$.",
    spaceComplexity: "$O(V)$.",
    correctness:
      "The explicit stack mirrors the call stack of recursive DFS, visiting vertices in the same order.",
    applications: ["large graph traversal", "avoiding recursion limits", "game tree search"],
    limitations: ["Tracking pre/post-order requires additional bookkeeping"],
    faq: [
      {
        q: "Does iterative DFS give the same order as recursive?",
        a: "Yes, if neighbours are pushed in reverse order onto the stack.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Describe stack-based algorithm (2).",
          "Compare with recursive DFS (1).",
          "Analyze time and space (2).",
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
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
