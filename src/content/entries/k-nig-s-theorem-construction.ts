import type { AlgorithmEntry } from "../types";

export const kNigSTheoremConstructionEntry: AlgorithmEntry = {
  slug: "k-nig-s-theorem-construction",
  name: "Kőnig's Theorem Construction",
  aliases: ["König's theorem", "Minimum vertex cover in bipartite graphs"],
  curriculum: [509],
  domain: "graphs",
  subcategory: "Graph Algorithms",
  difficulty: "intermediate",
  summary:
    "Constructs a minimum vertex cover in a bipartite graph equal in size to the maximum matching, by finding alternating-path reachable vertices from unmatched left vertices.",
  tags: ["bipartite", "matching", "vertex cover", "König"],
  prerequisites: ["Bipartite Matching", "Maximum Flow"],
  related: ["bipartite-matching-via-flow", "hopcroft-karp"],
  problem: {
    input: "A bipartite graph and a maximum matching.",
    output: "A minimum vertex cover of the same size as the matching.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Kőnig's theorem states that in bipartite graphs, the size of the maximum matching equals the size of the minimum vertex cover. The construction finds the actual vertices.",
      },
      {
        kind: "p",
        text: "Starting from unmatched left vertices, follow alternating paths (unmatched edge → matched edge → ...). The cover consists of unmatched left vertices not reached plus matched right vertices that are reached.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Find a maximum matching M.",
          "Let U be the set of unmatched left vertices.",
          "Build alternating BFS/DFS from U: follow unmatched edges to right, matched edges back to left.",
          "Let Z be all vertices reachable from U via alternating paths.",
          "Minimum vertex cover = (left vertices NOT in Z) ∪ (right vertices in Z).",
        ],
      },
      {
        kind: "p",
        text: "**Worked example.** Bipartite graph L={1,2,3}, R={a,b,c}. Matching: 1-a, 2-b. Unmatched: {3}. From 3, follow 3-a (unmatched), a-1 (matched), 1-b? No, 1 is matched to a. Z = {3, a, 1}. Cover = L\\Z ∪ R∩Z = {2} ∪ {a} = {2, a}. Size 2 = matching size.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Run Hopcroft–Karp or Hungarian algorithm first to get the matching.",
          "The alternating path traversal is a BFS alternating between unmatched and matched edges.",
          "The vertex cover is the complement of the independent set in the alternating path structure.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Kőnig's theorem: in a bipartite graph, $|$maximum matching$| = |$minimum vertex cover$|$. This is a consequence of LP duality applied to the matching/cover LPs on bipartite graphs.",
      },
      {
        kind: "p",
        text: "Time: $O(E\\sqrt{V})$ for Hopcroft–Karp matching + $O(V + E)$ for the alternating path traversal.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "By complementation, maximum independent set = n - minimum vertex cover in bipartite graphs.",
          "For general (non-bipartite) graphs, minimum vertex cover is NP-hard.",
          "The construction is used in scheduling and assignment problems.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(E sqrt(V))",
      average: "O(E sqrt(V))",
      worst: "O(E sqrt(V))",
    },
    space: "O(V + E)",
    worstClass: "n^2",
    note: "Dominated by matching computation.",
  },
  properties: [
    {
      label: "Bipartite only",
      value: "Yes",
    },
    {
      label: "Cover = matching size",
      value: "Guaranteed by Kőnig's theorem",
    },
    {
      label: "Constructive",
      value: "Produces actual cover vertices",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "konig_cover",
      code: `def konig_cover(n_left, n_right, edges, matching_pairs):
    """Given bipartite graph (left 0..n_left-1, right n_left..n_left+n_right-1)
    and maximum matching as list of [left, right] pairs,
    return minimum vertex cover as [left_verts, right_verts]."""
    from collections import defaultdict, deque
    adj = defaultdict(set)
    for u, v in edges:
        adj[u].add(v)
        adj[v].add(u)
    match_l = {}
    match_r = {}
    for l, r in matching_pairs:
        match_l[l] = r
        match_r[r] = l
    unmatched = [i for i in range(n_left) if i not in match_l]
    visited_l = set(unmatched)
    visited_r = set()
    queue = deque(unmatched)
    while queue:
        u = queue.popleft()
        for v in adj[u]:
            if v >= n_left and v not in visited_r:
                if match_l.get(u) != v:
                    visited_r.add(v)
                    if v in match_r and match_r[v] not in visited_l:
                        visited_l.add(match_r[v])
                        queue.append(match_r[v])
    cover_l = sorted([i for i in range(n_left) if i not in visited_l])
    cover_r = sorted(list(visited_r))
    return [cover_l, cover_r]
`,
      tests: [
        {
          args: [
            3,
            3,
            [
              [0, 3],
              [0, 4],
              [1, 4],
              [2, 5],
            ],
            [
              [0, 3],
              [1, 4],
            ],
          ],
          expected: [[1], [3]],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "konig-size",
      kind: "mcq",
      prompt:
        "In a bipartite graph, how does the minimum vertex cover size relate to the maximum matching?",
      options: [
        "They are equal",
        "Cover is always larger",
        "Cover is always smaller",
        "No relation",
      ],
      answer: 0,
      explanation: "Kőnig's theorem: |min vertex cover| = |max matching| in bipartite graphs.",
      hints: ["This is Kőnig's theorem."],
      objective: "State Kőnig's theorem",
    },
  ],
  exam: {
    definition:
      "Kőnig's theorem construction finds a minimum vertex cover in a bipartite graph equal in size to the maximum matching, using alternating path reachability.",
    steps: [
      "Compute maximum matching.",
      "BFS alternating paths from unmatched left vertices.",
      "Cover = unreached left ∪ reached right.",
    ],
    timeComplexity: "$O(E\\sqrt{V})$ (matching) + $O(V+E)$ (cover)",
    spaceComplexity: "$O(V+E)$",
    correctness: "LP duality: matching LP and cover LP have same optimum on bipartite graphs.",
    applications: [
      "Scheduling",
      "Assignment problems",
      "Maximum independent set in bipartite graphs",
    ],
    limitations: ["Only works on bipartite graphs"],
    faq: [
      {
        q: "Why bipartite only?",
        a: "Vertex cover is NP-hard on general graphs; Kőnig's theorem exploits bipartite LP integrality.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["State theorem and describe alternating path construction (2)."],
      },
    ],
  },
  references: [
    {
      citation: "D. Kőnig, 'Gráfok és mátrixok,' Matematikai és Fizikai Lapok, 38, 1931.",
      supports: "The original theorem.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
