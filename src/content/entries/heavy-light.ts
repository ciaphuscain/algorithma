import type { AlgorithmEntry } from "../types";

export const heavyLightEntry: AlgorithmEntry = {
  slug: "heavy-light",
  name: "Heavy-Light Decomposition",
  aliases: ["HLD", "Heavy path decomposition", "Path decomposition"],
  curriculum: [190],
  domain: "trees",
  subcategory: "Tree techniques",
  difficulty: "advanced",
  summary:
    "Splits a tree into chains by following each vertex's child with the largest subtree. Numbered depth-first, heavy child first, every chain is a contiguous block of an array, and any path crosses O(log n) chains, so path queries become a few range queries.",
  tags: ["hld", "path queries", "chains", "segment tree", "tree decomposition"],
  prerequisites: ["Depth-First Search", "Segment Tree", "Prefix Sums"],
  related: ["binary-lifting", "segment-tree", "prefix-sums"],
  problem: {
    input: "A rooted tree with a value on every vertex, and pairs of vertices.",
    output: "For each pair, an aggregate (here the sum) of the values on the path between them.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Array range queries are easy: prefix sums, segment trees, sparse tables. Tree paths are not ranges of anything, unless you number the vertices cleverly. If you number each long downward path consecutively, a tree path becomes a few array ranges, one per path it touches.",
      },
      {
        kind: "p",
        text: "Which paths? From every vertex, continue into the child with the biggest subtree (the **heavy** child). Leaving a chain through any other (**light**) child at least halves the subtree you are in, so a walk to the root crosses at most $\\log_2 n$ light edges and touches at most $\\log_2 n + 1$ chains.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Compute subtree sizes bottom-up; each vertex's heavy child is the child with the largest subtree.",
          "Depth-first, visiting the heavy child first: give each vertex the next position $pos[v]$, and $head[v]$ = the top of its chain ($head[parent]$ for a heavy child, itself otherwise).",
          "Put each value at its position in a base array and build a range structure on it (prefix sums for static values, a segment tree for updates).",
          "Path query (u, v): while $head[u] \\ne head[v]$, take the one whose chain head is deeper, add the range $pos[head] .. pos[\\cdot]$, and move to the parent of the head. Then add the range between the two positions on the shared chain.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset). Subtree sizes: A 12, B 7, C 4, E 5, F 3, G 3, I 2, K 2, the rest 1. The chains are A–B–E–G–I–J (positions 0–5), H (6), D (7) and C–F–K–L (8–11), so base = [3, 1, 5, 2, 5, 3, 6, 1, 4, 9, 5, 8].",
      },
      {
        kind: "table",
        head: ["Step (path H … L)", "Chain heads", "Range added", "Running total"],
        rows: [
          [
            "head H (depth 3) is deeper than head C (depth 1)",
            "H vs C",
            "base[6..6] = 6, then go to E",
            "6",
          ],
          [
            "head A (depth 0) is shallower than head C: switch sides",
            "A vs C",
            "base[8..11] = 4 + 9 + 5 + 8 = 26, then go to A",
            "32",
          ],
          [
            "Same chain (A): the range between A and E",
            "A = A",
            "base[0..2] = 3 + 1 + 5 = 9",
            "41",
          ],
        ],
      },
      {
        kind: "p",
        text: "Three ranges for a path of eight vertices. The path J … D needs two (D alone, then B … J on the first chain); total 17.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Two passes: sizes (and depths, parents) in one, positions and heads in a second DFS that visits the heavy child first. Iterative versions avoid deep recursion on path-like trees.",
          "A whole subtree is also contiguous: positions $pos[v] .. pos[v] + size[v] - 1$. So subtree queries come for free.",
          "For values on edges instead of vertices, store each edge's value at its lower endpoint and skip the LCA's own position in the last range.",
          "With a segment tree each range costs $O(\\log n)$, so a path query costs $O(\\log^2 n)$; for static values, prefix sums make it $O(\\log n)$ (as in the visualizer).",
          "Non-commutative aggregates (e.g. composing functions along the path) need care with direction: collect the u-side and v-side ranges separately.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Light edges halve.** If $c$ is a light child of $p$, then some sibling has at least $size(c)$ vertices, so $size(p) \\ge 2\\,size(c) + 1 > 2\\,size(c)$. Walking up from any vertex, each light edge more than doubles the subtree size, which never exceeds $n$:",
      },
      {
        kind: "math",
        tex: "\\#\\text{light edges on a root path} \\le \\lfloor \\log_2 n \\rfloor",
      },
      {
        kind: "p",
        text: "A path $u \\to v$ goes up from $u$ and from $v$ to their LCA, so it uses at most $2\\lfloor \\log_2 n \\rfloor + 1$ ranges. The oracle checks this bound on every run, and the property tests run it on random trees.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Sleator and Tarjan introduced heavy and light edges for link-cut trees, which maintain a similar decomposition while the tree changes.",
          "Centroid decomposition is the other standard tree decomposition: it splits by vertices into a tree of depth $O(\\log n)$ and suits path-counting problems.",
          "The LCA falls out of HLD for free: the loop ends on the chain containing it, at the shallower of the two positions.",
          "Euler-tour techniques handle subtree queries alone more simply; HLD is the tool when queries are on paths.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    space: "O(n)",
    worstClass: "n",
    note: "Decomposition. Each path query uses $O(\\log n)$ ranges: $O(\\log^2 n)$ with a segment tree, $O(\\log n)$ with prefix sums.",
  },
  properties: [
    { label: "Ranges per path", value: "At most $2\\lfloor \\log_2 n \\rfloor + 1$" },
    { label: "Subtrees", value: "Contiguous too: $pos[v] .. pos[v] + size[v] - 1$" },
  ],
  implementations: [
    {
      language: "python",
      entry: "path_sums",
      code: `def path_sums(parent, values, queries):
    n = len(parent)
    root = parent.index(-1)
    children = [[] for _ in range(n)]
    for v, p in enumerate(parent):
        if p != -1:
            children[p].append(v)
    order = [root]
    for v in order:
        order.extend(children[v])
    size, depth = [1] * n, [0] * n
    for v in reversed(order):
        if parent[v] != -1:
            size[parent[v]] += size[v]
    for v in order:
        for c in children[v]:
            depth[c] = depth[v] + 1
    head, pos, base = [0] * n, [0] * n, []
    stack = [(root, root)]
    while stack:                 # depth-first, heavy child first
        v, h = stack.pop()
        head[v], pos[v] = h, len(base)
        base.append(values[v])
        if children[v]:
            heavy = max(children[v], key=lambda c: size[c])
            stack.extend((c, c) for c in children[v] if c != heavy)
            stack.append((heavy, h))
    prefix = [0]
    for x in base:
        prefix.append(prefix[-1] + x)
    answers = []
    for u, v in queries:
        total = 0
        while head[u] != head[v]:
            if depth[head[u]] < depth[head[v]]:
                u, v = v, u
            total += prefix[pos[u] + 1] - prefix[pos[head[u]]]
            u = parent[head[u]]
        lo, hi = sorted((pos[u], pos[v]))
        answers.append(total + prefix[hi + 1] - prefix[lo])
    return answers
`,
      tests: [
        {
          args: [
            [-1, 0, 0, 1, 1, 2, 4, 4, 6, 8, 5, 10],
            [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8],
            [
              [9, 3],
              [7, 11],
              [8, 6],
            ],
          ],
          expected: [17, 41, 7],
        },
      ],
    },
    {
      language: "javascript",
      entry: "pathMax",
      code: `// Heavy-light decomposition with a max segment tree over the base array.
function pathMax(parent, values, queries) {
  const n = parent.length, root = parent.indexOf(-1);
  const children = Array.from({ length: n }, () => []);
  parent.forEach((p, v) => p !== -1 && children[p].push(v));
  const order = [root];
  for (let i = 0; i < order.length; i++) order.push(...children[order[i]]);
  const size = new Array(n).fill(1), depth = new Array(n).fill(0);
  for (let i = n - 1; i > 0; i--) size[parent[order[i]]] += size[order[i]];
  for (const v of order) for (const c of children[v]) depth[c] = depth[v] + 1;
  const head = new Array(n), pos = new Array(n);
  let next = 0;
  const stack = [[root, root]];
  while (stack.length) {
    const [v, h] = stack.pop();
    head[v] = h; pos[v] = next++;
    let heavy = -1;
    for (const c of children[v]) if (heavy === -1 || size[c] > size[heavy]) heavy = c;
    for (const c of children[v]) if (c !== heavy) stack.push([c, c]);
    if (heavy !== -1) stack.push([heavy, h]);
  }
  const tree = new Array(2 * n).fill(-Infinity);
  for (let v = 0; v < n; v++) tree[n + pos[v]] = values[v];
  for (let i = n - 1; i > 0; i--) tree[i] = Math.max(tree[2 * i], tree[2 * i + 1]);
  const rangeMax = (l, r) => { // inclusive
    let best = -Infinity;
    for (l += n, r += n + 1; l < r; l >>= 1, r >>= 1) {
      if (l & 1) best = Math.max(best, tree[l++]);
      if (r & 1) best = Math.max(best, tree[--r]);
    }
    return best;
  };
  return queries.map(([u, v]) => {
    let best = -Infinity;
    while (head[u] !== head[v]) {
      if (depth[head[u]] < depth[head[v]]) [u, v] = [v, u];
      best = Math.max(best, rangeMax(pos[head[u]], pos[u]));
      u = parent[head[u]];
    }
    return Math.max(best, rangeMax(Math.min(pos[u], pos[v]), Math.max(pos[u], pos[v])));
  });
}
`,
      tests: [
        {
          args: [
            [-1, 0, 0, 1, 1, 2, 4, 4, 6, 8, 5, 10],
            [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8],
            [
              [9, 3],
              [7, 11],
              [8, 6],
            ],
          ],
          expected: [5, 9, 5],
        },
      ],
    },
  ],
  visualizer: "heavy-light",
  practice: [
    {
      id: "hld-chains",
      kind: "numeric",
      prompt:
        "In the first preset's tree (A → B, C; B → D, E; C → F; E → G, H; G → I; I → J; F → K; K → L), how many chains does heavy-light decomposition produce?",
      answer: 4,
      explanation:
        "A–B–E–G–I–J, C–F–K–L, and the single vertices H and D. Every light child starts a chain, and there are three light children (C, D, H), plus the root's chain.",
      hints: ["Count the vertices that are not their parent's heavy child (including the root)."],
      objective: "Build the decomposition",
    },
    {
      id: "hld-log",
      kind: "mcq",
      prompt: "Why does a root path cross at most log₂ n light edges?",
      options: [
        "Each light edge leads up into a subtree more than twice as large",
        "Because the tree is balanced",
        "Because heavy chains have length at most log n",
        "Because each chain is a segment tree",
      ],
      answer: 0,
      explanation:
        "A light child's subtree is no larger than its heavy sibling's, so the parent's subtree is more than double; sizes cannot double more than log₂ n times.",
      distractors: {
        1: "HLD makes no assumption about balance; a path is the worst case for depth but has no light edges.",
        2: "Heavy chains can be long (a path is one chain).",
        3: "The segment tree is built over the whole base array.",
      },
      hints: ["Compare a light child's subtree with its parent's."],
      objective: "Understand the logarithmic bound",
    },
  ],
  exam: {
    definition:
      "Heavy-light decomposition partitions a rooted tree into vertex-disjoint chains by joining each vertex to its child with the largest subtree; with a DFS order that visits heavy children first, chains are contiguous and any path is O(log n) array ranges.",
    steps: [
      "Subtree sizes; heavy child = largest subtree.",
      "DFS, heavy child first: pos[v], head[v].",
      "Range structure over the base array.",
      "Path query: repeatedly take the range of the deeper chain head, jump to its parent; finish on the common chain.",
    ],
    timeComplexity: "$O(n)$ to decompose; $O(\\log^2 n)$ per path query with a segment tree.",
    spaceComplexity: "$O(n)$.",
    correctness:
      "Light edges at least halve subtree size, so at most ⌊log₂ n⌋ of them lie on any root path; each chain contributes one contiguous range.",
    applications: [
      "Path sums, maxima and updates on trees",
      "Subtree queries (contiguous ranges)",
      "LCA",
      "Competitive programming tree queries",
    ],
    limitations: [
      "Static tree shape (link-cut trees handle changes)",
      "$O(\\log^2 n)$ queries with a segment tree",
    ],
    faq: [
      {
        q: "HLD or binary lifting?",
        a: "Binary lifting answers ancestor and LCA queries; HLD also supports path aggregates with updates.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Chains via heavy children; contiguous positions.",
          "Paths = $O(\\log n)$ ranges.",
        ],
      },
      {
        marks: 5,
        outline: [
          "Heavy/light definition (1).",
          "Numbering and heads (1).",
          "Path query loop (2).",
          "Bound (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Motivation: path queries (1).",
          "Decomposition and numbering (2).",
          "Path query algorithm (2).",
          "Worked example (2).",
          "Light-edge lemma and complexity (2).",
          "Comparison with alternatives (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "D. D. Sleator, R. E. Tarjan, “A data structure for dynamic trees,” Journal of Computer and System Sciences, 26(3), 1983.",
      supports: "Heavy and light edges, and the logarithmic bound on light edges per path.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-23",
};
