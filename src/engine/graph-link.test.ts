import { describe, expect, it } from "vitest";
import { TracePlayer } from "./player";
import { MAX_GRAPH_EDGES, type Trace } from "./protocol";
import { applyEvent, TraceReplayError } from "./reduce";
import { initialState } from "./state";
import { Tracer } from "./tracer";
import { validateTrace } from "./validate";

const NODES = ["a", "b", "c"].map((id, i) => ({ id, x: i / 2, y: 0.5 }));

/** A three-node list a → b → c, reversed by re-pointing its edges. */
function listTrace(): Trace {
  const t = new Tracer({ id: "link-test", version: 1 });
  const G = t.graph("L", {
    directed: true,
    nodes: NODES,
    edges: [{ id: "a>b", from: "a", to: "b" }],
  });
  G.link("b>c", "b", "c", "idle", { line: 1 });
  G.unlink("a>b", { line: 2 });
  G.link("b>a", "b", "a", "tree", { line: 2 });
  G.unlink("b>c", { line: 3 });
  G.link("c>b", "c", "b", "tree", { line: 3 });
  return t.finish(null, null);
}

const graph = (trace: Trace, at = trace.events.length) => {
  const s = new TracePlayer(trace).stateAt(at).structures.L;
  if (s?.kind !== "graph") throw new Error("no graph");
  return s;
};

describe("graph.link and graph.unlink", () => {
  it("add and remove edges, and count each as a write", () => {
    const trace = listTrace();
    expect(
      graph(trace)
        .edges.map((e) => e.id)
        .sort(),
    ).toEqual(["b>a", "c>b"]);
    expect(graph(trace).edgeStatus).toEqual({ "b>a": "tree", "c>b": "tree" });
    expect(graph(trace, 1).edges.map((e) => e.id)).toEqual(["a>b", "b>c"]);
    expect(trace.meta.counters.writes).toBe(5);
    // Replay derives the same count from the events.
    expect(new TracePlayer(trace).finalState().counters.writes).toBe(5);
  });

  it("step backwards to the same edges as stepping forwards", () => {
    const trace = listTrace();
    const player = new TracePlayer(trace);
    const forward = Array.from({ length: player.length + 1 }, (_, p) =>
      JSON.stringify(player.stateAt(p).structures.L),
    );
    for (let p = player.length; p >= 0; p--)
      expect(JSON.stringify(player.stateAt(p).structures.L)).toBe(forward[p]);
  });

  it("validate through JSON", () => {
    expect(validateTrace(JSON.parse(JSON.stringify(listTrace()))).ok).toBe(true);
  });

  it("reject unknown nodes, duplicate ids and unknown edges during replay", () => {
    const state = initialState(listTrace());
    expect(() =>
      applyEvent(state, {
        type: "graph.link",
        s: "L",
        id: "x",
        from: "a",
        to: "z",
        status: "idle",
      }),
    ).toThrow(/unknown node "z"/);
    expect(() =>
      applyEvent(state, {
        type: "graph.link",
        s: "L",
        id: "a>b",
        from: "a",
        to: "c",
        status: "idle",
      }),
    ).toThrow(/already exists/);
    expect(() => applyEvent(state, { type: "graph.unlink", s: "L", id: "nope" })).toThrow(
      TraceReplayError,
    );
  });

  it("cap the number of edges", () => {
    const state = initialState(listTrace());
    const g = state.structures.L;
    if (g?.kind !== "graph") throw new Error("no graph");
    for (let i = g.edges.length; i < MAX_GRAPH_EDGES; i++)
      applyEvent(state, {
        type: "graph.link",
        s: "L",
        id: `e${i}`,
        from: "a",
        to: "b",
        status: "idle",
      });
    expect(() =>
      applyEvent(state, {
        type: "graph.link",
        s: "L",
        id: "one-too-many",
        from: "a",
        to: "b",
        status: "idle",
      }),
    ).toThrow(/would exceed/);
  });

  it("reject malformed events in untrusted traces", () => {
    const bad = JSON.parse(JSON.stringify(listTrace()));
    bad.events[1].to = 7;
    const result = validateTrace(bad);
    expect(result.ok).toBe(false);
  });
});
