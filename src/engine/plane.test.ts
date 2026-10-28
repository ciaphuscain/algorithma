import { describe, expect, it } from "vitest";
import { TracePlayer } from "./player";
import { MAX_PLANE_SHAPES, type PlaneStructure, type Trace } from "./protocol";
import { applyEvent, TraceReplayError } from "./reduce";
import { initialState } from "./state";
import { planeBounds, Tracer } from "./tracer";
import { validateTrace } from "./validate";

const POINTS = [
  { id: "A", x: 0, y: 0 },
  { id: "B", x: 4, y: 0 },
  { id: "C", x: 2, y: 3, label: "c" },
];

function planeTrace(): Trace {
  const t = new Tracer({ id: "plane-test", version: 1 });
  const P = t.plane("P", { points: POINTS, label: "Points" });
  P.point("A", "current", { line: 1 });
  P.draw("AB", { kind: "segment", x1: 0, y1: 0, x2: 4, y2: 0 }, "examining", { line: 2 }, "base");
  P.draw("box", { kind: "rect", x1: 0, y1: 0, x2: 2, y2: 3 }, "highlight");
  P.restyle("AB", "path", { note: "keep AB" });
  P.annotate("C", "θ=56°");
  P.draw("r", { kind: "circle", x: 2, y: 3, r: 1.5 }, "idle");
  P.erase("box");
  P.point("A", "path");
  return t.finish(null, null);
}

const plane = (trace: Trace, at = trace.events.length) => {
  const s = new TracePlayer(trace).stateAt(at).structures.P;
  if (s?.kind !== "plane") throw new Error("no plane");
  return s;
};

