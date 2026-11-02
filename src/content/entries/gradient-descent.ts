import type { AlgorithmEntry } from "../types";

export const gradientDescentEntry: AlgorithmEntry = {
  slug: "gradient-descent",
  name: "Gradient Descent",
  aliases: ["Steepest descent", "Batch gradient descent", "Gradient method"],
  curriculum: [496],
  domain: "machine-learning",
  subcategory: "Optimisation",
  difficulty: "intermediate",
  summary:
    "Minimises a differentiable function by repeatedly stepping against its gradient: x ← x − η∇f(x). The learning rate η decides whether it converges, crawls or blows up, and the function's conditioning decides how fast it can go.",
  tags: [
    "gradient descent",
    "optimisation",
    "learning rate",
    "convex",
    "machine learning",
    "conditioning",
  ],
  prerequisites: ["Partial derivatives (calculus)"],
  related: ["matrix-exponentiation", "mcts"],
  problem: {
    input:
      "A function to minimise (here the bowl f(x, y) = a(x − p)² + b(y − q)²), a starting point, a learning rate η and a number of steps.",
    output: "The sequence of iterates, ideally approaching a minimiser.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Standing on a hillside in fog, you can still feel which way is steepest downhill. Take a step that way, feel again, repeat. The **gradient** ∇f points uphill, so step against it. The step size η (the **learning rate**) is the one knob: too small and you crawl, too large and you leap over the valley and land higher on the other side.",
      },
      {
        kind: "p",
        text: "Training most machine-learning models is this loop, with f the average loss over the data and millions of coordinates instead of two.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Start at (x₀, y₀).",
          "Compute the gradient: for the bowl, ∇f = (2a(x − p), 2b(y − q)).",
          "Move: (x, y) ← (x, y) − η∇f.",
          "Repeat for a fixed number of steps, or until the gradient is small.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example** (the first preset): a = b = 1, minimum (2, 1), start (−6, 5), η = 0.25. Each step multiplies the distance to the minimum by 1 − 2aη = 0.5, so f, which is quadratic in that distance, falls by a factor 4.",
      },
      {
        kind: "table",
        head: ["t", "(x, y)", "f(x, y)"],
        rows: [
          ["0", "(−6, 5)", "80"],
          ["1", "(−2, 3)", "20"],
          ["2", "(0, 2)", "5"],
          ["3", "(1, 1.5)", "1.25"],
          ["4", "(1.5, 1.25)", "0.3125"],
        ],
      },
      {
        kind: "p",
        text: "The other presets show the three ways it goes wrong. **Narrow valley** (a = 5, b = 0.5, η = 0.18): x is multiplied by −0.8 per step, so it zigzags across the valley, while y is multiplied by 0.82 and crawls along it. **η too large** (η = 1.1 on a round bowl): the factor is −1.2, so every step overshoots further. **η too small** (η = 0.02): the factor 0.96 needs hundreds of steps. Counting steps until |∇f| < 0.001 with the JavaScript sample: 15 for the first preset, 49 for the valley, 240 for the small η, and never for the large η.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Stop on a small gradient norm, a small change in f, or a step budget; never on an exact zero.",
          "Scale features to similar ranges before training: it makes the loss surface rounder (better conditioned), as the valley preset shows.",
          "On large data sets, estimate the gradient from a random mini-batch: stochastic gradient descent. Each step is cheaper and noisier.",
          "Line search (backtracking until f decreases enough) chooses η automatically each step.",
          "Momentum and adaptive methods (Adam, RMSProp) change the update rule to cope with narrow valleys and differing scales.",
          "Check your gradient against finite differences on small inputs: a sign error makes the method climb.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**The bowl, exactly.** For f = a(x − p)² + b(y − q)², the update is $x_{t+1} - p = (1 - 2a\\eta)(x_t - p)$, so",
      },
      {
        kind: "math",
        tex: "x_t = p + (1 - 2a\\eta)^t (x_0 - p), \\qquad y_t = q + (1 - 2b\\eta)^t (y_0 - q)",
      },
      {
        kind: "p",
        text: "It converges exactly when both factors lie strictly between −1 and 1, that is when $0 < \\eta < 1/\\max(a, b)$. The tests check every traced run against this closed form.",
      },
      {
        kind: "p",
        text: "**Conditioning.** With L = 2 max(a, b) and μ = 2 min(a, b) (the largest and smallest curvatures), the best fixed step η = 2/(L + μ) gives factors of the same size, $(\\kappa - 1)/(\\kappa + 1)$, in both coordinates (negative in the steep one), where κ = L/μ. For the valley, κ = 10: the factor is 9/11 ≈ 0.82, so even the best fixed step needs about a dozen steps to gain each decimal digit. η = 0.18 in the preset is close to that best step.",
      },
      {
        kind: "p",
        text: "**General convex functions.** If ∇f is L-Lipschitz and f is convex, η = 1/L guarantees $f(x_t) - f^* \\le L\\lVert x_0 - x^* \\rVert^2 / (2t)$. If f is also μ-strongly convex, the error shrinks by a constant factor per step (linear convergence). On non-convex functions, such as neural network losses, gradient descent finds stationary points, which need not be global minima.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "Nesterov's accelerated gradient improves the rate on smooth convex functions from O(1/t) to O(1/t²), which is optimal for first-order methods.",
          "Newton's method uses second derivatives to rescale the step; on a quadratic it jumps to the minimum in one step, at the cost of solving a linear system.",
          "Conjugate gradient minimises an n-dimensional quadratic in at most n steps (in exact arithmetic).",
          "On any quadratic, the error evolves as e_{t+1} = (I − ηH)e_t, a matrix power: the eigenvalues of I − ηH are exactly the per-direction factors seen here.",
          "Stochastic gradient descent with a decaying learning rate converges in expectation; its noise can also help escape shallow local minima.",
        ],
      },
    ],
  },
  complexity: {
    time: { best: "O(T \\cdot d)", average: "O(T \\cdot d)", worst: "O(T \\cdot d)" },
    space: "O(d)",
    worstClass: "other",
    note: "T steps in d dimensions, plus the cost of each gradient. The number of steps needed for accuracy ε grows like κ log(1/ε) on strongly convex functions.",
  },
  properties: [
    { label: "Converges on the bowl when", value: "0 < η < 1 / max(a, b)" },
    { label: "Rate", value: "Linear on strongly convex functions; set by the condition number κ" },
    { label: "Needs", value: "Gradients (first derivatives) only" },
  ],
  implementations: [
    {
      language: "python",
      entry: "fit_line",
      code: `def fit_line(xs, ys, eta=0.05, steps=2000):
    # Gradient descent on the mean squared error of y ≈ w·x + b.
    w = b = 0.0
    n = len(xs)
    for _ in range(steps):
        errors = [w * x + b - y for x, y in zip(xs, ys)]
        grad_w = 2 / n * sum(e * x for e, x in zip(errors, xs))
        grad_b = 2 / n * sum(errors)
        w, b = w - eta * grad_w, b - eta * grad_b
    return [round(w, 3), round(b, 3)]
`,
      tests: [
        {
          args: [
            [0, 1, 2, 3, 4],
            [1, 3, 5, 7, 9],
          ],
          expected: [2, 1],
        },
        {
          args: [
            [1, 2, 3, 4],
            [2, 3, 5, 6],
          ],
          expected: [1.4, 0.5],
        },
      ],
    },
    {
      language: "javascript",
      entry: "stepsToConverge",
      code: `// Gradient descent on f(x, y) = a(x − p)² + b(y − q)²: the number of steps until
// |∇f| < tol, or −1 if the iterates move away instead (a factor |1 − 2aη| ≥ 1).
function stepsToConverge(a, b, p, q, start, eta, tol) {
  let [x, y] = start;
  for (let step = 0; step <= 10000; step++) {
    const [gx, gy] = [2 * a * (x - p), 2 * b * (y - q)];
    if (Math.hypot(gx, gy) < tol) return step;
    if (Math.abs(x) > 1e9 || Math.abs(y) > 1e9) return -1;
    [x, y] = [x - eta * gx, y - eta * gy];
  }
  return -1;
}
`,
      tests: [
        { args: [1, 1, 2, 1, [-6, 5], 0.25, 0.001], expected: 15 },
        { args: [5, 0.5, 0, 0, [-4, 8], 0.18, 0.001], expected: 49 },
        { args: [1, 1, 2, 1, [-6, 5], 0.02, 0.001], expected: 240 },
        { args: [1, 1, 0, 0, [3, -2], 1.1, 0.001], expected: -1 },
      ],
    },
  ],
  visualizer: "gradient-descent",
  practice: [
    {
      id: "gd-factor",
      kind: "numeric",
      prompt: "On f = (x − 2)², with η = 0.25, by what factor does x − 2 shrink each step?",
      answer: 0.5,
      explanation: "The factor is 1 − 2aη = 1 − 2 · 1 · 0.25 = 0.5.",
      hints: ["x_{t+1} − p = (1 − 2aη)(x_t − p)."],
      objective: "Compute the contraction factor",
    },
    {
      id: "gd-limit",
      kind: "numeric",
      prompt:
        "For f = 5x² + 0.5y², what is the largest learning rate η for which gradient descent still converges (the limit itself excluded)?",
      answer: 0.2,
      explanation: "It converges for 0 < η < 1/max(a, b) = 1/5 = 0.2.",
      hints: ["The steeper direction sets the limit."],
      objective: "Find the stability limit",
    },
    {
      id: "gd-zigzag",
      kind: "mcq",
      prompt: "Why does gradient descent zigzag in a narrow valley?",
      options: [
        "A step large enough to make progress along the flat direction overshoots across the steep one",
        "The gradient points away from the minimum",
        "The learning rate changes sign every step",
        "Rounding errors in the gradient",
      ],
      answer: 0,
      explanation:
        "With very different curvatures no single η suits both directions: the steep one gets a negative factor (overshoot), the flat one a factor near 1 (crawl).",
      distractors: {
        1: "The negative gradient always points downhill.",
        2: "η is fixed here.",
        3: "The zigzag appears in exact arithmetic too.",
      },
      hints: ["Compare 1 − 2aη for a = 5 and for b = 0.5 when η = 0.18."],
      objective: "Understand conditioning",
    },
  ],
  exam: {
    definition:
      "Gradient descent minimises a differentiable function by the iteration x_{t+1} = x_t − η∇f(x_t), with learning rate η > 0.",
    steps: [
      "Choose a start and η.",
      "Compute the gradient.",
      "Step against it.",
      "Repeat until a stopping rule holds.",
    ],
    timeComplexity:
      "$O(T \\cdot d)$ plus gradient costs; $O(\\kappa \\log(1/\\varepsilon))$ steps on strongly convex functions.",
    spaceComplexity: "$O(d)$.",
    correctness:
      "For L-smooth convex f and η = 1/L, f(x_t) − f* ≤ L‖x₀ − x*‖²/(2t); on the quadratic bowl the iterates follow a closed form.",
    applications: [
      "Training linear and logistic regression",
      "Neural network training (as SGD and its variants)",
      "Matrix factorisation",
      "Signal reconstruction",
    ],
    limitations: [
      "Sensitive to the learning rate",
      "Slow on ill-conditioned problems",
      "Only local minima or stationary points on non-convex functions",
    ],
    faq: [
      {
        q: "Gradient descent or Newton's method?",
        a: "Newton converges in far fewer steps but needs second derivatives and a linear solve per step; gradient descent scales to millions of parameters.",
      },
    ],
    answers: [
      { marks: 2, outline: ["x ← x − η∇f.", "η must be small enough to converge."] },
      {
        marks: 5,
        outline: [
          "Update rule (1).",
          "Effect of η: crawl, converge, diverge (2).",
          "Convergence condition on a quadratic (2).",
        ],
      },
      {
        marks: 10,
        outline: [
          "Update rule and intuition (2).",
          "Closed form on a quadratic and the stability limit (3).",
          "Conditioning and zigzagging (2).",
          "Convex convergence rates (2).",
          "Stochastic and momentum variants (1).",
        ],
      },
    ],
  },
  references: [
    {
      citation:
        "A. Cauchy, “Méthode générale pour la résolution des systèmes d'équations simultanées,” Comptes Rendus de l'Académie des Sciences 25, 1847, pp. 536–538.",
      supports: "The original method of steepest descent.",
    },
    {
      citation:
        "S. Boyd, L. Vandenberghe, Convex Optimization, Cambridge University Press, 2004, Section 9.3.",
      supports:
        "The gradient descent method, its convergence analysis and the role of the condition number.",
    },
    {
      citation:
        "J. Nocedal, S. J. Wright, Numerical Optimization, 2nd ed., Springer, 2006, Chapter 3.",
      supports: "Step-length selection and convergence rates.",
    },
    {
      citation:
        "I. Goodfellow, Y. Bengio, A. Courville, Deep Learning, MIT Press, 2016, Chapter 8.",
      supports: "Stochastic gradient descent, momentum and adaptive methods in machine learning.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples, the worked example and the closed form are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-25",
};
