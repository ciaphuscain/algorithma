import type { EdgeStatus } from "@/engine/protocol";
import type { AlgorithmModule } from "../types";
import {
  adjacency,
  edgeId,
  graphInput,
  graphPreset,
  toTraceGraph,
  type GraphInputValue,
} from "../inputs";
import { distanceFidelity } from "./common";

export interface DijkstraOutput {
  dist: Record<string, number | null>;
  parent: Record<string, string | null>;
  /** Vertices in the order they were settled. */
  settled: string[];
}

const LIMITS = { maxNodes: 20, maxEdges: 50, minWeight: 0, maxWeight: 99 };
const WEIGHTED = { directed: false, weighted: true, limits: LIMITS };

const entry = (v: string, d: number) => `${v}:${d}`;

/**
 * Dijkstra's algorithm with a binary-heap-style priority queue and lazy deletion:
 * an improved distance is inserted as a new entry, and stale entries are skipped
 * when extracted. The queue is drawn as an unordered list of "vertex:distance"
 * entries; extract-min picks the smallest (ties by vertex id, for determinism).
 */
export const dijkstra: AlgorithmModule<GraphInputValue, DijkstraOutput> = {
  id: "dijkstra",
  version: 1,
  pseudocode: [
    "procedure Dijkstra(G, s)",
    "  dist[v] ← ∞ for every v;  dist[s] ← 0",
    "  insert (s, 0) into PQ",
    "  while PQ is not empty",
    "    (u, d) ← extract-min(PQ)",
    "    if d > dist[u]: continue   // stale entry",
    "    for each edge (u, v) with weight w",
    "      if dist[u] + w < dist[v]",
    "        dist[v] ← dist[u] + w;  parent[v] ← u",
    "        insert (v, dist[v]) into PQ",
    "  return dist, parent",
  ],
  input: graphInput({
    ...WEIGHTED,
    presets: [
      {
        id: "classic",
        label: "Small road map",
        value: graphPreset(
          "A-B:4, A-C:2, B-C:1, B-D:5, C-D:8, C-E:10, D-E:2, D-F:6, E-F:3",
          "A",
          WEIGHTED,
        ),
      },
      {
        id: "greedy-trap",
        label: "Fewer edges is not shorter",
        value: graphPreset("S-T:10, S-A:1, A-B:1, B-T:1", "S", WEIGHTED),
      },
      {
        id: "zero",
        label: "Zero-weight edges",
        value: graphPreset("A-B:0, B-C:3, A-C:3, C-D:0", "A", WEIGHTED),
      },
      {
        id: "disconnected",
        label: "Disconnected",
        value: graphPreset("A-B:2, B-C:2, D-E:1", "A", WEIGHTED),
      },
    ],
  }),

  run(input, t) {
    const G = t.graph("G", { ...toTraceGraph(input), label: "Graph" });
    const PQ = t.sequence("PQ", "priority", { label: "Priority queue (vertex:distance)" });
    const adj = adjacency(input);
    const dist: Record<string, number | null> = {};
    const parent: Record<string, string | null> = {};
    const settled: string[] = [];
    const done = new Set<string>();
    const edgeState = new Map<string, EdgeStatus>();
    const pq: { v: string; d: number }[] = [];
    for (const n of input.nodes) {
      dist[n.id] = null;
      parent[n.id] = null;
    }
    const s = input.source;

    dist[s] = 0;
    t.step({
      line: 2,
      vars: { s },
      note: "Every distance starts at ∞ except the source, which is 0.",
    });
    G.annotate(s, "d=0", { line: 2 });
    pq.push({ v: s, d: 0 });
    PQ.push(entry(s, 0), { line: 3, note: `Insert ${entry(s, 0)}.` });
    G.node(s, "frontier", { line: 3 });

    while (pq.length > 0) {
      let best = 0;
      for (let i = 1; i < pq.length; i++) {
        const a = pq[i]!;
        const b = pq[best]!;
        if (a.d < b.d || (a.d === b.d && a.v < b.v)) best = i;
      }
      const { v: u, d } = pq.splice(best, 1)[0]!;
      t.tally("extractions");
      PQ.popAt(best, {
        line: 5,
        vars: { u, d, v: null },
        note: `Extract the smallest entry, ${entry(u, d)}.`,
      });
      if (done.has(u)) {
        t.step({
          line: 6,
          note: `${u} was already settled with distance ${dist[u]}; this entry is stale. Skip it.`,
        });
        continue;
      }
      done.add(u);
      settled.push(u);
      G.node(u, "current", {
        line: 6,
        note: `${u} is settled: no path to ${u} can be shorter than ${d}, because every other route goes through an entry with distance ≥ ${d} and weights are non-negative.`,
      });
      for (const { to: v, edge, weight: w } of adj.get(u)!) {
        if (done.has(v)) continue;
        const candidate = d + w;
        const current = dist[v] ?? null;
        t.tally("edge checks");
        G.edge(edge, "examining", {
          line: 8,
          vars: { v, w },
          note: `Edge ${u}–${v} (weight ${w}): is ${d} + ${w} = ${candidate} < dist[${v}] = ${current ?? "∞"}?`,
        });
        if (current === null || candidate < current) {
          const old = parent[v];
          if (old !== null) {
            const oldEdge = input.edges.find(
              (e) => (e.from === old && e.to === v) || (e.from === v && e.to === old),
            )!;
            const id = edgeId(oldEdge.from, oldEdge.to);
            edgeState.set(id, "rejected");
            G.edge(id, "rejected", {
              line: 9,
              note: `The old route to ${v} via ${old} is no longer the best.`,
            });
          }
          dist[v] = candidate;
          parent[v] = u;
          edgeState.set(edge, "relaxed");
          t.tally("relaxations");
          G.edge(edge, "relaxed", {
            line: 9,
            note: `Yes: relax the edge. dist[${v}] = ${candidate}, parent[${v}] = ${u}.`,
          });
          G.annotate(v, `d=${candidate}`, { line: 9 });
          G.node(v, "frontier", { line: 10 });
          pq.push({ v, d: candidate });
          PQ.push(entry(v, candidate), { line: 10, note: `Insert ${entry(v, candidate)}.` });
        } else {
          G.edge(edge, edgeState.get(edge) === "relaxed" ? "relaxed" : "rejected", {
            line: 8,
            note: `No: ${candidate} ≥ ${current}. Keep the current distance.`,
          });
        }
      }
      G.node(u, "visited", { line: 4, vars: { v: null, w: null } });
    }

    // Final shortest-path tree.
    for (const n of input.nodes) {
      const p = parent[n.id];
      if (p !== null) {
        const e = input.edges.find(
          (x) => (x.from === p && x.to === n.id) || (x.from === n.id && x.to === p),
        )!;
        G.edge(edgeId(e.from, e.to), "tree", { line: 11 });
      } else if (dist[n.id] === null) {
        G.node(n.id, "unreachable", { line: 11, note: `${n.id} is unreachable from ${s}.` });
        G.annotate(n.id, "d=∞", { line: 11 });
      }
    }
    const output: DijkstraOutput = { dist, parent, settled };
    t.finish(input, output, {
      line: 11,
      vars: { u: null, d: null },
      note: "The queue is empty. Highlighted edges form the shortest-path tree.",
    });
    return output;
  },

  check(input, out) {
    // Independent oracle: Bellman–Ford (|V| − 1 rounds of relaxing every edge in both directions).
    const best: Record<string, number> = {};
    for (const n of input.nodes) best[n.id] = Infinity;
    best[input.source] = 0;
    for (let round = 0; round < input.nodes.length - 1; round++) {
      for (const e of input.edges) {
        const w = e.weight ?? 1;
        if (best[e.from]! + w < best[e.to]!) best[e.to] = best[e.from]! + w;
        if (best[e.to]! + w < best[e.from]!) best[e.from] = best[e.to]! + w;
      }
    }
    for (const n of input.nodes) {
      const want = best[n.id] === Infinity ? null : best[n.id]!;
      if (out.dist[n.id] !== want) return `dist[${n.id}] = ${out.dist[n.id]}, expected ${want}`;
      const p = out.parent[n.id];
      if (p === null || p === undefined) {
        if (want !== null && n.id !== input.source) return `${n.id} has no parent`;
        continue;
      }
      const e = input.edges.find(
        (x) => (x.from === p && x.to === n.id) || (x.from === n.id && x.to === p),
      );
      if (!e || out.dist[p]! + (e.weight ?? 1) !== want)
        return `parent[${n.id}] = ${p} is not on a shortest path`;
    }
    return null;
  },

  fidelity: distanceFidelity("G", (out: DijkstraOutput) => out.dist),
  describeOutput: (out) =>
    Object.entries(out.dist)
      .map(([v, d]) => `${v}: ${d === null ? "∞" : d}`)
      .join(", "),
};
