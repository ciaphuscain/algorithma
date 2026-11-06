import type { AlgorithmEntry } from "../types";

export const kargerSMinimumCutAlgorithmEntry: AlgorithmEntry = {
  slug: "karger-s-minimum-cut-algorithm",
  name: "Karger's Minimum Cut Algorithm",
  aliases: ["Karger's contraction", "Random contraction"],
  curriculum: [435],
  domain: "randomized",
  subcategory: "Randomized Algorithms",
  difficulty: "intermediate",
  summary:
    "Finds a minimum cut in an undirected graph by repeatedly contracting random edges until two vertices remain, with probability at least 2/n(n-1) of finding the minimum cut per trial.",
  tags: ["minimum cut", "randomized", "contraction", "graph"],
  prerequisites: ["Graph Theory"],
  related: ["ford-fulkerson", "stoer-wagner-minimum-cut"],
  problem: {
    input: "An undirected multigraph with n vertices.",
    output:
      "A minimum cut (partition of vertices into two non-empty sets minimizing crossing edges).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A cut partitions the vertices into two groups; its weight is the number of crossing edges. To find the minimum cut randomly: pick a random edge and merge (contract) its endpoints into one super-vertex. Repeat until only two super-vertices remain. The edges between them form a cut.",
      },
      {
        kind: "p",
        text: "Surprisingly, this simple procedure finds the minimum cut with probability at least $2/(n(n-1))$. Running it $O(n^2 \\log n)$ times makes success near-certain.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "While there are more than 2 vertices:",
          "  Pick a random edge (u, v) uniformly at random.",
          "  Contract: merge v into u, redirect all edges from v to u, remove self-loops.",
          "The remaining edges between the two super-vertices form a cut.",
          "Repeat the entire process $n^2 \\log n / 2$ times and return the smallest cut found.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example.** Triangle graph: {A-B, B-C, A-C}. Min cut = 2. If we contract A-B first, we get super-vertex AB with two edges to C: cut = 2 = min cut. If we contracted A-C first, same result.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Use a union-find structure for efficient vertex merging.",
          "Represent the graph as an edge list; contracting just re-labels endpoints.",
          "Self-loops (both endpoints in the same super-vertex) are removed.",
          "Karger–Stein improves to $O(n^2 \\log^3 n)$ by recursing on partially contracted graphs.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The probability that a specific minimum cut survives all $n-2$ contractions is at least $\\binom{n}{2}^{-1} = \\frac{2}{n(n-1)}$. Proof: at each step, the minimum cut has at least as many edges as the minimum degree, which is at least the cut size. So the probability of cutting a min-cut edge is at most $2/(n-i)$ at step $i$.",
      },
      {
        kind: "p",
        text: "After $\\frac{n(n-1)}{2} \\ln n$ trials, the probability of missing the min cut is at most $1/n$. Each trial takes $O(m)$ with edge list, total $O(mn^2 \\log n)$.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Karger–Stein: contract to $n/\\sqrt{2}$ vertices, then recurse twice. Runtime $O(n^2 \\log^3 n)$.",
          "Deterministic min-cut: Stoer–Wagner runs in $O(nm + n^2 \\log n)$.",
          "Applications: network reliability, image segmentation, clustering.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(n^2)",
      average: "O(n^2 m log n)",
      worst: "O(n^2 m log n)",
    },
    space: "O(n + m)",
    worstClass: "other",
    note: "Per trial O(m); O(n² log n) trials for high probability.",
  },
  properties: [
    {
      label: "Randomized",
      value: "Monte Carlo — may miss min cut",
    },
    {
      label: "Success probability",
      value: "≥ 2/n(n-1) per trial",
    },
    {
      label: "Simple",
      value: "Easy to implement",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "karger_repeated",
      code: `import random

def karger_min_cut(n, edges, seed=None):
    """One trial of Karger's contraction. edges = [(u, v)].
    Returns the cut size. Uses seed for reproducibility."""
    if seed is not None:
        random.seed(seed)
    parent = list(range(n))
    rank = [0] * n
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    def union(a, b):
        a, b = find(a), find(b)
        if a == b:
            return
        if rank[a] < rank[b]:
            a, b = b, a
        parent[b] = a
        if rank[a] == rank[b]:
            rank[a] += 1
    edge_list = list(edges)
    vertices_left = n
    while vertices_left > 2:
        while True:
            u, v = random.choice(edge_list)
            if find(u) != find(v):
                break
        union(u, v)
        vertices_left -= 1
    return sum(1 for u, v in edge_list if find(u) != find(v))

def karger_repeated(n, edges, trials=100):
    """Run Karger's algorithm multiple times, return minimum cut found."""
    best = float('inf')
    for i in range(trials):
        c = karger_min_cut(n, edges, seed=i)
        if c < best:
            best = c
    return best
`,
      tests: [
        {
          args: [
            4,
            [
              [0, 1],
              [1, 2],
              [2, 3],
              [3, 0],
              [0, 2],
            ],
            100,
          ],
          expected: 2,
        },
        {
          args: [
            3,
            [
              [0, 1],
              [1, 2],
              [0, 2],
            ],
            50,
          ],
          expected: 2,
        },
      ],
    },
    {
      language: "javascript",
      entry: "kargerRepeated",
      code: `function kargerRepeated(n, edges, trials = 100) {
  function mulberry32(seed) {
    return function() {
      let t = seed += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function kargerMinCut(n, edges, seed) {
    const rand = mulberry32(seed);
    const parent = Array.from({length: n}, (_, i) => i);
    const rank = new Array(n).fill(0);
    function find(x) {
      while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
      return x;
    }
    function union(a, b) {
      a = find(a); b = find(b);
      if (a === b) return;
      if (rank[a] < rank[b]) [a, b] = [b, a];
      parent[b] = a;
      if (rank[a] === rank[b]) rank[a]++;
    }
    let left = n;
    while (left > 2) {
      let u, v;
      do {
        const e = edges[Math.floor(rand() * edges.length)];
        u = e[0]; v = e[1];
      } while (find(u) === find(v));
      union(u, v);
      left--;
    }
    return edges.reduce((s, e) => s + (find(e[0]) !== find(e[1]) ? 1 : 0), 0);
  }
  let best = Infinity;
  for (let i = 0; i < trials; i++) {
    best = Math.min(best, kargerMinCut(n, edges, i));
  }
  return best;
}
`,
      tests: [
        {
          args: [
            4,
            [
              [0, 1],
              [1, 2],
              [2, 3],
              [3, 0],
              [0, 2],
            ],
            100,
          ],
          expected: 2,
        },
        {
          args: [
            3,
            [
              [0, 1],
              [1, 2],
              [0, 2],
            ],
            50,
          ],
          expected: 2,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "karger-prob",
      kind: "mcq",
      prompt:
        "What is the probability of finding the min cut in one trial of Karger's algorithm on n vertices?",
      options: [
        "At least 2/(n(n-1))",
        "Exactly 1/n",
        "At least 1/2",
        "Depends on the graph density",
      ],
      answer: 0,
      explanation:
        "Each contraction avoids cutting a min-cut edge with probability ≥ (n-i-2)/(n-i), telescoping to 2/(n(n-1)).",
      hints: ["The probability comes from a telescoping product."],
      objective: "Understand the success probability",
    },
  ],
  exam: {
    definition:
      "Karger's algorithm finds minimum cuts by randomly contracting edges until two super-vertices remain, with success probability ≥ 2/n(n-1) per trial.",
    steps: [
      "Randomly select edge.",
      "Contract: merge endpoints.",
      "Remove self-loops.",
      "Repeat until 2 vertices remain.",
      "Edges between them = cut.",
    ],
    timeComplexity: "$O(n^2 m \\log n)$ for high probability",
    spaceComplexity: "$O(n + m)$",
    correctness:
      "At each step, the probability of destroying the min cut is at most 2/(remaining vertices). The product telescopes to ≥ 2/(n(n-1)).",
    applications: ["Network reliability", "Image segmentation", "Graph clustering"],
    limitations: ["Monte Carlo: may not find min cut", "Many trials needed for high confidence"],
    faq: [
      {
        q: "How many trials for high probability?",
        a: "O(n² log n) trials give failure probability ≤ 1/n.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Contraction procedure (1). Success probability analysis (1)."],
      },
    ],
  },
  references: [
    {
      citation:
        "D. R. Karger, 'Global min-cuts in RNC, and other ramifications of a simple min-cut algorithm,' SODA, 1993.",
      supports: "Introduced the random contraction algorithm.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
