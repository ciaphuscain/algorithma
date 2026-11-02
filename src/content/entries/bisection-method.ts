import type { AlgorithmEntry } from "../types";

export const bisectionMethodEntry: AlgorithmEntry = {
  slug: "bisection-method",
  name: "Bisection Method",
  aliases: ["Binary Search for Roots", "Interval Halving"],
  curriculum: [385],
  domain: "number-theory",
  subcategory: "Number Theory",
  difficulty: "intermediate",
  summary:
    "Finds a root of a continuous function on an interval [a, b] where f(a) and f(b) have opposite signs, by repeatedly halving the interval, guaranteeing convergence with one bit of precision per iteration.",
  tags: ["root finding", "numerical methods", "binary search"],
  prerequisites: ["Binary Search"],
  related: [],
  problem: {
    input:
      "A continuous function f, an interval [a, b] with f(a) * f(b) < 0, and a tolerance epsilon.",
    output: "A value x in [a, b] with |f(x)| < epsilon (approximately a root of f).",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "If a continuous function is negative at one end of an interval and positive at the other, it must cross zero somewhere in between (intermediate value theorem). The bisection method checks the midpoint: if the sign matches the left end, the root is in the right half; otherwise it's in the left half. Each step halves the interval.",
      },
      {
        kind: "p",
        text: "This is binary search applied to continuous functions. It's not the fastest root-finding method (Newton's method converges faster), but it's the most robust: it always converges as long as the initial bracket is valid.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Check f(a) and f(b) have opposite signs.",
          "Compute mid = (a + b) / 2.",
          "If |f(mid)| < epsilon, return mid.",
          "If f(a) * f(mid) < 0, set b = mid; else set a = mid.",
          "Repeat until |b - a| < epsilon.",
        ],
      },
      {
        kind: "p",
        text: "**Worked example**: find root of f(x) = x^2 - 2 (i.e., sqrt(2)) on [1, 2].",
      },
      {
        kind: "table",
        head: ["Step", "a", "b", "mid", "f(mid)"],
        rows: [
          ["0", "1.0", "2.0", "1.5", "0.25"],
          ["1", "1.0", "1.5", "1.25", "-0.4375"],
          ["2", "1.25", "1.5", "1.375", "-0.109375"],
          ["3", "1.375", "1.5", "1.4375", "0.06640625"],
        ],
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "Use (a + b) / 2 or a + (b - a) / 2 to avoid overflow.",
          "Terminate on |b - a| < epsilon or |f(mid)| < epsilon or max iterations.",
          "For floating-point, about 52 iterations suffice for double precision.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "**Convergence rate**: linear, gaining one bit of precision per iteration. After k steps, the interval width is (b-a)/2^k.",
      },
      {
        kind: "p",
        text: "**Iterations needed**: ceil(log2((b-a)/epsilon)) iterations for tolerance epsilon.",
      },
      {
        kind: "p",
        text: "Unlike Newton's method, bisection doesn't need the derivative and cannot diverge.",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "ITP (Interpolation-Truncation-Projection) method combines bisection's reliability with superlinear convergence.",
          "Brent's method combines bisection with secant/inverse quadratic interpolation for practical root-finding.",
          "Bisection in higher dimensions becomes interval arithmetic or branch-and-bound.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(1)",
      average: "O(log((b-a)/epsilon))",
      worst: "O(log((b-a)/epsilon))",
    },
    space: "O(1)",
    worstClass: "log n",
    note: "One function evaluation per iteration.",
  },
  properties: [
    {
      label: "Convergence",
      value: "Guaranteed (linear)",
    },
    {
      label: "Requires derivative",
      value: "No",
    },
    {
      label: "Bits per iteration",
      value: "1",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "bisect_test",
      code: `def bisect_root(f, a, b, eps=1e-9, max_iter=100):
    """Find x in [a,b] with f(x) approx 0. f(a) and f(b) must have opposite signs."""
    fa, fb = f(a), f(b)
    for _ in range(max_iter):
        mid = (a + b) / 2
        fm = f(mid)
        if abs(fm) < eps or (b - a) / 2 < eps:
            return round(mid, 6)
        if fa * fm < 0:
            b = mid
            fb = fm
        else:
            a = mid
            fa = fm
    return round((a + b) / 2, 6)

def bisect_test(target_sq):
    """Find sqrt of target_sq using bisection on f(x) = x^2 - target_sq."""
    return bisect_root(lambda x: x*x - target_sq, 0, target_sq if target_sq > 1 else 1)
`,
      tests: [
        {
          args: [4],
          expected: 2.0,
        },
        {
          args: [9],
          expected: 3.0,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "bisect-iters",
      kind: "numeric",
      prompt:
        "How many bisection iterations are needed to narrow an interval of width 1024 to width 1?",
      answer: 10,
      explanation: "Each iteration halves the width. 1024 / 2^10 = 1, so 10 iterations.",
      hints: ["How many times can you halve 1024?"],
      objective: "Calculate iteration count",
    },
  ],
  exam: {
    definition:
      "The bisection method finds roots of continuous functions by repeatedly halving a bracketing interval, converging linearly with one bit per step.",
    steps: [
      "Verify opposite signs at endpoints",
      "Compute midpoint",
      "Check convergence",
      "Update bracket based on sign of f(mid)",
    ],
    timeComplexity: "O(log((b-a)/epsilon))",
    spaceComplexity: "O(1)",
    correctness:
      "By the intermediate value theorem, a root exists in the bracket. Each step maintains the invariant that f changes sign across the interval.",
    applications: ["Root finding", "Optimization (find zero of derivative)", "Numerical analysis"],
    limitations: ["Linear convergence (slower than Newton)", "Needs initial bracket"],
    faq: [
      {
        q: "When does bisection beat Newton?",
        a: "When the function is not differentiable, the derivative is expensive, or Newton diverges from a bad initial guess.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Interval halving with IVT guarantee (2)"],
      },
    ],
  },
  references: [
    {
      citation: "R. L. Burden and J. D. Faires, Numerical Analysis, 10th ed., Cengage, 2015, §2.1.",
      supports: "Bisection method and convergence analysis.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
