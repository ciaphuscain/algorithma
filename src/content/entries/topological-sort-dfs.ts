import type { AlgorithmEntry } from "../types";

export const topologicalSortDfsEntry: AlgorithmEntry = {
  slug: "topological-sort-dfs",
  name: "Topological Sort (DFS)",
  aliases: ["DFS topological sort", "Reverse postorder", "Tarjan's topological sort"],
  curriculum: [228],
  domain: "graphs",
  subcategory: "Topological Ordering",
  difficulty: "intermediate",
  summary:
    "Orders the vertices of a directed acyclic graph so every edge points forward, by running depth-first search and listing vertices in reverse order of finishing.",
  tags: ["dag", "dfs", "ordering", "dependencies", "cycle detection", "reverse postorder"],
  prerequisites: ["Depth-First Search", "Directed Graphs"],
  related: ["topological-sort", "dfs"],
  problem: {
    input: "A directed graph.",
    output:
      "An ordering of all vertices in which every edge $u \\to v$ has $u$ before $v$, or a report that the graph has a cycle (so no such ordering exists).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "To schedule a task, first finish scheduling everything that depends on it, then put the task in front of all of them. Depth-first search does exactly this: a vertex finishes only after every vertex reachable from it has finished, so writing each finished vertex at the front of the list puts it before everything that must come after it.",
      },
      {
        kind: "callout",
        tone: "note",
        title: "Two algorithms, one problem",
        text: "Kahn's algorithm (the other topological-sort lesson) repeatedly removes vertices with no incoming edges. This lesson's DFS method builds the order from the back instead. Both run in $O(V + E)$.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Every vertex starts **unvisited**. For each vertex in turn, if it is unvisited, call visit on it.",
          "**visit(u):** mark $u$ in progress. For each edge $u \\to v$: if $v$ is in progress, that edge closes a cycle; if $v$ is unvisited, visit($v$).",
          "When the loop ends, mark $u$ done and write it into the rightmost free slot of the answer.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): A→C, B→C, B→D, C→E, D→E, E→F, D→F, starting searches in alphabetical order.",
      },
      {
        kind: "table",
        head: ["Event", "Call stack", "Slots filled (right to left)"],
        rows: [
          ["visit A → C → E → F", "A, C, E, F", "—"],
          ["F finishes", "A, C, E", "F"],
          ["E finishes", "A, C", "E F"],
          ["C finishes", "A", "C E F"],
          ["A finishes", "—", "A C E F"],
          ["visit B (C is done) → D", "B, D", "A C E F"],
          ["D finishes (E, F done)", "B", "D A C E F"],
          ["B finishes", "—", "B D A C E F"],
        ],
      },
      {
        kind: "p",
        text: "Result: B, D, A, C, E, F. Every edge points from left to right. Kahn's algorithm gives a different valid order on the same graph; most DAGs have many.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Three states are needed, not two: “in progress” (grey) separates a back edge, which proves a cycle, from an edge to a finished vertex, which is harmless.",
          "Append each finished vertex to a list and reverse it at the end, or write it into slots from the right as the visualizer does.",
          "Recursion depth can reach $|V|$; use an explicit stack for very large graphs.",
          "Starting the outer loop in a different order, or visiting neighbours in a different order, gives a different (still valid) order.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Key lemma.** In a DAG, for every edge $u \\to v$, $v$ finishes before $u$. When the edge is examined, $v$ is either unvisited, so it is visited and finishes inside $u$'s call; or done, so it finished earlier; it cannot be in progress, since that would mean a path $v \\leadsto u$ and with the edge a cycle.",
      },
      {
        kind: "p",
        text: "So listing vertices by decreasing finishing time puts $u$ before $v$ for every edge. Conversely, if DFS meets an edge to an in-progress vertex, the call stack contains a path from that vertex to the current one, and the edge closes a cycle, so no topological order exists. Each vertex and edge is handled once:",
      },
      {
        kind: "math",
        tex: "T(V, E) = O(V + E), \\qquad \\text{space } O(V)",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**Strongly connected components:** Kosaraju's algorithm runs DFS by decreasing finishing time on the reversed graph; Tarjan's algorithm uses the same finishing structure with low-link values.",
          "**Longest and shortest paths in DAGs** take $O(V + E)$ by relaxing edges in topological order, even with negative weights.",
          "**Build systems** (make, Bazel), spreadsheet recalculation and course planning are topological sorts of dependency graphs.",
          "Counting topological orders is #P-complete in general (Brightwell and Winkler).",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(V + E)", average: "O(V + E)", worst: "O(V + E)" },
    space: "O(V)",
    worstClass: "n + m",
  },
  properties: [
    { label: "Detects cycles", value: "Yes, through back edges" },
    { label: "Output", value: "One of possibly many valid orders" },
  ],
  implementations: [
    {
      language: "python",
      entry: "topo_dfs",
      code: `def topo_dfs(vertices, edges):
    """Returns a topological order, or None if the graph has a cycle."""
    adj = {v: [] for v in vertices}
    for u, v in edges:
        adj[u].append(v)
    for v in adj:
        adj[v].sort()
    state = {v: "new" for v in vertices}
    order = []

    def visit(u):
        state[u] = "active"
        for v in adj[u]:
            if state[v] == "active":
                return False               # back edge: cycle
            if state[v] == "new" and not visit(v):
                return False
        state[u] = "done"
        order.append(u)                    # finished
        return True

    for u in sorted(vertices):
        if state[u] == "new" and not visit(u):
            return None
    return order[::-1]
`,
      tests: [
        {
          args: [
            ["A", "B", "C", "D", "E", "F"],
            [
              ["A", "C"],
              ["B", "C"],
              ["B", "D"],
              ["C", "E"],
              ["D", "E"],
              ["E", "F"],
              ["D", "F"],
            ],
          ],
          expected: ["B", "D", "A", "C", "E", "F"],
        },
        {
          args: [
            ["A", "B", "C"],
            [
              ["A", "B"],
              ["B", "C"],
              ["C", "A"],
            ],
          ],
          expected: null,
        },
      ],
    },
    {
      language: "javascript",
      entry: "isTopologicalOrder",
      code: `function isTopologicalOrder(order, edges) {
  const pos = new Map(order.map((v, i) => [v, i]));
  return edges.every(([u, v]) => pos.get(u) < pos.get(v));
}
`,
      tests: [
        {
          args: [
            ["B", "D", "A", "C", "E", "F"],
            [
              ["A", "C"],
              ["B", "D"],
              ["D", "F"],
            ],
          ],
          expected: true,
        },
        { args: [["A", "B"], [["B", "A"]]], expected: false },
      ],
    },
  ],
  visualizer: "topological-sort-dfs",
  practice: [
    {
      id: "topo-dfs-first",
      kind: "mcq",
      prompt:
        "In the DFS method, which vertex is written into the answer first (into the last slot)?",
      options: [
        "The first vertex to finish",
        "The first vertex visited",
        "A vertex with no incoming edges",
        "The vertex with the most edges",
      ],
      answer: 0,
      explanation:
        "Vertices are written in order of finishing, from the right. The first to finish has nothing left below it, so it can go last.",
      distractors: {
        1: "The first vertex visited finishes last among its search tree.",
        2: "That is how Kahn's algorithm starts, from the front.",
        3: "Degree plays no role.",
      },
      hints: ["When is a vertex written?"],
      objective: "Understand reverse postorder",
    },
    {
      id: "topo-dfs-states",
      kind: "mcq",
      prompt: "Why does the DFS method need an “in progress” state distinct from “done”?",
      options: [
        "To tell a back edge (a cycle) from an edge to an already finished vertex",
        "To avoid visiting a vertex twice",
        "To make the order unique",
        "To compute in-degrees",
      ],
      answer: 0,
      explanation:
        "Both states stop a second visit, but only an edge to an in-progress vertex closes a cycle.",
      distractors: {
        1: "Visited/unvisited alone would do that.",
        2: "The order is not unique anyway.",
        3: "In-degrees belong to Kahn's algorithm.",
      },
      hints: ["What does an edge to a vertex on the call stack mean?"],
      objective: "Detect cycles with DFS",
    },
    {
      id: "topo-dfs-dressed",
      kind: "numeric",
      prompt:
        "In the “getting dressed” preset (9 items), how many items are written into the order before the watch, which has no edges?",
      answer: 8,
      explanation:
        "Searches start in alphabetical order of the short names (Blt, Jkt, Sck, Sho, Sht, Tie, Tro, Und, Wch). Wch comes last and is unvisited, so it finishes last and lands in the first slot, after all 8 other items.",
      hints: ["Wch is the last name alphabetically."],
      objective: "Trace the outer loop",
    },
  ],
  exam: {
    definition:
      "A topological sort of a directed acyclic graph is a linear ordering of its vertices such that every edge goes from an earlier to a later vertex; the DFS method outputs vertices in decreasing order of DFS finishing time.",
    steps: [
      "For each unvisited vertex, run DFS.",
      "Mark vertices in progress on entry and done on exit.",
      "An edge to an in-progress vertex means a cycle.",
      "Prepend each vertex to the order when it finishes.",
    ],
    timeComplexity: "$O(V + E)$.",
    spaceComplexity: "$O(V)$ for states, the order and the recursion stack.",
    correctness:
      "In a DAG, for every edge u → v, v finishes before u (v cannot be in progress, or there would be a cycle), so decreasing finishing time respects every edge.",
    applications: [
      "Build systems and package managers",
      "Course scheduling",
      "Spreadsheet recalculation",
      "DAG shortest paths",
    ],
    limitations: ["Only defined for DAGs", "Recursion depth up to V"],
    faq: [
      {
        q: "DFS or Kahn?",
        a: "Both are $O(V + E)$. Kahn's is iterative and naturally produces the order front to back; the DFS method fits when you already run DFS (for example for strongly connected components).",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "DFS; output in reverse finishing order.",
          "$O(V + E)$; back edge means a cycle.",
        ],
      },
      {
        marks: 5,
        outline: [
          "Definition (1).",
          "Algorithm with three states (2).",
          "Worked example (1).",
          "Complexity (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Definition and existence only for DAGs (2).",
          "Pseudocode (2).",
          "Worked example with finishing order (2).",
          "Correctness via the key lemma (3).",
          "Comparison with Kahn's algorithm (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 3rd ed., MIT Press, 2009, §22.4.",
      supports: "The DFS-based algorithm and its correctness proof.",
    },
    {
      citation:
        "R. Tarjan, “Depth-first search and linear graph algorithms,” SIAM Journal on Computing, 1(2), 1972.",
      supports: "Depth-first search, its edge classification and linear running time.",
    },
    {
      citation: "G. Brightwell, P. Winkler, “Counting linear extensions,” Order, 8(3), 1991.",
      supports: "Counting topological orders is #P-complete.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-21",
};
