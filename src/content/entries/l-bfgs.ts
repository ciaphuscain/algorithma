import type { AlgorithmEntry } from "../types";

export const lBfgsEntry: AlgorithmEntry = {
  slug: "l-bfgs",
  name: "L-BFGS",
  aliases: ["Limited-memory BFGS"],
  curriculum: [592],
  domain: "optimization",
  subcategory: "Optimization",
  difficulty: "intermediate",
  summary:
    "A memory-efficient quasi-Newton optimization method that approximates the inverse Hessian using the most recent m gradient differences, enabling large-scale unconstrained optimization.",
  tags: ["optimization", "quasi-Newton", "gradient", "large-scale"],
  prerequisites: ["Gradient Descent"],
  related: ["newton-s-method-for-optimization", "conjugate-gradient"],
  problem: {
    input: "A differentiable function f: R^n → R and its gradient.",
    output: "An approximate minimizer of f.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Newton's method uses the full Hessian matrix (n×n) to choose optimal step directions, but storing and inverting it costs O(n²) memory. BFGS approximates the inverse Hessian from gradient changes, and L-BFGS keeps only the last m updates — O(mn) memory.",
      },
      {
        kind: "p",
        text: "At each step, L-BFGS uses a two-loop recursion to multiply the approximate inverse Hessian by the gradient, giving a good search direction without ever forming the full matrix.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Store the last m pairs $(s_i, y_i)$ where $s_i = x_{i+1} - x_i$ and $y_i = \\nabla f_{i+1} - \\nabla f_i$.",
          "Compute search direction using the two-loop recursion on the stored pairs.",
          "Perform a line search along the direction to find a good step size.",
          "Update position and gradient; add new (s, y) pair, discard oldest if at capacity m.",
        ],
      },
      {
        kind: "p",
        text: "**Two-loop recursion**: First loop goes backward through history, computing scalar products. Second loop goes forward, building the search direction. Total: O(mn) per step.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "m is typically 3-20; m = 10 is a common default.",
          "The Wolfe conditions are used for the line search.",
          "Warm-starting with a scaled identity Hessian approximation: $H_0 = \\frac{s^T y}{y^T y} I$.",
          "Commonly used in machine learning (logistic regression) and scientific computing.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "L-BFGS achieves superlinear convergence near the optimum, like BFGS, but uses only O(mn) memory instead of O(n²). The two-loop recursion implicitly applies the inverse Hessian approximation.",
      },
      {
        kind: "p",
        text: "Convergence rate is superlinear for strongly convex functions with Lipschitz gradients, assuming the line search satisfies Wolfe conditions.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "L-BFGS-B extends L-BFGS to handle bound constraints.",
          "For stochastic settings, online L-BFGS adapts the approach for noisy gradients.",
          "In deep learning, L-BFGS is used for full-batch training on moderate-sized problems.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(m n)",
      average: "O(m n)",
      worst: "O(m n)",
    },
    space: "O(m n)",
    worstClass: "n",
    note: "Per iteration. m = memory size (3-20), n = dimension.",
  },
  properties: [
    {
      label: "Memory",
      value: "O(mn) — constant factor of gradient storage",
    },
    {
      label: "Convergence",
      value: "Superlinear near optimum",
    },
    {
      label: "No Hessian needed",
      value: "Uses only gradient evaluations",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "lbfgs_demo",
      code: `def lbfgs_minimize(f, grad, x0, m=5, max_iter=100, tol=1e-6):
    """L-BFGS minimization. Returns optimized x."""
    import math
    n = len(x0)
    x = list(x0)
    g = grad(x)
    history_s = []
    history_y = []
    for iteration in range(max_iter):
        if math.sqrt(sum(gi**2 for gi in g)) < tol:
            break
        q = list(g)
        alphas = []
        for i in range(len(history_s)-1, -1, -1):
            s, y = history_s[i], history_y[i]
            rho = 1.0 / max(sum(y[j]*s[j] for j in range(n)), 1e-10)
            alpha = rho * sum(s[j]*q[j] for j in range(n))
            alphas.append(alpha)
            q = [q[j] - alpha*y[j] for j in range(n)]
        alphas.reverse()
        if history_s:
            s, y = history_s[-1], history_y[-1]
            sy = sum(s[j]*y[j] for j in range(n))
            yy = sum(y[j]*y[j] for j in range(n))
            gamma = sy / max(yy, 1e-10)
        else:
            gamma = 1.0
        r = [gamma * q[j] for j in range(n)]
        for i in range(len(history_s)):
            s, y = history_s[i], history_y[i]
            rho = 1.0 / max(sum(y[j]*s[j] for j in range(n)), 1e-10)
            beta = rho * sum(y[j]*r[j] for j in range(n))
            r = [r[j] + (alphas[i] - beta)*s[j] for j in range(n)]
        d = [-r[j] for j in range(n)]
        step = 1.0
        fx = f(x)
        dg = sum(d[j]*g[j] for j in range(n))
        for _ in range(20):
            xn = [x[j] + step*d[j] for j in range(n)]
            if f(xn) <= fx + 1e-4 * step * dg:
                break
            step *= 0.5
        xn = [x[j] + step*d[j] for j in range(n)]
        gn = grad(xn)
        s = [xn[j] - x[j] for j in range(n)]
        y = [gn[j] - g[j] for j in range(n)]
        if len(history_s) >= m:
            history_s.pop(0)
            history_y.pop(0)
        history_s.append(s)
        history_y.append(y)
        x, g = xn, gn
    return [round(xi, 6) for xi in x]

def lbfgs_demo(x0):
    f = lambda x: (x[0]-3)**2 + (x[1]+1)**2
    grad = lambda x: [2*(x[0]-3), 2*(x[1]+1)]
    return lbfgs_minimize(f, grad, x0)
`,
      tests: [
        {
          args: [[0.0, 0.0]],
          expected: [3.0, -1.0],
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "lbfgs-memory",
      kind: "mcq",
      prompt: "How much memory does L-BFGS use?",
      options: ["O(mn) where m is history size and n is dimension", "O(n²)", "O(n)", "O(1)"],
      answer: 0,
      explanation: "L-BFGS stores m (s, y) pairs, each of size n.",
      hints: ["It's 'limited-memory' — what is the limit?"],
      objective: "Understand L-BFGS memory usage",
    },
  ],
  exam: {
    definition:
      "L-BFGS approximates the inverse Hessian from m recent gradient differences using a two-loop recursion, achieving O(mn) memory per iteration.",
    steps: [
      "Store m recent (s, y) pairs.",
      "Two-loop recursion for search direction.",
      "Line search for step size.",
      "Update history.",
    ],
    timeComplexity: "$O(mn)$ per iteration",
    spaceComplexity: "$O(mn)$",
    correctness:
      "BFGS update formula is implicitly applied via the two-loop recursion; Wolfe line search ensures sufficient decrease.",
    applications: [
      "Large-scale optimization",
      "Machine learning (logistic regression)",
      "Scientific computing",
    ],
    limitations: ["Not suitable for non-smooth functions", "Line search overhead"],
    faq: [
      {
        q: "Why not full BFGS?",
        a: "Full BFGS stores an n×n matrix — O(n²) memory, impractical for n > 10⁴.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Two-loop recursion description (1). Memory advantage over BFGS (1)."],
      },
    ],
  },
  references: [
    {
      citation:
        "D. C. Liu and J. Nocedal, 'On the limited memory BFGS method for large scale optimization,' Mathematical Programming, 45(1-3), 1989.",
      supports: "Introduced L-BFGS.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
