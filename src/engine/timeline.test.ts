import { describe, expect, it } from "vitest";
import { TracePlayer } from "./player";
import { MAX_TIMELINE_ITEMS, type Trace } from "./protocol";
import { applyEvent, TraceReplayError } from "./reduce";
import { initialState } from "./state";
import { Tracer } from "./tracer";
import { validateTrace } from "./validate";

const LANES = [{ id: "A", label: "Alice" }, { id: "B" }, { id: "C" }];

function timelineTrace(): Trace {
  const t = new Tracer({ id: "timeline-test", version: 1 });
  const T = t.timeline("T", { lanes: LANES, label: "Processes", horizon: 6 });
  T.lane("A", "current", { line: 1 });
  const m1 = T.send("A", "B", "ping");
  const m2 = T.send("A", "C", "ping");
  T.tick(2);
  T.deliver(m1, "tree", { note: "B hears A" });
  T.lose(m2);
  T.annotate("B", "term 1");
  T.mark("B", "commit");
  const m3 = T.send("B", "A", "pong");
  T.tick(3);
  T.tick(3); // already there: no event
  T.deliver(m3, "back");
  T.lane("C", "unreachable");
  return t.finish(null, null);
}

const timeline = (trace: Trace, at = trace.events.length) => {
  const s = new TracePlayer(trace).stateAt(at).structures.T;
  if (s?.kind !== "timeline") throw new Error("no timeline");
  return s;
};

describe("timeline structures", () => {
  it("records sends, deliveries, losses, marks and lane state against the clock", () => {
    const trace = timelineTrace();
    const T = timeline(trace);
    expect(T.now).toBe(3);
    expect(T.horizon).toBe(6);
    expect(T.messages).toEqual([
      { id: "m0", from: "A", to: "B", label: "ping", sent: 0, received: 2, status: "tree" },
      {
        id: "m1",
        from: "A",
        to: "C",
        label: "ping",
        sent: 0,
        received: 2,
        lost: true,
        status: "rejected",
      },
      { id: "m2", from: "B", to: "A", label: "pong", sent: 2, received: 3, status: "back" },
    ]);
    expect(T.marks).toEqual([{ id: "k0", lane: "B", time: 2, label: "commit" }]);
    expect(T.laneStatus).toEqual({ A: "current", B: "unvisited", C: "unreachable" });
    expect(T.annotations).toEqual({ B: "term 1" });
    // Before the first tick both pings are in flight.
    expect(timeline(trace, 3).messages.map((m) => m.received)).toEqual([null, null]);
  });

  it("replays backwards to identical states and validates through JSON", () => {
    const trace = timelineTrace();
    const player = new TracePlayer(trace);
    const forward = Array.from({ length: trace.events.length + 1 }, (_, i) => player.stateAt(i));
    for (let i = trace.events.length; i >= 0; i--) expect(player.stateAt(i)).toEqual(forward[i]);
    expect(validateTrace(JSON.parse(JSON.stringify(trace))).ok).toBe(true);
  });

  it("rejects time going backwards, double delivery, unknown lanes and duplicates", () => {
    const state = initialState(timelineTrace());
    applyEvent(state, { type: "timeline.tick", s: "T", time: 4 });
    expect(() => applyEvent(state, { type: "timeline.tick", s: "T", time: 4 })).toThrow(
      /does not move/,
    );
    applyEvent(state, { type: "timeline.send", s: "T", id: "x", from: "A", to: "B" });
    expect(() =>
      applyEvent(state, { type: "timeline.send", s: "T", id: "x", from: "A", to: "B" }),
    ).toThrow(/already exists/);
    applyEvent(state, { type: "timeline.deliver", s: "T", id: "x", status: "tree" });
    expect(() => applyEvent(state, { type: "timeline.lose", s: "T", id: "x" })).toThrow(
      /no longer in flight/,
    );
    expect(() =>
      applyEvent(state, { type: "timeline.send", s: "T", id: "y", from: "A", to: "Z" }),
    ).toThrow(TraceReplayError);
    expect(() =>
      applyEvent(state, { type: "timeline.lane", s: "T", lane: "Z", status: "path" }),
    ).toThrow(/unknown lane/);
    expect(() =>
      applyEvent(state, { type: "timeline.deliver", s: "T", id: "nope", status: "tree" }),
    ).toThrow(/unknown message/);
  });

  it("caps messages and marks", () => {
    const state = initialState(timelineTrace());
    for (let i = 0; i < MAX_TIMELINE_ITEMS; i++)
      applyEvent(state, { type: "timeline.mark", s: "T", id: `x${i}`, lane: "A", label: "." });
    expect(() =>
      applyEvent(state, { type: "timeline.send", s: "T", id: "late", from: "A", to: "B" }),
    ).toThrow(/already holds/);
  });

  it("rejects malformed initial timelines", () => {
    const base = JSON.parse(JSON.stringify(timelineTrace())) as Trace;
    const edit = (f: (t: Record<string, unknown>) => void) => {
      const trace = structuredClone(base);
      f(trace.initial.structures.T as unknown as Record<string, unknown>);
      return validateTrace(trace).ok;
    };
    expect(edit(() => {})).toBe(true);
    expect(edit((t) => (t.lanes = []))).toBe(false);
    expect(edit((t) => (t.lanes = [{ id: "A" }, { id: "A" }]))).toBe(false);
    expect(edit((t) => (t.now = -1))).toBe(false);
    expect(edit((t) => (t.horizon = 1.5))).toBe(false);
    expect(edit((t) => (t.laneStatus = { Z: "current" }))).toBe(false);
    expect(
      edit(
        (t) =>
          (t.messages = [{ id: "m", from: "A", to: "B", sent: 3, received: 2, status: "tree" }]),
      ),
    ).toBe(false);
    expect(
      edit(
        (t) =>
          (t.messages = [{ id: "m", from: "A", to: "Q", sent: 0, received: null, status: "tree" }]),
      ),
    ).toBe(false);
    expect(edit((t) => (t.marks = [{ id: "k", lane: "A", time: 0 }]))).toBe(false);
    expect(edit((t) => (t.lanes = Array.from({ length: 17 }, (_, i) => ({ id: `L${i}` }))))).toBe(
      false,
    );
  });

  it("the SDK refuses to deliver a message twice or move time backwards", () => {
    const t = new Tracer({ id: "x", version: 1 });
    const T = t.timeline("T", { lanes: LANES });
    const m = T.send("A", "B");
    T.tick(1);
    T.deliver(m);
    expect(() => T.deliver(m)).toThrow(/not in flight/);
    expect(() => T.lose(m)).toThrow(/not in flight/);
    expect(() => T.tick(0)).toThrow(/before/);
    expect(T.now).toBe(1);
  });
});
