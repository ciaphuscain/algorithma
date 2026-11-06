import type { AlgorithmEntry } from "../types";

export const hierholzerSAlgorithmEntry: AlgorithmEntry = {
  slug: "hierholzer-s-algorithm",
  name: "Hierholzer's Algorithm",
  aliases: ["Hierholzer's Algorithm"],
  curriculum: [242],
  domain: "graphs",
  subcategory: "Graph Algorithms",
  difficulty: "intermediate",
  summary:
    "Finds an Eulerian circuit (a circuit visiting every edge exactly once) in a graph where one exists, in O(V+E) time by stitching together cycles.",
  tags: ["Eulerian circuit", "Euler tour", "graph traversal", "graph"],
  prerequisites: ["DFS"],
  related: ["fleury-s-algorithm"],
  problem: {
    input: "A graph with n vertices and edges (directed or undirected).",
    output: "An Eulerian circuit (list of vertices) or indication that none exists.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Start at any vertex and greedily follow unused edges until returning to the start. If unused edges remain at any vertex along the circuit, start a sub-circuit from there and splice it in. Repeat until all edges are used.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Check Euler circuit condition: all vertices have even degree (undirected) or equal in/out degree (directed).",
          "Start at any vertex. Follow unused edges, removing them, until you return to the start.",
          "If any vertex on the circuit has remaining edges, start a new sub-circuit from there.",
          "Splice the sub-circuit into the main circuit. Repeat until all edges are used.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Use a stack-based implementation: push vertices as you traverse, pop when stuck (backtrack). The reversed stack gives the Euler circuit.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "$O(V + E)$ time: each edge is traversed exactly once. The stack-based version avoids explicit splicing.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Fleury's algorithm is simpler but O(E²) due to bridge-checking at each step.",
          "For directed graphs, the condition changes to equal in-degree and out-degree for each vertex.",
          "An Eulerian path (not circuit) exists when exactly two vertices have odd degree.",
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
      label: "Domain",
      value: "graphs",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "hierholzer",
      code: `def hierholzer(n, edges):
    from collections import defaultdict
    adj = defaultdict(list)
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)
    for u in adj:
        if len(adj[u]) % 2 != 0:
            return None
    if not edges:
        return [0] if n > 0 else []
    stack = [edges[0][0]]
    circuit = []
    while stack:
        u = stack[-1]
        if adj[u]:
            v = adj[u].pop()
            adj[v].remove(u)
            stack.append(v)
        else:
            circuit.append(stack.pop())
    return circuit[::-1]
`,
      tests: [
        {
          args: [
            3,
            [
              [0, 1],
              [1, 2],
              [2, 0],
            ],
          ],
          expected: [0, 2, 1, 0],
        },
        {
          args: [
            3,
            [
              [0, 1],
              [1, 2],
            ],
          ],
          expected: null,
        },
      ],
    },
    {
      language: "javascript",
      entry: "hierholzer",
      code: `function hierholzer(n, edges) {
  const adj = Array.from({length: n}, () => []);
  for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u); }
  for (let i = 0; i < n; i++) if (adj[i].length % 2 !== 0) return null;
  if (!edges.length) return n > 0 ? [0] : [];
  const stack = [edges[0][0]], circuit = [];
  while (stack.length) {
    const u = stack[stack.length - 1];
    if (adj[u].length) {
      const v = adj[u].pop();
      adj[v].splice(adj[v].indexOf(u), 1);
      stack.push(v);
    } else circuit.push(stack.pop());
  }
  return circuit.reverse();
}
`,
      tests: [
        {
          args: [
            3,
            [
              [0, 1],
              [1, 2],
              [2, 0],
            ],
          ],
          expected: [0, 2, 1, 0],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "hierholzer-s-algorithm-q1",
      kind: "mcq",
      prompt: "What condition must a graph satisfy for an Euler circuit to exist?",
      options: [
        "All vertices have even degree",
        "The graph is a tree",
        "All vertices have the same degree",
        "The graph is bipartite",
      ],
      answer: 0,
      explanation:
        "An Euler circuit requires every vertex to have even degree (undirected) so that entering and leaving balance out.",
      hints: ["Think about the algorithm's key property."],
      objective: "Understanding",
    },
  ],
  exam: {
    definition:
      "Hierholzer's algorithm finds an Euler circuit by greedily following edges and splicing sub-circuits.",
    steps: [
      "Check even-degree condition.",
      "Traverse unused edges from a starting vertex.",
      "When stuck, backtrack and splice.",
      "All edges covered in O(V+E).",
    ],
    timeComplexity: "$O(V + E)$.",
    spaceComplexity: "$O(V + E)$.",
    correctness: "The algorithm correctly solves the problem by following its defined procedure.",
    applications: ["graph algorithms"],
    limitations: ["Specific to its problem domain"],
    faq: [
      {
        q: "When should you use Hierholzer's Algorithm?",
        a: "Finds an Eulerian circuit (a circuit visiting every edge exactly once) in a graph where one exists, in O(V+E) time by stitching together cycles.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Define Hierholzer's Algorithm (1).",
          "Describe the algorithm (2).",
          "Analyze complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "Reference for Hierholzer's Algorithm.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
