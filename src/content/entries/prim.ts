import type { AlgorithmEntry } from "../types";

export const primEntry: AlgorithmEntry = {
  slug: "prim",
  name: "Prim's Algorithm",
  aliases: [
    "Prim",
    "Jarník's algorithm",
    "Prim–Jarník",
    "Minimum spanning tree (Prim)",
    "DJP algorithm",
  ],
  curriculum: [217],
  domain: "graphs",
  subcategory: "Minimum Spanning Trees",
  difficulty: "intermediate",
  summary:
    "Grows a minimum spanning tree from a start vertex, always adding the cheapest edge that leaves the tree, with a priority queue keyed by that edge's weight.",
  tags: ["mst", "minimum spanning tree", "greedy", "priority queue", "weighted graph"],
  prerequisites: ["Graphs", "Priority Queues"],
  related: ["kruskal", "dijkstra", "union-find"],
  problem: {
    input: "An undirected weighted graph and a start vertex.",
    output:
      "A minimum-weight set of edges connecting every vertex reachable from the start, with no cycle.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Start with one town connected. Repeatedly look at every road from a connected town to an unconnected one and build the cheapest. The connected region grows one town at a time, and it never pays to build a road inside the region.",
      },
      {
        kind: "callout",
        tone: "note",
        title: "Compared with Dijkstra",
        text: "The code is almost Dijkstra's algorithm. The difference is the key: Dijkstra ranks a vertex by its distance from the start, $d[u] + w$; Prim ranks it by the single edge that would connect it, $w$.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Set every key to ∞ except the start, whose key is 0, and put the start in a priority queue.",
          "Extract the vertex $u$ with the smallest key. If it is already in the tree, skip this stale entry.",
          "Add $u$ to the tree, joined by the edge that set its key.",
          "For each edge $(u, v, w)$ to a vertex outside the tree: if $w < key[v]$, set $key[v] = w$, $parent[v] = u$ and insert $(v, w)$.",
          "Repeat until the queue is empty.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset, from A). The tree is the same 39-weight tree that Kruskal finds, built in a different order:",
      },
      {
        kind: "table",
        head: ["Extract", "Edge added", "Keys improved afterwards"],
        rows: [
          ["A:0", "—", "B = 7, D = 5"],
          ["D:5", "A–D (5)", "F = 6, E = 15"],
          ["F:6", "D–F (6)", "E = 8, G = 11"],
          ["B:7", "A–B (7)", "C = 8, E = 7"],
          ["E:7", "B–E (7)", "C = 5, G = 9"],
          ["C:5", "E–C (5)", "none"],
          ["G:9", "E–G (9)", "none"],
        ],
      },
      {
        kind: "p",
        text: "Stale entries (C:8, E:8, G:11, E:15) are extracted and skipped along the way, so there are 11 extractions in total. Total weight: $5 + 6 + 7 + 7 + 5 + 9 = 39$.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "**Lazy deletion** (as here): insert a new entry when a key improves and skip stale ones on extraction. Simple, and the queue holds at most $E$ entries.",
          "**Decrease-key:** an indexed heap updates a vertex's entry in place, keeping the queue at $V$ entries.",
          "**Dense graphs:** with an adjacency matrix, an $O(V^2)$ version that scans an array of keys is faster than any heap.",
          "Only the start's component is spanned. Run it again from an unvisited vertex for a spanning forest.",
          "Negative weights are fine, unlike in Dijkstra's algorithm.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Correctness.** Let $S$ be the set of vertices already in the tree. The extracted vertex is joined by a lightest edge crossing the cut $(S, V \\setminus S)$, because every crossing edge has been offered to the queue with its weight. By the cut property this edge belongs to a minimum spanning tree that extends the current tree; induction on $|S|$ completes the proof.",
      },
      {
        kind: "math",
        tex: "T = O(E \\log V) \\text{ (binary heap)}, \\quad O(E + V \\log V) \\text{ (Fibonacci heap)}, \\quad O(V^2) \\text{ (array)}",
      },
      {
        kind: "p",
        text: "With lazy deletion the queue holds up to $E$ entries, so each operation costs $O(\\log E) = O(\\log V)$ and the total is $O(E \\log V)$.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Jarník described the algorithm in 1930; Prim (1957) and Dijkstra (1959) rediscovered it independently.",
          "**Borůvka's algorithm** runs Prim-like steps from every component at once and parallelises well.",
          "Because each step uses only the edges around the current tree, Prim's algorithm suits graphs given implicitly, such as points in the plane where every pair is an edge.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(E \\log V)", average: "O(E \\log V)", worst: "O(E \\log V)" },
    space: "O(V + E)",
    worstClass: "n log n",
    note: "With a binary heap and lazy deletion. $O(V^2)$ with an array, which is better for dense graphs.",
  },
  properties: [
    { label: "Strategy", value: "Greedy, grows one tree" },
    { label: "Needs a start vertex", value: "Yes; spans only its component" },
    { label: "Negative weights", value: "Allowed" },
  ],
  implementations: [
    {
      language: "python",
      entry: "prim",
      code: `import heapq

def prim(n, edges, start=0):
    """n vertices 0..n-1; undirected edges [u, v, w]. Returns the MST weight of start's component."""
    adj = [[] for _ in range(n)]
    for u, v, w in edges:
        adj[u].append((w, v))
        adj[v].append((w, u))
    in_tree = [False] * n
    heap = [(0, start)]
    total = 0
    while heap:
        w, u = heapq.heappop(heap)
        if in_tree[u]:
            continue          # stale entry
        in_tree[u] = True
        total += w
        for wv, v in adj[u]:
            if not in_tree[v]:
                heapq.heappush(heap, (wv, v))
    return total
`,
      tests: [
        {
          args: [
            7,
            [
              [0, 1, 7],
              [0, 3, 5],
              [1, 2, 8],
              [1, 3, 9],
              [1, 4, 7],
              [2, 4, 5],
              [3, 4, 15],
              [3, 5, 6],
              [4, 5, 8],
              [4, 6, 9],
              [5, 6, 11],
            ],
          ],
          expected: 39,
        },
        {
          args: [
            5,
            [
              [0, 1, 3],
              [1, 2, 1],
              [0, 2, 2],
              [3, 4, 4],
            ],
          ],
          expected: 3,
        },
      ],
    },
    {
      language: "javascript",
      entry: "primDense",
      code: `// O(V^2) Prim on an adjacency matrix; Infinity means no edge.
function primDense(w) {
  const n = w.length;
  const key = new Array(n).fill(Infinity);
  const inTree = new Array(n).fill(false);
  key[0] = 0;
  let total = 0;
  for (let step = 0; step < n; step++) {
    let u = -1;
    for (let v = 0; v < n; v++)
      if (!inTree[v] && (u === -1 || key[v] < key[u])) u = v;
    if (key[u] === Infinity) break; // the rest is not connected to vertex 0
    inTree[u] = true;
    total += key[u];
    for (let v = 0; v < n; v++)
      if (!inTree[v] && w[u][v] < key[v]) key[v] = w[u][v];
  }
  return total;
}
`,
      tests: [
        {
          args: [
            [
              [Infinity, 2, Infinity, 6],
              [2, Infinity, 3, 8],
              [Infinity, 3, Infinity, Infinity],
              [6, 8, Infinity, Infinity],
            ],
          ],
          expected: 11,
        },
      ],
    },
  ],
  visualizer: "prim",
  practice: [
    {
      id: "prim-vs-dijkstra",
      kind: "mcq",
      prompt:
        "In the graph S–A 2, S–B 2, A–B 1, A–C 2, B–C 2, which tree does Prim's algorithm from S build?",
      options: [
        "S–A, A–B, A–C (weight 5)",
        "S–A, S–B, A–C (weight 6)",
        "S–A, S–B, B–C (weight 6)",
        "S–B, A–B, B–C (weight 5), always",
      ],
      answer: 0,
      explanation:
        "From S, A and B both have key 2; A is taken first (ties by id). Then A–B (1) makes B's key 1, and A–C gives C key 2. The tree S–A, A–B, A–C weighs 5. A shortest-path tree from S would use S–B instead and weigh 6.",
      distractors: {
        1: "That is a shortest-path tree (weight 6), not a minimum spanning tree.",
        2: "Also weight 6; A–B with weight 1 should be used.",
        3: "Weight 5 too, but Prim takes A before B here because of the tie-break, so it builds a different minimum tree.",
      },
      hints: ["Prim's key for B becomes the single edge A–B once A is in the tree."],
      objective: "Distinguish Prim from Dijkstra",
    },
    {
      id: "prim-extractions",
      kind: "numeric",
      prompt: "In the worked example, how many priority-queue extractions are stale (skipped)?",
      answer: 4,
      explanation:
        "There are 11 extractions and 7 vertices; each vertex is added once, so 11 − 7 = 4 are stale (C:8, E:8, G:11, E:15).",
      hints: ["Every vertex is added to the tree exactly once."],
      objective: "Understand lazy deletion",
    },
  ],
  exam: {
    definition:
      "Prim's algorithm builds a minimum spanning tree from a start vertex by repeatedly adding the lightest edge between the tree and a vertex outside it.",
    steps: [
      "key[s] = 0, all other keys ∞; insert s into a priority queue.",
      "Extract the minimum-key vertex u not yet in the tree; add it with its parent edge.",
      "For each edge (u, v, w) with v outside the tree and w < key[v]: key[v] = w, parent[v] = u, insert v.",
      "Repeat until the queue is empty.",
    ],
    timeComplexity:
      "$O(E \\log V)$ with a binary heap; $O(E + V \\log V)$ with a Fibonacci heap; $O(V^2)$ with an array.",
    spaceComplexity: "$O(V + E)$.",
    correctness:
      "Each added edge is a lightest edge crossing the cut between the tree and the remaining vertices, so by the cut property it extends a minimum spanning tree.",
    applications: ["Network design", "Approximate metric TSP", "Maze generation (randomised Prim)"],
    limitations: ["Spans only the start's component", "Needs a priority queue for sparse graphs"],
    faq: [
      {
        q: "Why does Prim allow negative weights when Dijkstra does not?",
        a: "Prim compares single edge weights, and the cut property holds for any weights. Dijkstra relies on path lengths never decreasing as paths grow, which fails with negative edges.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Grow one tree by the cheapest edge leaving it.",
          "Priority queue keyed by edge weight; $O(E \\log V)$.",
        ],
      },
      {
        marks: 5,
        outline: [
          "Algorithm steps (2).",
          "Worked example table (2).",
          "Complexity with a heap (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "MST definition and cut property (2).",
          "Pseudocode (2).",
          "Worked example (2).",
          "Correctness proof (2).",
          "Complexity for array and heap versions; comparison with Kruskal (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "V. Jarník, “O jistém problému minimálním,” Práce Moravské Přírodovědecké Společnosti, 6, 1930.",
      supports: "The first description of the algorithm.",
    },
    {
      citation:
        "R. C. Prim, “Shortest connection networks and some generalizations,” Bell System Technical Journal, 36(6), 1957.",
      supports: "The algorithm as usually taught.",
    },
    {
      citation:
        "E. W. Dijkstra, “A note on two problems in connexion with graphs,” Numerische Mathematik, 1, 1959.",
      supports: "An independent rediscovery (the paper's first problem).",
    },
    {
      citation:
        "T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 3rd ed., MIT Press, 2009, §23.2.",
      supports: "Heap-based Prim and its running time.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-21",
};
