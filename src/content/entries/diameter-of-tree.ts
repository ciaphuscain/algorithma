import type { AlgorithmEntry } from "../types";

export const diameterOfTreeEntry: AlgorithmEntry = {
  slug: "diameter-of-tree",
  name: "Diameter of a Tree",
  aliases: ["Tree Diameter"],
  curriculum: [293],
  domain: "dynamic-programming",
  subcategory: "Tree DP",
  difficulty: "intermediate",
  summary:
    "Find the longest path (in edges) between any two nodes in a tree. DFS computes depth of each subtree; diameter passes through or around each node.",
  tags: ["tree", "diameter", "DFS", "dynamic programming"],
  prerequisites: [],
  related: ["maximum-independent-set-on-tree", "tree-matching-dp"],
  problem: {
    input: "An unweighted tree as adjacency list.",
    output: "The diameter (longest path length in edges).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "At each node, the longest path through it uses the two deepest subtrees. Track the global maximum.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "DFS from any root.",
          "For each node, compute depth = 1 + max child depth.",
          "Diameter candidate at node = sum of two largest child depths.",
          "Global diameter = max over all nodes.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Single DFS, O(n) time. Alternatively: two BFS (furthest from any node, then furthest from that).",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Time $O(n)$, space $O(n)$.",
      },
    ],
    advanced: [
      {
        kind: "p",
        text: "For weighted trees, replace edge count with edge weight. The two-BFS approach also works.",
      },
    ],
  },
  complexity: {
    time: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    space: "O(n)",
    worstClass: "other",
  },
  properties: [],
  implementations: [
    {
      language: "python",
      entry: "treeDiameter",
      code: `def treeDiameter(adj):
    n = len(adj)
    if n <= 1:
        return 0
    diameter = 0
    depth = [0] * n
    visited = [False] * n
    stack = [(0, False)]
    parent = [-1] * n
    order = []
    visited[0] = True
    while stack:
        node, processed = stack.pop()
        if processed:
            d1 = d2 = 0
            for nb in adj[node]:
                if nb != parent[node]:
                    d = depth[nb] + 1
                    if d > d1:
                        d2, d1 = d1, d
                    elif d > d2:
                        d2 = d
            depth[node] = d1
            if d1 + d2 > diameter:
                diameter = d1 + d2
        else:
            stack.append((node, True))
            for nb in adj[node]:
                if not visited[nb]:
                    visited[nb] = True
                    parent[nb] = node
                    stack.append((nb, False))
    return diameter`,
      tests: [
        {
          args: [[[1, 2], [0, 3, 4], [0], [1], [1]]],
          expected: 3,
        },
        {
          args: [[[1], [0]]],
          expected: 1,
        },
      ],
    },
    {
      language: "javascript",
      entry: "treeDiameter",
      code: `function treeDiameter(adj) {
  const n = adj.length;
  if (n <= 1) return 0;
  let diameter = 0;
  const depth = new Array(n).fill(0);
  const visited = new Array(n).fill(false);
  const parent = new Array(n).fill(-1);
  const stack = [[0, false]];
  visited[0] = true;
  while (stack.length) {
    const [node, processed] = stack.pop();
    if (processed) {
      let d1 = 0, d2 = 0;
      for (const nb of adj[node]) {
        if (nb !== parent[node]) {
          const d = depth[nb] + 1;
          if (d > d1) { d2 = d1; d1 = d; }
          else if (d > d2) d2 = d;
        }
      }
      depth[node] = d1;
      diameter = Math.max(diameter, d1 + d2);
    } else {
      stack.push([node, true]);
      for (const nb of adj[node]) {
        if (!visited[nb]) {
          visited[nb] = true;
          parent[nb] = node;
          stack.push([nb, false]);
        }
      }
    }
  }
  return diameter;
}`,
      tests: [
        {
          args: [[[1, 2], [0, 3, 4], [0], [1], [1]]],
          expected: 3,
        },
        {
          args: [[[1], [0]]],
          expected: 1,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "td-q1",
      kind: "mcq",
      prompt: "Star graph with 5 leaves: diameter?",
      options: ["2", "1", "3", "4"],
      answer: 0,
      explanation: "Any path goes through center: leaf-center-leaf = 2 edges.",
      hints: ["Longest path through center."],
      objective: "Computation",
    },
  ],
  exam: {
    definition: "Longest path between any two nodes in a tree.",
    steps: [
      "DFS computing depths.",
      "At each node, combine two deepest subtrees.",
      "Track global max.",
    ],
    timeComplexity: "$O(n)$.",
    spaceComplexity: "$O(n)$.",
    correctness:
      "The diameter either passes through a node using its two deepest branches, or lies entirely in a subtree.",
    applications: ["network design", "tree analysis"],
    limitations: ["trees only"],
    faq: [
      {
        q: "Two-BFS approach?",
        a: "BFS from any node to find furthest, then BFS from there. The second distance is the diameter.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: ["DFS depth computation (2).", "Combining branches (2).", "Correctness (1)."],
      },
    ],
  },
  references: [
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 4th ed., MIT Press, 2022.",
      supports: "Tree algorithms.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
