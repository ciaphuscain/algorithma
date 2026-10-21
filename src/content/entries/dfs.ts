import type { AlgorithmEntry } from "../types";

export const dfsEntry: AlgorithmEntry = {
  slug: "dfs",
  name: "Depth-First Search",
  aliases: ["DFS", "Recursive DFS", "Backtracking traversal"],
  curriculum: [202, 204],
  domain: "graphs",
  subcategory: "Graph traversal",
  difficulty: "beginner",
  summary:
    "Follows one path as deep as possible before backtracking, recording discovery and finish times; the foundation of cycle detection, topological sort and connectivity algorithms.",
  tags: ["graph", "traversal", "recursion", "stack", "cycle detection", "back edge"],
  prerequisites: ["Graphs and adjacency lists", "Recursion", "Breadth-First Search"],
  related: ["bfs", "dijkstra", "topological-sort-dfs"],
  problem: {
    input: "A graph $G = (V, E)$ as adjacency lists and a start vertex $s$.",
    output:
      "Every vertex reachable from $s$, each with a discovery time $d[v]$, a finish time $f[v]$ and a parent forming a DFS tree.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Explore a maze by always taking an unexplored passage. When you reach a dead end, or a place you have already been, walk back to the last junction that still has an unexplored passage. That is depth-first search.",
      },
      {
        kind: "p",
        text: "The path back is exactly the chain of unfinished recursive calls, so DFS is naturally written as a recursive function. The visualizer shows that call stack explicitly.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "`visit(u)`: record $u$'s discovery time and mark it as on the stack.",
          "For each neighbour $v$ of $u$: if $v$ is undiscovered, make $u$ its parent and call `visit(v)`.",
          "If $v$ is already on the call stack and is not $u$'s parent, the edge $u$–$v$ is a **back edge**: it closes a cycle.",
          "When every neighbour is done, record $u$'s finish time and return.",
        ],
      },
      { kind: "heading", text: "Worked example" },
      {
        kind: "p",
        text: "Edges A–B, A–C, B–D, C–D, D–E, C–F; start at A; neighbours in alphabetical order. Times are shown as discovery/finish.",
      },
      {
        kind: "table",
        head: ["Vertex", "Discovered from", "d / f"],
        rows: [
          ["A", "—", "1 / 12"],
          ["B", "A", "2 / 11"],
          ["D", "B", "3 / 10"],
          ["C", "D", "4 / 7"],
          ["F", "C", "5 / 6"],
          ["E", "D", "8 / 9"],
        ],
      },
      {
        kind: "p",
        text: "At C the search sees A, which is still on the call stack: C–A is a back edge, revealing the cycle A–B–D–C–A. The intervals nest like parentheses: C's [4, 7] lies inside D's [3, 10], and E's [8, 9] lies beside C's.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "**Recursion depth equals the longest DFS path**, up to $|V|$. Python's default limit is about 1000, so deep graphs need an explicit stack (or a raised limit).",
          "**Iterative DFS with a stack.** Push the neighbours in reverse order and mark a vertex when it is *popped*. This reproduces the recursive discovery order; marking when pushed gives a different, though still valid, traversal.",
          "**Three colours.** White (undiscovered), grey (on the stack), black (finished). In directed graphs, an edge to a grey vertex is a back edge, which is how directed cycle detection works.",
          "**Whole graph.** Restart DFS from every still-white vertex to cover all components (a *DFS forest*).",
        ],
      },
    ],
    mathematics: [
      { kind: "heading", text: "Running time" },
      {
        kind: "p",
        text: "Each vertex is visited once, and each visit scans its adjacency list once, so the total time is $O(|V| + |E|)$ with adjacency lists.",
      },
      { kind: "heading", text: "Parenthesis theorem" },
      {
        kind: "p",
        text: "For any two vertices $u, v$, the intervals $[d[u], f[u]]$ and $[d[v], f[v]]$ are either disjoint or one contains the other. Containment holds exactly when one vertex is a descendant of the other in the DFS forest. This follows because calls are nested: `visit(v)` starts and returns completely inside `visit(u)` or entirely outside it.",
      },
      { kind: "heading", text: "Edges in undirected graphs" },
      {
        kind: "p",
        text: "In an undirected graph every edge is either a **tree edge** or a **back edge** to an ancestor; there are no cross edges. When $u$ examines an edge to $v$, either $v$ is undiscovered (tree edge) or $v$ was discovered earlier. If $v$ were not an ancestor of $u$, it would have finished before $u$ was discovered — but then $v$ would have explored the edge to $u$ first and discovered $u$ itself. So a graph has a cycle if and only if DFS finds a back edge.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "**Topological sort:** in a directed acyclic graph, listing vertices by decreasing finish time gives a topological order.",
          "**Strongly connected components** (Tarjan; Kosaraju) and **bridges / articulation points** use DFS with low-link values.",
          "**Iterative deepening DFS** repeats depth-limited DFS with growing limits, finding shallowest solutions with only $O(\\text{depth})$ memory.",
          "**Backtracking search** (puzzles, constraint satisfaction) is DFS over an implicit tree of partial solutions.",
        ],
      },
      {
        kind: "callout",
        tone: "warning",
        text: "DFS does not find shortest paths. The first path it finds to a vertex can be much longer than necessary; use BFS for unweighted shortest paths.",
      },
    ],
  },
  complexity: {
    time: { best: "O(|V| + |E|)", average: "O(|V| + |E|)", worst: "O(|V| + |E|)" },
    space: "O(|V|)",
    worstClass: "n + m",
    note: "Space for colours, times, parents and the stack (recursion depth up to $|V|$).",
  },
  properties: [
    { label: "Data structure", value: "Stack (call stack or explicit)" },
    { label: "Shortest paths", value: "No" },
    { label: "Detects cycles", value: "Yes (back edges)" },
    { label: "Edge types (undirected)", value: "Tree and back edges only" },
  ],
  implementations: [
    {
      language: "python",
      entry: "dfs",
      code: `def dfs(adj, s):
    """Return the vertices reachable from s in DFS discovery order."""
    seen, order = set(), []

    def visit(u):
        seen.add(u)
        order.append(u)
        for v in adj[u]:
            if v not in seen:
                visit(v)

    visit(s)
    return order
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
          expected: ["A", "B", "D", "C", "F", "E"],
        },
        { args: [{ A: ["B"], B: ["A"], C: [] }, "A"], expected: ["A", "B"] },
      ],
    },
    {
      language: "javascript",
      entry: "dfs",
      code: `// Iterative DFS with an explicit stack; same discovery order as the recursive version.
function dfs(adj, s) {
  const seen = new Set();
  const order = [];
  const stack = [s];
  while (stack.length > 0) {
    const u = stack.pop();
    if (seen.has(u)) continue;
    seen.add(u);
    order.push(u);
    for (let i = adj[u].length - 1; i >= 0; i--) {
      if (!seen.has(adj[u][i])) stack.push(adj[u][i]);
    }
  }
  return order;
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
          expected: ["A", "B", "D", "C", "F", "E"],
        },
        { args: [{ A: ["B", "C"], B: ["D"], C: [], D: [] }, "A"], expected: ["A", "B", "D", "C"] },
      ],
    },
  ],
  visualizer: "dfs",
  practice: [
    {
      id: "dfs-structure",
      kind: "mcq",
      prompt: "Which data structure does an iterative DFS use in place of recursion?",
      options: ["A stack", "A queue", "A priority queue", "A disjoint-set forest"],
      answer: 0,
      explanation:
        "Last-in, first-out order makes the search continue from the most recently discovered vertex, which is what “depth first” means.",
      distractors: {
        1: "A queue gives breadth-first order.",
        2: "A priority queue gives best-first search such as Dijkstra.",
        3: "Disjoint sets track components, not traversal order.",
      },
      hints: ["Recursion itself uses one."],
      objective: "Connect recursion and stacks",
    },
    {
      id: "dfs-finish-a",
      kind: "numeric",
      prompt:
        "A connected undirected graph has 7 vertices. DFS starts at vertex S. What is S's finish time?",
      answer: 14,
      explanation:
        "Every vertex gets two timestamps, so the timestamps are $1..2|V| = 1..14$. The start vertex is discovered first and finished last.",
      hints: ["How many timestamps are handed out in total?", "Which call returns last?"],
      objective: "Use the timestamp structure",
    },
    {
      id: "dfs-back-edge",
      kind: "mcq",
      prompt:
        "During DFS on an undirected graph, vertex u finds a neighbour v that is still on the call stack and is not u's parent. What does this show?",
      options: [
        "The graph contains a cycle",
        "The graph is a tree",
        "v is unreachable",
        "u and v are in different components",
      ],
      answer: 0,
      explanation:
        "v is an ancestor of u, so the tree path from v to u plus the edge u–v forms a cycle.",
      distractors: {
        1: "Trees have no back edges at all.",
        2: "v has been discovered, so it is reachable.",
        3: "They are adjacent, so they are in the same component.",
      },
      hints: ["What path already connects v to u?"],
      objective: "Detect cycles with back edges",
    },
  ],
  exam: {
    definition:
      "Depth-first search is a graph traversal that explores as far as possible along each branch before backtracking, implemented recursively or with an explicit stack, and assigns each vertex a discovery and a finish time.",
    steps: [
      "Mark all vertices undiscovered; set time = 0.",
      "visit(u): time++, $d[u]$ = time; for each neighbour $v$ undiscovered: parent[$v$] = $u$, visit($v$).",
      "After all neighbours: time++, $f[u]$ = time.",
      "Call visit($s$), or visit every undiscovered vertex for a DFS forest.",
    ],
    timeComplexity:
      "$O(|V| + |E|)$ with adjacency lists; $\\Theta(|V|^2)$ with an adjacency matrix.",
    spaceComplexity: "$O(|V|)$, including recursion depth up to $|V|$.",
    correctness:
      "Each vertex is visited exactly once because it is marked on discovery; the parenthesis theorem describes the nesting of discovery/finish intervals.",
    applications: [
      "Cycle detection",
      "Topological sorting of DAGs",
      "Connected and strongly connected components",
      "Bridges and articulation points",
      "Maze solving and backtracking search",
    ],
    limitations: ["Does not find shortest paths", "Deep recursion can overflow the call stack"],
    faq: [
      {
        q: "DFS or BFS?",
        a: "BFS for shortest paths by edge count; DFS for structure (cycles, ordering, components) and for low memory on wide graphs.",
      },
      {
        q: "What is a back edge?",
        a: "An edge from a vertex to one of its ancestors in the DFS tree; it closes a cycle.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: [
          "Explore deeply first, backtrack at dead ends, using a stack/recursion.",
          "$O(V + E)$ time.",
        ],
      },
      {
        marks: 5,
        outline: [
          "Definition (1).",
          "Recursive pseudocode with times (2).",
          "Small trace with d/f values (1).",
          "Complexity and one application (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Definition and intuition — 1.",
          "Recursive and iterative pseudocode — 2.",
          "Full trace with discovery/finish times and the call stack — 3.",
          "Complexity, parenthesis theorem and edge classification — 2.",
          "Applications: cycle detection, topological sort — 2.",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "R. Tarjan, “Depth-first search and linear graph algorithms,” SIAM Journal on Computing, 1(2), 1972.",
      supports:
        "DFS as a basis for linear-time graph algorithms (biconnectivity, strong components).",
    },
    {
      citation:
        "T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 3rd ed., MIT Press, 2009, §22.3.",
      supports: "Timestamps, parenthesis theorem and edge classification.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and quantitative claims are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-20",
};
