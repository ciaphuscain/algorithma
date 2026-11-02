import type { AlgorithmEntry } from "../types";

export const tarjanSccEntry: AlgorithmEntry = {
  slug: "tarjan-scc",
  name: "Tarjan's Strongly Connected Components",
  aliases: ["Tarjan's algorithm", "Low-link", "One-pass SCC"],
  curriculum: [226],
  domain: "graphs",
  subcategory: "Connectivity",
  difficulty: "advanced",
  summary:
    "Finds strongly connected components in a single DFS. Each vertex records the earliest vertex still on the stack that it can reach (its low-link); a vertex whose low-link is itself is the root of a component.",
  tags: ["scc", "low-link", "dfs", "directed graph", "stack"],
  prerequisites: ["Depth-First Search", "Kosaraju's Algorithm"],
  related: ["kosaraju", "bridges-articulation", "dfs"],
  problem: {
    input: "A directed graph.",
    output: "Its strongly connected components.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Every vertex gets a ticket number in the order DFS visits it, and goes onto a stack. While exploring, a vertex remembers the smallest ticket it can reach (through its descendants and one more edge) among vertices still on the stack. If, when it finishes, that smallest ticket is its own, nothing it reaches can lead back above it: it and everything above it on the stack form one component.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Visit $u$: $index[u] = low[u] =$ next number; push $u$ on the stack.",
          "For each edge $u \\to v$: if $v$ is unvisited, visit it, then $low[u] = \\min(low[u], low[v])$. If $v$ is on the stack, $low[u] = \\min(low[u], index[v])$. Otherwise $v$ is in a finished component: ignore it.",
          "When $u$ is done and $low[u] = index[u]$, pop the stack down to $u$: those vertices are one component.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset, the same graph as in the Kosaraju lesson). Values are shown as index/low.",
      },
      {
        kind: "table",
        head: ["Event", "index/low", "Component found"],
        rows: [
          ["Visit A, B, C; C→A is on the stack", "A 0/0, B 1/1, C 2/0", "—"],
          ["Back at B: low[B] = min(1, low[C] = 0)", "B 1/0", "—"],
          ["Visit D, E, F; F→D is on the stack", "D 3/3, E 4/3, F 5/3", "—"],
          ["D finishes with low = index = 3", "", "{F, E, D}"],
          ["A finishes with low = index = 0", "", "{C, B, A}"],
          [
            "Visit G (G→F is finished: ignored), then H; H→G is on the stack",
            "G 6/6, H 7/6",
            "{H, G}",
          ],
        ],
      },
      {
        kind: "p",
        text: "Components come out in reverse topological order: {D, E, F} has no edges to other components and is found first.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Keep an `onStack` flag per vertex; the test “is $v$ on the stack?” must be $O(1)$.",
          "Use $index[v]$ (not $low[v]$) for edges to vertices on the stack. Both give the right components, but $index$ is what the correctness proof uses.",
          "An edge to a vertex that is visited but **not** on the stack points into an already finished component and must not lower $low[u]$.",
          "Recursion depth can reach $V$; an iterative version keeps an explicit frame stack.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Invariant.** The stack holds exactly the visited vertices whose component has not yet been completed, in visiting order. $low[u]$ is the smallest index of a stack vertex reachable from $u$'s DFS subtree using tree edges followed by at most one other edge.",
      },
      {
        kind: "p",
        text: "**Roots.** The root of a component (its first visited vertex) can reach no stack vertex with a smaller index, since such a vertex would be in the same component and visited earlier. So $low = index$ exactly at roots. When the root finishes, every vertex of its component is above it on the stack, and every vertex above it belongs to its component (other components above it were already popped). Each vertex and edge is handled once:",
      },
      { kind: "math", tex: "T(V, E) = O(V + E)" },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "The same low-link idea, on undirected graphs, finds bridges, articulation points and biconnected components.",
          "Because components are emitted in reverse topological order, Tarjan's algorithm gives the condensation's topological order for free (reverse the output).",
          "Path-based algorithms (Gabow; Cheriyan–Mehlhorn) replace low-links with a second stack and are also linear.",
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
    { label: "Passes", value: "One DFS" },
    { label: "Output order", value: "Reverse topological order of the component graph" },
  ],
  implementations: [
    {
      language: "python",
      entry: "tarjan",
      code: `def tarjan(vertices, edges):
    adj = {v: [] for v in vertices}
    for u, v in edges:
        adj[u].append(v)
    for v in vertices:
        adj[v].sort()
    index, low, on_stack, stack, out = {}, {}, set(), [], []
    counter = 0

    def connect(u):
        nonlocal counter
        index[u] = low[u] = counter
        counter += 1
        stack.append(u)
        on_stack.add(u)
        for v in adj[u]:
            if v not in index:
                connect(v)
                low[u] = min(low[u], low[v])
            elif v in on_stack:
                low[u] = min(low[u], index[v])
        if low[u] == index[u]:
            component = []
            while True:
                w = stack.pop()
                on_stack.discard(w)
                component.append(w)
                if w == u:
                    break
            out.append(component)

    for u in sorted(vertices):
        if u not in index:
            connect(u)
    return out
`,
      tests: [
        {
          args: [
            ["A", "B", "C", "D", "E", "F", "G", "H"],
            [
              ["A", "B"],
              ["B", "C"],
              ["C", "A"],
              ["B", "D"],
              ["D", "E"],
              ["E", "F"],
              ["F", "D"],
              ["G", "F"],
              ["G", "H"],
              ["H", "G"],
            ],
          ],
          expected: [
            ["F", "E", "D"],
            ["C", "B", "A"],
            ["H", "G"],
          ],
        },
      ],
    },
    {
      language: "javascript",
      entry: "countSccs",
      code: `function countSccs(n, edges) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) adj[u].push(v);
  const index = new Array(n).fill(-1), low = new Array(n).fill(0);
  const onStack = new Array(n).fill(false), stack = [];
  let counter = 0, count = 0;
  const connect = (u) => {
    index[u] = low[u] = counter++;
    stack.push(u);
    onStack[u] = true;
    for (const v of adj[u]) {
      if (index[v] < 0) { connect(v); low[u] = Math.min(low[u], low[v]); }
      else if (onStack[v]) low[u] = Math.min(low[u], index[v]);
    }
    if (low[u] === index[u]) {
      let w;
      do { w = stack.pop(); onStack[w] = false; } while (w !== u);
      count++;
    }
  };
  for (let u = 0; u < n; u++) if (index[u] < 0) connect(u);
  return count;
}
`,
      tests: [
        {
          args: [
            4,
            [
              [0, 1],
              [1, 2],
              [2, 0],
              [2, 3],
            ],
          ],
          expected: 2,
        },
        { args: [3, []], expected: 3 },
      ],
    },
  ],
  visualizer: "tarjan-scc",
  practice: [
    {
      id: "tarjan-root",
      kind: "mcq",
      prompt: "When does Tarjan's algorithm pop a component off the stack?",
      options: [
        "When a vertex finishes with low[u] = index[u]",
        "Whenever a back edge is found",
        "After the whole DFS is complete",
        "When the stack is full",
      ],
      answer: 0,
      explanation: "Such a vertex is the first-visited vertex (root) of its component.",
      distractors: {
        1: "Back edges lower low-links; they do not end components.",
        2: "Components are emitted during the DFS, as their roots finish.",
        3: "The stack has no capacity limit.",
      },
      hints: ["What does low[u] = index[u] say about where u can reach?"],
      objective: "Recognise component roots",
    },
    {
      id: "tarjan-ignore",
      kind: "mcq",
      prompt:
        "An edge u → v leads to a vertex that is visited but no longer on the stack. What should happen?",
      options: [
        "Ignore it: v belongs to a finished component that cannot reach u",
        "Set low[u] = index[v]",
        "Restart the DFS from v",
        "Push v on the stack again",
      ],
      answer: 0,
      explanation: "If v could reach u, v's component would not have been completed yet.",
      distractors: {
        1: "That would wrongly merge u with a finished component.",
        2: "v is already fully explored.",
        3: "Each vertex is pushed exactly once.",
      },
      hints: ["Why was v's component completed already?"],
      objective: "Handle cross edges correctly",
    },
  ],
  exam: {
    definition:
      "Tarjan's algorithm finds strongly connected components in one DFS using discovery indices, low-link values and a stack of vertices whose components are incomplete.",
    steps: [
      "index[u] = low[u] = counter++; push u.",
      "For u → v: unvisited → recurse, low[u] = min(low[u], low[v]); on stack → low[u] = min(low[u], index[v]).",
      "If low[u] = index[u], pop down to u: one SCC.",
    ],
    timeComplexity: "$O(V + E)$.",
    spaceComplexity: "$O(V)$.",
    correctness:
      "A component's root is the only vertex in it with low = index; at that time exactly its component sits above it on the stack.",
    applications: [
      "SCCs and condensation",
      "2-SAT",
      "Compiler optimisations (loops in control-flow graphs)",
    ],
    limitations: ["Recursive; subtle to implement correctly"],
    faq: [
      {
        q: "What is a low-link?",
        a: "The smallest discovery index of a vertex still on the stack that is reachable from u's subtree using at most one non-tree edge.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["One DFS with index/low and a stack.", "Root when low = index; $O(V + E)$."],
      },
      {
        marks: 5,
        outline: ["Definitions (1).", "Algorithm (2).", "Worked example (1).", "Complexity (1)."],
      },
      {
        marks: 10,
        outline: [
          "SCC and low-link definitions (2).",
          "Pseudocode (2).",
          "Worked example table (2).",
          "Correctness via the root property (3).",
          "Comparison with Kosaraju (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "R. Tarjan, “Depth-first search and linear graph algorithms,” SIAM Journal on Computing, 1(2), 1972.",
      supports: "The one-pass SCC algorithm with low-links.",
    },
    {
      citation: "R. Sedgewick, K. Wayne, Algorithms, 4th ed., Addison-Wesley, 2011, §4.2.",
      supports: "Strong components in directed graphs and their algorithms.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-23",
};
