import type { EdgeStatus } from "@/engine/protocol";
import type { AlgorithmModule } from "../types";
import { edgeId, toTraceGraph } from "../inputs";
import {
  flowCheck,
  flowFidelity,
  flowInput,
  flowRowHeaders,
  flowsOf,
  reachable,
  residual,
  type FlowInput,
  type FlowOutput,
} from "./flow-common";

/**
 * Dinic's algorithm: repeat (1) a BFS in the residual graph that gives every vertex its
 * distance from s (its level), and (2) a blocking flow found by DFS along edges that go
 * exactly one level deeper, skipping dead-end edges for the rest of the phase. Levels
 * of t strictly increase between phases, so there are at most |V| − 1 phases.
 */
export const dinic: AlgorithmModule<FlowInput, FlowOutput> = {
  id: "dinic",
  version: 1,
  pseudocode: [
    "procedure Dinic(G, s, t)",
    "  flow ← 0",
    "  while a BFS from s in the residual graph reaches t   // level[v] = distance from s",
    "    every vertex starts at its first outgoing residual edge",
    "    while (f ← DFS(s, ∞)) > 0: flow ← flow + f   // a blocking flow",
    "  return flow;  the vertices the last BFS reached form a minimum cut",
    "function DFS(u, f)",
    "  if u = t: return f",
    "  for each residual edge u → v from u's current edge on, with level[v] = level[u] + 1",
    "    d ← DFS(v, min(f, residual capacity of u → v))",
    "    if d > 0: send d along u → v (and allow d back along v → u);  return d",
    "    otherwise this edge is a dead end for the rest of the phase: move u's current edge on",
    "  return 0",
  ],
  input: flowInput,

  run(input, t) {
    const r = residual(input);
    const G = t.graph("G", toTraceGraph(input));
    const F = t.grid("F", input.edges.length, 2, null, {
      label: "Capacity and flow of each edge",
      rowHeaders: flowRowHeaders(input),
      colHeaders: ["capacity", "flow"],
    });
    input.edges.forEach((e, i) => {
      F.write(i, 0, e.weight!, { line: 2 });
      F.write(i, 1, 0, { line: 2 });
    });
    const arcEdge = (a: number) => edgeId(r.edges[a >> 1]!.from, r.edges[a >> 1]!.to);
    const { source: s, sink: sinkV } = input;
    let flow = 0;
    let level = new Map<string, number>();

    const bfs = () => {
      level = new Map([[s, 0]]);
      const queue = [s];
      for (const n of input.nodes) G.annotate(n.id, null, { line: 3 });
      G.annotate(s, "L0", { line: 3 });
      while (queue.length > 0) {
        const u = queue.shift()!;
        for (const a of r.out.get(u)!) {
          const v = r.to[a]!;
          if (r.cap[a]! > 0 && !level.has(v)) {
            level.set(v, level.get(u)! + 1);
            G.annotate(v, `L${level.get(v)}`, { line: 3 });
            queue.push(v);
          }
        }
      }
      return level.has(sinkV);
    };

    const paint = (line: number) => {
      // Saturated edges are drawn as rejected; edges of the level graph as tree edges.
      input.edges.forEach((e, i) => {
        const id = edgeId(e.from, e.to);
        const f = r.cap[2 * i + 1]!;
        const inLevel =
          (r.cap[2 * i]! > 0 && level.get(e.to) === (level.get(e.from) ?? -9) + 1) ||
          (f > 0 && level.get(e.from) === (level.get(e.to) ?? -9) + 1);
        const status: EdgeStatus = inLevel ? "tree" : f === e.weight ? "rejected" : "idle";
        G.edge(id, status, { line });
      });
    };

    let phase = 0;
    while (bfs()) {
      phase++;
      t.tally("phases");
      paint(4);
      t.step({
        line: 4,
        vars: { phase, flow },
        note: `Phase ${phase}: t is at level ${level.get(sinkV)}. Only edges one level deeper (drawn as tree edges) are used.`,
      });
      const current = new Map(input.nodes.map((n) => [n.id, 0]));
      const path: number[] = [];
      const dfs = (u: string, f: number): number => {
        if (u === sinkV) return f;
        const arcs = r.out.get(u)!;
        for (; current.get(u)! < arcs.length; current.set(u, current.get(u)! + 1)) {
          const a = arcs[current.get(u)!]!;
          const v = r.to[a]!;
          if (r.cap[a]! <= 0 || level.get(v) !== level.get(u)! + 1) continue;
          path.push(a);
          const d = dfs(v, Math.min(f, r.cap[a]!));
          if (d > 0) return d;
          path.pop();
        }
        return 0;
      };
      for (;;) {
        path.length = 0;
        const f = dfs(s, Infinity);
        if (f === 0) break;
        t.tally("augmenting paths");
        const names = [s, ...path.map((a) => r.to[a]!)];
        for (const a of path) G.edge(arcEdge(a), a % 2 === 0 ? "path" : "back", { line: 9 });
        t.step({ line: 10, vars: { f }, note: `Augment ${f} along ${names.join(" → ")}.` });
        for (const a of path) {
          r.cap[a] = r.cap[a]! - f;
          r.cap[a ^ 1] = r.cap[a ^ 1]! + f;
          const i = a >> 1;
          F.write(i, 1, r.cap[2 * i + 1]!, { line: 10 });
        }
        flow += f;
        paint(5);
        t.step({ line: 5, vars: { flow } });
      }
    }
    const cut = reachable(r, s);
    for (const n of input.nodes)
      G.node(n.id, cut.includes(n.id) ? "path" : "unvisited", { line: 6 });
    const output: FlowOutput = { maxFlow: flow, flows: flowsOf(r), cut };
    t.finish(input, output, {
      line: 6,
      vars: { phase: null, f: null, flow },
      note: `Maximum flow ${flow}. No residual path reaches ${sinkV}; the highlighted vertices {${cut.join(", ")}} are the source side of a minimum cut.`,
    });
    return output;
  },

  check: flowCheck,
  fidelity: flowFidelity,
  describeOutput: (out) => `Maximum flow ${out.maxFlow}; cut {${out.cut.join(", ")}}`,
};
