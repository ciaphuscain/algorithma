import type { AlgorithmEntry } from "../types";

export const bellmanFordEntry: AlgorithmEntry = {
  slug: "bellman-ford",
  name: "Bellman–Ford Algorithm",
  aliases: ["Bellman-Ford", "Bellman–Ford–Moore", "Negative cycle detection"],
  curriculum: [208],
  domain: "graphs",
  subcategory: "Shortest Paths",
  difficulty: "intermediate",
  summary:
    "Finds shortest paths from one source in a graph that may have negative edge weights, by relaxing every edge |V| − 1 times, and detects negative cycles with one more pass.",
  tags: [
    "shortest path",
    "negative weights",
    "negative cycle",
    "dynamic programming",
    "relaxation",
  ],
  prerequisites: ["Graphs", "Dijkstra's Algorithm"],
  related: ["dijkstra", "floyd-warshall", "bfs"],
  problem: {
    input: "A directed graph with integer edge weights (possibly negative) and a source vertex.",
    output:
      "The shortest distance from the source to every vertex, or a report that a negative cycle is reachable, in which case some distances are undefined.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Dijkstra's algorithm settles the closest vertex and never looks back, which fails if a later negative edge could make a settled vertex cheaper. Bellman–Ford is patient instead: it simply improves every estimate it can, over and over. After enough rounds every shortest path has been discovered, because a shortest path never needs more than $|V| - 1$ edges.",
      },
      {
        kind: "p",
        text: "If something can still improve after that many rounds, the only explanation is a cycle with negative total weight: going round it again always helps, so there is no shortest path.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Set $d[s] = 0$ and every other $d[v] = \\infty$.",
          "Repeat $|V| - 1$ times: for every edge $(u, v, w)$, if $d[u] + w < d[v]$, set $d[v] = d[u] + w$ and $parent[v] = u$ (this is a **relaxation**).",
          "Stop early if a whole round changes nothing.",
          "One more pass: if any edge can still be relaxed, a negative cycle is reachable from $s$.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset). Edges are relaxed in the order S→A 4, S→B 5, A→C −2, B→A −3, B→C 4, C→D 3, B→D 7.",
      },
      {
        kind: "table",
        head: ["After round", "d[S]", "d[A]", "d[B]", "d[C]", "d[D]"],
        rows: [
          ["start", "0", "∞", "∞", "∞", "∞"],
          ["1", "0", "2", "5", "2", "5"],
          ["2", "0", "2", "5", "0", "3"],
          ["3", "0", "2", "5", "0", "3"],
        ],
      },
      {
        kind: "p",
        text: "In round 1, A first gets 4 from S, then 2 via B (5 − 3). C was set to 2 from the old value of A, so it improves only in round 2. Round 3 changes nothing, so the algorithm stops early: 3 rounds instead of $|V| - 1 = 4$, with 7 relaxations in total.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Skip edges out of vertices whose distance is still ∞; with integer infinity stand-ins, ∞ + w can overflow or look finite.",
          "The edge order affects how many rounds are needed, never the final answer. An order that follows the shortest paths finishes in one round; the reverse order needs all $|V| - 1$ (see the third preset).",
          "To list the vertices affected by a negative cycle, mark every vertex that relaxes in pass $|V|$, then everything reachable from those.",
          "For undirected graphs, a negative edge is itself a negative cycle (go back and forth), so the algorithm is used on directed graphs.",
        ],
      },
      {
        kind: "callout",
        tone: "tip",
        title: "SPFA",
        text: "The queue-based variant (often called SPFA) only re-relaxes edges out of vertices whose distance just changed. It is often faster in practice but has the same $O(VE)$ worst case.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Invariant.** After round $k$, $d[v]$ is at most the weight of the shortest path from $s$ to $v$ that uses at most $k$ edges. Proof by induction: if such a path ends with edge $(u, v)$, its first part uses at most $k - 1$ edges, so after round $k - 1$ we have $d[u] \\le$ its weight, and relaxing $(u, v)$ in round $k$ gives the bound for $v$.",
      },
      {
        kind: "p",
        text: "Without negative cycles some shortest path to each vertex is simple, so it has at most $|V| - 1$ edges, and after $|V| - 1$ rounds every $d[v]$ is exact. Distances never drop below true path weights, so no further relaxation is possible. Conversely, if a negative cycle $v_0, \\dots, v_k = v_0$ is reachable, summing $d[v_i] \\le d[v_{i-1}] + w(v_{i-1}, v_i)$ round the cycle would give $0 \\le w(\\text{cycle}) < 0$, so some edge on it must still relax.",
      },
      {
        kind: "math",
        tex: "T(V, E) = O(V \\cdot E), \\qquad \\text{space } O(V)",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Bellman–Ford is a dynamic programme over the number of edges, $d_k[v] = \\min(d_{k-1}[v], \\min_{(u,v)} d_{k-1}[u] + w(u, v))$; the in-place version only converges faster.",
          "**Distance-vector routing** (RIP) is a distributed Bellman–Ford, where each router relaxes using its neighbours' tables. It suffers from the count-to-infinity problem.",
          "**Johnson's algorithm** runs Bellman–Ford once to reweight a graph so all weights become non-negative, then Dijkstra from every vertex: $O(VE \\log V)$ all-pairs shortest paths on sparse graphs.",
          "Systems of **difference constraints** $x_j - x_i \\le c$ are solved by Bellman–Ford on the constraint graph; a negative cycle means they are infeasible.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(E)", average: "O(V E)", worst: "O(V E)" },
    space: "O(V)",
    worstClass: "n^2",
    note: "The best case is one round that changes nothing after the first, thanks to the early stop.",
  },
  properties: [
    { label: "Negative weights", value: "Allowed" },
    { label: "Negative cycles", value: "Detected" },
    {
      label: "Compared with Dijkstra",
      value: "Slower, $O(VE)$ against $O(E \\log V)$, but more general",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "bellman_ford",
      code: `def bellman_ford(n, edges, s):
    """Directed edges [u, v, w] on vertices 0..n-1. Returns distances (None = unreachable),
    or the string "negative cycle" if one is reachable from s."""
    INF = float("inf")
    d = [INF] * n
    d[s] = 0
    for _ in range(n - 1):
        changed = False
        for u, v, w in edges:
            if d[u] != INF and d[u] + w < d[v]:
                d[v] = d[u] + w
                changed = True
        if not changed:
            break
    for u, v, w in edges:
        if d[u] != INF and d[u] + w < d[v]:
            return "negative cycle"
    return [None if x == INF else x for x in d]
`,
      tests: [
        {
          // S, A, B, C, D = 0..4, edges in the worked example's order.
          args: [
            5,
            [
              [0, 1, 4],
              [0, 2, 5],
              [1, 3, -2],
              [2, 1, -3],
              [2, 3, 4],
              [3, 4, 3],
              [2, 4, 7],
            ],
            0,
          ],
          expected: [0, 2, 5, 0, 3],
        },
        {
          args: [
            5,
            [
              [0, 1, 1],
              [1, 2, 2],
              [2, 3, -4],
              [3, 1, 1],
              [3, 4, 2],
            ],
            0,
          ],
          expected: "negative cycle",
        },
        { args: [3, [[0, 1, 5]], 0], expected: [0, 5, null] },
      ],
    },
    {
      language: "javascript",
      entry: "roundsNeeded",
      code: `// How many rounds change something before Bellman–Ford settles (no negative cycles).
function roundsNeeded(n, edges, s) {
  const d = new Array(n).fill(Infinity);
  d[s] = 0;
  let rounds = 0;
  for (let r = 0; r < n - 1; r++) {
    let changed = false;
    for (const [u, v, w] of edges) {
      if (d[u] + w < d[v]) {
        d[v] = d[u] + w;
        changed = true;
      }
    }
    if (!changed) break;
    rounds++;
  }
  return rounds;
}
`,
      tests: [
        // A path 0→1→2→3→4 listed forwards needs one round, backwards needs four.
        {
          args: [
            5,
            [
              [0, 1, 1],
              [1, 2, 1],
              [2, 3, 1],
              [3, 4, 1],
            ],
            0,
          ],
          expected: 1,
        },
        {
          args: [
            5,
            [
              [3, 4, 1],
              [2, 3, 1],
              [1, 2, 1],
              [0, 1, 1],
            ],
            0,
          ],
          expected: 4,
        },
      ],
    },
  ],
  visualizer: "bellman-ford",
  practice: [
    {
      id: "bf-rounds",
      kind: "numeric",
      prompt:
        "A graph has 10 vertices and no negative cycle. At most how many rounds of relaxing every edge does Bellman–Ford need before all distances are final?",
      answer: 9,
      explanation:
        "A shortest path can be taken to be simple, so it has at most $|V| - 1 = 9$ edges, and round $k$ fixes every shortest path with at most $k$ edges.",
      hints: ["How many edges can a simple path on 10 vertices have?"],
      objective: "Know why |V| − 1 rounds suffice",
    },
    {
      id: "bf-why-not-dijkstra",
      kind: "mcq",
      prompt: "Why can Dijkstra's algorithm give wrong answers with a negative edge?",
      options: [
        "It finalises a vertex before a later negative edge could lower its distance",
        "It cannot store negative numbers",
        "Its priority queue only accepts positive keys",
        "It never visits vertices with negative edges",
      ],
      answer: 0,
      explanation:
        "Dijkstra's correctness argument assumes paths only get longer as they grow. A negative edge breaks that, so a settled distance may not be final.",
      distractors: {
        1: "Storage is not the issue.",
        2: "Heaps work with any comparable keys.",
        3: "It visits them; it just may settle them too early.",
      },
      hints: ["What does Dijkstra assume when it settles the closest vertex?"],
      objective: "Contrast with Dijkstra",
    },
    {
      id: "bf-example-c",
      kind: "numeric",
      prompt: "In the worked example, what is the final distance to C?",
      answer: 0,
      explanation: "S → B (5) → A (−3) → C (−2) has weight 0.",
      hints: ["Try the path through B and A."],
      objective: "Trace the worked example",
    },
  ],
  exam: {
    definition:
      "Bellman–Ford computes single-source shortest paths in a directed graph with arbitrary edge weights by relaxing all edges |V| − 1 times, and reports a negative cycle if any edge can still be relaxed afterwards.",
    steps: [
      "d[s] = 0, all other d[v] = ∞.",
      "Repeat |V| − 1 times: relax every edge (u, v, w): if d[u] + w < d[v], d[v] = d[u] + w, parent[v] = u.",
      "Check every edge once more; any further improvement means a reachable negative cycle.",
    ],
    timeComplexity: "$O(VE)$; $O(E)$ best case with early stopping.",
    spaceComplexity: "$O(V)$.",
    correctness:
      "By induction, after round k every d[v] is at most the weight of the shortest path with at most k edges. Shortest simple paths have at most |V| − 1 edges, so the distances are exact after |V| − 1 rounds unless a negative cycle exists, which the final pass detects.",
    applications: [
      "Graphs with negative weights (costs and refunds, currency arbitrage)",
      "Distance-vector routing",
      "Difference constraints",
      "Johnson's all-pairs algorithm",
    ],
    limitations: [
      "Slower than Dijkstra on non-negative graphs",
      "Shortest paths are undefined with negative cycles",
    ],
    faq: [
      {
        q: "Why |V| − 1 rounds?",
        a: "A shortest path with no repeated vertex has at most |V| − 1 edges, and each round extends the correctly computed paths by one edge.",
      },
      {
        q: "How does it find arbitrage?",
        a: "Use weights $-\\log(\\text{rate})$: a cycle whose product of rates exceeds 1 becomes a negative cycle.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Relax all edges |V| − 1 times; handles negative weights.",
          "Extra pass detects negative cycles; $O(VE)$.",
        ],
      },
      {
        marks: 5,
        outline: [
          "Relaxation and the algorithm (2).",
          "Worked example with a distance table (2).",
          "Negative cycle detection and complexity (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Problem and why Dijkstra fails with negative edges (1).",
          "Pseudocode (2).",
          "Worked example by rounds (2).",
          "Correctness proof by induction on edges (3).",
          "Negative cycle detection argument and complexity (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "R. Bellman, “On a routing problem,” Quarterly of Applied Mathematics, 16(1), 1958.",
      supports: "The algorithm as a dynamic programme over path lengths.",
    },
    {
      citation: "L. R. Ford Jr., Network Flow Theory, RAND Corporation Paper P-923, 1956.",
      supports: "The relaxation method for shortest paths.",
    },
    {
      citation:
        "E. F. Moore, “The shortest path through a maze,” Proc. International Symposium on the Theory of Switching, Harvard University Press, 1959.",
      supports: "An independent version of the algorithm.",
    },
    {
      citation:
        "T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 3rd ed., MIT Press, 2009, §24.1 and Ch. 25.",
      supports: "The correctness proof, negative-cycle detection and Johnson's algorithm.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-21",
};
