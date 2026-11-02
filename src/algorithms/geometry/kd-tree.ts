import type { PlaneStructure } from "@/engine/protocol";
import type { TraceState } from "@/engine/state";
import { planeBounds } from "@/engine/tracer";
import type { AlgorithmModule, InputSpec } from "../types";
import { dist2, formatPoints, parsePoints, randomPoints, showPoint, type Point } from "./common";

export interface KdInput {
  points: Point[];
  /** The query point. */
  q: Point;
}

export interface KdOutput {
  /** Index of a nearest point, and its squared distance to q. */
  nearest: number;
  d2: number;
  /** Tree nodes whose distance to q was computed. */
  visited: number;
  /** Levels in the tree. */
  height: number;
}

const MAX_POINTS = 26;
const letter = (i: number) => String.fromCharCode(65 + i);
const nodeId = (i: number) => `n${i}`;

const input: InputSpec<KdInput> = {
  fields: [
    {
      name: "points",
      label: "Points (x,y pairs)",
      placeholder: "e.g. 2,3 5,4 9,6",
      multiline: true,
    },
    { name: "q", label: "Query point q", placeholder: "e.g. 9,2" },
  ],
  constraints: `1–${MAX_POINTS} points (named A, B, …) and one query point, as x,y pairs; whole-number coordinates from −100 to 100.`,
  parse(fields) {
    const pts = parsePoints(fields.points ?? "", { min: 1, max: MAX_POINTS });
    const q = parsePoints(fields.q ?? "", { min: 1, max: 1, what: "query points" });
    if (!pts.ok || !q.ok)
      return { ok: false, errors: [...(pts.ok ? [] : pts.errors), ...(q.ok ? [] : q.errors)] };
    return { ok: true, value: { points: pts.value, q: q.value[0]! } };
  },
  format: (v) => ({ points: formatPoints(v.points), q: formatPoints([v.q]) }),
  presets: [
    {
      id: "classic",
      label: "Six points, query (9, 2)",
      value: {
        points: [
          { x: 2, y: 3 },
          { x: 5, y: 4 },
          { x: 9, y: 6 },
          { x: 4, y: 7 },
          { x: 8, y: 1 },
          { x: 7, y: 2 },
        ],
        q: { x: 9, y: 2 },
      },
    },
    {
      id: "prune",
      label: "Fifteen points: most of the tree is pruned",
      value: {
        points: [
          { x: 3, y: 30 },
          { x: 10, y: 4 },
          { x: 14, y: 22 },
          { x: 19, y: 35 },
          { x: 22, y: 12 },
          { x: 25, y: 28 },
          { x: 29, y: 3 },
          { x: 31, y: 19 },
          { x: 34, y: 33 },
          { x: 37, y: 9 },
          { x: 6, y: 15 },
          { x: 17, y: 8 },
          { x: 27, y: 38 },
          { x: 38, y: 24 },
          { x: 12, y: 37 },
        ],
        q: { x: 30, y: 21 },
      },
    },
    {
      id: "far",
      label: "Query outside the points",
      value: {
        points: [
          { x: 0, y: 0 },
          { x: 4, y: 2 },
          { x: 2, y: 5 },
          { x: 6, y: 6 },
          { x: 1, y: 3 },
        ],
        q: { x: 12, y: 1 },
      },
    },
  ],
  random(rng, size) {
    const n = Math.max(1, Math.min(MAX_POINTS, size ?? 10));
    return { points: randomPoints(rng, n), q: { x: rng.int(0, 40), y: rng.int(0, 40) } };
  },
};

type Cell = { x1: number; y1: number; x2: number; y2: number };

/**
 * A 2-d tree splits the plane at the median point, alternately by x and by y. A
 * nearest-neighbour query walks down to the query's own cell first, then backs up,
 * crossing a split line only when the circle around q through the best point so far
 * reaches over it. Building takes O(n log n) with linear-time medians (sorting at
 * every level, as here, gives O(n log² n)). A query is fast on well-spread points but
 * can examine every point in the worst case.
 */
