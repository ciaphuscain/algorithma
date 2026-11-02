import type { TraceState } from "@/engine/state";
import type { AlgorithmModule, InputSpec } from "../types";

export interface DescentInput {
  /** f(x, y) = a(x − p)² + b(y − q)². */
  a: number;
  b: number;
  p: number;
  q: number;
  x0: number;
  y0: number;
  /** Learning rate η. */
  eta: number;
  steps: number;
}

export interface DescentOutput {
  /** Every iterate, the start included. Shorter than steps + 1 if the run blew up. */
  path: [number, number][];
  /** f at each iterate. */
  f: number[];
  /** Per-step contraction factors 1 − 2aη (x) and 1 − 2bη (y). */
  factors: [number, number];
  diverged: boolean;
}

const BLOW_UP = 1e6;
const MAX_STEPS = 50;

const show = (v: number) => {
  if (Math.abs(v) >= 1e4) return v.toExponential(2);
  return String(Number(v.toPrecision(4)));
};
const decimal = /^-?\d+(\.\d+)?$/;

/** Parse "u, v" into two numbers within [min, max]. */
function pair(text: string | undefined, name: string, min: number, max: number) {
  const tokens = (text ?? "").split(/[\s,;()]+/).filter(Boolean);
  if (tokens.length !== 2 || !tokens.every((t) => decimal.test(t)))
    return { error: `${name}: give two numbers separated by a comma` };
  const [u, v] = tokens.map(Number) as [number, number];
  if ([u, v].some((x) => x < min || x > max))
    return { error: `${name}: each number must be from ${min} to ${max}` };
  return { value: [u, v] as [number, number] };
}

const input: InputSpec<DescentInput> = {
  fields: [
    {
      name: "curvature",
      label: "Curvatures a, b",
      placeholder: "e.g. 1, 1",
      help: "f(x, y) = a(x − p)² + b(y − q)²",
    },
    { name: "minimum", label: "Minimum p, q", placeholder: "e.g. 2, 1" },
    { name: "start", label: "Start x₀, y₀", placeholder: "e.g. -6, 5" },
    { name: "eta", label: "Learning rate η", placeholder: "e.g. 0.25" },
    { name: "steps", label: "Steps", placeholder: "e.g. 10" },
  ],
  constraints: `Curvatures from 0.1 to 10; minimum and start coordinates from −10 to 10; 0 < η ≤ 2; 1–${MAX_STEPS} steps. The run stops early if an iterate passes ±${BLOW_UP.toLocaleString("en")}.`,
  parse(fields) {
    const errors: string[] = [];
    const ab = pair(fields.curvature, "Curvatures", 0.1, 10);
    const pq = pair(fields.minimum, "Minimum", -10, 10);
    const xy = pair(fields.start, "Start", -10, 10);
    for (const r of [ab, pq, xy]) if (r.error) errors.push(r.error);
    const et = (fields.eta ?? "").trim();
    if (!decimal.test(et) || Number(et) <= 0 || Number(et) > 2)
      errors.push("η must be a number greater than 0 and at most 2");
    const st = (fields.steps ?? "").trim();
    if (!/^\d+$/.test(st) || Number(st) < 1 || Number(st) > MAX_STEPS)
      errors.push(`Steps must be a whole number from 1 to ${MAX_STEPS}`);
    if (errors.length) return { ok: false, errors };
    const [a, b] = ab.value!;
    const [p, q] = pq.value!;
    const [x0, y0] = xy.value!;
    return { ok: true, value: { a, b, p, q, x0, y0, eta: Number(et), steps: Number(st) } };
  },
  format: (v) => ({
    curvature: `${v.a}, ${v.b}`,
    minimum: `${v.p}, ${v.q}`,
    start: `${v.x0}, ${v.y0}`,
    eta: String(v.eta),
    steps: String(v.steps),
  }),
  presets: [
    {
      id: "classic",
      label: "A round bowl, η = 0.25",
      value: { a: 1, b: 1, p: 2, q: 1, x0: -6, y0: 5, eta: 0.25, steps: 10 },
    },
    {
      id: "zigzag",
      label: "A narrow valley: zigzag across, crawl along",
      value: { a: 5, b: 0.5, p: 0, q: 0, x0: -4, y0: 8, eta: 0.18, steps: 30 },
    },
    {
      id: "diverge",
      label: "η too large: every step overshoots further",
      value: { a: 1, b: 1, p: 0, q: 0, x0: 3, y0: -2, eta: 1.1, steps: 12 },
    },
    {
      id: "slow",
      label: "η too small: a crawl",
      value: { a: 1, b: 1, p: 2, q: 1, x0: -6, y0: 5, eta: 0.02, steps: 30 },
    },
  ],
  random(rng, size) {
    const coord = () => rng.int(-8, 8);
    return {
      a: rng.int(1, 40) / 10,
      b: rng.int(1, 40) / 10,
      p: coord(),
      q: coord(),
      x0: coord(),
      y0: coord(),
      eta: rng.int(1, 60) / 100,
      steps: Math.max(1, Math.min(MAX_STEPS, 2 * (size ?? 8))),
    };
  },
};

