import type { AlgorithmEntry } from "../types";

export const binaryLiftingEntry: AlgorithmEntry = {
  slug: "binary-lifting",
  name: "Binary Lifting and Lowest Common Ancestor",
  aliases: ["Jump pointers", "LCA", "Lowest common ancestor", "k-th ancestor", "Doubling on trees"],
  curriculum: [187, 188],
  domain: "trees",
  subcategory: "Tree techniques",
  difficulty: "intermediate",
  summary:
    "Stores, for every vertex, its ancestors 1, 2, 4, 8, … levels up. Any ancestor is reached by O(log n) jumps (one per bit of the distance), and the lowest common ancestor of two vertices takes O(log n) after O(n log n) preprocessing.",
  tags: ["lca", "ancestor", "jump pointers", "doubling", "tree queries"],
  prerequisites: ["Trees", "Breadth-First Search", "Binary numbers"],
  related: ["heavy-light", "sparse-table", "tree-traversals"],
  problem: {
    input: "A rooted tree and pairs of vertices.",
    output: "For each pair (u, v), the deepest vertex that is an ancestor of both.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "To climb 13 levels you could step up 13 times. If every vertex also remembered the vertex 8 levels up, 4 up, 2 up and 1 up, you could climb 13 = 8 + 4 + 1 levels in three jumps. Those remembered ancestors are cheap to build, because the vertex 8 levels up is the vertex 4 levels above the one 4 levels up.",
      },
      {
        kind: "p",
        text: "For the lowest common ancestor, first lift the deeper vertex to the other's depth. If they now coincide, that vertex is the answer. Otherwise jump both up by the largest power of two that keeps them apart, then the next smaller one, and so on. They end just below their meeting point, which is one parent up.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Compute depths and parents breadth-first: $up[0][v] = parent(v)$, with the root its own parent.",
          "For $k = 1, \\dots, K - 1$: $up[k][v] = up[k-1][\\,up[k-1][v]\\,]$. $K$ is the smallest number with $2^K$ greater than the largest depth.",
          "LCA(u, v): make $u$ the deeper one and lift it by $d = depth[u] - depth[v]$, jumping $up[k]$ for every bit $k$ set in $d$.",
          "If $u = v$, return it. Otherwise, for $k = K-1$ down to $0$: if $up[k][u] \\ne up[k][v]$, set $u = up[k][u]$ and $v = up[k][v]$.",
          "Return $up[0][u]$.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset). The tree is A → {B, C}, B → {D, E}, C → F, E → {G, H}, G → I, I → J, F → K, K → L. The deepest vertex is J at depth 5, so $K = 3$. Some rows of the table:",
      },
      {
        kind: "table",
        head: ["v", "depth", "up[0] (1 up)", "up[1] (2 up)", "up[2] (4 up)"],
        rows: [
          ["E", "2", "B", "A", "A"],
          ["I", "4", "G", "E", "A"],
          ["J", "5", "I", "G", "B"],
          ["L", "4", "K", "F", "A"],
        ],
      },
      {
        kind: "table",
        head: ["Query", "Equalise depths", "Jumps from k = 2 down", "Answer"],
        rows: [
          ["LCA(J, D)", "d = 3 = 11₂: J → I → E", "A = A, A = A, B = B: no jumps", "up[0][E] = B"],
          ["LCA(H, J)", "d = 2 = 10₂: J → G", "A = A, B = B, E = E: no jumps", "up[0][G] = E"],
          [
            "LCA(L, J)",
            "d = 1: J → I",
            "A = A; k = 1: E ≠ F, jump to (E, F); k = 0: B ≠ C, jump to (B, C)",
            "up[0][B] = A",
          ],
        ],
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Letting the root be its own parent keeps every table entry valid; an alternative is −1 with explicit checks (the JavaScript sample).",
          "Build the table breadth-first (or in DFS preorder) so a parent's row is complete before its children use it, or build it level by level in $k$ as here.",
          "Store the table as $up[k][v]$ (one array per power): the inner loops then run over contiguous memory.",
          "Recursion depth for computing depths can reach $n$; use an explicit queue.",
          "The same table answers k-th ancestor queries and, with extra per-jump values (minimum edge weight, sums), path aggregates.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Table recurrence.** Climbing $2^k$ levels is climbing $2^{k-1}$ levels twice, so $up[k][v] = up[k-1][up[k-1][v]]$ (saturating at the root).",
      },
      {
        kind: "p",
        text: "**Correctness of the descent.** After equalising depths, let $w$ be the LCA, $h \\ge 1$ levels above $u$ and $v$. Their ancestors at distance $d$ coincide exactly when $d \\ge h$. Trying $k$ from high to low and jumping only when the $2^k$-level ancestors differ climbs $h - 1$ levels in total, one binary digit at a time, leaving $u$ and $v$ one level below $w$.",
      },
      { kind: "math", tex: "\\text{build } O(n \\log n), \\qquad \\text{query } O(\\log n)" },
      {
        kind: "p",
        text: "The property tests check that a query never reads more than $3K + 1$ table cells: at most $K$ to equalise depths, $2K$ in the descent and one final parent.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Euler tour plus a sparse table answers LCA in $O(1)$ after $O(n \\log n)$ preprocessing, via range-minimum queries on depths.",
          "Tarjan's offline LCA answers a batch of queries in near-linear time with union-find.",
          "Schieber and Vishkin, and Bender and Farach-Colton, gave $O(n)$ preprocessing with $O(1)$ queries.",
          "Binary lifting also works on any function graph: the $2^k$-th successor of each element (e.g. for simulating many steps of a permutation).",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(n \\log n)", average: "O(n \\log n)", worst: "O(n \\log n)" },
    space: "O(n \\log n)",
    worstClass: "n log n",
    note: "Preprocessing; each LCA or k-th ancestor query takes $O(\\log n)$.",
  },
  properties: [
    { label: "Query", value: "$O(\\log n)$ table lookups" },
    { label: "Table", value: "$\\lceil \\log_2(\\text{depth} + 1) \\rceil$ rows × n" },
  ],
  implementations: [
    {
      language: "python",
      entry: "lca_queries",
      code: `def lca_queries(parent, queries):
    # parent[v] = parent of v, -1 for the root
    n = len(parent)
    root = parent.index(-1)
    children = [[] for _ in range(n)]
    for v, p in enumerate(parent):
        if p != -1:
            children[p].append(v)
    depth, order = [0] * n, [root]
    for v in order:                      # breadth-first
        for c in children[v]:
            depth[c] = depth[v] + 1
            order.append(c)
    K = max(1, max(depth).bit_length())
    up = [[root if p == -1 else p for p in parent]]
    for k in range(1, K):
        up.append([up[k - 1][up[k - 1][v]] for v in range(n)])
    answers = []
    for u, v in queries:
        if depth[u] < depth[v]:
            u, v = v, u
        diff = depth[u] - depth[v]
        for k in range(K):
            if diff >> k & 1:
                u = up[k][u]
        if u != v:
            for k in reversed(range(K)):
                if up[k][u] != up[k][v]:
                    u, v = up[k][u], up[k][v]
            u = up[0][u]
        answers.append(u)
    return answers
`,
      tests: [
        {
          args: [
            [-1, 0, 0, 1, 1, 2, 4, 4, 6, 8, 5, 10],
            [
              [9, 3],
              [7, 9],
              [11, 9],
            ],
          ],
          expected: [1, 4, 0],
        },
        { args: [[-1], [[0, 0]]], expected: [0] },
      ],
    },
    {
      language: "javascript",
      entry: "kthAncestor",
      code: `// k-th ancestor of v with a binary-lifting table; -1 if it does not exist.
function kthAncestor(parent, v, k) {
  const n = parent.length, up = [parent.slice()];
  for (let j = 1; (1 << j) <= n; j++)
    up.push(up[j - 1].map((p) => (p === -1 ? -1 : up[j - 1][p])));
  for (let j = 0; v !== -1 && k > 0; j++, k >>= 1) {
    if (j >= up.length) return -1;
    if (k & 1) v = up[j][v];
  }
  return v;
}
`,
      tests: [
        { args: [[-1, 0, 0, 1, 1, 2, 4, 4, 6, 8, 5, 10], 9, 3], expected: 4 },
        { args: [[-1, 0, 0, 1, 1, 2, 4, 4, 6, 8, 5, 10], 9, 5], expected: 0 },
        { args: [[-1, 0, 0, 1, 1, 2, 4, 4, 6, 8, 5, 10], 9, 6], expected: -1 },
      ],
    },
  ],
  visualizer: "binary-lifting",
  practice: [
    {
      id: "lifting-rows",
      kind: "numeric",
      prompt:
        "A path of 10 vertices is rooted at one end, so the deepest vertex has depth 9. How many rows (powers of two) does the lifting table need?",
      answer: 4,
      explanation:
        "Rows k = 0..3 give jumps of 1, 2, 4 and 8, which combine to any distance up to 15 ≥ 9; three rows reach only 7.",
      hints: ["Find the smallest K with 2^K > 9."],
      objective: "Size the table",
    },
    {
      id: "lifting-descent",
      kind: "mcq",
      prompt: "After equalising depths, why does the descent jump only when up[k][u] ≠ up[k][v]?",
      options: [
        "Equal ancestors may already be above the LCA, so jumping could overshoot it",
        "Because equal entries mean the table is wrong",
        "To make the loop run in constant time",
        "Because u and v must stay at different depths",
      ],
      answer: 0,
      explanation:
        "Equal 2^k-th ancestors are common ancestors but not necessarily the lowest; jumping only while they differ keeps both strictly below the LCA, which is then one parent up.",
      distractors: {
        1: "Equal entries are expected for large k.",
        2: "The loop still runs K times.",
        3: "They stay at the same depth throughout the descent.",
      },
      hints: ["What do you know about a vertex that is a common ancestor?"],
      objective: "Understand the descent",
    },
  ],
  exam: {
    definition:
      "Binary lifting precomputes up[k][v], the 2^k-th ancestor of every vertex, so that any ancestor is reached in O(log n) jumps; it answers LCA queries by equalising depths and then lifting both vertices from the largest jump down.",
    steps: [
      "BFS: depth[v], up[0][v] = parent(v).",
      "up[k][v] = up[k − 1][up[k − 1][v]].",
      "LCA: lift the deeper vertex by the depth difference (its bits).",
      "If equal, done; else for k from high to low, jump both while their ancestors differ.",
      "Answer: up[0][u].",
    ],
    timeComplexity: "$O(n \\log n)$ preprocessing, $O(\\log n)$ per query.",
    spaceComplexity: "$O(n \\log n)$.",
    correctness:
      "Jumps compose because 2^k = 2^(k−1) + 2^(k−1); the descent writes the distance to just below the LCA in binary, from its highest bit.",
    applications: [
      "Lowest common ancestor and tree distances",
      "k-th ancestor queries",
      "Path maxima/minima with augmented tables",
      "Simulating many steps of a function",
    ],
    limitations: ["$O(n \\log n)$ memory", "Static trees (rebuild after changes)"],
    faq: [
      {
        q: "Distance between two vertices?",
        a: "depth[u] + depth[v] − 2·depth[LCA(u, v)].",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Table of 2^k-th ancestors.", "LCA in $O(\\log n)$ after $O(n \\log n)$."],
      },
      {
        marks: 5,
        outline: [
          "Recurrence for the table (1).",
          "Equalising depths (1).",
          "Descent (2).",
          "Complexity (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "LCA definition and naive method (1).",
          "Table recurrence and build (2).",
          "Query algorithm (2).",
          "Worked example (2).",
          "Correctness of the descent (2).",
          "Alternatives: Euler tour + RMQ, Tarjan offline (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "M. A. Bender, M. Farach-Colton, “The level ancestor problem simplified,” Theoretical Computer Science, 321(1), 2004.",
      supports: "Jump pointers (ancestors at power-of-two distances) for ancestor queries.",
    },
    {
      citation:
        "M. A. Bender, M. Farach-Colton, “The LCA problem revisited,” LATIN 2000, LNCS 1776.",
      supports: "LCA by Euler tour and range-minimum queries.",
    },
    {
      citation:
        "B. Schieber, U. Vishkin, “On finding lowest common ancestors: simplification and parallelization,” SIAM Journal on Computing, 17(6), 1988.",
      supports: "Constant-time LCA queries after linear preprocessing.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-23",
};
