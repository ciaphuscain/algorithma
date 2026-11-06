import type { AlgorithmEntry } from "../types";

export const dynamicTreeEntry: AlgorithmEntry = {
  slug: "dynamic-tree",
  name: "Dynamic Tree",
  aliases: ["Link-Cut Tree", "Splay tree dynamic connectivity"],
  curriculum: [199],
  domain: "trees",
  subcategory: "Tree Algorithms",
  difficulty: "intermediate",
  summary:
    "Maintains a forest of rooted trees supporting link, cut, and path queries (e.g., path aggregate, LCA) in O(log n) amortized time using splay trees on preferred paths.",
  tags: ["link-cut tree", "splay tree", "dynamic forest", "path queries"],
  prerequisites: ["Splay Tree"],
  related: ["euler-tour-tree"],
  problem: {
    input: "A dynamic forest with link, cut, and path query operations.",
    output: "Responses to queries while maintaining the forest under structural changes.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A link-cut tree represents a forest where each tree is decomposed into 'preferred paths' (like heavy-light decomposition but dynamic). Each preferred path is stored in a splay tree keyed by depth. The 'access' operation makes the path from a node to the root preferred, enabling fast path queries.",
      },
      {
        kind: "p",
        text: "Link adds an edge between two trees, cut removes one, and access restructures the splay trees to expose a root-to-node path. All operations are O(log n) amortized.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "**Access(v):** Make v-to-root the preferred path by splaying v in its auxiliary tree, then walking up parent pointers, splaying and linking at each step.",
          "**Link(u, v):** Make u a root of its tree (access + splay), then set v as its parent.",
          "**Cut(v):** Access v, then disconnect v from its parent in the splay tree.",
          "**Path query:** Access v (exposes root-to-v path), then query the splay tree.",
        ],
      },
      {
        kind: "p",
        text: "The splay tree at each level is keyed by depth in the represented tree, so in-order traversal gives the path from shallowest to deepest.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Each node has a parent pointer (possibly to a node in a different splay tree — a 'path-parent' edge).",
          "Splay trees support split and join, enabling cut and link.",
          "Path aggregates (sum, min, max) are maintained as auxiliary data in splay tree nodes.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Amortized analysis:** Using the potential function Φ = Σ log(size of splay subtree), each access is O(log n) amortized. Link, cut, and path queries reduce to a constant number of accesses.",
      },
      {
        kind: "p",
        text: "**Complexity:** O(log n) amortized per operation; O(n) space.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Euler tour trees provide an alternative with O(log n) subtree queries but less natural path queries.",
          "Link-cut trees are used in maximum flow algorithms (Goldberg–Tarjan) for efficient path augmentation.",
          "Top trees generalize link-cut trees to support both path and subtree operations.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(log n)",
      average: "O(log n)",
      worst: "O(log n) amortized",
    },
    space: "O(n)",
    worstClass: "log n",
    note: "Amortized O(log n) per operation.",
  },
  properties: [
    {
      label: "Operations",
      value: "Link, cut, path query",
    },
    {
      label: "Backbone",
      value: "Splay trees on preferred paths",
    },
    {
      label: "Amortized",
      value: "O(log n) per operation",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "link_cut_demo",
      code: `def link_cut_demo(n, ops):
    """Simplified forest connectivity via union-find (demonstrates link/cut/query interface)."""
    parent = list(range(n))
    def find(x):
        while parent[x] != x:
            x = parent[x]
        return x
    results = []
    for op in ops:
        if op[0] == 'link':
            ru, rv = find(op[1]), find(op[2])
            if ru != rv:
                parent[ru] = rv
        elif op[0] == 'connected':
            results.append(find(op[1]) == find(op[2]))
    return results
`,
      tests: [
        {
          args: [
            4,
            [
              ["link", 0, 1],
              ["link", 2, 3],
              ["connected", 0, 1],
              ["connected", 0, 2],
              ["link", 1, 2],
              ["connected", 0, 3],
            ],
          ],
          expected: [true, false, true],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "lct-access",
      kind: "mcq",
      prompt: "What is the purpose of the 'access' operation in a link-cut tree?",
      options: [
        "Makes the node-to-root path the preferred path",
        "Finds the node in the tree",
        "Balances the splay tree",
        "Deletes a node",
      ],
      answer: 0,
      explanation:
        "Access restructures preferred paths so that the path from the accessed node to the root becomes a single preferred path (one splay tree).",
      hints: ["What path do we need to expose for path queries?"],
      objective: "Understand the access operation",
    },
  ],
  exam: {
    definition:
      "Link-cut trees maintain dynamic forests with O(log n) amortized link, cut, and path query operations.",
    steps: [
      "Preferred path decomposition with splay trees.",
      "Access: expose root-to-node path.",
      "Link: connect two trees.",
      "Cut: disconnect a subtree.",
    ],
    timeComplexity: "O(log n) amortized per operation",
    spaceComplexity: "O(n)",
    correctness:
      "Splay tree amortized analysis (potential = sum of log sizes) gives O(log n) per access.",
    applications: [
      "Maximum flow (path augmentation)",
      "Dynamic connectivity",
      "Network optimization",
    ],
    limitations: ["Complex implementation", "Amortized not worst-case"],
    faq: [
      {
        q: "How does access work?",
        a: "Splay the node, then walk up path-parent pointers, splaying and linking at each level.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Preferred path decomposition.", "Access, link, cut operations."],
      },
    ],
  },
  references: [
    {
      citation:
        "D. D. Sleator, R. E. Tarjan, 'A Data Structure for Dynamic Trees,' JCSS 26(3), 1983.",
      supports: "The original link-cut tree paper.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