/**
 * Gradient descent with a fixed learning rate on a quadratic bowl. Each step moves
 * against the gradient: (x, y) ← (x, y) − η∇f. On this function each coordinate's
 * distance to the minimum is multiplied by 1 − 2aη (or 1 − 2bη) per step, so the run
 * converges exactly when both factors lie strictly between −1 and 1.
 */
export const gradientDescent: AlgorithmModule<DescentInput, DescentOutput> = {
  id: "gradient-descent",
  version: 1,
  pseudocode: [
    "procedure GradientDescent(f, start, η, steps)   // f(x, y) = a(x − p)² + b(y − q)²",
    "  (x, y) ← start",
    "  repeat steps times",
    "    g ← ∇f(x, y) = (2a(x − p), 2b(y − q))",
    "    (x, y) ← (x, y) − η · g",
    "    stop if an iterate has blown up",
    "  return (x, y)",
  ],
  input,

  run(input, t) {
    const { a, b, p, q, x0, y0, eta, steps } = input;
    const f = (x: number, y: number) => a * (x - p) ** 2 + b * (y - q) ** 2;
    const hx = Math.max(Math.abs(x0 - p), Math.abs(y0 - q), 1) * 1.15;
    const P = t.plane("P", {
      label: "The iterates on f(x, y)",
      points: [
        { id: "min", label: "minimum", x: p, y: q },
        { id: "start", label: "start", x: x0, y: y0 },
      ],
      bounds: { minX: p - hx, maxX: p + hx, minY: q - hx, maxY: q + hx },
    });
    const r = hx * 0.03;
    const G = t.grid("G", steps + 1, 4, null, {
      label: "Iterates",
      rowHeaders: Array.from({ length: steps + 1 }, (_, i) => `t = ${i}`),
      colHeaders: ["x", "y", "f(x, y)", "|∇f|"],
    });
    const factors: [number, number] = [1 - 2 * a * eta, 1 - 2 * b * eta];
    let [x, y] = [x0, y0];
    const path: [number, number][] = [[x, y]];
    const values = [f(x, y)];
    const row = (i: number, gx: number, gy: number) => {
      G.write(i, 0, Number(x.toPrecision(4)));
      G.write(i, 1, Number(y.toPrecision(4)));
      G.write(i, 2, Number(f(x, y).toPrecision(4)));
      G.write(i, 3, Number(Math.hypot(gx, gy).toPrecision(4)), { line: 4 });
    };
    P.point("min", "path", {
      line: 2,
      vars: { η: eta, "x factor": show(factors[0]), "y factor": show(factors[1]) },
      note: `Each step multiplies x − p by 1 − 2aη = ${show(factors[0])} and y − q by 1 − 2bη = ${show(factors[1])}.`,
    });
    P.point("start", "highlight", { line: 2 });
    P.draw("now", { kind: "circle", x, y, r }, "highlight", { line: 2 });
    row(0, 2 * a * (x - p), 2 * b * (y - q));
    let diverged = false;
    for (let i = 1; i <= steps; i++) {
      const [gx, gy] = [2 * a * (x - p), 2 * b * (y - q)];
      t.tally("gradient evaluations");
      const [nx, ny] = [x - eta * gx, y - eta * gy];
      P.draw("step", { kind: "segment", x1: x, y1: y, x2: nx, y2: ny }, "examining", {
        line: 4,
        vars: { x: show(x), y: show(y), "∇f": `(${show(gx)}, ${show(gy)})` },
        note: `The gradient at (${show(x)}, ${show(y)}) is (${show(gx)}, ${show(gy)}); step by −η times it.`,
      });
      P.erase("step");
      P.draw(`s${i}`, { kind: "segment", x1: x, y1: y, x2: nx, y2: ny }, "tree");
      [x, y] = [nx, ny];
      path.push([x, y]);
      values.push(f(x, y));
      P.draw("now", { kind: "circle", x, y, r }, "highlight", {
        line: 5,
        vars: { t: i, x: show(x), y: show(y), "f(x, y)": show(f(x, y)) },
      });
      row(i, 2 * a * (x - p), 2 * b * (y - q));
      if (Math.abs(x) > BLOW_UP || Math.abs(y) > BLOW_UP) {
        diverged = true;
        t.step({ line: 6, note: `The iterate has passed ±${BLOW_UP.toLocaleString("en")}: stop.` });
        break;
      }
    }
    const output: DescentOutput = { path, f: values, factors, diverged };
    const last = values[values.length - 1]!;
    t.finish(input, output, {
      line: 7,
      note: diverged
        ? "Diverged."
        : `After ${path.length - 1} steps f = ${show(last)}, from ${show(values[0]!)} at the start.`,
    });
    return output;
  },

  check(input, out) {
    // Independent oracle: the closed form x_t = p + (1 − 2aη)^t (x₀ − p), likewise y.
    const { a, b, p, q, x0, y0, eta, steps } = input;
    const close = (u: number, v: number) => Math.abs(u - v) <= 1e-9 * Math.max(1, Math.abs(v));
    const [fx, fy] = [1 - 2 * a * eta, 1 - 2 * b * eta];
    if (!close(out.factors[0], fx) || !close(out.factors[1], fy)) return "wrong factors";
    let stop = steps;
    let blew = false;
    for (let t = 1; t <= steps && !blew; t++) {
      const [x, y] = [p + fx ** t * (x0 - p), q + fy ** t * (y0 - q)];
      if (Math.abs(x) > BLOW_UP || Math.abs(y) > BLOW_UP) [stop, blew] = [t, true];
    }
    if (out.path.length !== stop + 1) return `${out.path.length - 1} steps, expected ${stop}`;
    if (out.diverged !== blew) return `diverged = ${out.diverged}, expected ${blew}`;
    for (let t = 0; t <= stop; t++) {
      const [x, y] = [p + fx ** t * (x0 - p), q + fy ** t * (y0 - q)];
      const [ox, oy] = out.path[t]!;
      if (!close(ox, x) || !close(oy, y))
        return `iterate ${t} is (${ox}, ${oy}), expected (${x}, ${y})`;
      if (!close(out.f[t]!, a * (x - p) ** 2 + b * (y - q) ** 2)) return `f at step ${t} differs`;
    }
    return null;
  },

  fidelity(state: TraceState, out) {
    const P = state.structures.P;
    const G = state.structures.G;
    if (P?.kind !== "plane" || G?.kind !== "grid") return "missing plane or table";
    const [x, y] = out.path[out.path.length - 1]!;
    const now = P.shapes.find((s) => s.id === "now");
    if (now?.kind !== "circle" || now.x !== x || now.y !== y)
      return "the marker is not at the last iterate";
    const shown = G.cells[out.path.length - 1]!;
    return shown[0] === Number(x.toPrecision(4)) && shown[1] === Number(y.toPrecision(4))
      ? null
      : `table shows (${shown[0]}, ${shown[1]})`;
  },

  describeOutput: (out) => {
    const [x, y] = out.path[out.path.length - 1]!;
    const fEnd = out.f[out.f.length - 1]!;
    return `${out.diverged ? "Diverged" : `Ended at (${show(x)}, ${show(y)}), f = ${show(fEnd)}`} after ${out.path.length - 1} steps; factors ${show(out.factors[0])}, ${show(out.factors[1])}`;
  },
};