export const kdTree: AlgorithmModule<KdInput, KdOutput> = {
  id: "kd-tree",
  version: 1,
  pseudocode: [
    "procedure Build(P, depth)   // axis = x at even depths, y at odd",
    "  if P is empty: return nothing",
    "  m ← the median point of P along the axis",
    "  return node(m, Build(points before m, depth + 1), Build(points after m, depth + 1))",
    "procedure Nearest(node, q)",
    "  if node is empty: return",
    "  if |q m| < best: best ← |q m|",
    "  diff ← q[axis] − m[axis];  near, far ← the child on q's side, the other",
    "  Nearest(near, q)",
    "  if |diff| < best: Nearest(far, q)   // the circle around q crosses the split",
    "  else skip far: everything there is at least |diff| from q",
  ],
  input,

  run(input, t) {
    const { points, q } = input;
    const n = points.length;
    const bounds = planeBounds([...points, q]);
    const P = t.plane("P", {
      points: [
        ...points.map((p, i) => ({ id: `p${i}`, label: letter(i), x: p.x, y: p.y })),
        { id: "q", label: "q", x: q.x, y: q.y },
      ],
      bounds,
      label: "Points and the query q",
    });
    const T = t.tree("T", { binary: true, label: "2-d tree" });
    const cells = new Map<number, Cell>();
    const children = new Map<number, [number | null, number | null]>();
    const axisOf = new Map<number, 0 | 1>();
    let height = 0;
    P.point("q", "highlight", { line: 1 });

    const build = (
      idx: number[],
      depth: number,
      cell: Cell,
      parent: number | null,
      slot?: 0 | 1,
    ): number | null => {
      if (idx.length === 0) return null;
      height = Math.max(height, depth + 1);
      const axis = (depth % 2) as 0 | 1;
      const key = (p: Point) => (axis === 0 ? [p.x, p.y] : [p.y, p.x]);
      const sorted = [...idx].sort((a, b) => {
        const [ka, kb] = [key(points[a]!), key(points[b]!)];
        return ka[0]! - kb[0]! || ka[1]! - kb[1]! || a - b;
      });
      const mi = sorted.length >> 1;
      const m = sorted[mi]!;
      const p = points[m]!;
      cells.set(m, cell);
      axisOf.set(m, axis);
      T.add(
        letter(m),
        parent === null ? null : nodeId(parent),
        slot,
        { line: 3 },
        { id: nodeId(m) },
      );
      T.annotate(nodeId(m), axis === 0 ? `x=${p.x}` : `y=${p.y}`, { line: 3 });
      P.draw(
        `split${m}`,
        axis === 0
          ? { kind: "segment", x1: p.x, y1: cell.y1, x2: p.x, y2: cell.y2 }
          : { kind: "segment", x1: cell.x1, y1: p.y, x2: cell.x2, y2: p.y },
        "idle",
        {
          line: 3,
          note: `${letter(m)} ${showPoint(p)} is the median of ${sorted.length} point${sorted.length === 1 ? "" : "s"} by ${axis === 0 ? "x" : "y"}; its line splits this cell in two.`,
        },
      );
      const before = sorted.slice(0, mi);
      const after = sorted.slice(mi + 1);
      const lo = axis === 0 ? { ...cell, x2: p.x } : { ...cell, y2: p.y };
      const hi = axis === 0 ? { ...cell, x1: p.x } : { ...cell, y1: p.y };
      const left = build(before, depth + 1, lo, m, 0);
      const right = build(after, depth + 1, hi, m, 1);
      children.set(m, [left, right]);
      return m;
    };
    const root = build(
      points.map((_, i) => i),
      0,
      { x1: bounds.minX, y1: bounds.minY, x2: bounds.maxX, y2: bounds.maxY },
      null,
    );

    let best = Infinity;
    let nearest = -1;
    let visited = 0;
    const subtree = (m: number | null): number[] =>
      m === null ? [] : [m, ...subtree(children.get(m)![0]), ...subtree(children.get(m)![1])];
    const showBest = (m: number) => {
      P.draw(
        "best",
        { kind: "segment", x1: q.x, y1: q.y, x2: points[m]!.x, y2: points[m]!.y },
        "path",
      );
      P.draw("radius", { kind: "circle", x: q.x, y: q.y, r: Math.sqrt(best) }, "highlight", {
        line: 7,
        vars: { "best²": best },
        note: `${letter(m)} is the nearest so far (distance² ${best}); only points inside this circle could be nearer.`,
      });
    };

    const search = (m: number | null) => {
      if (m === null) return;
      const p = points[m]!;
      const cell = cells.get(m)!;
      const axis = axisOf.get(m)!;
      T.status(nodeId(m), "current", { line: 5 });
      P.draw("cell", { kind: "rect", ...cell }, "examining", { line: 5 });
      t.tally("distance computations");
      visited++;
      const d2 = dist2(p, q);
      P.point(`p${m}`, "visited", { line: 7, vars: { node: letter(m), "|q m|²": d2 } });
      if (d2 < best) {
        if (nearest !== -1) P.point(`p${nearest}`, "visited");
        best = d2;
        nearest = m;
        P.point(`p${m}`, "path");
        showBest(m);
      }
      const diff = axis === 0 ? q.x - p.x : q.y - p.y;
      const [left, right] = children.get(m)!;
      const [near, far] = diff < 0 ? [left, right] : [right, left];
      t.step({
        line: 8,
        vars: { diff },
        note: `q is ${diff < 0 ? (axis === 0 ? "left of" : "below") : axis === 0 ? "right of or on" : "above or on"} ${letter(m)}'s line, so search that side first.`,
      });
      T.status(nodeId(m), "frontier", { line: 9 });
      search(near);
      P.draw("cell", { kind: "rect", ...cell }, "examining", { line: 10 });
      if (far !== null) {
        if (diff * diff < best) {
          t.step({
            line: 10,
            vars: { diff },
            note: `The line is ${Math.abs(diff)} away but the best distance² is ${best} > ${diff * diff}: the far side may hold a nearer point.`,
          });
          search(far);
        } else {
          for (const k of subtree(far)) {
            T.status(nodeId(k), "unreachable");
            P.point(`p${k}`, "unreachable");
          }
          t.step({
            line: 11,
            note: `Skip the subtree under ${letter(far)}: its points are at least ${Math.abs(diff)} from q (distance² ≥ ${diff * diff} ≥ ${best}).`,
          });
        }
      }
      T.status(nodeId(m), "visited");
    };
    search(root);
    if (P.has("cell")) P.erase("cell");
    T.status(nodeId(nearest), "path", { line: 7 });
    const output: KdOutput = { nearest, d2: best, visited, height };
    t.finish(input, output, {
      line: 7,
      vars: { diff: null, node: null, "|q m|²": null },
      note: `Nearest to q: ${letter(nearest)} ${showPoint(points[nearest]!)}, distance² ${best}, after examining ${visited} of ${n} points.`,
    });
    return output;
  },

  check(input, out) {
    // Independent oracle: measure every point.
    const { points, q } = input;
    const best = Math.min(...points.map((p) => dist2(p, q)));
    if (out.d2 !== best) return `distance² ${out.d2}, expected ${best}`;
    const p = points[out.nearest];
    if (!p || dist2(p, q) !== best) return `point ${out.nearest} is not at distance² ${best}`;
    const n = points.length;
    // Median splits halve the points at every level.
    if (out.height !== Math.floor(Math.log2(n)) + 1) return `height ${out.height} for ${n} points`;
    return out.visited >= 1 && out.visited <= n ? null : `${out.visited} points examined`;
  },

  fidelity(state: TraceState, out) {
    const p = state.structures.P as PlaneStructure | undefined;
    const tr = state.structures.T;
    if (p?.kind !== "plane" || tr?.kind !== "tree") return "missing plane or tree";
    if (p.pointStatus[`p${out.nearest}`] !== "path") return "nearest point not marked";
    if (tr.nodeStatus[nodeId(out.nearest)] !== "path") return "nearest node not marked";
    const best = p.shapes.find((s) => s.id === "best");
    if (best?.kind !== "segment") return "no best segment";
    const length2 = (best.x1 - best.x2) ** 2 + (best.y1 - best.y2) ** 2;
    return length2 === out.d2 ? null : `best segment has length² ${length2}`;
  },

  describeOutput: (out) =>
    `Nearest: ${letter(out.nearest)} (distance² ${out.d2}); ${out.visited} points examined, height ${out.height}`,
};
