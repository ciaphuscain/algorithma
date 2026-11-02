import type { TraceState } from "@/engine/state";
import type { AlgorithmModule } from "../types";
import { dist2, indexedPoints, pointsInput, type Point } from "./common";

export interface ClosestPairOutput {
  /** Indices of the closest pair, smaller first. */
  pair: [number, number];
  /** Their squared distance (exact for whole-number coordinates). */
  d2: number;
  /** Most strip neighbours any one point was compared with (at most 7). */
  maxStrip: number;
}

const id = (i: number) => `p${i}`;
const show = (d2: number) =>
  Number.isInteger(Math.sqrt(d2)) ? String(Math.sqrt(d2)) : `√${d2} ≈ ${Math.sqrt(d2).toFixed(2)}`;

/**
 * Closest pair of points by divide and conquer: split the points at the median x,
 * solve each half, then look for a closer pair that straddles the split. Only points
 * within d of the split line can, and in y order each needs comparing with at most 7
 * successors, so the combine step is linear and the total O(n log n).
 */
export const closestPair: AlgorithmModule<Point[], ClosestPairOutput> = {
  id: "closest-pair",
  version: 1,
  pseudocode: [
    "procedure Closest(P)   // P sorted by x; returns the closest pair and its distance d",
    "  if |P| ≤ 3: compare every pair and return the best",
    "  split P at the middle point; x_m ← its x",
    "  d ← the smaller of Closest(left half) and Closest(right half)",
    "  strip ← the points with |x − x_m| < d, sorted by y",
    "  for each point s in strip",
    "    compare s with each later point t while t.y − s.y < d   // at most 7 of them",
    "      if |s t| < d: d ← |s t|",
    "  return the best pair found",
  ],
  input: pointsInput({
    min: 2,
    max: 32,
    defaultSize: 12,
    presets: [
      {
        id: "classic",
        label: "Twelve points, closest pair across the split",
        value: [
          { x: 28, y: 8 },
          { x: 5, y: 30 },
          { x: 19, y: 20 },
          { x: 35, y: 15 },
          { x: 2, y: 3 },
          { x: 24, y: 35 },
          { x: 12, y: 40 },
          { x: 21, y: 21 },
          { x: 8, y: 12 },
          { x: 39, y: 40 },
          { x: 15, y: 5 },
          { x: 31, y: 28 },
        ],
      },
      {
        id: "line",
        label: "Points on a line",
        value: [0, 7, 11, 20, 24, 26, 33, 40].map((x) => ({ x, y: 10 })),
      },
      {
        id: "repeat",
        label: "A repeated point (distance 0)",
        value: [
          { x: 4, y: 4 },
          { x: 10, y: 2 },
          { x: 7, y: 9 },
          { x: 10, y: 2 },
          { x: 1, y: 8 },
        ],
      },
    ],
  }),

  run(points, t) {
    const n = points.length;
    const P = t.plane("P", { points: indexedPoints(points), label: "Points" });
    const { minY, maxY } = (() => {
      const ys = points.map((p) => p.y);
      const m = Math.max(1, (Math.max(...ys) - Math.min(...ys)) / 10);
      return { minY: Math.min(...ys) - m, maxY: Math.max(...ys) + m };
    })();
    const byX = points
      .map((_, i) => i)
      .sort((a, b) => points[a]!.x - points[b]!.x || points[a]!.y - points[b]!.y || a - b);
    const X = t.array("byX", byX, { label: "Points in order of x", display: "cells" });
    let best = { d2: Infinity, pair: [0, 1] as [number, number] };
    let maxStrip = 0;

    const segment = (a: number, b: number) => ({
      kind: "segment" as const,
      x1: points[a]!.x,
      y1: points[a]!.y,
      x2: points[b]!.x,
      y2: points[b]!.y,
    });
    /** Measure one pair; returns its squared distance. */
    const measure = (a: number, b: number, line: number) => {
      t.tally("distance computations");
      const d2 = dist2(points[a]!, points[b]!);
      P.draw("cand", segment(a, b), "examining", {
        line,
        vars: { "|s t|²": d2 },
        note: `Points ${a} and ${b} are ${show(d2)} apart.`,
      });
      if (d2 < best.d2) {
        best = { d2, pair: a < b ? [a, b] : [b, a] };
        P.draw("best", segment(a, b), "path", {
          line,
          note: `The closest pair found so far: ${a} and ${b}, ${show(d2)} apart.`,
        });
      }
      return d2;
    };
    const showRange = (lo: number, hi: number, line: number) => {
      X.pointer("lo", lo, { line });
      X.pointer("hi", hi - 1, { line });
      P.draw(
        "range",
        {
          kind: "rect",
          x1: points[byX[lo]!]!.x,
          y1: minY,
          x2: points[byX[hi - 1]!]!.x,
          y2: maxY,
        },
        "examining",
        { line, vars: { size: hi - lo } },
      );
    };

    /** The smallest squared distance among byX[lo … hi − 1], and those points in y order. */
    const solve = (lo: number, hi: number): { d2: number; byY: number[] } => {
      showRange(lo, hi, 1);
      if (hi - lo <= 3) {
        let d2 = Infinity;
        for (let i = lo; i < hi; i++)
          for (let j = i + 1; j < hi; j++) d2 = Math.min(d2, measure(byX[i]!, byX[j]!, 2));
        const byY = byX.slice(lo, hi).sort((a, b) => points[a]!.y - points[b]!.y || a - b);
        return { d2, byY };
      }
      const mid = (lo + hi) >> 1;
      const xm = points[byX[mid]!]!.x;
      X.pointer("mid", mid, { line: 3, vars: { x_m: xm } });
      const left = solve(lo, mid);
      const right = solve(mid, hi);
      showRange(lo, hi, 4);
      let d2 = Math.min(left.d2, right.d2);
      t.step({
        line: 4,
        vars: { d: show(d2) },
        note: `Best inside the halves: ${show(d2)}. A closer pair must straddle x = ${xm}.`,
      });
      // Merge the halves' y orders (as merge sort would), so no re-sorting is needed.
      const byY: number[] = [];
      for (let i = 0, j = 0; i < left.byY.length || j < right.byY.length;) {
        const [a, b] = [left.byY[i], right.byY[j]];
        if (b === undefined || (a !== undefined && (points[a]!.y - points[b]!.y || a - b) < 0)) {
          byY.push(a!);
          i++;
        } else {
          byY.push(b);
          j++;
        }
      }
      const strip = byY.filter((i) => (points[i]!.x - xm) ** 2 < d2);
      const w = Math.sqrt(d2);
      P.draw(
        "split",
        { kind: "segment", x1: xm, y1: minY, x2: xm, y2: maxY },
        "highlight",
        undefined,
        `x = ${xm}`,
      );
      P.draw("strip", { kind: "rect", x1: xm - w, y1: minY, x2: xm + w, y2: maxY }, "highlight", {
        line: 5,
        vars: { strip: strip.length },
        note: `${strip.length} point${strip.length === 1 ? " lies" : "s lie"} within ${show(d2)} of the split line.`,
      });
      for (let s = 0; s < strip.length; s++) {
        const a = strip[s]!;
        P.point(id(a), "current", { line: 6 });
        let compared = 0;
        for (let k = s + 1; k < strip.length; k++) {
          const b = strip[k]!;
          if ((points[b]!.y - points[a]!.y) ** 2 >= d2) break;
          compared++;
          const ab = measure(a, b, 7);
          if (ab < d2) {
            d2 = ab;
            t.step({ line: 8, vars: { d: show(d2) } });
          }
        }
        maxStrip = Math.max(maxStrip, compared);
        P.point(id(a), "unvisited", { line: 6 });
      }
      P.erase("strip");
      P.erase("split");
      return { d2, byY };
    };

    const result = solve(0, n);
    // The recursion's answer must be the best pair it ever measured.
    if (result.d2 !== best.d2) throw new Error("closest pair: recursion and measurements disagree");
    if (P.has("cand")) P.erase("cand");
    P.erase("range");
    X.pointer("lo", null);
    X.pointer("hi", null);
    X.pointer("mid", null);
    for (const i of best.pair) P.point(id(i), "path", { line: 9 });
    const output: ClosestPairOutput = { pair: best.pair, d2: best.d2, maxStrip };
    t.finish(points, output, {
      line: 9,
      vars: { "|s t|²": null, size: null, strip: null },
      note: `Closest pair: ${best.pair[0]} and ${best.pair[1]}, ${show(best.d2)} apart.`,
    });
    return output;
  },

  check(points, out) {
    // Independent oracle: compare every pair.
    let best = Infinity;
    for (let i = 0; i < points.length; i++)
      for (let j = i + 1; j < points.length; j++)
        best = Math.min(best, dist2(points[i]!, points[j]!));
    if (out.d2 !== best) return `distance² ${out.d2}, expected ${best}`;
    const [a, b] = out.pair;
    if (!(a < b) || b >= points.length || a < 0) return `pair ${out.pair} is not two points`;
    if (dist2(points[a]!, points[b]!) !== best) return `pair ${out.pair} is not ${best} apart`;
    return out.maxStrip <= 7 ? null : `a strip point was compared with ${out.maxStrip} others`;
  },

  fidelity(state: TraceState, out) {
    const p = state.structures.P;
    if (p?.kind !== "plane") return "no plane P";
    const marked = p.points.filter((x) => p.pointStatus[x.id] === "path").map((x) => x.id);
    if (JSON.stringify(marked) !== JSON.stringify(out.pair.map(id)))
      return `points marked ${marked}`;
    const best = p.shapes.find((s) => s.id === "best");
    if (best?.kind !== "segment") return "no best segment";
    const length2 = (best.x1 - best.x2) ** 2 + (best.y1 - best.y2) ** 2;
    return length2 === out.d2 ? null : `best segment has length² ${length2}`;
  },

  describeOutput: (out) => `Points ${out.pair[0]} and ${out.pair[1]}, distance ${show(out.d2)}`,
};
