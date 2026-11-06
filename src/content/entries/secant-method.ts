import type { AlgorithmEntry } from "../types";

export const secantMethodEntry: AlgorithmEntry = {
  slug: "secant-method",
  name: "Secant Method",
  aliases: ["Secant Root-Finding"],
  curriculum: [386],
  domain: "number-theory",
  subcategory: "Number Theory",
  difficulty: "intermediate",
  summary:
    "The secant method finds roots of a function by approximating the derivative with a finite difference from two prior iterates, converging superlinearly without requiring derivative evaluation.",
  tags: ["root finding", "numerical methods", "iteration", "approximation"],
  prerequisites: ["Bisection Method"],
  related: ["bisection-method"],
  problem: {
    input: "A continuous function f, two initial guesses x0 and x1.",
    output: "An approximate root x* such that f(x*) ≈ 0.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "Newton's method converges fast but needs the derivative. The secant method replaces the derivative with a finite difference approximation using the two most recent points. It draws a secant line through (x_{n-1}, f(x_{n-1})) and (x_n, f(x_n)), and the next guess is where that line crosses zero.",
      },
      {
        kind: "p",
        text: "The trade-off is that convergence is slightly slower than Newton's (order ~1.618 instead of 2), but each step only requires one function evaluation instead of two (function + derivative).",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Start with two initial guesses $x_0$ and $x_1$.",
          "Compute $x_{n+1} = x_n - f(x_n) \\cdot \\frac{x_n - x_{n-1}}{f(x_n) - f(x_{n-1})}$.",
          "Repeat until $|f(x_{n+1})| < \\varepsilon$ or $|x_{n+1} - x_n| < \\varepsilon$.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example**: Find root of f(x) = x^2 - 2 (so √2 ≈ 1.4142). Start x0=1, x1=2. x2 = 2 - 2*(2-1)/(2-(-1)) = 2 - 2/3 = 1.3333. x3 = 1.3333 - (-0.2222)*(1.3333-2)/(-0.2222-2) = 1.3333 - (-0.2222*-0.6667)/(-2.2222) = 1.4000. Converges to 1.4142...",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Guard against division by zero when f(x_n) ≈ f(x_{n-1}).",
          "Set a maximum iteration count to avoid infinite loops on non-convergent cases.",
          "The method does not bracket the root, so it can diverge for poorly chosen starting points.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The convergence order is the golden ratio φ ≈ 1.618. If the root is simple and f is sufficiently smooth, the error satisfies $|e_{n+1}| \\approx C |e_n|^\\varphi$. Each iteration costs one function evaluation, so per-evaluation convergence is comparable to Newton's method.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "The Illinois and Regula Falsi methods combine bracketing with secant-like updates for guaranteed convergence.",
          "Broyden's method generalises the secant method to systems of equations.",
          "Muller's method uses three points and a quadratic interpolation instead of linear.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(1)",
      average: "O(k)",
      worst: "O(k)",
    },
    space: "O(1)",
    worstClass: "other",
    note: "k is the number of iterations to convergence; each iteration is O(cost of evaluating f).",
  },
  properties: [
    {
      label: "Convergence order",
      value: "φ ≈ 1.618 (superlinear)",
    },
    {
      label: "Derivative-free",
      value: "Yes",
    },
    {
      label: "Bracketing",
      value: "No — can diverge",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "secant_sqrt",
      code: `def secant_sqrt(a, x0, x1, tol=1e-10, max_iter=100):
    """Find sqrt(a) using the secant method on f(x) = x^2 - a."""
    for _ in range(max_iter):
        fx0 = x0 * x0 - a
        fx1 = x1 * x1 - a
        if abs(fx1) < tol:
            return round(x1, 6)
        if fx1 == fx0:
            break
        x2 = x1 - fx1 * (x1 - x0) / (fx1 - fx0)
        x0, x1 = x1, x2
    return round(x1, 6)
`,
      tests: [
        {
          args: [4, 1.0, 3.0],
          expected: 2.0,
        },
        {
          args: [9, 2.0, 4.0],
          expected: 3.0,
        },
        {
          args: [2, 1.0, 2.0],
          expected: 1.414214,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "secant-order",
      kind: "mcq",
      prompt: "What is the convergence order of the secant method?",
      options: ["φ ≈ 1.618", "2 (quadratic)", "1 (linear)", "3 (cubic)"],
      answer: 0,
      explanation:
        "The secant method converges with order equal to the golden ratio, which is superlinear but slower than Newton's quadratic convergence.",
      hints: ["Compare with Newton's method which is order 2."],
      objective: "Know convergence rate",
    },
  ],
  exam: {
    definition:
      "The secant method approximates a function's root by iterating x_{n+1} = x_n - f(x_n)*(x_n - x_{n-1})/(f(x_n) - f(x_{n-1})).",
    steps: ["Choose x0, x1.", "Compute x_{n+1} from secant line.", "Repeat until convergence."],
    timeComplexity: "O(k) iterations, each O(cost of f)",
    spaceComplexity: "O(1)",
    correctness: "Converges with order φ ≈ 1.618 for simple roots of smooth functions.",
    applications: ["Root finding without derivatives", "Optimization subroutines"],
    limitations: [
      "Can diverge without bracketing",
      "Slower than Newton when derivatives are cheap",
    ],
    faq: [
      {
        q: "Why not just use Newton's method?",
        a: "Newton requires the derivative, which may be expensive or unavailable.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["State the iteration formula (1).", "Convergence order (1)."],
      },
    ],
  },
  references: [
    {
      citation: "R. L. Burden, J. D. Faires, Numerical Analysis, 9th ed., Cengage, 2010.",
      supports: "Standard reference for the secant method and convergence analysis.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples verified by automated tests.",
  },
  version: 1,
  updated: "2026-10-27",
};
