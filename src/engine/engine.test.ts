import { describe, expect, it } from "vitest";
import { TracePlayer } from "./player";
import type { Trace } from "./protocol";
import { applyEvent, TraceReplayError } from "./reduce";
import { initialState } from "./state";
import { Tracer } from "./tracer";
import { validateTrace } from "./validate";

function smallTrace(): Trace {
  const t = new Tracer({ id: "test", version: 1 });
  const A = t.array("A", [3, 1, 2]);
  A.compare(0, 1, { line: 1, vars: { i: 0 } });
  A.swap(0, 1, { line: 2, note: "swap" });
  A.compare(1, 2, { line: 1, vars: { i: 1 } });
  A.swap(1, 2, { line: 2 });
  A.mark([0, 1, 2], "sorted");
  return t.finish([3, 1, 2], A.toArray());
}

describe("reducer", () => {
  it("applies array operations and standard counters", () => {
    const trace = smallTrace();
    const state = initialState(trace);
    trace.events.forEach((e, i) => applyEvent(state, e, i));
    const A = state.structures.A!;
    expect(A.kind).toBe("array");
    if (A.kind !== "array") return;
    expect(A.values).toEqual([1, 2, 3]);
    expect(A.marks).toEqual(["sorted", "sorted", "sorted"]);
    expect(state.counters).toMatchObject({ comparisons: 2, swaps: 2 });
    expect(state.done).toBe(true);
    expect(state.position).toBe(trace.events.length);
  });

  it("keeps the pseudocode line until changed and clears transient notes", () => {
    const trace = smallTrace();
    const state = initialState(trace);
    applyEvent(state, trace.events[0]!, 0);
    applyEvent(state, trace.events[1]!, 1);
    expect(state.line).toBe(2);
    expect(state.note).toBe("swap");
    applyEvent(state, trace.events[2]!, 2);
    expect(state.note).toBeNull();
    expect(state.vars).toEqual({ i: 1 });
    expect(state.focus).toEqual([{ s: "A", tone: "compare", indices: [1, 2] }]);
  });

  it("removes variables set to null", () => {
    const state = initialState({ initial: { structures: {}, order: [], vars: { x: 1, y: 2 } } });
    applyEvent(state, { type: "step", vars: { x: null, z: [1, 2] } });
    expect(state.vars).toEqual({ y: 2, z: [1, 2] });
  });

  it("rejects out-of-range indices with the event index", () => {
    const trace = smallTrace();
    const state = initialState(trace);
    expect(() => applyEvent(state, { type: "array.swap", s: "A", i: 0, j: 7 }, 4)).toThrow(TraceReplayError);
    expect(() => applyEvent(state, { type: "array.swap", s: "A", i: 0, j: 7 }, 4)).toThrow(/event #4/);
  });

  it("rejects events against the wrong structure kind", () => {
    const state = initialState(smallTrace());
    expect(() => applyEvent(state, { type: "seq.push", s: "A", value: 1 })).toThrow(/is a array, expected sequence/);
  });

  it("pops queues from the front and stacks from the back", () => {
    const t = new Tracer({ id: "test", version: 1 });
    const Q = t.sequence("Q", "queue");
    const S = t.sequence("S", "stack");
    for (const v of [1, 2, 3]) {
      Q.push(v);
      S.push(v);
    }
    expect(Q.pop()).toBe(1);
    expect(S.pop()).toBe(3);
    const player = new TracePlayer(t.finish(null, null));
    const final = player.finalState();
    expect(final.structures.Q).toMatchObject({ items: [2, 3] });
    expect(final.structures.S).toMatchObject({ items: [1, 2] });
  });

  it("rejects any event after done", () => {
    const trace = smallTrace();
    const state = initialState(trace);
    trace.events.forEach((e, i) => applyEvent(state, e, i));
    expect(() => applyEvent(state, { type: "step" })).toThrow(/after "done"/);
  });
});

describe("player", () => {
  it("returns identical states whether reached forwards, backwards or by random seeks", () => {
    const t = new Tracer({ id: "test", version: 1 });
    const values = Array.from({ length: 30 }, (_, i) => (i * 17) % 31);
    const A = t.array("A", values);
    // A long trace: a full bubble sort.
    for (let i = 0; i < A.length - 1; i++)
      for (let j = 0; j < A.length - 1 - i; j++) if (A.compare(j, j + 1, { vars: { i, j } }) > 0) A.swap(j, j + 1);
    const trace = t.finish(values, A.toArray());

    const reference = new TracePlayer(trace, { keyframeInterval: 1 });
    const forward = [...Array(reference.length + 1).keys()].map((p) => reference.stateAt(p));

    for (const interval of [3, 16, 50, 10_000]) {
      const player = new TracePlayer(trace, { keyframeInterval: interval });
      for (let p = player.length; p >= 0; p--) expect(player.stateAt(p)).toEqual(forward[p]);
      const seeks = [0, 17, 3, player.length, 250, 249, 251, 1, player.length - 1];
      for (const p of seeks) expect(player.stateAt(p)).toEqual(forward[p]);
    }
  });

  it("clamps positions and returns independent copies", () => {
    const player = new TracePlayer(smallTrace());
    expect(player.stateAt(-5).position).toBe(0);
    expect(player.stateAt(999).position).toBe(player.length);
    const s = player.stateAt(1);
    s.vars.hacked = 1;
    expect(player.stateAt(1).vars.hacked).toBeUndefined();
  });

  it("stores roughly length / interval keyframes", () => {
    const t = new Tracer({ id: "test", version: 1 });
    for (let i = 0; i < 99; i++) t.step({ line: 1 });
    const player = new TracePlayer(t.finish(null, null), { keyframeInterval: 10 });
    expect(player.length).toBe(100);
    expect(player.keyframeCount).toBe(11);
  });
});

describe("tracer", () => {
  it("counts identically in record and count mode", () => {
    const go = (mode: "record" | "count") => {
      const t = new Tracer({ id: "test", version: 1 }, { mode });
      const A = t.array("A", [4, 3, 2, 1]);
      for (let i = 0; i < 3; i++) for (let j = 0; j < 3 - i; j++) if (A.compare(j, j + 1) > 0) A.swap(j, j + 1);
      t.tally("passes", 3);
      return t.finish(null, A.toArray());
    };
    const recorded = go("record");
    const counted = go("count");
    expect(counted.events).toEqual([]);
    expect(counted.meta.counters).toEqual(recorded.meta.counters);
    expect(recorded.meta.counters).toMatchObject({ comparisons: 6, swaps: 6, passes: 3 });
    // Replay reproduces the counters, including custom ones.
    expect(new TracePlayer(recorded).finalState().counters).toEqual(recorded.meta.counters);
  });

  it("evaluates lazy metadata only when recording", () => {
    let calls = 0;
    const t = new Tracer({ id: "test", version: 1 }, { mode: "count" });
    t.array("A", [1, 2]).compare(0, 1, () => {
      calls++;
      return { note: "x" };
    });
    expect(calls).toBe(0);
  });

  it("marks traces explicitly truncated when the event budget runs out", () => {
    const t = new Tracer({ id: "test", version: 1 }, { maxEvents: 10 });
    const A = t.array("A", [5, 4, 3, 2, 1]);
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4 - i; j++) if (A.compare(j, j + 1) > 0) A.swap(j, j + 1);
    const trace = t.finish(null, A.toArray());
    expect(trace.events.length).toBe(10);
    expect(trace.events.at(-1)!.type).toBe("done");
    expect(trace.meta.truncated).toEqual({ afterEvents: 9, reason: expect.stringContaining("event budget of 10") });
    // The algorithm itself still ran to completion.
    expect(trace.result).toEqual([1, 2, 3, 4, 5]);
    expect(trace.meta.counters.comparisons).toBe(10);
    // And the truncated trace is still a valid, replayable trace.
    expect(validateTrace(JSON.parse(JSON.stringify(trace))).ok).toBe(true);
  });

  it("emits structure.create for structures registered mid-run", () => {
    const t = new Tracer({ id: "test", version: 1 });
    const A = t.array("A", [2, 1]);
    A.swap(0, 1);
    const B = t.array("B", [9]);
    B.write(0, 7);
    t.remove("B");
    const trace = t.finish(null, null);
    expect(trace.initial.order).toEqual(["A"]);
    const player = new TracePlayer(trace);
    expect(player.stateAt(2).order).toEqual(["A", "B"]);
    expect(player.stateAt(3).structures.B).toMatchObject({ values: [7] });
    expect(player.finalState().order).toEqual(["A"]);
  });
});