describe("plane structures", () => {
  it("defaults the window to the bounding box plus a margin", () => {
    expect(planeBounds(POINTS)).toEqual({ minX: -1, maxX: 5, minY: -1, maxY: 4 });
    expect(planeBounds([{ x: 0, y: 0 }])).toEqual({ minX: -1, maxX: 1, minY: -1, maxY: 1 });
    expect(planeBounds([])).toEqual({ minX: -1, maxX: 2, minY: -1, maxY: 2 });
    expect(
      planeBounds([
        { x: 0, y: 0 },
        { x: 100, y: 50 },
      ]),
    ).toEqual({
      minX: -10,
      maxX: 110,
      minY: -5,
      maxY: 55,
    });
  });

  it("draws, restyles in place and erases shapes, keeping draw order", () => {
    const trace = planeTrace();
    const P = plane(trace);
    expect(P.pointStatus).toEqual({ A: "path", B: "unvisited", C: "unvisited" });
    expect(P.annotations).toEqual({ C: "θ=56°" });
    expect(P.shapes).toEqual([
      { kind: "segment", x1: 0, y1: 0, x2: 4, y2: 0, id: "AB", status: "path", label: "base" },
      { kind: "circle", x: 2, y: 3, r: 1.5, id: "r", status: "idle" },
    ]);
    // Before the erase, the box sat between the segment and the circle.
    expect(plane(trace, trace.events.length - 3).shapes.map((s) => s.id)).toEqual([
      "AB",
      "box",
      "r",
    ]);
  });

  it("replays backwards to identical states", () => {
    const trace = planeTrace();
    const player = new TracePlayer(trace);
    const forward = Array.from({ length: trace.events.length + 1 }, (_, i) => player.stateAt(i));
    for (let i = trace.events.length; i >= 0; i--) expect(player.stateAt(i)).toEqual(forward[i]);
  });

  it("validates through JSON", () => {
    const result = validateTrace(JSON.parse(JSON.stringify(planeTrace())));
    expect(result.ok).toBe(true);
  });

  it("rejects unknown points and shapes during replay", () => {
    const state = initialState(planeTrace());
    expect(() =>
      applyEvent(state, { type: "plane.point", s: "P", point: "Z", status: "path" }),
    ).toThrow(TraceReplayError);
    expect(() =>
      applyEvent(state, { type: "plane.annotate", s: "P", point: "Z", text: "x" }),
    ).toThrow(/unknown point/);
    expect(() => applyEvent(state, { type: "plane.erase", s: "P", id: "nope" })).toThrow(
      /unknown shape/,
    );
  });

  it("caps the number of shapes", () => {
    const state = initialState(planeTrace());
    const draw = (i: number) =>
      applyEvent(state, {
        type: "plane.draw",
        s: "P",
        id: `s${i}`,
        shape: { kind: "segment", x1: 0, y1: 0, x2: 1, y2: i },
        status: "idle",
      });
    for (let i = 0; i < MAX_PLANE_SHAPES; i++) draw(i);
    // Replacing an existing shape is still allowed; a new one is not.
    expect(() => draw(0)).not.toThrow();
    expect(() => draw(MAX_PLANE_SHAPES)).toThrow(/already holds/);
  });

  it("rejects malformed geometry, bounds and point data", () => {
    const base = JSON.parse(JSON.stringify(planeTrace())) as Trace;
    const withEvent = (e: unknown) => {
      const t = structuredClone(base) as unknown as {
        events: unknown[];
        meta: { eventCount: number };
      };
      t.events.splice(1, 0, e);
      t.meta.eventCount = t.events.length;
      return validateTrace(t);
    };
    const shape = (g: unknown) => ({
      type: "plane.draw",
      s: "P",
      id: "x",
      shape: g,
      status: "idle",
    });
    expect(withEvent(shape({ kind: "segment", x1: 0, y1: 0, x2: 1, y2: 1 })).ok).toBe(true);
    expect(withEvent(shape({ kind: "segment", x1: 0, y1: 0, x2: 1 })).ok).toBe(false);
    expect(withEvent(shape({ kind: "circle", x: 0, y: 0, r: -1 })).ok).toBe(false);
    expect(withEvent(shape({ kind: "circle", x: 0, y: 0, r: 1, extra: 2 })).ok).toBe(false);
    expect(withEvent(shape({ kind: "polygon", points: [] })).ok).toBe(false);
    expect(withEvent(shape({ kind: "rect", x1: 0, y1: 0, x2: 1, y2: "1" })).ok).toBe(false);
    expect(withEvent({ ...shape({ kind: "rect", x1: 0, y1: 0, x2: 1, y2: 1 }), label: 3 }).ok).toBe(
      false,
    );
    expect(
      withEvent({ ...shape({ kind: "rect", x1: 0, y1: 0, x2: 1, y2: 1 }), status: "on" }).ok,
    ).toBe(false);

    const withPlane = (edit: (p: PlaneStructure) => void) => {
      const t = structuredClone(base);
      edit(t.initial.structures.P as PlaneStructure);
      return validateTrace(t);
    };
    expect(withPlane(() => {}).ok).toBe(true);
    expect(withPlane((p) => (p.bounds.maxX = p.bounds.minX)).ok).toBe(false);
    expect(withPlane((p) => p.points.push({ id: "A", x: 1, y: 1 })).ok).toBe(false);
    expect(withPlane((p) => (p.points[0]!.x = Number.NaN)).ok).toBe(false);
    expect(withPlane((p) => (p.pointStatus.Z = "path")).ok).toBe(false);
    expect(withPlane((p) => (p.annotations.Z = "?")).ok).toBe(false);
    expect(
      withPlane((p) => p.shapes.push({ kind: "circle", x: 0, y: 0, r: 1, id: "c", status: "idle" }))
        .ok,
    ).toBe(true);
    expect(
      withPlane((p) =>
        p.shapes.push({
          kind: "segment",
          x1: 0,
          y1: 0,
          x2: 1,
          y2: 1,
          id: "c",
          status: "nope",
        } as never),
      ).ok,
    ).toBe(false);
    expect(
      withPlane((p) =>
        p.points.push(...Array.from({ length: 501 }, (_, i) => ({ id: `p${i}`, x: i, y: i }))),
      ).ok,
    ).toBe(false);
  });

  it("the SDK refuses to restyle or erase shapes it never drew", () => {
    const t = new Tracer({ id: "x", version: 1 });
    const P = t.plane("P", { points: POINTS });
    expect(() => P.restyle("nope", "path")).toThrow(/unknown shape/);
    expect(() => P.erase("nope")).toThrow(/unknown shape/);
    P.draw("s", { kind: "segment", x1: 0, y1: 0, x2: 1, y2: 1 }, "idle");
    expect(P.has("s")).toBe(true);
    P.erase("s");
    expect(P.has("s")).toBe(false);
  });
});
