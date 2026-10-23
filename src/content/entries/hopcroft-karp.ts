import type { AlgorithmEntry } from "../types";

export const hopcroftKarpEntry: AlgorithmEntry = {
  slug: "hopcroft-karp",
  name: "Hopcroft–Karp (Bipartite Matching)",
  aliases: ["Maximum bipartite matching", "Hopcroft–Karp–Karzanov", "Augmenting paths in phases"],
  curriculum: [237],
  domain: "graphs",
  subcategory: "Matching",
  difficulty: "advanced",
  summary:
    "Finds a maximum matching in a bipartite graph in O(E√V). Each phase uses BFS to find the length of the shortest augmenting paths, then DFS to flip a maximal set of vertex-disjoint paths of that length; only O(√V) phases are needed.",
  tags: ["matching", "bipartite", "augmenting path", "bfs", "dfs", "assignment"],
  prerequisites: ["Breadth-First Search", "Depth-First Search", "Bipartite graphs"],
  related: ["dinic", "push-relabel", "bfs"],
  problem: {
    input: "A bipartite graph: left vertices, right vertices and edges between the sides.",
    output: "A largest set of edges with no shared endpoint.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Match applicants to jobs they qualify for. Greedy choices can block each other: A takes job 1, and then B, who only qualifies for job 1, is stuck. The fix is an **augmenting path**: start at a free applicant, alternate unmatched and matched edges, and end at a free job. Flipping every edge on it (matched ↔ unmatched) grows the matching by one.",
      },
      {
        kind: "p",
        text: "Searching for one path at a time takes up to V searches. Hopcroft and Karp search in phases: one BFS finds the shortest augmenting length, and one sweep of DFS flips many disjoint shortest paths at once. Shortest paths get longer each phase, and that limits the number of phases.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "BFS from all free left vertices together: unmatched edges go left → right, matched edges right → left. Stop at the first layer that reaches a free right vertex.",
          "If none was reached, the matching is maximum.",
          "For each free left vertex, DFS along the layers to a free right vertex in that layer; flip the path; mark its vertices used for this phase.",
          "Repeat with a new BFS.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): A–1, A–2, B–1, C–2, C–3, D–3, D–4, E–4, E–5.",
      },
      {
        kind: "table",
        head: ["Phase", "Shortest length", "Paths flipped", "Matching size"],
        rows: [
          ["1", "1 edge", "A–1, C–2, D–3, E–4", "4"],
          ["2", "9 edges", "B–1, 1–A, A–2, 2–C, C–3, 3–D, D–4, 4–E, E–5", "5"],
        ],
      },
      {
        kind: "p",
        text: "In phase 2, B's only job is taken, so the path reassigns everyone along the chain: A moves to 2, C to 3, D to 4 and E to 5. The final matching A–2, B–1, C–3, D–4, E–5 is perfect.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Store mates for both sides (−1 or null for free) and the BFS distance of each left vertex.",
          "In the DFS, mark a vertex that leads nowhere as dead for the rest of the phase (set its distance to ∞), as in Dinic's current-edge pointers.",
          "Recursive DFS depth can reach V; iterative versions avoid stack limits on long chains.",
          "Kuhn's simpler algorithm (the JavaScript sample) tries one augmenting path per left vertex in $O(VE)$; it is often fast enough for small graphs.",
          "Weighted matching (minimum-cost assignment) needs the Hungarian algorithm or min-cost flow instead.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Berge's lemma.** A matching is maximum exactly when no augmenting path exists. The oracle confirms maximality against Kuhn's algorithm on every run.",
      },
      {
        kind: "p",
        text: "**√V phases.** After $\\sqrt{V}$ phases, every augmenting path is longer than $\\sqrt{V}$. The symmetric difference between the current and a maximum matching holds vertex-disjoint augmenting paths, each using more than $\\sqrt{V}$ vertices, so at most $\\sqrt{V}$ of them remain; each later phase removes at least one. Each phase costs O(E):",
      },
      { kind: "math", tex: "\\text{phases} \\le 2\\sqrt{V} + O(1), \\qquad T = O(E\\sqrt{V})" },
      {
        kind: "p",
        text: "**König's theorem.** In a bipartite graph, the maximum matching size equals the minimum vertex cover size. The final BFS gives such a cover: the left vertices it did not reach plus the right vertices it did.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "It is Dinic's algorithm on the unit-capacity flow network s → left → right → t.",
          "General (non-bipartite) graphs need Edmonds' blossom algorithm; Micali–Vazirani achieves $O(E\\sqrt{V})$ there too.",
          "Applications: assignment of tasks, resident matching (with stability added: Gale–Shapley), and as a step in many graph algorithms.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(E\\sqrt{V})", average: "O(E\\sqrt{V})", worst: "O(E\\sqrt{V})" },
    space: "O(V + E)",
    worstClass: "other",
  },
  properties: [
    { label: "Phases", value: "O(√V)" },
    { label: "Certificate", value: "No augmenting path (Berge)" },
  ],
  implementations: [
    {
      language: "python",
      entry: "hopcroft_karp",
      code: `from collections import deque


def hopcroft_karp(n_left, n_right, edges):
    adj = [[] for _ in range(n_left)]
    for u, v in edges:
        adj[u].append(v)
    match_l, match_r = [-1] * n_left, [-1] * n_right
    INF = float("inf")
    size = 0
    while True:
        dist = [INF] * n_left
        queue = deque()
        for u in range(n_left):
            if match_l[u] < 0:
                dist[u] = 0
                queue.append(u)
        shortest = INF
        while queue:
            u = queue.popleft()
            if dist[u] >= shortest:
                continue
            for v in adj[u]:
                w = match_r[v]
                if w < 0:
                    shortest = min(shortest, dist[u])
                elif dist[w] == INF:
                    dist[w] = dist[u] + 1
                    queue.append(w)
        if shortest == INF:
            return size

        def dfs(u):
            for v in adj[u]:
                w = match_r[v]
                if (w < 0 and dist[u] == shortest) or (
                    w >= 0 and dist[w] == dist[u] + 1 and dfs(w)
                ):
                    match_l[u], match_r[v] = v, u
                    return True
            dist[u] = INF                # dead end for this phase
            return False

        for u in range(n_left):
            if match_l[u] < 0 and dfs(u):
                size += 1
`,
      tests: [
        {
          args: [
            5,
            5,
            [
              [0, 0],
              [0, 1],
              [1, 0],
              [2, 1],
              [2, 2],
              [3, 2],
              [3, 3],
              [4, 3],
              [4, 4],
            ],
          ],
          expected: 5,
        },
        {
          args: [
            3,
            2,
            [
              [0, 0],
              [1, 0],
              [1, 1],
              [2, 0],
              [2, 1],
            ],
          ],
          expected: 2,
        },
      ],
    },
    {
      language: "javascript",
      entry: "kuhnMatching",
      code: `// Kuhn's algorithm: one augmenting-path search per left vertex, O(V·E).
function kuhnMatching(nLeft, nRight, edges) {
  const adj = Array.from({ length: nLeft }, () => []);
  for (const [u, v] of edges) adj[u].push(v);
  const matchR = new Array(nRight).fill(-1);
  const tryVertex = (u, seen) => {
    for (const v of adj[u]) {
      if (seen[v]) continue;
      seen[v] = true;
      if (matchR[v] < 0 || tryVertex(matchR[v], seen)) { matchR[v] = u; return true; }
    }
    return false;
  };
  let size = 0;
  for (let u = 0; u < nLeft; u++) if (tryVertex(u, new Array(nRight).fill(false))) size++;
  return size;
}
`,
      tests: [
        {
          args: [
            5,
            5,
            [
              [0, 0],
              [0, 1],
              [1, 0],
              [2, 1],
              [2, 2],
              [3, 2],
              [3, 3],
              [4, 3],
              [4, 4],
            ],
          ],
          expected: 5,
        },
      ],
    },
  ],
  visualizer: "hopcroft-karp",
  practice: [
    {
      id: "hk-phases",
      kind: "numeric",
      prompt:
        "How many phases does Hopcroft–Karp use on the first preset (A–1, A–2, B–1, C–2, C–3, D–3, D–4, E–4, E–5)?",
      answer: 2,
      explanation:
        "Phase 1 flips four single edges; phase 2 flips one path of length 9; the next BFS reaches no free right vertex.",
      hints: ["Count BFS rounds that still reach a free right vertex."],
      objective: "Trace the phases",
    },
    {
      id: "hk-augmenting",
      kind: "mcq",
      prompt: "What makes a path augmenting for a matching M?",
      options: [
        "It starts and ends at free vertices and alternates between edges outside and inside M",
        "It uses only matched edges",
        "It is the shortest path between two matched vertices",
        "It visits every vertex once",
      ],
      answer: 0,
      explanation: "Flipping such a path adds one more edge than it removes, so M grows by one.",
      distractors: {
        1: "Flipping only matched edges would shrink M.",
        2: "Its endpoints must be free, or the flip would double-match them.",
        3: "That describes a Hamiltonian path, unrelated here.",
      },
      hints: ["Count edges in and out of M along the path."],
      objective: "Define augmenting paths",
    },
  ],
  exam: {
    definition:
      "Hopcroft–Karp computes a maximum bipartite matching by repeatedly finding, with one BFS and DFS sweep, a maximal set of vertex-disjoint shortest augmenting paths and flipping them; O(√V) phases suffice.",
    steps: [
      "BFS layers from free left vertices along alternating paths.",
      "Stop if no free right vertex is reached.",
      "DFS from each free left vertex to a free right vertex in the shortest layer; flip.",
      "Repeat.",
    ],
    timeComplexity: "$O(E\\sqrt{V})$.",
    spaceComplexity: "$O(V + E)$.",
    correctness: "Berge's lemma: the matching is maximum when no augmenting path remains.",
    applications: [
      "Job and task assignment",
      "Scheduling",
      "Vertex cover in bipartite graphs (König)",
      "Network flow on unit capacities",
    ],
    limitations: ["Bipartite graphs only", "Unweighted (use the Hungarian method for costs)"],
    faq: [
      {
        q: "Why only shortest paths?",
        a: "Flipping shortest paths makes later shortest paths strictly longer; that bounds the phases by O(√V).",
      },
    ],
    answers: [
      { marks: 2, outline: ["Phases of shortest augmenting paths.", "$O(E\\sqrt{V})$."] },
      {
        marks: 5,
        outline: [
          "Augmenting paths and Berge's lemma (2).",
          "Phase structure (2).",
          "Complexity (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Matching definitions and Berge's lemma (2).",
          "BFS layering and DFS (2).",
          "Worked example (2).",
          "√V phase argument (3).",
          "Relation to max flow (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "J. E. Hopcroft, R. M. Karp, “An n^(5/2) algorithm for maximum matchings in bipartite graphs,” SIAM Journal on Computing, 2(4), 1973.",
      supports: "The algorithm and the O(√V) phase bound.",
    },
    {
      citation:
        "H. W. Kuhn, “The Hungarian method for the assignment problem,” Naval Research Logistics Quarterly, 2, 1955.",
      supports: "Augmenting-path matching (Kuhn's algorithm) and the weighted assignment problem.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-23",
};
