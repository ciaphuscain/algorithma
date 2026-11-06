import type { AlgorithmEntry } from "../types";

export const pathCompressionEntry: AlgorithmEntry = {
  slug: "path-compression",
  name: "Path Compression",
  aliases: ["Path Compression"],
  curriculum: [223],
  domain: "graphs",
  subcategory: "Union-Find",
  difficulty: "beginner",
  summary:
    "An optimization for Union-Find that flattens the tree structure during Find operations by making every visited node point directly to the root, achieving nearly O(1) amortized time.",
  tags: ["union-find", "disjoint set", "path compression", "graph"],
  prerequisites: ["Union-Find"],
  related: ["union-find", "connected-components"],
  problem: {
    input: "A sequence of union and find operations on n elements.",
    output: "For each find, the representative (root) of the element's set.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "In Union-Find, the Find operation walks up parent pointers to the root. Path compression makes every node on that path point directly to the root, so future Finds are almost instant.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Find(x): follow parent pointers from x to the root r.",
          "Walk the path again, setting each node's parent to r (path compression).",
          "Return r.",
          "Union(x, y): find roots of x and y; if different, make one the child of the other (by rank or size).",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Path compression can be done recursively (one-pass) or iteratively (two-pass). Combined with union by rank, the amortized time per operation is $O(\\alpha(n))$.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "With union by rank and path compression, any sequence of $m$ operations on $n$ elements takes $O(m \\cdot \\alpha(n))$ time, where $\\alpha$ is the inverse Ackermann function — effectively constant for all practical inputs ($\\alpha(n) \\le 4$ for $n \\le 2^{2^{2^{65536}}}$).",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Path splitting and path halving are simpler alternatives with the same amortized bound.",
          "Without path compression, union by rank alone gives O(log n) per operation.",
          "Path compression alone (without union by rank) gives O(log n) amortized.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(1)",
      average: "O(α(n))",
      worst: "O(α(n))",
    },
    space: "O(n)",
    worstClass: "n + m",
  },
  properties: [
    {
      label: "Amortized cost",
      value: "O(α(n)) per operation",
    },
    {
      label: "Combined with",
      value: "Union by rank for optimal performance",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "path_compression_uf",
      code: `def path_compression_uf(n, ops):
    """ops = list of ["find", x] or ["union", x, y]. Returns list of find results."""
    parent = list(range(n))
    rank = [0] * n
    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]
    def union(x, y):
        rx, ry = find(x), find(y)
        if rx == ry: return
        if rank[rx] < rank[ry]: rx, ry = ry, rx
        parent[ry] = rx
        if rank[rx] == rank[ry]: rank[rx] += 1
    results = []
    for op in ops:
        if op[0] == "find":
            results.append(find(op[1]))
        else:
            union(op[1], op[2])
    return results
`,
      tests: [
        {
          args: [
            5,
            [
              ["union", 0, 1],
              ["union", 2, 3],
              ["union", 1, 3],
              ["find", 0],
              ["find", 3],
            ],
          ],
          expected: [0, 0],
        },
        {
          args: [
            3,
            [
              ["find", 0],
              ["find", 1],
              ["find", 2],
            ],
          ],
          expected: [0, 1, 2],
        },
      ],
    },
    {
      language: "javascript",
      entry: "pathCompressionUf",
      code: `function pathCompressionUf(n, ops) {
  const parent = Array.from({length: n}, (_, i) => i);
  const rank = new Array(n).fill(0);
  function find(x) {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }
  function union(x, y) {
    let rx = find(x), ry = find(y);
    if (rx === ry) return;
    if (rank[rx] < rank[ry]) { const t = rx; rx = ry; ry = t; }
    parent[ry] = rx;
    if (rank[rx] === rank[ry]) rank[rx]++;
  }
  const results = [];
  for (const op of ops) {
    if (op[0] === "find") results.push(find(op[1]));
    else union(op[1], op[2]);
  }
  return results;
}
`,
      tests: [
        {
          args: [
            5,
            [
              ["union", 0, 1],
              ["union", 2, 3],
              ["union", 1, 3],
              ["find", 0],
              ["find", 3],
            ],
          ],
          expected: [0, 0],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "path-compression-q1",
      kind: "mcq",
      prompt: "What does path compression do during a Find operation?",
      options: [
        "Makes every node on the find path point directly to the root",
        "Splits the path into two halves",
        "Increases the rank of the root",
        "Merges two trees",
      ],
      answer: 0,
      explanation:
        "Path compression flattens the tree by making every visited node a direct child of the root, speeding up future finds.",
      hints: ["Think about what happens to intermediate nodes on the find path."],
      objective: "Path compression",
    },
  ],
  exam: {
    definition:
      "Path compression is a Union-Find optimization that makes every node on the find path point directly to the root.",
    steps: [
      "Find root by following parent pointers.",
      "Set every visited node's parent to the root.",
      "Combined with union by rank, gives O(α(n)) amortized.",
    ],
    timeComplexity: "$O(\\alpha(n))$ amortized per operation.",
    spaceComplexity: "$O(n)$.",
    correctness:
      "Path compression preserves set membership (all nodes still belong to the same root) while reducing tree height.",
    applications: ["Kruskal's algorithm", "connected components", "equivalence classes"],
    limitations: ["Not persistent without additional data structures"],
    faq: [
      {
        q: "What is α(n)?",
        a: "The inverse Ackermann function, which grows so slowly that α(n) ≤ 4 for any practical input size.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Describe Union-Find (1).",
          "Explain path compression (2).",
          "State amortized bound with proof sketch (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "R. E. Tarjan, 'Efficiency of a Good but Not Linear Set Union Algorithm', JACM, 1975.",
      supports: "Original amortized analysis.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
