import type { AlgorithmEntry } from "../types";

export const simplexMethodEntry: AlgorithmEntry = {
  slug: "simplex-method",
  name: "Simplex Method",
  aliases: ["Simplex Algorithm", "Dantzig's Simplex"],
  curriculum: [586],
  domain: "optimization",
  subcategory: "Optimization",
  difficulty: "intermediate",
  summary:
    "The simplex method solves linear programs by walking along vertices of the feasible polytope, improving the objective at each step, until it reaches the optimum.",
  tags: ["linear programming", "optimization", "polytope", "LP"],
  prerequisites: ["Linear Algebra"],
  related: ["branch-and-bound"],
  problem: {
    input:
      "A linear objective function to maximize and linear inequality constraints (an LP in standard form).",
    output:
      "An optimal solution and objective value, or a certificate of infeasibility/unboundedness.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "A linear program's feasible region is a convex polytope (a higher-dimensional polygon). The optimal solution always lies at a vertex. The simplex method starts at one vertex and moves to an adjacent vertex with a better objective value, repeating until no improvement is possible.",
      },
      {
        kind: "p",
        text: "Each vertex corresponds to a basic feasible solution where some variables are zero (non-basic) and the rest are determined by the constraints. A pivot operation swaps one variable in and one out, moving to a neighboring vertex.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Convert to standard form: maximize c^T x subject to Ax ≤ b, x ≥ 0. Add slack variables to get Ax = b.",
          "Start with an initial basic feasible solution (identity basis from slacks).",
          "Choose entering variable: the non-basic variable with the most positive reduced cost (Dantzig's rule).",
          "Choose leaving variable via the minimum ratio test: ensures feasibility.",
          "Pivot: update the tableau. Repeat until all reduced costs are ≤ 0 (optimal).",
        ],
      },
      {
        kind: "p",
        text: "**Worked example**: Maximize 3x+2y subject to x+y≤4, x+3y≤6, x,y≥0. Add slacks s1,s2. Initial BFS: (0,0,4,6). Pivot x in (reduced cost 3), s1 out (ratio 4/1 < 6/1). New BFS: (4,0,0,2), obj=12. Next pivot y: ratio test gives 2/2=1, pivot s2 out. BFS: (3,1,0,0), obj=11. Actually checking: all reduced costs ≤ 0 at (4,0) with obj=12. Optimal.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "The revised simplex method stores only the basis inverse, not the full tableau, for efficiency.",
          "Bland's rule (smallest index) prevents cycling on degenerate problems.",
          "In practice, interior-point methods compete with simplex for large LPs, but simplex is often faster for sparse problems.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The simplex method visits at most $\\binom{m+n}{m}$ vertices in the worst case (exponential), but in practice it runs in O(m) pivots on average. Smoothed analysis (Spielman–Teng, 2004) shows polynomial expected time under small random perturbations.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "The Klee–Minty cube shows exponential worst-case behavior for Dantzig's pivot rule.",
          "Interior-point methods (Karmarkar, 1984) solve LPs in polynomial worst-case time.",
          "The simplex method extends to network flow, assignment, and transportation problems with specialised pivoting.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(m)",
      average: "O(m^2 n)",
      worst: "O(2^n)",
    },
    space: "O(m n)",
    worstClass: "2^n",
    note: "m constraints, n variables. Exponential worst case but fast in practice.",
  },
  properties: [
    {
      label: "Exact",
      value: "Yes, finds exact optimum",
    },
    {
      label: "Worst case",
      value: "Exponential (Klee–Minty), but rare in practice",
    },
    {
      label: "Practical speed",
      value: "Typically O(m) pivots",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "simplex",
      code: `def simplex(c, A, b):
    """Solve maximize c^T x subject to Ax <= b, x >= 0.
    Returns (optimal_value, solution) or None if infeasible/unbounded.
    c: list[float], A: list[list[float]], b: list[float]."""
    m = len(A)
    n = len(c)
    # Build tableau with slack variables
    tab = []
    for i in range(m):
        row = A[i][:] + [0]*m + [b[i]]
        row[n + i] = 1
        tab.append(row)
    obj = [-v for v in c] + [0]*(m+1)
    tab.append(obj)
    basis = list(range(n, n + m))
    total = n + m
    for _ in range(1000):
        # Find entering: most negative in objective row
        pivot_col = -1
        best = -1e-9
        for j in range(total):
            if tab[m][j] < best:
                best = tab[m][j]
                pivot_col = j
        if pivot_col == -1:
            break  # optimal
        # Min ratio test
        pivot_row = -1
        min_ratio = float('inf')
        for i in range(m):
            if tab[i][pivot_col] > 1e-9:
                ratio = tab[i][-1] / tab[i][pivot_col]
                if ratio < min_ratio:
                    min_ratio = ratio
                    pivot_row = i
        if pivot_row == -1:
            return None  # unbounded
        # Pivot
        pv = tab[pivot_row][pivot_col]
        tab[pivot_row] = [v / pv for v in tab[pivot_row]]
        for i in range(m + 1):
            if i != pivot_row:
                factor = tab[i][pivot_col]
                tab[i] = [tab[i][j] - factor * tab[pivot_row][j] for j in range(total + 1)]
        basis[pivot_row] = pivot_col
    sol = [0.0] * n
    for i in range(m):
        if basis[i] < n:
            sol[basis[i]] = tab[i][-1]
    return (round(tab[m][-1], 6), [round(v, 6) for v in sol])
`,
      tests: [
        {
          args: [
            [3, 2],
            [
              [1, 1],
              [1, 3],
            ],
            [4, 6],
          ],
          expected: [12.0, [4.0, 0.0]],
        },
        {
          args: [
            [5, 4],
            [
              [1, 1],
              [2, 1],
            ],
            [6, 10],
          ],
          expected: [28.0, [4.0, 2.0]],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "simplex-vertex",
      kind: "mcq",
      prompt: "Why does the simplex method only visit vertices of the feasible region?",
      options: [
        "The optimum of a linear function over a convex polytope is always at a vertex",
        "Vertices are easier to compute",
        "Interior points are infeasible",
        "The objective is nonlinear inside",
      ],
      answer: 0,
      explanation:
        "A linear function over a convex set attains its maximum at an extreme point (vertex).",
      hints: ["What property of linear functions on convex sets is key?"],
      objective: "Know why vertices suffice",
    },
  ],
  exam: {
    definition:
      "The simplex method solves linear programs by moving between adjacent vertices of the feasible polytope, improving the objective at each pivot.",
    steps: [
      "Standard form with slacks.",
      "Initial BFS.",
      "Pivot: entering (reduced cost) and leaving (ratio test).",
      "Repeat until optimal.",
    ],
    timeComplexity: "Exponential worst case, O(m) pivots typical",
    spaceComplexity: "O(mn)",
    correctness:
      "Terminates at optimum because reduced costs are non-positive; Bland's rule prevents cycling.",
    applications: ["Operations research", "Network flow", "Resource allocation"],
    limitations: ["Exponential worst case", "Degeneracy can cause cycling"],
    faq: [
      {
        q: "Why not always use interior-point methods?",
        a: "Simplex is often faster on sparse problems and provides exact vertex solutions naturally.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Tableau and pivoting (1).", "Optimality and complexity (1)."],
      },
    ],
  },
  references: [
    {
      citation:
        "G. B. Dantzig, 'Maximization of a Linear Function of Variables Subject to Linear Inequalities,' 1947.",
      supports: "The original simplex method.",
    },
    {
      citation:
        "D. A. Spielman, S.-H. Teng, 'Smoothed Analysis of Algorithms: Why the Simplex Algorithm Usually Takes Polynomial Time,' JACM, 2004.",
      supports: "Smoothed analysis of the simplex method.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
