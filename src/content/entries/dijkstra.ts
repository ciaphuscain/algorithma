import type { AlgorithmEntry } from "../types";

export const dijkstraEntry: AlgorithmEntry = {
  slug: "dijkstra",
  name: "Dijkstra's Algorithm",
  aliases: ["Dijkstra", "Single-source shortest paths (non-negative weights)"],
  curriculum: [207],
  domain: "graphs",
  subcategory: "Shortest paths",
  difficulty: "intermediate",
  summary:
    "Grows a set of vertices with known shortest distances, always settling the closest unsettled vertex next; correct whenever edge weights are non-negative.",
  tags: ["graph", "shortest path", "weighted", "greedy", "priority queue", "heap"],
  prerequisites: ["Breadth-First Search", "Priority queues / heaps"],
  related: ["bellman-ford", "prim", "bfs", "dfs"],
  problem: {
    input: "A graph with edge weights $w(u, v) \\ge 0$ and a source vertex $s$.",
    output:
      "For every vertex $v$, the minimum total weight $\\delta(s, v)$ of a path from $s$ ($\\infty$ if none), and parent pointers forming a shortest-path tree.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Imagine water spreading from the source through pipes whose lengths are the edge weights. It reaches each junction for the first time along the shortest route. Dijkstra's algorithm simulates this by always advancing to the nearest junction the water has not reached yet.",
      },
      {
        kind: "p",
        text: "BFS does the same with every pipe of length 1, so a plain queue is enough. With different lengths, the algorithm needs a **priority queue** that always yields the closest candidate.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Set $\\text{dist}[s] = 0$ and every other distance to $\\infty$. Put $(s, 0)$ in the priority queue.",
          "Extract the entry $(u, d)$ with the smallest $d$. If $u$ is already settled, the entry is stale: skip it.",
          "Otherwise settle $u$: $\\text{dist}[u] = d$ is now final.",
          "**Relax** each edge $(u, v, w)$: if $d + w < \\text{dist}[v]$, set $\\text{dist}[v] = d + w$, $\\text{parent}[v] = u$, and insert $(v, d + w)$.",
          "Repeat until the queue is empty.",
        ],
      },
      { kind: "heading", text: "Worked example (the “small road map” preset)" },
      {
        kind: "p",
        text: "Edges A–B 4, A–C 2, B–C 1, B–D 5, C–D 8, C–E 10, D–E 2, D–F 6, E–F 3; source A.",
      },
      {
        kind: "table",
        head: ["Settle", "dist", "Relaxations"],
        rows: [
          ["A", "0", "B = 4, C = 2"],
          ["C", "2", "B = 3 (via C, better than 4), D = 10, E = 12"],
          ["B", "3", "D = 8 (via B, better than 10)"],
          ["D", "8", "E = 10 (better than 12), F = 14"],
          ["E", "10", "F = 13 (better than 14)"],
          ["F", "13", "—"],
        ],
      },
      {
        kind: "p",
        text: "Stale entries B:4, D:10, E:12 and F:14 are extracted later and skipped. The shortest route to F is A → C → B → D → E → F, of length 13, even though A → C → E → F uses fewer edges (length 15).",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "**Lazy deletion.** Many heap libraries cannot decrease a key. Insert a new entry instead and skip stale ones on extraction; the heap holds $O(|E|)$ entries.",
          "**Stop early** for a single target: once the target is settled, its distance is final.",
          "**Dense graphs.** Without a heap, scanning all vertices for the minimum costs $O(|V|)$ per step, $O(|V|^2)$ overall, which beats a heap when $|E| \\approx |V|^2$.",
          "**Negative weights break it.** Validate inputs, or use Bellman–Ford.",
        ],
      },
    ],
    mathematics: [
      { kind: "heading", text: "Why settled distances are final" },
      {
        kind: "p",
        text: "**Claim:** when $u$ is extracted for the first time with key $d$, $d = \\delta(s, u)$. Suppose not, and let $P$ be a shortest $s$–$u$ path. Let $(x, y)$ be the first edge of $P$ leaving the settled set. $x$ was settled correctly, and relaxing $(x, y)$ gave $\\text{dist}[y] \\le \\delta(s, x) + w(x, y) = \\delta(s, y)$. Because weights are non-negative, $\\delta(s, y) \\le \\delta(s, u) < d$. So $y$'s entry has a smaller key than $u$'s and would have been extracted first — a contradiction.",
      },
      {
        kind: "p",
        text: "The step $\\delta(s, y) \\le \\delta(s, u)$ is exactly where non-negativity is needed: the rest of $P$, from $y$ to $u$, must not have negative length.",
      },
      { kind: "heading", text: "Running time" },
      {
        kind: "p",
        text: "With a binary heap and lazy deletion there are at most $|E| + 1$ insertions and extractions, each $O(\\log |E|) = O(\\log |V|)$:",
      },
      { kind: "math", tex: "T = O\\big((|V| + |E|) \\log |V|\\big)." },
      {
        kind: "p",
        text: "A Fibonacci heap with true decrease-key gives $O(|E| + |V| \\log |V|)$.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**Counterexample for negative weights** (directed): S→A 1, S→B 2, B→A −2. Dijkstra settles A at 1, but S→B→A costs 0.",
          "**A\\* search** adds a heuristic estimate of the remaining distance to each key, exploring towards the goal. It is Dijkstra on reweighted edges when the heuristic is consistent.",
          "**Bidirectional Dijkstra** searches from both ends and is a standard speed-up for road networks.",
          "**Dial's algorithm** uses buckets instead of a heap when weights are small integers.",
          "**Johnson's algorithm** reweights a graph with negative edges (using Bellman–Ford) so that Dijkstra can then run from every vertex.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O((|V|+|E|)\\log |V|)",
      average: "O((|V|+|E|)\\log |V|)",
      worst: "O((|V|+|E|)\\log |V|)",
    },
    space: "O(|V| + |E|)",
    worstClass: "n log n",
    note: "With a binary heap and lazy deletion (the heap can hold one entry per edge). $O(|V|^2)$ with a plain array, which is better for dense graphs.",
  },
  properties: [
    { label: "Edge weights", value: "Must be non-negative" },
    { label: "Strategy", value: "Greedy" },
    { label: "Data structure", value: "Min-priority queue" },
    { label: "Output", value: "Shortest-path tree from $s$" },
  ],
  implementations: [
    {
      language: "python",
      entry: "dijkstra",
      code: `import heapq


def dijkstra(adj, s):
    """adj: {u: [[v, w], ...]} with w >= 0. Returns {v: distance or None}."""
    dist = {v: None for v in adj}
    dist[s] = 0
    heap = [(0, s)]
    while heap:
        d, u = heapq.heappop(heap)
        if d > dist[u]:
            continue  # stale entry
        for v, w in adj[u]:
            if dist[v] is None or d + w < dist[v]:
                dist[v] = d + w
                heapq.heappush(heap, (d + w, v))
    return dist
`,
      tests: [
        {
          args: [
            {
              A: [
                ["B", 4],
                ["C", 2],
              ],
              B: [
                ["A", 4],
                ["C", 1],
                ["D", 5],
              ],
              C: [
                ["A", 2],
                ["B", 1],
                ["D", 8],
                ["E", 10],
              ],
              D: [
                ["B", 5],
                ["C", 8],
                ["E", 2],
                ["F", 6],
              ],
              E: [
                ["C", 10],
                ["D", 2],
                ["F", 3],
              ],
              F: [
                ["D", 6],
                ["E", 3],
              ],
            },
            "A",
          ],
          expected: { A: 0, B: 3, C: 2, D: 8, E: 10, F: 13 },
        },
        { args: [{ A: [["B", 0]], B: [["A", 0]], C: [] }, "A"], expected: { A: 0, B: 0, C: null } },
      ],
    },
    {
      language: "javascript",
      entry: "dijkstra",
      code: `// O(V^2) array version: no heap needed, and best for dense graphs.
function dijkstra(adj, s) {
  const dist = {};
  for (const v of Object.keys(adj)) dist[v] = null;
  dist[s] = 0;
  const settled = new Set();
  for (;;) {
    let u = null;
    for (const v of Object.keys(adj)) {
      if (!settled.has(v) && dist[v] !== null && (u === null || dist[v] < dist[u])) u = v;
    }
    if (u === null) return dist;
    settled.add(u);
    for (const [v, w] of adj[u]) {
      if (dist[v] === null || dist[u] + w < dist[v]) dist[v] = dist[u] + w;
    }
  }
}
`,
      tests: [
        {
          args: [
            {
              S: [
                ["T", 10],
                ["A", 1],
              ],
              A: [
                ["S", 1],
                ["B", 1],
              ],
              B: [
                ["A", 1],
                ["T", 1],
              ],
              T: [
                ["S", 10],
                ["B", 1],
              ],
            },
            "S",
          ],
          expected: { S: 0, A: 1, B: 2, T: 3 },
        },
      ],
    },
  ],
  visualizer: "dijkstra",
  practice: [
    {
      id: "dijkstra-negative",
      kind: "mcq",
      prompt:
        "Why can Dijkstra's algorithm give wrong answers when some edge weights are negative?",
      options: [
        "A settled vertex could later be reached more cheaply through a negative edge",
        "The priority queue cannot store negative numbers",
        "It would loop forever",
        "Negative weights make the graph disconnected",
      ],
      answer: 0,
      explanation:
        "The correctness proof needs every path extension to cost at least 0, so that nothing extracted later can improve a settled distance.",
      distractors: {
        1: "Priority queues handle negative keys without trouble.",
        2: "Each vertex is settled at most once, so it terminates; it just may be wrong.",
        3: "Weights do not affect connectivity.",
      },
      hints: ["Which step of the proof uses $w \\ge 0$?"],
      objective: "Know the precondition",
    },
    {
      id: "dijkstra-example",
      kind: "numeric",
      prompt:
        "Graph S–T 10, S–A 1, A–B 1, B–T 1 (undirected). What is the shortest distance from S to T?",
      answer: 3,
      explanation: "S → A → B → T costs 1 + 1 + 1 = 3, less than the direct edge of weight 10.",
      hints: ["Compare the direct edge with the three-edge route."],
      objective: "Compute shortest distances",
    },
    {
      id: "dijkstra-complexity",
      kind: "mcq",
      prompt: "With a binary heap, what is Dijkstra's running time?",
      options: [
        "$O((|V| + |E|) \\log |V|)$",
        "$O(|V| + |E|)$",
        "$O(|V| \\cdot |E|)$",
        "$O(|E| \\log |E| \\log |V|)$",
      ],
      answer: 0,
      explanation:
        "Each vertex extraction and each successful relaxation costs one $O(\\log |V|)$ heap operation.",
      distractors: {
        1: "That is BFS, which needs no priority queue.",
        2: "That is Bellman–Ford.",
        3: "There is only one logarithmic factor per heap operation.",
      },
      hints: ["Count heap operations, then multiply by the cost of each."],
      objective: "Analyse with a heap",
    },
  ],
  exam: {
    definition:
      "Dijkstra's algorithm computes single-source shortest paths in a graph with non-negative edge weights by repeatedly settling the unsettled vertex with the smallest tentative distance and relaxing its outgoing edges.",
    steps: [
      "Initialise $\\text{dist}[s] = 0$, all others $\\infty$; insert $s$ into a min-priority queue.",
      "Extract the vertex $u$ with minimum distance; mark it settled.",
      "For each edge $(u, v)$: if $\\text{dist}[u] + w(u, v) < \\text{dist}[v]$, update $\\text{dist}[v]$ and $\\text{parent}[v]$ and update the queue.",
      "Repeat until the queue is empty.",
    ],
    timeComplexity:
      "$O((V + E) \\log V)$ with a binary heap; $O(V^2)$ with an array; $O(E + V \\log V)$ with a Fibonacci heap.",
    spaceComplexity:
      "$O(V)$ for distances and parents, plus the queue ($O(E)$ with lazy deletion).",
    correctness:
      "Greedy-choice argument: when a vertex is extracted, any other path to it must leave the settled set through a vertex with a no-smaller key, and non-negative weights mean the rest of that path cannot reduce the total.",
    applications: [
      "Route planning on road networks",
      "Link-state network routing (e.g. OSPF computes shortest-path trees with it)",
      "As a subroutine in Johnson's algorithm and A* search",
    ],
    limitations: [
      "Fails with negative edge weights",
      "Computes all distances from one source; repeated runs needed for all pairs",
    ],
    faq: [
      {
        q: "How is it different from BFS?",
        a: "BFS assumes every edge has weight 1 and uses a FIFO queue; Dijkstra handles arbitrary non-negative weights with a priority queue.",
      },
      {
        q: "What does “relax an edge” mean?",
        a: "Check whether going through $u$ gives a shorter path to $v$, and if so, update $\\text{dist}[v]$.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Greedy single-source shortest paths for non-negative weights using a priority queue.",
          "$O((V+E)\\log V)$ with a binary heap.",
        ],
      },
      {
        marks: 5,
        outline: [
          "Definition and precondition (1).",
          "Pseudocode with relaxation (2).",
          "Short worked example (1).",
          "Complexity (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Problem statement and precondition — 1.",
          "Pseudocode with relaxation and the priority queue — 2.",
          "Full worked example: table of settled vertices and distances — 3.",
          "Correctness argument and why negative weights fail (with a counterexample) — 2.",
          "Complexity for array vs heap implementations; applications — 2.",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "E. W. Dijkstra, “A note on two problems in connexion with graphs,” Numerische Mathematik, 1, 1959.",
      supports: "Original description of the algorithm.",
    },
    {
      citation:
        "M. L. Fredman, R. E. Tarjan, “Fibonacci heaps and their uses in improved network optimization algorithms,” Journal of the ACM, 34(3), 1987.",
      supports: "The $O(E + V \\log V)$ bound.",
    },
    {
      citation:
        "T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 3rd ed., MIT Press, 2009, §24.3.",
      supports: "Correctness proof and analysis.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and quantitative claims are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-20",
};
