import type { EdgeStatus } from "@/engine/protocol";
import type { AlgorithmModule } from "../types";
import {
  clamp,
  edgeId,
  graphInput,
  graphPreset,
  randomGraph,
  toTraceGraph,
  type GraphInputValue,
} from "../inputs";
import { distanceFidelity } from "./common";

export interface BellmanFordOutput {
  /** Distances after the relaxation rounds; meaningless where a negative cycle interferes. */
  dist: Record<string, number | null>;
  parent: Record<string, string | null>;
  /** True when a negative cycle is reachable from the source. */
  negativeCycle: boolean;
  /** Relaxation rounds actually performed (at most |V| − 1). */
  rounds: number;
}

const LIMITS = { maxNodes: 12, maxEdges: 30, minWeight: -99, maxWeight: 99 };
const DIRECTED = { directed: true, weighted: true, limits: LIMITS };

const spec = graphInput({
  ...DIRECTED,
  presets: [
    {
      id: "negative",
      label: "Negative edges, no negative cycle",
      value: graphPreset("S->A:4, S->B:5, A->C:-2, B->A:-3, B->C:4, C->D:3, B->D:7", "S", DIRECTED),
    },
    {
      id: "cycle",
      label: "Negative cycle",
      value: graphPreset("S->A:1, A->B:2, B->C:-4, C->A:1, C->D:2", "S", DIRECTED),
    },
    {
      id: "chain",
      label: "Edges listed against the path",
      value: graphPreset("C->D:1, B->C:1, A->B:1, S->A:1", "S", DIRECTED),
    },
  ],
});

/**
 * Bellman–Ford: |V| − 1 rounds that relax every edge in input order, stopping early
 * when a round changes nothing, then one more pass to detect a negative cycle
 * reachable from the source.
 */
