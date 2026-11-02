import type { TraceState } from "@/engine/state";
import type { AlgorithmModule } from "../types";
import { cross, dist2, indexedPoints, pointsInput, showPoint, type Point } from "./common";

export interface HullOutput {
  /** Indices of the hull's corners, counter-clockwise from the lowest (then leftmost) point. */
  hull: number[];
  /** Points pushed and later popped because they turned out not to be corners. */
  popped: number;
}

const id = (i: number) => `p${i}`;
const edge = (a: number, b: number) => `h${a}-${b}`;

/**
 * Graham scan: take the lowest point as an anchor, sort the rest by angle around it,
 * then walk them in order, keeping a stack of corners. A corner that the next point
 * makes into a right turn (or a straight line) is inside the hull or on an edge, so it
 * is popped. Sorting dominates: O(n log n).
 */
export const grahamScan: AlgorithmModule<Point[], HullOutput> = {
  id: "graham-scan",
  version: 1,
  pseudocode: [
    "procedure GrahamScan(P)",
    "  p₀ ← the lowest point (the leftmost of those)",
    "  sort the other points by angle around p₀, nearer first when angles tie",
    "  stack ← [p₀]",
    "  for each point p in that order",
    "    while the stack has ≥ 2 points and (next-to-top, top, p) is not a left turn",
    "      pop the stack   // top is inside the hull or on an edge",
    "    push p",
    "  return the stack   // the corners, counter-clockwise from p₀",
  ],
  input: pointsInput({
    min: 1,
    max: 40,
    defaultSize: 12,
    presets: [
      {
        id: "classic",
        label: "Eleven points, one on an edge",
        value: [
          { x: 0, y: 0 },
          { x: 8, y: 0 },
          { x: 4, y: 0 },
          { x: 10, y: 5 },
          { x: 6, y: 9 },
          { x: 1, y: 7 },
          { x: 4, y: 4 },
          { x: 6, y: 3 },
          { x: 3, y: 6 },
          { x: 8, y: 6 },
          { x: 2, y: 2 },
        ],
      },
      {
        id: "grid",
        label: "A 3 × 3 grid: only the corners count",
        value: [0, 1, 2].flatMap((y) => [0, 1, 2].map((x) => ({ x: 3 * x, y: 3 * y }))),
      },
      {
        id: "round",
        label: "Every point on the hull",
        value: [
          { x: 5, y: 0 },
          { x: 9, y: 2 },
          { x: 10, y: 6 },
          { x: 8, y: 9 },
          { x: 4, y: 10 },
          { x: 1, y: 8 },
          { x: 0, y: 4 },
          { x: 2, y: 1 },
        ],
      },
    ],
  }),

  run(points, t) {
    const n = points.length;
    const P = t.plane("P", { points: indexedPoints(points), label: "Points" });
    let p0 = 0;
    for (let i = 1; i < n; i++) {
      const [a, b] = [points[i]!, points[p0]!];
      if (a.y < b.y || (a.y === b.y && a.x < b.x)) p0 = i;
    }
    P.point(id(p0), "highlight", {
      line: 2,
      vars: { "p₀": p0 },
      note: `Point ${p0} ${showPoint(points[p0]!)} is the lowest, so it is certainly a corner. Every other point is above it or to its right.`,
    });
    const anchor = points[p0]!;
    const rest: number[] = [];
    for (let i = 0; i < n; i++) {
      if (i === p0) continue;
      if (dist2(points[i]!, anchor) === 0) {
        P.point(id(i), "unreachable", { line: 2, note: `Point ${i} repeats p₀; skip it.` });
        continue;
      }
      rest.push(i);
    }
    rest.sort((i, j) => {
      t.tally("angle comparisons");
      const c = cross(anchor, points[i]!, points[j]!);
      if (c !== 0) return -c;
      return dist2(anchor, points[i]!) - dist2(anchor, points[j]!) || i - j;
    });
    const O = t.array(
      "order",
      rest.map((i) => i),
      { label: "Other points by angle around p₀", display: "cells" },
    );
    t.step({
      line: 3,
      note: "Sorted by angle, measured counter-clockwise from the rightward direction.",
    });
    const S = t.sequence("S", "stack", { label: "Stack (corners so far)" });
    const stack = [p0];
    S.push(p0, { line: 4 });
    let popped = 0;
    rest.forEach((p, k) => {
      O.pointer("i", k, { line: 5, vars: { p } });
      P.point(id(p), "current", { line: 5 });
      for (;;) {
        if (stack.length < 2) break;
        const [a, b] = [stack[stack.length - 2]!, stack[stack.length - 1]!];
        P.draw(
          "probe",
          {
            kind: "segment",
            x1: points[b]!.x,
            y1: points[b]!.y,
            x2: points[p]!.x,
            y2: points[p]!.y,
          },
          "examining",
        );
        t.tally("orientation tests");
        const c = cross(points[a]!, points[b]!, points[p]!);
        const turn = c > 0 ? "a left turn" : c < 0 ? "a right turn" : "a straight line";
        t.step({
          line: 6,
          vars: { "cross product": c },
          note: `${a} → ${b} → ${p} is ${turn} (cross product ${c}).`,
        });
        if (c > 0) break;
        P.erase(edge(a, b));
        stack.pop();
        popped++;
        S.pop({ line: 7 });
        P.point(id(b), "unreachable", {
          line: 7,
          note: `Point ${b} is ${c < 0 ? "inside the hull" : "on the edge from " + a + " to " + p}: not a corner.`,
        });
      }
      if (P.has("probe")) P.erase("probe");
      const top = stack[stack.length - 1]!;
      P.draw(
        edge(top, p),
        {
          kind: "segment",
          x1: points[top]!.x,
          y1: points[top]!.y,
          x2: points[p]!.x,
          y2: points[p]!.y,
        },
        "tree",
      );
      stack.push(p);
      S.push(p, { line: 8 });
      P.point(id(p), "frontier", { line: 8 });
    });
    O.pointer("i", null, { line: 9 });
    if (stack.length >= 3) {
      const last = stack[stack.length - 1]!;
      P.draw(
        edge(last, p0),
        { kind: "segment", x1: points[last]!.x, y1: points[last]!.y, x2: anchor.x, y2: anchor.y },
        "tree",
        { line: 9, note: "Close the hull back to p₀." },
      );
    }
    stack.forEach((c, k) => {
      P.point(id(c), "path", { line: 9 });
      const next = stack[(k + 1) % stack.length]!;
      if (stack.length >= 2 && (k + 1 < stack.length || stack.length >= 3))
        P.restyle(edge(c, next), "path", { line: 9 });
    });
    const output: HullOutput = { hull: stack, popped };
    t.finish(points, output, {
      line: 9,
      vars: { p: null, "cross product": null },
      note: `The hull has ${stack.length} corner${stack.length === 1 ? "" : "s"}: ${stack.join(", ")}.`,
    });
    return output;
  },

  check(points, out) {
    // Independent oracle: Andrew's monotone chain on the distinct points.
    const key = (p: Point) => `${p.x},${p.y}`;
    const distinct = [...new Map(points.map((p) => [key(p), p])).values()].sort(
      (a, b) => a.x - b.x || a.y - b.y,
    );
    let chain: Point[] = distinct;
    if (distinct.length > 2) {
      const half = (list: Point[]) => {
        const h: Point[] = [];
        for (const p of list) {
          while (h.length >= 2 && cross(h[h.length - 2]!, h[h.length - 1]!, p) <= 0) h.pop();
          h.push(p);
        }
        return h.slice(0, -1);
      };
      chain = [...half(distinct), ...half([...distinct].reverse())];
    }
    // Rotate to start at the lowest, then leftmost, corner.
    let start = 0;
    chain.forEach((p, i) => {
      const s = chain[start]!;
      if (p.y < s.y || (p.y === s.y && p.x < s.x)) start = i;
    });
    const want = [...chain.slice(start), ...chain.slice(0, start)].map(key);
    if (out.hull.some((i) => !Number.isInteger(i) || i < 0 || i >= points.length))
      return `hull ${out.hull} names a missing point`;
    const got = out.hull.map((i) => key(points[i]!));
    if (JSON.stringify(got) !== JSON.stringify(want))
      return `hull ${got.join(" ")}, expected ${want.join(" ")}`;
    return out.popped <= points.length ? null : `${out.popped} pops for ${points.length} points`;
  },

  fidelity(state: TraceState, out) {
    const p = state.structures.P;
    if (p?.kind !== "plane") return "no plane P";
    const corners = p.points.filter((x) => p.pointStatus[x.id] === "path").map((x) => x.id);
    const want = out.hull.map(id);
    if (JSON.stringify([...corners].sort()) !== JSON.stringify([...want].sort()))
      return `corners shown ${corners}, expected ${want}`;
    const edges = p.shapes.filter((s) => s.status === "path").length;
    const h = out.hull.length;
    return edges === (h >= 3 ? h : h - 1) ? null : `${edges} hull edges shown for ${h} corners`;
  },

  describeOutput: (out) =>
    `Hull corners ${out.hull.join(", ")} (${out.hull.length}); ${out.popped} popped`,
};
