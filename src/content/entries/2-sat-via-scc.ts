import type { AlgorithmEntry } from "../types";

export const twoSatViaSccEntry: AlgorithmEntry = {
  slug: "2-sat-via-scc",
  name: "2-SAT via SCC",
  aliases: ["2-SAT via SCC"],
  curriculum: [507],
  domain: "graphs",
  subcategory: "Graph Algorithms",
  difficulty: "intermediate",
  summary:
    "Solves the 2-satisfiability problem by constructing an implication graph and finding SCCs: the formula is satisfiable if and only if no variable and its negation are in the same SCC.",
  tags: ["2-SAT", "SCC", "implication graph", "satisfiability", "graph"],
  prerequisites: ["Tarjan SCC", "Kosaraju"],
  related: ["kosaraju", "tarjan-scc", "strongly-connected-components-gabow"],
  problem: {
    input: "A 2-CNF formula with n variables and clauses of the form (a ∨ b).",
    output: "A satisfying assignment or indication that none exists.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Each clause (a ∨ b) is equivalent to two implications: ¬a → b and ¬b → a. Build an implication graph and find its SCCs. If any variable x and ¬x are in the same SCC, the formula is unsatisfiable (they imply each other). Otherwise, assign variables based on the topological order of SCCs.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "For n variables, create 2n nodes: x_i and ¬x_i (represented as i and i+n).",
          "For each clause (a ∨ b), add edges ¬a → b and ¬b → a.",
          "Find SCCs (Tarjan's or Kosaraju's).",
          "If any variable and its negation share an SCC, return unsatisfiable.",
          "Otherwise, assign True to variables whose SCC has a higher topological number than their negation's SCC.",
        ],
      },
    ],
    implementation: [
      {
        kind: "p",
        text: "Variable i is node i, its negation is node i + n. Use Tarjan's SCC, then check if comp[i] == comp[i+n] for any i.",
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "Building the implication graph is $O(n + m)$ where $m$ is the number of clauses. SCC computation is $O(V + E) = O(n + m)$. Assignment extraction is $O(n)$. Total: $O(n + m)$.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "2-SAT is in P, while 3-SAT is NP-complete — the implication graph structure doesn't generalize.",
          "Can solve many constraint-satisfaction problems by reduction to 2-SAT.",
          "Applications include network design, scheduling, and logic synthesis.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(V + E)",
      average: "O(V + E)",
      worst: "O(V + E)",
    },
    space: "O(V + E)",
    worstClass: "n + m",
  },
  properties: [
    {
      label: "Polynomial",
      value: "Yes, unlike 3-SAT",
    },
    {
      label: "Based on",
      value: "SCC decomposition of implication graph",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "two_sat",
      code: `def two_sat(n, clauses):
    """n variables (0..n-1). clauses = [[a,b],...] where positive = variable, negative = NOT variable (1-indexed).
    Returns a list of boolean assignments or None if unsatisfiable."""
    N = 2 * n
    adj = [[] for _ in range(N)]
    def var(x):
        if x > 0: return x - 1
        return n + (-x - 1)
    def neg(v):
        return v + n if v < n else v - n
    for a, b in clauses:
        adj[neg(var(a))].append(var(b))
        adj[neg(var(b))].append(var(a))
    # Kosaraju's SCC
    order = []
    visited = [False] * N
    def dfs1(u):
        visited[u] = True
        for v in adj[u]:
            if not visited[v]: dfs1(v)
        order.append(u)
    for i in range(N):
        if not visited[i]: dfs1(i)
    radj = [[] for _ in range(N)]
    for u in range(N):
        for v in adj[u]:
            radj[v].append(u)
    comp = [-1] * N
    c = 0
    for u in reversed(order):
        if comp[u] != -1: continue
        stack = [u]
        comp[u] = c
        while stack:
            w = stack.pop()
            for v in radj[w]:
                if comp[v] == -1:
                    comp[v] = c
                    stack.append(v)
        c += 1
    for i in range(n):
        if comp[i] == comp[i + n]:
            return None
    return [comp[i] > comp[i + n] for i in range(n)]
`,
      tests: [
        {
          args: [
            2,
            [
              [1, 2],
              [-1, 2],
            ],
          ],
          expected: [true, true],
        },
        {
          args: [
            1,
            [
              [1, 1],
              [-1, -1],
            ],
          ],
          expected: null,
        },
      ],
    },
    {
      language: "javascript",
      entry: "twoSat",
      code: `function twoSat(n, clauses) {
  const N = 2 * n;
  const adj = Array.from({length: N}, () => []);
  function v(x) { return x > 0 ? x - 1 : n + (-x - 1); }
  function neg(u) { return u < n ? u + n : u - n; }
  for (const [a, b] of clauses) {
    adj[neg(v(a))].push(v(b));
    adj[neg(v(b))].push(v(a));
  }
  const order = [], visited = new Array(N).fill(false);
  function dfs1(u) {
    visited[u] = true;
    for (const w of adj[u]) if (!visited[w]) dfs1(w);
    order.push(u);
  }
  for (let i = 0; i < N; i++) if (!visited[i]) dfs1(i);
  const radj = Array.from({length: N}, () => []);
  for (let u = 0; u < N; u++) for (const w of adj[u]) radj[w].push(u);
  const comp = new Array(N).fill(-1);
  let c = 0;
  for (let i = order.length - 1; i >= 0; i--) {
    const u = order[i];
    if (comp[u] !== -1) continue;
    const stack = [u]; comp[u] = c;
    while (stack.length) {
      const w = stack.pop();
      for (const x of radj[w]) if (comp[x] === -1) { comp[x] = c; stack.push(x); }
    }
    c++;
  }
  for (let i = 0; i < n; i++) if (comp[i] === comp[i+n]) return null;
  return Array.from({length: n}, (_, i) => comp[i] > comp[i+n]);
}
`,
      tests: [
        {
          args: [
            2,
            [
              [1, 2],
              [-1, 2],
            ],
          ],
          expected: [true, true],
        },
        {
          args: [
            1,
            [
              [1, 1],
              [-1, -1],
            ],
          ],
          expected: null,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "2-sat-q1",
      kind: "mcq",
      prompt: "When is a 2-SAT formula unsatisfiable?",
      options: [
        "When a variable and its negation are in the same SCC",
        "When any SCC has more than one variable",
        "When the implication graph has a cycle",
        "When there are more clauses than variables",
      ],
      answer: 0,
      explanation:
        "If x and ¬x are in the same SCC, they imply each other, making both true and false simultaneously — a contradiction.",
      hints: ["Think about what it means for x and ¬x to be in the same SCC."],
      objective: "Unsatisfiability condition",
    },
  ],
  exam: {
    definition:
      "2-SAT via SCC solves 2-satisfiability in linear time by building an implication graph and checking that no variable shares an SCC with its negation.",
    steps: [
      "Build implication graph from clauses.",
      "Find SCCs.",
      "Check no variable shares SCC with its negation.",
      "Assign values based on topological order.",
    ],
    timeComplexity: "$O(n + m)$.",
    spaceComplexity: "$O(n + m)$.",
    correctness:
      "The formula is satisfiable iff no variable and its negation are in the same SCC. The topological-order assignment satisfies all implications.",
    applications: ["scheduling", "configuration", "logic synthesis"],
    limitations: ["Only works for 2-CNF; 3-SAT is NP-complete"],
    faq: [
      {
        q: "Why does topological order give a valid assignment?",
        a: "Assigning based on reverse topological order ensures that if ¬x implies y, and x is true, then ¬x is false so the implication is vacuously satisfied.",
      },
    ],
    answers: [
      {
        marks: 5,
        outline: [
          "Implication graph construction (1).",
          "SCC and satisfiability check (2).",
          "Assignment extraction (2).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "B. Aspvall, M. F. Plass, and R. E. Tarjan, 'A linear-time algorithm for testing the truth of certain quantified boolean formulas', IPL, 1979.",
      supports: "Original 2-SAT algorithm.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
