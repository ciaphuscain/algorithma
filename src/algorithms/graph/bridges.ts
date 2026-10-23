import type { TraceState } from "@/engine/state";
import type { AlgorithmModule } from "../types";
import { adjacency, graphInput, graphPreset, toTraceGraph, type GraphInputValue } from "../inputs";

export interface CutOutput {
  /** Bridges as [from, to] in input orientation, in the order found. */
  bridges: [string, string][];
  /** Articulation points (cut vertices), sorted by id. */
  articulation: string[];
}

const LIMITS = { maxNodes: 16, maxEdges: 40 };
const UNDIRECTED = { directed: false, weighted: false, limits: LIMITS, withSource: false };

/**
 * Bridges and articulation points by one DFS per component (Hopcroft–Tarjan): low[v]
 * is the earliest discovery time reachable from v's subtree using at most one back
 * edge. A tree edge u–v is a bridge when low[v] > disc[u]; a non-root u is a cut
 * vertex when some child has low ≥ disc[u]; the root when it has two or more children.
 */
export const bridges: AlgorithmModule<GraphInputValue, CutOutput> = {
  id: "bridges-articulation",
  version: 1,
  pseudocode: [
    "for each undiscovered vertex r, in id order: dfs(r, none)",
    "procedure dfs(u, parent)",
    "  disc[u] ← low[u] ← time;  time ← time + 1;  children ← 0",
    "  for each neighbour v of u",
    "    if v is undiscovered",
    "      children ← children + 1;  dfs(v, u);  low[u] ← min(low[u], low[v])",
    "      if low[v] > disc[u]: the edge u–v is a bridge",
    "      if parent ≠ none and low[v] ≥ disc[u]: u is an articulation point",
    "    else if v ≠ parent: low[u] ← min(low[u], disc[v])   // back edge",
    "  if parent = none and children ≥ 2: u is an articulation point",
  ],
  input: graphInput({
    ...UNDIRECTED,
    presets: [
      {
        id: "classic",
        label: "Two cycles joined by a path",
        value: graphPreset("A-B, B-C, C-A, C-D, D-E, E-F, F-G, G-E", "", UNDIRECTED),
      },
      {
        id: "tree",
        label: "A tree (every edge is a bridge)",
        value: graphPreset("A-B, A-C, B-D, B-E", "", UNDIRECTED),
      },
      {
        id: "cycle",
        label: "A cycle (nothing to cut)",
        value: graphPreset("A-B, B-C, C-D, D-A", "", UNDIRECTED),
      },
    ],
  }),

  run(input, t) {
    const G = t.graph("G", { ...toTraceGraph(input), label: "Graph" });
    const adj = adjacency(input);
    const disc = new Map<string, number>();
    const low = new Map<string, number>();
    const found: [string, string][] = [];
    const cut = new Set<string>();
    let time = 0;
    const show = (u: string, line: number) =>
      G.annotate(u, `${disc.get(u)}/${low.get(u)}`, { line });
    const orient = (a: string, b: string): [string, string] =>
      input.edges.some((e) => e.from === a && e.to === b) ? [a, b] : [b, a];

    const dfs = (u: string, parent: string | null) => {
      disc.set(u, time);
      low.set(u, time);
      time++;
      let children = 0;
      G.node(u, "current", {
        line: 3,
        vars: { u, parent, time },
        note: `Discover ${u} at time ${disc.get(u)} (shown as disc/low).`,
      });
      show(u, 3);
      for (const { to: v, edge } of adj.get(u)!) {
        if (!disc.has(v)) {
          children++;
          G.edge(edge, "tree", { line: 6, vars: { v } });
          G.node(u, "frontier", { line: 6 });
          dfs(v, u);
          G.node(u, "current", { line: 6, vars: { u, v, parent } });
          if (low.get(v)! < low.get(u)!) {
            low.set(u, low.get(v)!);
            show(u, 6);
          }
          if (low.get(v)! > disc.get(u)!) {
            found.push(orient(u, v));
            G.edge(edge, "highlight", {
              line: 7,
              note: `low[${v}] = ${low.get(v)} > disc[${u}] = ${disc.get(u)}: nothing below ${v} reaches ${u} or above except through ${u}–${v}. It is a bridge.`,
            });
          }
          if (parent !== null && low.get(v)! >= disc.get(u)! && !cut.has(u)) {
            cut.add(u);
            t.step({
              line: 8,
              note: `low[${v}] = ${low.get(v)} ≥ disc[${u}] = ${disc.get(u)}: removing ${u} would cut ${v}'s subtree off. ${u} is an articulation point.`,
            });
          }
        } else if (v !== parent) {
          if (disc.get(v)! < disc.get(u)!) {
            G.edge(edge, "back", {
              line: 9,
              vars: { v },
              note: `${u}–${v} is a back edge to an earlier vertex.`,
            });
          }
          if (disc.get(v)! < low.get(u)!) {
            low.set(u, disc.get(v)!);
            show(u, 9);
          }
        }
      }
      if (parent === null && children >= 2 && !cut.has(u)) {
        cut.add(u);
        t.step({
          line: 10,
          note: `${u} is a root with ${children} DFS children; they are joined only through ${u}, so it is an articulation point.`,
        });
      }
      G.node(u, cut.has(u) ? "highlight" : "visited", { line: 10 });
    };

    for (const r of input.nodes.map((n) => n.id).sort()) {
      if (!disc.has(r)) {
        t.step({ line: 1, vars: { u: r }, note: `${r} is undiscovered: start a search there.` });
        dfs(r, null);
      }
    }
    const output: CutOutput = { bridges: found, articulation: [...cut].sort() };
    t.finish(input, output, {
      vars: { u: null, v: null, parent: null },
      note: `${found.length} bridge${found.length === 1 ? "" : "s"} and ${cut.size} articulation point${cut.size === 1 ? "" : "s"} (both highlighted).`,
    });
    return output;
  },

  check(input, out) {
    // Independent oracle: delete each edge or vertex and count components.
    const count = (skipEdge: number, skipVertex: string | null) => {
      const ids = input.nodes.map((n) => n.id).filter((v) => v !== skipVertex);
      const label = new Map(ids.map((v) => [v, v]));
      input.edges.forEach((e, k) => {
        if (k === skipEdge || e.from === skipVertex || e.to === skipVertex) return;
        const [a, b] = [label.get(e.from)!, label.get(e.to)!];
        if (a !== b) for (const [v, l] of label) if (l === b) label.set(v, a);
      });
      return new Set(label.values()).size;
    };
    const base = count(-1, null);
    const wantBridges = input.edges
      .filter((_, k) => count(k, null) > base)
      .map((e) => `${e.from}-${e.to}`)
      .sort();
    const gotBridges = out.bridges.map(([a, b]) => `${a}-${b}`).sort();
    if (JSON.stringify(wantBridges) !== JSON.stringify(gotBridges))
      return `bridges ${gotBridges}, expected ${wantBridges}`;
    const wantCut = input.nodes
      .map((n) => n.id)
      .filter((v) => count(-1, v) > base)
      .sort();
    return JSON.stringify(wantCut) === JSON.stringify(out.articulation)
      ? null
      : `articulation points ${out.articulation}, expected ${wantCut}`;
  },

  fidelity(state: TraceState, out) {
    const g = state.structures.G;
    if (g?.kind !== "graph") return "no graph G";
    const marked = g.edges.filter((e) => g.edgeStatus[e.id] === "highlight").length;
    if (marked !== out.bridges.length)
      return `${marked} edges highlighted, expected ${out.bridges.length}`;
    const cut = g.nodes
      .filter((n) => g.nodeStatus[n.id] === "highlight")
      .map((n) => n.id)
      .sort();
    return JSON.stringify(cut) === JSON.stringify(out.articulation) ? null : `highlighted ${cut}`;
  },

  describeOutput: (out) =>
    `Bridges: ${out.bridges.map(([a, b]) => `${a}–${b}`).join(", ") || "none"}; articulation points: ${out.articulation.join(", ") || "none"}`,
};
