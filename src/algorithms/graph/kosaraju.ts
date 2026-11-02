import type { TraceState } from "@/engine/state";
import type { AlgorithmModule } from "../types";
import {
  adjacency,
  edgeId,
  graphInput,
  graphPreset,
  toTraceGraph,
  type GraphInputValue,
} from "../inputs";
import { sccCheck, type SccOutput } from "./common";

const LIMITS = { maxNodes: 16, maxEdges: 40 };
const DIRECTED = { directed: true, weighted: false, limits: LIMITS, withSource: false };

export const SCC_PRESETS = [
  {
    id: "classic",
    label: "Three components",
    value: graphPreset("A->B, B->C, C->A, B->D, D->E, E->F, F->D, G->F, G->H, H->G", "", DIRECTED),
  },
  {
    id: "dag",
    label: "No cycles (every vertex alone)",
    value: graphPreset("A->B, A->C, B->D, C->D", "", DIRECTED),
  },
  {
    id: "one",
    label: "One big cycle",
    value: graphPreset("A->B, B->C, C->D, D->E, E->A, C->A", "", DIRECTED),
  },
];

/**
 * Kosaraju's algorithm: a DFS on G records finishing order; a second DFS on the
 * reversed graph, taking start vertices in decreasing finishing time, collects one
 * strongly connected component per search.
 */
export const kosaraju: AlgorithmModule<GraphInputValue, SccOutput> = {
  id: "kosaraju",
  version: 1,
  pseudocode: [
    "procedure Kosaraju(G)",
    "  for each vertex u, in id order: if u is unvisited: dfs1(u)",
    "  dfs1(u): mark u;  for each edge u → v: if v is unmarked: dfs1(v);  then push u onto F",
    "  Gᵀ ← G with every edge reversed",
    "  while F is not empty",
    "    u ← pop(F)   // the latest finisher first",
    "    if u has no component: dfs2(u, a new component c)",
    "  dfs2(u, c): comp[u] ← c;  for each edge u → v of Gᵀ: if v has no component: dfs2(v, c)",
  ],
  input: graphInput({ ...DIRECTED, presets: SCC_PRESETS }),

  run(input, t) {
    const traced = toTraceGraph(input);
    const G = t.graph("G", { ...traced, label: "Graph G (pass 1)" });
    const F = t.sequence("F", "stack", { label: "Finished vertices F" });
    const adj = adjacency(input);
    const ids = input.nodes.map((n) => n.id);
    const seen = new Set<string>();
    const finish: string[] = [];

    const dfs1 = (u: string) => {
      seen.add(u);
      G.node(u, "current", { line: 3, vars: { u }, note: `Visit ${u}.` });
      for (const { to: v, edge } of adj.get(u)!) {
        if (seen.has(v)) continue;
        G.edge(edge, "tree", { line: 3, note: `${v} is unvisited: go deeper along ${u}→${v}.` });
        G.node(u, "frontier", { line: 3 });
        dfs1(v);
        G.node(u, "current", { line: 3, vars: { u } });
      }
      finish.push(u);
      G.node(u, "visited", { line: 3 });
      G.annotate(u, `f${finish.length}`, { line: 3 });
      F.push(u, { line: 3, note: `${u} finishes ${ordinal(finish.length)}: push it onto F.` });
    };
    for (const u of [...ids].sort()) {
      if (!seen.has(u)) {
        t.step({ line: 2, vars: { u }, note: `${u} is unvisited: start a search.` });
        dfs1(u);
      }
    }

    const R = t.graph("R", {
      directed: true,
      label: "Reversed graph Gᵀ (pass 2)",
      nodes: traced.nodes,
      edges: traced.edges.map((e) => ({ id: edgeId(e.to, e.from), from: e.to, to: e.from })),
    });
    t.step({
      line: 4,
      vars: { u: null },
      note: "Reverse every edge. A component is the same in G and Gᵀ, but edges between components now point the other way.",
    });
    const radj = new Map(ids.map((id) => [id, [] as { to: string; edge: string }[]]));
    for (const e of input.edges) radj.get(e.to)!.push({ to: e.from, edge: edgeId(e.to, e.from) });
    for (const list of radj.values()) list.sort((a, b) => (a.to < b.to ? -1 : a.to > b.to ? 1 : 0));

    const comp = new Map<string, number>();
    const components: string[][] = [];
    const dfs2 = (u: string, c: number) => {
      comp.set(u, c);
      components[c]!.push(u);
      R.node(u, "visited", { line: 8 });
      R.annotate(u, `C${c + 1}`, { line: 8, note: `${u} joins component C${c + 1}.` });
      for (const { to: v, edge } of radj.get(u)!) {
        if (comp.has(v)) continue;
        R.edge(edge, "tree", { line: 8 });
        dfs2(v, c);
      }
    };
    const stack = [...finish];
    while (stack.length > 0) {
      const u = stack.pop()!;
      F.pop({ line: 6, vars: { u }, note: `Pop ${u}, the latest finisher still on F.` });
      if (comp.has(u)) {
        t.step({ line: 7, note: `${u} already belongs to C${comp.get(u)! + 1}.` });
        continue;
      }
      components.push([]);
      R.node(u, "current", {
        line: 7,
        note: `${u} starts component C${components.length}: everything it reaches in Gᵀ that is not yet assigned belongs with it.`,
      });
      dfs2(u, components.length - 1);
    }

    const output: SccOutput = { components };
    t.finish(input, output, {
      vars: { u: null },
      note: `${components.length} strongly connected component${components.length === 1 ? "" : "s"}, found in topological order of the component graph.`,
    });
    return output;
  },

  check: (input, out) => sccCheck(input, out, "topological"),
  fidelity: (state: TraceState, out) => sccFidelity(state, "R", out),
  describeOutput: describeComponents,
};

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]!);
}

export function describeComponents(out: SccOutput): string {
  return out.components.map((c, i) => `C${i + 1} = {${c.join(", ")}}`).join("; ");
}

/** Every vertex of graph `name` is annotated with its component "C<k>". */
export function sccFidelity(state: TraceState, name: string, out: SccOutput): string | null {
  const g = state.structures[name];
  if (g?.kind !== "graph") return `no graph ${name}`;
  for (const [i, c] of out.components.entries())
    for (const v of c)
      if (!g.annotations[v]?.startsWith(`C${i + 1}`))
        return `${v} shows ${g.annotations[v] ?? "nothing"}, expected C${i + 1}`;
  return null;
}
