import type { AlgorithmEntry } from "../types";

export const topologicalSortEntry: AlgorithmEntry = {
  slug: "topological-sort",
  name: "Topological Sort (Kahn's Algorithm)",
  aliases: ["Kahn's algorithm", "Topological ordering"],
  curriculum: [229],
  domain: "graphs",
  subcategory: "Topological ordering",
  difficulty: "intermediate",
  summary:
    "Orders the vertices of a directed acyclic graph so every edge points forward, by repeatedly removing vertices with no incoming edges; detects cycles as a by-product.",
  tags: ["graph", "directed", "DAG", "ordering", "dependencies", "queue", "cycle detection"],
  prerequisites: ["Directed graphs", "Queues", "Breadth-First Search"],
  related: ["dfs", "bfs"],
  problem: {
    input: "A directed graph $G = (V, E)$.",
    output:
      "An ordering of $V$ in which, for every edge $u \\to v$, $u$ comes before $v$ — or a report that none exists because $G$ has a cycle.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "You can only take a course once its prerequisites are done. Start with the courses that have no prerequisites. Each time you finish one, cross it off every list it appears on; any course whose list becomes empty is now available.",
      },
      {
        kind: "p",
        text: "If at some point nothing is available but courses remain, the remaining prerequisites form a loop. No valid order exists.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Compute every vertex's **in-degree** (number of incoming edges).",
          "Put every vertex with in-degree 0 in a queue.",
          "Repeatedly dequeue $u$, append it to the order, and remove its outgoing edges: decrement each successor's in-degree, enqueueing any that reach 0.",
          "If the order contains every vertex, it is a topological order. Otherwise the graph has a cycle.",
        ],
      },
      { kind: "heading", text: "Worked example (the “course prerequisites” preset)" },
      {
        kind: "p",
        text: "Edges A→C, B→C, B→D, C→E, D→E, D→F, E→F. In-degrees: A 0, B 0, C 2, D 1, E 2, F 2.",
      },
      {
        kind: "table",
        head: ["Dequeue", "Edges removed", "Newly ready", "Queue after"],
        rows: [
          ["—", "—", "A, B", "A, B"],
          ["A", "A→C (C: 1)", "—", "B"],
          ["B", "B→C (C: 0), B→D (D: 0)", "C, D", "C, D"],
          ["C", "C→E (E: 1)", "—", "D"],
          ["D", "D→E (E: 0), D→F (F: 1)", "E", "E"],
          ["E", "E→F (F: 0)", "F", "F"],
          ["F", "—", "—", "(empty)"],
        ],
      },
      {
        kind: "p",
        text: "Order: A, B, C, D, E, F. Other valid orders exist (e.g. B, A, D, C, E, F); topological orders are rarely unique.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Store in-degrees in an array or map; never search the edge list for incoming edges at each step.",
          "The queue can be any container: a stack gives a different but still valid order. A **min-priority queue** gives the lexicographically smallest order.",
          "Check the output length to detect cycles. Without that check, a cyclic graph silently yields a partial order.",
        ],
      },
    ],
    mathematics: [
      { kind: "heading", text: "Correctness" },
      {
        kind: "p",
        text: "A vertex enters the queue only when all its incoming edges have been removed, i.e. after all its predecessors were output. So every edge $u \\to v$ has $u$ before $v$.",
      },
      {
        kind: "p",
        text: "**Every DAG has a vertex of in-degree 0:** start anywhere and keep walking backwards along incoming edges. In a finite graph without cycles this must stop, at a vertex with no incoming edge. Removing that vertex leaves a DAG, so Kahn's algorithm never gets stuck on a DAG. Conversely, if it gets stuck, every remaining vertex has an incoming edge from another remaining vertex, and walking backwards must eventually repeat a vertex: a cycle.",
      },
      { kind: "heading", text: "Running time" },
      {
        kind: "p",
        text: "Computing in-degrees, enqueueing each vertex once and removing each edge once is $O(|V| + |E|)$.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**DFS alternative:** listing vertices in decreasing DFS finish time also gives a topological order (curriculum #228).",
          "**Applications:** build systems and package managers (dependency order), spreadsheet recalculation, course scheduling, instruction scheduling in compilers.",
          "**Longest path in a DAG** is solvable in linear time by relaxing edges in topological order; this gives the critical path in project scheduling.",
          "**Counting orders** is hard in general (#P-complete), even though finding one is linear.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(|V| + |E|)", average: "O(|V| + |E|)", worst: "O(|V| + |E|)" },
    space: "O(|V|)",
    worstClass: "n + m",
  },
  properties: [
    { label: "Input", value: "Directed graph" },
    { label: "Detects cycles", value: "Yes" },
    { label: "Order unique?", value: "Only if there is a path through all vertices" },
  ],
  implementations: [
    {
      language: "python",
      entry: "topological_sort",
      code: `from collections import deque


def topological_sort(adj):
    """adj: {u: [v, ...]} for edges u -> v. Return an order, or None if there is a cycle."""
    indeg = {v: 0 for v in adj}
    for u in adj:
        for v in adj[u]:
            indeg[v] += 1
    queue = deque(sorted(v for v in adj if indeg[v] == 0))
    order = []
    while queue:
        u = queue.popleft()
        order.append(u)
        for v in adj[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                queue.append(v)
    return order if len(order) == len(adj) else None
`,
      tests: [
        {
          args: [{ A: ["C"], B: ["C", "D"], C: ["E"], D: ["E", "F"], E: ["F"], F: [] }],
          expected: ["A", "B", "C", "D", "E", "F"],
        },
        { args: [{ A: ["B"], B: ["C"], C: ["A"] }], expected: null },
      ],
    },
    {
      language: "javascript",
      entry: "topologicalSort",
      code: `function topologicalSort(adj) {
  const indeg = {};
  for (const u of Object.keys(adj)) indeg[u] = 0;
  for (const u of Object.keys(adj)) for (const v of adj[u]) indeg[v]++;
  const queue = Object.keys(adj).filter((v) => indeg[v] === 0).sort();
  const order = [];
  for (let head = 0; head < queue.length; head++) {
    const u = queue[head];
    order.push(u);
    for (const v of adj[u]) if (--indeg[v] === 0) queue.push(v);
  }
  return order.length === Object.keys(adj).length ? order : null;
}
`,
      tests: [
        { args: [{ A: ["B"], B: [], C: ["D"], D: [] }], expected: ["A", "C", "B", "D"] },
        { args: [{ X: ["Y"], Y: ["X"] }], expected: null },
      ],
    },
  ],
  visualizer: "topological-sort",
  practice: [
    {
      id: "topo-cycle",
      kind: "mcq",
      prompt: "Kahn's algorithm stops with vertices left over. What does that tell you?",
      options: [
        "The graph contains a directed cycle",
        "The graph is disconnected",
        "The queue was too small",
        "The graph has a vertex with no outgoing edges",
      ],
      answer: 0,
      explanation:
        "Every remaining vertex still has an incoming edge from another remaining vertex; following those edges backwards must repeat a vertex.",
      distractors: {
        1: "Disconnected DAGs sort fine: each component has its own in-degree-0 vertices.",
        2: "The queue grows as needed.",
        3: "Sinks are normal in DAGs; they are output last.",
      },
      hints: ["Why can none of the remaining vertices become ready?"],
      objective: "Detect cycles",
    },
    {
      id: "topo-valid",
      kind: "mcq",
      prompt: "Edges: A→B, A→C, C→B. Which is a valid topological order?",
      options: ["A, C, B", "A, B, C", "C, A, B", "B, C, A"],
      answer: 0,
      explanation:
        "A must precede B and C, and C must precede B. Only A, C, B satisfies all three edges.",
      distractors: {
        1: "B comes before C, but C→B requires C first.",
        2: "C comes before A, but A→C requires A first.",
        3: "This reverses every edge.",
      },
      hints: ["Check each edge u→v: is u before v?"],
      objective: "Verify an ordering",
    },
  ],
  exam: {
    definition:
      "A topological sort of a directed acyclic graph is a linear ordering of its vertices such that for every edge $u \\to v$, $u$ appears before $v$. Kahn's algorithm builds one by repeatedly removing vertices of in-degree zero.",
    steps: [
      "Compute in-degrees; enqueue all vertices with in-degree 0.",
      "While the queue is non-empty: dequeue $u$, output it, and decrement the in-degree of each successor, enqueueing those that reach 0.",
      "If fewer than $|V|$ vertices were output, report a cycle.",
    ],
    timeComplexity: "$O(V + E)$.",
    spaceComplexity: "$O(V)$ for in-degrees and the queue.",
    correctness:
      "A vertex is output only after all its predecessors; every DAG has an in-degree-0 vertex, so the algorithm outputs all vertices exactly when the graph is acyclic.",
    applications: [
      "Build systems and package dependency resolution",
      "Course and task scheduling",
      "Spreadsheet formula evaluation",
      "Critical-path analysis",
    ],
    limitations: ["Only for directed acyclic graphs", "The order is generally not unique"],
    faq: [
      {
        q: "Kahn or DFS?",
        a: "Both are $O(V + E)$. Kahn's is iterative and reports cycles naturally; the DFS method uses finish times.",
      },
      {
        q: "When is the order unique?",
        a: "Exactly when the queue never holds more than one vertex, i.e. the DAG has a Hamiltonian path.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Order vertices so every edge points forward; only for DAGs.",
          "Kahn: repeatedly remove in-degree-0 vertices, $O(V+E)$.",
        ],
      },
      {
        marks: 5,
        outline: [
          "Definition (1).",
          "Kahn's algorithm (2).",
          "Worked example with in-degrees (1).",
          "Cycle detection and complexity (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Definition and DAG requirement — 1.",
          "Kahn's pseudocode — 2.",
          "Full trace with in-degree table and queue — 3.",
          "Proof that every DAG has an in-degree-0 vertex; cycle detection — 2.",
          "Complexity; the DFS-based alternative; applications — 2.",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "A. B. Kahn, “Topological sorting of large networks,” Communications of the ACM, 5(11), 1962.",
      supports: "The in-degree algorithm.",
    },
    {
      citation:
        "T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 3rd ed., MIT Press, 2009, §22.4.",
      supports: "Topological sort, the DFS-based method and its correctness.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and quantitative claims are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-20",
};
