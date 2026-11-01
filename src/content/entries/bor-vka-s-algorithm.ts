import type { AlgorithmEntry } from "../types";

export const borVkaSAlgorithmEntry: AlgorithmEntry = {
  slug: "bor-vka-s-algorithm",
  name: "Borůvka's Algorithm",
  aliases: [
    "Boruvka's Algorithm",
    "Sollin's Algorithm",
  ],
  curriculum: [
    218,
  ],
  domain: "graphs",
  subcategory: "Graph Algorithms",
  difficulty: "intermediate",
  summary: "Finds the minimum spanning tree by repeatedly finding the cheapest edge leaving each component and contracting those edges, running in O(E log V) time.",
  tags: [
    "minimum spanning tree",
    "greedy",
    "parallel",
    "graph",
  ],
  prerequisites: [
    "Graph Theory",
    "Union-Find",
  ],
  related: [
    "kruskal",
    "prim",
  ],
  problem: {
    input: "A connected undirected weighted graph.",
    output: "A minimum spanning tree (set of edges with minimum total weight connecting all vertices).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "In each round, every component independently selects its cheapest outgoing edge. These edges are added to the MST and the components merge. Since each component at least doubles in size each round (it merges with at least one neighbor), there are at most O(log V) rounds.",
      },
      {
        kind: "p",
        text: "Borůvka's is the oldest MST algorithm (1926!) and is naturally parallel: each component's cheapest edge can be found independently.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Start with each vertex as its own component.",
          "Repeat until one component remains:",
          "  For each component, find the minimum-weight edge to another component.",
          "  Add all such edges to the MST and merge the components.",
          "Return the MST edges.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example**: vertices {A,B,C,D}, edges A-B:1, B-C:4, A-C:3, C-D:2, B-D:5.",
      },
      {
        kind: "table",
        head: [
          "Round",
          "Components",
          "Cheapest edges",
          "MST so far",
        ],
        rows: [
          [
            "0",
            "{A},{B},{C},{D}",
            "A:A-B(1), B:A-B(1), C:C-D(2), D:C-D(2)",
            "A-B, C-D",
          ],
          [
            "1",
            "{A,B},{C,D}",
            "AB:A-C(3), CD:A-C(3)",
            "A-B, C-D, A-C",
          ],
        ],
      },
      {
        kind: "p",
        text: "MST: {A-B, C-D, A-C}, total weight = 1 + 2 + 3 = 6.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Use Union-Find to track components efficiently.",
          "Be careful with duplicate cheapest edges (two components may pick the same edge).",
          "O(log V) rounds, each scanning all edges: O(E log V) total.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Time**: O(E log V). Each round scans all E edges and merges components. At most ceil(log2 V) rounds because the number of components at least halves.",
      },
      {
        kind: "p",
        text: "**Correctness**: The cheapest edge leaving a component is always in some MST (cut property). Since we add one such edge per component per round, all MST edges are eventually found.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Borůvka's is the basis for the randomized O(E) MST algorithm of Karger, Klein, and Tarjan.",
          "It parallelizes naturally: O(log^2 V) time with E/log V processors.",
          "In external memory, Borůvka's phase reduces the problem size, making it efficient for disk-based MST computation.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(E log V)",
      average: "O(E log V)",
      worst: "O(E log V)",
    },
    space: "O(V + E)",
    worstClass: "n log n",
    note: "O(log V) rounds, each O(E).",
  },
  properties: [
    {
      label: "Rounds",
      value: "O(log V)",
    },
    {
      label: "Parallelizable",
      value: "Yes (each component independent)",
    },
    {
      label: "Oldest MST algorithm",
      value: "1926",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "boruvka_mst",
      code: `def boruvka_mst(n, edges):
    """n vertices (0..n-1), edges = [[u, v, w], ...]. Returns MST total weight."""
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
            return False
        if rank[a] < rank[b]:
            a, b = b, a
        parent[b] = a
        if rank[a] == rank[b]:
            rank[a] += 1
        return True
    total = 0
    num_components = n
    while num_components > 1:
        # Find cheapest edge for each component
        cheapest = {}  # component -> (weight, u, v)
        for u, v, w in edges:
            cu, cv = find(u), find(v)
            if cu != cv:
                if cu not in cheapest or w < cheapest[cu][0]:
                    cheapest[cu] = (w, u, v)
                if cv not in cheapest or w < cheapest[cv][0]:
                    cheapest[cv] = (w, u, v)
        if not cheapest:
            break
        for comp, (w, u, v) in cheapest.items():
            if union(u, v):
                total += w
                num_components -= 1
    return total
`,
      tests: [
        {
          args: [
            4,
            [
              [
                0,
                1,
                1,
              ],
              [
                1,
                2,
                4,
              ],
              [
                0,
                2,
                3,
              ],
              [
                2,
                3,
                2,
              ],
              [
                1,
                3,
                5,
              ],
            ],
          ],
          expected: 6,
        },
        {
          args: [
            3,
            [
              [
                0,
                1,
                1,
              ],
              [
                1,
                2,
                2,
              ],
              [
                0,
                2,
                3,
              ],
            ],
          ],
          expected: 3,
        },
      ],
    },
  ],
  practice: [
    {
      id: "boruvka-rounds",
      kind: "numeric",
      prompt: "A graph has 16 vertices. At most how many rounds does Boruvka's algorithm need?",
      answer: 4,
      explanation: "Each round at least halves the number of components. ceil(log2(16)) = 4 rounds.",
      hints: [
        "How many times can you halve 16?",
      ],
      objective: "Calculate Boruvka round count",
    },
  ],
  exam: {
    definition: "Boruvka's algorithm finds MST by repeatedly having each component select its cheapest outgoing edge, merging components each round, in O(E log V).",
    steps: [
      "Each vertex starts as a component",
      "Each round: find cheapest edge per component",
      "Add those edges, merge components",
      "Repeat until one component",
    ],
    timeComplexity: "O(E log V)",
    spaceComplexity: "O(V + E)",
    correctness: "Cut property: the cheapest edge crossing any cut is in the MST. Each component's cheapest edge crosses a cut. O(log V) rounds because component count halves each time.",
    applications: [
      "MST computation",
      "Network design",
      "Clustering",
    ],
    limitations: [
      "Multiple edges to handle (duplicates in cheapest)",
      "Less commonly used than Kruskal/Prim",
    ],
    faq: [
      {
        q: "Why at most log V rounds?",
        a: "Each round merges every component with at least one neighbor, so the number of components at least halves.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Component cheapest-edge selection with O(log V) rounds (2)",
        ],
      },
    ],
  },
  references: [
    {
      citation: "O. Boruvka, 'O jistem problemu minimalnim,' Prace Moravske Prirodovedecke Spolecnosti, 3:37-58, 1926.",
      supports: "The original MST algorithm.",
    },
    {
      citation: "T. H. Cormen et al., Introduction to Algorithms, 3rd ed., Problem 23-2, 2009.",
      supports: "Analysis of Boruvka's algorithm.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
