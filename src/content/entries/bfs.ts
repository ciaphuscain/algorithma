import type { AlgorithmEntry } from "../types";

export const bfsEntry: AlgorithmEntry = {
  slug: "bfs",
  name: "Breadth-First Search",
  aliases: ["BFS", "Level-order traversal (on trees)"],
  curriculum: [201],
  domain: "graphs",
  subcategory: "Graph traversal",
  difficulty: "beginner",
  summary:
    "Explores a graph in waves of increasing distance from a source, using a FIFO queue; finds shortest paths by edge count.",
  tags: ["graph", "traversal", "queue", "shortest path", "unweighted"],
  prerequisites: ["Graphs and adjacency lists", "Queues"],
  related: ["dfs", "dijkstra"],
  problem: {
    input: "A graph $G = (V, E)$ given as adjacency lists, and a source vertex $s \\in V$.",
    output:
      "For every vertex $v$, the length $\\delta(s, v)$ of a shortest path from $s$ to $v$ counted in edges ($\\infty$ if unreachable), and a parent pointer forming a shortest-path tree.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Drop a stone in a pond. The ripple reaches everything one step away, then everything two steps away, and so on. BFS explores a graph the same way: first the source, then all its neighbours, then all *their* new neighbours.",
      },
      {
        kind: "p",
        text: "A queue enforces this order: vertices are processed first-in, first-out, so everything at distance $d$ is processed before anything at distance $d+1$. As a result, the first time BFS reaches a vertex, it has reached it by a shortest route.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Mark every vertex undiscovered ($\\text{dist} = \\infty$). Set $\\text{dist}[s] = 0$ and enqueue $s$.",
          "While the queue is not empty, dequeue a vertex $u$.",
          "For each neighbour $v$ of $u$: if $v$ is undiscovered, set $\\text{dist}[v] = \\text{dist}[u] + 1$, $\\text{parent}[v] = u$, and enqueue $v$.",
          "When the queue empties, every vertex reachable from $s$ has its final distance.",
        ],
      },
      { kind: "heading", text: "Worked example" },
      {
        kind: "p",
        text: "Edges A–B, A–C, B–D, C–D, D–E, C–F; source A; neighbours scanned in alphabetical order.",
      },
      {
        kind: "table",
        head: ["Dequeue", "Newly discovered", "Queue after", "Distances fixed"],
        rows: [
          ["A", "B, C (dist 1)", "B, C", "A=0"],
          ["B", "D (dist 2)", "C, D", "B=1"],
          ["C", "F (dist 2)", "D, F", "C=1"],
          ["D", "E (dist 3)", "F, E", "D=2"],
          ["F", "—", "E", "F=2"],
          ["E", "—", "(empty)", "E=3"],
        ],
      },
      {
        kind: "p",
        text: "D is discovered from B, not C, because B was dequeued first. Both give distance 2: shortest paths need not be unique, but their length is.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "**Mark vertices when they are enqueued, not when they are dequeued.** Otherwise a vertex can enter the queue several times, and the running time is no longer $O(V+E)$.",
          "**Use a real queue.** Removing from the front of a Python list with `pop(0)` costs $O(n)$; use `collections.deque`. In JavaScript, keep a head index instead of calling `shift()`.",
          "**Disconnected graphs.** BFS from $s$ reaches only $s$'s component. To visit every vertex, start a new BFS from each undiscovered vertex.",
          "**Recover a path** by following parent pointers back from the target to $s$, then reversing.",
        ],
      },
    ],
    mathematics: [
      { kind: "heading", text: "Running time" },
      {
        kind: "p",
        text: "Each vertex is enqueued at most once, because it is enqueued only while $\\text{dist} = \\infty$ and that changes immediately. Each dequeued vertex scans its adjacency list once. With adjacency lists the total work is",
      },
      { kind: "math", tex: "O\\Big(|V| + \\sum_{u \\in V} \\deg(u)\\Big) = O(|V| + |E|)," },
      {
        kind: "p",
        text: "since the degrees sum to $2|E|$ in an undirected graph and $|E|$ in a directed one. With an adjacency matrix, scanning a row costs $\\Theta(|V|)$, giving $\\Theta(|V|^2)$.",
      },
      { kind: "heading", text: "Correctness" },
      {
        kind: "p",
        text: "**Upper bound.** Whenever $\\text{dist}[v]$ is set to $\\text{dist}[u] + 1$, it is the length of an actual walk $s \\leadsto u \\to v$, so $\\text{dist}[v] \\ge \\delta(s, v)$ always.",
      },
      {
        kind: "p",
        text: "**Queue invariant.** If the queue holds $v_1, \\dots, v_r$ (front to back), then $\\text{dist}[v_1] \\le \\dots \\le \\text{dist}[v_r] \\le \\text{dist}[v_1] + 1$. Dequeuing $v_1$ and appending neighbours with distance $\\text{dist}[v_1] + 1$ preserves it. So vertices are dequeued in non-decreasing order of $\\text{dist}$.",
      },
      {
        kind: "p",
        text: "**Exactness.** Suppose some $v$ ends with $\\text{dist}[v] > \\delta(s,v)$; take such a $v$ with the smallest $\\delta(s,v)$, and let $u$ be its predecessor on a shortest path, so $\\delta(s,u) = \\delta(s,v) - 1$ and $\\text{dist}[u] = \\delta(s,u)$. When $u$ is dequeued, $v$ is either undiscovered — then it gets $\\text{dist}[u] + 1 = \\delta(s,v)$ — or already discovered by a vertex dequeued no later than $u$, which by the queue invariant gives $\\text{dist}[v] \\le \\text{dist}[u] + 1$. Both contradict the assumption.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**0–1 BFS.** With edge weights in $\\{0, 1\\}$, push 0-edges to the front of a deque and 1-edges to the back to get shortest paths in $O(V+E)$.",
          "**Bidirectional BFS** searches from both ends and stops when the frontiers meet. In graphs with branching factor $b$ this explores roughly $2b^{d/2}$ vertices instead of $b^d$.",
          "**Multi-source BFS** starts with several sources at distance 0, e.g. distance to the nearest exit in a grid.",
          "**Applications inside other algorithms:** bipartiteness testing (2-colour by level parity), Edmonds–Karp augmenting paths, and the level graph in Dinic's algorithm.",
        ],
      },
      {
        kind: "callout",
        tone: "warning",
        text: "BFS minimises the number of edges, not total weight. On weighted graphs use Dijkstra's algorithm (non-negative weights) or Bellman–Ford (negative weights allowed).",
      },
    ],
  },
  complexity: {
    time: { best: "O(|V| + |E|)", average: "O(|V| + |E|)", worst: "O(|V| + |E|)" },
    space: "O(|V|)",
    worstClass: "n + m",
    note: "With adjacency lists. An adjacency matrix makes it $\\Theta(|V|^2)$. The $O(|V|)$ space is for the queue, distances and parents, in addition to the graph itself.",
  },
  properties: [
    { label: "Data structure", value: "FIFO queue" },
    { label: "Shortest paths", value: "Yes, by edge count" },
    { label: "Weighted graphs", value: "No (use Dijkstra)" },
    { label: "Directed graphs", value: "Yes" },
  ],
  implementations: [
    {
      language: "python",
      entry: "bfs",
      code: `from collections import deque


def bfs(adj, s):
    """Return {vertex: hop distance from s, or None if unreachable}."""
    dist = {v: None for v in adj}
    dist[s] = 0
    queue = deque([s])
    while queue:
        u = queue.popleft()
        for v in adj[u]:
            if dist[v] is None:
                dist[v] = dist[u] + 1
                queue.append(v)
    return dist
`,
      tests: [
        {
          args: [
            {
              A: ["B", "C"],
              B: ["A", "D"],
              C: ["A", "D", "F"],
              D: ["B", "C", "E"],
              E: ["D"],
              F: ["C"],
            },
            "A",
          ],
          expected: { A: 0, B: 1, C: 1, D: 2, E: 3, F: 2 },
        },
        { args: [{ A: ["B"], B: ["A"], C: [] }, "A"], expected: { A: 0, B: 1, C: null } },
        { args: [{ X: [] }, "X"], expected: { X: 0 } },
      ],
    },
    {
      language: "javascript",
      entry: "bfs",
      code: `function bfs(adj, s) {
  const dist = {};
  for (const v of Object.keys(adj)) dist[v] = null;
  dist[s] = 0;
  const queue = [s];
  for (let head = 0; head < queue.length; head++) {
    const u = queue[head];
    for (const v of adj[u]) {
      if (dist[v] === null) {
        dist[v] = dist[u] + 1;
        queue.push(v);
      }
    }
  }
  return dist;
}
`,
      tests: [
        {
          args: [
            {
              A: ["B", "C"],
              B: ["A", "D"],
              C: ["A", "D", "F"],
              D: ["B", "C", "E"],
              E: ["D"],
              F: ["C"],
            },
            "A",
          ],
          expected: { A: 0, B: 1, C: 1, D: 2, E: 3, F: 2 },
        },
        { args: [{ A: ["B"], B: [], C: ["A"] }, "A"], expected: { A: 0, B: 1, C: null } },
      ],
    },
  ],
  visualizer: "bfs",
  practice: [
    {
      id: "bfs-structure",
      kind: "mcq",
      prompt: "Which data structure gives BFS its level-by-level order?",
      options: ["A FIFO queue", "A LIFO stack", "A min-priority queue", "A hash set"],
      answer: 0,
      explanation:
        "First-in, first-out processing guarantees every vertex at distance $d$ is processed before any vertex at distance $d+1$.",
      distractors: {
        1: "A stack gives depth-first order.",
        2: "A priority queue keyed by distance gives Dijkstra's algorithm; it works but costs an extra $\\log$ factor that BFS does not need.",
        3: "A set records which vertices were seen, but imposes no processing order.",
      },
      hints: ["Which order should vertices leave the frontier in?"],
      objective: "Identify the core data structure",
    },
    {
      id: "bfs-example-distance",
      kind: "numeric",
      prompt:
        "In the graph with edges A–B, A–C, B–D, C–D, D–E, C–F, what is the BFS distance from A to E?",
      answer: 3,
      explanation: "A→B→D→E (or A→C→D→E) uses 3 edges, and no shorter path exists.",
      hints: ["Compute the distance level by level: which vertices are at distance 1, then 2?"],
      objective: "Compute hop distances",
    },
    {
      id: "bfs-weighted",
      kind: "mcq",
      prompt: "Can plain BFS find the minimum-weight path in a graph with positive edge weights?",
      options: [
        "No — it minimises the number of edges, not their total weight",
        "Yes, as long as all weights are positive",
        "Yes, if neighbours are visited in order of weight",
        "Only on directed graphs",
      ],
      answer: 0,
      explanation:
        "A path with more edges can have smaller total weight. Use Dijkstra's algorithm for non-negative weights.",
      distractors: {
        1: "Counterexample: A–C weight 10 versus A–B–C with weights 1 and 1. BFS reports the one-edge path.",
        2: "Sorting the neighbours of one vertex does not compare paths of different lengths.",
        3: "Direction does not matter; the issue is weights.",
      },
      hints: ["Find a two-edge path that is lighter than a one-edge path."],
      objective: "Know when BFS applies",
    },
    {
      id: "bfs-matrix",
      kind: "mcq",
      prompt: "What is the running time of BFS on a graph stored as an adjacency matrix?",
      options: ["$\\Theta(|V|^2)$", "$O(|V| + |E|)$", "$O(|E| \\log |V|)$", "$O(|V|)$"],
      answer: 0,
      explanation:
        "Finding the neighbours of one vertex means scanning a whole row of $|V|$ entries, and every reachable vertex is scanned once.",
      distractors: {
        1: "$O(|V|+|E|)$ needs adjacency lists, where scanning a vertex costs only its degree.",
        2: "There is no priority queue in BFS, so no logarithmic factor.",
        3: "Every edge (matrix entry) can need inspecting.",
      },
      hints: ["How long does it take to list one vertex's neighbours in a matrix?"],
      objective: "Analyse representation-dependent cost",
    },
  ],
  exam: {
    definition:
      "Breadth-first search is a graph traversal that, starting from a source $s$, visits vertices in non-decreasing order of their distance (number of edges) from $s$, using a FIFO queue. It computes shortest-path distances and a shortest-path tree in unweighted graphs.",
    steps: [
      "Initialise $\\text{dist}[v] = \\infty$ for all $v$; set $\\text{dist}[s] = 0$ and enqueue $s$.",
      "While the queue is non-empty, dequeue $u$.",
      "For each neighbour $v$ of $u$ with $\\text{dist}[v] = \\infty$: set $\\text{dist}[v] = \\text{dist}[u] + 1$, $\\text{parent}[v] = u$, enqueue $v$.",
      "On termination, $\\text{dist}[v] = \\delta(s, v)$ for every vertex.",
    ],
    timeComplexity:
      "$O(|V| + |E|)$ with adjacency lists: each vertex is enqueued once and each adjacency list scanned once. $\\Theta(|V|^2)$ with an adjacency matrix.",
    spaceComplexity: "$O(|V|)$ for the queue, distance and parent arrays.",
    correctness:
      "The queue always holds vertices whose distances differ by at most one, in non-decreasing order, so vertices are discovered in order of distance. A minimal-counterexample argument then shows the first discovery of each vertex uses a shortest path.",
    applications: [
      "Shortest paths in unweighted graphs and grids (mazes, game maps)",
      "Connected components and reachability",
      "Testing whether a graph is bipartite",
      "Finding augmenting paths in Edmonds–Karp maximum flow",
      "Degrees of separation in social networks; web crawling by link depth",
    ],
    limitations: [
      "Does not handle edge weights",
      "Memory grows with the width of the frontier, which can be large in wide graphs",
    ],
    faq: [
      {
        q: "BFS or DFS for shortest paths?",
        a: "BFS. DFS does not explore in order of distance, so the first path it finds can be long.",
      },
      {
        q: "Why mark on enqueue?",
        a: "So each vertex enters the queue at most once; marking on dequeue allows duplicates.",
      },
      { q: "Does BFS work on directed graphs?", a: "Yes; follow only outgoing edges." },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Traversal from a source by increasing distance using a FIFO queue.",
          "$O(V+E)$ time; finds shortest paths in unweighted graphs.",
        ],
      },
      {
        marks: 5,
        outline: [
          "Definition and the role of the queue (1 mark).",
          "Pseudocode with dist/parent initialisation (2 marks).",
          "Small worked example with the queue contents (1 mark).",
          "Complexity with adjacency lists versus matrix (1 mark).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Definition, problem statement and intuition — 2 marks.",
          "Pseudocode — 2 marks.",
          "Dry run on a 6–8 vertex graph showing queue and distances each step — 3 marks.",
          "Complexity derivation $O(V+E)$ — 1 mark.",
          "Correctness argument (queue invariant) and applications — 2 marks.",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "E. F. Moore, “The shortest path through a maze,” Proc. International Symposium on the Theory of Switching, Harvard University Press, 1959.",
      supports: "An early published description of breadth-first search for shortest paths.",
    },
    {
      citation:
        "C. Y. Lee, “An algorithm for path connections and its applications,” IRE Transactions on Electronic Computers, 1961.",
      supports: "Independent use of breadth-first wavefront expansion for circuit wire routing.",
    },
    {
      citation:
        "T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 3rd ed., MIT Press, 2009, Ch. 22.",
      supports: "Standard presentation, running-time analysis and correctness proof.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and quantitative claims are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-19",
};