export const bellmanFord: AlgorithmModule<GraphInputValue, BellmanFordOutput> = {
  id: "bellman-ford",
  version: 1,
  pseudocode: [
    "procedure BellmanFord(G, s)",
    "  dist[v] ← ∞ for every v;  dist[s] ← 0",
    "  repeat |V| − 1 times",
    "    for each edge (u, v) with weight w",
    "      if dist[u] + w < dist[v]",
    "        dist[v] ← dist[u] + w;  parent[v] ← u",
    "    if no distance changed in this round: stop early",
    "  for each edge (u, v) with weight w",
    "    if dist[u] + w < dist[v]: a negative cycle is reachable",
    "  return dist, parent",
  ],
  input: {
    ...spec,
    // Random graphs include negative weights, so some contain negative cycles.
    random: (rng, size) => {
      const nodes = clamp(size ?? 6, 2, LIMITS.maxNodes);
      return randomGraph(rng, {
        directed: true,
        weighted: true,
        nodes,
        extraEdges: Math.min(nodes, LIMITS.maxEdges - nodes + 1),
        minWeight: -3,
        maxWeight: 9,
      });
    },
  },

  run(input, t) {
    const G = t.graph("G", { ...toTraceGraph(input), label: "Graph" });
    const dist: Record<string, number | null> = {};
    const parent: Record<string, string | null> = {};
    for (const n of input.nodes) {
      dist[n.id] = null;
      parent[n.id] = null;
    }
    const s = input.source;
    dist[s] = 0;
    G.annotate(s, "d=0", {
      line: 2,
      vars: { s },
      note: "Every distance starts at ∞ except the source, which is 0.",
    });
    G.node(s, "current", { line: 2 });

    const edges = input.edges.map((e) => ({ ...e, w: e.weight ?? 1, id: edgeId(e.from, e.to) }));
    const status = new Map<string, EdgeStatus>(edges.map((e) => [e.id, "idle"]));
    const setStatus = (id: string, st: EdgeStatus, line: number) => {
      if (status.get(id) === st) return;
      status.set(id, st);
      G.edge(id, st, { line });
    };

    let rounds = 0;
    const n = input.nodes.length;
    for (let round = 1; round <= n - 1; round++) {
      rounds = round;
      let changed = false;
      t.step({
        line: 3,
        vars: { round, u: null, v: null, w: null },
        note: `Round ${round} of at most ${n - 1}: relax every edge once.`,
      });
      for (const e of edges) {
        const du = dist[e.from] ?? null;
        t.tally("edge checks");
        if (du === null) {
          t.step({
            line: 5,
            vars: { u: e.from, v: e.to, w: e.w },
            note: `${e.from} is not reached yet (∞), so ${e.from}→${e.to} cannot help.`,
          });
          continue;
        }
        const cand = du + e.w;
        const dv = dist[e.to] ?? null;
        G.edge(e.id, "examining", {
          line: 5,
          vars: { u: e.from, v: e.to, w: e.w },
          note: `${e.from}→${e.to}: is ${du} + ${e.w} = ${cand} < dist[${e.to}] = ${dv ?? "∞"}?`,
        });
        if (dv === null || cand < dv) {
          const old = parent[e.to];
          if (old !== null && old !== undefined) setStatus(edgeId(old, e.to), "idle", 6);
          dist[e.to] = cand;
          parent[e.to] = e.from;
          changed = true;
          t.tally("relaxations");
          status.set(e.id, "relaxed");
          G.edge(e.id, "relaxed", {
            line: 6,
            note: `Yes: dist[${e.to}] = ${cand}, parent[${e.to}] = ${e.from}.`,
          });
          G.annotate(e.to, `d=${cand}`, { line: 6 });
          G.node(e.to, "visited", { line: 6 });
        } else {
          G.edge(e.id, status.get(e.id)!, {
            line: 5,
            note: `No: ${cand} ≥ ${dv}.`,
          });
        }
      }
      if (!changed) {
        t.step({
          line: 7,
          vars: { u: null, v: null, w: null },
          note: `Nothing changed in round ${round}, so no later round can change anything: stop early.`,
        });
        break;
      }
    }

    let negativeCycle = false;
    t.step({
      line: 8,
      vars: { round: null, u: null, v: null, w: null },
      note: "Check pass: after |V| − 1 rounds, any edge that can still be relaxed proves a negative cycle.",
    });
    for (const e of edges) {
      const du = dist[e.from] ?? null;
      const dv = dist[e.to] ?? null;
      if (du === null) continue;
      t.tally("edge checks");
      if (dv === null || du + e.w < dv) {
        negativeCycle = true;
        status.set(e.id, "back");
        G.edge(e.id, "back", {
          line: 9,
          vars: { u: e.from, v: e.to, w: e.w },
          note: `${e.from}→${e.to} can still be relaxed (${du} + ${e.w} < ${dv ?? "∞"}): a negative cycle is reachable from ${s}, so shortest distances are undefined.`,
        });
        break;
      }
    }

    G.node(s, "visited", { line: 10 });
    if (!negativeCycle) {
      for (const e of edges) if (parent[e.to] === e.from) setStatus(e.id, "tree", 10);
    }
    for (const node of input.nodes) {
      if (dist[node.id] === null) {
        G.node(node.id, "unreachable", { line: 10 });
        G.annotate(node.id, "d=∞", { line: 10 });
      }
    }
    const output: BellmanFordOutput = { dist, parent, negativeCycle, rounds };
    t.finish(input, output, {
      line: 10,
      vars: { round: null, u: null, v: null, w: null },
      note: negativeCycle
        ? "A negative cycle is reachable: there is no shortest path to the vertices it affects."
        : `Done after ${rounds} round${rounds === 1 ? "" : "s"}. Highlighted edges form the shortest-path tree.`,
    });
    return output;
  },

  check(input, out) {
    // Independent oracle: Floyd–Warshall on the whole graph.
    const ids = input.nodes.map((n) => n.id);
    const ix = new Map(ids.map((v, i) => [v, i]));
    const d = ids.map((_, i) => ids.map((_, j) => (i === j ? 0 : Infinity)));
    for (const e of input.edges) {
      const [a, b] = [ix.get(e.from)!, ix.get(e.to)!];
      d[a]![b] = Math.min(d[a]![b]!, e.weight ?? 1);
    }
    for (let k = 0; k < ids.length; k++)
      for (let i = 0; i < ids.length; i++)
        for (let j = 0; j < ids.length; j++)
          if (d[i]![k]! + d[k]![j]! < d[i]![j]!) d[i]![j] = d[i]![k]! + d[k]![j]!;
    const s = ix.get(input.source)!;
    const cycle = ids.some((_, v) => d[s]![v]! < Infinity && d[v]![v]! < 0);
    if (out.negativeCycle !== cycle)
      return `negativeCycle = ${out.negativeCycle}, expected ${cycle}`;
    if (out.rounds < 1 && ids.length > 1) return "no rounds were run";
    if (out.rounds > ids.length - 1 && ids.length > 1) return `${out.rounds} rounds is too many`;
    if (cycle) return null;
    for (const v of ids) {
      const want = d[s]![ix.get(v)!]! === Infinity ? null : d[s]![ix.get(v)!]!;
      if (out.dist[v] !== want) return `dist[${v}] = ${out.dist[v]}, expected ${want}`;
      const p = out.parent[v];
      if (p === null || p === undefined) {
        if (want !== null && v !== input.source) return `${v} has no parent`;
        continue;
      }
      const e = input.edges.find((x) => x.from === p && x.to === v);
      if (!e || out.dist[p]! + (e.weight ?? 1) !== want) return `parent[${v}] = ${p} is wrong`;
    }
    return null;
  },

  fidelity: distanceFidelity("G", (out: BellmanFordOutput) => out.dist),
  describeOutput: (out) =>
    out.negativeCycle
      ? "A negative cycle is reachable from the source: shortest distances are undefined."
      : Object.entries(out.dist)
          .map(([v, d]) => `${v}: ${d === null ? "∞" : d}`)
          .join(", "),
};
