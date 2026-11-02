import type { TraceState } from "@/engine/state";
import type { AlgorithmModule } from "../types";
import { edgeId, graphInput, graphPreset, toTraceGraph, type GraphInputValue } from "../inputs";
import { mstEdgesFidelity, spanningForestCheck } from "./common";

export interface MstOutput {
  /** Chosen edges as [from, to, weight], in the order they were added. */
  edges: [string, string, number][];
  total: number;
}

const LIMITS = { maxNodes: 20, maxEdges: 50, minWeight: -99, maxWeight: 99 };
const WEIGHTED = { directed: false, weighted: true, limits: LIMITS, withSource: false };

/**
 * Kruskal's algorithm: scan edges by increasing weight (ties in input order) and keep
 * an edge when its endpoints lie in different trees, tracked with union-find (union
 * by rank, path compression). Each vertex is annotated with its tree's representative.
 */
export const kruskal: AlgorithmModule<GraphInputValue, MstOutput> = {
  id: "kruskal",
  version: 1,
  pseudocode: [
    "procedure Kruskal(G)",
    "  sort the edges by weight",
    "  make-set(v) for every vertex v",
    "  for each edge (u, v) in sorted order",
    "    if find(u) ≠ find(v)   // different trees, so no cycle",
    "      add (u, v) to the forest;  union(u, v)",
    "    else skip (u, v)   // it would close a cycle",
    "  return the forest",
  ],
  input: graphInput({
    ...WEIGHTED,
    presets: [
      {
        id: "classic",
        label: "Seven-vertex network",
        value: graphPreset(
          "A-B:7, A-D:5, B-C:8, B-D:9, B-E:7, C-E:5, D-E:15, D-F:6, E-F:8, E-G:9, F-G:11",
          "",
          WEIGHTED,
        ),
      },
      {
        id: "ties",
        label: "Equal weights",
        value: graphPreset("A-B:1, B-C:1, C-D:1, D-A:1, A-C:1", "", WEIGHTED),
      },
      {
        id: "forest",
        label: "Disconnected (spanning forest)",
        value: graphPreset("A-B:3, B-C:1, A-C:2, D-E:4, E-F:-2, D-F:5", "", WEIGHTED),
      },
    ],
  }),

  run(input, t) {
    const G = t.graph("G", { ...toTraceGraph(input), label: "Graph" });
    const Q = t.sequence("Q", "queue", { label: "Edges by weight" });
    const sorted = input.edges
      .map((e, i) => ({ ...e, w: e.weight ?? 1, i }))
      .sort((a, b) => a.w - b.w || a.i - b.i);
    const label = (e: (typeof sorted)[number]) => `${e.from}-${e.to}:${e.w}`;

    for (const e of sorted) Q.push(label(e), { line: 2 });
    t.step({ line: 2, note: "Sort the edges by weight; equal weights keep their input order." });

    const parent = new Map(input.nodes.map((n) => [n.id, n.id]));
    const rank = new Map(input.nodes.map((n) => [n.id, 0]));
    const members = new Map(input.nodes.map((n) => [n.id, [n.id]]));
    for (const n of input.nodes) G.annotate(n.id, `∈${n.id}`, { line: 3 });
    t.step({ line: 3, note: "Every vertex starts as its own one-vertex tree." });

    const find = (x: string): string => {
      let r = x;
      while (parent.get(r) !== r) {
        t.tally("find steps");
        r = parent.get(r)!;
      }
      while (parent.get(x) !== r) {
        const next = parent.get(x)!;
        parent.set(x, r);
        x = next;
      }
      return r;
    };

    const edges: MstOutput["edges"] = [];
    let total = 0;
    for (const e of sorted) {
      const id = edgeId(e.from, e.to);
      Q.pop({ line: 4, vars: { u: e.from, v: e.to, w: e.w, ru: null, rv: null } });
      G.edge(id, "examining", {
        line: 4,
        note: `Next lightest edge: ${e.from}–${e.to} (weight ${e.w}).`,
      });
      const ru = find(e.from);
      const rv = find(e.to);
      t.tally("edge checks");
      if (ru === rv) {
        G.edge(id, "rejected", {
          line: 7,
          vars: { ru, rv },
          note: `${e.from} and ${e.to} are already in the same tree (∈${ru}); this edge would close a cycle.`,
        });
        continue;
      }
      let [big, small] = [ru, rv];
      if (rank.get(big)! < rank.get(small)!) [big, small] = [small, big];
      parent.set(small, big);
      if (rank.get(big) === rank.get(small)) rank.set(big, rank.get(big)! + 1);
      edges.push([e.from, e.to, e.w]);
      total += e.w;
      G.edge(id, "tree", {
        line: 6,
        vars: { ru, rv, total },
        note: `Different trees (∈${ru}, ∈${rv}): keep the edge. Forest weight is now ${total}.`,
      });
      const moved = members.get(small)!;
      for (const v of moved) {
        G.annotate(v, `∈${big}`, { line: 6 });
        G.node(v, "visited", { line: 6 });
      }
      for (const v of members.get(big)!) G.node(v, "visited", { line: 6 });
      members.get(big)!.push(...moved);
      members.delete(small);
    }

    const trees = members.size;
    const output: MstOutput = { edges, total };
    t.finish(input, output, {
      line: 8,
      vars: { u: null, v: null, w: null, ru: null, rv: null },
      note: `All edges scanned: ${edges.length} edges, total weight ${total}${
        trees > 1 ? `, spanning ${trees} separate components` : ""
      }.`,
    });
    return output;
  },

  check: (input, out) => spanningForestCheck(input, out, null),
  fidelity: (state: TraceState, out) => mstEdgesFidelity(state, out),
  describeOutput: (out) =>
    `Total weight ${out.total}: ${out.edges.map(([a, b, w]) => `${a}–${b} (${w})`).join(", ") || "no edges"}`,
};
