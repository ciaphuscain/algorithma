import type { AlgorithmEntry } from "../types";

export const kosarajuEntry: AlgorithmEntry = {
  slug: "kosaraju",
  name: "Kosaraju's Algorithm (Strongly Connected Components)",
  aliases: ["Kosaraju–Sharir", "Strongly connected components", "SCC", "Two-pass DFS"],
  curriculum: [225],
  domain: "graphs",
  subcategory: "Connectivity",
  difficulty: "intermediate",
  summary:
    "Finds the strongly connected components of a directed graph with two depth-first searches: one on the graph to get finishing times, one on the reversed graph in decreasing finishing time.",
  tags: ["scc", "strongly connected", "dfs", "directed graph", "condensation"],
  prerequisites: ["Depth-First Search", "Topological Sort (DFS)"],
  related: ["tarjan-scc", "topological-sort-dfs", "dfs"],
  problem: {
    input: "A directed graph.",
    output:
      "Its strongly connected components: maximal groups of vertices in which every vertex can reach every other.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Think of one-way streets. A strongly connected component is a district where you can drive from any corner to any other and back. Between districts traffic only flows one way, so the districts themselves form a DAG.",
      },
      {
        kind: "p",
        text: "The trick: the vertex that finishes last in a DFS lies in a district with no incoming one-way streets from other districts. Reverse every street, and a search from that vertex can no longer leave its district, so it collects exactly that district. Repeat with the next-latest finisher.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Run DFS over the whole graph; push each vertex onto a stack $F$ when it finishes.",
          "Reverse every edge to get $G^T$.",
          "Pop vertices from $F$. For each one not yet in a component, run DFS on $G^T$ from it; everything it reaches that is unassigned forms one component.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): A→B, B→C, C→A, B→D, D→E, E→F, F→D, G→F, G→H, H→G.",
      },
      {
        kind: "table",
        head: ["Pass", "What happens", "Result"],
        rows: [
          [
            "1 (on G, from A)",
            "A, B, C, then D, E, F are visited; finishing order C, F, E, D, B, A",
            "F = C F E D B A",
          ],
          ["1 (from G)", "G reaches H; H, then G finish", "F = C F E D B A H G"],
          ["2 (pop G)", "in Gᵀ, G reaches only H", "C1 = {G, H}"],
          ["2 (pop H, A)", "H is assigned; from A, Gᵀ reaches C and B", "C2 = {A, C, B}"],
          ["2 (pop B, D)", "B is assigned; from D, Gᵀ reaches F and E", "C3 = {D, F, E}"],
        ],
      },
      {
        kind: "p",
        text: "The components come out in topological order of the component graph: {G, H} and {A, B, C} both have edges into {D, E, F}, which comes last.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Build the reversed adjacency lists once, in $O(V + E)$.",
          "The first pass must cover every vertex (restart DFS from each unvisited vertex), or some finishing times are missing.",
          "Use an iterative DFS for large graphs; recursion depth can reach $V$.",
          "Tarjan's algorithm finds the same components in one pass, with a stack and low-link values; Kosaraju's is often easier to get right.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Key lemma.** If there is an edge from component $C$ to component $C'$ ($C \\ne C'$), then the latest finishing time in $C$ is later than the latest finishing time in $C'$. (If the DFS enters $C$ first, it reaches all of $C'$ before leaving $C$; if it enters $C'$ first, it cannot reach $C$ at all, so all of $C'$ finishes before $C$ is entered.)",
      },
      {
        kind: "p",
        text: "So the vertex popped first lies in a component with no incoming edges from other components in $G$, which means no outgoing edges to unassigned components in $G^T$: the second search stays inside it. By induction every search collects exactly one component, and they appear in topological order of the component graph.",
      },
      { kind: "math", tex: "T(V, E) = O(V + E)" },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Contracting each component to a vertex gives the **condensation**, a DAG, used for 2-SAT, dependency analysis and reachability queries.",
          "**2-SAT** is solved by finding SCCs of the implication graph: a formula is unsatisfiable exactly when some variable and its negation share a component.",
          "Kosaraju's algorithm was published by Sharir in 1981; Kosaraju's earlier version circulated in unpublished lecture notes.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(V + E)", average: "O(V + E)", worst: "O(V + E)" },
    space: "O(V + E)",
    worstClass: "n + m",
    note: "Two DFS passes plus building the reversed graph.",
  },
  properties: [
    { label: "Passes", value: "Two DFS traversals" },
    { label: "Output order", value: "Topological order of the component graph" },
  ],
  implementations: [
    {
      language: "python",
      entry: "kosaraju",
      code: `def kosaraju(vertices, edges):
    adj = {v: [] for v in vertices}
    radj = {v: [] for v in vertices}
    for u, v in edges:
        adj[u].append(v)
        radj[v].append(u)
    for v in vertices:
        adj[v].sort()
        radj[v].sort()
    seen, finish = set(), []

    def dfs1(u):
        seen.add(u)
        for v in adj[u]:
            if v not in seen:
                dfs1(v)
        finish.append(u)

    for u in sorted(vertices):
        if u not in seen:
            dfs1(u)
    comp, components = {}, []

    def dfs2(u, c):
        comp[u] = c
        components[c].append(u)
        for v in radj[u]:
            if v not in comp:
                dfs2(v, c)

    for u in reversed(finish):
        if u not in comp:
            components.append([])
            dfs2(u, len(components) - 1)
    return components
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
            ["G", "H"],
            ["A", "C", "B"],
            ["D", "F", "E"],
          ],
        },
      ],
    },
    {
      language: "javascript",
      entry: "twoSat",
      code: `// 2-SAT: clauses [a, b] mean (a OR b); literal k > 0 is x_k, -k is NOT x_k.
// Satisfiable iff no x_k shares a strongly connected component with NOT x_k.
function twoSat(n, clauses) {
  const id = (lit) => (lit > 0 ? 2 * (lit - 1) : 2 * (-lit - 1) + 1);
  const N = 2 * n;
  const adj = Array.from({ length: N }, () => []);
  const radj = Array.from({ length: N }, () => []);
  const edge = (a, b) => { adj[a].push(b); radj[b].push(a); };
  for (const [a, b] of clauses) { edge(id(-a), id(b)); edge(id(-b), id(a)); }
  const seen = new Array(N).fill(false), order = [];
  const dfs1 = (u) => { seen[u] = true; for (const v of adj[u]) if (!seen[v]) dfs1(v); order.push(u); };
  for (let u = 0; u < N; u++) if (!seen[u]) dfs1(u);
  const comp = new Array(N).fill(-1);
  const dfs2 = (u, c) => { comp[u] = c; for (const v of radj[u]) if (comp[v] < 0) dfs2(v, c); };
  let c = 0;
  for (let i = N - 1; i >= 0; i--) if (comp[order[i]] < 0) dfs2(order[i], c++);
  for (let k = 0; k < n; k++) if (comp[2 * k] === comp[2 * k + 1]) return false;
  return true;
}
`,
      tests: [
        {
          args: [
            2,
            [
              [1, 2],
              [-1, 2],
              [1, -2],
            ],
          ],
          expected: true,
        },
        {
          args: [
            1,
            [
              [1, 1],
              [-1, -1],
            ],
          ],
          expected: false,
        },
      ],
    },
  ],
  visualizer: "kosaraju",
  practice: [
    {
      id: "kosaraju-count",
      kind: "numeric",
      prompt: "How many strongly connected components does the graph A→B, B→C, C→A, C→D have?",
      answer: 2,
      explanation:
        "A, B and C lie on a cycle; D can be reached but cannot reach back. Components: {A, B, C} and {D}.",
      hints: ["Which vertices lie on a common cycle?"],
      objective: "Identify strongly connected components",
    },
    {
      id: "kosaraju-why-reverse",
      kind: "mcq",
      prompt: "Why does the second pass search the reversed graph?",
      options: [
        "So the search from the latest finisher cannot escape into other components",
        "Because reversing makes the graph acyclic",
        "To halve the number of edges",
        "Because DFS only works on reversed graphs",
      ],
      answer: 0,
      explanation:
        "The latest finisher sits in a source component of G; in Gᵀ that component has no edges leading to other unassigned components.",
      distractors: {
        1: "Reversal keeps cycles; components are the same in G and Gᵀ.",
        2: "Gᵀ has exactly as many edges as G.",
        3: "DFS works on any graph.",
      },
      hints: ["Where can a search leave a source component of G after reversing every edge?"],
      objective: "Understand the second pass",
    },
  ],
  exam: {
    definition:
      "Kosaraju's algorithm computes the strongly connected components of a directed graph with one DFS on G to obtain finishing order and one DFS on the transpose Gᵀ in decreasing finishing time.",
    steps: [
      "DFS on G; record vertices in order of finishing.",
      "Compute Gᵀ.",
      "In decreasing finishing time, start a DFS on Gᵀ from each unassigned vertex; each such search is one SCC.",
    ],
    timeComplexity: "$O(V + E)$.",
    spaceComplexity: "$O(V + E)$ for Gᵀ and the stacks.",
    correctness:
      "For an edge between components C → C', max finish(C) > max finish(C'); hence each search in Gᵀ starts in a component with no edges to unassigned components and collects exactly that component.",
    applications: [
      "2-SAT",
      "Condensation DAG",
      "Deadlock detection",
      "Program analysis (call graphs)",
    ],
    limitations: ["Needs the reversed graph", "Two passes"],
    faq: [
      {
        q: "Kosaraju or Tarjan?",
        a: "Both are $O(V + E)$. Tarjan uses one pass and no reversed graph; Kosaraju is conceptually simpler.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Two DFS passes; second on Gᵀ by decreasing finish time.", "$O(V + E)$."],
      },
      {
        marks: 5,
        outline: [
          "SCC definition (1).",
          "Algorithm (2).",
          "Worked example (1).",
          "Complexity (1).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Definitions: SCC, transpose, condensation (2).",
          "Pseudocode (2).",
          "Worked example with finishing times (2).",
          "Key lemma and correctness proof (3).",
          "Complexity and an application such as 2-SAT (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "M. Sharir, “A strong-connectivity algorithm and its applications in data flow analysis,” Computers & Mathematics with Applications, 7(1), 1981.",
      supports: "The two-pass algorithm.",
    },
    {
      citation:
        "T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, Introduction to Algorithms, 3rd ed., MIT Press, 2009, §22.5.",
      supports: "The algorithm, the finishing-time lemma and its proof.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-23",
};
