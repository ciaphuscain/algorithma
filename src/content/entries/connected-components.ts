import type { AlgorithmEntry } from "../types";

export const connectedComponentsEntry: AlgorithmEntry = {
  slug: "connected-components",
  name: "Connected Components",
  aliases: ["Connected Components"],
  curriculum: [224],
  domain: "graphs",
  subcategory: "Graph Traversal",
  difficulty: "beginner",
  summary:
    "Finds all connected components in an undirected graph by running BFS or DFS from each unvisited vertex, assigning a component label to every vertex.",
  tags: ["connected components", "BFS", "DFS", "graph traversal", "graph"],
  prerequisites: ["BFS", "DFS"],
  related: ["union-find", "kosaraju"],
  problem: {
    input: "An undirected graph with n vertices (0-indexed) and a list of edges.",
    output:
      "A list of component labels, one per vertex, where vertices in the same component share the same label.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Pick any unvisited vertex and explore everything reachable from it — that is one connected component. Repeat for remaining unvisited vertices until every vertex has a label.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Initialize all vertices as unvisited. Set component counter to 0.",
          "For each unvisited vertex v: run DFS/BFS from v, labelling all reachable vertices with the current component number, then increment the counter.",
          "Return the label array.",
        ],
      },
      {
        kind: "p",
        text: "**Example.** Edges: 0–1, 1–2, 3–4. Result: vertices 0,1,2 get label 0; vertices 3,4 get label 1.",
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Use an iterative DFS with a stack to avoid recursion-depth issues on large graphs. The component array doubles as the visited marker (−1 = unvisited).",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Each vertex and edge is processed exactly once across all DFS/BFS calls, giving $O(V + E)$ time and $O(V + E)$ space (adjacency list plus labels).",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "For directed graphs, use Kosaraju's or Tarjan's algorithm for strongly connected components.",
          "Union-Find is an alternative that supports dynamic edge insertions.",
          "Parallel BFS can find components on distributed graphs.",
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
      value: "DFS or BFS from each unvisited vertex",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "connected_components",
      code: `def connected_components(n, edges):
    adj = [[] for _ in range(n)]
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)
    comp = [-1] * n
    c = 0
    for i in range(n):
        if comp[i] == -1:
            stack = [i]
            comp[i] = c
            while stack:
                u = stack.pop()
                for v in adj[u]:
                    if comp[v] == -1:
                        comp[v] = c
                        stack.append(v)
            c += 1
    return comp
`,
      tests: [
        {
          args: [
            5,
            [
              [0, 1],
              [1, 2],
              [3, 4],
            ],
          ],
          expected: [0, 0, 0, 1, 1],
        },
        {
          args: [3, []],
          expected: [0, 1, 2],
        },
        {
          args: [1, []],
          expected: [0],
        },
      ],
    },
    {
      language: "javascript",
      entry: "connectedComponents",
      code: `function connectedComponents(n, edges) {
  const adj = Array.from({length: n}, () => []);
  for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u); }
  const comp = new Array(n).fill(-1);
  let c = 0;
  for (let i = 0; i < n; i++) {
    if (comp[i] === -1) {
      const stack = [i];
      comp[i] = c;
      while (stack.length) {
        const u = stack.pop();
        for (const v of adj[u]) {
          if (comp[v] === -1) { comp[v] = c; stack.push(v); }
        }
      }
      c++;
    }
  }
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
              [3, 4],
            ],
          ],
          expected: [0, 0, 0, 1, 1],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "connected-components-q1",
      kind: "mcq",
      prompt: "What is the time complexity of finding connected components?",
      options: ["O(V + E)", "O(V * E)", "O(V^2)", "O(E log V)"],
      answer: 0,
      explanation: "Each vertex and edge is visited exactly once across all traversals.",
      hints: ["Consider how many times each edge is examined."],
      objective: "Time complexity",
    },
  ],
  exam: {
    definition:
      "Connected components partition an undirected graph into maximal sets of vertices where every pair is connected by a path.",
    steps: [
      "For each unvisited vertex, run DFS/BFS to find its component.",
      "Label all reachable vertices with the same component ID.",
      "Increment the component counter.",
    ],
    timeComplexity: "$O(V + E)$.",
    spaceComplexity: "$O(V + E)$.",
    correctness:
      "BFS/DFS visits exactly the connected component of its start vertex; iterating over all vertices covers every component.",
    applications: ["network analysis", "image processing (flood fill)", "social network clusters"],
    limitations: ["Only for undirected graphs; use SCC algorithms for directed graphs"],
    faq: [
      {
        q: "Can Union-Find also find components?",
        a: "Yes: process each edge with Union, then vertices sharing a root are in the same component.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define connected component (1).",
          "DFS/BFS exploration loop (2).",
          "Prove O(V+E) time (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "Chapter 22: Elementary Graph Algorithms.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
