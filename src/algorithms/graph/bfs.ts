import type { AlgorithmModule } from "../types";
import type { EdgeStatus } from "@/engine/protocol";
import { adjacency, graphInput, graphPreset, toTraceGraph, type GraphInputValue } from "../inputs";
import { distanceFidelity } from "./common";

export interface BfsOutput {
  /** Hop distance from the source; null when unreachable. */
  dist: Record<string, number | null>;
  parent: Record<string, string | null>;
  /** Vertices in the order they were dequeued. */
  order: string[];
}

const LIMITS = { maxNodes: 26, maxEdges: 60 };
const UNDIRECTED = { directed: false, weighted: false, limits: LIMITS };

export const bfs: AlgorithmModule<GraphInputValue, BfsOutput> = {
  id: "bfs",
  version: 1,
  pseudocode: [
    "procedure BFS(G, s)",
    "  for each vertex v: dist[v] ← ∞",
    "  dist[s] ← 0;  enqueue s into Q",
    "  while Q is not empty",
    "    u ← dequeue(Q)",
    "    for each neighbour v of u",
    "      if dist[v] = ∞",
    "        dist[v] ← dist[u] + 1;  parent[v] ← u",
    "        enqueue v into Q",
    "  return dist, parent",
  ],
  input: graphInput({
    ...UNDIRECTED,
    presets: [
      { id: "small", label: "Small graph", value: graphPreset("A-B, A-C, B-D, C-D, D-E, C-F", "A", UNDIRECTED) },
      {
        id: "grid",
        label: "Grid-like",
        value: graphPreset("A-B, B-C, A-D, B-E, C-F, D-E, E-F, D-G, E-H, F-I, G-H, H-I", "A", UNDIRECTED),
      },
      { id: "disconnected", label: "Disconnected", value: graphPreset("A-B, B-C, C-A, D-E, F", "A", UNDIRECTED) },
      { id: "path", label: "Long path", value: graphPreset("A-B, B-C, C-D, D-E, E-F, F-G", "D", UNDIRECTED) },
    ],
  }),

  run(input, t) {
    const G = t.graph("G", { ...toTraceGraph(input), label: "Graph" });
    const Q = t.sequence("Q", "queue", { label: "Queue" });
    const adj = adjacency(input);
    const dist: Record<string, number | null> = {};
    const parent: Record<string, string | null> = {};
    const edgeState = new Map<string, EdgeStatus>();
    const order: string[] = [];
    for (const n of input.nodes) {
      dist[n.id] = null;
      parent[n.id] = null;
    }
    const s = input.source;

    t.step({ line: 2, note: "Every vertex starts undiscovered, at distance ∞." });
    dist[s] = 0;
    G.annotate(s, "d=0", { line: 3, vars: { s }, note: `The source ${s} is at distance 0.` });
    G.node(s, "frontier", { line: 3 });
    Q.push(s, { line: 3, note: `Enqueue ${s}.` });

    while (Q.size > 0) {
      const u = Q.peekAll()[0] as string;
      Q.pop({ line: 5, vars: { u, v: null }, note: `Dequeue ${u} (distance ${dist[u]}).` });
      G.node(u, "current", { line: 6, note: `Scan the neighbours of ${u}.` });
      order.push(u);
      for (const { to: v, edge } of adj.get(u)!) {
        if (dist[v] === null) {
          G.edge(edge, "examining", { line: 7, vars: { v }, note: `${v} is undiscovered.` });
          dist[v] = dist[u]! + 1;
          parent[v] = u;
          edgeState.set(edge, "tree");
          G.edge(edge, "tree", { line: 8, note: `Set dist[${v}] = ${dist[v]} and parent[${v}] = ${u}.` });
          G.annotate(v, `d=${dist[v]}`, { line: 8 });
          G.node(v, "frontier", { line: 9 });
          Q.push(v, { line: 9, note: `Enqueue ${v}.` });
        } else if (edgeState.get(edge) !== "tree") {
          edgeState.set(edge, "rejected");
          G.edge(edge, "rejected", {
            line: 7,
            vars: { v },
            note: `${v} was already discovered at distance ${dist[v]}; skip it.`,
          });
        } else {
          t.step({ line: 7, vars: { v }, note: `${v} is ${u}'s BFS-tree neighbour and already discovered.` });
        }
      }
      G.node(u, "visited", { line: 4, vars: { v: null }, note: `Finished ${u}.` });
    }

    for (const n of input.nodes) {
      if (dist[n.id] === null) {
        G.node(n.id, "unreachable", { line: 10, note: `${n.id} is unreachable from ${s}.` });
        G.annotate(n.id, "d=∞", { line: 10 });
      }
    }
    const output: BfsOutput = { dist, parent, order };
    t.finish(input, output, { line: 10, vars: { u: null, v: null }, note: "The queue is empty: BFS is complete." });
    return output;
  },

  check(input, out) {
    // Independent oracle: unit-weight Bellman–Ford style relaxation to a fixpoint.
    const expected: Record<string, number> = {};
    for (const n of input.nodes) expected[n.id] = Infinity;
    expected[input.source] = 0;
    for (let changed = true; changed; ) {
      changed = false;
      for (const e of input.edges) {
        const pairs = input.directed ? [[e.from, e.to]] : [[e.from, e.to], [e.to, e.from]];
        for (const [a, b] of pairs) {
          if (expected[a!]! + 1 < expected[b!]!) {
            expected[b!] = expected[a!]! + 1;
            changed = true;
          }
        }
      }
    }
    const neighbours = (a: string, b: string) =>
      input.edges.some((e) => (e.from === a && e.to === b) || (!input.directed && e.from === b && e.to === a));
    for (const n of input.nodes) {
      const want = expected[n.id] === Infinity ? null : expected[n.id]!;
      if (out.dist[n.id] !== want) return `dist[${n.id}] = ${out.dist[n.id]}, expected ${want}`;
      const p = out.parent[n.id];
      if (want === null || n.id === input.source) {
        if (p !== null) return `parent[${n.id}] should be null`;
      } else if (p == null || !neighbours(p, n.id) || out.dist[p] !== want - 1) {
        return `parent[${n.id}] = ${p} is not a valid BFS-tree parent`;
      }
    }
    for (let i = 1; i < out.order.length; i++) {
      if (out.dist[out.order[i]!]! < out.dist[out.order[i - 1]!]!) return "dequeue order is not by non-decreasing distance";
    }
    return null;
  },

  fidelity: distanceFidelity("G", (out: BfsOutput) => out.dist),
  describeOutput: (out) =>
    Object.entries(out.dist)
      .map(([v, d]) => `${v}: ${d === null ? "∞" : d}`)
      .join(", "),
};
