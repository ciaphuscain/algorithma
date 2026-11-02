import type { AlgorithmEntry } from "../types";

export const pagerankEntry: AlgorithmEntry = {
  slug: "pagerank",
  name: "PageRank",
  aliases: ["Google PageRank"],
  curriculum: [519],
  domain: "graphs",
  subcategory: "Graph Algorithms",
  difficulty: "intermediate",
  summary:
    "Assigns an importance score to each node in a directed graph by iteratively distributing each node's rank equally among its outgoing neighbours, with a damping factor that models random restarts.",
  tags: ["graph", "ranking", "web", "linear algebra", "Markov chain"],
  prerequisites: ["Graphs"],
  related: ["bfs", "topological-sort"],
  problem: {
    input: "A directed graph with n nodes and a damping factor d (typically 0.85).",
    output:
      "A rank vector of length n summing to 1, where each entry reflects the node's importance.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Imagine a random web surfer who follows links uniformly at random and occasionally jumps to a random page. PageRank is the fraction of time spent at each page in the long run — pages linked by many important pages score higher.",
      },
      {
        kind: "p",
        text: "The computation is an iterative fixed-point: each node divides its current rank among its neighbours, mixes in the random-jump probability, and repeats until the values stabilise.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Initialise every node's rank to $1/n$.",
          "Repeat: for each node $v$, $r'[v] = (1-d)/n + d \\cdot \\sum_{u \\to v} r[u]/\\text{out}(u)$.",
          "Stop when $\\|r' - r\\|_1 < \\varepsilon$.",
        ],
      },
      {
        kind: "p",
        text: "**Example:** Three nodes A→B, B→C, C→A (a cycle) with d = 0.85. By symmetry all converge to 1/3.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Handle dangling nodes (no outgoing edges) by distributing their rank equally to all nodes.",
          "Sparse representation: store only existing edges, iterate over in-neighbours.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "PageRank solves $r = (1-d)/n \\cdot \\mathbf{1} + d \\cdot M^T r$ where $M$ is the row-stochastic adjacency matrix. Power iteration converges geometrically at rate $d$; each iteration is $O(E)$.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Can be formulated as the dominant eigenvector of a modified adjacency matrix.",
          "Topic-sensitive PageRank biases the random-jump distribution toward a topic.",
          "Used beyond the web: citation networks, social influence, recommendation.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(E)",
      average: "O(k E)",
      worst: "O(k E)",
    },
    space: "O(V + E)",
    worstClass: "other",
    note: "k is the number of iterations until convergence; typically 50–100.",
  },
  properties: [
    {
      label: "Damping factor",
      value: "Typically 0.85",
    },
    {
      label: "Convergence",
      value: "Geometric at rate d",
    },
    {
      label: "Output",
      value: "Probability distribution over nodes",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "pagerank",
      code: `def pagerank(n, edges, d=0.85, eps=1e-6, max_iter=100):
    """edges: list of [u, v]. Returns list of ranks summing to ~1."""
    out = [0] * n
    in_nbrs = [[] for _ in range(n)]
    for u, v in edges:
        out[u] += 1
        in_nbrs[v].append(u)
    r = [1.0 / n] * n
    for _ in range(max_iter):
        r2 = [(1 - d) / n] * n
        dangling = sum(r[v] for v in range(n) if out[v] == 0)
        for v in range(n):
            r2[v] += d * dangling / n
            for u in in_nbrs[v]:
                r2[v] += d * r[u] / out[u]
        if sum(abs(r2[i] - r[i]) for i in range(n)) < eps:
            return [round(x, 6) for x in r2]
        r = r2
    return [round(x, 6) for x in r]
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
          expected: [0.333333, 0.333333, 0.333333],
        },
        {
          args: [2, [[0, 1]], 0.85, 1e-6, 100],
          expected: [0.350877, 0.649123],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "pr-damping",
      kind: "mcq",
      prompt: "What does the damping factor d model in PageRank?",
      options: [
        "The probability of following a link rather than jumping randomly",
        "The number of iterations",
        "The convergence threshold",
        "The number of outgoing edges",
      ],
      answer: 0,
      explanation:
        "With probability d the surfer follows a link; with probability 1−d they jump to a random node.",
      hints: ["Think of the random surfer model."],
      objective: "Understand the damping factor",
    },
  ],
  exam: {
    definition:
      "PageRank computes importance scores by iteratively distributing rank along directed edges, mixing in a random-jump probability.",
    steps: [
      "Init r[v] = 1/n.",
      "Iterate: r'[v] = (1−d)/n + d · Σ r[u]/out(u) for u→v.",
      "Stop when ||r'−r|| < ε.",
    ],
    timeComplexity: "$O(kE)$ for k iterations.",
    spaceComplexity: "$O(V + E)$.",
    correctness:
      "The iteration is a power method on a stochastic matrix; the damping factor guarantees convergence to a unique stationary distribution.",
    applications: ["Web search ranking", "Citation analysis", "Social network influence"],
    limitations: ["Sensitive to spam links", "Requires the full graph"],
    faq: [
      {
        q: "Why the random jump?",
        a: "It ensures the Markov chain is irreducible and aperiodic, guaranteeing a unique stationary distribution.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Formula and damping factor interpretation (2)."],
      },
    ],
  },
  references: [
    {
      citation:
        'L. Page, S. Brin, R. Motwani, T. Winograd, "The PageRank Citation Ranking: Bringing Order to the Web," Stanford InfoLab, 1999.',
      supports: "The original PageRank paper.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
