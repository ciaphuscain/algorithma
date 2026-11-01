import type { AlgorithmEntry } from "../types";

export const stronglyConnectedComponentsGabowEntry: AlgorithmEntry = {
  slug: "strongly-connected-components-gabow",
  name: "Strongly Connected Components (Gabow)",
  aliases: ["Strongly Connected Components (Gabow)"],
  curriculum: [227],
  domain: "graphs",
  subcategory: "Graph Algorithms",
  difficulty: "advanced",
  summary:
    "Finds all strongly connected components in a directed graph using Gabow's path-based algorithm with two stacks, achieving O(V+E) time in a single DFS pass.",
  tags: ["SCC", "Gabow", "DFS", "directed graph", "graph"],
  prerequisites: ["DFS"],
  related: ["kosaraju", "tarjan-scc"],
  problem: {
    input: "A directed graph with n vertices and directed edges.",
    output: "A list of component IDs, one per vertex.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Gabow's algorithm uses two stacks during DFS. Stack S stores all visited vertices; stack P tracks SCC boundaries. When DFS finishes a vertex that is an SCC root (its boundary), pop all vertices above it from S to form one SCC.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Run DFS. Push each visited vertex onto both stacks S and P with its preorder number.",
          "When an edge leads to a vertex already on S, pop P until P's top has a preorder ≤ that vertex (merging SCCs).",
          "When DFS finishes a vertex v and P's top is v, pop P and pop S until v (inclusive) to form an SCC.",
          "This processes all SCCs in a single DFS pass.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Use preorder numbers for comparison. The P stack tracks SCC root candidates; when an SCC is identified, all its vertices are consecutive on S.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "$O(V + E)$ time: each vertex is pushed and popped from each stack at most once. Space $O(V)$ for the two stacks and the preorder array.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Gabow's is an alternative to Tarjan's algorithm, also O(V+E) in a single pass.",
          "Useful when you want SCC identification without explicit lowlink values.",
          "Both Gabow's and Tarjan's are superior to Kosaraju's in that they need only one DFS pass.",
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
    worstClass: "n + m",
  },
  properties: [
    {
      label: "DFS passes",
      value: "1",
    },
    {
      label: "Stacks used",
      value: "2",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "gabow_scc",
      code: `def gabow_scc(n, edges):
    adj = [[] for _ in range(n)]
    for u, v in edges:
        adj[u].append(v)
    comp = [-1] * n
    preorder = [0] * n
    S = []
    P = []
    cnt = [0]
    c = [0]
    def dfs(u):
        preorder[u] = cnt[0]
        cnt[0] += 1
        S.append(u)
        P.append(u)
        for v in adj[u]:
            if comp[v] != -1:
                continue
            if preorder[v] == -1:
                dfs(v)
            else:
                while P and preorder[P[-1]] > preorder[v]:
                    P.pop()
        if P and P[-1] == u:
            P.pop()
            scc = []
            while True:
                w = S.pop()
                comp[w] = c[0]
                scc.append(w)
                if w == u:
                    break
            c[0] += 1
    preorder = [-1] * n
    for i in range(n):
        if preorder[i] == -1:
            dfs(i)
    return comp
`,
      tests: [
        {
          args: [
            5,
            [
              [0, 1],
              [1, 2],
              [2, 0],
              [1, 3],
              [3, 4],
            ],
          ],
          expected: [0, 0, 0, 1, 2],
        },
        {
          args: [
            3,
            [
              [0, 1],
              [1, 2],
            ],
          ],
          expected: [0, 1, 2],
        },
      ],
    },
    {
      language: "javascript",
      entry: "gabowScc",
      code: `function gabowScc(n, edges) {
  const adj = Array.from({length: n}, () => []);
  for (const [u, v] of edges) adj[u].push(v);
  const comp = new Array(n).fill(-1);
  const pre = new Array(n).fill(-1);
  const S = [], P = [];
  let cnt = 0, c = 0;
  function dfs(u) {
    pre[u] = cnt++;
    S.push(u); P.push(u);
    for (const v of adj[u]) {
      if (comp[v] !== -1) continue;
      if (pre[v] === -1) dfs(v);
      else { while (P.length && pre[P[P.length-1]] > pre[v]) P.pop(); }
    }
    if (P.length && P[P.length-1] === u) {
      P.pop();
      let w;
      do { w = S.pop(); comp[w] = c; } while (w !== u);
      c++;
    }
  }
  for (let i = 0; i < n; i++) if (pre[i] === -1) dfs(i);
  return comp;
}
`,
      tests: [
        {
          args: [
            5,
            [
              [0, 1],
              [1, 2],
              [2, 0],
              [1, 3],
              [3, 4],
            ],
          ],
          expected: [0, 0, 0, 1, 2],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "gabow-scc-q1",
      kind: "mcq",
      prompt: "How many DFS passes does Gabow's SCC algorithm need?",
      options: ["One", "Two", "Three", "It depends on the graph"],
      answer: 0,
      explanation: "Gabow's algorithm identifies all SCCs in a single DFS pass using two stacks.",
      hints: ["Compare with Kosaraju's which needs two passes."],
      objective: "DFS passes",
    },
  ],
  exam: {
    definition:
      "Gabow's algorithm finds SCCs in one DFS pass using two stacks: S for all visited vertices and P for SCC boundary tracking.",
    steps: [
      "DFS: push onto S and P.",
      "On back edge: pop P to merge SCCs.",
      "When P's top equals current vertex: pop S to form SCC.",
    ],
    timeComplexity: "$O(V + E)$.",
    spaceComplexity: "$O(V)$.",
    correctness: "The P stack correctly identifies SCC roots; S stores SCCs contiguously.",
    applications: ["2-SAT", "compiler analysis", "model checking"],
    limitations: ["Recursive DFS may overflow on deep graphs"],
    faq: [
      {
        q: "How does Gabow compare to Tarjan?",
        a: "Both are O(V+E) single-pass algorithms; Gabow uses two stacks instead of lowlink values.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define SCC (1).",
          "Two-stack DFS algorithm (2).",
          "Prove O(V+E) correctness (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "H. N. Gabow, 'Path-based depth-first search for strong and biconnected components', Information Processing Letters, 2000.",
      supports: "Original paper.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