describe("validateTrace", () => {
  const valid = () => JSON.parse(JSON.stringify(smallTrace())) as Record<string, unknown>;

  it("accepts a serialised trace round-trip", () => {
    const result = validateTrace(valid());
    expect(result.ok).toBe(true);
  });

  it.each([
    ["non-object", 42, /JSON object/],
    ["wrong protocol", { ...valid(), protocol: "other" }, /not an ALGORITHMA trace/],
    ["future version", { ...valid(), version: 99 }, /newer than this application supports/],
    ["unknown event type", { ...valid(), events: [{ type: "explode" }] }, /unknown event type/],
    ["unknown event field", { ...valid(), events: [{ type: "step", evil: 1 }] }, /unknown field/],
    ["bad line", { ...valid(), events: [{ type: "step", line: 0 }] }, /positive integer/],
  ])("rejects %s", (_name, input, message) => {
    const result = validateTrace(input);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.join("\n")).toMatch(message);
  });

  it("rejects semantically impossible traces via replay", () => {
    const raw = valid();
    (raw.events as unknown[]).unshift({ type: "array.swap", s: "A", i: 0, j: 99 });
    (raw.meta as { eventCount: number }).eventCount += 1;
    const result = validateTrace(raw);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors[0]).toMatch(/event #0: index 99 out of range/);
  });

  it("rejects a mismatched event count", () => {
    const raw = valid();
    (raw.meta as { eventCount: number }).eventCount = 1;
    expect(validateTrace(raw).ok).toBe(false);
  });

  it("enforces resource limits", () => {
    const raw = valid();
    const A = (raw.initial as { structures: { A: { values: number[]; marks: null[] } } }).structures.A;
    A.values = Array(5000).fill(1);
    A.marks = Array(5000).fill(null);
    const result = validateTrace(raw);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.join()).toMatch(/exceeds 2000 elements/);
  });

  it("never throws on garbage", () => {
    for (const junk of [null, [], "x", { protocol: "algorithma.trace", version: 1 }, { protocol: "algorithma.trace", version: 1, events: [null], initial: {}, meta: {} }]) {
      expect(() => validateTrace(junk)).not.toThrow();
      expect(validateTrace(junk).ok).toBe(false);
    }
  });
});
